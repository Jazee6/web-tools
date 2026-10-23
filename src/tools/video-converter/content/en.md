---
review: draft
updated: 2026-10-23
title: Video Converter – Convert MP4, WebM, MOV & MKV Online Free
description: Convert videos between MP4, WebM, MOV and MKV for free. Private and fast — conversion runs in your browser with WebCodecs, so your video is never uploaded.
name: Video Converter
answer: Choose an MP4, MOV or WebM video, pick the output format and press Convert video — the file is converted on your device and you download the result. When only the container changes, it takes just seconds.
action: Convert video
fields:
  file:
    label: Video (MP4, MOV or WebM)
  format:
    label: Output format
    options:
      mp4: MP4 (H.264 + AAC)
      webm: WebM (VP9 + Opus)
      mov: MOV (QuickTime)
      mkv: MKV (Matroska)
output:
  file:
    label: Converted video
errors:
  invalid_video: This file could not be read as a video. It may be damaged or use a format this tool does not support.
  no_video: This file has no video track — it contains only audio.
  unsupported_codec: "This browser can't decode or encode one of the tracks in this video. Try another output format or the latest Chrome. Codec:"
steps:
  - Choose an MP4, MOV or WebM video up to 500 MB.
  - Pick the output format. MP4 plays almost everywhere, WebM suits the web, MOV suits Apple apps, and MKV keeps the original streams untouched.
  - Press Convert video. A progress bar shows how far the conversion is, and you can cancel at any time.
  - Download the converted video.
faq:
  - q: Is my video uploaded to a server?
    a: No. The video is read, decoded and encoded inside your browser with the WebCodecs API, so it never leaves your device.
  - q: Why is the conversion sometimes almost instant?
    a: If the video and audio are already in a codec the new format can hold — for example H.264 and AAC going from MOV to MP4 — the streams are copied as they are and only the container is rewritten. Nothing is re-encoded, so it is fast and the quality is unchanged.
  - q: Does converting reduce the quality?
    a: Only when the video has to be re-encoded, for example from WebM to MP4. The tool encodes at a high quality setting, so the difference is usually hard to see, but re-encoding is never perfectly lossless.
  - q: Which codecs does the output use?
    a: MP4 and MOV use H.264 video and AAC audio when your browser can encode them. If it can't — Firefox, for example, has no AAC encoder — the tool falls back to another codec the format supports, such as Opus audio. WebM uses VP9 and Opus. MKV keeps the source codecs.
  - q: Can I convert MKV files?
    a: Not yet. MKV is available as an output format, but MKV files can't be chosen as input for now.
---

## How the conversion works

The tool reads the video with Mediabunny, an open-source media library, and uses the WebCodecs API built into your browser to decode and encode the streams — often with hardware acceleration. Streams that the target format can already hold are copied without re-encoding. The work runs in a background thread, so the page stays responsive.

## Limits

- **Input:** MP4, MOV and WebM files up to 500 MB.
- **Tracks:** the main video track and the main audio track are converted; subtitles and extra audio tracks are dropped.
- **Codecs:** which codecs can be decoded and encoded depends on your browser and device. If a track can't be converted, the tool stops with a message instead of creating a file without sound or picture.
- **Memory:** the converted video is kept in memory until you download it, so very large files may fail on phones.

## Privacy

Your video is processed only on your device. The page does not upload it, store it or use cookies.
