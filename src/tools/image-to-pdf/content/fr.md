---
review: draft
updated: 2026-11-03
title: Image en PDF – Convertir JPG, PNG et WebP en PDF en ligne gratuit
description: Réunissez des images JPG, PNG, WebP et AVIF dans un seul PDF, en A4, Letter ou au format de l'image. Gratuit et privé — vos images ne sont jamais envoyées.
name: Image en PDF
answer: Choisissez vos images, mettez-les dans l'ordre, choisissez un format de page et cliquez sur Créer le PDF — chaque image devient une page d'un seul PDF, créé sur votre appareil et prêt à être téléchargé.
action: Créer le PDF
fields:
  files:
    label: Images (JPEG, PNG, WebP ou AVIF)
  pageSize:
    label: Format de page
    options:
      a4: A4 (210 × 297 mm)
      letter: US Letter (8,5 × 11 po)
      fit: Identique à l'image
  orientation:
    label: Orientation
    options:
      auto: Automatique (selon chaque image)
      portrait: Portrait
      landscape: Paysage
  margin:
    label: Marge
    options:
      none: Aucune
      small: Petite (0,5 po)
      large: Grande (1 po)
output:
  file:
    label: PDF
errors:
  decode_failed: "Impossible de lire ce fichier comme une image. Il est peut-être endommagé. Exportez-le à nouveau ou retirez-le de la liste, puis réessayez :"
  too_large: "Cette image a trop de pixels pour que votre navigateur la traite. Réduisez-la avec le Redimensionneur d'images ou retirez-la de la liste, puis réessayez :"
steps:
  - Choisissez jusqu'à 50 images JPEG, PNG, WebP ou AVIF, jusqu'à 50 Mo chacune. Vous pouvez les ajouter en plusieurs fois.
  - Utilisez les flèches vers le haut et vers le bas pour ordonner les images. La première image devient la première page.
  - Choisissez le Format de page. A4 et US Letter conviennent aux documents à imprimer ; Identique à l'image donne à chaque page exactement la taille de son image.
  - En A4 et US Letter, laissez l'Orientation sur Automatique pour passer en paysage les pages des images larges, ou choisissez Portrait ou Paysage pour toutes les pages. Ajoutez une Marge si vous voulez un espace blanc autour des images.
  - Cliquez sur Créer le PDF et téléchargez le fichier.
faq:
  - q: Mes images sont-elles envoyées sur un serveur ?
    a: Non. Le PDF est créé dans votre navigateur avec PDFium compilé en WebAssembly, donc vos images ne quittent jamais votre appareil.
  - q: La conversion en PDF réduit-elle la qualité des images ?
    a: Pas pour JPEG, PNG et WebP sans perte. Les fichiers JPEG sont placés dans le PDF octet pour octet, sans nouvelle compression, et les images PNG et WebP sans perte gardent toute leur qualité. Les images WebP avec perte et AVIF sans transparence sont converties en JPEG de qualité 90 pour garder un fichier léger, ce qui peut ajouter de légers artefacts de compression.
  - q: La photo de mon téléphone apparaît couchée dans d'autres outils. Sera-t-elle droite ici ?
    a: Oui. Les téléphones enregistrent souvent les photos dans l'orientation du capteur, avec une balise de rotation. L'outil lit cette balise et place la photo dans le bon sens, sans la réencoder.
  - q: Comment les images sont-elles placées sur des pages A4 ou Letter ?
    a: Chaque image est mise à l'échelle pour tenir dans les marges, en gardant ses proportions, et centrée sur la page. Les petites images sont agrandies pour remplir l'espace ; les très petites peuvent donc paraître floues à l'impression.
  - q: Quelle est la taille d'une page avec Identique à l'image ?
    a: La page prend la taille de l'image à 96 pixels par pouce, plus la marge éventuelle. Une capture d'écran de 1920 × 1080 pixels devient une page de 20 × 11,25 pouces.
  - q: Puis-je ajouter des photos HEIC d'un iPhone ?
    a: Pas directement. Convertissez-les d'abord en JPEG avec le Convertisseur d'images, puis ajoutez ici les fichiers JPEG.
---

## Fonctionnement de la création du PDF

L'outil utilise PDFium — le moteur PDF de Google Chrome — compilé en WebAssembly, et crée une page par image dans l'ordre de votre liste. Chaque fichier est d'abord décodé par votre navigateur pour vérifier qu'il s'agit d'une image lisible. Ensuite, les fichiers JPEG sont intégrés sans modification, et leur balise de rotation est appliquée en faisant pivoter l'image sur la page. Les images PNG, les images WebP sans perte et toute image avec transparence sont stockées sans perte ; les zones transparentes laissent voir le blanc de la page. Les images WebP avec perte et AVIF sans transparence sont converties en JPEG de qualité 90. Le travail se fait dans un thread en arrière-plan, la page reste donc réactive.

## Options et limites

- **Entrée :** de 1 à 50 images JPEG, PNG, WebP ou AVIF, jusqu'à 50 Mo chacune. Le HEIC n'est pas accepté ; convertissez-le d'abord avec le [Convertisseur d'images](/fr/image-converter).
- **Pages :** A4 (210 × 297 mm), US Letter (8,5 × 11 po) ou la taille de chaque image à 96 pixels par pouce. Les marges font 0,5 po (12,7 mm) ou 1 po (25,4 mm) de chaque côté.
- **Placement :** les images gardent leurs proportions, sont centrées et agrandies ou réduites pour tenir dans les marges. Rien n'est rogné.
- **Sortie :** un PDF nommé d'après la première image. Le texte des images ne peut être ni recherché ni sélectionné.
- **Mémoire :** les images stockées sans perte restent non compressées en mémoire jusqu'à l'enregistrement du PDF ; de nombreuses grandes captures d'écran peuvent donc échouer sur téléphone. Créez le PDF en plusieurs lots et réunissez-les avec [Fusionner PDF](/fr/merge-pdf).

Pour réduire vos photos avant de les ajouter, utilisez le [Redimensionneur d'images](/fr/image-resizer) ; pour retransformer des pages PDF en images, utilisez [PDF en image](/fr/pdf-to-image).

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
