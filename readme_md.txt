# [BRAND_NAME] - Site Web Artisane Crochet

Site web statique complet pour une artisane créatrice de pièces uniques en crochet fait main, sur-mesure et écoresponsables.

## 🎯 Fonctionnalités principales

- **Design chaleureux et premium** avec identité visuelle cohérente
- **Catalogue produits** avec filtres et recherche
- **Système sur-mesure** avec formulaire de brief
- **Blog intégré** avec articles d'expertise
- **FAQ complète** avec JSON-LD structuré
- **SEO optimisé** (meta tags, structured data, sitemap)
- **Responsive design** adaptatif mobile/desktop
- **Performance optimisée** (lazy loading, WebP, scripts différés)
- **Accessibilité soignée** (ARIA, contrastes, navigation clavier)

## 📁 Structure du projet

```
/
├── index.html                    # Page d'accueil
├── catalogue.html                # Catalogue avec filtres
├── produit.html                  # Template fiche produit
├── sur-mesure.html               # Brief et formulaire sur-mesure
├── a-propos.html                 # Histoire et valeurs
├── blog.html                     # Liste articles
├── article.html                  # Template article
├── faq.html                      # Questions fréquentes
├── contact.html                  # Formulaire contact
├── assets/
│   ├── css/style.css            # Styles principaux
│   ├── js/main.js               # JavaScript vanilla
│   └── img/placeholders/        # Images placeholder
├── data/
│   └── produits.json            # Données produits
├── robots.txt                    # Instructions robots SEO
├── sitemap.xml                  # Plan du site
├── manifest.webmanifest         # PWA manifest
├── favicon.svg                  # Icône site
└── README.md                    # Ce fichier
```

## 🎨 Identité visuelle

### Palette de couleurs
- **Écru** (`#F3EEE7`) : Fond principal, douceur naturelle
- **Terracotta** (`#C66A4A`) : Accent, boutons, titres importants
- **Sauge** (`#8CA17C`) : Secondaire, textes d'accompagnement
- **Charcoal** (`#2F2F2F`) : Texte principal, contrastes
- **Rose** (`#EAC7C7`) : Survols, détails délicats

### Typographies
- **Titres** : Fraunces (serif organique, caractère artisanal)
- **Corps** : Nunito (sans-serif lisible, moderne)
- **Accents** : Caveat (manuscrite, pour citations courtes)

## 🖼️ Remplacement des images

### Emplacements des placeholders

```
assets/img/placeholders/
├── hero.jpg/.webp              # Image hero accueil (1920x1080)
├── story-1.jpg/.webp           # Atelier crochet (800x600)
├── story-2.jpg/.webp           # Matières premières (800x600)  
├── story-3.jpg/.webp           # Emballage eco (800x600)
├── custom-process.jpg/.webp    # Processus sur-mesure (800x600)
├── og-image.jpg                # Open Graph général (1200x630)
├── og-catalogue.jpg            # Open Graph catalogue (1200x630)
├── og-faq.jpg                  # Open Graph FAQ (1200x630)
├── icon-192.png                # Icône PWA 192x192
├── icon-512.png                # Icône PWA 512x512
├── screenshot-mobile.png       # Screenshot mobile (360x640)
├── screenshot-desktop.png      # Screenshot desktop (1280x720)
└── produits/                   # Images produits
    ├── doudou-lapin-1.jpg/.webp
    ├── doudou-lapin-2.jpg/.webp
    ├── cardigan-noisette-1.jpg/.webp
    ├── cardigan-noisette-2.jpg/.webp
    ├── hochet-feuille-1.jpg/.webp
    └── ... (autres produits)
```

### Conseils pour les photos

- **Format** : JPG pour photos, WebP en version optimisée
- **Résolution** : Hero 1920px large, produits 800px, portraits 600px  
- **Style** : Lumière naturelle, tons chauds, mise en scène lifestyle
- **Alt-text** : Déjà rédigés, descriptifs et riches pour le SEO

## 📝 Personnalisation du contenu

### Variables à remplacer dans tous les fichiers

Remplacez ces placeholders par vos vraies informations :

- `[BRAND_NAME]` : Nom de votre marque
- `[CITY]` : Votre ville (ex: "Lyon", "Bordeaux")  
- `[EMAIL]` : Votre adresse email
- `[INSTAGRAM]` : URL de votre Instagram (ex: "https://instagram.com/votrecompte")
- `[ETSY_URL]` : URL Etsy (optionnel, caché si non renseigné)

### Édition des produits

Modifiez le fichier `data/produits.json` pour ajouter vos créations :

```json
{
    "id": 10,
    "slug": "mon-nouveau-produit",
    "name": "Mon Nouveau Produit",
    "category": "doudous",
    "description": "Description attrayante...",
    "images": ["./assets/img/placeholders/mon-produit-1.jpg"],
    "alt": "Description SEO de l'image",
    "price": 35,
    "couleurs": ["ecru", "terracotta"],
    "matieres": ["coton-bio"],
    "delai": "2-3 semaines",
    "featured": false
}
```

**Propriétés importantes :**
- `slug` : URL-friendly, unique
- `category` : "doudous", "vetements", "accessoires", "decoration"
- `couleurs` : "ecru", "terracotta", "sage", "rose", "blanc"
- `matieres` : "coton-bio", "laine-merinos", "bambou"
- `featured` : `true` pour afficher en page d'accueil

## 📬 Configuration des formulaires

### Méthode par défaut : mailto

Les formulaires utilisent `mailto:[EMAIL]` par défaut. Les données sont envoyées par email avec le client de messagerie de l'utilisateur.

### Intégration Formspree (recommandé)

1. Créez un compte sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire
3. Remplacez dans `contact.html` et `sur-mesure.html` :

```html
<!-- Remplacer -->
<form method="post" action="mailto:[EMAIL]">

<!-- Par -->
<form method="post" action="https://formspree.io/f/VOTRE_ID">
```

### Autres solutions
- **Netlify Forms** : Ajoutez `netlify` dans l'attribut `form`
- **Getform.io** : Service similaire à Formspree
- **EmailJS** : Envoi côté client via JavaScript

## 💳 Intégration paiements (optionnel)

### Stripe Checkout

Pour ajouter un bouton "Payer un acompte" :

1. Créez un compte Stripe
2. Configurez vos produits dans le dashboard
3. Ajoutez dans vos fiches produits :

```html
<a href="https://buy.stripe.com/VOTRE_LIEN" 
   class="btn btn--primary" 
   target="_blank" 
   rel="noopener">
   Payer un acompte (30%)
</a>
```

### PayPal, Square

Intégrations similaires possibles avec leurs boutons de paiement.

## 📊 Analytics respectueux

### Plausible (recommandé)

Script commenté dans le code, à décommenter après inscription :

```html
<!-- Décommentez et remplacez YOUR_DOMAIN -->
<!-- <script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script> -->
```

### Matomo

Alternative auto-hébergée pour un contrôle total des données.

## 🚀 Déploiement

### GitHub Pages (gratuit)

1. Créez un repository GitHub
2. Uploadez tous les fichiers 
3. Dans Settings > Pages, activez "Deploy from branch main"
4. Votre site sera disponible sur `https://username.github.io/repository`

### Netlify (recommandé)

1. Connectez votre repository GitHub à Netlify
2. Déploiement automatique à chaque commit
3. Formulaires intégrés, redirections HTTPS
4. Nom de domaine personnalisé facile

### Autres options

- **Vercel** : Excellent pour les sites statiques
- **OVH** : Hébergeur français, simple upload FTP
- **Hostinger** : Économique avec panneau de contrôle

## ✅ Checklist QA avant mise en ligne

### Contenu
- [ ] Tous les placeholders `[BRAND_NAME]`, `[EMAIL]`, etc. remplacés
- [ ] Images placeholders remplacées par vos vraies photos
- [ ] Données produits actualisées dans `produits.json`
- [ ] Textes personnalisés (pas de contenu générique restant)

### SEO
- [ ] Balises `<title>` uniques (55-60 caractères max)
- [ ] Meta descriptions rédigées (150-160 caractères)
- [ ] Images avec attributs `alt` descriptifs
- [ ] JSON-LD validé sur [validator.schema.org](https://validator.schema.org)
- [ ] Sitemap.xml avec vos vraies URLs

### Performance  
- [ ] Images optimisées (WebP + JPG de secours)
- [ ] Pas de scripts bloquants en début de page
- [ ] Test vitesse sur [PageSpeed Insights](https://pagespeed.web.dev)
- [ ] Lazy loading fonctionnel sur images

### Accessibilité
- [ ] Navigation possible au clavier (Tab, Entrée, Échap)
- [ ] Contrastes suffisants (vérifiés sur WebAIM)
- [ ] Labels présents sur tous les champs de formulaire
- [ ] Test avec lecteur d'écran (NVDA/JAWS)

### Fonctionnel
- [ ] Menu mobile opérationnel
- [ ] Filtres catalogue fonctionnels
- [ ] Formulaires avec validation côté client
- [ ] Liens internes et externes valides
- [ ] Test sur mobile, tablette, desktop

### Légal
- [ ] Mentions légales adaptées à votre situation
- [ ] CGV rédigées (si vente directe)
- [ ] Politique de confidentialité conforme RGPD

## 🎨 Personnalisations avancées

### Couleurs personnalisées

Modifiez les variables CSS dans `assets/css/style.css` :

```css
:root {
    --ecru: #VotreCouleur1;
    --terracotta: #VotreCouleur2;
    --sage: #VotreCouleur3;
    /* ... */
}
```

### Ajout de sections

Le code est modulaire, vous pouvez facilement ajouter :
- Nouvelles pages (dupliquer la structure existante)
- Sections sur les pages actuelles
- Nouveaux filtres produits
- Champs de formulaires supplémentaires

### Mode sombre

Un début d'implémentation est présent avec `prefers-color-scheme`. Complétez selon vos besoins.

## 🐛 Dépannage

### Problèmes courants

**Les produits n'apparaissent pas**
- Vérifiez que `data/produits.json` est accessible
- Ouvrez la console navigateur (F12) pour voir les erreurs

**Les images ne s'affichent pas**
- Vérifiez les chemins dans `produits.json`
- Assurez-vous que les fichiers existent dans `/assets/img/placeholders/`

**Les filtres ne fonctionnent pas**
- JavaScript activé dans le navigateur ?
- Erreurs dans la console développeur ?

**Le site est lent**
- Optimisez vos images (compressez, convertissez en WebP)
- Vérifiez qu'il n'y a pas d'images très lourdes

## 📞 Support

Pour des personnalisations avancées ou de l'aide technique, n'hésitez pas à faire appel à un développeur web freelance ou une agence spécialisée.

## 📄 Licence

Ce code est fourni à titre d'exemple. Vous êtes libre de l'utiliser et de le modifier pour votre projet personnel ou commercial.

---

**Bonne chance avec votre site web artisanal ! 🧶✨**