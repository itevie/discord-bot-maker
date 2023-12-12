import { BrowserWindow, ipcMain } from "electron";
import path from "path";

interface AlertOptions {
  type: "error" | "success" | "information" | "neutral";
  contents: string;
  buttons?: AlertButton[];
}

interface AlertButton {
  type: "danger" | "success" | "normal";
  text: string;
  id: string;
  isDefault: boolean;
}

const defaultOptions: AlertOptions = {
  type: "information",
  contents: "",
  buttons: [
    {
      type: "normal",
      text: "OK",
      id: "normal-ok",
      isDefault: true,
    }
  ]
}

export function showBasicMessage() {
  showWindow({
    type: "error",
    contents: "Hello World!" 
  });
}

export function showWindow(options: AlertOptions) {
  options = { ...defaultOptions, ...options };
  console.log(options);

  const window = new BrowserWindow({
    parent: __app.getWindow(),
    modal: true,
    show: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, '/../src/app/js/preload/main.js'),
    },
    backgroundColor: "#222222",
    autoHideMenuBar: true,
    width: 500,
    height: Math.min(700, 200 + (50 * Math.round((options.contents.length / 100)))),
    frame: false,
  });

  window.loadFile(path.join(__app.baseDirectory, "/app/views/alert.html"));

  window.on("ready-to-show", () => {
    window.show();
    
    window.webContents.send("identify", options)
  })
}

ipcMain.on("alert:update-size", (event, data: { width: number, height: number}) => {
  let window = BrowserWindow.fromId(event.sender.id)
  window.setSize(data.width, data.height);
  event.returnValue = null;
});

ipcMain.on("alert:close", (event, data) => {
  let window = BrowserWindow.fromId(event.sender.id);
  window.close();
  event.returnValue = null;
});