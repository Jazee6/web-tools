---
review: draft
updated: 2026-11-03
title: "Rogner une image – Rogner, pivoter et retourner JPEG, PNG, WebP"
description: "Rognez une image selon une zone libre ou un format comme 1:1 ou 16:9, pivotée ou retournée au besoin. Gratuit et privé : tout se passe dans votre navigateur."
name: "Rogner une image"
answer: "Choisissez une image, faites glisser le cadre de rognage ou choisissez un format, faites-la pivoter ou retournez-la si besoin, puis cliquez sur Rogner l'image : elle est rognée sur votre appareil, dans le même format."
action: "Rogner l'image"
fields:
  file:
    label: "Image (JPEG, PNG, WebP ou AVIF)"
  rotate:
    label: "Faire pivoter dans le sens horaire"
    options:
      "0": "Aucune rotation"
      "90": "90°"
      "180": "180°"
      "270": "270°"
  flipHorizontal:
    label: "Retourner horizontalement"
  flipVertical:
    label: "Retourner verticalement"
  aspect:
    label: "Format"
    options:
      free: "Libre"
      "1:1": "1:1 (carré)"
      "4:3": "4:3 (paysage)"
      "3:4": "3:4 (portrait)"
      "3:2": "3:2 (paysage)"
      "2:3": "2:3 (portrait)"
      "16:9": "16:9 (grand écran)"
      "9:16": "9:16 (vertical)"
  crop:
    label: "Zone de rognage (x, y, largeur, hauteur en px)"
    placeholder: "Image entière, ou centrée selon le format"
  quality:
    label: "Qualité (1–100)"
output:
  file:
    label: "Image rognée"
errors:
  decode_failed: "Impossible de lire ce fichier comme une image. Il est peut-être endommagé. Exportez-le à nouveau, puis réessayez."
  too_large: "Votre navigateur ne peut pas contenir autant de pixels. Les navigateurs mobiles en acceptent moins que ceux des ordinateurs ; essayez une zone de rognage plus petite ou un ordinateur."
  crop_out_of_range: "La zone de rognage dépasse le bord de l'image. Gardez-la dans la taille de l'image après rotation, en pixels :"
  invalid_crop: "Saisissez la zone de rognage sous forme de quatre nombres entiers (x, y, largeur et hauteur), par exemple 40, 0, 240, 240. Illisible :"
steps:
  - "Choisissez une image JPEG, PNG, WebP ou AVIF de 50 Mo maximum."
  - "Si besoin, choisissez de combien la faire pivoter dans le sens horaire et s'il faut la retourner. L'aperçu montre le résultat, et le rognage se mesure sur celui-ci."
  - "Choisissez un format ou gardez Libre. Faites glisser le cadre de rognage pour le déplacer et ses coins pour le redimensionner, ou saisissez la zone sous la forme x, y, largeur, hauteur."
  - "Cliquez sur Rogner l'image, puis téléchargez l'image rognée."
faq:
  - q: "Mes images sont-elles envoyées sur un serveur ?"
    a: "Non. L'image est décodée, rognée et encodée à nouveau dans votre navigateur, elle ne quitte donc jamais votre appareil."
  - q: "Comment rogner une image en carré ?"
    a: "Choisissez le format 1:1 (carré). Le cadre de rognage devient le plus grand carré au centre de l'image, et vous pouvez le faire glisser sur la partie à garder avant de cliquer sur Rogner l'image."
  - q: "Comment passer du paysage au portrait, par exemple de 16:9 à 9:16 ?"
    a: "Choisissez l'autre format dans la liste, ou cliquez sur le bouton d'inversion sous l'aperçu. Changer le format, la rotation ou le retournement remet le cadre de rognage sur la zone centrée."
  - q: "Le rognage réduit-il la qualité ?"
    a: "Les pixels conservés sont copiés un à un, sans mise à l'échelle. Le JPEG, le WebP et l'AVIF sont ensuite encodés à nouveau à la qualité choisie (85 par défaut), ce qui ajoute une légère perte de compression ; le PNG reste sans perte."
  - q: "Puis-je rogner et redimensionner en même temps ?"
    a: "Pas avec cet outil, qui garde les pixels rognés à leur taille. Rognez d'abord, puis utilisez le [Redimensionneur d'images](/fr/image-resizer) pour changer la largeur et la hauteur."
  - q: "Les données EXIF de la photo sont-elles conservées ?"
    a: "Non. L'image est encodée à nouveau à partir de ses pixels, donc les données EXIF comme le modèle d'appareil et la position GPS ne figurent pas dans le résultat. L'orientation EXIF est appliquée d'abord, l'aperçu et le résultat sont donc à l'endroit."
---

## Fonctionnement du rognage

L'outil décode l'image avec le décodeur intégré à votre navigateur, qui applique aussi l'orientation EXIF. Il fait pivoter l'image dans le sens horaire par pas de 90°, retourne l'image pivotée, puis copie les pixels de la zone de rognage sur un canvas sans lissage, si bien qu'aucun pixel n'est mélangé ni décalé. Le rognage se mesure sur l'image telle que vous la voyez dans l'aperçu, après rotation et retournement. Le résultat est encodé à nouveau avec des versions WebAssembly de MozJPEG, libwebp et libaom, et la sortie PNG passe par OxiPNG. Le travail s'effectue dans un thread en arrière-plan.

## Options et limites

- **Entrée :** une image JPEG, PNG, WebP ou AVIF de 50 Mo maximum. Le format de sortie est toujours celui de l'entrée.
- **Zone de rognage :** x et y désignent le coin supérieur gauche, en pixels entiers, et la zone doit rester dans l'image. Laissez-la vide pour garder l'image entière, ou la plus grande zone centrée au format choisi. Si vous saisissez une zone, le format ne sert qu'à guider le cadre de rognage.
- **Rotation et retournement :** la rotation est de 90°, 180° ou 270° dans le sens horaire ; le retournement inverse l'image pivotée de gauche à droite ou de haut en bas.
- **Qualité :** s'applique au JPEG, au WebP et à l'AVIF, avec 85 par défaut. Le PNG est toujours sans perte.
- **Transparence :** conservée en PNG, WebP et AVIF.
- **Navigateurs :** les navigateurs mobiles acceptent moins de pixels au total que ceux des ordinateurs, les très grandes images peuvent donc s'arrêter avec un message. L'encodage AVIF et PNG utilise plusieurs threads lorsque le navigateur l'autorise ; les navigateurs basés sur WebKit, comme Safari, n'en utilisent qu'un, ces formats y sont donc plus longs.

## Confidentialité

Vos images sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les stocke pas et n'utilise pas de cookies.
