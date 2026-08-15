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

  // Retrieve saved preference or default strictly to light mode
  const savedTheme = safeStorageGet('sharan_theme');
  const currentTheme = savedTheme === 'dark' ? 'dark' : 'light';

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
      (With Elastic Fluid Wave Physics & Mobile Motion Sensor)
   -------------------------------------------------------------------------- */
function initializeCADBlueprintBackground() {
  const canvas = document.getElementById('its-canvas');
  const heroSection = document.getElementById('hero') || canvas?.parentElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let animationFrameId = null;
  let isHeroVisible = true;
  let lastTimestamp = performance.now();
  let globalTime = 0;

  // CAD Pointer Tracking State (Lerped for ultra-smooth movement)
  const targetPointer = { x: -1000, y: -1000, active: false, speed: 0 };
  const currentPointer = { x: -1000, y: -1000 };
  let lastPointerPos = { x: -1000, y: -1000, time: performance.now() };

  // Mobile Device Orientation (Gyroscope / Tilt) State
  const tilt = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    rawGamma: 0,
    rawBeta: 0,
    hasSensor: false
  };

  // Fluid Wave Ripple System
  const ripples = [];
  const MAX_RIPPLES = 12;

  // Structural Member Nodes (Simulating structural truss & coordinate grid)
  let structuralNodes = [];

  function addRipple(x, y, intensity = 0.5, speedMultiplier = 1.0, maxRadius = null) {
    if (x < -100 || y < -100 || x > width + 100 || y > height + 100) return;
    
    if (ripples.length >= MAX_RIPPLES) {
      ripples.shift(); // Remove oldest to maintain strict 60/120fps performance
    }

    const calculatedMaxRadius = maxRadius || Math.min(width, height) * 0.48;

    ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: calculatedMaxRadius,
      speed: (2.8 + Math.min(intensity * 3.5, 5.0)) * speedMultiplier,
      intensity: Math.min(1.0, Math.max(0.15, intensity)),
      life: 1.0,
      decay: 0.016 + Math.random() * 0.006
    });

    requestDraw();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    width = canvas.offsetWidth || window.innerWidth;
    height = canvas.offsetHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStructuralNodes();
    requestDraw();
  }

  window.addEventListener('resize', resize, { passive: true });

  // --------------------------------------------------------------------------
  // POINTER & MOUSE INTERACTION (DESKTOP)
  // --------------------------------------------------------------------------
  function handlePointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const now = performance.now();
    const dt = Math.max(16, now - lastPointerPos.time);
    const dx = clientX - lastPointerPos.x;
    const dy = clientY - lastPointerPos.y;
    const dist = Math.hypot(dx, dy);
    const speed = dist / (dt / 16.67); // px per frame

    targetPointer.x = clientX;
    targetPointer.y = clientY;
    targetPointer.active = true;
    targetPointer.speed = speed;

    // Inject fluid wave ripple if pointer moved with sufficient kinetic speed
    if (dist > 18 && speed > 2.0) {
      const rippleIntensity = Math.min(0.95, 0.2 + speed * 0.035);
      addRipple(clientX, clientY, rippleIntensity, 1.1);
      lastPointerPos = { x: clientX, y: clientY, time: now };
    } else if (lastPointerPos.x === -1000) {
      lastPointerPos = { x: clientX, y: clientY, time: now };
    }

    requestDraw();
  }

  function handlePointerLeave() {
    targetPointer.active = false;
    lastPointerPos = { x: -1000, y: -1000, time: performance.now() };
    requestDraw();
  }

  if (heroSection) {
    heroSection.addEventListener('mousemove', handlePointerMove, { passive: true });
    heroSection.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // ------------------------------------------------------------------------
    // TOUCH INTERACTION (MOBILE / TABLET)
    // ------------------------------------------------------------------------
    heroSection.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const tx = touch.clientX - rect.left;
      const ty = touch.clientY - rect.top;

      targetPointer.x = tx;
      targetPointer.y = ty;
      targetPointer.active = true;
      lastPointerPos = { x: tx, y: ty, time: performance.now() };

      // Tap creates instant fluid ripple
      addRipple(tx, ty, 0.75, 1.2);
      requestDraw();
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const tx = touch.clientX - rect.left;
      const ty = touch.clientY - rect.top;

      const now = performance.now();
      const dt = Math.max(16, now - lastPointerPos.time);
      const dx = tx - lastPointerPos.x;
      const dy = ty - lastPointerPos.y;
      const dist = Math.hypot(dx, dy);
      const speed = dist / (dt / 16.67);

      targetPointer.x = tx;
      targetPointer.y = ty;
      targetPointer.active = true;

      if (dist > 15 && speed > 1.8) {
        addRipple(tx, ty, Math.min(0.85, 0.25 + speed * 0.04), 1.05);
        lastPointerPos = { x: tx, y: ty, time: now };
      }
      requestDraw();
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
      // Smooth fadeout of pointer cursor after touch release
      setTimeout(() => {
        if (!targetPointer.active) return;
        targetPointer.active = false;
        requestDraw();
      }, 400);
    }, { passive: true });

    heroSection.addEventListener('touchcancel', () => {
      targetPointer.active = false;
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // MOBILE DEVICE ORIENTATION & MOTION SENSOR (GYRO / TILT)
  // --------------------------------------------------------------------------
  function handleDeviceOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    tilt.hasSensor = true;

    // gamma: left-to-right tilt in [-90, 90]
    // beta: front-to-back tilt in [-180, 180] (natural phone hold is ~45deg)
    const clampedGamma = Math.max(-45, Math.min(45, e.gamma));
    const clampedBeta = Math.max(-45, Math.min(45, e.beta - 45));

    // Measure angular acceleration/velocity
    const dGamma = clampedGamma - tilt.rawGamma;
    const dBeta = clampedBeta - tilt.rawBeta;
    const angularSpeed = Math.hypot(dGamma, dBeta);

    // If device was moved/tilted quickly, emit fluid wave disturbance
    if (angularSpeed > 3.2) {
      const centerX = width * 0.5 + (clampedGamma / 45) * (width * 0.25);
      const centerY = height * 0.5 + (clampedBeta / 45) * (height * 0.25);
      addRipple(centerX, centerY, Math.min(0.7, angularSpeed * 0.045), 0.9);
    }

    tilt.rawGamma = clampedGamma;
    tilt.rawBeta = clampedBeta;
    tilt.targetX = (clampedGamma / 45) * 35; // max 35px parallax shift
    tilt.targetY = (clampedBeta / 45) * 35;

    requestDraw();
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
  }

  // --------------------------------------------------------------------------
  // STRUCTURAL NODES INITIALIZATION
  // --------------------------------------------------------------------------
  function createStructuralNodes() {
    structuralNodes = [];
    const gridCols = Math.ceil(width / 140) + 1;
    const gridRows = Math.ceil(height / 110) + 1;

    for (let r = 0; r <= gridRows; r++) {
      for (let c = 0; c <= gridCols; c++) {
        const baseX = c * 140 + (r % 2 === 0 ? 0 : 35);
        const baseY = r * 110 + 20;

        structuralNodes.push({
          x: baseX,
          y: baseY,
          baseX: baseX,
          baseY: baseY,
          vx: 0,
          vy: 0,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.01,
          isPinned: r === gridRows || Math.random() > 0.88,
          stress: 0
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // FLUID WAVE FIELD DISPLACEMENT CALCULATION
  // --------------------------------------------------------------------------
  function getWaveDisplacement(x, y, time) {
    let dx = 0;
    let dy = 0;
    let totalStress = 0;

    // 1. Direct interactive cursor elastic displacement
    if (targetPointer.active && currentPointer.x >= 0 && currentPointer.y >= 0) {
      const toMouseX = x - currentPointer.x;
      const toMouseY = y - currentPointer.y;
      const mouseDist = Math.hypot(toMouseX, toMouseY);
      const mouseRadius = 170;

      if (mouseDist < mouseRadius && mouseDist > 0.01) {
        // Elastic radial push & fluid swirl
        const factor = Math.pow(1 - mouseDist / mouseRadius, 2);
        const force = factor * 22;
        const normX = toMouseX / mouseDist;
        const normY = toMouseY / mouseDist;

        dx += normX * force;
        dy += normY * force;
        totalStress += factor * 0.6;
      }
    }

    // 2. Dynamic Wave Ripples (decaying cosine-gaussian wave packets)
    for (let i = 0; i < ripples.length; i++) {
      const rip = ripples[i];
      const rx = x - rip.x;
      const ry = y - rip.y;
      const dist = Math.hypot(rx, ry);
      const delta = dist - rip.radius;

      // Concentric wave packet zone
      if (Math.abs(delta) < 70 && dist > 0.01) {
        const normX = rx / dist;
        const normY = ry / dist;
        
        // Gaussian envelope modulated by sinusoidal wavefront
        const envelope = Math.exp(-Math.pow(delta / 28, 2));
        const wave = Math.sin(delta * 0.12) * envelope * rip.intensity * rip.life * 18;

        dx += normX * wave;
        dy += normY * wave;
        totalStress += Math.abs(wave) * 0.05;
      }
    }

    // 3. Subtle ambient seismic fluid swell
    const ambientWaveX = Math.sin(y * 0.008 + time * 1.4) * Math.cos(x * 0.006 + time * 0.9) * 3.2;
    const ambientWaveY = Math.cos(x * 0.008 + time * 1.2) * Math.sin(y * 0.006 + time * 1.1) * 2.8;

    dx += ambientWaveX + tilt.x * 0.45;
    dy += ambientWaveY + tilt.y * 0.45;

    return { dx, dy, stress: Math.min(1.0, totalStress) };
  }

  // --------------------------------------------------------------------------
  // MAIN DRAW & RENDER LOOP
  // --------------------------------------------------------------------------
  function draw() {
    animationFrameId = null;

    const now = performance.now();
    const delta = Math.min((now - lastTimestamp) / 1000, 0.1);
    lastTimestamp = now;
    globalTime += delta;

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Civil Engineering CAD Color Tokens
    const gridMinorColor = isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(2, 132, 199, 0.055)';
    const gridMajorColor = isDark ? 'rgba(56, 189, 248, 0.13)' : 'rgba(2, 132, 199, 0.13)';
    const axisTickColor = isDark ? 'rgba(56, 189, 248, 0.28)' : 'rgba(2, 132, 199, 0.28)';
    const trussLineColor = isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(13, 148, 136, 0.18)';
    const nodeColor = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(2, 132, 199, 0.65)';
    const crosshairColor = isDark ? 'rgba(56, 189, 248, 0.38)' : 'rgba(2, 132, 199, 0.38)';
    const coordTextColor = isDark ? 'rgba(186, 230, 253, 0.75)' : 'rgba(14, 116, 144, 0.85)';
    const waveRingColor = isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(2, 132, 199, 0.12)';

    // Smooth Lerp for Cursor Tracking
    if (targetPointer.active) {
      if (currentPointer.x === -1000) {
        currentPointer.x = targetPointer.x;
        currentPointer.y = targetPointer.y;
      } else {
        currentPointer.x += (targetPointer.x - currentPointer.x) * 0.12;
        currentPointer.y += (targetPointer.y - currentPointer.y) * 0.12;
      }
    } else {
      currentPointer.x += (width * 0.5 - currentPointer.x) * 0.03;
      currentPointer.y += (height * 0.45 - currentPointer.y) * 0.03;
    }

    // Smooth Lerp for Device Orientation Tilt
    tilt.x += (tilt.targetX - tilt.x) * 0.08;
    tilt.y += (tilt.targetY - tilt.y) * 0.08;

    // Update active ripples life & propagation
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      rip.radius += rip.speed;
      rip.life -= rip.decay;
      rip.intensity *= 0.985;

      if (rip.life <= 0 || rip.radius > rip.maxRadius || rip.intensity < 0.02) {
        ripples.splice(i, 1);
      }
    }

    const minorSize = 25;
    const majorSize = 100;

    // 1. DRAW ELASTIC MINOR BLUEPRINT GRID LINES
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = gridMinorColor;
    ctx.lineWidth = 0.5;

    // Horizontal minor lines with wave curvature
    for (let y = 0; y <= height + minorSize; y += minorSize) {
      let isFirst = true;
      for (let x = 0; x <= width + 50; x += 50) {
        const { dx, dy } = getWaveDisplacement(x, y, globalTime);
        const px = x + dx;
        const py = y + dy;
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }

    // Vertical minor lines with wave curvature
    for (let x = 0; x <= width + minorSize; x += minorSize) {
      let isFirst = true;
      for (let y = 0; y <= height + 50; y += 50) {
        const { dx, dy } = getWaveDisplacement(x, y, globalTime);
        const px = x + dx;
        const py = y + dy;
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // 2. DRAW ELASTIC MAJOR BLUEPRINT GRID LINES
    ctx.beginPath();
    ctx.strokeStyle = gridMajorColor;
    ctx.lineWidth = 1;

    for (let y = 0; y <= height + majorSize; y += majorSize) {
      let isFirst = true;
      for (let x = 0; x <= width + 30; x += 30) {
        const { dx, dy } = getWaveDisplacement(x, y, globalTime);
        const px = x + dx;
        const py = y + dy;
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }

    for (let x = 0; x <= width + majorSize; x += majorSize) {
      let isFirst = true;
      for (let y = 0; y <= height + 30; y += 30) {
        const { dx, dy } = getWaveDisplacement(x, y, globalTime);
        const px = x + dx;
        const py = y + dy;
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // 3. DRAW MAJOR GRID INTERSECTION CROSSES (+)
    ctx.strokeStyle = axisTickColor;
    ctx.lineWidth = 1;
    const tickLen = 4;

    for (let x = 0; x <= width + majorSize; x += majorSize) {
      for (let y = 0; y <= height + majorSize; y += majorSize) {
        const { dx, dy } = getWaveDisplacement(x, y, globalTime);
        const cx = x + dx;
        const cy = y + dy;

        ctx.beginPath();
        ctx.moveTo(cx - tickLen, cy);
        ctx.lineTo(cx + tickLen, cy);
        ctx.moveTo(cx, cy - tickLen);
        ctx.lineTo(cx, cy + tickLen);
        ctx.stroke();
      }
    }

    // 4. DRAW EXPANDING FLUID BLUEPRINT WAVE CONTOURS
    for (let i = 0; i < ripples.length; i++) {
      const rip = ripples[i];
      const alpha = rip.life * rip.intensity * 0.35;
      if (alpha > 0.01) {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = isDark
          ? `rgba(56, 189, 248, ${alpha})`
          : `rgba(2, 132, 199, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 5. UPDATE & DRAW STRUCTURAL TRUSS MEMBERS & NODES
    structuralNodes.forEach((node) => {
      node.pulse += node.pulseSpeed;
      const { dx, dy, stress } = getWaveDisplacement(node.baseX, node.baseY, globalTime);
      node.stress = stress;

      // Elastic node spring interpolation
      const targetX = node.baseX + dx + Math.sin(node.pulse) * 6;
      const targetY = node.baseY + dy + Math.cos(node.pulse * 0.8) * 4;

      node.x += (targetX - node.x) * 0.15;
      node.y += (targetY - node.y) * 0.15;
    });

    // Draw truss connection lines
    const maxLinkDist = 165;
    for (let i = 0; i < structuralNodes.length; i++) {
      const node = structuralNodes[i];

      for (let j = i + 1; j < structuralNodes.length; j++) {
        const other = structuralNodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxLinkDist) {
          const stressBonus = (node.stress + other.stress) * 0.5;
          const alphaFactor = Math.max(0.08, (1 - dist / maxLinkDist) + stressBonus * 0.4);
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = trussLineColor;
          ctx.lineWidth = Math.max(0.4, (1.2 - dist / maxLinkDist) + stressBonus * 0.8);
          ctx.stroke();
        }
      }

      // Draw node circle
      ctx.beginPath();
      const nodeRadius = 2.4 + node.stress * 1.5;
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Draw pinned structural support icon
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
    }

    // 6. DRAW DYNAMIC CAD CURSOR CROSSHAIR & TECHNICAL HUD READOUT
    if (targetPointer.active && currentPointer.x >= 0 && currentPointer.y >= 0) {
      const cx = currentPointer.x;
      const cy = currentPointer.y;

      ctx.save();

      // Infinite CAD crosshair guide lines
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1;

      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // Precision target reticle
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.fill();

      // Technical HUD Readout String
      const { stress } = getWaveDisplacement(cx, cy, globalTime);
      const stressKPa = Math.round(stress * 240 + 45);
      const coordText = `CAD :: X ${Math.round(cx)} . Y ${Math.round(cy)} | σ: ${stressKPa} kPa`;
      
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = coordTextColor;
      ctx.fillText(coordText, Math.min(width - 210, cx + 18), Math.max(20, cy - 10));

      ctx.restore();
    }

    if (shouldAnimate()) {
      requestDraw();
    }
  }

  function shouldAnimate() {
    return !reducedMotionQuery.matches && isHeroVisible && !document.hidden;
  }

  function requestDraw() {
    if (animationFrameId !== null) return;

    if (shouldAnimate()) {
      animationFrameId = requestAnimationFrame(draw);
    } else if (!document.hidden) {
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        draw();
      });
    }
  }

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) {
        lastTimestamp = performance.now();
        requestDraw();
      }
    });
    heroObserver.observe(heroSection || canvas);
  } else {
    isHeroVisible = true;
    requestDraw();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else if (!document.hidden) {
      lastTimestamp = performance.now();
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

    let isDragging = false;
    let dragPointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let wasDragged = false;
    let scrollRafId = null;

    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carousel');
    container.setAttribute('aria-label', id === 'pub-carousel' ? 'Publications' : 'Projects');
    container.setAttribute('tabindex', '0');

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

    function scrollToCard(index, smooth = true) {
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

    function stepNext() {
      const visibleCards = getVisibleCards();
      if (!visibleCards.length) return;
      const currentScroll = container.scrollLeft;
      let targetIdx = visibleCards.findIndex(card => (card.offsetLeft - container.offsetLeft) > currentScroll + 12);
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
        if ((visibleCards[i].offsetLeft - container.offsetLeft) < currentScroll - 12) {
          targetIdx = i;
          break;
        }
      }
      scrollToCard(targetIdx);
    }

    prevBtn?.addEventListener('click', stepPrev);
    nextBtn?.addEventListener('click', stepNext);

    // Keyboard Arrow navigation for accessibility
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepPrev();
      }
    });

    // DESKTOP ONLY: Mouse pointer drag (Touch pointer events are strictly bypassed so phones use 100% native smooth touch momentum)
    container.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;

      isDragging = true;
      dragPointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      wasDragged = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || e.pointerId !== dragPointerId || e.pointerType !== 'mouse') return;

      const currentX = e.clientX;
      const deltaX = currentX - startX;

      if (Math.abs(deltaX) > 6) {
        if (!wasDragged) {
          wasDragged = true;
          container.classList.add('is-dragging');
        }
        container.scrollLeft = startScrollLeft - deltaX;
      }
    });

    function stopDragging(e) {
      if (!isDragging || (e && dragPointerId !== null && e.pointerId !== dragPointerId)) return;
      isDragging = false;
      dragPointerId = null;
      container.classList.remove('is-dragging');

      if (wasDragged) {
        // Prevent accidental link/button clicks if dragging occurred
        const preventClickCapture = (clickEvt) => {
          clickEvt.preventDefault();
          clickEvt.stopPropagation();
          window.removeEventListener('click', preventClickCapture, true);
        };
        window.addEventListener('click', preventClickCapture, true);
        setTimeout(() => window.removeEventListener('click', preventClickCapture, true), 100);

        // Settle smoothly onto closest card
        const closest = getActiveCardIndex();
        scrollToCard(closest);
      }
    }

    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    // Synchronize dots and button states via passive scroll listener
    container.addEventListener('scroll', scheduleControlsUpdate, { passive: true });

    // Store instance reference for filter updates
    carouselInstances[id] = {
      container,
      update: () => {
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
    '.section-header, .timeline-card, .achievements-card, .teaching-card, .project-card, .featured-pub-spotlight, .carousel-wrapper, .skill-category, .contact-card, .contact-form-container'
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
    threshold: 0.02,
    rootMargin: '0px 0px 50px 0px'
  });

  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      el.classList.add('reveal-item', 'is-revealed');
    } else {
      el.classList.add('reveal-item');
      observer.observe(el);
    }
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
