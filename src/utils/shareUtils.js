import html2canvas from 'html2canvas';

/**
 * DOM 요소를 이미지로 캡처하는 유틸리티 함수
 * @param {HTMLElement} element - 캡처할 DOM 요소
 * @param {Object} options - html2canvas 옵션
 * @returns {Promise<HTMLCanvasElement|null>} 캡처된 캔버스 또는 null
 */
export const captureElement = async (element, options = {}) => {
    if (!element) return null;

    const defaultOptions = {
        scale: 3, // 고해상도
        backgroundColor: '#ffffff', // 흰색 배경
        useCORS: true, // 외부 이미지 로드 허용
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            // 캡처 시 텍스트 잘림 방지 (line-clamp 제거)
            const textElements = clonedDoc.querySelectorAll('[class*="line-clamp"]');
            textElements.forEach(el => {
                el.style.display = 'block';
                el.style.overflow = 'visible';
                el.style.webkitLineClamp = 'unset';
                el.style.maxHeight = 'none';
            });
        },
        ...options
    };

    try {
        return await html2canvas(element, defaultOptions);
    } catch (error) {
        console.error('캡처 실패:', error);
        return null;
    }
};

/**
 * 캔버스를 PNG 파일로 다운로드
 * @param {HTMLCanvasElement} canvas - 다운로드할 캔버스
 * @param {string} filename - 저장할 파일명
 */
export const downloadCanvasAsPNG = (canvas, filename = 'haru-node.png') => {
    try {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch (error) {
        console.error('다운로드 실패:', error);
        return false;
    }
};

/**
 * 캔버스를 Web Share API를 통해 공유 또는 다운로드
 * @param {HTMLCanvasElement} canvas - 공유할 캔버스
 * @param {Object} shareData - 공유 데이터 (title, text)
 * @param {string} filename - 파일명
 */
export const shareCanvas = async (canvas, shareData = {}, filename = 'haru-node.png') => {
    return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert('이미지 생성 실패');
                resolve(false);
                return;
            }

            const file = new File([blob], filename, { type: 'image/png' });

            // Web Share API 지원 확인
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: shareData.title || '하루 노드',
                        text: shareData.text || '나의 하루 기록 #하루노드',
                        files: [file],
                    });
                    resolve(true);
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('공유 취소');
                    } else {
                        console.error('공유 오류:', error);
                    }
                    resolve(false);
                }
            } else {
                // Web Share API 미지원 시 다운로드로 대체
                const success = downloadCanvasAsPNG(canvas, filename);
                if (success) {
                    alert('이미지가 저장되었습니다!');
                } else {
                    alert('이미지 저장에 실패했습니다.');
                }
                resolve(success);
            }
        }, 'image/png');
    });
};

/**
 * 특정 요소를 캡처하고 다운로드
 * @param {HTMLElement} element - 캡처할 요소
 * @param {string} filename - 파일명
 */
export const captureAndDownload = async (element, filename = 'haru-node.png') => {
    const canvas = await captureElement(element);
    if (canvas) {
        const success = downloadCanvasAsPNG(canvas, filename);
        if (success) {
            alert('이미지가 저장되었습니다!');
        } else {
            alert('이미지 저장에 실패했습니다.');
        }
        return success;
    } else {
        alert('이미지 생성에 실패했습니다.');
        return false;
    }
};

/**
 * 특정 요소를 캡처하고 공유
 * @param {HTMLElement} element - 캡처할 요소
 * @param {Object} shareData - 공유 데이터
 * @param {string} filename - 파일명
 */
export const captureAndShare = async (element, shareData = {}, filename = 'haru-node.png') => {
    const canvas = await captureElement(element);
    if (canvas) {
        return await shareCanvas(canvas, shareData, filename);
    } else {
        alert('이미지 생성에 실패했습니다.');
        return false;
    }
};
