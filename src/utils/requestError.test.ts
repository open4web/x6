import assert from 'assert';
import {formatRequestErrorCopy, reportHttpError, REQUEST_ERROR_EVENT} from './requestError';

const target = new EventTarget() as any;
target.location = {pathname: '/app', hash: '#/orders', assign() {}};
target.history = {length: 2, back() {}};
target.setTimeout = setTimeout;
(globalThis as any).window = target;
(globalThis as any).localStorage = {
    getItem: (k: string) => (k === 'token' ? 't' : null),
    setItem: () => {},
};

const seen: any[] = [];
window.addEventListener(REQUEST_ERROR_EVENT, (e: any) => seen.push(e.detail));

reportHttpError({
    status: 500,
    message: 'boom',
    requestId: 'rid-1',
    url: '/v1/hlj/order/pos',
    method: 'POST',
    body: {message: '商品价格已变动', request_id: 'rid-body'},
});
assert.equal(seen.length, 1);
assert.equal(seen[0].message, '商品价格已变动');
assert.equal(seen[0].requestId, 'rid-1');
assert.equal(seen[0].noAccess, false);

const text = formatRequestErrorCopy(seen[0]);
assert.ok(text.includes('Request-Id: rid-1'));
assert.ok(text.includes('商品价格已变动'));

reportHttpError({status: 401, url: '/v1/hlj/order/pos', method: 'GET', message: 'Unauthorized'});
assert.equal(seen[1].noAccess, true);
assert.equal(seen[1].message, '该页面无访问权限');

reportHttpError({status: 401, url: '/v1/system/auth/user/signin', method: 'POST', message: 'bad password'});
assert.equal(seen.length, 2);

console.log('request error ok');
