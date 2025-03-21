import { useParams } from 'react-router-dom';
import { useRecordContext } from '../controller';
/**
 * Helper hook to get the current `recordId`.
 *
 * `recordId` is obtained from parameters if passed as a parameter, or from the `RecordContext` if there is one, or, lastly, from the react-router URL.
 *
 * @param {any} recordId optional if used inside a RecordContextProvider or if recordId can be guessed from the URL
 *
 * @returns The `recordId` determined in this manner.
 *
 * @example
 * const recordId = useGetRecordId();
 */
export function useGetRecordId(recordId) {
    var _a;
    var contextRecord = useRecordContext();
    var routeId = useParams().id;
    var actualRecordId = (_a = recordId !== null && recordId !== void 0 ? recordId : contextRecord === null || contextRecord === void 0 ? void 0 : contextRecord.id) !== null && _a !== void 0 ? _a : routeId;
    if (actualRecordId == null)
        throw new Error("useGetRecordId could not find the current record id. You need to use it inside a RecordContextProvider, or inside a supported route, or provide the record id to the hook yourself.");
    return actualRecordId;
}
//# sourceMappingURL=useGetRecordId.js.map