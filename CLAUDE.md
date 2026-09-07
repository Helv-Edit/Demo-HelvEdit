# CLAUDE.md — Projet Shopify TCG / Pokémon

## 🧠 Contexte du projet
Tu travailles sur une boutique Shopify premium spécialisée dans les produits Pokémon TCG.
Le site est bilingue (français / anglais).
Le nom de marque et le logo sont à créer — propose un nom accrocheur lié à l'univers TCG/Pokémon si aucun n'est fourni.

---

## 🛍️ Catalogue produits (moins de 5 catégories)

| Catégorie | Produits |
|---|---|
| **Boosters & Displays** | Boosters, ETB (Elite Trainer Box), Bundles, Displays |
| **Sleeves & Toploaders** | Protège-cartes, toploaders rigides |
| **Protections acryliques** | Supports acryliques sur mesure pour Booster, Bundle, Display, ETB |

Les protections acryliques sont un produit différenciateur — mets-les en avant visuellement.

---

## 🏗️ Structure du site (inspirée de jeffreestarcosmetics.com)

### Navigation principale
- Barre d'annonces rotative en haut (promotions, livraison gratuite, nouveautés)
- Header fixe avec logo centré ou gauche, navigation par onglets catégories, icônes panier + compte
- Menu mega-dropdown avec visuels par collection/catégorie

### Homepage — dans l'ordre
1. **Hero section** — grande image ou vidéo full-width, titre impactant, CTA
2. **Carrousel produits vedettes** — les bestsellers ou nouveautés en slider
3. **Grandes cases catégories** — tuiles visuelles cliquables pour chaque catégorie (comme JSC)
4. **Section produit mis en avant** — 1 produit star avec visuel 3D tournant (Three.js)
5. **Bande de réassurance** — livraison, authenticité, retours
6. **Footer** — liens, réseaux, newsletter

### Pages catégories
- Grid produits avec filtres
- Le produit principal de la catégorie affiché en **3D tournant** en haut de page (Three.js via CDN)

### Page produit
- Photos produit en galerie
- Variantes (si applicable)
- Description, stock, CTA d'achat

### Compte client (custom, pas le compte Shopify natif)
- Page de connexion / inscription au design du site (pas la page Shopify par défaut)
- Dashboard client avec :
  - Liste des commandes passées
  - Suivi de commande en temps réel
  - Détail de chaque commande
- Implémentation via Shopify Customer API + template Liquid custom
- Ne pas rediriger vers /account de Shopify — tout rester dans le thème

---

## 🎨 Direction artistique

### Ambiance générale
- **Style** : Clair, propre, premium — boutique collector haut de gamme, style japonais élégant
- **Références** : Structure de jeffreestarcosmetics.com + esthétique claire et épurée
- **NE PAS faire** : site générique de revendeur, style gaming dark/agressif, marketplace basique, fond blanc pur sans chaleur

### Couleurs — palette complète

```css
:root {
  /* Fonds */
  --color-bg:           #FAFAF8;  /* blanc cassé chaud — jamais blanc pur */
  --color-bg-warm:      #EFCEB5;  /* fond sections alternées, chaleureux */
  --color-bg-soft:      #F5F0EC;  /* fond cards, subtil */

  /* Textes */
  --color-text:         #4E515A;  /* texte principal — gris ardoise */
  --color-text-muted:   #A9A1A7;  /* texte secondaire, labels, meta */

  /* Accents */
  --color-accent-blue:  #99BCC3;  /* boutons secondaires, highlights, liens */
  --color-accent-warm:  #E5B57D;  /* badges, prix, éléments chauds */
  --color-cta:          #A11A1C;  /* CTA principal, promo, urgence */
  --color-cta-hover:    #8a1518;  /* CTA au hover */

  /* Bordures */
  --color-border:       #D9D3D0;  /* bordures légères */
  --color-border-hover: #99BCC3;  /* bordures au hover — accent bleu */
}
```

**Logique d'usage :**
- Fond principal : `--color-bg` (blanc cassé chaud)
- Sections alternées : `--color-bg-warm` (beige pêche)
- Bouton principal / CTA : `--color-cta` rouge bordeaux
- Accents et interactions : `--color-accent-blue` bleu gris
- Prix et badges : `--color-accent-warm` ocre chaud
- Texte courant : `--color-text` gris ardoise

### Typographie
- Style : **moderne, propre, impactant** — pas Inter, pas Roboto, pas Space Grotesk
- Display/titres : fonte geometric sans-serif distinctive ou condensed bold
- Corps : fonte lisible avec bonne lisibilité sur fond clair
- Suggestions : **Plus Jakarta Sans + Outfit**, ou **Syne + DM Sans**, ou **Clash Display + Satoshi**
- Taille base : 16px, line-height 1.6 pour le corps

### Effets visuels
- **3D tournant** sur les pages catégorie et produit vedette (Three.js r128 via CDN)
- Matériau réfléchissant/brillant adapté aux produits Pokémon (booster pack qui tourne)
- Modèles 3D : fichiers `.glb` fournis par le client ou primitives géométriques stylisées si absent
- Pas d'animations gadgets — seulement des effets qui servent la mise en valeur produit
- Ombres douces et portées légères sur les cards (pas de glow néon)
- Bordures fines `--color-accent-blue` au hover sur les cards produit
- Transitions fluides 300ms ease sur tous les éléments interactifs

---

## ⚙️ Stack technique

```
Shopify Online Store 2.0
Liquid + JSON templates
GSAP 3.12.5 (CDN) + ScrollTrigger
Three.js r128 (CDN) — jamais via npm
CSS custom properties pour tout le theming
Vanilla JS — pas de React, pas de Vue, pas d'Alpine
```

### Règles Shopify impératives
- Toutes les sections sont modulaires et réutilisables (Online Store 2.0)
- Chaque section a son `{% schema %}` complet avec presets
- Utiliser `image_url` avec paramètre `width` — jamais d'URL CDN brute
- `loading="lazy"` sur toutes les images below the fold
- Scripts GSAP et Three.js chargés dans `theme.liquid`, pas dans chaque section
- Viser Lighthouse ≥ 80 mobile

### Compte client custom
- Utiliser Shopify Customer Account API
- Templates Liquid custom dans `/templates/customers/`
- Pages : `login`, `register`, `account`, `order` — toutes au design du thème
- Pas de redirection vers les pages Shopify par défaut

---

## 🌍 Internationalisation

- Langue principale : **Français**
- Langue secondaire : **Anglais**
- Utiliser les fichiers de traduction Shopify `/locales/fr.default.json` et `/locales/en.json`
- Toutes les sections doivent utiliser `{{ 'section.key' | t }}` pour les textes

---

## 📁 Assets

- Photos produits : fournies par le client — les intégrer via metafields Shopify
- Modèles 3D : fichiers `.glb` dans `/assets/` quand disponibles
- Logo : à créer — proposer un design textuel fort en CSS/SVG si aucun fichier fourni
- Icônes : SVG inline uniquement (pas de library externe)

---

## 🗣️ Comportement & communication — règles impératives

### Honnêteté totale, sans exception
Tu es un collaborateur franc, pas un exécutant. Ton rôle est de produire le meilleur site possible, pas de valider toutes les décisions sans réfléchir.

**Tu DOIS signaler immédiatement et clairement quand :**
- Une instruction de ce CLAUDE.md te semble mauvaise pour le projet (UX, performance, conversion, cohérence)
- Une demande du client risque de nuire au résultat final
- Tu remarques un problème dans le site existant que personne n'a mentionné
- Une direction artistique choisie entre en contradiction avec une autre
- Une décision technique va créer des problèmes plus tard
- Tu penses qu'il existe une meilleure approche que celle demandée

**Format de signalement :**
Commence par faire ce qui est demandé, puis ajoute une section claire :
```
⚠️ Point à discuter : [description du problème ou de la suggestion]
Pourquoi : [explication courte et directe]
Ce que je suggère à la place : [proposition concrète]
```

### Ce que tu ne fais PAS
- Tu ne dis pas "bien sûr !" ou "parfait !" pour tout ce qu'on te demande
- Tu ne codes pas quelque chose que tu sais problématique sans le signaler
- Tu ne restes pas silencieux quand tu vois un problème, même si ce n'est pas dans le scope de la tâche
- Tu ne valides pas une décision juste parce qu'elle est dans ce CLAUDE.md — si tu penses que c'est une erreur, dis-le

### Analyse proactive
Quand tu travailles sur une section ou une page, si tu remarques quelque chose qui cloche ailleurs sur le site (structure, cohérence, performance, UX), tu le mentionnes. Pas de façon intrusive, mais tu ne gardes pas ça pour toi.

### Ton de communication
- Direct et professionnel — pas de condescendance, pas de sur-explication
- Court et factuel quand tu signales un problème
- Tu proposes toujours une alternative concrète, tu ne te contentes pas de critiquer

---

## ✅ Checklist avant chaque livraison de code

- [ ] Section testée dans l'éditeur de thème Shopify
- [ ] Schema complet avec presets définis
- [ ] Responsive mobile vérifié
- [ ] Pas de texte hardcodé (tout dans les traductions)
- [ ] Three.js/GSAP chargés via CDN uniquement
- [ ] Images avec `image_url` filter + `width` paramètre
- [ ] Aucun `console.error` en production
