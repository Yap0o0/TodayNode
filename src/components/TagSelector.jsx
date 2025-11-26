import React, { useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input } from './Input';
import { X } from 'lucide-react';

/**
 * 태그를 선택하고 추가하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string[]} props.selectedTags - 현재 선택된 태그 배열
 * @param {(tag: string) => void} props.onToggleTag - 태그 선택/해제 시 호출될 함수
 * @param {(tag: string) => void} props.onAddTag - 새 태그 추가 시 호출될 함수
 */
const TagSelector = ({ selectedTags, onToggleTag, onAddTag }) => {
  const predefinedTags = ['운동', '음식', '휴식', '일', '친구', '가족', '취미', '공부'];
  const [customTagInput, setCustomTagInput] = useState('');

  const handleAddCustomTag = () => {
    const newTag = customTagInput.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      onAddTag(newTag);
      setCustomTagInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustomTag();
    }
  };

  return (
    <div className="space-y-4">
      {/* 선택된 태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => onToggleTag(tag)}
                className="rounded-full hover:bg-black/10"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* 커스텀 태그 입력 */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={customTagInput}
          onChange={(e) => setCustomTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="새 태그를 입력하세요"
          className="flex-grow"
        />
        <Button type="button" onClick={handleAddCustomTag} variant="outline" size="sm">
          추가
        </Button>
      </div>
      
      {/* 추천 태그 */}
      <div className="flex flex-wrap gap-2">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            disabled={selectedTags.includes(tag)}
          >
            <Badge variant={selectedTags.includes(tag) ? 'default' : 'outline'}>
              {tag}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
