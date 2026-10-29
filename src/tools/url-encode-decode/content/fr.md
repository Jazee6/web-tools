---
review: reviewed
updated: 2026-10-29
title: Encodeur/décodeur d'URL – Encoder des URL en pourcentage en ligne
description: "Encodez du texte pour une URL ou décodez des séquences comme %20. Gratuit et privé : tout est traité dans votre navigateur, rien n'est envoyé."
name: Encodeur/décodeur d'URL
answer: "Collez votre texte ou votre URL, choisissez Encoder ou Décoder et une portée, puis cliquez sur Convertir : le résultat s'affiche dans votre navigateur."
action: Convertir
fields:
  text:
    label: Texte ou URL
    placeholder: https://example.com/search?q=café & tea
  mode:
    label: Mode
    options:
      encode: Encoder (texte vers %XX)
      decode: Décoder (%XX vers texte)
  scope:
    label: Portée
    options:
      component: Composant d'URL (valeur de requête, segment de chemin)
      url: "URL complète (conserve : / ? # & =)"
      form: Données de formulaire (espaces en +)
output:
  result:
    label: Résultat
errors:
  invalid_encoding: "Ce texte ne peut pas être converti. Au décodage, cherchez un % qui n'est pas suivi de deux chiffres hexadécimaux, ou des octets encodés en pourcentage qui ne sont pas de l'UTF-8 valide. À l'encodage, cherchez des caractères endommagés, comme un substitut isolé."
steps:
  - Collez ou saisissez votre texte, votre URL ou votre chaîne encodée en pourcentage dans la zone de saisie.
  - "Choisissez un mode : Encoder (texte vers %XX) ou Décoder (%XX vers texte)."
  - "Choisissez une portée. Utilisez Composant d'URL (valeur de requête, segment de chemin) pour une seule valeur de requête ou un segment de chemin, URL complète (conserve : / ? # & =) pour laisser intacte la ponctuation de l'URL elle-même, ou Données de formulaire (espaces en +) pour les valeurs application/x-www-form-urlencoded."
  - Cliquez sur Convertir, puis copiez le résultat. En cas d'échec, l'erreur explique ce qu'il faut vérifier.
faq:
  - q: Mon texte est-il envoyé à un serveur ?
    a: Non. L'encodage et le décodage sont traités entièrement dans votre navigateur, votre texte ne quitte donc jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: Quelle est la différence entre Composant d'URL et URL complète ?
    a: "Composant d'URL échappe tout sauf les lettres, les chiffres et - _ . ! ~ * ' ( ), donc des caractères comme / ? & = # sont aussi échappés. Utilisez-le pour une seule valeur dans une URL. URL complète laisse intacts les caractères qui structurent une URL (: / ? # & = et d'autres) et n'échappe que le reste, si bien qu'une adresse entière reste utilisable."
  - q: Quand utiliser Données de formulaire ?
    a: "Utilisez-le pour les valeurs application/x-www-form-urlencoded, le format des envois de formulaires HTML et de nombreuses chaînes de requête. Il encode une espace en + au lieu de %20 et échappe aussi ! ' ( ) ~. Au décodage, + redevient une espace."
  - q: Pourquoi le décodage échoue-t-il avec une séquence % ?
    a: "Un signe pourcentage doit être suivi d'exactement deux chiffres hexadécimaux, et les octets ainsi formés doivent être de l'UTF-8 valide. Un % isolé dans du texte ordinaire, comme « 100% », ou une séquence tronquée comme %E4%B8 est refusé. Pour un signe pourcentage littéral, écrivez %25."
  - q: Le décodage avec URL complète transforme-t-il %2F en barre oblique ?
    a: "Non. Le décodage avec la portée URL complète laisse tels quels les échappements de caractères réservés comme %2F, %3F et %23, car en faire de vrais séparateurs changerait le sens de l'URL. Pour les décoder, utilisez Composant d'URL."
---

## Ce que fait cet outil d'URL

Il applique l'encodage en pourcentage défini par la [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) : le texte est converti en octets UTF-8 et chaque octet non autorisé est écrit sous la forme %XX. Les portées Composant d'URL et URL complète utilisent les fonctions intégrées du navigateur `encodeURIComponent` et `encodeURI` ; Données de formulaire suit les règles de l'[URL Standard](https://url.spec.whatwg.org/#application/x-www-form-urlencoded). Les résultats sont ceux que ces mêmes fonctions renvoient dans votre propre JavaScript.

## Options et limites

- **Modes :** encoder du texte en pourcentage ou le décoder en texte.
- **Portées :** Composant d'URL, URL complète ou Données de formulaire (espaces en +). La portée s'applique dans les deux modes.
- **Texte uniquement :** une seule chaîne est convertie à la fois ; une URL n'est ni découpée en parties ni récupérée.
- **Taille :** limitée uniquement par la mémoire de votre appareil.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre texte, ne le stocke pas et n'utilise pas de cookies.
