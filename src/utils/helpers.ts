export const toKebabCase = (str: string): string => 
  str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

export const toPascalCase = (str: string): string => 
  str.replace(/(\w)(\w*)/g, (g0: string, g1: string, g2: string) => g1.toUpperCase() + g2.toLowerCase()).replace(/[\s_-]/g, '');

export const convertUnit = (val: string | number, toRem = true): string | number => {
  const num = parseFloat(val.toString());
  if (isNaN(num)) return val;
  return toRem ? `${num / 16}rem` : `${num}px`;
};

export const hexToRgbChannels = (hex: string): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return 'rgb(0, 0, 0)';
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export const createStrictScale = (obj: any): any => {
  const scale: any = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const num = parseFloat(value as string);
    if (!isNaN(num)) {
      scale[key] = num;
    }
  }
  return scale;
};

export const flattenObject = (obj: any, prefix = ''): any => {
  const flattened: any = {};
  
  const traverse = (current: any, path: string[] = []): any => {
    if (typeof current !== 'object' || current === null) return current;
    
    const result = { ...current };
    
    for (const [key, value] of Object.entries(current)) {
      const newPath = [...path, key];
      
      if (typeof value === 'object' && value !== null) {
        result[key] = traverse(value, newPath);
      } else if (value && typeof (value as any).value !== 'undefined') {
        // Handle W3C token format
        result[key] = (value as any).value;
      } else {
        result[key] = value;
      }
    }
    
    return result;
  };
  
  return traverse(obj, prefix ? prefix.split('.') : []);
};
