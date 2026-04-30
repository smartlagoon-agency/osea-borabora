# REPO_MAP — O-sea Bora Bora

## Structure utile

```
OSEA/
├── index.html              ← Page d'accueil (hero, tours grid, about snippet, témoignages)
├── a-propos.html           ← Bio Capitaine Hiro
├── faq.html                ← 10 questions, schema FAQPage JSON-LD
├── contact.html            ← Formulaire n8n + carte OSM
├── 404.html                ← Page erreur brandée
├── mentions-legales.html   ← RGPD — éditeur + hébergeur
├── politique-confidentialite.html
├── excursions/             ← 8 pages tours individuelles
│   ├── snorkeling-partage.html
│   ├── snorkeling-prive.html
│   ├── coucher-soleil-partage.html
│   ├── coucher-soleil-prive.html
│   ├── journee-complete-partage.html
│   ├── journee-complete-privee.html
│   ├── tour-panoramique.html
│   └── transfert-bateau.html
├── en/index.html           ← Mirror EN (localStorage + redirect vers /)
├── assets/
│   ├── css/styles.css      ← TOUT le CSS (variables + composants + pages)
│   ├── js/main.js          ← Nav mobile, i18n toggle, form handler, analytics events
│   └── js/cookies-banner.js ← Bannière RGPD + chargement conditionnel GA4
├── assets/images/
│   ├── raw/                ← Originaux téléchargés (ne pas modifier)
│   ├── hero/               ← Images hero
│   ├── tours/              ← Photos par excursion
│   ├── about/              ← Portrait Hiro
│   └── fauna/              ← Raies, requins
├── _headers                ← CSP + HSTS + cache (Cloudflare)
├── _redirects              ← 25 règles 301 WP→nouveau + wp-admin/wp-login
├── sitemap.xml             ← 16 URLs avec hreflang fr/en
├── robots.txt
├── llms.txt                ← GEO-AI : description courte pour LLMs
├── llms-full.txt           ← GEO-AI : documentation complète tours + FAQ
├── lefthook.yml            ← Config hooks git (prepare-commit-msg passthrough)
└── .gitignore              ← Exclut .planning/, assets/images/raw/, .DS_Store
```

## Fichiers clés par usage

| Besoin | Fichier(s) |
|--------|-----------|
| Modifier le copy | `.planning/copy-validated.json` (source) → HTML |
| Modifier le CSS global | `assets/css/styles.css` |
| Modifier le JS global | `assets/js/main.js` |
| Ajouter/modifier un tour | `excursions/[nom-tour].html` |
| Modifier formulaire | `contact.html` + `assets/js/main.js` |
| Modifier SEO meta | `<head>` de chaque page HTML |
| Modifier schema JSON-LD | Balises `<script type="application/ld+json">` dans chaque page |
| Modifier les redirections | `_redirects` |
| Modifier les headers sécu | `_headers` |
| Modifier les textes i18n | Attributs `data-fr` / `data-en` sur les éléments HTML |

## Zones à confirmer
- `en/index.html` : redirige vers `/` avec localStorage — à tester sur preview
- `assets/images/og-default.jpg` : image OG générique (pas d'OG par page tour)
- Formulaires pages tours : `?tour=nom-tour` dans l'URL contact — vérifier que main.js pré-sélectionne bien (URLSearchParams ligne ~237)
- GA4 ID : placeholder `G-XXXXXXXXXX` dans cookies-banner.js

## Zones à ne pas toucher
- `assets/images/raw/` — originaux, non versionnés
- `.planning/` — non versionné, utilisé par agents Smart Lagoon uniquement
- JSON-LD existants — valides, ne pas casser la syntaxe
