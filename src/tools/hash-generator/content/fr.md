---
review: draft
updated: 2026-10-29
title: Générateur de hachage – Générer des hachages MD5, SHA-1 et SHA-256
description: "Générez l'empreinte MD5, SHA-1, SHA-256, SHA-384 ou SHA-512 de n'importe quel texte en hexadécimal ou Base64. Gratuit et privé : tout est traité dans votre navigateur."
name: Générateur de hachage
answer: "Saisissez ou collez votre texte, choisissez un algorithme comme SHA-256 et un format de sortie, puis cliquez sur Générer le hachage : le hachage s'affiche directement dans votre navigateur."
action: Générer le hachage
fields:
  text:
    label: Texte
    placeholder: Texte à hacher
  algorithm:
    label: Algorithme
    options:
      md5: MD5
      sha-1: SHA-1
      sha-256: SHA-256
      sha-384: SHA-384
      sha-512: SHA-512
  format:
    label: Format de sortie
    options:
      hex: Hexadécimal (minuscules)
      hex-upper: Hexadécimal (majuscules)
      base64: Base64
output:
  hash:
    label: Hachage
errors: {}
steps:
  - Saisissez ou collez dans la zone de saisie le texte à hacher.
  - Choisissez un algorithme. SHA-256 est choisi par défaut ; MD5 et SHA-1 ne servent que pour les sommes de contrôle et la compatibilité.
  - "Choisissez un format de sortie : Hexadécimal (minuscules), Hexadécimal (majuscules) ou Base64."
  - Cliquez sur Générer le hachage, puis copiez le résultat.
faq:
  - q: Mon texte est-il envoyé à un serveur ?
    a: Non. Le hachage est calculé entièrement dans votre navigateur, votre texte ne quitte donc jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: Quel algorithme dois-je utiliser ?
    a: Utilisez SHA-256, sauf si autre chose est exigé. SHA-384 et SHA-512 produisent des hachages plus longs de la même famille. MD5 et SHA-1 sont cassés pour la sécurité, car des attaquants peuvent fabriquer des collisions ; réservez-les aux sommes de contrôle et à la compatibilité avec d'anciens systèmes.
  - q: Puis-je l'utiliser pour hacher des mots de passe ?
    a: Non. Ce sont des hachages généralistes rapides, et un hachage rapide se casse facilement par force brute. Pour stocker des mots de passe, utilisez côté serveur une fonction de hachage de mots de passe lente et salée, comme Argon2, scrypt ou bcrypt.
  - q: Pourquoi le hachage diffère-t-il du résultat d'un autre outil ?
    a: Le texte est haché sous forme d'octets UTF-8 exactement tel que vous l'avez saisi ; un retour à la ligne final, une espace en trop ou des fins de ligne différentes changent donc le résultat. Un autre outil peut aussi lire le texte avec un autre encodage.
  - q: Puis-je hacher un fichier ?
    a: Pas avec cet outil, qui ne traite que du texte.
---

## Ce que fait cet outil de hachage

Il convertit votre texte en octets UTF-8 et calcule l'empreinte de ces octets. SHA-1, SHA-256, SHA-384 et SHA-512 utilisent l'API Web Crypto intégrée à votre navigateur, qui met en œuvre la norme [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final). MD5 ne fait pas partie de Web Crypto ; la page inclut donc sa propre implémentation de la [RFC 1321](https://www.rfc-editor.org/rfc/rfc1321), vérifiée avec les vecteurs de test officiels.

## Options et limites

- **Algorithmes :** MD5, SHA-1, SHA-256, SHA-384, SHA-512.
- **Formats de sortie :** hexadécimal en minuscules, hexadécimal en majuscules ou Base64.
- **Texte uniquement :** les fichiers ne sont pas pris en charge, et le texte est haché exactement tel que saisi, espaces et retours à la ligne compris.
- **Pas pour les mots de passe :** ces hachages sont rapides par conception et non salés ; ils ne conviennent donc pas au stockage de mots de passe.
- **Taille :** limitée uniquement par la mémoire de votre appareil.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre texte, ne le stocke pas et n'utilise pas de cookies.
