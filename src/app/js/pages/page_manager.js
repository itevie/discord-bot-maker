import ipc from "../ipc.js";
import { updateTranslations } from "../locale_manager.js";
import { hideAll } from "../util/data_div.js";
export function loadPage(name, options) {
    const pageData = ipc.getPage(name);
    hideAll();
    // Create container
    const container = document.createElement("div");
    container.innerHTML = pageData;
    updateTranslations(container);
    // Apply options
    if (options.loadInto) {
        if (options.loadInto.contains(container)) {
            // Check if override
            if (options.override) {
                options.loadInto.removeChild(container);
                options.loadInto.appendChild(container);
            }
        }
        else {
            options.loadInto.appendChild(container);
        }
    }
    // Check if there is a callback
    if (options.callback) {
        // Collect all data-page-id
        const pageIDs = container.querySelectorAll("[data-page-id]");
        const IDs = {};
        // Loop through them
        for (let i = 0; i != pageIDs.length; i++) {
            IDs[pageIDs[i].getAttribute("data-page-id")] = pageIDs[i];
        }
        // Call it
        options.callback({
            pageIDs: IDs,
        });
    }
    return container;
}
