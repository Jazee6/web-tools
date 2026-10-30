---
review: reviewed
updated: 2026-10-30
title: Conversor de imagens – Converta HEIC, JPEG, PNG, WebP e AVIF online
description: "Converta fotos HEIC do iPhone, ou imagens JPEG, PNG, WebP e AVIF, em JPEG, PNG, WebP ou AVIF. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Conversor de imagens
answer: "Escolha uma imagem, selecione o formato de saída e clique em Converter imagem: o arquivo HEIC, JPEG, PNG, WebP ou AVIF é recodificado no seu dispositivo e você baixa a cópia convertida."
action: Converter imagem
fields:
  file:
    label: Imagem (HEIC, JPEG, PNG, WebP ou AVIF)
  format:
    label: Converter para
    options:
      jpeg: JPEG (abre em qualquer lugar)
      png: PNG (sem perdas, mantém a transparência)
      webp: WebP (pequeno, navegadores modernos)
      avif: AVIF (o menor, mais lento)
  quality:
    label: Qualidade (1–100)
output:
  file:
    label: Imagem convertida
errors:
  decode_failed: Não foi possível ler esta imagem. Ela pode estar danificada, usar uma variante de HEIC que o decodificador não suporta ou ter um formato que seu navegador não consegue decodificar. Tente outra cópia da imagem ou abra a página na versão mais recente do Chrome, Firefox ou Safari.
steps:
  - Escolha uma imagem HEIC, JPEG, PNG, WebP ou AVIF de até 50 MB.
  - Escolha o formato de saída. JPEG abre em quase todo lugar; PNG é sem perdas e mantém a transparência; WebP e AVIF geram arquivos menores.
  - Mantenha a qualidade padrão de 85 ou defina a sua. Valores menores geram arquivos menores, com artefatos mais visíveis. O PNG ignora essa configuração.
  - Clique em Converter imagem e baixe o arquivo convertido. Imagens grandes, e principalmente a saída em AVIF, podem levar vários segundos.
faq:
  - q: Minhas imagens são enviadas para um servidor?
    a: Não. A imagem é decodificada e recodificada dentro do seu navegador com WebAssembly, então nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Como converto uma foto HEIC do iPhone em JPG?
    a: Escolha o arquivo .heic, mantenha JPEG selecionado e clique em Converter imagem. A própria página decodifica os arquivos HEIC, então funciona em navegadores que não abrem HEIC, como Chrome e Firefox. A primeira conversão de HEIC baixa um decodificador de cerca de 2 MB.
  - q: Posso converter para HEIC?
    a: Não. Os navegadores não têm um codificador de HEIC, por isso o HEIC só pode ser usado como entrada. Os formatos de saída são JPEG, PNG, WebP e AVIF.
  - q: Qual formato de saída devo escolher?
    a: JPEG é a escolha mais segura para compartilhar e imprimir. PNG é o melhor para capturas de tela, logotipos e qualquer imagem com transparência. WebP e AVIF geram arquivos menores para sites, mas alguns aplicativos antigos não conseguem abri-los.
  - q: O que acontece com as áreas transparentes?
    a: PNG, WebP e AVIF mantêm a transparência. O JPEG não tem transparência, então os pixels transparentes são preenchidos com branco.
  - q: Os metadados da foto são mantidos?
    a: Não. Metadados como os dados EXIF da câmera e a localização GPS não são copiados para o arquivo convertido, o que também protege sua privacidade. Os perfis de cor incorporados também não são mantidos, então fotos de gama ampla, como as imagens Display P3 do iPhone, podem parecer um pouco menos saturadas.
---

## Como a conversão funciona

Os arquivos HEIC e HEIF são decodificados com a [libheif](https://github.com/strukturag/libheif), compilada para WebAssembly e carregada somente quando você escolhe um arquivo desse tipo. Os arquivos JPEG, PNG, WebP e AVIF são decodificados pelo seu navegador. Depois, os pixels são recodificados com MozJPEG, libwebp ou libaom (os codecs usados pelo Squoosh, do Google) ou, no caso do PNG, com o codificador PNG do navegador seguido de uma otimização sem perdas com OxiPNG. Tudo isso roda em uma thread em segundo plano, então a página continua responsiva.

## Opções e limites

- **Formatos de entrada:** HEIC, HEIF, JPEG, PNG, WebP e AVIF. Outros formatos, como GIF, SVG ou BMP, não são aceitos.
- **Formatos de saída:** JPEG, PNG, WebP ou AVIF. A saída tem as mesmas dimensões em pixels da entrada.
- **Tamanho:** até 50 MB por imagem. Imagens muito grandes exigem muita memória e podem falhar no celular.
- **Quantidade:** uma imagem por vez.
- **Animação e várias imagens:** apenas a primeira imagem ou o primeiro quadro é convertido, então arquivos WebP e AVIF animados, e arquivos HEIC com várias imagens, resultam em uma única imagem estática.
- **Qualidade:** vale para JPEG, WebP e AVIF; a saída em PNG é sempre sem perdas.
- **Navegadores:** o HEIC funciona em todos os navegadores compatíveis. Nos demais formatos de entrada, seu navegador decodifica a imagem primeiro, então um formato que ele não consegue exibir, como AVIF em um navegador antigo, é rejeitado.

## Privacidade

Sua imagem é processada somente no seu dispositivo. A página não a envia nem a armazena e não usa cookies.
