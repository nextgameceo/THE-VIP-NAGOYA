/* ============================================
   THE V.I.P NAGOYA – Main JavaScript
   ============================================ */

(function () {
  'use strict';

  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    backToTop.classList.toggle('visible', y > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  function addRevealClass() {
    const sections = document.querySelectorAll(
      '.about-grid, .about-text, .about-visual, .system-card, .access-info, .access-map, .contact-form, .contact-sns, .section-header'
    );
    sections.forEach(el => el.classList.add('reveal'));
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function initReveal() {
    addRevealClass();
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.concept-card').forEach(card => {
    cardObserver.observe(card);
  });

  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 768 ? 18 : 35;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size    = Math.random() * 4 + 1.5;
      const left    = Math.random() * 100;
      const delay   = Math.random() * 10;
      const dur     = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.5 + 0.1;
      const isGold  = Math.random() > 0.65;
      p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:-10px;animation-delay:${delay}s;animation-duration:${dur}s;background:${isGold ? '#c9a96e' : '#e8618c'};opacity:${opacity};filter:blur(${size > 3 ? '1px' : '0'});border-radius:50%;`;
      container.appendChild(p);
    }
  }

  const heroScroll = document.getElementById('heroScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const submitBtn  = document.getElementById('submitBtn');
      const btnText    = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      submitBtn.classList.add('loading');
      btnText.textContent = '送信中';
      const data = {
        name:    form.name.value.trim(),
        email:   form.email.value.trim(),
        tel:     form.tel.value.trim(),
        type:    form.type.value,
        date:    form.date.value,
        message: form.message.value.trim(),
        submitted_at: new Date().toISOString(),
      };
      try {
        await fetch('tables/contact_requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn('API save skipped:', err);
      }
      await new Promise(r => setTimeout(r, 800));
      submitBtn.classList.remove('loading');
      btnText.textContent = originalText;
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function validateForm() {
    let valid = true;
    const name      = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!name.value.trim()) {
      nameError.textContent = 'お名前を入力してください';
      name.classList.add('error');
      valid = false;
    } else {
      nameError.textContent = '';
      name.classList.remove('error');
    }
    const email      = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      emailError.textContent = 'メールアドレスを入力してください';
      email.classList.add('error');
      valid = false;
    } else if (!emailRe.test(email.value.trim())) {
      emailError.textContent = '正しいメールアドレスを入力してください';
      email.classList.add('error');
      valid = false;
    } else {
      emailError.textContent = '';
      email.classList.remove('error');
    }
    const message      = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    if (!message.value.trim()) {
      messageError.textContent = 'メッセージを入力してください';
      message.classList.add('error');
      valid = false;
    } else {
      messageError.textContent = '';
      message.classList.remove('error');
    }
    return valid;
  }

  ['name', 'email', 'message'].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(fieldId + 'Error');
        if (errEl) errEl.textContent = '';
      });
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--pink-light)' : '';
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  function init() {
    createParticles();
    initReveal();
    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createParticles, 300);
  });

})();
