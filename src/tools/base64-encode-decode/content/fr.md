---
review: reviewed
updated: 2026-10-29
title: Encodeur et décodeur Base64 – Convertir du texte en Base64 en ligne
description: "Encodez du texte en Base64 ou décodez du Base64, avec sortie compatible URL et UTF-8. Gratuit et privé : tout est traité dans votre navigateur, rien n'est envoyé."
name: Encodeur/décodeur Base64
answer: "Collez votre texte ou votre chaîne Base64, choisissez Encoder ou Décoder et cliquez sur Convertir : le résultat s'affiche dans votre navigateur, avec une prise en charge complète des caractères non anglais."
action: Convertir
fields:
  text:
    label: Texte ou Base64
    placeholder: Hello, 世界!
  mode:
    label: Mode
    options:
      encode: Encoder du texte en Base64
      decode: Décoder du Base64 en texte
  urlSafe:
    label: Sortie compatible URL (- et _, sans bourrage)
output:
  result:
    label: Résultat
errors:
  invalid_base64: Ce n'est pas du Base64 valide. Supprimez les caractères autres que les lettres, les chiffres, + / - _ et = (les espaces et les retours à la ligne ne posent pas de problème), vérifiez que rien n'a été coupé, puis réessayez.
  invalid_utf8: Le Base64 est valide, mais les octets qu'il contient ne sont pas du texte UTF-8. Il s'agit probablement de données binaires, comme une image ou un fichier, que cet outil ne peut pas afficher en texte.
steps:
  - Collez ou saisissez dans la zone de saisie le texte à encoder ou la chaîne Base64 à décoder.
  - "Choisissez un mode : Encoder du texte en Base64 ou Décoder du Base64 en texte."
  - Pour l'encodage, activez Sortie compatible URL (- et _, sans bourrage) si le résultat doit servir dans une URL, un nom de fichier ou un JWT.
  - "Cliquez sur Convertir, puis copiez le résultat. Si le décodage échoue, l'erreur indique si le problème vient du Base64 lui-même ou du texte qu'il contient."
faq:
  - q: Mon texte est-il envoyé à un serveur ?
    a: Non. L'encodage et le décodage sont traités entièrement dans votre navigateur, votre texte ne quitte donc jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: Est-ce que cela fonctionne avec les emojis et les caractères non anglais ?
    a: Oui. Le texte est converti en octets UTF-8 avant d'être encodé, et les octets décodés sont relus en UTF-8 ; des caractères comme 世界 ou 😀 résistent donc à un aller-retour.
  - q: Qu'est-ce que le Base64 compatible URL ?
    a: Le Base64 standard utilise + et /, qui ont un sens particulier dans les URL, ainsi que = comme bourrage. La variante compatible URL de la RFC 4648 les remplace par - et _ et supprime le bourrage, de sorte que le résultat peut servir dans des URL, des noms de fichier et des JWT sans échappement.
  - q: Pourquoi le décodage indique-t-il que les octets ne sont pas du texte UTF-8 ?
    a: Le Base64 peut contenir n'importe quels octets, pas seulement du texte. Si la chaîne provient d'une image, d'un PDF ou de données chiffrées, ses octets ne sont pas de l'UTF-8 valide et ne peuvent pas être affichés en texte. Cet outil ne décode que du texte.
  - q: Le Base64 est-il une forme de chiffrement ?
    a: Non. N'importe qui peut décoder du Base64 sans clé, il ne cache donc rien. Il transforme seulement des octets en caractères ordinaires qui passent dans les systèmes conçus pour le texte, comme l'e-mail, le JSON et les URL. Ne l'utilisez pas pour protéger des secrets.
---

## Ce que fait cet outil Base64

À l'encodage, il convertit votre texte en octets UTF-8 et les écrit avec l'alphabet de 64 caractères défini dans la [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), en ajoutant le bourrage =. Au décodage, il fait l'inverse et relit les octets comme du texte UTF-8. Le décodage est tolérant : il accepte l'alphabet standard comme l'alphabet compatible URL, ignore les espaces et les retours à la ligne, et fonctionne même sans bourrage.

## Options et limites

- **Modes :** encoder du texte en Base64 ou décoder du Base64 en texte.
- **Sortie compatible URL :** s'applique uniquement à l'encodage ; elle utilise - et _ et omet le bourrage =. Le décodage n'a besoin d'aucun réglage.
- **Texte uniquement :** les fichiers et les données binaires ne sont pas pris en charge. Un Base64 qui se décode en octets qui ne sont pas de l'UTF-8 valide est refusé au lieu d'être affiché sous forme de texte illisible.
- **Taille :** limitée uniquement par la mémoire de votre appareil.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre texte, ne le stocke pas et n'utilise pas de cookies.
