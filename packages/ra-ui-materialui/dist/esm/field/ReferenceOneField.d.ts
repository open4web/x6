import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { LinkToType } from 'ra-core';
import { PublicFieldProps, InjectedFieldProps } from './types';
/**
 * Render the related record in a one-to-one relationship
 *
 * Expects a single field as child
 *
 * @example // display the bio of the current author
 * <ReferenceOneField reference="bios" target="author_id">
 *     <TextField source="body" />
 * </ReferenceOneField>
 */
export declare const ReferenceOneField: {
    (props: ReferenceOneFieldProps): JSX.Element;
    propTypes: {
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        className: PropTypes.Requireable<string>;
        label: PropTypes.Requireable<NonNullable<string | boolean | PropTypes.ReactElementLike>>;
        record: PropTypes.Requireable<any>;
        reference: PropTypes.Validator<string>;
        source: PropTypes.Validator<string>;
        target: PropTypes.Validator<string>;
    };
    defaultProps: {
        source: string;
    };
};
export interface ReferenceOneFieldProps extends PublicFieldProps, InjectedFieldProps {
    children?: ReactNode;
    reference: string;
    target: string;
    link?: LinkToType;
}
//# sourceMappingURL=ReferenceOneField.d.ts.map