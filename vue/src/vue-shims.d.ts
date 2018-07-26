declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare const System: any;
declare const _: any;
declare const wx: any;

declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;

declare function clearTimeout(timeoutId: number): void;

declare function clearInterval(intervalId: number): void;
