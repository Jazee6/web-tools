---
review: draft
updated: 2026-10-23
title: Convertisseur vidéo – Convertir MP4, WebM, MOV et MKV gratuitement
description: Convertissez vos vidéos entre MP4, WebM, MOV et MKV gratuitement. Privé et rapide — la conversion se fait dans votre navigateur avec WebCodecs, sans envoi de la vidéo.
name: Convertisseur vidéo
answer: Choisissez une vidéo MP4, MOV ou WebM, sélectionnez le format de sortie et cliquez sur Convertir la vidéo — le fichier est converti sur votre appareil et vous le téléchargez aussitôt. Si seul le conteneur change, quelques secondes suffisent.
action: Convertir la vidéo
fields:
  file:
    label: Vidéo (MP4, MOV ou WebM)
  format:
    label: Format de sortie
    options:
      mp4: MP4 (H.264 + AAC)
      webm: WebM (VP9 + Opus)
      mov: MOV (QuickTime)
      mkv: MKV (Matroska)
output:
  file:
    label: Vidéo convertie
errors:
  invalid_video: Ce fichier n'a pas pu être lu comme une vidéo. Il est peut-être endommagé ou dans un format que cet outil ne prend pas en charge.
  no_video: Ce fichier n'a pas de piste vidéo, il ne contient que de l'audio.
  unsupported_codec: "Ce navigateur ne peut pas décoder ou encoder l'une des pistes de cette vidéo. Essayez un autre format de sortie ou la dernière version de Chrome. Codec :"
steps:
  - Choisissez une vidéo MP4, MOV ou WebM de 500 Mo maximum.
  - Sélectionnez le format de sortie. Le MP4 se lit presque partout, le WebM convient au web, le MOV aux apps Apple, et le MKV conserve les pistes d'origine telles quelles.
  - Cliquez sur Convertir la vidéo. Une barre de progression indique l'avancement, et vous pouvez annuler à tout moment.
  - Téléchargez la vidéo convertie.
faq:
  - q: Ma vidéo est-elle envoyée sur un serveur ?
    a: Non. La vidéo est lue, décodée et encodée dans votre navigateur avec l'API WebCodecs, elle ne quitte donc jamais votre appareil.
  - q: Pourquoi la conversion est-elle parfois presque instantanée ?
    a: Si la vidéo et l'audio utilisent déjà un codec que le nouveau format accepte — par exemple H.264 et AAC de MOV vers MP4 — les pistes sont copiées telles quelles et seul le conteneur est réécrit. Rien n'est réencodé, c'est donc rapide et la qualité ne change pas.
  - q: La conversion réduit-elle la qualité ?
    a: Seulement quand la vidéo doit être réencodée, par exemple de WebM vers MP4. L'outil encode avec une qualité élevée, la différence est donc généralement difficile à voir, mais un réencodage n'est jamais parfaitement sans perte.
  - q: Quels codecs le fichier de sortie utilise-t-il ?
    a: Le MP4 et le MOV utilisent la vidéo H.264 et l'audio AAC lorsque votre navigateur sait les encoder. Sinon — Firefox, par exemple, n'a pas d'encodeur AAC — l'outil se rabat sur un autre codec accepté par le format, comme l'audio Opus. Le WebM utilise VP9 et Opus. Le MKV conserve les codecs d'origine.
  - q: Puis-je convertir des fichiers MKV ?
    a: Pas encore. Le MKV est disponible comme format de sortie, mais les fichiers MKV ne peuvent pas encore être choisis en entrée.
---

## Fonctionnement de la conversion

L'outil lit la vidéo avec Mediabunny, une bibliothèque multimédia open source, et utilise l'API WebCodecs intégrée à votre navigateur pour décoder et encoder les pistes, souvent avec l'accélération matérielle. Les pistes que le format cible accepte déjà sont copiées sans réencodage. Le travail s'effectue dans un thread en arrière-plan, la page reste donc réactive.

## Limites

- **Entrée :** fichiers MP4, MOV et WebM de 500 Mo maximum.
- **Pistes :** la piste vidéo principale et la piste audio principale sont converties ; les sous-titres et les pistes audio supplémentaires sont supprimés.
- **Codecs :** les codecs que l'on peut décoder et encoder dépendent de votre navigateur et de votre appareil. Si une piste ne peut pas être convertie, l'outil s'arrête avec un message au lieu de créer un fichier sans son ni image.
- **Mémoire :** la vidéo convertie reste en mémoire jusqu'au téléchargement, les très gros fichiers peuvent donc échouer sur mobile.

## Confidentialité

Votre vidéo est traitée uniquement sur votre appareil. La page ne l'envoie pas, ne la stocke pas et n'utilise pas de cookies.
