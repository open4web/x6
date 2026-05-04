
enum platformTypes {
    WxMiniApp, // 微信小程序
    WxScanPay, // 微信扫码
    DouYinMiniApp, // 抖音小程序
    AlipayMiniApp, // 支付宝小程序
    PosTerminalApp = 4, // 现金支付
    HomeWebApp = 5, // 来自官网
    BalancePay = 6, // 余额
    MeiTuanMiniApp = 7, // 美团
}

export const payMethodList = [
    { id: -1, name: '忽略', color: 'red' },
    { id: platformTypes.WxMiniApp, name: '微信小程序', color: '#1AAD19' },
    { id: platformTypes.WxScanPay, name: '微信扫码', color: '#1AAD99' },
    { id: platformTypes.DouYinMiniApp, name: '抖音', color: '#010101' },
    { id: platformTypes.AlipayMiniApp, name: '支付宝', color: '#1677FF' },
    { id: platformTypes.MeiTuanMiniApp, name: '美团', color: '#FFC300' },
    { id: platformTypes.PosTerminalApp, name: '现金', color: '#FF5733' },
    { id: platformTypes.HomeWebApp, name: '官网', color: '#009688' },
    { id: platformTypes.BalancePay, name: '余额', color: '#ff46a8' },
];

export function getPlatformInfo(method: platformTypes) {
    const platform = payMethodList.find((item) => item.id === method);
    return platform || { name: '未知', color: '#666666' }; // 默认值
}