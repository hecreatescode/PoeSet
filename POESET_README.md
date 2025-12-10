# 📱 PoeSet - Dziennik Poety

**PoeSet** to elegancka, minimalistyczna aplikacja webowa do pisania, organizowania i analizowania poezji. Inspirowana estetyką vintage i duchem Edgara Allana Poe.

![PoeSet](https://img.shields.io/badge/version-1.0.3-blue)
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
- **NOWE w 1.0.3**: Analiza częstotliwości słów (top 20 najczęściej używanych)

### 📝 Edytor wierszy
- Auto-zapis co 3 sekundy
- **NOWE w 1.0.3**: Dyktowanie głosowe (speech-to-text)
- **NOWE v1.0.3**: Pasek formatowania tekstu (pogrubienie, kursywa, podkreślenie)
- Markdown preview z podglądem na żywo
- Historia wersji (do 10 ostatnich wersji)
- Szyfrowanie wierszy hasłem (AES-GCM-256)
- Śledzenie nastroju
- **NOWE v1.0.3**: Niestandardowe nastroje (dodaj własne)
- Automatyczne sugestie tagów
- Duplikacja wierszy

### 📋 Szablony
- **NOWE v1.0.3**: Pełny ekran zarządzania szablonami
- Domyślne szablony: Sonet, Haiku, Limerick
- **NOWE v1.0.3**: Tworzenie własnych szablonów
- Edycja i usuwanie niestandardowych szablonów
- Przykłady użycia dla każdego szablonu

### 📦 Operacje grupowe
- **NOWE v1.0.3**: Tryb zaznaczania wielu wierszy
- **NOWE v1.0.3**: Usuwanie wielu wierszy naraz
- **NOWE v1.0.3**: Dodawanie wielu wierszy do kolekcji jednocześnie
- Zaznacz wszystkie z filtrem

### 🎯 Cele i osiągnięcia
- System celów (dzienny, tygodniowy, miesięczny, niestandardowy)
- Automatyczne śledzenie postępów
- 4 domyślne osiągnięcia do odblokowania
- Paski postępu z wizualizacją

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

## 📋 Wersja 1.0.3 - Co nowego?

### Główne funkcje:
1. **🎤 Dyktowanie głosowe** - Piszesz wiersze głosem dzięki Web Speech API
2. **📋 Szablony niestandardowe** - Twórz własne szablony wierszy z pełną kontrolą
3. **☑️ Operacje grupowe** - Zaznaczaj i zarządzaj wieloma wierszami naraz
4. **😊 Własne nastroje** - Dodaj niestandardowe nastroje oprócz 8 domyślnych
5. **✍️ Formatowanie tekstu** - Pogrubiaj, kursywuj, podkreślaj tekst w edytorze
6. **📊 Analiza słów** - Zobacz 20 najczęściej używanych słów w swojej poezji

### Naprawione błędy:
- Poprawiona obsługa React Compiler
- Naprawione błędy TypeScript
- Lepsza obsługa błędów w rozpoznawaniu mowy
- Optymalizacja wydajności

---

**PoeSet** - Twój cyfrowy dom dla poezji 🖋️
