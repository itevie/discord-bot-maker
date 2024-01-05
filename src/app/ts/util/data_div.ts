import { loadPage } from "../pages/page_manager.js";

const divs: {[key: string]: HTMLElement} = {

}

let changers: NodeListOf<Element>;

/**
 * Hides all of the divs which are registered
 * with data-div
 */
export function hideAll() {
  const children = document.getElementById("main-content").children;

  for (let i = 0; i != children.length; i++) {
    (children[i] as HTMLElement).style.display = "none";
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
export function registerAll(defaultDiv: string) {
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
      : document.querySelector(`[data-div-id="${id}"]`) as HTMLElement;

    // If there was no target found, continue
    if (!target) continue;

    // Add to divs
    divs[id] = target;

    // Register onclick
    (changers[i] as HTMLButtonElement).addEventListener("click", () => {
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

  let collapsers = document.querySelectorAll("[data-div-collapse]");
  console.log(collapsers)

  collapsers.forEach(el => {
    const id = el.getAttribute("data-div-collapse");
    console.log(id);
    (el as HTMLButtonElement).onclick = () => {
      // Get the corrosponding element
      const e = document.getElementById(id);
      e.style.display = e.style.display == "block" ? "none" : "block";
    }
  });
}

function createPage(name: string): HTMLElement {
  // Check if element already exists
  if (document.querySelector(`[data-div-id="${name}"]`)) {
    let element = document.querySelector(`[data-div-id="${name}"]`);
    element.innerHTML = "";
    return element as HTMLElement;
  }

  // Else, create it
  const container = document.createElement("div");
  container.setAttribute("data-div-id", name);
  document.querySelector(".main-content").appendChild(container);
  return container;
}