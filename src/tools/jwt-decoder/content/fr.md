---
review: draft
updated: 2026-10-29
title: Décodeur JWT – Décoder l'en-tête et les claims d'un token en ligne
description: "Décodez un JWT : en-tête, claims et signature, avec exp, nbf et iat en heure UTC. Gratuit et privé : tout est traité dans votre navigateur, rien n'est envoyé."
name: Décodeur JWT
answer: "Collez votre JSON Web Token et cliquez sur Décoder : l'en-tête, les claims de la charge utile et la signature s'affichent dans votre navigateur, avec exp, nbf et iat convertis en UTC. La signature n'est pas vérifiée."
action: Décoder
fields:
  token:
    label: JWT
    placeholder: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
output:
  header:
    label: En-tête
  payload:
    label: Charge utile
  signature:
    label: Signature (non vérifiée)
  times:
    label: Claims de temps (UTC)
    columns:
      claim: Claim
      time: Heure
errors:
  invalid_token: "Ce n'est pas un JWT valide. Un token comporte trois parties séparées par des points, chacune écrite en base64url (uniquement des lettres, des chiffres, - et _, sans remplissage =) et décodable en texte UTF-8. Copiez de nouveau le token complet et retirez les guillemets ou les retours à la ligne qu'il contient."
  invalid_json: "L'en-tête ou la charge utile n'est pas un objet JSON. Un JWT transporte son en-tête et ses claims sous forme d'objets JSON ; vérifiez que le token n'a pas été tronqué ni modifié lors de la copie."
  encrypted_token: "Ce token comporte cinq parties : c'est un JWT chiffré (JWE), dont le contenu ne peut pas être lu sans la clé de déchiffrement. Seuls les tokens signés à trois parties peuvent être décodés ici."
steps:
  - "Copiez le token et collez-le dans la zone de saisie. Un « Bearer » en début de chaîne, issu d'un en-tête Authorization, est retiré automatiquement."
  - Cliquez sur Décoder.
  - "Lisez l'en-tête (l'algorithme et le type de token) et la charge utile (les claims) ; si le token contient des claims exp, nbf ou iat, ces mêmes instants s'affichent aussi convertis en UTC."
  - "Considérez le résultat comme non vérifié. Décoder ne fait que lire le token ; cela ne prouve pas qui l'a émis."
faq:
  - q: "Mon token est-il envoyé à un serveur ?"
    a: "Non. Le token est décodé entièrement dans votre navigateur, il ne quitte donc jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion. Évitez malgré tout de coller sur un site auquel vous ne faites pas confiance des tokens encore valides sur des systèmes de production."
  - q: "Cet outil vérifie-t-il la signature ?"
    a: "Non. Il décode seulement les trois parties, et la signature est affichée telle qu'elle figure dans le token. N'importe qui peut créer un token avec les claims de son choix : vérifiez donc la signature avec la clé de l'émetteur dans votre propre code avant de faire confiance à un token."
  - q: "Que signifient exp, nbf et iat ?"
    a: "Ce sont des claims de temps définis par la RFC 7519, exprimés en secondes depuis le 1970-01-01 UTC. exp est l'instant d'expiration du token, nbf (not before) celui à partir duquel il est valide, et iat (issued at) celui de sa création. Le tableau convertit chacun en heure UTC lisible ; il n'indique pas si le token est expiré à l'instant présent."
  - q: "Pourquoi une erreur avec un token à cinq parties ?"
    a: "Un token à cinq parties est un JWT chiffré (JWE). Sa charge utile est chiffrée : sans la clé de déchiffrement, il n'y a rien à lire. Les JWT signés (JWS) ont trois parties."
  - q: "Peut-il décoder un token dont la signature est vide ?"
    a: 'Oui. Un token non sécurisé (avec "alg":"none") se termine par un point et une signature vide. Il se décode normalement, mais rien ne protège ses claims : ne lui faites jamais confiance pour contrôler un accès.'
---

## Ce que fait cet outil JWT

Un JSON Web Token ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)) est constitué de trois parties encodées en base64url et réunies par des points : un en-tête avec l'algorithme de signature, une charge utile avec les claims, et une signature. Le décodeur découpe le token, décode l'en-tête et la charge utile de base64url vers UTF-8 et les affiche en JSON indenté. Parmi les claims, `iat`, `nbf` et `exp` sont des dates numériques ; elles sont donc aussi listées en heure UTC.

## Options et limites

- **Décodage seulement :** la signature n'est jamais vérifiée, et l'outil ne récupère pas de clés ni ne compare le token à l'heure actuelle.
- **Tokens signés :** les tokens à trois parties peuvent être décodés, y compris ceux non signés dont la signature est vide. Les tokens chiffrés à cinq parties (JWE) sont refusés.
- **Format strict :** l'en-tête et la charge utile doivent être des objets JSON. Les caractères du Base64 standard (+, / et =) ne sont pas acceptés à la place de base64url.
- **Grands nombres :** les valeurs des claims passent par des nombres JavaScript ; les entiers supérieurs à 9 007 199 254 740 991 peuvent donc perdre en précision.
- **Taille :** limitée uniquement par la mémoire de votre appareil.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre token, ne le stocke pas et n'utilise pas de cookies.
