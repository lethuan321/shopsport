const DesignSystem = (() => {
  const themeKey = 'sport-store-theme';
  const userKey = 'user';

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

  const getBasePrefix = () => {
    const p = location.pathname || '';
    if (p.includes('/pages/') || p.includes('\\pages\\')) return '';
    return 'pages/';
  };

  const rootIndexHref = () => {
    const p = location.pathname || '';
    if (p.includes('/pages/auth/') || p.includes('\\pages\\auth\\')) return '../../index.html';
    if (p.includes('/pages/') || p.includes('\\pages\\')) return '../index.html';
    return 'index.html';
  };

  const isAdmin = () => location.pathname.includes('/admin/') || location.pathname.includes('\\admin\\');

  const checkUserLoginState = () => {
    try {
      const raw = localStorage.getItem(userKey);
      if (!raw) return { loggedIn: false, username: '' };
      const parsed = JSON.parse(raw);
      const username = typeof parsed?.username === 'string' ? parsed.username : '';
      return { loggedIn: Boolean(username), username };
    } catch {
      return { loggedIn: false, username: '' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(userKey);
    // reload để UI đồng bộ trạng thái đăng nhập
    location.reload();
  };

  const setActiveNavLink = (navLinksRoot) => {
    if (!navLinksRoot) return;
    const currentPath = (location.pathname.split('/').pop() || '').replace(/^\/*/, '');

    const linkEls = navLinksRoot.querySelectorAll('[data-ds-navlink]');
    linkEls.forEach((el) => {
      const href = el.getAttribute('href') || '';
      const matchToken = href.split('?')[0].split('#')[0];
      const last = matchToken.split('/').pop() || matchToken;
      const isActive = last === currentPath || (currentPath === '' && last === 'index.html');
      el.classList.toggle('is-active', isActive);
      el.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  };

  // Required function: searchSubmit()
  const searchSubmit = (keyword) => {
    const term = String(keyword || '').trim();
    if (!term) return;
    const searchUrl = `${getBasePrefix()}search.html?q=${encodeURIComponent(term)}`;
    location.href = searchUrl;
  };

  const handleScrollNavbarEffect = (navbarEl) => {
    const sync = () => {
      const scrolled = window.scrollY > 10;
      navbarEl.classList.toggle('is-scrolled', scrolled);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  };

  // Required function: toggleMobileMenu()
  const toggleMobileMenu = (state, els) => {
    const { navbarEl, overlayEl, drawerEl } = els;
    const isOpen = Boolean(state);

    navbarEl?.classList.toggle('is-open', isOpen);
    overlayEl?.classList.toggle('is-open', isOpen);
    drawerEl?.classList.toggle('is-open', isOpen);

    if (overlayEl) overlayEl.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
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

  const initStickyNavbar = () => {
    if (isAdmin()) return;
    if (document.querySelector('.ds-sticky-navbar')) return;

    const navbarHeight = 72; // px
    const base = getBasePrefix();

    const routes = [
      { key: 'home', href: rootIndexHref(), label: 'Trang chủ', icon: 'bi-house' },
      { key: 'shop', href: `${base}shop.html`, label: 'Cửa hàng', icon: 'bi-grid' },
      { key: 'about', href: `${base}about.html`, label: 'Giới thiệu', icon: 'bi-info-circle' },
      { key: 'contact', href: `${base}contact.html`, label: 'Liên hệ', icon: 'bi-chat-dots' },
    ];

    const currentFile = (location.pathname.split('/').pop() || '').replace(/^\/*/, '');
    const activeKey = routes.find((r) => {
      const last = (r.href.split('?')[0].split('#')[0].split('/').pop() || '').replace(/^\/*/, '');
      return last === currentFile;
    })?.key || (currentFile === '' ? 'home' : (currentFile === 'shop.html' ? 'shop' : 'home'));

    const injectCss = () => {
      if (document.querySelector('style[data-ds-sticky-navbar]')) return;

      const style = document.createElement('style');
      style.setAttribute('data-ds-sticky-navbar', 'true');
      style.textContent = `
        .ds-sticky-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1100;
          height: ${navbarHeight}px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
        }
        html[data-theme="dark"] .ds-sticky-navbar {
          background: rgba(15, 16, 22, 0.62);
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .ds-sticky-navbar.is-scrolled {
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.80);
        }
        html[data-theme="dark"] .ds-sticky-navbar.is-scrolled {
          background: rgba(15, 16, 22, 0.82);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        body.ds-has-sticky-navbar { padding-top: ${navbarHeight}px; }

        .ds-sticky-navbar__inner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 12px;
        }

        .ds-sticky-navbar__brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
          text-decoration: none;
          color: inherit;
          white-space: nowrap;
        }
        .ds-sticky-navbar__brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 2px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.6);
        }
        html[data-theme="dark"] .ds-sticky-navbar__brand-mark {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.16);
        }

        .ds-sticky-navbar__nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ds-sticky-navbar__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 12px;
          font-weight: 800;
          color: inherit;
          transition: background 160ms ease, transform 160ms ease;
        }
        .ds-sticky-navbar__link:hover {
          background: rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }
        html[data-theme="dark"] .ds-sticky-navbar__link:hover {
          background: rgba(255,255,255,0.08);
        }
        .ds-sticky-navbar__link.is-active {
          background: rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.10);
        }
        html[data-theme="dark"] .ds-sticky-navbar__link.is-active {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.14);
        }

        .ds-sticky-navbar__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ds-sticky-navbar__iconbtn {
          width: 42px; height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.55);
          text-decoration: none;
          color: inherit;
        }
        html[data-theme="dark"] .ds-sticky-navbar__iconbtn {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }

        .ds-search {
          position: relative;
          min-width: 280px;
          flex: 1;
          max-width: 420px;
        }
        @media (max-width: 1100px) {
          .ds-search { min-width: 220px; max-width: 320px; }
        }
        @media (max-width: 992px) {
          .ds-search { min-width: 0; max-width: none; display: none; }
        }
        .ds-search__input {
          width: 100%;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.62);
          padding: 0 48px 0 14px;
          outline: none;
          font-weight: 700;
        }
        .ds-search__input:focus {
          border-color: rgba(0,0,0,0.22);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.18);
        }
        html[data-theme="dark"] .ds-search__input {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.92);
        }
        html[data-theme="dark"] .ds-search__input:focus {
          border-color: rgba(255,255,255,0.20);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.22);
        }
        .ds-search__btn {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          width: 36px; height: 36px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.55);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        html[data-theme="dark"] .ds-search__btn {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }

        .ds-login {
          position: relative;
        }
        .ds-login__btn {
          height: 42px;
          padding: 0 12px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.55);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
          color: inherit;
        }
        html[data-theme="dark"] .ds-login__btn {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }
        .ds-login__menu {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          min-width: 220px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0,0,0,0.10);
          border-radius: 16px;
          padding: 10px;
          display: none;
          box-shadow: 0 18px 60px rgba(0,0,0,0.20);
          z-index: 1200;
        }
        html[data-theme="dark"] .ds-login__menu {
          background: rgba(15,16,22,0.94);
          border-color: rgba(255,255,255,0.14);
        }
        .ds-login__menu.is-open { display: block; }
        .ds-login__item {
          width: 100%;
          text-align: left;
          padding: 12px 12px;
          border-radius: 14px;
          font-weight: 800;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          cursor: pointer;
          border: 0;
          background: transparent;
        }
        .ds-login__item:hover {
          background: rgba(0,0,0,0.06);
        }
        html[data-theme="dark"] .ds-login__item:hover {
          background: rgba(255,255,255,0.08);
        }

        .ds-sticky-navbar__burger {
          display: none;
          width: 46px; height: 46px;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.55);
          color: inherit;
          cursor: pointer;
        }
        html[data-theme="dark"] .ds-sticky-navbar__burger {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }

        .ds-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(0,0,0,0.40);
          opacity: 0;
          pointer-events: none;
          transition: opacity 220ms ease;
        }
        .ds-mobile-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .ds-mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(360px, 90vw);
          z-index: 1250;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-left: 1px solid rgba(0,0,0,0.10);
          transform: translateX(105%);
          transition: transform 260ms ease;
          display: flex;
          flex-direction: column;
          max-height: 100vh;
        }
        html[data-theme="dark"] .ds-mobile-drawer {
          background: rgba(15, 16, 22, 0.95);
          border-left-color: rgba(255,255,255,0.12);
        }
        .ds-mobile-drawer.is-open { transform: translateX(0); }
        .ds-mobile-drawer__head {
          height: ${navbarHeight}px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          gap: 12px;
        }
        .ds-mobile-drawer__links {
          padding: 12px 12px 18px;
          overflow: auto;
        }
        .ds-mobile-drawer__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 12px;
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          font-weight: 900;
          margin-bottom: 8px;
          background: rgba(0,0,0,0.04);
        }
        html[data-theme="dark"] .ds-mobile-drawer__link { background: rgba(255,255,255,0.06); }
        .ds-mobile-drawer__link.is-active {
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(0,0,0,0.08);
        }
        html[data-theme="dark"] .ds-mobile-drawer__link.is-active {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
        }

        .ds-mobile-drawer__search {
          margin: 12px 0 6px;
          padding: 0 4px;
        }
        .ds-mobile-drawer__search .ds-search__input { height: 46px; }
        .ds-mobile-drawer__search .ds-search__btn { right: 10px; width: 40px; height: 40px; border-radius: 14px; }

        .ds-mobile-user {
          margin-top: 10px;
          padding: 10px 8px;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(0,0,0,0.03);
        }
        html[data-theme="dark"] .ds-mobile-user {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }
        .ds-mobile-user__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-weight: 900;
          padding: 6px 10px 10px;
        }
        .ds-mobile-user__items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ds-mobile-user__item {
          width: 100%;
          text-align: left;
          padding: 12px 12px;
          border-radius: 14px;
          font-weight: 800;
          text-decoration: none;
          color: inherit;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.06);
          cursor: pointer;
        }
        html[data-theme="dark"] .ds-mobile-user__item {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }

        @media (max-width: 992px) {
          .ds-sticky-navbar__nav { display: none; }
          .ds-sticky-navbar__burger { display: inline-flex; align-items: center; justify-content: center; }
        }

        @media (min-width: 993px) {
          .ds-mobile-overlay, .ds-mobile-drawer { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ds-sticky-navbar, .ds-mobile-overlay, .ds-mobile-drawer, .ds-sticky-navbar__link { transition: none !important; }
          .ds-sticky-navbar__link:hover { transform: none !important; }
        }
      `;

      document.head.appendChild(style);
    };

    const buildLoginArea = () => {
      const { loggedIn, username } = checkUserLoginState();
      const safeUsername = username || 'User';

      if (!loggedIn) {
        return `
          <a class="ds-login__item" href="${base}login.html">
            <span class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>Đăng nhập</span>
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </a>
        `;
      }

      return `
        <div class="ds-mobile-user__top">
          <span class="d-flex align-items-center gap-2"><i class="bi bi-person-circle" aria-hidden="true"></i>${safeUsername}</span>
        </div>
        <div class="ds-mobile-user__items">
          <a class="ds-mobile-user__item" href="${base}profile.html"><span class="d-flex align-items-center gap-2"><i class="bi bi-person" aria-hidden="true"></i>Profile</span><i class="bi bi-chevron-right" aria-hidden="true"></i></a>
          <a class="ds-mobile-user__item" href="${base}orders.html"><span class="d-flex align-items-center gap-2"><i class="bi bi-receipt" aria-hidden="true"></i>Orders</span><i class="bi bi-chevron-right" aria-hidden="true"></i></a>
          <button class="ds-mobile-user__item" type="button" data-ds-logout><span class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-right" aria-hidden="true"></i>Logout</span><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
        </div>
      `;
    };

    const injectDom = () => {
      injectCss();

      const overlay = document.createElement('div');
      overlay.className = 'ds-mobile-overlay';
      overlay.setAttribute('aria-hidden', 'true');

      const drawer = document.createElement('aside');
      drawer.className = 'ds-mobile-drawer';
      drawer.setAttribute('aria-label', 'Menu điều hướng di động');

      const navbar = document.createElement('header');
      navbar.className = 'ds-sticky-navbar';
      navbar.setAttribute('role', 'navigation');
      navbar.setAttribute('aria-label', 'Điều hướng chính');

      const navLinksHtml = routes.map((r) => {
        const isActive = r.key === activeKey;
        return `
          <a
            class="ds-sticky-navbar__link${isActive ? ' is-active' : ''}"
            href="${r.href}"
            data-ds-navlink
            ${isActive ? 'aria-current="page"' : 'aria-current="false"'}
          >
            <i class="bi ${r.icon}" aria-hidden="true"></i>
            <span>${r.label}</span>
          </a>
        `;
      }).join('');

      const user = checkUserLoginState();
      const loginBtnLabel = user.loggedIn ? user.username : 'Đăng nhập';

      navbar.innerHTML = `
        <div class="container ds-sticky-navbar__inner">
          <a class="ds-sticky-navbar__brand" href="${rootIndexHref()}">
            <span class="ds-sticky-navbar__brand-mark"><i class="bi bi-lightning-charge-fill" aria-hidden="true"></i></span>
            <span>Sport Store</span>
          </a>

          <nav class="ds-sticky-navbar__nav" aria-label="Điều hướng chính">
            ${navLinksHtml}
          </nav>

          <div class="ds-sticky-navbar__actions">
            <form class="ds-search" role="search" aria-label="Tìm kiếm sản phẩm" data-ds-search-form>
              <input class="ds-search__input" type="search" placeholder="Tìm kiếm..." aria-label="Tìm kiếm..." name="q">
              <button class="ds-search__btn" type="submit" aria-label="Tìm kiếm">
                <i class="bi bi-search" aria-hidden="true"></i>
              </button>
            </form>

            <div class="ds-login" data-ds-login>
              <button class="ds-login__btn" type="button" data-ds-login-toggle aria-expanded="false">
                <i class="bi bi-person" aria-hidden="true"></i>
                <span class="ds-login__label">${loginBtnLabel}</span>
                <i class="bi bi-chevron-down" aria-hidden="true"></i>
              </button>
              <div class="ds-login__menu" role="menu" aria-label="Tài khoản">
                <div data-ds-login-menu></div>
              </div>
            </div>

            <a class="ds-sticky-navbar__iconbtn" href="${base}wishlist.html" aria-label="Yêu thích">
              <i class="bi bi-heart" aria-hidden="true"></i>
            </a>
            <a class="ds-sticky-navbar__iconbtn" href="${base}cart.html" aria-label="Giỏ hàng">
              <i class="bi bi-bag" aria-hidden="true"></i>
            </a>

            <button class="ds-sticky-navbar__burger" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="dsMobileDrawer" data-ds-mobile-open>
              <i class="bi bi-list" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      `;

      const loginMenuEl = navbar.querySelector('[data-ds-login-menu]');
      if (loginMenuEl) {
        if (!user.loggedIn) {
          loginMenuEl.innerHTML = `
            <a class="ds-login__item" href="${base}login.html">
              <span class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>Đăng nhập</span>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </a>
          `;
        } else {
          loginMenuEl.innerHTML = `
            <a class="ds-login__item" href="${base}profile.html">
              <span class="d-flex align-items-center gap-2"><i class="bi bi-person" aria-hidden="true"></i>Profile</span>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </a>
            <a class="ds-login__item" href="${base}orders.html">
              <span class="d-flex align-items-center gap-2"><i class="bi bi-receipt" aria-hidden="true"></i>Orders</span>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </a>
            <button class="ds-login__item" type="button" data-ds-logout>
              <span class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-right" aria-hidden="true"></i>Logout</span>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
          `;
        }
      }

      drawer.id = 'dsMobileDrawer';
      drawer.innerHTML = `
        <div class="ds-mobile-drawer__head">
          <a class="ds-sticky-navbar__brand" href="${rootIndexHref()}">
            <span class="ds-sticky-navbar__brand-mark"><i class="bi bi-lightning-charge-fill" aria-hidden="true"></i></span>
            <span>Sport Store</span>
          </a>
          <button class="ds-sticky-navbar__burger" type="button" data-ds-mobile-close aria-label="Đóng menu">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="ds-mobile-drawer__links">
          <div class="ds-mobile-drawer__search">
            <form class="ds-search" role="search" aria-label="Tìm kiếm sản phẩm" data-ds-search-form-mobile>
              <input class="ds-search__input" type="search" placeholder="Tìm kiếm..." aria-label="Tìm kiếm..." name="q-mobile">
              <button class="ds-search__btn" type="submit" aria-label="Tìm kiếm">
                <i class="bi bi-search" aria-hidden="true"></i>
              </button>
            </form>
          </div>

          ${routes.map((r) => {
        const isActive = r.key === activeKey;
        return `
              <a class="ds-mobile-drawer__link${isActive ? ' is-active' : ''}" href="${r.href}" data-ds-navlink-mobile>
                <span class="d-flex align-items-center gap-2"><i class="bi ${r.icon}" aria-hidden="true"></i>${r.label}</span>
                <i class="bi bi-chevron-right" aria-hidden="true"></i>
              </a>
            `;
      }).join('')}

          <div class="ds-mobile-user">
            ${user.loggedIn ? buildLoginArea() : `
              <div class="ds-mobile-user__top">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-person-circle" aria-hidden="true"></i>Khách</span>
              </div>
              <div class="ds-mobile-user__items">
                <a class="ds-mobile-user__item" href="${base}login.html">
                  <span class="d-flex align-items-center gap-2"><i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>Đăng nhập</span>
                  <i class="bi bi-chevron-right" aria-hidden="true"></i>
                </a>
              </div>
            `}
          </div>
        </div>
      `;

      document.body.prepend(navbar);
      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      document.body.classList.add('ds-has-sticky-navbar');

      return { navbar, overlay, drawer };
    };

    const { navbar, overlay, drawer } = injectDom();

    // Login dropdown (desktop)
    const loginWrap = navbar.querySelector('[data-ds-login]');
    const loginToggle = navbar.querySelector('[data-ds-login-toggle]');
    const loginMenu = navbar.querySelector('.ds-login__menu');

    const closeLogin = () => {
      if (!loginMenu) return;
      loginMenu.classList.remove('is-open');
      if (loginToggle) loginToggle.setAttribute('aria-expanded', 'false');
    };

    const openLogin = () => {
      if (!loginMenu) return;
      loginMenu.classList.add('is-open');
      if (loginToggle) loginToggle.setAttribute('aria-expanded', 'true');
    };

    if (loginToggle) {
      loginToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = loginMenu?.classList.contains('is-open');
        if (isOpen) closeLogin();
        else openLogin();
      });
    }

    document.addEventListener('click', () => closeLogin());

    // Logout handlers (desktop + mobile)
    const logoutButtons = document.querySelectorAll('[data-ds-logout]');
    logoutButtons.forEach((btn) => {
      btn.addEventListener('click', () => logoutUser());
    });

    // Mobile menu handlers
    const openBtn = navbar.querySelector('[data-ds-mobile-open]');
    const closeBtn = drawer.querySelector('[data-ds-mobile-close]');
    const applyState = (isOpen) => toggleMobileMenu(isOpen, { navbarEl: navbar, overlayEl: overlay, drawerEl: drawer });

    if (openBtn) {
      openBtn.addEventListener('click', () => applyState(true));
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => applyState(false));
    }

    overlay.addEventListener('click', () => applyState(false));

    drawer.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.getAttribute('href')) applyState(false);
      const logout = event.target.closest('[data-ds-logout]');
      if (logout) logoutUser();
    });

    // Search submit handlers (desktop + mobile)
    const attachSearch = (formEl, inputEl) => {
      formEl?.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = inputEl?.value || '';
        searchSubmit(value);
      });
    };

    const desktopSearchForm = navbar.querySelector('[data-ds-search-form]');
    const desktopSearchInput = navbar.querySelector('[data-ds-search-form] input[name="q"]');
    attachSearch(desktopSearchForm, desktopSearchInput);

    const mobileSearchForm = drawer.querySelector('[data-ds-search-form-mobile]');
    const mobileSearchInput = drawer.querySelector('[data-ds-search-form-mobile] input');
    attachSearch(mobileSearchForm, mobileSearchInput);

    // Active state sync (in case of updated routes)
    setActiveNavLink(navbar);

    // Scroll effect
    handleScrollNavbarEffect(navbar);
  };

  const initMobileNav = () => {
    // Mobile nav quick bar (giữ nguyên nếu sticky chưa tồn tại)
    if (document.body.classList.contains('admin-body') || document.querySelector('.ds-mobile-nav')) return;
    if (document.querySelector('.ds-sticky-navbar')) return;

    const current = location.pathname.split('/').pop() || 'index.html';
    const links = [
      ['index.html', 'bi-house', 'Trang chủ'],
      ['shop.html', 'bi-grid', 'Cửa hàng'],
      ['wishlist.html', 'bi-heart', 'Yêu thích'],
      ['cart.html', 'bi-bag', 'Giỏ hàng'],
      ['profile.html', 'bi-person', 'Tài khoản'],
    ];

    const nav = document.createElement('nav');
    nav.className = 'ds-mobile-nav';
    nav.setAttribute('aria-label', 'Điều hướng nhanh trên di động');
    nav.innerHTML = links.map(([href, icon, label]) =>
      `<a href="${href}" aria-label="${label}" ${current === href ? 'aria-current="page"' : ''}><i class="bi ${icon}"></i></a>`
    ).join('');
    document.body.appendChild(nav);
  };

  // Retain old advanced/empty/table helpers (from original file), but do NOT inject ds-global-nav
  // if sticky navbar is present, to avoid double nav.
  const initBreadcrumb = () => {
    if (isAdmin() || document.querySelector('.ds-breadcrumb')) return;
    const main = document.querySelector('main');
    if (!main) return;

    const base = getBasePrefix();
    const title = document.title.split('|').pop()?.trim() || 'Trang';
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'ds-breadcrumb container';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.innerHTML = `<ol><li><a href="${base}index.html">Trang chủ</a></li><li aria-hidden="true">/</li><li aria-current="page">${title}</li></ol>`;
    main.prepend(breadcrumb);
  };

  const initGlobalFooter = () => {
    // Nếu HTML đã có footer (ví dụ index.html có sẵn footer site-footer) thì không inject thêm
    if (isAdmin() || document.querySelector('.ds-global-footer') || document.querySelector('footer')) return;
    const base = getBasePrefix();

    const footer = document.createElement('footer');
    footer.className = 'ds-global-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="ds-global-footer__grid">
          <section><a class="ds-global-nav__brand text-white mb-3" href="${base}index.html"><span class="ds-global-nav__brand-mark"><i class="bi bi-lightning-charge-fill"></i></span>Sport Store</a><p>Premium sports ecommerce experience for shoes, apparel, accessories, and equipment.</p><form class="d-flex gap-2 mt-3"><input class="form-control" type="email" placeholder="Email newsletter" aria-label="Email newsletter"><button class="ds-btn ds-btn--primary" type="submit">Subscribe</button></form></section>
          <section><h2 class="h6 text-white">Quick links</h2><a class="d-block mb-2" href="${base}shop.html">Shop</a><a class="d-block mb-2" href="${base}categories.html">Categories</a><a class="d-block mb-2" href="${base}blog.html">Blog</a><a class="d-block" href="${base}faq.html">FAQ</a></section>
          <section><h2 class="h6 text-white">Support</h2><a class="d-block mb-2" href="${base}contact.html">Contact</a><a class="d-block mb-2" href="${base}orders.html">Orders</a><a class="d-block mb-2" href="${base}payment-failed.html">Payment help</a><a class="d-block mb-2" href="${base}network-error.html">Network status</a></section>
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

        suggestions.innerHTML =
          items
            .filter((item) => item.toLowerCase().includes(term))
            .map((item) => `<a href="${getBasePrefix()}search.html?q=${encodeURIComponent(item)}">${item}</a>`)
            .join('') ||
          `<a href="${getBasePrefix()}search.html?q=${encodeURIComponent(term)}">Tìm "${term}"</a>`;

        suggestions.classList.add('is-open');
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const term = input.value.trim();
        if (term) location.href = `${getBasePrefix()}search.html?q=${encodeURIComponent(term)}`;
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
    initStickyNavbar();
    initBreadcrumb();
    initGlobalFooter();

    initImages();
    initButtons();
    initMicroInteractions();
    initMobileNav();

    initEmptyStates();
    initAdvancedEcommerce();

    // search suggestions on pages that still use ds-global-search
    initMegaAndSearch();

    initPerformanceHooks();
  };

  return { init, debounce, throttle };
})();

document.addEventListener('DOMContentLoaded', DesignSystem.init);
