<div align="center">
  <img src="https://raw.githubusercontent.com/hecreatescode/PoeSet/main/public/ground.png" alt="PoeSet Logo" width="200"/>
  
  # PoeSet - Poet's Journal 📖
  
  A minimalist, offline-first Progressive Web App for writing, organizing, and analyzing your poetry with advanced features and beautiful themes.
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hecreatescode.github.io/PoeSet/)
  [![Version](https://img.shields.io/badge/version-1.0.3-blue)](https://github.com/hecreatescode/PoeSet)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

## ✨ Features

### Core Functionality
- 📝 **Daily Journal** - Write poems with timestamps and automatic saving every 3 seconds
- 📚 **Smart Library** - Search, filter, and sort all your poems
- 📁 **Collections** - Organize poems into custom collections with colors
- 📊 **Analytics** - Track writing streaks, word counts, and productivity
- 🎯 **Goals & Achievements** - Set daily/weekly/monthly targets with unlockables

### Writing Experience
- 🎤 **Voice Dictation** - Speech-to-text using Web Speech API
- 📋 **Templates** - Sonet, Haiku, Limerick + custom templates
- ✍️ **Text Formatting** - Bold, italic, underline toolbar
- 📑 **Markdown Support** - Live preview with split-screen editor
- 🔄 **Version History** - Track up to 10 versions per poem
- 🏷️ **Smart Tags** - Autocomplete based on existing tags
- 😊 **Mood Tracking** - 8 default + unlimited custom moods
- 🔐 **Encryption** - AES-GCM-256 for private poems

### Customization
- 🎨 **7 Beautiful Themes** - Light, Dark, Sepia, Midnight, Forest, Ocean, Rose
- 🔤 **Custom Google Fonts** - Add any font from Google Fonts
- 📏 **Layout Options** - 4 width settings (narrow to full)
- 🔠 **Font Sizes** - Small, Medium, Large, Extra Large
- 📱 **Responsive Design** - Optimized for mobile and desktop

### Data & Export
- 💾 **Multiple Storage Options** - localStorage, IndexedDB, or device files (File System API)
- 📤 **Export Formats** - JSON, PDF, EPUB, Markdown, HTML
- 📥 **Import** - Restore from backup files
- 🔄 **Auto-Backup** - Configurable automatic backups (5-120 min)
- 🌐 **Offline-First** - Full functionality without internet

### Mobile & PWA
- 📱 **Installable** - Add to home screen like native app
- 👆 **Swipe Gestures** - Navigate between screens with swipes
- 🔔 **Push Notifications** - Optional writing reminders
- 🚀 **Service Worker** - Offline caching and fast loading
- 📲 **Share Target** - Share poems via device sharing

### Accessibility
- ♿ **High Contrast Mode** - Better visibility
- 🎬 **Reduced Motion** - Disable animations
- 🌍 **Bilingual** - Polish and English with auto-detection
- ⌨️ **Keyboard Shortcuts** - Esc to close, Enter to submit

## 🚀 Quick Start

### Install as PWA

1. Visit **https://hecreatescode.github.io/PoeSet/**
2. **Android/Chrome**: Menu (⋮) → "Install app" or "Add to Home Screen"
3. **iOS/Safari**: Share (↑) → "Add to Home Screen"
4. **Desktop**: Look for install icon in address bar

### Local Development

```bash
# Clone repository
git clone https://github.com/hecreatescode/PoeSet.git
cd PoeSet

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🎨 Themes Preview

| Theme | Description | Best For |
|-------|-------------|----------|
| **Light** | Clean paper-like (#f9f7f4) | Daytime writing |
| **Dark** | Deep ink (#0f1419) | Night sessions |
| **Sepia** | Vintage journal (#f4ecd8) | Classic feel |
| **Midnight** | Dark blue (#1a1f3a) | Late-night creativity |
| **Forest** | Dark green (#1a2f1a) | Nature inspiration |
| **Ocean** | Light blue (#e8f4ff) | Calm creativity |
| **Rose** | Soft pink (#ffe8f0) | Romantic poetry |

## 🔧 Tech Stack

- **Frontend**: React 19.2 + TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: CSS Variables + Custom CSS
- **Icons**: lucide-react
- **Date Handling**: date-fns (with Polish locale)
- **Storage**: localStorage + IndexedDB + File System API
- **PWA**: Service Worker + Web App Manifest
- **i18n**: Custom bilingual system (PL/EN)
- **Voice**: Web Speech API
- **Encryption**: Web Crypto API (AES-GCM-256)

## 📊 Statistics & Analytics

- **Word Count** - Total words across all poems
- **Most Used Words** - Top 20 with visual frequency bars
- **Writing Streaks** - Current and longest streaks
- **Productivity Trends** - Poems per day/week/month
- **Mood Distribution** - Emotional patterns in your poetry
- **Time Analytics** - Best writing times and patterns

## 🎯 Goals System

Set and track writing goals:
- **Daily**: Write X poems per day
- **Weekly**: Maintain Y streak days
- **Monthly**: Reach Z total words

**Achievements**:
- 🏆 First Poem - Write your first poem
- 🔥 Week Warrior - 7-day writing streak
- 📚 Collector - Create first collection
- ✍️ Prolific - Write 50 poems

## 💾 Storage Options

1. **Browser Storage** (Default)
   - localStorage for settings
   - IndexedDB for auto-backups
   - Works on all devices

2. **Device Files** (Optional)
   - File System Access API
   - Direct file saving
   - Requires modern browser

3. **Manual Backup**
   - Download JSON backups
   - Import/restore anytime
   - Cross-device transfer

## 📝 Changelog

### Version 1.0.3 (Current - December 2025)

#### 🎨 New Features
- **7 Theme System** - Added Midnight, Forest, Ocean (light blue), and Rose (light pink) themes
- **Custom Google Fonts** - Add, select, and remove fonts from Google Fonts library
- **Swipe Gestures** - Navigate between screens with left/right swipes on mobile
- **File System API** - Option to save data directly to device storage
- **Enhanced PWA** - Install prompt, service worker with offline caching
- **Layout Width Control** - Four width options (narrow, medium, wide, full) with CSS implementation
- **Improved Animations** - Spinner animation, fadeIn effects, respects reduced-motion preference

#### 🐛 Bug Fixes
- Fixed responsive layout on mobile (reduced minmax values from 140px to 110px)
- Fixed layout width functionality not applying classes
- Ocean theme changed from dark to light blue variant
- Rose theme changed to soft pink (#ffe8f0)
- Better button contrast in all new themes

#### 🔧 Technical Improvements
- Service worker for offline support (`/public/service-worker.js`)
- File System Access API utility (`/src/utils/fileSystem.ts`)
- TypeScript improvements with proper type definitions
- CSS keyframes for spin and fadeIn animations
- Dynamic Google Fonts loading
- Touch event handlers for swipe gestures

#### 📋 Previous Features (v1.0.2)
- **Speech-to-text dictation** - Voice input with microphone button
- **Custom poem templates** - Create and manage your own templates
- **Bulk operations** - Multi-select for batch actions
- **Custom moods** - Unlimited custom mood options
- **Text formatting toolbar** - Bold, italic, underline
- **Word frequency analysis** - Top 20 most used words visualization
- **Version history** - Track up to 10 versions per poem
- **Poem duplication** - Copy poems with one click
- **Goals and achievements** - 4 unlockable achievements
- **Advanced filters** - Date range, length, mood filtering
- **Tag autocomplete** - Smart tag suggestions
- **Encryption** - AES-GCM-256 for private poems
- **Markdown support** - Live preview split-screen
- **Extended export** - PDF, EPUB, Markdown, HTML formats

### Version 1.0.1 (October 2025)
- Bilingual support (Polish/English)
- Auto-detect browser language
- TypeScript and Fast Refresh fixes
- Lazy loading implementation
- Translation improvements

### Version 1.0.0 (September 2025)
- Initial release
- Core features: Journal, Library, Collections, Statistics
- PWA support with offline capabilities
- Auto-save functionality
- Three-theme system (Light, Dark, Sepia)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**hecreatescode**
- GitHub: [@hecreatescode](https://github.com/hecreatescode)
- Project: [PoeSet](https://github.com/hecreatescode/PoeSet)

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Icon library
- [date-fns](https://date-fns.org/) - Date utilities
- [Google Fonts](https://fonts.google.com/) - Custom font support

---

<div align="center">
  Made with ❤️ by hecreatescode
  
  [Live Demo](https://hecreatescode.github.io/PoeSet/) • [Report Bug](https://github.com/hecreatescode/PoeSet/issues) • [Request Feature](https://github.com/hecreatescode/PoeSet/issues)
</div>