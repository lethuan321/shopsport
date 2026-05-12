document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-mark-read]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.admin-badge').forEach((badge) => {
        if (badge.textContent.includes('Đơn hàng') || badge.textContent.includes('Kho hàng')) badge.classList.add('admin-badge--success');
      });
      AdminUI.showToast('Đã đánh dấu tất cả thông báo là đã đọc.', 'success');
    });
  });
});
