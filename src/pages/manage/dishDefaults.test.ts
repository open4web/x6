import assert from 'assert';
import {DEFAULT_STOCK, DISH_IMAGES, coverForCategory, fallbackIntro} from './dishDefaults';

assert.equal(DEFAULT_STOCK, 999);
assert.equal(coverForCategory('热菜'), '/dish-presets/hot.svg');
assert.equal(coverForCategory('没有这种'), '/dish-presets/other.svg');
assert.equal(coverForCategory(' 饮品 '), '/dish-presets/drink.svg');
assert.equal(fallbackIntro('', '热菜'), '');
assert.equal(fallbackIntro('鱼香肉丝', '热菜'), '鱼香肉丝，热菜现做，欢迎品尝。');
assert.equal(fallbackIntro('鱼香肉丝', ''), '鱼香肉丝，招牌现做，欢迎品尝。');
assert.equal(DISH_IMAGES.length, 8);
assert.equal(new Set(DISH_IMAGES.map((img) => img.src)).size, 8);

console.log('dish defaults ok');
