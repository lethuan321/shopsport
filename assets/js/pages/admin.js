document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-admin-products]').forEach((table) => {
    table.innerHTML = SportStore.products.map((product) => `
      <tr>
        <td><img class="rounded-3" width="64" height="64" src="${product.image}" alt="${product.name}"></td>
        <td class="fw-bold">${product.name}</td>
        <td>${product.category}</td>
        <td>${SportStore.formatPrice(product.price)}</td>
        <td><span class="badge text-bg-success">Đang bán</span></td>
      </tr>
    `).join('');
  });
});


