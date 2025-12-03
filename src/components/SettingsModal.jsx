import React, { useState, useEffect } from 'react';
import { Bell, Download, Upload, AlertCircle, Check, X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Button } from './Button';

const SettingsModal = ({ isOpen, onClose }) => {
    const { entries, importEntries } = useHabits();
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [importStatus, setImportStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">설정</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* 알림 설정 섹션 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                <Bell size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">알림 설정</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            매일 저녁 9시에 하루를 기록하도록 알림을 받을 수 있어요.
                        </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700 font-medium">브라우저 알림</span>
                            {notificationPermission === 'granted' ? (
                                <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                                    <Check size={16} /> 허용됨
                                </span>
                            ) : (
                                <Button onClick={handleRequestPermission} size="sm" className="text-xs">
                                    알림 켜기
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 데이터 백업 섹션 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                <Download size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">데이터 백업</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            소중한 기록을 잃어버리지 않도록 데이터를 백업하거나 복구하세요.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            {/* 내보내기 */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-bold text-gray-700 text-sm mb-1 flex items-center gap-2">
                                    <Download size={16} /> 내보내기
                                </h4>
                                <p className="text-xs text-gray-500 mb-3">
                                    모든 기록을 JSON 파일로 다운로드합니다.
                                </p>
                                <Button onClick={handleExportData} variant="outline" size="sm" className="w-full">
                                    데이터 다운로드
                                </Button>
                            </div>

                            {/* 가져오기 */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-bold text-gray-700 text-sm mb-1 flex items-center gap-2">
                                    <Upload size={16} /> 가져오기
                                </h4>
                                <p className="text-xs text-gray-500 mb-3">
                                    백업한 JSON 파일을 불러와 복구합니다.
                                </p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportData}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Button variant="outline" size="sm" className="w-full">
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
            </div>
        </div>
    );
};

export default SettingsModal;
