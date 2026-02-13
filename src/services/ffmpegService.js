const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

function sanitizeRtmpUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  let cleaned = rawUrl
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  if (!cleaned) return '';

  // Facebook stream keys are usually copied in `FB-xxxx` format.
  // If user accidentally puts key in custom mode, normalize into full RTMPS URL.
  if (!/^rtmps?:\/\//i.test(cleaned) && /^FB-[A-Za-z0-9-]+$/i.test(cleaned.replace(/\s+/g, ''))) {
    cleaned = `rtmps://live-api-s.facebook.com:443/rtmp/${cleaned.replace(/\s+/g, '')}`;
  }

  if (/^rtmps?:\/\/live-api-s\.facebook\.com:443\/rtmp\/rtmps?:\/\//i.test(cleaned)) {
    cleaned = cleaned.replace(/^rtmps?:\/\/live-api-s\.facebook\.com:443\/rtmp\//i, '');
  }

  return cleaned;
}

function maskDestination(url) {
  if (!url) return '';
  const parts = url.split('/');
  const key = parts.pop() || '';
  const maskedKey = key.length <= 8 ? '***' : `${key.slice(0, 4)}***${key.slice(-4)}`;
  return `${parts.join('/')}/${maskedKey}`;
}

function startStream(videoPath, settings = { bitrate: '2500k', resolution: '1280x720', fps: 30 }, loop = false, customRtmp) {

  let absolutePath = videoPath;
  if (!fs.existsSync(absolutePath)) {
    absolutePath = path.resolve(process.cwd(), videoPath);
  }

  if (!fs.existsSync(absolutePath)) {
    logger.error(`FATAL: Video missing: ${absolutePath}`);
    return null;
  }

  const bitrate = settings.bitrate || '2500k';
  const fps = settings.fps || '30';
  const bufSize = (parseInt(bitrate) * 2) + 'k';

  let targetRes = settings.resolution || '1280x720';
  let [w, h] = targetRes.split('x').map(Number);
  if (w % 2 !== 0) w--;
  if (h % 2 !== 0) h--;
  if (w === 854) w = 852;

  const vfFilter = `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`;

  const args = [
    '-re',
    ...(loop ? ['-stream_loop', '-1'] : []),

    '-thread_queue_size', '1024',
    '-i', absolutePath,

    '-threads', '0',

    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-tune', 'zerolatency',
    '-profile:v', 'high',

    '-b:v', bitrate,
    '-maxrate', bitrate,
    '-minrate', bitrate,
    '-bufsize', bufSize,

    '-pix_fmt', 'yuv420p',
    '-g', (parseInt(fps) * 2).toString(),
    '-r', fps,

    '-vf', vfFilter,

    '-c:a', 'aac',
    '-ac', '2',
    '-ar', '44100',
    '-b:a', '128k',
  ];

  let destinationStr = '';

  const targets = Array.isArray(customRtmp)
    ? customRtmp.map(sanitizeRtmpUrl).filter(Boolean)
    : [sanitizeRtmpUrl(customRtmp)].filter(Boolean);

  if (targets.length === 0) {
    logger.error('FATAL: Empty RTMP destination after sanitization.');
    return null;
  }

  if (Array.isArray(customRtmp)) {
    const outputs = targets.map(url => `[f=flv:onfail=ignore]${url}`);
    destinationStr = outputs.join('|');
  } else {
    destinationStr = `[f=flv:onfail=ignore]${targets[0]}`;
  }

  args.push(
    '-f', 'tee',
    '-map', '0:v',
    '-map', '0:a',
    destinationStr
  );

  logger.info(`System FFmpeg Start: ${w}x${h} @ ${fps}fps to ${targets.length} destination(s)`);
  logger.info(`Targets: ${targets.map(maskDestination).join(', ')}`);

  if (typeof global.addLog === 'function') {
    global.addLog(`FFmpeg start ${w}x${h} ${fps}fps -> ${targets.length} tujuan`, 'info');
  }

  const proc = spawn(ffmpeg, args);
  let lastLog = '';

  proc.stderr.on('data', data => {
    const chunk = data.toString();
    lastLog = chunk;

    if (/error|failed|invalid|denied|forbidden|refused|timed out|handshake/i.test(chunk)) {
      logger.error(`FFmpeg stderr: ${chunk.trim().slice(-300)}`);
      if (typeof global.addLog === 'function') {
        global.addLog(`FFmpeg: ${chunk.trim().slice(-140)}`, 'error');
      }
    }
  });

  proc.on('close', (code, signal) => {
    if (code !== 0 && code !== 255 && signal !== 'SIGTERM') {
      logger.error(`FFmpeg Error (${signal || code}). Log: ${lastLog.slice(-300)}`);
      if (typeof global.addLog === 'function') {
        global.addLog(`Stream gagal (${signal || code}): ${lastLog.slice(-140)}`, 'error');
      }
    } else {
      logger.info(`Stream stopped.`);
    }

    for (let videoId in global.streamProcesses) {
      if (global.streamProcesses[videoId].pid === proc.pid) {
        delete global.streamProcesses[videoId];
        global.io.emit('streamStatus', { videoId, running: false });
        break;
      }
    }
  });

  return proc;
}

module.exports = { startStream };
