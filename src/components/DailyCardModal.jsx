import React, { useRef, useState } from 'react';
import { X, Download, Music, Sparkles, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from './Button';

const DailyCardModal = ({ isOpen, onClose, entry }) => {
    const cardRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !entry) return null;

    const captureCard = async () => {
        if (!cardRef.current) return null;
        try {
            return await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null, // 투명 배경 지원 (둥근 모서리 유지)
                useCORS: true,
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
                // PNG로 저장 (투명 배경 지원)
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `haru-node_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('이미지가 저장되었습니다!');
            } catch (error) {
                console.error('다운로드 에러:', error);
                alert('이미지 저장 중 오류가 발생했습니다.');
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
            // 모바일/공유: Blob -> File 사용 (PNG)
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('이미지 생성 실패');
                    setIsProcessing(false);
                    return;
                }

                const file = new File([blob], `haru-node_${Date.now()}.png`, { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: '하루 노드',
                            text: `오늘 나의 기분은 ${entry.mood}! #하루노드`,
                            files: [file],
                        });
                    } catch (error) {
                        console.log('공유 취소/에러:', error);
                    }
                } else {
                    alert('이 기기에서는 공유 기능을 지원하지 않습니다.');
                }
                setIsProcessing(false);
            }, 'image/png');
        } else {
            setIsProcessing(false);
            alert('이미지 생성에 실패했습니다.');
        }
    };

    const { date, mood, moodEmoji, content, selectedMusic, themeColor } = entry;
    const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">하루 공유 카드</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Card Preview Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex justify-center">
                    <div
                        ref={cardRef}
                        className="w-full aspect-[4/5] rounded-[24px] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${themeColor || '#FCD34D'} 0%, white 100%)`,
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Sparkles size={100} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Date */}
                            <div className="text-sm font-medium opacity-70 mb-1">{formattedDate}</div>

                            {/* Mood */}
                            <div className="flex flex-col items-center justify-center flex-1 my-2">
                                <div className="text-6xl mb-2 drop-shadow-md filter">{moodEmoji}</div>
                                <div className="text-xl font-bold text-gray-800">{mood}</div>
                            </div>

                            {/* Memo */}
                            {content && (
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 text-sm text-gray-700 line-clamp-3">
                                    "{content}"
                                </div>
                            )}

                            {/* Music */}
                            {selectedMusic && (
                                <div className="flex-shrink-0 flex items-center gap-3 bg-black/5 backdrop-blur-sm rounded-xl p-3 mt-auto">
                                    {selectedMusic.album?.images?.[0]?.url ? (
                                        <img
                                            src={selectedMusic.album.images[0].url}
                                            alt="Album Art"
                                            className="w-12 h-12 rounded-lg shadow-sm object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <Music size={20} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate text-gray-900 leading-tight">{selectedMusic.name}</div>
                                        <div className="text-xs text-gray-600 truncate leading-tight mt-0.5">
                                            {selectedMusic.artists?.map(a => a.name).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Branding */}
                            <div className="mt-3 text-center">
                                <span className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Today Node</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
                    <Button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-lg bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">처리 중...</span>
                        ) : (
                            <>
                                <Download size={20} />
                                <span>저장</span>
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-lg"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">처리 중...</span>
                        ) : (
                            <>
                                <Share2 size={20} />
                                <span>공유</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DailyCardModal;
