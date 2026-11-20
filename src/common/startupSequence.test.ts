import assert from 'assert';
import {
    isShiftChecked,
    markShiftChecked,
    resetShiftChecked,
    shiftCheckDone,
    subscribeShiftChecked,
} from './startupSequence';

const base = {storeId: 'a', syncedFor: 'a', overtime: false, overtimeHandled: false, overtimeOpen: false, shiftOpen: false};

// 未选店、或还没读完该门店的交接班状态：不算完成
assert.equal(shiftCheckDone({...base, storeId: ''}), false);
assert.equal(shiftCheckDone({...base, syncedFor: ''}), false);
// 换店后上一家店的同步结果不能算数
assert.equal(shiftCheckDone({...base, storeId: 'b'}), false);
// 正常：读完、没有超时
assert.equal(shiftCheckDone(base), true);
// 超时未处理 / 提醒弹窗开着 / 交接班抽屉开着：都要等
assert.equal(shiftCheckDone({...base, overtime: true}), false);
assert.equal(shiftCheckDone({...base, overtime: true, overtimeOpen: true}), false);
assert.equal(shiftCheckDone({...base, overtime: true, overtimeHandled: true, shiftOpen: true}), false);
assert.equal(shiftCheckDone({...base, overtime: true, overtimeHandled: true}), true);

let hits = 0;
const off = subscribeShiftChecked(() => hits++);
assert.equal(isShiftChecked('a'), false);
markShiftChecked('a');
assert.equal(isShiftChecked('a'), true);
assert.equal(isShiftChecked('b'), false);
assert.equal(isShiftChecked(''), false);
markShiftChecked('a'); // 幂等，不重复通知
assert.equal(hits, 1);
resetShiftChecked();
assert.equal(isShiftChecked('a'), false);
assert.equal(hits, 2);
markShiftChecked('');
assert.equal(hits, 2);
off();
markShiftChecked('b');
assert.equal(hits, 2);
console.log('startupSequence ok');
