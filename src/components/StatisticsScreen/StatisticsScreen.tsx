import React from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Tag } from 'lucide-react';
import { getPoems } from '../../utils/storage';
import { calculateStatistics } from '../../utils/statistics';

const StatisticsScreen: React.FC = () => {
  const poems = getPoems();
  const stats = calculateStatistics(poems);

  return (
    <div>
      <header className="mb-xl">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          Statystyki
        </h1>
        <p className="text-secondary">Analityka Twojej twórczości</p>
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
            Wszystkich wierszy
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <TrendingUp size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.writingStreak}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Seria dni
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <Calendar size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.poemsThisWeek}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            W tym tygodniu
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', cursor: 'default' }}>
          <Clock size={32} style={{ margin: '0 auto var(--spacing-sm)', opacity: 0.6 }} />
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: 'var(--spacing-xs)' }}>
            {stats.poemsThisMonth}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            W tym miesiącu
          </p>
        </div>
      </div>

      {/* Detailed stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Most productive day */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Calendar size={20} />
            Najbardziej twórczy dzień
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.mostProductiveDay}
          </p>
        </div>

        {/* Most productive hour */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Clock size={20} />
            Najbardziej twórcza godzina
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.mostProductiveHour}:00 - {stats.mostProductiveHour + 1}:00
          </p>
        </div>

        {/* Average length */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <BarChart3 size={20} />
            Średnia długość wiersza
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>
            {stats.averageLength} znaków
          </p>
        </div>

        {/* Most used tags */}
        {stats.mostUsedTags.length > 0 && (
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Tag size={20} />
              Najczęściej używane tagi
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
      </div>
    </div>
  );
};

export default StatisticsScreen;
