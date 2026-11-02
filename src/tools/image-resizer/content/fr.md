---
review: draft
updated: 2026-11-02
title: Redimensionneur d'images – JPEG, PNG, WebP et AVIF en ligne
description: Redimensionnez vos images à la largeur et à la hauteur exactes, gratuitement. Privé et rapide — tout se fait dans votre navigateur, vos photos ne sont jamais envoyées.
name: Redimensionneur d'images
answer: Choisissez vos images, saisissez une largeur, une hauteur ou les deux, puis cliquez sur Redimensionner les images — elles sont redimensionnées sur votre appareil, dans le même format, et vous téléchargez les résultats.
action: Redimensionner les images
fields:
  files:
    label: Images (JPEG, PNG, WebP ou AVIF)
  width:
    label: Largeur (px)
    placeholder: Auto
  height:
    label: Hauteur (px)
    placeholder: Auto
  fit:
    label: Quand les deux dimensions sont renseignées
    options:
      contain: Ajuster à l'intérieur en gardant les proportions
      cover: Remplir la taille et rogner l'excédent
      stretch: Étirer à la taille exacte
  quality:
    label: Qualité (1–100)
output:
  files:
    label: Images redimensionnées
errors:
  decode_failed: "Impossible de lire ce fichier comme une image. Il est peut-être endommagé. Exportez-le à nouveau ou retirez-le, puis réessayez :"
  too_large: "L'image redimensionnée serait trop grande : un côté dépasserait 10 000 pixels, ou votre navigateur ne peut pas contenir autant de pixels. Saisissez une taille plus petite et réessayez :"
  size_required: Saisissez une largeur, une hauteur ou les deux.
steps:
  - Choisissez jusqu'à 20 images JPEG, PNG, WebP ou AVIF, de 50 Mo maximum chacune.
  - Saisissez une largeur, une hauteur ou les deux, en pixels. Si vous n'en saisissez qu'une, l'autre découle des proportions de chaque image.
  - Si vous avez saisi les deux, choisissez comment l'image doit occuper cette taille. Ajuster à l'intérieur garde l'image entière, Remplir rogne l'excédent de façon égale des deux côtés, et Étirer ignore les proportions.
  - Cliquez sur Redimensionner les images, puis téléchargez chaque image ou toutes ensemble dans un fichier ZIP.
faq:
  - q: Mes images sont-elles envoyées sur un serveur ?
    a: Non. Les images sont décodées, redimensionnées et encodées dans votre navigateur, elles ne quittent donc jamais votre appareil.
  - q: Comment conserver les proportions ?
    a: Saisissez seulement une largeur ou seulement une hauteur, et l'autre côté est calculé d'après les proportions de chaque image. Si vous saisissez les deux, gardez « Ajuster à l'intérieur en gardant les proportions » sélectionné. L'image tient alors dans cette taille, un côté peut donc être plus petit que votre valeur.
  - q: Comment obtenir une taille exacte sans déformer l'image ?
    a: Saisissez une largeur et une hauteur, puis choisissez « Remplir la taille et rogner l'excédent ». L'image est agrandie ou réduite jusqu'à couvrir la taille, et ce qui dépasse est coupé de façon égale des deux côtés.
  - q: Puis-je agrandir une image ?
    a: Oui, jusqu'à 10 000 pixels par côté. L'agrandissement ne fait qu'étaler les pixels existants sur une surface plus grande, l'image devient donc plus floue et ne gagne aucun détail.
  - q: Puis-je redimensionner des photos HEIC d'un iPhone ?
    a: Pas directement. Convertissez-les d'abord avec le [Convertisseur d'images](/fr/image-converter), puis redimensionnez le résultat.
  - q: Les données EXIF de la photo sont-elles conservées ?
    a: Non. L'image est encodée à nouveau à partir de ses pixels, le résultat ne contient donc pas les données EXIF comme le modèle d'appareil et la position GPS. L'orientation EXIF est d'abord appliquée à l'image, elle s'affiche donc toujours dans le bon sens.
---

## Fonctionnement du redimensionnement

L'outil décode chaque image avec le décodeur intégré à votre navigateur, qui applique aussi l'orientation EXIF. Il dessine l'image à la nouvelle taille sur un canvas et réduit les fortes réductions par étapes d'au plus la moitié, ce qui évite que les détails fins deviennent crénelés. Le résultat est encodé à nouveau avec des versions WebAssembly de MozJPEG, libwebp et libaom, et la sortie PNG passe par OxiPNG. Le travail s'effectue dans un thread en arrière-plan, une image à la fois.

## Options et limites

- **Entrée :** de 1 à 20 images JPEG, PNG, WebP ou AVIF, de 50 Mo maximum chacune. Le format de sortie est toujours celui de l'entrée.
- **Taille :** de 1 à 10 000 pixels par côté. Les navigateurs mobiles peuvent accepter moins de pixels au total ; l'outil s'arrête alors avec un message.
- **Qualité :** s'applique au JPEG, au WebP et à l'AVIF, avec 85 par défaut. Le PNG est toujours sans perte.
- **Transparence :** conservée en PNG, WebP et AVIF.
- **Navigateurs :** l'encodage AVIF et PNG utilise plusieurs threads lorsque le navigateur l'autorise ; les navigateurs basés sur WebKit, comme Safari, n'en utilisent qu'un, ces formats y sont donc plus longs.

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
