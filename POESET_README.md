# 📱 PoeSet - Dziennik Poety

**PoeSet** to elegancka, minimalistyczna aplikacja webowa do pisania, organizowania i analizowania poezji. Inspirowana estetyką vintage i duchem Edgara Allana Poe.

![PoeSet](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

## ✨ Funkcje

### 📖 Dziennik dnia
- Automatyczne dzienniki dzienne przy dodaniu pierwszego wiersza
- Szybki dostęp do wierszy napisanych dzisiaj
- Prosty, elegancki interfejs do pisania

### 📝 Biblioteka wierszy
- Pełna biblioteka wszystkich wierszy
- Zaawansowane wyszukiwanie i filtrowanie
- Sortowanie (najnowsze, najstarsze, alfabetyczne)
- Elegancki widok pełnoekranowy dla każdego wiersza

### 📚 Zbiory (Tomiki)
- Tworzenie tematycznych kolekcji wierszy
- Kolorowe oznaczenia zbiorów
- Eksport zbiorów do plików TXT
- Statystyki dla każdego zbioru

### 📊 Statystyki
- Liczba wszystkich wierszy
- Serie pisania (streaks)
- Wiersze w tym tygodniu/miesiącu
- Najbardziej twórczy dzień tygodnia
- Najbardziej twórcza godzina
- Średnia długość wiersza
- Najczęściej używane tagi

### ⚙️ Ustawienia
- **3 motywy**: Light (papierowy), Dark (atramentowy), Sepia (dziennik)
- **Typografia**: Wybór między Serif i Sans-serif
- **Odstępy**: Kompaktowe, Normalne, Przestronne
- **Widok startowy**: Dziennik lub Biblioteka
- **Backup**: Eksport/Import wszystkich danych

## 🚀 Instalacja i uruchomienie

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Instalacja zależności
```bash
npm install
```

### Uruchomienie deweloperskie
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: `http://localhost:5173/`

### Build produkcyjny
```bash
npm run build
```

### Podgląd buildu produkcyjnego
```bash
npm run preview
```

## 🎨 Technologie

- **React 19** - Biblioteka UI
- **TypeScript** - Bezpieczeństwo typów
- **Vite** - Szybki bundler
- **date-fns** - Zarządzanie datami
- **lucide-react** - Eleganckie ikony
- **localStorage** - Lokalne przechowywanie danych

## 📁 Struktura projektu

```
src/
├── components/           # Komponenty React
│   ├── JournalScreen/   # Ekran dziennika
│   ├── PoemsScreen/     # Biblioteka wierszy
│   ├── CollectionsScreen/ # Zbiory
│   ├── StatisticsScreen/ # Statystyki
│   ├── SettingsScreen/  # Ustawienia
│   ├── PoemEditor/      # Edytor wierszy
│   ├── PoemViewer/      # Widok wiersza
│   ├── CollectionEditor/ # Edytor zbiorów
│   └── CollectionViewer/ # Widok zbioru
├── types/               # Definicje TypeScript
├── utils/               # Funkcje pomocnicze
│   ├── storage.ts       # System przechowywania
│   └── statistics.ts    # Obliczanie statystyk
├── App.tsx              # Główny komponent
└── main.tsx             # Punkt wejścia
```

## 🎯 Użytkowanie

### Pisanie wiersza
1. Kliknij "Dodaj wiersz" w ekranie Dziennika
2. Wpisz tytuł (opcjonalnie) i treść wiersza
3. Dodaj tagi dla lepszej organizacji
4. Zmień datę jeśli potrzeba
5. Zapisz

### Organizacja w zbiory
1. Przejdź do ekranu "Zbiory"
2. Kliknij "Nowy zbiór"
3. Nadaj nazwę i opis
4. Wybierz kolor
5. Zaznacz wiersze do dodania
6. Zapisz

### Eksport danych
1. Przejdź do "Ustawienia"
2. Kliknij "Eksportuj dane"
3. Zapisz plik JSON
4. Możesz zaimportować go później używając "Importuj dane"

## 🎨 Motywy

### Light (Papierowy)
Kremowa biel z czarnym liternictwem - czysty, klasyczny wygląd arkusza papieru.

### Dark (Atramentowy)
Głęboki granat/czerń z delikatnymi złamanymi bielami - elegancja nocnego pisania.

### Sepia (Dziennik Poety)
Ciepła tonacja brązu - nostalgiczny klimat starego dziennika.

## 📝 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

## 🤝 Wkład

Zgłaszaj błędy i propozycje przez GitHub Issues.

## 💡 Przyszłe funkcje (roadmap)

- [ ] Analiza stylu poetyckiego przez AI
- [ ] Tryb "Poe Sessions" - sesje pisania z timerem
- [ ] Generowanie PDF z profesjonalnym layoutem
- [ ] Synchronizacja w chmurze
- [ ] Wersja mobilna (PWA)
- [ ] Eksport do różnych formatów (PDF, EPUB)

---

**PoeSet** - Twój cyfrowy dom dla poezji 🖋️
