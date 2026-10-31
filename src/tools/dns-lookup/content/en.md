---
review: draft
updated: 2026-10-31
title: "DNS Lookup – Check A, MX, TXT and Other DNS Records Online"
description: "Look up the A, AAAA, CNAME, MX, TXT, NS, SOA and CAA records of any domain through Cloudflare or Google DNS. Free — queried straight from your browser."
name: "DNS Lookup"
answer: "Enter a domain, choose a record type and press Look up — the records, their TTLs and the DNS response code appear right in your browser."
action: "Look up"
fields:
  domain:
    label: "Domain"
    placeholder: "example.com"
  type:
    label: "Record type"
    options:
      A: "A – IPv4 addresses"
      AAAA: "AAAA – IPv6 addresses"
      CNAME: "CNAME – alias to another name"
      MX: "MX – mail servers"
      TXT: "TXT – text records"
      NS: "NS – name servers"
      SOA: "SOA – zone authority"
      CAA: "CAA – allowed certificate authorities"
  resolver:
    label: "Resolver"
    options:
      cloudflare: "Cloudflare (1.1.1.1)"
      google: "Google Public DNS (8.8.8.8)"
output:
  status:
    label: "Response code"
  records:
    label: "Records"
    columns:
      name: "Name"
      type: "Type"
      ttl: "TTL (seconds)"
      data: "Data"
errors:
  invalid_domain: "This is not a valid domain name. Enter a name such as example.com or www.example.com, or paste a full URL. Names can use letters, digits, hyphens and underscores, and each part between dots can be at most 63 characters."
  lookup_failed: "The resolver could not be reached or did not give a usable answer. Check your connection, then try again or switch the Resolver to the other one — some networks block one of them."
steps:
  - "Type the domain into Domain, for example example.com. A full URL also works."
  - "Choose the Record type — A for IPv4 addresses, MX for mail servers, TXT for SPF and verification records, and so on."
  - "Choose the Resolver, Cloudflare or Google, and press Look up."
  - "Read the Response code and the table of records, with each record's TTL in seconds."
faq:
  - q: "Is my domain uploaded to a server?"
    a: "The domain goes from your browser straight to the resolver you choose, Cloudflare or Google, over HTTPS. It does not pass through our servers, and we do not store it. The resolver sees the domain and your IP address and handles them under its own privacy policy."
  - q: "Why does it use Cloudflare or Google instead of the domain's own name servers?"
    a: "A browser cannot send ordinary DNS queries, only web requests. Both Cloudflare and Google offer DNS over HTTPS (DoH), a web interface to their public resolvers. These resolvers cache answers, so you see what a typical visitor sees, which can lag behind a change you just made. The two can also give different answers while a change is spreading."
  - q: "What do the record types mean?"
    a: "A and AAAA give the IPv4 and IPv6 addresses of the name. CNAME makes the name an alias of another name. MX lists the mail servers with their priority. TXT holds free text such as SPF, DKIM and site-verification values. NS lists the name servers of the domain. SOA describes the zone, with its primary name server, admin contact and timers. CAA names the certificate authorities allowed to issue certificates."
  - q: "What do NOERROR and NXDOMAIN mean?"
    a: "NOERROR means the question was answered. If the table is empty, the name exists but has no record of the type you asked for. NXDOMAIN means the name does not exist at all. SERVFAIL and REFUSED mean the resolver could not get an answer, often because of a problem at the domain's name servers."
  - q: "Why does the TTL change every time I look up?"
    a: "The resolver keeps each answer for the record's TTL and counts it down. A smaller TTL than the record's configured value means the answer was cached some seconds ago."
  - q: "Can I look up an IP address or an internal host name?"
    a: "No. Reverse lookups of IP addresses are not supported, and the resolvers only know public DNS, so names that exist only on your private network will come back as NXDOMAIN."
---

## What this DNS lookup does

The tool sends one DNS query for the domain and record type to the resolver you choose, using its JSON API: [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/) or [Google](https://developers.google.com/speed/public-dns/docs/doh/json). Your browser makes the request itself, so the answer is what that resolver returns to you. The table shows each answer record, and a CNAME chain lists the CNAME records before the final records. TXT values that the resolver splits into several strings are joined into one text, and the trailing dot of CNAME, NS and MX targets is removed.

## Options and limits

- **Domain:** a domain name or a URL, up to 2,048 characters. The scheme, path and port are ignored, and an internationalized name is converted to punycode (bücher.example becomes xn--bcher-kva.example).
- **Record types:** A, AAAA, CNAME, MX, TXT, NS, SOA and CAA. Reverse lookups (PTR) and DNSSEC records are not supported.
- **Resolvers:** Cloudflare and Google only, and you cannot enter your own. The tool does not show whether the answer was DNSSEC-validated.
- **Timeout:** a lookup that gets no answer within 10 seconds fails.
- **Connection:** the lookup needs an internet connection, so it does not work offline.

## Privacy

The domain you enter is sent from your browser to the resolver you choose, Cloudflare or Google, which sees it and your IP address. It does not reach our servers, and the page does not store your input or use cookies.
