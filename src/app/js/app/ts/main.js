import * as dataDivs from "./util/data_div.js";
import ipc from "./ipc.js";
import * as botSelection from "./pages/botSelection.js";
let loggerDiv;
document.addEventListener("DOMContentLoaded", () => {
    loggerDiv = document.getElementById("logger-container");
    dataDivs.registerAll("app-logger");
    ipc.addEventListener("log", (data) => {
        const text = document.createElement("label");
        text.innerHTML = `<label class="logger-log-type">[${data.type}${data.isDebug ? " (debug)" : ""}]</label>: ${data.contents}`;
        loggerDiv.appendChild(text);
    });
    console.log(2);
    // Initiate stuff
    botSelection.init();
    document.getElementById("restart-current-bot-ion").onclick = () => ipc.restartCurrentBot();
});
