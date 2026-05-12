document.addEventListener('DOMContentLoaded', () => {
  const upload = document.querySelector('[data-upload-zone]');
  const input = document.querySelector('[data-upload-input]');
  const preview = document.querySelector('[data-upload-preview]');

  const showPreview = (file) => {
    if (!file || !preview) return;
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none');
  };

  upload?.addEventListener('click', () => input?.click());
  upload?.addEventListener('dragover', (event) => {
    event.preventDefault();
    upload.classList.add('is-dragover');
  });
  upload?.addEventListener('dragleave', () => upload.classList.remove('is-dragover'));
  upload?.addEventListener('drop', (event) => {
    event.preventDefault();
    upload.classList.remove('is-dragover');
    showPreview(event.dataTransfer.files[0]);
  });
  input?.addEventListener('change', () => showPreview(input.files[0]));

  document.querySelectorAll('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', () => AdminUI.showToast('Đã mở modal xác nhận xóa sản phẩm.', 'warning'));
  });
});
