/**
 * Quitta — Interactive Engine
 * Micro-interactions, Cursor proximity, Spring physics, 3D Tilt & Ambient Canvas
 */

// 1. Ambient Background Particles with Physics Canvas
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.35 + 0.1,
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse Proximity Repulsion / Attraction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(46, 230, 192, ${p.baseAlpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(28, 199, 166, ${0.1 * (1 - dist2 / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// 2. Custom Cursor with Spring Physics & Hover States
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Spring physics interpolation for the ring
  function updateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Add hover class to interactive targets
  const interactiveElements = document.querySelectorAll(
    'a, button, input, .spotlight-card, .tilt-element, .faq-question'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// 3. Magnetic Button Physics
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });
}

// 4. 3D Tilt Elements (Cursor Proximity Angle)
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 5. Scroll Progress Bar & Header Shadow
function initScrollFeatures() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

// 6. Dynamic Speed Marquee on Scroll
function initDynamicMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  let currentPos = 0;
  let speed = 1.2;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    speed = 1.2 + Math.min(delta * 0.15, 6);
    lastScrollY = window.scrollY;
  });

  function step() {
    currentPos -= speed;
    speed += (1.2 - speed) * 0.05; // spring return to base speed

    // Reset loop
    const firstContentWidth = track.firstElementChild ? track.firstElementChild.offsetWidth : 2000;
    if (Math.abs(currentPos) >= firstContentWidth) {
      currentPos = 0;
    }

    track.style.transform = `translateX(${currentPos}px)`;
    requestAnimationFrame(step);
  }

  step();
}

// 7. Interactive Debt Simulator with Live Calculation & Custom WhatsApp Message
function initSimulator() {
  const parcelaSlider = document.getElementById('parcela-slider');
  const parcelasQtdSlider = document.getElementById('parcelas-qtd-slider');
  const parcelaDisplay = document.getElementById('parcela-display');
  const qtdDisplay = document.getElementById('qtd-display');
  const resParcelaAtual = document.getElementById('res-parcela-atual');
  const resParcelaJusta = document.getElementById('res-parcela-justa');
  const barFillJusta = document.getElementById('bar-fill-justa');
  const resEconomiaTotal = document.getElementById('res-economia-total');
  const resPercentBadge = document.getElementById('res-percent-badge');
  const simWppBtn = document.getElementById('sim-whatsapp-btn');
  const typeButtons = document.querySelectorAll('.type-btn');

  let currentType = 'Veículo';
  let reductionRate = 0.60; // 60% standard average reduction

  const typeRates = {
    veiculo: { name: 'Financiamento de Veículo', rate: 0.60 },
    emprestimo: { name: 'Empréstimo Pessoal/Consignado', rate: 0.55 },
    cartao: { name: 'Cartão de Crédito', rate: 0.75 },
    empresa: { name: 'Dívida Empresarial', rate: 0.65 },
  };

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const typeKey = btn.getAttribute('data-type');
      if (typeRates[typeKey]) {
        currentType = typeRates[typeKey].name;
        reductionRate = typeRates[typeKey].rate;
        calculate();
      }
    });
  });

  function formatBRL(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calculate() {
    const valorParcela = parseFloat(parcelaSlider.value);
    const qtdParcelas = parseInt(parcelasQtdSlider.value, 10);

    parcelaDisplay.textContent = formatBRL(valorParcela);
    qtdDisplay.textContent = `${qtdParcelas}x parcelas`;

    // Calculation
    const parcelaJusta = valorParcela * (1 - reductionRate);
    const economiaMensal = valorParcela - parcelaJusta;
    const economiaTotal = economiaMensal * qtdParcelas;
    const percentInt = Math.round(reductionRate * 100);

    // Update UI elements
    resParcelaAtual.textContent = formatBRL(valorParcela);
    resParcelaJusta.textContent = formatBRL(parcelaJusta);
    if (barFillJusta) barFillJusta.style.width = `${Math.round((1 - reductionRate) * 100)}%`;
    resEconomiaTotal.textContent = formatBRL(economiaTotal);
    resPercentBadge.textContent = `Desconto estimado de ${percentInt}%`;

    // Dynamic WhatsApp Link
    const msg = `Olá! Fiz uma simulação no site da Quitta para ${currentType}:
• Minha parcela atual é de ${formatBRL(valorParcela)} em ${qtdParcelas}x.
• A estimativa de parcela justa ficou em ${formatBRL(parcelaJusta)}.
• Economia estimada: ${formatBRL(economiaTotal)}.
Gostaria de saber como iniciar a perícia gratuita do meu contrato.`;

    const encodedMsg = encodeURIComponent(msg);
    simWppBtn.href = `https://wa.me/5511947576346?text=${encodedMsg}`;
  }

  parcelaSlider.addEventListener('input', calculate);
  parcelasQtdSlider.addEventListener('input', calculate);

  // Initial Run
  calculate();
}

// 8. Number Counting Animation with Intersection Observer
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-counter');
  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach((counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
            let current = 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart physics curve
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              current = target * easeProgress;

              if (decimals > 0) {
                counter.textContent = current.toFixed(decimals).replace('.', ',');
              } else {
                counter.textContent = Math.floor(current).toLocaleString('pt-BR');
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                if (decimals > 0) {
                  counter.textContent = target.toFixed(decimals).replace('.', ',');
                } else {
                  counter.textContent = target.toLocaleString('pt-BR');
                }
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

// 9. FAQ Accordion with Spring Transition
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 10. Hero Interactive Blue LEDs / Quantum Grain Canvas that Reacts to Mouse
function initHeroBlueLEDs() {
  const canvas = document.getElementById('hero-particles-canvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Quantum grains / Blue LED nodes
  const leds = [];
  const ledCount = 130;

  // Blue / Teal palette
  const colors = [
    { r: 46, g: 230, b: 192 }, // Cyan/Teal glow
    { r: 35, g: 77, b: 143 },  // Royal Navy Blue
    { r: 59, g: 130, b: 246 }, // Vibrant Electric Blue
    { r: 96, g: 165, b: 250 }, // Soft Sky Blue
    { r: 28, g: 199, b: 166 }, // Quitta Mint
  ];

  for (let i = 0; i < ledCount; i++) {
    const col = colors[Math.floor(Math.random() * colors.length)];
    leds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      originX: 0,
      originY: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 1.2,
      baseAlpha: Math.random() * 0.55 + 0.2,
      currentAlpha: 0.3,
      col: col,
      glow: Math.random() * 12 + 6,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  let mouseX = -9999;
  let mouseY = -9999;
  let isHovering = false;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovering = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
    isHovering = false;
  });

  function render(now) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < leds.length; i++) {
      const led = leds[i];

      // Subtle float motion
      led.x += led.vx;
      led.y += led.vy;

      if (led.x < 0) led.x = width;
      if (led.x > width) led.x = 0;
      if (led.y < 0) led.y = height;
      if (led.y > height) led.y = 0;

      // Mouse Proximity Physics (Interactive Ripple & Light Up)
      const dx = mouseX - led.x;
      const dy = mouseY - led.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxProximity = 180;

      let proximityFactor = 0;
      if (dist < maxProximity) {
        proximityFactor = 1 - dist / maxProximity;

        // Push away with soft spring repulsion
        const force = proximityFactor * 3.5;
        led.x -= (dx / dist) * force;
        led.y -= (dy / dist) * force;
      }

      // Pulse alpha + light up dramatically near cursor
      led.pulsePhase += led.pulseSpeed;
      const pulse = (Math.sin(led.pulsePhase) + 1) * 0.5;
      const targetAlpha = led.baseAlpha + pulse * 0.2 + proximityFactor * 0.8;
      led.currentAlpha += (targetAlpha - led.currentAlpha) * 0.15;

      const size = led.radius + proximityFactor * 2.5;

      // Draw Outer Blue Glow
      ctx.save();
      ctx.shadowBlur = led.glow + proximityFactor * 20;
      ctx.shadowColor = `rgba(${led.col.r}, ${led.col.g}, ${led.col.b}, ${Math.min(led.currentAlpha * 1.2, 1)})`;

      ctx.beginPath();
      ctx.arc(led.x, led.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${led.col.r}, ${led.col.g}, ${led.col.b}, ${Math.min(led.currentAlpha, 1)})`;
      ctx.fill();
      ctx.restore();

      // Connect constellation lines when near mouse
      if (proximityFactor > 0.15) {
        for (let j = i + 1; j < leds.length; j++) {
          const led2 = leds[j];
          const d2 = Math.hypot(led.x - led2.x, led.y - led2.y);
          if (d2 < 90) {
            ctx.beginPath();
            ctx.moveTo(led.x, led.y);
            ctx.lineTo(led2.x, led2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - d2 / 90) * proximityFactor * 0.4})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    }

    // Connect cursor directly with nearby LEDs
    if (isHovering) {
      for (let i = 0; i < leds.length; i++) {
        const led = leds[i];
        const dist = Math.hypot(mouseX - led.x, mouseY - led.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(led.x, led.y);
          ctx.strokeStyle = `rgba(46, 230, 192, ${(1 - dist / 130) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// 11. Futuristic Video Player Modal Controller
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const triggerBtn1 = document.getElementById('hero-video-trigger');
  const triggerBtn2 = document.getElementById('hero-card-play-btn');
  const closeBtn = document.getElementById('video-modal-close');
  const backdrop = document.getElementById('video-modal-close-backdrop');
  const video = document.getElementById('quitta-main-video');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (video) {
      video.pause();
    }
  }

  if (triggerBtn1) triggerBtn1.addEventListener('click', openModal);
  if (triggerBtn2) triggerBtn2.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeroBlueLEDs();
  initCustomCursor();
  initMagneticButtons();
  init3DTilt();
  initScrollFeatures();
  initDynamicMarquee();
  initSimulator();
  initCounterAnimation();
  initFAQ();
  initVideoModal();
});

