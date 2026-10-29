---
review: draft
updated: 2026-10-29
title: Gerador de hash – Gere hashes MD5, SHA-1, SHA-256 e SHA-512 online
description: "Gere o hash MD5, SHA-1, SHA-256, SHA-384 ou SHA-512 de qualquer texto em hex ou Base64. Grátis e privado: é processado no seu navegador e nada é enviado."
name: Gerador de hash
answer: "Digite ou cole seu texto, escolha um algoritmo como SHA-256 e um formato de saída, e clique em Gerar hash: o hash aparece no seu navegador."
action: Gerar hash
fields:
  text:
    label: Texto
    placeholder: Texto para calcular o hash
  algorithm:
    label: Algoritmo
    options:
      md5: MD5
      sha-1: SHA-1
      sha-256: SHA-256
      sha-384: SHA-384
      sha-512: SHA-512
  format:
    label: Formato de saída
    options:
      hex: Hex (minúsculas)
      hex-upper: Hex (maiúsculas)
      base64: Base64
output:
  hash:
    label: Hash
errors: {}
steps:
  - Digite ou cole na caixa de entrada o texto cujo hash você quer calcular.
  - Escolha um algoritmo. SHA-256 é o padrão; MD5 e SHA-1 servem apenas para somas de verificação e compatibilidade.
  - "Escolha um formato de saída: Hex (minúsculas), Hex (maiúsculas) ou Base64."
  - Clique em Gerar hash e copie o resultado.
faq:
  - q: Meu texto é enviado para um servidor?
    a: Não. O hash é calculado inteiramente no seu navegador, então seu texto nunca sai do seu dispositivo. Você pode até usar a página offline depois que ela for carregada.
  - q: Qual algoritmo devo usar?
    a: Use SHA-256, a menos que algo exija outro. SHA-384 e SHA-512 geram hashes mais longos da mesma família. MD5 e SHA-1 estão quebrados para fins de segurança porque é possível criar colisões, então reserve-os para somas de verificação e compatibilidade com sistemas antigos.
  - q: Posso usar para gerar hash de senhas?
    a: Não. São hashes rápidos de uso geral, e um hash rápido é fácil de quebrar por força bruta. Para armazenar senhas, use no servidor uma função de hash de senhas lenta e com salt, como Argon2, scrypt ou bcrypt.
  - q: Por que o hash é diferente do que outra ferramenta mostra?
    a: O texto é processado como bytes UTF-8 exatamente como foi digitado, então uma quebra de linha no final, um espaço a mais ou finais de linha diferentes mudam o resultado. Outra ferramenta também pode ler o texto em outra codificação.
  - q: Posso gerar o hash de um arquivo?
    a: Com esta ferramenta não, porque ela processa apenas texto.
---

## O que esta ferramenta de hash faz

Ela converte seu texto em bytes UTF-8 e calcula o resumo desses bytes. SHA-1, SHA-256, SHA-384 e SHA-512 usam a API Web Crypto do seu navegador, que implementa o [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final). O MD5 não faz parte do Web Crypto, então a página inclui a própria implementação da [RFC 1321](https://www.rfc-editor.org/rfc/rfc1321), verificada com os vetores de teste oficiais.

## Opções e limites

- **Algoritmos:** MD5, SHA-1, SHA-256, SHA-384, SHA-512.
- **Formatos de saída:** hex em minúsculas, hex em maiúsculas ou Base64.
- **Somente texto:** arquivos não são suportados, e o texto é processado exatamente como digitado, com espaços e quebras de linha.
- **Não serve para senhas:** os hashes são rápidos por projeto e não usam salt, então não servem para armazenar senhas.
- **Tamanho:** limitado apenas pela memória do seu dispositivo.

## Privacidade

O processamento acontece somente no seu dispositivo. A página não envia nem armazena seu texto e não usa cookies.
