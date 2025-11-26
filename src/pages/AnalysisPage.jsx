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
  const { entries } = useHabits(); // HabitContext에서 데이터 가져오기

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

  const hasEnoughRecords = entries.length >= 3;

  // 임시 AI 인사이트 목업 데이터 (실제 분석 로직은 추후 추가)
  const mockAiInsights = {
    tagEmotion: [
      "#음식 태그와 행복 감정이 총 3번 함께 나타났습니다.",
    ],
    musicTaste: [
      "행복 감정일 때 음악을 가장 많이 선택하셨어요 (총 3번)",
      "#POP 장르를 가장 많이 선택하셨어요 (총 2번)",
    ],
    overall: `지난 ${entries.length}개의 기록을 분석했어요. 꾸준히 기록하면 더 정확한 인사이트를 제공할 수 있어요!`,
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
      },
    ],
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

  return (
    <div className="analysis-page p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">감정 분포</h3>
        <p className="text-gray-600 mb-4">기분별 기록 횟수를 확인하세요</p>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">AI 인사이트</h3>
        {hasEnoughRecords ? (
          <div className="space-y-4">
            <div>
              <p className="font-medium text-lg mb-2">태그-감정 분석 (예시)</p>
              <ul className="list-disc pl-5 text-gray-700">
                {mockAiInsights.tagEmotion.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-lg mb-2">음악 취향 분석 (예시)</p>
              <ul className="list-disc pl-5 text-gray-700">
                {mockAiInsights.musicTaste.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-purple-800 font-medium">
              <p>{mockAiInsights.overall}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">데이터를 분석하려면 최소 3개 이상의 기록이 필요해요!</p>
            <p className="text-sm">현재 기록 {entries.length}개</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-3">요약</h3>
        <p className="text-gray-700">
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