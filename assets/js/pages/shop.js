document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-shop-grid]');
  const search = document.querySelector('[data-search]');
  const category = document.querySelector('[data-category]');
  const sort = document.querySelector('[data-sort]');

  if (!grid) return;

  const render = () => {
    let items = [...SportStore.products];
    const term = (search?.value || '').trim().toLowerCase();
    const cat = category?.value || 'all';

    if (term) items = items.filter((product) => product.name.toLowerCase().includes(term));
    if (cat !== 'all') items = items.filter((product) => product.category === cat);
    if (sort?.value === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort?.value === 'price-desc') items.sort((a, b) => b.price - a.price);
    if (sort?.value === 'rating') items.sort((a, b) => b.rating - a.rating);

    grid.innerHTML = items.length
      ? items.map(SportStore.productCard).join('')
      : '<div class="col-12"><div class="ds-empty"><div><div class="ds-empty__icon"><i class="bi bi-search"></i></div><h2 class="h4">Không tìm thấy sản phẩm</h2><p>Hãy thử từ khóa khác hoặc bỏ bớt bộ lọc.</p><a class="ds-btn ds-btn--primary" href="shop.html">Xem tất cả sản phẩm</a></div></div></div>';
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete) img.classList.add('is-loaded');
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    });
    if (window.AOS) AOS.refreshHard();
  };

  [search, category, sort].forEach((input) => input?.addEventListener('input', render));
  // Wait for async product load before first render
  SportStore.productsReady.then(render);
});


