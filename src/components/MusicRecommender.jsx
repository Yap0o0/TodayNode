import React from 'react';
import { Music } from 'lucide-react';

/**
 * AI 기반 음악 추천을 표시하는 컴포넌트입니다.
 * (현재는 플레이스홀더입니다.)
 */
const MusicRecommender = () => {
  return (
    <div className="music-recommender p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center mb-6">
      <Music size={36} className="text-gray-400 mb-3" />
      <p className="text-gray-600 text-lg font-medium">기록 후 AI 음악 추천이 여기에 표시됩니다.</p>
      <p className="text-sm text-gray-500 mt-1">기분과 태그를 선택해보세요!</p>
    </div>
  );
};

export default MusicRecommender;
