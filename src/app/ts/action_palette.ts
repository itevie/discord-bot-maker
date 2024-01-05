import ipc from "./ipc.js";
import { languages, translateKey } from "./locale_manager.js";
import { editEvent } from "./pages/events.js";
import { hideAll } from "./util/data_div.js";

let element: HTMLElement;
let inputElement: HTMLInputElement;
let results: HTMLDivElement;

let actions: Action[] = [

];

interface Action {
  name: string;
  internal?: string;
  priority?: number;
  description?: string;
  action: () => void;
}

function loadActions() {
  actions = [
    {
      name: translateKey("main:action_palette.reload", {}),
      description: "Reloads the current window",
      action: () => location.reload(),
      priority: 3
    },
    {
      name: translateKey("main:action_palette.start_current_bot", {}),
      action: () => {
        ipc.startCurrentBot();
      },
      priority: 3
    },
    {
      name: translateKey("main:action_palette.stop_current_bot", {}),
      action: () => {
        ipc.stopCurrentBot();
      },
      priority: 3
    },
    {
      name: translateKey("main:action_palette.restart_current_bot", {}),
      action: () => {
        ipc.restartCurrentBot();
      },
      priority: 3
    },
    {
      name: translateKey("main:action_palette.repl_page", {}),
      action: () => {
        hideAll();
        (document.querySelector('[data-div-id="repl"]') as HTMLElement).style.display = "block";
        (document.getElementById('repl-input') as HTMLElement).focus();
      }
    }
  ];

  // Get all data-div-changer
  let elements = document.querySelectorAll("[data-div-navbar]");
  elements.forEach(element => {
    actions.push({
      name: translateKey(`main:action_palette.open_page`, { name: element.getAttribute("title") || "?" }),
      action: () => {
        (element as any).click();
      },
      priority: -1
    })
  });

  // Get all events
  let events = ipc.getKnownEventList();
  for (const event of events) {
    actions.push({
      name: translateKey(`main:action_palette.edit_event`, { event_name: event }),
      internal: `edit-event/${event}`,
      action: () => {
        editEvent(event);
      },
      priority: 1,
    });
  }

  // Load settings
  for (const language of languages) {
    actions.push({
      name: translateKey(`main:action_palette.change_language`, { language_name: language }),
      action: () => {
        ipc.setCurrentLanguage(language);
      },
      priority: -5,
    })
  }

  // Load change bots
  const bots = ipc.getBotList();

  for (const bot of bots) {
    actions.push({
      name: translateKey(`main:action_palette.change_bot`, { bot_name: bot.name }),
      internal: "select-bot/" + bot.name  ,
      action: () => {
        ipc.changeSelectedBot(bot.name);
      },
      priority: 0,
    });
  }

  actions = actions.sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.name.localeCompare(b.name));
}

export default function init() {
  element = document.getElementById("action-palette");
  inputElement = document.getElementById("action-palette-input") as HTMLInputElement;
  results = document.getElementById("action-palette-results") as HTMLDivElement;

  loadActions();

  inputElement.addEventListener("keyup", (event) => {
    updateQuery(inputElement.value);

    if (event.key === "Enter") {
      // Get the first one
      getActions(inputElement.value)[0].action();
      closePalette();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      inputElement.value = "";
      element.style.display = element.style.display === "none" ? "block" : "none";
      inputElement.focus();
    }
  });
}

function closePalette() {
  element.style.display = "none";
}

function getActions(query: string | null = null) {
  let act = actions.filter(x => query === null ? true : actionMatchesQuery(x, query));
  if (act.length === 0)
    act.push({
      name: translateKey(`main:action_palette.no_results`, {}),
      action: () => {}
    });
  return act;
}

function actionMatchesQuery(action: Action, query: string) {
  query = clean(query);
  const name = clean(action.name);

  if (name.includes(query))
    return true;
  return false;
}

function updateQuery(query: string) {
  results.innerHTML = "";

  let queries = getActions(query);

  for (const query of queries) {
    results.appendChild(renderAction(query));
  }
}

function renderAction(action: Action) {
  const element = document.createElement("div");
  element.classList.add("action-palette-result");

  const name = document.createElement("label");
  name.innerHTML = action.name;
  element.appendChild(name);

  element.onclick = () => {
    action.action();
    closePalette();
  }

  return element;
}

export function executeInternal(id: string): void {
  // Try to find the id
  const action = actions.find(x => x.internal === id);

  if (action) {
    action.action();
  }
}

function clean(text: string) {
  return text.toLowerCase().replace(/ /g, "");
}