# Créer une nouvelle section Shopify

Crée une section Shopify Liquid complète pour le thème `pokevault-theme` (ou tout autre thème Helv'Edit).

## Étapes

1. **Lis le CLAUDE.md** de `pokevault-theme/` pour les règles d'architecture
2. **Lis les sections existantes** dans `pokevault-theme/sections/` pour respecter les patterns
3. **Crée le fichier** `pokevault-theme/sections/[nom-section].liquid` avec :

### Structure obligatoire d'une section
```liquid
<section class="section-[nom]" id="section-{{ section.id }}">
  <!-- HTML de la section -->
</section>

{% stylesheet %}
  /* CSS scoped à cette section */
{% endstylesheet %}

{% javascript %}
  /* JS de la section si nécessaire */
{% javascript %}

{% schema %}
{
  "name": "Nom de la section",
  "settings": [],
  "blocks": [],
  "presets": [{ "name": "Nom de la section" }]
}
{% endschema %}
```

### Règles Shopify
- Utiliser `{% stylesheet %}` et `{% javascript %}` jamais de `<style>`/`<script>` inline
- Settings simples → CSS variables ; settings multiples → classes CSS
- Toujours inclure un preset pour pouvoir ajouter depuis l'éditeur
- Utiliser les filtres Liquid : `{{ image | image_url: width: 800 | image_tag }}`
- Traductions via `{{ 'clé' | t }}` et fichiers `locales/`
- Jamais de logique business dans les templates

## Livraison
Le fichier `.liquid` complet + les clés de traduction à ajouter dans `locales/en.default.json`
