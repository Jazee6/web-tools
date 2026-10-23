---
review: draft
updated: 2026-10-23
title: Compressor de imagens – Comprima JPEG, PNG, WebP e AVIF
description: Reduza imagens JPEG, PNG, WebP e AVIF sem enviá-las. Grátis e privado — a compressão roda no seu navegador com os mesmos codecs do Squoosh.
name: Compressor de imagens
answer: Escolha uma imagem, ajuste a qualidade se quiser e clique em Comprimir imagem — o arquivo é recodificado no seu dispositivo no mesmo formato e depois você baixa a cópia menor.
action: Comprimir imagem
fields:
  file:
    label: Imagem (JPEG, PNG, WebP ou AVIF)
  quality:
    label: Qualidade (1–100)
output:
  file:
    label: Imagem comprimida
errors:
  decode_failed: Não foi possível ler esta imagem. Ela pode estar corrompida ou usar um formato que seu navegador não consegue decodificar.
steps:
  - Escolha uma imagem JPEG, PNG, WebP ou AVIF de até 50 MB.
  - Mantenha a qualidade padrão de 75 ou defina a sua — valores menores geram arquivos menores, com mais artefatos visíveis. O PNG ignora essa opção porque é sempre comprimido sem perdas.
  - Clique em Comprimir imagem e aguarde um pouco; arquivos AVIF grandes podem levar alguns segundos.
  - Confira o novo tamanho e baixe a imagem comprimida.
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: Não. A imagem é decodificada e recodificada dentro do seu navegador com codecs WebAssembly, então nunca sai do seu dispositivo. Depois que a página carrega uma vez, a compressão continua funcionando mesmo sem internet.
  - q: Qual qualidade devo usar?
    a: 75 é um bom padrão para fotos — a diferença é difícil de perceber e o arquivo costuma ficar bem menor. Use 85–90 para imagens com texto pequeno ou bordas nítidas, e 50–65 quando o tamanho importa mais que os detalhes, como em miniaturas.
  - q: Por que meu PNG diminuiu tão pouco?
    a: Aqui a compressão de PNG é sem perdas — cada pixel continua exatamente igual e só a codificação é otimizada. Arquivos já salvos por uma ferramenta de otimização podem diminuir muito pouco. Para fotos, converter para JPEG, WebP ou AVIF economiza muito mais.
  - q: A compressão muda as dimensões ou o formato?
    a: Não. O resultado mantém o formato e as dimensões em pixels originais. Se a recodificação deixasse o arquivo maior, você recebe o original sem alterações.
  - q: Os metadados da foto são mantidos?
    a: Em JPEG, WebP e AVIF, metadados como os dados EXIF da câmera e a localização GPS são removidos, o que também protege sua privacidade. A imagem é girada antes conforme a orientação EXIF, então continua aparecendo na posição certa.
---

## Como a compressão funciona

Arquivos JPEG são recodificados com MozJPEG, WebP com libwebp e AVIF com libaom — os codecs usados pelo Squoosh, do Google, compilados para WebAssembly. Arquivos PNG são otimizados sem perdas com OxiPNG. Tudo roda em uma thread em segundo plano, então a página continua respondendo enquanto uma imagem grande é processada.

## Limites

- **Formatos:** entrada JPEG, PNG, WebP e AVIF; saída no mesmo formato.
- **Tamanho:** até 50 MB por imagem. Imagens muito grandes exigem bastante memória e podem falhar no celular.
- **Uma imagem por vez.** WebP e AVIF animados ficam só com o primeiro quadro.
- **Velocidade:** a codificação AVIF é a mais lenta. Em navegadores que permitem várias threads, ela usa vários núcleos da CPU.

## Privacidade

Sua imagem é processada só no seu dispositivo. A página não a envia, não a armazena e não usa cookies.
