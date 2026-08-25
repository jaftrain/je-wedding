(function () {
  const AUTH_KEY = 'jeWeddingAuthV1';
  const PASSWORD = 'foobar';

  let failedAttempts = 0;
  let overlayElement = null;

  function isAuthenticated() {
    return window.localStorage.getItem(AUTH_KEY) === '1';
  }

  function lockPage() {
    document.documentElement.classList.add('auth-locked');
    if (document.body) {
      document.body.classList.add('auth-locked');
    }
  }

  function unlockPage() {
    document.documentElement.classList.remove('auth-locked');
    if (document.body) {
      document.body.classList.remove('auth-locked');
    }

    if (overlayElement) {
      overlayElement.remove();
      overlayElement = null;
    }

    document.dispatchEvent(new CustomEvent('site:unlocked'));
  }

  function setError(message) {
    if (!overlayElement) return;

    const errorNode = overlayElement.querySelector('[data-gate-error]');
    if (errorNode) {
      errorNode.textContent = message;
    }
  }

  function mountOverlay() {
    if (!document.body || overlayElement) return;

    overlayElement = document.createElement('div');
    overlayElement.className = 'password-gate-overlay';
    overlayElement.innerHTML = [
      '<div class="password-gate-dialog" role="dialog" aria-modal="true" aria-labelledby="password-gate-title">',
      '  <h1 id="password-gate-title">Private Wedding Site</h1>',
      '  <p>Please enter the password to view this website.</p>',
      '  <form class="password-gate-form" novalidate>',
      '    <label for="password-gate-input">Password</label>',
      '    <input id="password-gate-input" name="password" type="password" autocomplete="current-password" required />',
      '    <button type="submit">Enter</button>',
      '    <p class="password-gate-error" data-gate-error aria-live="polite"></p>',
      '  </form>',
      '</div>'
    ].join('');

    document.body.appendChild(overlayElement);

    const form = overlayElement.querySelector('.password-gate-form');
    const passwordInput = overlayElement.querySelector('#password-gate-input');
    const submitButton = overlayElement.querySelector('button[type="submit"]');

    if (!form || !passwordInput || !submitButton) return;

    const focusables = () => overlayElement.querySelectorAll('input, button');

    overlayElement.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;

      const nodes = focusables();
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const candidate = String(passwordInput.value || '');

      if (candidate === PASSWORD) {
        window.localStorage.setItem(AUTH_KEY, '1');
        failedAttempts = 0;
        passwordInput.value = '';
        setError('');
        unlockPage();
        return;
      }

      failedAttempts += 1;
      const retryDelayMs = Math.min(1500, failedAttempts * 300);

      submitButton.disabled = true;
      setError('Incorrect password. Please try again.');
      window.setTimeout(() => {
        submitButton.disabled = false;
      }, retryDelayMs);
      passwordInput.focus();
      passwordInput.select();
    });

    requestAnimationFrame(() => {
      passwordInput.focus();
    });
  }

  function ensureLogoutControl() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks || navLinks.querySelector('.nav-link-button')) return;

    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'nav-link-button';
    logoutButton.textContent = 'Logout';

    logoutButton.addEventListener('click', () => {
      window.localStorage.removeItem(AUTH_KEY);
      failedAttempts = 0;
      setError('');
      lockPage();
      mountOverlay();
    });

    navLinks.appendChild(logoutButton);
  }

  function enforceGate() {
    ensureLogoutControl();

    if (isAuthenticated()) {
      unlockPage();
      return;
    }

    lockPage();
    mountOverlay();
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== AUTH_KEY) return;
    enforceGate();
  });

  window.addEventListener('pageshow', () => {
    enforceGate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceGate, { once: true });
  } else {
    enforceGate();
  }
})();
