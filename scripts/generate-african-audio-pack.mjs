#!/usr/bin/env node
/**
 * Afriata Static African Audio Pack Generator (Zero Runtime API Keys)
 *
 * Pre-renders curated African Mother Tongues, Linguistic Phylum Greetings, and
 * Extended Proverbs/Typology samples into compact 24 kHz mono MP3 assets:
 *   - Core Tier (Workbox precached, <= ~330 KB total): `public/audio/tongues/*.mp3`
 *   - Extended Tier (Workbox runtime CacheFirst):     `public/audio/tongues/extended/*.mp3`
 *
 * Open-Weight & Keyless Engines Used:
 * - Meta MMS-TTS ONNX (VITS models):
 *     - Yorùbá:               Xenova/mms-tts-yor
 *     - Akan (Twi/Fante):     onnx-community/mms-tts-aka-ONNX
 *     - Fon (Fongbe):         Devsyril/mms-tts-fon-sherpa-onnx
 *     - Wolof:                jaguaman09/mms-tts-wol-onnx
 *     - Afaan Oromoo:         hadamard-2/mms-tts-orm-onnx
 *     - Tamazight (Kabyle):   AitBAD/mms-tts-kab-sherpa
 *     - Malagasy:             elloza/mms-tts-mlg-onnx
 * - Microsoft Edge Neural Voices (keyless Read Aloud endpoint via msedge-tts):
 *     - Kiswahili (sw-KE-ZuriNeural), isiZulu / Nguni sister proxy (zu-ZA-ThandoNeural),
 *       Amharic (am-ET-MekdesNeural), Somali (so-SO-UbaxNeural), Maghrebi Arabic (ar-MA-MounaNeural),
 *       Phonetic proxies: en-NG-EzinneNeural, en-ZA-LeahNeural, fr-FR-DeniseNeural, pt-PT-RaquelNeural
 * - Google Translate TTS (keyless `ha` Hausa)
 *
 * Usage:
 *   npm run audio:generate
 *   # Optional first-time local tool install (kept out of production node_modules):
 *   # npm install --prefix /tmp/tts-test msedge-tts @huggingface/transformers onnxruntime-node
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public/audio/tongues');
const EXTENDED_OUT_DIR = path.join(OUT_DIR, 'extended');
const TMP_DIR = process.env.TTS_CACHE_DIR || '/tmp/afriata-tts-build';
const TOOL_PREFIX = process.env.TTS_TOOL_DIR || '/tmp/tts-test';

const requireFromHere = createRequire(import.meta.url);
function loadOptionalTool(pkgName) {
  const candidates = [
    pkgName,
    path.join(TOOL_PREFIX, 'node_modules/@huggingface/transformers/node_modules', pkgName),
    path.join(TOOL_PREFIX, 'node_modules', pkgName),
    path.join(ROOT, 'node_modules/@huggingface/transformers/node_modules', pkgName),
    path.join(ROOT, 'node_modules', pkgName),
  ];
  for (const candidate of candidates) {
    try {
      return requireFromHere(candidate);
    } catch (err) {
      if (err && err.code && err.code !== 'MODULE_NOT_FOUND') {
        continue;
      }
    }
  }
  throw new Error(
    `Missing optional audio generator dependency "${pkgName}". ` +
      `Install once in ${TOOL_PREFIX} via:\n  npm install --prefix ${TOOL_PREFIX} msedge-tts @huggingface/transformers onnxruntime-node`
  );
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadIfMissing(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) return destPath;
  ensureDir(path.dirname(destPath));
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return destPath;
}

async function downloadFirstAvailable(urls, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) return destPath;
  let lastErr;
  for (const url of urls) {
    try {
      return await downloadIfMissing(url, destPath);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error(`Failed to download any candidate URL for ${destPath}`);
}

function float32ToWavBuffer(samples, sampleRate = 16000) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i]);
    if (a > peak) peak = a;
  }
  const scale = peak > 0.0001 ? 0.9 / peak : 1.0;

  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i] * scale));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  return buffer;
}

function transcodeToNormalizedMp3(inputPath, outputMp3Path, bitrate = '32k') {
  ensureDir(path.dirname(outputMp3Path));
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      '-i',
      inputPath,
      '-af',
      'loudnorm=I=-16:TP=-1.5:LRA=11',
      '-ar',
      '24000',
      '-ac',
      '1',
      '-c:a',
      'libmp3lame',
      '-b:a',
      bitrate,
      outputMp3Path,
    ],
    { stdio: 'inherit' }
  );
}

function probeDurationSeconds(mp3Path) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mp3Path],
    { encoding: 'utf8' }
  ).trim();
  const parsed = Number.parseFloat(out);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : 2.5;
}

function computeWaveformProfile(mp3Path, buckets = 48) {
  const rawPcm = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', mp3Path, '-f', 'f32le', '-ac', '1', '-ar', '8000', 'pipe:1'],
    { maxBuffer: 10 * 1024 * 1024 }
  );
  const samples = new Float32Array(rawPcm.buffer, rawPcm.byteOffset, Math.floor(rawPcm.byteLength / 4));
  if (samples.length === 0) return Array(buckets).fill(0.15);

  const winSize = Math.max(1, Math.floor(samples.length / buckets));
  const rmsValues = [];
  for (let b = 0; b < buckets; b++) {
    const start = b * winSize;
    const end = b === buckets - 1 ? samples.length : Math.min(samples.length, start + winSize);
    let sumSq = 0;
    const count = Math.max(1, end - start);
    for (let i = start; i < end; i++) {
      sumSq += samples[i] * samples[i];
    }
    rmsValues.push(Math.sqrt(sumSq / count));
  }

  const maxRms = Math.max(...rmsValues, 0.0001);
  return rmsValues.map((v) => {
    const norm = Math.pow(v / maxRms, 0.85);
    return Number(Math.max(0.06, Math.min(1.0, norm)).toFixed(2));
  });
}

async function synthesizeEdge(voice, text, outMp3, bitrate) {
  const { MsEdgeTTS, OUTPUT_FORMAT } = loadOptionalTool('msedge-tts');
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const chunks = [];
  for await (const c of audioStream) chunks.push(c);
  const rawMp3 = path.join(TMP_DIR, `${path.basename(outMp3, '.mp3')}.raw.mp3`);
  ensureDir(TMP_DIR);
  fs.writeFileSync(rawMp3, Buffer.concat(chunks));
  tts.close?.();
  transcodeToNormalizedMp3(rawMp3, outMp3, bitrate);
  fs.rmSync(rawMp3, { force: true });
}

async function synthesizeGoogleTranslate(tl, text, outMp3, bitrate) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(tl)}&client=tw-ob`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`Google TTS HTTP ${res.status} for tl=${tl}`);
  const rawMp3 = path.join(TMP_DIR, `${path.basename(outMp3, '.mp3')}.gtts.mp3`);
  ensureDir(TMP_DIR);
  fs.writeFileSync(rawMp3, Buffer.from(await res.arrayBuffer()));
  transcodeToNormalizedMp3(rawMp3, outMp3, bitrate);
  fs.rmSync(rawMp3, { force: true });
}

let activeOnnxState = null;

async function releaseActiveOnnxSession() {
  if (!activeOnnxState) return;
  try {
    await activeOnnxState.sess?.release?.();
  } catch {
    // Ignore session release error
  }
  try {
    fs.rmSync(activeOnnxState.dir, { recursive: true, force: true });
  } catch {
    // Ignore temp dir removal error
  }
  activeOnnxState = null;
}

async function getSingleOnnxSession(repoId, modelPath, dir) {
  const ort = loadOptionalTool('onnxruntime-node');
  if (activeOnnxState && activeOnnxState.repoId === repoId) {
    return activeOnnxState.sess;
  }
  await releaseActiveOnnxSession();
  const sess = await ort.InferenceSession.create(modelPath, {
    intraOpNumThreads: 2,
    interOpNumThreads: 1,
  });
  activeOnnxState = { repoId, sess, dir };
  return sess;
}

function buildVitsInputsForSession(sess, ids) {
  const ort = loadOptionalTool('onnxruntime-node');
  const names = sess.inputNames;
  const feeds = {};

  if (names.includes('input_ids')) {
    feeds.input_ids = new ort.Tensor('int64', BigInt64Array.from(ids), [1, ids.length]);
    if (names.includes('attention_mask')) {
      feeds.attention_mask = new ort.Tensor('int64', BigInt64Array.from(ids.map(() => 1n)), [1, ids.length]);
    }
    if (names.includes('scales')) {
      feeds.scales = new ort.Tensor('float32', Float32Array.from([0.667, 1.0, 0.8]), [3]);
    }
    return feeds;
  }

  for (const name of names) {
    if (name === 'x' || name === names[0]) {
      feeds[name] = new ort.Tensor('int64', BigInt64Array.from(ids), [1, ids.length]);
    } else if (name === 'x_length' || name === 'x_lengths') {
      feeds[name] = new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]);
    } else if (name === 'noise_scale') {
      feeds[name] = new ort.Tensor('float32', Float32Array.from([0.667]), [1]);
    } else if (name === 'length_scale') {
      feeds[name] = new ort.Tensor('float32', Float32Array.from([1.05]), [1]);
    } else if (name === 'noise_scale_w') {
      feeds[name] = new ort.Tensor('float32', Float32Array.from([0.8]), [1]);
    } else if (name === 'scales') {
      feeds[name] = new ort.Tensor('float32', Float32Array.from([0.667, 1.0, 0.8]), [3]);
    } else if (name === 'sid') {
      feeds[name] = new ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
    }
  }
  return feeds;
}

async function synthesizeHfOnnxVocabModel(repoId, text, outMp3, bitrate) {
  const ort = loadOptionalTool('onnxruntime-node');
  const safeName = repoId.replace(/[^a-zA-Z0-9_-]/g, '__');
  const dir = path.join(TMP_DIR, safeName);

  await downloadFirstAvailable(
    [
      `https://huggingface.co/${repoId}/resolve/main/onnx/model.onnx`,
      `https://huggingface.co/${repoId}/resolve/main/model.onnx`,
    ],
    path.join(dir, 'model.onnx')
  );
  await downloadIfMissing(`https://huggingface.co/${repoId}/resolve/main/vocab.json`, path.join(dir, 'vocab.json'));
  await downloadFirstAvailable(
    [
      `https://huggingface.co/${repoId}/resolve/main/tokenizer_config.json`,
      `https://huggingface.co/${repoId}/resolve/main/config.json`,
    ],
    path.join(dir, 'tokenizer_config.json')
  ).catch(() => null);

  const vocab = JSON.parse(fs.readFileSync(path.join(dir, 'vocab.json'), 'utf8'));
  const tokCfgPath = path.join(dir, 'tokenizer_config.json');
  const tokCfg = fs.existsSync(tokCfgPath) ? JSON.parse(fs.readFileSync(tokCfgPath, 'utf8')) : {};
  const sess = await getSingleOnnxSession(repoId, path.join(dir, 'model.onnx'), dir);

  const normalized = text.normalize('NFC').toLowerCase();
  const ids = [];
  const addBlank = tokCfg.add_blank !== false;
  for (const ch of normalized) {
    let tokId = vocab[ch];
    if (tokId === undefined) {
      const stripped = ch.normalize('NFD').replace(/\p{M}/gu, '');
      tokId = vocab[stripped];
    }
    if (tokId !== undefined) {
      if (addBlank) ids.push(0n);
      ids.push(BigInt(tokId));
    }
  }
  if (addBlank) ids.push(0n);
  if (ids.length === 0) ids.push(0n);

  const feeds = buildVitsInputsForSession(sess, ids);
  const out = await sess.run(feeds);
  const wavTensor = out[sess.outputNames[0]];
  const rawWav = path.join(TMP_DIR, `${path.basename(outMp3, '.mp3')}.wav`);
  ensureDir(TMP_DIR);
  fs.writeFileSync(rawWav, float32ToWavBuffer(wavTensor.data, 16000));
  transcodeToNormalizedMp3(rawWav, outMp3, bitrate);
  fs.rmSync(rawWav, { force: true });
}

async function synthesizeSherpaOnnxModel(repoId, text, outMp3, bitrate) {
  const safeName = repoId.replace(/[^a-zA-Z0-9_-]/g, '__');
  const dir = path.join(TMP_DIR, safeName);

  await downloadFirstAvailable(
    [
      `https://huggingface.co/${repoId}/resolve/main/model.onnx`,
      `https://huggingface.co/${repoId}/resolve/main/onnx/model.onnx`,
    ],
    path.join(dir, 'model.onnx')
  );
  await downloadIfMissing(`https://huggingface.co/${repoId}/resolve/main/tokens.txt`, path.join(dir, 'tokens.txt'));

  const tokMap = {};
  for (const line of fs.readFileSync(path.join(dir, 'tokens.txt'), 'utf8').split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const token = parts[0];
      const idx = parseInt(parts[1], 10);
      if (Number.isFinite(idx)) tokMap[token] = idx;
    }
  }

  const sess = await getSingleOnnxSession(repoId, path.join(dir, 'model.onnx'), dir);

  const ids = [0n];
  for (const ch of text.normalize('NFC').toLowerCase()) {
    let id = tokMap[ch];
    if (id === undefined) {
      const stripped = ch.normalize('NFD').replace(/\p{M}/gu, '');
      id = tokMap[stripped];
    }
    if (id !== undefined) ids.push(BigInt(id), 0n);
  }
  if (ids.length <= 1 && tokMap[' '] !== undefined) {
    ids.push(BigInt(tokMap[' ']), 0n);
  }

  const feeds = buildVitsInputsForSession(sess, ids);
  const out = await sess.run(feeds);
  const wavTensor = out[sess.outputNames[0]];
  const rawWav = path.join(TMP_DIR, `${path.basename(outMp3, '.mp3')}.wav`);
  ensureDir(TMP_DIR);
  fs.writeFileSync(rawWav, float32ToWavBuffer(wavTensor.data, 16000));
  transcodeToNormalizedMp3(rawWav, outMp3, bitrate);
  fs.rmSync(rawWav, { force: true });
}

const CLIP_SPECS = [
  // =========================================================================
  // TIER 1 (CORE PRECACHED): 18 Mother Tongues
  // =========================================================================
  {
    id: 'mother-yoruba',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Yorùbá',
    langTag: 'yo-NG',
    displayPhrase: 'Báwo ni?',
    spokenInput: 'Báwo ni?',
    engine: 'hf-onnx-vocab',
    model: 'Xenova/mms-tts-yor',
    provenanceBadge: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
  {
    id: 'mother-igbo',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Igbo',
    langTag: 'ig-NG',
    displayPhrase: 'Ndewo / Kèdú?',
    spokenInput: 'Nday-woh! Keh-doo?',
    engine: 'edge',
    voice: 'en-NG-EzinneNeural',
    provenanceBadge: 'Nigerian English Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Nigerian English neural phonetic rendering used because open-weight Igbo ONNX synthesis weights are unavailable for browser/Node VITS inference.',
  },
  {
    id: 'mother-hausa',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Hausa',
    langTag: 'ha-NG',
    displayPhrase: 'Sannu / Ina kwana?',
    spokenInput: 'Sannu! Ina kwana?',
    engine: 'gtts',
    tl: 'ha',
    provenanceBadge: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  {
    id: 'mother-swahili',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Kiswahili',
    langTag: 'sw-KE',
    displayPhrase: 'Hujambo / Habari yako?',
    spokenInput: 'Hujambo! Habari yako?',
    engine: 'edge',
    voice: 'sw-KE-ZuriNeural',
    provenanceBadge: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  {
    id: 'mother-kabuverdianu',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Kriolu (Kabuverdianu)',
    langTag: 'pt-CV',
    displayPhrase: 'Munti sabi! / Modi ki bu sta?',
    spokenInput: 'Múnti sábi! Módi qui bu stá?',
    engine: 'edge',
    voice: 'pt-PT-RaquelNeural',
    provenanceBadge: 'Kabuverdianu Lusophone Proxy',
    isProxy: true,
    proxyNote: 'Rendered with European Lusophone neural voice reading adapted Criolu phonetic orthography as closest non-palatalizing cognate.',
  },
  {
    id: 'mother-akan',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Akan (Twi / Fante)',
    langTag: 'ak-GH',
    displayPhrase: 'Akwaaba! / Wo ho te sɛn?',
    spokenInput: 'Akwaaba! Wo ho te sɛn?',
    engine: 'hf-onnx-vocab',
    model: 'onnx-community/mms-tts-aka-ONNX',
    provenanceBadge: 'Meta MMS-TTS (Akan/Twi VITS)',
    isProxy: false,
  },
  {
    id: 'mother-fon',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Fon (Fongbe)',
    langTag: 'fr-BJ',
    displayPhrase: 'Kú dɔ / Mi kwabo!',
    spokenInput: 'Kú dɔ! Mi kwabo!',
    engine: 'sherpa-onnx',
    model: 'Devsyril/mms-tts-fon-sherpa-onnx',
    provenanceBadge: 'Meta MMS-TTS (Fongbe VITS)',
    isProxy: false,
  },
  {
    id: 'mother-zulu',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'isiZulu',
    langTag: 'zu-ZA',
    displayPhrase: 'Sawubona!',
    spokenInput: 'Sawubona!',
    engine: 'edge',
    voice: 'zu-ZA-ThandoNeural',
    provenanceBadge: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  {
    id: 'mother-amharic',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Amharic',
    langTag: 'am-ET',
    displayPhrase: 'Selam! (ሰላም) / Tena Yistillign',
    spokenInput: 'ሰላም! ጤና ይስጥልኝ።',
    engine: 'edge',
    voice: 'am-ET-MekdesNeural',
    provenanceBadge: 'Amharic Ethiopia Neural',
    isProxy: false,
  },
  {
    id: 'mother-arabic_maghrebi',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Maghrebi Arabic (Darija)',
    langTag: 'ar-MA',
    displayPhrase: 'Salam Aleikoum / Labas?',
    spokenInput: 'السلام عليكم! لاباس؟',
    engine: 'edge',
    voice: 'ar-MA-MounaNeural',
    provenanceBadge: 'Maghrebi Arabic Neural',
    isProxy: false,
  },
  {
    id: 'mother-tamazight',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Tamazight (Amazigh / Kabyle)',
    langTag: 'kab-DZ',
    displayPhrase: 'Azul! Amek tettiliḍ?',
    spokenInput: 'Azul! Amek tettiliḍ?',
    engine: 'sherpa-onnx',
    model: 'AitBAD/mms-tts-kab-sherpa',
    provenanceBadge: 'Meta MMS-TTS (Tamazight / Kabyle VITS)',
    isProxy: false,
  },
  {
    id: 'mother-wolof',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Wolof',
    langTag: 'wo-SN',
    displayPhrase: 'Nanga def? / Mangi fi rekk',
    spokenInput: 'Nanga def? Mangi fi rekk.',
    engine: 'hf-onnx-vocab',
    model: 'jaguaman09/mms-tts-wol-onnx',
    provenanceBadge: 'Meta MMS-TTS (Wolof VITS)',
    isProxy: false,
  },
  {
    id: 'mother-oromo',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Afaan Oromoo',
    langTag: 'om-ET',
    displayPhrase: 'Akkam jirta? / Nagaa!',
    spokenInput: 'Akkam jirta? Nagaa!',
    engine: 'sherpa-onnx',
    model: 'hadamard-2/mms-tts-orm-onnx',
    provenanceBadge: 'Meta MMS-TTS (Afaan Oromoo VITS)',
    isProxy: false,
  },
  {
    id: 'mother-somali',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Af-Soomaali',
    langTag: 'so-SO',
    displayPhrase: 'Iska warran? / Nabad!',
    spokenInput: 'Iska warran? Nabad!',
    engine: 'edge',
    voice: 'so-SO-UbaxNeural',
    provenanceBadge: 'Somali Horn of Africa Neural',
    isProxy: false,
  },
  {
    id: 'mother-xhosa',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'isiXhosa',
    langTag: 'xh-ZA',
    displayPhrase: 'Molo! Kunjani?',
    spokenInput: 'Molo! Kunjani?',
    engine: 'edge',
    voice: 'zu-ZA-ThandoNeural',
    provenanceBadge: 'Nguni Sister-Voice Proxy (isiZulu)',
    isProxy: true,
    proxyNote: 'Synthesized with isiZulu Nguni sister-language neural voice; shares dental, alveolar, and lateral click consonant phonology.',
  },
  {
    id: 'mother-lingala',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Lingála',
    langTag: 'ln-CD',
    displayPhrase: 'Mbote na yo! Sango nini?',
    spokenInput: 'Mboté na yô! Sángo níni?',
    engine: 'edge',
    voice: 'fr-FR-DeniseNeural',
    provenanceBadge: 'Francophone Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Central African Francophone phonetic reading proxy used because open-weight Lingála VITS ONNX weights are unavailable.',
  },
  {
    id: 'mother-fula',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Fula (Fulfulde / Pulaar)',
    langTag: 'ff-SN',
    displayPhrase: 'A jaaraama! No mbadda?',
    spokenInput: 'A djaaraama! No mbadda?',
    engine: 'edge',
    voice: 'fr-FR-DeniseNeural',
    provenanceBadge: 'Sahelian Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Sahelian Francophone phonetic proxy used because Pulaar/Fulfulde ONNX weights are unavailable in browser/Node inference.',
  },
  {
    id: 'mother-khoekhoegowab',
    tier: 'core',
    kind: 'mother-tongue',
    language: 'Khoekhoegowab (Nama / Damara)',
    langTag: 'naq-NA',
    displayPhrase: 'ǃGâi tsēs! Matisa?',
    spokenInput: 'Gai tses! Matisa?',
    engine: 'edge',
    voice: 'en-ZA-LeahNeural',
    provenanceBadge: 'Southern African Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Southern African English phonetic approximation; orthographic click consonants (ǀ, ǁ, ǃ, ǂ) are described in IPA since open-weight neural click synthesis does not yet exist.',
  },

  // =========================================================================
  // TIER 1 (CORE PRECACHED): 6 Linguistic Phylum Welcome Greetings
  // =========================================================================
  {
    id: 'family-niger-congo',
    tier: 'core',
    kind: 'language-family',
    language: 'Kiswahili & Niger-Congo',
    langTag: 'sw-KE',
    displayPhrase: 'Karibu Afriata—Mvumbuzi wa Kikabila wa Atlantiki.',
    spokenInput: 'Karibu Afriata, Mvumbuzi wa Kikabila wa Atlantiki.',
    engine: 'edge',
    voice: 'sw-KE-ZuriNeural',
    provenanceBadge: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  {
    id: 'family-afroasiatic',
    tier: 'core',
    kind: 'language-family',
    language: 'Hausa & Afroasiatic',
    langTag: 'ha-NG',
    displayPhrase: 'Barka da zuwa Afriata—Mai Binciken Kabilun Atlantika.',
    spokenInput: 'Barka da zuwa Afriata, Mai Binciken Kabilun Atlantika.',
    engine: 'gtts',
    tl: 'ha',
    provenanceBadge: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  {
    id: 'family-nilo-saharan',
    tier: 'core',
    kind: 'language-family',
    language: 'Luo & Nilo-Saharan',
    langTag: 'luo-KE',
    displayPhrase: 'Yawa, karibu Afriata—Jagol kido mar Atlantic.',
    spokenInput: 'Yawa, karibu Afriata, Jagol kido mar Atlantic.',
    engine: 'edge',
    voice: 'sw-KE-ZuriNeural',
    provenanceBadge: 'East African Neural Proxy (Kiswahili)',
    isProxy: true,
    proxyNote: 'Rendered via East African Kiswahili neural voice reading Dholuo orthography.',
  },
  {
    id: 'family-austronesian',
    tier: 'core',
    kind: 'language-family',
    language: 'Malagasy & Austronesian',
    langTag: 'mg-MG',
    displayPhrase: "Tonga soa eto amin'ny Afriata—Mpikaroka ny foko Atlantika.",
    spokenInput: "Tonga soa eto amin'ny Afriata, Mpikaroka ny foko Atlantika.",
    engine: 'hf-onnx-vocab',
    model: 'elloza/mms-tts-mlg-onnx',
    provenanceBadge: 'Meta MMS-TTS (Malagasy VITS)',
    isProxy: false,
  },
  {
    id: 'family-khoisan',
    tier: 'core',
    kind: 'language-family',
    language: 'Nama & Khoe-San',
    langTag: 'naq-NA',
    displayPhrase: 'ǁKhawa ǃgû re Afriata—Atlantic ǃAosab ǃKhôa-aos.',
    spokenInput: 'Khawa goo ray Afriata, Atlantic Aosab Khoa-aos.',
    engine: 'edge',
    voice: 'en-ZA-LeahNeural',
    provenanceBadge: 'Southern African Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Southern African phonetic framing of Khoekhoegowab greeting orthography.',
  },
  {
    id: 'family-indo-european',
    tier: 'core',
    kind: 'language-family',
    language: 'Kriolu & Atlantic Creoles',
    langTag: 'pt-CV',
    displayPhrase: 'Bem-bindu na Afriata—Splorador Étniku di Atlântiku.',
    spokenInput: 'Bêm-bíndu na Afriáta, Sploradôr Étnicu di Atlânticu.',
    engine: 'edge',
    voice: 'pt-PT-RaquelNeural',
    provenanceBadge: 'Kabuverdianu Lusophone Proxy',
    isProxy: true,
    proxyNote: 'European Lusophone neural voice reading Kabuverdianu phonetic orthography.',
  },

  // =========================================================================
  // TIER 2 (EXTENDED RUNTIME CACHE): Proverbs & Typological Samples
  // =========================================================================
  {
    id: 'proverb-yoruba',
    tier: 'extended',
    kind: 'proverb',
    language: 'Yorùbá Proverb',
    langTag: 'yo-NG',
    displayPhrase: 'Ilé la ti ń kọ́ èṣọ́ ròde.',
    spokenInput: 'Ilé la ti ń kọ́ èṣọ́ ròde.',
    engine: 'hf-onnx-vocab',
    model: 'Xenova/mms-tts-yor',
    provenanceBadge: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
  {
    id: 'proverb-swahili',
    tier: 'extended',
    kind: 'proverb',
    language: 'Kiswahili Proverb',
    langTag: 'sw-KE',
    displayPhrase: 'Kidogo kidogo hujaza kibaba.',
    spokenInput: 'Kidogo kidogo hujaza kibaba.',
    engine: 'edge',
    voice: 'sw-KE-ZuriNeural',
    provenanceBadge: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  {
    id: 'proverb-zulu',
    tier: 'extended',
    kind: 'proverb',
    language: 'isiZulu Ubuntu Proverb',
    langTag: 'zu-ZA',
    displayPhrase: 'Umuntu ngumuntu ngabantu.',
    spokenInput: 'Umuntu ngumuntu ngabantu.',
    engine: 'edge',
    voice: 'zu-ZA-ThandoNeural',
    provenanceBadge: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  {
    id: 'proverb-amharic',
    tier: 'extended',
    kind: 'proverb',
    language: 'Amharic Proverb',
    langTag: 'am-ET',
    displayPhrase: 'ድር ቢያብር አንበሳ ያስር።',
    spokenInput: 'ድር ቢያብር አንበሳ ያስር።',
    engine: 'edge',
    voice: 'am-ET-MekdesNeural',
    provenanceBadge: 'Amharic Ethiopia Neural',
    isProxy: false,
  },
  {
    id: 'proverb-hausa',
    tier: 'extended',
    kind: 'proverb',
    language: 'Hausa Proverb',
    langTag: 'ha-NG',
    displayPhrase: 'Gani ya kori ji.',
    spokenInput: 'Gani ya kori ji.',
    engine: 'gtts',
    tl: 'ha',
    provenanceBadge: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  {
    id: 'proverb-akan',
    tier: 'extended',
    kind: 'proverb',
    language: 'Akan Sankofa Proverb',
    langTag: 'ak-GH',
    displayPhrase: 'Sankofa: Wɔnkyi sɛ w’akɔfa nea w’akyi akyi.',
    spokenInput: 'Sankofa! Wɔnkyi sɛ wɔakɔfa nea wɔagyaw akyi.',
    engine: 'hf-onnx-vocab',
    model: 'onnx-community/mms-tts-aka-ONNX',
    provenanceBadge: 'Meta MMS-TTS (Akan/Twi VITS)',
    isProxy: false,
  },
  {
    id: 'proverb-fon',
    tier: 'extended',
    kind: 'proverb',
    language: 'Fon Proverb',
    langTag: 'fr-BJ',
    displayPhrase: 'Nǔ ɖé sín nu wɛ nyí gbɛ̀.',
    spokenInput: 'Nǔ ɖé sín nu wɛ nyí gbɛ̀.',
    engine: 'sherpa-onnx',
    model: 'Devsyril/mms-tts-fon-sherpa-onnx',
    provenanceBadge: 'Meta MMS-TTS (Fongbe VITS)',
    isProxy: false,
  },
  {
    id: 'proverb-wolof',
    tier: 'extended',
    kind: 'proverb',
    language: 'Wolof Proverb',
    langTag: 'wo-SN',
    displayPhrase: 'Nit, nit ay garabam.',
    spokenInput: 'Nit, nit ay garabam.',
    engine: 'hf-onnx-vocab',
    model: 'jaguaman09/mms-tts-wol-onnx',
    provenanceBadge: 'Meta MMS-TTS (Wolof VITS)',
    isProxy: false,
  },
  {
    id: 'proverb-oromo',
    tier: 'extended',
    kind: 'proverb',
    language: 'Afaan Oromoo Proverb',
    langTag: 'om-ET',
    displayPhrase: 'Walii galan alaa galan.',
    spokenInput: 'Walii galan alaa galan.',
    engine: 'sherpa-onnx',
    model: 'hadamard-2/mms-tts-orm-onnx',
    provenanceBadge: 'Meta MMS-TTS (Afaan Oromoo VITS)',
    isProxy: false,
  },
  {
    id: 'proverb-somali',
    tier: 'extended',
    kind: 'proverb',
    language: 'Af-Soomaali Proverb',
    langTag: 'so-SO',
    displayPhrase: 'Gacmo wadajir bay wax ku gooyaan.',
    spokenInput: 'Gacmo wadajir bay wax ku gooyaan.',
    engine: 'edge',
    voice: 'so-SO-UbaxNeural',
    provenanceBadge: 'Somali Horn of Africa Neural',
    isProxy: false,
  },
  {
    id: 'proverb-arabic_maghrebi',
    tier: 'extended',
    kind: 'proverb',
    language: 'Maghrebi Arabic Proverb',
    langTag: 'ar-MA',
    displayPhrase: 'اليد الواحدة ما كتصفقش.',
    spokenInput: 'اليد الواحدة ما كتصفقش.',
    engine: 'edge',
    voice: 'ar-MA-MounaNeural',
    provenanceBadge: 'Maghrebi Arabic Neural',
    isProxy: false,
  },
  {
    id: 'proverb-tamazight',
    tier: 'extended',
    kind: 'proverb',
    language: 'Tamazight Proverb',
    langTag: 'kab-DZ',
    displayPhrase: 'Afus deg ufus, ad yifsus wugur.',
    spokenInput: 'Afus deg ufus, ad yifsus wugur.',
    engine: 'sherpa-onnx',
    model: 'AitBAD/mms-tts-kab-sherpa',
    provenanceBadge: 'Meta MMS-TTS (Tamazight / Kabyle VITS)',
    isProxy: false,
  },
  {
    id: 'typology-nguni-clicks',
    tier: 'extended',
    kind: 'typology',
    language: 'Nguni Click Contrast Sample',
    langTag: 'zu-ZA',
    displayPhrase: 'i-cici · i-xoxo · Sawubona',
    spokenInput: 'icici! ixoxo! Sawubona!',
    engine: 'edge',
    voice: 'zu-ZA-ThandoNeural',
    provenanceBadge: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  {
    id: 'typology-yoruba-tones',
    tier: 'extended',
    kind: 'typology',
    language: 'Yorùbá Lexical Tone Minimal Set',
    langTag: 'yo-NG',
    displayPhrase: 'ọwọ́ · ọwọ̀ · ọwọ',
    spokenInput: 'ọwọ́! ọwọ̀! ọwọ!',
    engine: 'hf-onnx-vocab',
    model: 'Xenova/mms-tts-yor',
    provenanceBadge: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
  // Pre-rendered Top-Bar UI Language Greetings (Eliminates runtime cloud TTS calls)
  {
    id: 'ui-greeting-en',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'English (UI Greeting)',
    langTag: 'en-NG',
    displayPhrase: 'Welcome to the Afriata experience, the Atlantic Ethnic Explorer. Please enjoy.',
    spokenInput: 'Welcome to the Afriata experience, the Atlantic Ethnic Explorer. Please enjoy.',
    engine: 'gtts',
    tl: 'en',
    provenanceBadge: 'Pre-rendered Static Neural Audio (English)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-fr',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Français (UI Greeting)',
    langTag: 'fr-FR',
    displayPhrase: "Bienvenue dans l'expérience Afriata, l'explorateur ethnique de l'Atlantique. Bonne découverte.",
    spokenInput: "Bienvenue dans l'expérience Afriata, l'explorateur ethnique de l'Atlantique. Bonne découverte.",
    engine: 'gtts',
    tl: 'fr',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Français)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-pt',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Português (UI Greeting)',
    langTag: 'pt-PT',
    displayPhrase: 'Olá, bem-vindo à experiência Afriata, o Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    spokenInput: 'Olá, bem-vindo à experiência Afriata, o Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    engine: 'gtts',
    tl: 'pt-PT',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Português)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-es',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Español (UI Greeting)',
    langTag: 'es-ES',
    displayPhrase: 'Hola, bienvenido a la experiencia Afriata, el Explorador Étnico del Atlántico. Disfrute de su exploración.',
    spokenInput: 'Hola, bienvenido a la experiencia Afriata, el Explorador Étnico del Atlántico. Disfrute de su exploración.',
    engine: 'gtts',
    tl: 'es',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Español)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-it',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Italiano (UI Greeting)',
    langTag: 'it-IT',
    displayPhrase: "Ciao e benvenuto nell'esperienza Afriata, l'Esploratore Etnico dell'Atlantico. Buona scoperta.",
    spokenInput: "Ciao e benvenuto nell'esperienza Afriata, l'Esploratore Etnico dell'Atlantico. Buona scoperta.",
    engine: 'gtts',
    tl: 'it',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Italiano)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-nl',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Nederlands (UI Greeting)',
    langTag: 'nl-NL',
    displayPhrase: 'Hallo, welkom bij de Afriata-ervaring, de Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    spokenInput: 'Hallo, welkom bij de Afriata-ervaring, de Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    engine: 'gtts',
    tl: 'nl',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Nederlands)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-de',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'Deutsch (UI Greeting)',
    langTag: 'de-DE',
    displayPhrase: 'Willkommen zum Afriata-Erlebnis, der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    spokenInput: 'Willkommen zum Afriata-Erlebnis, der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    engine: 'gtts',
    tl: 'de',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Deutsch)',
    isProxy: false,
  },
  {
    id: 'ui-greeting-ar',
    tier: 'core',
    kind: 'ui-greeting',
    language: 'العربية (UI Greeting)',
    langTag: 'ar-MA',
    displayPhrase: 'مرحباً بكم في تجربة أفرياتا، مستكشف التنوع الإفريقي والأطلسي.',
    spokenInput: 'مرحباً بكم في تجربة أفرياتا، مستكشف التنوع الإفريقي والأطلسي.',
    engine: 'gtts',
    tl: 'ar',
    provenanceBadge: 'Pre-rendered Static Neural Audio (Arabic)',
    isProxy: false,
  },
];

async function main() {
  ensureDir(OUT_DIR);
  ensureDir(EXTENDED_OUT_DIR);
  ensureDir(TMP_DIR);

  const onlyKindArg = process.argv.find((arg) => arg.startsWith('--only-kind='));
  const onlyKind = onlyKindArg ? onlyKindArg.slice('--only-kind='.length).trim() : '';
  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  const existingManifestMap = new Map();
  if (onlyKind && fs.existsSync(manifestPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      for (const entry of prev.clips || []) {
        existingManifestMap.set(entry.id, entry);
      }
    } catch {
      // Ignore malformed prior manifest
    }
  }

  const orderedEntries = new Array(CLIP_SPECS.length);
  let coreTotalBytes = 0;
  let extendedTotalBytes = 0;

  // Group execution by engine+model so each ONNX model downloads and loads only once
  const indexedSpecs = CLIP_SPECS
    .map((spec, idx) => ({ spec, idx }))
    .filter(({ spec, idx }) => {
      if (!onlyKind || spec.kind === onlyKind) return true;
      const existing = existingManifestMap.get(spec.id);
      if (!existing) return true;
      orderedEntries[idx] = existing;
      if (existing.tier === 'extended') {
        extendedTotalBytes += existing.bytes || 0;
      } else {
        coreTotalBytes += existing.bytes || 0;
      }
      return false;
    });
  indexedSpecs.sort((a, b) => {
    const keyA = `${a.spec.engine}:${a.spec.model || a.spec.voice || a.spec.tl || ''}`;
    const keyB = `${b.spec.engine}:${b.spec.model || b.spec.voice || b.spec.tl || ''}`;
    return keyA.localeCompare(keyB);
  });

  console.log(`Generating ${indexedSpecs.length} static voice clips into ${path.relative(ROOT, OUT_DIR)}...\n`);

  for (const { spec, idx } of indexedSpecs) {
    const isExtended = spec.tier === 'extended';
    const targetDir = isExtended ? EXTENDED_OUT_DIR : OUT_DIR;
    const outFile = `${spec.id}.mp3`;
    const relFile = isExtended ? `audio/tongues/extended/${outFile}` : `audio/tongues/${outFile}`;
    const outMp3 = path.join(targetDir, outFile);
    const bitrate = isExtended ? '36k' : '32k';

    if (spec.engine === 'edge') {
      await synthesizeEdge(spec.voice, spec.spokenInput, outMp3, bitrate);
    } else if (spec.engine === 'gtts') {
      await synthesizeGoogleTranslate(spec.tl, spec.spokenInput, outMp3, bitrate);
    } else if (spec.engine === 'hf-onnx-vocab') {
      await synthesizeHfOnnxVocabModel(spec.model, spec.spokenInput, outMp3, bitrate);
    } else if (spec.engine === 'sherpa-onnx') {
      await synthesizeSherpaOnnxModel(spec.model, spec.spokenInput, outMp3, bitrate);
    } else {
      throw new Error(`Unsupported engine ${spec.engine}`);
    }

    const bytes = fs.statSync(outMp3).size;
    const durationSeconds = probeDurationSeconds(outMp3);
    const waveformProfile = computeWaveformProfile(outMp3, 48);

    if (isExtended) {
      extendedTotalBytes += bytes;
    } else {
      coreTotalBytes += bytes;
    }

    orderedEntries[idx] = {
      id: spec.id,
      tier: spec.tier,
      kind: spec.kind,
      language: spec.language,
      langTag: spec.langTag,
      displayPhrase: spec.displayPhrase,
      file: relFile,
      engine: spec.voice || spec.model || `google-tts:${spec.tl}`,
      provenanceBadge: spec.provenanceBadge,
      isProxy: Boolean(spec.isProxy),
      ...(spec.proxyNote ? { proxyNote: spec.proxyNote } : {}),
      bytes,
      durationSeconds,
      waveformProfile,
    };

    console.log(
      `  ✓ [${spec.tier.padEnd(8)}] ${spec.id.padEnd(25)} ${(bytes / 1024).toFixed(1).padStart(5)} KB  ${durationSeconds.toFixed(2)}s  [${spec.voice || spec.model || spec.tl}]`
    );
  }

  await releaseActiveOnnxSession();
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  const manifestEntries = orderedEntries;

  const totalBytes = coreTotalBytes + extendedTotalBytes;
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        version: '2.0.0',
        generatedAt: new Date().toISOString(),
        coreTotalBytes,
        extendedTotalBytes,
        totalBytes,
        clips: manifestEntries,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  console.log(
    `\n✓ Generated ${manifestEntries.length} clips: core=${(coreTotalBytes / 1024).toFixed(1)} KB, extended=${(extendedTotalBytes / 1024).toFixed(1)} KB (total ${(totalBytes / 1024).toFixed(1)} KB) + manifest.json.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[AUDIO GENERATOR ERROR]', err);
  process.exit(1);
});
