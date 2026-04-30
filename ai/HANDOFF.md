# HANDOFF — O-sea Bora Bora
_Dernière mise à jour : 2026-04-30_

## État actuel
**Phase** : Élévation UI/UX Premium — sprint en cours (étapes 1-3 livrées, 4-6 à faire)
**Preview live** : https://osea-borabora.pages.dev ✅
**Dernier deploy hash** : https://0f15dde2.osea-borabora.pages.dev (étapes 1-3)
**GitHub** : https://github.com/smartlagoon-agency/osea-borabora (main, 4 commits)
**Plan détaillé** : `/Users/joramlaw/.claude/plans/shiny-humming-eagle.md`

## Sprint UI Premium — État des étapes

| # | Étape | Statut | Description |
|---|---|---|---|
| 1 | Tokens brand v2 | ✅ FAIT | `--color-sand`, `--color-sand-deep`, `--color-coral-warm`, `--font-size-display`, `--shadow-editorial` dans `:root` |
| 2 | Hero éditorial | ✅ FAIT | Cormorant XL italique `clamp(3rem,9vw,8rem)`, overlay bottom-up, kicker small caps, 1 CTA + lien texte, scroll-cue animé |
| 3 | Numéros éditoriaux | ✅ FAIT | Suppression USP-strip bleu SaaS → 4 chiffres 01-04 Cormorant italique corail sur fond `--color-sand` ivoire |
| 4 | Tours magazine | 🔄 EN COURS | Grid renommée `tours-editorial` — il manque : class `tour-card--featured` sur Journée Complète Partagée + CSS grid 3-col asymétrique (featured span 2 cols) |
| 5 | Hiro full-bleed | ⏳ TODO | Section `.captain-layout` → 100vw cinématique, photo full-bleed + citation Cormorant italique XL en surimpression |
| 6 | Signature polynésienne | ⏳ TODO | Wave dividers SVG entre sections + motif tapa SVG watermark (opacity 0.04) + CTA nav "RÉSERVER" → outline corail |

## Reprise immédiate — Étape 4 (tours magazine)

**Fichier** : `index.html` + `assets/css/styles.css`

**HTML** : ajouter `tour-card--featured` à l'article Journée Complète Partagée (ligne ~609) :
```html
<article class="tour-card tour-card--featured fade-up">
```
Aussi : changer les badges de pills pleins → outline (classe `badge-outline`) + bouton "Découvrir" → lien flèche.

**CSS à ajouter** dans `assets/css/styles.css` :
```css
.tours-editorial {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}
@media (min-width: 768px) {
  .tours-editorial {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
  .tour-card--featured {
    grid-column: span 2;
  }
  .tour-card--featured .tour-card-image { aspect-ratio: 16/9; }
}
```

## Étape 5 — Hiro full-bleed

**Section** : `index.html` lignes ~696-745 (`.captain-layout`)
**Image disponible** : `assets/images/raw/capitaine-hiro-portrait.webp`
**Citation à utiliser** : *« Ia ora na. Ce lagon, je le connais depuis l'enfance. Je veux vous le montrer comme personne d'autre ne peut le faire. »*

CSS `.about-cinematic` à créer :
- `width: 100vw; margin-inline: calc(-50vw + 50%); min-height: 80vh`
- Photo en `background-image` + overlay dégradé dark left
- Citation Cormorant italique XL en surimpression gauche

## Étape 6 — Signature polynésienne

1. **Wave dividers SVG** : insérer entre hero→numéros, tours→captain, dark→why
2. **Motif tapa SVG** : créer `assets/images/pattern-tapa.svg` (chevrons 80×80, 1 couleur), appliquer en `background-image` avec `opacity: 0.04` sur sections sable
3. **CTA nav** : `.btn-cta` dans nav → passer de rouge solide à outline corail chaud (`var(--color-coral-warm)`) + hover plein

## Ce qui est livré (socle intact)

- 14 pages HTML statiques (home + 8 tours + about + faq + contact + legal x2 + 404)
- i18n FR/EN complet
- JSON-LD 13 blocs Schema
- GEO-AI : llms.txt + llms-full.txt
- SEO : 25 redirects 301, sitemap 16 URLs hreflang
- Sécurité : _headers Cloudflare score A
- Formulaire n8n webhook
- Perf LCP preload, CLS aspect-ratio

## Actions client requises avant DNS

1. **GA4 ID** → remplacer `G-XXXXXXXXXX` dans `assets/js/cookies-banner.js`
2. **SIRET** → compléter dans `mentions-legales.html`
3. **Décision max pax** → 10 (réel) ou 6 (positionnement premium) — confirmer avec Hiro
4. **Témoignages réels** → avis Google datés à injecter dans `index.html`
5. **Test formulaire** → soumettre demande test, vérifier réception n8n

## Fichiers clés

- `assets/css/styles.css` — CSS principal (~2900 lignes après sprint)
- `assets/js/main.js` — JS global
- `index.html` — page principale
- `.planning/brief.json` — source de vérité copy (non versionné)
- `ai/TASK_LOG.md` — historique des actions
