import React, { useState, useEffect } from 'react';
import { Bell, Download, Upload, AlertCircle, Check } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Button } from '../components/Button';

/**
 * 설정 페이지 컴포넌트
 * 알림 설정 및 데이터 백업/복구 기능을 제공합니다.
 */
const SettingsPage = () => {
    const { entries, importEntries } = useHabits();
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [importStatus, setImportStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // 알림 권한 요청
    const handleRequestPermission = async () => {
        if (!('Notification' in window)) {
            alert('이 브라우저는 알림을 지원하지 않습니다.');
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
            new Notification('하루 노드 알림 설정 완료', {
                body: '이제 매일 저녁 9시에 기록 알림을 보내드릴게요!',
                icon: '/vite.svg'
            });
        }
    };

    // 데이터 내보내기 (JSON 다운로드)
    const handleExportData = () => {
        const dataStr = JSON.stringify(entries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `haru-node-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // 데이터 가져오기 (JSON 업로드)
    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedEntries = JSON.parse(e.target.result);
                if (!Array.isArray(importedEntries)) {
                    throw new Error('Invalid data format');
                }

                importEntries(importedEntries);

                setImportStatus('success');
                setTimeout(() => setImportStatus(null), 3000);
            } catch (error) {
                console.error('Import failed:', error);
                setImportStatus('error');
                setTimeout(() => setImportStatus(null), 3000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-page p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">설정</h2>

            {/* 알림 설정 섹션 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                        <Bell size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">알림 설정</h3>
                </div>
                <p className="text-gray-600 mb-4">
                    매일 저녁 9시에 하루를 기록하도록 알림을 받을 수 있어요.
                </p>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-700 font-medium">브라우저 알림</span>
                    {notificationPermission === 'granted' ? (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            <Check size={18} /> 허용됨
                        </span>
                    ) : (
                        <Button onClick={handleRequestPermission} className="text-sm">
                            알림 켜기
                        </Button>
                    )}
                </div>
            </div>

            {/* 데이터 백업 섹션 */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <Download size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">데이터 백업</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    소중한 기록을 잃어버리지 않도록 데이터를 백업하거나 복구하세요.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 내보내기 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Download size={18} /> 내보내기
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                            모든 기록을 JSON 파일로 다운로드합니다.
                        </p>
                        <Button onClick={handleExportData} variant="outline" className="w-full">
                            데이터 다운로드
                        </Button>
                    </div>

                    {/* 가져오기 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Upload size={18} /> 가져오기
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                            백업한 JSON 파일을 불러와 복구합니다.
                        </p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button variant="outline" className="w-full">
                                파일 선택
                            </Button>
                        </div>
                        {importStatus === 'success' && (
                            <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                                <Check size={12} /> 가져오기 성공!
                            </p>
                        )}
                        {importStatus === 'error' && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle size={12} /> 파일 형식이 올바르지 않습니다.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
