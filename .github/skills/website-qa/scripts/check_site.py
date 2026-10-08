#!/usr/bin/env python3
"""Check local HTML and CSS references without third-party dependencies."""

from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


IGNORED_DIRS = {".git", "node_modules", "vendor", "dist", "build"}
CSS_URL = re.compile(r"""url\(\s*(['"]?)(.*?)\1\s*\)""", re.IGNORECASE)
CSS_IMPORT = re.compile(r"""@import\s+(['"])(.*?)\1""", re.IGNORECASE)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.duplicates: list[tuple[int, str]] = []
        self.references: list[tuple[int, str, str]] = []
        self.warnings: list[tuple[int, str]] = []
        self.has_title = False
        self.has_lang = False
        self.has_viewport = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        line = self.getpos()[0]
        element_id = values.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicates.append((line, element_id))
            self.ids.add(element_id)

        if tag == "html":
            self.has_lang = bool(values.get("lang"))
        elif tag == "title":
            self.has_title = True
        elif tag == "meta" and values.get("name", "").lower() == "viewport":
            self.has_viewport = True

        if tag == "img" and "alt" not in values:
            self.warnings.append((line, "image is missing an alt attribute"))

        if values.get("target", "").lower() == "_blank":
            rel = set((values.get("rel") or "").lower().split())
            if "noopener" not in rel and "noreferrer" not in rel:
                self.warnings.append((line, "target=_blank link should use rel=noopener"))

        for attribute in ("href", "src"):
            value = values.get(attribute)
            if value:
                self.references.append((line, tag, value.strip()))


def inside_ignored_directory(path: Path, root: Path) -> bool:
    return bool(IGNORED_DIRS.intersection(path.relative_to(root).parts))


def local_target(root: Path, source: Path, value: str) -> tuple[Path | None, str]:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return None, parsed.fragment
    path = unquote(parsed.path)
    if not path:
        return source, parsed.fragment
    if path.startswith("/"):
        return (root / path.lstrip("/")).resolve(), parsed.fragment
    return (source.parent / path).resolve(), parsed.fragment


def check_site(root: Path) -> tuple[list[str], list[str], int, int]:
    errors: list[str] = []
    warnings: list[str] = []
    pages = sorted(
        path for path in root.rglob("*.html")
        if not inside_ignored_directory(path, root)
    )
    stylesheets = sorted(
        path for path in root.rglob("*.css")
        if not inside_ignored_directory(path, root)
    )
    if not pages:
        return [f"{root}: no HTML pages found"], warnings, 0, len(stylesheets)

    parsers: dict[Path, PageParser] = {}
    for page in pages:
        parser = PageParser()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as error:
            errors.append(f"{page.relative_to(root)}: could not read HTML: {error}")
            continue
        parsers[page.resolve()] = parser
        relative = page.relative_to(root)
        for line, element_id in parser.duplicates:
            errors.append(f"{relative}:{line}: duplicate id {element_id!r}")
        if not parser.has_title:
            warnings.append(f"{relative}: missing <title>")
        if not parser.has_lang:
            warnings.append(f"{relative}: <html> is missing lang")
        if not parser.has_viewport:
            warnings.append(f"{relative}: missing viewport meta")
        for line, message in parser.warnings:
            warnings.append(f"{relative}:{line}: {message}")

    for page in pages:
        parser = parsers.get(page.resolve())
        if parser is None:
            continue
        for line, _tag, value in parser.references:
            target, fragment = local_target(root, page, value)
            if target is None:
                continue
            if not target.is_relative_to(root):
                errors.append(f"{page.relative_to(root)}:{line}: target escapes site root {value!r}")
                continue
            if not target.exists():
                errors.append(f"{page.relative_to(root)}:{line}: missing local target {value!r}")
                continue
            if fragment and target.suffix.lower() in {".html", ".htm"}:
                destination = parsers.get(target.resolve())
                if destination and fragment not in destination.ids:
                    errors.append(
                        f"{page.relative_to(root)}:{line}: missing fragment "
                        f"#{fragment} in {target.relative_to(root)}"
                    )

    for stylesheet in stylesheets:
        try:
            text = stylesheet.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            errors.append(f"{stylesheet.relative_to(root)}: could not read CSS: {error}")
            continue
        refs = [(match.start(), match.group(2).strip()) for match in CSS_URL.finditer(text)]
        refs.extend((match.start(), match.group(2).strip()) for match in CSS_IMPORT.finditer(text))
        for offset, value in refs:
            if not value:
                continue
            target, _fragment = local_target(root, stylesheet, value)
            if target is None or not urlsplit(value).path:
                continue
            if not target.is_relative_to(root):
                line = text.count("\n", 0, offset) + 1
                errors.append(
                    f"{stylesheet.relative_to(root)}:{line}: CSS asset escapes site root {value!r}"
                )
                continue
            if not target.exists():
                line = text.count("\n", 0, offset) + 1
                errors.append(
                    f"{stylesheet.relative_to(root)}:{line}: missing CSS asset {value!r}"
                )

    return errors, warnings, len(pages), len(stylesheets)


def main() -> int:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("root", nargs="?", type=Path, default=Path.cwd(), help="site root (default: current directory)")
    args = cli.parse_args()
    root = args.root.expanduser().resolve()
    if not root.is_dir():
        cli.error(f"site root is not a directory: {root}")

    errors, warnings, page_count, css_count = check_site(root)
    for message in errors:
        print(f"ERROR {message}")
    for message in warnings:
        print(f"WARN  {message}")
    print(
        f"Checked {page_count} HTML page(s) and {css_count} stylesheet(s): "
        f"{len(errors)} error(s), {len(warnings)} warning(s)."
    )
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
