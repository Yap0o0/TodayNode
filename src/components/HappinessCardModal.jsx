import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Heart, Coffee, Sun, Music, Book, Smile } from 'lucide-react';
import { Button } from './Button';

const HAPPINESS_ITEMS = [
  { id: 1, text: "따뜻한 햇살 받으며 5분 산책하기", icon: <Sun size={48} className="text-orange-400" /> },
  { id: 2, text: "좋아하는 노래 크게 따라 부르기", icon: <Music size={48} className="text-purple-400" /> },
  { id: 3, text: "달콤한 디저트 한 입 먹기", icon: <Coffee size={48} className="text-brown-400" /> },
  { id: 4, text: "읽고 싶었던 책 10페이지 읽기", icon: <Book size={48} className="text-blue-400" /> },
  { id: 5, text: "거울 보고 나에게 칭찬 한마디 해주기", icon: <Smile size={48} className="text-yellow-400" /> },
  { id: 6, text: "소중한 사람에게 안부 문자 보내기", icon: <Heart size={48} className="text-red-400" /> },
  { id: 7, text: "따뜻한 차 한 잔의 여유 즐기기", icon: <Coffee size={48} className="text-green-400" /> },
  { id: 8, text: "오늘 하늘 사진 찍어보기", icon: <Sun size={48} className="text-sky-400" /> },
];

/**
 * 랜덤 소확행 카드 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 */
const HappinessCardModal = ({ isOpen, onClose }) => {
  const [card, setCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawCard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomItem = HAPPINESS_ITEMS[Math.floor(Math.random() * HAPPINESS_ITEMS.length)];
      setCard(randomItem);
      setIsAnimating(false);
    }, 500); // 0.5초 동안 애니메이션 효과
  };

  useEffect(() => {
    if (isOpen) {
      drawCard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden transform transition-all">
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-6">오늘의 소확행 카드</h3>
          
          <div className={`transition-all duration-500 transform ${isAnimating ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
            {card && (
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="p-6 bg-purple-50 rounded-full shadow-inner">
                  {card.icon}
                </div>
                <p className="text-lg font-medium text-gray-700 break-keep leading-relaxed">
                  {card.text}
                </p>
              </div>
            )}
          </div>

          <Button 
            onClick={drawCard} 
            disabled={isAnimating}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className={isAnimating ? 'animate-spin' : ''} />
            다른 카드 뽑기
          </Button>
        </div>
        
        {/* 장식용 배경 요소 */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default HappinessCardModal;
