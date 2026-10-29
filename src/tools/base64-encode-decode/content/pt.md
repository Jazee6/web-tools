---
review: reviewed
updated: 2026-10-29
title: Codificar e decodificar Base64 – Converta texto em Base64 online
description: "Codifique texto em Base64 ou decodifique Base64 em texto, com saída segura para URL e UTF-8. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Codificar e decodificar Base64
answer: "Cole seu texto ou sua string Base64, escolha Codificar ou Decodificar e clique em Converter: o resultado aparece no seu navegador, com suporte total a caracteres não ingleses."
action: Converter
fields:
  text:
    label: Texto ou Base64
    placeholder: Hello, 世界!
  mode:
    label: Modo
    options:
      encode: Codificar texto em Base64
      decode: Decodificar Base64 em texto
  urlSafe:
    label: Saída segura para URL (- e _, sem preenchimento)
output:
  result:
    label: Resultado
errors:
  invalid_base64: Isto não é Base64 válido. Remova os caracteres que não sejam letras, dígitos, + / - _ e = (espaços e quebras de linha não são problema), confira se nada foi cortado e tente novamente.
  invalid_utf8: O Base64 é válido, mas os bytes que ele contém não são texto UTF-8. Provavelmente são dados binários, como uma imagem ou um arquivo, que esta ferramenta não consegue mostrar como texto.
steps:
  - Cole ou digite na caixa de entrada o texto que você quer codificar ou a string Base64 que quer decodificar.
  - "Escolha um modo: Codificar texto em Base64 ou Decodificar Base64 em texto."
  - Ao codificar, ative Saída segura para URL (- e _, sem preenchimento) se o resultado for usado em uma URL, um nome de arquivo ou um JWT.
  - Clique em Converter e copie o resultado. Se a decodificação falhar, o erro mostra se o problema está no Base64 ou no texto dentro dele.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. A codificação e a decodificação são processadas inteiramente no seu navegador, então seu texto nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Funciona com emojis e caracteres não ingleses?
    a: Sim. O texto é convertido em bytes UTF-8 antes de ser codificado, e os bytes decodificados são lidos como UTF-8, então caracteres como 世界 ou 😀 sobrevivem à ida e volta.
  - q: O que é Base64 seguro para URL?
    a: O Base64 padrão usa + e /, que têm significado especial em URLs, além de = como preenchimento. A variante segura para URL da RFC 4648 troca esses caracteres por - e _ e remove o preenchimento, para que o resultado possa ser usado em URLs, nomes de arquivo e JWTs sem escape.
  - q: Por que a decodificação diz que os bytes não são texto UTF-8?
    a: O Base64 pode conter quaisquer bytes, não só texto. Se a string vem de uma imagem, de um PDF ou de dados criptografados, os bytes dela não são UTF-8 válido e não podem ser mostrados como texto. Esta ferramenta decodifica apenas texto.
  - q: Base64 é uma forma de criptografia?
    a: Não. Qualquer pessoa decodifica Base64 sem chave, então ele não esconde nada. Ele apenas transforma bytes em caracteres comuns que passam por sistemas feitos para texto, como e-mail, JSON e URLs. Não use Base64 para proteger segredos.
---

## O que esta ferramenta de Base64 faz

Ao codificar, ela converte seu texto em bytes UTF-8 e os escreve com o alfabeto de 64 caracteres definido na [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648), acrescentando o preenchimento =. Ao decodificar, faz o inverso e lê os bytes como texto UTF-8. A decodificação é tolerante: aceita o alfabeto padrão e o seguro para URL, ignora espaços e quebras de linha e funciona mesmo sem o preenchimento.

## Opções e limites

- **Modos:** codificar texto em Base64 ou decodificar Base64 em texto.
- **Saída segura para URL:** vale apenas ao codificar; usa - e _ e omite o preenchimento =. Para decodificar, não é preciso configurar nada.
- **Somente texto:** arquivos e dados binários não são suportados. Se o Base64 for decodificado em bytes que não são UTF-8 válido, ele é rejeitado em vez de aparecer como texto ilegível.
- **Tamanho:** limitado apenas pela memória do seu dispositivo.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu texto e não usa cookies.
