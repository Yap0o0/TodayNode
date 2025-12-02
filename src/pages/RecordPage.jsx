import React, { useState } from 'react';
import { Sparkles, Palette, Smile } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import MusicRecommender from '../components/MusicRecommender';
import { useHabits } from '../context/HabitContext';
import { searchSpotify } from '../utils/spotifyApi';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Textarea } from '../components/Textarea';
import HappinessCardModal from '../components/HappinessCardModal';

// 기분별 추천 키워드 (랜덤 선택용 - 10개 이상으로 확장)
const MOOD_KEYWORDS = {
  happy: ['Upbeat Pop', 'Feel Good', 'Happy Hits', 'Sunny Day', 'Dance Party', 'Joyful', 'Summer Vibes', 'Good Mood', 'Cheerful', 'Positive', 'Bright', 'Fun'],
  excited: ['High Energy', 'Party', 'Electronic', 'Hype', 'Workout', 'Club', 'Festival', 'Adrenaline', 'Running', 'Pumped Up', 'Dynamic', 'Groove'],
  calm: ['Acoustic', 'Chill', 'Piano', 'Nature Sounds', 'Lo-Fi', 'Relaxing', 'Peaceful', 'Meditation', 'Sleep', 'Ambient', 'Serene', 'Quiet'],
  soso: ['Indie Pop', 'Coffee Shop', 'Easy Listening', 'Background Music', 'Mellow', 'Soft Pop', 'Acoustic Pop', 'Daily', 'Comfortable', 'Light', 'Neutral', 'Breezy'],
  depressed: ['Sad Songs', 'Ballad', 'Emotional', 'Rainy Day', 'Slow', 'Melancholy', 'Heartbreak', 'Tearjerker', 'Gloomy', 'Sentimental', 'Blue', 'Lonely'],
  angry: ['Rock', 'Metal', 'Intense', 'Punk', 'Energy', 'Hard Rock', 'Grunge', 'Aggressive', 'Power', 'Rebel', 'Stormy', 'Fierce'],
  etc: ['K-Pop', 'J-Pop', 'World Music', 'Jazz', 'Classical', 'OST', 'Musical', 'Instrumental', 'New Age', 'Fusion', 'Crossover', 'Variety'],
};

// 태그별 추천 키워드 (랜덤 선택용 - 예시 확장)
const TAG_KEYWORDS = {
  '운동': ['Workout', 'Gym', 'Running', 'Fitness', 'Cardio', 'Power', 'Motivation', 'Energy', 'Health', 'Training'],
  '공부': ['Study', 'Focus', 'Concentration', 'Library', 'Reading', 'Brain Power', 'Deep Work', 'Academic', 'Quiet', 'Instrumental'],
  '카페': ['Coffee Shop', 'Cafe Jazz', 'Acoustic', 'Bossa Nova', 'Relaxing', 'Latte', 'Brunch', 'Afternoon', 'Tea Time', 'Bakery'],
  '비': ['Rainy Day', 'Rain', 'Storm', 'Cozy', 'Umbrella', 'Wet', 'Thunder', 'Cloudy', 'Mood', 'Sentimental'],
  '여행': ['Travel', 'Road Trip', 'Adventure', 'Vacation', 'Journey', 'Explore', 'Wanderlust', 'Driving', 'Flight', 'Holiday'],
  // 필요한 만큼 추가...
};

/**
 * 기분 기록 페이지 컴포넌트입니다.
 * 사용자의 기분과 태그를 기록하고 음악을 추천받는 기능을 제공합니다.
 */
const RecordPage = () => {
  const { addEntry, entries, addMusicToHistory, isMusicRecommendable } = useHabits();

  const [isRecording, setIsRecording] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [memoContent, setMemoContent] = useState('');
  const [recommendedMusic, setRecommendedMusic] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  // 테마 색상 상태 (기본값: 노랑)
  const [themeColor, setThemeColor] = useState('#FCD34D');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 소확행 카드 모달 상태
  const [isHappinessModalOpen, setIsHappinessModalOpen] = useState(false);

  // 세션 내 새로고침 횟수 및 보여준 음악 관리
  const [refreshCount, setRefreshCount] = useState(0);
  const [sessionShownMusic, setSessionShownMusic] = useState([]);

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const fetchMusicRecommendation = async (moodId, tags = []) => {
    setIsLoadingMusic(true);
    setSelectedMusic(null);
    try {
      // 1. 기분 라벨 및 랜덤 키워드 선택
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

      // 기분 키워드 중 하나 랜덤 선택
      const moodKeywords = MOOD_KEYWORDS[moodId] || [];
      const randomMoodKeyword = moodKeywords.length > 0
        ? moodKeywords[Math.floor(Math.random() * moodKeywords.length)]
        : moodLabel;

      // 2. 태그 키워드 및 쿼리 조합 (제목/가사 관련성 강화)
      // 태그가 있으면 'track:태그' 형식을 사용하여 제목에 해당 단어가 포함된 곡을 우선 검색
      let searchQuery = randomMoodKeyword;

      if (tags.length > 0) {
        // 태그 중 하나 랜덤 선택
        const randomTag = tags[Math.floor(Math.random() * tags.length)];

        // 태그별 확장 키워드 사용 (다양성)
        const tagKeywords = TAG_KEYWORDS[randomTag] || [randomTag];
        const randomTagKeyword = tagKeywords[Math.floor(Math.random() * tagKeywords.length)];

        // 검색 쿼리: "기분키워드 track:태그키워드" 
        // 예: "Upbeat Pop track:Coffee" -> 제목에 Coffee가 들어가는 신나는 팝
        // 주의: 영어/한국어 혼용 시 검색 결과가 적을 수 있으므로, 태그가 영어 키워드라면 track: 사용, 아니면 일반 검색
        const isEnglish = /^[A-Za-z0-9\s]+$/.test(randomTagKeyword);

        if (isEnglish) {
          searchQuery = `${randomMoodKeyword} track:${randomTagKeyword}`;
        } else {
          // 한국어 태그인 경우 track: 필터가 잘 안 먹힐 수 있으므로 일반 결합
          searchQuery = `${randomMoodKeyword} ${randomTagKeyword}`;
        }
      }

      console.log("Generated Search Query:", searchQuery);

      // 3. Spotify 검색 (충분한 풀 확보를 위해 30개 요청, 매번 다른 결과를 위해 랜덤 오프셋 적용)
      // 오프셋은 0부터 10 사이의 랜덤 값으로 축소 (결과 부족 방지)
      let randomOffset = Math.floor(Math.random() * 10);
      let rawRecommendations = await searchSpotify(searchQuery, 'track', 30, randomOffset);

      // 만약 결과가 없으면 오프셋 0으로 재시도
      if (!rawRecommendations || rawRecommendations.length === 0) {
        console.log("검색 결과 없음, 오프셋 0으로 재시도");
        rawRecommendations = await searchSpotify(searchQuery, 'track', 30, 0);
      }

      // 그래도 결과가 없으면? -> AI에게 유사 키워드 추천받아 재시도 (Smart Fallback)
      if (!rawRecommendations || rawRecommendations.length === 0) {
        console.log("검색 결과 여전히 없음, AI 유사 키워드 검색 시도");
        const { generateMusicKeywords } = await import('../utils/geminiApi');
        // AI가 추천해준 키워드 ("Jazz, Cafe, Piano")
        const fallbackKeywords = await generateMusicKeywords(moodLabel, tags, memoContent);
        console.log("AI 추천 키워드:", fallbackKeywords);

        // 추천 키워드로 다시 검색 (오프셋 0)
        rawRecommendations = await searchSpotify(fallbackKeywords, 'track', 30, 0);
      }

      // 4. 필터링 로직
      const filteredRecommendations = (rawRecommendations || []).filter(track => {
        // A. 최근 5개 기록에서 선택된 음악 제외
        const isRecentlySelected = entries.slice(-5).some(entry => entry.selectedMusic?.id === track.id);
        if (isRecentlySelected) return false;

        // B. 2주 쿨다운 확인 (HabitContext)
        if (!isMusicRecommendable(track.id)) return false;

        // C. 현재 세션 내 20회 새로고침 버퍼 확인
        const sessionRecord = sessionShownMusic.find(item => item.id === track.id);
        if (sessionRecord) {
          // 현재 refreshCount와 보여졌던 시점의 차이가 20 미만이면 제외
          if ((refreshCount - sessionRecord.shownAtRefreshCount) < 20) return false;
        }

        return true;
      });

      // 5. 최종 선택 (5개)
      // 필터링 결과가 부족하면, 어쩔 수 없이 원본에서 중복 제외하고 채움 (사용자 경험 위해)
      let finalRecommendations = filteredRecommendations.slice(0, 5);

      if (finalRecommendations.length < 5) {
        const remainingNeeded = 5 - finalRecommendations.length;
        // 필터링된 것 외의 rawRecommendations에서 가져오되, 이미 선택된 것은 제외
        const additional = (rawRecommendations || [])
          .filter(t => !finalRecommendations.find(f => f.id === t.id))
          .slice(0, remainingNeeded);
        finalRecommendations = [...finalRecommendations, ...additional];
      }

      // 그래도 5개가 안 되면? (rawRecommendations 자체가 적을 때) -> 어쩔 수 없음. 있는 만큼만 보여줌.

      setRecommendedMusic(finalRecommendations);

      // 6. 세션 기록 업데이트
      const newShown = finalRecommendations.map(t => ({ id: t.id, shownAtRefreshCount: refreshCount }));
      setSessionShownMusic(prev => {
        // 기존 기록 중 이번에 다시 나온 애들은 업데이트, 아닌 애들은 유지
        const others = prev.filter(p => !newShown.find(n => n.id === p.id));
        return [...others, ...newShown];
      });

      // 7. 이력 저장 (Context)
      finalRecommendations.forEach(track => addMusicToHistory(track.id));

    } catch (error) {
      console.error("음악 추천 실패:", error);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleSelectMood = (moodId) => {
    setSelectedMood(moodId);
    setRefreshCount(0);
    setSessionShownMusic([]);
    fetchMusicRecommendation(moodId, selectedTags);
  };

  const handleRefreshMusic = () => {
    if (selectedMood) {
      setRefreshCount(prev => prev + 1);
      fetchMusicRecommendation(selectedMood, selectedTags);
    }
  };

  const handleSelectMusic = (music) => {
    setSelectedMusic(music);
  };

  const handleToggleTag = (tag) => {
    let newTags = [];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);

    if (selectedMood) {
      setRefreshCount(0);
      setSessionShownMusic([]);
      fetchMusicRecommendation(selectedMood, newTags);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);

      if (selectedMood) {
        setRefreshCount(0);
        setSessionShownMusic([]);
        fetchMusicRecommendation(selectedMood, newTags);
      }
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
      depressed: { label: '우울' },
      angry: { label: '화남' },
      etc: { label: '기타' },
    };
    const currentMood = moodMap[selectedMood] || { label: '알 수 없음', emoji: '❓' };

    const newRecord = {
      type: 'daily-log',
      date: new Date().toISOString(),
      moodId: selectedMood,
      mood: currentMood.label,
      moodEmoji: currentMood.emoji,
      tags: selectedTags,
      content: memoContent,
      musicRecommendation: recommendedMusic,
      selectedMusic: selectedMusic,
      themeColor: themeColor, // 테마 색상 저장
    };

    addEntry(newRecord);

    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
    setSelectedMusic(null);
    setThemeColor('#FCD34D'); // 색상 초기화
  };

  const handleCancel = () => {
    setIsRecording(false);
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
    setRecommendedMusic([]);
    setSelectedMusic(null);
    setThemeColor('#FCD34D');
  };

  if (!isRecording) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="card card-pink p-8 rounded-[30px] flex flex-col items-center shadow-lg border-2 border-white/80">
          <Sparkles size={48} className="text-yellow-400 mb-4 drop-shadow-md" />
          <h2 className="text-2xl font-bold mb-2 text-[var(--text-main)]">오늘의 하루를 기록해보세요</h2>
          <p className="text-[var(--text-sub)] mb-6">간단한 기록으로 소중한 순간을 남겨요.</p>
          <Button onClick={() => setIsRecording(true)} size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-md hover:scale-105 transition-transform">
            기록 시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 p-4">
      <Card className="card-white border-2 border-white/80 shadow-lg relative">
        <CardHeader>
          <CardTitle className="text-[var(--text-main)] text-2xl">오늘의 체크인</CardTitle>
          <CardDescription className="text-[var(--text-sub)]">{dateString}</CardDescription>
        </CardHeader>

        {/* 상단 버튼 영역 (소확행 카드 & 테마) */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-full bg-white shadow-sm text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            onClick={() => setIsHappinessModalOpen(true)}
          >
            <Sparkles size={16} className="text-yellow-500" /> 소확행
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-full bg-white shadow-sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: themeColor }} />
              테마
            </Button>
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 grid grid-cols-4 gap-2 w-48">
                {['#FCD34D', '#F87171', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#9CA3AF', '#FBBF24'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setThemeColor(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-8 h-8 rounded-full p-0 border-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-[var(--text-main)]">오늘의 기분</h3>
            <MoodSelector selectedMood={selectedMood} onSelectMood={handleSelectMood} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[var(--text-main)]">태그</h3>
            <TagSelector
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onAddTag={handleAddTag}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[var(--text-main)]">메모 (선택)</h3>
            <Textarea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              placeholder="오늘의 순간을 기록해보세요..."
              rows="4"
            />
          </div>

          {selectedMood && (
            <div className="pt-4 border-t border-dashed border-gray-300">
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

      {/* 소확행 카드 모달 */}
      <HappinessCardModal
        isOpen={isHappinessModalOpen}
        onClose={() => setIsHappinessModalOpen(false)}
      />
    </div>
  );
};

export default RecordPage;