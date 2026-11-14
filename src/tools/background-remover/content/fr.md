---
review: reviewed
updated: 2026-11-14
title: "Supprimer l'arrière-plan – Détourer une image en ligne gratuitement"
description: "Supprimez l'arrière-plan d'une photo pour obtenir un PNG ou un WebP transparent, ou une couleur unie. Gratuit et privé : l'IA tourne dans votre navigateur."
name: "Supprimer l'arrière-plan"
answer: "Choisissez une photo, gardez PNG pour un arrière-plan transparent ou saisissez une couleur d'arrière-plan, puis cliquez sur Supprimer l'arrière-plan pour qu'un modèle d'IA sur votre appareil supprime l'arrière-plan avant le téléchargement."
action: "Supprimer l'arrière-plan"
fields:
  file:
    label: "Image (HEIC, JPEG, PNG, WebP ou AVIF)"
  format:
    label: "Format de sortie"
    options:
      png: "PNG (transparent)"
      webp: "WebP (transparent)"
      jpeg: "JPEG (couleur d'arrière-plan requise)"
  background:
    label: "Couleur d'arrière-plan (hexadécimal)"
    placeholder: "Transparent, ou une couleur comme #ffffff"
  quality:
    label: "Qualité (1–100)"
output:
  file:
    label: "Image sans arrière-plan"
errors:
  decode_failed: "Ce fichier n'a pas pu être lu comme une image. Il est peut-être endommagé, ou votre navigateur ne sait pas décoder son format. Exportez-le à nouveau en JPEG ou en PNG, puis réessayez."
  too_large: "Votre navigateur ne peut pas contenir autant de pixels. Les navigateurs mobiles en acceptent moins que ceux des ordinateurs ; essayez une image plus petite ou un ordinateur."
  background_required: "Le JPEG ne gère pas la transparence : il lui faut une couleur d'arrière-plan. Saisissez-en une, par exemple #ffffff pour le blanc, ou choisissez PNG ou WebP pour garder l'arrière-plan transparent."
  invalid_color: "Saisissez la couleur d'arrière-plan sous forme de code hexadécimal à trois ou six chiffres, comme #fff ou #ffffff, ou laissez le champ vide. Valeur illisible :"
steps:
  - "Choisissez une image HEIC, JPEG, PNG, WebP ou AVIF de 50 Mo maximum."
  - "Choisissez un format dans Format de sortie. PNG et WebP gardent l'arrière-plan transparent ; le JPEG a besoin d'une couleur d'arrière-plan."
  - "Pour placer le sujet sur une couleur unie, saisissez-la dans Couleur d'arrière-plan (hexadécimal), par exemple #ffffff."
  - "Cliquez sur Supprimer l'arrière-plan. La première fois, le modèle d'IA et son environnement d'exécution (environ 125–150 Mo) sont téléchargés, puis enregistrés dans votre navigateur s'il y a de la place."
  - "Téléchargez l'image sans arrière-plan."
faq:
  - q: "Mes photos sont-elles envoyées sur un serveur ?"
    a: "Non. L'image est décodée, analysée par le modèle et encodée à nouveau dans votre navigateur. L'outil télécharge le modèle d'IA et son environnement d'exécution, mais votre photo ne quitte jamais votre appareil."
  - q: "Comment obtenir un arrière-plan blanc, par exemple pour une photo de produit ?"
    a: "Saisissez #ffffff comme couleur d'arrière-plan. Le sujet est placé sur du blanc et le résultat n'a pas de transparence, vous pouvez donc aussi l'enregistrer en JPEG."
  - q: "Pourquoi la première fois est-elle plus lente ?"
    a: "L'outil télécharge d'abord le modèle BiRefNet et son environnement d'exécution, environ 125–150 Mo selon votre appareil, et les enregistre dans votre navigateur s'il y a de la place. Les fois suivantes, il peut réutiliser cette copie tant que le navigateur la conserve."
  - q: "Puis-je choisir l'objet à garder ?"
    a: "Non. Le modèle choisit lui-même le sujet principal, et il n'est pas possible de désigner un objet à la main. Vérifiez les contours du résultat avant de l'utiliser."
  - q: "Puis-je supprimer l'arrière-plan de plusieurs images à la fois ?"
    a: "Pas avec cet outil, qui traite une image à la fois. Une fois le modèle chargé, les images suivantes sont traitées sans le télécharger à nouveau."
  - q: "Les données EXIF de la photo sont-elles conservées ?"
    a: "Non. L'image est encodée à nouveau à partir de ses pixels, donc les données EXIF comme le modèle d'appareil et la position GPS ne figurent pas dans le résultat. Pour le JPEG, le PNG, le WebP et l'AVIF, l'orientation EXIF est appliquée d'abord, le résultat est donc à l'endroit."
---

## Fonctionnement de la suppression d'arrière-plan

L'outil décode l'image avec le décodeur intégré à votre navigateur, ou avec une version WebAssembly de libheif pour le HEIC, et en transmet une copie à BiRefNet_lite, un modèle de segmentation open source (licence MIT). Le modèle tourne avec ONNX Runtime dans un thread en arrière-plan et calcule, pour chaque pixel, la probabilité qu'il appartienne au sujet. Ce masque est agrandi à la taille complète de votre image et devient sa transparence : le sujet est conservé, et l'arrière-plan devient transparent ou est rempli avec la couleur saisie. Le résultat est encodé en PNG (puis optimisé avec OxiPNG), en WebP ou en JPEG.

## Options et limites

- **Entrée :** une image HEIC, JPEG, PNG, WebP ou AVIF de 50 Mo maximum. Les zones déjà transparentes le restent, sauf si vous saisissez une couleur d'arrière-plan.
- **Sortie :** PNG et WebP gardent l'arrière-plan transparent ; le JPEG ne gère pas la transparence et demande une couleur d'arrière-plan. L'image garde sa largeur et sa hauteur.
- **Couleur d'arrière-plan :** un code hexadécimal comme #ffffff ou #fff. Laissez vide pour un arrière-plan transparent.
- **Qualité :** s'applique au WebP et au JPEG, 90 par défaut. Le PNG est toujours sans perte.
- **Navigateurs :** avec WebGPU et un GPU qui gère les nombres à virgule flottante 16 bits, le modèle tourne sur le GPU et analyse l'image en 1024 × 1024 pixels. Sinon, il tourne sur le processeur en 512 × 512 pixels, si bien que les contours peuvent être moins précis sur les grandes images. Sur le processeur, il utilise plusieurs threads quand le navigateur le permet.
- **Téléchargement :** le modèle et son environnement d'exécution pèsent environ 150 Mo avec WebGPU, ou environ 125 Mo sans, et se téléchargent à la première utilisation.
- **Précision :** le modèle repère automatiquement le sujet principal ; vous ne pouvez pas choisir l'objet à garder.

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
