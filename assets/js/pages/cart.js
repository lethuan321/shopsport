document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-cart-items]');
  const subtotal = document.querySelector('[data-cart-subtotal]');
  const total = document.querySelector('[data-cart-total]');

  if (!container) return;

  const render = () => {
    const cart = SportStore.read(SportStore.storage.cart);
    if (!cart.length) {
      container.innerHTML = '<div class="ds-empty"><div><div class="ds-empty__icon"><i class="bi bi-bag"></i></div><h2 class="h4">Giỏ hàng đang trống</h2><p>Thêm sản phẩm thể thao yêu thích để bắt đầu đặt hàng.</p><a class="ds-btn ds-btn--primary" href="shop.html">Mua sắm ngay</a></div></div>';
      if (subtotal) subtotal.textContent = '$0.00';
      if (total) total.textContent = '$0.00';
      return;
    }

    let sum = 0;
    container.innerHTML = cart.map((item) => {
      const product = SportStore.getProduct(item.id);
      sum += product.price * item.qty;
      return `
        <div class="cart-row p-3 mb-3" data-id="${item.id}">
          <div class="row align-items-center g-3">
            <div class="col-3 col-md-2"><img class="rounded-4" src="${product.image}" alt="${product.name}"></div>
            <div class="col-9 col-md-4"><h3 class="h6 fw-bold mb-1">${product.name}</h3><span class="text-secondary small">${product.category}</span></div>
            <div class="col-6 col-md-2 fw-bold">${SportStore.formatPrice(product.price)}</div>
            <div class="col-6 col-md-2"><div class="quantity-control"><button data-qty="-1" type="button">-</button><input value="${item.qty}" readonly><button data-qty="1" type="button">+</button></div></div>
            <div class="col-12 col-md-2 text-md-end"><button class="icon-btn ms-md-auto" data-remove type="button"><i class="bi bi-trash"></i></button></div>
          </div>
        </div>`;
    }).join('');
    if (subtotal) subtotal.textContent = SportStore.formatPrice(sum);
    if (total) total.textContent = SportStore.formatPrice(sum + 8);
    SportStore.updateBadges();
  };

  container.addEventListener('click', (event) => {
    const row = event.target.closest('[data-id]');
    if (!row) return;
    let cart = SportStore.read(SportStore.storage.cart);
    const id = Number(row.dataset.id);
    if (event.target.closest('[data-remove]')) {
      cart = cart.filter((item) => item.id !== id);
    }
    const qtyButton = event.target.closest('[data-qty]');
    if (qtyButton) {
      cart = cart.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + Number(qtyButton.dataset.qty)) } : item);
    }
    SportStore.write(SportStore.storage.cart, cart);
    render();
  });

  render();
});


