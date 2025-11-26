// src/components/ColorPicker.jsx
import React, { useState } from 'react';
import Modal from './Modal';

/**
 * 색상을 선택하는 모달 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부
 * @param {function} props.onClose - 모달 닫기 요청 시 호출될 함수
 * @param {function} props.onSelectColor - 색상 선택 시 호출될 함수 (선택된 hex 코드 반환)
 */
const ColorPicker = ({ isOpen, onClose, onSelectColor }) => {
  const predefinedColors = [
    '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', // 핑크 계열
    '#FFA07A', '#FF7F50', '#FF6347', '#FF4500', // 오렌지/레드 계열
    '#FFD700', '#FFFF00', '#ADFF2F', '#7CFC00', // 노랑/초록 계열
    '#00CED1', '#00BFFF', '#1E90FF', '#4169E1', // 파랑 계열
    '#BA55D3', '#9400D3', '#8A2BE2', '#4B0082', // 보라 계열
    '#D3D3D3', '#A9A9A9', '#808080', '#696969', // 회색 계열
  ];

  const [customColor, setCustomColor] = useState('#FFFFFF'); // 기본값 흰색

  const handleSelectPredefinedColor = (color) => {
    onSelectColor(color);
    onClose();
  };

  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
  };

  const handleApplyCustomColor = () => {
    // 간단한 hex 코드 유효성 검사 (예: #RRGGBB 또는 #RGB)
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(customColor)) {
      onSelectColor(customColor);
      onClose();
    } else {
      alert('유효한 Hex 색상 코드를 입력해주세요 (예: #RRGGBB).');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="테마 색상 선택">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">팔레트</h4>
        <div className="grid grid-cols-5 gap-2">
          {predefinedColors.map((color, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 hover:border-purple-500 transition-all"
              style={{ backgroundColor: color }}
              onClick={() => handleSelectPredefinedColor(color)}
              title={color}
            ></div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">커스텀 색상</h4>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-10 h-10 border-none p-0 rounded-md overflow-hidden cursor-pointer"
            title="색상 선택"
          />
          <input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyCustomColor();
              }
            }}
            placeholder="#RRGGBB"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleApplyCustomColor}
            className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-600 transition-colors"
          >
            적용
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ColorPicker;
