export default function createIcon(name, options = {}) {
    // Create base icon
    const icon = document.createElement("div");
    icon.classList.add("icon");
    if (name === "replay" || name == "open_in_new")
        icon.classList.add("replay-icon");
    // Add options
    if (options.class)
        for (const c of options.class)
            icon.classList.add(c);
    if (options.isSmall)
        icon.classList.add("icon-small");
    if (options.hidden)
        icon.style.display = "none";
    icon.setAttribute("data-i18n-title", options.title || "");
    // Add span
    const span = document.createElement("span");
    span.classList.add("material-symbols-outlined");
    span.innerHTML = name;
    icon.appendChild(span);
    return icon;
}
