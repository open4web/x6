enum platformTypes {
    WxMiniApp, // 微信小程序
    DouYinMiniApp, // 抖音小程序
    AlipayMiniApp, // 支付宝小程序
    MeiTuanMiniApp, // 美团
    PosTerminalApp = 4, // 前台点餐
    HomeWebApp = 5, // 来自官网
}

export const platformTypeLists = [
    { id: platformTypes.WxMiniApp, name: '微信', color: '#1AAD19' },
    { id: platformTypes.DouYinMiniApp, name: '抖音', color: '#010101' },
    { id: platformTypes.AlipayMiniApp, name: '支付宝', color: '#1677FF' },
    { id: platformTypes.MeiTuanMiniApp, name: '美团', color: '#FFC300' },
    { id: platformTypes.PosTerminalApp, name: '点餐机', color: '#FF5733' },
    { id: platformTypes.HomeWebApp, name: '官网', color: '#009688' },
];

export function getPlatformInfo(method: platformTypes) {
    const platform = platformTypeLists.find((item) => item.id === method);
    return platform || { name: '未知', color: '#666666' }; // 默认值
}