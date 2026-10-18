/**
 * Utility for detecting Android interactive classroom screens (Clevertouch, SMART, Promethean, ViewSonic),
 * tablets, and touch displays, providing optimized rendering profiles and GPU relief.
 */

export interface DeviceProfile {
  isAndroid: boolean;
  isTouch: boolean;
  isClassroomBoardLikely: boolean;
  recommendedBoardMode: boolean;
  deviceLabel: string;
}

export const detectDeviceProfile = (): DeviceProfile => {
  if (typeof window === 'undefined') {
    return {
      isAndroid: false,
      isTouch: false,
      isClassroomBoardLikely: false,
      recommendedBoardMode: false,
      deviceLabel: 'Środowisko standardowe',
    };
  }

  const ua = (window.navigator?.userAgent || '').toLowerCase();
  const maxTouchPoints = window.navigator?.maxTouchPoints || 0;
  const isTouch = maxTouchPoints > 0 || 'ontouchstart' in window;

  const isAndroid = /android/i.test(ua);
  const isCrOS = /cros/i.test(ua);
  const isIPad = /ipad/i.test(ua) || (maxTouchPoints > 1 && /macintosh/i.test(ua));

  // Interactive classroom displays often run Android/Chromium WebView on 1080p or 4K panels
  const isLargeScreen = (typeof window.screen !== 'undefined' && window.screen.width >= 1280) || window.innerWidth >= 1280;
  const isBoardBrand = /(clevertouch|promethean|smarttech|smartboard|viewsonic|newline|benq|interactive|touchscreen)/i.test(ua);

  const isClassroomBoardLikely = (isAndroid && isLargeScreen && isTouch) || isBoardBrand || (isCrOS && isTouch);

  // Recommend Board Mode if it's an Android screen, tablet, or touch display >= 1024px
  const recommendedBoardMode = isClassroomBoardLikely || (isAndroid && isTouch) || (isTouch && window.innerWidth >= 1024);

  let deviceLabel = 'Komputer stacjonarny / Laptop';
  if (isClassroomBoardLikely) {
    deviceLabel = 'Szkolna tablica interaktywna (Android)';
  } else if (isAndroid) {
    deviceLabel = 'Tablet / Ekran z systemem Android';
  } else if (isIPad) {
    deviceLabel = 'Tablet iPad';
  } else if (isTouch) {
    deviceLabel = 'Urządzenie z ekranem dotykowym';
  }

  return {
    isAndroid,
    isTouch,
    isClassroomBoardLikely,
    recommendedBoardMode,
    deviceLabel,
  };
};

/**
 * Apply performance classes to root document when Board Mode is active
 */
export const applyBoardModeDOM = (isBoardMode: boolean): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isBoardMode) {
    root.classList.add('classroom-board-mode');
  } else {
    root.classList.remove('classroom-board-mode');
  }
};
