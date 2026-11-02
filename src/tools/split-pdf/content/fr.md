---
review: draft
updated: 2026-11-02
title: Diviser PDF – Extraire des pages ou séparer un PDF gratuitement
description: Divisez un PDF en plusieurs fichiers ou extrayez les pages voulues. Gratuit et privé — la division se fait dans votre navigateur, votre document n'est jamais envoyé.
name: Diviser PDF
answer: Choisissez un PDF, saisissez les pages voulues — par exemple 1-3, 5, 8- — et cliquez sur Diviser PDF. Chaque plage devient un fichier sur votre appareil ; laissez le champ vide pour séparer chaque page.
action: Diviser PDF
fields:
  file:
    label: Fichier PDF
  pages:
    label: Pages
    placeholder: 1-3, 5, 8-
  mode:
    label: Sortie
    options:
      separate: Un PDF par plage
      combined: Toutes les pages listées dans un seul PDF
output:
  files:
    label: Fichiers PDF
errors:
  encrypted: "Ce PDF est protégé par un mot de passe. Retirez le mot de passe puis réessayez :"
  invalid_pdf: "Impossible de lire ce fichier comme un PDF. Il est peut-être endommagé. Exportez-le à nouveau puis réessayez :"
  invalid_pages: "Saisissez les pages sous forme de numéros et de plages séparés par des virgules, comme 1-3, 5, 8-. Cette partie est illisible :"
  page_out_of_range: "Cette page n'existe pas. Nombre de pages de ce PDF :"
  pages_required: Saisissez les pages à mettre dans le PDF, par exemple 1-3, 5.
  too_many_files: Cela créerait plus de 500 fichiers. Saisissez moins de plages, ou des plages plus larges comme 1-100, 101-200.
steps:
  - Choisissez un fichier PDF de 50 Mo maximum.
  - Saisissez les pages, par exemple 1-3, 5, 8-. Les pages sont numérotées à partir de 1, et 8- va jusqu'à la dernière page. Laissez Pages vide pour séparer chaque page.
  - Sous Sortie, choisissez Un PDF par plage pour obtenir un fichier distinct pour chaque partie entre virgules, ou Toutes les pages listées dans un seul PDF pour les extraire dans un seul fichier.
  - Cliquez sur Diviser PDF, puis téléchargez chaque fichier ou tous ensemble dans un fichier ZIP.
faq:
  - q: Mon PDF est-il envoyé sur un serveur ?
    a: Non. Le fichier est lu et divisé dans votre navigateur par PDFium compilé en WebAssembly, il ne quitte donc jamais votre appareil.
  - q: Comment extraire seulement quelques pages ?
    a: Saisissez-les sous Pages, par exemple 2, 5-7, et choisissez Toutes les pages listées dans un seul PDF. Vous obtenez un seul fichier avec ces pages.
  - q: Comment diviser un PDF en pages séparées ?
    a: Laissez Pages vide, gardez Un PDF par plage sélectionné et cliquez sur Diviser PDF. Chaque page devient son propre fichier. Le nombre de fichiers par exécution est limité à 500 ; pour des documents plus longs, utilisez des plages.
  - q: Puis-je réorganiser ou répéter des pages ?
    a: "Oui, lorsque vous les placez dans un seul PDF. Les pages sortent dans l'ordre où vous les saisissez, donc 5, 1-2, 1 donne la page 5, les pages 1 et 2, puis de nouveau la page 1."
  - q: La division réduit-elle la qualité ?
    a: Non. Les pages sont copiées telles quelles — le texte reste sélectionnable et les images ne sont pas recompressées.
  - q: Les signets et les champs de formulaire sont-ils conservés ?
    a: Les pages sont reprises avec leur texte et leurs images inchangés, mais les signets ne sont pas ajoutés aux nouveaux fichiers. Les champs de formulaire remplissables gardent leur contenu, mais peuvent ne plus être modifiables.
---

## Fonctionnement de la division

L'outil utilise PDFium — le moteur PDF de Google Chrome — compilé en WebAssembly. Il ouvre votre fichier, copie les pages demandées dans un nouveau document pour chaque fichier de sortie, puis enregistre le résultat. Le travail se fait dans un thread en arrière-plan, la page reste donc réactive.

## Options et limites

- **Entrée :** un fichier PDF de 50 Mo maximum.
- **Pages :** pages seules et plages séparées par des virgules. Une plage doit aller d'une page inférieure à une page supérieure, et chaque page doit exister dans le fichier.
- **Sortie :** jusqu'à 500 fichiers PDF par exécution.
- **Mots de passe :** les fichiers qui demandent un mot de passe à l'ouverture ne peuvent pas être divisés.
- **Taille des fichiers :** chaque fichier peut contenir des ressources partagées par tout le document, comme les polices ; les parties réunies peuvent donc être plus lourdes que l'original.
- **Mémoire :** le fichier et tous les résultats sont gardés en mémoire, les très gros documents peuvent donc échouer sur mobile.

Pour recombiner les parties, ou pour réunir d'autres documents, utilisez [Fusionner PDF](/fr/merge-pdf).

## Confidentialité

Votre document est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le stocke pas et n'utilise pas de cookies.
