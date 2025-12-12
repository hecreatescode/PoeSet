# Contributing to PoeSet

First off, thank you for considering contributing to PoeSet! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or GIFs** if applicable
- **Specify your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write a clear commit message** describing your changes
6. **Create a Pull Request** with a comprehensive description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/PoeSet.git
cd PoeSet

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Code Style Guidelines

- **TypeScript**: Use proper type annotations, avoid `any`
- **React**: Use functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Write clear comments for complex logic
- **CSS**: Use CSS variables for theming
- **Formatting**: Follow existing code formatting patterns

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Start with a capital letter
- Keep the first line under 50 characters
- Reference issues and pull requests when relevant

Examples:
```
Add voice dictation feature for poem editor
Fix responsive layout on mobile devices
Update README with new features
```

## Project Structure

```
PoeSet/
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest (v2.0.1)
│   ├── logo.svg         # Theme-aware app logo (v2.0.1)
│   └── service-worker.js # Service worker for offline caching
├── src/
│   ├── components/      # React components
│   │   ├── JournalScreen/
│   │   ├── PoemsScreen/
│   │   ├── CollectionsScreen/
│   │   ├── StatisticsScreen/
│   │   ├── SettingsScreen/
│   │   ├── TemplatesScreen/
│   │   ├── GoalsScreen/
│   │   ├── PoemEditor/
│   │   └── PoemViewer/
│   ├── i18n/           # Translations (PL/EN)
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Utility functions
│   │   ├── storage.ts   # localStorage & IndexedDB
│   │   ├── fileSystem.ts # File System Access API (v2.0.0)
│   │   └── markdown.ts  # Markdown parser
│   ├── App.tsx         # Main app component with routing
│   ├── App.css         # Global styles & 7 themes
│   ├── index.css       # CSS variables & animations
│   └── main.tsx        # Entry point
└── README.md           # Comprehensive documentation
```

## Key Technologies (v2.0.1)

- **React 19.2** - Latest React with automatic batching
- **TypeScript 5.9** - Strict type checking
- **Vite 7.2** - Lightning-fast build tool
- **date-fns** - Date manipulation with Polish locale
- **lucide-react** - Modern icon library
- **Web APIs**: Speech Recognition, File System Access, Service Worker, IndexedDB

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Feature works in Chrome, Firefox, and Safari
- [ ] Mobile responsive design is intact (test swipe gestures)
- [ ] All 7 themes work correctly (Light/Dark/Sepia/Midnight/Forest/Ocean/Rose)
- [ ] PWA functionality is not broken (install prompt, offline mode)
- [ ] Service worker caches correctly
- [ ] Custom Google Fonts load properly
- [ ] File System API has proper fallback
- [ ] Animations respect reduced-motion preference

## Feature Ideas

Looking for something to work on? Consider these areas:

- **v2.0.1 Completed**:
  - Individual poem themes
  - PNG sharing for social media
  - Theme-aware header logo
  - Custom moods in poem editor
  - Enhanced high contrast mode
  - Improved swipe navigation

- **v2.2 Features**:
  - Import poems from other formats (TXT, DOCX, MD)
  - Cloud sync with optional backend
  - Collaborative poem editing
  - AI-powered writing suggestions
  - Advanced search with regex support
  - Poem versioning with diff view
  
- **Accessibility**: ARIA labels, keyboard navigation enhancements
- **Mobile UX**: More gesture improvements, haptic feedback
- **Analytics**: Heat maps, writing time analysis, mood correlations
- **Performance**: Virtual scrolling for large libraries, lazy image loading
- **Localization**: More languages beyond PL/EN

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainer.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
