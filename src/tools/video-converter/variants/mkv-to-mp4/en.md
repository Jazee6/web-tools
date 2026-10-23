---
review: draft
updated: 2026-10-23
title: MKV to MP4 Converter – Convert Matroska Videos Free Online
description: Convert MKV to MP4 in your browser for free. H.264 and AAC streams are copied without re-encoding, so most files take seconds. No upload, no sign-up.
name: MKV to MP4
answer: Choose an .mkv file and press Convert video with MP4 selected. If the video is H.264 or HEVC and the audio is AAC, the streams are copied into the MP4 untouched; VP9, AV1, Opus or FLAC tracks are re-encoded so the file plays on phones, TVs and in editors.
steps:
  - Choose an MKV file up to 500 MB.
  - Leave the output format on MP4 and press Convert video.
  - Wait for the progress bar — re-encoded files take longer than copied ones.
  - Download the MP4.
faq:
  - q: Why won't my MKV play on my TV or phone?
    a: Matroska (MKV) is a flexible container that many devices and apps don't open, even when they can play the video inside. Moving the same streams into MP4 usually fixes that.
  - q: What happens to subtitles and extra audio languages?
    a: Only the main video track and the main audio track are kept. Embedded subtitles and additional audio tracks are dropped, because the converter writes a single-track MP4.
  - q: Why is my file re-encoded instead of copied?
    a: MP4 is limited here to H.264 or HEVC video and AAC audio, the combination that plays on nearly every device. VP9 or AV1 video and Opus, Vorbis or FLAC audio are re-encoded, which takes longer and is not perfectly lossless.
  - q: Can I convert MKV files larger than 500 MB?
    a: Not with this tool. The converted file is held in memory until you download it, so the input is capped at 500 MB to stay reliable on laptops and phones.
table:
  caption: What happens to each stream of an MKV file in the MP4
  columns:
    track: Track
    source: Codec in the MKV
    result: In the MP4
    output: Output codec
  terms:
    video: Video
    audio: Audio
    copied: Copied without re-encoding
    reencoded: Re-encoded
---

## Copy or re-encode: what decides the speed

MKV can hold almost any codec, so two MKV files of the same size can behave very differently. Files encoded with H.264 video and AAC audio — the most common combination in downloaded and recorded MKVs — are simply remuxed: the streams move into an MP4 container in seconds with no change in quality. Files with VP9 or AV1 video, or with Opus, Vorbis or FLAC audio, are decoded and encoded again with WebCodecs, which can take as long as the video itself.

## What gets left behind

MP4 output keeps one video track and one audio track: the main one of each. Subtitle tracks and alternative audio languages are not carried over, so if you need a different language, make it the main audio track in a desktop tool first.

## Privacy

Conversion runs on your device in a background thread. The MKV is never uploaded and the page sets no cookies.
