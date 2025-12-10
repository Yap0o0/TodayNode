import React, { useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from './Button';
import { captureAndDownload, captureAndShare } from '../utils/shareUtils';

/**
 * 일기 공유 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {object} entry - 공유할 일기 데이터
 */
const ShareModal = ({ isOpen, onClose, entry }) => {
    const cardRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !entry) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsProcessing(true);

        await captureAndDownload(
            cardRef.current,
            `haru-node-${entry.date}.png`,
            {
                backgroundColor: null // 투명 배경 유지
            }
        );

        setIsProcessing(false);
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsProcessing(true);

        const shareData = {
            title: '하루 노드 일기',
            text: `[${entry.date}] 오늘의 일기: ${entry.moodEmoji} #하루노드`
        };

        await captureAndShare(
            cardRef.current,
            shareData,
            `haru-node-${entry.date}.png`,
            {
                backgroundColor: null // 투명 배경 유지
            }
        );

        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* 헤더 */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Share2 size={24} className="text-purple-500" />
                        카드 공유하기
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50 flex flex-col items-center">
                    {/* 캡처 영역 */}
                    <div className="relative shadow-xl rounded-xl overflow-visible mx-auto my-4 transition-transform hover:scale-[1.02] duration-300">
                        <div
                            ref={cardRef}
                            className="share-card-content bg-gradient-to-br from-white to-purple-50 p-8 rounded-xl text-center w-[320px] relative overflow-hidden"
                            style={{ border: '1px solid rgba(255,255,255,0.5)' }}
                        >
                            {/* 데코레이션 */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 opacity-70"></div>

                            <div className="text-6xl mb-4 drop-shadow-sm transform hover:scale-110 transition-transform duration-300 cursor-default">
                                {entry.moodEmoji}
                            </div>

                            <h4 className="text-xl font-bold text-gray-800 mb-2 font-['Gamja_Flower'] tracking-wide">
                                {entry.title || "무제"}
                            </h4>

                            <p className="text-sm text-gray-400 mb-6 font-medium bg-white/60 inline-block px-3 py-1 rounded-full">
                                {new Date(entry.timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                            </p>

                            <div className="text-gray-700 leading-relaxed font-['Gamja_Flower'] text-lg mb-6 whitespace-pre-wrap break-words line-clamp-6 text-left px-2">
                                {entry.content}
                            </div>

                            <div className="border-t border-purple-100 pt-4 flex justify-center gap-2 flex-wrap">
                                {entry.tags && entry.tags.map(tag => (
                                    <span key={tag} className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 opacity-50">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Haru Node</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                        이미지가 갤러리에 저장되거나 공유 옵션이 열립니다.
                    </p>
                </div>

                {/* 푸터 */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 sticky bottom-0 z-10 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                    <Button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse text-sm">처리 중...</span>
                        ) : (
                            <>
                                <Download size={18} />
                                <span className="font-bold">저장</span>
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={isProcessing}
                        className="flex-[1.5] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-purple-200 transition-all"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse text-sm">처리 중...</span>
                        ) : (
                            <>
                                <Share2 size={18} />
                                <span className="font-bold">공유하기</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
