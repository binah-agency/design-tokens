import type { LoggerContext } from '../types';
export declare const Logger: {
    info: (msg: string, context?: LoggerContext) => void;
    success: (msg: string, context?: LoggerContext) => void;
    warn: (msg: string, context?: LoggerContext) => void;
    error: (msg: string, context?: LoggerContext) => void;
    step: (msg: string) => void;
};
//# sourceMappingURL=logger.d.ts.map