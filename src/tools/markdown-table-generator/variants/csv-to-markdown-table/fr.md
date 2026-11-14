---
review: reviewed
updated: 2026-11-14
title: Convertisseur CSV en tableau Markdown – Gratuit en ligne
description: "Collez le contenu d'un fichier CSV pour obtenir un tableau Markdown GitHub. Les champs entre guillemets (virgules, guillemets, retours à la ligne) sont gérés. Gratuit."
name: CSV en tableau Markdown
answer: Collez le contenu de votre fichier CSV dans la zone Données du tableau — CSV est déjà sélectionné, le tableau Markdown s'affiche donc aussitôt. Cliquez sur Copier pour le copier.
steps:
  - Ouvrez le fichier .csv dans un éditeur de texte, sélectionnez tout et copiez.
  - Collez-le dans la zone Données du tableau ; CSV est déjà sélectionné comme Format d'entrée.
  - Cliquez sur Copier et collez le tableau dans votre README, votre wiki ou vos notes.
faq:
  - q: Mon CSV contient des virgules dans certaines valeurs. Les colonnes vont-elles se décaler ?
    a: Non, si ces valeurs sont entre guillemets doubles, comme les écrivent les tableurs, les bases de données et la plupart des programmes à l'export CSV. "Smith, Ada" reste une seule cellule. Une virgule hors des guillemets commence toujours une nouvelle colonne.
  - q: Mon fichier utilise des points-virgules au lieu de virgules. Que faire ?
    a: Les points-virgules ne sont pas traités comme séparateurs, donc chaque ligne finit dans une seule colonne. Exportez à nouveau le fichier avec des virgules, ou ouvrez-le dans votre tableur et copiez les cellules — le préréglage Excel en tableau Markdown les lit directement.
  - q: Pourquoi y a-t-il des <br> dans certaines cellules ?
    a: Un champ CSV entre guillemets peut s'étendre sur plusieurs lignes, pas une ligne de tableau Markdown. Chaque retour à la ligne dans un champ devient <br>, que GitHub et la plupart des moteurs de rendu Markdown affichent comme un retour à la ligne dans la cellule.
  - q: Puis-je convertir un fichier CSV de plusieurs milliers de lignes ?
    a: Jusqu'à 200 000 caractères de CSV, soit quelques milliers de lignes courtes. Un tableau Markdown aussi grand est difficile à lire ; pour de gros jeux de données, mieux vaut mettre un lien vers le fichier CSV.
table:
  caption: Ce que deviennent les champs CSV dans les cellules du tableau Markdown
  columns:
    field: Champ dans le CSV
    cell: Cellule Markdown
    rule: Pourquoi
  terms:
    quotedComma: Une virgule entre guillemets reste dans la cellule
    doubledQuote: Deux guillemets entre guillemets valent un guillemet
    lineBreak: Un retour à la ligne entre guillemets devient <br>
    pipe: "| est échappé pour ne pas couper la colonne"
    trimmed: Les espaces autour de la valeur sont supprimés
    semicolon: Les points-virgules ne séparent pas les champs
---

## Lire le CSV comme le définit la RFC 4180

Le CSV paraît simple jusqu'à ce qu'une valeur contienne une virgule, un guillemet ou un retour à la ligne. Le convertisseur suit la [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), le format qu'écrivent la plupart des programmes : les champs sont séparés par des virgules, un champ entre guillemets doubles peut contenir des virgules et des retours à la ligne, et un guillemet dans un champ entre guillemets s'écrit deux fois. Les lignes peuvent se terminer par CRLF, LF ou CR, donc les fichiers de Windows, macOS et Linux fonctionnent tous.

## Options et limites

- **Taille du CSV :** jusqu'à 200 000 caractères.
- **En-tête :** la première ligne du CSV devient la ligne d'en-tête ; si La première ligne est l'en-tête est désactivé, une ligne d'en-tête vide est ajoutée à la place.
- **Fichiers irréguliers :** les lignes qui ont moins de champs que la plus longue reçoivent des cellules vides à la fin, et les lignes vides sont ignorées.
- **Séparateurs :** virgules uniquement. Ce préréglage ne découpe pas les fichiers séparés par des points-virgules ou des tabulations.
- **Guillemets non fermés :** un champ sans guillemet de fermeture court jusqu'à la fin du fichier ; vérifiez la source si la dernière cellule avale plusieurs lignes.
- **Non pris en charge :** lire l'en-tête depuis un autre fichier, ignorer des colonnes et reconvertir en CSV.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre CSV, ne le stocke pas et n'utilise pas de cookies.
