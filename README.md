# Personal Portfolio Website

This is a modern, multilingual personal portfolio website built with **React**, **TypeScript**, and **Vite**. It features a responsive design, dark/light theme toggle, and showcases professional experience and projects. The site supports both English and Turkish languages.

## Features

- ⚡ Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/)
- 🎨 Uses [TailwindCSS](https://tailwindcss.com/) for styling and theming
- 🌗 Dark/Light theme toggle (context-based)
- 🌍 Multilingual support (English & Turkish) via [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/)
- 🧑‍💻 Professional experience and project showcase
- 📦 Modular component structure
- 🧹 Code linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://prettier.io/)

## Project Structure

```
src/
  components/      # Main UI components (Header, Profile, About, Experience, Projects, Footer)
  hooks/           # Custom React hooks (e.g., useTheme)
  locales/         # Translation files (en, tr)
  types/           # TypeScript types (theme)
  theme.tsx        # Theme context/provider
  i18n.tsx         # i18next configuration
  index.css        # TailwindCSS and custom styles
  App.tsx          # Main app component
  main.tsx         # App entry point
public/
  sc.png           # Profile/logo image
  icons/           # Additional icons
index.html         # Main HTML file
vite.config.ts     # Vite configuration
eslint.config.js   # ESLint configuration
tsconfig*.json     # TypeScript configs
```

## Scripts

| Command   | Description               |
| --------- | ------------------------- |
| `dev`     | Start development server  |
| `build`   | Build for production      |
| `preview` | Preview production build  |
| `lint`    | Run ESLint                |
| `format`  | Format code with Prettier |

## Main Packages

- **react**, **react-dom**: UI library
- **typescript**: Type safety
- **vite**: Fast build tool
- **tailwindcss**, **@tailwindcss/vite**: Utility-first CSS framework
- **i18next**, **react-i18next**: Internationalization
- **eslint**, **prettier**: Linting & formatting

## ESLint & Formatting

ESLint is configured for React, TypeScript, and hooks best practices. Prettier is used for code formatting. See `eslint.config.js` for details.

## Theming

Theme context is provided via `ThemeProvider` (`src/theme.tsx`). Use the theme toggle button in the header to switch between dark and light modes.

## Internationalization

Translations are managed in `src/locales/en/translation.json` and `src/locales/tr/translation.json`. The language can be switched via the header dropdown.

## Experience & Projects

Professional experience and projects are listed in the UI and translation files. Project images are loaded from external sources or the `public` folder.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## License

MIT

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
