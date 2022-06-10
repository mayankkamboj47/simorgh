declare global {
  interface Window {
    requirejs: any;
    dotcom: any;
  }
}

export interface FontProps {
  script: string;
  service: string;
}
