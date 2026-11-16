---
review: reviewed
updated: 2026-11-16
title: Lecteur de code QR – Scanner des codes QR et codes-barres en ligne
description: "Lisez les codes QR et codes-barres d'une capture d'écran, d'une photo ou de la caméra et copiez leur contenu. Gratuit et privé : lecture dans votre navigateur."
name: Lecteur de code QR
answer: Choisissez une image contenant un code QR ou un code-barres, ou cliquez sur Utiliser la caméra et pointez-la vers le code ; le texte décodé s'affiche aussitôt avec le type de code, prêt à être copié.
action: Scanner
fields:
  file:
    label: Image (JPEG, PNG, WebP, GIF, BMP ou AVIF)
output:
  codes:
    label: Codes trouvés
    columns:
      text: Contenu
      format: Type
errors:
  decode_failed: Ce fichier n'a pas pu être lu comme une image. Il est peut-être endommagé, ou votre navigateur ne sait pas décoder son format. Exportez-le de nouveau en JPEG ou PNG et réessayez.
  too_large: Cette image a peut-être plus de pixels que votre navigateur ne peut en traiter. Les navigateurs des téléphones en acceptent moins que ceux des ordinateurs ; essayez une image plus petite ou un ordinateur.
  not_found: Aucun code QR ni code-barres n'a été trouvé dans cette image. Vérifiez que le code est entièrement visible, net et pas trop petit, ou rognez l'image sur le code et réessayez.
steps:
  - Choisissez une image dans Image (JPEG, PNG, WebP, GIF, BMP ou AVIF), par exemple une capture d'écran ou une photo d'un code. L'image est scannée dès que vous la choisissez.
  - Ou cliquez sur Utiliser la caméra, autorisez l'accès à la caméra et placez le code devant elle. La caméra s'éteint dès qu'un code est lu.
  - Lisez le Contenu et le Type de chaque code trouvé, et copiez le texte dont vous avez besoin.
faq:
  - q: Puis-je ouvrir sans risque le lien d'un code QR ?
    a: Vérifiez-le d'abord. L'outil affiche seulement le texte enregistré dans le code et n'ouvre jamais de lien de lui-même ; vous voyez donc où mène un lien avant de le visiter. Méfiez-vous des liens raccourcis et des adresses qui imitent un site connu.
  - q: Lit-il aussi les codes-barres ?
    a: Oui. En plus des codes QR, il lit Micro QR, rMQR, Data Matrix, Aztec, PDF417 et MaxiCode, ainsi que des codes-barres comme EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF et DataBar. La colonne Type indique le genre de chaque code.
  - q: Que se passe-t-il avec plusieurs codes dans une image ?
    a: Ils sont tous listés, chacun avec son contenu et son type, jusqu'à 255 codes par image.
  - q: Pourquoi la caméra ne fonctionne-t-elle pas ?
    a: Votre navigateur doit autoriser la page à utiliser la caméra ; si vous l'avez bloquée, autorisez l'accès à la caméra dans les paramètres du site et cliquez de nouveau sur Utiliser la caméra. Le bouton n'est pas disponible dans les navigateurs sans prise en charge de la caméra. Vous pouvez toujours prendre une photo ou une capture d'écran du code et la choisir comme image.
  - q: Pourquoi aucun code n'a-t-il été trouvé ?
    a: Le code est peut-être flou, trop petit, coupé au bord de l'image ou pas assez contrasté. Utilisez une image plus nette, rognez-la sur le code ou rapprochez la caméra. L'outil essaie aussi de lire les codes à modules clairs sur fond foncé.
---

## Comment fonctionne la lecture

L'image est décodée par le décodeur d'images intégré à votre navigateur, puis analysée par [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp), une bibliothèque de codes-barres open source compilée en WebAssembly et exécutée dans un thread en arrière-plan. Elle cherche tous les types de code pris en charge en même temps, essaie aussi les codes pivotés, en miroir et inversés, et renvoie le texte décodé de chaque code qu'elle peut lire entièrement. En mode caméra, les images de la caméra sont réduites à 1 280 pixels au maximum sur le côté le plus long et scannées l'une après l'autre ; la première image contenant un code est conservée comme image, et ses codes sont affichés.

## Options et limites

- **Entrée :** une image JPEG, PNG, WebP, GIF, BMP ou AVIF jusqu'à 20 Mo, ou la caméra. Pour un GIF animé, seule la première image est scannée. Les images HEIC ne sont pas prises en charge ; convertissez-les d'abord avec le [Convertisseur d'images](/fr/image-converter).
- **Sortie :** un tableau avec le texte et le type de chaque code trouvé, jusqu'à 255 par image. Un contenu binaire qui n'est pas du texte risque de ne pas s'afficher correctement.
- **Types de code :** QR Code, Micro QR, rMQR, Data Matrix, Aztec, PDF417, MaxiCode, EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 93, Code 128, Codabar, ITF, DataBar et d'autres pris en charge par zxing-cpp.
- **Caméra :** demande la caméra arrière quand il y en a une et s'arrête après la première lecture réussie ; cliquez de nouveau sur Utiliser la caméra pour scanner un autre code. Il faut un navigateur qui prend en charge la caméra et votre autorisation.
- **Navigateurs :** JPEG, PNG, GIF et BMP fonctionnent dans tous les navigateurs actuels ; AVIF fonctionne si le navigateur le prend en charge.
- **Téléchargement :** le lecteur WebAssembly, d'environ 950 Ko, est téléchargé lors de la première lecture.

## Confidentialité

Vos images et les images de la caméra sont traitées uniquement sur votre appareil. La page ne les envoie pas, ne les conserve pas et n'utilise pas de cookies.
