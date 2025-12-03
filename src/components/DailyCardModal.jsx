import React, { useRef, useState } from 'react';
import { X, Download, Music, Sparkles, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from './Button';

const DailyCardModal = ({ isOpen, onClose, entry, movieQuote }) => {
    const cardRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    console.log("DailyCardModal Props:", { isOpen, entry, movieQuote });
    if (entry) {
        console.log("Music Data:", entry.selectedMusic);
        console.log("Tags Data:", entry.tags);
    }

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
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex justify-center items-center">
                    <div
                        ref={cardRef}
                        className="w-full aspect-[4/5] card flex flex-col relative overflow-hidden"
                        style={{
                            margin: 0,
                            boxShadow: 'none',
                            backgroundColor: themeColor ? `${themeColor}40` : '#ffffff', // 테마 색상에 25% 투명도 적용 (Hex 40)
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${themeColor ? `${themeColor}60` : '#e5e7eb'}`,
                        }}
                    >
                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full p-2">
                            {/* 1. Date (Top Left) */}
                            <div className="text-sm font-bold text-[var(--text-sub)] mb-2 font-sans">
                                {formattedDate}
                            </div>

                            {/* 2. Mood & Tags (Center Top) */}
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="text-7xl mb-3 drop-shadow-sm">{moodEmoji}</div>
                                {/* Tags - Increased size */}
                                {entry.tags && entry.tags.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {entry.tags.map(tag => (
                                            <span key={tag} className="text-sm font-medium text-[var(--text-main)] bg-white/60 px-3 py-1 rounded-full shadow-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. Movie Quote (Center) - Fixed visibility */}
                            {movieQuote ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-2">
                                    <p className="text-xl font-bold text-[var(--text-main)] italic leading-relaxed mb-3 break-keep drop-shadow-sm">
                                        "{movieQuote.quote}"
                                    </p>
                                    <p className="text-base text-[var(--text-sub)] font-medium">
                                        - {movieQuote.movie} -
                                    </p>
                                </div>
                            ) : (
                                // 명대사 데이터가 없을 경우 공간 확보를 위한 빈 영역 (또는 로딩/안내 메시지)
                                <div className="flex-1 flex items-center justify-center text-[var(--text-sub)] text-sm">
                                    명대사를 불러오는 중...
                                </div>
                            )}

                            {/* 4. Music (Bottom) */}
                            {selectedMusic && (
                                <div className="flex-shrink-0 flex items-center gap-4 bg-white/50 backdrop-blur-md rounded-2xl p-4 mt-auto border border-white/60 shadow-sm">
                                    {(selectedMusic.album?.images?.[0]?.url || selectedMusic.albumArt) ? (
                                        <img
                                            src={selectedMusic.album?.images?.[0]?.url || selectedMusic.albumArt}
                                            alt="Album Art"
                                            className="w-14 h-14 rounded-xl shadow-md object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center shadow-md">
                                            <Music size={24} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-base font-bold truncate text-[var(--text-main)] leading-tight mb-1">{selectedMusic.name}</div>
                                        <div className="text-sm text-[var(--text-sub)] truncate leading-tight">
                                            {selectedMusic.artists?.map(a => a.name).join(', ') || selectedMusic.artist}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Branding */}
                            <div className="mt-4 text-center">
                                <span className="text-[10px] font-bold text-[var(--text-sub)] opacity-60 uppercase tracking-widest">Today Node</span>
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
