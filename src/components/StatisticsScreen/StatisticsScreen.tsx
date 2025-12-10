import React from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Tag } from 'lucide-react';
import { getPoems } from '../../utils/storage';
import { calculateStatistics } from '../../utils/statistics';
import { useLanguage } from '../../i18n/useLanguage';

const StatisticsScreen: React.FC = () => {
  const { t } = useLanguage();
  const poems = getPoems();
  const stats = calculateStatistics(poems);

  // Word frequency analysis
  const getWordFrequency = () => {
    const words: Record<string, number> = {};
    const stopWords = new Set(['i', 'a', 'w', 'z', 'na', 'do', 'po', 'o', 'to', 'się', 'że', 'nie', 'by', 'te', 'za', 'od', 'ze', 'przy', 'ale', 'lub', 'oraz', 'jest', 'są', 'jak', 'gdy', 'już', 'tylko', 'jeszcze', 'czyli', 'więc', 'może', 'czy', 'tam', 'tu', 'dla', 'przed', 'pod', 'przez']);
    
    poems.forEach(poem => {
      const text = `${poem.title} ${poem.content}`.toLowerCase();
      const wordsArray = text.match(/[a-ząćęłńóśźż]+/g) || [];
      
      wordsArray.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
          words[word] = (words[word] || 0) + 1;
        }
      });
    });
    
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  };
  
  const wordFrequency = getWordFrequency();

  return (
    <div>
      <header className="mb-xl">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.statistics.title}
        </h1>
        <p className="text-secondary">{t.statistics.subtitle}</p>
      </header>

      {/* Overview cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)',
      }}>
        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <BarChart3 size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.totalPoems}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t.statistics.totalPoems}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <TrendingUp size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.writingStreak}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t.statistics.currentStreak}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <Calendar size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.poemsThisWeek}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t.statistics.averagePerWeek}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <Clock size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.poemsThisMonth}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t.statistics.mostProductiveDay}
          </p>
        </div>
      </div>

      {/* Detailed stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Most productive day */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Calendar size={20} />
            {t.statistics.mostProductiveDay}
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.mostProductiveDay === 'Brak danych' ? t.statistics.noData : stats.mostProductiveDay}
          </p>
        </div>

        {/* Most productive hour */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Clock size={20} />
            {t.statistics.mostProductiveHour}
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.mostProductiveHour}:00 - {stats.mostProductiveHour + 1}:00
          </p>
        </div>

        {/* Average length */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <BarChart3 size={20} />
            {t.statistics.averageLength}
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.averageLength} {t.statistics.characters}
          </p>
        </div>

        {/* Most used tags */}
        {stats.mostUsedTags.length > 0 && (
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Tag size={20} />
              {t.statistics.popularTags}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {stats.mostUsedTags.map((item, index) => (
                <div key={item.tag} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 300,
                    minWidth: '2rem',
                    color: 'var(--light-text-secondary)',
                  }}>
                    {index + 1}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      height: '2rem',
                      background: 'var(--light-border)',
                      borderRadius: 'var(--radius-sm)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${(item.count / stats.mostUsedTags[0].count) * 100}%`,
                        background: 'var(--light-accent)',
                        transition: 'width var(--transition-normal)',
                      }} />
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: 'var(--spacing-md)',
                        transform: 'translateY(-50%)',
                        fontWeight: 500,
                        color: 'white',
                        mixBlendMode: 'difference',
                      }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 500, minWidth: '3rem', textAlign: 'right' }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Word Frequency */}
        {wordFrequency.length > 0 && (
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Tag size={20} />
              Najczęściej używane słowa
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {wordFrequency.map((item, index) => (
                <div key={item.word} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                }}>
                  <div style={{ flex: 1, position: 'relative', minHeight: '2rem' }}>
                    <div style={{
                      position: 'relative',
                      height: '2rem',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${(item.count / wordFrequency[0].count) * 100}%`,
                        background: `hsl(${200 - index * 5}, 70%, 50%)`,
                        transition: 'width var(--transition-normal)',
                      }} />
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: 'var(--spacing-md)',
                        transform: 'translateY(-50%)',
                        fontWeight: 500,
                        zIndex: 1,
                      }}>
                        {item.word}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 500, minWidth: '3rem', textAlign: 'right' }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsScreen;
