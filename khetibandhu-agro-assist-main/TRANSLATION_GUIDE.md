# KhetiBandhu Translation System

This guide explains how to use the comprehensive translation system implemented in KhetiBandhu.

## 🌍 Supported Languages

The application supports 12 Indian languages plus English:

- **English** (en) - Default language
- **Hindi** (hi) - हिन्दी
- **Telugu** (te) - తెలుగు
- **Tamil** (ta) - தமிழ்
- **Bengali** (bn) - বাংলা
- **Gujarati** (gu) - ગુજરાતી
- **Marathi** (mr) - मराठी
- **Kannada** (kn) - ಕನ್ನಡ
- **Malayalam** (ml) - മലയാളം
- **Punjabi** (pa) - ਪੰਜਾਬੀ
- **Odia** (or) - ଓଡ଼ିଆ
- **Assamese** (as) - অসমীয়া

## 🚀 Features

### Floating Language Switcher
- **Position**: Fixed bottom-right corner of all pages
- **Design**: Circular globe icon with dropdown menu
- **Functionality**: Instant language switching with visual feedback
- **Persistence**: Language preference saved in localStorage

### Translation Structure
All translations are organized in a hierarchical structure:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    // ... common UI elements
  },
  "dashboard": {
    "title": "Dashboard",
    "stats": {
      "total_points": "Total Points",
      // ... dashboard statistics
    },
    "cards": {
      "my_quests": "My Quests",
      // ... dashboard cards
    }
  },
  "navigation": {
    "dashboard": "Dashboard",
    "quests": "Quests",
    // ... navigation items
  }
  // ... other sections
}
```

## 📁 File Structure

```
src/
├── i18n/
│   ├── index.ts                 # i18n configuration
│   └── locales/
│       ├── en.json             # English translations
│       ├── hi.json             # Hindi translations
│       ├── te.json             # Telugu translations
│       ├── ta.json             # Tamil translations
│       ├── bn.json             # Bengali translations
│       ├── gu.json             # Gujarati translations
│       ├── mr.json             # Marathi translations
│       ├── kn.json             # Kannada translations
│       ├── ml.json             # Malayalam translations
│       ├── pa.json             # Punjabi translations
│       ├── or.json             # Odia translations
│       └── as.json             # Assamese translations
├── components/
│   └── Translate/
│       └── FloatingLanguageSwitcher.tsx
└── hooks/
    └── useTranslation.ts
```

## 🛠️ Usage

### Using Translations in Components

1. **Import the hook**:
```tsx
import { useTranslation } from '@/hooks/useTranslation';
```

2. **Use in component**:
```tsx
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
};
```

3. **With fallback text**:
```tsx
<h2>{t('dashboard.custom_text', 'Default English Text')}</h2>
```

### Translation Key Naming Convention

- Use dot notation for hierarchy: `section.subsection.key`
- Use snake_case for keys: `total_points`, `active_quests`
- Group related translations: `dashboard.stats.*`, `navigation.*`

### Examples

```tsx
// Basic usage
{t('common.loading')}

// With interpolation
{t('dashboard.stats.of_farmers')} {totalFarmers} {t('common.farmers')}

// With fallback
{t('custom.key', 'Fallback text')}

// Nested keys
{t('dashboard.cards.my_quests')}
{t('navigation.dashboard')}
```

## 🎨 Floating Language Switcher

The floating language switcher is automatically included on all pages and provides:

- **Visual Design**: Globe icon with smooth hover effects
- **Dropdown Menu**: Shows all available languages with flags
- **Current Language**: Displays checkmark for active language
- **Responsive**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Customization

To customize the floating switcher position or styling:

```tsx
// In App.tsx
<FloatingLanguageSwitcher className="bottom-4 right-4" />
```

## 🔧 Adding New Languages

1. **Create translation file**:
```bash
# Create new file: src/i18n/locales/[language_code].json
```

2. **Add to i18n configuration**:
```tsx
// In src/i18n/index.ts
import newLanguage from './locales/[language_code].json';

const resources = {
  // ... existing languages
  [language_code]: { translation: newLanguage },
};
```

3. **Add to language switcher**:
```tsx
// In FloatingLanguageSwitcher.tsx
const languages = [
  // ... existing languages
  { code: 'new_code', name: 'Language Name', flag: '🇺🇸' },
];
```

## 📝 Adding New Translation Keys

1. **Add to English file first**:
```json
// In src/i18n/locales/en.json
{
  "new_section": {
    "new_key": "English text"
  }
}
```

2. **Add to all other language files**:
```json
// In src/i18n/locales/hi.json
{
  "new_section": {
    "new_key": "हिंदी पाठ"
  }
}
```

3. **Use in components**:
```tsx
{t('new_section.new_key')}
```

## 🚨 Best Practices

1. **Always provide English fallback**:
```tsx
{t('key', 'English fallback')}
```

2. **Use descriptive key names**:
```tsx
// Good
t('dashboard.stats.total_points')

// Avoid
t('dash.stat1')
```

3. **Group related translations**:
```json
{
  "dashboard": {
    "stats": { /* all stats */ },
    "cards": { /* all cards */ }
  }
}
```

4. **Keep translations consistent**:
- Use same terminology across the app
- Maintain consistent tone and style
- Follow language-specific conventions

## 🐛 Troubleshooting

### Common Issues

1. **Translation not showing**:
   - Check if key exists in translation file
   - Verify i18n is initialized in main.tsx
   - Check console for missing key warnings

2. **Language not switching**:
   - Verify language code is correct
   - Check if language file is imported
   - Clear localStorage and try again

3. **Styling issues**:
   - Check if CSS classes are applied correctly
   - Verify responsive design works
   - Test on different screen sizes

### Debug Mode

Enable debug mode in development:

```tsx
// In src/i18n/index.ts
i18n.init({
  // ... other config
  debug: process.env.NODE_ENV === 'development',
});
```

## 📱 Mobile Support

The translation system is fully responsive and works on:
- Mobile phones (iOS/Android)
- Tablets
- Desktop computers
- All modern browsers

## 🔄 Future Enhancements

Potential improvements for the translation system:

1. **RTL Support**: Right-to-left language support
2. **Pluralization**: Advanced plural forms handling
3. **Date/Number Formatting**: Locale-specific formatting
4. **Translation Management**: Admin panel for translations
5. **Auto-translation**: Integration with translation APIs
6. **Voice Support**: Text-to-speech in different languages

## 📞 Support

For issues or questions about the translation system:
1. Check this documentation first
2. Review the code examples
3. Test with different languages
4. Check browser console for errors

---

**Note**: This translation system is designed to be maintainable and scalable. Always test translations with native speakers when possible and keep the translation files updated as the application evolves.
