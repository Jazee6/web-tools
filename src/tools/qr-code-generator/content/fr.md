---
review: reviewed
updated: 2026-11-16
title: Générateur de code QR – Codes QR en ligne avec logo et couleurs
description: "Transformez un lien ou un texte en code QR PNG ou SVG, avec vos couleurs, votre taille et un logo au centre. Gratuit et privé : tout se passe dans votre navigateur."
name: Générateur de code QR
answer: Saisissez ou collez un lien ou un texte et le code QR s'affiche au fil de la saisie ; choisissez PNG ou SVG, la taille, les couleurs et un logo facultatif, puis cliquez sur Télécharger pour enregistrer l'image.
action: Générer le code QR
fields:
  text:
    label: Texte ou URL
    placeholder: https://example.com/
  format:
    label: Format
    options:
      png: PNG
      svg: SVG
  size:
    label: Taille (pixels)
  errorCorrection:
    label: Correction d'erreurs
    options:
      L: L – environ 7 %
      M: M – environ 15 %
      Q: Q – environ 25 %
      H: H – environ 30 %
  margin:
    label: Marge (modules)
  foreground:
    label: Couleur de premier plan
  background:
    label: Couleur d'arrière-plan
  logo:
    label: Logo (PNG, JPEG ou WebP, facultatif)
output:
  file:
    label: Code QR
errors:
  too_long: Ce texte est trop long pour un code QR avec ce niveau de correction d'erreurs. Raccourcissez-le ou choisissez un niveau plus bas ; L est celui qui contient le plus.
  too_long_high: Ce texte est trop long pour un code QR avec le niveau de correction d'erreurs H. Raccourcissez-le ou choisissez un niveau plus bas. Avec un logo, le niveau H est toujours utilisé ; retirez d'abord le logo pour utiliser un niveau plus bas.
  too_small: Cette taille est trop petite pour autant de texte ; chaque module ferait moins d'un pixel. Choisissez une taille plus grande ou raccourcissez le texte.
  logo_decode_failed: Ce fichier n'a pas pu être lu comme une image. Il est peut-être endommagé, ou votre navigateur ne sait pas décoder son format. Exportez-le de nouveau en PNG et réessayez.
steps:
  - Saisissez ou collez un lien ou un texte dans Texte ou URL. Le code QR se met à jour au fil de la saisie.
  - Choisissez le Format, la Taille (pixels), la Correction d'erreurs et la Marge (modules) dont vous avez besoin.
  - Si vous le souhaitez, changez la Couleur de premier plan et la Couleur d'arrière-plan, ou ajoutez un logo pour le centre dans Logo (PNG, JPEG ou WebP, facultatif).
  - Scannez le code QR avec votre téléphone pour vérifier qu'il fonctionne.
  - Cliquez sur Télécharger pour enregistrer l'image.
faq:
  - q: Les codes QR expirent-ils ?
    a: Non. Le texte est inscrit dans le motif lui-même, donc le code fonctionne tant que le lien ou le texte qu'il contient reste valable. Rien ne passe par un service de redirection, et il n'y a ni limite de scans ni suivi.
  - q: Dois-je télécharger le PNG ou le SVG ?
    a: Le PNG est une image classique à la taille choisie, pour les documents, les présentations et les sites web. Le SVG est une image vectorielle qui reste nette à toutes les tailles, idéale pour l'impression et les logiciels de design. Certaines applications n'ouvrent pas les fichiers SVG ; utilisez alors le PNG.
  - q: Quel niveau de correction d'erreurs choisir ?
    a: M, la valeur par défaut, convient à la plupart des usages. Un niveau plus élevé permet de lire le code même si une partie est sale, abîmée ou masquée, mais le motif devient plus dense pour un même texte. Les pourcentages indiquent la part des données du code qui peut être restaurée, pas une garantie pour n'importe quelle zone masquée. L contient le plus de texte et donne les plus gros modules, ce qui aide pour les petits codes imprimés. Avec un logo, H est toujours utilisé.
  - q: Mon code QR fonctionnera-t-il avec un logo ?
    a: Normalement, oui. Le logo couvre environ un quart de la largeur du code, au centre, et le niveau de correction d'erreurs H peut restaurer jusqu'à environ 30 % des données du code. Scannez le résultat avec un ou deux téléphones avant de l'imprimer, surtout avec un texte long ou des couleurs claires.
  - q: Puis-je utiliser n'importe quelle couleur ?
    a: "Toute couleur #RRGGBB fonctionne, mais les lecteurs ont besoin d'un bon contraste. Utilisez un premier plan foncé sur un arrière-plan clair ; des modules clairs sur un arrière-plan foncé, ou deux couleurs proches, risquent de ne pas être lus par toutes les applications."
  - q: Combien de texte tient dans un code QR ?
    a: Cela dépend des caractères et du niveau de correction d'erreurs. Au niveau L, un code contient jusqu'à 7 089 chiffres, 4 296 lettres majuscules et chiffres, 2 953 octets d'autre texte ou environ 984 caractères chinois ou japonais. Au niveau H, c'est moins de la moitié.
---

## Comment le code QR est créé

Le texte est encodé avec [uqr](https://github.com/unjs/uqr), un encodeur de codes QR open source conforme à la norme ISO/IEC 18004. Il choisit la plus petite version de code QR (de 1 à 40) qui contient le texte au niveau de correction d'erreurs choisi. Un texte composé uniquement de chiffres utilise le mode numérique, un texte composé uniquement de lettres majuscules, de chiffres, d'espaces et de $%*+-./: utilise le mode alphanumérique, et tout autre texte est enregistré en octets UTF-8. Le motif est ensuite dessiné dans un thread en arrière-plan : en PNG, avec chaque bord de module sur un pixel entier pour éviter les bords gris flous, ou en SVG, avec un seul tracé pour tous les modules foncés.

## Options et limites

- **Texte :** jusqu'à 7 089 caractères, et en pratique limité par la capacité d'un code QR : au niveau L, 2 953 octets de texte comme une URL ; au niveau H, 1 273 octets.
- **Formats :** PNG ou SVG. Le SVG a la même largeur et la même hauteur que le PNG, et vous pouvez le redimensionner sans perte de netteté.
- **Taille :** de 128 à 4 096 pixels pour l'image entière, marge comprise. La valeur par défaut est 512. Chaque module doit faire au moins un pixel, donc un texte long avec une petite taille est refusé.
- **Marge :** de 0 à 16 modules de la couleur d'arrière-plan autour du code ; la valeur par défaut de 4 correspond à la zone de silence demandée par la norme. Sans marge, un lecteur risque de ne pas trouver le code sur un arrière-plan chargé.
- **Correction d'erreurs :** L, M, Q ou H peuvent restaurer environ 7 %, 15 %, 25 % ou 30 % des données du code. La valeur par défaut est M.
- **Couleurs :** n'importe quelle couleur #RRGGBB pour le premier plan et l'arrière-plan.
- **Logo :** une image PNG, JPEG ou WebP facultative, jusqu'à 5 Mo. Il est placé sur un carré de la couleur d'arrière-plan qui couvre environ 24 % de la largeur du code, et le niveau H est utilisé. Dans un SVG, le logo est intégré sous forme de copie du fichier d'origine.
- **Navigateurs :** le PNG est dessiné avec OffscreenCanvas dans un thread en arrière-plan, et le logo est lu par le décodeur d'images de votre navigateur. Les versions actuelles des principaux navigateurs prennent en charge les deux ; un navigateur ancien peut ne pas réussir à créer l'image.
- **Non inclus :** l'outil crée uniquement des codes QR standard. Les modules arrondis, les dégradés et les autres types de codes-barres ne sont pas pris en charge.

## Confidentialité

Votre texte et votre logo sont traités uniquement sur votre appareil. La page ne les envoie pas, ne les conserve pas et n'utilise pas de cookies.
