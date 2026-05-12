document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-table-search]').forEach((input) => {
    const table = document.querySelector(input.dataset.tableSearch);
    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      table?.querySelectorAll('tbody tr').forEach((row) => {
        row.hidden = !row.textContent.toLowerCase().includes(term);
      });
    });
  });

  document.querySelectorAll('[data-bulk-check]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      document.querySelectorAll('[data-row-check]').forEach((item) => { item.checked = checkbox.checked; });
    });
  });
});
