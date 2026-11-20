/**
 * 进入点餐后的检查顺序：选门店 → 核对交接班 → 检查打印机。
 * MyShiftSwitch 核对完交接班（含超时提醒已处理、交接班抽屉已关）后调用 markShiftChecked(门店)；
 * MyPrinter 只有在当前门店已核对过交接班时才去查打印机。
 * 不依赖 React，方便单测；React 端用 useShiftChecked 订阅。
 */
type Listener = () => void;

let checkedFor = '';
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach(listener => listener());
}

export function markShiftChecked(storeId: string) {
    const id = (storeId || '').trim();
    if (!id || checkedFor === id) {
        return;
    }
    checkedFor = id;
    notify();
}

export function resetShiftChecked() {
    if (!checkedFor) {
        return;
    }
    checkedFor = '';
    notify();
}

export function isShiftChecked(storeId: string): boolean {
    const id = (storeId || '').trim();
    return id !== '' && checkedFor === id;
}

export function subscribeShiftChecked(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export const OVERTIME_SECONDS = 12 * 3600;

export type ShiftCheckState = {
    storeId: string;
    // 服务端交接班状态已为该门店读完（成功或失败都算读完）
    syncedFor: string;
    // 正在值班且已超过 12 小时
    overtime: boolean;
    // 超时提醒已被处理（稍后再说 / 去交接班）
    overtimeHandled: boolean;
    overtimeOpen: boolean;
    shiftOpen: boolean;
};

/** 交接班核对是否完成：之后才允许检查打印机。 */
export function shiftCheckDone(s: ShiftCheckState): boolean {
    if (!s.storeId || s.syncedFor !== s.storeId) {
        return false;
    }
    if (s.overtimeOpen || s.shiftOpen) {
        return false;
    }
    return !s.overtime || s.overtimeHandled;
}
