import assert from 'assert';
import {
    CLEAR_GRACE_SEC,
    DELAY_SEC,
    DINING_LIMIT_SEC,
    extraAfterDelay,
    holdPhase,
    occupiedStartSec,
    secondsUntilClear,
} from './seatHold';

const start = 1_700_000_000;

assert.equal(DINING_LIMIT_SEC, 3 * 60 * 60);
assert.equal(DELAY_SEC, 30 * 60);
assert.equal(CLEAR_GRACE_SEC, 60);

assert.equal(occupiedStartSec({status: 0, occupied_at: start}), 0);
assert.equal(occupiedStartSec({status: 2, occupied_at: start}), 0);
assert.equal(occupiedStartSec({status: 1, occupied_at: 0}), 0);
assert.equal(occupiedStartSec({status: 1, occupied_at: start}), start);
assert.equal(occupiedStartSec({status: 1, occupied_at: start * 1000}), start);

assert.equal(holdPhase(0, 0, start + DINING_LIMIT_SEC), 'ok');
assert.equal(holdPhase(start, 0, start + DINING_LIMIT_SEC - 1), 'ok');
assert.equal(holdPhase(start, 0, start + DINING_LIMIT_SEC), 'prompt');
assert.equal(holdPhase(start, 0, start + DINING_LIMIT_SEC + CLEAR_GRACE_SEC - 1), 'prompt');
assert.equal(holdPhase(start, 0, start + DINING_LIMIT_SEC + CLEAR_GRACE_SEC), 'clear');
assert.equal(secondsUntilClear(start, 0, start + DINING_LIMIT_SEC), CLEAR_GRACE_SEC);
assert.equal(secondsUntilClear(start, 0, start + DINING_LIMIT_SEC + 60), 0);

const atPrompt = start + DINING_LIMIT_SEC + 10;
const once = extraAfterDelay(start, 0, atPrompt);
assert.equal(holdPhase(start, once, atPrompt), 'ok');
assert.equal(holdPhase(start, once, atPrompt + DELAY_SEC - 1), 'ok');
assert.equal(holdPhase(start, once, atPrompt + DELAY_SEC), 'prompt');

const twice = extraAfterDelay(start, once, atPrompt);
assert.equal(holdPhase(start, twice, atPrompt + DELAY_SEC), 'ok');
assert.equal(holdPhase(start, twice, atPrompt + DELAY_SEC * 2), 'prompt');

const early = extraAfterDelay(start, 0, start + 60);
assert.equal(holdPhase(start, early, start + DINING_LIMIT_SEC), 'ok');
assert.equal(holdPhase(start, early, start + DINING_LIMIT_SEC + DELAY_SEC), 'prompt');

console.log('seat hold ok');
