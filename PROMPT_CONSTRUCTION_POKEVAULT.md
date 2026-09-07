# Prompt de construction — PokeVault (Shopify)

---

## 🎯 Mission

Tu vas construire de A à Z le thème Shopify complet de **PokeVault**, une boutique française premium spécialisée dans les produits Pokémon TCG et leurs accessoires de protection.

Lis intégralement le CLAUDE.md avant de commencer. Toutes les règles techniques, artistiques et comportementales qu'il contient sont non-négociables — sauf si tu identifies un problème, auquel cas tu le signales clairement avant de procéder.

---

## 🏪 Présentation de la boutique

**PokeVault** est une boutique en ligne française qui vend :
- Des **produits Pokémon TCG scellés** : Boosters, ETB (Elite Trainer Box), Bundles, Displays
- Des **accessoires de protection** : Sleeves (protège-cartes), Toploaders, et protections acryliques sur mesure pour chaque format de produit Pokémon (Booster, Bundle, Display, ETB)

La clientèle est composée de collectionneurs et joueurs TCG français qui cherchent un fournisseur fiable, premium, et spécialisé. Ce n'est pas une marketplace généraliste — c'est une boutique de référence dans son créneau.

Le site est **bilingue français/anglais**. La langue principale est le français.

---

## 🏗️ Base technique recommandée

Pars sur **Dawn** (thème Shopify officiel) comme base de fichiers, puis remplace intégralement les styles, layouts et sections. Dawn est recommandé car :
- Structure Online Store 2.0 propre et bien organisée
- Fichiers de traduction déjà en place
- Sections modulaires prêtes à être remplacées
- Compatible avec toutes les fonctionnalités Shopify natives

**Ne conserve aucun style Dawn** — tout le CSS est à recréer depuis zéro en suivant la palette et la DA du CLAUDE.md.

---

## 📂 Structure des collections Shopify à créer

### Catégorie 1 — Produits Scellés
- **Boosters** — packs individuels
- **ETB** (Elite Trainer Box)
- **Bundles**
- **Displays**

### Catégorie 2 — Protections
- **Sleeves** (protège-cartes souples)
- **Toploaders** (rigides)
- **Protection acrylique Booster** — produit séparé
- **Protection acrylique Bundle** — produit séparé
- **Protection acrylique ETB** — produit séparé
- **Protection acrylique Display** — produit séparé

> Note : les protections acryliques sont présentées en fiches séparées par format. Chaque fiche peut avoir des variantes (couleur, finition) si pertinent.

---

## 🗂️ Pages à construire

### 1. Homepage
Dans l'ordre de haut en bas :

**a) Barre d'annonces rotative** (3 messages en rotation automatique)
- "Livraison en France uniquement"
- "Produits 100% authentiques et scellés"
- Un slot libre pour les promos futures

**b) Header fixe**
- Logo PokeVault à gauche (texte SVG stylisé si pas de fichier fourni)
- Navigation centrale : `Produits Scellés` | `Protections`
- Icônes à droite : Recherche, Compte client, Panier (avec compteur)
- Mega-menu au hover sur chaque catégorie avec visuels des sous-collections

**c) Hero section**
- Pleine largeur, image de fond (placeholder si pas d'asset)
- Titre principal impactant en FR + EN
- Sous-titre court qui explique la valeur de PokeVault
- Deux CTA : "Découvrir les produits" → Produits Scellés / "Nos protections" → Protections

**d) Carrousel Nouveautés / Bestsellers**
- Slider horizontal avec 4-5 cards produit visibles
- Navigation flèches gauche/droite
- Cards avec : photo produit, nom, prix, bouton "Ajouter au panier" rapide

**e) Grandes cases catégories** (inspiré de jeffreestarcosmetics.com)
- 2 grandes tuiles cliquables côte à côte
- Tuile 1 : "Produits Scellés" avec visuel fort
- Tuile 2 : "Protections" avec visuel fort
- Effet hover : léger zoom + overlay coloré

**f) Produit vedette** (section mise en avant)
- 1 produit star choisi (ETB ou Display)
- Visuel 3D tournant sur axe Y (Three.js r128 via CDN)
- Description courte + CTA direct
- Si pas de fichier .glb disponible : boîte géométrique aux proportions d'un ETB avec texture/couleur de la palette

**g) Bande de réassurance** (4 icônes SVG inline)
- 🚚 Livraison France uniquement — soigneuse et sécurisée
- ✅ Produits 100% authentiques et scellés
- 📦 Emballage protection renforcé
- 💬 Service client réactif

**h) Footer**
- Logo + description courte
- Liens rapides : collections, compte, contact
- Mentions légales, CGV, politique de confidentialité
- Réseaux sociaux (slots vides configurables)
- Newsletter (champ email simple)

---

### 2. Page Collection (template réutilisable)
- Header de collection : nom + description + visuel 3D tournant du produit principal (Three.js)
- Filtres : type, prix (sidebar ou barre horizontale)
- Grid produits : 3 colonnes desktop, 2 colonnes mobile
- Cards avec photo, nom, prix, badge "Nouveau" / "Stock limité" si applicable
- Pagination ou infinite scroll

---

### 3. Page Produit
- Galerie photos (swipe mobile)
- Nom du produit, prix, description
- Sélecteur de variantes si applicable
- Bouton "Ajouter au panier" principal (couleur `--color-cta`)
- Section "Produits associés" en bas
- Pour les protections acryliques : tableau de compatibilité (quel format protège quoi)

---

### 4. Panier (drawer latéral)
- S'ouvre depuis l'icône header sans changer de page
- Liste des articles avec photo, nom, quantité modifiable, suppression
- Sous-total
- Note sur la livraison France uniquement
- CTA "Finaliser la commande" → checkout Shopify natif

---

### 5. Compte client (custom — pas les pages Shopify par défaut)

**Page de connexion/inscription** (`/account/login`)
- Design au style du site, pas la page Shopify générique
- Deux onglets : "Se connecter" / "Créer un compte"
- Formulaires propres et accessibles
- Lien "Mot de passe oublié"

**Dashboard client** (`/account`)
- Salutation personnalisée avec prénom
- Résumé : nombre de commandes, dernière commande
- Liste de toutes les commandes passées (date, numéro, statut, montant)
- Clic sur une commande → détail complet + statut de livraison

**Implémentation technique :**
- Templates Liquid custom dans `/templates/customers/`
- Utiliser Shopify Customer Account API pour les données
- Pages : `customers/login.liquid`, `customers/register.liquid`, `customers/account.liquid`, `customers/order.liquid`
- Tout au design du thème — aucune redirection vers les pages Shopify par défaut

---

### 6. Pages secondaires à créer (contenu placeholder)
- `/pages/a-propos` — Qui sommes-nous, notre engagement qualité
- `/pages/livraison` — Conditions de livraison France, délais, transporteurs
- `/pages/contact` — Formulaire de contact simple
- `/pages/faq` — Questions fréquentes (accordéon)

---

## 🔧 Ordre de construction recommandé

Procède dans cet ordre pour éviter les dépendances manquantes :

```
1. theme.liquid — structure de base, chargement GSAP + Three.js CDN, CSS variables
2. CSS global — palette complète, typographie, composants de base
3. Header + Navigation + Mega-menu
4. Footer
5. Homepage section par section (de haut en bas)
6. Template collection
7. Template produit
8. Drawer panier
9. Pages customers custom (login, register, account, order)
10. Pages secondaires (about, livraison, contact, faq)
11. Fichiers de traduction FR + EN
12. Vérification responsive mobile sur toutes les pages
```

---

## 🎨 Utilisation des skills — priorité haute

Tu as accès à plusieurs skills installés globalement. **Utilise-les activement** sur ce projet — ils sont là précisément pour donner au site un côté unique et moderne qui le différencie d'un thème Shopify générique.

### Skills disponibles et où les appliquer

**`frontend-design`**
Active-le sur chaque section visuelle. Il t'oblige à faire des choix esthétiques forts et intentionnels. Ne te contente pas du premier layout qui vient — choisis une direction et exécute-la avec précision. C'est ce skill qui empêche le site de ressembler à du "AI slop".

**`ui-ux-pro-max`**
Utilise ses 67 styles, palettes et font pairings comme référence pour t'assurer que chaque composant (cards, boutons, formulaires, navigation) est au niveau d'un site premium. Pioche dedans pour les micro-décisions UX.

**`gsap-scrolltrigger`**
À appliquer sur :
- L'apparition des cards produit au scroll (stagger reveal)
- Le hero section (animation d'entrée)
- Les grandes cases catégories (parallax léger)
- La bande de réassurance (icônes qui apparaissent en séquence)
Chaque animation doit avoir un but — elle met en valeur ou guide l'attention. Rien de gratuit.

**`threejs-webgl`**
À appliquer sur :
- La section produit vedette de la homepage (objet 3D tournant)
- Le header de chaque page collection (produit principal en 3D)
Si pas de fichier `.glb` disponible : crée une primitive géométrique aux bonnes proportions avec un matériau réfléchissant de qualité — pas une boîte grise basique.

**`emil-design`**
Applique ses principes sur tous les éléments interactifs : hover states des boutons, transitions des cards, ouverture du drawer panier, feedback visuel des formulaires. C'est ce niveau de polish qui fait la différence entre un site qui "fonctionne" et un site qui "impressionne".

**`shopify-theme`**
Ta référence permanente pour toutes les décisions d'architecture Liquid. Consulte-le avant chaque nouvelle section ou template.

### Principe général
Ces skills ne sont pas optionnels sur ce projet. Un site Shopify standard peut être construit sans eux. PokeVault doit être au-dessus de ça — visuellement mémorable, fluide, et cohérent de la homepage jusqu'au tunnel d'achat.

---

## ⚡ Rappels techniques critiques

- GSAP 3.12.5 et Three.js r128 : **CDN uniquement**, jamais npm
- Three.js : uniquement sur homepage (section vedette) et header de page collection — pas partout
- Toutes les images : filtre `image_url` avec paramètre `width`, jamais d'URL brute
- Tout texte visible : dans les fichiers de traduction `/locales/fr.default.json` et `/locales/en.json`
- Chaque section Liquid : `{% schema %}` complet avec name, presets, settings
- Lighthouse mobile ≥ 80 — optimiser avant de livrer

---

## 🗣️ Communication pendant le build

- Travaille section par section et annonce ce que tu fais
- Si tu bloques sur un asset manquant (image, .glb) : continue avec un placeholder propre et signale-le
- Si tu vois quelque chose qui ne va pas dans ce prompt ou dans le CLAUDE.md : dis-le immédiatement avec ta suggestion
- Après chaque grande étape, fais un résumé de ce qui est fait et ce qui reste
