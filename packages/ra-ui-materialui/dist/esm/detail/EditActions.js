var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import PropTypes from 'prop-types';
import { useEditContext, useResourceDefinition } from 'ra-core';
import { ShowButton } from '../button';
import TopToolbar from '../layout/TopToolbar';
/**
 * Action Toolbar for the Edit view
 *
 * Internal component. If you want to add or remove actions for an Edit view,
 * write your own EditActions Component. Then, in the <Edit> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, ShowButton, Edit } from 'react-admin';
 *
 *     const PostEditActions = ({ record, resource }) => (
 *         <TopToolbar>
 *             <ShowButton record={record} />
 *             // Add your custom actions here
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostEdit = (props) => (
 *         <Edit actions={<PostEditActions />} {...props}>
 *             ...
 *         </Edit>
 *     );
 */
export var EditActions = function (_a) {
    var className = _a.className, rest = __rest(_a, ["className"]);
    var record = useEditContext(rest).record;
    var hasShow = useResourceDefinition(rest).hasShow;
    return (React.createElement(TopToolbar, __assign({ className: className }, sanitizeRestProps(rest)), hasShow && React.createElement(ShowButton, { record: record })));
};
var sanitizeRestProps = function (_a) {
    var _b = _a.hasCreate, hasCreate = _b === void 0 ? null : _b, _c = _a.hasEdit, hasEdit = _c === void 0 ? null : _c, _d = _a.hasShow, hasShow = _d === void 0 ? null : _d, _e = _a.hasList, hasList = _e === void 0 ? null : _e, rest = __rest(_a, ["hasCreate", "hasEdit", "hasShow", "hasList"]);
    return rest;
};
EditActions.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    resource: PropTypes.string,
};
//# sourceMappingURL=EditActions.js.map