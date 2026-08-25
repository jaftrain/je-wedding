/* -----------------------------------------------------
   Mobile navigation toggle
   ----------------------------------------------------- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
let siteInitialized = false;

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve();

  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true });
  });
}

function waitForFonts() {
  if (!('fonts' in document) || !document.fonts?.ready) return Promise.resolve();
  return document.fonts.ready.catch(() => undefined);
}

async function startIntroAnimationsSmart() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('animations-ready');
    setupPartyScrollReveal();
    setupScheduleScrollReveal();
    return;
  }

  const startedAt = performance.now();
  const MIN_HOLD_MS = 220;
  const MAX_WAIT_MS = 2200;

  const readiness = Promise.allSettled([
    waitForWindowLoad(),
    waitForFonts()
  ]);

  await Promise.race([readiness, delay(MAX_WAIT_MS)]);

  const elapsed = performance.now() - startedAt;
  if (elapsed < MIN_HOLD_MS) {
    await delay(MIN_HOLD_MS - elapsed);
  }

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  document.body.classList.add('animations-ready');
  setupHeroScrollReveal();
  setupPartyScrollReveal();
  setupScheduleScrollReveal();
}

function initializeSite() {
  if (siteInitialized) return;
  siteInitialized = true;

  startIntroAnimationsSmart();

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  const navLinkItems = document.querySelectorAll('.nav-links a, .nav-links .nav-link-button');
  if (navLinkItems.length > 0) {
    navLinkItems.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  partyNameLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openPartyModal(link);
    });
  });

  if (partyModalClose) {
    partyModalClose.addEventListener('click', closePartyModal);
  }

  if (partyModal) {
    partyModal.addEventListener('click', (event) => {
      if (event.target === partyModal) {
        closePartyModal();
      }
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60);
}

/**
 * Toggle the mobile navigation menu open/closed.
 * Updates aria-expanded for accessibility.
 */
function toggleMobileMenu() {
  if (!navLinks || !menuToggle) return;

  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

/**
 * Close the mobile menu when a nav link is clicked.
 */
function closeMobileMenu() {
  if (!navLinks || !menuToggle) return;

  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

/* -----------------------------------------------------
   Home hero scroll reveal
   ----------------------------------------------------- */
function setupHeroScrollReveal() {
  const heroRevealItems = document.querySelectorAll('.hero-scroll-reveal');
  if (heroRevealItems.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    heroRevealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  heroRevealItems.forEach((item) => observer.observe(item));
}

/* -----------------------------------------------------
   Wedding party scroll reveal
   ----------------------------------------------------- */
function setupPartyScrollReveal() {
  const partyItems = document.querySelectorAll('.party-page .party-person:not(.party-person-empty)');
  if (partyItems.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    partyItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  partyItems.forEach((item) => observer.observe(item));
}

/* -----------------------------------------------------
   Schedule scroll reveal
   ----------------------------------------------------- */
function setupScheduleScrollReveal() {
  const scheduleItems = document.querySelectorAll('.schedule-page .schedule-event, .schedule-page .schedule-header-button');
  if (scheduleItems.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    scheduleItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  scheduleItems.forEach((item) => observer.observe(item));
}

/* -----------------------------------------------------
   Party bio modal
   ----------------------------------------------------- */
const partyModal = document.getElementById('party-modal');
const partyModalTitle = document.getElementById('party-modal-title');
const partyModalRole = document.getElementById('party-modal-role');
const partyModalBio = document.getElementById('party-modal-bio');
const partyModalClose = document.querySelector('.party-modal-close');
const partyNameLinks = document.querySelectorAll('.party-name-link');

function openPartyModal(link) {
  if (!partyModal || !partyModalTitle || !partyModalRole || !partyModalBio) return;

  partyModalTitle.textContent = link.dataset.name || 'Wedding Party';
  partyModalRole.textContent = link.dataset.role || 'Member';
  partyModalBio.textContent = link.dataset.bio || 'A warm and thoughtful member of the celebration.';
  partyModal.hidden = false;
  requestAnimationFrame(() => {
    partyModal.classList.add('is-open');
  });
}

function closePartyModal() {
  if (!partyModal) return;

  partyModal.classList.remove('is-open');
  window.setTimeout(() => {
    partyModal.hidden = true;
  }, 280);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && partyModal && !partyModal.hidden) {
    closePartyModal();
  }
});

/* -----------------------------------------------------
   Countdown timer
   ----------------------------------------------------- */
const countdownElement = document.getElementById('countdown');

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatCountdownUnit(value, singular, plural) {
  return value === 1 ? singular : plural;
}

function updateCountdown() {
  if (!countdownElement) return;

  const eventDate = new Date('2028-02-27T00:00:00');
  const now = new Date();

  if (now >= eventDate) {
    countdownElement.textContent = 'The day is here!';
    return;
  }

  let years = eventDate.getFullYear() - now.getFullYear();
  let months = eventDate.getMonth() - now.getMonth();
  let days = eventDate.getDate() - now.getDate();

  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    days += getDaysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const countdownParts = [
    `${years} ${formatCountdownUnit(years, 'year', 'years')}`,
    `${months} ${formatCountdownUnit(months, 'month', 'months')}`,
    `${days} ${formatCountdownUnit(days, 'day', 'days')}`
  ];

  countdownElement.innerHTML = `<span class="countdown-line">${countdownParts.join(', ')}</span>`;
}

if (document.documentElement.classList.contains('auth-locked')) {
  document.addEventListener('site:unlocked', initializeSite, { once: true });
} else {
  initializeSite();
}
