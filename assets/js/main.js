/* -----------------------------------------------------
   Mobile navigation toggle
   ----------------------------------------------------- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

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

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu);
}

const navLinkItems = document.querySelectorAll('.nav-links a');
if (navLinkItems.length > 0) {
  navLinkItems.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

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

updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60);
