import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {FONT_SCALE, FONT_SIZES, applyFontScale} from './fontScale';

describe('fontScale', () => {
    it('exposes three sizes with medium as current baseline', () => {
        assert.equal(FONT_SIZES.length, 3);
        assert.equal(FONT_SCALE.medium, 1);
        assert.ok(FONT_SCALE.small < FONT_SCALE.medium);
        assert.ok(FONT_SCALE.large > FONT_SCALE.medium);
    });

    it('writes css var and data attribute on provided root', () => {
        const props: Record<string, string> = {};
        const root = {
            style: {
                setProperty(name: string, value: string) {
                    props[name] = value;
                },
                getPropertyValue(name: string) {
                    return props[name] || '';
                },
            },
            dataset: {} as Record<string, string>,
        };
        assert.equal(applyFontScale('small', root), 0.875);
        assert.equal(props['--pos-font-scale'], '0.875');
        assert.equal(root.dataset.posFont, 'small');
        assert.equal(applyFontScale('large', root), 1.125);
        assert.equal(props['--pos-font-scale'], '1.125');
        assert.equal(root.dataset.posFont, 'large');
        assert.equal(applyFontScale('medium', root), 1);
        assert.equal(props['--pos-font-scale'], '1');
        assert.equal(root.dataset.posFont, 'medium');
    });
});
