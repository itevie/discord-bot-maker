import loadModal from "../modals/modal_manager.js";

interface AlertOptions {
  title?: string;
}

export function error(contents: string, options: AlertOptions = {}): void {
  loadModal(`error`, {
    data: {
      contents: contents,
      title: options.title || "Error",
    }
  });
}