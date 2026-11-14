---
review: reviewed
updated: 2026-11-14
title: Générateur de tableaux Markdown – CSV et Excel en tableau en ligne
description: "Transformez du CSV, des cellules d'Excel ou de Google Sheets ou un tableau Markdown mal aligné en tableau Markdown propre. Gratuit et privé, dans votre navigateur."
name: Générateur de tableaux Markdown
answer: Collez du CSV, des cellules copiées depuis un tableur ou un tableau Markdown dans la zone Données du tableau — le tableau Markdown aligné s'affiche aussitôt. Cliquez sur Copier pour le copier.
action: Générer le tableau
fields:
  data:
    label: Données du tableau
    placeholder: "Name,Role\nAda,Engineer\nGrace,Admiral"
  from:
    label: Format d'entrée
    options:
      auto: Détection automatique
      csv: CSV (séparé par des virgules)
      tsv: TSV (copié depuis Excel ou Google Sheets)
      markdown: Tableau Markdown
  header:
    label: La première ligne est l'en-tête
  align:
    label: Alignement
    options:
      none: Non défini
      left: À gauche
      center: Centré
      right: À droite
  pad:
    label: Aligner les colonnes
output:
  markdown:
    label: Tableau Markdown
errors:
  empty: Aucune cellule n'a été trouvée. Collez des lignes de CSV, des cellules copiées depuis un tableur ou un tableau Markdown.
steps:
  - Collez vos données dans la zone Données du tableau — du CSV, des cellules copiées depuis Excel ou Google Sheets, ou un tableau Markdown.
  - Si le tableau semble incorrect, choisissez le bon Format d'entrée.
  - Désactivez La première ligne est l'en-tête si vos données n'ont pas de ligne d'en-tête.
  - Choisissez un Alignement si toutes les colonnes doivent être alignées de la même façon.
  - Cliquez sur Copier pour copier le tableau Markdown.
faq:
  - q: Comment transformer une plage Excel ou Google Sheets en tableau Markdown ?
    a: Sélectionnez les cellules, copiez-les et collez-les dans la zone Données du tableau. Les tableurs copient les cellules sous forme de texte séparé par des tabulations (TSV), que le générateur reconnaît grâce aux tabulations de la première ligne. Les cellules contenant des retours à la ligne ou des guillemets sont mises entre guillemets par le tableur et lues correctement.
  - q: Que deviennent les virgules, les guillemets et les retours à la ligne dans un CSV ?
    a: Le générateur suit la RFC 4180. Un champ entre guillemets doubles peut contenir des virgules et des retours à la ligne, et "" représente un guillemet. Un | dans une cellule est échappé en \| pour ne pas couper la colonne, et un retour à la ligne dans une cellule devient <br>, car une ligne de tableau Markdown doit tenir sur une seule ligne.
  - q: Peut-il remettre en forme un tableau Markdown mal aligné ?
    a: Oui. Collez le tableau et il est réécrit avec un espacement régulier. Chaque colonne garde l'alignement de la ligne --- sauf si vous choisissez un Alignement pour tout le tableau, et le contenu des cellules, y compris le code en ligne, les liens et les \| échappés, reste tel qu'il est écrit.
  - q: Pourquoi mon tableau a-t-il une première ligne vide ?
    a: Un tableau Markdown doit avoir une ligne d'en-tête. Quand La première ligne est l'en-tête est désactivé, le générateur ajoute une ligne d'en-tête vide pour que votre première ligne reste dans le corps du tableau. Certains moteurs de rendu affichent cette ligne vide comme une fine bande.
  - q: Pourquoi les colonnes ne sont-elles pas alignées dans mon éditeur ?
    a: Aligner les colonnes ajoute des espaces pour que toutes les cellules d'une colonne aient la même largeur dans une police à chasse fixe. La largeur est estimée caractère par caractère — les caractères chinois, japonais et coréens, les symboles pleine chasse et les emoji comptent pour deux colonnes, comme les affichent la plupart des éditeurs de code, et tout le reste pour une. Dans un éditeur à police proportionnelle, ou qui affiche certains caractères avec une autre largeur, l'alignement peut rester irrégulier — le tableau rendu est le même dans tous les cas.
---

## Comment fonctionne le générateur de tableaux Markdown

Le générateur lit vos données comme du CSV selon la [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180), comme des valeurs séparées par des tabulations ou comme un [tableau GitHub Flavored Markdown](https://github.github.com/gfm/#tables-extension-), et produit un tableau GitHub Flavored Markdown. Quand le Format d'entrée est en détection automatique, une première ligne qui commence par | ou une deuxième ligne composée de cellules --- signale du Markdown, des tabulations dans la première ligne signalent du TSV, et tout le reste est lu comme du CSV. La largeur des colonnes est estimée pour chaque caractère tel que le lecteur le voit, en comptant les caractères larges d'Asie de l'Est et les emoji pour deux colonnes, si bien que la plupart des textes s'alignent dans un éditeur de code.

## Options et limites

- **Données du tableau :** jusqu'à 200 000 caractères. Les lignes vides sont ignorées, et les lignes qui ont moins de cellules que la plus longue sont complétées par des cellules vides.
- **CSV :** seules les virgules séparent les champs. Les fichiers séparés par des points-virgules, courants avec certaines versions européennes d'Excel, ne sont pas découpés ; enregistrez-les avec des virgules ou collez directement les cellules du tableur.
- **Alignement :** un même alignement pour toutes les colonnes, ou Non défini pour laisser les colonnes CSV et TSV sans alignement et conserver l'alignement d'un tableau Markdown.
- **Cellules :** les espaces au début et à la fin sont supprimés. Dans les cellules CSV et TSV, seul | est échappé et les retours à la ligne deviennent <br> ; le Markdown ou le HTML qu'elles contiennent, comme du **gras**, est conservé et affiché.
- **Non pris en charge :** les cellules fusionnées, l'alignement par colonne pour le CSV et le TSV, et la conversion d'un tableau Markdown en CSV.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas vos données, ne les stocke pas et n'utilise pas de cookies.
