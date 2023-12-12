import * as dataDivs from "./util/data_div.js";
import ipc from "./ipc.js";
import * as botSelection from "./pages/botSelection.js";
import initBotCreation from "./pages/bot_creation.js";
import initEventPage from "./pages/events.js";
import initLocale, { languages, updateTranslations } from "./locale_manager.js";
import initPluginPage from "./pages/plugin_page.js";
import initReplPage from "./pages/repl_page.js";
import initActionPalette from "./action_palette.js";
let loggerDiv;
document.addEventListener("DOMContentLoaded", () => {
    loggerDiv = document.getElementById("logger-container");
    dataDivs.registerAll(localStorage.getItem("last-page") || "home");
    ipc.addEventListener("log", (data) => {
        const text = document.createElement("label");
        text.innerHTML = `<label class="logger-log-type">[${data.type}${data.isDebug ? " (debug)" : ""}]</label>: ${data.contents}`;
        loggerDiv.appendChild(text);
    });
    // Initiate stuff
    initLocale("main", () => {
        botSelection.init();
        initBotCreation();
        initEventPage();
        initPluginPage();
        initActionPalette();
        initReplPage();
        let langSelect = document.getElementById("app-settings-language-select");
        let selectedLanguage = ipc.getCurrentLanguage();
        for (const language of languages) {
            const option = document.createElement("option");
            option.setAttribute("data-i18n-text", `lang.${language}`);
            option.value = language;
            if (language === selectedLanguage)
                option.selected = true;
            langSelect.appendChild(option);
        }
        langSelect.onchange = () => {
            ipc.setCurrentLanguage(langSelect.value);
        };
        updateTranslations(langSelect);
        document.getElementById("restart-current-bot-ion").onclick = () => ipc.restartCurrentBot();
        document.getElementById("start-current-bot-icon").onclick = () => ipc.startCurrentBot();
        updateTranslations();
    });
});
