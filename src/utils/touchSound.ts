export type PosSound = 'tap' | 'add' | 'key' | 'ok' | 'warn' | 'deny';

const STORAGE_KEY = 'pos_sound';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const Ctx = window.AudioContext || (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctx) {
        return null;
    }
    if (!ctx) {
        ctx = new Ctx();
    }
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }
    return ctx;
}

export function isPosSoundOn() {
    return localStorage.getItem(STORAGE_KEY) !== '0';
}

export function setPosSoundOn(on: boolean) {
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    if (on) {
        playPosSound('tap');
    }
}

function tone(ac: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.03);
}

export function playPosSound(kind: PosSound) {
    if (!isPosSoundOn()) {
        return;
    }
    const ac = audio();
    if (!ac) {
        return;
    }
    const t = ac.currentTime;
    if (kind === 'tap') {
        tone(ac, 640, t, 0.06, 'triangle', 0.05);
        return;
    }
    if (kind === 'key') {
        tone(ac, 880, t, 0.04, 'triangle', 0.035);
        return;
    }
    if (kind === 'add') {
        tone(ac, 523, t, 0.07, 'sine', 0.06);
        tone(ac, 784, t + 0.06, 0.1, 'sine', 0.05);
        return;
    }
    if (kind === 'ok') {
        tone(ac, 523, t, 0.09, 'sine', 0.06);
        tone(ac, 659, t + 0.08, 0.1, 'sine', 0.055);
        tone(ac, 784, t + 0.16, 0.16, 'sine', 0.05);
        return;
    }
    if (kind === 'warn') {
        tone(ac, 311, t, 0.14, 'triangle', 0.05);
        tone(ac, 233, t + 0.12, 0.18, 'triangle', 0.045);
        return;
    }
    tone(ac, 146, t, 0.1, 'square', 0.03);
    tone(ac, 110, t + 0.09, 0.14, 'square', 0.028);
}
