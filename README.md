<div align="center">
  <img src="https://raw.githubusercontent.com/hecreatescode/PoeSet/main/public/ground.png" alt="PoeSet Logo" width="200"/>
  
  # PoeSet - Dziennik Poety 📖
  
  Minimalistyczna, offline-first aplikacja PWA do pisania i organizowania poezji.
</div>

## ✨ Funkcje

- 📝 **Dziennik** - Pisz codzienne wiersze z datowaniem
- 📚 **Biblioteka** - Przeszukuj i sortuj wszystkie wiersze
- 📁 **Zbiory** - Organizuj wiersze w kolorowe kolekcje
- 📊 **Statystyki** - Śledź swoją twórczość i streaki
- 🌍 **Dwujęzyczna** - Polski i angielski z automatyczną detekcją
- 🎨 **3 motywy** - Jasny, ciemny i sepia
- 💾 **Offline-first** - Wszystko zapisywane lokalnie
- 🔄 **Auto-save** - Automatyczne zapisywanie co 3 sekundy
- 📱 **PWA** - Instalowalna na telefonie jak natywna aplikacja
- ⚡ **Lazy loading** - Optymalizacja wydajności dla dużych bibliotek

## 🚀 Instalacja na telefonie

1. Otwórz **https://hecreatescode.github.io/PoeSet/** w przeglądarce
2. **Android**: Menu → "Dodaj do ekranu głównego"
3. **iOS**: Udostępnij → "Dodaj do ekranu głównego"

## 💻 Development

```bash
npm install
npm run dev
```

## 🔧 Tech Stack

- React 19.2 + TypeScript
- Vite 7.2
- date-fns (Polish/English locale)
- lucide-react icons
- localStorage API
- Service Worker (PWA)
- i18n (Polish/English)

## 📝 Changelog

### Version 1.0.1 (Current)
- ✅ Added bilingual support (Polish/English)
- ✅ Auto-detect browser language
- ✅ Fixed TypeScript compilation errors
- ✅ Fixed Fast Refresh issues
- ✅ Added lazy loading for better performance
- ✅ Fixed date formatting for both languages
- ✅ Improved translations coverage

### Version 1.0.0
- 🎉 Initial release
- Core features: Journal, Library, Collections, Statistics
- PWA support with offline capabilities
- Auto-save functionality
- Three theme system

---

# Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
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
])
```
