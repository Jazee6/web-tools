---
review: draft
updated: 2026-11-02
title: Couper la vidéo – Découper MP4, MOV, WebM et MKV gratuitement
description: Coupez une vidéo entre un début et une fin, gratuitement, en MP4, MOV, WebM ou MKV. Privé et rapide — tout se fait dans le navigateur, votre vidéo n'est jamais envoyée.
name: Couper la vidéo
answer: Choisissez une vidéo, saisissez une heure de début et une heure de fin comme 1:30 et 2:45, puis cliquez sur Couper la vidéo — l'extrait est coupé sur votre appareil, dans le même format, et vous téléchargez le résultat.
action: Couper la vidéo
fields:
  file:
    label: Vidéo (MP4, MOV, WebM ou MKV)
  start:
    label: Heure de début
    placeholder: 0:00
  end:
    label: Heure de fin
    placeholder: Fin de la vidéo
  mode:
    label: Méthode de coupe
    options:
      precise: Précise (réencode si nécessaire)
      fast: Rapide (sans réencodage)
output:
  file:
    label: Vidéo coupée
errors:
  invalid_video: Ce fichier n'a pas pu être lu comme une vidéo. Il est peut-être endommagé ou dans un format que cet outil ne prend pas en charge. Exportez-le à nouveau en MP4 et réessayez.
  no_video: Ce fichier n'a pas de piste vidéo, il ne contient que de l'audio. Choisissez un fichier vidéo.
  unsupported_codec: "Ce navigateur ne peut pas décoder ou encoder l'une des pistes de cette vidéo. Essayez la méthode Rapide ou la dernière version de Chrome. Codec :"
  invalid_time: "Saisissez une heure en secondes (90.5), en minutes:secondes (1:30) ou en heures:minutes:secondes (1:02:03). Cette valeur est illisible :"
  range_required: Saisissez une heure de début, une heure de fin ou les deux.
  end_before_start: L'heure de fin doit être postérieure à l'heure de début.
  start_past_end: "L'heure de début est après la fin de la vidéo. Durée de cette vidéo :"
steps:
  - Choisissez une vidéo MP4, MOV, WebM ou MKV de 500 Mo maximum.
  - Saisissez l'heure de début, l'heure de fin ou les deux, en secondes (90.5), en minutes:secondes (1:30) ou en heures:minutes:secondes (1:02:03). Laissez-en une vide pour garder la vidéo depuis le début ou jusqu'à la fin.
  - Choisissez une méthode de coupe. Précise coupe aux heures exactes, et Rapide conserve la qualité d'origine. Si les images que vous retirez sont sensibles, utilisez Précise, car un extrait Rapide peut encore en contenir une partie.
  - Cliquez sur Couper la vidéo. Une barre de progression indique l'avancement, et vous pouvez annuler à tout moment.
  - Téléchargez la vidéo coupée.
faq:
  - q: Ma vidéo est-elle envoyée sur un serveur ?
    a: Non. La vidéo est lue et coupée dans votre navigateur, elle ne quitte donc jamais votre appareil.
  - q: Quelle est la différence entre Précise et Rapide ?
    a: Précise commence et finit exactement aux heures saisies, mais doit généralement réencoder la vidéo. Rapide copie la vidéo telle quelle, elle se termine donc bien plus vite et garde la qualité d'origine, mais ne peut commencer la coupe que sur une image clé.
  - q: Pourquoi mon extrait Rapide commence-t-il plus tôt que prévu ?
    a: Une vidéo ne peut être copiée qu'à partir d'une image clé ; un extrait WebM ou MKV commence donc à la dernière image clé avant votre heure de début. En MP4 et MOV, ces images en trop restent dans le fichier mais sont masquées par une liste d'édition, si bien qu'un lecteur qui la prend en charge démarre à votre heure. Un extrait Rapide peut aussi dépasser l'heure de fin de quelques images.
  - q: Les images que j'ai coupées sont-elles vraiment supprimées ?
    a: "Avec Précise, oui — rien en dehors de vos heures ne reste dans le fichier. Avec Rapide, pas toujours. Les images situées entre la dernière image clé et votre heure de début restent dans le fichier, ainsi que quelques images après l'heure de fin. En MP4 et MOV, elles sont seulement masquées à la lecture, donc toute personne disposant d'un outil de montage vidéo pourrait les récupérer. Pour retirer des images sensibles avant de partager une vidéo, utilisez Précise."
  - q: La coupe réduit-elle la qualité ?
    a: Pas avec Rapide, car rien n'est réencodé. Précise réencode avec un réglage de haute qualité, la différence est donc généralement difficile à voir, mais un réencodage n'est jamais parfaitement sans perte. Précise copie aussi sans réencoder lorsque votre heure de début tombe sur une image clé et que vous ne coupez pas la fin.
  - q: Que se passe-t-il si l'heure de fin dépasse la fin de la vidéo ?
    a: L'extrait va simplement jusqu'à la fin de la vidéo.
  - q: Puis-je changer le format pendant la coupe ?
    a: Non. L'extrait reste dans le même format que l'original. Pour le changer ensuite, utilisez le [Convertisseur vidéo](/fr/video-converter).
---

## Fonctionnement de la coupe

L'outil lit la vidéo avec Mediabunny, une bibliothèque multimédia open source. Avec Rapide, il copie les données vidéo et audio existantes de la partie choisie. Avec Précise, il décode cette partie et l'encode à nouveau avec l'API WebCodecs intégrée à votre navigateur, souvent avec l'accélération matérielle. Le travail s'effectue dans un thread en arrière-plan, la page reste donc réactive.

## Options et limites

- **Entrée :** fichiers MP4, MOV, WebM et MKV de 500 Mo maximum. L'extrait garde le même format.
- **Images coupées :** un extrait Rapide peut garder des images situées juste en dehors de vos heures, même si un lecteur ne les affiche pas. Précise n'en laisse aucune.
- **Pistes :** la piste vidéo principale et la piste audio principale sont conservées ; les sous-titres et les pistes audio supplémentaires sont supprimés.
- **Codecs :** avec Précise, les codecs que l'on peut décoder et encoder dépendent de votre navigateur et de votre appareil. Firefox, par exemple, n'a pas d'encodeur AAC : MP4 et MOV y reçoivent donc de l'audio Opus. Si une piste ne peut pas être traitée, l'outil s'arrête avec un message au lieu de créer un fichier sans son ni image.
- **Mémoire :** la vidéo coupée reste en mémoire jusqu'au téléchargement, les très gros fichiers peuvent donc échouer sur mobile.

## Confidentialité

Votre vidéo est traitée uniquement sur votre appareil. La page ne l'envoie pas, ne la stocke pas et n'utilise pas de cookies.
