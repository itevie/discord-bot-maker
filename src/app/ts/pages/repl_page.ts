import ipc from "../ipc.js";
import { translateKey } from "../locale_manager.js";

let inputElement: HTMLInputElement;
let resultElement: HTMLElement;

export default function init() {
  inputElement = (document.getElementById("repl-input") as HTMLInputElement);
  resultElement = document.getElementById("repl-result");

  // Listen to on enter
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handle();
    }
  });
}

function handle() {
  resultElement.style.color = "white";
  const value = inputElement.value;
  const result: any = ipc.evaluateRepl(value);

  // Check if error
  if (result.errorCode) {
    resultElement.style.color = "red";
    resultElement.innerHTML = formatError(result, value);
    return;
  }

  resultElement.innerHTML = result?.value ? JSON.stringify(result?.value) : result;
}

function formatError(data: any, code: string) {
  let error = translateKey(`errors:${data.errorCode}`, data.context);

  // Construct location
  error += `\n\n${code}\n`;

  // Construct arrow
  error += " ".repeat(data.location.charStart) + "^".repeat((data.location.charEnd - data.location.charStart) || 1);

  return error.replace(/\n/g, "<br>");
}