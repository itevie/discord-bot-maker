//@ts-ignore
const {contextBridge, ipcRenderer} = require('electron');

const eventListeners = {};

contextBridge.exposeInMainWorld("ipcApi", {
  // ----- browser -> mainWorld -----
  getBotList: () => ipcRenderer.sendSync("db:get-bot-list", null),
  getCurrentBot: () => ipcRenderer.sendSync("bot:get-current-bot", null),
  restartCurrentBot: () => ipcRenderer.send("bot:restart-current-bot", null),
  startCurrentBot: () => ipcRenderer.send("bot:start-current-bot", null),

  getPage: (name: string) => ipcRenderer.sendSync("get-page", name),

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