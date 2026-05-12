const DesignSystem = (() => {
  const themeKey = 'sport-store-theme';

  const debounce = (fn, delay = 120) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const throttle = (fn, delay = 120) => {
    let locked = false;
    return (...args) => {
      if (locked) return;
      locked = true;
      requestAnimationFrame(() => {
        fn(...args);
        setTimeout(() => { locked = false; }, delay);
      });
    };
  };

  const initTheme = () => {
    const saved = localStorage.getItem(themeKey);
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (systemDark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-toggle], [data-admin-theme]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem(themeKey, next);
      });
    });
  };

  const initImages = () => {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) img.loading = 'lazy';
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
      if (!img.alt) img.alt = 'Sport Store image';
    });
  };

  const initButtons = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-loading-button]');
      const reload = event.target.closest('[data-reload-page]');
      if (button) {
        button.classList.add('ds-button-loading');
        setTimeout(() => button.classList.remove('ds-button-loading'), 900);
      }
      if (reload) location.reload();
    });
  };

  const initMicroInteractions = () => {
    document.addEventListener('click', (event) => {
      const wishlist = event.target.closest('[data-wishlist]');
      const cart = event.target.closest('[data-add-cart]');
      if (wishlist) {
        wishlist.classList.add('wishlist-pop');
        setTimeout(() => wishlist.classList.remove('wishlist-pop'), 480);
      }
      if (cart) {
        cart.classList.add('cart-pop');
        setTimeout(() => cart.classList.remove('cart-pop'), 560);
      }
    });
  };

  const initMobileNav = () => {
    if (document.body.classList.contains('admin-body') || document.querySelector('.ds-mobile-nav')) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    const links = [
      ['index.html', 'bi-house', 'Trang chủ'],
      ['shop.html', 'bi-grid', 'Cửa hàng'],
      ['wishlist.html', 'bi-heart', 'Yêu thích'],
      ['cart.html', 'bi-bag', 'Giỏ hàng'],
      ['profile.html', 'bi-person', 'Tài khoản']
    ];
    const nav = document.createElement('nav');
    nav.className = 'ds-mobile-nav';
    nav.setAttribute('aria-label', 'Điều hướng nhanh trên di động');
    nav.innerHTML = links.map(([href, icon, label]) => `<a href="${href}" aria-label="${label}" ${current === href ? 'aria-current="page"' : ''}><i class="bi ${icon}"></i></a>`).join('');
    document.body.appendChild(nav);
  };

  const isAdmin = () => location.pathname.includes('/admin/') || location.pathname.includes('\\admin\\');
  const isAuth = () => location.pathname.includes('/pages/auth/') || location.pathname.includes('\\pages\\auth\\');
  const pageBase = () => (isAuth() ? '../' : '');

  const initGlobalNavigation = () => {
    if (isAdmin() || document.querySelector('.ds-global-nav')) return;
    const base = pageBase();
    const current = location.pathname.split('/').pop() || 'index.html';
    const navLinks = [
      ['index.html', 'Trang chủ'],
      ['shop.html', 'Cửa hàng'],
      ['categories.html', 'Danh mục'],
      ['shop.html#flash-sale', 'Flash Sale'],
      ['about.html', 'Giới thiệu'],
      ['contact.html', 'Liên hệ'],
      ['blog.html', 'Blog'],
    ];
    const nav = document.createElement('header');
    nav.className = 'ds-global-nav';
    nav.innerHTML = `
      <div class="container position-relative">
        <div class="ds-global-nav__inner">
          <a class="ds-global-nav__brand" href="${base}index.html"><span class="ds-global-nav__brand-mark"><i class="bi bi-lightning-charge-fill"></i></span>Sport Store</a>
          <nav class="ds-global-nav__menu" aria-label="Điều hướng chính">
            ${navLinks.map(([href, label]) => `<a class="ds-global-nav__link" href="${base}${href}" ${current === href ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
          </nav>
          <div class="ds-global-nav__actions">
            <form class="ds-global-search" data-global-search role="search">
              <input type="search" placeholder="Tìm sản phẩm" aria-label="Tìm sản phẩm">
              <i class="bi bi-search"></i>
              <div class="ds-search-suggestions" data-search-suggestions></div>
            </form>
            <a class="icon-btn" href="${base}wishlist.html" aria-label="Yêu thích"><i class="bi bi-heart"></i></a>
            <a class="icon-btn" href="${base}cart.html" aria-label="Giỏ hàng"><i class="bi bi-bag"></i></a>
            <a class="icon-btn" href="${base}orders.html" aria-label="Đơn hàng"><i class="bi bi-receipt"></i></a>
            <button class="icon-btn" type="button" data-theme-toggle aria-label="Đổi giao diện"><i class="bi bi-moon-stars"></i></button>
            <div class="dropdown">
              <button class="icon-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Tài khoản"><i class="bi bi-person"></i></button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="${base}auth/login.html">Đăng nhập</a></li>
                <li><a class="dropdown-item" href="${base}auth/register.html">Đăng ký</a></li>
                <li><a class="dropdown-item" href="${base}profile.html">Hồ sơ</a></li>
                <li><a class="dropdown-item" href="${base}orders.html">Đơn hàng</a></li>
                <li><a class="dropdown-item" href="${base}auth/login.html">Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="ds-mega" data-mega-menu>
          <div class="ds-mega__grid">
            <a class="ds-mega__item" href="${base}shop.html?category=shoes"><strong>Giày thể thao</strong><p class="mb-0">Running, court, lifestyle.</p></a>
            <a class="ds-mega__item" href="${base}shop.html?category=apparel"><strong>Trang phục</strong><p class="mb-0">Hoodie, tee, compression.</p></a>
            <a class="ds-mega__item" href="${base}shop.html?category=equipment"><strong>Thiết bị</strong><p class="mb-0">Bóng, dụng cụ tập.</p></a>
            <a class="ds-mega__item" href="${base}shop.html?category=accessories"><strong>Phụ kiện</strong><p class="mb-0">Túi, bình nước, găng tay.</p></a>
          </div>
        </div>
      </div>`;
    document.body.prepend(nav);
    document.body.classList.add('ds-global-ready');
  };

  const initBreadcrumb = () => {
    if (isAdmin() || document.querySelector('.ds-breadcrumb')) return;
    const base = pageBase();
    const title = document.title.split('|').pop()?.trim() || 'Trang';
    const main = document.querySelector('main');
    if (!main) return;
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'ds-breadcrumb container';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.innerHTML = `<ol><li><a href="${base}index.html">Trang chủ</a></li><li aria-hidden="true">/</li><li aria-current="page">${title}</li></ol>`;
    main.prepend(breadcrumb);
  };

  const initGlobalFooter = () => {
    if (isAdmin() || document.querySelector('.ds-global-footer')) return;
    const base = pageBase();
    const footer = document.createElement('footer');
    footer.className = 'ds-global-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="ds-global-footer__grid">
          <section><a class="ds-global-nav__brand text-white mb-3" href="${base}index.html"><span class="ds-global-nav__brand-mark"><i class="bi bi-lightning-charge-fill"></i></span>Sport Store</a><p>Premium sports ecommerce experience for shoes, apparel, accessories, and equipment.</p><form class="d-flex gap-2 mt-3"><input class="form-control" type="email" placeholder="Email newsletter" aria-label="Email newsletter"><button class="ds-btn ds-btn--primary" type="submit">Subscribe</button></form></section>
          <section><h2 class="h6 text-white">Quick links</h2><a class="d-block mb-2" href="${base}shop.html">Shop</a><a class="d-block mb-2" href="${base}categories.html">Categories</a><a class="d-block mb-2" href="${base}blog.html">Blog</a><a class="d-block" href="${base}faq.html">FAQ</a></section>
          <section><h2 class="h6 text-white">Support</h2><a class="d-block mb-2" href="${base}contact.html">Contact</a><a class="d-block mb-2" href="${base}orders.html">Orders</a><a class="d-block mb-2" href="${base}payment-failed.html">Payment help</a><a class="d-block" href="${base}network-error.html">Network status</a></section>
          <section><h2 class="h6 text-white">Contact</h2><p>support@sportstore.local<br>TP. Hồ Chí Minh, Việt Nam</p><div class="ds-payment"><span>Visa</span><span>Mastercard</span><span>COD</span><span>MoMo</span></div></section>
        </div>
        <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mt-4 pt-4 border-top border-secondary"><span>Sport Store © 2026</span><div class="d-flex gap-2"><a href="${base}contact.html">Facebook</a><a href="${base}about.html">Instagram</a><a href="${base}shop.html">TikTok</a></div></div>
      </div>`;
    document.body.appendChild(footer);
  };

  const initMegaAndSearch = () => {
    const mega = document.querySelector('[data-mega-menu]');
    document.querySelector('[data-mega-toggle]')?.addEventListener('click', () => mega?.classList.toggle('is-open'));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-mega-menu], [data-mega-toggle]')) mega?.classList.remove('is-open');
    });
    document.querySelectorAll('[data-global-search]').forEach((form) => {
      const input = form.querySelector('input');
      const suggestions = form.querySelector('[data-search-suggestions]');
      const items = ['Giày Nike AeroSwift Runner', 'Áo hoodie Adidas Training', 'Bóng đá Pro League', 'Găng tay tập Puma Flex'];
      input.addEventListener('input', () => {
        const term = input.value.trim().toLowerCase();
        if (!term) {
          suggestions.classList.remove('is-open');
          return;
        }
        suggestions.innerHTML = items.filter((item) => item.toLowerCase().includes(term)).map((item) => `<a href="${pageBase()}search.html?q=${encodeURIComponent(item)}">${item}</a>`).join('') || `<a href="${pageBase()}search.html?q=${encodeURIComponent(term)}">Tìm "${term}"</a>`;
        suggestions.classList.add('is-open');
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const term = input.value.trim();
        if (term) location.href = `${pageBase()}search.html?q=${encodeURIComponent(term)}`;
      });
    });
  };

  const initEmptyStates = () => {
    document.querySelectorAll('[data-empty-state]').forEach((el) => {
      if (el.children.length) return;
      const title = el.dataset.emptyTitle || 'Chưa có dữ liệu';
      const text = el.dataset.emptyText || 'Hãy thử thay đổi bộ lọc hoặc quay lại sau.';
      const href = el.dataset.emptyHref || 'shop.html';
      const cta = el.dataset.emptyCta || 'Khám phá ngay';
      el.classList.add('ds-empty');
      el.innerHTML = `<div><div class="ds-empty__icon"><i class="bi bi-inboxes"></i></div><h2 class="h4">${title}</h2><p>${text}</p><a class="ds-btn ds-btn--primary" href="${href}">${cta}</a></div>`;
    });
  };

  const initAdvancedEcommerce = () => {
    const viewedKey = 'sport-store-recently-viewed';
    const productId = new URLSearchParams(location.search).get('id');
    if (productId) {
      const viewed = JSON.parse(localStorage.getItem(viewedKey) || '[]').filter((id) => id !== productId);
      viewed.unshift(productId);
      localStorage.setItem(viewedKey, JSON.stringify(viewed.slice(0, 6)));
    }
    document.querySelectorAll('[data-stock-countdown]').forEach((el) => {
      const count = Number(el.dataset.stockCountdown || 12);
      el.innerHTML = `<span class="admin-badge admin-badge--warning">Chỉ còn ${count} sản phẩm</span>`;
    });
    document.querySelectorAll('[data-shipping-calculator]').forEach((el) => {
      el.innerHTML = `<div class="ds-card p-3"><label class="form-label">Tính phí vận chuyển</label><div class="d-flex gap-2"><input class="form-control" placeholder="Nhập mã bưu chính"><button class="ds-btn ds-btn--primary" type="button">Tính</button></div></div>`;
    });
  };

  const initPerformanceHooks = () => {
    window.addEventListener('scroll', throttle(() => document.body.toggleAttribute('data-scrolled', window.scrollY > 12), 80), { passive: true });
    window.addEventListener('resize', debounce(() => document.body.dispatchEvent(new CustomEvent('ds:resize')), 160), { passive: true });
  };

  const init = () => {
    initTheme();
    initGlobalNavigation();
    initBreadcrumb();
    initGlobalFooter();
    initImages();
    initButtons();
    initMicroInteractions();
    initMobileNav();
    initEmptyStates();
    initAdvancedEcommerce();
    initMegaAndSearch();
    initPerformanceHooks();
  };

  return { init, debounce, throttle };
})();

document.addEventListener('DOMContentLoaded', DesignSystem.init);
