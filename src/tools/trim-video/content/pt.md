---
review: draft
updated: 2026-11-03
title: Cortar vídeo – Corte clipes MP4, MOV, WebM e MKV online grátis
description: Corte um vídeo entre um início e um fim, grátis, em MP4, MOV, WebM ou MKV. Privado e rápido — o corte é processado no seu navegador, então seu vídeo nunca é enviado.
name: Cortar vídeo
answer: Escolha um vídeo, informe um tempo de início e de fim, como 1:30 e 2:45, e clique em Cortar vídeo — o trecho é cortado no seu dispositivo, no mesmo formato, e você baixa o resultado.
action: Cortar vídeo
fields:
  file:
    label: Vídeo (MP4, MOV, WebM ou MKV)
  start:
    label: Tempo de início
    placeholder: 0:00
  end:
    label: Tempo de fim
    placeholder: Fim do vídeo
  mode:
    label: Método de corte
    options:
      precise: Preciso (recodifica quando necessário)
      fast: Rápido (pode reter partes cortadas)
output:
  file:
    label: Vídeo cortado
errors:
  invalid_video: Não foi possível ler este arquivo como vídeo. Ele pode estar danificado ou usar um formato que esta ferramenta não suporta. Exporte-o novamente como MP4 e tente de novo.
  no_video: Este arquivo não tem faixa de vídeo, só contém áudio. Escolha um arquivo de vídeo.
  unsupported_codec: "Este navegador não consegue decodificar ou codificar uma das faixas deste vídeo. Tente o método Rápido ou a versão mais recente do Chrome. Codec:"
  invalid_time: "Informe um tempo em segundos (90.5), minutos:segundos (1:30) ou horas:minutos:segundos (1:02:03). Não foi possível ler este valor:"
  range_required: Informe um tempo de início, um tempo de fim ou os dois.
  end_before_start: O tempo de fim deve ser posterior ao tempo de início.
  start_past_end: "O tempo de início é posterior ao fim do vídeo. Duração deste vídeo:"
steps:
  - Escolha um vídeo MP4, MOV, WebM ou MKV de até 500 MB.
  - Informe o tempo de início, o tempo de fim ou os dois, em segundos (90.5), minutos:segundos (1:30) ou horas:minutos:segundos (1:02:03). Deixe um vazio para manter o vídeo desde o começo ou até o fim.
  - Escolha um método de corte. Preciso corta nos tempos exatos, e Rápido mantém a qualidade original. Se o conteúdo que você está removendo for sensível, use Preciso, porque um trecho Rápido ainda pode conter parte dele.
  - Clique em Cortar vídeo. Uma barra de progresso mostra o andamento, e você pode cancelar a qualquer momento.
  - Baixe o vídeo cortado.
faq:
  - q: Meu vídeo é enviado para um servidor?
    a: Não. O vídeo é lido e cortado dentro do seu navegador, então nunca sai do seu dispositivo.
  - q: Qual é a diferença entre Preciso e Rápido?
    a: Preciso começa e termina exatamente nos tempos informados, mas em geral precisa recodificar o vídeo. Rápido copia o vídeo como está, então termina bem mais cedo e mantém a qualidade original, mas só consegue começar o corte em um quadro-chave.
  - q: Por que meu trecho Rápido começa antes do que pedi?
    a: Um vídeo só pode ser copiado a partir de um quadro-chave, então um trecho WebM ou MKV começa no último quadro-chave antes do seu tempo de início. Em MP4 e MOV, esses quadros extras ficam no arquivo, mas são ocultados por uma lista de edição, então um player que suporta listas de edição começa no seu tempo. Um trecho Rápido também pode passar alguns quadros do tempo de fim.
  - q: O conteúdo que cortei foi mesmo removido?
    a: Com Preciso, sim — nada fora dos seus tempos fica no arquivo. Com Rápido, nem sempre. Os quadros entre o último quadro-chave e seu tempo de início ficam no arquivo, assim como alguns quadros depois do tempo de fim. Em MP4 e MOV eles ficam ocultos apenas durante a reprodução. Alguns navegadores mostram um deles como imagem de pré-visualização antes de você dar o play, e qualquer pessoa com um editor de vídeo poderia recuperá-los. Para remover conteúdo sensível antes de compartilhar um vídeo, use Preciso.
  - q: Cortar reduz a qualidade?
    a: Não com Rápido, porque nada é recodificado. Preciso recodifica com uma configuração de qualidade alta, então a diferença costuma ser difícil de notar, mas recodificar nunca é totalmente sem perdas. Preciso também copia sem recodificar quando seu tempo de início está em um quadro-chave e você não corta o fim.
  - q: O que acontece se o tempo de fim passar do fim do vídeo?
    a: O trecho simplesmente vai até o fim do vídeo.
  - q: Posso mudar o formato ao cortar?
    a: Não. O trecho continua no mesmo formato do original. Para mudá-lo depois, use o [Conversor de vídeo](/pt/video-converter). Para ficar só com o som, em MP3 por exemplo, use [Extrair áudio](/pt/extract-audio).
---

## Como o corte funciona

A ferramenta lê o vídeo com o Mediabunny, uma biblioteca de mídia de código aberto. Com Rápido, ela copia os dados de vídeo e áudio existentes da parte escolhida. Com Preciso, ela decodifica essa parte e a codifica de novo com a API WebCodecs integrada ao seu navegador, muitas vezes com aceleração por hardware. O trabalho roda em uma thread em segundo plano, então a página continua respondendo.

## Opções e limites

- **Entrada:** arquivos MP4, MOV, WebM e MKV de até 500 MB. O trecho mantém o mesmo formato.
- **Conteúdo cortado:** um trecho Rápido pode manter quadros logo fora dos seus tempos, mesmo que um player não os mostre. Preciso não deixa nenhum.
- **Faixas:** a faixa de vídeo principal e a faixa de áudio principal são mantidas; legendas e faixas de áudio extras são descartadas.
- **Codecs:** com Preciso, os codecs que podem ser decodificados e codificados dependem do seu navegador e dispositivo. O Firefox, por exemplo, não tem codificador AAC, então lá MP4 e MOV usam áudio Opus. Se uma faixa não puder ser processada, a ferramenta para com uma mensagem em vez de criar um arquivo sem som ou sem imagem.
- **Memória:** o vídeo cortado fica na memória até você baixá-lo, então arquivos muito grandes podem falhar em celulares.

## Privacidade

Seu vídeo é processado apenas no seu dispositivo. A página não o envia, não o armazena e não usa cookies.
