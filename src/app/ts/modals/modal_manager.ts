import ipc from "../ipc.js";

interface ModalOptions {
  unique?: boolean;
  data?: {[key: string]: string};
}

export default function loadModal(modalName: string, options: ModalOptions = {}) {
  // Generate the ID for the container
  const id = modalName + (options.unique ? Math.random() : "");

  const closeModal = () => {
    document.body.removeChild(div);
  }

  // Create container
  const div = document.createElement("div");
  div.id = id;

  // Create shade
  const shade = document.createElement("div");
  shade.classList.add("modal-shade");
  div.appendChild(shade);

  // Create actual container
  const container = document.createElement("div");
  container.classList.add("modal-container");
  div.appendChild(container);
  container.addEventListener("keydown", e => {
    if (e.key == "ESC")
      closeModal();
  });

  // Create close button
  const close = document.createElement("span");
  close.classList.add("material-symbols-outlined");
  close.classList.add("modal-close");
  close.innerHTML = "close";
  close.onclick = () => {
    closeModal();
  }

  // Get and modify contents
  let contents = ipc.getModal(modalName);
  if (options.data) {
    for (const i in options.data) {
      contents = contents.replace(new RegExp(`%${i}%`, "g"), options.data[i]);
    }
  }

  // Add contents
  container.innerHTML = contents;
  container.appendChild(close);

  // Add to document
  document.body.appendChild(div);
}