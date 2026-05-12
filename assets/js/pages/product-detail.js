document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const product = SportStore.getProduct(params.get('id') || 1);
  const title = document.querySelector('[data-detail-title]');
  const category = document.querySelector('[data-detail-category]');
  const price = document.querySelector('[data-detail-price]');
  const rating = document.querySelector('[data-detail-rating]');
  const add = document.querySelector('[data-detail-add]');
  const wishlist = document.querySelector('[data-detail-wishlist]');
  const mainImage = document.querySelector('[data-gallery-main]');
  const thumbs = document.querySelector('[data-gallery-thumbs]');

  const gallery = [
    product.image,
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=82',
    'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=900&q=82'
  ];

  if (title) title.textContent = product.name;
  if (category) category.textContent = product.category;
  if (price) price.textContent = SportStore.formatPrice(product.price);
  if (rating) rating.textContent = product.rating;
  if (add) add.dataset.addCart = product.id;
  if (wishlist) wishlist.dataset.wishlist = product.id;
  if (mainImage) {
    mainImage.src = gallery[0];
    mainImage.alt = product.name;
  }
  if (thumbs) {
    thumbs.innerHTML = gallery.map((src, index) => `
      <button class="gallery__thumb ${index === 0 ? 'is-active' : ''}" type="button" data-src="${src}">
        <img src="${src}" alt="${product.name} góc xem ${index + 1}">
      </button>
    `).join('');
    thumbs.addEventListener('click', (event) => {
      const thumb = event.target.closest('[data-src]');
      if (!thumb || !mainImage) return;
      thumbs.querySelectorAll('.gallery__thumb').forEach((item) => item.classList.remove('is-active'));
      thumb.classList.add('is-active');
      mainImage.classList.remove('is-loaded');
      mainImage.src = thumb.dataset.src;
    });
  }
});


