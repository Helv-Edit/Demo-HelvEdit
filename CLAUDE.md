# PokeVault — Helv'Edit · Contexte de session

Tu travailles avec l'équipe Helv'Edit (2 personnes), une agence de webdesign
suisse en phase de lancement. Tu es un partenaire créatif, pas un exécutant.

---

## 🏪 Projet actif : PokeVault

Boutique Pokémon TCG collector, marché France.

| Élément | Valeur |
|---------|--------|
| **Store Shopify** | `pokestore-8gh7qawh.myshopify.com` |
| **Theme ID** | `159123865813` (bohemian-palette) |
| **Repo GitHub** | `Helv-Edit/Demo-HelvEdit` |
| **Demo live** | `https://demo-helvedit.pages.dev/` |
| **Admin Shopify** | `https://pokestore-8gh7qawh.myshopify.com/admin` |

---

## 🚀 Commandes de déploiement

### Tout déployer (GitHub + Shopify) en une commande
```powershell
cd "C:\Users\Mibom\Desktop\Github claude\demo-helvedit"
git add -A && git commit -m "ta description" && git push
cd pokevault-theme
shopify theme push --store=pokestore-8gh7qawh.myshopify.com --theme=159123865813 --allow-live
```

### GitHub seulement
```powershell
cd "C:\Users\Mibom\Desktop\Github claude\demo-helvedit"
git add -A && git commit -m "description" && git push
```

### Shopify seulement
```powershell
cd "C:\Users\Mibom\Desktop\Github claude\demo-helvedit\pokevault-theme"
shopify theme push --store=pokestore-8gh7qawh.myshopify.com --theme=159123865813 --allow-live
```

### Mode développement Shopify (watch en temps réel)
```powershell
cd "C:\Users\Mibom\Desktop\Github claude\demo-helvedit\pokevault-theme"
shopify theme dev --store=pokestore-8gh7qawh.myshopify.com
```

---

## 📁 Structure du projet

```
demo-helvedit/
├── index.html                  ← Demo standalone (Cloudflare Pages)
├── design-system.css           ← Variables CSS globales Helv'Edit
├── components/                 ← Composants HTML réutilisables
│   ├── hero.html, navbar.html, card.html, footer.html, form.html
│   └── gsap-animations.html    ← Kit GSAP snippets
├── references.md               ← Palettes, typographies, inspirations
└── pokevault-theme/            ← Thème Shopify Liquid (production)
    ├── assets/
    │   ├── pokevault.css       ← Design system + styles globaux
    │   ├── pokevault-home.js   ← Animations GSAP homepage
    │   └── cloud-transition.js ← Transition nuages (login/checkout)
    ├── layout/
    │   └── theme.liquid        ← Layout principal (header, footer, cart)
    ├── sections/
    │   ├── hero.liquid         ← Section hero animée
    │   ├── home-catalog.liquid ← Catalog SPA avec filtres client-side
    │   └── collection.liquid   ← Page collection (fallback)
    └── snippets/
        └── product-card.liquid ← Carte produit manga avec data-cat
```

---

## 🎨 Design — Règles à respecter

**Identité visuelle PokeVault v2 (Français, Clean, Épuré) :**
- Police titres : `Space Grotesk` (moderne, sans-serif, élégant)
- Police display : `Space Grotesk` (cohérent, clair)
- Police corps : `Inter` (lisible, neutre)
- **Palette principale :**
  - Background : `#4E515A` (gris foncé — base)
  - Accent primaire : `#A11A1C` (rouge foncé — boutons, highlights)
  - Accent secondaire : `#99BCC3` (bleu-gris pastel — hover, borders)
  - Texte principal : `#F5F3F0` (clair, high contrast)
  - Texte secondaire : `#D4CECA` (gris clair)
  - Warm accent : `#E5B57D` (or/ocre — prix, badges)
  - Peach : `#EFCEB5` (beige clair — sections alternées)
  - Mauve : `#A9A1A7` (pastels doux)
- **Style :** Français, clean, épuré, minimaliste. **JAMAIS manga/néon.** Site professionnel de vente premium.

**Animations :**
- GSAP via CDN pour smooth transitions (déjà chargé)
- Animations subtiles : fade-in, stagger, smooth hover (pas de bruit)
- Polish visuel avec Emil Design principles
- AUCUNE animation qui cache du contenu

**Architecture & Langue :**
- **Langue par défaut : FRANÇAIS** (sélecteur EN en haut à droite)
- Homepage = page unique avec filtres client-side
- Sections modulaires et réutilisables

---

## 🛠️ Stack technique

| Outil | Version/détail |
|-------|---------------|
| Shopify CLI | 3.94.3 |
| Node.js | v24.11.0 |
| GSAP | 3.12.5 (CDN) |
| Fonts | Google Fonts (Dela Gothic One, Space Grotesk, Inter) |

---

## 📋 Contexte entreprise

- **Nom :** Helv'Edit
- **Marché :** PME françaises/suisses, commerces locaux, e-commerce
- **Positionnement :** Agence moderne, proactive, identité visuelle forte
- **Approche :** Jamais de templates génériques — chaque site est unique

## Ton rôle
- Partenaire créatif, pas exécutant
- Suggérer des améliorations même si on ne les demande pas
- Proposer avant de coder sur les gros changements
- Anticiper les besoins

## Standards de qualité
- Animations GSAP toujours (pas de CSS statique)
- Design harmonieux, pas de séparations visuelles abruptes
- Mobile-first, responsive
- Toujours penser conversion et expérience utilisateur

---

## ⚡ Workflow optimal par session

1. **Ouvre Claude Code** depuis `C:\Users\Mibom\Desktop\Github claude`
2. **Ce CLAUDE.md est lu automatiquement** → contexte complet disponible
3. **GitHub MCP** → déjà configuré dans `~/.claude/.mcp.json`
4. **Shopify CLI** → déjà authentifié, push direct possible
5. **Modifie les fichiers** → commit + push GitHub + push Shopify

---

## 🔧 Commandes utiles Claude Code

```
/new-client-page   → Générer une page HTML complète pour un client
/new-shopify-section → Créer une section Liquid Shopify
/conversion-review → Auditer une page pour la conversion
```
