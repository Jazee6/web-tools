---
review: draft
updated: 2026-11-03
title: Extraire l'audio d'une vidéo – Convertir MP4 en MP3 gratuitement
description: "Extrayez gratuitement le son d'une vidéo MP4, MOV, WebM ou MKV en MP3, M4A ou WAV. Privé et rapide : tout se fait dans votre navigateur, la vidéo n'est jamais envoyée."
name: Extraire l'audio
answer: Choisissez une vidéo MP4, MOV, WebM ou MKV, sélectionnez MP3, M4A, WAV ou la piste d'origine, puis cliquez sur Extraire l'audio. Le son est enregistré sur votre appareil dans un fichier audio à télécharger, sans l'image.
action: Extraire l'audio
fields:
  file:
    label: Vidéo (MP4, MOV, WebM ou MKV)
  format:
    label: Format audio
    options:
      mp3: MP3 (192 kbit/s)
      m4a: M4A (AAC, 192 kbit/s)
      wav: WAV (non compressé)
      original: Piste d'origine (sans réencodage)
output:
  file:
    label: Audio extrait
errors:
  invalid_video: Ce fichier n'a pas pu être lu comme une vidéo. Il est peut-être endommagé ou dans un format que cet outil ne prend pas en charge. Exportez-le à nouveau en MP4 et réessayez.
  no_audio: Cette vidéo n'a pas de piste audio, il n'y a donc aucun son à extraire.
  unsupported_codec: "Ce navigateur ne peut pas décoder ou encoder l'audio de cette vidéo. Essayez Piste d'origine ou la dernière version de Chrome. Codec :"
  aac_unavailable: "Ce navigateur ne peut pas encoder l'AAC (Firefox, par exemple, n'a pas d'encodeur AAC). Choisissez MP3, WAV ou Piste d'origine, ou utilisez Chrome ou Safari."
steps:
  - Choisissez une vidéo MP4, MOV, WebM ou MKV de 500 Mo maximum.
  - Sélectionnez le format audio. Le MP3 se lit partout, le M4A (AAC) convient à l'iPhone et au Mac, le WAV est non compressé pour le montage, et Piste d'origine garde le son exactement tel qu'il est dans la vidéo.
  - Cliquez sur Extraire l'audio. Une barre de progression indique l'avancement, et vous pouvez annuler à tout moment.
  - Téléchargez le fichier audio.
faq:
  - q: Ma vidéo est-elle envoyée sur un serveur ?
    a: Non. La vidéo est lue et son son est encodé dans votre navigateur, le fichier ne quitte donc jamais votre appareil.
  - q: Comment convertir une vidéo MP4 en MP3 ?
    a: Choisissez le fichier MP4, laissez MP3 comme format audio et cliquez sur Extraire l'audio. Le son est encodé en MP3 à 192 kbit/s et l'image est laissée de côté. Cela fonctionne de la même façon avec les vidéos MOV, WebM et MKV.
  - q: Quel format choisir ?
    a: Le MP3 pour un fichier lisible sur tout appareil. Le M4A (AAC) sonne un peu mieux à taille égale et convient à l'iPhone et au Mac. Le WAV est non compressé et bien plus lourd, idéal pour le montage audio. Piste d'origine est le plus rapide et ne perd aucune qualité.
  - q: Que fait Piste d'origine ?
    a: "Elle copie les données audio de la vidéo sans réencodage : c'est terminé en quelques secondes et le son ne change pas. Le type de fichier dépend de l'audio de la vidéo, par exemple M4A pour un son AAC dans un MP4 et OGG pour un son Opus dans un WebM."
  - q: L'extraction réduit-elle la qualité du son ?
    a: Pas avec Piste d'origine, ni avec le WAV, hormis ses 16 bits. Le MP3 et le M4A réencodent le son à 192 kbit/s, ce qui s'entend à peine dans la plupart des cas. Si l'audio de la vidéo est déjà en MP3 ou en AAC, choisir ce même format le copie sans réencodage.
  - q: Et si la vidéo a plusieurs pistes audio ?
    a: Seule la piste audio principale est extraite. Les autres, comme d'autres langues ou des commentaires, sont laissées de côté.
  - q: Puis-je ne garder qu'une partie du son ?
    a: Pas ici. Coupez d'abord la vidéo à la partie voulue avec [Couper la vidéo](/fr/trim-video), puis extrayez l'audio de l'extrait.
---

## Fonctionnement de l'extraction

L'outil lit la vidéo avec Mediabunny, une bibliothèque multimédia open source, et ne garde que la piste audio principale. Pour le WAV et le M4A, il décode et encode le son avec l'API WebCodecs intégrée à votre navigateur. Les navigateurs ne savent pas encoder le MP3 : pour le MP3, l'outil charge donc, la première fois que vous en avez besoin, un encodeur construit à partir de LAME, un encodeur MP3 open source. Avec Piste d'origine, rien n'est décodé : les données audio sont copiées telles quelles. Le travail s'effectue dans un thread en arrière-plan, la page reste donc réactive.

Pour convertir un fichier audio plutôt qu'une vidéo, utilisez le [Convertisseur audio](/fr/audio-converter).

## Options et limites

- **Entrée :** fichiers MP4, MOV, WebM et MKV de 500 Mo maximum.
- **MP3 :** 192 kbit/s, jusqu'à 2 canaux. Le son surround est mixé en stéréo et les fréquences d'échantillonnage inhabituelles sont converties en 48 kHz.
- **M4A :** AAC à 192 kbit/s. Firefox n'a pas d'encodeur AAC : le M4A n'y fonctionne que si le son de la vidéo est déjà en AAC, qui est alors copié. Une fois encodé, le M4A a jusqu'à 2 canaux, comme le MP3.
- **WAV :** son non compressé en 16 bits, environ 10 Mo par minute d'audio stéréo.
- **Piste d'origine :** l'AAC va dans un M4A, le MP3 dans un MP3, l'Opus et le Vorbis dans un OGG, le FLAC dans un FLAC et le PCM dans un WAV. Les autres codecs, comme l'AC-3 ou le DTS, vont dans un fichier MKA (audio Matroska).
- **Pistes :** seule la piste audio principale est extraite. Si la vidéo n'a pas de son, l'outil vous le signale au lieu de créer un fichier vide.
- **Mémoire :** le fichier audio reste en mémoire jusqu'à ce que vous le téléchargiez. Une longue vidéo extraite en WAV peut produire un fichier très lourd et échouer sur un téléphone.

## Confidentialité

Votre vidéo est traitée uniquement sur votre appareil. La page ne l'envoie pas, ne la stocke pas et n'utilise pas de cookies.
