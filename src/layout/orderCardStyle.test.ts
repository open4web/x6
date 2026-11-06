import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {ORDER_CARD_STYLES, orderCardWidth, orderDetailPaperSx} from './orderCardStyle';

describe('orderCardStyle', () => {
    it('provides at least six distinct card styles', () => {
        assert.ok(ORDER_CARD_STYLES.length >= 6);
        assert.deepEqual(
            [...ORDER_CARD_STYLES],
            ['classic', 'ticket', 'kanban', 'queue', 'strip', 'ledger'],
        );
    });

    it('maps each style to a positive card width', () => {
        for (const style of ORDER_CARD_STYLES) {
            assert.ok(orderCardWidth(style) > 0, style);
        }
    });

    it('returns distinct paper accents for detail styles', () => {
        const classic = orderDetailPaperSx('classic') as Record<string, unknown>;
        const ticket = orderDetailPaperSx('ticket') as Record<string, unknown>;
        const kanban = orderDetailPaperSx('kanban') as Record<string, unknown>;
        assert.notDeepEqual(classic, ticket);
        assert.notDeepEqual(ticket, kanban);
        assert.ok(ticket.border);
        assert.ok(kanban.borderLeft);
    });
});
