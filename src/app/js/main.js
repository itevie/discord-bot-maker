import * as dataDivs from "./util/data_div.js";
import ipc from "./ipc.js";
import * as botSelection from "./pages/botSelection.js";
import initBotCreation, { loadCreator } from "./pages/bot_creation.js";
import initEventPage from "./pages/events.js";
import initLocale, { languages, translateKey, updateTranslations } from "./locale_manager.js";
import initPluginPage from "./pages/plugin_page.js";
import initReplPage from "./pages/repl_page.js";
import initActionPalette from "./action_palette.js";
import { error } from "./util/alerts.js";
import loadModal from "./modals/modal_manager.js";
import { createLocation } from "./helpers.js";
let loggerDiv;
document.addEventListener("DOMContentLoaded", () => {
    loggerDiv = document.getElementById("logger-container");
    dataDivs.registerAll(localStorage.getItem("last-page") || "home");
    ipc.addEventListener("log", (data) => {
        const text = document.createElement("label");
        text.innerHTML = `<label class="logger-log-type">[${data.type}${data.isDebug ? " (debug)" : ""}]</label>: ${data.contents}`;
        loggerDiv.appendChild(text);
    });
    //ipc.addEventListener("app-ready", () => {
    console.log("Registered error listeners");
    ipc.addEventListener("alerts:uncaught_error", (data) => {
        error(translateKey(`errors:` + data.error_code, {}), {
            title: translateKey(`errors:helpers.dangerous_error`, {}),
        });
    });
    ipc.addEventListener("alerts:unknown_uncaught_error", data => {
        error(translateKey(`errors:EA1`, {
            error_message: data.message
        }), {
            title: translateKey(`errors:helpers.dangerous_error`, {}),
        });
    });
    ipc.addEventListener("alerts:uncaught_language_error", data => {
        console.log(data);
        loadModal("language_error", {
            data: {
                contents: `Error: ${translateKey(`errors:${data.errorCode}`, data.context)}<br>${createLocation(data)}`,
            }
        });
    });
    //});
    // Initiate stuff
    initLocale("main", () => {
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
        // Check if there is a bot selected, if not, hide stuff
        if (!ipc.getCurrentBot()) {
            // Hide stuff
            ["bot-specific-navbar", "topbar-icons", "status-bar"]
                .forEach(x => document.getElementById(x).style.display = "none");
            [
                '[data-div-changer="bot-selection"]', '[data-div-changer="plugins"]',
                '[data-div-changer="errors"]', '[data-div-changer="app-logger"]'
            ].forEach(x => document.querySelector(x).style.display = "none");
            document.querySelector(`[data-div-changer="welcome"]`).click();
            document.querySelector(`[data-div-changer="welcome"]`).style.display = "block";
            // Init welcome page
            document.getElementById("welcome-page-create-bot").onclick = () => {
                loadCreator();
            };
            // Init needed stuff
            initBotCreation();
        }
        else {
            botSelection.init();
            initBotCreation();
            initEventPage();
            initPluginPage();
            initActionPalette();
            initReplPage();
        }
        document.getElementById("restart-current-bot-ion").onclick = () => ipc.restartCurrentBot();
        document.getElementById("start-current-bot-icon").onclick = () => ipc.startCurrentBot();
        updateTranslations();
    });
});
