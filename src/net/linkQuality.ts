// 终端到服务器的连接质量。只发 GET，不走心跳 POST（那个接口会写 Redis 在线状态）。

export const LINK_PROBE_PATH = '/v1/system/auth/heartbeat';
export const LINK_PROBE_INTERVAL_MS = 8000;
export const LINK_PROBE_TIMEOUT_MS = 4000;

export type LinkLevel = 'checking' | 'offline' | 'down' | 'weak' | 'fair' | 'good' | 'excellent';

export type LinkSample = {
    ok: boolean;
    down: boolean;
    rtt: number | null;
    at: number;
};

export type LinkGrade = {
    level: LinkLevel;
    rtt: number | null;
};

type ProbeFetch = (input: string, init?: RequestInit) => Promise<{status: number}>;

export function median(nums: number[]): number {
    const sorted = nums.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[mid];
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function barsFor(level: LinkLevel): number {
    switch (level) {
        case 'excellent':
            return 4;
        case 'good':
            return 3;
        case 'fair':
            return 2;
        case 'weak':
        case 'down':
            return 1;
        default:
            return 0;
    }
}

// 最近几次往返的中位数。单次失败先降到「信号差」，连续失败才算离线。
export function classifyLink(samples: readonly LinkSample[], online: boolean): LinkGrade {
    if (!online) return {level: 'offline', rtt: null};
    if (!samples.length) return {level: 'checking', rtt: null};
    const recent = samples.slice(-3);
    const last = recent[recent.length - 1];
    if (last.down) return {level: 'down', rtt: last.rtt};
    if (!last.ok) {
        const fails = recent.filter((item) => !item.ok && !item.down).length;
        if (fails >= 2) return {level: 'offline', rtt: null};
        const prev = recent.slice().reverse().find((item) => item.ok);
        return {level: 'weak', rtt: prev ? prev.rtt : null};
    }
    const rtts = recent.filter((item) => item.ok && typeof item.rtt === 'number').map((item) => item.rtt as number);
    const rtt = median(rtts);
    if (rtt <= 150) return {level: 'excellent', rtt};
    if (rtt <= 400) return {level: 'good', rtt};
    if (rtt <= 900) return {level: 'fair', rtt};
    return {level: 'weak', rtt};
}

export async function probeLink(fetchImpl: ProbeFetch, opts?: {
    now?: () => number;
    timeoutMs?: number;
    online?: boolean;
    signal?: AbortSignal;
}): Promise<LinkSample> {
    const online = opts?.online ?? (typeof navigator === 'undefined' || navigator.onLine !== false);
    if (!online) return {ok: false, down: false, rtt: null, at: Date.now()};
    const now = opts?.now ?? (() => (typeof performance === 'undefined' ? Date.now() : performance.now()));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts?.timeoutMs ?? LINK_PROBE_TIMEOUT_MS);
    const onAbort = () => ctrl.abort();
    opts?.signal?.addEventListener('abort', onAbort);
    if (opts?.signal?.aborted) ctrl.abort();
    const started = now();
    try {
        const res = await fetchImpl(LINK_PROBE_PATH + '?probe=1', {
            method: 'GET',
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
        });
        const rtt = Math.max(0, Math.round(now() - started));
        const down = res.status >= 500;
        return {ok: res.status > 0 && !down, down, rtt, at: Date.now()};
    } catch {
        return {ok: false, down: false, rtt: null, at: Date.now()};
    } finally {
        clearTimeout(timer);
        opts?.signal?.removeEventListener('abort', onAbort);
    }
}
