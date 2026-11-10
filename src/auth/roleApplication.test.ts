import assert from 'node:assert/strict';
import {test} from 'node:test';
import {canApply, currentApplication, RoleApplication} from './roleApplication';

test('approval is not binding; pending and approved requests cannot be duplicated', () => {
    const row = (status: RoleApplication['status'], version = 'v1'): RoleApplication => ({id: 'fixture', status, preset: {key: 'x6', version, name: 'x6', resources: []}, audit: []});
    assert.equal(canApply(), true);
    assert.equal(canApply(row('rejected')), true);
    for (const status of ['pending', 'approved', 'bound'] as const) assert.equal(canApply(row(status)), false);
    assert.equal(currentApplication([row('bound', 'v1')], 'v2'), undefined);
    assert.equal(currentApplication([row('bound', 'v1'), row('approved', 'v2')], 'v2')?.status, 'approved');
});
