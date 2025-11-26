import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 여러 클래스 값을 결합하고 Tailwind CSS 클래스를 병합하는 유틸리티 함수입니다.
 * @param {...(string|Object|Array<string>)} inputs - 결합할 클래스 값들
 * @returns {string} 병합된 클래스 문자열
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
