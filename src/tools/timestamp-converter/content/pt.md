---
review: reviewed
updated: 2026-10-30
title: Conversor de timestamp – Converta Unix em data e data em Unix online
description: "Converta um timestamp Unix em uma data legível, ou uma data em segundos Unix, em qualquer fuso horário. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Conversor de timestamp
answer: "Digite um timestamp Unix ou uma data, escolha um fuso horário e clique em Converter: os segundos e milissegundos Unix, o horário UTC e o horário do seu fuso aparecem no seu navegador."
action: Converter
fields:
  value:
    label: Timestamp ou data
    placeholder: 1700000000 ou 2024-02-29 12:30:00+08:00
  unit:
    label: Unidade do timestamp
    options:
      auto: Detectar automaticamente
      seconds: Segundos
      milliseconds: Milissegundos
  timezone:
    label: Fuso horário
    placeholder: Asia/Shanghai
output:
  seconds:
    label: Tempo Unix (segundos)
  milliseconds:
    label: Tempo Unix (milissegundos)
  utc:
    label: Horário UTC
  zoned:
    label: Horário no fuso horário escolhido
errors:
  invalid_value: A ferramenta não consegue ler este timestamp ou esta data. Digite números como 1700000000, ou uma data como 2024-02-29, 2024-02-29 12:30:00 ou 2024-02-29T12:30:00+08:00. Mês, dia, hora, minuto e segundo precisam ser valores reais (não existe 2023-02-29 nem 24:00).
  invalid_timezone: Este fuso horário não foi reconhecido. Use um nome IANA como Asia/Shanghai, America/New_York ou Europe/Berlin, ou UTC.
  out_of_range: Este momento está fora do intervalo aceito, dos anos 0001 a 9999. Confira o número ou troque a unidade entre segundos e milissegundos.
steps:
  - Digite ou cole no primeiro campo um timestamp Unix (por exemplo, 1700000000) ou uma data (por exemplo, 2024-02-29 12:30:00+08:00).
  - Se o valor for um número, deixe a Unidade do timestamp em Detectar automaticamente ou escolha Segundos ou Milissegundos.
  - Digite o fuso horário em que você quer ver o resultado, como Asia/Shanghai. O padrão é UTC.
  - Clique em Converter e copie o valor de que precisa.
faq:
  - q: O que eu digito é enviado para um servidor?
    a: Não. A conversão acontece inteiramente no seu navegador, então o que você digita nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Meu timestamp está em segundos ou em milissegundos?
    a: Um timestamp Unix atual tem 10 dígitos em segundos (1700000000) e 13 dígitos em milissegundos (1700000000000). Detectar automaticamente lê como milissegundos os valores de 100.000.000.000 ou mais, e como segundos os menores. Isso também significa que valores em milissegundos anteriores a 1973-03-03 parecem segundos; para esses, escolha Milissegundos você mesmo.
  - q: Em que fuso horário está uma data sem deslocamento?
    a: Em UTC. Uma data como 2024-02-29 12:30:00 não tem fuso, então é lida como UTC em vez de ser deduzida do seu dispositivo. Para converter um horário local, acrescente o deslocamento, por exemplo 2024-02-29 12:30:00+08:00, ou use Z para UTC.
  - q: O que o campo Fuso horário muda?
    a: Somente o último resultado. Os segundos e milissegundos Unix e o horário UTC continuam iguais; o resultado no fuso horário mostra esse mesmo momento como um horário local com o deslocamento do fuso naquela data, então o horário de verão é aplicado onde o fuso o tem.
  - q: Timestamps negativos e frações são aceitos?
    a: Sim. Um número negativo é um momento anterior a 1970-01-01 UTC, e 1700000000.5 é meio segundo depois de 1700000000. O resultado em segundos é arredondado para baixo, até um segundo inteiro.
  - q: Por que um timestamp muito grande dá erro?
    a: Os resultados ficam limitados aos anos 0001 a 9999 para que a saída ISO 8601 mantenha anos de quatro dígitos. Um valor fora desse intervalo, como um timestamp em milissegundos com Segundos como unidade, é recusado com um erro de fora do intervalo.
---

## O que esta ferramenta de timestamp faz

O tempo Unix conta os segundos desde 1970-01-01 00:00:00 UTC, sem contar os segundos intercalares. A ferramenta converte sua entrada para esse momento e o escreve como segundos Unix, milissegundos Unix, um horário UTC em [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) e um horário ISO 8601 com o deslocamento do fuso horário escolhido. As datas são lidas nos formatos `YYYY-MM-DD`, `YYYY-MM-DD HH:MM[:SS[.fff]]` ou `YYYY-MM-DDTHH:MM[:SS[.fff]]`, seguidos de um `Z` ou de um deslocamento opcional como `+08:00`. Os deslocamentos dos fusos horários vêm dos dados de fusos horários embutidos no seu navegador, por meio de `Intl.DateTimeFormat`.

## Opções e limites

- **Entrada:** um timestamp ou uma data por vez. As datas são conferidas com o calendário, inclusive anos bissextos. Frações de segundo além dos milissegundos são descartadas nas datas e arredondadas nos números.
- **Unidade:** vale apenas para números. Detectar automaticamente passa de segundos para milissegundos em 100.000.000.000.
- **Intervalo:** momentos de 0001-01-01T00:00:00Z a 9999-12-31T23:59:59.999Z.
- **Fusos horários:** nomes IANA como Asia/Shanghai, ou UTC. Os deslocamentos de datas passadas seguem os dados de fusos horários embutidos no seu navegador.
- **Sem horário atual:** a ferramenta não lê o seu relógio nem compara o resultado com o momento presente.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena sua entrada e não usa cookies.
