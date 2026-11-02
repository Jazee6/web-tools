---
review: draft
updated: 2026-11-02
title: Trim Video – Cut MP4, MOV, WebM & MKV Clips Online Free
description: Cut a video to a start and end time for free, in MP4, MOV, WebM or MKV. Private and fast — trimming runs in your browser, so your video is never uploaded.
name: Trim Video
answer: Choose a video, enter a start time and an end time such as 1:30 and 2:45, and press Trim video — the clip is cut on your device in the same format, and you download the result.
action: Trim video
fields:
  file:
    label: Video (MP4, MOV, WebM or MKV)
  start:
    label: Start time
    placeholder: 0:00
  end:
    label: End time
    placeholder: End of video
  mode:
    label: Trimming method
    options:
      precise: Precise (re-encodes when needed)
      fast: Fast (no re-encoding)
output:
  file:
    label: Trimmed video
errors:
  invalid_video: This file could not be read as a video. It may be damaged or use a format this tool does not support. Export it again as MP4 and retry.
  no_video: This file has no video track — it contains only audio. Choose a video file instead.
  unsupported_codec: "This browser can't decode or encode one of the tracks in this video. Try the Fast method or the latest Chrome. Codec:"
  invalid_time: "Enter a time as seconds (90.5), minutes:seconds (1:30) or hours:minutes:seconds (1:02:03). This value can't be read:"
  range_required: Enter a start time, an end time or both.
  end_before_start: The end time must be later than the start time.
  start_past_end: "The start time is after the end of the video. Length of this video:"
steps:
  - Choose an MP4, MOV, WebM or MKV video up to 500 MB.
  - Enter the start time, the end time or both, as seconds (90.5), minutes:seconds (1:30) or hours:minutes:seconds (1:02:03). Leave one empty to keep the video from the beginning or to the end.
  - Choose a trimming method. Precise cuts at the exact times, and Fast keeps the original quality. If the footage you are removing is sensitive, use Precise, because a Fast clip can still contain some of it.
  - Press Trim video. A progress bar shows how far it is, and you can cancel at any time.
  - Download the trimmed video.
faq:
  - q: Is my video uploaded to a server?
    a: No. The video is read and cut inside your browser, so it never leaves your device.
  - q: What is the difference between Precise and Fast?
    a: Precise starts and ends at exactly the times you enter, but usually has to re-encode the video. Fast copies the video as it is, so it finishes much sooner and keeps the original quality, but it can only start cutting at a key frame.
  - q: Why does my Fast clip start earlier than I asked?
    a: A video can only be copied from a key frame, so a WebM or MKV clip starts at the last key frame before your start time. In MP4 and MOV those extra frames stay in the file but are hidden by an edit list, so a player that supports edit lists starts at your time. A Fast clip can also run a few frames past the end time.
  - q: Is the footage I cut out really gone?
    a: With Precise, yes — nothing outside your times is left in the file. With Fast, not always. Frames between the last key frame and your start time stay in the file, along with a few frames past the end time. In MP4 and MOV they are only hidden during playback, so anyone with a video editing tool could recover them. To remove sensitive footage before you share a video, use Precise.
  - q: Does trimming reduce the quality?
    a: Not with Fast, because nothing is re-encoded. Precise re-encodes at a high quality setting, so the difference is usually hard to see, but re-encoding is never perfectly lossless. Precise also copies without re-encoding when your start time is on a key frame and you don't cut the end.
  - q: What happens if the end time is past the end of the video?
    a: The clip simply runs to the end of the video.
  - q: Can I change the format while trimming?
    a: No. The clip stays in the same format as the original. To change it afterwards, use the [Video Converter](/video-converter).
---

## How the trimming works

The tool reads the video with Mediabunny, an open-source media library. With Fast, it copies the existing video and audio data for the part you chose. With Precise, it decodes that part and encodes it again using the WebCodecs API built into your browser, often with hardware acceleration. The work runs in a background thread, so the page stays responsive.

## Options and limits

- **Input:** MP4, MOV, WebM and MKV files up to 500 MB. The clip keeps the same format.
- **Cut footage:** a Fast clip can keep frames from just outside your times, even when a player does not show them. Precise leaves none.
- **Tracks:** the main video track and the main audio track are kept; subtitles and extra audio tracks are dropped.
- **Codecs:** with Precise, which codecs can be decoded and encoded depends on your browser and device. Firefox, for example, has no AAC encoder, so MP4 and MOV get Opus audio there. If a track can't be processed, the tool stops with a message instead of creating a file without sound or picture.
- **Memory:** the trimmed video is kept in memory until you download it, so very large files may fail on phones.

## Privacy

Your video is processed only on your device. The page does not upload it, store it or use cookies.
