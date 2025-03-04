import { AuthProvider, LegacyAuthProvider } from '../types';
/**
 * Turn a function-based authProvider to an object-based one
 *
 * Allows using legacy authProviders transparently.
 *
 * @param {Function} legacyAuthProvider A legacy authProvider (type, params) => Promise<any>
 *
 * @returns {Object} An authProvider that react-admin can use
 */
declare const _default: (legacyAuthProvider: LegacyAuthProvider) => AuthProvider;
export default _default;
//# sourceMappingURL=convertLegacyAuthProvider.d.ts.map