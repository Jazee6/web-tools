---
review: reviewed
updated: 2026-10-29
title: "Convertir MKV en MP4 – Vidéos Matroska gratuites en ligne"
description: "Convertissez MKV en MP4 gratuitement dans votre navigateur. Les flux H.264 et AAC sont copiés sans réencodage, en quelques secondes. Sans envoi ni inscription."
name: "MKV en MP4"
answer: "Choisissez un fichier .mkv et cliquez sur Convertir la vidéo avec MP4 sélectionné. Si la vidéo est en H.264 ou HEVC et l'audio en AAC, les flux sont copiés tels quels ; les pistes VP9, AV1, Opus ou FLAC sont réencodées pour que le fichier se lise sur téléphones, téléviseurs et logiciels de montage."
steps:
  - "Choisissez un fichier MKV jusqu'à 500 Mo."
  - "Laissez le format de sortie sur MP4 et cliquez sur Convertir la vidéo."
  - "Attendez la fin de la barre de progression : les fichiers réencodés prennent plus de temps que ceux qui sont seulement copiés."
  - "Téléchargez le MP4."
faq:
  - q: "Pourquoi mon MKV ne se lit-il pas sur ma télévision ou mon téléphone ?"
    a: "Matroska (MKV) est un conteneur flexible que beaucoup d'appareils et d'applications n'ouvrent pas, même s'ils savent lire la vidéo qu'il contient. Placer les mêmes flux dans un MP4 règle généralement le problème."
  - q: "Que deviennent les sous-titres et les autres langues audio ?"
    a: "Seules la piste vidéo principale et la piste audio principale sont conservées. Les sous-titres intégrés et les pistes audio supplémentaires sont supprimés, car le convertisseur écrit un MP4 avec une piste vidéo et une piste audio."
  - q: "Pourquoi mon fichier est-il réencodé au lieu d'être copié ?"
    a: "Ici, le MP4 est limité à la vidéo H.264 ou HEVC et à l'audio AAC, la combinaison lue par presque tous les appareils. La vidéo VP9 ou AV1 et l'audio Opus, Vorbis ou FLAC sont réencodés, ce qui est plus long et pas tout à fait sans perte. L'audio est encodé en AAC, ou en Opus dans Firefox, qui n'a pas d'encodeur AAC."
  - q: "Puis-je convertir des fichiers MKV de plus de 500 Mo ?"
    a: "Pas avec cet outil. Le fichier converti reste en mémoire jusqu'à son téléchargement ; l'entrée est donc limitée à 500 Mo pour rester fiable sur les ordinateurs portables et les téléphones."
table:
  caption: "Ce qui arrive à chaque flux d'un fichier MKV dans le MP4"
  columns:
    track: "Piste"
    source: "Codec dans le MKV"
    result: "Dans le MP4"
    output: "Codec de sortie"
  terms:
    video: "Vidéo"
    audio: "Audio"
    copied: "Copié sans réencodage"
    reencoded: "Réencodé"
---

## Copier ou réencoder : ce qui décide de la vitesse

Le MKV peut contenir presque n'importe quel codec ; deux fichiers MKV de même taille peuvent donc se comporter très différemment. Les fichiers en vidéo H.264 et audio AAC, la combinaison la plus courante dans les MKV téléchargés et enregistrés, sont simplement remuxés : les flux passent dans un conteneur MP4 en quelques secondes, sans changement de qualité. Les fichiers en vidéo VP9 ou AV1, ou en audio Opus, Vorbis ou FLAC, sont décodés puis encodés de nouveau avec WebCodecs, ce qui peut durer aussi longtemps que la vidéo elle-même.

## Ce qui n'est pas conservé

La sortie MP4 conserve une piste vidéo et une piste audio : la principale de chaque type. Les pistes de sous-titres et les autres langues audio ne sont pas reprises ; si vous avez besoin d'une autre langue, faites-en d'abord la piste audio principale avec un logiciel de bureau.

## Confidentialité

La conversion s'effectue sur votre appareil, dans un thread en arrière-plan. Le MKV n'est jamais envoyé, et la page n'utilise pas de cookies.
