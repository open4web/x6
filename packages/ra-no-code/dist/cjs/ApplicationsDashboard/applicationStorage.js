"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeApplicationsInStorage = exports.loadApplicationsFromStorage = void 0;
var loadApplicationsFromStorage = function () {
    var storedValue = window.localStorage.getItem('@@ra-no-code/applications');
    if (storedValue) {
        return JSON.parse(storedValue);
    }
    return [];
};
exports.loadApplicationsFromStorage = loadApplicationsFromStorage;
var storeApplicationsInStorage = function (applications) {
    window.localStorage.setItem('@@ra-no-code/applications', JSON.stringify(applications));
};
exports.storeApplicationsInStorage = storeApplicationsInStorage;
//# sourceMappingURL=applicationStorage.js.map