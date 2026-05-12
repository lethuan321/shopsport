const SportStore = (() => {
  const storage = {
    cart: 'sport-store-cart',
    wishlist: 'sport-store-wishlist',
    theme: 'sport-store-theme'
  };

  // Inline fallback – used when fetch is blocked (e.g. file:// protocol)
  const PRODUCTS_FALLBACK = [
    { id: 1,  name: 'Giày Nike AeroSwift Runner',       category: 'Giày',       price: 129, oldPrice: 169, rating: 4.9, badge: '-24%', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82' },
    { id: 2,  name: 'Áo hoodie Adidas Training',        category: 'Trang phục', price: 74,  oldPrice: 99,  rating: 4.8, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=82' },
    { id: 3,  name: 'Găng tay tập Puma Flex',           category: 'Phụ kiện',  price: 32,  oldPrice: 45,  rating: 4.7, badge: 'New',  image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=82' },
    { id: 4,  name: 'Bóng đá Pro League',               category: 'Thiết bị',  price: 54,  oldPrice: 70,  rating: 4.8, badge: 'Sale', image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=900&q=82' },
    { id: 5,  name: 'Giày Adidas Ultraboost 22',        category: 'Giày',       price: 149, oldPrice: 189, rating: 4.9, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=82' },
    { id: 6,  name: 'Giày Puma Ignite Run',             category: 'Giày',       price: 119, oldPrice: 149, rating: 4.7, badge: 'New',  image: 'https://images.pexels.com/photos/19577864/pexels-photo-19577864.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 7,  name: 'Giày Nike Air Zoom Pegasus',       category: 'Giày',       price: 139, oldPrice: 175, rating: 4.8, badge: 'Sale', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=82' },
    { id: 8,  name: 'Áo thun Adidas Running',           category: 'Trang phục', price: 39,  oldPrice: 55,  rating: 4.6, badge: 'Hot',  image: 'https://images.pexels.com/photos/30495987/pexels-photo-30495987.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 9,  name: 'Áo tank top Nike Pro',             category: 'Trang phục', price: 34,  oldPrice: 49,  rating: 4.7, badge: 'New',  image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=82' },
    { id: 10, name: 'Áo hoodie Puma Sport',             category: 'Trang phục', price: 69,  oldPrice: 89,  rating: 4.8, badge: 'Sale', image: 'https://images.pexels.com/photos/28468584/pexels-photo-28468584.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 11, name: 'Găng tay Gym Pro Fit',             category: 'Phụ kiện',  price: 25,  oldPrice: 35,  rating: 4.5, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1598971639145-2f7d8c1a2a1c?auto=format&fit=crop&w=900&q=82' },
    { id: 12, name: 'Bình nước thể thao HydroPro',      category: 'Phụ kiện',  price: 18,  oldPrice: 25,  rating: 4.6, badge: 'Eco',  image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=82' },
    { id: 13, name: 'Dây nhảy tốc độ Pro Jump',         category: 'Phụ kiện',  price: 15,  oldPrice: 22,  rating: 4.4, badge: 'New',  image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=82' },
    { id: 14, name: 'Bóng rổ Spalding Match',           category: 'Thiết bị',  price: 59,  oldPrice: 75,  rating: 4.8, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=82' },
    { id: 15, name: 'Bóng đá Adidas Pro League',        category: 'Thiết bị',  price: 49,  oldPrice: 65,  rating: 4.7, badge: 'Sale', image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=900&q=82' },
    { id: 16, name: 'Tạ tay Adjustable Dumbbell',       category: 'Thiết bị',  price: 89,  oldPrice: 120, rating: 4.9, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=82' },
    { id: 17, name: 'Giày Reebok Nano X',               category: 'Giày',       price: 135, oldPrice: 170, rating: 4.8, badge: 'New',  image: 'https://images.pexels.com/photos/19577862/pexels-photo-19577862.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 18, name: 'Giày Under Armour Charged',        category: 'Giày',       price: 125, oldPrice: 160, rating: 4.7, badge: 'Sale', image: 'https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 19, name: 'Áo compression Nike Pro',          category: 'Trang phục', price: 45,  oldPrice: 60,  rating: 4.8, badge: 'Hot',  image: 'https://images.pexels.com/photos/29520198/pexels-photo-29520198.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 20, name: 'Áo khoác chạy bộ Adidas Wind',    category: 'Trang phục', price: 79,  oldPrice: 99,  rating: 4.7, badge: 'New',  image: 'https://images.pexels.com/photos/12573643/pexels-photo-12573643.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 21, name: 'Túi thể thao Nike Duffle',         category: 'Phụ kiện',  price: 55,  oldPrice: 70,  rating: 4.8, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82' },
    { id: 22, name: 'Mũ thể thao Adidas Cap',           category: 'Phụ kiện',  price: 20,  oldPrice: 30,  rating: 4.5, badge: 'Eco',  image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=82' },
    { id: 23, name: 'Bóng chuyền Mikasa Pro',           category: 'Thiết bị',  price: 45,  oldPrice: 60,  rating: 4.6, badge: 'New',  image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=82' },
    { id: 24, name: 'Thảm yoga Fitness Pro',            category: 'Thiết bị',  price: 35,  oldPrice: 50,  rating: 4.8, badge: 'Hot',  image: 'https://images.pexels.com/photos/8436582/pexels-photo-8436582.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 25, name: 'Giày Asics Gel Nimbus',            category: 'Giày',       price: 145, oldPrice: 180, rating: 4.9, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=82' },
    { id: 26, name: 'Giày New Balance 1080',            category: 'Giày',       price: 139, oldPrice: 175, rating: 4.8, badge: 'New',  image: 'https://images.pexels.com/photos/30755567/pexels-photo-30755567.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { id: 27, name: 'Áo training Under Armour',         category: 'Trang phục', price: 42,  oldPrice: 58,  rating: 4.6, badge: 'Sale', image: 'https://images.unsplash.com/photo-1520975928316-8b5b0c3d6d4a?auto=format&fit=crop&w=900&q=82' },
    { id: 28, name: 'Găng tay boxing Everlast',         category: 'Phụ kiện',  price: 39,  oldPrice: 55,  rating: 4.7, badge: 'Hot',  image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=82' },
    { id: 29, name: 'Bóng tennis Wilson Pro',           category: 'Thiết bị',  price: 25,  oldPrice: 35,  rating: 4.6, badge: 'Eco',  image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=82' },
    { id: 30, name: 'Dây kháng lực Resistance Band Set',category: 'Thiết bị',  price: 29,  oldPrice: 40,  rating: 4.8, badge: 'New',  image: 'https://images.pexels.com/photos/8436147/pexels-photo-8436147.jpeg?auto=compress&cs=tinysrgb&w=900' }
  ];

  let products = [];

  let _resolveProducts;
  const productsReady = new Promise((resolve) => { _resolveProducts = resolve; });

  const loadProducts = async () => {
    try {
      const res = await fetch('../data/products.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      products = await res.json();
    } catch (err) {
      console.warn('[SportStore] fetch failed – using inline fallback.', err);
      products = PRODUCTS_FALLBACK;
    } finally {
      _resolveProducts(products);
    }
  };

  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

  const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const getProduct = (id) => products.find((product) => product.id === Number(id)) || products[0];



  const createLoader = () => {
    if (document.querySelector('.loader-screen')) return;
    document.body.insertAdjacentHTML('afterbegin', '<div class="loader-screen"><div class="loader-ring" aria-label="Loading"></div></div>');
    window.addEventListener('load', () => {
      setTimeout(() => document.querySelector('.loader-screen')?.classList.add('is-hidden'), 420);
    });
  };

  const createFloatingActions = () => {
    if (document.querySelector('.floating-actions')) return;
    const contactHref = window.location.pathname.includes('/admin/') || window.location.pathname.includes('\\admin\\') ? '../pages/contact.html' : 'contact.html';
    document.body.insertAdjacentHTML('beforeend', `
      <div class="floating-actions">
        <button class="bubble-btn d-none" type="button" data-back-top aria-label="Lên đầu trang"><i class="bi bi-arrow-up"></i></button>
        <a class="bubble-btn" href="${contactHref}" aria-label="Liên hệ hỗ trợ"><i class="bi bi-chat-dots"></i></a>
      </div>
    `);
  };

  const initAos = () => {
    if (window.AOS) {
      AOS.init({ duration: 760, easing: 'ease-out-cubic', once: true, offset: 80 });
    }
  };

  const initImages = () => {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) img.loading = 'lazy';
      if (img.complete) img.classList.add('is-loaded');
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    });
  };

  const initNavbar = () => {
    const navbar = document.querySelector('.app-navbar');
    if (!navbar) return;
    const sync = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  };

  const initTheme = () => {
    const saved = localStorage.getItem(storage.theme);
    if (saved) document.documentElement.dataset.theme = saved;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem(storage.theme, next);
      });
    });
  };

  const showToast = (message) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center border-0 glass-card';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<div class="d-flex"><div class="toast-body fw-semibold">${message}</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Đóng"></button></div>`;
    container.appendChild(toast);
    if (window.bootstrap) bootstrap.Toast.getOrCreateInstance(toast, { delay: 2200 }).show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  };

  const updateBadges = () => {
    const cartCount = read(storage.cart).reduce((sum, item) => sum + item.qty, 0);
    const wishlistCount = read(storage.wishlist).length;
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = cartCount; });
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => { el.textContent = wishlistCount; });
  };

  const addToCart = (id, qty = 1) => {
    const cart = read(storage.cart);
    const current = cart.find((item) => item.id === Number(id));
    if (current) current.qty += qty;
    else cart.push({ id: Number(id), qty });
    write(storage.cart, cart);
    updateBadges();
    showToast('Đã thêm sản phẩm vào giỏ hàng');
  };

  const toggleWishlist = (id) => {
    const list = read(storage.wishlist);
    const numericId = Number(id);
    const next = list.includes(numericId) ? list.filter((item) => item !== numericId) : [...list, numericId];
    write(storage.wishlist, next);
    updateBadges();
    showToast(next.includes(numericId) ? 'Đã lưu vào yêu thích' : 'Đã xóa khỏi yêu thích');
  };

  const productCard = (product, index = 0) => `
    <div class="col-sm-6 col-lg-4 col-xl-3" data-aos="fade-up" data-aos-delay="${index * 70}">
    <article class="product-card h-100">
      <div class="product-card__media">
        <span class="product-card__badge">${product.badge}</span>
        <div class="product-card__actions">
          <button class="icon-btn" type="button" data-wishlist="${product.id}" aria-label="Thêm ${product.name} vào yêu thích"><i class="bi bi-heart"></i></button>
          <a class="icon-btn" href="product-detail.html?id=${product.id}" aria-label="Xem nhanh ${product.name}"><i class="bi bi-eye"></i></a>
        </div>
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=900'">
      </div>
      <div class="product-card__body">
        <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
          <span class="small text-secondary">${product.category}</span>
          <span class="rating"><i class="bi bi-star-fill"></i>${product.rating}</span>
        </div>
        <h3 class="product-card__title">${product.name}</h3>
        <div class="d-flex align-items-center justify-content-between gap-3">
          <div><span class="price">${formatPrice(product.price)}</span> <span class="old-price small">${formatPrice(product.oldPrice)}</span></div>
          <button class="btn-premium btn-sm px-3" type="button" data-add-cart="${product.id}"><i class="bi bi-bag-plus"></i></button>
        </div>
      </div>
    </article>
    </div>`;

  const initProductGrids = () => {
    document.querySelectorAll('[data-product-grid]').forEach((grid) => {
      const limit = Number(grid.dataset.limit || products.length);
      grid.innerHTML = products.slice(0, limit).map(productCard).join('');
    });
    initImages();
  };

  const initActions = () => {
    document.addEventListener('click', (event) => {
      const cartButton = event.target.closest('[data-add-cart]');
      const wishlistButton = event.target.closest('[data-wishlist]');
      const rippleTarget = event.target.closest('.btn-premium, .icon-btn, .bubble-btn');

      if (cartButton) addToCart(cartButton.dataset.addCart, Number(cartButton.dataset.qty || 1));
      if (wishlistButton) toggleWishlist(wishlistButton.dataset.wishlist);

      if (rippleTarget) {
        const rect = rippleTarget.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        rippleTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }
    });
  };

  const initBackTop = () => {
    const button = document.querySelector('[data-back-top]');
    if (!button) return;
    const sync = () => button.classList.toggle('d-none', window.scrollY < 420);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter);
        let current = 0;
        const step = Math.max(1, Math.round(target / 48));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString();
        }, 24);
        observer.unobserve(el);
      });
    }, { threshold: .35 });
    counters.forEach((counter) => observer.observe(counter));
  };

  const initSwiper = () => {
    if (!window.Swiper) return;
    document.querySelectorAll('.product-swiper').forEach((el) => {
      new Swiper(el, {
        slidesPerView: 1.08,
        spaceBetween: 18,
        loop: true,
        autoplay: { delay: 2800, disableOnInteraction: false },
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }
      });
    });
    document.querySelectorAll('.testimonial-swiper').forEach((el) => {
      new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 18,
        loop: true,
        autoplay: { delay: 3600 },
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
      });
    });
  };

  const initForms = () => {
    document.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Yêu cầu của bạn đã được ghi nhận');
    });
  };

  const initCountdown = () => {
    const box = document.querySelector('[data-countdown]');
    if (!box) return;
    const target = Date.now() + 1000 * 60 * 60 * 26;
    const tick = () => {
      const distance = Math.max(0, target - Date.now());
      const hours = Math.floor(distance / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      box.innerHTML = [['Giờ', hours], ['Phút', minutes], ['Giây', seconds]].map(([label, value]) => `
        <span class="countdown__item"><span class="countdown__value">${String(value).padStart(2, '0')}</span><small>${label}</small></span>
      `).join('');
    };
    tick();
    setInterval(tick, 1000);
  };

  const init = async () => {
    createLoader();
    createFloatingActions();
    initTheme();
    initNavbar();
    await loadProducts();
    initProductGrids();
    initActions();
    initBackTop();
    initCounters();
    initCountdown();
    initSwiper();
    initForms();
    initImages();
    initAos();
    updateBadges();
  };

  return {
    init,
    get products() { return products; },
    productsReady,
    productCard,
    getProduct,
    formatPrice,
    read,
    write,
    storage,
    showToast,
    updateBadges
  };
})();

document.addEventListener('DOMContentLoaded', SportStore.init);



