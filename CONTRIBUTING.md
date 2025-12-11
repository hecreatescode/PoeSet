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
│   ├── manifest.json    # PWA manifest
│   └── service-worker.js # Service worker
├── src/
│   ├── components/      # React components
│   ├── i18n/           # Translations (PL/EN)
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── App.css         # Global styles & themes
│   └── main.tsx        # Entry point
└── README.md           # Documentation
```

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Feature works in Chrome, Firefox, and Safari
- [ ] Mobile responsive design is intact
- [ ] Dark/Light themes work correctly
- [ ] PWA functionality is not broken
- [ ] Offline mode works as expected

## Feature Ideas

Looking for something to work on? Consider these areas:

- **Export improvements**: Additional formats, better styling
- **Accessibility**: ARIA labels, keyboard navigation enhancements
- **Mobile UX**: Gesture improvements, haptic feedback
- **Analytics**: More detailed statistics and visualizations
- **Collaboration**: Sharing poems with other users
- **Performance**: Virtual scrolling, code splitting
- **AI Integration**: Writing suggestions, style analysis

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainer.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
