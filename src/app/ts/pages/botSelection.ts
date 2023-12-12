import createIcon from "../components/icon.js";
import ipc, {Bot, RunningBotItem} from "../ipc.js";
import { translateElement, translateElements, translateKey } from "../locale_manager.js";
import { formatMilliseconds, gatherUnits } from "../util/formatters.js";

let runningBotData: RunningBotItem[] = [];
let currentBot: Bot;

export function init() {
  updateBotList();
  setupTable();
  updateUI();
  
  setInterval(() => {
    let running = runningBotData.find(x => x.name === currentBot.name);
    document.getElementById("status_bar-bot_running").innerHTML = translateKey(`statusbar.bot.${running.isRunning ? "running" : "not_running"}`, {
      bot_name: running.name
    })
    updateBotList();
  }, 500);
}

export function setupTable() {
  const table = document.getElementById("bot-list");
  for (const bot of runningBotData) {
    // Construct tr
    const tr = document.createElement("tr");

    // Construct name
    const name = document.createElement("td");
    name.innerHTML = bot.name;

    // Construct start / stop
    const startStop = document.createElement("td");
    const start = createIcon("play_arrow", {
      title: `page.bot_selection.button.start_bot`,
      isSmall: true,
      class: ["bg-hover-success"]
    });
    start.setAttribute("data-current-bot", "hide-if-running");
    start.setAttribute("data-current-bot-display", "inline");

    const stop = createIcon("stop", {
      title: `page.bot_selection.button.stop_bot`,
      isSmall: true,
      hidden: true,
      class: ["bg-hover-danger"]
    });
    stop.setAttribute("data-current-bot", "show-if-running");
    stop.setAttribute("data-current-bot-display", "inline");

    startStop.appendChild(start);
    startStop.appendChild(stop);

    // Construct start button
    const restartContainer = document.createElement("tr");
    const restart = createIcon("replay", {
      title: `page.bot_selection.button.restart_bot`,
      isSmall: true,
      hidden: true,
      class: ["bg-hover-danger"]
    });
    restart.setAttribute("data-current-bot", "show-if-running");
    restart.setAttribute("data-current-bot-display", "inline");
    restart.onclick = () => ipc.restartCurrentBot();
    restartContainer.appendChild(restart);

    translateElements([start, stop, restart], {
      bot_name: bot.name
    });

    // Add stuff
    tr.appendChild(name);
    tr.appendChild(startStop);
    tr.appendChild(restartContainer);

    // Add to table
    table.appendChild(tr); 
  }
}

export function updateBotList() {
  runningBotData = ipc.getBotList();
  currentBot = ipc.getCurrentBot();
  updateUI();
}

export function updateUI() {
  // Get values that listen to it
  const listeners = document.querySelectorAll("[data-current-bot]");

  // Loop through them
  for (let i = 0; i != listeners.length; i++) {
    const element = listeners[i] as HTMLElement;
    const value = element.getAttribute("data-current-bot");

    let running = runningBotData.find(x => x.name === currentBot.name && x.isRunning);

    // Set the value
    switch (value) {
      case "name":
        element.innerHTML = currentBot.name;
        break;
      case "show-if-running":
        element.style.display = running ? (element.getAttribute("data-current-bot-display") ?? "block") : "none";
        break;
      case "hide-if-running":
        element.style.display = !running ? (element.getAttribute("data-current-bot-display") ?? "block") : "none";
        break;
      case "is-running-pretty":
        element.innerHTML = running ? "running" : "not running";
        break;
      case "uptime-pretty":
        element.innerHTML =  running ? (Date.now() - running.startedAt).toString() : ""
        break;
    }
  }
}