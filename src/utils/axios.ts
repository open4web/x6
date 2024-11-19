import axios from "axios";

const axiosInstance = axios.create();
const BASE_URL = "/v1/system/auth";

export const authApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || "Something went wrong"
        )
);

export default axiosInstance;
