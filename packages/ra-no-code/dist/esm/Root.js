import * as React from 'react';
import { useMemo, useState } from 'react';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';
import { ApplicationsDashboard } from './ApplicationsDashboard';
export var Root = function (_a) {
    var theme = _a.theme;
    var _b = useState(), application = _b[0], setApplication = _b[1];
    var handleExitApplication = function () {
        setApplication(undefined);
    };
    var handleApplicationSelected = function (selectedApplication) {
        setApplication(selectedApplication);
    };
    var context = useMemo(function () { return ({
        application: application,
        onExit: handleExitApplication,
    }); }, [application]);
    if (context.application) {
        return (React.createElement(ApplicationContext.Provider, { value: context },
            React.createElement(Admin, { theme: theme })));
    }
    return (React.createElement(ApplicationsDashboard, { onApplicationSelected: handleApplicationSelected, theme: theme }));
};
//# sourceMappingURL=Root.js.map