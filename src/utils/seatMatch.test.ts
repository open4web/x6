import assert from 'assert';
import {findSeatsByTypedNo, sameTableToken, StoreSeat} from './storeCache';

function seat(partial: Partial<StoreSeat> & Pick<StoreSeat, 'id'>): StoreSeat {
    return {name: '', status: 0, ...partial};
}

assert.equal(sameTableToken('8', '8'), true);
assert.equal(sameTableToken('08', '8'), true);
assert.equal(sameTableToken(' 8 ', '8'), true);
assert.equal(sameTableToken('A 8', 'a8'), true);
assert.equal(sameTableToken('8', '18'), false);
assert.equal(sameTableToken('8', '80'), false);
assert.equal(sameTableToken('', '8'), false);

const seats = [
    seat({id: 's1', table_no: '8', status: 0}),
    seat({id: 's2', table_no: '18', status: 1}),
    seat({id: 's3', name: '窗边', table_no: '3', status: 2}),
    seat({id: 's4', table_no: '08', name: '卡座', status: 1}),
];

assert.deepEqual(findSeatsByTypedNo(seats, '8').map(item => item.id), ['s1', 's4']);
assert.deepEqual(findSeatsByTypedNo(seats, '08').map(item => item.id), ['s1', 's4']);
assert.deepEqual(findSeatsByTypedNo(seats, '18').map(item => item.id), ['s2']);
assert.deepEqual(findSeatsByTypedNo(seats, '').map(item => item.id), []);
assert.deepEqual(findSeatsByTypedNo(seats, '窗边').map(item => item.id), ['s3']);
assert.deepEqual(findSeatsByTypedNo([seat({id: 'a', table_no: '8', area: 'p:A'})], 'A8', 'table_no|A').map(item => item.id), ['a']);
assert.deepEqual(findSeatsByTypedNo([seat({id: 'uuid-8', table_no: '12'})], '8').map(item => item.id), []);
