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
  user?: {
    username: string;
    avatar: string;
  }
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
  },
  quickFixes: {
    name: string,
    actions: string[],
  }[];
}

export interface Events {
  "log": (data: LogItem) => void;
  "app-ready": (data: null) => void;
  "identify": (data: any) => void;
  "editor-error": (data: DError) => void;
  "alerts:uncaught_error": (data: {error_code: string, stack: string}) => void;
  "alerts:unknown_uncaught_error": (data: {message: string, stack: string}) => void;
  "alerts:uncaught_language_error": (data: DError) => void;
}

interface IpcApi {
  getBotList: () => RunningBotItem[];
  getCurrentBot: () => Bot;
  restartCurrentBot: () => void;
  restartBot: (name: string) => void;
  startCurrentBot: () => void;
  startBot: (name: string) => void;
  stopCurrentBot: () => void;
  stopBot: (name: string) => void;
  botNameExists: (name: string) => boolean;
  createBot: (data: {name: string, token: string}) => void;
  changeSelectedBot: (name: string) => void;
  getGuildList: (name: string) => { name: string, avatar: string, id: string }[];
  leaveServer: (bot: string, guildId: string) => void;

  getPage: (name: string) => string;
  getModal: (name: string) => string;

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