export var loadApplicationsFromStorage = function () {
    var storedValue = window.localStorage.getItem('@@ra-no-code/applications');
    if (storedValue) {
        return JSON.parse(storedValue);
    }
    return [];
};
export var storeApplicationsInStorage = function (applications) {
    window.localStorage.setItem('@@ra-no-code/applications', JSON.stringify(applications));
};
//# sourceMappingURL=applicationStorage.js.map