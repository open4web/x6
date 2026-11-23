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

// 2. token 未过期但 jwt cookie 已没了：/user/prefs 空 body 401 → 视为登录失效
resetRequestErrorQueueForTests();
target.location.hash = '#/';
store.token = jwt(nowSec + 3600);
assert.equal(hasAuthToken(), true);
reportHttpError({status: 401, url: '/v1/system/auth/user/prefs', method: 'GET', message: ''});
assert.equal(store.token, undefined);
assert.equal(target.location.hash, '#/login');
assert.equal(backs, 0);

// 3. 真正的无权限：新标签页直接打开（history.length=2 但站内 idx=0）→ 留在站内，不后退出站
resetRequestErrorQueueForTests();
seen.length = 0;
target.location.hash = '#/';
store.token = jwt(nowSec + 3600);
target.history.state = {idx: 0};
reportHttpError({status: 401, url: '/v1/data/dashboard/analytics/overview', method: 'GET', message: 'Unauthorized'});
assert.equal(seen.length, 1);
assert.equal(seen[0].noAccess, true);
assert.equal(backs, 0);
assert.equal(target.location.hash, '#/');
assert.ok(store.token);

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
