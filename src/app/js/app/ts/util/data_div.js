const divs = {};
/**
 * Hides all of the divs which are registered
 * with data-div
 */
export function hideAll() {
    for (const div in divs) {
        divs[div].style.display = "none";
    }
}
/**
 * Finds all data-divs and registers all of them
 * @param defaultDiv The default div to show
 */
export function registerAll(defaultDiv) {
    // Get all changers
    const changers = document.querySelectorAll("[data-div-changer]");
    // Loop through all the changers
    for (let i = 0; i != changers.length; i++) {
        // Get the ID
        const id = changers[i].getAttribute("data-div-changer");
        // Get the appropiate result
        const target = document.querySelector(`[data-div-id="${id}"]`);
        // Check if the target was actually found
        if (!target)
            continue;
        // Add to divs
        divs[id] = target;
        // Register onclick
        changers[i].addEventListener("click", () => {
            hideAll();
            target.style.display = "block";
        });
        // Hide if not the default one
        target.style.display = defaultDiv === id ? "block" : "none";
    }
}
