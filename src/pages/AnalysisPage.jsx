// src/pages/AnalysisPage.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
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
 */
const AnalysisPage = () => {
  const { entries, badges } = useHabits(); // HabitContext에서 데이터 가져오기

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

  React.useEffect(() => {
    const fetchInsights = async () => {
      if (entries.length >= 1) {
        setIsLoadingInsights(true);
        try {
          console.log("Fetching AI insights...");
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

          // 명대사 추천을 위한 타겟 감정 설정 (오늘 기록 없으면 전체 최빈 감정 사용)
          const targetMood = todaysMood || mostFrequentMood;
          console.log("Target Mood for Quote:", targetMood);

          const [insights, movieQuote] = await Promise.all([
            analyzeHabits(entries),
            recommendMovieQuote(todaysEntries.length > 0 ? todaysEntries : entries, targetMood)
          ]);

          console.log("Insights fetched:", insights);
          console.log("Movie Quote fetched:", movieQuote);

          setAiInsights({ ...insights, movieQuote });
        } catch (error) {
          console.error("Failed to fetch insights:", error);
        } finally {
          setIsLoadingInsights(false);
        }
      }
    };

    fetchInsights();
  }, [entries.length]); // entries.length가 변경될 때마다 분석 수행 (최적화 필요 시 수정)

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
      ctx.font = '30px Arial'; // 이모지 크기 확대
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      meta.data.forEach((point, index) => {
        const value = dataset.data[index];
        if (value > 0) { // 데이터가 0보다 클 때만 이모지 표시
          const moodLabel = data.labels[index];
          const emoji = moodEmojis[moodLabel] || '❓';
          // 포인트 위에 이모지 그리기 (y축 좌표에서 조금 위로)
          ctx.fillText(emoji, point.x, point.y - 20);
        }
      });
      ctx.restore();
    }
  };

  return (
    <div className="analysis-page p-4 pb-24">
      <div className="card card-pink mb-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">감정 분포</h3>
        <p className="text-[var(--text-sub)] mb-4">기분별 기록 횟수를 확인하세요</p>
        <Line data={chartData} options={chartOptions} plugins={[emojiPlugin]} />
      </div>

      <div className="card card-beige mb-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">나의 성취</h3>
        <BadgeList badges={badges} />
      </div>

      <div className="card card-yellow mb-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">AI 인사이트</h3>
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
                <ul className="list-disc pl-5 text-[var(--text-main)]">
                  {aiInsights.tagEmotion.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-lg mb-2 text-[var(--text-main)]">음악 취향 분석</p>
                <ul className="list-disc pl-5 text-[var(--text-main)]">
                  {aiInsights.musicTaste.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white/50 rounded-lg text-[var(--text-main)] font-medium border border-white/60">
                <p>{aiInsights.overall}</p>
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

      <div className="card card-mint mb-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">오늘의 영화 명대사</h3>
        {hasEnoughRecords ? (
          isLoadingInsights ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-[var(--text-sub)]">당신을 위한 명대사를 찾고 있어요...</span>
            </div>
          ) : aiInsights && aiInsights.movieQuote ? (
            <div className="text-center p-6 bg-white/50 rounded-xl border border-white/60">
              <p className="text-xl font-serif text-[var(--text-main)] mb-4 italic">"{aiInsights.movieQuote.quote}"</p>
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

      <div className="card card-pink">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)]">요약</h3>
        <p className="text-[var(--text-main)]">
          총 {entries.length}개의 기록이 있습니다. <br />
          {entries.length > 0 ? (
            <>
              가장 많이 느낀 감정은 <span className="font-bold text-purple-600">{mostFrequentMood}</span>입니다.
            </>
          ) : (
            '아직 기록된 감정이 없습니다.'
          )}
        </p>
      </div>
    </div>
  );
};

export default AnalysisPage;