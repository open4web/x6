import assert from 'assert';
import {
    closeRequestErrorDialog,
    formatRequestErrorBatchCopy,
    formatRequestErrorCopy,
    getRequestErrorBatch,
    getRequestErrorSoundCountForTests,
    reportHttpError,
    REQUEST_ERROR_EVENT,
    resetRequestErrorQueueForTests,
    setRequestErrorNowForTests,
} from './requestError';

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


resetRequestErrorQueueForTests();
seen.length = 0;
let now = 1_000_000;
setRequestErrorNowForTests(() => now);

reportHttpError({
    status: 409,
    message: '名称已存在',
    requestId: 'rid-409',
    url: '/v1/hlj/product/products',
    method: 'POST',
});
assert.equal(seen.length, 1);
assert.equal(seen[0].status, 409);
assert.equal(seen[0].message, '名称已存在');
assert.equal(seen[0].requestId, 'rid-409');
assert.equal(seen[0].items.length, 1);
assert.equal(getRequestErrorBatch().length, 1);
assert.equal(getRequestErrorSoundCountForTests(), 1);

reportHttpError({
    status: 409,
    message: '名称已存在',
    requestId: 'rid-409',
    url: '/v1/hlj/product/products',
    method: 'POST',
});
assert.equal(seen.length, 1);
now += 1599;
reportHttpError({
    status: 409,
    message: '名称已存在',
    requestId: 'rid-409',
    url: '/v1/hlj/product/products',
    method: 'POST',
});
assert.equal(seen.length, 1);

resetRequestErrorQueueForTests();
seen.length = 0;
now = 2_000_000;
setRequestErrorNowForTests(() => now);
reportHttpError({status: 500, message: 'boom', requestId: 'rid-1', url: '/v1/hlj/order/list', method: 'GET'});
reportHttpError({status: 502, message: 'bad gateway', requestId: 'rid-2', url: '/v1/hlj/product/products', method: 'GET'});
assert.equal(seen.length, 2);
assert.equal(seen[1].items.length, 2);
assert.equal(seen[1].items[0].url, '/v1/hlj/order/list');
assert.equal(seen[1].items[1].url, '/v1/hlj/product/products');
assert.equal(getRequestErrorSoundCountForTests(), 1);
const batchText = formatRequestErrorBatchCopy(seen[1].items);
assert.ok(batchText.includes('Request-Id: rid-1'));
assert.ok(batchText.includes('Request-Id: rid-2'));
assert.ok(batchText.includes('错误: boom'));
assert.ok(batchText.includes('错误: bad gateway'));
assert.ok(batchText.includes('接口: GET /v1/hlj/order/list'));
assert.ok(batchText.includes('接口: GET /v1/hlj/product/products'));

closeRequestErrorDialog();
now += 200;
reportHttpError({status: 500, message: 'late', requestId: 'rid-3', url: '/v1/hlj/order/late', method: 'GET'});
assert.equal(seen.length, 2);
assert.equal(getRequestErrorBatch().length, 0);

now += 801;
reportHttpError({status: 500, message: 'fresh', requestId: 'rid-4', url: '/v1/hlj/order/fresh', method: 'GET'});
assert.equal(seen.length, 3);
assert.equal(seen[2].items.length, 1);
assert.equal(seen[2].url, '/v1/hlj/order/fresh');
assert.equal(seen[2].message, 'fresh');
assert.equal(getRequestErrorSoundCountForTests(), 2);

setRequestErrorNowForTests(null);

console.log('request error ok');
