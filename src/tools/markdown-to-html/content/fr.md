---
review: reviewed
updated: 2026-11-14
title: Markdown en HTML – Convertir et prévisualiser le HTML en ligne
description: Convertissez du Markdown en HTML propre avec des ID de titre, un document HTML complet en option et la coloration syntaxique. Gratuit et privé, dans votre navigateur.
name: Markdown en HTML
answer: Saisissez ou collez du Markdown et le HTML s'affiche au fil de la frappe — passez de l'aperçu au code HTML, puis cliquez sur Copier le HTML pour copier le code.
action: Convertir
fields:
  markdown:
    label: Markdown
    placeholder: "# Title\n\nWrite **Markdown** here…"
  headingIds:
    label: Ajouter des ID de titre
  document:
    label: Document HTML complet
  highlight:
    label: Coloration syntaxique
  theme:
    label: Thème de coloration
    options:
      github-light: GitHub Light
      github-dark: GitHub Dark
      one-dark-pro: One Dark Pro
      vitesse-light: Vitesse Light
output:
  html:
    label: HTML
steps:
  - Saisissez ou collez votre Markdown dans la zone Markdown. Le HTML se met à jour au fil de la frappe.
  - Activez Document HTML complet si vous avez besoin d'une page entière plutôt que d'un fragment.
  - Activez Coloration syntaxique pour colorer les blocs de code.
  - Choisissez un Thème de coloration.
  - Ouvrez l'onglet HTML pour lire le code, ou restez sur Aperçu pour vérifier le rendu.
  - Cliquez sur Copier le HTML pour copier le code, ou sur Copier le texte enrichi pour coller le résultat mis en forme dans un éditeur comme Google Docs ou Word.
faq:
  - q: Le HTML présent dans mon Markdown est-il conservé ?
    a: "Oui. Le HTML brut, comme <details>, <kbd> ou un <img> avec une largeur, est recopié tel quel dans le résultat, comme l'exige la spécification CommonMark. L'aperçu s'affiche dans un cadre isolé sans scripts : un <script> de votre Markdown ne s'exécute donc pas sur cette page. Il fait pourtant partie du résultat et peut s'exécuter là où vous publiez le HTML ; ne convertissez donc que du Markdown de confiance."
  - q: Comment les ID de titre sont-ils créés ?
    a: Selon les règles que GitHub utilise pour ses ancres. Le texte du titre, sans balises Markdown ni HTML, est mis en minuscules ; la ponctuation, les symboles et les emoji sont supprimés, sauf les traits d'union et la ponctuation de liaison comme _ ; les espaces deviennent des traits d'union. Ainsi, "What's new in v2.0?" devient id="whats-new-in-v20". Les lettres de toutes les écritures sont conservées, accents compris, et les titres en chinois ou en cyrillique gardent leur texte. Un titre répété reçoit -1, -2, etc., et un titre dont il ne reste rien, par exemple composé uniquement d'emoji, ne reçoit pas d'ID. Désactivez Ajouter des ID de titre pour ne pas en générer.
  - q: Quelle est la différence entre un fragment et un document HTML complet ?
    a: Un fragment contient seulement le contenu converti, prêt à coller dans une page, un CMS ou un modèle qui a déjà son propre <head> et ses styles. Un document HTML complet ajoute <!doctype html>, un <head> avec un titre tiré du premier titre de niveau 1 qui contient du texte ("Document" s'il n'y en a pas) et une petite feuille de style par défaut, pour que vous puissiez l'enregistrer en fichier .html et l'ouvrir dans un navigateur.
  - q: Comment fonctionne la coloration syntaxique ?
    a: 'Les blocs de code qui indiquent un langage après la clôture d''ouverture, comme ```python, sont colorés par Shiki. Chaque couleur est écrite en style en ligne : le HTML n''a donc pas besoin d''une feuille de style séparée, mais les éditeurs qui suppriment les styles en ligne suppriment aussi les couleurs. Le code sans langage, ou avec un langage que Shiki ne reconnaît pas, reste sans couleur. La coloration est désactivée par défaut ; les blocs qui indiquent un langage reçoivent alors <pre><code class="language-…"> pour votre propre outil de coloration, et les autres un simple <pre><code>.'
  - q: Mon Markdown est-il enregistré ?
    a: Oui, si votre navigateur autorise le site à stocker des données. La zone Markdown est enregistrée sur cet appareil peu après que vous avez cessé de taper, puis restaurée à votre retour. Elle n'est jamais envoyée. Effacer les données locales du site la supprime.
---

## Comment fonctionne le convertisseur Markdown en HTML

Le convertisseur analyse votre Markdown avec [marked](https://marked.js.org/), selon [CommonMark](https://commonmark.org/) et les extensions GitHub Flavored Markdown pour les tableaux, les listes de tâches, le texte barré et les liens automatiques. Il produit le même HTML que marked, en ajoutant des ID de titre à la manière de GitHub et, si vous l'activez, du code coloré avec [Shiki](https://shiki.style/). La conversion s'exécute dans un fil d'arrière-plan de votre navigateur plutôt que sur la page elle-même.

## Options et limites

- **Markdown :** jusqu'à 200 000 caractères.
- **HTML brut :** conservé tel quel et non nettoyé. Les scripts ne s'exécutent jamais dans l'aperçu, mais ils font partie du résultat.
- **ID de titre :** activés par défaut, selon les règles d'ancres de GitHub ; les titres répétés reçoivent -1, -2, et ceux dont il ne reste rien n'en reçoivent pas.
- **Document HTML complet :** désactivé par défaut ; ajoute un doctype, un titre tiré du premier titre de niveau 1 et une feuille de style par défaut.
- **Coloration syntaxique :** désactivée par défaut ; GitHub Light, GitHub Dark, One Dark Pro ou Vitesse Light, avec des couleurs en ligne. Le thème et la grammaire de chaque langage sont téléchargés la première fois qu'ils servent, ce qui peut prendre un instant ; si le téléchargement échoue, par exemple hors connexion, les blocs de code restent sans couleur.
- **Copie :** les deux boutons utilisent le presse-papiers du navigateur, qui demande une autorisation dans certains navigateurs ; Copier le texte enrichi exige aussi un navigateur capable de copier du HTML mis en forme.
- **Non pris en charge :** les notes de bas de page, les formules mathématiques et les diagrammes comme Mermaid, qui restent du texte ou des blocs de code. Le front matter YAML n'est pas retiré et est converti comme le reste du Markdown.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre Markdown, ne le stocke pas sur un serveur et n'utilise pas de cookies.
