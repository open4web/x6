import assert from 'assert';
import {createDeviceId, isValidDeviceId, readDeviceId, DEVICE_STORAGE_KEY} from './deviceId';

assert.equal(isValidDeviceId('x6_0123456789abcdef0123456789abcdef'), true);
assert.equal(isValidDeviceId('x6_short'), false);
assert.equal(isValidDeviceId('other_0123456789abcdef0123456789abcdef'), false);
assert.equal(isValidDeviceId(''), false);

const a = createDeviceId(1);
const b = createDeviceId(1);
assert.equal(isValidDeviceId(a), true);
assert.equal(a.startsWith('x6_'), true);
assert.notEqual(a, b);

const mem: Record<string, string> = {};
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = {
    getItem: (k: string) => mem[k] || null,
    setItem: (k: string, v: string) => { mem[k] = v; },
};
const first = readDeviceId();
const second = readDeviceId();
assert.equal(first, second);
assert.equal(mem[DEVICE_STORAGE_KEY], first);
console.log('device id ok');
