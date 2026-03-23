export * from './types';
export * from './utils';
export * from './builders';
export * from './core/build';
export * from './cli';
declare const _default: {
    color: {
        primary: string;
        secondary: string;
        neutral: string;
        azulHorizonte: string;
        azulHorizonteAlt: string;
        azulHorizonteDark: string;
        azulHorizonteLight: string;
        verdeVitalidad: string;
        verdeVitalidadHover: string;
        rojoAlerta: string;
        naranjaAdvertencia: string;
        verdeExito: string;
        azulInfo: string;
        grisTexto: string;
        verdeExitoClaro: string;
        verdeExitoOscuro: string;
        rojoErrorClaro: string;
        rojoErrorOscuro: string;
        amarilloAdvertenciaClaro: string;
        amarilloAdvertenciaOscuro: string;
        azulHorizonteClaro: string;
        azulHorizonteOscuro: string;
        verdeVitalidadClaro: string;
        verdeVitalidadOscuro: string;
        white: string;
        black: string;
    };
    space: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    typography: {
        fontFamily: {
            montserrat: string;
            jetbrains: string;
        };
        fontSize: {
            body: number;
            heading: number;
            caption: number;
        };
        fontWeight: {
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
        lineHeight: {
            tight: number;
            normal: number;
            relaxed: number;
        };
    };
    radius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    opacity: {
        transparent: number;
        semi: number;
        opaque: number;
    };
    zIndex: {
        base: number;
        overlay: number;
        modal: number;
    };
    borderWidth: {
        none: number;
        thin: number;
        thick: number;
    };
    size: {
        icon: number;
        avatar: number;
        thumbnail: number;
    };
    motion: {
        fast: string;
        normal: string;
        slow: string;
    };
    screens: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
};
export default _default;
export { build } from './core/build';
export { buildCSS, buildTailwind, buildMantine, buildTamagui, buildTypeScript } from './builders';
export { Logger } from './utils/logger';
export { convertW3CToTokenCollection, resolveTree, cleanRawTokens } from './utils/token-resolution';
//# sourceMappingURL=index.d.ts.map