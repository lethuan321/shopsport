document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-user-action]').forEach((button) => {
    button.addEventListener('click', () => AdminUI.showToast('Đã cập nhật trạng thái người dùng.', 'primary'));
  });
  document.querySelectorAll('#usersTable tbody tr').forEach((row) => {
    row.addEventListener('click', (event) => {
      if (event.target.closest('a,button,input')) return;
      row.classList.toggle('is-selected');
    });
  });
});
