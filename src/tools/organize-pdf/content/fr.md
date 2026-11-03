---
review: draft
updated: 2026-11-03
title: Organiser PDF – Réorganiser, faire pivoter et supprimer des pages
description: "Réorganisez, faites pivoter et supprimez les pages d'un PDF avec un aperçu de chaque page. Gratuit et privé : tout se passe dans votre navigateur, sans envoi du document."
name: Organiser PDF
answer: Choisissez un PDF, utilisez les boutons sous l'aperçu de chaque page pour la déplacer, la faire pivoter ou la retirer, puis cliquez sur Organiser le PDF. Le nouveau PDF est créé sur votre appareil et prêt à être téléchargé aussitôt.
action: Organiser le PDF
fields:
  file:
    label: Fichier PDF
  pages:
    label: Pages
    placeholder: 3, 1-2 r90, 5-
output:
  file:
    label: PDF
errors:
  encrypted: "Ce PDF est protégé par un mot de passe. Retirez le mot de passe puis réessayez :"
  invalid_pdf: "Impossible de lire ce fichier comme un PDF. Il est peut-être endommagé. Exportez-le à nouveau puis réessayez :"
  invalid_pages: "Saisissez les pages sous forme de numéros et de plages séparés par des virgules, avec r90, r180 ou r270 pour les faire pivoter, comme 3, 1-2 r90, 5-. Cette partie est illisible :"
  page_out_of_range: "Cette page n'existe pas. Nombre de pages de ce PDF :"
steps:
  - Choisissez un fichier PDF de 50 Mo maximum. Un aperçu de chaque page s'affiche sous Pages.
  - Utilisez les flèches sous une page pour l'avancer ou la reculer, le bouton de rotation pour la faire pivoter de 90° dans le sens horaire et la croix pour la retirer.
  - Vérifiez l'ordre dans le champ Pages, qui se met à jour pendant vos modifications. Vous pouvez aussi y écrire directement, par exemple 3, 1-2 r90, 5-.
  - Cliquez sur Organiser le PDF et téléchargez le fichier.
faq:
  - q: Mon PDF est-il envoyé sur un serveur ?
    a: "Non. Les aperçus comme le nouveau PDF sont créés dans votre navigateur avec PDFium compilé en WebAssembly : votre document ne quitte jamais votre appareil."
  - q: Faire pivoter une page réduit-il la qualité ?
    a: "Non. La rotation modifie seulement le réglage de rotation de la page : le texte reste sélectionnable et les images ne sont pas recompressées. Quand vous déplacez ou supprimez des pages, elles sont copiées telles quelles."
  - q: Que signifient les numéros du champ Pages ?
    a: Ce sont les pages du nouveau PDF, dans l'ordre. 3, 1-2 r90, 5- signifie la page 3, puis les pages 1 et 2 pivotées de 90° dans le sens horaire, puis de la page 5 à la dernière. Les pages non indiquées sont supprimées. Laissez le champ vide pour garder toutes les pages telles quelles.
  - q: Puis-je mettre la même page deux fois ?
    a: Oui. Saisissez son numéro deux fois dans le champ Pages, par exemple 1, 2, 1. Chaque copie peut avoir sa propre rotation.
  - q: Une page était déjà de travers. Que fait le bouton de rotation ?
    a: Chaque clic ajoute 90° dans le sens horaire à l'orientation actuelle de la page, si bien que l'aperçu correspond toujours au résultat. Après quatre rotations, la page revient à sa position de départ.
  - q: Les signets et les champs de formulaire sont-ils conservés ?
    a: Les pages sont reprises avec leur texte et leurs images inchangés, mais les signets ne sont pas ajoutés au nouveau fichier. Les champs de formulaire remplissables gardent leur contenu, mais peuvent ne plus être modifiables.
---

## Fonctionnement de l'organisation

L'outil utilise PDFium — le moteur PDF de Google Chrome — compilé en WebAssembly. Quand vous choisissez un fichier, il dessine un petit aperçu de chaque page dans un thread en arrière-plan, quelques pages à la fois. Quand vous cliquez sur Organiser le PDF, il copie les pages dans un nouveau document dans l'ordre choisi, applique la rotation de chaque page et enregistre le résultat. La page reste réactive tout du long.

## Options et limites

- **Entrée :** un fichier PDF de 50 Mo maximum.
- **Pages :** pages isolées et plages séparées par des virgules, chacune éventuellement suivie de r90, r180 ou r270 pour une rotation dans le sens horaire. Une plage doit aller d'une page inférieure à une page supérieure, et chaque page doit exister dans le fichier. Au moins une page doit rester.
- **Sortie :** un PDF portant le nom de l'original suivi de -organized.
- **Mots de passe :** les fichiers qui demandent un mot de passe à l'ouverture ne peuvent pas être organisés et n'affichent pas d'aperçu.
- **Mémoire :** le fichier reste en mémoire pendant vos modifications, si bien que les documents très volumineux peuvent échouer sur mobile.

Pour extraire certaines pages dans des fichiers séparés, utilisez [Diviser PDF](/fr/split-pdf). Pour ajouter des pages d'autres documents, utilisez [Fusionner PDF](/fr/merge-pdf).

## Confidentialité

Votre document est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le stocke pas et n'utilise pas de cookies.
