/* ==========================================================================
   AHNAF RAFI SHARAN — PORTFOLIO INTERACTIVITY SCRIPT
   Features: Theme Engine, Canvas ITS Node Network (Retina Scaled),
             Publication Filtering, BibTeX Citation Modal,
             Cmd+K Command Palette with Full Keyboard Nav, Nav Scrollspy.
   Color System: Executive Civil Navy, Blueprint Cyan, Steel Slate & Amber Gold.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeCADBlueprintBackground();
  initializeNav();
  initializeFilters();
  initializeCitationModal();
  initializeCommandPalette();
  initializeScrollAnimations();
  initializeContactForm();
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
   2. CIVIL ENGINEERING STRUCTURAL BLUEPRINT & CAD GRID CANVAS
   -------------------------------------------------------------------------- */
function initializeCADBlueprintBackground() {
  const canvas = document.getElementById('its-canvas');
  const heroSection = document.getElementById('hero') || canvas?.parentElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  // CAD Mouse Tracking State (Lerped for ultra-smooth movement)
  let targetMouse = { x: -1000, y: -1000, active: false };
  let currentMouse = { x: -1000, y: -1000 };

  // Structural Member Nodes (Simulating structural truss & coordinate grid)
  let structuralNodes = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    createStructuralNodes();
  }

  window.addEventListener('resize', resize);

  // Track mouse over hero section
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
      targetMouse.active = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetMouse.active = false;
    });
  }

  function createStructuralNodes() {
    structuralNodes = [];
    const gridCols = Math.ceil(width / 160);
    const gridRows = Math.ceil(height / 120);

    for (let r = 0; r <= gridRows; r++) {
      for (let c = 0; c <= gridCols; c++) {
        const baseX = c * 160 + (r % 2 === 0 ? 0 : 40);
        const baseY = r * 120 + 30;
        
        structuralNodes.push({
          x: baseX + (Math.random() - 0.5) * 30,
          y: baseY + (Math.random() - 0.5) * 20,
          baseX: baseX,
          baseY: baseY,
          pulse: Math.random() * Math.PI * 2,
          isPinned: r === gridRows || Math.random() > 0.85
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Civil CAD & Blueprint Color Palette
    const gridMinorColor = isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(2, 132, 199, 0.06)';
    const gridMajorColor = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)';
    const axisTickColor = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)';
    const trussLineColor = isDark ? 'rgba(45, 212, 191, 0.18)' : 'rgba(13, 148, 136, 0.16)';
    const nodeColor = isDark ? 'rgba(56, 189, 248, 0.65)' : 'rgba(2, 132, 199, 0.6)';
    const crosshairColor = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)';
    const coordTextColor = isDark ? 'rgba(186, 230, 253, 0.65)' : 'rgba(14, 116, 144, 0.75)';

    // Smooth Mouse Interpolation (Lerp)
    if (targetMouse.active) {
      if (currentMouse.x === -1000) {
        currentMouse.x = targetMouse.x;
        currentMouse.y = targetMouse.y;
      } else {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
      }
    } else {
      currentMouse.x += (width * 0.5 - currentMouse.x) * 0.02;
      currentMouse.y += (height * 0.4 - currentMouse.y) * 0.02;
    }

    const minorSize = 20;
    const majorSize = 80;

    // 1. DRAW MINOR BLUEPRINT GRID LINES
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = gridMinorColor;
    ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += minorSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += minorSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 2. DRAW MAJOR BLUEPRINT GRID LINES
    ctx.beginPath();
    ctx.strokeStyle = gridMajorColor;
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += majorSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += majorSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. DRAW MAJOR GRID INTERSECTION CROSSES (+)
    ctx.strokeStyle = axisTickColor;
    ctx.lineWidth = 1;
    const tickLen = 4;
    for (let x = 0; x < width; x += majorSize) {
      for (let y = 0; y < height; y += majorSize) {
        ctx.beginPath();
        ctx.moveTo(x - tickLen, y);
        ctx.lineTo(x + tickLen, y);
        ctx.moveTo(x, y - tickLen);
        ctx.lineTo(x, y + tickLen);
        ctx.stroke();
      }
    }

    // 4. DRAW STRUCTURAL TRUSS MEMBERS & NODES
    structuralNodes.forEach((node, i) => {
      node.pulse += 0.015;
      node.x = node.baseX + Math.sin(node.pulse) * 6;
      node.y = node.baseY + Math.cos(node.pulse * 0.8) * 4;

      for (let j = i + 1; j < structuralNodes.length; j++) {
        const other = structuralNodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 170) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = trussLineColor;
          ctx.lineWidth = Math.max(0.4, 1.2 - dist / 170);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      if (node.isPinned) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y + 3);
        ctx.lineTo(node.x - 4, node.y + 9);
        ctx.lineTo(node.x + 4, node.y + 9);
        ctx.closePath();
        ctx.strokeStyle = axisTickColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // 5. DRAW DYNAMIC CAD CURSOR CROSSHAIR & HUD READOUT
    if (targetMouse.active && currentMouse.x >= 0 && currentMouse.y >= 0) {
      const cx = currentMouse.x;
      const cy = currentMouse.y;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1;

      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.fill();

      const coordText = `CAD :: X ${Math.round(cx)} . Y ${Math.round(cy)}`;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = coordTextColor;
      ctx.fillText(coordText, cx + 18, cy - 10);

      ctx.restore();
    }

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
   5. BIBTEX CITATION MODAL & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

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
        showToast('BibTeX citation copied to clipboard!');
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

/* --------------------------------------------------------------------------
   8. CONTACT FORM SUBMISSION TO AHNAF@CE.UIU.AC.BD
   -------------------------------------------------------------------------- */
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const subject = document.getElementById('subject')?.value || 'Academic / Portfolio Inquiry';
    const message = document.getElementById('message')?.value || '';

    const bodyText = `Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:ahnaf@ce.uiu.ac.bd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoUrl;
  });
}

