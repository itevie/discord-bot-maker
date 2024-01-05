import { executeInternal } from "./action_palette.js";
import { DError } from "./ipc.js";
import { translateKey } from "./locale_manager.js";

export default function handleLanguageError(error: DError) {
  // Construct base
  const base = document.createElement("div");
  base.classList.add("error-item");

  // Construct header
  const header = document.createElement("label");
  header.classList.add("error-header");
  header.innerHTML = "Language Error";
  base.appendChild(header);

  // Construct content
  const content = document.createElement("label");
  content.classList.add("error-content");
  content.innerHTML = translateKey(`errors:` + error.errorCode, error.context);
  base.appendChild(content);

  // Construct actions
  const actions = document.createElement("div");
  actions.classList.add("error-actions");
  
  // Add the quick fixes
  for (const i in error.quickFixes) {
    // Construct the button
    const button = document.createElement("button");
    button.innerHTML = error.quickFixes[i].name;
    actions.appendChild(button);

    button.addEventListener("click", () => {
      // Execute each of the actions
      for (const action of error.quickFixes[i].actions) {
        executeInternal(action);
      }
    });
  }

  base.appendChild(actions);

  // Add to errors
  document.getElementById("errors-list").appendChild(base);
}