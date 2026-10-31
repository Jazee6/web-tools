---
review: draft
updated: 2026-10-31
title: "Conversor de unidades – Longitud, peso, temperatura y volumen"
description: "Convierte longitud, masa, temperatura, volumen, área, velocidad, tiempo y tamaño de datos entre unidades métricas e imperiales. Gratis y privado, en tu navegador."
name: "Conversor de unidades"
answer: "Escribe un número, elige la unidad de origen y la de destino y pulsa Convertir; las unidades de longitud, masa, temperatura, volumen, área, velocidad, tiempo y datos se convierten en tu navegador."
action: "Convertir"
fields:
  value:
    label: "Valor"
    placeholder: "5"
  from:
    label: "De"
    options:
      mm: "Longitud – milímetro (mm)"
      cm: "Longitud – centímetro (cm)"
      m: "Longitud – metro (m)"
      km: "Longitud – kilómetro (km)"
      in: "Longitud – pulgada (in)"
      ft: "Longitud – pie (ft)"
      yd: "Longitud – yarda (yd)"
      mi: "Longitud – milla (mi)"
      g: "Masa – gramo (g)"
      kg: "Masa – kilogramo (kg)"
      t: "Masa – tonelada métrica (t)"
      oz: "Masa – onza (oz)"
      lb: "Masa – libra (lb)"
      celsius: "Temperatura – Celsius (°C)"
      fahrenheit: "Temperatura – Fahrenheit (°F)"
      kelvin: "Temperatura – Kelvin (K)"
      ml: "Volumen – mililitro (mL)"
      l: "Volumen – litro (L)"
      floz: "Volumen – onza líquida (EE. UU.) (fl oz)"
      cup: "Volumen – taza (EE. UU.) (cup)"
      gal: "Volumen – galón (EE. UU.) (gal)"
      m2: "Área – metro cuadrado (m²)"
      km2: "Área – kilómetro cuadrado (km²)"
      ha: "Área – hectárea (ha)"
      ft2: "Área – pie cuadrado (ft²)"
      ac: "Área – acre (ac)"
      mi2: "Área – milla cuadrada (mi²)"
      mps: "Velocidad – metro por segundo (m/s)"
      kmh: "Velocidad – kilómetro por hora (km/h)"
      mph: "Velocidad – milla por hora (mph)"
      kn: "Velocidad – nudo (kn)"
      ms: "Tiempo – milisegundo (ms)"
      s: "Tiempo – segundo (s)"
      min: "Tiempo – minuto (min)"
      h: "Tiempo – hora (h)"
      d: "Tiempo – día (d)"
      wk: "Tiempo – semana (wk)"
      B: "Datos – B"
      KB: "Datos – KB"
      MB: "Datos – MB"
      GB: "Datos – GB"
      TB: "Datos – TB"
      KiB: "Datos – KiB"
      MiB: "Datos – MiB"
      GiB: "Datos – GiB"
  to:
    label: "A"
    options:
      mm: "Longitud – milímetro (mm)"
      cm: "Longitud – centímetro (cm)"
      m: "Longitud – metro (m)"
      km: "Longitud – kilómetro (km)"
      in: "Longitud – pulgada (in)"
      ft: "Longitud – pie (ft)"
      yd: "Longitud – yarda (yd)"
      mi: "Longitud – milla (mi)"
      g: "Masa – gramo (g)"
      kg: "Masa – kilogramo (kg)"
      t: "Masa – tonelada métrica (t)"
      oz: "Masa – onza (oz)"
      lb: "Masa – libra (lb)"
      celsius: "Temperatura – Celsius (°C)"
      fahrenheit: "Temperatura – Fahrenheit (°F)"
      kelvin: "Temperatura – Kelvin (K)"
      ml: "Volumen – mililitro (mL)"
      l: "Volumen – litro (L)"
      floz: "Volumen – onza líquida (EE. UU.) (fl oz)"
      cup: "Volumen – taza (EE. UU.) (cup)"
      gal: "Volumen – galón (EE. UU.) (gal)"
      m2: "Área – metro cuadrado (m²)"
      km2: "Área – kilómetro cuadrado (km²)"
      ha: "Área – hectárea (ha)"
      ft2: "Área – pie cuadrado (ft²)"
      ac: "Área – acre (ac)"
      mi2: "Área – milla cuadrada (mi²)"
      mps: "Velocidad – metro por segundo (m/s)"
      kmh: "Velocidad – kilómetro por hora (km/h)"
      mph: "Velocidad – milla por hora (mph)"
      kn: "Velocidad – nudo (kn)"
      ms: "Tiempo – milisegundo (ms)"
      s: "Tiempo – segundo (s)"
      min: "Tiempo – minuto (min)"
      h: "Tiempo – hora (h)"
      d: "Tiempo – día (d)"
      wk: "Tiempo – semana (wk)"
      B: "Datos – B"
      KB: "Datos – KB"
      MB: "Datos – MB"
      GB: "Datos – GB"
      TB: "Datos – TB"
      KiB: "Datos – KiB"
      MiB: "Datos – MiB"
      GiB: "Datos – GiB"
output:
  result:
    label: "Resultado"
  summary:
    label: "Conversión"
errors:
  incompatible_units: "Estas dos unidades miden cosas distintas. Elige una unidad en De y otra en A del mismo grupo; cada opción empieza por su grupo, como Longitud o Temperatura."
  below_absolute_zero: "Esta temperatura está por debajo del cero absoluto (0 K, −273,15 °C, −459,67 °F), así que no puede existir. Revisa el valor y la unidad."
steps:
  - "Escribe el número en Valor."
  - "Elige en De la unidad que tienes y en A la que quieres. Las dos deben ser del mismo grupo, como Longitud o Temperatura."
  - "Pulsa Convertir y copia el Resultado o la frase de Conversión."
faq:
  - q: "¿Se sube lo que escribo a un servidor?"
    a: "No. La conversión se hace por completo en tu navegador, así que lo que escribes no sale de tu dispositivo. Una vez cargada la página, incluso puedes usarla sin conexión."
  - q: "¿Qué unidades se pueden convertir?"
    a: "Longitud (mm, cm, m, km, in, ft, yd, mi), masa (g, kg, tonelada métrica, oz, lb), temperatura (Celsius, Fahrenheit, Kelvin), volumen (mL, L, fl oz, cup, gal), área (m², km², ha, ft², ac, mi²), velocidad (m/s, km/h, mph, kn), tiempo (ms, s, min, h, d, wk) y tamaño de datos (B, KB, MB, GB, TB, KiB, MiB, GiB). Solo se puede convertir dentro de un mismo grupo."
  - q: "¿Los galones y las onzas son estadounidenses o imperiales?"
    a: "Son del sistema estadounidense. Una onza líquida son 29,5735 mL, una taza 236,588 mL y un galón 3,785 L; el galón imperial (4,546 L) no está incluido. La onza y la libra de masa son las unidades avoirdupois internacionales: 1 lb son exactamente 0,45359237 kg, y la milla es la milla internacional de 1.609,344 m."
  - q: "¿Qué diferencia hay entre KB y KiB?"
    a: 'KB, MB, GB y TB son unidades decimales: 1 KB son 1.000 bytes. KiB, MiB y GiB son unidades binarias: 1 KiB son 1.024 bytes. Los fabricantes de almacenamiento suelen contar en decimal y los sistemas operativos suelen mostrar tamaños binarios, por eso un disco de "1 TB" aparece como unos 931 GiB.'
  - q: "¿Qué precisión tiene el resultado?"
    a: "El resultado tiene hasta 10 cifras significativas, sin ceros finales, así que 1 m en millas es 0,0006213711922. Los números muy grandes o muy pequeños pueden aparecer en forma exponencial, como 1e-7 para 0,0000001."
  - q: "¿Cómo se convierte la temperatura?"
    a: "A través de Kelvin: los grados Celsius son Kelvin menos 273,15, y los Fahrenheit son (Kelvin − 273,15) × 9/5 + 32. Una temperatura por debajo del cero absoluto (0 K) se rechaza con un error."
---

## Qué hace este conversor de unidades

La herramienta multiplica tu valor por el tamaño de la unidad de origen y divide por el tamaño de la unidad de destino, ambos medidos respecto a una unidad base (metro, kilogramo, litro, metro cuadrado, metro por segundo, segundo o byte). Los tamaños salen de las definiciones internacionales; por ejemplo, 1 pulgada = 25,4 mm y 1 lb = 0,45359237 kg. La temperatura se convierte a través de Kelvin porque Celsius y Fahrenheit no empiezan en cero.

## Opciones y límites

- **Valor:** cualquier número, también negativo o con decimales. Las temperaturas por debajo del cero absoluto se rechazan.
- **Grupos:** longitud, masa, temperatura, volumen, área, velocidad, tiempo y tamaño de datos. Las dos unidades deben ser del mismo grupo.
- **Volumen:** solo unidades del sistema estadounidense.
- **Precisión:** hasta 10 cifras significativas, así que el resultado puede diferir de una fracción exacta en la última cifra.
- **No incluye:** divisas, cuyos tipos cambian cada día, ni consumo de combustible, presión, energía u otros grupos.

## Privacidad

El procesamiento se hace únicamente en tu dispositivo. La página no sube ni guarda lo que escribes y no usa cookies.
