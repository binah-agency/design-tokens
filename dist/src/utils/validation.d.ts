import type { TokenSchema, ValidationResult } from '../types';
export declare const validateSchema: (tokens: any) => import("ajv").ValidateFunction<{
    [x: string]: {};
}>;
export declare const validateTokenStructure: (tokens: TokenSchema) => ValidationResult;
//# sourceMappingURL=validation.d.ts.map