import assert from 'assert';
import {CartItem} from '../common/types';
import {comboListPrice, comboSlotSummary, matchComboGroups, spiceSelections, toOrderBuckets} from './comboMatch';

function dish(partial: Partial<CartItem> & Pick<CartItem, 'id' | 'name' | 'price'>): CartItem {
    return {
        origin_price: partial.price,
        quantity: 1,
        propsOptions: [],
        spiceOptions: [],
        desc: '',
        combName: '',
        combID: '',
        kindName: '',
        combPrice: 0,
        combRequestItems: [],
        ...partial,
    };
}

const sizeProp = {
    name: '份量',
    id: '6a80988d0ebcdd7322e263b2',
    multipleSelection: false,
    spiceOptions: [
        {id: '6448768', name: '大份', price: 1},
        {id: '6448769', name: '中份', price: 0},
        {id: '6448770', name: '小份', price: 0},
    ],
};

const iceProp = {
    name: '冰量',
    id: '6a80988d0ebcdd7322e263b3',
    multipleSelection: false,
    spiceOptions: [
        {id: '1001', name: '正常冰', price: 0},
        {id: '1002', name: '去冰', price: 2},
    ],
};

const withSize = dish({
    id: 'noodles',
    name: '螺蛳粉',
    price: 12,
    origin_price: 12,
    spiceOptions: [sizeProp],
    desc: '大份',
});

{
    const selected = spiceSelections(withSize);
    assert.deepEqual(selected, [{
        is_default: 0,
        id: 6448768,
        code: '6a80988d0ebcdd7322e263b2',
        value: '大份',
        price: 1,
    }]);

    const priced = matchComboGroups([withSize], []);
    assert.strictEqual(priced.payAmount, 13);
    assert.strictEqual(priced.originalAmount, 13);

    const buckets = toOrderBuckets([withSize], priced);
    assert.strictEqual(buckets.length, 1);
    assert.strictEqual(buckets[0].Price, 13);
    assert.strictEqual(buckets[0].props_text, '大份');
    assert.deepEqual(buckets[0].props, [6448768]);
    assert.deepEqual(buckets[0].props_item, selected);
}

{
    const plain = dish({id: 'noodles', name: '螺蛳粉', price: 12, origin_price: 12, spiceOptions: [sizeProp]});
    const buckets = toOrderBuckets([plain], matchComboGroups([plain], []));
    assert.strictEqual(buckets[0].Price, 12);
    assert.deepEqual(buckets[0].props_item, []);
    assert.deepEqual(buckets[0].props, []);
}

{
    const two = dish({
        id: 'drink',
        name: '柠檬茶',
        price: 10,
        origin_price: 10,
        quantity: 2,
        spiceOptions: [sizeProp, iceProp],
        desc: '大份,去冰',
    });
    const selected = spiceSelections(two);
    assert.deepEqual(selected.map(item => item.value), ['大份', '去冰']);
    assert.deepEqual(selected.map(item => item.price), [1, 2]);
    const priced = matchComboGroups([two], []);
    assert.strictEqual(priced.payAmount, 26);
    const buckets = toOrderBuckets([two], priced);
    assert.strictEqual(buckets[0].Price, 13);
    assert.deepEqual(buckets[0].props, [6448768, 1002]);
    assert.ok(buckets[0].props_item?.length === 2);
}

{
    const zeroExtra = dish({
        id: 'noodles',
        name: '螺蛳粉',
        price: 12,
        origin_price: 12,
        spiceOptions: [sizeProp],
        desc: '中份',
    });
    const buckets = toOrderBuckets([zeroExtra], matchComboGroups([zeroExtra], []));
    assert.strictEqual(buckets[0].Price, 12);
    assert.deepEqual(buckets[0].props, [6448769]);
    assert.strictEqual(buckets[0].props_item?.[0]?.value, '中份');
}

{
    const lunch = {
        id: 'lunch',
        name: '午餐套餐',
        price: 38,
        combo: [
            {combName: '主食', price: 0, requires: 1, products: ['a']},
            {combName: '配菜', price: 0, requires: 1, products: ['b', 'c']},
            {combName: '饮料', price: 0, requires: 1, products: ['d']},
        ],
    };
    assert.strictEqual(comboSlotSummary(lunch), '主食 + 配菜 + 饮料');
    const prices: Record<string, number> = {a: 22, b: 12, c: 18, d: 8};
    const listed = comboListPrice(lunch, id => prices[id] || 0);
    assert.strictEqual(listed.price, 38);
    assert.strictEqual(listed.original, 42);
    assert.strictEqual(listed.discount, 4);
}
