---
review: draft
updated: 2026-10-30
title: Convertisseur de couleurs – HEX, RGB, HSL, HWB et OKLCH en ligne
description: "Convertissez une couleur CSS entre HEX, RGB, HSL, HWB et OKLCH, avec alpha. Gratuit et privé : tout est traité dans votre navigateur, rien n'est envoyé."
name: Convertisseur de couleurs
answer: "Collez une couleur en HEX, RGB, HSL, HWB ou OKLCH et cliquez sur Convertir : la même couleur s'affiche dans les cinq formats dans votre navigateur, prête à copier."
action: Convertir
fields:
  value:
    label: Couleur
    placeholder: "#ff5733 ou rgb(255 87 51) ou hsl(11 100% 60%)"
output:
  hex:
    label: HEX
  rgb:
    label: RGB
  hsl:
    label: HSL
  hwb:
    label: HWB
  oklch:
    label: OKLCH
errors:
  invalid_color: "Cet outil ne peut pas lire cette couleur. Utilisez un code hexadécimal comme #ff5733 (3, 4, 6 ou 8 chiffres) ou rgb(), hsl(), hwb() ou oklch() avec trois valeurs, par exemple rgb(255 87 51) ou hsl(11, 100%, 60%). Les noms de couleurs comme red ne sont pas pris en charge."
steps:
  - "Saisissez ou collez une couleur dans le champ, par exemple #ff5733, rgb(255 87 51), hsl(11 100% 60%), hwb(11 20% 0%) ou oklch(0.68 0.21 34)."
  - Cliquez sur Convertir.
  - "Copiez le format dont vous avez besoin : HEX, RGB, HSL, HWB ou OKLCH."
faq:
  - q: "Ce que je saisis est-il envoyé à un serveur ?"
    a: Non. La conversion se fait entièrement dans votre navigateur, donc ce que vous saisissez ne quitte jamais votre appareil. Vous pouvez même utiliser la page hors connexion une fois qu'elle est chargée.
  - q: "Quels formats de couleur puis-je saisir ?"
    a: "Les codes hexadécimaux de 3, 4, 6 ou 8 chiffres et les fonctions CSS rgb(), rgba(), hsl(), hsla(), hwb() et oklch(). Chaque fonction accepte la syntaxe avec virgules, rgb(255, 87, 51), et la syntaxe avec espaces, rgb(255 87 51 / 0.5), où la valeur après la barre oblique est l'alpha. La teinte peut être un nombre de degrés ou porter l'unité deg, grad, rad ou turn."
  - q: "Puis-je saisir un nom de couleur comme red ?"
    a: "Non. L'outil ne lit que les codes hexadécimaux et les cinq fonctions ci-dessus, donc les noms de couleurs sont refusés avec une erreur. Utilisez #ff0000 ou rgb(255 0 0)."
  - q: "Comment la transparence est-elle gérée ?"
    a: L'alpha est conservé dans chaque résultat. HEX reçoit une paire de chiffres en plus (#ff573380) et les autres formats reçoivent une valeur après une barre oblique (rgb(255 87 51 / 0.5)). L'alpha est arrondi à trois décimales, et une couleur totalement opaque est écrite sans alpha.
  - q: "Pourquoi la valeur convertie diffère-t-elle légèrement de ce que j'ai saisi ?"
    a: Les canaux de RGB et de HEX sont des entiers de 0 à 255, donc une couleur donnée en HSL, HWB ou OKLCH est d'abord arrondie à la valeur 8 bits la plus proche. Les autres formats sont ensuite calculés à partir de cette couleur arrondie, ce qui garde les cinq résultats cohérents entre eux. Les valeurs HSL et HWB affichent jusqu'à une décimale, et la luminosité et la chroma d'OKLCH jusqu'à quatre.
  - q: "Que devient une couleur OKLCH en dehors du gamut sRGB ?"
    a: OKLCH peut décrire des couleurs qu'un écran standard ne peut pas afficher. Elles sont ramenées canal par canal aux valeurs sRGB les plus proches, donc le résultat est une couleur proche mais moins vive que celle que vous avez saisie.
---

## Ce que fait cet outil de couleurs

L'outil convertit votre saisie en une couleur de l'espace colorimétrique sRGB, puis l'écrit dans cinq formats CSS. HSL et HWB sont calculés à partir de RGB avec les formules du [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/). OKLCH est la forme polaire d'[Oklab](https://bottosson.github.io/posts/oklab/) ; la conversion entre sRGB et Oklab utilise les matrices publiées par Björn Ottosson. Les résultats suivent la syntaxe CSS moderne avec espaces, par exemple `rgb(255 87 51)`, `hsl(10.6 100% 60%)` et `oklch(0.6804 0.21 33.7)`.

## Options et limites

- **Saisie :** une couleur à la fois. Les espaces au début et à la fin sont ignorés, et les noms de fonctions et les chiffres hexadécimaux ne sont pas sensibles à la casse.
- **Formats pris en charge :** hexadécimal à 3, 4, 6 ou 8 chiffres, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()` et `oklch()`. Les noms de couleurs, `color()`, `lab()`, `lch()`, `oklab()` et `var()` ne sont pas pris en charge.
- **Valeurs hors plage :** les canaux RGB, la saturation, la luminosité, la blancheur, la noirceur et l'alpha sont ramenés à leur plage valide. La teinte boucle, donc `hsl(-120 100% 50%)` est le même bleu que `hsl(240 100% 50%)`.
- **Précision :** HEX et RGB sont en 8 bits. La teinte, la saturation, la luminosité, la blancheur et la noirceur affichent jusqu'à une décimale ; la luminosité et la chroma d'OKLCH jusqu'à quatre.
- **Couleurs grises :** une couleur sans teinte est affichée avec une teinte de 0.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre saisie, ne la stocke pas et n'utilise pas de cookies.
