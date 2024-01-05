//@ts-ignore
const {contextBridge, ipcRenderer} = require('electron');

const eventListeners = {};

contextBridge.exposeInMainWorld("ipcApi", {
  // ----- browser -> mainWorld -----
  getBotList: () => ipcRenderer.sendSync("db:get-bot-list", null),
  getCurrentBot: () => ipcRenderer.sendSync("bot:get-current-bot", null),
  restartCurrentBot: () => ipcRenderer.send("bot:restart-current-bot", null),
  restartBot: (name: string) => ipcRenderer.send("bot:restart-bot", name),
  startCurrentBot: () => ipcRenderer.send("bot:start-current-bot", null),
  startBot: (name) => ipcRenderer.send("bot:start-bot", name),
  botNameExists: (name) => ipcRenderer.sendSync("bot:name-exists", name),
  createBot: (data) => ipcRenderer.send("bot:create", data),
  changeSelectedBot: (data: string) => ipcRenderer.send("bot:change-selected", data),

  getPage: (name: string) => ipcRenderer.sendSync("get-page", name),
  getModal: (name: string) => ipcRenderer.sendSync("get-modal", name),

  getKnownEventList: () => ipcRenderer.sendSync("events:get-known-list", null),
  editEvent: (name: string) => ipcRenderer.send("events:edit", name),

  updateEditorCode: (data) => ipcRenderer.send("editor:update-code", data),

  evaluateRepl: (data) => ipcRenderer.sendSync("repl:evaluate", data),

  alertUpdateSize: (width, height) => ipcRenderer.sendSync("alert:update-size", { width, height }),
  closeAlert: () => ipcRenderer.send("alert:close", null),

  loadi18nNamespaces: () => ipcRenderer.sendSync("i18n:load-namespaces", null),
  getCurrentLanguage: () => ipcRenderer.sendSync("i18n:get-current-language", null),
  setCurrentLanguage: (lang) => ipcRenderer.sendSync("i18n:set-current-language", lang),

  getPluginList: () => ipcRenderer.sendSync("plugins:list", null),

  // ----- mainWorld -> browser -----
  addEventListener: (name, callback) => {
    if (!eventListeners[name]) {
      eventListeners[name] = [];

      ipcRenderer.on(name, (event, data) => {
        for (const i in eventListeners[name]) {
          eventListeners[name][i](data);
        }
      });
    }

    eventListeners[name].push(callback);
  }
});