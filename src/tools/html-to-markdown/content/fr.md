---
review: reviewed
updated: 2026-11-14
title: HTML en Markdown – Convertir du HTML et du texte enrichi en Markdown
description: "Collez du HTML ou du texte mis en forme copié d'une page web, de Word ou de Google Docs : obtenez un Markdown propre avec tableaux. Gratuit et privé, dans le navigateur."
name: HTML en Markdown
answer: Collez du code HTML, ou copiez du texte mis en forme depuis une page web ou un document et collez-le dans la zone HTML — le Markdown s'affiche aussitôt. Cliquez sur Copier pour le copier.
action: Convertir
fields:
  html:
    label: HTML
    placeholder: "<h1>Title</h1>\n<p>Paste HTML, or copy formatted text from a page and paste it here.</p>"
output:
  markdown:
    label: Markdown
errors:
  empty: Il ne reste rien à convertir. Le HTML ne contient que des scripts, des styles ou d'autres contenus supprimés — collez la partie de la page qui contient le texte voulu.
steps:
  - Collez du HTML dans la zone HTML, ou sélectionnez du texte mis en forme sur une page web, dans Word ou dans Google Docs, copiez-le et collez-le dans la zone.
  - Lisez le Markdown qui s'affiche dans la zone Markdown.
  - Cliquez sur Copier pour copier le Markdown.
faq:
  - q: Puis-je coller du texte mis en forme au lieu de code HTML ?
    a: Oui. Quand vous copiez depuis une page web, Word, Google Docs ou un e-mail, le presse-papiers contient aussi le HTML qui porte la mise en forme. Coller dans la zone HTML insère ce HTML plutôt que le texte brut, si bien que titres, liens, listes et tableaux sont conservés. Si le presse-papiers ne contient que du texte brut, il est collé normalement.
  - q: Comment les tableaux sont-ils convertis ?
    a: Tout tableau qui contient des cellules devient un tableau Markdown, et sa première ligne devient la ligne d'en-tête même si elle utilise des cellules ordinaires, comme les tableaux copiés depuis Word et Google Docs. Un | dans une cellule est échappé en \|, plusieurs paragraphes ou retours à la ligne dans une cellule sont joints par <br>, et une cellule qui s'étend sur plusieurs colonnes est suivie de cellules vides. L'alignement à gauche, centré ou à droite défini sur les cellules d'en-tête est conservé.
  - q: Qu'est-ce qui est supprimé ?
    a: <script>, <style>, <noscript>, <iframe>, <template> et le <head> de la page, titre compris. Tout le reste est converti, y compris les menus de navigation et les pieds de page ; collez donc seulement la partie de la page dont vous avez besoin.
  - q: Quel style de Markdown produit-il ?
    a: "Du GitHub Flavored Markdown avec des titres #, des puces -, de l'*italique*, du **gras**, des blocs de code délimités par ``` avec le langage quand l'élément code a une classe comme language-js, des liens en ligne, du ~~barré~~ et des éléments de liste de tâches - [x] issus des cases à cocher. Le style est fixe, pour que le résultat ait toujours le même aspect."
  - q: Pourquoi certains éléments HTML disparaissent-ils sans laisser de trace ?
    a: Markdown n'a pas de syntaxe pour les couleurs, les polices, les formulaires ou la mise en page ; seul leur texte est conservé. Les images gardent leur adresse et leur texte alternatif ; une adresse qui pointe vers un fichier de votre ordinateur ne fonctionne nulle part ailleurs.
---

## Comment fonctionne le convertisseur HTML en Markdown

Le convertisseur lit votre HTML avec l'analyseur HTML de votre navigateur et le transforme en Markdown avec [Turndown](https://github.com/mixmark-io/turndown) : un HTML désordonné ou incomplet est donc lu comme votre navigateur l'afficherait. Les règles GitHub Flavored Markdown pour les tableaux, le texte barré et les listes de tâches sont propres à ce site, si bien que les tableaux sans cellules d'en-tête sont convertis au lieu de rester en HTML.

## Options et limites

- **Entrée :** fragments HTML ou pages entières, jusqu'à 1 000 000 de caractères.
- **Collage :** le texte mis en forme est collé sous forme de HTML quand le presse-papiers en contient ; le texte brut est collé tel quel.
- **Supprimé :** scripts, styles, noscript, iframes, templates et le head de la page. La navigation, les en-têtes et les pieds de page sont convertis comme tout autre contenu.
- **Tableaux :** la première ligne est toujours la ligne d'en-tête ; une cellule qui s'étend sur plusieurs lignes n'est pas répétée, et un tableau imbriqué dans une cellule devient du texte dans cette cellule.
- **Listes :** les listes HTML (<ul> et <ol>) deviennent des listes Markdown. Les listes qui arrivent sous forme de paragraphes commençant par une puce ou un numéro, comme Word les copie souvent, restent des paragraphes.
- **Non pris en charge :** le choix d'un autre style de Markdown, comme les puces *, les titres setext ou les liens de référence.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre HTML, ne le stocke pas et n'utilise pas de cookies.
