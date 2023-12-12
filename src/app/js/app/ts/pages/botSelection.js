import ipc from "../ipc.js";
let runningBotData = [];
let currentBot;
export function init() {
    updateBotList();
    setInterval(() => {
        updateUI();
    }, 500);
}
export function updateBotList() {
    runningBotData = ipc.getBotList();
    currentBot = ipc.getCurrentBot();
    updateUI();
}
export function updateUI() {
    document.getElementById("temp-bot-list").innerHTML = runningBotData.map(x => x.name).join(", ");
    // Get values that listen to it
    const listeners = document.querySelectorAll("[data-current-bot]");
    console.log(listeners);
    // Loop through them
    for (let i = 0; i != listeners.length; i++) {
        const element = listeners[i];
        const value = element.getAttribute("data-current-bot");
        // Set the value
        switch (value) {
            case "name":
                element.innerHTML = "2";
                break;
        }
    }
}
