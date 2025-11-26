import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import MusicRecommender from '../components/MusicRecommender';
import { useHabits } from '../context/HabitContext';
import { generateMusicKeywords } from '../utils/geminiApi';
import { searchSpotify } from '../utils/spotifyApi';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Textarea } from '../components/Textarea';

/**
 * 기분 기록 페이지 컴포넌트입니다.
 * 사용자의 기분과 태그를 기록하고 음악을 추천받는 기능을 제공합니다.
 */
const RecordPage = () => {
  const { addEntry } = useHabits();

  const [isRecording, setIsRecording] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [memoContent, setMemoContent] = useState('');
  const [recommendedMusic, setRecommendedMusic] = useState([]);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleSelectMood = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleSave = async () => {
    if (!selectedMood) {
      alert('오늘의 기분을 선택해주세요.');
      return;
    }

    setIsLoadingMusic(true);

    const moodMap = {
      happy: { label: '행복', emoji: '😊' },
      excited: { label: '신남', emoji: '🥳' },
      calm: { label: '편안', emoji: '😌' },
      soso: { label: '그저', emoji: '😐' },
      depressed: { label: '우울', emoji: '😔' },
      angry: { label: '화남', emoji: '😡' },
      etc: { label: '기타', emoji: '💡' },
    };
    const currentMood = moodMap[selectedMood] || { label: '알 수 없음', emoji: '❓' };

    const keywords = await generateMusicKeywords(
      currentMood.label,
      selectedTags,
      memoContent
    );

    let musicRecommendations = [];
    if (keywords) {
      musicRecommendations = await searchSpotify(keywords, 'track', 5);
      setRecommendedMusic(musicRecommendations);
    }
    
    setIsLoadingMusic(false);

    const newRecord = {
      date: new Date().toISOString(),
      moodId: selectedMood, // <-- MOOD ID 추가
      mood: currentMood.label,
      moodEmoji: currentMood.emoji,
      tags: selectedTags,
      content: memoContent,
      musicRecommendation: musicRecommendations,
    };

    addEntry(newRecord);

    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
  };

  const handleCancel = () => {
    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
  };

  if (!isRecording) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Sparkles size={48} className="text-yellow-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">오늘의 하루를 기록해보세요</h2>
        <p className="text-gray-500 mb-6">간단한 기록으로 소중한 순간을 남겨요.</p>
        <Button onClick={() => setIsRecording(true)} size="lg">
          기록 시작하기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <Card>
        <CardHeader>
          <CardTitle>오늘의 체크인</CardTitle>
          <CardDescription>{dateString}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">오늘의 기분</h3>
            <MoodSelector selectedMood={selectedMood} onSelectMood={handleSelectMood} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">태그</h3>
            <TagSelector
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onAddTag={handleAddTag}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">메모 (선택)</h3>
            <Textarea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              placeholder="오늘의 순간을 기록해보세요..."
              rows="4"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel}>취소</Button>
            <Button onClick={handleSave}>저장</Button>
        </CardFooter>
      </Card>
      
      <MusicRecommender recommendedMusic={recommendedMusic} isLoading={isLoadingMusic} />
    </div>
  );
};

export default RecordPage;