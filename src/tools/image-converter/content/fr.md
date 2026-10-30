---
review: reviewed
updated: 2026-10-30
title: Convertisseur d'images – HEIC, JPEG, PNG, WebP et AVIF en ligne
description: "Convertissez des photos HEIC d'iPhone ou des images JPEG, PNG, WebP et AVIF en JPEG, PNG, WebP ou AVIF. Gratuit et privé : tout est traité dans votre navigateur."
name: Convertisseur d'images
answer: "Choisissez une image, sélectionnez le format de sortie et cliquez sur Convertir l'image : le fichier HEIC, JPEG, PNG, WebP ou AVIF est réencodé sur votre appareil, puis vous téléchargez la copie convertie."
action: Convertir l'image
fields:
  file:
    label: Image (HEIC, JPEG, PNG, WebP ou AVIF)
  format:
    label: Convertir en
    options:
      jpeg: JPEG (s'ouvre partout)
      png: PNG (sans perte, conserve la transparence)
      webp: WebP (léger, navigateurs récents)
      avif: AVIF (le plus léger, plus lent)
  quality:
    label: Qualité (1–100)
output:
  file:
    label: Image convertie
errors:
  decode_failed: "Cette image n'a pas pu être lue. Elle est peut-être endommagée, utilise une variante de HEIC que le décodeur ne prend pas en charge ou a un format que votre navigateur ne sait pas décoder. Essayez une autre copie de l'image ou ouvrez la page dans la dernière version de Chrome, Firefox ou Safari."
steps:
  - "Choisissez une image HEIC, JPEG, PNG, WebP ou AVIF d'au plus 50 Mo."
  - "Choisissez le format de sortie. JPEG s'ouvre presque partout ; PNG est sans perte et conserve la transparence ; WebP et AVIF donnent des fichiers plus légers."
  - "Gardez la qualité par défaut de 85 ou réglez la vôtre : des valeurs plus basses donnent des fichiers plus légers, avec des artefacts plus visibles. PNG ignore ce réglage."
  - "Cliquez sur Convertir l'image, puis téléchargez le fichier converti. Les grandes images, et surtout la sortie en AVIF, peuvent demander plusieurs secondes."
faq:
  - q: "Mes images sont-elles envoyées à un serveur ?"
    a: "Non. L'image est décodée et réencodée dans votre navigateur avec WebAssembly, elle ne quitte donc jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion."
  - q: "Comment convertir une photo HEIC d'iPhone en JPG ?"
    a: "Choisissez le fichier .heic, laissez JPEG sélectionné et cliquez sur Convertir l'image. Les fichiers HEIC sont décodés par la page elle-même : cela fonctionne donc dans les navigateurs qui ne peuvent pas ouvrir le HEIC, comme Chrome et Firefox. La première conversion d'un HEIC télécharge un décodeur d'environ 2 Mo."
  - q: "Puis-je convertir en HEIC ?"
    a: "Non. Les navigateurs n'ont pas d'encodeur HEIC, le HEIC ne peut donc servir qu'en entrée. Les formats de sortie sont JPEG, PNG, WebP et AVIF."
  - q: "Quel format de sortie choisir ?"
    a: "JPEG est le choix le plus sûr pour partager et imprimer. PNG convient le mieux aux captures d'écran, aux logos et à tout ce qui comporte de la transparence. WebP et AVIF donnent des fichiers plus légers pour le web, mais certaines anciennes applications ne savent pas les ouvrir."
  - q: "Que deviennent les zones transparentes ?"
    a: "PNG, WebP et AVIF conservent la transparence. JPEG n'a pas de transparence : les pixels transparents sont donc remplis de blanc."
  - q: "Les métadonnées de la photo sont-elles conservées ?"
    a: "Non. Les métadonnées, comme les données EXIF de l'appareil photo et la position GPS, ne sont pas copiées dans le fichier converti, ce qui protège aussi votre vie privée. Les profils colorimétriques intégrés ne sont pas repris non plus : les photos à gamut étendu, comme les images Display P3 d'iPhone, peuvent donc paraître un peu moins saturées."
---

## Comment fonctionne la conversion

Les fichiers HEIC et HEIF sont décodés avec [libheif](https://github.com/strukturag/libheif), compilé en WebAssembly et chargé seulement lorsque vous choisissez un tel fichier. Les fichiers JPEG, PNG, WebP et AVIF sont décodés par votre navigateur. Les pixels sont ensuite réencodés avec MozJPEG, libwebp ou libaom (les codecs utilisés par Squoosh, de Google) ou, pour le PNG, avec l'encodeur PNG du navigateur suivi d'une optimisation sans perte par OxiPNG. Tout cela s'exécute dans un thread d'arrière-plan : la page reste réactive.

## Options et limites

- **Formats d'entrée :** HEIC, HEIF, JPEG, PNG, WebP et AVIF. Les autres formats, comme GIF, SVG ou BMP, ne sont pas acceptés.
- **Formats de sortie :** JPEG, PNG, WebP ou AVIF. La sortie a les mêmes dimensions en pixels que l'entrée.
- **Taille :** jusqu'à 50 Mo par image. Les très grandes images demandent beaucoup de mémoire et peuvent échouer sur un téléphone.
- **Quantité :** une image à la fois.
- **Animation et images multiples :** seule la première image ou la première trame est convertie ; les fichiers WebP et AVIF animés, et les fichiers HEIC qui contiennent plusieurs images, donnent donc une seule image fixe.
- **Qualité :** s'applique à JPEG, WebP et AVIF ; la sortie PNG est toujours sans perte.
- **Navigateurs :** le HEIC fonctionne dans tous les navigateurs pris en charge. Pour les autres formats d'entrée, votre navigateur décode d'abord l'image : un format qu'il ne sait pas afficher, comme l'AVIF dans un ancien navigateur, est donc refusé.

## Confidentialité

Votre image est traitée uniquement sur votre appareil. La page ne l'envoie pas, ne la stocke pas et n'utilise pas de cookies.
