import * as React from 'react';
import {isShiftChecked, subscribeShiftChecked} from './startupSequence';

/** 当前门店是否已核对完交接班（React 17 没有 useSyncExternalStore，这里手动订阅）。 */
export function useShiftChecked(storeId: string): boolean {
    const [, force] = React.useReducer((n: number) => n + 1, 0);
    React.useEffect(() => subscribeShiftChecked(force), []);
    return isShiftChecked(storeId);
}
