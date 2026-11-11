export type RoleApplication = {
    id: string;
    status: 'pending' | 'approved' | 'rejected' | 'bound';
    preset: RolePreset;
    audit: {action: string; actor: string; at: string; reason?: string}[];
};
export type RolePreset = {
    key: string;
    version: string;
    name: string;
    resources: {path: string; attr: number; grant: boolean; guard: string; calls: {method: string; single: boolean}[]}[];
};
export function currentApplication(rows: RoleApplication[], version: string) {
    return rows.find((row) => row.preset.version === version);
}
export function canApply(row?: RoleApplication) {
    return !row || row.status === 'rejected';
}
