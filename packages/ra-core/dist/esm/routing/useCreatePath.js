import { useCallback } from 'react';
import { useBasename } from './useBasename';
/**
 * Get a callback to create a link to a given page in the admin app.
 *
 * The callback expects an object as parameter, containing the following properties:
 *   - type: 'list', 'edit', 'show' or 'create'
 *   - resource
 *   - id (optional), for 'edit' or 'show' pages
 *
 * This is used internally by react-admin to allow default components to work
 * in applications that are mounted on a sub path, e.g. '/admin'. If your app
 * is mounted in the root path, you don't need it, and you can create links by
 * hand, e.g. '/articles/1/show'.
 *
 * @example
 * import { useCreatePath, useRecordContext } from 'react-admin';
 * import { useNavigate } from 'react-router-dom';
 *
 * const PostEditButton = () => {
 *     const createPath = useCreatePath();
 *     const record = useRecordContext();
 *     const navigate = useNavigate();
 *
 *     const handleClick = () => {
 *         const link = createPath({
 *            type: 'edit',
 *            resource: 'posts',
 *            id: record.id
 *         });
 *         navigate(link);
 *     };
 *
 *    return <button onClick={handleClick}>Edit Post</button>;
 * };
 */
export var useCreatePath = function () {
    var basename = useBasename();
    return useCallback(function (_a) {
        var resource = _a.resource, id = _a.id, type = _a.type;
        switch (type) {
            case 'list':
                return removeDoubleSlashes("".concat(basename, "/").concat(resource));
            case 'create':
                return removeDoubleSlashes("".concat(basename, "/").concat(resource, "/create"));
            case 'edit': {
                if (id == null) {
                    // maybe the id isn't defined yet
                    // instead of throwing an error, fallback to list link
                    return removeDoubleSlashes("".concat(basename, "/").concat(resource));
                }
                return removeDoubleSlashes("".concat(basename, "/").concat(resource, "/").concat(encodeURIComponent(id)));
            }
            case 'show': {
                if (id == null) {
                    // maybe the id isn't defined yet
                    // instead of throwing an error, fallback to list link
                    return removeDoubleSlashes("".concat(basename, "/").concat(resource));
                }
                return removeDoubleSlashes("".concat(basename, "/").concat(resource, "/").concat(encodeURIComponent(id), "/show"));
            }
            default:
                return type;
        }
    }, [basename]);
};
export var removeDoubleSlashes = function (path) { return path.replace('//', '/'); };
//# sourceMappingURL=useCreatePath.js.map