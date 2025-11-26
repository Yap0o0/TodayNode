import React, { useState } from 'react';

/**
 * 태그를 선택하고 추가하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string[]} props.selectedTags - 현재 선택된 태그 배열
 * @param {function} props.onToggleTag - 태그 선택/해제 시 호출될 함수
 * @param {function} props.onAddTag - 새 태그 추가 시 호출될 함수
 */
const TagSelector = ({ selectedTags, onToggleTag, onAddTag }) => {
  const predefinedTags = ['운동', '음식', '휴식', '일', '친구', '가족', '취미', '공부'];
  const [customTagInput, setCustomTagInput] = useState('');

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      onAddTag(customTagInput.trim());
      setCustomTagInput('');
    }
  };

  return (
    <div className="tag-selector mb-6">
      <h3 className="text-xl font-semibold mb-3">태그</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-200
              ${selectedTags.includes(tag) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customTagInput}
          onChange={(e) => setCustomTagInput(e.target.value)}
          placeholder="커스텀 태그 입력..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleAddCustomTag}
          className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-600 transition-colors"
        >
          추가
        </button>
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              #{tag}
              <button onClick={() => onToggleTag(tag)} className="ml-2 text-purple-500 hover:text-purple-700">
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
