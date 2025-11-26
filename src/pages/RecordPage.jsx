import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import MusicRecommender from '../components/MusicRecommender';
import { useHabits } from '../context/HabitContext';
import { searchSpotify } from '../utils/spotifyApi';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Textarea } from '../components/Textarea';

// 기분별 추천 키워드 (랜덤 선택용)
const MOOD_KEYWORDS = {
  happy: ['Upbeat Pop', 'Feel Good', 'Happy Hits', 'Sunny Day', 'Dance Party'],
  excited: ['High Energy', 'Party', 'Electronic', 'Hype', 'Workout'],
  calm: ['Acoustic', 'Chill', 'Piano', 'Nature Sounds', 'Lo-Fi'],
  soso: ['Indie Pop', 'Coffee Shop', 'Easy Listening', 'Background Music'],
  depressed: ['Sad Songs', 'Ballad', 'Emotional', 'Rainy Day', 'Slow'],
  angry: ['Rock', 'Metal', 'Intense', 'Punk', 'Energy'],
  etc: ['K-Pop', 'J-Pop', 'World Music', 'Jazz', 'Classical'],
};

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
  const [selectedMusic, setSelectedMusic] = useState(null); // 선택된 음악 상태
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const fetchMusicRecommendation = async (moodId, tags = []) => {
    setIsLoadingMusic(true);
    setSelectedMusic(null); // 추천 새로 받으면 선택 초기화
    try {
      // 1. 기분 라벨 가져오기
      const moodMap = {
        happy: { label: '행복' },
        excited: { label: '신남' },
        calm: { label: '편안' },
        soso: { label: '그저' },
        depressed: { label: '우울' },
        angry: { label: '화남' },
        etc: { label: '기타' },
      };
      const moodLabel = moodMap[moodId]?.label || '기분';

      // 2. 해당 기분의 키워드 리스트 가져오기
      const keywords = MOOD_KEYWORDS[moodId] || MOOD_KEYWORDS['etc'];

      // 3. 랜덤 키워드 선택
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

      // 4. 검색 쿼리 조합: 기분 + 태그(최대 2개) + 랜덤 키워드
      // 예: "행복 운동 Upbeat Pop"
      const tagQuery = tags.slice(0, 2).join(' ');
      const searchQuery = `${moodLabel} ${tagQuery} ${randomKeyword}`.trim();

      // console.log("Spotify 검색 쿼리:", searchQuery);

      // 5. Spotify 검색
      const musicRecommendations = await searchSpotify(searchQuery, 'track', 5);
      setRecommendedMusic(musicRecommendations);
    } catch (error) {
      console.error("음악 추천 실패:", error);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleSelectMood = (moodId) => {
    setSelectedMood(moodId);
    // 기분 선택 시 현재 태그와 함께 추천 요청
    fetchMusicRecommendation(moodId, selectedTags);
  };

  const handleRefreshMusic = () => {
    if (selectedMood) {
      fetchMusicRecommendation(selectedMood, selectedTags);
    }
  };

  const handleSelectMusic = (music) => {
    setSelectedMusic(music);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    // 태그 변경 시 음악 추천 업데이트 (선택사항, 너무 잦은 업데이트 방지 위해 여기선 제외하거나 디바운스 필요. 
    // 현재 요구사항은 '기분 선택 시'가 메인이므로 일단 유지. 
    // 만약 태그 변경 시에도 즉시 반영 원하면 fetchMusicRecommendation 호출 추가)
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

    const newRecord = {
      type: 'daily-log', // 데이터 타입 구분: 기록
      date: new Date().toISOString(),
      moodId: selectedMood,
      mood: currentMood.label,
      moodEmoji: currentMood.emoji,
      tags: selectedTags,
      content: memoContent,
      musicRecommendation: recommendedMusic, // 전체 추천 목록
      selectedMusic: selectedMusic, // 사용자가 선택한 음악
    };

    addEntry(newRecord);

    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
    setSelectedMusic(null);
  };

  const handleCancel = () => {
    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
    setSelectedMusic(null);
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

          {/* 기분이 선택되었을 때만 음악 추천 컴포넌트 표시 (카드 내부로 이동) */}
          {selectedMood && (
            <div className="pt-4 border-t">
              <MusicRecommender
                recommendedMusic={recommendedMusic}
                isLoading={isLoadingMusic}
                onRefresh={handleRefreshMusic}
                onSelectMusic={handleSelectMusic}
                selectedMusicId={selectedMusic?.id}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecordPage;