---
review: reviewed
updated: 2026-10-29
title: Fusionner PDF – Combinez des fichiers PDF en ligne gratuitement
description: Combinez plusieurs fichiers PDF en un seul, dans l'ordre de votre choix. Gratuit et privé — la fusion se fait dans votre navigateur, vos documents ne sont jamais envoyés.
name: Fusionner PDF
answer: Ajoutez au moins deux fichiers PDF, placez-les dans l'ordre voulu et cliquez sur Fusionner PDF — les pages sont réunies sur votre appareil en un seul PDF, prêt à être téléchargé.
action: Fusionner PDF
fields:
  files:
    label: Fichiers PDF
output:
  file:
    label: PDF fusionné
errors:
  encrypted: "Ce PDF est protégé par un mot de passe. Retirez le mot de passe puis réessayez :"
  invalid_pdf: "Impossible de lire ce fichier comme un PDF. Il est peut-être endommagé. Exportez-le à nouveau ou retirez-le de la liste, puis réessayez :"
steps:
  - Choisissez les fichiers PDF à combiner — de 2 à 20 fichiers, jusqu'à 50 Mo chacun. Vous pouvez les ajouter en plusieurs fois.
  - Utilisez les flèches vers le haut et vers le bas pour ordonner les fichiers, ou retirez un fichier ajouté par erreur.
  - Cliquez sur Fusionner PDF. Toutes les pages du premier fichier viennent d'abord, puis celles du fichier suivant, et ainsi de suite.
  - Téléchargez le PDF fusionné.
faq:
  - q: Mes fichiers PDF sont-ils envoyés sur un serveur ?
    a: "Non. Les fichiers sont lus et combinés dans votre navigateur par PDFium compilé en WebAssembly : ils ne quittent jamais votre appareil."
  - q: Puis-je changer l'ordre des fichiers ?
    a: Oui. La liste affiche les fichiers dans l'ordre de la fusion. Montez ou descendez un fichier avec les boutons fléchés avant de cliquer sur Fusionner PDF.
  - q: Puis-je fusionner des PDF protégés par mot de passe ?
    a: Pas si un mot de passe est nécessaire pour ouvrir le fichier. Ouvrez-le dans un lecteur PDF, enregistrez une copie sans mot de passe et ajoutez cette copie.
  - q: La fusion réduit-elle la qualité ?
    a: Non. Les pages sont copiées telles quelles — le texte reste sélectionnable et les images ne sont pas recompressées, le fichier fusionné est donc identique aux originaux.
  - q: Les signets et les champs de formulaire sont-ils conservés ?
    a: Les pages sont reprises avec leur texte et leurs images, mais les signets des fichiers d'origine ne sont pas ajoutés au PDF fusionné. Les champs de formulaire remplissables gardent leur contenu, mais peuvent ne plus être modifiables.
---

## Comment fonctionne la fusion

L'outil utilise PDFium — le moteur PDF de Google Chrome — compilé en WebAssembly. Il ouvre chaque fichier, copie toutes ses pages dans un nouveau document dans l'ordre de votre liste, puis enregistre le résultat. Le travail se fait dans un thread en arrière-plan : la page reste réactive pendant la fusion de gros fichiers.

## Limites

- **Fichiers :** de 2 à 20 fichiers PDF par fusion, jusqu'à 50 Mo chacun.
- **Fichiers entiers uniquement :** toutes les pages de chaque fichier sont incluses. Pour exclure des pages, divisez ou organisez d'abord le PDF.
- **Mots de passe :** les fichiers qui demandent un mot de passe à l'ouverture ne peuvent pas être fusionnés.
- **Mémoire :** tous les fichiers sont gardés en mémoire pendant la fusion ; une très grosse fusion peut échouer sur mobile.

## Confidentialité

Vos documents sont traités uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
