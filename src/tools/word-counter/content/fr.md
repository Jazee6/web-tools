---
review: draft
updated: 2026-10-31
title: Compteur de mots – Comptez mots, caractères, phrases et paragraphes
description: "Comptez les mots, caractères, octets, lignes, phrases et paragraphes d'un texte, avec le chinois et le japonais. Gratuit et privé : tout est traité dans votre navigateur."
name: Compteur de mots
answer: "Collez votre texte et cliquez sur Compter : les mots, les caractères avec et sans espaces, les octets, les lignes, les phrases et les paragraphes s'affichent dans votre navigateur."
action: Compter
fields:
  text:
    label: Texte
    placeholder: Collez ou saisissez votre texte ici
output:
  words:
    label: Mots
  characters:
    label: Caractères
  charactersNoSpaces:
    label: Caractères (sans espaces)
  bytes:
    label: Octets (UTF-8)
  lines:
    label: Lignes
  sentences:
    label: Phrases
  paragraphs:
    label: Paragraphes
steps:
  - Collez ou saisissez votre texte dans le champ Texte.
  - Cliquez sur Compter.
  - "Lisez les nombres dont vous avez besoin : Mots, Caractères, Caractères (sans espaces), Octets (UTF-8), Lignes, Phrases ou Paragraphes."
faq:
  - q: "Mon texte est-il envoyé à un serveur ?"
    a: Non. Le comptage se fait entièrement dans votre navigateur, donc votre texte ne quitte jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion.
  - q: "Comment les mots sont-ils comptés ?"
    a: Un mot est toute suite de caractères comprise entre des espaces ou des sauts de ligne et contenant une lettre ou un chiffre ; « well-known », « don't » et « 3.14 » comptent donc chacun pour un mot, un tiret isolé pour aucun. Les caractères chinois et les kana et kanji japonais n'ont pas d'espaces entre les mots, donc chacun compte pour un mot, comme dans Microsoft Word. Le coréen est séparé par des espaces et se compte comme l'anglais.
  - q: "Pourquoi le nombre de caractères est-il inférieur au nombre d'unités de code de mon texte ?"
    a: Les caractères sont comptés comme un lecteur les voit. Un emoji comme 😀, un emoji de famille formé de plusieurs emojis liés ou une lettre suivie d'un accent comptent chacun pour un caractère, et un saut de ligne Windows (CRLF) compte pour un. Les espaces, tabulations et sauts de ligne sont inclus dans Caractères et exclus de Caractères (sans espaces).
  - q: "Pourquoi les octets diffèrent-ils des caractères ?"
    a: Les octets sont la taille du texte enregistré en UTF-8. Les lettres anglaises prennent 1 octet, les lettres accentuées 2, la plupart des caractères chinois et japonais 3 et les emojis 4. C'est le nombre qui compte pour les limites de taille de fichier ou de champ de base de données.
  - q: "Comment l'outil compte-t-il les phrases ?"
    a: Une phrase se termine à un point, un point d'exclamation, un point d'interrogation ou des points de suspension (…) suivis d'un espace ou de la fin du texte, ou à 。, ！ ou ？ en chinois et en japonais. Un nombre comme 3.14 ou un domaine comme example.com ne termine pas une phrase, mais une abréviation comme « Mr. » le fait ; les textes pleins d'abréviations obtiennent donc un nombre élevé.
  - q: "Qu'est-ce qui compte comme un paragraphe ?"
    a: Un bloc de texte séparé du suivant par au moins une ligne vide ; une ligne contenant seulement des espaces compte comme vide. Lignes compte toutes les lignes, y compris les vides, et un saut de ligne à la toute fin du texte n'ajoute pas de ligne.
---

## Ce que fait ce compteur de mots

L'outil lit votre texte une seule fois et donne sept nombres. Les caractères sont comptés comme des groupes de graphèmes, les unités qu'un lecteur voit comme un seul caractère, avec `Intl.Segmenter` du navigateur selon l'[annexe n° 29 du standard Unicode](https://www.unicode.org/reports/tr29/). Les mots, phrases et paragraphes suivent des règles fixes qui ne dépendent ni du navigateur ni de la langue, si bien que le même texte donne partout les mêmes nombres. Les octets sont mesurés en encodant le texte en UTF-8.

## Options et limites

- **Saisie :** un texte à la fois, de la taille que votre appareil peut contenir. Un texte vide n'est pas compté.
- **Mots :** segments séparés par des espaces et contenant une lettre ou un chiffre. Les caractères chinois et les kana et kanji japonais comptent un mot chacun ; le thaï et les autres écritures sans espaces sont comptés comme des segments séparés par des espaces, leur nombre de mots est donc trop bas.
- **Phrases :** comptées d'après la ponctuation, donc des abréviations comme « Mr. » ou « e.g. » terminent une phrase, et un texte sans ponctuation compte pour une seule phrase.
- **Sauts de ligne :** `\n`, `\r\n` et `\r` commencent chacun une nouvelle ligne.
- **Non inclus :** temps de lecture, temps de parole et densité de mots-clés.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre texte, ne le stocke pas et n'utilise pas de cookies.
