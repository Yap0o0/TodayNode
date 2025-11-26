// src/components/EmojiPicker.jsx
import React from 'react';
import Modal from './Modal';

/**
 * 이모지를 선택하는 모달 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부
 * @param {function} props.onClose - 모달 닫기 요청 시 호출될 함수
 * @param {function} props.onSelectEmoji - 이모지 선택 시 호출될 함수
 */
const EmojiPicker = ({ isOpen, onClose, onSelectEmoji }) => {
  const emojiCategories = [
    {
      name: '감정',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
        '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      ],
    },
    {
      name: '우울/슬픔',
      emojis: [
        '😔', '😟', '😕', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
        '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '🥵', '🥶', '😱',
        '😨', '😰', '😥', '😓', '😩', '😫', '🥱', '😴', '😪', '🤤',
      ],
    },
    {
      name: '활동',
      emojis: [
        '🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🥈', '🥉', '🏅',
        '🎖️', '🎗️', '🎫', '🎟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼',
        '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🧩', '♟️', '🎯',
      ],
    },
    // 더 많은 카테고리와 이모지를 추가할 수 있습니다.
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="이모지 선택">
      {emojiCategories.map((category, index) => (
        <div key={index} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">{category.name}</h4>
          <div className="grid grid-cols-6 gap-2">
            {category.emojis.map((emoji, emojiIndex) => (
              <button
                key={emojiIndex}
                onClick={() => onSelectEmoji(emoji)}
                className="p-2 text-3xl hover:bg-gray-100 rounded-md transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default EmojiPicker;
