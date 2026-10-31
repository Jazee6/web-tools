---
review: draft
updated: 2026-10-31
title: "Convertisseur d'unités – Longueur, poids, température, volume"
description: "Convertissez longueur, masse, température, volume, surface, vitesse, temps et taille de données entre unités métriques et impériales. Gratuit et privé."
name: "Convertisseur d'unités"
answer: "Saisissez un nombre, choisissez l'unité de départ et celle d'arrivée et cliquez sur Convertir : les unités de longueur, masse, température, volume, surface, vitesse, temps et données sont converties dans votre navigateur."
action: "Convertir"
fields:
  value:
    label: "Valeur"
    placeholder: "5"
  from:
    label: "De"
    options:
      mm: "Longueur – millimètre (mm)"
      cm: "Longueur – centimètre (cm)"
      m: "Longueur – mètre (m)"
      km: "Longueur – kilomètre (km)"
      in: "Longueur – pouce (in)"
      ft: "Longueur – pied (ft)"
      yd: "Longueur – yard (yd)"
      mi: "Longueur – mille (mi)"
      g: "Masse – gramme (g)"
      kg: "Masse – kilogramme (kg)"
      t: "Masse – tonne (t)"
      oz: "Masse – once (oz)"
      lb: "Masse – pound (lb)"
      celsius: "Température – Celsius (°C)"
      fahrenheit: "Température – Fahrenheit (°F)"
      kelvin: "Température – Kelvin (K)"
      ml: "Volume – millilitre (mL)"
      l: "Volume – litre (L)"
      floz: "Volume – once liquide US (fl oz)"
      cup: "Volume – tasse US (cup)"
      gal: "Volume – gallon US (gal)"
      m2: "Surface – mètre carré (m²)"
      km2: "Surface – kilomètre carré (km²)"
      ha: "Surface – hectare (ha)"
      ft2: "Surface – pied carré (ft²)"
      ac: "Surface – acre (ac)"
      mi2: "Surface – mille carré (mi²)"
      mps: "Vitesse – mètre par seconde (m/s)"
      kmh: "Vitesse – kilomètre par heure (km/h)"
      mph: "Vitesse – mille par heure (mph)"
      kn: "Vitesse – nœud (kn)"
      ms: "Temps – milliseconde (ms)"
      s: "Temps – seconde (s)"
      min: "Temps – minute (min)"
      h: "Temps – heure (h)"
      d: "Temps – jour (d)"
      wk: "Temps – semaine (wk)"
      B: "Données – B"
      KB: "Données – KB"
      MB: "Données – MB"
      GB: "Données – GB"
      TB: "Données – TB"
      KiB: "Données – KiB"
      MiB: "Données – MiB"
      GiB: "Données – GiB"
  to:
    label: "Vers"
    options:
      mm: "Longueur – millimètre (mm)"
      cm: "Longueur – centimètre (cm)"
      m: "Longueur – mètre (m)"
      km: "Longueur – kilomètre (km)"
      in: "Longueur – pouce (in)"
      ft: "Longueur – pied (ft)"
      yd: "Longueur – yard (yd)"
      mi: "Longueur – mille (mi)"
      g: "Masse – gramme (g)"
      kg: "Masse – kilogramme (kg)"
      t: "Masse – tonne (t)"
      oz: "Masse – once (oz)"
      lb: "Masse – pound (lb)"
      celsius: "Température – Celsius (°C)"
      fahrenheit: "Température – Fahrenheit (°F)"
      kelvin: "Température – Kelvin (K)"
      ml: "Volume – millilitre (mL)"
      l: "Volume – litre (L)"
      floz: "Volume – once liquide US (fl oz)"
      cup: "Volume – tasse US (cup)"
      gal: "Volume – gallon US (gal)"
      m2: "Surface – mètre carré (m²)"
      km2: "Surface – kilomètre carré (km²)"
      ha: "Surface – hectare (ha)"
      ft2: "Surface – pied carré (ft²)"
      ac: "Surface – acre (ac)"
      mi2: "Surface – mille carré (mi²)"
      mps: "Vitesse – mètre par seconde (m/s)"
      kmh: "Vitesse – kilomètre par heure (km/h)"
      mph: "Vitesse – mille par heure (mph)"
      kn: "Vitesse – nœud (kn)"
      ms: "Temps – milliseconde (ms)"
      s: "Temps – seconde (s)"
      min: "Temps – minute (min)"
      h: "Temps – heure (h)"
      d: "Temps – jour (d)"
      wk: "Temps – semaine (wk)"
      B: "Données – B"
      KB: "Données – KB"
      MB: "Données – MB"
      GB: "Données – GB"
      TB: "Données – TB"
      KiB: "Données – KiB"
      MiB: "Données – MiB"
      GiB: "Données – GiB"
output:
  result:
    label: "Résultat"
  summary:
    label: "Conversion"
errors:
  incompatible_units: "Ces deux unités ne mesurent pas la même chose. Choisissez pour De et Vers des unités du même groupe : chaque option commence par son groupe, comme Longueur ou Température."
  below_absolute_zero: "Cette température est inférieure au zéro absolu (0 K, −273,15 °C, −459,67 °F) et ne peut pas exister. Vérifiez la valeur et l'unité."
steps:
  - "Saisissez le nombre dans Valeur."
  - "Choisissez dans De l'unité que vous avez et dans Vers celle que vous voulez. Les deux doivent appartenir au même groupe, comme Longueur ou Température."
  - "Cliquez sur Convertir, puis copiez le Résultat ou la phrase de Conversion."
faq:
  - q: "Ma saisie est-elle envoyée à un serveur ?"
    a: "Non. La conversion se fait entièrement dans votre navigateur, donc ce que vous saisissez ne quitte jamais votre appareil. Une fois la page chargée, vous pouvez même l'utiliser hors connexion."
  - q: "Quelles unités peut-on convertir ?"
    a: "Longueur (mm, cm, m, km, in, ft, yd, mi), masse (g, kg, tonne, oz, lb), température (Celsius, Fahrenheit, Kelvin), volume (mL, L, fl oz, cup, gal), surface (m², km², ha, ft², ac, mi²), vitesse (m/s, km/h, mph, kn), temps (ms, s, min, h, d, wk) et taille de données (B, KB, MB, GB, TB, KiB, MiB, GiB). On ne peut convertir qu'à l'intérieur d'un même groupe."
  - q: "Les gallons et les onces sont-ils américains ou impériaux ?"
    a: "Américains. Une once liquide fait 29,5735 mL, une tasse 236,588 mL et un gallon 3,785 L ; le gallon impérial (4,546 L) n'est pas inclus. L'once et le pound de masse sont les unités avoirdupois internationales : 1 lb vaut exactement 0,45359237 kg, et le mille est le mille international de 1 609,344 m. La livre française (500 g) n'est donc pas concernée."
  - q: "Quelle différence y a-t-il entre KB et KiB ?"
    a: "KB, MB, GB et TB sont des unités décimales : 1 KB vaut 1 000 octets. KiB, MiB et GiB sont des unités binaires : 1 KiB vaut 1 024 octets. Les fabricants de stockage comptent en général en décimal, alors que les systèmes d'exploitation affichent souvent des tailles binaires ; c'est pourquoi un disque de « 1 To » apparaît comme environ 931 GiB."
  - q: "Quelle est la précision du résultat ?"
    a: "Le résultat a jusqu'à 10 chiffres significatifs, sans zéros de fin ; 1 m en milles fait donc 0,0006213711922. Les nombres très grands ou très petits peuvent apparaître en notation exponentielle, comme 1e-7 pour 0,0000001."
  - q: "Comment la température est-elle convertie ?"
    a: "Par l'intermédiaire du kelvin : les degrés Celsius valent le kelvin moins 273,15, et les Fahrenheit (kelvin − 273,15) × 9/5 + 32. Une température inférieure au zéro absolu (0 K) est refusée avec une erreur."
---

## Ce que fait ce convertisseur d'unités

L'outil multiplie votre valeur par la taille de l'unité de départ et divise par la taille de l'unité d'arrivée, toutes deux mesurées par rapport à une unité de base (mètre, kilogramme, litre, mètre carré, mètre par seconde, seconde ou octet). Les tailles viennent des définitions internationales ; par exemple, 1 pouce = 25,4 mm et 1 lb = 0,45359237 kg. La température est convertie par l'intermédiaire du kelvin, car Celsius et Fahrenheit ne commencent pas à zéro.

## Options et limites

- **Valeur :** tout nombre, y compris négatif ou décimal. Les températures inférieures au zéro absolu sont refusées.
- **Groupes :** longueur, masse, température, volume, surface, vitesse, temps et taille de données. Les deux unités doivent appartenir au même groupe.
- **Volume :** unités américaines uniquement.
- **Précision :** jusqu'à 10 chiffres significatifs ; le résultat peut donc différer d'une fraction exacte au dernier chiffre.
- **Non inclus :** les devises, dont les taux changent chaque jour, ainsi que la consommation de carburant, la pression, l'énergie et d'autres groupes.

## Confidentialité

Le traitement se fait uniquement sur votre appareil. La page n'envoie pas votre saisie, ne la stocke pas et n'utilise pas de cookies.
