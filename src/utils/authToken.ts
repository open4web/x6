export function readAuthToken() {
    const raw =
        localStorage.getItem('token') ||
        localStorage.getItem('cookie') ||
        localStorage.getItem('accessToken') ||
        '';
    return raw.replace(/^Bearer\s+/i, '').trim();
}

export function authHeaders(): Record<string, string> {
    const token = readAuthToken();
    if (!token) {
        return {};
    }
    return {
        Authorization: `Bearer ${token}`,
        Cookies: token,
        Token: token,
    };
}

export function orderWsUrl(path = '/v1/hlj/order/ws') {
    const token = readAuthToken();
    const params = new URLSearchParams();
    // if (token) {
    //     params.set('token', token);
    //     params.set('jwt', token);
    //     params.set('authorization', `Bearer ${token}`);
    // }
    const userId = localStorage.getItem('user_id') || '';
    if (userId) {
        params.set('user_id', userId);
    }
    const query = params.toString();
    return query ? `${path}?${query}` : path;
}

const AUTH_KEYS = [
    'cookie',
    'token',
    'accessToken',
    'permissions',
    'toolbar',
    'otp_verified',
    'user_id',
    'code',
    'otp_url',
    'step',
    'username',
    'login_id',
    'verified_otp',
    'mfa_expire',
    'merchant',
    'mchStatus',
];

/** Drop every login-related key so 401 cannot leave a half-logged-in POS. */
export function clearAuthStorage() {
    for (const key of AUTH_KEYS) {
        try {
            localStorage.removeItem(key);
        } catch {
            /* ignore */
        }
    }
}
