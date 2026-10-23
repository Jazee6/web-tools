# Web Tools

A multilingual, search-first online tool site: a large catalog of utilities that run in the visitor's browser, each with its own indexable page.

## Language

**Tool**:
A single user-facing utility with its own canonical page (e.g. "Image Compressor", "JSON Formatter").
_Avoid_: App, utility, feature

**Category**:
A top-level grouping of **Tools** (e.g. Image, PDF, Developer). Every **Tool** has exactly one primary **Category**, which defines its place in the site hierarchy, and may additionally be listed under other **Categories**.
_Avoid_: Tag, section, collection

**Tool Variant**:
A page that presets exactly one **Tool** for one specific long-tail intent (e.g. "PNG to WebP" for the Image Converter tool) and carries content unique to that intent. It has no **Agent Interface** of its own.
_Avoid_: Landing page, SEO page, sub-tool

**Server-assisted Tool**:
A **Tool** whose work cannot be done entirely in the browser and relies on a server call (e.g. fetching a remote URL, DNS lookup).
_Avoid_: Backend tool, API tool

**Agent Interface**:
The machine-callable form of a **Tool**, letting an AI agent invoke it with typed input and get typed output instead of using the page.
_Avoid_: API, endpoint, MCP tool

**Locale**:
A language edition of the site; English is the default **Locale**.
_Avoid_: Language version, region

**Review Status**:
Whether a piece of **Locale** content is **Draft** (written or translated, not yet approved) or **Reviewed** (approved by the designated review model). Only **Reviewed** content may be indexed by search engines.
_Avoid_: Approved, published, QA status
