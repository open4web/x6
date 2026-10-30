type SpeechRec = {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: ((ev: any) => void) | null;
    onerror: ((ev: any) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

function SpeechCtor(): (new () => SpeechRec) | null {
    const w = window as any;
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isVoiceSupported(): boolean {
    return SpeechCtor() != null;
}

export function listenOnce(lang = 'zh-CN'): Promise<string> {
    const Ctor = SpeechCtor();
    if (!Ctor) {
        return Promise.reject(new Error('unsupported'));
    }
    return new Promise((resolve, reject) => {
        const rec = new Ctor();
        rec.lang = lang;
        rec.interimResults = false;
        rec.continuous = false;
        let done = false;
        rec.onresult = (ev: any) => {
            const text = ev?.results?.[0]?.[0]?.transcript || '';
            done = true;
            resolve(String(text).trim());
        };
        rec.onerror = (ev: any) => {
            if (!done) reject(new Error(ev?.error || 'speech_error'));
        };
        rec.onend = () => {
            if (!done) reject(new Error('no_speech'));
        };
        try {
            rec.start();
        } catch (err) {
            reject(err);
        }
    });
}
