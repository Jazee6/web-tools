---
review: reviewed
updated: 2026-10-29
title: Audio en texte – Transcrire audio et vidéo gratuitement en ligne
description: "Transcrivez audio et vidéo en texte et sous-titres SRT, gratuitement. Privé : le modèle Whisper s'exécute dans votre navigateur, votre fichier n'est jamais envoyé."
name: Transcription audio en texte
answer: Choisissez un fichier audio ou vidéo, laissez la langue sur Détecter automatiquement ou choisissez la langue parlée, puis cliquez sur Transcrire. Whisper convertit la parole en texte sur votre appareil ; vous pouvez copier la transcription ou la télécharger en sous-titres SRT.
action: Transcrire
fields:
  file:
    label: Audio ou vidéo (MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM ou MKV)
  language:
    label: Langue parlée
    options:
      auto: Détecter automatiquement
output:
  text:
    label: Transcription
  subtitles:
    label: Sous-titres (SRT)
errors:
  invalid_audio: Ce fichier n'a pas pu être lu comme un fichier audio. Il est peut-être endommagé ou dans un format que cet outil ne prend pas en charge. Essayez une copie de l'enregistrement en MP3 ou WAV.
  no_audio: Ce fichier n'a pas de piste audio, il n'y a donc rien à transcrire. Choisissez un fichier contenant du son.
  unsupported_codec: "Ce navigateur ne peut pas décoder l'audio de ce fichier. Essayez un autre format de fichier ou la dernière version de Chrome. Codec :"
  too_long: L'enregistrement dure plus de 60 minutes. Découpez-le en parties plus courtes et transcrivez-les une par une.
  no_speech: Aucune parole n'a été trouvée dans cet enregistrement. Vérifiez qu'il est audible et contient une voix claire, puis réessayez.
steps:
  - Choisissez un fichier audio ou vidéo de 1 Go et 60 minutes au maximum.
  - Laissez Langue parlée sur Détecter automatiquement ou choisissez la langue parlée. La choisir aide pour les extraits courts et les accents prononcés.
  - Cliquez sur Transcrire. La première fois, le modèle de reconnaissance vocale (environ 105 à 125 Mo) est téléchargé et enregistré dans votre navigateur ; ensuite, la transcription démarre immédiatement.
  - Copiez la transcription ou téléchargez le fichier SRT pour l'utiliser comme sous-titres dans un lecteur ou un logiciel de montage vidéo.
faq:
  - q: Mon enregistrement est-il envoyé sur un serveur ?
    a: Non. L'audio est décodé et transcrit dans votre navigateur, le fichier ne quitte donc jamais votre appareil. Seul le modèle de reconnaissance vocale est téléchargé, une seule fois.
  - q: Quelles langues sont prises en charge ?
    a: Les 99 langues sur lesquelles Whisper a été entraîné, dont le français, l'anglais, l'espagnol, l'allemand, le chinois, le japonais et le portugais. La précision est meilleure pour les langues très parlées et les enregistrements nets.
  - q: Pourquoi la première transcription est-elle plus lente ?
    a: L'outil télécharge d'abord le modèle Whisper, d'environ 105 à 125 Mo selon votre appareil, et l'enregistre dans votre navigateur. Les transcriptions suivantes utilisent la copie enregistrée et démarrent immédiatement.
  - q: Quelle est la précision de la transcription ?
    a: L'outil utilise Whisper base, un modèle compact qui fonctionne bien dans un navigateur. Il reconnaît bien une parole claire, mais peut se tromper avec un enregistrement bruyant, plusieurs voix simultanées ou des noms peu courants. Relisez donc la transcription avant de la publier.
  - q: Qu'est-ce qu'un fichier SRT ?
    a: SRT est le format de sous-titres le plus répandu. Chaque ligne de la transcription a une heure de début et de fin, si bien que des lecteurs comme VLC et des logiciels de montage comme Premiere Pro ou CapCut peuvent l'afficher en sous-titres.
---

## Fonctionnement de la transcription

L'outil décode l'audio avec Mediabunny et l'API WebCodecs, le convertit en mono 16 kHz et le transmet à Whisper base, un modèle de reconnaissance vocale open source d'OpenAI. Le modèle s'exécute avec ONNX Runtime dans un thread en arrière-plan. Si votre appareil dispose d'un GPU suffisamment performant, une partie du modèle s'y exécute avec WebGPU, ce qui est plus rapide ; sinon, tout s'exécute sur le processeur avec WebAssembly. Les enregistrements longs sont découpés en fenêtres de 30 secondes qui se chevauchent, puis réassemblés.

## Limites

- **Entrée :** audio MP3, M4A, AAC, WAV, OGG, Opus, FLAC et WebM, ou la piste audio d'une vidéo MP4, MOV, WebM ou MKV, jusqu'à 1 Go et 60 minutes.
- **Vitesse :** la reconnaissance est plus rapide dans les navigateurs qui offrent un vrai GPU via WebGPU et dans ceux qui autorisent le multithreading ; sinon, elle passe par une voie monothread plus lente.
- **Navigateurs :** l'audio est décodé avec l'API WebCodecs ; les fichiers qui fonctionnent dépendent donc des codecs de votre navigateur, et la dernière version de Chrome en prend en charge le plus.
- **Téléchargement :** le modèle pèse environ 105 à 125 Mo et est téléchargé à la première utilisation.
- **Précision :** Whisper base est un petit modèle. Le bruit de fond, la musique et plusieurs personnes parlant en même temps réduisent la qualité.
- **Chinois :** Whisper écrit souvent le chinois en caractères traditionnels, même pour le mandarin de Chine continentale.

## Confidentialité

Votre enregistrement est traité uniquement sur votre appareil. La page ne l'envoie pas, ne le conserve pas et n'utilise pas de cookies.
