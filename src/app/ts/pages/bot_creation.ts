import { loadPage } from "./page_manager.js";

export default function init() {
  document.getElementById("create-bot-button").onclick = () => {
    loadPage("bot_creator", {
      loadInto: document.querySelector("#main-content"),
      callback: (data) => {
        data.pageIDs["button-create"].onclick = () => {
          // Collec the details
          const name = (data.pageIDs["bot-name"] as HTMLInputElement).value;
          const token = (data.pageIDs["bot-token"] as HTMLInputElement).value;

          // Validate name
          if (name.length > 30)
            return alert("name is too big!");
        }
      }
    })
  }
}