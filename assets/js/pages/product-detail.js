document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const title = document.querySelector('[data-detail-title]');
  const category = document.querySelector('[data-detail-category]');
  const price = document.querySelector('[data-detail-price]');
  const rating = document.querySelector('[data-detail-rating]');
  const add = document.querySelector('[data-detail-add]');
  const wishlist = document.querySelector('[data-detail-wishlist]');
  const mainImage = document.querySelector('[data-gallery-main]');
  const thumbs = document.querySelector('[data-gallery-thumbs]');

  const renderNotFound = () => {
    if (title) title.textContent = 'Sản phẩm không tồn tại';
    if (category) category.textContent = '—';
    if (price) price.textContent = '$0.00';
    if (rating) rating.textContent = '—';

    if (add) {
      add.disabled = true;
      add.dataset.addCart = '';
    }
    if (wishlist) {
      wishlist.disabled = true;
      wishlist.dataset.wishlist = '';
    }
  };

  const init = async () => {
    try {
      if (!window.SportStore) {
        console.warn('[product-detail] SportStore is not ready');
        renderNotFound();
        return;
      }

      // Chờ productsReady (an toàn khi script load order thay đổi)
      await window.SportStore.productsReady;

      const id = params.get('id');
      const product = id ? window.SportStore.getProduct(id) : window.SportStore.getProduct(1);
      if (!product || !product.id || !product.name) {
        console.warn('[product-detail] product not found', { id, product });
        renderNotFound();
        return;
      }

      const gallery = [
        product.image,
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=82',
        'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=82',
        'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=900&q=82'
      ];

      if (title) title.textContent = product.name ?? '';
      if (category) category.textContent = product.category ?? '';
      if (price) price.textContent = window.SportStore.formatPrice(product.price ?? 0);
      if (rating) rating.textContent = product.rating ?? '';

      if (add) add.dataset.addCart = String(product.id);
      if (wishlist) wishlist.dataset.wishlist = String(product.id);

      if (mainImage) {
        mainImage.src = gallery[0] || '';
        mainImage.alt = product.name ?? 'Sản phẩm';
      }

      if (thumbs) {
        thumbs.innerHTML = gallery.map((src, index) => `
          <button class="gallery__thumb ${index === 0 ? 'is-active' : ''}" type="button" data-src="${src}">
            <img src="${src}" alt="${product.name} góc xem ${index + 1}">
          </button>
        `).join('');

        // Event delegation (không cần init lại listener nhiều lần)
        thumbs.onclick = (event) => {
          const thumb = event.target?.closest?.('[data-src]');
          if (!thumb || !mainImage) return;

          thumbs.querySelectorAll('.gallery__thumb').forEach((item) => item.classList.remove('is-active'));
          thumb.classList.add('is-active');
          mainImage.classList.remove('is-loaded');
          mainImage.src = thumb.dataset.src || '';
        };
      }
    } catch (err) {
      console.warn('[product-detail] init failed', err);
      renderNotFound();
    }
  };

  init();
});
