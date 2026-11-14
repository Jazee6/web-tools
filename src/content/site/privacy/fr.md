---
review: reviewed
updated: 2026-11-09
title: "Confidentialité – Fichiers, statistiques et données locales"
description: "Découvrez quelles fonctions Web Tools contactent des serveurs, ce que contiennent les statistiques anonymes et comment effacer les données du navigateur."
name: "Confidentialité"
---

## Vos fichiers restent sur votre appareil

Les outils de fichiers fonctionnent dans votre navigateur sans envoyer vos fichiers à notre serveur. Le navigateur télécharge toutefois le code et, pour certains outils, les modèles nécessaires au traitement.

## Fonctions qui contactent des serveurs

- **Vérificateur d'en-têtes HTTP** envoie l'URL saisie à notre serveur pour consulter les en-têtes de réponse de la destination. La partie après `#` est supprimée, mais le chemin et les paramètres de requête sont envoyés. Évitez les URL contenant des secrets. Cloudflare Turnstile vérifie les abus et reçoit un jeton de vérification et votre adresse IP. Consultez la [politique de confidentialité de Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/).
- **Recherche DNS** envoie le domaine et le type d'enregistrement directement au fournisseur DNS Cloudflare ou Google que vous choisissez, sans passer par notre serveur. Cloudflare est le choix par défaut. Le fournisseur voit aussi votre adresse IP. Consultez la [politique de confidentialité de Cloudflare](https://www.cloudflare.com/privacypolicy/) et les [informations de confidentialité de Google Public DNS](https://developers.google.com/speed/public-dns/privacy).
- **MCP distant** envoie le nom de l'outil et vos arguments à notre serveur, où l'outil s'exécute. Cela vaut aussi pour les outils qui fonctionnent normalement dans le navigateur. N'envoyez pas de données sensibles.

## Statistiques anonymes d'utilisation

Nous recueillons des statistiques limitées pour comprendre l'utilisation des outils et les erreurs, sans identifiant de visiteur.

| Ce qui est signalé     | Informations incluses                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Utilisation des outils | Nom, langue de l'interface, catégorie du résultat et plage de durée                           |
| Erreurs inattendues    | Type et origine de l'erreur, outil si connu, langue et fonctions disponibles du navigateur    |
| Non inclus             | Vos entrées, résultats, fichiers, adresse IP, message d'erreur ou trace détaillée de l'erreur |

Chaque utilisation terminée a 10% de chances d'être signalée ; il ne s'agit pas de sélectionner 10% des visiteurs. Les erreurs inattendues ne sont pas échantillonnées. Les répétitions sont supprimées, avec au plus 20 erreurs distinctes signalées par session. Les rapports peuvent se perdre et ne sont pas renvoyés.

## Cloudflare Web Analytics

Cloudflare Web Analytics mesure les visites et les performances de chargement sans cookies. Cloudflare peut ajouter automatiquement son script de mesure, séparément des statistiques des outils ci-dessus. Consultez sa [politique de confidentialité](https://www.cloudflare.com/privacypolicy/) pour le traitement des données.

## Journaux du serveur et adresses IP

Notre serveur utilise votre IP pour limiter les requêtes et prévenir les abus, mais ne l'ajoute pas aux statistiques d'utilisation. Cloudflare traite les données de connexion, dont les adresses IP, lors de la diffusion du site et du contrôle des requêtes.

Les journaux du serveur enregistrent l'outil, la durée et le résultat. Les erreurs inattendues du serveur peuvent aussi inclure des messages et des traces détaillées. Le traitement et la conservation de ces données par Cloudflare sont décrits dans sa [politique de confidentialité](https://www.cloudflare.com/privacypolicy/).

## Ce que votre navigateur enregistre

Votre navigateur mémorise les favoris, jusqu'à 20 outils récents et des choix de formulaire comme les sélections, les interrupteurs et les nombres. Il ne conserve pas les fichiers ni le texte libre comme préférences, ni les choix prédéfinis.

Les pages visitées et leurs ressources sont mises en cache pour un usage hors ligne. Les modèles téléchargés sont conservés séparément. Des informations temporaires évitent aussi de signaler plusieurs fois la même erreur pendant une session.

Utilisez **Effacer les données locales** en pied de page pour supprimer les préférences, favoris, outils récents, caches hors ligne, modèles et fichiers locaux temporaires, et arrêter le service hors ligne avant de recharger. Les restrictions du navigateur peuvent empêcher la suppression de certains fichiers temporaires. Cela n'efface pas le cache web habituel, les cookies, les marqueurs d'erreurs de la session ni les enregistrements du serveur. Le rechargement peut relancer la mise en cache.
