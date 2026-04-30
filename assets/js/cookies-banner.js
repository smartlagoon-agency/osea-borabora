/**
 * Cookie Consent Banner — O-sea Bora Bora
 * Bilingue FR/EN avec localStorage pour stocker le consentement
 * Analytics GA4 chargé uniquement si consentement accepté
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'osea_cookie_consent';
  const CONSENT_VERSION = '1.0';

  // Textes bilingues
  const texts = {
    fr: {
      title: 'Nous utilisons des cookies',
      description: 'Ce site utilise des cookies pour améliorer votre expérience. Les cookies essentiels sont toujours activés. Vous pouvez accepter ou refuser les cookies d\'analyse.',
      accept: 'Accepter tous les cookies',
      reject: 'Refuser les cookies d\'analyse',
      linkText: 'Politique de confidentialité',
      linkHref: '/politique-confidentialite.html'
    },
    en: {
      title: 'We use cookies',
      description: 'This site uses cookies to improve your experience. Essential cookies are always enabled. You can accept or refuse analytics cookies.',
      accept: 'Accept all cookies',
      reject: 'Refuse analytics cookies',
      linkText: 'Privacy Policy',
      linkHref: '/politique-confidentialite.html'
    }
  };

  /**
   * Détecte la langue actuelle du site (FR par défaut)
   */
  function getCurrentLanguage() {
    const html = document.documentElement;
    if (html.classList.contains('lang-en') || html.lang === 'en') {
      return 'en';
    }
    return 'fr';
  }

  /**
   * Obtient les textes de la bannière dans la langue courante
   */
  function getTexts() {
    const lang = getCurrentLanguage();
    return texts[lang] || texts.fr;
  }

  /**
   * Vérifie si l'utilisateur a déjà donné son consentement
   */
  function getConsentStatus() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }

  /**
   * Stocke le choix de l'utilisateur
   */
  function setConsentStatus(analytics) {
    const consent = {
      version: CONSENT_VERSION,
      analytics: analytics,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    return consent;
  }

  /**
   * Charge le script Google Analytics si consentement donné
   */
  function loadAnalytics() {
    // Remplacer 'G-XXXXXXXXXX' par l'ID GA4 réel du client
    const GA_ID = 'G-XXXXXXXXXX';

    if (GA_ID === 'G-XXXXXXXXXX') {
      console.warn('Google Analytics ID not configured. Please set GA_ID in cookies-banner.js');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
  }

  /**
   * Crée et affiche la bannière de consentement
   */
  function createBanner() {
    const txt = getTexts();

    const banner = document.createElement('div');
    banner.id = 'osea-cookie-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Cookie consent banner');

    const container = document.createElement('div');
    container.className = 'cookie-banner-container';

    const content = document.createElement('div');
    content.className = 'cookie-banner-content';

    const title = document.createElement('h3');
    title.className = 'cookie-banner-title';
    title.textContent = txt.title;

    const description = document.createElement('p');
    description.className = 'cookie-banner-description';
    description.textContent = txt.description + ' ';

    const link = document.createElement('a');
    link.href = txt.linkHref;
    link.className = 'cookie-banner-link';
    link.textContent = txt.linkText;

    description.appendChild(link);

    content.appendChild(title);
    content.appendChild(description);

    const actions = document.createElement('div');
    actions.className = 'cookie-banner-actions';

    const btnAccept = document.createElement('button');
    btnAccept.id = 'cookie-banner-accept';
    btnAccept.className = 'cookie-banner-btn cookie-banner-btn-accept';
    btnAccept.textContent = txt.accept;

    const btnReject = document.createElement('button');
    btnReject.id = 'cookie-banner-reject';
    btnReject.className = 'cookie-banner-btn cookie-banner-btn-reject';
    btnReject.textContent = txt.reject;

    actions.appendChild(btnAccept);
    actions.appendChild(btnReject);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'cookie-banner-close';
    closeBtn.className = 'cookie-banner-close';
    closeBtn.setAttribute('aria-label', 'Fermer');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    const line1 = document.createElementNS(svgNS, 'line');
    line1.setAttribute('x1', '18');
    line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '6');
    line1.setAttribute('y2', '18');

    const line2 = document.createElementNS(svgNS, 'line');
    line2.setAttribute('x1', '6');
    line2.setAttribute('y1', '6');
    line2.setAttribute('x2', '18');
    line2.setAttribute('y2', '18');

    svg.appendChild(line1);
    svg.appendChild(line2);
    closeBtn.appendChild(svg);

    container.appendChild(content);
    container.appendChild(actions);
    container.appendChild(closeBtn);
    banner.appendChild(container);

    document.body.appendChild(banner);

    // Event listeners
    btnAccept.addEventListener('click', function() {
      setConsentStatus(true);
      loadAnalytics();
      removeBanner();
    });

    btnReject.addEventListener('click', function() {
      setConsentStatus(false);
      removeBanner();
    });

    closeBtn.addEventListener('click', removeBanner);
  }

  /**
   * Supprime la bannière du DOM
   */
  function removeBanner() {
    const banner = document.getElementById('osea-cookie-banner');
    if (banner) {
      banner.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(function() {
        banner.remove();
      }, 300);
    }
  }

  /**
   * Initialise la bannière au chargement du page
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBanner);
    } else {
      initBanner();
    }
  }

  function initBanner() {
    const consent = getConsentStatus();

    if (consent) {
      if (consent.analytics === true) {
        loadAnalytics();
      }
      return;
    }

    createBanner();
  }

  init();

})();
