const ALIAS_REGEX = /\{([^}]+)\}/g;
const MATH_REGEX = /^[\d\s\.\+\-\*\/()]+$/;
export const resolveTree = (tokens, rootScope) => {
    const resolveValue = (value, currentScope) => {
        if (typeof value === 'object' && value !== null) {
            // Recursively resolve nested objects
            const resolved = {};
            for (const [key, val] of Object.entries(value)) {
                resolved[key] = resolveValue(val, currentScope);
            }
            return resolved;
        }
        else if (value && typeof value.value !== 'undefined') {
            // Handle W3C token format
            return value.value;
        }
        else {
            return value;
        }
    };
    return resolveValue(tokens, rootScope);
};
export const convertW3CToTokenCollection = (schema) => {
    const collection = {};
    // Convert colors
    if (schema.global?.color) {
        collection.colors = {};
        for (const [key, token] of Object.entries(schema.global.color)) {
            collection.colors[key] = typeof token === 'object' && token.value !== undefined ? token.value : token;
        }
    }
    // Convert spacing
    if (schema.global?.space) {
        collection.spacing = {};
        for (const [key, token] of Object.entries(schema.global.space)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.spacing[key] = typeof value === 'number' ? value : parseFloat(value.toString());
        }
    }
    // Convert typography
    if (schema.global?.typography) {
        collection.typography = {};
        if (schema.global.typography.fontFamily) {
            collection.typography.fontFamily = {};
            for (const [key, token] of Object.entries(schema.global.typography.fontFamily)) {
                collection.typography.fontFamily[key] = typeof token === 'object' && token.value !== undefined ? token.value : token;
            }
        }
        if (schema.global.typography.fontSize) {
            collection.typography.fontSize = {};
            for (const [key, token] of Object.entries(schema.global.typography.fontSize)) {
                const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
                collection.typography.fontSize[key] = typeof value === 'number' ? value : parseFloat(value.toString());
            }
        }
        if (schema.global.typography.fontWeight) {
            collection.typography.fontWeight = {};
            for (const [key, token] of Object.entries(schema.global.typography.fontWeight)) {
                const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
                collection.typography.fontWeight[key] = typeof value === 'number' ? value : parseFloat(value.toString());
            }
        }
        if (schema.global.typography.lineHeight) {
            collection.typography.lineHeight = {};
            for (const [key, token] of Object.entries(schema.global.typography.lineHeight)) {
                const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
                collection.typography.lineHeight[key] = typeof value === 'number' ? value : parseFloat(value.toString());
            }
        }
    }
    // Convert other optional properties
    if (schema.global?.radius) {
        collection.radius = {};
        for (const [key, token] of Object.entries(schema.global.radius)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.radius[key] = typeof value === 'number' ? value : parseFloat(value.toString());
        }
    }
    if (schema.global?.opacity) {
        collection.opacity = {};
        for (const [key, token] of Object.entries(schema.global.opacity)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.opacity[key] = typeof value === 'number' ? value : parseFloat(value.toString());
        }
    }
    if (schema.global?.zIndex) {
        collection.zIndex = {};
        for (const [key, token] of Object.entries(schema.global.zIndex)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.zIndex[key] = typeof value === 'number' ? value : parseFloat(value.toString());
        }
    }
    if (schema.global?.borderWidth) {
        collection.borderWidth = {};
        for (const [key, token] of Object.entries(schema.global.borderWidth)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.borderWidth[key] = typeof value === 'number' ? value : value.toString();
        }
    }
    if (schema.global?.size) {
        collection.size = {};
        for (const [key, token] of Object.entries(schema.global.size)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.size[key] = typeof value === 'number' ? value : value.toString();
        }
    }
    if (schema.global?.motion) {
        collection.motion = {};
        for (const [key, token] of Object.entries(schema.global.motion)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.motion[key] = typeof value === 'number' ? value : value.toString();
        }
    }
    if (schema.global?.screens) {
        collection.screens = {};
        for (const [key, token] of Object.entries(schema.global.screens)) {
            const value = typeof token === 'object' && token.value !== undefined ? token.value : token;
            collection.screens[key] = value.toString();
        }
    }
    return collection;
};
export const cleanRawTokens = (tokens) => {
    const cleaned = { ...tokens };
    const resolveValue = (value, currentScope) => {
        if (typeof value === 'object' && value !== null) {
            // Recursively resolve nested objects
            const resolved = {};
            for (const [key, val] of Object.entries(value)) {
                resolved[key] = resolveValue(val, currentScope);
            }
            return resolved;
        }
        else if (value && typeof value.value !== 'undefined') {
            // Handle W3C token format
            return value.value;
        }
        else {
            return value;
        }
    };
    // Clean global tokens
    if (cleaned.global) {
        cleaned.global.color = cleaned.global.color || {};
        cleaned.global.space = cleaned.global.space || {};
        cleaned.global.typography = cleaned.global.typography || {};
        // Resolve aliases and math expressions in global tokens
        if (cleaned.global.color) {
            for (const [key, token] of Object.entries(cleaned.global.color)) {
                if (token && typeof token.value !== 'undefined') {
                    cleaned.global.color[key] = resolveValue(token, cleaned.global);
                }
            }
        }
        if (cleaned.global.space) {
            for (const [key, token] of Object.entries(cleaned.global.space)) {
                if (token && typeof token.value !== 'undefined') {
                    cleaned.global.space[key] = resolveValue(token, cleaned.global);
                }
            }
        }
        if (cleaned.global.typography) {
            for (const [key, token] of Object.entries(cleaned.global.typography)) {
                if (token && typeof token.value !== 'undefined') {
                    cleaned.global.typography[key] = resolveValue(token, cleaned.global);
                }
            }
        }
    }
    // Clean theme tokens
    if (cleaned.light?.theme) {
        cleaned.light.theme = resolveTree(cleaned.light.theme, { ...cleaned.global, ...cleaned.light.theme });
    }
    if (cleaned.dark?.theme) {
        cleaned.dark.theme = resolveTree(cleaned.dark.theme, { ...cleaned.global, ...cleaned.dark.theme });
    }
    return cleaned;
};
//# sourceMappingURL=token-resolution.js.map