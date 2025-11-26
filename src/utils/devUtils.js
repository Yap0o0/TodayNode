/**
 * 개발 및 시연을 위한 테스트 데이터 생성 유틸리티입니다.
 * 브라우저 콘솔에서 함수를 호출하여 사용할 수 있습니다.
 */

import { saveToLocalStorage, loadFromLocalStorage } from './localStorageUtils';

const LOCAL_STORAGE_KEY = 'haru-node-logs';

/**
 * 지난 7일간의 랜덤한 감정 기록을 생성합니다.
 * @param {number} count - 생성할 기록의 개수 (기본값: 5)
 */
export const generateTestData = (count = 5) => {
    const moods = ['happy', 'excited', 'calm', 'soso', 'depressed', 'angry'];
    const moodLabels = {
        happy: '행복',
        excited: '신남',
        calm: '편안',
        soso: '그저',
        depressed: '우울',
        angry: '화남'
    };
    const tags = ['#운동', '#공부', '#카페', '#친구', '#휴식', '#독서', '#영화'];

    const currentEntries = loadFromLocalStorage(LOCAL_STORAGE_KEY, []);
    const newEntries = [];

    for (let i = 0; i < count; i++) {
        const randomMoodId = moods[Math.floor(Math.random() * moods.length)];
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        const date = new Date();
        date.setDate(date.getDate() - i); // 오늘부터 하루씩 과거로

        const entry = {
            id: `test-entry-${Date.now()}-${i}`,
            timestamp: date.toISOString(),
            date: date.toISOString(),
            moodId: randomMoodId,
            mood: moodLabels[randomMoodId],
            moodEmoji: '🧪', // 테스트 데이터임을 표시
            tags: [randomTag],
            content: `테스트 데이터입니다. (${i + 1}일 전)`,
            musicRecommendation: [],
            selectedMusic: null
        };
        newEntries.push(entry);
    }

    const updatedEntries = [...currentEntries, ...newEntries];
    saveToLocalStorage(LOCAL_STORAGE_KEY, updatedEntries);

    console.log(`✅ ${count}개의 테스트 데이터가 생성되었습니다! 새로고침하여 확인하세요.`);
    return updatedEntries;
};

// 윈도우 객체에 등록하여 콘솔에서 접근 가능하게 함
if (typeof window !== 'undefined') {
    window.generateTestData = generateTestData;
}
