const AdminUI = (() => {
  const showToast = (message, tone = 'primary') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast align-items-center border-0 text-bg-${tone}`;
    toast.innerHTML = `<div class="d-flex"><div class="toast-body fw-semibold">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Đóng"></button></div>`;
    container.appendChild(toast);
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 2200 }).show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  };

  const initLoader = () => {
    const loader = document.querySelector('[data-admin-loader]');
    window.addEventListener('load', () => setTimeout(() => loader?.classList.add('is-hidden'), 320));
  };

  const initSidebar = () => {
    const shell = document.querySelector('.admin-shell');
    const sidebar = document.querySelector('.admin-sidebar');
    const backdrop = document.querySelector('[data-admin-backdrop]');
    const current = location.pathname.split('/').pop() || 'dashboard.html';
    const links = [
      ['dashboard.html', 'bi-grid', 'Dashboard'],
      ['products.html', 'bi-box-seam', 'Products'],
      ['categories.html', 'bi-tags', 'Categories'],
      ['orders.html', 'bi-receipt', 'Orders'],
      ['users.html', 'bi-people', 'Users'],
      ['reviews.html', 'bi-star', 'Reviews'],
      ['analytics.html', 'bi-graph-up', 'Analytics'],
      ['inventory.html', 'bi-boxes', 'Inventory'],
      ['coupons.html', 'bi-ticket-perforated', 'Coupons'],
      ['notifications.html', 'bi-bell', 'Notifications'],
      ['settings.html', 'bi-gear', 'Settings'],
      ['login.html', 'bi-box-arrow-left', 'Logout']
    ];
    const nav = sidebar?.querySelector('.admin-sidebar__nav');
    if (nav) {
      nav.innerHTML = links.map(([href, icon, label]) => `<a class="admin-sidebar__link ${current === href ? 'active' : ''}" href="${href}"><i class="bi ${icon}"></i><span class="admin-sidebar__text">${label}</span></a>`).join('');
    }
    document.querySelectorAll('[data-sidebar-collapse]').forEach((button) => {
      button.addEventListener('click', () => shell?.classList.toggle('is-collapsed'));
    });
    document.querySelectorAll('[data-sidebar-open]').forEach((button) => {
      button.addEventListener('click', () => {
        sidebar?.classList.add('is-open');
        backdrop?.classList.add('is-open');
      });
    });
    backdrop?.addEventListener('click', () => {
      sidebar?.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    });
  };

  const initRipple = () => {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.admin-btn, .admin-icon-btn');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  };

  const initCounters = () => {
    document.querySelectorAll('[data-admin-counter]').forEach((el) => {
      const target = Number(el.dataset.adminCounter);
      let current = 0;
      const step = Math.max(1, Math.round(target / 48));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString();
      }, 22);
    });
  };

  const initTheme = () => {
    document.querySelectorAll('[data-admin-theme]').forEach((button) => {
      button.addEventListener('click', () => {
        document.body.classList.toggle('admin-light');
        showToast('Đã đổi chế độ giao diện.', 'primary');
      });
    });
  };

  const initPasswordToggles = () => {
    document.querySelectorAll('[data-admin-password-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const input = document.querySelector(button.dataset.adminPasswordToggle);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });
  };

  const initBase = () => {
    initLoader();
    initSidebar();
    initRipple();
    initCounters();
    initTheme();
    initPasswordToggles();
  };

  return { initBase, showToast };
})();

document.addEventListener('DOMContentLoaded', AdminUI.initBase);
