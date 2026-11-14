---
review: reviewed
updated: 2026-11-14
title: Image en texte – Extraire le texte d'une photo ou capture (OCR)
description: "Copiez le texte de photos, captures et scans en anglais, chinois, japonais et autres langues à alphabet latin. Gratuit et privé : l'OCR tourne dans le navigateur."
name: Image en texte
answer: "Choisissez une image et cliquez sur Extraire le texte pour que des modèles d'IA lisent le texte imprimé sur votre appareil, puis copiez le texte brut, sans choisir de langue au préalable."
action: Extraire le texte
fields:
  file:
    label: Image (HEIC, JPEG, PNG, WebP ou AVIF)
output:
  text:
    label: Texte extrait
errors:
  decode_failed: Ce fichier n'a pas pu être lu comme une image. Il est peut-être endommagé, ou votre navigateur ne sait pas décoder son format. Exportez-le de nouveau en JPEG ou PNG et réessayez.
  too_large: "Cette image a peut-être plus de pixels que votre navigateur ne peut en gérer. Les navigateurs mobiles en acceptent moins que ceux des ordinateurs ; essayez une image plus petite ou un ordinateur."
  no_text: Aucun texte n'a été trouvé dans cette image. Vérifiez que le texte est net et assez grand, ou rognez l'image sur la partie qui contient du texte et réessayez.
steps:
  - "Choisissez une image contenant du texte imprimé dans Image (HEIC, JPEG, PNG, WebP ou AVIF), jusqu'à 50 Mo."
  - "Cliquez sur Extraire le texte. La première fois, les modèles d'IA et ONNX Runtime (environ 60 Mo) sont téléchargés, puis enregistrés dans votre navigateur s'il y a de la place."
  - "Copiez le texte extrait. Le texte trouvé est regroupé en lignes, et une ligne vide marque un écart plus grand, comme un nouveau paragraphe."
faq:
  - q: Mes images sont-elles envoyées sur un serveur ?
    a: "Non. L'image est décodée et lue dans votre navigateur, elle ne quitte donc jamais votre appareil. Seuls les modèles d'IA et les fichiers qui les exécutent sont téléchargés."
  - q: Quelles langues peut-il lire ?
    a: Le chinois (simplifié et traditionnel), le japonais et les langues écrites en alphabet latin, comme le français, l'anglais, l'espagnol, le portugais et l'allemand, y compris les lettres accentuées. Vous ne choisissez pas la langue, et une même image peut en mélanger plusieurs. Il ne lit ni le coréen, ni les écritures cyrillique, arabe, hébraïque, thaïe ou devanagari.
  - q: Est-ce que ça marche avec des photos prises au téléphone ?
    a: "Oui. Le détecteur de texte trouve les lignes dans les photos comme dans les captures d'écran et les scans, y compris les lignes inclinées. Pour un meilleur résultat, utilisez une photo nette où le texte est grand et à plat, et vérifiez le résultat avant de l'utiliser."
  - q: Peut-il lire l'écriture manuscrite ?
    a: "Il n'est pas fait pour cela. L'outil est destiné au texte imprimé, l'écriture manuscrite peut donc être mal lue ; vérifiez attentivement le résultat."
  - q: La mise en page, les tableaux ou la mise en forme sont-ils conservés ?
    a: Non. Vous obtenez du texte brut dans l'ordre de lecture, de haut en bas et de gauche à droite. Le gras, les polices et les cellules de tableau ne sont pas conservés, et sur une page à plusieurs colonnes, les lignes situées à la même hauteur sont réunies d'une colonne à l'autre.
  - q: Pourquoi la première utilisation est-elle plus lente ?
    a: "L'outil télécharge d'abord deux modèles PP-OCRv6 et ONNX Runtime, environ 60 Mo au total, et les enregistre dans votre navigateur s'il y a de la place. Les fois suivantes, il peut réutiliser la copie enregistrée tant que le navigateur la conserve. Ensuite, la durée dépend de la quantité de texte, car chaque ligne est lue séparément."
---

## Comment fonctionne l'extraction du texte

L'outil décode l'image avec le décodeur intégré de votre navigateur, ou avec une version WebAssembly de libheif pour le HEIC, et exécute deux modèles open source de PP-OCRv6, de PaddleOCR (licence Apache-2.0), avec ONNX Runtime dans un thread en arrière-plan. Le modèle de détection repère où se trouve le texte ; chaque zone devient un cadre, qui peut être incliné. Le modèle de reconnaissance lit ensuite chaque cadre, une ligne à la fois : le cadre est découpé dans l'image en pleine résolution et mis à l'échelle à 48 pixels de haut (les lignes très longues sont comprimées à 3 200 pixels de large au plus), et les lignes sont remises dans l'ordre de lecture : de haut en bas et, dans une même ligne, de gauche à droite.

## Options et limites

- **Entrée :** une image HEIC, JPEG, PNG, WebP ou AVIF, jusqu'à 50 Mo. Les zones transparentes sont traitées comme blanches.
- **Sortie :** du texte brut, regroupé en lignes selon leur hauteur dans l'image, avec une ligne vide là où l'écart entre deux lignes dépasse la hauteur d'une ligne de texte.
- **Langues :** chinois (simplifié et traditionnel), japonais, anglais et autres langues en alphabet latin, sans langue à choisir. Le coréen et les écritures cyrillique, arabe, hébraïque, thaïe et devanagari ne sont pas pris en charge.
- **Orientation :** le texte incliné est redressé, et on fait pivoter de 90° dans le sens antihoraire, avant de la lire, toute ligne dont la hauteur vaut au moins 1,5 fois la largeur ; l'écriture verticale peut être mal lue. Le texte à l'envers n'est pas corrigé et peut être mal lu.
- **Mise en page :** les colonnes, les tableaux et la mise en forme ne sont pas conservés.
- **Taille :** pour trouver le texte, l'image est réduite jusqu'à ce que son plus grand côté mesure au plus 2 048 pixels ; un texte très petit dans une grande image peut être manqué, rognez donc d'abord l'image sur le texte. Au plus 1 000 zones candidates sont examinées, donc sur une image très chargée, une partie du texte peut être omise.
- **Navigateurs :** le JPEG, le PNG, le WebP et l'AVIF sont décodés par votre navigateur et fonctionnent donc là où il les prend en charge ; le HEIC utilise libheif. Les modèles tournent sur le processeur, avec plusieurs threads lorsque le navigateur le permet.
- **Téléchargement :** environ 60 Mo à la première utilisation (deux modèles de 10 Mo et 21 Mo, plus ONNX Runtime, partagé avec les autres outils d'IA du site).

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les conserve pas et n'utilise pas de cookies.
