import {fetchUtils} from 'react-admin';


export const SendHeartbeatRequest = () => {
    const userId = localStorage.getItem('user_id');
    const blood = localStorage.getItem('blood');
    const device = localStorage.getItem('device');
    fetchUtils
        .fetchJson('/v1/system/auth/heartbeat?user_id=' + userId + '&blood=' + blood + '&device=' + device, {
            method: 'POST',
            credentials: 'include' // 添加此选项以将cookies添加到请求中
        })
        .then(( value: {status: number, headers: Headers, body: string, json: any}) => {
            // 请求成功时执行回调函数
            // console.log("ping ...ok", value.json)
            localStorage.setItem('device', value?.json?.device)
            localStorage.setItem('blood', value?.json?.blood)
        })
        .catch(() => {
            // 请求失败时执行回调函数
            // console.log("ping ...bad")
        });
};