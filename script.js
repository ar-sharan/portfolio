/* ==========================================================================
   AHNAF RAFI SHARAN — PORTFOLIO INTERACTIVITY SCRIPT
   Features: Theme Engine, Canvas ITS Node Network (Retina Scaled),
             Publication Filtering, BibTeX Citation Modal,
             Cmd+K Command Palette with Full Keyboard Nav, Nav Scrollspy.
   Color System: Executive Civil Navy, Blueprint Cyan, Steel Slate & Amber Gold.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeITSBackground();
  initializeNav();
  initializeFilters();
  initializeCitationModal();
  initializeCommandPalette();
  initializeScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER & PERSISTENCE
   -------------------------------------------------------------------------- */
function initializeTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElem = document.documentElement;

  // Retrieve saved preference or default to system preference
  const savedTheme = localStorage.getItem('sharan_theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  themeBtn?.addEventListener('click', () => {
    const nextTheme = htmlElem.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  function applyTheme(theme) {
    htmlElem.setAttribute('data-theme', theme);
    localStorage.setItem('sharan_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    }
  }
}

/* --------------------------------------------------------------------------
   2. INTELLIGENT TRANSPORTATION SYSTEM (ITS) CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initializeITSBackground() {
  const canvas = document.getElementById('its-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let nodes = [];
  const maxNodes = 45;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    createNodes();
  }

  window.addEventListener('resize', resize);

  function createNodes() {
    nodes = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI,
        type: Math.random() > 0.7 ? 'signal' : 'node'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    // Executive Blueprint Cyan & Geospatial Teal Node colors
    const nodeColor = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(2, 132, 199, 0.65)';
    const lineColor = isDark ? 'rgba(45, 212, 191, 0.15)' : 'rgba(13, 148, 136, 0.14)';
    const signalColor = isDark ? '#fbbf24' : '#d97706';

    // Draw connecting paths (representing transportation network)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - dist / 130;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      node.pulse += 0.03;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'signal' ? signalColor : nodeColor;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
}

/* --------------------------------------------------------------------------
   3. NAVIGATION BAR, SCROLLSPY & PROGRESS
   -------------------------------------------------------------------------- */
function initializeNav() {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scroll Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    // Sticky Navbar
    if (navbar) {
      if (scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    // Scrollspy Active Nav
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isActive);
    navToggle.setAttribute('aria-expanded', isActive);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle?.classList.remove('active');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when tapping outside header
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') && !navbar?.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   4. PUBLICATION CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      pubCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'grid';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. BIBTEX CITATION MODAL
   -------------------------------------------------------------------------- */
function initializeCitationModal() {
  const citeModal = document.getElementById('citeModal');
  const citeModalClose = document.getElementById('citeModalClose');
  const bibtexText = document.getElementById('bibtexText');
  const copyBibtexBtn = document.getElementById('copyBibtexBtn');
  const citeBtns = document.querySelectorAll('.cite-btn');

  citeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (bibtexText) bibtexText.textContent = bibtex;
      citeModal?.classList.add('active');
    });
  });

  citeModalClose?.addEventListener('click', () => {
    citeModal?.classList.remove('active');
  });

  citeModal?.addEventListener('click', (e) => {
    if (e.target === citeModal) citeModal.classList.remove('active');
  });

  // Escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && citeModal?.classList.contains('active')) {
      citeModal.classList.remove('active');
    }
  });

  copyBibtexBtn?.addEventListener('click', () => {
    if (bibtexText) {
      navigator.clipboard.writeText(bibtexText.textContent).then(() => {
        const originalText = copyBibtexBtn.innerHTML;
        copyBibtexBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          copyBibtexBtn.innerHTML = originalText;
        }, 2000);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. COMMAND PALETTE (CMD+K / CTRL+K) WITH KEYBOARD NAV
   -------------------------------------------------------------------------- */
function initializeCommandPalette() {
  const cmdModal = document.getElementById('cmdModal');
  const cmdToggleBtn = document.getElementById('cmdToggleBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = Array.from(document.querySelectorAll('.cmd-item'));
  let selectedIndex = -1;

  function openCmd() {
    cmdModal?.classList.add('active');
    cmdInput?.focus();
    selectedIndex = 0;
    updateSelection();
  }

  function closeCmd() {
    cmdModal?.classList.remove('active');
    if (cmdInput) cmdInput.value = '';
    selectedIndex = -1;
    filterResults('');
  }

  cmdToggleBtn?.addEventListener('click', openCmd);

  function getVisibleItems() {
    return cmdItems.filter(item => item.style.display !== 'none');
  }

  function updateSelection() {
    const visible = getVisibleItems();
    cmdItems.forEach(item => item.classList.remove('selected'));
    if (visible.length === 0) {
      selectedIndex = -1;
      return;
    }
    if (selectedIndex < 0) selectedIndex = 0;
    if (selectedIndex >= visible.length) selectedIndex = visible.length - 1;

    visible[selectedIndex].classList.add('selected');
    visible[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdModal?.classList.contains('active')) closeCmd();
      else openCmd();
      return;
    }

    if (!cmdModal?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeCmd();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible.length > 0) {
        selectedIndex = (selectedIndex + 1) % visible.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible.length > 0) {
        selectedIndex = (selectedIndex - 1 + visible.length) % visible.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const visible = getVisibleItems();
      if (visible.length > 0 && selectedIndex >= 0 && selectedIndex < visible.length) {
        visible[selectedIndex].click();
      }
    }
  });

  cmdModal?.addEventListener('click', (e) => {
    if (e.target === cmdModal) closeCmd();
  });

  cmdInput?.addEventListener('input', (e) => {
    filterResults(e.target.value.toLowerCase().trim());
  });

  function filterResults(query) {
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    selectedIndex = 0;
    updateSelection();
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');

      closeCmd();

      if (action === 'goto' && target) {
        const targetElem = document.querySelector(target);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'theme') {
        document.getElementById('themeToggleBtn')?.click();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL ENTRANCE ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.pub-card, .teaching-card, .project-card, .skill-category, .timeline-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}
