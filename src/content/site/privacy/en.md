---
review: reviewed
updated: 2026-11-09
title: "Privacy – Files, statistics and browser storage"
description: "Learn which Web Tools features connect to servers, what anonymous statistics contain, and how to clear preferences and cached data in your browser."
name: "Privacy"
---

## Your files stay on your device

File-processing tools work in your browser without uploading your files to our server. The browser still downloads the code and, for some tools, models needed to process them.

## Features that connect to servers

- **HTTP Header Checker** sends the URL you enter to our server so it can check the destination's response headers. The part after `#` is removed, but the path and query are sent. Avoid URLs containing secrets. Cloudflare Turnstile checks for abuse and receives a verification token and your IP address. See the [Turnstile privacy policy](https://www.cloudflare.com/turnstile-privacy-policy/).
- **DNS Lookup** sends the domain and record type directly to your chosen Cloudflare or Google DNS provider, not through our server. Cloudflare is the default. The provider also sees your IP address. See [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/) and [Google Public DNS privacy information](https://developers.google.com/speed/public-dns/privacy).
- **Remote MCP** sends the tool name and your arguments to our server, where the tool runs. This also applies to tools that normally run in the browser. Do not send sensitive information.

## Anonymous usage statistics

We collect limited statistics to understand tool use and errors, without a visitor identifier.

| What is reported  | What it contains                                                                        |
| ----------------- | --------------------------------------------------------------------------------------- |
| Tool use          | Tool name, interface language, result category and a time range for how long it took    |
| Unexpected errors | Error type and source, tool if known, interface language and available browser features |
| Not included      | Your inputs, outputs, files, IP address, error message or detailed error trace          |

Each completed tool use has a 10% chance of being reported; this is not a selection of 10% of visitors. Unexpected errors are not sampled. Repeated errors are suppressed, with at most 20 distinct errors reported per session. Reports may be lost and are not retried.

## Cloudflare Web Analytics

Cloudflare Web Analytics measures page views and loading performance without cookies. Cloudflare can add its measurement script automatically, separately from the tool statistics above. See [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/) for its data practices.

## Server logs and IP addresses

Our server uses your IP address to limit requests and prevent abuse, but does not put it in usage statistics. Cloudflare handles connection data, including IP addresses, when serving the site and checking requests.

Server logs record the tool, time taken and result. Unexpected server errors may also include error messages and detailed error traces. Cloudflare's handling and retention of this data are covered by its [privacy policy](https://www.cloudflare.com/privacypolicy/).

## What your browser saves

Your browser remembers favorites, up to 20 recently used tools and form choices such as selections, switches and numbers. It does not save files or free text as form preferences, and preset choices are not saved as preferences.

Visited pages and supporting files are cached for offline use. Downloaded models are cached separately. Temporary information also prevents repeated error reports during a session.

Use **Clear local data** in the footer to remove saved preferences, favorites, recent tools, offline caches, model caches and temporary local files, and to stop the offline service before reloading. Browser restrictions can prevent some temporary files from being removed. This does not clear the browser's regular web cache, cookies, session error-report markers or server records. Reloading can start caching again.
