import assert from 'assert';
import {
    dutyReadyKey,
    elapsedSeconds,
    isNotStartedMessage,
    parseStartMs,
    readDutyPayload,
} from './shiftDuty';

assert.equal(parseStartMs(1700000000), 1700000000000);
assert.equal(parseStartMs(1700000000000), 1700000000000);
assert.equal(parseStartMs('1700000000'), 1700000000000);
assert.equal(parseStartMs(''), 0);
assert.equal(parseStartMs(false), 0);
assert.equal(elapsedSeconds(1_700_000_000_000, 1_700_000_005_000), 5);
assert.equal(elapsedSeconds(1_700_000_005_000, 1_700_000_000_000), 0);
assert.equal(dutyReadyKey('user-1', 'store-9'), 'shiftReady:user-1:store-9');
assert.equal(dutyReadyKey('', 'store-9'), 'shiftReady:0:store-9');
assert.equal(isNotStartedMessage('还未开始上班, 无法进行交接'), true);
assert.equal(isNotStartedMessage('值班状态暂时无法读取，请稍后重试'), false);

const open = readDutyPayload({ready: true, start: 1700000000});
assert.equal(open?.ready, true);
assert.equal(open?.start, 1700000000);
const closed = readDutyPayload({ready: true, start: 0});
assert.equal(closed?.ready, false);
assert.equal(readDutyPayload({data: {ready: false, start: 0}})?.ready, false);
assert.equal(readDutyPayload({success: true}), null);
