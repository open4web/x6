import assert from 'assert';
import {
    authTokenExpired,
    goBackSafe,
    hasAuthToken,
    reportHttpError,
    REQUEST_ERROR_EVENT,
    resetRequestErrorQueueForTests,
} from './requestError';

function jwt(exp: number): string {
    const b64 = (o: any) => Buffer.from(JSON.stringify(o)).toString('base64').replace(/=+$/, '');
    return `${b64({alg: 'HS256', typ: 'JWT'})}.${b64({exp, iss: 'x'})}.sig`;
}

const store: Record<string, string> = {};
(globalThis as any).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
        store[k] = v;
    },
    removeItem: (k: string) => {
        delete store[k];
    },
};

let backs = 0;
const target = new EventTarget() as any;
target.location = {pathname: '/', hash: '#/', assign() {}};
target.history = {length: 2, state: null, back: () => backs++};
target.setTimeout = (fn: () => void) => fn();
(globalThis as any).window = target;

const seen: any[] = [];
window.addEventListener(REQUEST_ERROR_EVENT, (e: any) => seen.push(e.detail));

const nowSec = Math.floor(Date.now() / 1000);

// 1. 过期 token：所有接口空 body 401 → 清本地登录态并去 #/login，绝不 history.back()
store.token = jwt(nowSec - 60);
assert.equal(authTokenExpired(), true);
assert.equal(hasAuthToken(), false);
reportHttpError({status: 401, url: '/v1/hlj/member/account?filter={}', method: 'GET', message: 'Unauthorized'});
assert.equal(store.token, undefined);
assert.equal(target.location.hash, '#/login');
assert.equal(backs, 0);
assert.equal(seen.length, 0);

// 2. token 未过期但服务端返回 401 session_expired（cookie 没了/被踢）→ 一律视为登录失效
resetRequestErrorQueueForTests();
target.location.hash = '#/';
store.token = jwt(nowSec + 3600);
assert.equal(hasAuthToken(), true);
reportHttpError({
    status: 401,
    url: '/v1/hlj/member/account',
    method: 'GET',
    body: {code: 'session_expired', message: '登录已过期，请重新登录'},
});
assert.equal(store.token, undefined);
assert.equal(target.location.hash, '#/login');
assert.equal(backs, 0);

// 3. 403 permission_denied：只提示，不登出、不跳转、不后退（即使站内有上一页）
resetRequestErrorQueueForTests();
seen.length = 0;
target.location.hash = '#/orders';
store.token = jwt(nowSec + 3600);
target.history.state = {idx: 3};
reportHttpError({
    status: 403,
    url: '/v1/data/dashboard/analytics/overview',
    method: 'GET',
    body: {code: 'permission_denied', message: '没有访问该功能的权限'},
});
assert.equal(seen.length, 1);
assert.equal(seen[0].noAccess, true);
assert.equal(seen[0].message, '没有访问该功能的权限');
assert.equal(backs, 0);
assert.equal(target.location.hash, '#/orders');
assert.ok(store.token);
target.location.hash = '#/';
target.history.state = {idx: 0};

// 4. 子页面无权限且新标签页打开 → 回 #/，不离站
target.location.hash = '#/orders';
goBackSafe();
assert.equal(backs, 0);
assert.equal(target.location.hash, '#/');

// 5. 站内有上一页（idx>0）→ 正常后退
target.location.hash = '#/orders';
target.history.state = {idx: 2};
goBackSafe();
assert.equal(backs, 1);

console.log('session expiry ok');
