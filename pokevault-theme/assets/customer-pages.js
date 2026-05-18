document.addEventListener('DOMContentLoaded', () => {
  const customerPage = document.querySelector('.customer');
  if (!customerPage) return;

  // Animate page on load
  const forms = customerPage.querySelectorAll('form');
  forms.forEach(form => {
    form.style.animation = 'fadeInUp 0.6s ease-out';
  });

  // Focus first input
  const firstInput = customerPage.querySelector('input:not([type="hidden"])');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }

  // Clear error message on input
  const inputs = customerPage.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const errorMsg = input.nextElementSibling;
      if (errorMsg && errorMsg.classList && errorMsg.classList.contains('form__input-error')) {
        errorMsg.style.display = 'none';
      }
    });
  });

  // Add animation keyframes if not present
  if (!document.getElementById('customer-animations')) {
    const style = document.createElement('style');
    style.id = 'customer-animations';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
});
