interface LoggerOptions {
  isDebug?: boolean;
}

export default class Logger {
  name: string; 
  options: LoggerOptions;

  constructor(name: string, options: LoggerOptions = {}) {
    this.name = name;
    this.options = options;
  }

  public log(message: string) {
    console.log(`[${this.name}]: ${message}`);
    sendLog({
      contents: message,
      type: this.name,
      isDebug: this.options.isDebug || false
    });
  }

  public derive(name: string, options: LoggerOptions = {}) {
    return new Logger(this.name + ":" + name, options);
  }
}

// ----- To send logs to mainWindow -----

interface Log {
  contents: string;
  type: string;
  isDebug: boolean;
}

let queue = [];

function sendLog(log: Log) {
  // Check if the app is ready, if not add the log item to the queue instead
  if (__app.isReady == true) {
    // Check if there are any in the queue
    if (queue.length !== 0) {
      queue.forEach(element => {
        __app.getWindow()?.webContents?.send("log", element);
      });
      queue = [];
    }

    // Send the log
    __app.getWindow()?.webContents?.send("log", log);
  } else queue.push(log);
}