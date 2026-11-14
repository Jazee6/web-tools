---
review: reviewed
updated: 2026-11-09
title: "Privacidade – Arquivos, estatísticas e dados do navegador"
description: "Saiba quais funções do Web Tools se conectam a servidores, o que as estatísticas anônimas incluem e como apagar preferências e dados do navegador."
name: "Privacidade"
---

## Seus arquivos ficam no seu dispositivo

As ferramentas de arquivos funcionam no navegador sem enviar seus arquivos ao nosso servidor. O navegador ainda baixa o código e, em algumas ferramentas, os modelos necessários para processá-los.

## Funções que se conectam a servidores

- **Verificador de cabeçalhos HTTP** envia a URL que você informa ao nosso servidor para consultar os cabeçalhos de resposta do destino. A parte após `#` é removida, mas o caminho e os parâmetros de consulta são enviados. Evite URLs com segredos. O Cloudflare Turnstile verifica possíveis abusos e recebe um token de verificação e seu endereço IP. Consulte a [política de privacidade do Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/).
- **Consulta DNS** envia o domínio e o tipo de registro diretamente ao provedor DNS da Cloudflare ou do Google que você escolher, sem passar pelo nosso servidor. A Cloudflare é a opção padrão. O provedor também vê seu endereço IP. Consulte a [política de privacidade da Cloudflare](https://www.cloudflare.com/privacypolicy/) e as [informações de privacidade do Google Public DNS](https://developers.google.com/speed/public-dns/privacy).
- **MCP remoto** envia o nome da ferramenta e seus argumentos ao nosso servidor, onde a ferramenta é executada. Isso também vale para ferramentas que normalmente funcionam no navegador. Não envie informações sensíveis.

## Estatísticas anônimas de uso

Coletamos estatísticas limitadas para entender o uso e os erros das ferramentas, sem um identificador de visitante.

| O que é informado   | O que contém                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Uso das ferramentas | Nome, idioma da interface, categoria do resultado e faixa de duração                                 |
| Erros inesperados   | Tipo e origem do erro, ferramenta se conhecida, idioma e recursos disponíveis no navegador           |
| Não inclui          | Suas entradas, resultados, arquivos, endereço IP, mensagem de erro ou rastreamento detalhado do erro |

Cada uso concluído tem 10% de chance de ser informado; não é uma seleção de 10% dos visitantes. Erros inesperados não passam por amostragem. Erros repetidos são suprimidos, com até 20 erros distintos informados por sessão. Os informes podem se perder e não são reenviados.

## Cloudflare Web Analytics

O Cloudflare Web Analytics mede visitas e desempenho de carregamento sem cookies. A Cloudflare pode adicionar seu script de medição automaticamente, separado das estatísticas acima. Consulte como ela trata os dados na [política de privacidade](https://www.cloudflare.com/privacypolicy/).

## Logs do servidor e endereços IP

Nosso servidor usa seu IP para limitar solicitações e evitar abusos, mas não o inclui nas estatísticas de uso. A Cloudflare trata dados de conexão, incluindo endereços IP, ao servir o site e verificar solicitações.

Os logs do servidor registram a ferramenta, o tempo gasto e o resultado. Erros inesperados do servidor também podem incluir mensagens e rastreamentos detalhados. O tratamento e a retenção desses dados pela Cloudflare são descritos na [política de privacidade](https://www.cloudflare.com/privacypolicy/).

## O que o navegador salva

O navegador lembra favoritos, até 20 ferramentas usadas recentemente e opções de formulário como seleções, interruptores e números. Não salva arquivos ou texto livre como preferências, nem escolhas predefinidas.

Páginas visitadas e seus recursos ficam em cache para uso offline. Os modelos baixados são armazenados separadamente. Informações temporárias também evitam informes de erro repetidos durante uma sessão.

Use **Limpar dados locais** no rodapé para remover preferências, favoritos, ferramentas recentes, caches offline, modelos e arquivos locais temporários, e interromper o serviço offline antes de recarregar. Restrições do navegador podem impedir a remoção de alguns arquivos temporários. Isso não limpa o cache comum da web, cookies, marcadores de erros da sessão ou registros do servidor. Ao recarregar, o armazenamento em cache pode recomeçar.
