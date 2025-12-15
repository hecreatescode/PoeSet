import React from 'react';
 import { BarChart3, Tag, Hash, CalendarDays, Clock, TrendingUp, TrendingDown, ListOrdered, Award } from 'lucide-react';
import { getPoems } from '../../utils/storage';
import { useLanguage } from '../../i18n/useLanguage';

const StatisticsScreen: React.FC = () => {
  const { t } = useLanguage();
  const poems = getPoems();


  // Word frequency analysis
  const getWordFrequency = () => {
    const words: Record<string, number> = {};
    poems.forEach(poem => {
      const text = `${poem.title} ${poem.content}`.toLowerCase();
      const wordsArray = text.match(/[a-ząćęłńóśźż]+/g) || [];
      wordsArray.forEach(word => {
        words[word] = (words[word] || 0) + 1;
      });
    });
    
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  };
  
  const wordFrequency = getWordFrequency();


  // Najdłuższy i najkrótszy wiersz
  const sortedByLength = [...poems].sort((a, b) => b.content.length - a.content.length);
  const longestPoem = sortedByLength[0];
  const shortestPoem = sortedByLength[sortedByLength.length - 1];

  // Liczba dni z aktywnością i najdłuższa seria dni z rzędu
  const daysSet = new Set<string>();
  poems.forEach(poem => {
    const d = new Date(poem.createdAt);
    daysSet.add(d.toISOString().slice(0, 10));
  });
  const days = Array.from(daysSet).sort();
  let maxStreak = 0, currentStreak = 0;
  let prevDate: Date | null = null;
  days.forEach(dateStr => {
    const date = new Date(dateStr);
    if (prevDate) {
      const diff = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    prevDate = date;
  });

  // Statystyki do karuzeli
  const statCards = [
    {
      icon: <Hash size={32} />, label: 'Ilość wierszy', value: poems.length, valueStyle: { fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: 1 }
    },
    {
      icon: <Tag size={32} />, label: 'Średnia długość', value: poems.length > 0 ? Math.round(poems.reduce((acc, p) => acc + p.content.length, 0) / poems.length) + ' znaków' : '0 znaków', valueStyle: { fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: 1 }
    },
    {
      icon: <TrendingUp size={32} />, label: 'Najdłuższy wiersz', value: longestPoem ? (<><span style={{ fontWeight: 700 }}>{longestPoem.title}</span><br />({longestPoem.content.length} znaków)</>) : '-', valueStyle: { fontSize: '1.18rem', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: 1, textAlign: 'center' as const }
    },
    {
      icon: <TrendingDown size={32} />, label: 'Najkrótszy wiersz', value: shortestPoem ? (<><span style={{ fontWeight: 700 }}>{shortestPoem.title}</span><br />({shortestPoem.content.length} znaków)</>) : '-', valueStyle: { fontSize: '1.18rem', fontWeight: 700, color: 'var(--accent-color)', letterSpacing: 1, textAlign: 'center' as const }
    },
    {
      icon: <CalendarDays size={32} />, label: 'Dni z aktywnością', value: days.length, valueStyle: { fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: 1 }
    },
    {
      icon: <Award size={32} />, label: 'Najdłuższa seria dni', value: maxStreak, valueStyle: { fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: 1 }
    },
    {
      icon: <Clock size={32} />, label: 'Najczęściej produktywna godzina', value: (() => {
        const hours: Record<string, number> = {};
        poems.forEach(poem => {
          const d = new Date(poem.createdAt);
          const h = d.getHours();
          hours[h] = (hours[h] || 0) + 1;
        });
        const max = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
        return max ? `${max[0]}:00` : '-';
      })(), valueStyle: { fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: 1 }
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-md)' }}>
      <header className="mb-xl" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.statistics.title}
        </h1>
        <p className="text-secondary" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>{t.statistics.subtitle}</p>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Statystyki ogólne */}
        <section>
          <h2 style={{ fontWeight: 600, fontSize: '1.35rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12, letterSpacing: 0.5 }}>
            <ListOrdered size={28} /> Statystyki ogólne
          </h2>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '2.2rem',
              marginBottom: '2.5rem',
              paddingBottom: '0.5rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              minHeight: 180,
            }}>
            {statCards.map(card => (
              <div
                key={card.label}
                style={{
                  minWidth: 210,
                  background: 'linear-gradient(120deg, var(--bg-secondary) 60%, var(--accent-color) 180%)',
                  borderRadius: 22,
                  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
                  padding: '2.1rem 1.2rem 1.2rem 1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  transition: 'transform 0.18s cubic-bezier(.4,1.6,.6,1)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.045)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ zIndex: 2, marginBottom: 18, color: 'var(--accent-color)', textShadow: 'none' }}>{card.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'center', letterSpacing: 0.5 }}>{card.label}</div>
                <div style={{ ...card.valueStyle, marginTop: 0, textAlign: 'center', color: 'var(--accent-color)', textShadow: '0 1px 6px var(--bg-secondary), 0 0px 1px var(--accent-color)' }}>{card.value}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, var(--accent-color) 30%, transparent 100%)', opacity: 0.13, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 }} />
              </div>
            ))}
          </div>
        </section>

        {/* Najczęściej używane słowa */}
        <section>
          <h2 style={{ fontWeight: 500, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} /> Najczęściej używane słowa
          </h2>
          <div className="card" style={{ cursor: 'default', padding: '2rem 1rem 2rem 1rem', minHeight: 320 }}>
            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '1rem', maxWidth: '100%' }}>
              {wordFrequency.length > 0 ? (
                <svg width="100%" height={wordFrequency.length * 36 + 40} viewBox={`0 0 600 ${wordFrequency.length * 36 + 40}`}>
                  {wordFrequency.map((item, idx) => {
                    const barWidth = (item.count / wordFrequency[0].count) * 400;
                    const color = getComputedStyle(document.body).getPropertyValue('--accent-color') || '#2196f3';
                    return (
                      <g key={item.word}>
                        <text
                          x={0}
                          y={40 + idx * 36 + 18}
                          textAnchor="start"
                          fontSize="15"
                          fill="var(--text-primary)"
                          style={{ fontFamily: 'inherit', fontWeight: 500 }}
                        >
                          {item.word}
                        </text>
                        <rect
                          x={120}
                          y={40 + idx * 36}
                          width={barWidth}
                          height={24}
                          fill={color.trim()}
                          rx={6}
                          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }}
                        />
                        <text
                          x={130 + barWidth}
                          y={40 + idx * 36 + 18}
                          textAnchor="start"
                          fontSize="14"
                          fill="var(--text-secondary)"
                          style={{ fontFamily: 'inherit', fontWeight: 600 }}
                        >
                          {item.count}
                        </text>
                      </g>
                    );
                  })}
                  {/* Oś X */}
                  <line x1={120} y1={20} x2={120} y2={wordFrequency.length * 36 + 30} stroke="#ccc" strokeWidth={1} />
                </svg>
              ) : (
                <svg width="100%" height="120" viewBox="0 0 600 120">
                  <text x="50%" y="60" textAnchor="middle" fontSize="16" fill="var(--text-secondary)" style={{ fontStyle: 'italic' }}>
                    Brak słów do wyświetlenia (dodaj dłuższy wiersz).
                  </text>
                </svg>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StatisticsScreen;
