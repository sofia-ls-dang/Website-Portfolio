// ===== CURSOR =====
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .menu-item, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '22px';
    cursor.style.height = '22px';
    cursor.style.background = '#fff';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '14px';
    cursor.style.height = '14px';
    cursor.style.background = '#cc0000';
  });
});


// ===== SOUND =====
function playClick() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
}

function playHover() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
  } catch(e) {}
}


// ===== MENU + PANEL SYSTEM =====
const menuItems = document.querySelectorAll('.menu-item');
const panels    = document.querySelectorAll('.panel');
const wipe      = document.getElementById('wipe');
let   activeIdx = 0;
let   isTransitioning = false;

function getActiveSection() {
  return document.querySelector('.menu-item.active')?.dataset.section || 'about';
}

function switchTo(sectionId, clickedEl) {
  if (isTransitioning) return;
  const currentPanel = document.querySelector('.panel.active');
  const nextPanel    = document.getElementById('panel-' + sectionId);
  if (!nextPanel || currentPanel === nextPanel) return;

  isTransitioning = true;
  playClick();

  // 1. Trigger red wipe overlay
  wipe.classList.add('go');

  setTimeout(() => {
    // 2. Mid-wipe: swap panels
    if (currentPanel) {
      currentPanel.classList.remove('active');
      currentPanel.classList.add('exit');
      setTimeout(() => currentPanel.classList.remove('exit'), 400);
    }
    nextPanel.classList.add('active');

    // 3. Update menu active state
    menuItems.forEach(item => item.classList.remove('active'));
    if (clickedEl) clickedEl.classList.add('active');

    // 4. Update keyboard index
    activeIdx = [...menuItems].indexOf(clickedEl);
  }, 275);

  // 5. Remove wipe class after animation ends
  setTimeout(() => {
    wipe.classList.remove('go');
    isTransitioning = false;

    // Fetch projects if switching to projects panel
    if (sectionId === 'projects') fetchRepos();
  }, 580);
}

// Click handler
menuItems.forEach((item, i) => {
  item.addEventListener('click', e => {
    e.preventDefault();
    switchTo(item.dataset.section, item);
  });
  item.addEventListener('mouseenter', () => {
    if (!item.classList.contains('active')) playHover();
  });
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIdx = Math.max(0, activeIdx - 1);
    menuItems[activeIdx].focus();
    playHover();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIdx = Math.min(menuItems.length - 1, activeIdx + 1);
    menuItems[activeIdx].focus();
    playHover();
  }
  if (e.key === 'Enter') {
    const focused = menuItems[activeIdx];
    switchTo(focused.dataset.section, focused);
  }
});


// ===== GITHUB API =====
const GITHUB_USERNAME = 'sofia-ls-dang';
let reposFetched = false;

const LANG_COLORS = {
  Python:'#3572A5', JavaScript:'#f1e05a', C:'#555555',
  HTML:'#e34c26', Java:'#b07219', TypeScript:'#2b7489',
  Haskell:'#5e5086', CSS:'#563d7c', Shell:'#89e051',
};

function getExtraTags(repoName) {
  const tags = {
    'Website-Portfolio': ['HTML', 'JavaScript', 'PHP', 'Docker'],
    'SlugShack': ['Python', 'Streamlit', 'Flowise'],
  };
  const name = repoName.toLowerCase();
  const match = Object.keys(tags).find(k => name.includes(k.toLowerCase()));
  if (!match) return '';
  return tags[match]
    .map(t => `<span class="project-tag">${t}</span>`)
    .join('');
}

async function fetchRepos() {
  if (reposFetched) return;
  const grid = document.getElementById('projectsGrid');
  try {
    const res   = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
    if (!res.ok) throw new Error();
    const repos = await res.json();
    const own   = repos.filter(r => !r.fork);
    if (!own.length) { grid.innerHTML = '<div class="p5-loading">NO RECORDS FOUND</div>'; return; }

    grid.innerHTML = '';
    own.forEach(repo => {
      const card = document.createElement('a');
      card.href   = repo.html_url;
      card.target = '_blank';
      card.rel    = 'noopener noreferrer';
      card.classList.add('project-card');

      const lc = LANG_COLORS[repo.language] || '#cc0000';
      const st     = repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : '';

      const extraTags = getExtraTags(repo.name);
      card.innerHTML = `
        <div class="project-name">${repo.name.toUpperCase()}</div>
        <p class="project-desc">${repo.description || 'No description provided.'}</p>
        <div class="project-foot">
          ${repo.language ? `<span class="project-tag">${repo.language}</span>` : ''}
          ${extraTags}
          ${st ? `<span class="project-stars">${st}</span>` : ''}
        </div>`;
      card.addEventListener('mouseenter', playHover);
      card.addEventListener('click', playClick);
      grid.appendChild(card);
    });
    reposFetched = true;
  } catch(e) {
    grid.innerHTML = `<div class="p5-loading">CONNECTION FAILED — <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:#cc0000">VIEW GITHUB ↗</a></div>`;
  }
}


// ===== CONTACT FORM =====
async function submitForm() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn     = document.querySelector('.btn-p5');

  if (!name || !email || !message) { showMsg('// INCOMPLETE TRANSMISSION', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('// INVALID EMAIL FORMAT', 'error'); return; }

  btn.textContent = 'TRANSMITTING...';
  btn.disabled    = true;
  try {
    const fd = new FormData();
    fd.append('name', name); fd.append('email', email); fd.append('message', message);
    const res  = await fetch('php/contact.php', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      showMsg('// TRANSMISSION RECEIVED ✓', 'success');
      playClick();
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      showMsg('// ERROR: ' + (data.error || 'UNKNOWN'), 'error');
    }
  } catch(e) {
    showMsg('// SERVER OFFLINE — CHECK PHP CONFIG', 'error');
  }
  btn.textContent = 'TRANSMIT ▶';
  btn.disabled    = false;
}

function showMsg(text, type) {
  const el = document.getElementById('formMsg');
  el.textContent = text;
  el.className   = `form-msg ${type}`;
}
