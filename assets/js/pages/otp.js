document.addEventListener('DOMContentLoaded', () => {
  AuthUI.attachRipple();
  const form = document.querySelector('[data-otp-form]');
  const inputs = [...document.querySelectorAll('[data-otp-input]')];
  const timer = document.querySelector('[data-otp-timer]');
  const resend = document.querySelector('[data-resend-otp]');
  let seconds = 60;

  const renderTimer = () => {
    if (!timer) return;
    timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    if (resend) resend.disabled = seconds > 0;
  };

  const startTimer = () => {
    seconds = 60;
    renderTimer();
    const interval = setInterval(() => {
      seconds -= 1;
      renderTimer();
      if (seconds <= 0) clearInterval(interval);
    }, 1000);
  };

  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && inputs[index + 1]) inputs[index + 1].focus();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && inputs[index - 1]) inputs[index - 1].focus();
    });
    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const code = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      code.split('').forEach((char, charIndex) => {
        if (inputs[charIndex]) inputs[charIndex].value = char;
      });
      inputs[Math.min(code.length, 5)]?.focus();
    });
  });

  resend?.addEventListener('click', () => {
    startTimer();
    AuthUI.showToast('Mã OTP mới đã được gửi.', 'primary');
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = inputs.map((input) => input.value).join('');
    if (code.length !== 6) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 450);
      AuthUI.showToast('Vui lòng nhập đủ 6 chữ số OTP.', 'warning');
      return;
    }
    AuthUI.showToast('Xác minh OTP thành công.', 'success');
  });

  startTimer();
});
