/**
 * Mobile Haptics & Vibration Utility for Afriata
 * 
 * Provides safe, graceful tactile micro-feedback on supported touch devices (Android Chrome, etc.)
 * Silently no-ops in desktop browsers or environments where navigator.vibrate is unavailable.
 */

export type HapticFeedbackType = 'light' | 'medium' | 'selection' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticFeedbackType, number | number[]> = {
  light: 8,            // 8ms subtle micro-tick
  selection: 12,       // 12ms crisp state change
  medium: 22,          // 22ms button press / sheet snap
  success: [10, 30, 15], // Two-tone confirmation
  warning: [25, 40, 25]  // Two-tone warning
};

export function triggerHaptic(type: HapticFeedbackType = 'light'): void {
  if (typeof window === 'undefined') return;
  
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = HAPTIC_PATTERNS[type] ?? 8;
      navigator.vibrate(pattern);
    }
  } catch {
    // Non-blocking: silently ignore if vibration permission is denied or unsupported
  }
}

export default triggerHaptic;
