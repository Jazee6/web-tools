---
review: reviewed
updated: 2026-11-09
title: "Third-party licenses – Software, models and fonts"
description: "Find licenses and source links for the software, models and fonts used by Web Tools, including the separate terms for libheif and the LAME encoder."
name: "Third-party licenses"
---

The list below is generated automatically when the site is built, using the third-party code, models and fonts included in the site. Package versions are read during the build. Full license texts are provided in English, with source links for LGPL and MPL components.

This inventory is for information, not legal advice or proof of complete license compliance. Some bundled native dependencies and model-conversion terms remain under review.

## Components with separate terms

- **PDFium:** the wrapper uses MIT; the supplied PDFium notice includes BSD-style terms and Apache-2.0 text, alongside notices for bundled libraries.
- **jSquash:** its processing libraries have their own licenses in addition to the wrappers' Apache-2.0 terms.
- **libheif and libde265:** these use LGPL-3.0 and are bundled into JavaScript. Their terms include rights to modify and replace the covered components.
- **LAME:** the MP3 encoder uses GNU Library GPL version 2 or later, separately from the MPL-2.0 terms of Mediabunny and its MP3 wrapper. The encoder is also bundled into JavaScript.

For libheif, libde265 and LAME, we do not currently provide a mechanism to replace or re-link the bundled components. The corresponding LGPL requirements remain an unresolved release item; source links alone do not establish that these requirements have been met.

This software is based in part on the work of the Independent JPEG Group.
