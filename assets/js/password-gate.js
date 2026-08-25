(function () {
  const AUTH_KEY = 'jeWeddingAuthV1';
  const ATTEMPT_KEY = 'jeWeddingAttemptStateV1';
  const PASSWORD = 'wedding2028';
  const MAX_ATTEMPTS = 10;
  const LOCKOUT_MS = 60 * 60 * 1000;

  let failedAttempts = 0;
  let overlayElement = null;
  let lockoutTimerId = null;
  let lockedScrollY = 0;
  let removeScrollBlockers = null;

  function isAuthenticated() {
    return window.localStorage.getItem(AUTH_KEY) === '1';
  }

  function lockPage() {
    document.documentElement.classList.add('auth-locked');
    if (document.body) {
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.classList.add('auth-locked');
      document.body.style.top = `-${lockedScrollY}px`;
    }
  }

  function unlockPage() {
    document.documentElement.classList.remove('auth-locked');

    if (removeScrollBlockers) {
      removeScrollBlockers();
      removeScrollBlockers = null;
    }

    if (document.body) {
      const bodyTop = document.body.style.top;
      document.body.classList.remove('auth-locked');
      document.body.style.top = '';

      const restoredScrollY = bodyTop ? Math.abs(parseInt(bodyTop, 10)) : lockedScrollY;
      window.scrollTo(0, Number.isFinite(restoredScrollY) ? restoredScrollY : 0);
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

  function getNow() {
    return Date.now();
  }

  function readAttemptState() {
    try {
      const raw = window.localStorage.getItem(ATTEMPT_KEY);
      if (!raw) {
        return {
          count: 0,
          windowStartedAt: 0,
          lockedUntil: 0
        };
      }

      const parsed = JSON.parse(raw);
      return {
        count: Number(parsed.count) || 0,
        windowStartedAt: Number(parsed.windowStartedAt) || 0,
        lockedUntil: Number(parsed.lockedUntil) || 0
      };
    } catch (_error) {
      return {
        count: 0,
        windowStartedAt: 0,
        lockedUntil: 0
      };
    }
  }

  function writeAttemptState(state) {
    window.localStorage.setItem(ATTEMPT_KEY, JSON.stringify(state));
  }

  function clearAttemptState() {
    window.localStorage.removeItem(ATTEMPT_KEY);
    failedAttempts = 0;
  }

  function getNormalizedAttemptState(now) {
    const state = readAttemptState();
    const isLockoutExpired = state.lockedUntil > 0 && now >= state.lockedUntil;
    const isWindowExpired = state.windowStartedAt > 0 && now - state.windowStartedAt >= LOCKOUT_MS;

    if (isLockoutExpired || isWindowExpired) {
      const resetState = {
        count: 0,
        windowStartedAt: 0,
        lockedUntil: 0
      };
      writeAttemptState(resetState);
      return resetState;
    }

    return state;
  }

  function formatRemainingLockout(ms) {
    const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes <= 0) {
      return `${seconds}s`;
    }

    if (seconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
  }

  function applyLockoutUi(passwordInput, submitButton, state) {
    if (lockoutTimerId) {
      window.clearTimeout(lockoutTimerId);
      lockoutTimerId = null;
    }

    const now = getNow();
    const remainingMs = state.lockedUntil - now;

    if (remainingMs <= 0) {
      passwordInput.disabled = false;
      submitButton.disabled = false;
      setError('');
      return;
    }

    passwordInput.disabled = true;
    submitButton.disabled = true;
    setError(`Too many password attempts. Try again in 1 hour.`);

    lockoutTimerId = window.setTimeout(() => {
      const refreshed = getNormalizedAttemptState(getNow());
      if (refreshed.lockedUntil > getNow()) {
        applyLockoutUi(passwordInput, submitButton, refreshed);
        return;
      }

      passwordInput.disabled = false;
      submitButton.disabled = false;
      setError('');
      passwordInput.focus();
    }, Math.min(remainingMs + 80, LOCKOUT_MS));
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

    const blockScroll = (event) => {
      event.preventDefault();
    };

    document.addEventListener('wheel', blockScroll, { passive: false });
    document.addEventListener('touchmove', blockScroll, { passive: false });
    removeScrollBlockers = () => {
      document.removeEventListener('wheel', blockScroll);
      document.removeEventListener('touchmove', blockScroll);
    };

    const form = overlayElement.querySelector('.password-gate-form');
    const passwordInput = overlayElement.querySelector('#password-gate-input');
    const submitButton = overlayElement.querySelector('button[type="submit"]');

    if (!form || !passwordInput || !submitButton) return;

    const initialAttemptState = getNormalizedAttemptState(getNow());
    if (initialAttemptState.lockedUntil > getNow()) {
      applyLockoutUi(passwordInput, submitButton, initialAttemptState);
    }

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
      const now = getNow();
      const currentAttemptState = getNormalizedAttemptState(now);

      if (currentAttemptState.lockedUntil > now) {
        applyLockoutUi(passwordInput, submitButton, currentAttemptState);
        return;
      }

      const candidate = String(passwordInput.value || '');

      if (candidate === PASSWORD) {
        window.localStorage.setItem(AUTH_KEY, '1');
        failedAttempts = 0;
        clearAttemptState();
        passwordInput.value = '';
        setError('');
        unlockPage();
        return;
      }

      failedAttempts += 1;
      const retryDelayMs = Math.min(1500, failedAttempts * 300);

      let nextCount = currentAttemptState.count;
      let windowStartedAt = currentAttemptState.windowStartedAt;
      if (!windowStartedAt) {
        windowStartedAt = now;
      }
      nextCount += 1;

      const nextState = {
        count: nextCount,
        windowStartedAt,
        lockedUntil: 0
      };

      if (nextCount >= MAX_ATTEMPTS) {
        nextState.lockedUntil = now + LOCKOUT_MS;
      }

      writeAttemptState(nextState);

      submitButton.disabled = true;
      if (nextState.lockedUntil > 0) {
        applyLockoutUi(passwordInput, submitButton, nextState);
      } else {
        const attemptsRemaining = MAX_ATTEMPTS - nextCount;
        setError(`Incorrect password. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`);
      }
      window.setTimeout(() => {
        const stateAfterDelay = getNormalizedAttemptState(getNow());
        if (stateAfterDelay.lockedUntil > getNow()) return;
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
    if (event.key !== AUTH_KEY && event.key !== ATTEMPT_KEY) return;
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
