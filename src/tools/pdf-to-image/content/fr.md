---
review: draft
updated: 2026-11-02
title: PDF en image – Convertir un PDF en JPG, PNG ou WebP en ligne
description: Convertissez les pages d'un PDF en images JPG, PNG ou WebP à 72, 150 ou 300 DPI. Gratuit et privé — tout se fait dans votre navigateur, rien n'est envoyé.
name: PDF en image
answer: Choisissez un PDF, sélectionnez JPEG, PNG ou WebP et une résolution, puis appuyez sur Convertir en images. Chaque page devient une image sur votre appareil ; saisissez des pages comme 1-3, 5 pour ne convertir que celles-ci.
action: Convertir en images
fields:
  file:
    label: Fichier PDF
  pages:
    label: Pages
    placeholder: Toutes, ou 1-3, 5, 8-
  format:
    label: Format d'image
    options:
      jpeg: JPEG (s'ouvre partout)
      png: PNG (sans perte, texte le plus net)
      webp: WebP (léger, navigateurs récents)
  dpi:
    label: Résolution
    options:
      "72": 72 DPI (écran, le plus léger)
      "150": 150 DPI (net à l'écran)
      "300": 300 DPI (qualité impression)
  quality:
    label: Qualité (1–100)
output:
  files:
    label: Images
errors:
  encrypted: "Ce PDF est protégé par un mot de passe. Retirez le mot de passe puis réessayez :"
  invalid_pdf: "Impossible de lire ce fichier comme un PDF. Il est peut-être endommagé. Exportez-le à nouveau puis réessayez :"
  invalid_pages: "Saisissez les pages sous forme de numéros et de plages séparés par des virgules, comme 1-3, 5, 8-. Cette partie est illisible :"
  page_out_of_range: "Cette page n'existe pas. Nombre de pages de ce PDF :"
  too_many_files: Cela créerait plus de 500 images. Saisissez une plage de pages plus petite, comme 1-100, et convertissez le reste dans une autre exécution.
  too_large: "Cette page est trop grande à la résolution choisie : un côté dépasserait 10 000 pixels, ou votre navigateur ne peut pas gérer autant de pixels. Choisissez une résolution plus basse ou laissez cette page de côté. Page :"
steps:
  - Choisissez un fichier PDF de 50 Mo maximum.
  - Laissez Pages vide pour convertir toutes les pages, ou saisissez des pages comme 1-3, 5, 8-. Les pages se comptent à partir de 1, et 8- va jusqu'à la dernière page.
  - Choisissez le Format d'image et la Résolution. 150 DPI est net à l'écran ; 300 DPI sert à l'impression et donne quatre fois plus de pixels.
  - Pour JPEG et WebP, gardez la qualité par défaut de 85 ou choisissez la vôtre. PNG ignore ce réglage.
  - Appuyez sur Convertir en images, puis téléchargez chaque image ou toutes à la fois dans un fichier ZIP.
faq:
  - q: Mon PDF est-il envoyé sur un serveur ?
    a: Non. Les pages sont rendues dans votre navigateur par PDFium compilé en WebAssembly, le fichier ne quitte donc jamais votre appareil.
  - q: Quel format choisir ?
    a: JPEG s'ouvre presque partout et convient aux pages contenant des photos. PNG est sans perte et garde le texte et les traits les plus nets, mais les fichiers sont plus lourds. WebP donne des fichiers plus légers que JPEG à qualité comparable et s'ouvre dans les navigateurs actuels.
  - q: Quelle taille feront les images ?
    a: La taille en pixels correspond à la taille de la page en points multipliée par la résolution, divisée par 72. Une page A4 donne 595 × 842 pixels à 72 DPI, 1240 × 1754 à 150 DPI et 2480 × 3508 à 300 DPI.
  - q: Puis-je convertir une seule page ?
    a: Oui. Saisissez son numéro dans Pages, par exemple 4. Vous pouvez indiquer plusieurs pages et plages, comme 1, 3-5 ; chaque page est convertie une fois, dans l'ordre où vous les saisissez.
  - q: Pourquoi le fond est-il blanc et non transparent ?
    a: Chaque page est dessinée sur du blanc, comme dans les lecteurs PDF, pour que JPEG, PNG et WebP aient le même rendu. Les zones transparentes de la page ne sont pas conservées.
  - q: Puis-je sélectionner ou copier le texte des images ?
    a: Non. Les images sont des reproductions des pages, le texte devient donc des pixels. Pour garder le texte sélectionnable, extrayez plutôt les pages en PDF avec Diviser PDF.
---

## Fonctionnement de la conversion

L'outil utilise PDFium — le moteur PDF de Google Chrome — compilé en WebAssembly. Il dessine chaque page choisie sur un fond blanc à la résolution sélectionnée, y compris les annotations enregistrées dans le fichier comme les surlignages et les champs de formulaire remplis, et remet à l'endroit les pages prévues pour s'afficher pivotées. Chaque page est ensuite encodée en JPEG ou WebP avec la qualité choisie, ou en PNG sans perte. Le travail se fait dans un thread en arrière-plan, la page reste donc réactive.

## Options et limites

- **Entrée :** un fichier PDF de 50 Mo maximum.
- **Pages :** pages seules et plages séparées par des virgules. Chaque page doit exister dans le fichier ; une page indiquée deux fois n'est convertie qu'une fois.
- **Sortie :** jusqu'à 500 images par exécution, nommées d'après le fichier et le numéro de page, comme report-3.jpg.
- **Résolution :** 72, 150 ou 300 DPI. Aucun côté d'une image ne peut dépasser 10 000 pixels, les très grandes pages comme les affiches et les plans demandent donc une résolution plus basse.
- **Mots de passe :** les fichiers qui demandent un mot de passe à l'ouverture ne peuvent pas être convertis.
- **Mémoire :** le fichier et toutes les images sont gardés en mémoire, les longs documents à 300 DPI peuvent donc échouer sur mobile. Convertissez-les par plages de pages plus petites.

Pour garder les pages au format PDF, utilisez [Diviser PDF](/fr/split-pdf) ; pour changer ensuite le format des images, utilisez le [Convertisseur d'images](/fr/image-converter).

## Confidentialité

Votre document est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le stocke pas et n'utilise pas de cookies.
