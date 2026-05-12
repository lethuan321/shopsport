const AuthUI = (() => {
  const showToast = (message, tone = 'primary') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast align-items-center border-0 text-bg-${tone}`;
    toast.innerHTML = `<div class="d-flex"><div class="toast-body fw-semibold">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Đóng"></button></div>`;
    container.appendChild(toast);
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 2200 }).show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  };

  const attachRipple = () => {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.auth-btn');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  };

  const attachPasswordToggle = () => {
    document.querySelectorAll('[data-password-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const input = document.querySelector(button.dataset.passwordToggle);
        if (!input) return;
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.innerHTML = `<i class="bi bi-eye${visible ? '' : '-slash'}"></i>`;
      });
    });
  };

  const validateEmail = (input) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    input.classList.toggle('is-valid', valid);
    input.classList.toggle('is-invalid', input.value.length > 0 && !valid);
    return valid;
  };

  const strengthScore = (value) => {
    let score = 0;
    if (value.length >= 8) score += 25;
    if (/[A-Z]/.test(value)) score += 25;
    if (/[0-9]/.test(value)) score += 25;
    if (/[^A-Za-z0-9]/.test(value)) score += 25;
    return score;
  };

  const updateStrength = (input, bar, text) => {
    const score = strengthScore(input.value);
    bar.style.width = `${score}%`;
    bar.style.background = score < 50 ? '#f97316' : score < 75 ? '#38bdf8' : '#22c55e';
    if (text) text.textContent = score < 50 ? 'Mật khẩu yếu' : score < 75 ? 'Mật khẩu khá' : 'Mật khẩu mạnh';
    return score;
  };

  const markRequired = (form) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const ok = input.type === 'checkbox' ? input.checked : input.value.trim().length > 0;
      input.classList.toggle('is-valid', ok && input.type !== 'checkbox');
      input.classList.toggle('is-invalid', !ok && input.type !== 'checkbox');
      valid = valid && ok;
    });
    return valid;
  };

  const remember = {
    load() {
      const email = localStorage.getItem('sport-store-remember-email');
      const input = document.querySelector('[data-login-email]');
      const checkbox = document.querySelector('[data-remember]');
      if (email && input && checkbox) {
        input.value = email;
        checkbox.checked = true;
      }
    },
    save() {
      const input = document.querySelector('[data-login-email]');
      const checkbox = document.querySelector('[data-remember]');
      if (!input || !checkbox) return;
      if (checkbox.checked) localStorage.setItem('sport-store-remember-email', input.value.trim());
      else localStorage.removeItem('sport-store-remember-email');
    }
  };

  const initBase = () => {
    attachRipple();
    attachPasswordToggle();
  };

  return { showToast, validateEmail, updateStrength, markRequired, remember, initBase };
})();
