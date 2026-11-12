/* Restore the reference's mouse-following cover flow without demo business actions. */
(function (root) {
  'use strict';
  function pointerIndex(x, left, width, count) {
    if (width <= 0 || count <= 1) return 0;
    return Math.max(0, Math.min(1, (x - left) / width)) * (count - 1);
  }
  function wrapIndex(index, count) {
    return count > 0 ? ((index % count) + count) % count : 0;
  }
  function init() {
    const ring = document.getElementById('dept-grid');
    const stage = document.querySelector('.carousel3d');
    if (!ring || !stage) return null;
    const all = [...ring.querySelectorAll('.workspace-card')];
    const prev = document.querySelector('.carousel__nav--prev');
    const next = document.querySelector('.carousel__nav--next');
    const status = document.getElementById('carousel-status');
    const bg = document.getElementById('carousel3d-bg');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cards = all, center = 0, target = 0, frame = 0, touch = null;

    function layout() {
      const active = cards[Math.round(center)];
      const gap = Math.min(250, stage.clientWidth * 0.6);
      cards.forEach((card, i) => {
        const off = i - center, distance = Math.abs(off);
        card.style.transform = `translate(-50%, -50%) translateX(${(off * gap).toFixed(1)}px) rotateY(${(off * -32).toFixed(1)}deg) translateZ(${(-distance * 200).toFixed(1)}px) scale(${Math.max(0.5, 1 - distance * 0.12).toFixed(3)})`;
        card.style.opacity = distance > 3.5 ? '0' : Math.max(0, 1 - distance * 0.3).toFixed(2);
        card.style.zIndex = String(100 - Math.round(distance));
        card.style.pointerEvents = distance > 3.5 ? 'none' : 'auto';
        card.inert = distance > 3.5;
        card.classList.toggle('is-active', card === active);
      });
      if (bg) bg.style.transform = `translateX(${(-center * 30).toFixed(1)}px)`;
      const label = active ? `${active.querySelector('h3').textContent} · ${Math.round(center) + 1} / ${cards.length}` : '没有匹配的工作台';
      if (status.textContent !== label) status.textContent = label;
      document.querySelectorAll('[data-side-key]').forEach(link => {
        link.classList.toggle('is-active', link.dataset.sideKey === active?.dataset.key);
      });
      prev.disabled = next.disabled = cards.length <= 1;
    }
    function animate() {
      frame = 0;
      center += (target - center) * 0.12;
      if (Math.abs(target - center) < 0.001) center = target;
      layout();
      if (center !== target) frame = requestAnimationFrame(animate);
    }
    function move(value, immediate = false) {
      target = Math.max(0, Math.min(cards.length - 1, value));
      if (reduce.matches || immediate) {
        cancelAnimationFrame(frame); frame = 0; center = target; layout();
      } else if (!frame) frame = requestAnimationFrame(animate);
    }
    function goTo(index) { move(wrapIndex(index, cards.length)); }
    function goToKey(key, immediate = false) {
      const index = cards.findIndex(card => card.dataset.key === key);
      if (index >= 0) move(index, immediate);
    }
    function refresh() {
      cancelAnimationFrame(frame); frame = 0;
      cards = all.filter(card => !card.hidden);
      all.forEach(card => { card.inert = card.hidden; card.classList.remove('is-active'); });
      center = target = 0;
      layout();
    }
    prev.addEventListener('click', () => goTo(Math.round(target) - 1));
    next.addEventListener('click', () => goTo(Math.round(target) + 1));
    stage.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || reduce.matches || event.target.closest('a, button')) return;
      const rect = stage.getBoundingClientRect();
      move(pointerIndex(event.clientX, rect.left, rect.width, cards.length));
    });
    stage.addEventListener('pointerleave', () => move(Math.round(target)));
    stage.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') goTo(0);
      else if (event.key === 'End') goTo(cards.length - 1);
      else goTo(Math.round(target) + (event.key === 'ArrowRight' ? 1 : -1));
    });
    ring.addEventListener('focusin', event => {
      const card = event.target.closest('.workspace-card');
      if (card) goToKey(card.dataset.key, true);
    });
    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || event.target.closest('a, button')) return;
      touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointerup', event => {
      if (!touch || event.pointerId !== touch.id) return;
      const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goTo(Math.round(target) + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('pointercancel', () => { touch = null; });
    new ResizeObserver(layout).observe(stage);
    reduce.addEventListener('change', () => move(Math.round(target), true));
    refresh();
    return { goToKey, refresh };
  }
  const api = { init, pointerIndex, wrapIndex };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortalCarousel = api;
})(typeof window !== 'undefined' ? window : globalThis);
