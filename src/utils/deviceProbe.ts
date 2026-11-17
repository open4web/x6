import {authHeaders} from './authToken';
import {clearDeviceBlocked, guardDecision, markDeviceBlocked} from './deviceGuard';

// 向真正挂了白名单的菜单接口探一次。心跳没有这层校验，不能用来解锁。
export async function probeDeviceAllowed(merchantId?: string): Promise<boolean> {
    try {
        const res = await fetch('/v1/hlj/product/pos/menu', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
            body: JSON.stringify({merchantId: merchantId || ''}),
        });
        let payload: any = null;
        try {
            payload = await res.clone().json();
        } catch {
            payload = null;
        }
        const decision = guardDecision(res.status, payload);
        if (decision === 'deny') {
            markDeviceBlocked();
            return false;
        }
        if (decision === 'allow') {
            clearDeviceBlocked();
            return true;
        }
        return false;
    } catch {
        return false;
    }
}