import React, { useEffect, useState } from 'react';

type VersionInfo = {
    version: string;
    gitHash: string;
    gitBranch: string;
    buildTime: string;
};

export default function AppVersion() {
    const [info, setInfo] = useState<VersionInfo | null>(null);

    useEffect(() => {
        // BASE_URL 可能是 '/'、'/admin/'、'./'
        // 相对路径请求，始终同源，不会出现 tech. 这种跨域
        let base =  '/';
        const url = `${base}version.json?t=${Date.now()}`;
        console.log('[AppVersion] fetch', url);

        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data: VersionInfo) => setInfo(data))
            .catch((err) => {
                console.error('[AppVersion] load failed:', err);
            });
    }, []);

    if (!info) return null;

    const shortHash =
        info.gitHash && info.gitHash !== 'unknown'
            ? info.gitHash.slice(0, 7)
            : '--';

    return (
        <span
            title={`branch: ${info.gitBranch}\nbuild: ${info.buildTime}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: 8,
                padding: '1px 4px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
            }}
        >
      v{info.version} · {shortHash}
    </span>
    );
}