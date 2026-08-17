/**
 * NIHAR AHAMED S — Portfolio Interaction Engine
 * Typewriter · Custom Cursor · Live Clock · Nav · PCB Lab · LLM Terminal · Modals · Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initCursor();
  initAudio();
  initNav();
  initTypewriter();
  initProjectFiltersAndModals();
  initCopyBtns();
  initContactForm();
  initNeuralLab();
});

/* ══════════════════════════════════════════════════════════
   1. LIVE CLOCK (Madurai IST)
══════════════════════════════════════════════════════════ */
function initClock() {
  const el = document.getElementById('live-time');
  if (!el) return;
  const tick = () => {
    try {
      const t = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
      el.textContent = `Madurai, IN ${t} IST`;
    } catch {}
  };
  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
function initCursor() {
  const cur = document.getElementById('cur');
  const dot = document.getElementById('cur-dot');
  if (!cur || !dot || window.matchMedia('(hover:none)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
  });

  (function loop() {
    cx += (mx - cx) * .18;
    cy += (my - cy) * .18;
    cur.style.transform = `translate(${cx - 16}px, ${cy - 16}px)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .proj-card, .pill, .lang-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.transform += ' scale(1.5)';
      cur.style.borderColor = 'rgba(212,175,55,.9)';
      cur.style.background = 'rgba(212,175,55,.07)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.borderColor = 'rgba(212,175,55,.45)';
      cur.style.background = 'transparent';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   3. WEB AUDIO — tactile clicks
══════════════════════════════════════════════════════════ */
let audioCtx, soundOn = true;

function initAudio() {
  const btn  = document.getElementById('sound-toggle');
  const iOn  = document.getElementById('sound-icon-on');
  const iOff = document.getElementById('sound-icon-off');

  window.playClick = function(type = 'click') {
    if (!soundOn) return;
    if (!audioCtx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) audioCtx = new C();
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'scan') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + .08);
      gain.gain.setValueAtTime(.06, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .08);
      osc.start(now); osc.stop(now + .08);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + .04);
      gain.gain.setValueAtTime(.04, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .04);
      osc.start(now); osc.stop(now + .04);
    }
  };

  if (btn) {
    btn.addEventListener('click', () => {
      soundOn = !soundOn;
      iOn?.classList.toggle('hidden', !soundOn);
      iOff?.classList.toggle('hidden', soundOn);
      showToast(soundOn ? 'Audio enabled' : 'Audio muted');
      if (soundOn) window.playClick();
    });
  }

  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', () => window.playClick && window.playClick());
  });
}

/* ══════════════════════════════════════════════════════════
   4. NAV — hamburger + active link + scroll shrink
══════════════════════════════════════════════════════════ */
function initNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileLinks.forEach(l => l.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // Scroll-spy active nav link
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 140 && y < sec.offsetTop + sec.offsetHeight - 140) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${sec.id}`);
        });
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   5. TYPEWRITER
══════════════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words = [
    'Computer Vision Systems.',
    'LLM-Powered Assistants.',
    'MERN Stack Applications.',
    'AI-Native Prototypes.',
    'Intelligent Pipelines.',
  ];

  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (deleting) {
      el.textContent = word.slice(0, ci--);
      if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 60);
    } else {
      el.textContent = word.slice(0, ci++);
      if (ci > word.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 85);
    }
  }
  tick();
}

/* ══════════════════════════════════════════════════════════
   6. PROJECT FILTERS & MODALS
══════════════════════════════════════════════════════════ */
const projectData = {
  'travel-planner': {
    title: 'Travel Planner — Full-Stack Web Application',
    category: 'Full-Stack Enterprise Web Application',
    year: '2024',
    summary: 'Designed and developed a full-stack web application for planning and organizing trips efficiently.',
    architecture: 'MERN stack architecture with interactive mapping interfaces, comprehensive routing algorithms, and end-to-end data persistence.',
    features: [
      'Comprehensive itinerary planning and tracking interfaces.',
      'Interactive mapping with dynamic destination suggestions.',
      'End-to-end user authentication with JWT and secure data storage.',
      'Responsive design ensuring fluid mobile and desktop experiences.'
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Maps API']
  },
  'llm-assistant': {
    title: 'LLM API Integrated Chat Assistants — Conversational AI',
    category: 'Conversational AI & LLM Systems',
    year: '2024',
    summary: 'Developed conversational chat assistants by integrating LLM APIs, enabling intelligent, context-aware user interactions.',
    architecture: 'Python/Node backend proxying multi-model endpoints with prompt templating, schema validation, and SSE streaming token delivery.',
    features: [
      'Multi-turn context retention with automatic token window compression.',
      'Streamed token responses for zero perceptual latency.',
      'Custom function calling for live external data retrieval.',
      'Fallback routing mechanisms to ensure high prompt uptime.'
    ],
    tech: ['LLM APIs', 'Prompt Engineering', 'Python', 'Node.js', 'REST API', 'JSON Schema']
  },
  'pcb-suite': {
    title: 'PCB Defect Detection — Full-Stack Web Application',
    category: 'Full-Stack Enterprise Web Application',
    year: '2024',
    summary: 'Designed and developed a full-stack web application for detecting and analyzing defects in Printed Circuit Boards (PCBs).',
    architecture: 'MERN stack architecture with authenticated REST endpoints, aggregate MongoDB pipelines, and responsive data-visualization widgets.',
    features: [
      'Batch image upload and async queue processing for high-volume inspection runs.',
      'Interactive visual inspection canvas with zoom/pan and anomaly markers.',
      'Defect frequency histograms and batch pass/fail metrics.',
      'Exportable PDF and CSV audit logs for regulatory compliance.'
    ],
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js']
  },
  'rapid-pages': {
    title: 'Landing Pages — Rapid Prototyping',
    category: 'Rapid Prototyping & Modern Web UI',
    year: '2023–2024',
    summary: 'Created multiple responsive, conversion-focused landing pages using rapid prototyping tools.',
    architecture: 'Semantic HTML5, modular CSS design systems, and vanilla JavaScript for ultra-lightweight, 95+ Lighthouse performance.',
    features: [
      'Sub-second first contentful paint (FCP) with zero bloated dependencies.',
      'Fluid micro-animations and intuitive responsive interaction patterns.',
      'Engineered with Cursor, Antigravity, Claude, and modern AI acceleration tools.'
    ],
    tech: ['Rapid Prototyping', 'JavaScript ES6+', 'Modern CSS', 'Cursor', 'Antigravity']
  }
};

function initProjectFiltersAndModals() {
  // Filters
  const filterBtns = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('#proj-grid .proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? 'flex' : 'none';
      });
    });
  });

  // Modals
  const overlay   = document.getElementById('proj-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn  = document.getElementById('modal-close');

  function openModal(id) {
    const d = projectData[id];
    if (!d || !overlay || !modalBody) return;

    modalBody.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div style="border-bottom:1px solid rgba(212,175,55,.15);padding-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:.62rem;color:#d4af37;margin-bottom:.75rem;">
            <span>${d.category}</span><span style="color:#6b6857;">${d.year}</span>
          </div>
          <h2 style="font-family:'Syne',sans-serif;font-weight:700;font-size:1.6rem;color:#f0ede4;line-height:1.2;">${d.title}</h2>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:#6b6857;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.5rem;">Overview</div>
          <p style="font-size:.88rem;color:#b8b49e;line-height:1.78;">${d.summary}</p>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:#6b6857;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.5rem;">Architecture</div>
          <p style="font-family:'JetBrains Mono',monospace;font-size:.68rem;color:#b8b49e;line-height:1.7;background:#0e0e0c;padding:.875rem;border-radius:.65rem;border:1px solid rgba(212,175,55,.14);">${d.architecture}</p>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:#6b6857;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.625rem;">Key Capabilities</div>
          <ul style="display:flex;flex-direction:column;gap:.45rem;">
            ${d.features.map(f => `<li style="display:flex;gap:.5rem;font-family:'JetBrains Mono',monospace;font-size:.7rem;color:#b8b49e;"><span style="color:#d4af37;">▹</span><span>${f}</span></li>`).join('')}
          </ul>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:.6rem;color:#6b6857;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.625rem;">Technology Stack</div>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
            ${d.tech.map(t => `<span style="padding:.25rem .75rem;border-radius:.4rem;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.28);font-family:'JetBrains Mono',monospace;font-size:.65rem;color:#d4af37;">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.playClick) window.playClick();
  }

  function closeModal() {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.dataset.proj);
    });
  });
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.proj));
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ══════════════════════════════════════════════════════════
   7. COPY TO CLIPBOARD + TOAST
══════════════════════════════════════════════════════════ */
function showToast(msg) {
  const t  = document.getElementById('toast');
  const tm = document.getElementById('toast-msg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function initCopyBtns() {
  document.querySelectorAll('.cc-copy, [data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard?.writeText(text)
        .then(() => showToast(`${text} copied!`))
        .catch(() => fallbackCopy(text));
    });
  });

  // Quick email copy on hero
  const qe = document.getElementById('quick-copy-email');
  if (qe) qe.addEventListener('click', () => {
    navigator.clipboard?.writeText('sheiknihar1016@gmail.com')
      .then(() => showToast('Email copied!'))
      .catch(() => fallbackCopy('sheiknihar1016@gmail.com'));
  });

  function fallbackCopy(text) {
    const el = document.createElement('input');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast(`${text} copied!`);
  }
}

/* ══════════════════════════════════════════════════════════
   8. CONTACT FORM
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const role = document.getElementById('contact-role').value;
    const msg  = document.getElementById('contact-message').value;
    const sub  = encodeURIComponent(`Portfolio Inquiry from ${name} (${role})`);
    const body = encodeURIComponent(`Hi Nihar,\n\nName: ${name}\nRole/Org: ${role}\n\nMessage:\n${msg}\n\nSent from portfolio.`);
    window.location.href = `mailto:sheiknihar1016@gmail.com?subject=${sub}&body=${body}`;
    showToast('Launching email client...');
  });
}

/* ══════════════════════════════════════════════════════════
   9. NEURAL LAB / PCB SCANNER
══════════════════════════════════════════════════════════ */
function initNeuralLab() {
  const canvas = document.getElementById('pcb-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const btn = document.getElementById('run-scan-btn');
  const counter = document.getElementById('defect-count');
  const scanLine = document.getElementById('scan-line');

  let w, h;
  const defects = [
    { x: .3, y: .4, w: 80, h: 60, type: 'SHORT CIRCUIT', prob: '98.4%', color: '#ef4444' },
    { x: .65, y: .65, w: 90, h: 50, type: 'SOLDER BRIDGE', prob: '95.1%', color: '#f59e0b' },
    { x: .25, y: .8, w: 75, h: 75, type: 'PASSED PAD', prob: '99.8%', color: '#10b981' }
  ];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    drawSchematic();
  }
  window.addEventListener('resize', resize);

  function drawSchematic() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(212,175,55,.15)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(w*.1, h*.2); ctx.lineTo(w*.3, h*.2); ctx.lineTo(w*.3, h*.4); ctx.lineTo(w*.4, h*.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w*.2, h*.2); ctx.rect(w*.2 - 20, h*.2 - 20, 40, 40); ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w*.4, h*.2); ctx.arc(w*.4, h*.2, 15, 0, Math.PI*2); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w*.35, h*.4); ctx.rect(w*.35 - 30, h*.4 - 30, 60, 60); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w*.45, h*.4); ctx.lineTo(w*.6, h*.4);
    ctx.stroke();
  }

  function drawDefect(d) {
    const dx = d.x * w; const dy = d.y * h;
    
    // Draw box
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dx, dy, d.w, d.h);
    ctx.fillStyle = d.color + '1a'; // 10% opacity
    ctx.fillRect(dx, dy, d.w, d.h);

    // Draw label
    ctx.fillStyle = d.color + 'e6'; // 90% opacity
    ctx.fillRect(dx, dy + d.h, d.w, 35);
    ctx.fillStyle = '#080807';
    ctx.font = '600 10px "JetBrains Mono"';
    ctx.fillText(d.type, dx + 6, dy + d.h + 14);
    ctx.fillText(d.prob, dx + 6, dy + d.h + 26);
    
    // Draw coordinates
    ctx.fillStyle = d.color;
    ctx.fillText(`X:${Math.round(dx)} Y:${Math.round(dy)}`, dx, dy + d.h + 48);
  }

  let scanning = false;
  btn.addEventListener('click', () => {
    if (scanning) return;
    scanning = true;
    if(window.playClick) window.playClick('scan');
    btn.innerHTML = 'SCANNING...';
    btn.style.opacity = '0.5';
    counter.textContent = '0';
    
    drawSchematic();
    
    // Animate scan line
    scanLine.style.transition = 'top 2.5s linear';
    scanLine.style.top = '100%';

    let defectsFound = 0;
    
    // Reveal defects as line passes them
    defects.forEach((d, i) => {
      setTimeout(() => {
        drawDefect(d);
        defectsFound++;
        counter.textContent = defectsFound;
        if(window.playClick) window.playClick();
      }, (d.y * 2500));
    });

    setTimeout(() => {
      scanning = false;
      btn.innerHTML = ' RESTART SCAN';
      btn.style.opacity = '1';
      scanLine.style.transition = 'none';
      scanLine.style.top = '-10px';
    }, 2600);
  });

  resize();
}
