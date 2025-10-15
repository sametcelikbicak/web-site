# Path Aliases Setup

This project is configured to automatically use `@/` path aliases instead of relative imports.

## How It Works

### 1. TypeScript Configuration

The `tsconfig.app.json` includes path mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Vite Configuration

The `vite.config.ts` includes alias resolution:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Jest Configuration

The `jest.config.cjs` includes module name mapping:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### 4. VS Code Settings

The `.vscode/settings.json` enforces absolute imports:

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.paths": true
}
```

### 5. ESLint Rules

The `eslint.config.js` prevents relative imports:

```javascript
rules: {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['../*', './*'],
          message: 'Relative imports are not allowed. Use @/ path aliases instead.',
        },
      ],
    },
  ],
}
```

## Usage Examples

### ✅ Good (Use these)

```typescript
import Header from '@/components/Header/Header';
import useAnalytics from '@/hooks/useAnalytics';
import { Theme } from '@/types/theme';
```

### ❌ Bad (Will cause ESLint errors)

```typescript
import Header from './components/Header/Header';
import useAnalytics from '../../hooks/useAnalytics';
import { Theme } from '../types/theme';
```

## Auto-Import Behavior

When you use VS Code with this configuration:

1. **Auto-completion** will suggest imports with `@/` aliases
2. **Auto-import** when you type a component name will use `@/` aliases
3. **Organize imports** will preserve `@/` aliases
4. **ESLint** will show errors for any relative imports

## Scripts

- `npm run lint` - Check for ESLint errors including import violations
- `npm run lint-fix` - Auto-fix ESLint errors where possible
- `npm run lint-imports` - Focus specifically on import rule violations

## IDE Setup

### VS Code

1. Install recommended extensions (listed in `.vscode/extensions.json`)
2. The workspace settings will automatically enforce absolute imports
3. Use Ctrl/Cmd + Space for auto-completion with path aliases

### Other IDEs

Make sure your IDE:

1. Recognizes the TypeScript path mappings in `tsconfig.app.json`
2. Has ESLint integration enabled
3. Supports TypeScript auto-import suggestions

## Troubleshooting

If auto-imports aren't working:

1. Reload VS Code TypeScript server: `Ctrl/Cmd + Shift + P` → "TypeScript: Restart TS Server"
2. Check that `tsconfig.app.json` paths are correctly configured
3. Ensure VS Code is using the workspace TypeScript version
4. Verify ESLint is running and showing import errors for relative paths
