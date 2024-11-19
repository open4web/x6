/**
 * This hooks returns a tuple with its first element being a boolean indicating whether an import is ongoing, and the second element a function to call with a resource name and a file to import.
 *
 * @param onImportCompleted A function called once the import is completed. Receive an object containing the resource imported and the resourceAlreadyExists boolean.
 * @returns {[boolean, ImportResource]}
 */
export declare const useImportResourceFromCsv: () => [boolean, ImportResource];
declare type ImportResource = (resource: string, file: File) => Promise<{
    resourceAlreadyExists: boolean;
    resource: string;
}>;
export {};
//# sourceMappingURL=useImportResourceFromCsv.d.ts.map