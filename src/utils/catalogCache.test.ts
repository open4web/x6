import assert from 'assert';
import {catalogGenerations, invalidateCatalog, writeMenus, writeProducts} from './catalogCache';

const merchantId = 'store-catalog-loop';
const before = catalogGenerations();

writeMenus(merchantId, [{id: 'm1', name: '热菜', price: 0, isComboMode: false, products: [], combo: []} as any]);
writeProducts(merchantId, 'm1', []);
const afterWrite = catalogGenerations();
assert.ok(afterWrite.catalog > before.catalog);
assert.strictEqual(afterWrite.refresh, before.refresh);

invalidateCatalog(merchantId);
const afterRefresh = catalogGenerations();
assert.strictEqual(afterRefresh.refresh, afterWrite.refresh + 1);
