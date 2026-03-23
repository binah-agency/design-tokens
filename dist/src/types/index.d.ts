export interface W3CToken<T = string | number> {
    value: T;
    type: string;
    description?: string;
}
export interface TokenSchema {
    global: {
        color: Record<string, W3CToken<string>>;
        space: Record<string, W3CToken<string | number>>;
        typography: {
            fontFamily: Record<string, W3CToken<string>>;
            fontSize: Record<string, W3CToken<number>>;
            fontWeight?: Record<string, W3CToken<number>>;
            lineHeight?: Record<string, W3CToken<number>>;
        };
        radius?: Record<string, W3CToken<string | number>>;
        opacity?: Record<string, W3CToken<number>>;
        zIndex?: Record<string, W3CToken<number>>;
        borderWidth?: Record<string, W3CToken<string | number>>;
        size?: Record<string, W3CToken<string | number>>;
        motion?: Record<string, W3CToken<string | number>>;
        screens?: Record<string, W3CToken<string>>;
    };
    light?: {
        theme: any;
    };
    dark?: {
        theme: any;
    };
    $themes?: string[];
}
export interface LoggerContext {
    file?: string;
    line?: number;
    function?: string;
}
export interface BuildOptions {
    build?: boolean;
    watch?: boolean;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export interface TokenCollection {
    colors?: Record<string, string>;
    spacing?: Record<string, number>;
    typography?: {
        fontFamily?: Record<string, string>;
        fontSize?: Record<string, number>;
        fontWeight?: Record<string, number>;
        lineHeight?: Record<string, number>;
    };
    radius?: Record<string, number>;
    opacity?: Record<string, number>;
    zIndex?: Record<string, number>;
    borderWidth?: Record<string, string | number>;
    size?: Record<string, string | number>;
    motion?: Record<string, string | number>;
    screens?: Record<string, string>;
}
export interface BuildResult {
    success: boolean;
    files: Array<{
        path: string;
        content: string;
    }>;
    errors: string[];
    warnings: string[];
}
//# sourceMappingURL=index.d.ts.map