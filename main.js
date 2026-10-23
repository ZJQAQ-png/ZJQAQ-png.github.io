/* =====================================================================
 * 作品集 · 个人项目展示站  (仿 DC Web 模式，纯静态 / 零外链 / 中英双语)
 * ---------------------------------------------------------------------
 * 你只需要编辑下面的 PROJECTS 数组即可，其余逻辑无需改动。
 * 想加项目：复制一个 {...} 对象，填好中英文与链接。
 * 想换封面：改 icon(emoji) 与 coverA/coverB(渐变两色)。
 * ===================================================================== */

const PROJECTS = [
  {
    id: "lumipilot",
    icon: "💡",
    coverA: "#6a8dff", coverB: "#3aa0ff",
    category: "研发工具", categoryEn: "R&D tools",
    title: "LumiPilot", titleEn: "LumiPilot",
    desc: "照明研发决策工作台：客户情报、方案生成与商机管理。",
    descEn: "Lighting R&D workbench: customer intel, proposals and pipeline.",
    keywords: ["照明", "研发", "方案", "lighting", "rd", "proposal"],
    link: "./LumiPilot/",
    status: "账号登录 · 线上只读", statusEn: "Sign-in · read-only",
  },
  {
    id: "lumina",
    icon: "🌆",
    coverA: "#b06aff", coverB: "#ff6a9c",
    category: "场景仿真", categoryEn: "Simulation",
    title: "LUMINA", titleEn: "LUMINA",
    desc: "三维布灯、照度核算与 IES 配光分析演示系统。",
    descEn: "3D layout, illuminance calc and IES photometry demo.",
    keywords: ["仿真", "照度", "IES", "simulation", "lighting"],
    link: "./LUMINA/",
    status: "仅供演示 · 无需安装", statusEn: "Demo only · no install",
  },
  {
    id: "viet",
    icon: "🗣️",
    coverA: "#22c1a4", coverB: "#2f9bff",
    category: "语言学习", categoryEn: "Language",
    title: "越语冒险", titleEn: "Vietnamese Adventure",
    desc: "越南语闯关学习系统，支持手机主屏安装与离线缓存。",
    descEn: "Vietnamese learning with PWA install and offline cache.",
    keywords: ["越南语", "学习", "vietnamese", "language", "pwa"],
    link: "./vietnamese-learning/",
    status: "无需账号 · 进度存本机", statusEn: "No account · local save",
  },
  {
    id: "wanchao",
    icon: "⚔️",
    coverA: "#ff8a3c", coverB: "#ff5470",
    category: "策略游戏", categoryEn: "Strategy",
    title: "万朝逐鹿", titleEn: "Wanchao",
    desc: "跨朝代实时战略，六朝阵营、真实地名城池、单人练兵。",
    descEn: "Cross-dynasty RTS with six factions and real-map cities.",
    keywords: ["游戏", "策略", "game", "rts", "strategy"],
    link: "./wanchao/",
    status: "单人立即可用", statusEn: "Single-player ready",
  },
];

/* ---------- 中英文字典（界面文案） ---------- */
const I18N = {
  zh: {
    siteTitle: "精选作品",
    siteSubtitle: "SELECTED WORK · 个人项目作品集",
    guide: "使用说明",
    searchPH: "搜索项目 / Search…",
    guideTitle: "整站使用说明",
    aboutToggle: "关于作者 ▾",
    aboutToggleOpen: "关于作者 ▴",
    guideBody:
      "<ul>" +
      "<li>首页为作品集导航，点击卡片上的「打开」进入对应项目。</li>" +
      "<li>右上角可切换 <b>中 / EN</b> 语言与 <b>明 / 暗</b> 主题，偏好会自动保存。</li>" +
      "<li>搜索框与分类按钮可按名称、关键词、分类快速筛选。</li>" +
      "<li>部分项目需账号或仅本地保存数据，详见各项目页内说明。</li>" +
      "</ul>",
    aboutBody:
      "<p>这里放置作者简介。例如：</p>" +
      "<ul><li>姓名 / 身份</li><li>主攻方向</li><li>联系方式（邮箱 / 社交链接）</li></ul>" +
      "<p>把这段替换成你自己的介绍即可。</p>",
    empty: "没有匹配的项目。",
  },
  en: {
    siteTitle: "Selected Work",
    siteSubtitle: "SELECTED WORK · Personal Project Portfolio",
    guide: "Guide",
    searchPH: "Search projects / 搜索…",
    guideTitle: "Site Guide",
    aboutToggle: "About ▾",
    aboutToggleOpen: "About ▴",
    guideBody:
      "<ul>" +
      "<li>The home page is a portfolio index. Click <b>Open</b> on a card to enter a project.</li>" +
      "<li>Use the top-right controls to switch <b>ZH / EN</b> and <b>light / dark</b> theme; preferences are saved.</li>" +
      "<li>Search box and category chips filter by name, keyword and category.</li>" +
      "<li>Some projects need sign-in or keep data locally only — see each project page.</li>" +
      "</ul>",
    aboutBody:
      "<p>Put your bio here. For example:</p>" +
      "<ul><li>Name / role</li><li>Focus areas</li><li>Contact (email / social)</li></ul>" +
      "<p>Replace this with your own intro.</p>",
    empty: "No matching projects.",
  },
};

/* ---------- 状态 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const params = new URLSearchParams(location.search);
let lang = params.get("lang") === "en" ? "en" : (localStorage.getItem("lang") || "zh");
let theme = localStorage.getItem("theme") || "light";
let activeCat = "all";

/* ---------- 渲染 ---------- */
function t(key) { return (I18N[lang] || I18N.zh)[key]; }

function applyStaticText() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (I18N[lang][k] != null) el.textContent = I18N[lang][k];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph");
    if (I18N[lang][k] != null) el.placeholder = I18N[lang][k];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const k = el.getAttribute("data-i18n-html");
    if (I18N[lang][k] != null) el.innerHTML = I18N[lang][k];
  });
  $("#langBtn").textContent = lang === "zh" ? "EN" : "ZH";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  $("#themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
}

function categories() {
  const set = new Set();
  PROJECTS.forEach((p) => set.add(lang === "zh" ? p.category : p.categoryEn));
  return [...set];
}

function renderFilters() {
  const bar = $("#filterBar");
  const cats = categories();
  const all = lang === "zh" ? "全部" : "All";
  bar.innerHTML = "";
  const mk = (label, val) => {
    const b = document.createElement("button");
    b.className = "filter-btn" + (activeCat === val ? " active" : "");
    b.textContent = label;
    b.onclick = () => { activeCat = val; renderFilters(); renderGrid(); };
    return b;
  };
  bar.appendChild(mk(all, "all"));
  cats.forEach((c) => bar.appendChild(mk(c, c)));
}

function matchProject(p, q) {
  if (!q) return true;
  const hay = [
    p.title, p.titleEn, p.desc, p.descEn,
    p.category, p.categoryEn, (p.keywords || []).join(" "),
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderGrid() {
  const grid = $("#projectGrid");
  const q = $("#searchInput").value.trim();
  const catNow = lang === "zh"
    ? PROJECTS.filter((p) => (activeCat === "all" || p.category === activeCat))
    : PROJECTS.filter((p) => (activeCat === "all" || p.categoryEn === activeCat));
  const list = catNow.filter((p) => matchProject(p, q));
  grid.innerHTML = "";
  if (!list.length) {
    const e = document.createElement("div");
    e.className = "empty";
    e.textContent = t("empty");
    grid.appendChild(e);
    return;
  }
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--cover-a", p.coverA);
    card.style.setProperty("--cover-b", p.coverB);
    const title = lang === "zh" ? p.title : p.titleEn;
    const desc = lang === "zh" ? p.desc : p.descEn;
    const cat = lang === "zh" ? p.category : p.categoryEn;
    const status = lang === "zh" ? p.status : p.statusEn;
    card.innerHTML =
      '<div class="card-cover">' + p.icon + "</div>" +
      '<div class="card-body">' +
        '<span class="card-cat">' + cat + "</span>" +
        '<h3 class="card-title">' + title + "</h3>" +
        '<p class="card-desc">' + desc + "</p>" +
        '<div class="card-foot">' +
          '<span class="card-status">' + status + "</span>" +
          '<a class="card-link" href="' + p.link + '">' +
            (lang === "zh" ? "打开" : "Open") + "</a>" +
        "</div>" +
      "</div>";
    grid.appendChild(card);
  });
}

/* ---------- 交互 ---------- */
function toggleLang() {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("lang", lang);
  params.set("lang", lang);
  history.replaceState(null, "", "?" + params.toString());
  applyStaticText(); renderFilters(); renderGrid();
}
function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme);
  applyTheme();
}
function toggleGuide() {
  const g = $("#guidePanel");
  g.hidden = !g.hidden;
  if (!g.hidden) g.scrollIntoView({ behavior: "smooth", block: "start" });
}
function toggleAbout() {
  const b = $("#aboutBody");
  b.hidden = !b.hidden;
  $("#aboutToggle").textContent = b.hidden ? t("aboutToggle") : t("aboutToggleOpen");
}

/* ---------- 本地访问计数（仅本机，非跨设备统计） ---------- */
function bumpViews() {
  let n = parseInt(localStorage.getItem("homeViews") || "0", 10);
  n += 1;
  localStorage.setItem("homeViews", String(n));
  $("#homeViews").textContent = (lang === "zh" ? "首页打开 " : "Home opens ") + n;
}

/* ---------- 初始化 ---------- */
function init() {
  applyTheme();
  applyStaticText();
  renderFilters();
  renderGrid();
  bumpViews();
  $("#langBtn").onclick = toggleLang;
  $("#themeBtn").onclick = toggleTheme;
  $("#guideBtn").onclick = toggleGuide;
  $("#footerGuideBtn").onclick = toggleGuide;
  $("#aboutToggle").onclick = toggleAbout;
  $("#searchInput").oninput = renderGrid;
}
document.addEventListener("DOMContentLoaded", init);
