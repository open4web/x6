/// <reference types="lodash" />
export interface ValidationErrorMessageWithArgs {
    message: string;
    args: {
        [key: string]: ValidationErrorMessageWithArgs | any;
    };
}
export declare type ValidationErrorMessage = string | ValidationErrorMessageWithArgs;
export declare type Validator = (value: any, values: any, props: any) => ValidationErrorMessage | null | undefined | Promise<ValidationErrorMessage | null | undefined>;
export declare const combine2Validators: (validator1: Validator, validator2: Validator) => Validator;
export declare const composeValidators: (...validators: any[]) => Validator;
export declare const composeSyncValidators: (...validators: any[]) => (value: any, values: any, meta: any) => ValidationErrorMessage | Promise<ValidationErrorMessage>;
/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
export declare const required: (message?: any) => ((value: any, values: any) => string | {
    message: string;
    args: any;
}) & {
    isRequired: boolean;
};
/**
 * Minimum length validator
 *
 * Returns an error if the value has a length less than the parameter
 *
 * @param {integer} min
 * @param {string|Function} message
 *
 * @example
 *
 * const passwordValidators = [minLength(10, 'Should be at least 10 characters')];
 * <TextInput type="password" name="password" validate={passwordValidators} />
 */
export declare const minLength: (min: any, message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Maximum length validator
 *
 * Returns an error if the value has a length higher than the parameter
 *
 * @param {integer} max
 * @param {string|Function} message
 *
 * @example
 *
 * const nameValidators = [maxLength(10, 'Should be at most 10 characters')];
 * <TextInput name="name" validate={nameValidators} />
 */
export declare const maxLength: (max: any, message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Minimum validator
 *
 * Returns an error if the value is less than the parameter
 *
 * @param {integer} min
 * @param {string|Function} message
 *
 * @example
 *
 * const fooValidators = [minValue(5, 'Should be more than 5')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export declare const minValue: (min: any, message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Maximum validator
 *
 * Returns an error if the value is higher than the parameter
 *
 * @param {integer} max
 * @param {string|Function} message
 *
 * @example
 *
 * const fooValidators = [maxValue(10, 'Should be less than 10')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export declare const maxValue: (max: any, message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Number validator
 *
 * Returns an error if the value is not a number
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const ageValidators = [number('Must be a number')];
 * <TextInput name="age" validate={ageValidators} />
 */
export declare const number: (message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Regular expression validator
 *
 * Returns an error if the value does not match the pattern given as parameter
 *
 * @param {RegExp} pattern
 * @param {string|Function} message
 *
 * @example
 *
 * const zipValidators = [regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Must be a zip code')];
 * <TextInput name="zip" validate={zipValidators} />
 */
export declare const regex: ((pattern: any, message?: any) => (value: any, values?: any) => string | {
    message: string;
    args: any;
}) & import("lodash").MemoizedFunction;
/**
 * Email validator
 *
 * Returns an error if the value is not a valid email
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const emailValidators = [email('Must be an email')];
 * <TextInput name="email" validate={emailValidators} />
 */
export declare const email: (message?: any) => (value: any, values?: any) => string | {
    message: string;
    args: any;
};
/**
 * Choices validator
 *
 * Returns an error if the value is not among the list passed as parameter
 *
 * @param {array} list
 * @param {string|Function} message
 *
 * @example
 *
 * const genderValidators = [choices(['male', 'female'], 'Must be either Male or Female')];
 * <TextInput name="gender" validate={genderValidators} />
 */
export declare const choices: (list: any, message?: any) => (value: any, values: any) => string | {
    message: string;
    args: any;
};
/**
 * Given a validator, returns a boolean indicating whether the field is required or not.
 */
export declare const isRequired: (validate: any) => boolean;
//# sourceMappingURL=validate.d.ts.map