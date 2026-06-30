// Applies RideYeah branding to the new photos/videos.
//  Images: logo (top-left) + rideyeah.com (bottom-right).
//  Videos: logo (top-left) + brand chip (bottom-right) — covers the Gemini ✦ watermark.
import { readdirSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/Users/reyna/Downloads/imagenes y videos de rideyeah 0628';
const DL = 'C:/Users/reyna/Downloads/RideYeah_Final';
const OVL = path.resolve('social/overlay');
const FFMPEG = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const FFPROBE = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');

const LOGO = path.join(OVL, 'brand-logo.png');
const URL = path.join(OVL, 'brand-url.png');
const CHIP = path.join(OVL, 'brand-chip.png');
const A = {
  logo: await sharp(LOGO).metadata(),
  url: await sharp(URL).metadata(),
  chip: await sharp(CHIP).metadata(),
};

mkdirSync(path.join(DL, 'images'), { recursive: true });
mkdirSync(path.join(DL, 'videos'), { recursive: true });

const clean = (f) => f.replace(/\.[^.]+$/, '').replace(/[·—]/g, '-').replace(/\s+/g, ' ').trim().replace(/\s/g, '_').replace(/_+/g, '_');

const files = readdirSync(SRC);

// ---------- IMAGES ----------
for (const f of files.filter((x) => /\.(jpe?g|png)$/i.test(x))) {
  const src = path.join(SRC, f);
  const m = await sharp(src).metadata();
  const W = m.width, H = m.height;
  const land = W >= H;
  const margin = Math.round((land ? 0.038 : 0.05) * W);
  const logoW = Math.round((land ? 0.16 : 0.27) * W);
  const urlW = Math.round((land ? 0.135 : 0.24) * W);
  const logoBuf = await sharp(LOGO).resize({ width: logoW }).png().toBuffer();
  const urlBuf = await sharp(URL).resize({ width: urlW }).png().toBuffer();
  const urlH = Math.round(urlW * (A.url.height / A.url.width));

  const out = path.join(DL, 'images', `${clean(f)}.jpg`);
  await sharp(src)
    .composite([
      { input: logoBuf, top: margin, left: margin },
      { input: urlBuf, top: H - margin - urlH, left: W - margin - urlW },
    ])
    .jpeg({ quality: 92 })
    .toFile(out);
  console.log('IMG', path.basename(out), `${W}x${H}`);
}

// ---------- VIDEOS ----------
for (const f of files.filter((x) => /\.mp4$/i.test(x))) {
  const src = path.join(SRC, f);
  const probe = JSON.parse(execFileSync(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', src,
  ]).toString()).streams[0];
  const W = probe.width, H = probe.height;
  const land = W >= H;
  const margin = Math.round((land ? 0.035 : 0.045) * W);
  const logoW = Math.round((land ? 0.16 : 0.26) * W);
  const chipW = Math.round((land ? 0.17 : 0.28) * W);

  const out = path.join(DL, 'videos', `${clean(f)}.mp4`);
  const fc = [
    `[1:v]scale=${logoW}:-1[lg]`,
    `[2:v]scale=${chipW}:-1[cp]`,
    `[0:v][lg]overlay=${margin}:${margin}[a]`,
    `[a][cp]overlay=W-w-${margin}:H-h-${margin}[v]`,
  ].join(';');
  execFileSync(FFMPEG, [
    '-y', '-i', src, '-i', LOGO, '-i', CHIP,
    '-filter_complex', fc, '-map', '[v]', '-map', '0:a?',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
    '-c:a', 'copy', '-movflags', '+faststart', out,
  ], { stdio: 'ignore' });
  console.log('VID', path.basename(out), `${W}x${H}`);
}
console.log('\nDone ->', DL);
