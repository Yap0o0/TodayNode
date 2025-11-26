import { useState, useEffect } from 'react';
import { MoodLogger } from './components/MoodLogger';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { ThemeCustomizer, MoodColors } from './components/ThemeCustomizer';
import { Calendar, BarChart3, PlusCircle, Palette } from 'lucide-react';
import { Button } from './components/ui/button';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  mood: '행복' | '신남' | '편안' | '그저' | '우울' | '화남';
  intensity?: 'HOT' | 'WARM' | 'COOL';
  tags: string[];
  note?: string;
}

type ViewMode = 'logger' | 'calendar' | 'stats' | 'theme';

const DEFAULT_MOOD_COLORS: MoodColors = {
  '행복': { calendar: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200', chart: 'bg-yellow-400' },
  '신남': { calendar: 'bg-orange-100 border-orange-400 hover:bg-orange-200', chart: 'bg-orange-400' },
  '편안': { calendar: 'bg-green-100 border-green-400 hover:bg-green-200', chart: 'bg-green-400' },
  '그저': { calendar: 'bg-gray-100 border-gray-400 hover:bg-gray-200', chart: 'bg-gray-400' },
  '우울': { calendar: 'bg-blue-100 border-blue-400 hover:bg-blue-200', chart: 'bg-blue-400' },
  '화남': { calendar: 'bg-red-100 border-red-400 hover:bg-red-200', chart: 'bg-red-400' },
};

export default function App() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('logger');
  const [moodColors, setMoodColors] = useState<MoodColors>(DEFAULT_MOOD_COLORS);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('moodEntries');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored entries', e);
      }
    }
  }, []);

  // Load theme colors from localStorage
  useEffect(() => {
    const storedColors = localStorage.getItem('moodColors');
    if (storedColors) {
      try {
        setMoodColors(JSON.parse(storedColors));
      } catch (e) {
        console.error('Failed to parse stored colors', e);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('moodEntries', JSON.stringify(entries));
    }
  }, [entries]);

  // Save theme colors to localStorage
  useEffect(() => {
    localStorage.setItem('moodColors', JSON.stringify(moodColors));
  }, [moodColors]);

  const addEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const handleColorChange = (mood: MoodEntry['mood'], colorClass: string, chartColor: string) => {
    setMoodColors(prev => ({ ...prev, [mood]: { calendar: colorClass, chart: chartColor } }));
  };

  const handleResetColors = () => {
    setMoodColors(DEFAULT_MOOD_COLORS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-center text-purple-900">하루 노드</h1>
          <p className="text-center text-purple-600 text-sm mt-1">
            오늘의 기분을 기록하세요
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 justify-center flex-wrap">
          <Button
            variant={viewMode === 'logger' ? 'default' : 'ghost'}
            onClick={() => setViewMode('logger')}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            기록하기
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setViewMode('calendar')}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            캘린더
          </Button>
          <Button
            variant={viewMode === 'stats' ? 'default' : 'ghost'}
            onClick={() => setViewMode('stats')}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            통계
          </Button>
          <Button
            variant={viewMode === 'theme' ? 'default' : 'ghost'}
            onClick={() => setViewMode('theme')}
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            테마
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {viewMode === 'logger' && <MoodLogger onAddEntry={addEntry} moodColors={moodColors} />}
        {viewMode === 'calendar' && <CalendarView entries={entries} moodColors={moodColors} />}
        {viewMode === 'stats' && <StatsView entries={entries} moodColors={moodColors} />}
        {viewMode === 'theme' && (
          <ThemeCustomizer
            moodColors={moodColors}
            onColorChange={handleColorChange}
            onReset={handleResetColors}
          />
        )}
      </main>
    </div>
  );
}