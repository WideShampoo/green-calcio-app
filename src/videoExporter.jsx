// videoExporter.js
// Export video 100% frontend tramite Canvas + Web Audio + MediaRecorder.
//
// File richiesti in /public:
//   /blur.wav
//   /selezione.mp3
//   /Dario_Rocchi.webp
//   /FrecciaGiu.png
//   /FrecciaSuDestra.png
//   /FrecciaGiuDestra.png
//   /FrecciaSu.png

const VIDEO_WIDTH = 1400;
const VIDEO_HEIGHT = 1420;
const VIDEO_DURATION = 30;
const FPS = 30;



// Reveal giocatori.
const PLAYER_REVEAL_START = 16.0;
const PLAYER_REVEAL_END = 19.85;

// Quanto dura il lampo arancione prima/durante la comparsa.
const SELECT_FLASH_SECONDS = 0.20;

const OLD_FONT = 'Consolas, "Courier New", monospace';

const ROLE_ORDER = { POR: 0, DIF: 1, CEN: 2, ATT: 3, AUTO: 4 };
const ROLE_LABELS = { POR: 'PT', DIF: 'DI', CEN: 'CC', ATT: 'AT', AUTO: '--' };
const ROLE_COLORS = {
  POR: '#e4cf25',
  DIF: '#2988b8',
  CEN: '#31a35b',
  ATT: '#d74b48',
  AUTO: '#888888'
};

const clamp01 = value => Math.max(0, Math.min(1, value));
const easeOut = t => 1 - Math.pow(1 - clamp01(t), 3);

const loadImage = src => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const safeLoadImage = async src => {
  try {
    return await loadImage(src);
  } catch (error) {
    console.warn(`Impossibile caricare ${src}`, error);
    return null;
  }
};

const fetchAudioBuffer = async (audioContext, src) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Impossibile caricare ${src}`);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
};

const chooseMimeType = () => {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4'
  ];

  return candidates.find(type =>
    typeof MediaRecorder !== 'undefined' &&
    typeof MediaRecorder.isTypeSupported === 'function' &&
    MediaRecorder.isTypeSupported(type)
  ) || '';
};

const primaryRole = (player, getPlayerRoles, isGoalkeeperPlayer) => {
  if (isGoalkeeperPlayer(player)) return 'POR';
  return getPlayerRoles(player)[0] || 'AUTO';
};

const sortPlayers = (team, getPlayerRoles, isGoalkeeperPlayer) =>
  [...(team.players || [])].sort((a, b) => {
    const ar = primaryRole(a, getPlayerRoles, isGoalkeeperPlayer);
    const br = primaryRole(b, getPlayerRoles, isGoalkeeperPlayer);
    const diff = (ROLE_ORDER[ar] ?? 99) - (ROLE_ORDER[br] ?? 99);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
  });

const getRoleAverage = (players, role, getPlayerRoles) => {
  const filtered = players.filter(player => getPlayerRoles(player).includes(role));
  if (!filtered.length) return 0;
  return filtered.reduce((sum, player) => sum + player.rating, 0) / filtered.length;
};

const getRadarValues = (team, getPlayerRoles) => ({
  TOT: team.players.length
    ? team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length
    : 0,
  POR: (() => {
    const value = getRoleAverage(team.players, 'POR', getPlayerRoles);
    return value > 0 ? value : 3;
  })(),
  DIF: getRoleAverage(team.players, 'DIF', getPlayerRoles),
  CEN: getRoleAverage(team.players, 'CEN', getPlayerRoles),
  ATT: getRoleAverage(team.players, 'ATT', getPlayerRoles)
});

const drawStretchedText = (ctx, text, x, y, stretchX = 1, align = 'left') => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(stretchX, 1);
  ctx.textAlign = align;
  ctx.fillText(text, 0, 0);
  ctx.restore();
};

const fitName = (ctx, name, maxWidth, font) => {
  ctx.font = font;
  if (ctx.measureText(name).width <= maxWidth) return name;

  let text = name;
  while (text.length > 1 && ctx.measureText(`${text}…`).width > maxWidth) {
    text = text.slice(0, -1);
  }
  return `${text}…`;
};

const drawRoleBox = (ctx, player, x, cy, getPlayerRoles, isGoalkeeperPlayer, right = false) => {
  const role = primaryRole(player, getPlayerRoles, isGoalkeeperPlayer);
  const code = ROLE_LABELS[role] || '--';
  const w = 72;
  const h = 44;
  const bx = right ? x - w : x;
  const by = cy - h / 2;

  ctx.fillStyle = '#080a09';
  ctx.fillRect(bx, by, w, h);

  ctx.strokeStyle = ROLE_COLORS[role] || '#888';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(bx, by + h - 2.5);
  ctx.lineTo(bx + w, by + h - 2.5);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Arial Black", Impact, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, bx + w / 2, cy - 1, w - 4);
};

const drawSecondaryTags = (
  ctx,
  player,
  x,
  y,
  getPlayerRoles,
  isGoalkeeperPlayer,
  right = false
) => {
  const main = primaryRole(player, getPlayerRoles, isGoalkeeperPlayer);
  const secondary = getPlayerRoles(player).filter(role => role !== main);
  let cursor = x;

  secondary.forEach(role => {
    const label = ROLE_LABELS[role] || role;
    const w = 34;
    const h = 20;
    const bx = right ? cursor - w : cursor;
    const by = y - h / 2;

    ctx.fillStyle = '#080a09';
    ctx.fillRect(bx, by, w, h);

    ctx.strokeStyle = ROLE_COLORS[role] || '#888';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by + h - 1.5);
    ctx.lineTo(bx + w, by + h - 1.5);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 17px "Arial Black", Impact, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, bx + w / 2, y - 1, w - 2);

    cursor += right ? -(w + 5) : (w + 5);
  });
};

const drawRadar = ({
  ctx,
  blackTeam,
  whiteTeam,
  getPlayerRoles,
  centerX,
  centerY,
  radius,
  progress
}) => {
  if (progress <= 0) return;

  const axes = ['TOT', 'POR', 'DIF', 'CEN', 'ATT'];
  const labels = { TOT: 'TOT', POR: 'PT', DIF: 'DI', CEN: 'CC', ATT: 'AT' };
  const blackValues = getRadarValues(blackTeam, getPlayerRoles);
  const whiteValues = getRadarValues(whiteTeam, getPlayerRoles);

  const boxW = radius * 3.45;
  const boxH = radius * 2.75;
  const boxX = centerX - boxW / 2;
  const boxY = centerY - boxH / 2;

  ctx.save();
  ctx.globalAlpha = easeOut(progress);

  const radarBackground = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
  radarBackground.addColorStop(0, '#8a8f8d');
  radarBackground.addColorStop(0.48, '#747977');
  radarBackground.addColorStop(1, '#626765');
  ctx.fillStyle = radarBackground;
  ctx.fillRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = '#181a19';
  ctx.lineWidth = 7;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = '#c2c6c3';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX + 7, boxY + 7, boxW - 14, boxH - 14);

  const radarHeader = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY);
  radarHeader.addColorStop(0, '#3b3d3a');
  radarHeader.addColorStop(0.5, '#777a75');
  radarHeader.addColorStop(1, '#343633');
  ctx.fillStyle = radarHeader;
  ctx.fillRect(boxX + 9, boxY + 9, boxW - 18, 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 16px ${OLD_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BLACK TEAM  /  WHITE TEAM', centerX, boxY + 24);

  const getPoint = (index, value = 10) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / axes.length;
    const r = radius * (Math.max(0, Math.min(10, value)) / 10);
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + 15 + Math.sin(angle) * r
    };
  };

  [0.25, 0.5, 0.75, 1].forEach(level => {
    ctx.beginPath();
    axes.forEach((_, index) => {
      const p = getPoint(index, 10 * level);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.strokeStyle = level === 1 ? '#c2c5c1' : '#5c615e';
    ctx.lineWidth = level === 1 ? 2 : 1;
    ctx.stroke();
  });

  axes.forEach((axis, index) => {
    const end = getPoint(index, 10);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 15);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#505451';
    ctx.lineWidth = 1;
    ctx.stroke();

    const label = getPoint(index, 12.1);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 17px ${OLD_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(labels[axis], label.x, label.y);
  });

  const polygonProgressBlack = clamp01((progress - 0.25) / 0.35);
  const polygonProgressWhite = clamp01((progress - 0.55) / 0.35);

  const drawPolygon = (values, stroke, fill, polygonProgress) => {
    if (polygonProgress <= 0) return;
    ctx.save();
    ctx.globalAlpha *= easeOut(polygonProgress);
    ctx.beginPath();
    axes.forEach((axis, index) => {
      const p = getPoint(index, values[axis]);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  };

  drawPolygon(blackValues, '#050505', 'rgba(85,85,85,0.24)', polygonProgressBlack);
  drawPolygon(whiteValues, '#ffffff', 'rgba(210,210,210,0.16)', polygonProgressWhite);

  if (progress > 0.75) {
    const legendAlpha = clamp01((progress - 0.75) / 0.25);
    ctx.save();
    ctx.globalAlpha *= legendAlpha;
    const legendY = boxY + boxH - 22;
    ctx.font = `bold 15px ${OLD_FONT}`;
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(centerX - 160, legendY);
    ctx.lineTo(centerX - 115, legendY);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('BLACK', centerX - 105, legendY);

    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(centerX + 45, legendY);
    ctx.lineTo(centerX + 90, legendY);
    ctx.stroke();
    ctx.fillText('WHITE', centerX + 100, legendY);
    ctx.restore();
  }

  ctx.restore();
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export async function exportFormationVideo({
  blackTeam,
  whiteTeam,
  balanceMetrics,
  getPlayerRoles,
  isGoalkeeperPlayer,
  showToast
}) {
  if (!blackTeam || !whiteTeam) {
    throw new Error('Servono Team Black e Team White.');
  }

  if (
    typeof MediaRecorder === 'undefined' ||
    typeof HTMLCanvasElement === 'undefined'
  ) {
    throw new Error('Questo browser non supporta la registrazione video Canvas.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;
  const ctx = canvas.getContext('2d');

  const renderCanvas = document.createElement('canvas');
  renderCanvas.width = VIDEO_WIDTH;
  renderCanvas.height = VIDEO_HEIGHT;
  const renderCtx = renderCanvas.getContext('2d');

  const [
    darioLogo,
    arrowDown,
    arrowUpRight,
    arrowDownRight,
    arrowUp
  ] = await Promise.all([
    safeLoadImage('/Dario_Rocchi.webp'),
    safeLoadImage('/FrecciaGiu.png'),
    safeLoadImage('/FrecciaSuDestra.png'),
    safeLoadImage('/FrecciaGiuDestra.png'),
    safeLoadImage('/FrecciaSu.png')
  ]);

  const arrows = [arrowDown, arrowUpRight, arrowDownRight, arrowUp].filter(Boolean);

  const blackPlayers = sortPlayers(blackTeam, getPlayerRoles, isGoalkeeperPlayer);
  const whitePlayers = sortPlayers(whiteTeam, getPlayerRoles, isGoalkeeperPlayer);

  // L'assegnazione rimane stabile per tutto il video.
  const arrowByPlayer = new Map();
  [...blackPlayers, ...whitePlayers].forEach(player => {
    if (!arrows.length) {
      arrowByPlayer.set(player.id, null);
      return;
    }
    // Hash semplice: evita che la freccia cambi a ogni frame.
    const seed = String(player.id || player.name)
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    arrowByPlayer.set(player.id, arrows[seed % arrows.length]);
  });

  // Reveal alternato: sinistra riga 1, destra riga 1, sinistra riga 2...
  const revealOrder = [];
  const maxRows = Math.max(blackPlayers.length, whitePlayers.length);
  for (let row = 0; row < maxRows; row++) {
    if (blackPlayers[row]) revealOrder.push({ side: 'black', row, player: blackPlayers[row] });
    if (whitePlayers[row]) revealOrder.push({ side: 'white', row, player: whitePlayers[row] });
  }

  const revealStep = (PLAYER_REVEAL_END - PLAYER_REVEAL_START) / Math.max(revealOrder.length, 1);
  const revealTimes = revealOrder.map((item, index) => ({
    ...item,
    time: PLAYER_REVEAL_START + index * revealStep
  }));

  // Audio.
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio non supportato da questo browser.');
  }

  const audioContext = new AudioContextClass();
  await audioContext.resume();

  let musicBuffer;
  let selectionBuffer;

  try {
    [musicBuffer, selectionBuffer] = await Promise.all([
      fetchAudioBuffer(audioContext, '/blur.mp3'),
      fetchAudioBuffer(audioContext, '/selezione.wav')
    ]);
  } catch (error) {
    await audioContext.close();
    throw new Error('Controlla che /blur.mp3 e /selezione.wav siano presenti nella cartella public.');
  }

  const audioDestination = audioContext.createMediaStreamDestination();

  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.92;
  masterGain.connect(audioDestination);

  const musicGain = audioContext.createGain();
  musicGain.gain.value = 0.62;
  musicGain.connect(masterGain);

  const selectionGain = audioContext.createGain();
  selectionGain.gain.value = 1.0;
  selectionGain.connect(masterGain);

  const musicSource = audioContext.createBufferSource();
  musicSource.buffer = musicBuffer;
  musicSource.connect(musicGain);

  const canvasStream = canvas.captureStream(FPS);
  const mixedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDestination.stream.getAudioTracks()
  ]);

  const mimeType = chooseMimeType();
  const recorderOptions = mimeType
    ? { mimeType, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 192_000 }
    : { videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 192_000 };

  let recorder;
  try {
    recorder = new MediaRecorder(mixedStream, recorderOptions);
  } catch (error) {
    await audioContext.close();
    throw new Error('Il browser non riesce ad avviare il codec video disponibile.');
  }

  const chunks = [];
  recorder.ondataavailable = event => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  const recordingDone = new Promise((resolve, reject) => {
    recorder.onerror = event => reject(event.error || new Error('Errore MediaRecorder'));
    recorder.onstop = resolve;
  });

  const tableX = 28;
  const tableY = 28;
  const tableW = VIDEO_WIDTH - 56;
  const headerH = 76;
  const rowH = 72;
  const rows = maxRows;
  const halfW = tableW / 2;
  const midX = tableX + halfW;
  const bodyTop = tableY + headerH;
  const footerY = bodyTop + rows * rowH + 18;
  const metricsY = footerY + 96;
  const radarCenterY = metricsY + 185;

  const drawPlayerContent = (player, side, row, alpha = 1) => {
    const y = bodyTop + row * rowH;
    const cy = y + rowH / 2;
    const isRight = side === 'white';

    renderCtx.save();
    renderCtx.globalAlpha = alpha;

    if (!isRight) {
      drawRoleBox(renderCtx, player, tableX + 12, cy, getPlayerRoles, isGoalkeeperPlayer);

      renderCtx.fillStyle = '#181a19';
      renderCtx.font = `bold 40px ${OLD_FONT}`;
      const nameX = tableX + 105;
      const secondaryCount = getPlayerRoles(player)
        .filter(role => role !== primaryRole(player, getPlayerRoles, isGoalkeeperPlayer)).length;
      const reservedTagsW = secondaryCount * 39;
      const name = fitName(renderCtx, player.name, Math.max(150, 390 - reservedTagsW), renderCtx.font);
      drawStretchedText(renderCtx, name, nameX, cy, 1.08, 'left');

      const nameWidth = renderCtx.measureText(name).width * 1.08;
      drawSecondaryTags(
        renderCtx,
        player,
        nameX + nameWidth + 12,
        cy,
        getPlayerRoles,
        isGoalkeeperPlayer
      );

      const arrow = arrowByPlayer.get(player.id);
      if (arrow) renderCtx.drawImage(arrow, midX - 72, cy - 27.5, 55, 55);
    } else {
      drawRoleBox(
        renderCtx,
        player,
        tableX + tableW - 12,
        cy,
        getPlayerRoles,
        isGoalkeeperPlayer,
        true
      );

      renderCtx.fillStyle = '#181a19';
      renderCtx.font = `bold 40px ${OLD_FONT}`;
      const nameRightX = tableX + tableW - 105;
      const secondaryCount = getPlayerRoles(player)
        .filter(role => role !== primaryRole(player, getPlayerRoles, isGoalkeeperPlayer)).length;
      const reservedTagsW = secondaryCount * 39;
      const name = fitName(renderCtx, player.name, Math.max(150, 390 - reservedTagsW), renderCtx.font);
      drawStretchedText(renderCtx, name, nameRightX, cy, 1.08, 'right');

      const nameWidth = renderCtx.measureText(name).width * 1.08;
      drawSecondaryTags(
        renderCtx,
        player,
        nameRightX - nameWidth - 12,
        cy,
        getPlayerRoles,
        isGoalkeeperPlayer,
        true
      );

      const arrow = arrowByPlayer.get(player.id);
      if (arrow) renderCtx.drawImage(arrow, midX + 17, cy - 27.5, 55, 55);
    }

    renderCtx.restore();
  };

  const drawSelectionFlash = (side, row, amount) => {
    if (amount <= 0) return;

    const y = bodyTop + row * rowH;
    const x = side === 'black' ? tableX : midX;

    renderCtx.save();

    const glow = renderCtx.createLinearGradient(
      side === 'black' ? x : x + halfW,
      y,
      side === 'black' ? x + halfW : x,
      y
    );
    glow.addColorStop(0, `rgba(255, 126, 0, ${0.22 * amount})`);
    glow.addColorStop(0.55, `rgba(255, 149, 0, ${0.52 * amount})`);
    glow.addColorStop(1, `rgba(255, 193, 72, ${0.78 * amount})`);

    renderCtx.fillStyle = glow;
    renderCtx.fillRect(x + 2, y + 2, halfW - 4, rowH - 4);

    renderCtx.strokeStyle = `rgba(255, 145, 0, ${0.95 * amount})`;
    renderCtx.lineWidth = 5;
    renderCtx.strokeRect(x + 3, y + 3, halfW - 6, rowH - 6);

    renderCtx.shadowColor = '#ff8a00';
    renderCtx.shadowBlur = 24 * amount;
    renderCtx.strokeStyle = `rgba(255, 194, 91, ${amount})`;
    renderCtx.lineWidth = 2;
    renderCtx.strokeRect(x + 6, y + 6, halfW - 12, rowH - 12);

    renderCtx.restore();
  };

  const renderFrame = time => {
    renderCtx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    // Fondo metallico.
    const bg = renderCtx.createLinearGradient(0, 0, 0, VIDEO_HEIGHT);
    bg.addColorStop(0, '#b9bdb9');
    bg.addColorStop(0.5, '#eceeeb');
    bg.addColorStop(1, '#a9ada9');
    renderCtx.fillStyle = bg;
    renderCtx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    // Intro delle testate.
    const blackHeaderProgress = easeOut((time - 0.35) / 0.75);
    const whiteHeaderProgress = easeOut((time - 0.9) / 0.75);

    renderCtx.save();
    renderCtx.globalAlpha = blackHeaderProgress;
    const blackGrad = renderCtx.createLinearGradient(tableX, tableY, midX, tableY + headerH);
    blackGrad.addColorStop(0, '#111');
    blackGrad.addColorStop(0.48, '#3a3a38');
    blackGrad.addColorStop(1, '#090909');
    renderCtx.fillStyle = blackGrad;
    renderCtx.fillRect(tableX, tableY, halfW, headerH);
    renderCtx.restore();

    renderCtx.save();
    renderCtx.globalAlpha = whiteHeaderProgress;
    const whiteGrad = renderCtx.createLinearGradient(midX, tableY, tableX + tableW, tableY + headerH);
    whiteGrad.addColorStop(0, '#d7d8d4');
    whiteGrad.addColorStop(0.5, '#fafbf7');
    whiteGrad.addColorStop(1, '#b9bbb7');
    renderCtx.fillStyle = whiteGrad;
    renderCtx.fillRect(midX, tableY, halfW, headerH);
    renderCtx.restore();

    // Shine in movimento durante l'intro.
    if (time > 1.2) {
      const shineProgress = ((time - 1.2) % 3.0) / 3.0;
      const shineX = tableX - 240 + (tableW + 480) * shineProgress;
      const shine = renderCtx.createLinearGradient(shineX - 120, 0, shineX + 120, 0);
      shine.addColorStop(0, 'rgba(255,255,255,0)');
      shine.addColorStop(0.5, 'rgba(255,255,255,0.18)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      renderCtx.fillStyle = shine;
      renderCtx.fillRect(tableX, tableY, tableW, headerH);
    }

    renderCtx.strokeStyle = '#252827';
    renderCtx.lineWidth = 4;
    renderCtx.strokeRect(tableX, tableY, tableW, headerH + rows * rowH);

    renderCtx.strokeStyle = 'rgba(255,255,255,.65)';
    renderCtx.lineWidth = 2;
    renderCtx.strokeRect(tableX + 4, tableY + 4, tableW - 8, headerH - 8);

    renderCtx.textBaseline = 'middle';
    renderCtx.font = `bold 39px ${OLD_FONT}`;
    renderCtx.save();
    renderCtx.globalAlpha = blackHeaderProgress;
    renderCtx.fillStyle = '#fff';
    renderCtx.textAlign = 'left';
    renderCtx.fillText('BLACK TEAM', tableX + 22, tableY + headerH / 2 + 2);
    renderCtx.restore();

    renderCtx.save();
    renderCtx.globalAlpha = whiteHeaderProgress;
    renderCtx.fillStyle = '#222';
    renderCtx.textAlign = 'right';
    renderCtx.fillText('WHITE TEAM', tableX + tableW - 22, tableY + headerH / 2 + 2);
    renderCtx.restore();

    // Celle vuote: entrano prima dei giocatori.
    const gridProgress = easeOut((time - 1.7) / 1.2);
    renderCtx.save();
    renderCtx.globalAlpha = gridProgress;

    for (let i = 0; i < rows; i++) {
      const y = bodyTop + i * rowH;

      const leftRowGrad = renderCtx.createLinearGradient(tableX, y, midX, y);
      leftRowGrad.addColorStop(0, i % 2 === 0 ? '#f1f2ef' : '#e3e5e1');
      leftRowGrad.addColorStop(0.58, i % 2 === 0 ? '#e4e6e2' : '#d9dcd7');
      leftRowGrad.addColorStop(1, i % 2 === 0 ? '#c9ccc8' : '#c3c6c2');
      renderCtx.fillStyle = leftRowGrad;
      renderCtx.fillRect(tableX, y, halfW, rowH);

      const rightRowGrad = renderCtx.createLinearGradient(midX, y, tableX + tableW, y);
      rightRowGrad.addColorStop(0, i % 2 === 0 ? '#c9ccc8' : '#c3c6c2');
      rightRowGrad.addColorStop(0.42, i % 2 === 0 ? '#e4e6e2' : '#d9dcd7');
      rightRowGrad.addColorStop(1, i % 2 === 0 ? '#f1f2ef' : '#e3e5e1');
      renderCtx.fillStyle = rightRowGrad;
      renderCtx.fillRect(midX, y, halfW, rowH);

      renderCtx.strokeStyle = '#555a58';
      renderCtx.lineWidth = 2;
      renderCtx.beginPath();
      renderCtx.moveTo(tableX, y);
      renderCtx.lineTo(tableX + tableW, y);
      renderCtx.stroke();

      renderCtx.strokeStyle = 'rgba(255,255,255,.72)';
      renderCtx.lineWidth = 1;
      renderCtx.beginPath();
      renderCtx.moveTo(tableX + 2, y + 3);
      renderCtx.lineTo(tableX + tableW - 2, y + 3);
      renderCtx.stroke();
    }

    renderCtx.strokeStyle = '#444947';
    renderCtx.lineWidth = 3;
    [midX, tableX + 92, midX - 88, midX + 88, tableX + tableW - 92].forEach(x => {
      renderCtx.beginPath();
      renderCtx.moveTo(x, bodyTop);
      renderCtx.lineTo(x, bodyTop + rows * rowH);
      renderCtx.stroke();
    });

    renderCtx.strokeStyle = '#292d2b';
    renderCtx.lineWidth = 4;
    renderCtx.beginPath();
    renderCtx.moveTo(midX, tableY);
    renderCtx.lineTo(midX, bodyTop + rows * rowH);
    renderCtx.stroke();
    renderCtx.restore();

    // Logo.
    const logoProgress = easeOut((time - 3.0) / 0.9);
    if (darioLogo && logoProgress > 0) {
      renderCtx.save();
      renderCtx.globalAlpha = logoProgress;
      const scale = 0.86 + logoProgress * 0.14;
      const size = 68 * scale;
      renderCtx.drawImage(
        darioLogo,
        VIDEO_WIDTH / 2 - size / 2,
        footerY + (68 - size) / 2,
        size,
        size
      );
      renderCtx.restore();
    }

    // Metriche.
    const metricsProgress = easeOut((time - 4.2) / 1.0);
    if (balanceMetrics && metricsProgress > 0) {
      renderCtx.save();
      renderCtx.globalAlpha = metricsProgress;
      renderCtx.textBaseline = 'middle';
      renderCtx.textAlign = 'center';
      renderCtx.fillStyle = '#171918';
      renderCtx.font = `bold 22px ${OLD_FONT}`;
      renderCtx.fillText(
        `DISLIVELLO VOTI: ${balanceMetrics.diff}   •   INDICE EQUILIBRIO: ${balanceMetrics.percentage}%`,
        VIDEO_WIDTH / 2,
        metricsY
      );
      renderCtx.restore();
    }

    // Radar: contenitore + Black + White progressivamente.
    const radarProgress = clamp01((time - 5.5) / 5.0);
    drawRadar({
      ctx: renderCtx,
      blackTeam,
      whiteTeam,
      getPlayerRoles,
      centerX: VIDEO_WIDTH / 2,
      centerY: radarCenterY,
      radius: 105,
      progress: radarProgress
    });

    // Firma.
    if (time > 10.5) {
      const footerProgress = easeOut((time - 10.5) / 0.8);
      renderCtx.save();
      renderCtx.globalAlpha = footerProgress;
      renderCtx.font = `bold 16px ${OLD_FONT}`;
      renderCtx.fillStyle = '#333';
      renderCtx.textBaseline = 'middle';
      renderCtx.textAlign = 'left';
      renderCtx.fillText('GREEN CALCIO', tableX, VIDEO_HEIGHT - 22);
      renderCtx.textAlign = 'right';
      renderCtx.fillText('BLACK TEAM  vs  WHITE TEAM', tableX + tableW, VIDEO_HEIGHT - 22);
      renderCtx.restore();
    }

    // Giocatori: nascosti fino al rispettivo reveal.
    revealTimes.forEach(item => {
      const revealProgress = clamp01((time - item.time) / 0.12);
      const preFlashStart = item.time - SELECT_FLASH_SECONDS;
      const flashPosition = (time - preFlashStart) / SELECT_FLASH_SECONDS;

      if (flashPosition >= 0 && flashPosition <= 1.35) {
        const flashAmount = flashPosition <= 1
          ? Math.sin(Math.PI * clamp01(flashPosition))
          : 1 - clamp01((flashPosition - 1) / 0.35);
        drawSelectionFlash(item.side, item.row, flashAmount);
      }

      if (revealProgress > 0) {
        drawPlayerContent(item.player, item.side, item.row, easeOut(revealProgress));
      }
    });

    // Leggerissima scansione vintage per evitare una scena completamente immobile.
    if (time > 2.5) {
      const scanY = ((time * 95) % (VIDEO_HEIGHT + 100)) - 50;
      const scan = renderCtx.createLinearGradient(0, scanY - 25, 0, scanY + 25);
      scan.addColorStop(0, 'rgba(255,255,255,0)');
      scan.addColorStop(0.5, 'rgba(255,255,255,0.045)');
      scan.addColorStop(1, 'rgba(255,255,255,0)');
      renderCtx.fillStyle = scan;
      renderCtx.fillRect(0, scanY - 25, VIDEO_WIDTH, 50);
    }

    // Copia il frame finale senza blur.
// Più leggero e performante soprattutto su smartphone.
ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
ctx.drawImage(renderCanvas, 0, 0);
  };

  recorder.start(250);

  const audioStart = audioContext.currentTime + 0.08;

  // Musica dall'inizio, tagliata a 20 secondi.
  musicSource.start(audioStart, 0);
  musicSource.stop(audioStart + Math.min(VIDEO_DURATION, Math.max(0.1, musicBuffer.duration)));

  // Un suono per ogni reveal.
  revealTimes.forEach(item => {
    const source = audioContext.createBufferSource();
    source.buffer = selectionBuffer;
    source.connect(selectionGain);
    source.start(audioStart + Math.max(0, item.time - SELECT_FLASH_SECONDS * 0.55));
    const available = VIDEO_DURATION - item.time + SELECT_FLASH_SECONDS * 0.55;
    if (selectionBuffer.duration > available) {
      source.stop(audioStart + VIDEO_DURATION);
    }
  });

  const performanceStart = performance.now();

  await new Promise(resolve => {
    const tick = now => {
      const elapsed = (now - performanceStart) / 1000;
      renderFrame(Math.min(elapsed, VIDEO_DURATION));

      if (elapsed < VIDEO_DURATION) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    renderFrame(0);
    requestAnimationFrame(tick);
  });

  // Piccolo margine per consegnare l'ultimo frame al recorder.
  await new Promise(resolve => setTimeout(resolve, 120));

  recorder.stop();
  await recordingDone;

  canvasStream.getTracks().forEach(track => track.stop());
  audioDestination.stream.getTracks().forEach(track => track.stop());
  await audioContext.close();

  const actualType = recorder.mimeType || mimeType || 'video/webm';
  const blob = new Blob(chunks, { type: actualType });

  const isMp4 = actualType.includes('mp4');
  const filename = isMp4
    ? 'black-vs-white-reveal.mp4'
    : 'black-vs-white-reveal.webm';

  downloadBlob(blob, filename);

  if (showToast) {
    showToast(
      isMp4
        ? 'Video MP4 scaricato! 🎬'
        : 'Video scaricato in WebM (formato supportato dal browser) 🎬'
    );
  }

  return { blob, filename, mimeType: actualType };
}
