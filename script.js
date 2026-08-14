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
  initializeCarousels();
  initializeFilters();
  initializeCitationModal();
  initializeCommandPalette();
  initializeScrollAnimations();
  initializeContactForm();
});

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Theme selection still applies for the current page when storage is blocked.
  }
}

/* --------------------------------------------------------------------------
   1. THEME SWITCHER & PERSISTENCE
   -------------------------------------------------------------------------- */
function initializeTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElem = document.documentElement;

  // Retrieve saved preference or default to system preference
  const savedTheme = safeStorageGet('sharan_theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  themeBtn?.addEventListener('click', () => {
    const nextTheme = htmlElem.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  function applyTheme(theme) {
    htmlElem.setAttribute('data-theme', theme);
    safeStorageSet('sharan_theme', theme);
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
  let animationFrameId = null;
  let isHeroVisible = true;

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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStructuralNodes();
    requestDraw();
  }

  window.addEventListener('resize', resize, { passive: true });

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
    animationFrameId = null;
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

    if (shouldAnimate()) requestDraw();
  }

  function shouldAnimate() {
    return !reducedMotionQuery.matches && isHeroVisible && !document.hidden;
  }

  function requestDraw() {
    if (animationFrameId !== null) return;

    if (shouldAnimate()) {
      animationFrameId = requestAnimationFrame(draw);
    } else if (!document.hidden) {
      // Keep one fully rendered frame for reduced-motion and offscreen states.
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        draw();
      });
    }
  }

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) requestDraw();
    });
    heroObserver.observe(heroSection || canvas);
  } else {
    // Without visibility observation, preserve the normal animation and still
    // rely on document visibility and reduced-motion preferences.
    isHeroVisible = true;
    requestDraw();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else {
      requestDraw();
    }
  });

  reducedMotionQuery.addEventListener?.('change', requestDraw);

  resize();
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

  let scrollFrameId = null;

  function updateNavigation() {
    scrollFrameId = null;
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
  }

  function scheduleNavigationUpdate() {
    if (scrollFrameId === null) {
      scrollFrameId = requestAnimationFrame(updateNavigation);
    }
  }

  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate, { passive: true });
  updateNavigation();

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
   4. HORIZONTAL CAROUSEL ENGINE & PUBLICATION FILTERING
   -------------------------------------------------------------------------- */
const carouselInstances = {};

function initializeCarousels() {
  const containers = document.querySelectorAll('.carousel-container');

  containers.forEach(container => {
    const id = container.id;
    if (!id) return;

    const wrapper = container.closest('.carousel-wrapper');
    const dotsContainer = wrapper ? wrapper.querySelector('.carousel-dots') : null;
    const prevBtn = document.querySelector(`.carousel-btn.prev-btn[data-target="${id}"]`);
    const nextBtn = document.querySelector(`.carousel-btn.next-btn[data-target="${id}"]`);

    let autoPlayTimer = null;
    let isMouseOver = false;
    let hasFocus = false;
    let isDragging = false;
    let dragPointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let momentumFrameId = null;
    let scrollRafId = null;
    let wasDragged = false;

    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carousel');
    container.setAttribute('aria-label', id === 'pub-carousel' ? 'Publications' : 'Projects');

    function getVisibleCards() {
      return Array.from(container.querySelectorAll('.pub-card, .project-card')).filter(card => {
        return !card.classList.contains('is-filtered-out') && window.getComputedStyle(card).display !== 'none';
      });
    }

    function getActiveCardIndex() {
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return 0;

      const scrollLeft = container.scrollLeft;
      let closestIdx = 0;
      let minDistance = Infinity;

      visibleCards.forEach((card, idx) => {
        const cardLeft = card.offsetLeft - container.offsetLeft;
        const dist = Math.abs(cardLeft - scrollLeft);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      return closestIdx;
    }

    function updateControls() {
      scrollRafId = null;
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return;

      const scrollLeft = container.scrollLeft;
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      const activeIndex = getActiveCardIndex();

      // Update Prev / Next button disabled states
      if (prevBtn) {
        prevBtn.disabled = scrollLeft <= 4;
      }
      if (nextBtn) {
        nextBtn.disabled = scrollLeft >= maxScroll - 4;
      }

      // Render or update navigation dots
      if (dotsContainer) {
        if (dotsContainer.children.length !== visibleCards.length) {
          dotsContainer.innerHTML = '';
          visibleCards.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `carousel-dot ${idx === activeIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => {
              scrollToCard(idx);
            });
            dotsContainer.appendChild(dot);
          });
        } else {
          Array.from(dotsContainer.children).forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
          });
        }
      }
    }

    function scheduleControlsUpdate() {
      if (scrollRafId === null) {
        scrollRafId = requestAnimationFrame(updateControls);
      }
    }

    function cancelMomentum() {
      if (momentumFrameId !== null) {
        cancelAnimationFrame(momentumFrameId);
        momentumFrameId = null;
      }
      container.classList.remove('is-animating');
    }

    function scrollToCard(index, smooth = true) {
      cancelMomentum();
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return;

      const targetIdx = Math.max(0, Math.min(index, visibleCards.length - 1));
      const targetCard = visibleCards[targetIdx];
      if (!targetCard) return;

      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      const clampedScroll = Math.max(0, Math.min(targetLeft, maxScroll));

      container.scrollTo({
        left: clampedScroll,
        behavior: (smooth && !reducedMotionQuery.matches) ? 'smooth' : 'auto'
      });
    }

    // Step precisely 1 card forward or backward
    function stepNext() {
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return;
      const currentScroll = container.scrollLeft;
      let targetIdx = visibleCards.findIndex(card => (card.offsetLeft - container.offsetLeft) > currentScroll + 10);
      if (targetIdx === -1) {
        targetIdx = visibleCards.length - 1;
      }
      scrollToCard(targetIdx);
    }

    function stepPrev() {
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return;
      const currentScroll = container.scrollLeft;
      let targetIdx = 0;
      for (let i = visibleCards.length - 1; i >= 0; i--) {
        if ((visibleCards[i].offsetLeft - container.offsetLeft) < currentScroll - 10) {
          targetIdx = i;
          break;
        }
      }
      scrollToCard(targetIdx);
    }

    prevBtn?.addEventListener('click', stepPrev);
    nextBtn?.addEventListener('click', stepNext);

    // 1:1 Direct Pointer Drag with Kinetic Momentum
    container.addEventListener('pointerdown', (e) => {
      // Only drag on primary click or touch on container
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      cancelMomentum();

      isDragging = true;
      dragPointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      lastX = e.clientX;
      lastTime = performance.now();
      velocity = 0;
      wasDragged = false;

      container.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || e.pointerId !== dragPointerId) return;

      const currentX = e.clientX;
      const deltaX = currentX - startX;

      if (Math.abs(deltaX) > 6) {
        if (!wasDragged) {
          wasDragged = true;
          container.setPointerCapture?.(dragPointerId);
        }
      }

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 8) {
        velocity = (lastX - currentX) / dt; // pixels per ms
        lastX = currentX;
        lastTime = now;
      }

      container.scrollLeft = startScrollLeft - deltaX;
    });

    function stopDragging(e) {
      if (!isDragging || (e && dragPointerId !== null && e.pointerId !== dragPointerId)) return;
      isDragging = false;
      container.classList.remove('is-dragging');

      if (dragPointerId !== null && container.hasPointerCapture?.(dragPointerId)) {
        try {
          container.releasePointerCapture(dragPointerId);
        } catch {}
      }
      dragPointerId = null;

      // Prevent triggering click on links/buttons inside card if dragging occurred
      if (wasDragged) {
        const preventClickCapture = (clickEvt) => {
          clickEvt.preventDefault();
          clickEvt.stopPropagation();
          window.removeEventListener('click', preventClickCapture, true);
        };
        window.addEventListener('click', preventClickCapture, true);
        setTimeout(() => window.removeEventListener('click', preventClickCapture, true), 100);
      }

      // Kinetic Momentum Flick Deceleration
      if (Math.abs(velocity) > 0.15 && !reducedMotionQuery.matches) {
        let currentVelocity = velocity * 14;
        const friction = 0.92;
        container.classList.add('is-animating');

        function momentumStep() {
          if (Math.abs(currentVelocity) > 0.5 && !isDragging) {
            container.scrollLeft += currentVelocity;
            currentVelocity *= friction;
            momentumFrameId = requestAnimationFrame(momentumStep);
          } else {
            cancelMomentum();
            // Smoothly settle onto closest card
            const closest = getActiveCardIndex();
            scrollToCard(closest);
          }
        }
        momentumFrameId = requestAnimationFrame(momentumStep);
      } else {
        // Settle smoothly to nearest card
        const closest = getActiveCardIndex();
        scrollToCard(closest);
      }
    }

    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    // Scroll listener with requestAnimationFrame
    container.addEventListener('scroll', scheduleControlsUpdate, { passive: true });

    // Subtle Smooth Autoplay (6s interval)
    function startAutoPlay() {
      stopAutoPlay();
      if (reducedMotionQuery.matches || document.hidden) return;

      autoPlayTimer = setInterval(() => {
        if (isMouseOver || hasFocus || isDragging || document.hidden) return;
        const visibleCards = getVisibleCards();
        if (visibleCards.length <= 1) return;

        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        const currentActive = getActiveCardIndex();

        if (currentActive >= visibleCards.length - 1 || container.scrollLeft >= maxScroll - 15) {
          scrollToCard(0);
        } else {
          scrollToCard(currentActive + 1);
        }
      }, 6000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    container.addEventListener('mouseenter', () => { isMouseOver = true; }, { passive: true });
    container.addEventListener('mouseleave', () => { isMouseOver = false; }, { passive: true });
    container.addEventListener('touchstart', () => { isMouseOver = true; }, { passive: true });
    container.addEventListener('touchend', () => { isMouseOver = false; }, { passive: true });
    container.addEventListener('focusin', () => { hasFocus = true; });
    container.addEventListener('focusout', (e) => {
      if (!container.contains(e.relatedTarget)) hasFocus = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoPlay();
      else startAutoPlay();
    });
    reducedMotionQuery.addEventListener?.('change', startAutoPlay);

    startAutoPlay();

    // Store instance reference for filter updates
    carouselInstances[id] = {
      container,
      update: () => {
        cancelMomentum();
        container.scrollTo({ left: 0, behavior: 'auto' });
        if (dotsContainer) dotsContainer.innerHTML = '';
        setTimeout(updateControls, 40);
      }
    };

    // Initial controls calculation
    updateControls();
  });
}

function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterBtns.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');

      pubCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isFilteredOut = filter !== 'all' && category !== filter;
        card.classList.toggle('is-filtered-out', isFilteredOut);
        card.setAttribute('aria-hidden', String(isFilteredOut));
      });

      // Reset publication carousel scroll position & update dots
      if (carouselInstances['pub-carousel']) {
        carouselInstances['pub-carousel'].update();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. BIBTEX CITATION MODAL & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
let activeModalController = null;

function createModalController({ modal, closeButtons = [], initialFocus = null, onClose = null }) {
  if (!modal) return { open: () => {}, close: () => {} };

  let previousFocus = null;
  const pageRegions = ['header', 'main', 'footer']
    .map(selector => document.querySelector(selector))
    .filter(Boolean);

  function getFocusableElements() {
    return Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => (
      !element.hidden
      && element.getAttribute('aria-hidden') !== 'true'
      && element.getClientRects().length > 0
    ));
  }

  function open(trigger = document.activeElement) {
    if (activeModalController && activeModalController !== controller) {
      activeModalController.close();
      trigger = document.activeElement;
    }

    previousFocus = trigger instanceof HTMLElement ? trigger : null;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    pageRegions.forEach(region => region.setAttribute('inert', ''));
    activeModalController = controller;

    const focusTarget = typeof initialFocus === 'function' ? initialFocus() : initialFocus;
    requestAnimationFrame(() => (focusTarget || getFocusableElements()[0])?.focus());
  }

  function close() {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    pageRegions.forEach(region => region.removeAttribute('inert'));
    if (activeModalController === controller) activeModalController = null;
    onClose?.();
    previousFocus?.focus();
    previousFocus = null;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const controller = { open, close };
  closeButtons.forEach(button => button?.addEventListener('click', close));
  return controller;
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = document.createElement('i');
  icon.className = 'fas fa-check-circle';
  icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(icon, document.createTextNode(' '), text);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  if (!copied) throw new Error('Copy command was not accepted');
}

function initializeCitationModal() {
  const citeModal = document.getElementById('citeModal');
  const citeModalClose = document.getElementById('citeModalClose');
  const bibtexText = document.getElementById('bibtexText');
  const copyBibtexBtn = document.getElementById('copyBibtexBtn');
  const citeBtns = document.querySelectorAll('.cite-btn');
  const modalController = createModalController({
    modal: citeModal,
    closeButtons: [citeModalClose],
    initialFocus: citeModalClose
  });

  citeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (bibtexText) bibtexText.textContent = bibtex;
      modalController.open(btn);
    });
  });

  const copyButtonDefaultHtml = copyBibtexBtn?.innerHTML;
  let copyResetTimer = null;

  copyBibtexBtn?.addEventListener('click', async () => {
    if (bibtexText) {
      try {
        await copyText(bibtexText.textContent);
        copyBibtexBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        showToast('BibTeX citation copied to clipboard!');
        clearTimeout(copyResetTimer);
        copyResetTimer = setTimeout(() => {
          copyBibtexBtn.innerHTML = copyButtonDefaultHtml;
        }, 2000);
      } catch {
        showToast('Could not copy automatically. Select the citation and copy it manually.');
      }
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

  function resetCmd() {
    if (cmdInput) cmdInput.value = '';
    selectedIndex = -1;
    filterResults('');
  }

  const modalController = createModalController({
    modal: cmdModal,
    initialFocus: () => cmdInput,
    onClose: resetCmd
  });

  function openCmd(trigger = document.activeElement) {
    selectedIndex = 0;
    updateSelection();
    modalController.open(trigger);
  }

  function closeCmd() {
    modalController.close();
  }

  cmdToggleBtn?.addEventListener('click', () => openCmd(cmdToggleBtn));

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
          targetElem.scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth' });
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
  const animatedElements = document.querySelectorAll(
    '.section-header, .timeline-card, .research-pipeline-card, .achievements-card, .teaching-card, .featured-pub-spotlight, .carousel-wrapper, .skill-category, .contact-card, .contact-form-container'
  );

  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    animatedElements.forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => {
    el.classList.add('reveal-item');
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
