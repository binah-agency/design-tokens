export const toKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
export const toPascalCase = (str) => str.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/[\s_-]/g, '');
export const convertUnit = (val, toRem = true) => {
    const num = parseFloat(val.toString());
    if (isNaN(num))
        return val;
    return toRem ? `${num / 16}rem` : `${num}px`;
};
export const hexToRgbChannels = (hex) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#'))
        return 'rgb(0, 0, 0)';
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
};
export const createStrictScale = (obj) => {
    const scale = {};
    for (const [key, value] of Object.entries(obj || {})) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            scale[key] = num;
        }
    }
    return scale;
};
export const flattenObject = (obj, prefix = '') => {
    const flattened = {};
    const traverse = (current, path = []) => {
        if (typeof current !== 'object' || current === null)
            return current;
        const result = { ...current };
        for (const [key, value] of Object.entries(current)) {
            const newPath = [...path, key];
            if (typeof value === 'object' && value !== null) {
                result[key] = traverse(value, newPath);
            }
            else if (value && typeof value.value !== 'undefined') {
                // Handle W3C token format
                result[key] = value.value;
            }
            else {
                result[key] = value;
            }
        }
        return result;
    };
    return traverse(obj, prefix ? prefix.split('.') : []);
};
//# sourceMappingURL=helpers.js.map