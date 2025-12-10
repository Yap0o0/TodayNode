// src/pages/AnalysisPage.jsx
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { RefreshCw, Film, Share2, Download } from 'lucide-react';
import { recommendMovieQuote } from '../utils/geminiApi';
import DailyCardModal from '../components/DailyCardModal';
import { toBlob } from 'html-to-image';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useHabits } from '../context/HabitContext'; // useHabits import
import BadgeList from '../components/BadgeList';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * 분석 페이지 컴포넌트입니다.
 * 사용자의 기분 분포를 차트로 시각화하고 AI 인사이트를 제공합니다.
 * 각 섹션별 공유 기능을 제공합니다.
 */
const AnalysisPage = () => {
  const { entries, badges } = useHabits(); // HabitContext에서 데이터 가져오기

  // 섹션별 캡처를 위한 Refs
  const moodChartRef = useRef(null);
  const aiInsightRef = useRef(null);
  const summaryRef = useRef(null);
  const movieQuoteRef = useRef(null);

  const moodLabels = ['행복', '신남', '편안', '그저', '우울', '화남', '기타'];

  // 기분별 기록 횟수 계산
  const moodDistribution = moodLabels.reduce((acc, mood) => {
    acc[mood] = entries.filter(entry => entry.mood === mood).length;
    return acc;
  }, {});

  const moodData = moodLabels.map(label => moodDistribution[label] || 0);

  // 가장 많이 느낀 감정 찾기
  const mostFrequentMood = Object.keys(moodDistribution).reduce((a, b) =>
    moodDistribution[a] > moodDistribution[b] ? a : b
    , '없음');

  const hasEnoughRecords = entries.length >= 1;

  const [aiInsights, setAiInsights] = React.useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = React.useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = React.useState(false); // 명대사 로딩 상태
  const [recentQuotes, setRecentQuotes] = React.useState([]); // 최근 명대사 기록 (중복 방지)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false); // 공유 카드 모달 상태

  // 오늘 날짜 문자열 (YYYY-MM-DD)
  const todayStr = new Date().toISOString().slice(0, 10);

  // 오늘의 기록 찾기 (최신 기록 우선)
  // entries는 시간순 정렬이므로 끝에서부터 찾거나 필터링 후 마지막 요소 선택
  const todaysEntries = entries.filter(entry => entry.date && entry.date.startsWith(todayStr));
  const todayEntry = todaysEntries.length > 0 ? todaysEntries[todaysEntries.length - 1] : null;

  // 캐시 키 생성 (렌더링 시 계산)
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const latestEntryTimestamp = latestEntry ? new Date(latestEntry.timestamp || latestEntry.date).getTime() : 0;
  const totalEntries = entries.length;
  const cacheKey = `ai_insights_cache_${totalEntries}_${latestEntryTimestamp}`;

  // 2. 캐시 확인 및 데이터 가져오기 (Effect)
  React.useEffect(() => {
    const fetchInsights = async () => {
      if (entries.length >= 1) {
        // 캐시 확인
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const parsedCache = JSON.parse(cachedData);

            // 캐시 데이터 유효성 검사 (movieQuote가 있어야 함)
            if (parsedCache && parsedCache.movieQuote) {
              setAiInsights(parsedCache);

              // 캐시된 명대사가 있으면 최근 목록에도 추가 (UI 동기화)
              if (parsedCache.movieQuote && parsedCache.movieQuote.quote) {
                const quoteToCheck = parsedCache.movieQuote.quote;
                setRecentQuotes(prev => {
                  if (prev.includes(quoteToCheck)) return prev; // 중복이면 상태 업데이트 방지 (루프 방지)
                  const newRecent = [quoteToCheck, ...prev].slice(0, 10);
                  return [...new Set(newRecent)];
                });
              }
              return; // API 호출 건너뜀
            }
          } catch (e) {
            localStorage.removeItem(cacheKey); // 깨진 캐시 삭제
          }
        }

        // 3. 캐시 없거나 불일치 시 API 호출
        setIsLoadingInsights(true);
        try {
          const { analyzeHabits, recommendMovieQuote } = await import('../utils/geminiApi');

          // 오늘의 기록만 필터링
          const today = new Date().toDateString();
          const todaysEntries = entries.filter(entry => new Date(entry.date).toDateString() === today);

          // 오늘의 최빈 감정 계산
          let todaysMood = null;
          if (todaysEntries.length > 0) {
            const moodCounts = todaysEntries.reduce((acc, entry) => {
              acc[entry.mood] = (acc[entry.mood] || 0) + 1;
              return acc;
            }, {});
            todaysMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
          }

          // 명대사 추천을 위한 타겟 감정 설정
          const targetMood = todaysMood || mostFrequentMood;

          const results = await Promise.allSettled([
            analyzeHabits(entries),
            recommendMovieQuote(targetMood, recentQuotes)
          ]);

          const insightsResult = results[0];
          const movieQuoteResult = results[1];

          const insights = insightsResult.status === 'fulfilled' ? insightsResult.value : null;
          const movieQuote = movieQuoteResult.status === 'fulfilled' ? movieQuoteResult.value : null;

          // insights가 null이어도 movieQuote가 있으면 표시되도록 처리
          const newInsights = insights || {
            tagEmotion: [],
            musicTaste: [],
            overall: "분석 데이터를 불러올 수 없습니다."
          };

          const finalData = { ...newInsights, movieQuote };

          // 4. 결과 상태 업데이트 및 캐시 저장
          setAiInsights(finalData);
          localStorage.setItem(cacheKey, JSON.stringify(finalData));

          // 초기 명대사도 최근 목록에 추가
          if (movieQuote && movieQuote.quote) {
            setRecentQuotes(prev => {
              if (prev.includes(movieQuote.quote)) return prev;
              const newRecent = [movieQuote.quote, ...prev].slice(0, 10);
              return [...new Set(newRecent)];
            });
          }
        } catch (error) {
          console.error("Failed to fetch insights:", error);
        } finally {
          setIsLoadingInsights(false);
        }
      }
    };

    fetchInsights();
  }, [entries, cacheKey, mostFrequentMood]);

  const handleRefreshQuote = async () => {
    if (entries.length === 0) return;

    setIsLoadingQuote(true);
    try {
      // 최근 기록에서 가장 빈도 높은 기분 찾기 (간단한 로직)
      const moodCounts = entries.slice(0, 7).reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});
      const mostFrequentMood = Object.keys(moodCounts).length > 0
        ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
        : 'etc';

      const newQuote = await recommendMovieQuote(mostFrequentMood, recentQuotes);
      setAiInsights(prev => ({ ...prev, movieQuote: newQuote }));

      // 새로운 명대사를 최근 목록에 추가 (최대 10개 유지)
      if (newQuote && newQuote.quote) {
        setRecentQuotes(prev => {
          const newRecent = [newQuote.quote, ...prev].slice(0, 10);
          return [...new Set(newRecent)]; // 중복 제거
        });
      }
    } catch (error) {
      console.error("Failed to refresh quote:", error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // 저장 시 배경색 강도를 위해 더 진한 색상 사용 (25% 투명도 적용 시 파스텔톤이 되도록)
  const CARD_COLORS = {
    pink: '#F472B6',   // Pink-400
    beige: '#F59E0B',  // Amber-500 (Beige대용)
    yellow: '#FCD34D', // Amber-300
    mint: '#34D399',   // Emerald-400
  };

  // 섹션 저장(다운로드) 핸들러
  const handleDownloadSection = async (ref, fileName, colorHex = '#ffffff') => {
    if (!ref.current) return;
    try {
      const blob = await toBlob(ref.current, {
        quality: 0.95,
        backgroundColor: '#ffffff', // 배경색을 흰색으로 설정하여 투명도 있는 요소가 파스텔톤으로 보이게 함
        filter: (node) => !node.classList?.contains('hide-on-capture'),
        style: {
          margin: '0',
          borderRadius: '0',
          boxShadow: 'none',
          backgroundColor: `${colorHex}20`, // 요소 배경색 강제 변경 (농도 12.5%로 낮춤)
          border: `1px solid ${colorHex}40`
        }
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        link.href = url;
        link.download = `${fileName}_${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Download failed:', e);
      alert('저장에 실패했습니다.');
    }
  };

  // 섹션 공유 핸들러
  const handleShareSection = async (ref, fileName, colorHex = '#ffffff') => {
    if (!ref.current) return;
    try {
      // html-to-image로 배경색 지정하여 캡처
      const blob = await toBlob(ref.current, {
        quality: 0.95,
        backgroundColor: '#ffffff', // 배경색을 흰색으로 설정하여 투명도 있는 요소가 파스텔톤으로 보이게 함
        filter: (node) => !node.classList?.contains('hide-on-capture'),
        style: {
          margin: '0',
          borderRadius: '0',
          boxShadow: 'none',
          backgroundColor: `${colorHex}20`, // 요소 배경색 강제 변경 (농도 12.5%로 낮춤)
          border: `1px solid ${colorHex}40`
        }
      });

      if (!blob) return;
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const file = new File([blob], `${fileName}_${timestamp}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Haru Node Analysis',
            text: `${fileName} 공유 #하루노드`,
            files: [file]
          });
        } catch (err) {
          console.log('Share canceled', err);
        }
      } else {
        // 공유가 지원되지 않으면 다운로드로 폴백
        alert('공유 기능을 지원하지 않는 브라우저입니다. 이미지를 저장합니다.');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}_${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Share failed:', e);
      alert('공유에 실패했습니다.');
    }
  };

  const chartData = {
    labels: moodLabels,
    datasets: [
      {
        label: '기록 횟수',
        data: moodData,
        borderColor: 'rgb(139, 92, 246)', // purple-500
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        pointRadius: 6, // 포인트 크기 증가
        pointHoverRadius: 8,
      },
    ],
  };

  // 이모지 매핑
  const moodEmojis = {
    '행복': '😊',
    '신남': '🥳',
    '편안': '😌',
    '그저': '😐',
    '우울': '😔',
    '화남': '😡',
    '기타': '💡',
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false, // 범례 숨김
      },
      title: {
        display: false,
        text: '감정 분포',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}회`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(10, Math.max(...moodData) + 2), // 데이터에 따라 y축 최대값 동적 조정
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  // 차트 플러그인: 이모지 그리기
  const emojiPlugin = {
    id: 'emojiPlugin',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      const dataset = data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.font = '24px Arial'; // 이모지 크기 확대
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      meta.data.forEach((point, index) => {
        const value = dataset.data[index];
        if (value > 0) { // 데이터가 0보다 클 때만 이모지 표시
          const moodLabel = data.labels[index];
          const emoji = moodEmojis[moodLabel] || '❓';
          // 포인트 위에 이모지 그리기 (y축 좌표에서 조금 위로)
          ctx.fillText(emoji, point.x, point.y - 15);
        }
      });
      ctx.restore();
    }
  };

  return (
    <div className="analysis-page p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">분석</h2>
          <p className="text-[var(--text-sub)]">나의 기록을 분석해보세요.</p>
        </div>

      </div>

      {/* 감정 분포 카드 */}
      <div ref={moodChartRef} className="card card-pink mb-6 relative group">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-main)]">감정 분포</h3>
            <p className="text-[var(--text-sub)] text-sm">기분별 기록 횟수를 확인하세요</p>
          </div>
          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity hide-on-capture">
            <button
              onClick={() => handleDownloadSection(moodChartRef, 'haru-node-mood-chart', CARD_COLORS.pink)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="차트 저장"
            >
              <Download size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => handleShareSection(moodChartRef, 'haru-node-mood-chart', CARD_COLORS.pink)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="차트 공유"
            >
              <Share2 size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-2">
          <Line data={chartData} options={chartOptions} plugins={[emojiPlugin]} />
        </div>
      </div>

      <div className="card card-beige mb-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">나의 성취</h3>
        <BadgeList badges={badges} />
      </div>

      {/* AI 인사이트 카드 */}
      <div ref={aiInsightRef} className="card card-yellow mb-6 relative group">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-[var(--text-main)]">AI 인사이트</h3>
          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity hide-on-capture">
            <button
              onClick={() => handleDownloadSection(aiInsightRef, 'haru-node-ai-insight', CARD_COLORS.yellow)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="인사이트 저장"
            >
              <Download size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => handleShareSection(aiInsightRef, 'haru-node-ai-insight', CARD_COLORS.yellow)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="인사이트 공유"
            >
              <Share2 size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        {hasEnoughRecords ? (
          isLoadingInsights ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-[var(--text-sub)]">AI가 기록을 분석 중입니다...</span>
            </div>
          ) : aiInsights ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium text-lg mb-2 text-[var(--text-main)]">태그-감정 분석</p>
                <ul className="list-disc pl-5 text-[var(--text-main)] space-y-1">
                  {aiInsights.tagEmotion && aiInsights.tagEmotion.map((insight, index) => (
                    <li key={index} className="text-sm">{insight}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-lg mb-2 text-[var(--text-main)]">음악 취향 분석</p>
                <ul className="list-disc pl-5 text-[var(--text-main)] space-y-1">
                  {aiInsights.musicTaste && aiInsights.musicTaste.map((insight, index) => (
                    <li key={index} className="text-sm">{insight}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white/50 rounded-lg text-[var(--text-main)] font-medium border border-white/60">
                <p className="leading-relaxed">{aiInsights.overall}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-[var(--text-sub)] py-8">
              <p>분석 결과를 불러오지 못했습니다.</p>
            </div>
          )
        ) : (
          <div className="text-center text-[var(--text-sub)] py-8">
            <p className="text-lg mb-2">데이터를 분석하려면 최소 1개 이상의 기록이 필요해요!</p>
            <p className="text-sm">현재 기록 {entries.length}개</p>
          </div>
        )}
      </div>

      {/* 영화 명대사 카드 */}
      <div ref={movieQuoteRef} className="card card-mint mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Film size={100} />
        </div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-2">
            <Film className="text-purple-500" size={24} />
            오늘의 영화 명대사
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity hide-on-capture">
              <button
                onClick={() => handleDownloadSection(movieQuoteRef, 'haru-node-movie-quote', CARD_COLORS.mint)}
                className="p-2 hover:bg-white/50 rounded-full"
                title="명대사 저장"
              >
                <Download size={20} className="text-gray-500" />
              </button>
              <button
                onClick={() => handleShareSection(movieQuoteRef, 'haru-node-movie-quote', CARD_COLORS.mint)}
                className="p-2 hover:bg-white/50 rounded-full"
                title="명대사 공유"
              >
                <Share2 size={20} className="text-gray-500" />
              </button>
            </div>
            <button
              onClick={handleRefreshQuote}
              disabled={isLoadingQuote}
              className={`p-2 rounded-full hover:bg-white/50 transition-colors ${isLoadingQuote ? 'animate-spin' : ''}`}
              title="새로운 명대사 추천"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {hasEnoughRecords ? (
          isLoadingInsights || isLoadingQuote ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-[var(--text-sub)]">
                {isLoadingQuote ? "새로운 명대사를 찾고 있어요..." : "당신을 위한 명대사를 찾고 있어요..."}
              </span>
            </div>
          ) : aiInsights && aiInsights.movieQuote ? (
            <div className="text-center p-6 bg-white/50 rounded-xl border border-white/60 relative z-10">
              <p className="text-xl font-serif text-[var(--text-main)] mb-4 italic leading-relaxed">"{aiInsights.movieQuote.quote}"</p>
              <p className="text-[var(--text-sub)] font-medium mb-2">- 영화 &lt;{aiInsights.movieQuote.movie}&gt; 중 -</p>
              <p className="text-sm text-purple-600 bg-purple-50 inline-block px-3 py-1 rounded-full mt-2">
                💡 {aiInsights.movieQuote.reason}
              </p>
            </div>
          ) : (
            <div className="text-center text-[var(--text-sub)] py-8">
              <p>명대사를 불러오지 못했습니다.</p>
            </div>
          )
        ) : (
          <div className="text-center text-[var(--text-sub)] py-8">
            <p className="text-lg mb-2">기록이 조금 더 쌓이면 명대사를 추천해드릴게요!</p>
          </div>
        )}
      </div>

      {/* 요약 카드 */}
      <div ref={summaryRef} className="card card-pink mb-6 relative group">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-[var(--text-main)]">요약</h3>
          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity hide-on-capture">
            <button
              onClick={() => handleDownloadSection(summaryRef, 'haru-node-summary', CARD_COLORS.pink)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="요약 저장"
            >
              <Download size={20} className="text-gray-500" />
            </button>
            <button
              onClick={() => handleShareSection(summaryRef, 'haru-node-summary', CARD_COLORS.pink)}
              className="p-2 hover:bg-white/50 rounded-full"
              title="요약 공유"
            >
              <Share2 size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <p className="text-[var(--text-main)] leading-relaxed">
          총 {entries.length}개의 기록이 있습니다. <br />
          {entries.length > 0 ? (
            <>
              가장 많이 느낀 감정은 <span className="font-bold text-purple-600 text-lg">{mostFrequentMood}</span>입니다.
            </>
          ) : (
            '아직 기록된 감정이 없습니다.'
          )}
        </p>
      </div>

      {/* 공유 카드 모달 */}
      <DailyCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        entry={todayEntry}
        movieQuote={aiInsights?.movieQuote}
      />
    </div>
  );
};

export default AnalysisPage;