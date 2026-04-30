/**
 * O-sea Bora Bora — main.js
 * Vanilla JS — zéro dépendance
 * Fonctions : nav sticky, burger menu, i18n toggle, animations, FAQ
 */

'use strict';

/* ============================================================
   CONSTANTES
   ============================================================ */
const WHATSAPP_URL = 'https://wa.me/68987218122';
const LANG_KEY = 'osea_lang';

/* ============================================================
   UTILITAIRE — querySelectorAll raccourci
   ============================================================ */
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/* ============================================================
   STICKY HEADER
   Transparent sur hero → opaque après scroll
   ============================================================ */
function initStickyHeader() {
  const header = $('.site-header');
  if (!header) return;

  function updateHeader() {
    const scrolled = window.scrollY > 60;
    if (scrolled) {
      header.classList.add('is-solid');
      header.classList.remove('is-transparent');
    } else {
      header.classList.add('is-transparent');
      header.classList.remove('is-solid');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ============================================================
   BURGER MENU MOBILE
   ============================================================ */
function initBurgerMenu() {
  const burger = $('.nav-burger');
  const mobileNav = $('.nav-mobile');
  if (!burger || !mobileNav) return;

  function openMenu() {
    burger.classList.add('is-open');
    mobileNav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Fermer sur clic lien
  $$('a', mobileNav).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer sur Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================================
   NAV DROPDOWN (desktop)
   ============================================================ */
function initNavDropdowns() {
  $$('.nav-dropdown').forEach(dropdown => {
    const toggle = $('.nav-dropdown-toggle', dropdown);
    if (!toggle) return;

    function open() {
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function close() {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.contains('is-open') ? close() : open();
    });

    // Fermer si clic en dehors
    document.addEventListener('click', () => close());

    // Keyboard
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.contains('is-open') ? close() : open();
      }
      if (e.key === 'Escape') close();
    });
  });
}

/* ============================================================
   I18N — Toggle FR / EN
   Stratégie : attributs data-fr / data-en sur éléments texte
   Classe lang-fr / lang-en sur <html>
   Attribut [hidden] HTML5 (pas display:none CSS)
   ============================================================ */
function initI18n() {
  const html = document.documentElement;
  const btnsLang = $$('.btn-lang');
  const savedLang = localStorage.getItem(LANG_KEY) || 'fr';

  function applyLang(lang) {
    // Classe sur <html>
    html.classList.remove('lang-fr', 'lang-en');
    html.classList.add('lang-' + lang);
    html.setAttribute('lang', lang === 'fr' ? 'fr' : 'en');

    // Swap tous les éléments data-fr / data-en
    $$('[data-fr]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    });

    // Swap attributs (placeholder, aria-label, alt, title)
    $$('[data-fr-placeholder]').forEach(el => {
      const val = el.getAttribute('data-' + lang + '-placeholder');
      if (val !== null) el.setAttribute('placeholder', val);
    });

    $$('[data-fr-aria]').forEach(el => {
      const val = el.getAttribute('data-' + lang + '-aria');
      if (val !== null) el.setAttribute('aria-label', val);
    });

    $$('[data-fr-alt]').forEach(el => {
      const val = el.getAttribute('data-' + lang + '-alt');
      if (val !== null) el.setAttribute('alt', val);
    });

    // Toggle bouton langue (affiche l'autre langue)
    btnsLang.forEach(btn => {
      btn.textContent = lang === 'fr' ? 'EN' : 'FR';
      btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
    });

    // Sauvegarder préférence
    localStorage.setItem(LANG_KEY, lang);
  }

  // Event listeners sur tous les boutons langue
  btnsLang.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentLang = html.classList.contains('lang-en') ? 'en' : 'fr';
      applyLang(currentLang === 'fr' ? 'en' : 'fr');
    });
  });

  // Appliquer langue sauvegardée au chargement
  applyLang(savedLang);
}

/* ============================================================
   ANIMATIONS — Intersection Observer
   Fade-up + fade-in sur entrée dans viewport
   ============================================================ */
function initAnimations() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.fade-up, .fade-in').forEach(el => observer.observe(el));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const question = $('.faq-question', item);
    const answer = $('.faq-answer', item);
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fermer tous les autres
      $$('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          $('.faq-question', other)?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle courant
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ============================================================
   UTM CAPTURE — Lit les UTM depuis l'URL et les stocke en
   sessionStorage. Injecte ensuite dans les champs hidden [data-utm]
   et [data-page-origine] sur toute page du site.
   ============================================================ */
function initUtmCapture() {
  // Stocker les UTM présents dans l'URL courante
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const val = params.get(key);
    if (val) sessionStorage.setItem('osea_' + key, val);
  });

  // Injecter dans tous les champs hidden [data-utm] et [data-page-origine]
  $$('[data-utm]').forEach(el => {
    const key = el.dataset.utm;
    el.value = sessionStorage.getItem('osea_' + key) || 'direct';
  });
  $$('[data-page-origine]').forEach(el => {
    el.value = location.pathname;
  });
}

/* ============================================================
   FORMULAIRE DE CONTACT — Validation + Soumission
   data-form-handler="n8n" activé par form-handler-site agent
   ============================================================ */
function initForms() {
  $$('form[data-form-handler]').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const lang = document.documentElement.classList.contains('lang-en') ? 'en' : 'fr';

  // Messages i18n
  const messages = {
    fr: {
      success: 'Message reçu. Hiro ou Mélanie vous répondra dans les 24 heures.',
      error: 'Une erreur s\'est produite. Réessayez ou écrivez-nous sur WhatsApp.',
      loading: 'Envoi en cours...',
      required: 'Ce champ est obligatoire.',
      email: 'Adresse email invalide.',
      date_past: 'Cette date est déjà passée — choisissez une date future.',
      rate_limit: 'Merci de patienter quelques secondes avant un nouvel envoi.'
    },
    en: {
      success: 'Message received. Hiro or Mélanie will respond within 24 hours.',
      error: 'Something went wrong. Try again or reach us on WhatsApp.',
      loading: 'Sending...',
      required: 'This field is required.',
      email: 'Invalid email address.',
      date_past: 'That date has already passed — please choose a future date.',
      rate_limit: 'Please wait a moment before submitting again.'
    }
  };
  const msg = messages[lang];

  // Rate-limit 30s côté client (anti-spam manuel)
  const rateLimitKey = 'osea_form_last_submit';
  const lastSubmit = parseInt(localStorage.getItem(rateLimitKey) || '0', 10);
  if (Date.now() - lastSubmit < 30000) {
    showFormMessage(form, msg.rate_limit, 'error');
    return;
  }

  // Honeypot check — drop silencieux si rempli (bot)
  const honeypot = form.querySelector('.form-honeypot input');
  if (honeypot && honeypot.value) return;

  // Validation côté client
  let valid = true;

  // Reset erreurs
  $$('.form-input, .form-select, .form-textarea', form).forEach(input => {
    input.style.borderColor = '';
  });
  $$('.field-error', form).forEach(el => el.remove());

  // Vérifier requis
  $$('[required]', form).forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, msg.required);
      valid = false;
    }
  });

  // Valider email
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
    showFieldError(emailInput, msg.email);
    valid = false;
  }

  // Valider date (pas dans le passé)
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput && dateInput.value) {
    const selected = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showFieldError(dateInput, msg.date_past);
      valid = false;
    }
  }

  if (!valid) return;

  // État loading
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = msg.loading;
  submitBtn.disabled = true;
  form.classList.add('form-loading');

  // Zone message (ARIA live region injectée dans le HTML)
  const msgEl = getOrCreateFormMessage(form);
  msgEl.className = 'form-message';
  msgEl.removeAttribute('hidden');
  msgEl.textContent = '';

  const ACTION_URL = form.dataset.actionUrl || null;

  if (!ACTION_URL) {
    // Pas encore configuré — fallback WhatsApp
    setTimeout(() => {
      form.classList.remove('form-loading');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      msgEl.className = 'form-message success';
      msgEl.textContent = 'Redirection vers WhatsApp pour finaliser votre demande...';
      setTimeout(() => {
        const tourField = form.querySelector('[name="tour"]');
        const tourVal = tourField ? tourField.value : '';
        const waMsg = encodeURIComponent(
          `Bonjour, je souhaite réserver${tourVal ? ' : ' + tourVal : ''}.`
        );
        window.open(WHATSAPP_URL + '?text=' + waMsg, '_blank', 'noopener,noreferrer');
      }, 1500);
    }, 600);
    return;
  }

  try {
    const formData = new FormData(form);
    // Ajouter source et type depuis data-attributes
    if (form.dataset.source) formData.set('source', form.dataset.source);
    if (form.dataset.formType) formData.set('form_type', form.dataset.formType);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch(ACTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      form.reset();
      // Réinitialiser les champs UTM après reset (reset() les vide)
      initUtmCapture();
      localStorage.setItem(rateLimitKey, String(Date.now()));
      msgEl.className = 'form-message success';
      msgEl.textContent = msg.success;

      // Tracking GA4 si disponible
      if (typeof gtag === 'function') {
        gtag('event', 'form_submit', {
          form_type: form.dataset.formType || 'contact',
          page: location.pathname,
          source: form.dataset.source || 'direct'
        });
      }
    } else {
      throw new Error('HTTP ' + res.status);
    }
  } catch (err) {
    msgEl.className = 'form-message error';
    msgEl.textContent = msg.error;
    console.error('[O-sea] Form submit error:', err);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    form.classList.remove('form-loading');
  }
}

function getOrCreateFormMessage(form) {
  let msgEl = form.querySelector('.form-message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'form-message';
    msgEl.setAttribute('role', 'status');
    msgEl.setAttribute('aria-live', 'polite');
    msgEl.setAttribute('aria-atomic', 'true');
    form.appendChild(msgEl);
  }
  return msgEl;
}

function showFormMessage(form, text, state) {
  const msgEl = getOrCreateFormMessage(form);
  msgEl.className = 'form-message ' + state;
  msgEl.removeAttribute('hidden');
  msgEl.textContent = text;
}

function showFieldError(input, message) {
  input.style.borderColor = 'oklch(0.52 0.20 22)';
  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'display:block;font-size:0.75rem;color:oklch(0.40 0.20 22);margin-top:0.25rem;';
  err.textContent = message;
  input.parentNode.insertBefore(err, input.nextSibling);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   LAZY LOAD — Images natives (fallback pour vieux navigateurs)
   ============================================================ */
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return; // Natif supporté

  const lazyImages = $$('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => observer.observe(img));
}

/* ============================================================
   CURRENT YEAR — Copyright dynamique
   ============================================================ */
function initCurrentYear() {
  $$('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================================
   SMOOTH SCROLL — Ancres internes
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = $('.site-header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   INIT — Point d'entrée
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initBurgerMenu();
  initNavDropdowns();
  initI18n();
  initAnimations();
  initFAQ();
  initUtmCapture();
  initForms();
  initLazyLoad();
  initCurrentYear();
  initSmoothScroll();
});
