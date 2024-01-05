import ipc from "../ipc.js"
import { updateTranslations } from "../locale_manager.js";
import { hideAll } from "../util/data_div.js";

interface CallbackOptions {
  pageIDs: {[key: string]: HTMLElement};
}

interface Options {
  loadInto?: HTMLElement;
  callback?: (data: CallbackOptions) => void;
  override?: boolean;
}

export function loadPage(name: string, options: Options): HTMLElement {
  const pageData = ipc.getPage(name);
  hideAll();

  // Check if the page already exists
  if (document.getElementById(`page-${name}`)) {
    hideAll();
    document.getElementById(`page-${name}`).style.display = "block";
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.id = `page-${name}`;
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
    } else {
      options.loadInto.appendChild(container);
    }
  }

  // Check if there is a callback
  if (options.callback) {
    // Collect all data-page-id
    const pageIDs = container.querySelectorAll("[data-page-id]");
    const IDs: {[key: string]: HTMLElement} = {};

    // Loop through them
    for (let i = 0; i != pageIDs.length; i++) {
      IDs[pageIDs[i].getAttribute("data-page-id")] = pageIDs[i] as HTMLElement;
    }

    // Call it
    options.callback({
      pageIDs: IDs,
    });
  }

  return container;
}