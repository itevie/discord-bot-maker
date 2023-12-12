import ipc from "../ipc.js";
import { translateElement } from "../locale_manager.js";
export default function init() {
    const eventList = ipc.getKnownEventList();
    // Load them
    const container = document.getElementById("events-list");
    for (const event of eventList) {
        // Construct
        const label = document.createElement("label");
        label.classList.add("command-item");
        label.setAttribute("data-i18n-text", `event_names.${event}`);
        label.onclick = () => {
            loadEvent(event);
        };
        label.ondblclick = () => {
            editEvent(event);
        };
        container.appendChild(label);
    }
}
function loadEvent(name) {
    let el = document.getElementById("current-event-name");
    el.setAttribute("data-i18n-text", `event_names.${name}`);
    translateElement(el);
}
export function editEvent(name) {
    ipc.editEvent(name);
}
