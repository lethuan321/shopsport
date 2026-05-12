document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-export]').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.add('ds-button-loading');
      AdminUI.showToast('Đã chuẩn bị file xuất dữ liệu.', 'success');
      setTimeout(() => button.classList.remove('ds-button-loading'), 900);
    });
  });
  document.querySelectorAll('.admin-table tbody tr').forEach((row) => {
    row.addEventListener('dblclick', () => {
      const link = row.querySelector('a[href]');
      if (link) location.href = link.href;
    });
  });
});
