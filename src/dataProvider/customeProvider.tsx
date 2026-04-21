import simpleRestProvider from "ra-data-simple-rest";
import {
    CreateParams,
    DeleteManyParams,
    DeleteParams,
    fetchUtils,
    GetListParams,
    GetManyParams,
    GetManyReferenceParams,
    GetOneParams,
    UpdateParams
} from "react-admin";

const httpClient = (url: any, options = {}) => {
    return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = simpleRestProvider('/v1', httpClient);

function toBasicPath(path: string) {
    const resourceSlice = path.split(".").slice(2, 6);
    return resourceSlice.join("/");
}

/* ================= 缓存核心 ================= */

type CacheItem = {
    data: any;
    expire: number;
};

const CACHE_TTL = 5 * 60 * 1000; // 5分钟
const cache = new Map<string, CacheItem>();
const pending = new Map<string, Promise<any>>();

/* 生成 key */
function getCacheKey(resource: string, params: any) {
    return `${resource}:${JSON.stringify(params)}`;
}

/* 获取缓存 */
function getCache(key: string) {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expire) {
        cache.delete(key);
        return null;
    }

    return item.data;
}

/* 设置缓存 */
function setCache(key: string, data: any) {
    cache.set(key, {
        data,
        expire: Date.now() + CACHE_TTL,
    });
}

/* 清理某个资源缓存 */
function clearResourceCache(resource: string) {
    // @ts-ignore
    for (const key of cache.keys()) {
        if (key.startsWith(resource)) {
            cache.delete(key);
        }
    }
}

/* 核心缓存包装 */
async function withCache(
    resource: string,
    params: any,
    fetcher: () => Promise<any>
) {
    const key = getCacheKey(resource, params);

    // 1️⃣ 命中缓存
    const cached = getCache(key);
    if (cached) return cached;

    // 2️⃣ 正在请求（防并发）
    if (pending.has(key)) {
        return pending.get(key)!;
    }

    // 3️⃣ 发起请求
    const promise = fetcher();
    pending.set(key, promise);

    try {
        const result = await promise;
        setCache(key, result);
        return result;
    } finally {
        pending.delete(key);
    }
}

/* ================= DataProvider ================= */

const MyDataProvider = {
    ...baseDataProvider,

    // ====== GET（带缓存）======

    getOne: async (resource: string, params: GetOneParams<any>) => {
        const r = toBasicPath(resource);
        return withCache(r, params, () =>
            baseDataProvider.getOne(r, params)
        );
    },

    getMany: async (resource: string, params: GetManyParams) => {
        const r = toBasicPath(resource);
        return withCache(r, params, () =>
            baseDataProvider.getMany(r, params)
        );
    },

    getList: async (resource: string, params: GetListParams) => {
        const r = toBasicPath(resource);
        return withCache(r, params, () =>
            baseDataProvider.getList(r, params)
        );
    },

    getManyReference: async (resource: string, params: GetManyReferenceParams) => {
        const r = toBasicPath(resource);
        return withCache(r, params, () =>
            baseDataProvider.getManyReference(r, params)
        );
    },

    // ====== 写操作（清缓存）======

    update: async (resource: string, params: UpdateParams<any>) => {
        const r = toBasicPath(resource);
        const res = await baseDataProvider.update(r, params);
        clearResourceCache(r);
        return res;
    },

    create: async (resource: string, params: CreateParams<any>) => {
        const r = toBasicPath(resource);
        const res = await baseDataProvider.create(r, params);
        clearResourceCache(r);
        return res;
    },

    delete: async (resource: string, params: DeleteParams<any>) => {
        const r = toBasicPath(resource);
        const res = await baseDataProvider.delete(r, params);
        clearResourceCache(r);
        return res;
    },

    deleteMany: async (resource: string, params: DeleteManyParams<any>) => {
        const r = toBasicPath(resource);
        const res = await baseDataProvider.deleteMany(r, params);
        clearResourceCache(r);
        return res;
    },
};

export default MyDataProvider;