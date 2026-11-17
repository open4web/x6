import assert from 'assert';
import {guardDecision, isGuardedDevicePath, isDeviceNotAllowed} from './deviceGuard.js';

assert.equal(isGuardedDevicePath('/v1/hlj/product/pos/menu'), true);
assert.equal(isGuardedDevicePath('/v1/hlj/order/pos'), true);
assert.equal(isGuardedDevicePath('/v1/pay/cash/pay'), true);
assert.equal(isGuardedDevicePath('https://pos.example.com/v1/hlj/order/pos?x=1'), true);
assert.equal(isGuardedDevicePath('/v1/system/auth/heartbeat'), false);
assert.equal(isGuardedDevicePath('/v1/hlj/store/seat/1'), false);
assert.equal(isGuardedDevicePath('/v1/hlj/order/place'), false);
assert.equal(isGuardedDevicePath('/v1/pay/mini/prepare'), false);

assert.equal(guardDecision(200, {}), 'allow');
assert.equal(guardDecision(400, {message: '参数错误'}), 'allow');
assert.equal(guardDecision(403, {error: 'device_not_allowed', message: '本机未加入点餐设备白名单'}), 'deny');
assert.equal(guardDecision(401, {message: 'Unauthorized'}), 'skip');
assert.equal(guardDecision(500, {message: 'boom'}), 'skip');
assert.equal(isDeviceNotAllowed({message: '本机未加入点餐设备白名单，请联系管理员'}), true);

console.log('device guard ok');
