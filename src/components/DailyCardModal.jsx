import React, { useRef, useState } from 'react';
import { X, Download, Music, Share2 } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { Button } from './Button';

const DailyCardModal = ({ isOpen, onClose, entry, movieQuote }) => {
    const cardRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !entry) return null;

    const captureCard = async () => {
        if (!cardRef.current) return null;

        try {
            // html-to-image를 사용하여 보이는 그대로 캡처 (SVG foreignObject 방식)
            const blob = await toBlob(cardRef.current, {
                quality: 0.95,
                backgroundColor: '#ffffff', // 투명 배경 뒤에 흰색을 깔아서 파스텔톤 구현
                style: {
                    margin: '0', // 캡처 시 불필요한 마진 제거
                    borderRadius: '0', // 직사각형 모양으로 캡처
                    boxShadow: 'none', // 그림자 제거
                    backgroundColor: entry.themeColor ? `${entry.themeColor}40` : '#ffffff', // 25% 투명도 (사용자 요청)
                }
            });
            return blob;
        } catch (error) {
            console.error('캡처 실패:', error);
            return null;
        }
    };

    const handleDownload = async () => {
        setIsProcessing(true);
        try {
            const blob = await captureCard();
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `haru-node_${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                alert('이미지가 저장되었습니다!');
            } else {
                throw new Error('이미지 생성 실패');
            }
        } catch (error) {
            console.error(error);
            alert('이미지 생성에 실패했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleShare = async () => {
        setIsProcessing(true);
        try {
            const blob = await captureCard();
            if (!blob) throw new Error('이미지 생성 실패');

            const file = new File([blob], `haru-node_${Date.now()}.jpg`, { type: 'image/jpeg' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: '하루 노드',
                    text: `오늘 나의 기분은 ${entry.mood}! #하루노드`,
                    files: [file],
                });
            } else {
                alert('이 기기에서는 공유 기능을 지원하지 않습니다. 이미지로 저장합니다.');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `haru-node_${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('공유 실패:', error);
            alert('이미지 공유/저장에 실패했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const { date, mood, moodEmoji, content, selectedMusic, themeColor } = entry;
    // 날짜 포맷팅
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
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110">
                        <X size={24} />
                    </button>
                </div>

                {/* Card Preview Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex justify-center items-center">
                    <div
                        ref={cardRef}
                        className="w-full aspect-[4/5] card flex flex-col relative overflow-hidden daily-card-capture"
                        style={{
                            margin: 0,
                            boxShadow: 'none',
                            backgroundColor: themeColor ? `${themeColor}40` : '#ffffff', // 테마 색상 25% 투명도
                            border: `1px solid ${themeColor ? `${themeColor}60` : '#e5e7eb'}`,
                        }}
                    >
                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full p-2">
                            {/* 1. Date (Top Left) */}
                            <div className="text-sm font-bold text-[var(--text-sub)] mb-2 font-sans">
                                {formattedDate}
                            </div>

                            {/* Flexible Spacer 1 */}
                            <div className="flex-1" />

                            {/* 2. Mood & Tags (Center Top) */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-7xl mb-3 drop-shadow-sm">{moodEmoji}</div>
                                {/* Tags */}
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

                            {/* Flexible Spacer 2 */}
                            <div className="flex-1" />

                            {/* 3. Movie Quote (Center) */}
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                {(movieQuote && movieQuote.quote) ? (
                                    <>
                                        <p className="text-xl font-bold text-[var(--text-main)] italic leading-relaxed mb-3 break-keep drop-shadow-sm">
                                            "{movieQuote.quote}"
                                        </p>
                                        <p className="text-base text-[var(--text-sub)] font-medium">
                                            - {movieQuote.movie} -
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-[var(--text-sub)] text-sm opacity-70">
                                        <p>오늘의 명대사를 불러오는 중...</p>
                                    </div>
                                )}
                            </div>

                            {/* Flexible Spacer 3 */}
                            <div className="flex-1" />

                            {/* 4. Music (Bottom) */}
                            {selectedMusic && (
                                <div className="flex-shrink-0 flex items-center gap-4 bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm">
                                    {(selectedMusic.album?.images?.[0]?.url || selectedMusic.albumArt) ? (
                                        <img
                                            src={(selectedMusic.album?.images?.[0]?.url || selectedMusic.albumArt) + '?t=' + new Date().getTime()}
                                            alt="Album Art"
                                            className="w-14 h-14 rounded-xl shadow-md object-cover"
                                            crossOrigin="anonymous" // CORS 권한 요청
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center shadow-md">
                                            <Music size={24} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-[16px] font-bold truncate text-[var(--text-main)] leading-tight mb-1">{selectedMusic.name}</div>
                                        <div className="text-[14px] text-[var(--text-sub)] truncate leading-tight">
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
                <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-md flex gap-3">
                    <Button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-lg rounded-xl transition-all hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: isProcessing ? '#9CA3AF' : (themeColor || '#4B5563'),
                            color: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">저장 중...</span>
                        ) : (
                            <>
                                <Download size={20} />
                                <span>이미지 저장</span>
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-lg rounded-xl transition-all hover:scale-105 active:scale-95"
                        variant="outline"
                        style={{
                            borderColor: themeColor || '#E5E7EB',
                            color: themeColor ? '#1F2937' : '#374151',
                            backgroundColor: '#fff',
                        }}
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">공유 중...</span>
                        ) : (
                            <>
                                <Share2 size={20} />
                                <span>공유하기</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DailyCardModal;
