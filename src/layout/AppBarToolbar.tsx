import {LoadingIndicator, LocalesMenuButton} from 'react-admin';
// LoadingIndicator 刷新
import {ThemeSwapper} from '../themes/ThemeSwapper';
import MyAppMenu from "./MyAppBar";
import MyAppBadge from "./MyBadge";
import RightBarButton from "./RightBarButton";

export const AppBarToolbar = () => (
    <>
        {/*<LocalesMenuButton />*/}
            <RightBarButton/>
        <MyAppBadge/>
        <ThemeSwapper/>
        <MyAppMenu/>
    </>
);
