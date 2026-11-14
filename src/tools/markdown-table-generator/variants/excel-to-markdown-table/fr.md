---
review: reviewed
updated: 2026-11-14
title: Excel en tableau Markdown – Coller des cellules de tableur en ligne
description: "Copiez des cellules d'Excel ou de Google Sheets et collez-les pour obtenir un tableau Markdown, sans export CSV. Gratuit, et vos données restent sur votre appareil."
name: Excel en tableau Markdown
answer: Sélectionnez les cellules dans Excel ou Google Sheets, copiez-les et collez-les dans la zone Données du tableau — TSV est déjà sélectionné, le tableau Markdown s'affiche donc aussitôt. Cliquez sur Copier pour le copier.
steps:
  - Dans Excel, Google Sheets, Numbers ou LibreOffice Calc, sélectionnez la plage de cellules voulue, ligne d'en-tête comprise.
  - Copiez les cellules et collez-les dans la zone Données du tableau ; TSV est déjà sélectionné comme Format d'entrée.
  - Cliquez sur Copier et collez le tableau dans GitHub, GitLab, Notion, Obsidian ou tout éditeur Markdown.
faq:
  - q: Dois-je d'abord enregistrer ma feuille en CSV ?
    a: "Non. Quand vous copiez des cellules, le tableur les place dans le presse-papiers sous forme de texte séparé par des tabulations, une ligne par rangée et une tabulation entre les cellules. C'est exactement ce texte que lit ce préréglage : copier-coller suffit."
  - q: Pourquoi les nombres avec séparateur de milliers restent-ils dans une seule cellule ?
    a: Dans un texte séparé par des tabulations, seules les tabulations séparent les cellules ; 1,234.50 ou une liste comme "red, green" restent donc dans une cellule. C'est la raison principale pour laquelle coller depuis un tableur est plus fiable qu'exporter en CSV dans une langue où la virgule sert de séparateur décimal.
  - q: Les formules, les couleurs et les cellules fusionnées sont-elles copiées ?
    a: "Non. Le presse-papiers contient les valeurs affichées : vous obtenez le résultat des formules, pas les formules elles-mêmes. La mise en forme, comme le gras, les couleurs ou les bordures, ne fait pas partie du texte, et une cellule fusionnée arrive sous forme d'une valeur suivie de cellules vides."
  - q: Une cellule sur plusieurs lignes a cassé mon tableau. Comment corriger ?
    a: Les tableurs mettent entre guillemets doubles une cellule contenant des retours à la ligne quand ils la copient, et ce préréglage transforme chaque retour en <br>. Si un retour à la ligne coupe encore une rangée, le programme d'où vous avez copié n'a pas mis la cellule entre guillemets ; supprimez les retours à la ligne dans la feuille et copiez à nouveau.
table:
  caption: Ce que deviennent les cellules de tableur copiées dans le tableau Markdown
  columns:
    clipboard: Cellule copiée (TSV)
    cell: Cellule Markdown
    rule: Pourquoi
  terms:
    commaKept: Les virgules ne séparent jamais les cellules dans un texte séparé par des tabulations
    lineBreak: Un retour à la ligne entre guillemets devient <br>
    doubledQuote: Deux guillemets entre guillemets valent un guillemet
    pipe: "| est échappé pour ne pas couper la colonne"
    trimmed: Les espaces autour de la valeur sont supprimés
---

## Pourquoi copier des cellules marche mieux qu'exporter

Un tableau Markdown a besoin de texte brut, et le presse-papiers en contient déjà. Les tableurs copient une plage sous forme de valeurs séparées par des tabulations : chaque rangée sur sa propre ligne et une tabulation entre les cellules. Comme les tabulations n'apparaissent pas dans les valeurs ordinaires, les nombres comme 1,234.50, les adresses et les listes séparées par des virgules restent intacts — ce qu'un export CSV peut abîmer quand la feuille utilise la virgule comme séparateur décimal ou que l'export utilise des points-virgules.

## Options et limites

- **Taille de la plage :** jusqu'à 200 000 caractères de cellules copiées, de quoi couvrir des milliers de cellules courtes.
- **Ce qui est copié :** uniquement les valeurs affichées ; réglez le format des nombres, les dates et les arrondis dans la feuille avant de copier.
- **Rangées vides :** ignorées ; une rangée plus courte que les autres reçoit des cellules vides à la fin.
- **Nombres :** choisissez À droite comme Alignement si le tableau contient surtout des nombres, pour qu'ils s'alignent dans le tableau rendu.
- **Non pris en charge :** les formules, la mise en forme comme le gras ou les couleurs, les cellules fusionnées, les images et les commentaires.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas les cellules copiées, ne les stocke pas et n'utilise pas de cookies.
