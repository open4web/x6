import { Layout, LayoutProps } from 'react-admin';
import Menu from './Menu';
import MyAppBar from "./MyAppBar";
import NoticeHost from './NoticeHost';

export default (props: LayoutProps) => {
    return (
        <>
            <NoticeHost channel="pos" />
            <Layout {...props} appBar={MyAppBar} menu={Menu}/>
        </>
    );
};
