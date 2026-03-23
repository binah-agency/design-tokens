import Ajv from 'ajv';
export const validateSchema = (tokens) => {
    const ajv = new Ajv();
    const schemaValidation = {
        type: "object",
        properties: {
            global: {
                type: "object",
                properties: {
                    color: { type: "object" },
                    space: { type: "object" },
                    typography: { type: "object" },
                    radius: { type: "object" },
                    opacity: { type: "object" },
                    zIndex: { type: "object" },
                    borderWidth: { type: "object" },
                    size: { type: "object" },
                    motion: { type: "object" },
                    screens: { type: "object" }
                },
                required: ["color", "space", "typography"]
            },
            light: { type: "object" },
            dark: { type: "object" },
            $themes: { type: "array" }
        },
        required: ["global"],
        additionalProperties: true
    };
    return ajv.compile(schemaValidation);
};
export const validateTokenStructure = (tokens) => {
    const errors = [];
    const warnings = [];
    const requiredFigmaColors = [
        'azulHorizonte', 'azulHorizonteAlt', 'azulHorizonteDark', 'azulHorizonteLight',
        'verdeVitalidad', 'verdeVitalidadHover'
    ];
    if (tokens.global?.color) {
        requiredFigmaColors.forEach(color => {
            if (!tokens.global.color[color])
                errors.push(`Missing required Figma color: ${color}`);
        });
    }
    if (tokens.global?.space) {
        const spaceValues = Object.values(tokens.global.space).map((token) => token.value);
        if (!spaceValues.includes(4) || !spaceValues.includes(8) || !spaceValues.includes(16)) {
            warnings.push('Space tokens should include 4px, 8px, and 16px for Figma consistency');
        }
    }
    if (!tokens.global?.typography?.fontFamily?.montserrat) {
        warnings.push('Montserrat font family not found - recommended for Figma compliance');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
};
//# sourceMappingURL=validation.js.map