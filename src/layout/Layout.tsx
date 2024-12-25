import { Layout, LayoutProps } from 'react-admin';
import Menu from './Menu';
import MyAppBar from "./MyAppBar";

export default (props: LayoutProps) => {
    return <Layout {...props} appBar={MyAppBar} menu={Menu}/>;
};
