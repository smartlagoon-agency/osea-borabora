# CLAUDE.md — O-sea Bora Bora

## Projet
Site vitrine PREMIUM statique pour O-sea Bora Bora (excursions lagon, Capitaine Hiro Mulatier).
Refonte complète depuis WordPress. Livré par Smart Lagoon Agency.

## Stack
- **HTML/CSS/JS vanilla** — zéro framework, zéro npm, zéro bundler
- **Deploy** : Cloudflare Pages (`wrangler pages deploy . --project-name osea-borabora`)
- **Preview live** : https://osea-borabora.pages.dev
- **GitHub** : https://github.com/smartlagoon-agency/osea-borabora (branche `main`)
- **Formulaire** : webhook n8n `https://n8n.smartlagoon.agency/webhook/osea-contact` (placeholder à activer côté n8n)

## Commandes utiles
```bash
# Déployer une preview
wrangler pages deploy . --project-name osea-borabora

# Vérifier syntaxe HTML (si disponible)
# Aucun build step — les fichiers sont directement déployés tels quels

# Push GitHub
git add -A && git commit -m "fix(osea): ..." && git push
```

## Fichiers à lire au démarrage
1. `ai/HANDOFF.md` — état actuel + prochaine tâche
2. `ai/REPO_MAP.md` — structure des fichiers clés
3. `.planning/brief.json` — source de vérité copy/positionnement (exclu du git)
4. `.planning/copy-validated.json` — contenu textuel validé (exclu du git)
5. `.planning/design-variables.css` — tokens CSS de la marque (exclu du git)

## Règles de modification
- **Diff minimal** — ne toucher que les fichiers nécessaires
- **Contenu** : toujours sourcer dans `.planning/copy-validated.json` — ne pas inventer
- **CSS** : variables dans `assets/css/styles.css` via `--color-*`, `--font-*` (cf. design-variables.css)
- **i18n** : chaque texte = `data-fr="..." data-en="..."` sur l'élément HTML
- **JSON-LD** : valider que les accolades sont bien fermées avant de modifier
- **Images** : `assets/images/raw/` = originaux (ne pas modifier), `assets/images/` = fichiers utilisés

## Sécurité
- Zéro secret dans le code — webhook n8n = URL publique (acceptable)
- `_headers` Cloudflare = CSP + HSTS + X-Frame-Options configurés
- `unsafe-inline` présent dans CSP (à durcir : externaliser onclick inline index.html)
- Aucun backend, aucune API key côté client

## Contraintes Cloudflare Pages
- Build command : aucune (site statique)
- Output directory : `.` (racine du repo)
- `_headers` et `_redirects` à la racine = interprétés automatiquement par Cloudflare
- Pas de variables d'environnement nécessaires pour ce site statique
- Pas de Server Actions, pas de middleware, pas de filesystem Node

## À ne pas faire
- Ne pas créer de package.json / node_modules — site volontairement sans dépendances
- Ne pas modifier `.planning/` — utilisé par les agents mais exclu du git
- Ne pas supprimer `llms.txt` ni `llms-full.txt` — critiques pour GEO-AI
- Ne pas hardcoder de prix sans vérifier `.planning/content-manifest.json`
- Ne pas modifier les redirects 301 sans vérifier l'audit WP source
