import * as React from 'react';
import { useEffect } from 'react';
import { useStoreContext } from './useStoreContext';
/**
 * A component to set store state for a key on mount declaratively
 *
 * To use it, just wrap any component that need to use the corresponding
 * store item with <StoreSetter name="my.key" value="myvalue">.
 * This wrapping needs to be done to ensure that the corresponding store item
 * is set before rendering the wrapped component.
 *
 * Tip: <StoreSetter> is a great helper for mocking the store in
 * unit tests. Prefer it to calling the Store manually.
 *
 * @example
 *
 *     <StoreSetter name="list.density" value="small">
 *         <MyStoreDependentComponent />
 *     </StoreSetter>
 *
 * @example // Using <StoreSetter> is equivalent to using `useStoreContext` and setting its value directly.
 *
 * const [, setDensity] = useStore('list.density');
 *
 * useEffect(() => {
 *     setDensity('small');
 * }, []);
 *
 * @param {Props}    props
 * @param {string}   props.name Store item key. Required. Separate with dots to namespace, e.g. 'posts.list.columns'
 * @param {any}      props.value Store item value. Required.
 * @param {children} props.children Children are rendered as is, on mount
 */
export var StoreSetter = function (_a) {
    var value = _a.value, name = _a.name, children = _a.children;
    var setItem = useStoreContext().setItem;
    useEffect(function () {
        setItem(name, value);
    }, [name, setItem, value]);
    return React.createElement(React.Fragment, null, children);
};
//# sourceMappingURL=StoreSetter.js.map