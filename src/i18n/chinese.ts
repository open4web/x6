import { TranslationMessages } from 'ra-core';

// @ts-ignore
const chineseMessages: TranslationMessages = {
    ra: {
        configurable: {
            customize: "自定义",
            configureMode: "自定义模式",
            inspector: {
                title: "标题",
                content: "正文",
                reset: "重置",
                hideAll: "隐藏所有",
                showAll: "展示所有"
            },
            SimpleList: {
                title: "标题",
                primaryText: "初级标题",
                secondaryText: "二级标题",
                tertiaryText: "末端标题"
            },
            SimpleForm: {
                title: "标题",
                unlabeled: "标签",
            },
            Datagrid: {
                title: "标题",
                unlabeled: "标签",
            },
        },
        action: {
            add_filter: '增加检索',
            add: '增加',
            back: '回退',
            bulk_actions: '选中%{smart_count}项',
            cancel: '取消',
            clear_array_input: "清空输入",
            clear_input_value: '清空输入',
            clone: '克隆',
            confirm: '确认',
            create: '新建',
            create_item: '创建 %{item}',
            delete: '删除',
            edit: '编辑',
            export: '导出',
            list: '列表',
            refresh: '刷新',
            remove_filter: '移除检索',
            remove_all_filters: '移除所有检索',
            remove: '删除',
            save: '保存',
            search: '检索',
            select_all: '选择所有',
            select_row: '选择这行',
            show: '查看',
            sort: '排序',
            undo: '撤销',
            unselect: '反选',
            expand: '展开',
            close: '关闭',
            open_menu: '打开菜单',
            close_menu: 'Close menu',
            update: 'Update',
            move_up: 'Move up',
            move_down: 'Move down',
            open: 'Open',
            toggle_theme: 'Toggle Theme',
            select_columns: "选择列表",
            update_application: "更新应用",
        },
        boolean: {
            true: '是',
            false: '否',
            null: ' ',
        },
        page: {
            create: '新建 %{name}',
            dashboard: '概览',
            edit: '%{name} #%{id}',
            empty: '无 %{name} ',
            error: '出现错误',
            invite: '要增加吗?',
            list: '%{name} 列表',
            loading: '加载中',
            not_found: '未发现',
            show: '%{name} #%{id}',
        },
        input: {
            file: {
                upload_several:
                    '将文件集合拖拽到这里, 或点击这里选择文件集合.',
                upload_single: '将文件拖拽到这里, 或点击这里选择文件.',
            },
            image: {
                upload_several:
                    '将图片文件集合拖拽到这里, 或点击这里选择图片文件集合.',
                upload_single:
                    '将图片文件拖拽到这里, 或点击这里选择图片文件.',
            },
            references: {
                all_missing: '未找到参考数据.',
                many_missing:
                    '至少有一条参考数据不再可用.',
                single_missing:
                    '关联的参考数据不再可用.',
            },
            password: {
                toggle_visible: '隐藏密码',
                toggle_hidden: '显示密码',
            },
        },
        message: {
            about: '关于',
            are_you_sure: '您确定操作?',
            auth_error: "权限错误",
            bulk_delete_content:
                '您确定要删除 %{name}? |||| 您确定要删除 %{smart_count} 项?',
            bulk_delete_title:
                '删除 %{name} |||| 删除 %{smart_count}项 %{name} ',
            bulk_update_content:
                'Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?',
            bulk_update_title:
                'Update %{name} |||| Update %{smart_count} %{name}',
            clear_array_input: "清除数组输入",
            delete_content: '您确定要删除该条目?',
            delete_title: '删除 %{name} #%{id}',
            details: '详情',
            error:
                "客户端错误导致请求未完成.",
            invalid_form: '表单输入无效. 请检查错误提示',
            loading: '正在加载页面, 请稍候',
            no: '否',
            not_found:
                '您输入了错误的URL或者错误的链接.',
            yes: '是',
            unsaved_changes:
                "修改未保存. 放弃修改吗?",
        },
        navigation: {
            no_results: '结果为空',
            no_more_results:
                '页码 %{page} 超出边界. 试试上一页.',
            page_out_of_boundaries: '页码 %{page} 超出边界',
            page_out_from_end: '已到最末页',
            page_out_from_begin: '已到最前页',
            page_range_info: '%{offsetBegin}-%{offsetEnd} / %{total}',


            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
            current_page: 'Page %{page}',
            page: 'Go to page %{page}',
            first: 'Go to first page',
            last: 'Go to last page',
            next: '向后',
            previous: '向前',

            page_rows_per_page: '每页行数:',
            skip_nav: '跳到内容',
        },
        sort: {
            sort_by: '按 %{field} %{order}',
            ASC: '升序',
            DESC: '降序',
        },
        auth: {
            auth_check_error: '请登录以继续',
            user_menu: '设置',
            username: '用户名',
            password: '密码',
            sign_in: '登录',
            sign_in_error: '验证失败, 请重试',
            logout: '退出',
        },
        notification: {
            updated: '条目已更新 |||| %{smart_count} 项条目已更新',
            created: '条目已新建',
            deleted: '条目已删除 |||| %{smart_count} 项条目已删除',
            bad_item: '不正确的条目',
            item_doesnt_exist: '条目不存在',
            http_error: '与服务通信出错',
            data_provider_error:'dataProvider错误. 请检查console的详细信息.',
            i18n_error: '无法加载指定语言包',
            canceled: '取消动作',
            logged_out: '会话失效, 请重连.',
            not_authorized: "You're not authorized to access this resource.",
            application_update_available: "应用可更新",
        },
        validation: {
            required: '必填',
            minLength: '必须不少于 %{min} 个字符',
            maxLength: '必须不多于 %{max} 个字符',
            minValue: '必须不小于 %{min}',
            maxValue: '必须不大于 %{max}',
            number: '必须为数字',
            email: '必须是有效的邮箱',
            oneOf: '必须为: %{options}其中一项',
            regex: '必须符合指定的格式 (regexp): %{pattern}',
        },
        saved_queries: {
            label: '保存查询',
            query_name: '查询名称',
            new_label: '保存当前查询...',
            new_dialog_title: '保存当前查询为',
            remove_label: '移除当前查询',
            remove_label_with_name: '删除查询 "%{name}"',
            remove_dialog_title: '是否保存查询?',
            remove_message:
                '你确定要删除你保存在列表中的查询吗?',
            help: '过滤列表并且保存待稍后使用',
        },
    },
};

export default chineseMessages;
