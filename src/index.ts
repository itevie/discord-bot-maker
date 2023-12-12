import { app, BrowserWindow} from "electron";
import * as path from "path";

/* 
  This is so that there are no cyclic dependencies
  global interface is declared in global.d.ts

  This is done before importing anything else to avoid
  it not being defined.
*/
//@ts-ignore
global.__app = {
  isReady: false,
  isRunningElectron: true,
  baseDirectory: !app.isPackaged ? "../src" : "./",
  getWindow: null,
}


import * as database from "./database";
import "./ipc";
import Logger from "./Logger";
import { showBasicMessage } from "./alerts";

database.setup();


let window: BrowserWindow;

/**
 * Creates the electron window
 */
function createWindow() {
  // Create the browser window
  window = new BrowserWindow({
    show: false,
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '/../src/app/js/preload/main.js'),
    },
    autoHideMenuBar: true,
    maximizable: true,
    backgroundColor: "#222222",
  });

  window.loadFile(path.join(__app.baseDirectory, "/app/views/index.html"));

  // Wait for the window to be ready, once it has THEN show the window 
  window.once('ready-to-show', () => {
    // Show window
    window.show();
    window.webContents.send("app-ready", null);

    // Update the global __app
    __app.isReady = true;
    __app.getWindow = () => {
      return window;
    }
  });
}

// ----- Electron Events -----
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});