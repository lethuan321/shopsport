document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-save-settings]').forEach((button) => {
    button.addEventListener('click', () => AdminUI.showToast('Đã lưu thiết lập.', 'success'));
  });
  document.querySelectorAll('input[type="checkbox"]').forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const label = toggle.closest('label')?.textContent.trim() || 'Thiết lập';
      AdminUI.showToast(`${label} đã ${toggle.checked ? 'bật' : 'tắt'}.`, 'primary');
    });
  });
});
