import React from 'react';
import { BarChart3, Calendar, Clock, Tag } from 'lucide-react';
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-md)' }}>
      <header className="mb-xl" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.statistics.title}
        </h1>
        <p className="text-secondary" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>{t.statistics.subtitle}</p>
      </header>
      <div>
        {/* Word Frequency Chart */}
        {wordFrequency.length > 0 && (
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <BarChart3 size={20} />
              Najczęściej używane słowa
            </h3>
            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
              <svg width={Math.max(400, wordFrequency.length * 40)} height="220">
                {wordFrequency.map((item, idx) => {
                  const barHeight = (item.count / wordFrequency[0].count) * 160;
                  // Kolor motywu:
                  const color = getComputedStyle(document.body).getPropertyValue('--accent-color') || '#2196f3';
                  return (
                    <g key={item.word}>
                      <rect
                        x={30 + idx * 35}
                        y={180 - barHeight}
                        width="28"
                        height={barHeight}
                        fill={color.trim()}
                        rx="6"
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }}
                      />
                      <text
                        x={44 + idx * 35}
                        y={195}
                        textAnchor="middle"
                        fontSize="12"
                        fill="var(--text-secondary)"
                        style={{ fontFamily: 'inherit' }}
                      >
                        {item.word}
                      </text>
                      <text
                        x={44 + idx * 35}
                        y={180 - barHeight - 8}
                        textAnchor="middle"
                        fontSize="12"
                        fill="var(--text-primary)"
                        style={{ fontWeight: 600, fontFamily: 'inherit' }}
                      >
                        {item.count}
                      </text>
                    </g>
                  );
                })}
                {/* Oś Y */}
                <line x1="20" y1="0" x2="20" y2="180" stroke="#ccc" strokeWidth="1" />
                <line x1="20" y1="180" x2={Math.max(400, wordFrequency.length * 40)} y2="180" stroke="#ccc" strokeWidth="1" />
              </svg>
            </div>
          </div>
        )}
        {/* ...usunięto duplikat najczęściej używane słowa... */}
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
    </div>
  );
}

export default StatisticsScreen;
