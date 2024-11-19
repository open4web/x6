import * as React from 'react';
import {Admin, CustomRoutes, houseDarkTheme, houseLightTheme, radiantDarkTheme, radiantLightTheme} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Route } from 'react-router';

import { Login, Layout } from './layout';
import chineseMessages from './i18n/zh';

// @ts-ignore
import Configuration from './configuration/Configuration';
import MyDataProvider from './dataProvider/customeProvider';


// 系统设置

// 加载业务

import {SendHeartbeatRequest} from "./utils/heartbeat";
import MyAuthProvider from "./common/MyAuthProvider";
import MyShop from "./pages/home/Components/Shop";
import {Dashboard} from "./pages/dashboard/Dashboard";

// 国际化
const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    } else if (locale === 'en') {
        console.log("choose en")
        return import('./i18n/en').then(messages => messages.default);
    }
    // Always fallback on chinese
    return chineseMessages;
}, 'zh');


// 应用配置
const App = () => {
    // 加载部署的时候的配置
    // 部分企业或者用户需要定制化
    // React.useEffect(() => {
    //     const interval = setInterval(
    //         SendHeartbeatRequest, 3000); // 每30秒发起一次心跳请求
    //
    //     return () => clearInterval(interval);
    // }, []);

        return (<React.Fragment>
            <Admin
                title={"This is Templates "}
                dataProvider={MyDataProvider}
                authProvider={MyAuthProvider}
                dashboard={Dashboard}
                loginPage={Login}
                // layout={Layout}
                i18nProvider={i18nProvider}
                disableTelemetry
                // theme={radiantLightTheme}
                // lightTheme={houseLightTheme}
                darkTheme={houseDarkTheme}
                defaultTheme={"dark"}
                requireAuth

            >
                <CustomRoutes>
                    <Route path="/configuration" element={<Configuration/>}/>
                    {/* 图表 */}
                    <Route path="/" element={<Dashboard/>}/>
                </CustomRoutes>

                {/* 基础权限系统 */}
            </Admin>
        </React.Fragment>
    );
};

export default App;

