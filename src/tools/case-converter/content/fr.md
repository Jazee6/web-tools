---
review: draft
updated: 2026-10-31
title: Convertisseur de casse – Majuscules, Title Case, camelCase et plus
description: "Passez un texte en majuscules, minuscules ou Title Case, ou en camelCase, snake_case et autres styles. Gratuit et privé : tout reste dans votre navigateur."
name: Convertisseur de casse
answer: "Collez votre texte, choisissez un format comme Title Case ou snake_case et cliquez sur Convertir : le texte converti s'affiche dans votre navigateur, prêt à être copié."
action: Convertir
fields:
  text:
    label: Texte
    placeholder: Collez ou saisissez votre texte ici
  mode:
    label: Format
    options:
      title: Title Case (majuscule à chaque mot)
      sentence: Sentence case (majuscule en début de phrase)
      upper: MAJUSCULES
      lower: minuscules
      camel: camelCase
      pascal: PascalCase
      snake: snake_case
      kebab: kebab-case
      constant: CONSTANT_CASE
output:
  result:
    label: Résultat
steps:
  - Collez ou saisissez votre texte dans le champ Texte.
  - "Choisissez un Format : Title Case, Sentence case, MAJUSCULES, minuscules, camelCase, PascalCase, snake_case, kebab-case ou CONSTANT_CASE."
  - Cliquez sur Convertir, puis copiez le résultat.
faq:
  - q: "Mon texte est-il envoyé à un serveur ?"
    a: Non. La conversion se fait entièrement dans votre navigateur, donc votre texte ne quitte jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: "Quelle est la différence entre Title Case et Sentence case ?"
    a: Title Case met en majuscule la première lettre de chaque mot et met le reste en minuscules, donc « the cat's hat » devient « The Cat's Hat ». Sentence case met en majuscule seulement la première lettre de chaque phrase et de chaque ligne, et tout le reste en minuscules, donc « THE CAT. IT SLEPT » devient « The cat. It slept ».
  - q: "Title Case laisse-t-il en minuscules les petits mots comme « a » ou « of » ?"
    a: Non. Chaque mot prend une majuscule, car l'outil n'a pas de liste d'exceptions et les guides de style ne s'accordent pas sur les mots à omettre. Si votre style l'exige, remettez ces quelques petits mots en minuscules à la main.
  - q: "Comment les mots sont-ils séparés pour camelCase, snake_case et les autres styles de code ?"
    a: Le texte est coupé aux espaces, à la ponctuation et à tout autre caractère qui n'est ni une lettre ni un chiffre, ainsi qu'entre une minuscule et une majuscule. Une suite de majuscules suivie d'un mot en minuscules est coupée avant sa dernière majuscule, donc XMLHttpRequest devient XML, Http et Request. Les chiffres restent avec le mot précédent, donc « utf8 » est un seul mot, alors qu'un nombre au début d'un mot reste seul. La ponctuation est supprimée.
  - q: "Cela fonctionne-t-il avec plusieurs lignes ?"
    a: Oui. Les styles de code convertissent chaque ligne séparément, si bien que chaque ligne devient un identifiant et que les sauts de ligne restent à leur place. C'est pratique pour transformer une liste de noms en constantes.
  - q: "Cela fonctionne-t-il avec les lettres accentuées et d'autres langues ?"
    a: Oui, pour toutes les écritures qui distinguent majuscules et minuscules, comme le latin accentué, le grec et le cyrillique. Le ß allemand devient SS en majuscules. Les écritures sans casse, comme le chinois et le japonais, restent inchangées, et les styles de code traitent une suite ininterrompue de ces caractères comme un seul mot.
---

## Ce que fait ce convertisseur de casse

Majuscules et minuscules utilisent la conversion de chaînes standard du navigateur, qui suit les correspondances de casse d'Unicode et ne dépend pas de vos réglages de langue. Title Case repère chaque mot, une suite de lettres et de chiffres pouvant contenir des apostrophes, et met sa première lettre en majuscule. Sentence case passe le texte en minuscules, puis met en majuscule la première lettre après un point, un point d'exclamation, un point d'interrogation ou des points de suspension (…) suivis d'un espace, après `。`, `！` et `？`, ainsi qu'au début du texte et de chaque ligne. Les styles de code découpent le texte en mots comme expliqué dans les questions ci-dessus et les relient avec le séparateur du style choisi.

## Options et limites

- **Saisie :** un texte à la fois, de la taille que votre appareil peut contenir. Un texte vide n'est pas converti.
- **Règles de casse :** elles sont les mêmes pour toutes les langues. Le i turc avec et sans point n'a pas de traitement particulier, et l'outil ne connaît ni les noms propres, ni les sigles, ni les abréviations ; en Sentence case, le mot qui suit « Mr. » commence donc lui aussi par une majuscule.
- **Sentence case :** un point à l'intérieur d'un nombre ou d'un domaine, comme 3.14 ou example.com, ne commence pas une nouvelle phrase.
- **Styles de code :** la ponctuation est supprimée, une ligne sans lettre ni chiffre devient vide, et un nom comme « iOS » est coupé en « i » et « OS ».
- **Sauts de ligne :** `\n`, `\r\n` et `\r` sont conservés tels quels.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre texte, ne le stocke pas et n'utilise pas de cookies.
