# 📱 PoeSet - Dziennik Poety

**PoeSet** to elegancka, minimalistyczna aplikacja webowa do pisania, organizowania i analizowania poezji. Inspirowana estetyką vintage i duchem Edgara Allana Poe.

![PoeSet](https://img.shields.io/badge/version-2.0.1-blue)
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
- **NOWE w 2.0.0**: Analiza częstotliwości słów (top 20 najczęściej używanych)

### 📝 Edytor wierszy
- Auto-zapis co 3 sekundy
- **NOWE w 2.0.0**: Dyktowanie głosowe (speech-to-text)
- **NOWE v2.0.0**: Pasek formatowania tekstu (pogrubienie, kursywa, podkreślenie)
- Markdown preview z podglądem na żywo
- Historia wersji (do 10 ostatnich wersji)
- Szyfrowanie wierszy hasłem (AES-GCM-256)
- Śledzenie nastroju
- **NOWE v2.0.0**: Niestandardowe nastroje (dodaj własne)
- Automatyczne sugestie tagów
- Duplikacja wierszy

### 📋 Szablony
- **NOWE v2.0.0**: Pełny ekran zarządzania szablonami
- Domyślne szablony: Sonet, Haiku, Limerick
- **NOWE v2.0.0**: Tworzenie własnych szablonów
- Edycja i usuwanie niestandardowych szablonów
- Przykłady użycia dla każdego szablonu

### 📦 Operacje grupowe
- **NOWE v2.0.0**: Tryb zaznaczania wielu wierszy
- **NOWE v2.0.0**: Usuwanie wielu wierszy naraz
- **NOWE v2.0.0**: Dodawanie wielu wierszy do kolekcji jednocześnie
- Zaznacz wszystkie z filtrem

### 🎯 Cele i osiągnięcia
- System celów (dzienny, tygodniowy, miesięczny, niestandardowy)
- Automatyczne śledzenie postępów
- 4 domyślne osiągnięcia do odblokowania
- Paski postępu z wizualizacją

### ⚙️ Ustawienia
- **7 motywów**: Light, Dark, Sepia, Midnight, Forest, Ocean (jasny niebieski), Rose (różowy)
- **NOWE v2.0.0**: Custom Google Fonts - dodaj czcionki z Google Fonts
- **Typografia**: Wybór między Serif i Sans-serif + niestandardowe czcionki
- **Rozmiary czcionek**: Small, Medium, Large, Extra Large
- **Odstępy**: Kompaktowe, Normalne, Przestronne
- **NOWE v2.0.0**: Szerokość layoutu - narrow, medium, wide, full
- **Widok startowy**: Dziennik lub Biblioteka
- **NOWE v2.0.0**: Gesty swipe - nawigacja między ekranami przesuwaniem
- **Backup**: Eksport/Import wszystkich danych, auto-backup co 5-120 min
- **NOWE v2.0.0**: File System API - zapis bezpośrednio na dysku (opcjonalne)
- **NOWE v2.0.0**: PWA - instalacja jako aplikacja, offline support

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

### Midnight (Północny)
Ciemny niebieski - spokój nocnego nieba pełnego gwiazd.

### Forest (Leśny)
Ciemna zieleń - inspiracja przyrodą i naturą.

### Ocean (Oceaniczny) - **NOWE v2.0.0**
Jasny niebieski (#e8f4ff) - spokojna, czysta tonacja jak błękitne morze.

### Rose (Różany) - **NOWE v2.0.0**
Delikatny różowy (#ffe8f0) - miękka, romantyczna tonacja idealna dla poezji uczuć.

## 📝 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

## 🤝 Wkład

Zgłaszaj błędy i propozycje przez GitHub Issues.

## 📋 Wersja 2.0.1 - Co nowego?

### Nowe w 2.0.1:
- **🎨 Motywy dla wierszy** - Przypisz indywidualny motyw do każdego wiersza
- **📷 Udostępnianie PNG** - Eksportuj wiersze jako obrazy do social media
- **🖼️ Logo w nagłówku** - Logo z automatycznym dopasowaniem kolorów do motywu
- **😊 Nastroje w edytorze** - Dodawaj własne nastroje podczas edycji wiersza
- **♿ Poprawiony wysoki kontrast** - Mocniejszy kontrast czarno-biały dla każdego motywu
- **🎨 Kolorowe pola formularzy** - Checkboxy i suwaki w kolorze motywu
- **📏 Ulepszone suwaki** - Szerokość układu i rozmiar czcionki z wyświetlaniem wartości
- **💾 Nowy wygląd backupu** - Przeprojektowana sekcja ustawień kopii zapasowej
- **👆 Poprawione gesty** - Nawigacja swipe ignoruje elementy interaktywne
- **🌍 Brakujące tłumaczenia** - Uzupełnione tłumaczenia PL/EN

### Główne funkcje v2.0.0:
1. **🎨 Nowe motywy** - Ocean (jasny niebieski) i Rose (różowy) z lepszym kontrastem
2. **🔤 Custom Google Fonts** - Dodaj, wybieraj i używaj czcionek z Google Fonts
3. **👆 Gesty swipe** - Przesuwaj palcem między ekranami na urządzeniach mobilnych
4. **📁 File System API** - Opcja zapisu danych bezpośrednio na dysku urządzenia
5. **📱 Ulepszone PWA** - Install prompt, service worker z offline caching
6. **📏 Kontrola szerokości** - 4 opcje szerokości layoutu (narrow/medium/wide/full)
7. **✨ Lepsze animacje** - Spinner, fadeIn, z obsługą reduced-motion
8. **📱 Responsive design** - Poprawione layouty dla małych ekranów mobile

### Poprzednie funkcje (v1.0.3):
- 🎤 Dyktowanie głosowe z Web Speech API
- 📋 Tworzenie własnych szablonów wierszy
- ☑️ Operacje grupowe na wielu wierszach
- 😊 Niestandardowe nastroje
- ✍️ Pasek formatowania tekstu
- 📊 Analiza częstotliwości słów (top 20)

### Naprawione błędy:
- Lepszy responsive na mobile (minmax 140px→110px)
- Działająca funkcjonalność szerokości layoutu
- Ocean i Rose zmienione na jasne warianty
- Lepszy kontrast przycisków we wszystkich motywach
- Optymalizacja wydajności

---

**PoeSet** - Twój cyfrowy dom dla poezji 🖋️
