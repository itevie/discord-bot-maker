interface AppDetails {
  isReady: boolean,
  baseDirectory: string;
  getWindow: () => Electron.BrowserWindow;
}

declare global {
  const __app: AppDetails = {};
}

export { }