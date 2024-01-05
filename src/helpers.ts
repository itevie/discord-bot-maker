import { BrowserWindow } from "electron";

export function reloadAllWindows(): void{
  let windows = BrowserWindow.getAllWindows();
  
  for (const window of windows) {
    window.webContents.reloadIgnoringCache();
  }
}