# 🎨 Design Tokens Crediscore

> **Sistema de Diseño Unificado** - Tokens de diseño para el ecosistema Crediscore
> 
> **Figma Compliance v1.0** - Tokens mapeados exactamente desde Figma Design System
> 
> **Atomic Design Ready** - Diseñado para componentes atómicos y composición

---

## 📋 Índice

- [🚀 Quick Start](#-quick-start)
- [🏗️ Estructura del Proyecto](#-estructura-del-proyecto)
- [🎨 Tokens Disponibles](#-tokens-disponibles)
- [🎯 Uso en Componentes](#-uso-en-componentes)
- [🔧 Desarrollo](#-desarrollo)
- [📚 Referencia de Tokens](#-referencia-de-tokens)
- [🔄 Build Pipeline](#-build-pipeline)
- [🚀 Despliegue](#-despliegue)

---

## 🚀 Quick Start

### **Instalación Rápida**
```bash
# Clonar el repositorio
git clone https://github.com/binah-agency/design-tokens.git

# Instalar dependencias
npm install

# Build tokens
npm run build
```

### **Uso Inmediato**
```typescript
// Importar tokens en tu componente Tamagui
import { colors, spacing, radius } from '@crediscore/tokens';

// Usar en componentes React Native
const MyComponent = styled(View, {
  backgroundColor: colors.azulHorizonte,
  padding: spacing.md,
  borderRadius: radius.md,
});
```

---

## 🏗️ Estructura del Proyecto

```
design-tokens/
├── 📄 theme.tokens.json          # Tokens principales del diseño
├── 🔧 token.compiler.mjs          # Compilador de tokens
├── 📦 package.json              # Configuración del paquete
├── 📚 tsconfig.json             # Configuración TypeScript
├── 📁 dist/                     # Tokens compilados
│   └── src/
│       ├── index.ts           # Punto de entrada principal
│       ├── types/            # Tipos de tokens
│       ├── utils/            # Utilidades de tokens
│       └── builders/        # Builders para diferentes plataformas
└── 📖 README.md                # Esta documentación
```

---

## 🎨 Tokens Disponibles

### **🌈 Colores (Colors)**
Tokens de color basados en el sistema de diseño Crediscore, 100% Figma compliant.

#### **Colores Principales**
```json
{
  "azulHorizonte": "#3467B0",     // Azul principal - branding
  "verdeVitalidad": "#86BD45",     // Verde éxito - acciones positivas
  "rojoAlerta": "#D32F2F",        // Rojo alerta - errores y peligros
  "naranjaAdvertencia": "#F57C00",  // Naranja - advertencias
  "azulInfo": "#1976D2",         // Azul información
  "grisTexto": "#707070",          // Gris para texto
  "white": "#FFFFFF",                // Blanco puro
  "black": "#000000"                // Negro puro
}
```

#### **Variaciones de Color**
```json
{
  "azulHorizonteLight": "#6BB6FF",   // Hover states
  "azulHorizonteDark": "#3468A0",    // Outline borders
  "verdeVitalidadHover": "#9BC85D",  // Success hover
  "rojoErrorClaro": "#F2555A",       // Error light variant
  "amarilloAdvertenciaClaro": "#FFEF5C" // Warning light
}
```

### **📏 Espaciado (Spacing)**
Sistema de espaciado consistente basado en escala de 4px.

```json
{
  "xs": 4,    // 4px - Espaciado extra pequeño
  "sm": 8,    // 8px - Espaciado pequeño
  "md": 16,   // 16px - Espaciado mediano (default)
  "lg": 24,   // 24px - Espaciado grande
  "xl": 32    // 32px - Espaciado extra grande
}
```

### **🔄 Bordes (Border Radius)**
Tokens para radio de bordes consistentes.

```json
{
  "0": 0,     // Sin bordes
  "1": 4,     // Bordes pequeños (inputs, checkboxes)
  "2": 8,     // Botones estándar, tarjetas pequeñas
  "3": 12,    // Tarjetas, modales
  "4": 16,    // Contenedores medianos
  "5": 24,    // Contenedores medianos
  "6": 32,    // Contenedores grandes
  "round": 9999 // Bordes completamente redondeados (pills, badges)
}
```

### **📝 Tipografía (Typography)**
Sistema tipográfico basado en Montserrat.

```json
{
  "fontFamily": {
    "montserrat": "Montserrat, sans-serif"  // Fuente principal
  },
  "fontSize": {
    "body1": 12,   // Texto pequeño
    "body2": 14,   // Texto normal
    "body3": 16,   // Texto grande (default)
    "body4": 19,   // Texto extra grande
    "heading1": 20,  // Títulos pequeños
    "heading2": 24,  // Títulos normales
    "heading3": 32,  // Títulos grandes
    "heading4": 48   // Títulos extra grandes
  },
  "fontWeight": {
    "regular": 400,    // Peso normal
    "bold": 700,      // Peso negrita
    "black": 900      // Peso extra negrita
  },
  "lineHeight": {
    "body1": 18,    // Línea altura para texto pequeño
    "body2": 21,    // Línea altura para texto normal
    "body3": 24,    // Línea altura para texto grande
    "body4": 29     // Línea altura para texto extra grande
  }
}
```

### **🎭 Sombras (Shadows)**
Sistema de sombras consistente para diferentes elevaciones.

```json
{
  "sm": {  // Sombras pequeñas para elementos sutiles
    "x": 0, "y": 1, "blur": 2, "spread": 0,
    "color": "rgba(45, 45, 44, 0.05)"
  },
  "md": {  // Sombras medianas para cards y botones
    "x": 0, "y": 4, "blur": 6, "spread": -1,
    "color": "rgba(45, 45, 44, 0.1)"
  },
  "lg": {  // Sombras grandes para modales y overlays
    "x": 0, "y": 10, "blur": 15, "spread": -3,
    "color": "rgba(45, 45, 44, 0.1)"
  }
}
```

---

## 🎯 Uso en Componentes

### **📱 Tamagui Integration**
Los tokens están diseñados para integrarse perfectamente con Tamagui.

#### **Configuración Automática**
```typescript
// tamagui.config.ts - Configuración automática
import { createTamagui } from 'tamagui';
import tokens from './theme.tokens.json';

export default createTamagui({
  tokens: tokens,
  themes: {
    light: { ...tokens, background: tokens.white },
    dark: { ...tokens, background: tokens.black }
  }
});
```

#### **Uso en Componentes Atómicos**
```typescript
// Button Component
import styled from 'tamagui';

const Button = styled(tamaguiButton, {
  backgroundColor: '$azulHorizonte',  // Token automático
  padding: '$md',                   // Token automático
  borderRadius: '$md',             // Token automático
  fontFamily: '$montserrat',          // Token automático
});
```

### **🔗 Referencias Cruzadas**
```typescript
// Importar tokens específicos
import { 
  colors,           // Todos los colores
  spacing,          // Todo el espaciado
  radius,           // Todos los bordes
  typography        // Toda la tipografía
} from '@crediscore/tokens';

// Acceso a tokens específicos
const primaryColor = colors.azulHorizonte;
const mediumSpacing = spacing.md;
const roundedCorners = radius.round;
```

---

## 🔧 Desarrollo

### **🌟 Comandos Disponibles**
```bash
# Build tokens (compila theme.tokens.json → dist/)
npm run build

# Modo desarrollo (watch cambios)
npm run dev

# Validar tokens
npm run validate

# Limpiar build
npm run clean

# Publicar paquete
npm run publish
```

### **🔄 Build Pipeline**
El pipeline de build procesa los tokens y genera múltiples formatos:

1. **Token Compiler**: `theme.tokens.json` → `dist/src/`
2. **TypeScript**: Genera tipos con autocompletado
3. **Platform Builders**: Para Tamagui, Tailwind, Mantine
4. **Validation**: Verifica integridad de tokens
5. **Optimization**: Minificación y optimización

### **🧪 Estructura de Build**
```
dist/
├── src/
│   ├── index.ts              # Export principal
│   ├── types/               # Tipos TypeScript
│   │   ├── colors.ts      # Tipos de colores
│   │   ├── spacing.ts     # Tipos de espaciado
│   │   └── radius.ts      # Tipos de bordes
│   ├── utils/               # Utilidades
│   │   ├── helpers.ts      # Funciones helper
│   │   └── validation.ts  # Validación
│   └── builders/           # Platform-specific
│       ├── tamagui-builder.ts   # Para Tamagui
│       ├── tailwind-builder.ts   # Para Tailwind
│       └── mantine-builder.ts   # Para Mantine
└── tsconfig.json              # Configuración TypeScript
```

---

## 📚 Referencia de Tokens

### **🎨 Paleta de Colores Completa**

| **Token** | **Valor** | **Uso** | **Descripción** |
|-----------|------------|----------|-------------|
| `$azulHorizonte` | `#3467B0` | Branding principal, botones primary |
| `$azulHorizonteLight` | `#6BB6FF` | Estados hover, elementos interactivos |
| `$azulHorizonteDark` | `#3468A0` | Bordes outline, elementos enfocados |
| `$verdeVitalidad` | `#86BD45` | Acciones exitosas, confirmaciones |
| `$verdeVitalidadHover` | `#9BC85D` | Hover en acciones exitosas |
| `$rojoAlerta` | `#D32F2F` | Errores, alertas, acciones destructivas |
| `$naranjaAdvertencia` | `#F57C00` | Advertencias, estados pendientes |
| `$azulInfo` | `#1976D2` | Información, tooltips |
| `$grisTexto` | `#707070` | Texto secundario, placeholders |
| `$white` | `#FFFFFF` | Fondos, texto sobre colores oscuros |
| `$black` | `#000000` | Texto sobre fondos claros |

### **📏 Escala de Espaciado**

| **Token** | **Valor** | **Uso Típico** |
|-----------|------------|-------------------|
| `$xs` | `4px` | Espaciado entre elementos muy pequeños |
| `$sm` | `8px` | Margen interno de componentes |
| `$md` | `16px` | Padding por defecto, separación entre secciones |
| `$lg` | `24px` | Margen externo de contenedores |
| `$xl` | `32px` | Separación entre secciones principales |

### **🔄 Radio de Bordes**

| **Token** | **Valor** | **Uso Típico** |
|-----------|------------|-------------------|
| `$0` | `0px` | Elementos sin bordes |
| `$1` | `4px` | Inputs, checkboxes, elementos pequeños |
| `$2` | `8px` | Botones estándar, tarjetas pequeñas |
| `$3` | `12px` | Tarjetas de crédito, modales |
| `$4` | `16px` | Contenedores medianos |
| `$5` | `24px` | Contenedores grandes |
| `$round` | `9999px` | Pills, badges, avatares |

---

## 🔄 Build Pipeline

### **⚙️ Configuración del Compiler**
```json
// token.compiler.mjs - Configuración principal
{
  "input": "./theme.tokens.json",
  "output": "./dist/src",
  "generators": [
    "typescript",
    "tamagui",
    "tailwind",
    "mantine"
  ],
  "validation": {
    "strict": true,
    "figmaCompliance": "v1.0"
  }
}
```

### **🔍 Validación Automática**
El sistema incluye validación automática para garantizar:

- ✅ **Consistencia**: No tokens duplicados
- ✅ **Referencias**: Todas las referencias cruzadas son válidas
- ✅ **Tipado**: Todos los tokens tienen tipos TypeScript correctos
- ✅ **Figma Compliance**: Tokens coinciden con Figma v1.0

---

## 🚀 Despliegue

### **📦 Publicación en NPM**
```bash
# Build para producción
npm run build

# Publicar nueva versión
npm version patch  # 1.0.1 → 1.0.2
npm publish

# Publicar major
npm version major  # 1.0.2 → 2.0.0
npm publish
```

### **🔗 Integración Continua**

#### **GitHub Actions**
- ✅ **Build Automation**: Compilación automática en cada push
- ✅ **Version Management**: Semantic versioning automático
- ✅ **NPM Publishing**: Publicación automática al main branch
- ✅ **Validation**: Tests automáticos de integridad

#### **Flujo de Trabajo**
1. **Developer** modifica `theme.tokens.json`
2. **Git commit** activa build pipeline
3. **Tokens compilados** y publicados automáticamente
4. **Componentes** actualizan con nuevos tokens automáticamente

---

## 🏷️ Licencia y Contribución

### **📜 Licencia MIT**
```
MIT License

Copyright (c) 2024 Crediscore Design System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:
...
```

### **🤝 Contribución**
¡Contribuciones bienvenidas! 

#### **📋 Guía de Contribución**
1. **Figma First**: Los cambios deben originarse en Figma Design System
2. **Token Compliance**: Mantener compatibilidad con v1.0
3. **Semantic Versioning**: Usar versionado semántico
4. **Documentation**: Actualizar documentación con cambios
5. **Testing**: Incluir tests para nuevos tokens

#### **🚀 Flujo de Contribución**
```bash
# Fork del repositorio
git clone https://github.com/binah-agency/design-tokens.git

# Crear feature branch
git checkout -b feature/nuevo-token

# Hacer cambios
# Editar theme.tokens.json

# Validar y build
npm run validate
npm run build

# Commit de cambios
git add .
git commit -m "feat: agregar nuevo token"

# Push y crear PR
git push origin feature/nuevo-token
gh pr create --title "Agregar Nuevo Token"
```

---

## 🔗 Enlaces y Recursos

### **🌐 Repositorios Relacionados**
- **[UI Tamagui](https://github.com/binah-agency/ui-tamagui)**: Componentes que usan estos tokens
- **[Atomic Design System](https://github.com/binah-agency/atomic-design-system)**: Sistema de diseño atómico
- **[Figma Design System](https://www.figma.com/design/...)**: Fuente de verdad de los tokens

### **📚 Documentación Adicional**
- **[Tamagui Docs](https://tamagui.dev/docs/core/tokens)**: Documentación oficial de tokens
- **[Atomic Design Guide](https://atomicdesign.guide)**: Mejores prácticas de diseño atómico
- **[Figma Tokens Plugin](https://www.figma.com/community/plugin/7391830533627449)**: Plugin para exportar tokens

---

## 📞 Soporte y Ayuda

### **🐛 Reportar Issues**
Si encuentras algún problema:

1. **Reproducir el error**: Pasos exactos para replicarlo
2. **Información del entorno**: Versión de Node, npm, Tamagui
3. **Tokens afectados**: Cuáles tokens están causando el problema
4. **Expected vs Actual**: Comportamiento esperado vs real

**Crear Issue**: [GitHub Issues](https://github.com/binah-agency/design-tokens/issues)

### **💬 Discusión y Comunidad**
- **[GitHub Discussions](https://github.com/binah-agency/design-tokens/discussions)**: Preguntas y discusiones
- **[Discord Crediscore](https://discord.gg/crediscore)**: Chat en tiempo real
- **[Design System Channel](https://slack.crediscore.design)**: Comunicación del equipo de diseño

---

## 📈 Changelog

### **v1.0.0** - *(Lanzamiento Inicial)*
- ✨ **Tokens Iniciales**: Colores, espaciado, bordes, tipografía
- 🎨 **Figma Compliance**: Tokens 100% compatibles con Figma v1.0
- 🔧 **Build Pipeline**: Compilador automático para múltiples plataformas
- 📱 **Tamagui Integration**: Configuración automática para React Native
- 📚 **Documentación Completa**: README exhaustivo en español
- 🚀 **Publicación**: Repositorio público en GitHub

---

> **🎨 Crediscore Design System**  
> Tokens unificados → Componentes atómicos → Experiencia consistente  
> 
> **Hecho con ❤️ para el ecosistema Crediscore**

---

## 📞 Contacto del Equipo

- **👨‍💻 Lead Developer**: [Equipo de Desarrollo](mailto:dev@crediscore.design)
- **🎨 Design System Team**: [Equipo de Diseño](mailto:design@crediscore.design)
- **🚀 DevOps Team**: [Equipo DevOps](mailto:devops@crediscore.design)

**🕒 Última Actualización**: Marzo 2024
