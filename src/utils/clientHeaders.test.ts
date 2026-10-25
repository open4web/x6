import assert from 'assert';

// 在 node 里模拟浏览器环境，检查 fetch 补头的规则
const calls: Array<{ url: string; headers: Headers }> = [];
(globalThis as any).window = {
    location: { href: 'https://admin.example.com/#/', origin: 'https://admin.example.com' },
    fetch: async (input: any, init?: any) => {
        calls.push({ url: String(input), headers: new Headers(init?.headers) });
        return {} as any;
    },
};
(globalThis as any).XMLHttpRequest = function () {} as any;
(globalThis as any).XMLHttpRequest.prototype.open = function () {};
(globalThis as any).XMLHttpRequest.prototype.send = function () {};
(globalThis as any).XMLHttpRequest.prototype.setRequestHeader = function (k: string, v: string) {
    ((this as any).h ||= {})[k] = v;
};

(async () => {
    const { installClientHeaders, CLIENT_ID } = await import('./clientHeaders');
    installClientHeaders();
    const f = (globalThis as any).window.fetch;
    await f('/v1/system/auth/actions', { headers: { Authorization: 'x' } });
    await f('https://admin.example.com/v1/hlj/member/level');
    await f('https://api.other.com/v1/hlj/member/level');
    await f('https://cdn.third-party.com/a.js');
    assert.strictEqual(calls[0].headers.get('X-Client-Id'), CLIENT_ID);
    assert.ok(calls[0].headers.get('X-Client-Version'));
    assert.strictEqual(calls[0].headers.get('Authorization'), 'x'); // 原有头不丢
    assert.strictEqual(calls[1].headers.get('X-Client-Id'), CLIENT_ID);
    assert.strictEqual(calls[2].headers.get('X-Client-Id'), CLIENT_ID); // 跨域但是 /v1/ 接口
    assert.strictEqual(calls[3].headers.get('X-Client-Id'), null); // 第三方不加

    const X = new (globalThis as any).XMLHttpRequest();
    X.open('GET', '/v1/system/auth/me');
    X.send();
    assert.strictEqual(X.h['X-Client-Id'], CLIENT_ID);
    const Y = new (globalThis as any).XMLHttpRequest();
    Y.open('GET', 'https://cdn.third-party.com/a.js');
    Y.send();
    assert.strictEqual(Y.h, undefined);
    console.log('client headers ok');
})();
