document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-wishlist-grid]');
  if (!grid) return;

  const ids = SportStore.read(SportStore.storage.wishlist);
  const items = ids.map(SportStore.getProduct).filter(Boolean);
  grid.innerHTML = items.length
    ? items.map(SportStore.productCard).join('')
    : '<div class="col-12"><div class="ds-empty"><div><div class="ds-empty__icon"><i class="bi bi-heart"></i></div><h2 class="h4">Danh sách yêu thích đang trống</h2><p>Hãy khám phá và lưu sản phẩm bạn thích để xem lại nhanh hơn.</p><a class="ds-btn ds-btn--primary" href="shop.html">Khám phá sản phẩm</a></div></div></div>';

  if (window.AOS) AOS.refreshHard();
});


