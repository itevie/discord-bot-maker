import ipc from "../ipc.js";
import { translateKey } from "../locale_manager.js";
import { error } from "../util/alerts.js";
import { loadPage } from "./page_manager.js";
export default function init() {
    document.getElementById("create-bot-button").onclick = () => {
        loadCreator();
    };
}
export function loadCreator() {
    loadPage("bot_creator", {
        loadInto: document.querySelector("#main-content"),
        callback: (data) => {
            data.pageIDs["button-create"].onclick = () => {
                // Collec the details
                const name = data.pageIDs["bot-name"].value;
                const token = data.pageIDs["bot-token"].value;
                // Validate name
                if (name.length > 30)
                    return alert("name is too big!");
                // Check if the name already exists
                if (ipc.botNameExists(name)) {
                    error(translateKey(`page.bot_creation.errors.name_exists`, {
                        name,
                    }));
                    return;
                }
                // Attempt to create the bot
                ipc.createBot({ name, token });
            };
        }
    });
}
