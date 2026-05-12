document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 620, once: true, offset: 60 });
  document.querySelectorAll('.admin-card').forEach((card, index) => {
    card.style.animationDelay = `${Math.min(index * 35, 240)}ms`;
    card.classList.add('fade-up');
  });
  document.querySelectorAll('[data-refresh-dashboard]').forEach((button) => {
    button.addEventListener('click', () => {
      AdminUI.showToast('Dashboard đã được làm mới.', 'success');
      document.querySelectorAll('[data-admin-counter]').forEach((counter) => {
        counter.classList.add('cart-pop');
        setTimeout(() => counter.classList.remove('cart-pop'), 500);
      });
    });
  });
});
