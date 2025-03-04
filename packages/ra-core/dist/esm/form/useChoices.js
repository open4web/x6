import * as React from 'react';
import { isValidElement, useCallback } from 'react';
import get from 'lodash/get';
import { useTranslate } from '../i18n';
import { RecordContextProvider } from '../controller';
/*
 * Returns helper functions for choices handling.
 *
 * @param optionText Either a string defining the property to use to get the choice text, a function or a React element
 * @param optionValue The property to use to get the choice value
 * @param translateChoice A boolean indicating whether to option text should be translated
 *
 * @returns An object with helper functions:
 * - getChoiceText: Returns the choice text or a React element
 * - getChoiceValue: Returns the choice value
 */
export var useChoices = function (_a) {
    var _b = _a.optionText, optionText = _b === void 0 ? 'name' : _b, _c = _a.optionValue, optionValue = _c === void 0 ? 'id' : _c, _d = _a.disableValue, disableValue = _d === void 0 ? 'disabled' : _d, _e = _a.translateChoice, translateChoice = _e === void 0 ? true : _e;
    var translate = useTranslate();
    var getChoiceText = useCallback(function (choice) {
        if (isValidElement(optionText)) {
            return (React.createElement(RecordContextProvider, { value: choice }, optionText));
        }
        var choiceName = typeof optionText === 'function'
            ? optionText(choice)
            : get(choice, optionText);
        return isValidElement(choiceName)
            ? choiceName
            : translateChoice
                ? translate(String(choiceName), { _: choiceName })
                : String(choiceName);
    }, [optionText, translate, translateChoice]);
    var getChoiceValue = useCallback(function (choice) { return get(choice, optionValue); }, [
        optionValue,
    ]);
    var getDisableValue = useCallback(function (choice) { return get(choice, disableValue); }, [
        disableValue,
    ]);
    return {
        getChoiceText: getChoiceText,
        getChoiceValue: getChoiceValue,
        getDisableValue: getDisableValue,
    };
};
//# sourceMappingURL=useChoices.js.map