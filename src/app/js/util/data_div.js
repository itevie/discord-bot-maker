import { loadPage } from "../pages/page_manager.js";
const divs = {};
let changers;
/**
 * Hides all of the divs which are registered
 * with data-div
 */
export function hideAll() {
    const children = document.getElementById("main-content").children;
    for (let i = 0; i != children.length; i++) {
        children[i].style.display = "none";
    }
    if (changers) {
        for (let i = 0; i != changers.length; i++) {
            if (changers[i].hasAttribute("data-div-navbar")) {
                changers[i].classList.remove("navbar-selected");
            }
        }
    }
}
/**
 * Finds all data-divs and registers all of them
 * @param defaultDiv The default div to show
 */
export function registerAll(defaultDiv) {
    // Get all changers
    changers = document.querySelectorAll("[data-div-changer]");
    // Loop through all the changers
    for (let i = 0; i != changers.length; i++) {
        // Get the ID
        const id = changers[i].getAttribute("data-div-changer");
        // Get the target of the changer, if it is a page-, create a
        // base, else just get the ID
        const target = id.startsWith("page-")
            ? createPage(id)
            : document.querySelector(`[data-div-id="${id}"]`);
        // If there was no target found, continue
        if (!target)
            continue;
        // Add to divs
        divs[id] = target;
        // Register onclick
        changers[i].addEventListener("click", () => {
            hideAll();
            target.style.display = "block";
            // Check if it is a page that should be loaded
            if (id.startsWith("page-")) {
                loadPage(id.replace("page-", ""), { loadInto: target });
            }
            // Update selected
            for (let i = 0; i != changers.length; i++) {
                if (changers[i].hasAttribute("data-div-navbar")) {
                    changers[i].classList.remove("navbar-selected");
                    if (changers[i].getAttribute("data-div-changer") === id) {
                        changers[i].classList.add("navbar-selected");
                        localStorage.setItem("last-page", id);
                    }
                }
            }
        });
        // Hide if not the default one
        target.style.display = "none";
        if (defaultDiv === id) {
            target.style.display = "block";
            changers[i].classList.add("navbar-selected");
        }
    }
}
function createPage(name) {
    // Check if element already exists
    if (document.querySelector(`[data-div-id="${name}"]`)) {
        let element = document.querySelector(`[data-div-id="${name}"]`);
        element.innerHTML = "";
        return element;
    }
    // Else, create it
    const container = document.createElement("div");
    container.setAttribute("data-div-id", name);
    document.querySelector(".main-content").appendChild(container);
    return container;
}
