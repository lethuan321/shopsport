document.addEventListener('DOMContentLoaded', () => {
  AuthUI.initBase();
  document.querySelector('[data-resend-email]')?.addEventListener('click', () => {
    AuthUI.showToast('Email xác minh đã được gửi lại.', 'primary');
  });
});
