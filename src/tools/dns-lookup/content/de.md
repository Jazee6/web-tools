---
review: draft
updated: 2026-10-31
title: "DNS-Abfrage – A-, MX-, TXT- und weitere DNS-Einträge online prüfen"
description: "Fragen Sie A-, AAAA-, CNAME-, MX-, TXT-, NS-, SOA- und CAA-Einträge einer Domain über Cloudflare oder Google DNS ab. Kostenlos, direkt aus Ihrem Browser."
name: "DNS-Abfrage"
answer: "Geben Sie eine Domain ein, wählen Sie einen Eintragstyp und klicken Sie auf Abfragen – die Einträge, ihre TTLs und der DNS-Antwortcode erscheinen direkt im Browser."
action: "Abfragen"
fields:
  domain:
    label: "Domain"
    placeholder: "example.com"
  type:
    label: "Eintragstyp"
    options:
      A: "A – IPv4-Adressen"
      AAAA: "AAAA – IPv6-Adressen"
      CNAME: "CNAME – Alias für einen anderen Namen"
      MX: "MX – Mailserver"
      TXT: "TXT – Texteinträge"
      NS: "NS – Nameserver"
      SOA: "SOA – Zonenautorität"
      CAA: "CAA – zugelassene Zertifizierungsstellen"
  resolver:
    label: "Resolver"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "Google Public DNS (8.8.8.8)"
output:
  status:
    label: "Antwortcode"
  records:
    label: "Einträge"
    columns:
      name: "Name"
      type: "Typ"
      ttl: "TTL (Sekunden)"
      data: "Daten"
errors:
  invalid_domain: "Das ist kein gültiger Domainname. Geben Sie einen Namen wie example.com oder www.example.com ein oder fügen Sie eine vollständige URL ein. Namen dürfen Buchstaben, Ziffern, Bindestriche und Unterstriche enthalten, und jeder Teil zwischen den Punkten darf höchstens 63 Zeichen lang sein."
  lookup_failed: "Der Resolver war nicht erreichbar oder lieferte keine brauchbare Antwort. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut oder wechseln Sie beim Resolver zum anderen – manche Netzwerke blockieren einen von beiden."
steps:
  - "Geben Sie die Domain bei Domain ein, zum Beispiel example.com. Eine vollständige URL funktioniert auch."
  - "Wählen Sie den Eintragstyp – A für IPv4-Adressen, MX für Mailserver, TXT für SPF- und Verifizierungseinträge und so weiter."
  - "Wählen Sie den Resolver, Cloudflare oder Google, und klicken Sie auf Abfragen."
  - "Lesen Sie den Antwortcode und die Tabelle der Einträge ab, jeweils mit der TTL in Sekunden."
faq:
  - q: "Wird meine Domain auf einen Server hochgeladen?"
    a: "Die Domain geht von Ihrem Browser per HTTPS direkt an den gewählten Resolver, Cloudflare oder Google. Sie läuft nicht über unsere Server, und wir speichern sie nicht. Der Resolver sieht die Domain und Ihre IP-Adresse und verarbeitet sie nach seiner eigenen Datenschutzerklärung."
  - q: "Warum nutzt das Tool Cloudflare oder Google statt der eigenen Nameserver der Domain?"
    a: "Ein Browser kann keine gewöhnlichen DNS-Anfragen senden, nur Webanfragen. Cloudflare und Google bieten DNS over HTTPS (DoH) an, eine Webschnittstelle zu ihren öffentlichen Resolvern. Diese Resolver speichern Antworten zwischen, Sie sehen also, was ein typischer Besucher sieht – das kann einer gerade gemachten Änderung hinterherhinken. Während sich eine Änderung verbreitet, können die beiden außerdem unterschiedlich antworten."
  - q: "Was bedeuten die Eintragstypen?"
    a: "A und AAAA liefern die IPv4- und IPv6-Adressen des Namens. CNAME macht den Namen zum Alias eines anderen Namens. MX listet die Mailserver mit ihrer Priorität auf. TXT enthält freien Text wie SPF-, DKIM- und Website-Verifizierungswerte. NS listet die Nameserver der Domain auf. SOA beschreibt die Zone mit primärem Nameserver, Administratorkontakt und Zeitparametern. CAA nennt die Zertifizierungsstellen, die Zertifikate ausstellen dürfen."
  - q: "Was bedeuten NOERROR und NXDOMAIN?"
    a: "NOERROR heißt, dass die Anfrage beantwortet wurde. Ist die Tabelle leer, existiert der Name, hat aber keinen Eintrag des gefragten Typs. NXDOMAIN heißt, dass der Name gar nicht existiert. SERVFAIL und REFUSED bedeuten, dass der Resolver keine Antwort bekommen konnte, oft wegen eines Problems bei den Nameservern der Domain."
  - q: "Warum ändert sich die TTL bei jeder Abfrage?"
    a: "Der Resolver behält jede Antwort für die TTL des Eintrags und zählt sie herunter. Ist die TTL kleiner als der konfigurierte Wert des Eintrags, wurde die Antwort vor einigen Sekunden zwischengespeichert."
  - q: "Kann ich eine IP-Adresse oder einen internen Hostnamen abfragen?"
    a: "Nein. Rückwärtsabfragen von IP-Adressen werden nicht unterstützt, und die Resolver kennen nur das öffentliche DNS – Namen, die nur in Ihrem privaten Netzwerk existieren, kommen daher als NXDOMAIN zurück."
---

## Was diese DNS-Abfrage macht

Das Tool sendet eine DNS-Anfrage zu Domain und Eintragstyp an den gewählten Resolver und nutzt dessen JSON-Schnittstelle: [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) oder [Google](https://developers.google.com/speed/public-dns/docs/doh/json). Die Anfrage stellt Ihr Browser selbst, die Antwort ist also die, die dieser Resolver Ihnen liefert. Die Tabelle zeigt jeden Antworteintrag, und eine CNAME-Kette listet die CNAME-Einträge vor den endgültigen Einträgen auf. TXT-Werte, die der Resolver in mehrere Zeichenketten teilt, werden zu einem Text zusammengefügt, und der abschließende Punkt bei Zielen von CNAME, NS und MX wird entfernt.

## Optionen und Grenzen

- **Domain:** ein Domainname oder eine URL mit bis zu 2.048 Zeichen. Schema, Pfad und Port werden ignoriert, und ein internationalisierter Name wird in Punycode umgewandelt (bücher.example wird zu xn--bcher-kva.example).
- **Eintragstypen:** A, AAAA, CNAME, MX, TXT, NS, SOA und CAA. Rückwärtsabfragen (PTR) und DNSSEC-Einträge werden nicht unterstützt.
- **Resolver:** nur Cloudflare und Google, ein eigener lässt sich nicht eingeben. Das Tool zeigt nicht an, ob die Antwort per DNSSEC validiert wurde.
- **Zeitlimit:** Eine Abfrage ohne Antwort innerhalb von 10 Sekunden schlägt fehl.
- **Verbindung:** Die Abfrage braucht eine Internetverbindung und funktioniert daher nicht offline.

## Datenschutz

Die eingegebene Domain wird von Ihrem Browser an den gewählten Resolver, Cloudflare oder Google, gesendet, der die Domain und Ihre IP-Adresse sieht. Sie erreicht unsere Server nicht, und die Seite speichert Ihre Eingabe nicht und verwendet keine Cookies.
