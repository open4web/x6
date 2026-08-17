import * as React from 'react';
import {Admin, CustomRoutes, houseDarkTheme, houseLightTheme} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {Route} from 'react-router';

import {Layout, Login} from './layout';
import chineseMessages from './i18n/zh';
import {supportedLocales} from './i18n/locales';

// @ts-ignore
import Configuration from './configuration/Configuration';
import MyDataProvider from './dataProvider/customeProvider';


// 系统设置
// 加载业务
import MyAuthProvider from "./common/MyAuthProvider";
import {MyHome} from "./pages/dashboard/MyHome";
import {MyCartProvider} from "./dataProvider/MyCartProvider";

// 国际化
const localeLoaders: Record<string, () => Promise<{default: any}>> = {
    zh: () => Promise.resolve({default: chineseMessages}),
    'zh-TW': () => import('./i18n/zh-TW'),
    en: () => import('./i18n/en'),
    fr: () => import('./i18n/fr'),
    ja: () => import('./i18n/ja'),
    ko: () => import('./i18n/ko'),
    th: () => import('./i18n/th'),
    vi: () => import('./i18n/vi'),
    id: () => import('./i18n/id'),
    es: () => import('./i18n/es'),
};

const i18nProvider = polyglotI18nProvider(locale => {
    const loader = localeLoaders[locale];
    if (loader && locale !== 'zh') {
        return loader().then(messages => messages.default);
    }
    return chineseMessages;
}, 'zh', [...supportedLocales]);


// 应用配置
const App = () => {
    // 加载部署的时候的配置
    // 部分企业或者用户需要定制化

    return (<React.Fragment>
            <MyCartProvider>
                <Admin
                    title={"order by pos "}
                    dataProvider={MyDataProvider}
                    authProvider={MyAuthProvider}
                    dashboard={MyHome}
                    loginPage={Login}
                    layout={Layout}
                    i18nProvider={i18nProvider}
                    disableTelemetry
                    darkTheme={houseDarkTheme}
                    lightTheme={houseLightTheme}
                    defaultTheme={"dark"}
                    requireAuth


                >
                    <CustomRoutes>
                        <Route path="/configuration" element={<Configuration/>}/>
                        {/* 图表 */}
                        <Route path="/" element={<MyHome/>}/>
                    </CustomRoutes>

                    {/* 基础权限系统 */}
                </Admin>
            </MyCartProvider>
        </React.Fragment>
    );
};

export default App;

