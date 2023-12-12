import ipc from "../ipc.js";
let typeMap = {
    information: "Information",
    error: "Error",
    success: "Success!"
};
ipc.addEventListener("identify", data => {
    const titleElement = document.getElementById("alert-title");
    const contentsElement = document.getElementById("alert-contents");
    // Set title
    if (!data.title) {
        titleElement.innerHTML = typeMap[data.type];
    }
    else
        titleElement.innerHTML = data.title;
    // Set contents
    contentsElement.innerHTML = data.contents;
    document.getElementById("close").onclick = () => {
        ipc.closeAlert();
    };
});
