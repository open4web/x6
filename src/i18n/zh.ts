import { TranslationMessages } from 'react-admin';

import chineseMessages from "./chinese";
const customChineseMessages: TranslationMessages = {
    ...chineseMessages,
    pos: {
        search: '搜索',
        configuration: '主题配置',
        userProfile: '个人中心',
        application: '应用管理',
        language: '语言',
        theme: {
            name: '主题色',
            light: '亮',
            dark: '暗',
        },
        auth: {
            phone: "手机号",
            merchant: "企业号",
            code: "2FA Code",
            security_code: "安全码",
            verified: "验证并激活",
            validate: "验证安全码",
            opt_verified: "2FA验证",
            opt_enabled: "2FA启用"

        },
        dashboard: {
            monthly_revenue: '月收入',
            month_history: '30 天收入历史',
            week_history: "周报",
            new_orders: '新订单',
            pending_reviews: '待查看评论',
            all_reviews: '查看所有评论',
            new_customers: '新客户',
            all_customers: '查看所有客户',
            pending_orders: '待支付订单',
            order: {
                items:
                    'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
            },
            welcome: {
                title: '欢迎使用超级管理中心',
                subtitle:
                    "在使用过程中如遇问题可以通过如下方式联系反馈",
                ra_button: '管理台',
                demo_button: '这个的源码',
                chat: "联系工程师",
                cloud: "更多云应用"
            },
        },
    },
    tool: {
        labels: {
            toggle: "展开",
            upload: "上传"
        }
    },
    resources: {
        // 通用的标题定义
        header: {
            tabs: {
                basic: "基本信息",
                address: "地址信息",
                paths: "路径",
                bbs: "公告",
                config: "配置",
                sort: "排序",
                apps: "应用",
                permissions: "权限设定",
                toolbar: "工具",
                product: "商品"
            },
            common: {
                address: {
                    country: "国家",
                    province: "省",
                    city: "市",
                    district: "区",
                    street: "街",
                    detail: "详情",
                    latitude_and_longitude: "经纬度",
                    longitude: "经度",
                    latitude: "纬度",
                    areaName: "区域"

                },
                safe: {
                    password: "密码"
                },
                bbs: {
                    content: "公告"
                },
                config: {
                    brand: "品牌"
                }
            },

            customers: {
                name: '客户 |||| 客户',
                sub: {
                    address: '客户地址',
                    segments: '客户标签',
                },
                fields: {
                    commands: '订单',
                    created_at: '注册时间',
                    first_seen: 'First seen',
                    groups: '客户群',
                    last_seen: '最近登录',
                    last_seen_gte: 'Visited Since',
                    name: '客户标识',
                    total_spent: '总花费',
                    consumption: '消费总额',
                    tickets: '优惠券(可使用)',
                    phone: '手机号',
                    integral: '积分',
                    password: '密码',
                    confirm_password: '确认密码',
                    stateAbbr: '状态',
                    channel: '渠道',
                    cardFrom: '卡来源',
                    from: '来源',
                    vip_card: '会员卡(正常)',
                    cardId: '卡号',
                    birthDay: '客户生日',
                    cardLevel: '会员等级',
                    gender: '性别',
                    cardStatus: '状态',
                    finance: '财务'
                },
                filters: {
                    last_visited: '上次访问',
                    today: '今天',
                    this_week: '这周',
                    last_week: '上周',
                    this_month: '这个月',
                    last_month: '上个月',
                    earlier: '更早',
                    has_ordered: '是否有订单',
                    has_newsletter: '是否有简报',
                    group: '客户群',
                },
                fieldGroups: {
                    identity: '身份',
                    finance: '资产',
                    address: '地址',
                    stats: '统计',
                    history: '历史',
                    password: '密码',
                    change_password: '更改密码',
                },
                page: {
                    delete: '删除客户',
                },
                errors: {
                    password_mismatch:
                        '两次密码不一致',
                },
            },
            finance: {
                balance: '余额',
                integral: '积分',
                cashCharge: '现金充值',
                gift: '券',
            },
            commands: {
                name: '订单 |||| 订单',
                amount: '1 order |||| %{smart_count} orders',
                title: '订单 %{reference}',
                id: '订单号',
                fields: {
                    basket: {
                        delivery: '运输',
                        reference: 'Reference',
                        quantity: '数量',
                        sum: '总和',
                        tax_rate: '税率',
                        taxes: '税',
                        total: '总共',
                        unit_price: '单价',
                    },
                    address: '地址',
                    customer_id: '客户ID',
                    date_gte: 'Passed Since',
                    date_lte: 'Passed Before',
                    nb_items: 'Nb Items',
                    total_gte: '最小金额',
                    status: '状态',
                    returned: '退款',
                },
                section: {
                    order: '订单列表',
                    customer: '客户',
                    shipping_address: '收获地址',
                    items: '项',
                    total: '总共',
                },
            },
        }
    },
    common: {
        finance: {
            balance: '余额',
            integral: '积分',
            cashCharge: '现金充值',
            gift: '券',
        },
        order: {
            summary: "订单详情",
            orderId: "订单号",
            number: "总数",
            amount: "总价",
            customer: "客户",
            items: "商品列表",
            address: "地址",
            total: "总计",
            basket: {
                reference: "商品",
                unit_price: "单价",
                quantity: "数量",
                total: "小计"
            }
        },
        product: {
            id: "商品编号",
            name: "名称",
            type: "类型",
            sort: "排序",
            icon: "图标",
            sell_status: "销售状态",
            cover_img: "封面",
            price: "价格",
            price_range: "价格区间",

        },
        user: {
            relate: "关联账户",
            name: "用户名",
            owner: "货主",
            userId: "用户账号",
            real_name: "真实姓名",
            id: "身份证",
            phone: "手机号",
            gender: "性别",
            age: "年龄",
            birthday: "生日",
            role: "角色",
            type: "用户类型",
            verified: "验证状态",
            password: "用户密码",
            is_online: "用户在线状态",
            access_level: "用户等级",
            register: "注册时间"
        },
        basic: {
            createdAt: "创建时间",
            updatedAt: "更新时间",
            status: "状态",
            yes: "是",
            no: "否",
            info: "基本信息",
            remark: "备注",
            desc: "详情介绍",
            name: "名称",
            config: "配置",
            path: "路径",
            detail: "详情",
            menu: "菜单",
            disable: "禁用",
            begin_date: "开始时间",
            end_date: "结束时间",
            reference: "引用次数",
            safe: "安全",
            item_number: "项目数量",
            verified: "是否认证",
            chart: "数据可视化",
            from: "来源",
            time: "时间范围",
            operator_type: "操作类型",
            fromAddress: "发货点",
            toAddress: "卸货点"

        },
        address: {
            latitude: "纬度",
            longitude: "经度",
            phone: "手机号",
            mobile: "座机",
            detail: "地址详情",
            area: "区域",

        },
        pay: {
            payer: "付款人",
            payee: "收款人",
            order: "关联订单"
        },
        invoice: {
            name: "发票抬头",
            externalID: "第三方支付单号",
            externalAmount: "第三方支付金额",
            amount: "金额",
            type: "支付类型",
            status: "支付状态",
            orderType: "账单类型",
            shipper: "托运人",
            cargo: "货物",
            truck: "货车",
        }
    }
};

export default customChineseMessages;
