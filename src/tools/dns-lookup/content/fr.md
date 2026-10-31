---
review: draft
updated: 2026-10-31
title: "Recherche DNS – Vérifiez les enregistrements A, MX, TXT et autres"
description: "Consultez les enregistrements A, AAAA, CNAME, MX, TXT, NS, SOA et CAA d'un domaine via le DNS de Cloudflare ou de Google. Gratuit, directement depuis votre navigateur."
name: "Recherche DNS"
answer: "Saisissez un domaine, choisissez un type d'enregistrement et cliquez sur Rechercher : les enregistrements, leur TTL et le code de réponse DNS s'affichent dans votre navigateur."
action: "Rechercher"
fields:
  domain:
    label: "Domaine"
    placeholder: "example.com"
  type:
    label: "Type d'enregistrement"
    options:
      A: "A – adresses IPv4"
      AAAA: "AAAA – adresses IPv6"
      CNAME: "CNAME – alias d'un autre nom"
      MX: "MX – serveurs de messagerie"
      TXT: "TXT – enregistrements de texte"
      NS: "NS – serveurs de noms"
      SOA: "SOA – autorité de la zone"
      CAA: "CAA – autorités de certification autorisées"
  resolver:
    label: "Résolveur"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "DNS public de Google (8.8.8.8)"
output:
  status:
    label: "Code de réponse"
  records:
    label: "Enregistrements"
    columns:
      name: "Nom"
      type: "Type"
      ttl: "TTL (secondes)"
      data: "Données"
errors:
  invalid_domain: "Ce n'est pas un nom de domaine valide. Saisissez un nom comme example.com ou www.example.com, ou collez une URL complète. Les noms peuvent contenir des lettres, des chiffres, des tirets et des tirets bas, et chaque partie entre les points peut compter au plus 63 caractères."
  lookup_failed: "Le résolveur n'a pas pu être joint ou n'a pas donné de réponse exploitable. Vérifiez votre connexion puis réessayez, ou passez le Résolveur sur l'autre : certains réseaux en bloquent un."
steps:
  - "Saisissez le domaine dans Domaine, par exemple example.com. Une URL complète convient aussi."
  - "Choisissez le Type d'enregistrement : A pour les adresses IPv4, MX pour les serveurs de messagerie, TXT pour SPF et les enregistrements de vérification, etc."
  - "Choisissez le Résolveur, Cloudflare ou Google, puis cliquez sur Rechercher."
  - "Lisez le Code de réponse et le tableau des enregistrements, avec le TTL de chacun en secondes."
faq:
  - q: "Mon domaine est-il envoyé à un serveur ?"
    a: "Le domaine part de votre navigateur directement vers le résolveur que vous choisissez, Cloudflare ou Google, en HTTPS. Il ne passe pas par nos serveurs et nous ne le stockons pas. Le résolveur voit le domaine et votre adresse IP et les traite selon sa propre politique de confidentialité."
  - q: "Pourquoi utiliser Cloudflare ou Google plutôt que les serveurs de noms du domaine ?"
    a: "Un navigateur ne peut pas envoyer de requêtes DNS ordinaires, seulement des requêtes web. Cloudflare et Google proposent le DNS over HTTPS (DoH), une interface web vers leurs résolveurs publics. Ces résolveurs mettent les réponses en cache : vous voyez donc ce que voit un visiteur ordinaire, ce qui peut retarder sur une modification que vous venez de faire. Les deux peuvent aussi répondre différemment pendant la propagation d'une modification."
  - q: "Que signifient les types d'enregistrement ?"
    a: "A et AAAA donnent les adresses IPv4 et IPv6 du nom. CNAME fait du nom un alias d'un autre nom. MX liste les serveurs de messagerie avec leur priorité. TXT contient du texte libre, comme les valeurs SPF, DKIM et de vérification de site. NS liste les serveurs de noms du domaine. SOA décrit la zone, avec son serveur de noms principal, le contact de l'administrateur et les minuteurs. CAA indique les autorités de certification autorisées à émettre des certificats."
  - q: "Que signifient NOERROR et NXDOMAIN ?"
    a: "NOERROR signifie que la requête a reçu une réponse. Si le tableau est vide, le nom existe mais n'a pas d'enregistrement du type demandé. NXDOMAIN signifie que le nom n'existe pas du tout. SERVFAIL et REFUSED signifient que le résolveur n'a pas pu obtenir de réponse, souvent à cause d'un problème sur les serveurs de noms du domaine."
  - q: "Pourquoi le TTL change-t-il à chaque recherche ?"
    a: "Le résolveur garde chaque réponse pendant le TTL de l'enregistrement et le décompte. Un TTL inférieur à la valeur configurée signifie que la réponse a été mise en cache il y a quelques secondes."
  - q: "Puis-je interroger une adresse IP ou un nom d'hôte interne ?"
    a: "Non. Les recherches inverses d'adresses IP ne sont pas prises en charge, et les résolveurs ne connaissent que le DNS public ; les noms qui n'existent que sur votre réseau privé reviendront donc en NXDOMAIN."
---

## Ce que fait cette recherche DNS

L'outil envoie une requête DNS pour le domaine et le type d'enregistrement au résolveur que vous choisissez, via son API JSON : [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) ou [Google](https://developers.google.com/speed/public-dns/docs/doh/json). La requête est faite par votre propre navigateur ; la réponse est donc celle que ce résolveur vous renvoie. Le tableau montre chaque enregistrement de la réponse, et une chaîne de CNAME liste les CNAME avant les enregistrements finaux. Les valeurs TXT que le résolveur découpe en plusieurs chaînes sont réunies en un seul texte, et le point final des cibles de CNAME, NS et MX est retiré.

## Options et limites

- **Domaine :** un nom de domaine ou une URL, de 2 048 caractères au plus. Le schéma, le chemin et le port sont ignorés, et un nom internationalisé est converti en punycode (bücher.example devient xn--bcher-kva.example).
- **Types d'enregistrement :** A, AAAA, CNAME, MX, TXT, NS, SOA et CAA. Les recherches inverses (PTR) et les enregistrements DNSSEC ne sont pas pris en charge.
- **Résolveurs :** Cloudflare et Google uniquement, sans possibilité de saisir le vôtre. L'outil n'indique pas si la réponse a été validée par DNSSEC.
- **Délai :** une recherche sans réponse en 10 secondes échoue.
- **Connexion :** la recherche nécessite une connexion à Internet et ne fonctionne donc pas hors connexion.

## Confidentialité

Le domaine que vous saisissez est envoyé depuis votre navigateur au résolveur que vous choisissez, Cloudflare ou Google, qui voit le domaine et votre adresse IP. Il n'atteint pas nos serveurs, et la page ne stocke pas votre saisie et n'utilise pas de cookies.
