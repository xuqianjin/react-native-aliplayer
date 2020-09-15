export const formatTime = (time) => {
  const s = parseInt(time % 60) || 0;
  const m = parseInt(time / 60) || 0;
  const S = s > 9 ? String(s) : '0' + s;
  const M = m > 9 ? String(m) : '0' + m;
  return { M, S };
};

export const getBitrateLabel = (bitrate) => {
  if (!bitrate) {
    return '';
  }
  const { width, height } = bitrate;
  return `${Math.min(width, height)}p`;
};
