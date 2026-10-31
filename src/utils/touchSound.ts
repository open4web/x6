export type PosSound = 'tap' | 'add' | 'key' | 'ok' | 'success' | 'warn' | 'deny';

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

/** Soften gain when the cashier muted motion feedback; still play unless sound is off. */
function gainScale() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return 1;
    }
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.7 : 1;
    } catch {
        return 1;
    }
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
    const g = gainScale();
    if (kind === 'tap') {
        tone(ac, 640, t, 0.06, 'triangle', 0.05 * g);
        return;
    }
    if (kind === 'key') {
        tone(ac, 880, t, 0.04, 'triangle', 0.035 * g);
        return;
    }
    if (kind === 'add') {
        tone(ac, 523, t, 0.07, 'sine', 0.06 * g);
        tone(ac, 784, t + 0.06, 0.1, 'sine', 0.05 * g);
        return;
    }
    if (kind === 'ok') {
        tone(ac, 523, t, 0.09, 'sine', 0.06 * g);
        tone(ac, 659, t + 0.08, 0.1, 'sine', 0.055 * g);
        tone(ac, 784, t + 0.16, 0.16, 'sine', 0.05 * g);
        return;
    }
    // Payment success: brighter rising chime synced with the checkmark toast / fly.
    if (kind === 'success') {
        tone(ac, 523.25, t, 0.1, 'sine', 0.07 * g);
        tone(ac, 659.25, t + 0.07, 0.11, 'sine', 0.065 * g);
        tone(ac, 783.99, t + 0.14, 0.12, 'triangle', 0.06 * g);
        tone(ac, 1046.5, t + 0.22, 0.22, 'sine', 0.055 * g);
        return;
    }
    if (kind === 'warn') {
        tone(ac, 311, t, 0.14, 'triangle', 0.05 * g);
        tone(ac, 233, t + 0.12, 0.18, 'triangle', 0.045 * g);
        return;
    }
    tone(ac, 146, t, 0.1, 'square', 0.03 * g);
    tone(ac, 110, t + 0.09, 0.14, 'square', 0.028 * g);
}
