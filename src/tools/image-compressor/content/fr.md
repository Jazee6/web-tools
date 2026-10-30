---
review: draft
updated: 2026-10-30
title: Compresseur d'images – Compresser JPEG, PNG, WebP et AVIF en ligne
description: Compressez vos images JPEG, PNG, WebP et AVIF sans les envoyer. Gratuit et privé — la compression est traitée dans votre navigateur avec les mêmes codecs que Squoosh.
name: Compresseur d'images
answer: Choisissez une ou plusieurs images, réglez la qualité si besoin et cliquez sur Compresser les images — chaque fichier est réencodé sur votre appareil dans le même format, puis vous téléchargez les copies allégées.
action: Compresser les images
fields:
  files:
    label: Images (JPEG, PNG, WebP ou AVIF)
  quality:
    label: Qualité (1–100)
output:
  files:
    label: Images compressées
errors:
  decode_failed: Impossible de lire cette image. Elle est peut-être endommagée ou dans un format que votre navigateur ne sait pas décoder. Essayez une autre copie de l'image ou ouvrez la page dans la dernière version de Chrome, Firefox ou Safari.
steps:
  - Choisissez jusqu'à 20 images JPEG, PNG, WebP ou AVIF, de 50 Mo maximum chacune. Vous pouvez ajouter des fichiers en plusieurs fois et cliquer sur une miniature pour l'agrandir.
  - Gardez la qualité par défaut de 75 ou choisissez la vôtre — une valeur plus basse donne un fichier plus léger, avec des artefacts plus visibles. Le PNG ignore ce réglage, car il est toujours compressé sans perte.
  - Consultez la taille estimée affichée sous chaque fichier ; elle se met à jour quand vous changez la qualité.
  - Cliquez sur Compresser les images et patientez un instant ; un gros fichier AVIF peut prendre plusieurs secondes.
  - Comparez chaque original avec sa copie compressée, puis téléchargez les fichiers un par un ou tous ensemble dans un ZIP.
faq:
  - q: Mes images sont-elles envoyées sur un serveur ?
    a: Non. L'image est décodée et réencodée dans votre navigateur avec des codecs WebAssembly ; elle ne quitte jamais votre appareil.
  - q: Quelle qualité choisir ?
    a: 75 convient bien aux photos — la différence se voit à peine et le fichier est souvent bien plus léger. Prenez 85–90 pour les images avec du texte fin ou des contours nets, et 50–65 quand le poids compte plus que les détails, par exemple pour des vignettes.
  - q: Pourquoi mon PNG n'a-t-il presque pas diminué ?
    a: Ici, la compression PNG est sans perte — chaque pixel reste identique, seul l'encodage est optimisé. Un fichier déjà enregistré avec un outil d'optimisation peut très peu diminuer. Pour une photo, la conversion en JPEG, WebP ou AVIF fait gagner bien plus.
  - q: La compression change-t-elle les dimensions ou le format ?
    a: Non. Le résultat garde le format et les dimensions en pixels d'origine. Si le réencodage devait agrandir le fichier, vous récupérez l'original inchangé.
  - q: Les métadonnées de la photo sont-elles conservées ?
    a: Pour le JPEG, le WebP et l'AVIF, les métadonnées comme les données EXIF de l'appareil et la position GPS sont supprimées, ce qui protège aussi votre vie privée. L'image est d'abord pivotée selon son orientation EXIF, elle s'affiche donc toujours dans le bon sens.
  - q: Quelle est la précision de la taille estimée ?
    a: Les images jusqu'à environ 1 mégapixel sont réellement encodées une fois pour l'estimation, donc le chiffre correspond au résultat. Pour les images plus grandes, l'estimation encode quelques zones en pleine résolution puis extrapole à toute l'image — le résultat est généralement proche, mais une photo dont le détail est très inégal peut s'en écarter davantage. L'estimation ne dépasse jamais la taille d'origine, car si le réencodage devait alourdir le fichier, l'original est renvoyé tel quel.
---

## Comment fonctionne la compression

Les fichiers JPEG sont réencodés avec MozJPEG, les WebP avec libwebp et les AVIF avec libaom — les codecs de Squoosh de Google, compilés en WebAssembly. Les PNG sont optimisés sans perte avec OxiPNG. Tout s'exécute dans un thread en arrière-plan, la page reste donc réactive pendant le traitement d'une grande image.

## Limites

- **Formats :** JPEG, PNG, WebP et AVIF en entrée ; le même format en sortie. Les autres formats, comme GIF, SVG ou BMP, ne sont pas acceptés.
- **Taille :** jusqu'à 50 Mo par image. Les très grandes images demandent beaucoup de mémoire et peuvent échouer sur mobile.
- **Quantité :** jusqu'à 20 images à la fois, traitées l'une après l'autre. Téléchargez les résultats un par un ou dans un seul ZIP.
- **Animation :** les WebP et AVIF animés sont réduits à leur première image.
- **Vitesse :** l'encodage AVIF est le plus lent. Dans les navigateurs qui autorisent le multithreading, il utilise plusieurs cœurs du processeur.
- **Navigateurs :** votre navigateur décode d'abord l'image ; un format qu'il ne sait pas afficher, comme AVIF dans un navigateur ancien, est refusé.

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
