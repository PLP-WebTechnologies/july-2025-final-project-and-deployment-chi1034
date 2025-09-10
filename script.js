/*
  script.js
  - Demonstrates functions with scope, parameters, return values
  - Handles mobile nav toggle, project modal interactions, and simple animation triggers
*/

/* -------------------------
   Utility: safe selector
   ------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* =========================
   PART 1: Navigation Toggle
   Demonstrates scope and return value
   ========================= */
function toggleNav(toggleBtnId, navId) {
  const btn = document.getElementById(toggleBtnId);
  const nav = document.getElementById(navId) || document.querySelector('.primary-nav');

  if (!btn || !nav) return 'nav elements missing';

  // event handler — closed over btn and nav (demonstrates closure/local scope)
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'flex'; // simple show/hide for demo
  });

  return 'nav wired';
}

// wire the header toggles (multiple header buttons)
toggleNav('navToggle', 'primaryNav');
toggleNav('navToggle2', 'primaryNav2');
toggleNav('navToggle3', 'primaryNav3');

/* =========================
   PART 2: Projects modal logic
   - showProject(projectId) demonstrates parameters & return value
   - closeProject()
   ========================= */

const PROJECTS = {
  portfolio: {
    title: 'PLP Portfolio Challenge',
    desc: 'A responsive portfolio created as part of PLP Academy. Uses semantic HTML, CSS transitions, and modular JS.',
    links: [{ label: 'Repo', href: 'https://github.com/PLP-Database-Design/wk-1-chi1034-1' }]
  },
  fetcher: {
    title: 'Ubuntu Image Fetcher',
    desc: 'Python and frontend demo for fetching and rendering images programmatically; includes headers and SVG handling.',
    links: [{ label: 'GitHub', href: 'https://github.com/chi1034' }]
  },
  library: {
    title: 'Library Management DB',
    desc: 'Database design and SQL queries for a library management system (PLP Week assignment).',
    links: [{ label: 'Repo', href: 'https://github.com/chi1034/wk-8-library-management-db' }]
  }
};

function showProject(key) {
  const modal = $('#projectModal');
  const titleEl = $('#modalTitle');
  const descEl = $('#modalDesc');
  const linksEl = $('#modalLinks');

  if (!PROJECTS[key]) return `project "${key}" not found`;

  const p = PROJECTS[key];
  titleEl.textContent = p.title;
  descEl.textContent = p.desc;

  // clear links and add anchors
  linksEl.innerHTML = '';
  p.links.forEach(l => {
    const a = document.createElement('a');
    a.href = l.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'btn small';
    a.textContent = l.label;
    linksEl.appendChild(a);
  });

  modal.setAttribute('aria-hidden', 'false');
  // add a small pulse animation for emphasis
  const panel = modal.querySelector('.modal-panel');
  panel.classList.remove('pulse');
  // force reflow to restart animation if needed
  void panel.offsetWidth;
  panel.classList.add('pulse');

  return `opened ${p.title}`;
}

function closeProject() {
  const modal = $('#projectModal');
  modal.setAttribute('aria-hidden', 'true');
  return 'modal closed';
}

/* wire card buttons to modal */
$$('[data-open]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const key = btn.getAttribute('data-open');
    const res = showProject(key);
    console.log(res);
  });
});

/* close modal */
$('#modalClose').addEventListener('click', closeProject);
/* close by overlay click */
$('#projectModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeProject();
});

/* =========================
   PART 3: Small helpers & animations
   - getRandomColor demonstrates return of string value
   - changeThemeColor shows parameter usage and triggers CSS animation class
   ========================= */

function getRandomColor() {
  const palette = ['#12b6a7','#0b6b7a','#ff6b6b','#ffb86b','#8b5cf6'];
  return palette[Math.floor(Math.random()*palette.length)];
}

function changeThemeColor(hex) {
  const root = document.documentElement;
  // set CSS custom property to change accent color
  root.style.setProperty('--accent', hex);
  // return confirmation message
  return `accent changed to ${hex}`;
}

// example: change accent on double click of brand (small easter egg)
$('.brand').addEventListener('dblclick', () => {
  const color = getRandomColor();
  console.log(changeThemeColor(color));
});

/* =========================
   PART 4: Accessibility helpers
   - ensure focus management when modal opens
   ========================= */

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // close any open modal
    const modal = $('#projectModal');
    if (modal.getAttribute('aria-hidden') === 'false') closeProject();
  }
});
