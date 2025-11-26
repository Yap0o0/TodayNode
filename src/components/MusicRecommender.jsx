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
const MusicRecommender = ({ recommendedMusic, isLoading }) => {
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
          <p className="text-sm mt-1">기분과 태그를 선택하고 저장해보세요!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recommendedMusic.map((track) => (
          <div key={track.id} className="flex items-center bg-background p-2 rounded-lg">
            {track.albumArt && (
              <img src={track.albumArt} alt={track.album} className="w-14 h-14 rounded-md mr-4" />
            )}
            <div className="flex-grow">
              <p className="font-bold text-sm">{track.name}</p>
              <p className="text-muted-foreground text-xs">{track.artist}</p>
            </div>
            <div className="flex items-center space-x-1 ml-auto">
              {track.previewUrl && (
                <a href={track.previewUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <PlayCircle size={20} />
                  </Button>
                </a>
              )}
              {track.externalUrl && (
                <a href={track.externalUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <Music size={20} />
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎶 추천 음악</CardTitle>
        <CardDescription>오늘의 기분에 맞는 음악을 즐겨보세요.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default MusicRecommender;
