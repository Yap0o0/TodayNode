import { toBlob } from 'html-to-image';

/**
 * DOM 요소를 이미지로 캡처하고 Blob으로 반환 (html-to-image 사용)
 * @param {HTMLElement} element - 캡처할 DOM 요소
 * @param {Object} options - html-to-image 옵션
 * @returns {Promise<Blob|null>} 캡처된 Blob 또는 null
 */
export const captureElementToBlob = async (element, options = {}) => {
    if (!element) return null;

    const defaultOptions = {
        quality: 0.95,
        backgroundColor: '#ffffff',
        ...options
    };

    try {
        return await toBlob(element, defaultOptions);
    } catch (error) {
        console.error('캡처 실패:', error);
        return null;
    }
};

/**
 * Blob을 파일로 다운로드
 * @param {Blob} blob - 다운로드할 이미지 Blob
 * @param {string} filename - 저장할 파일명
 */
export const downloadBlob = (blob, filename = 'haru-node.png') => {
    try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error('다운로드 실패:', error);
        return false;
    }
};

/**
 * Blob을 공유하거나 다운로드 (Web Share API)
 * @param {Blob} blob - 공유할 이미지 Blob
 * @param {Object} shareData - 공유 데이터 (title, text)
 * @param {string} filename - 파일명
 */
export const shareBlob = async (blob, shareData = {}, filename = 'haru-node.png') => {
    if (!blob) {
        alert('이미지 생성 실패');
        return false;
    }

    const file = new File([blob], filename, { type: 'image/jpeg' }); // 대부분 호환성을 위해 jpeg/png 사용

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: shareData.title || '하루 노드',
                text: shareData.text || '나의 하루 기록 #하루노드',
                files: [file],
            });
            return true;
        } catch (error) {
            console.log('공유 취소/에러:', error);
            return false;
        }
    } else {
        const success = downloadBlob(blob, filename);
        if (success) {
            alert('이미지가 저장되었습니다!');
        } else {
            alert('이미지 저장에 실패했습니다.');
        }
        return success;
    }
};

/**
 * 특정 요소를 캡처하고 다운로드 (간편 함수)
 * @param {HTMLElement} element - 캡처할 요소
 * @param {string} filename - 파일명
 */
export const captureAndDownload = async (element, filename = 'haru-node.jpg') => {
    const blob = await captureElementToBlob(element);
    if (blob) {
        const success = downloadBlob(blob, filename);
        if (success) {
            alert('이미지가 저장되었습니다!');
        }
        return success;
    } else {
        alert('이미지 생성에 실패했습니다.');
        return false;
    }
};

/**
 * 특정 요소를 캡처하고 공유 (간편 함수)
 * @param {HTMLElement} element - 캡처할 요소
 * @param {Object} shareData - 공유 데이터
 * @param {string} filename - 파일명
 */
export const captureAndShare = async (element, shareData = {}, filename = 'haru-node.jpg') => {
    const blob = await captureElementToBlob(element);
    if (blob) {
        return await shareBlob(blob, shareData, filename);
    } else {
        alert('이미지 생성에 실패했습니다.');
        return false;
    }
};
