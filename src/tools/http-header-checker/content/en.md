---
review: draft
updated: 2026-10-22
title: HTTP Header Checker – View Response Headers & Redirects
description: Check the HTTP status, response headers and full redirect chain of any public URL. Free and instant, with no sign-up and nothing stored.
name: HTTP Header Checker
answer: Enter a URL and press Check headers — the tool requests it from our server and shows the final status code, every response header and each redirect hop along the way.
action: Check headers
fields:
  url:
    label: URL
    placeholder: example.com
  followRedirects:
    label: Follow redirects
output:
  status:
    label: Status code
  url:
    label: Final URL
  headers:
    label: Response headers
    columns:
      name: Header
      value: Value
  redirects:
    label: Redirect chain
    columns:
      status: Status
      url: URL
errors:
  invalid_url: Enter a valid http:// or https:// address.
  blocked_url: This address can't be checked. Private, local and non-standard-port addresses are not allowed.
  timeout: The server took too long to respond.
  fetch_failed: The server could not be reached.
  too_many_redirects: The URL redirected more than 5 times.
steps:
  - Enter the address you want to inspect. If you leave out the scheme, https:// is assumed.
  - Keep Follow redirects on to trace every hop to the final page, or turn it off to see only the first response.
  - Press Check headers and review the status code, the final URL, the response headers and the redirect chain.
faq:
  - q: Why does the check run on a server instead of in my browser?
    a: Browsers hide most response headers of other websites from scripts for security reasons, so a page can't read them directly. Our server sends the request and returns only the status, headers and redirect locations — never the page body.
  - q: Which request method is used?
    a: Every check is a HEAD request, which asks for the headers without downloading the page. A few servers answer HEAD differently from GET, for example with 405 Method Not Allowed; in that case the result shows exactly what the server returned.
  - q: Can I check localhost or addresses on my own network?
    a: No. To protect private networks, addresses such as localhost, 10.x.x.x, 192.168.x.x, link-local and other reserved ranges are refused, as are ports other than 80 and 443.
  - q: What do the redirect status codes mean?
    a: 301 and 308 are permanent redirects that search engines follow and consolidate; 302, 303 and 307 are temporary. 307 and 308 also require the request method to stay the same.
  - q: Is there a limit on how often I can check?
    a: Yes. To keep the service free and to avoid sending repeated requests to the same website, checks are rate-limited per visitor and per target site. If you hit the limit, wait a minute and try again.
---

## What this header checker shows

It sends a HEAD request to the address you enter and reports what the server answered: the HTTP status code, the response headers as the server sent them (names in lower case), and — when redirects are followed — each hop with its status code. This is useful for checking caching headers such as `cache-control`, security headers like `strict-transport-security` and `content-security-policy`, and whether an old URL redirects where you expect.

## Options and limits

- **Redirects:** up to 5 hops are followed, each one checked again before it is requested.
- **Timeout:** the whole check, including redirects, must finish within 8 seconds.
- **Addresses:** only public `http://` and `https://` URLs on the default ports 80 and 443.
- **Rate limits:** a few checks per minute per visitor, and a cap per target site.
- **Not included:** the page body, cookies you have in your browser, and HTTP/2 or HTTP/3 protocol details.

## Privacy

The URL you enter is sent to our server only to make the request; it is not stored, and the request body of your check is not logged. The target website sees the request coming from our server, identified as WebToolsBot, not from you.
