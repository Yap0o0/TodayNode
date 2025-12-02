import React from 'react';
import { Award, Star, Trophy, Medal } from 'lucide-react';

/**
 * 뱃지 목록 컴포넌트
 * @param {array} badges - 획득한 뱃지 목록 (객체 배열)
 */
const BadgeList = ({ badges }) => {
    // 뱃지 정의 (ID로 매핑)
    const badgeDefinitions = {
        'beginner': {
            icon: <Star size={24} />,
            title: '작심삼일 탈출',
            description: '일기를 3개 이상 작성했어요.',
            color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        },
        'emotion_master': {
            icon: <Award size={24} />,
            title: '감정 표현가',
            description: '5가지 이상의 다양한 감정을 기록했어요.',
            color: 'text-purple-600 bg-purple-100 border-purple-200',
        },
        'pro_writer': {
            icon: <Trophy size={24} />,
            title: '기록 마스터',
            description: '총 10개 이상의 일기를 작성했어요.',
            color: 'text-blue-600 bg-blue-100 border-blue-200',
        },
        'early_bird': {
            icon: <Medal size={24} />,
            title: '얼리 버드',
            description: '오전 9시 이전에 일기를 작성했어요.',
            color: 'text-orange-600 bg-orange-100 border-orange-200',
        }
    };

    if (!badges || badges.length === 0) {
        return (
            <div className="text-center p-6 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                <Award size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-[var(--text-sub)]">아직 획득한 뱃지가 없어요.</p>
                <p className="text-sm text-gray-400 mt-1">꾸준히 기록하고 뱃지를 모아보세요!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badgeId, index) => {
                const def = badgeDefinitions[badgeId];
                if (!def) return null;

                // 스티커 느낌을 위한 약간의 회전 효과 (짝수/홀수 다르게)
                const rotateClass = index % 2 === 0 ? 'rotate-1' : '-rotate-1';

                return (
                    <div key={badgeId} className={`flex items-center p-4 rounded-xl shadow-sm border-2 ${def.color} ${rotateClass} transition-transform hover:scale-105 hover:rotate-0`}>
                        <div className={`p-3 rounded-full mr-4 bg-white/60`}>
                            {def.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-[var(--text-main)]">{def.title}</h4>
                            <p className="text-xs text-[var(--text-sub)]">{def.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BadgeList;
