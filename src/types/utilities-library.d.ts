declare module "@rodrigo-barraza/utilities-library/rate" {
  export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number,
    options?: { leading?: boolean },
  ): T & { cancel: () => void; flush: () => void };

  export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    wait: number,
  ): T & { cancel: () => void };
}
