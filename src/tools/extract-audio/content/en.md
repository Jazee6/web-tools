---
review: draft
updated: 2026-11-03
title: Extract Audio from Video – Convert MP4 to MP3 Online Free
description: Extract the sound from an MP4, MOV, WebM or MKV video as MP3, M4A or WAV for free. Private and fast — it runs in your browser, so your video is never uploaded.
name: Extract Audio
answer: Choose an MP4, MOV, WebM or MKV video, pick MP3, M4A, WAV or the original track, and press Extract audio — the sound is saved on your device as an audio file you can download. The picture is left out.
action: Extract audio
fields:
  file:
    label: Video (MP4, MOV, WebM or MKV)
  format:
    label: Audio format
    options:
      mp3: MP3 (192 kbps)
      m4a: M4A (AAC, 192 kbps)
      wav: WAV (uncompressed)
      original: Original track (no re-encoding)
output:
  file:
    label: Extracted audio
errors:
  invalid_video: This file could not be read as a video. It may be damaged or use a format this tool does not support. Export it again as MP4 and retry.
  no_audio: This video has no audio track, so there is no sound to extract.
  unsupported_codec: "This browser can't decode or encode the audio in this video. Try Original track or the latest Chrome. Codec:"
  aac_unavailable: This browser can't encode AAC — Firefox, for example, has none. Choose MP3, WAV or Original track, or use Chrome or Safari.
steps:
  - Choose an MP4, MOV, WebM or MKV video up to 500 MB.
  - Pick the audio format. MP3 plays everywhere, M4A (AAC) suits iPhone and Mac, WAV is uncompressed for editing, and Original track keeps the sound exactly as it is in the video.
  - Press Extract audio. A progress bar shows how far it is, and you can cancel at any time.
  - Download the audio file.
faq:
  - q: Is my video uploaded to a server?
    a: No. The video is read and its sound is encoded inside your browser, so the file never leaves your device.
  - q: How do I convert an MP4 video to MP3?
    a: Choose the MP4 file, keep MP3 as the audio format and press Extract audio. The sound is encoded as a 192 kbps MP3 and the picture is left out. The same works for MOV, WebM and MKV videos.
  - q: Which format should I choose?
    a: MP3 if you just want a file that plays on any device. M4A (AAC) sounds slightly better at the same size and suits iPhone and Mac. WAV is uncompressed and much larger, which suits audio editors. Original track is fastest and loses no quality.
  - q: What does Original track do?
    a: It copies the audio data out of the video without re-encoding, so it finishes in seconds and the sound is unchanged. The file type follows the audio inside the video, for example M4A for AAC sound in an MP4 and OGG for Opus sound in a WebM.
  - q: Does extracting reduce the sound quality?
    a: Not with Original track, and not with WAV beyond the 16-bit depth it stores. MP3 and M4A re-encode the sound at 192 kbps, which is hard to tell apart from the original for most listening. If the video's audio is already MP3 or AAC, choosing that same format copies it without re-encoding.
  - q: What if the video has several audio tracks?
    a: Only the main audio track is extracted. Other tracks, such as extra languages or commentary, are left out.
  - q: Can I keep only part of the sound?
    a: Not here. Cut the video to the part you want with [Trim Video](/trim-video) first, then extract the audio from the clip.
---

## How the extraction works

The tool reads the video with Mediabunny, an open-source media library, and keeps only the main audio track. For WAV and M4A it decodes and encodes the sound with the WebCodecs API built into your browser. Browsers can't encode MP3, so for MP3 the tool loads an encoder built from LAME, an open-source MP3 encoder, the first time you need it. With Original track nothing is decoded: the audio data is copied as it is. The work runs in a background thread, so the page stays responsive.

To convert an audio file rather than a video, use the [Audio Converter](/audio-converter).

## Options and limits

- **Input:** MP4, MOV, WebM and MKV files up to 500 MB.
- **MP3:** 192 kbps, up to 2 channels. Surround sound is mixed down to stereo, and unusual sample rates are converted to 48 kHz.
- **M4A:** AAC at 192 kbps. Firefox has no AAC encoder, so there M4A only works when the video's sound is already AAC, which is then copied. Encoded M4A has up to 2 channels, like MP3.
- **WAV:** 16-bit uncompressed sound, about 10 MB per minute of stereo audio.
- **Original track:** AAC goes into M4A, MP3 into MP3, Opus and Vorbis into OGG, FLAC into FLAC and PCM into WAV. Other codecs, such as AC-3 or DTS, go into an MKA (Matroska audio) file.
- **Tracks:** only the main audio track is extracted. If the video has no sound, the tool says so instead of creating an empty file.
- **Memory:** the audio file is kept in memory until you download it. A long video extracted as WAV can be very large and may fail on phones.

## Privacy

Your video is processed only on your device. The page does not upload it, store it or use cookies.
