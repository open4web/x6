import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {extractApiPaths, grantExceedsX6} from './scanX6Apis';
import {X6_REQUIRED_APIS} from './x6RequiredApis';

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function scanSrc(root: string): string[] {
    const found = new Set<string>();
    const walk = (dir: string) => {
        for (const name of fs.readdirSync(dir)) {
            if (name === 'node_modules' || name.startsWith('.')) continue;
            const full = path.join(dir, name);
            if (fs.statSync(full).isDirectory()) {
                walk(full);
                continue;
            }
            if (!/\.(ts|tsx)$/.test(name)) continue;
            if (/\.(test|spec)\.(ts|tsx)$/.test(name)) continue;
            if (name === 'x6RequiredApis.ts') continue;
            for (const item of extractApiPaths(fs.readFileSync(full, 'utf8'))) found.add(item);
        }
    };
    walk(root);
    return Array.from(found).sort();
}

const commented = `
    // fetchData('/v1/device/pos/printer', (response) => {});
    /* axios.get('/v1/hlj/member/level') */
`;
assert.deepEqual(extractApiPaths(commented), []);

const calls = `
    fetchData('/v1/hlj/order/pos?filter=' + JSON.stringify({}), () => {});
    fetchData(\`/v1/hlj/store/seat/\${storeId}\`, () => {});
    fetchData('/v1/hlj/finance/shift/' + merchantId, () => {});
    fetchData(\`/v1/hlj/device/rpc/reprint/\${orderNo}\`, () => {});
    authApi.post('/user/otp/validate', {});
    authApi.post<{ otp_verified: string }>('/user/otp/verify', {});
`;
assert.deepEqual(extractApiPaths(calls), [
    '/v1/hlj/device/rpc/reprint',
    '/v1/hlj/finance/shift',
    '/v1/hlj/order/pos',
    '/v1/hlj/store/seat',
    '/v1/system/auth/user/otp/validate',
    '/v1/system/auth/user/otp/verify',
]);

const required = ['/v1/hlj/order/pos', '/v1/hlj/store/seat'];
assert.equal(grantExceedsX6('/a/bc', required), true);
assert.equal(grantExceedsX6('/v1/hlj/order/pos', required), false);
assert.equal(grantExceedsX6('/v1/hlj/order/pos/:_id', required), false);
assert.equal(grantExceedsX6('/v1/hlj/store/seat/:storeId', required), false);
assert.equal(grantExceedsX6('/v1/hlj/product/categories', required), true);

const scanned = scanSrc(srcRoot);
assert.deepEqual(scanned, [...X6_REQUIRED_APIS], `x6 API catalog is stale.\nscanned:\n${scanned.join('\n')}`);
assert.equal(scanned.includes('/v1/device/pos/printer'), false);
assert.equal(scanned.includes('/v1/hlj/member/level'), false);
assert.equal(scanned.includes('/v1/system/auth/user/access'), true);

console.log(`x6 api scan ok (${scanned.length})`);
