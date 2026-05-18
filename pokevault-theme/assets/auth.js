document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.auth-tabs__content');
  const toggleButtons = document.querySelectorAll('[data-toggle-tab]');

  // Tab switching via buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', switchTab);
  });

  // Toggle tab from links
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.dataset.toggleTab;
      const targetBtn = document.querySelector(`[data-tab="${tabName}"][role="tab"]`);
      if (targetBtn) switchTab({ target: targetBtn });
    });
  });

  function switchTab(e) {
    const tabName = e.target.dataset.tab;
    if (!tabName) return;

    // Hide all
    tabContents.forEach(content => {
      content.style.display = 'none';
      content.classList.remove('active');
    });
    tabButtons.forEach(btn => {
      btn.classList.remove('auth-tabs__item--active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Show active
    const activeContent = document.querySelector(`[data-tab="${tabName}"].auth-tabs__content`);
    const activeBtn = document.querySelector(`[data-tab="${tabName}"][role="tab"]`);

    if (activeContent) {
      activeContent.style.display = 'block';
      activeContent.classList.add('active');
    }
    if (activeBtn) {
      activeBtn.classList.add('auth-tabs__item--active');
      activeBtn.setAttribute('aria-selected', 'true');
    }

    // Focus first input
    const firstInput = activeContent?.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  // Form validation
  validateForms();
});

function validateForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const emailInputs = form.querySelectorAll('input[type="email"]');
      const passwordInputs = form.querySelectorAll('input[type="password"]');

      let isValid = true;

      // Email validation
      emailInputs.forEach(input => {
        clearErrorMessages(input);
        if (!isValidEmail(input.value.trim())) {
          e.preventDefault();
          showError(input, 'Email invalide');
          isValid = false;
        }
      });

      // Password validation
      passwordInputs.forEach(input => {
        clearErrorMessages(input);
        if (input.value.length < 6) {
          e.preventDefault();
          showError(input, 'Minimum 6 caractères');
          isValid = false;
        }
      });
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  input.classList.add('form-input--error');
  const errorDiv = document.createElement('span');
  errorDiv.className = 'form-error-inline';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);

  // Remove error on focus
  input.addEventListener('focus', () => {
    clearErrorMessages(input);
  }, { once: true });
}

function clearErrorMessages(input) {
  input.classList.remove('form-input--error');
  const existingError = input.parentNode.querySelector('.form-error-inline');
  if (existingError) existingError.remove();
}
