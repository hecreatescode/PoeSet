// Funkcje do obliczania statystyk
import type { Poem, Statistics } from '../types';
import { startOfWeek, startOfMonth, parseISO, differenceInDays, getDay, getHours } from 'date-fns';

export const calculateStatistics = (poems: Poem[]): Statistics => {
  if (poems.length === 0) {
    return {
      totalPoems: 0,
      poemsThisWeek: 0,
      poemsThisMonth: 0,
      averageLength: 0,
      mostUsedTags: [],
      writingStreak: 0,
      mostProductiveDay: 'Brak danych',
      mostProductiveHour: 0,
    };
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  // Poems this week/month
  const poemsThisWeek = poems.filter(p => parseISO(p.date) >= weekStart).length;
  const poemsThisMonth = poems.filter(p => parseISO(p.date) >= monthStart).length;

  // Average length
  const totalLength = poems.reduce((sum, p) => sum + p.content.length, 0);
  const averageLength = Math.round(totalLength / poems.length);

  // Most used tags
  const tagCounts: Record<string, number> = {};
  poems.forEach(p => {
    p.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const mostUsedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Writing streak
  const sortedDates = poems
    .map(p => p.date.split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse();
  
  let streak = 0;
  const today = now.toISOString().split('T')[0];
  
  if (sortedDates.length > 0) {
    let currentDate = new Date(today);
    for (const dateStr of sortedDates) {
      const poemDate = new Date(dateStr);
      const daysDiff = differenceInDays(currentDate, poemDate);
      
      if (daysDiff === 0 || daysDiff === 1) {
        streak++;
        currentDate = poemDate;
      } else {
        break;
      }
    }
  }

  // Most productive day of week
  const dayCounts: Record<number, number> = {};
  poems.forEach(p => {
    const day = getDay(parseISO(p.date));
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const mostProductiveDayNum = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const mostProductiveDay = mostProductiveDayNum ? dayNames[parseInt(mostProductiveDayNum)] : 'Brak danych';

  // Most productive hour
  const hourCounts: Record<number, number> = {};
  poems.forEach(p => {
    const hour = getHours(parseISO(p.createdAt || p.date));
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const mostProductiveHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] 
    ? parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
    : 0;

  return {
    totalPoems: poems.length,
    poemsThisWeek,
    poemsThisMonth,
    averageLength,
    mostUsedTags,
    writingStreak: streak,
    mostProductiveDay,
    mostProductiveHour,
  };
};
