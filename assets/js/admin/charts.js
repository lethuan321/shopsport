document.addEventListener('DOMContentLoaded', () => {
  if (!window.Chart) return;
  const grid = 'rgba(148, 163, 184, .16)';
  const text = '#94a3b8';

  const makeLine = (id, label, data, color = '#2563eb') => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        datasets: [{ label, data, tension: .42, fill: true, borderColor: color, backgroundColor: `${color}22`, pointRadius: 3 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: { legend: { labels: { color: text } } },
        scales: { x: { grid: { color: grid }, ticks: { color: text } }, y: { grid: { color: grid }, ticks: { color: text } } }
      }
    });
  };

  const makeDoughnut = (id) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    new Chart(canvas, {
      type: 'doughnut',
      data: { labels: ['Organic', 'Social', 'Ads'], datasets: [{ data: [44, 28, 28], backgroundColor: ['#2563eb', '#22c55e', '#f59e0b'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: { animateRotate: true }, plugins: { legend: { labels: { color: text } } } }
    });
  };

  makeLine('salesChart', 'Doanh số', [18, 26, 24, 38, 42, 55, 68]);
  makeLine('revenueChart', 'Doanh thu', [12, 19, 25, 33, 31, 48, 62], '#22c55e');
  makeLine('trafficChart', 'Lưu lượng', [32, 28, 40, 46, 58, 64, 72], '#38bdf8');
  makeDoughnut('trafficPie');
});
