---
review: draft
updated: 2026-10-23
title: MOV to MP4 Converter – Convert QuickTime Videos Free Online
description: Convert MOV to MP4 in your browser for free. iPhone and QuickTime videos usually convert in seconds without re-encoding, and nothing is uploaded.
name: MOV to MP4
answer: Choose a .mov file and press Convert video — MP4 is already selected. Most iPhone and Mac recordings use H.264 or HEVC with AAC audio, which MP4 can hold as is, so the video is repackaged in seconds with no loss in quality.
steps:
  - Choose a MOV video from your iPhone, Mac or camera, up to 500 MB.
  - Keep MP4 as the output format and press Convert video.
  - Download the MP4 file and play or share it anywhere.
faq:
  - q: Why convert MOV to MP4 at all?
    a: MOV is Apple's QuickTime format. Windows, Android, smart TVs and many upload forms handle MP4 more reliably, even when the video inside is exactly the same.
  - q: Will my iPhone video lose quality?
    a: Usually not. iPhones record H.264 or HEVC video with AAC audio, and those streams are copied into the MP4 without being re-encoded, so every frame stays identical.
  - q: Why does my ProRes MOV fail to convert?
    a: Apple ProRes is a professional editing codec that browsers can't decode. Export the clip as H.264 or HEVC from your editing app first, then convert it here.
  - q: What happens to uncompressed PCM audio?
    a: MP4 players expect compressed audio, so PCM is encoded to AAC. Firefox has no AAC encoder, so there the audio is encoded to Opus instead.
table:
  caption: What happens to each stream of a MOV file in the MP4
  columns:
    track: Track
    source: Codec in the MOV
    result: In the MP4
    output: Output codec
  terms:
    video: Video
    audio: Audio
    copied: Copied without re-encoding
    reencoded: Re-encoded
    unsupported: Not supported in browsers
---

## Why MOV to MP4 is usually instant

MOV and MP4 are close relatives: both come from Apple's QuickTime file format and store streams in the same way. When the streams inside a MOV are H.264 or HEVC video and AAC audio, the converter only rewrites the container around them. No frames are decoded or re-encoded, so a long iPhone clip turns into an MP4 in seconds and looks exactly like the original.

## Which MOV files need re-encoding

Files from screen recorders, older cameras and audio interfaces sometimes carry PCM or MP3 audio. That audio is encoded to AAC (Opus in Firefox), while the video is still copied. Apple ProRes video can't be decoded in any browser, so the tool stops with a message instead of producing a broken file.

## Privacy

The MOV file is read and repackaged on your device. It is never uploaded, and the page sets no cookies.
