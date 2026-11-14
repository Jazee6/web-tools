import { ALL_FORMATS, BlobSource, canEncodeAudio, Input } from "mediabunny";
import { describe, expect, it } from "vitest";
import { server } from "vitest/browser";

import { loadExampleFile } from "../example-files";
import { convertAudio } from "./core";

// 样例 2 秒立体声（左 440 Hz、右 660 Hz）；MP3、M4A（AAC）、WAV、FLAC 是 44.1 kHz，OGG 是 48 kHz 的 Opus
const load = (name: string) => loadExampleFile("audio-converter", name);

const probe = async (file: File) => {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const audio = (await input.getPrimaryAudioTrack())!;
    return {
      format: (await input.getFormat()).name,
      codec: await audio.getCodec(),
      channels: await audio.getNumberOfChannels(),
      sampleRate: await audio.getSampleRate(),
      duration: await input.computeDuration(),
    };
  } finally {
    input.dispose();
  }
};

// 16 位 PCM 的 WAV：每个声道一个不同频率的正弦波
const wavOf = (channels: number, sampleRate: number, seconds: number) => {
  const frames = sampleRate * seconds;
  const data = new DataView(new ArrayBuffer(44 + frames * channels * 2));
  const text = (offset: number, value: string) =>
    [...value].forEach((char, i) => data.setUint8(offset + i, char.charCodeAt(0)));
  text(0, "RIFF");
  data.setUint32(4, 36 + frames * channels * 2, true);
  text(8, "WAVEfmt ");
  data.setUint32(16, 16, true);
  data.setUint16(20, 1, true);
  data.setUint16(22, channels, true);
  data.setUint32(24, sampleRate, true);
  data.setUint32(28, sampleRate * channels * 2, true);
  data.setUint16(32, channels * 2, true);
  data.setUint16(34, 16, true);
  text(36, "data");
  data.setUint32(40, frames * channels * 2, true);
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = Math.sin((2 * Math.PI * 220 * (channel + 1) * frame) / sampleRate);
      data.setInt16(44 + (frame * channels + channel) * 2, sample * 12_000, true);
    }
  }
  return new File([data.buffer], `tone-${channels}ch.wav`, { type: "audio/wav" });
};

describe("convertAudio", () => {
  it("encodes WAV as MP3 at the chosen bitrate", async () => {
    const source = await load("tone.wav");
    const sizes: number[] = [];
    for (const bitrate of ["128", "192", "320"] as const) {
      const { file } = await convertAudio({ file: source, format: "mp3", bitrate }, {});
      expect(file.name).toBe("tone.mp3");
      expect(file.type).toBe("audio/mpeg");
      const result = await probe(file);
      expect(result).toMatchObject({ codec: "mp3", channels: 2, sampleRate: 44_100 });
      expect(result.duration).toBeGreaterThan(1.9);
      expect(result.duration).toBeLessThan(2.2);
      // 2 秒 × 码率，误差 15%
      expect(file.size).toBeGreaterThan((Number(bitrate) * 1000 * 2 * 0.85) / 8);
      expect(file.size).toBeLessThan((Number(bitrate) * 1000 * 2 * 1.15) / 8);
      sizes.push(file.size);
    }
  });

  it("re-encodes MP3 to MP3 to change the bitrate", async () => {
    const source = await load("tone.mp3");
    const { file } = await convertAudio({ file: source, format: "mp3", bitrate: "320" }, {});
    expect(await probe(file)).toMatchObject({ codec: "mp3", channels: 2 });
    // 源是 128 kbps
    expect(file.size).toBeGreaterThan(source.size * 2);
  });

  it("decodes MP3 into 16-bit WAV", async () => {
    const { file } = await convertAudio(
      { file: await load("tone.mp3"), format: "wav", bitrate: "192" },
      {},
    );
    expect(file.name).toBe("tone.wav");
    expect(file.type).toBe("audio/wav");
    expect(await probe(file)).toMatchObject({
      format: "WAVE",
      codec: "pcm-s16",
      channels: 2,
      sampleRate: 44_100,
    });
  });

  it("encodes AAC as Opus in OGG at 48 kHz", async () => {
    const { file } = await convertAudio(
      { file: await load("tone.m4a"), format: "ogg", bitrate: "128" },
      {},
    );
    expect(file.name).toBe("tone.ogg");
    expect(file.type).toBe("audio/ogg");
    expect(await probe(file)).toMatchObject({ codec: "opus", channels: 2, sampleRate: 48_000 });
  });

  it("encodes M4A where the browser has an AAC encoder, or says it can't", async () => {
    // Firefox 没有 AAC 编码器
    const expected = (await canEncodeAudio("aac"))
      ? { codec: "aac", channels: 2, sampleRate: 44_100 }
      : { code: "aac_unavailable", field: "format" };
    const result = await convertAudio(
      { file: await load("tone.ogg"), format: "m4a", bitrate: "192" },
      {},
    ).then(
      ({ file }) => (expect(file.name).toBe("tone.m4a"), probe(file)),
      (error: unknown) => error,
    );
    // Opus 源是 48 kHz，AAC 保留
    expect(result).toMatchObject(
      "codec" in expected ? { ...expected, sampleRate: 48_000 } : expected,
    );
  });

  it("reads FLAC except in WebKit", async () => {
    // WebKit 说能解码 FLAC，真正解码时失败：报出源 codec
    const running = convertAudio(
      { file: await load("tone.flac"), format: "mp3", bitrate: "192" },
      {},
    );
    const result =
      server.browser === "webkit"
        ? await running.catch(({ code, detail }: { code?: string; detail?: string }) => ({
            code,
            detail,
          }))
        : await probe((await running).file).then(({ codec, channels }) => ({ codec, channels }));
    expect(result).toEqual(
      server.browser === "webkit"
        ? { code: "unsupported_codec", detail: "flac" }
        : { codec: "mp3", channels: 2 },
    );
  });

  it.each(["m4a", "ogg"] as const)("encodes mono sound as %s at 320 kbps", async (format) => {
    const mono = wavOf(1, 44_100, 0.5);
    // Firefox 没有 AAC 编码器
    const expected =
      format === "m4a" && !(await canEncodeAudio("aac"))
        ? { code: "aac_unavailable" }
        : { channels: 1 };
    const result = await convertAudio({ file: mono, format, bitrate: "320" }, {}).then(
      ({ file }) => probe(file),
      (error: unknown) => error,
    );
    expect(result).toMatchObject(expected);
  });

  it("mixes surround sound down to stereo for lossy formats only", async () => {
    const surround = wavOf(6, 48_000, 0.5);
    const mp3 = await convertAudio({ file: surround, format: "mp3", bitrate: "192" }, {});
    expect(await probe(mp3.file)).toMatchObject({ codec: "mp3", channels: 2 });
    const wav = await convertAudio({ file: surround, format: "wav", bitrate: "192" }, {});
    expect(await probe(wav.file)).toMatchObject({ codec: "pcm-s16", channels: 6 });
  });

  it("resamples rates the encoder does not take", async () => {
    // LAME 接受 22.05 kHz，Opus 总是 48 kHz
    const low = wavOf(1, 22_050, 0.5);
    const mp3 = await convertAudio({ file: low, format: "mp3", bitrate: "128" }, {});
    expect(await probe(mp3.file)).toMatchObject({ channels: 1, sampleRate: 22_050 });
    const ogg = await convertAudio({ file: low, format: "ogg", bitrate: "128" }, {});
    expect(await probe(ogg.file)).toMatchObject({ channels: 1, sampleRate: 48_000 });
  });

  it("reports a file it can't read", async () => {
    const broken = new File(["not audio"], "broken.mp3", { type: "audio/mpeg" });
    await expect(
      convertAudio({ file: broken, format: "wav", bitrate: "192" }, {}),
    ).rejects.toMatchObject({ code: "invalid_audio", field: "file" });
  });

  it("cancels a running conversion when aborted", async () => {
    const controller = new AbortController();
    const running = convertAudio(
      { file: await load("tone.wav"), format: "mp3", bitrate: "192" },
      { signal: controller.signal, onProgress: () => controller.abort() },
    );
    await expect(running).rejects.toMatchObject({ name: "AbortError" });
  });
});
