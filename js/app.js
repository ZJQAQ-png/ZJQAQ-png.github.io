(function () {
'use strict';
  const I = {
    sales: '<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 7h4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    quality: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rd: '<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-3L14 9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 15h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    agent: '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="13" r="1.6" fill="currentColor"/><circle cx="15" cy="13" r="1.6" fill="currentColor"/><path d="M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 7V4M8 4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    data: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    perm: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="15.5" r="1.5" fill="currentColor"/></svg>',
    flow: '<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="19" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 7.5v9M8.5 5h4a2 2 0 0 1 2 2v2.5M15.5 14.5V19H8.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    bot: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="14" r="1.4" fill="currentColor"/><circle cx="15" cy="14" r="1.4" fill="currentColor"/><path d="M12 8V5M9 3h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };

  function initStars() {
    const canvas = document.getElementById('stars');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let stars = [];
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth || canvas.clientWidth;
      H = window.innerHeight || canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(280, Math.floor((W * H) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: 0.3 + Math.random() * 0.7,
        r: 0.4 + Math.random() * 1.4,
        base: 0.25 + Math.random() * 0.7,
        tw: Math.random() * Math.PI * 2,
        tws: 0.5 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
      }));
    }

    window.addEventListener('mousemove', (e) => {
      if (W && H) { mouse.tx = e.clientX / W; mouse.ty = e.clientY / H; }
    }, { passive: true });

    function frame(t) {
      if (!W || !H) { requestAnimationFrame(frame); return; }
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const px = mouse.x - 0.5, py = mouse.y - 0.5;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -6) s.x = W + 6; else if (s.x > W + 6) s.x = -6;
        if (s.y < -6) s.y = H + 6; else if (s.y > H + 6) s.y = -6;
        const ox = px * 26 * s.z, oy = py * 20 * s.z;
        const a = s.base * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tws + s.tw));
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = s.z > 0.82 ? '#dbeaff' : '#8fb7e8';
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r * (0.55 + s.z * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }

  const BASES = {
    'scene3d--home': { rx: -16, ry: 26 },
    'scene3d--commercial': { rx: -14, ry: 24 },
    'scene3d--auto': { rx: -12, ry: 0 },
  };
  function initTilt() {
    document.querySelectorAll('.scene3d[data-tilt]').forEach((scene) => {
      const stage = scene.querySelector('.room, .office, .road');
      if (!stage) return;
      const max = parseFloat(scene.dataset.tiltMax || '12');
      const key = Object.keys(BASES).find((k) => scene.classList.contains(k));
      const base = BASES[key] || { rx: 0, ry: 0 };
      function set(rx, ry) {
        stage.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
      }
      scene.addEventListener('mousemove', (e) => {
        const r = scene.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        set(base.rx - dy * max, base.ry + dx * max);
      });
      scene.addEventListener('mouseleave', () => { stage.style.transform = ''; });
    });
  }

  const config = window.PORTAL_CONFIG || {};
  const DEPTS = [
    { key: 'procurement', name: '采购工作台', color: '#3fb6ff', icon: I.sales, available: true, url: config.procurement,
      desc: '连接行情洞察、供应商报价与成本分析，让采购决策更有依据。', tags: ['行情预警', '智能核价', '产品图册'] },
    { key: 'research', name: '研发工作台', color: '#a78bfa', icon: I.rd, available: true, url: config.research,
      desc: '贯通文档、设计方案与项目阶段，让产品创新高效推进。', tags: ['研发文档', '方案设计', '项目协同'] },
    { key: 'quality', name: '品保工作台', color: '#22d3ee', icon: I.quality, available: true, url: config.quality,
      desc: '从测试方案到产品评审，汇集质量知识与人工确认流程。', tags: ['测试方案', '产品评审', '质量知识'] },
    { key: 'sales', name: '销售工作台', color: '#60a5fa', icon: I.sales, desc: '客户洞察与商机跟进，连接市场和业务机会。' },
    { key: 'agent', name: 'AI Agent 中心', color: '#4ade80', icon: I.agent, desc: '智能体编排与提示词管理，构建专属 AI 助手。' },
    { key: 'data', name: '数据决策', color: '#ffb45c', icon: I.data, desc: '汇集经营数据，探索业务洞察与智能报表。' },
    { key: 'perm', name: '权限管理', color: '#f472b6', icon: I.perm, desc: '统一组织、角色与访问管理，支撑团队协作。' },
    { key: 'flow', name: '自建审批流程', color: '#f87171', icon: I.flow, desc: '连接跨部门业务流程，让每一次协作清晰有序。' }
  ];
  const grid = document.getElementById('dept-grid');
  const dialog = document.getElementById('entry-dialog');
  let previousFocus;
  const states = DEPTS.map(d => window.PortalCore.entryState(d));
  grid.innerHTML = DEPTS.map((d, i) => {
    const state = states[i];
    const planned = state.status === 'planned';
    return `<article class="workspace-card ${planned ? 'workspace-card--planned' : ''}" id="dept-${d.key}" data-key="${d.key}" tabindex="0" aria-label="${d.name}" style="--c:${d.color}">
      <span class="dept-card__corners" aria-hidden="true"></span>
      <div class="workspace-card__top"><span class="workspace-card__icon">${d.icon}</span><span class="workspace-badge">${planned ? '待开发' : state.url ? '入口已配置' : '已有项目 · 待接入'}</span></div>
      <h3>${d.name}</h3><p>${d.desc}</p>
      ${d.tags ? `<ul class="workspace-tags">${d.tags.map(t => `<li>${t}</li>`).join('')}</ul>` : '<div class="workspace-placeholder" aria-hidden="true">COMING SOON</div>'}
      <div class="workspace-card__foot">${planned ? '<span>敬请期待</span><span aria-hidden="true">＋</span>' : state.url ? `<a data-entry="${d.key}" target="_blank" rel="noopener noreferrer">进入工作台 <span aria-hidden="true">↗</span></a>` : `<button type="button" data-pending="${d.key}">查看接入状态 <span aria-hidden="true">→</span></button>`}</div>
    </article>`;
  }).join('');
  // Assign URLs as DOM properties, never as interpolated markup.
  grid.querySelectorAll('[data-entry]').forEach(a => {
    a.href = states[DEPTS.findIndex(d => d.key === a.dataset.entry)].url;
  });
  document.getElementById('configured-count').textContent = String(states.filter(s => s.url).length).padStart(2, '0');
  const pending = states.filter(s => s.status === 'pending').length;
  document.getElementById('portal-notice').textContent = pending
    ? `采购、研发、品保项目已具备本地应用，${pending} 个工作台的云端服务尚待接入。`
    : '三个工作台均已配置公网入口，点击进入后按各应用要求登录。';
  const sidebar = document.getElementById('sidebar-modules');
  sidebar.innerHTML = DEPTS.map(d => `<a class="side-item" href="#dept-${d.key}" data-side-key="${d.key}" aria-label="${d.name}${d.available ? '' : '，待开发'}" title="${d.name}"><span class="side-item__icon" style="color:${d.color}">${d.icon}</span><span class="side-item__label">${d.name}</span>${d.available ? '' : '<span class="side-item__badge">待开发</span>'}</a>`).join('');
  const search = document.getElementById('global-search');
  const carousel = window.PortalCarousel.init();
  sidebar.querySelectorAll('svg').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
  function filter() {
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    DEPTS.forEach(d => {
      const card = document.getElementById('dept-' + d.key);
      card.hidden = ![d.name, d.desc, ...(d.tags || []), d.available ? '已有项目 待接入' : '待开发'].join(' ').toLowerCase().includes(query);
      if (!card.hidden) matches++;
    });
    document.getElementById('search-empty').hidden = matches > 0;
    carousel?.refresh();
  }
  search.addEventListener('input', filter);
  sidebar.addEventListener('click', e => {
    const link = e.target.closest('[data-side-key]');
    if (!link) return;
    e.preventDefault();
    search.value = ''; filter();
    document.querySelectorAll('.side-item').forEach(el => el.classList.remove('is-active'));
    link.classList.add('is-active');
    carousel?.goToKey(link.dataset.sideKey, true);
    document.getElementById('departments').scrollIntoView({ block: 'start' });
  });
  grid.addEventListener('click', e => {
    const button = e.target.closest('[data-pending]');
    if (!button) return;
    const entry = DEPTS.find(d => d.key === button.dataset.pending);
    document.getElementById('entry-title').textContent = entry.name;
    document.getElementById('entry-description').textContent = entry.desc;
    previousFocus = button;
    dialog.showModal();
  });
  dialog.addEventListener('close', () => previousFocus?.focus());
  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  document.getElementById('sidebar-toggle').addEventListener('click', e => {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    const button = e.currentTarget;
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-label', collapsed ? '展开导航' : '收起导航');
    button.title = collapsed ? '展开导航' : '收起导航';
  });
  document.getElementById('sidebar-toggle').setAttribute('aria-expanded', 'true');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { initStars(); initTilt(); }

})();
