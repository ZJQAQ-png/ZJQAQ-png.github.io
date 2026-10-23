/* =====================================================================
 * 作品集 · 个人项目展示站  (仿 DC Web 模式，纯静态 / 零外链 / 中英双语)
 * ---------------------------------------------------------------------
 * 你只需要编辑下面的 PROJECTS 数组即可，其余逻辑无需改动。
 * 想加项目：复制一个 {...} 对象，填好中英文与链接。
 * 想换封面：改 icon(emoji) 与 coverA/coverB(渐变两色)。
 * ===================================================================== */

const PROJECTS = [
  {
    id: "all-project",
    icon: "🌐",
    coverA: "#2f6df6", coverB: "#22c1a4",
    category: "网站", categoryEn: "Website",
    title: "All Project", titleEn: "All Project",
    desc: "项目聚合网站：集中展示与导航各类个人项目。",
    descEn: "Project aggregation website: a central hub linking all personal projects.",
    keywords: ["项目", "网站", "导航", "project", "web", "portfolio"],
    link: "https://github.com/ZJQAQ-png/all-project",
    status: "GitHub 仓库", statusEn: "GitHub repo",
  },
  {
    id: "ai-for-eaws",
    icon: "🤖",
    coverA: "#b06aff", coverB: "#6a8dff",
    category: "人工智能", categoryEn: "AI",
    title: "AI for EAWS", titleEn: "AI for EAWS",
    desc: "面向 EAWS 的人工智能应用项目。",
    descEn: "AI application project for EAWS.",
    keywords: ["AI", "人工智能", "EAWS", "machine learning"],
    link: "https://github.com/ZJQAQ-png/AI-for-EAWS",
    status: "GitHub 仓库", statusEn: "GitHub repo",
  },
  {
    id: "shift-plannning-system",
    icon: "🗓️",
    coverA: "#ff8a3c", coverB: "#ff5470",
    category: "工具系统", categoryEn: "Tooling",
    title: "排班系统", titleEn: "Shift Planning System",
    desc: "基于 TypeScript 的排班管理系统，支持本地运行与部署。",
    descEn: "TypeScript-based shift planning system, runnable and deployable locally.",
    keywords: ["排班", "系统", "typescript", "shift", "planning"],
    link: "https://github.com/ZJQAQ-png/Shift-plannning-system",
    status: "GitHub 仓库 · Node.js", statusEn: "GitHub repo · Node.js",
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
          '<a class="card-link" href="' + p.link + '"' +
            (p.link.startsWith("http") ? ' target="_blank" rel="noopener"' : "") + ">" +
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
