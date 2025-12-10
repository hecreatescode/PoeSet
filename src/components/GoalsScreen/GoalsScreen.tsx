import React, { useState, useCallback } from 'react';
import { Plus, Target, Trophy, CheckCircle2, Circle } from 'lucide-react';
import type { Goal, Achievement } from '../../types';
import { getGoals, saveGoal, deleteGoal, getAchievements, saveAchievement, getPoems } from '../../utils/storage';
import { useLanguage } from '../../i18n/useLanguage';
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
import { pl } from 'date-fns/locale';

const GoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'goals' | 'achievements'>('goals');
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalType, setNewGoalType] = useState<Goal['type']>('weekly');
  const [newGoalTarget, setNewGoalTarget] = useState('7');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const { t } = useLanguage();

  const loadGoals = useCallback(() => {
    const allGoals = getGoals();
    // Update progress for each goal
    const poems = getPoems();
    const now = new Date();
    
    const updatedGoals = allGoals.map(goal => {
      let periodPoems = 0;
      const startDate = new Date(goal.startDate);
      
      switch (goal.type) {
        case 'daily':
          periodPoems = poems.filter(p => 
            format(new Date(p.date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
          ).length;
          break;
        case 'weekly': {
          const weekStart = startOfWeek(now, { locale: pl });
          const weekEnd = endOfWeek(now, { locale: pl });
          periodPoems = poems.filter(p => {
            const poemDate = new Date(p.date);
            return poemDate >= weekStart && poemDate <= weekEnd;
          }).length;
          break;
        }
        case 'monthly': {
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          periodPoems = poems.filter(p => {
            const poemDate = new Date(p.date);
            return poemDate >= monthStart && poemDate <= monthEnd;
          }).length;
          break;
        }
        case 'custom': {
          const endDate = goal.endDate ? new Date(goal.endDate) : now;
          periodPoems = poems.filter(p => {
            const poemDate = new Date(p.date);
            return poemDate >= startDate && poemDate <= endDate;
          }).length;
          break;
        }
      }
      
      return { ...goal, current: periodPoems };
    });
    
    setGoals(updatedGoals);
  }, []);

  const loadAchievements = useCallback(() => {
    const allAchievements = getAchievements();
    
    // Initialize default achievements if none exist
    if (allAchievements.length === 0) {
      const defaultAchievements: Achievement[] = [
        {
          id: 'first_poem',
          title: t.achievements.firstPoem,
          description: t.achievements.firstPoemDesc,
          icon: '✒️',
          progress: 0,
          maxProgress: 1,
        },
        {
          id: 'streak_7',
          title: t.achievements.streak7,
          description: t.achievements.streak7Desc,
          icon: '🔥',
          progress: 0,
          maxProgress: 7,
        },
        {
          id: 'poems_50',
          title: t.achievements.poems50,
          description: t.achievements.poems50Desc,
          icon: '📚',
          progress: 0,
          maxProgress: 50,
        },
        {
          id: 'poems_100',
          title: t.achievements.poems100,
          description: t.achievements.poems100Desc,
          icon: '🏆',
          progress: 0,
          maxProgress: 100,
        },
      ];
      
      defaultAchievements.forEach(a => saveAchievement(a));
    }
    
    // Update progress
    const poems = getPoems();
    const updatedAchievements = allAchievements.map(achievement => {
      let progress = achievement.progress;
      
      if (achievement.id === 'first_poem' && poems.length > 0) {
        progress = 1;
      } else if (achievement.id === 'poems_50') {
        progress = Math.min(poems.length, 50);
      } else if (achievement.id === 'poems_100') {
        progress = Math.min(poems.length, 100);
      }
      
      const unlocked = progress >= achievement.maxProgress;
      return {
        ...achievement,
        progress,
        unlockedAt: unlocked && !achievement.unlockedAt ? new Date().toISOString() : achievement.unlockedAt,
      };
    });
    
    setAchievements(updatedAchievements);
  }, [t]);

  React.useEffect(() => {
    loadGoals();
    loadAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim() || !newGoalTarget) return;
    
    const now = new Date().toISOString();
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      type: newGoalType,
      target: parseInt(newGoalTarget),
      current: 0,
      startDate: now,
      title: newGoalTitle.trim(),
    };
    
    saveGoal(newGoal);
    loadGoals();
    setShowNewGoal(false);
    setNewGoalTitle('');
    setNewGoalTarget('7');
    setNewGoalType('weekly');
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
    loadGoals();
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 300 }}>
          {t.goals.title}
        </h1>
        <p className="text-secondary">{t.goals.subtitle}</p>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        marginBottom: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <button
          className={`button ${activeTab === 'goals' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('goals')}
          style={{ 
            borderRadius: '0.5rem 0.5rem 0 0',
            borderBottom: 'none',
          }}
        >
          <Target size={18} />
          {t.goals.title}
        </button>
        <button
          className={`button ${activeTab === 'achievements' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setActiveTab('achievements')}
          style={{ 
            borderRadius: '0.5rem 0.5rem 0 0',
            borderBottom: 'none',
          }}
        >
          <Trophy size={18} />
          {t.achievements.title}
        </button>
      </div>

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <button
            className="button button-primary"
            onClick={() => setShowNewGoal(!showNewGoal)}
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            <Plus size={20} />
            {t.goals.newGoal}
          </button>

          {/* New Goal Form */}
          {showNewGoal && (
            <div style={{
              padding: 'var(--spacing-md)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              marginBottom: 'var(--spacing-md)',
              background: 'var(--bg-secondary)',
            }}>
              <input
                type="text"
                className="input"
                placeholder={t.goals.title}
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                style={{ marginBottom: 'var(--spacing-sm)' }}
              />
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                <select
                  className="input"
                  value={newGoalType}
                  onChange={(e) => setNewGoalType(e.target.value as Goal['type'])}
                >
                  <option value="daily">{t.goals.daily}</option>
                  <option value="weekly">{t.goals.weekly}</option>
                  <option value="monthly">{t.goals.monthly}</option>
                  <option value="custom">{t.goals.custom}</option>
                </select>
                
                <input
                  type="number"
                  className="input"
                  placeholder={t.goals.target}
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  min="1"
                />
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                  className="button button-primary"
                  onClick={handleCreateGoal}
                  style={{ flex: 1 }}
                >
                  {t.common.save}
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => setShowNewGoal(false)}
                  style={{ flex: 1 }}
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Goals List */}
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p className="text-secondary">{t.goals.noGoals}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {goals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                const completed = goal.current >= goal.target;
                
                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: 'var(--spacing-md)',
                      border: `2px solid ${completed ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: '0.5rem',
                      background: completed ? 'var(--bg-secondary)' : 'transparent',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--spacing-sm)',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {completed ? <CheckCircle2 size={20} color="var(--primary)" /> : <Circle size={20} />}
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                            {goal.title}
                          </h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
                          {t.goals[goal.type]} • {goal.current}/{goal.target} {t.poems.count}
                        </p>
                      </div>
                      <button
                        className="button button-secondary"
                        onClick={() => handleDeleteGoal(goal.id)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        {t.common.delete}
                      </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--border-color)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        background: completed ? 'var(--primary)' : 'var(--text-secondary)',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
        }}>
          {achievements.map(achievement => {
            const unlocked = achievement.progress >= achievement.maxProgress;
            
            return (
              <div
                key={achievement.id}
                style={{
                  padding: 'var(--spacing-md)',
                  border: `2px solid ${unlocked ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '0.5rem',
                  background: unlocked ? 'var(--bg-secondary)' : 'transparent',
                  opacity: unlocked ? 1 : 0.6,
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  textAlign: 'center',
                  marginBottom: 'var(--spacing-sm)',
                  filter: unlocked ? 'none' : 'grayscale(100%)',
                }}>
                  {achievement.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 500,
                  textAlign: 'center',
                  marginBottom: '0.25rem',
                }}>
                  {achievement.title}
                </h3>
                
                <p style={{
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  textAlign: 'center',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  {achievement.description}
                </p>
                
                {/* Progress */}
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--border-color)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    height: '100%',
                    background: unlocked ? 'var(--primary)' : 'var(--text-secondary)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                
                {unlocked && achievement.unlockedAt && (
                  <p style={{
                    fontSize: '0.625rem',
                    opacity: 0.5,
                    textAlign: 'center',
                    marginTop: '0.5rem',
                  }}>
                    {t.achievements.unlocked} {format(new Date(achievement.unlockedAt), 'd MMM yyyy', { locale: pl })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsScreen;
