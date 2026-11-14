import assert from 'assert';
import {
    MANUAL_PLATE_LIMIT_SEC,
    findActiveManualPlate,
    markManualPlateOrdered,
    manualPlateSecondsLeft,
    rememberManualPlate,
    releaseUnorderedManualPlate,
    sweepManualPlates,
} from './manualPlate';

const mem = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
    value: {
        getItem: (key: string) => mem.get(key) ?? null,
        setItem: (key: string, value: string) => mem.set(key, value),
        removeItem: (key: string) => mem.delete(key),
        clear: () => mem.clear(),
    },
    configurable: true,
});

const store = 'store-plate';
const start = 1_700_000_000;

localStorage.clear();

assert.equal(MANUAL_PLATE_LIMIT_SEC, 2 * 60 * 60);

const first = rememberManualPlate(store, '8', start);
assert.equal(first?.at, start);
assert.equal(rememberManualPlate(store, '08', start + 100)?.at, start);
assert.equal(findActiveManualPlate(store, '8', start + MANUAL_PLATE_LIMIT_SEC - 1)?.no, '8');
assert.equal(manualPlateSecondsLeft(first!, start + 60), MANUAL_PLATE_LIMIT_SEC - 60);
assert.equal(findActiveManualPlate(store, '8', start + MANUAL_PLATE_LIMIT_SEC), null);

rememberManualPlate(store, '12', start);
markManualPlateOrdered(store, '12', start + 10);
releaseUnorderedManualPlate(store, '12', start + 20);
assert.equal(findActiveManualPlate(store, '12', start + 20)?.ordered, true);

rememberManualPlate(store, '3', start);
releaseUnorderedManualPlate(store, '03', start + 5);
assert.equal(findActiveManualPlate(store, '3', start + 5), null);

rememberManualPlate(store, '9', start);
const released = sweepManualPlates(store, start + MANUAL_PLATE_LIMIT_SEC);
assert.deepEqual(released.map(item => item.no), ['8', '12', '9']);
assert.equal(findActiveManualPlate(store, '9', start + MANUAL_PLATE_LIMIT_SEC), null);
assert.equal(sweepManualPlates(store, start + MANUAL_PLATE_LIMIT_SEC).length, 0);
