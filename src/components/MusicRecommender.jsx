import React from 'react';
import { Music, Loader, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { Button } from './Button';

/**
 * AI 기반 음악 추천을 표시하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {Array} props.recommendedMusic - Spotify에서 추천받은 음악 목록
 * @param {boolean} props.isLoading - 음악 추천 로딩 중 여부
 */
const MusicRecommender = ({ recommendedMusic, isLoading, onRefresh, onSelectMusic, selectedMusicId }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Loader size={36} className="animate-spin mb-3" />
          <p className="font-medium">AI가 음악을 추천 중입니다...</p>
        </div>
      );
    }

    if (!recommendedMusic || recommendedMusic.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
          <Music size={36} className="mb-3" />
          <p className="font-medium">AI 음악 추천이 여기에 표시됩니다.</p>
          <p className="text-sm mt-1">기분과 태그를 선택하면 음악을 추천해드려요!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recommendedMusic.map((track) => {
          const isSelected = selectedMusicId === track.id;
          return (
            <div
              key={track.id}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 border ${isSelected
                  ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                  : 'bg-background border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              onClick={() => onSelectMusic && onSelectMusic(track)}
            >
              {track.albumArt && (
                <img src={track.albumArt} alt={track.album} className="w-14 h-14 rounded-md mr-4" />
              )}
              <div className="flex-grow">
                <p className={`font-bold text-sm ${isSelected ? 'text-purple-700' : ''}`}>{track.name}</p>
                <p className="text-muted-foreground text-xs">{track.artist}</p>
              </div>
              <div className="flex items-center space-x-1 ml-auto">
                {track.previewUrl && (
                  <a
                    href={track.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 전파 방지
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlayCircle size={18} />
                    </Button>
                  </a>
                )}
                {track.externalUrl && (
                  <a
                    href={track.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 전파 방지
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Music size={18} />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>🎶 추천 음악</CardTitle>
          <CardDescription>오늘의 기분에 맞는 음악을 즐겨보세요.</CardDescription>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            새로고침
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default MusicRecommender;
