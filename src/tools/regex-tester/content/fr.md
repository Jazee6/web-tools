---
review: draft
updated: 2026-10-31
title: Testeur d'expressions régulières – Testez vos regex JavaScript
description: "Testez une expression régulière JavaScript sur votre texte : positions et groupes de capture de chaque correspondance. Gratuit et privé, dans votre navigateur."
name: Testeur d'expressions régulières
answer: "Saisissez un motif et un texte, gardez ou modifiez les drapeaux et cliquez sur Tester : chaque correspondance s'affiche avec sa position et ses groupes de capture dans votre navigateur."
action: Tester
fields:
  pattern:
    label: Motif
    placeholder: '(\d{4})-(\d{2})-(\d{2})'
  flags:
    label: Drapeaux
    placeholder: gi
  text:
    label: Texte
    placeholder: Collez ici le texte à parcourir
output:
  count:
    label: Correspondances trouvées
  matches:
    label: Correspondances
    columns:
      index: Position
      match: Correspondance
      groups: Groupes
errors:
  invalid_pattern: "Ce motif n'est pas une expression régulière JavaScript valide. Vérifiez que les crochets et parenthèses sont équilibrés, qu'aucun quantificateur ne se trouve sans rien devant lui, qu'il ne reste pas de barre oblique inverse en trop et que les drapeaux sont compatibles : u et v, par exemple, ne le sont pas."
  invalid_flags: "Ces drapeaux ne sont pas valides. Utilisez uniquement d, g, i, m, s, u, v et y, chacun au plus une fois."
  text_too_long: "Le texte dépasse 100 000 caractères. Testez le motif sur un échantillon plus court."
steps:
  - Saisissez l'expression régulière dans Motif, sans les barres obliques qui l'entourent.
  - Gardez les Drapeaux tels quels (g trouve toutes les correspondances) ou modifiez-les, par exemple en gi pour ignorer la casse.
  - Collez le texte dans Texte et cliquez sur Tester.
  - Lisez le nombre de correspondances puis, dans le tableau, chaque correspondance avec sa position et le texte capturé par chaque groupe.
faq:
  - q: "Mon texte est-il envoyé à un serveur ?"
    a: Non. Le motif s'exécute entièrement dans votre navigateur, donc ni le motif ni votre texte ne quittent votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: "Quelle syntaxe d'expressions régulières est utilisée ?"
    a: Celle du moteur JavaScript de votre navigateur, définie par la norme ECMAScript. Elle comprend les assertions avant et arrière, les groupes nommés et, avec le drapeau u ou v, les propriétés Unicode comme \p{L}. Elle n'est pas identique à PCRE, Python ou Java ; des fonctions comme les quantificateurs possessifs ou les drapeaux en ligne tels que (?i) peuvent donc ne pas fonctionner.
  - q: "Que signifient les drapeaux ?"
    a: g trouve toutes les correspondances et pas seulement la première, i ignore la casse, m fait agir ^ et $ sur chaque ligne, s permet au point de correspondre aux sauts de ligne, u et v activent le mode Unicode (l'un des deux, pas les deux), y ne trouve de correspondance qu'à la position exacte où commence la recherche, et d enregistre les indices des groupes. Chaque drapeau ne peut être utilisé qu'une fois.
  - q: "Pourquoi ne vois-je qu'une seule correspondance ?"
    a: Sans le drapeau g, une expression régulière JavaScript s'arrête à la première correspondance, et cet outil aussi. Ajoutez g dans Drapeaux pour lister toutes les correspondances.
  - q: "Que montre la colonne Groupes ?"
    a: Le texte capturé par chaque groupe entre parenthèses, au format JSON. Un motif à groupes ordinaires donne un tableau dans l'ordre, comme ["2024","02","29"]. Un motif à groupes nommés donne un objet, comme {"year":"2024"}. Un groupe qui n'a pas participé à la correspondance apparaît comme null, et la colonne reste vide si le motif n'a pas de groupes.
  - q: "Pourquoi la page se fige-t-elle avec certains motifs ?"
    a: Certains motifs à répétitions imbriquées, comme (a+)+$, mettent un temps exponentiel à s'exécuter quand le texte s'allonge, et un navigateur ne peut pas interrompre une expression régulière en cours d'exécution. Si l'onglet ne répond plus, fermez-le ou rechargez-le et simplifiez le motif.
---

## Ce que fait ce testeur d'expressions régulières

L'outil construit une expression régulière à partir de votre motif et de vos drapeaux avec le `RegExp` du navigateur et l'exécute une fois sur votre texte. Avec le drapeau g, il rassemble toutes les correspondances avec `matchAll` ; sans g, il prend la première, exactement comme `RegExp.prototype.exec`. Pour chaque correspondance, il indique la position (à partir de 0), le texte trouvé et les groupes capturés. La syntaxe et le comportement sont ceux de votre navigateur, décrits dans le [guide MDN sur les expressions régulières](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions).

## Options et limites

- **Saisie :** un motif de 1 000 caractères au plus et un texte de 100 000 caractères au plus. Ni l'un ni l'autre ne peut être vide.
- **Taille du résultat :** le compte porte sur toutes les correspondances, mais le tableau ne liste que les 200 premières.
- **Position :** comptée en unités de code UTF-16, comme JavaScript compte les indices des chaînes ; un emoji occupe donc deux positions.
- **Différences entre navigateurs :** le drapeau v et certaines syntaxes récentes ne fonctionnent que dans les navigateurs actuels. Un motif qu'un navigateur refuse comme invalide peut être accepté par un autre.
- **Non inclus :** remplacement de texte, découpage de texte et explication du motif.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie ni votre motif ni votre texte, ne les stocke pas et n'utilise pas de cookies.
