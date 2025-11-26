// src/components/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * 재사용 가능한 모달 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부
 * @param {function} props.onClose - 모달 닫기 요청 시 호출될 함수
 * @param {string} props.title - 모달 헤더에 표시될 제목
 * @param {React.ReactNode} props.children - 모달 본문에 표시될 내용
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="modal-content max-h-96 overflow-y-auto pr-2"> {/* 스크롤 가능하도록 설정 */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
