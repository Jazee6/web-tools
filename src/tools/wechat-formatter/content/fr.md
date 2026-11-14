---
review: reviewed
updated: 2026-11-14
title: Mise en page WeChat – Markdown en article WeChat en ligne
description: Rédigez votre article en Markdown et copiez-le en texte enrichi, mis en forme pour l'éditeur des comptes officiels WeChat. Gratuit et privé, dans votre navigateur.
name: Mise en page WeChat
answer: Saisissez ou collez votre article en Markdown, choisissez une couleur d'accent et cliquez sur Copier le texte enrichi pour coller un article mis en forme dans l'éditeur des comptes officiels WeChat ; l'aperçu se met à jour pendant que vous écrivez.
action: Mettre en page l'article
fields:
  markdown:
    label: Markdown
    placeholder: "# Titre\n\nRédigez votre article en **Markdown**…"
  accent:
    label: Couleur d'accent
    options:
      neutral: Neutre
      blue: Bleu
      green: Vert
      orange: Orange
      red: Rouge
      rose: Rose
      violet: Violet
      yellow: Jaune
output:
  html:
    label: Aperçu WeChat
steps:
  - Saisissez ou collez votre article dans le champ Markdown. L'aperçu WeChat se met à jour pendant que vous écrivez.
  - Choisissez une Couleur d'accent pour la barre des titres de niveau 2, la bordure des citations, le code en ligne et les numéros des références.
  - Cliquez sur Copier le texte enrichi.
  - Collez-le dans le corps de votre article dans l'éditeur des comptes officiels WeChat.
  - Pour utiliser l'article dans un autre éditeur ou un modèle, cliquez plutôt sur Copier le HTML afin d'obtenir le code source avec tous les styles en ligne.
faq:
  - q: Pourquoi mes liens deviennent-ils des numéros ?
    a: L'éditeur des comptes officiels WeChat ne permet pas aux lecteurs de cliquer sur des liens vers d'autres sites dans le corps de l'article. L'outil garde le texte du lien, ajoute un numéro comme [1] après celui-ci et liste toutes les adresses à la fin, pour que les lecteurs puissent retrouver la source. Les liens vers des articles de mp.weixin.qq.com restent cliquables.
  - q: Pourquoi la mise en forme disparaît-elle quand je colle le HTML dans l'éditeur ?
    a: Copier le HTML place le code source dans le presse-papiers, et l'éditeur l'affiche comme du texte brut. Pour l'éditeur WeChat, utilisez Copier le texte enrichi ; il copie l'article mis en forme, comme lorsque vous copiez depuis une page web.
  - q: Puis-je ajouter des images depuis mon ordinateur ?
    a: Non. Les images doivent être des adresses web http ou https, écrites sous la forme ![légende](https://…). L'outil n'envoie aucun fichier. Une image seule dans un paragraphe est centrée, avec son texte alternatif affiché en légende en dessous.
  - q: Quels langages de programmation sont colorés ?
    a: Tous les langages que connaît le surligneur Shiki, de JavaScript et Python à SQL et Bash. Indiquez le langage après le délimiteur d'ouverture, par exemple ```python. Le code sans langage, ou avec un langage que Shiki ne reconnaît pas, s'affiche en texte à chasse fixe sans coloration.
  - q: Mon brouillon est-il enregistré ?
    a: Oui, si votre navigateur autorise le site à stocker des données. Le contenu du champ Markdown est enregistré sur cet appareil peu après que vous avez cessé de taper, puis restauré à votre retour ; attendez donc un instant avant de fermer la page. Le brouillon n'est jamais envoyé. Effacer les données locales du site le supprime.
  - q: Puis-je écrire du HTML dans le Markdown ?
    a: Non. Les balises HTML s'affichent comme du texte au lieu d'être interprétées, ce qui garde aussi l'aperçu sûr. Utilisez le Markdown pour les titres, listes, liens, images et tableaux.
---

## Comment fonctionne la mise en page WeChat

L'éditeur des comptes officiels WeChat supprime les feuilles de style et les noms de classe du contenu collé : toute la mise en forme de l'article est donc écrite en styles en ligne. L'outil lit votre Markdown avec [marked](https://marked.js.org/) et écrit chaque titre, paragraphe, liste, tableau, citation et bloc de code avec les styles typographiques de ce site : texte de 16 px, interligne de 1,75, palette neutre et polices système, car l'éditeur ne peut pas charger de polices web. Les blocs de code sont colorés avec [Shiki](https://shiki.style/) selon les couleurs de GitHub Light.

## Options et limites

- **Markdown :** CommonMark plus les tableaux, listes de tâches et texte barré de GitHub, jusqu'à 200 000 caractères. Les éléments des listes de tâches s'affichent avec ☑ ou ☐, car l'éditeur supprime les cases à cocher.
- **Couleur d'accent :** neutre, bleu, vert, orange, rouge, rose, violet ou jaune. Elle colore la barre à côté des titres de niveau 2, la bordure des citations, le code en ligne, les liens WeChat et les numéros des références ; le texte courant reste presque noir.
- **Liens :** les liens vers mp.weixin.qq.com restent cliquables ; les autres liens http et https deviennent des références numérotées à la fin de l'article. Les autres liens ne gardent que leur texte.
- **Images :** adresses http et https uniquement ; pour toute autre adresse, seul le texte alternatif est conservé.
- **Copie :** les deux boutons utilisent le presse-papiers du navigateur, qui demande une autorisation sur certains navigateurs ; Copier le texte enrichi nécessite aussi un navigateur capable de copier du HTML mis en forme. Si la copie échoue, autorisez l'accès au presse-papiers et réessayez.
- **Non pris en charge :** HTML brut (affiché comme texte), formules mathématiques et diagrammes.

## Confidentialité

Votre article est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le stocke pas sur un serveur et n'utilise pas de cookies.
