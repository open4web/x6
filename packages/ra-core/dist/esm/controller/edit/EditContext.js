import { createContext } from 'react';
/**
 * Context to store the result of the useEditController() hook.
 *
 * Use the useEditContext() hook to read the context. That's what the Edit components do in react-admin.
 *
 * @example
 *
 * import { useEditController, EditContextProvider } from 'ra-core';
 *
 * const Edit = props => {
 *     const controllerProps = useEditController(props);
 *     return (
 *         <EditContextProvider value={controllerProps}>
 *             ...
 *         </EditContextProvider>
 *     );
 * };
 */
export var EditContext = createContext({
    record: null,
    defaultTitle: null,
    isFetching: null,
    isLoading: null,
    mutationMode: null,
    redirect: null,
    refetch: null,
    resource: null,
    save: null,
    saving: null,
    registerMutationMiddleware: null,
    unregisterMutationMiddleware: null,
});
EditContext.displayName = 'EditContext';
//# sourceMappingURL=EditContext.js.map