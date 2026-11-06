import assert from 'assert';
import {buildRememberedLogin, maskPhone, parseRememberedLogin, REMEMBER_TTL_MS} from './rememberLogin';

const now = 1_700_000_000_000;
const saved = buildRememberedLogin('13800138000', 'device-token-1', now);
if (!saved) throw new Error('expected a remembered login');
assert.equal(saved.until, now + REMEMBER_TTL_MS);
assert.equal(parseRememberedLogin(JSON.stringify(saved), now + 1000)?.deviceToken, 'device-token-1');
assert.equal(parseRememberedLogin(JSON.stringify(saved), saved.until), null);
assert.equal(parseRememberedLogin('nope', now), null);
assert.equal(parseRememberedLogin(JSON.stringify({phone: '13800138000', password: 'x', until: now + 10}), now), null);
assert.equal(parseRememberedLogin(JSON.stringify({phone: '13800138000', deviceToken: '', until: now + 10}), now), null);
assert.equal(maskPhone('13800138000'), '138****8000');
assert.equal(buildRememberedLogin('  ', 'x', now), null);
assert.equal(buildRememberedLogin('13800138000', '', now), null);
