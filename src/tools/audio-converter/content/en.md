---
review: draft
updated: 2026-11-03
title: Audio Converter – Convert WAV, M4A, OGG & FLAC to MP3 Free
description: Convert audio between MP3, M4A, WAV and OGG for free, from MP3, M4A, AAC, WAV, OGG, Opus or FLAC. Private and fast — it runs in your browser, nothing is uploaded.
name: Audio Converter
answer: Choose an audio file, pick MP3, M4A, WAV or OGG and a bitrate, and press Convert audio — the file is converted on your device and you download the result. MP3 at 192 kbps is the default and plays everywhere.
action: Convert audio
fields:
  file:
    label: Audio (MP3, M4A, AAC, WAV, OGG, Opus or FLAC)
  format:
    label: Output format
    options:
      mp3: MP3
      m4a: M4A (AAC)
      wav: WAV (uncompressed)
      ogg: OGG (Opus)
  bitrate:
    label: Bitrate
    options:
      "128": 128 kbps (smaller)
      "192": 192 kbps (recommended)
      "320": 320 kbps (highest)
output:
  file:
    label: Converted audio
errors:
  invalid_audio: This file could not be read as audio. It may be damaged or use a format this tool does not support. Export it again as MP3 or WAV and retry.
  unsupported_codec: "This browser can't decode or encode this audio. Try another output format or the latest Chrome. Codec:"
  aac_unavailable: This browser can't encode AAC — Firefox, for example, has none. Choose MP3, WAV or OGG, or use Chrome or Safari.
steps:
  - Choose an MP3, M4A, AAC, WAV, OGG, Opus, FLAC or WebM audio file up to 500 MB.
  - Pick the output format. MP3 plays everywhere, M4A (AAC) suits iPhone and Mac, WAV is uncompressed for editing, and OGG (Opus) gives the best sound for its size.
  - Pick a bitrate for MP3, M4A or OGG. 192 kbps suits most music, 128 kbps makes smaller files, and 320 kbps is the highest. WAV ignores it.
  - Press Convert audio. A progress bar shows how far it is, and you can cancel at any time.
  - Download the converted file.
faq:
  - q: Is my audio uploaded to a server?
    a: No. The file is decoded and encoded inside your browser, so it never leaves your device.
  - q: How do I convert WAV to MP3?
    a: Choose the WAV file, keep MP3 as the output format, pick a bitrate and press Convert audio. A minute of stereo WAV takes about 10 MB, while the same minute as a 192 kbps MP3 takes about 1.4 MB.
  - q: Which bitrate should I choose?
    a: 192 kbps is hard to tell apart from the original for most music. 128 kbps is fine for speech and podcasts and makes smaller files. 320 kbps is the highest MP3 setting, for when file size doesn't matter.
  - q: Does converting to a higher bitrate improve the sound?
    a: No. Converting a 128 kbps MP3 to 320 kbps makes the file larger, but the detail lost in the first encoding doesn't come back. Converting from one lossy format to another always loses a little quality, so start from WAV or FLAC when you can.
  - q: Can I change the bitrate of an MP3?
    a: Yes. Choose the MP3, keep MP3 as the output format and pick another bitrate. The sound is re-encoded at that bitrate, which is a simple way to make a large MP3 smaller.
  - q: Can I convert FLAC files?
    a: Yes, in Chrome, Edge and Firefox. Safari can't decode FLAC, so the tool shows a message there instead. FLAC can be converted to MP3, M4A, OGG or WAV; this tool does not write FLAC.
  - q: What happens to surround sound?
    a: MP3, M4A and OGG are written with up to 2 channels, so surround sound is mixed down to stereo. WAV keeps every channel.
---

## How the conversion works

The tool reads the file with Mediabunny, an open-source media library, decodes the sound with the WebCodecs API built into your browser and encodes it again in the format you chose. Browsers can't encode MP3, so for MP3 the tool uses an encoder built from LAME, an open-source MP3 encoder. The work runs in a background thread, so the page stays responsive.

To take the sound out of a video instead, use [Extract Audio](/extract-audio).

## Options and limits

- **Input:** MP3, M4A, AAC, WAV, OGG, Opus, FLAC and WebM audio files up to 500 MB. Only the main audio track is converted.
- **MP3:** 128, 192 or 320 kbps, up to 2 channels. Unusual sample rates are converted to 48 kHz.
- **M4A:** AAC at the chosen bitrate, up to 2 channels, at 44.1 or 48 kHz. Firefox has no AAC encoder, so M4A isn't available there.
- **OGG:** Opus at the chosen bitrate, up to 2 channels, always at 48 kHz. Mono sound is encoded at no more than 256 kbps.
- **WAV:** 16-bit uncompressed sound with the original channels and sample rate, about 10 MB per minute of stereo audio.
- **Re-encoding:** MP3, M4A and OGG are always encoded at the bitrate you chose, even from the same format. A WAV that is already 16-bit is copied as it is.
- **Browsers:** Safari can't decode FLAC or Vorbis. If a file can't be decoded or encoded, the tool stops with a message.
- **Memory:** the converted file is kept in memory until you download it, so very long recordings may fail on phones.

## Privacy

Your audio is processed only on your device. The page does not upload it, store it or use cookies.
