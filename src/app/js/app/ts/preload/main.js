//@ts-ignore
const { contextBridge, ipcRenderer } = require('electron');
const eventListeners = {};
contextBridge.exposeInMainWorld("ipcApi", {
    // ----- browser -> mainWorld -----
    getBotList: () => ipcRenderer.sendSync("db:get-bot-list", null),
    getCurrentBot: () => ipcRenderer.sendSync("bot:get-current-bot", null),
    restartCurrentBot: () => ipcRenderer.send("bot:restart-current-bot", null),
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
