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
- 🛡️ Git hooks with [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) for pre-commit quality checks

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
.husky/            # Husky git hooks (e.g., pre-commit)
.huskyrc.json      # Husky configuration
.lintstagedrc.json # lint-staged configuration
index.html         # Main HTML file
vite.config.ts     # Vite configuration
eslint.config.js   # ESLint configuration
tsconfig*.json     # TypeScript configs
```

## Scripts

| Command     | Description                         |
| ----------- | ----------------------------------- |
| `dev`       | Start development server            |
| `build`     | Build for production                |
| `preview`   | Preview production build            |
| `lint`      | Run ESLint                          |
| `format`    | Format code with Prettier           |
| `predeploy` | Build before deployment             |
| `deploy`    | Deploy to GitHub Pages (`gh-pages`) |

## Main Packages

- **react**, **react-dom**: UI library
- **react-router-dom**: Routing for React
- **typescript**: Type safety
- **vite**: Fast build tool
- **tailwindcss**, **@tailwindcss/vite**: Utility-first CSS framework
- **i18next**, **react-i18next**: Internationalization
- **eslint**, **prettier**: Linting & formatting

## Deployment

To deploy the site to GitHub Pages:

1. Make sure your repository is set up with the correct `homepage` in `package.json` (if needed).
2. Run:
   ```bash
   npm run deploy
   ```
   This will build the project and publish the `dist` folder to the `gh-pages` branch using the `gh-pages` package.

The `predeploy` script ensures the site is built before deploying.

## ESLint & Formatting

ESLint is configured for React, TypeScript, and hooks best practices. Prettier is used for code formatting. See `eslint.config.js` for details.

## Git Hooks: Husky & lint-staged

[Husky](https://typicode.github.io/husky/) is used to manage Git hooks, and [lint-staged](https://github.com/okonet/lint-staged) ensures that only staged files are linted and formatted before each commit.

- **Pre-commit hook**: Automatically runs `npm run lint` and `npm run format` on staged files matching `*.{js,jsx,ts,tsx,css,md,json}` before allowing a commit.
- Configuration for lint-staged is in `.lintstagedrc.json`.
- You can find the Husky hook in `.husky/pre-commit`.

This helps maintain code quality and consistent formatting across all commits.

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
