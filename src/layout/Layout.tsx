import { Layout, LayoutProps } from 'react-admin';
import Menu from './Menu';
import MyAppBar from "./MyAppBar";
import NoticeHost from './NoticeHost';
import SeatHoldWatch from '../common/SeatHoldWatch';
import RequestErrorHost from '../common/RequestErrorHost';
import {useApplyFontSize} from './fontScale';

function FontSizeBridge() {
    useApplyFontSize();
    return null;
}

export default (props: LayoutProps) => {
    return (
        <>
            <FontSizeBridge />
            <NoticeHost channel="pos" />
            <RequestErrorHost />
            <SeatHoldWatch />
            <Layout {...props} appBar={MyAppBar} menu={Menu}/>
        </>
    );
};
