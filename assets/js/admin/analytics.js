document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-export-report]').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.add('ds-button-loading');
      AdminUI.showToast('Báo cáo đang được xuất.', 'success');
      setTimeout(() => button.classList.remove('ds-button-loading'), 900);
    });
  });
  document.querySelectorAll('.analytics-summary .admin-card').forEach((card) => {
    card.addEventListener('mouseenter', () => card.setAttribute('data-active', 'true'));
    card.addEventListener('mouseleave', () => card.removeAttribute('data-active'));
  });
});
