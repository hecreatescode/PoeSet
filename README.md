<div align="center">
  <img src="https://raw.githubusercontent.com/hecreatescode/PoeSet/main/public/ground.png" alt="PoeSet Logo" width="200"/>
  
  # PoeSet - Poet's Journal 📖
  
  A minimalist, offline-first PWA application for writing and organizing poetry.
</div>

## ✨ Features

- 📝 **Journal** - Write daily poems with timestamps
- 📚 **Library** - Search and sort all your poems
- 📁 **Collections** - Organize poems into colorful collections
- 📊 **Statistics** - Track your creativity and writing streaks
- 🌍 **Bilingual** - Polish and English with automatic detection
- 🎨 **3 themes** - Light, dark, and sepia
- 💾 **Offline-first** - Everything saved locally
- 🔄 **Auto-save** - Automatic saving every 3 seconds
- 📱 **PWA** - Installable on mobile like a native app
- ⚡ **Lazy loading** - Performance optimization for large libraries

## 🚀 Install on Mobile

1. Open **https://hecreatescode.github.io/PoeSet/** in your browser
2. **Android**: Menu → "Add to Home Screen"
3. **iOS**: Share → "Add to Home Screen"

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

### Version 1.0.3 (Current)
- ✨ **New Features:**
  - **Speech-to-text dictation** - Voice input with microphone button in poem editor (Web Speech API)
  - **Custom poem templates** - Create, edit, and manage your own templates with full CRUD operations
  - **Bulk operations** - Select multiple poems for batch deletion or adding to collections
  - **Custom moods** - Add unlimited custom moods beyond the 8 default options
  - **Text formatting toolbar** - Bold, italic, and underline formatting in the editor
  - **Word frequency analysis** - View top 20 most used words in your poetry with visual bars
  - **Version history** - Track up to 10 previous versions of each poem with restore capability
  - **Poem duplication** - Copy button to duplicate poems with "(kopia)" suffix
  - **Goals and achievements system** - Set daily/weekly/monthly goals with 4 unlockable achievements
  - **Advanced filters** - Filter poems by date range, content length, and mood
  - **Tag autocomplete** - Smart suggestions based on existing tags across all poems
  - **Mood tracking** - 8 default moods (happy, sad, neutral, inspired, melancholic, excited, calm, anxious)
  - **Encryption for private poems** - AES-GCM-256 encryption with password protection
  - **Markdown support** - Live preview with split-screen view in editor
  - **Templates screen** - Dedicated UI for managing poem templates (Sonet, Haiku, Limerick)

- 🎨 **UI/UX Improvements:**
  - Modal confirmations for delete operations
  - Hover preview tooltips for poems in library
  - Keyboard shortcuts (Esc to close modals)
  - Improved mobile responsive design with better touch interactions
  - Visual statistics charts with color gradients
  - Formatting toolbar with visual feedback

- 🔧 **Technical:**
  - Web Speech API integration for voice recognition
  - Enhanced storage with template and version management
  - Improved type safety with extensible MoodType
  - Better error handling in encryption and speech recognition
  - React Compiler warnings fixed
  - Optimized rendering performance

### Version 1.0.2
- ✨ **New Features:**
  - **4 new themes** - Midnight, Forest, Ocean, Rose (added to Light, Dark, Sepia)
  - **Title editing** - Edit poem titles directly in the viewer
  - **Search result highlighting** - Visual highlighting of search terms
  - **Extended export formats** - PDF, EPUB, Markdown, HTML export capabilities
  - **Import from JSON** - Restore data from backup files
  - **Font size options** - Small, Medium, Large, Extra Large
  - **Layout width customization** - Narrow, Medium, Wide, Full
  - **Swipe gestures** - Mobile-friendly navigation
  - **Offline status indicators** - Visual feedback for offline mode
  - **Private collections** - Mark collections as private
  - **Social sharing** - Image generation for sharing poems
  - **Daily writing reminders** - Optional notification system
  - **PWA enhancements** - Push notifications, Share Target API
  - **Accessibility improvements** - High contrast mode, Reduced motion option

- 🎨 **UI/UX Improvements:**
  - Improved modal animations
  - Better mobile responsive design
  - Enhanced touch interactions
  - Cleaner settings interface
  - More intuitive navigation

- 🔧 **Technical:**
  - Performance optimizations (Virtual scrolling prep, IndexedDB migration prep)
  - Encryption utility for secure content
  - Markdown parser implementation
  - Export service for multiple formats
  - Enhanced type definitions
  - Better error handling
  - Improved accessibility features

### Version 1.0.1
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
