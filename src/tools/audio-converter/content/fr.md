---
review: draft
updated: 2026-11-03
title: Convertisseur audio – Convertir WAV, M4A, OGG et FLAC en MP3
description: "Convertissez gratuitement l'audio entre MP3, M4A, WAV et OGG, depuis MP3, M4A, AAC, WAV, OGG, Opus ou FLAC. Privé et rapide : tout se fait dans le navigateur."
name: Convertisseur audio
answer: Choisissez un fichier audio, sélectionnez MP3, M4A, WAV ou OGG et un débit, puis cliquez sur Convertir l'audio. Le fichier est converti sur votre appareil et vous téléchargez le résultat. Par défaut, c'est du MP3 à 192 kbit/s, lisible partout.
action: Convertir l'audio
fields:
  file:
    label: Audio (MP3, M4A, AAC, WAV, OGG, Opus ou FLAC)
  format:
    label: Format de sortie
    options:
      mp3: MP3
      m4a: M4A (AAC)
      wav: WAV (non compressé)
      ogg: OGG (Opus)
  bitrate:
    label: Débit
    options:
      "128": 128 kbit/s (plus léger)
      "192": 192 kbit/s (recommandé)
      "320": 320 kbit/s (maximum)
output:
  file:
    label: Audio converti
errors:
  invalid_audio: Ce fichier n'a pas pu être lu comme de l'audio. Il est peut-être endommagé ou dans un format que cet outil ne prend pas en charge. Exportez-le à nouveau en MP3 ou en WAV et réessayez.
  unsupported_codec: "Ce navigateur ne peut pas décoder ou encoder cet audio. Essayez un autre format de sortie ou la dernière version de Chrome. Codec :"
  aac_unavailable: "Ce navigateur ne peut pas encoder l'AAC (Firefox, par exemple, n'a pas d'encodeur AAC). Choisissez MP3, WAV ou OGG, ou utilisez Chrome ou Safari."
steps:
  - Choisissez un fichier audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC ou WebM de 500 Mo maximum.
  - Sélectionnez le format de sortie. Le MP3 se lit partout, le M4A (AAC) convient à l'iPhone et au Mac, le WAV est non compressé pour le montage, et l'OGG (Opus) offre le meilleur son pour sa taille.
  - Sélectionnez un débit pour le MP3, le M4A ou l'OGG. 192 kbit/s convient à la plupart des musiques, 128 kbit/s donne des fichiers plus légers et 320 kbit/s est le maximum. Le WAV l'ignore.
  - Cliquez sur Convertir l'audio. Une barre de progression indique l'avancement, et vous pouvez annuler à tout moment.
  - Téléchargez le fichier converti.
faq:
  - q: Mon audio est-il envoyé sur un serveur ?
    a: Non. Le fichier est décodé et encodé dans votre navigateur, il ne quitte donc jamais votre appareil.
  - q: Comment convertir un WAV en MP3 ?
    a: Choisissez le fichier WAV, laissez MP3 comme format de sortie, sélectionnez un débit et cliquez sur Convertir l'audio. Une minute de WAV stéréo pèse environ 10 Mo, contre environ 1,4 Mo pour la même minute en MP3 à 192 kbit/s.
  - q: Quel débit choisir ?
    a: À 192 kbit/s, la plupart des musiques sont difficiles à distinguer de l'original. 128 kbit/s suffit pour la voix et les podcasts et donne des fichiers plus légers. 320 kbit/s est le réglage MP3 le plus élevé, quand la taille du fichier n'a pas d'importance.
  - q: Convertir à un débit plus élevé améliore-t-il le son ?
    a: Non. Convertir un MP3 de 128 kbit/s en 320 kbit/s alourdit le fichier, mais les détails perdus lors du premier encodage ne reviennent pas. Passer d'un format avec perte à un autre fait toujours perdre un peu de qualité, alors partez d'un WAV ou d'un FLAC si possible.
  - q: Puis-je changer le débit d'un MP3 ?
    a: Oui. Choisissez le MP3, laissez MP3 comme format de sortie et sélectionnez un autre débit. Le son est réencodé à ce débit, une façon simple d'alléger un gros MP3.
  - q: Puis-je convertir des fichiers FLAC ?
    a: "Oui, dans Chrome, Edge et Firefox. Safari ne sait pas décoder le FLAC, l'outil y affiche donc un message. Le FLAC peut être converti en MP3, M4A, OGG ou WAV ; cet outil ne produit pas de FLAC."
  - q: Que devient le son surround ?
    a: Le MP3, le M4A et l'OGG sont écrits avec 2 canaux au maximum, le son surround est donc mixé en stéréo. Le WAV garde tous les canaux.
---

## Fonctionnement de la conversion

L'outil lit le fichier avec Mediabunny, une bibliothèque multimédia open source, décode le son avec l'API WebCodecs intégrée à votre navigateur et l'encode à nouveau dans le format choisi. Les navigateurs ne savent pas encoder le MP3 : pour le MP3, l'outil utilise donc un encodeur construit à partir de LAME, un encodeur MP3 open source. Le travail s'effectue dans un thread en arrière-plan, la page reste donc réactive.

Pour récupérer le son d'une vidéo, utilisez [Extraire l'audio](/fr/extract-audio).

## Options et limites

- **Entrée :** fichiers audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC et WebM de 500 Mo maximum. Seule la piste audio principale est convertie.
- **MP3 :** 128, 192 ou 320 kbit/s, jusqu'à 2 canaux. Les fréquences d'échantillonnage inhabituelles sont converties en 48 kHz.
- **M4A :** AAC au débit choisi, jusqu'à 2 canaux, à 44,1 ou 48 kHz. Firefox n'a pas d'encodeur AAC : le M4A n'y est pas disponible.
- **OGG :** Opus au débit choisi, jusqu'à 2 canaux, toujours à 48 kHz. Le son mono est encodé à 256 kbit/s au maximum.
- **WAV :** son non compressé en 16 bits avec les canaux et la fréquence d'échantillonnage d'origine, environ 10 Mo par minute d'audio stéréo.
- **Réencodage :** le MP3, le M4A et l'OGG sont toujours encodés au débit choisi, même depuis le même format. Un WAV déjà en 16 bits est copié tel quel.
- **Navigateurs :** Safari ne sait pas décoder le FLAC ni le Vorbis. Si un fichier ne peut pas être décodé ou encodé, l'outil s'arrête avec un message.
- **Mémoire :** le fichier converti reste en mémoire jusqu'à ce que vous le téléchargiez, les très longs enregistrements peuvent donc échouer sur un téléphone.

## Confidentialité

Votre audio est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le stocke pas et n'utilise pas de cookies.
