---
review: draft
updated: 2026-10-22
title: Formateur JSON – Formater, valider et minifier du JSON en ligne
description: "Collez du JSON pour l'indenter, le valider, le minifier ou trier ses clés. Gratuit, instantané et privé : vos données sont traitées dans le navigateur, jamais envoyées."
name: Formateur JSON
answer: "Collez votre JSON, choisissez une indentation et cliquez sur Formater le JSON : l'outil le valide et renvoie un JSON bien indenté ou minifié directement dans votre navigateur."
action: Formater le JSON
fields:
  json:
    label: JSON
    placeholder: '{"name": "Ada", "langs": ["en", "fr"]}'
  indent:
    label: Indentation
    options:
      "2": 2 espaces
      "4": 4 espaces
      tab: Tabulations
      minify: Minifier (une ligne)
  sortKeys:
    label: Trier les clés par ordre alphabétique
output:
  formatted:
    label: JSON formaté
errors:
  invalid_json: Ce n'est pas du JSON valide.
steps:
  - Collez ou saisissez votre JSON dans la zone de saisie.
  - "Choisissez une indentation : 2 espaces, 4 espaces, tabulations, ou Minifier pour tout mettre sur une seule ligne."
  - Activez si besoin Trier les clés par ordre alphabétique pour ordonner les clés de chaque objet, à tous les niveaux.
  - Cliquez sur Formater le JSON, puis copiez le résultat. Si le JSON n'est pas valide, l'erreur indique ce que l'analyseur a trouvé et où.
faq:
  - q: Mon JSON est-il envoyé à un serveur ?
    a: "Non. Le formatage se fait entièrement dans votre navigateur avec son analyseur JSON intégré : les données ne quittent jamais votre appareil. Une fois la page chargée, elle fonctionne même hors ligne."
  - q: Quelle est la différence entre formater et minifier ?
    a: Formater ajoute des retours à la ligne et une indentation pour rendre la structure lisible. Minifier supprime tous les espaces facultatifs et produit le JSON valide le plus compact possible, pour le stockage ou le transfert. Dans les deux cas, les données restent strictement identiques.
  - q: Le tri des clés modifie-t-il mes données ?
    a: "Seul l'ordre des clés à l'intérieur des objets change ; les valeurs, l'imbrication et l'ordre des tableaux restent les mêmes. Les objets JSON ne sont pas ordonnés par définition : le résultat trié est donc équivalent, et il devient bien plus facile de comparer deux documents."
  - q: Pourquoi le formateur indique-t-il que mon JSON n'est pas valide ?
    a: Les causes les plus fréquentes sont les virgules finales, les apostrophes au lieu des guillemets doubles, les clés sans guillemets, les commentaires et les valeurs comme NaN ou undefined. Elles sont permises en JavaScript, mais pas en JSON. Le message d'erreur indique ce que l'analyseur a refusé et à quel endroit.
  - q: Les très grands nombres sont-ils conservés exactement ?
    a: "Les nombres sont lus comme des flottants 64 bits standard : les entiers supérieurs à 9 007 199 254 740 991 peuvent donc perdre en précision. Si vous manipulez de grands identifiants, stockez-les sous forme de chaînes."
---

## Ce que fait ce formateur JSON

Il analyse votre saisie avec le même analyseur JSON strict que les navigateurs : tout ce qu'il accepte est du JSON valide au sens de la [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259). Une saisie valide est resérialisée avec l'indentation choisie ; une saisie invalide est refusée avec le message d'erreur de l'analyseur, au lieu d'être « corrigée » en silence.

## Options et limites

- **Indentation :** 2 espaces, 4 espaces, tabulations, ou minifié sur une seule ligne.
- **Tri des clés :** récursif, par ordre alphabétique de point de code ; l'ordre des tableaux ne change jamais.
- **Taille :** limitée uniquement par la mémoire de votre appareil. Des saisies de plusieurs mégaoctets sont formatées en bien moins d'une seconde sur un ordinateur portable courant.
- **Non pris en charge :** les extensions JSON5 ou JSONC comme les commentaires et les virgules finales ; supprimez-les d'abord.

## Confidentialité

Tout se passe sur votre appareil. La page n'envoie votre JSON nulle part, ne le conserve pas et n'utilise pas de cookies.
