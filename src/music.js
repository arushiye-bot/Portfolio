// Tiny built-in chiptune + sound effects (no audio files needed).
let ac = null, on = false, timer = null, step = 0;
const lead = [0, 2, 4, 7, 9, 7, 4, 2, 0, 4, 7, 12, 9, 7, 4, 2, -3, 0, 2, 4, 7, 4, 2, 0, -3, 2, 5, 9, 7, 5, 2, 0];
const bass = [-12, -12, -17, -17, -15, -15, -19, -19];
const f = (n) => 261.63 * Math.pow(2, n / 12);
function tone(type, freq, dur, vol, when = 0, slide = 0) {
  if (!ac) return;
  const t = ac.currentTime + when, o = ac.createOscillator(), v = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  v.gain.setValueAtTime(vol, t); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(v).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
}
export const music = {
  get on() { return on; },
  toggle() {
    if (on) { clearInterval(timer); timer = null; on = false; return false; }
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { return false; }
    on = true;
    timer = setInterval(() => {
      tone('square', f(lead[step % lead.length]), 0.16, 0.025);
      if (step % 4 === 0) tone('triangle', f(bass[(step / 4 | 0) % bass.length]), 0.5, 0.06);
      step++;
    }, 170);
    return true;
  },
};
export function sfx(name) {
  if (!on || !ac) return;
  if (name === 'coin') { tone('square', 988, 0.07, 0.04); tone('square', 1319, 0.14, 0.04, 0.07); }
  if (name === 'bump') tone('square', 140, 0.12, 0.06, 0, -60);
  if (name === 'jump') tone('square', 330, 0.16, 0.035, 0, 330);
  if (name === 'zap') tone('sawtooth', 900, 0.14, 0.03, 0, -600);
  if (name === 'pop') { tone('square', 523, 0.08, 0.04); tone('square', 784, 0.08, 0.04, 0.08); tone('square', 1047, 0.18, 0.04, 0.16); }
  if (name === 'hurt') tone('square', 220, 0.25, 0.05, 0, -150);
  if (name === 'win') [523, 659, 784, 1047].forEach((n, i) => tone('square', n, 0.2, 0.04, i * 0.12));
}
