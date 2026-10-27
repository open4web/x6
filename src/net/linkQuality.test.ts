import assert from 'assert';
import {barsFor, classifyLink, LINK_PROBE_PATH, median, probeLink, type LinkSample} from './linkQuality';

const ok = (rtt: number): LinkSample => ({ok: true, down: false, rtt, at: 1});
const fail = (): LinkSample => ({ok: false, down: false, rtt: null, at: 1});
const down = (rtt: number): LinkSample => ({ok: false, down: true, rtt, at: 1});

assert.equal(median([100, 300, 500]), 300);
assert.equal(median([100, 400]), 250);
assert.equal(barsFor('excellent'), 4);
assert.equal(barsFor('offline'), 0);
assert.equal(barsFor('checking'), 0);

assert.deepEqual(classifyLink([], true), {level: 'checking', rtt: null});
assert.equal(classifyLink([ok(80)], false).level, 'offline');
assert.equal(classifyLink([ok(80)], true).level, 'excellent');
assert.equal(classifyLink([ok(150)], true).level, 'excellent');
assert.equal(classifyLink([ok(151)], true).level, 'good');
assert.equal(classifyLink([ok(400)], true).level, 'good');
assert.equal(classifyLink([ok(401)], true).level, 'fair');
assert.equal(classifyLink([ok(900)], true).level, 'fair');
assert.equal(classifyLink([ok(901)], true).level, 'weak');
assert.equal(classifyLink([ok(100), fail()], true).level, 'weak');
assert.equal(classifyLink([fail(), fail()], true).level, 'offline');
assert.equal(classifyLink([down(300)], true).level, 'down');
assert.equal(classifyLink([ok(100), ok(300), ok(500)], true).rtt, 300);

async function main() {
    let tick = 0;
    const times = [1000, 1128];
    const reached = await probeLink(async (url) => {
        assert.equal(url, LINK_PROBE_PATH + '?probe=1');
        return {status: 404};
    }, {online: true, now: () => times[tick++]});
    assert.equal(reached.ok, true);
    assert.equal(reached.down, false);
    assert.equal(reached.rtt, 128);

    const sick = await probeLink(async () => ({status: 503}), {online: true, now: () => 0});
    assert.equal(sick.ok, false);
    assert.equal(sick.down, true);

    const dropped = await probeLink(async () => {
        throw new Error('offline');
    }, {online: true, now: () => 0});
    assert.equal(dropped.ok, false);
    assert.equal(dropped.rtt, null);

    const localOffline = await probeLink(async () => {
        throw new Error('should not fetch');
    }, {online: false});
    assert.equal(localOffline.ok, false);

    console.log('x6 link quality ok');
}

main();
