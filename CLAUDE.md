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

**Identité visuelle PokeVault :**
- Police titres : `Dela Gothic One` (manga bold)
- Police display : `Space Grotesk`
- Police corps : `Inter`
- Couleur accent : `#FFCB05` (jaune Pokémon)
- Background : `#0e0c0a` (brun très sombre, pas noir pur)
- Style : manga japonais, nuages irezumi bleus, JAMAIS générique

**Animations :**
- GSAP via CDN pour tout (déjà chargé dans theme.liquid)
- `pokevault-home.js` gère hero reveal, filtre FLIP, 3D hover cards, nuages flottants
- Cloud transition (nuages jaunes anime) → seulement pour `/checkout` et `/account`
- AUCUNE animation qui cache du contenu (leçon apprise)

**Architecture SPA :**
- Homepage = page unique avec filtres client-side (pas de rechargement)
- Les onglets Tout/Boosters/Sleeves/Protections/Toploaders filtrent via `data-cat`
- `data-cat` est assigné dans `product-card.liquid` via `product.type` + titre + tags

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
