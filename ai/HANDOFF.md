# HANDOFF — O-sea Bora Bora
_Dernière mise à jour : 2026-04-29_

## État actuel
**Phase** : Post-déploiement preview — en attente validation design client
**Preview live** : https://osea-borabora.pages.dev ✅ (vérifié — site charge correctement)
**GitHub** : https://github.com/smartlagoon-agency/osea-borabora (main, 1 commit)
**Quality check** : 7/7 PASS ✅

## Ce qui est livré
- 14 pages HTML statiques (home + 8 tours + about + faq + contact + legal x2 + 404 + en/)
- i18n FR/EN via data-fr/data-en + JS toggle
- 13 blocs JSON-LD (TouristAttraction, LocalBusiness, FAQPage, BreadcrumbList…)
- GEO-AI : llms.txt + llms-full.txt + .well-known/ai-plugin.json
- SEO : 25 redirects 301 WP→nouveau, sitemap 16 URLs hreflang, meta OG complètes
- Sécurité : _headers Cloudflare score A (0.87)
- Formulaire : n8n webhook configuré (placeholder — à activer côté n8n)
- Perf : LCP preload, aspect-ratio CLS, cache-control — Lighthouse estimé 88-95
- Maillage interne : breadcrumbs + tours similaires + 0 page orpheline

## ⚠️ BUG CRITIQUE — À corriger en priorité 1
**Navigation overlay sur les pages tours** (visible sur `excursions/snorkeling-partage.html`) :
- Le menu dropdown + breadcrumb + badges héro se superposent visuellement
- Cause probable : z-index ou `position` du nav-dropdown pas bien isolé / nav mobile affiché en état ouvert sur desktop
- Fichiers à modifier : `assets/css/styles.css` (nav, dropdown, breadcrumb z-index) + vérifier `assets/js/main.js` (état initial du menu)

## Prochaine tâche recommandée : Redesign Premium
Le design actuel est fonctionnel mais générique/bas-gamme pour le contexte tourisme luxe Bora Bora.

**Problèmes visuels identifiés (screenshots Joram 2026-04-29)** :
1. Boutons orange cru + WhatsApp vert = clash, pas premium
2. Section CTA : gradient bleu/teal plat = style SaaS, pas tourisme lagon
3. Footer corporate navy générique, aucun sentiment polynésien
4. Typographie correcte (Cormorant Garamond) mais layout trop dense

**Direction design souhaitée** :
- Style : premium éditorial tourisme (Aman Hotels, Four Seasons, Condé Nast Traveller)
- Palette : renforcer le bleu lagon profond + sable/ivoire + touches corail élégantes (pas orange cru)
- Boutons : raffinés, outline ou solid avec micro-animations hover
- Footer : wave SVG divider + texture subtile + chaleur polynésienne
- Sections : plus d'espace blanc, photos plus dominantes, moins de bleu flat

## Actions client requises avant DNS
1. **GA4 ID** → remplacer `G-XXXXXXXXXX` dans `assets/js/cookies-banner.js`
2. **SIRET** → compléter dans `mentions-legales.html`
3. **Décision max pax** → 10 (réel) ou 6 (positionnement premium) à confirmer avec Hiro
4. **Test formulaire** → soumettre demande test sur preview, vérifier réception n8n
5. **Témoignages réels** → avis Google datés à injecter dans index.html

## Risques ouverts
- `unsafe-inline` dans CSP (onclick inline index.html) → à externaliser pour passer A+
- SaaS Joram booking → placeholder prévu, à brancher quand MVP prêt
- OG images par page tour → non générées (og-default.jpg générique utilisé)
- analytics-site agent → résultat partiel, GA4 events à vérifier dans main.js

## Fichiers importants pour reprendre
- `assets/css/styles.css` — tout le CSS (2600+ lignes)
- `assets/js/main.js` — JS global (~300+ lignes)
- `index.html` — page principale
- `excursions/snorkeling-partage.html` — exemple page tour (bug nav visible ici)
- `.planning/design-variables.css` — tokens CSS source (non versionné)
