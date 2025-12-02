import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from './Button';

/**
 * 일기 공유 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {object} entry - 공유할 일기 데이터
 */
const ShareModal = ({ isOpen, onClose, entry }) => {
    const cardRef = useRef(null);

    if (!isOpen || !entry) return null;

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2, // 고해상도 캡처
                    backgroundColor: null, // 투명 배경 지원 (필요 시)
                });
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `haru-node-${entry.date}.png`;
                link.click();
            } catch (error) {
                console.error('이미지 저장 실패:', error);
                alert('이미지 저장에 실패했습니다.');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Share2 size={24} className="text-purple-500" />
                        오늘의 하루 공유하기
                    </h3>

                    {/* 캡처 영역 */}
                    <div
                        ref={cardRef}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-inner mb-6 text-center border border-purple-100"
                    >
                        <div className="text-4xl mb-4">{entry.moodEmoji}</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{entry.title || "무제"}</h4>
                        <p className="text-sm text-gray-500 mb-6">
                            {new Date(entry.timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-700 leading-relaxed break-keep font-medium">
                            {entry.content}
                        </p>
                        <div className="mt-6 pt-4 border-t border-purple-200 flex justify-center gap-2 flex-wrap">
                            {entry.tags && entry.tags.map(tag => (
                                <span key={tag} className="text-xs text-purple-600 bg-white px-2 py-1 rounded-full shadow-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-gray-400 font-serif">
                            Haru Node - 하루를 기록하다
                        </div>
                    </div>

                    <Button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        이미지로 저장하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
