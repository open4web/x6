const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

export function normalizeLoginId(raw?: string | null): { kind: 'phone' | 'email' | ''; value: string } {
    const text = String(raw || '').trim();
    if (!text) return { kind: '', value: '' };
    if (text.includes('@')) {
        const email = text.toLowerCase();
        if (!EMAIL_RE.test(email)) return { kind: '', value: '' };
        return { kind: 'email', value: email };
    }
    let phone = text.replace(/[\s-]/g, '');
    if (phone.startsWith('+86')) phone = phone.slice(3);
    else if (phone.startsWith('0086')) phone = phone.slice(4);
    else if (phone.startsWith('86') && phone.length === 13) phone = phone.slice(2);
    if (!/^1[3-9]\d{9}$/.test(phone)) return { kind: '', value: '' };
    return { kind: 'phone', value: phone };
}

export function isLoginId(raw?: string | null): boolean {
    return normalizeLoginId(raw).kind !== '';
}
