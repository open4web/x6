import assert from 'assert';
import { isLoginId, normalizeLoginId } from './loginId.ts';

assert.deepEqual(normalizeLoginId('13800138000'), { kind: 'phone', value: '13800138000' });
assert.deepEqual(normalizeLoginId('+86 138-0013-8000'), { kind: 'phone', value: '13800138000' });
assert.deepEqual(normalizeLoginId('User@Example.com'), { kind: 'email', value: 'user@example.com' });
assert.equal(isLoginId('12345'), false);
assert.equal(isLoginId('a@b'), false);
assert.equal(isLoginId(''), false);
console.log('login id ok');
