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

    const [isProcessing, setIsProcessing] = React.useState(false);

    if (!isOpen || !entry) return null;

    const captureCard = async () => {
        if (!cardRef.current) return null;
        try {
            return await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null, // 투명 배경 지원 (필요 시)
            });
        } catch (error) {
            console.error('캡처 실패:', error);
            return null;
        }
    };

    const handleDownload = async () => {
        setIsProcessing(true);
        const canvas = await captureCard();

        if (canvas) {
            try {
                // JPG로 저장
                const image = canvas.toDataURL('image/jpeg', 0.95);
                const link = document.createElement('a');
                link.href = image;
                link.download = `haru-node-${entry.date}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('이미지가 저장되었습니다!');
            } catch (error) {
                console.error('이미지 저장 실패:', error);
                alert('이미지 저장에 실패했습니다.');
            }
        } else {
            alert('이미지 생성에 실패했습니다.');
        }
        setIsProcessing(false);
    };

    const handleShare = async () => {
        setIsProcessing(true);
        const canvas = await captureCard();

        if (canvas) {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('이미지 생성 실패');
                    setIsProcessing(false);
                    return;
                }

                const file = new File([blob], `haru-node-${entry.date}.jpg`, { type: 'image/jpeg' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: '하루 노드 일기',
                            text: `[${entry.date}] 오늘의 일기: ${entry.title}`,
                            files: [file],
                        });
                    } catch (error) {
                        console.log('공유 취소/에러:', error);
                    }
                } else {
                    alert('이 기기에서는 공유 기능을 지원하지 않습니다.');
                }
                setIsProcessing(false);
            }, 'image/jpeg', 0.95);
        } else {
            setIsProcessing(false);
            alert('이미지 생성에 실패했습니다.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
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
                        className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-inner mb-6 text-center border border-purple-100"
                    >
                        <div className="text-4xl mb-2">{entry.moodEmoji}</div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{entry.title || "무제"}</h4>
                        <p className="text-xs text-gray-500 mb-4">
                            {new Date(entry.timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-700 leading-relaxed break-keep font-medium text-sm line-clamp-6">
                            {entry.content}
                        </p>
                        <div className="mt-4 pt-4 border-t border-purple-200 flex justify-center gap-2 flex-wrap">
                            {entry.tags && entry.tags.map(tag => (
                                <span key={tag} className="text-xs text-purple-600 bg-white px-2 py-1 rounded-full shadow-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 text-[10px] text-gray-400 font-serif uppercase tracking-widest">
                            Haru Node
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownload}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">처리 중...</span>
                            ) : (
                                <>
                                    <Download size={18} />
                                    <span>저장</span>
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleShare}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 py-3"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">처리 중...</span>
                            ) : (
                                <>
                                    <Share2 size={18} />
                                    <span>공유</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
