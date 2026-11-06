// A stroke needs alternating vertical acceleration, not a single bump or tilt.
export function createStrokeDetector() {
  let sign = 0, lastPeak = -Infinity, lastStroke = -Infinity;
  return (vertical: number, now: number) => {
    if (!Number.isFinite(vertical) || Math.abs(vertical) < 3.5) return false;
    const nextSign = Math.sign(vertical);
    const reversal = sign !== 0 && nextSign !== sign && now - lastPeak < 900;
    if (nextSign !== sign || now - lastPeak > 900) {
      sign = nextSign;
      lastPeak = now;
    }
    if (!reversal || now - lastStroke < 180) return false;
    lastStroke = now;
    return true;
  };
}

export function decayProgress(value: number, elapsedMs: number, idleMs: number) {
  return Math.max(0, value - Math.max(0, Math.min(elapsedMs, idleMs - 550)) * 0.007);
}
