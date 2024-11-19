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

// process.env.NODE_ENV === 'production' ? '/v1' : '/api/v1'; 
const baseDataProvider = simpleRestProvider('/v1', httpClient);

function toBasicPath(path: string) {
    const resourceSlice = path.split(".").slice(2, 6);
    return resourceSlice.join("/")
}

const MyDataProvider = {
    ...baseDataProvider,
    getOne: async (resource: string, params: GetOneParams<any>) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.getOne(resourceName, params);
    },
    getMany: async (resource: string, params: GetManyParams) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.getMany(resourceName, params);
    },
    getList: async (resource: string, params: GetListParams) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.getList(resourceName, params);

    },
    getManyReference: async (resource: string, params: GetManyReferenceParams) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.getManyReference(resourceName, params);

    },
    update: async (resource: string, params: UpdateParams<any>) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.update(resourceName, params);

    },
    create: async (resource: string, params: CreateParams<any>) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.create(resourceName, params);
    },
    delete: async (resource: string, params: DeleteParams<any>) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.delete(resourceName, params);
    },
    deleteMany: async (resource: string, params: DeleteManyParams<any>) => {
        const resourceName = toBasicPath(resource)
        return baseDataProvider.deleteMany(resourceName, params);
    },
};

export default MyDataProvider;