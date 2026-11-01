import { Layout, LayoutProps } from 'react-admin';
import Menu from './Menu';
import MyAppBar from "./MyAppBar";
import NoticeHost from './NoticeHost';
import SeatHoldWatch from '../common/SeatHoldWatch';

export default (props: LayoutProps) => {
    return (
        <>
            <NoticeHost channel="pos" />
            <SeatHoldWatch />
            <Layout {...props} appBar={MyAppBar} menu={Menu}/>
        </>
    );
};
