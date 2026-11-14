---
review: reviewed
updated: 2026-11-09
title: "Générateur d'UUID – Créer des identifiants UUID v4 aléatoires en ligne"
description: "Générez jusqu'à 1 000 identifiants UUID v4 aléatoires à la fois, en minuscules ou majuscules. Gratuit et privé, avec une génération entièrement dans votre navigateur."
name: "Générateur d'UUID"
answer: "Choisissez un nombre et cliquez sur Générer les UUID pour créer des identifiants UUID v4 aléatoires dans votre navigateur, un par ligne, prêts à copier."
action: "Générer les UUID"
fields:
  count:
    label: "Nombre"
  uppercase:
    label: "Majuscules"
output:
  uuids:
    label: "UUID"
errors: {}
steps:
  - "Réglez Nombre sur un entier de 1 à 1 000 ; la valeur par défaut est 1."
  - "Activez Majuscules si vous le souhaitez ; les minuscules sont utilisées par défaut."
  - "Cliquez sur Générer les UUID et copiez le résultat, avec un identifiant par ligne."
faq:
  - q: "Quelle version d'UUID est générée ?"
    a: "Uniquement la version 4, à l'aide de l'API randomUUID cryptographiquement sûre de la plateforme. Les UUID fondés sur le temps ou un nom, comme v1, v5 ou v7, ne sont pas générés."
  - q: "Combien d'UUID puis-je générer à la fois ?"
    a: "De 1 à 1 000 par exécution. Chaque UUID occupe sa propre ligne, sans accolades ni préfixe URN."
  - q: "Les majuscules changent-elles l'UUID ?"
    a: "Non. Elles changent uniquement les lettres hexadécimales, pas la valeur de l'identifiant. Les deux formes conservent les tirets."
  - q: "Les identifiants générés sont-ils envoyés ou stockés ?"
    a: "Non. La génération se fait sur votre appareil et la page n'envoie ni ne stocke les identifiants générés. Copiez les résultats à conserver avant de quitter la page."
---

## Fonctionnement de la génération d'UUID

Chaque identifiant provient de l'API Web Crypto `crypto.randomUUID()` de la plateforme. Le résultat est un UUID v4 au format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, où `y` vaut 8, 9, a ou b en minuscules. Chaque clic génère un nouveau lot ; il n'y a ni texte d'entrée ni graine.

## Options et limites

- **Nombre :** un entier de 1 à 1 000, avec 1 par défaut.
- **Casse :** minuscules par défaut, ou majuscules avec le même format à tirets.
- **Non pris en charge :** les versions d'UUID autres que v4, les graines personnalisées, les accolades et les préfixes URN.

## Confidentialité

La génération se fait uniquement sur votre appareil. La page n'envoie pas vos UUID générés, ne les stocke pas et n'utilise pas de cookies.
