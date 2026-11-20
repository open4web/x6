import assert from 'assert';
import {isStoreGateExempt, readSavedStoreId, resolveStorePick, saveStoreId} from './storePick';

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

const a = {id: 'a'};
const b = {id: 'b'};

assert.deepEqual(resolveStorePick('a', [a, b]), {kind: 'keep', id: 'a'});
assert.deepEqual(resolveStorePick('', [a, b]), {kind: 'pick', stale: false});
assert.deepEqual(resolveStorePick('x', [a, b]), {kind: 'pick', stale: true});
assert.deepEqual(resolveStorePick('', [a]), {kind: 'auto', id: 'a'});
assert.deepEqual(resolveStorePick('x', [a]), {kind: 'auto', id: 'a'});
assert.deepEqual(resolveStorePick('', []), {kind: 'empty', stale: false});
assert.deepEqual(resolveStorePick('x', []), {kind: 'empty', stale: true});
assert.deepEqual(resolveStorePick(' a ', [{id: ''}, a]), {kind: 'keep', id: 'a'});

localStorage.clear();
assert.equal(readSavedStoreId(), '');
saveStoreId('a');
assert.equal(readSavedStoreId(), 'a');
saveStoreId('');
assert.equal(readSavedStoreId(), '');

assert.equal(isStoreGateExempt('/manage/store'), true);
assert.equal(isStoreGateExempt('/manage'), true);
assert.equal(isStoreGateExempt('/'), false);
assert.equal(isStoreGateExempt('/managers'), false);

console.log('storePick ok');
