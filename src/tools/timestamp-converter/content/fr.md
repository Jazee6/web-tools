---
review: draft
updated: 2026-10-30
title: Convertisseur d'horodatage – Heure Unix en date, et inversement
description: "Convertissez un horodatage Unix en date, ou une date en secondes Unix, dans tout fuseau horaire. Gratuit et privé : tout est traité dans votre navigateur."
name: Convertisseur d'horodatage
answer: "Saisissez un horodatage Unix ou une date, choisissez un fuseau horaire et cliquez sur Convertir : les secondes et millisecondes Unix, l'heure UTC et l'heure de votre fuseau s'affichent dans votre navigateur."
action: Convertir
fields:
  value:
    label: Horodatage ou date
    placeholder: 1700000000 ou 2024-02-29 12:30:00+08:00
  unit:
    label: Unité de l'horodatage
    options:
      auto: Détection automatique
      seconds: Secondes
      milliseconds: Millisecondes
  timezone:
    label: Fuseau horaire
    placeholder: Asia/Shanghai
output:
  seconds:
    label: Heure Unix (secondes)
  milliseconds:
    label: Heure Unix (millisecondes)
  utc:
    label: Heure UTC
  zoned:
    label: Heure dans le fuseau horaire choisi
errors:
  invalid_value: "L'outil ne parvient pas à lire cet horodatage ou cette date. Saisissez des chiffres comme 1700000000, ou une date comme 2024-02-29, 2024-02-29 12:30:00 ou 2024-02-29T12:30:00+08:00. Le mois, le jour, l'heure, les minutes et les secondes doivent être des valeurs réelles (le 2023-02-29 et 24:00 n'existent pas)."
  invalid_timezone: Ce fuseau horaire n'est pas reconnu. Utilisez un nom IANA comme Asia/Shanghai, America/New_York ou Europe/Berlin, ou UTC.
  out_of_range: Cet instant est en dehors de la plage prise en charge, des années 0001 à 9999. Vérifiez le nombre, ou changez l'unité entre secondes et millisecondes.
steps:
  - Saisissez ou collez dans le premier champ un horodatage Unix (par exemple 1700000000) ou une date (par exemple 2024-02-29 12:30:00+08:00).
  - Si la valeur est un nombre, laissez l'Unité de l'horodatage sur Détection automatique, ou choisissez Secondes ou Millisecondes.
  - Saisissez le fuseau horaire dans lequel vous voulez voir le résultat, par exemple Asia/Shanghai. UTC est la valeur par défaut.
  - Cliquez sur Convertir, puis copiez la valeur dont vous avez besoin.
faq:
  - q: "Ce que je saisis est-il envoyé à un serveur ?"
    a: Non. La conversion se fait entièrement dans votre navigateur, donc ce que vous saisissez ne quitte jamais votre appareil. Vous pouvez même utiliser la page hors connexion une fois qu'elle est chargée.
  - q: "Mon horodatage est-il en secondes ou en millisecondes ?"
    a: Un horodatage Unix actuel compte 10 chiffres en secondes (1700000000) et 13 chiffres en millisecondes (1700000000000). La détection automatique lit comme des millisecondes les valeurs de 100 000 000 000 ou plus, et comme des secondes les valeurs plus petites. Les valeurs en millisecondes antérieures au 1973-03-03 ressemblent donc à des secondes ; pour celles-ci, choisissez vous-même Millisecondes.
  - q: "Dans quel fuseau horaire est une date sans décalage ?"
    a: "En UTC. Une date comme 2024-02-29 12:30:00 n'a pas de fuseau, elle est donc lue comme UTC plutôt que déduite de votre appareil. Pour convertir une heure locale, ajoutez son décalage, par exemple 2024-02-29 12:30:00+08:00, ou utilisez Z pour UTC."
  - q: "Que change le champ Fuseau horaire ?"
    a: Seulement le dernier résultat. Les secondes et millisecondes Unix et l'heure UTC restent les mêmes ; le résultat dans le fuseau horaire montre ce même instant sous forme d'heure locale avec le décalage du fuseau à cette date, de sorte que l'heure d'été est appliquée là où le fuseau en a une.
  - q: "Les horodatages négatifs et les fractions sont-ils pris en charge ?"
    a: Oui. Un nombre négatif est un instant antérieur au 1970-01-01 UTC, et 1700000000.5 est une demi-seconde après 1700000000. Le résultat en secondes est arrondi à l'inférieur, jusqu'à une seconde entière.
  - q: "Pourquoi un très grand horodatage échoue-t-il ?"
    a: Les résultats sont limités aux années 0001 à 9999 pour que la sortie ISO 8601 garde des années à quatre chiffres. Une valeur hors de cette plage, comme un horodatage en millisecondes avec Secondes comme unité, est refusée avec une erreur de dépassement de plage.
---

## Ce que fait cet outil d'horodatage

Le temps Unix compte les secondes écoulées depuis le 1970-01-01 00:00:00 UTC, sans compter les secondes intercalaires. L'outil convertit votre saisie en cet instant, puis l'écrit en secondes Unix, en millisecondes Unix, en heure UTC au format [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) et en heure ISO 8601 avec le décalage du fuseau horaire choisi. Les dates sont lues aux formats `YYYY-MM-DD`, `YYYY-MM-DD HH:MM[:SS[.fff]]` ou `YYYY-MM-DDTHH:MM[:SS[.fff]]`, suivis d'un `Z` ou d'un décalage facultatif comme `+08:00`. Les décalages des fuseaux horaires proviennent des données de fuseaux horaires intégrées à votre navigateur, via `Intl.DateTimeFormat`.

## Options et limites

- **Saisie :** un horodatage ou une date à la fois. Les dates sont vérifiées par rapport au calendrier, années bissextiles comprises. Les fractions de seconde au-delà des millisecondes sont ignorées dans les dates et arrondies dans les nombres.
- **Unité :** ne s'applique qu'aux nombres. La détection automatique passe des secondes aux millisecondes à 100 000 000 000.
- **Plage :** instants de 0001-01-01T00:00:00Z à 9999-12-31T23:59:59.999Z.
- **Fuseaux horaires :** noms IANA comme Asia/Shanghai, ou UTC. Les décalages des dates passées suivent les données de fuseaux horaires intégrées à votre navigateur.
- **Pas d'heure actuelle :** l'outil ne lit pas votre horloge et ne compare pas le résultat à l'instant présent.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre saisie, ne la stocke pas et n'utilise pas de cookies.
