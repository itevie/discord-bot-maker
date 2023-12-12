// To trick typescript into thinking ipc is the IpcApi interface.
let ipc: IpcApi;
//@ts-ignore
ipc = ipcApi;

interface LogItem {
  contents: string;
  type: string;
  isDebug: boolean;
}

export interface RunningBotItem {
  name: string;
  isRunning: boolean;
  startedAt: number;
}

export interface Bot {
  name: string;
}

export interface DError {
  errorCode: string;
  stack: string;
  context: {[key: string]: string},
  message: string;
  location: {
    charStart: number,
    charEnd: number,
    line: number,
  }
}

export interface Events {
  "log": (data: LogItem) => void;
  "app-ready": (data: null) => void;
  "identify": (data: any) => void;
  "editor-error": (data: DError) => void;
}

interface IpcApi {
  getBotList: () => RunningBotItem[];
  getCurrentBot: () => Bot;
  restartCurrentBot: () => void;
  startCurrentBot: () => void;

  getPage: (name: string) => string;

  getKnownEventList: () => string[];
  editEvent: (name: string) => void;

  alertUpdateSize: (width: number, height: number) => void;
  closeAlert: () => void;

  loadi18nNamespaces: () => { lng: string, ns: string, data: object }[];
  getCurrentLanguage: () => string;
  setCurrentLanguage: (lang: string) => void;

  updateEditorCode: (data: { type: "event", name: string, newData: string }) => void;

  evaluateRepl: (data: string) => string;

  getPluginList: () => {[key: string]: any};

  // ----- Event Listener types -----
  addEventListener: <T extends keyof Events>(name: T, callback: Events[T]) => void;
}

export default ipc;