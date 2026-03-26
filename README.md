# 🎨 Design Tokens Crediscore

> **Sistema de Diseño Unificado** - Tokens de diseño para el ecosistema Crediscore
> 
> **Figma Compliance v1.0** - Tokens mapeados exactamente desde Figma Design System
> 
> **Atomic Design Ready** - Diseñado para componentes atómicos y composición
> 
> **Multi-Framework Support** - Genera configs para Tamagui, Tailwind, Mantine, CSS Variables

---

## 📋 Índice

- [🚀 Quick Start](#-quick-start)
- [🏗️ Estructura del Proyecto](#-estructura-del-proyecto)
- [🎨 Tokens Disponibles](#-tokens-disponibles)
- [🎯 Uso en Componentes](#-uso-en-componentes)
- [🔧 Desarrollo](#-desarrollo)
- [📚 Referencia de Tokens](#-referencia-de-tokens)
- [🔄 Build Pipeline](#-build-pipeline)
- [✅ Validación](#-validación)
- [🚀 Despliegue](#-despliegue)

---

## 🚀 Quick Start

### **Instalación Rápida**
```bash
# Clonar el repositorio
git clone https://github.com/binah-agency/design-tokens.git

# Instalar dependencias
pnpm install

# Build tokens
pnpm build
```

### **Uso Inmediato**
```typescript
// Importar tokens en tu componente Tamagui
import { colors, spacing, radius } from '@crediscore/tokens';

// Usar en componentes React Native con Tamagui
const MyComponent = styled(View, {
  backgroundColor: colors.azulHorizonte,
  padding: spacing.md,
  borderRadius: radius.md,
});
```

---

## 🏗️ Estructura del Proyecto

```
packages/design-tokens/
├── src/
│   ├── builders/          # Generadores de configs framework
│   │   ├── tamagui.ts    # Generador Tamagui
│   │   ├── tailwind.ts   # Generador Tailwind
│   │   ├── mantine.ts    # Generador Mantine
│   │   └── css.ts        # Generador CSS Variables
│   ├── config/
│   │   └── constants.ts   # Configuración del build pipeline
│   ├── core/
│   │   └── build.ts       # Core del build process
│   ├── utils/
│   │   └── validation.ts  # Validación de tokens
│   └── types/
│       └── index.ts       # TypeScript types
├── theme.tokens.json     # 🎯 Fuente de verdad única
├── dist/                  # Archivos generados
└── README.md
```

---

## 🎨 Tokens Disponibles

### **🎨 Colores**
```json
{
  "azulHorizonte": "#3467B0",     // Primary brand color
  "verdeVitalidad": "#86B545",    // Secondary brand color
  "rojoAlerta": "#D32F2F",        // Error state
  "naranjaEspera": "#F57C00",     // Warning state
  "white": "#FFFFFF",             // Neutral white
  "black": "#2D2D2C",             // Neutral black
  "gray50": "#F7F8F9",            // Gray scale
  "gray200": "#E5E5E5",
  "gray400": "#B5B5B5",
  "gray600": "#7A7A7A",
  "gray800": "#4A4A4A"
}
```

### **📏 Espaciado**
```json
{
  "0": "0",      // No spacing
  "1": "4",      // 4px - Figma base
  "2": "8",      // 8px - Figma base  
  "3": "12",     // 12px
  "4": "16",     // 16px - Figma base
  "5": "24",     // 24px
  "6": "32",     // 32px
  "7": "48",     // 48px
  "8": "64",     // 64px
  "9": "80",     // 80px
  "10": "96"     // 96px
}
```

### **🔤 Tipografía**
```json
{
  "fontFamily": {
    "montserrat": "Montserrat, sans-serif"
  },
  "fontSize": {
    "xs": "12",
    "sm": "14", 
    "base": "16",
    "lg": "18",
    "xl": "20",
    "2xl": "24",
    "3xl": "30",
    "4xl": "36",
    "5xl": "48"
  }
}
```

### **🔄 Radio de Bordes**
```json
{
  "0": "0",      // Sin bordes
  "1": "4",      // 4px radius
  "2": "8",      // 8px radius
  "3": "12",     // 12px radius
  "4": "16",     // 16px radius
  "round": "9999" // Completely rounded
}
```

---

## 🎯 Uso en Componentes

### **Tamagui Components**
```typescript
import { XStack, Text } from 'tamagui';

const Button = ({ variant = 'primary' }) => (
  <XStack
    backgroundColor={variant === 'primary' ? '$azulHorizonte' : '$verdeVitalidad'}
    padding="$4"
    borderRadius="$2"
  >
    <Text color="$white" fontFamily="$heading">
      Button Text
    </Text>
  </XStack>
);
```

### **CSS Variables**
```css
.my-component {
  background-color: var(--azul-horizonte);
  padding: var(--space-4);
  border-radius: var(--radius-2);
  font-family: var(--font-montserrat);
}
```

### **Tailwind CSS**
```html
<div class="bg-azul-horizonte p-4 rounded-2 font-montserrat">
  Content with design tokens
</div>
```

---

## 🔧 Desarrollo

### **Comandos Disponibles**
```bash
# Build todos los configs
pnpm build

# Watch mode para desarrollo
pnpm dev

# Validar tokens
pnpm validate

# Limpiar builds
pnpm clean

# Type checking
pnpm type-check

# Tests
pnpm test
pnpm test:coverage
```

### **Agregar Nuevos Tokens**
1. Editar `theme.tokens.json` (única fuente de verdad)
2. Run `pnpm build` (genera todos los configs automáticamente)
3. Los cambios se aplican a todos los frameworks

```json
// theme.tokens.json
{
  "global": {
    "color": {
      "newColor": {
        "value": "#FF6B6B",
        "type": "color",
        "description": "New brand color"
      }
    }
  }
}
```

---

## 🔄 Build Pipeline

### **Proceso Automático**
```bash
pnpm build
```

**Genera automáticamente:**
- ✅ **CSS Variables**: `dist/css/theme.css`
- ✅ **Tailwind Config**: `dist/tailwind/tailwind.config.ts`
- ✅ **Mantine Config**: `dist/mantine/mantine.config.ts`
- ✅ **Tamagui Config**: `dist/tamagui/tamagui.config.ts`
- ✅ **TypeScript Types**: `dist/types/mantine.d.ts`
- ✅ **Enterprise Types**: `dist/types/generated/enterprise-types.ts`

### **Auto-Sync Tamagui Config**
```bash
# El build automáticamente sincroniza:
dist/tamagui/tamagui.config.ts → ../config/tamagui/tamagui.config.ts
```

---

## ✅ Validación

### **Validaciones Automáticas**
El build process incluye validaciones automáticas:

- ✅ **Schema Validation**: Estructura JSON válida
- ✅ **Token Structure**: Tokens requeridos presentes
- ✅ **Figma Compliance**: 4px, 8px, 16px spacing
- ✅ **Font Family**: Montserrat disponible
- ✅ **Color Palette**: Colores Figma requeridos

### **Test de Tamagui**
```bash
# Verificar configuración de Tamagui
node tests/simple-tamagui-test.mjs
```

**Valida:**
- ✅ Tokens "true" presentes (requerido por Tamagui)
- ✅ Estructura compatible con createTamagui()
- ✅ Tokens de color correctamente mapeados
- ✅ Sin claves problemáticas en radius

---

## 🚀 Despliegue

### **Publicación**
```bash
# Build y test
pnpm build
pnpm test

# Publicar a registry restringido
npm publish
```

### **Integración CI/CD**
```yaml
# .github/workflows/build.yml
- name: Build Design Tokens
  run: |
    cd packages/design-tokens
    pnpm install
    pnpm build
    pnpm test

- name: Sync Configs  
  run: |
    # Auto-sync generated configs
    pnpm sync:config
```

---

## 📚 Referencia Completa

### **Tokens Semánticos**
```typescript
// Colores semánticos generados automáticamente
{
  primary: '$azulHorizonte',      // Primary brand
  secondary: '$verdeVitalidad',    // Secondary brand
  success: '$verdeVitalidad',      // Success state
  warning: '$naranjaEspera',       // Warning state
  error: '$rojoAlerta',            // Error state
  text: '$black',                 // Text color
  background: '$white',           // Background color
  borderColor: '$gray200'          // Border color
}
```

### **Tokens de Estado**
```typescript
// Estados interactivos
{
  colorDisabled: '$gray400',           // Disabled state
  backgroundHover: '$azulHorizonteLight', // Hover state
  borderFocused: '$azulHorizonte',      // Focus state
  colorPressed: '$azulHorizonteDark'     // Pressed state
}
```

---

## 🔗 Frameworks Soportados

| Framework | Config Generated | Auto-Sync | Status |
|-----------|------------------|-----------|---------|
| **Tamagui** | ✅ `tamagui.config.ts` | ✅ Auto-sync | Production Ready |
| **Tailwind** | ✅ `tailwind.config.ts` | ❌ Manual | Production Ready |
| **Mantine** | ✅ `mantine.config.ts` | ❌ Manual | Production Ready |
| **CSS Variables** | ✅ `theme.css` | ❌ Manual | Production Ready |

---

## 🎯 Mejoras Recientes

### **v1.0.3 - Última Actualización**
- ✅ **Fixed JetBrains font issue** - Solo usa Montserrat (definido en tokens)
- ✅ **Fixed validation logic** - Proper structure checking
- ✅ **Auto-sync Tamagui config** - No manual edits required
- ✅ **Builder-generated configs** - Single source of truth
- ✅ **Type safety improvements** - Proper TypeScript types
- ✅ **Zero warnings build** - Clean build process

### **Próximas Mejoras**
- 🔄 **Watch mode improvements**
- 🔄 **Token documentation generator**
- 🔄 **Figma sync integration**
- 🔄 **Component token mapping**

---

## 🤝 Contribuir

1. **Editar tokens**: Solo en `theme.tokens.json`
2. **Build**: `pnpm build` (genera todo automáticamente)
3. **Test**: `pnpm test` (valida configs)
4. **Commit**: Incluir cambios generados
5. **PR**: Con tests pasando

**Regla de Oro**: 🎯 **Nunca editar configs generados manualmente**

---

## 📄 Licencia

**Crediscore Design System** - Uso interno restringido

© 2024 Crediscore - Todos los derechos reservados

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

# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests de integración
npm run test:integration

# Ejecutar tests en modo watch
npm run test:watch

# Limpiar build
npm run clean

# Publicar paquete
npm run publish
```

### **🧪 Test Suite**
El repositorio incluye una suite completa de pruebas:

#### **✅ Unit Tests**
- **Validación de tokens**: Estructura y formato de tokens
- **Detección de errores**: Tokens faltantes o inválidos
- **Referencias cruzadas**: Validación de referencias entre tokens

#### **✅ Integration Tests**
- **End-to-end workflow**: Compilación completa y validación
- **Builders testing**: Generación de archivos para diferentes plataformas
- **CLI commands**: Validación de comandos de línea

#### **📊 Coverage**
- **Objetivo**: >90% de cobertura de código
- **Reportes**: HTML, LCOV, y texto
- **Umbral**: Mínimo 80% para pasar CI/CD

### **🔄 Build Pipeline**
El pipeline de build procesa los tokens y genera múltiples formatos:

1. **Token Compiler**: `theme.tokens.json` → `dist/src/`
2. **TypeScript**: Genera tipos con autocompletado
3. **Platform Builders**: Para Tamagui, Tailwind, Mantine
4. **Validation**: Verifica integridad de tokens
5. **Optimization**: Minificación y optimización
6. **Testing**: Ejecución automática de tests

### **🧪 Estructura de Tests**
```
src/__tests__/
├── tokens.test.ts           # Tests de validación de tokens
├── compiler.test.ts         # Tests del compilador
├── builders.test.ts         # Tests de builders específicos
├── cli.test.ts             # Tests de comandos CLI
└── integration/             # Tests de integración
    └── end-to-end.test.ts  # Workflow completo
```

### **🎯 Ejecución de Tests**
```bash
# Ejecutar todos los tests
npm test

# Ejecutar con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testNamePattern="tokens"

# Modo desarrollo (watch)
npm run test:watch
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
