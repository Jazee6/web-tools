---
review: draft
updated: 2026-10-22
title: Vérificateur d'en-têtes HTTP – En-têtes de réponse et redirections
description: Consultez le code d'état HTTP, les en-têtes de réponse et toute la chaîne de redirections d'une URL publique. Gratuit, instantané et sans inscription.
name: Vérificateur d'en-têtes HTTP
answer: Saisissez une URL et cliquez sur Vérifier les en-têtes — l'outil l'interroge depuis notre serveur et affiche le code d'état final, tous les en-têtes de réponse et chaque redirection en chemin.
action: Vérifier les en-têtes
fields:
  url:
    label: URL
    placeholder: example.com
  followRedirects:
    label: Suivre les redirections
output:
  status:
    label: Code d'état
  url:
    label: URL finale
  headers:
    label: En-têtes de réponse
    columns:
      name: En-tête
      value: Valeur
  redirects:
    label: Chaîne de redirections
    columns:
      status: État
      url: URL
errors:
  invalid_url: Saisissez une adresse http:// ou https:// valide.
  blocked_url: Cette adresse ne peut pas être vérifiée. Les adresses privées ou locales et les ports non standard ne sont pas autorisés.
  timeout: Le serveur a mis trop de temps à répondre.
  fetch_failed: Impossible de joindre le serveur.
  too_many_redirects: L'URL a redirigé plus de 5 fois.
steps:
  - Saisissez l'adresse à inspecter. Sans schéma, https:// est utilisé.
  - Laissez Suivre les redirections activé pour tracer chaque étape jusqu'à la page finale, ou désactivez-le pour ne voir que la première réponse.
  - Cliquez sur Vérifier les en-têtes et consultez le code d'état, l'URL finale, les en-têtes et la chaîne de redirections.
faq:
  - q: Pourquoi la vérification se fait-elle sur un serveur et non dans mon navigateur ?
    a: Pour des raisons de sécurité, les navigateurs masquent aux scripts la plupart des en-têtes de réponse des autres sites ; une page ne peut donc pas les lire directement. Notre serveur envoie la requête et ne renvoie que le statut, les en-têtes et les destinations de redirection, jamais le contenu de la page.
  - q: Quelle méthode de requête est utilisée ?
    a: Chaque vérification est une requête HEAD, qui demande les en-têtes sans télécharger la page. Certains serveurs répondent à HEAD différemment qu'à GET, par exemple avec 405 Method Not Allowed ; le résultat montre alors exactement ce que le serveur a renvoyé.
  - q: Puis-je vérifier localhost ou des adresses de mon réseau ?
    a: Non. Pour protéger les réseaux privés, les adresses comme localhost, 10.x.x.x, 192.168.x.x, les adresses link-local et les autres plages réservées sont refusées, de même que les ports autres que 80 et 443.
  - q: Que signifient les codes de redirection ?
    a: 301 et 308 sont des redirections permanentes que les moteurs de recherche suivent et consolident ; 302, 303 et 307 sont temporaires. De plus, 307 et 308 imposent de conserver la même méthode de requête.
  - q: Le nombre de vérifications est-il limité ?
    a: Oui. Pour que le service reste gratuit et pour éviter d'interroger sans cesse le même site, les vérifications sont limitées par visiteur et par site cible. Si vous atteignez la limite, patientez une minute puis réessayez.
---

## Ce que montre ce vérificateur d'en-têtes

Il envoie une requête HEAD à l'adresse saisie et indique ce que le serveur a répondu : le code d'état HTTP, les en-têtes de réponse tels que le serveur les a envoyés (noms en minuscules) et, si les redirections sont suivies, chaque étape avec son code d'état. C'est utile pour vérifier des en-têtes de cache comme `cache-control`, des en-têtes de sécurité comme `strict-transport-security` et `content-security-policy`, ou si une ancienne URL redirige bien là où vous l'attendez.

## Options et limites

- **Redirections :** jusqu'à 5 étapes sont suivies, chacune étant revalidée avant la requête.
- **Délai :** toute la vérification, redirections comprises, doit se terminer en 8 secondes.
- **Adresses :** uniquement des URL publiques `http://` et `https://` sur les ports par défaut 80 et 443.
- **Limites d'utilisation :** quelques vérifications par minute et par visiteur, et un plafond par site cible.
- **Non inclus :** le contenu de la page, les cookies de votre navigateur et les détails des protocoles HTTP/2 ou HTTP/3.

## Confidentialité

L'URL saisie est envoyée à notre serveur uniquement pour effectuer la requête ; elle n'est pas conservée et le contenu de votre vérification n'est pas journalisé. Le site cible voit la requête provenir de notre serveur, identifié comme WebToolsBot, et non de vous.
