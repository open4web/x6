import assert from 'assert';
import {
    dutyPhase,
    dutyReadyKey,
    elapsedSeconds,
    formatDutyClock,
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
assert.equal(formatDutyClock(0), '00:00:00');
assert.equal(formatDutyClock(3661), '01:01:01');
assert.equal(formatDutyClock(26 * 3600 + 5), '26:00:05');

const hour = 3600;
const atStart = dutyPhase(0);
assert.equal(atStart.band, 'green');
assert.deepEqual(atStart.fills, [0, 0, 0]);
const midGreen = dutyPhase(4 * hour);
assert.equal(midGreen.band, 'green');
assert.equal(midGreen.fills[0], 0.5);
assert.equal(midGreen.fills[1], 0);
assert.equal(dutyPhase(8 * hour - 1).band, 'green');
const at8 = dutyPhase(8 * hour);
assert.equal(at8.band, 'yellow');
assert.deepEqual(at8.fills, [1, 0, 0]);
const midYellow = dutyPhase(10 * hour);
assert.equal(midYellow.band, 'yellow');
assert.equal(midYellow.fills[1], 0.5);
assert.equal(dutyPhase(12 * hour - 1).band, 'yellow');
const at12 = dutyPhase(12 * hour);
assert.equal(at12.band, 'red');
assert.deepEqual(at12.fills, [1, 1, 0]);
const midRed = dutyPhase(18 * hour);
assert.equal(midRed.band, 'red');
assert.equal(midRed.fills[2], 0.5);
assert.deepEqual(dutyPhase(24 * hour).fills, [1, 1, 1]);
assert.equal(dutyPhase(30 * hour).band, 'red');
assert.deepEqual(dutyPhase(30 * hour).fills, [1, 1, 1]);
assert.equal(dutyPhase(Number.NaN).band, 'green');
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
