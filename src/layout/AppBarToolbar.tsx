import {LoadingIndicator, LocalesMenuButton} from 'react-admin';
// LoadingIndicator 刷新
import {ThemeSwapper} from '../themes/ThemeSwapper';
import MyAppMenu from "./MyAppBar";
import MyAppBadge from "./MyBadge";
import RightBarButton from "./RightBarButton";
import MerchantSelect from "../common/MerchantSelect";

export const AppBarToolbar = () => (
    <>
        <MerchantSelect/>
        {/*<LocalesMenuButton />*/}
        {/*<RightBarButton/>*/}
        {/*<MyAppBadge/>*/}
        {/*<ThemeSwapper/>*/}
        {/*<MyAppMenu/>*/}
    </>
);
