---
review: draft
updated: 2026-10-23
title: Speech to Text – Transcribe Audio & Video Online Free
description: Transcribe audio and video to text and SRT subtitles for free. Private — the Whisper speech recognition model runs in your browser, so your file is never uploaded.
name: Speech to Text
answer: Choose an audio or video file, leave the language on Detect automatically or pick the spoken language, and press Transcribe. Whisper turns the speech into text on your device, and you can copy the transcript or download it as SRT subtitles.
action: Transcribe
fields:
  file:
    label: Audio or video (MP3, M4A, WAV, OGG, FLAC, MP4, MOV, WebM or MKV)
  language:
    label: Spoken language
    options:
      auto: Detect automatically
output:
  text:
    label: Transcript
  subtitles:
    label: Subtitles (SRT)
errors:
  invalid_audio: This file could not be read as audio. It may be damaged or use a format this tool does not support.
  no_audio: This file has no audio track, so there is nothing to transcribe.
  unsupported_codec: "This browser can't decode the audio in this file. Try another file format or the latest Chrome. Codec:"
  too_long: The recording is longer than 60 minutes. Split it into shorter parts and transcribe them one at a time.
  no_speech: No speech was found in this recording.
steps:
  - Choose an audio or video file up to 1 GB and 60 minutes long.
  - Leave the language on Detect automatically, or pick the language that is spoken. Picking it helps with short clips and strong accents.
  - Press Transcribe. The first time, the speech recognition model (about 105–125 MB) is downloaded and saved in your browser; after that it starts right away.
  - Copy the transcript, or download the SRT file to use as subtitles in a video player or editor.
faq:
  - q: Is my recording uploaded to a server?
    a: No. The audio is decoded and transcribed inside your browser, so the file never leaves your device. Only the speech recognition model is downloaded, once.
  - q: Which languages are supported?
    a: The 99 languages that Whisper was trained on, including English, Chinese, Spanish, German, French, Japanese and Portuguese. Accuracy is best for widely spoken languages and clear recordings.
  - q: Why is the first transcription slower?
    a: The tool first downloads the Whisper model, about 105–125 MB depending on your device, and stores it in your browser. Later transcriptions use the stored copy and start immediately.
  - q: How accurate is the transcript?
    a: The tool uses Whisper base, a compact model that runs well in a browser. It handles clear speech well but can miss words in noisy recordings, overlapping voices or uncommon names, so check the transcript before you publish it.
  - q: What is an SRT file?
    a: SRT is the most common subtitle format. Each line of the transcript has a start and end time, so video players such as VLC and editors such as Premiere Pro or CapCut can show it as captions.
---

## How the transcription works

The tool decodes the audio with Mediabunny and the WebCodecs API, converts it to 16 kHz mono, and passes it to Whisper base, an open-source speech recognition model by OpenAI. The model runs with ONNX Runtime in a background thread. If your device has a capable GPU, part of the model runs on it with WebGPU, which is faster; otherwise everything runs on the CPU with WebAssembly. Long recordings are split into overlapping 30-second windows that are joined back together.

## Limits

- **Input:** MP3, M4A, AAC, WAV, OGG, Opus, FLAC and WebM audio, or the audio track of an MP4, MOV, WebM or MKV video, up to 1 GB and 60 minutes.
- **Speed:** on a recent laptop, one minute of audio takes a few seconds with WebGPU and up to about 20 seconds without it.
- **Download:** the model is about 105–125 MB and is downloaded on first use.
- **Accuracy:** Whisper base is a small model. Background noise, music and several people talking at once lower the quality.
- **Chinese:** Whisper often writes Chinese in Traditional characters, even for Mandarin from mainland China.

## Privacy

Your recording is processed only on your device. The page does not upload it, store it or use cookies.
