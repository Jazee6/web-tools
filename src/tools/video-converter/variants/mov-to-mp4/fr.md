---
review: reviewed
updated: 2026-10-29
title: "Convertir MOV en MP4 – Vidéos QuickTime gratuites en ligne"
description: "Convertissez MOV en MP4 gratuitement dans votre navigateur. Les vidéos d'iPhone et de QuickTime sont souvent prêtes en quelques secondes, sans réencodage ni envoi."
name: "MOV en MP4"
answer: "Choisissez un fichier .mov et cliquez sur Convertir la vidéo : MP4 est déjà sélectionné. La plupart des enregistrements d'iPhone et de Mac utilisent H.264 ou HEVC avec de l'audio AAC, que MP4 accepte tel quel ; la vidéo est donc réemballée en quelques secondes, sans perte de qualité."
steps:
  - "Choisissez une vidéo MOV de votre iPhone, de votre Mac ou de votre appareil photo, jusqu'à 500 Mo."
  - "Laissez MP4 comme format de sortie et cliquez sur Convertir la vidéo."
  - "Téléchargez le fichier MP4 et lisez-le ou partagez-le où vous voulez."
faq:
  - q: "Pourquoi convertir MOV en MP4 ?"
    a: "MOV est le format QuickTime d'Apple. Windows, Android, les téléviseurs connectés et de nombreux formulaires d'envoi gèrent MP4 de façon plus fiable, même quand la vidéo à l'intérieur est exactement la même."
  - q: "Ma vidéo d'iPhone va-t-elle perdre en qualité ?"
    a: "En général non. Les iPhone enregistrent de la vidéo H.264 ou HEVC avec de l'audio AAC, et ces flux sont copiés dans le MP4 sans réencodage, donc chaque image reste identique."
  - q: "Pourquoi ma vidéo MOV en ProRes ne se convertit-elle pas ?"
    a: "Apple ProRes est un codec de montage professionnel que les navigateurs ne peuvent pas décoder. Exportez d'abord le clip en H.264 ou HEVC depuis votre logiciel de montage, puis convertissez-le ici."
  - q: "Que devient l'audio PCM non compressé ?"
    a: "Les lecteurs MP4 attendent de l'audio compressé, donc le PCM est encodé en AAC. Firefox n'a pas d'encodeur AAC : l'audio y est encodé en Opus à la place."
table:
  caption: "Ce qui arrive à chaque flux d'un fichier MOV dans le MP4"
  columns:
    track: "Piste"
    source: "Codec dans le MOV"
    result: "Dans le MP4"
    output: "Codec de sortie"
  terms:
    video: "Vidéo"
    audio: "Audio"
    copied: "Copié sans réencodage"
    reencoded: "Réencodé"
    unsupported: "Non pris en charge par les navigateurs"
---

## Pourquoi MOV vers MP4 est généralement instantané

MOV et MP4 sont de proches cousins : tous deux dérivent du format de fichier QuickTime d'Apple et stockent les flux de la même façon. Quand les flux d'un MOV sont de la vidéo H.264 ou HEVC et de l'audio AAC, le convertisseur se contente de réécrire le conteneur qui les entoure. Aucune image n'est décodée ni réencodée : un long clip d'iPhone devient un MP4 en quelques secondes et reste identique à l'original.

## Quels fichiers MOV doivent être réencodés

Les fichiers issus d'enregistreurs d'écran, d'anciens appareils photo et d'interfaces audio contiennent parfois de l'audio PCM ou MP3. Cet audio est encodé en AAC (en Opus dans Firefox), tandis que la vidéo continue d'être copiée. La vidéo Apple ProRes ne peut être décodée dans aucun navigateur : l'outil s'arrête donc avec un message plutôt que de produire un fichier cassé.

## Confidentialité

Le fichier MOV est lu et réemballé sur votre appareil. Il n'est jamais envoyé, et la page n'utilise pas de cookies.
