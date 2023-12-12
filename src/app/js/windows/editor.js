import initActionPalette from "../action_palette.js";
import initLocale, { translateKey } from "../locale_manager.js";
import ipc from "../ipc.js";
//@ts-ignore
let editor;
//@ts-ignore
let monaco;
document.addEventListener("DOMContentLoaded", () => {
    initLocale("editor");
});
ipc.addEventListener("identify", (identify) => {
    initActionPalette();
    // Wait for monaco to be initiated
    initiateEditor(identify);
    document.title = translateKey("window.title", {
        edit_type: identify.type,
        edit_name: `$t(event_names.${identify.name})`,
    });
});
function initiateEditor(identify) {
    //@ts-ignore
    if (!window.monaco) {
        setTimeout(() => {
            initiateEditor(identify);
        }, 100);
        return;
    }
    //@ts-ignore
    monaco = window.monaco;
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: identify.currentData,
        automaticLayout: true,
        theme: "vs-dark",
    });
    editor.getModel().onDidChangeContent((event) => {
        monaco.editor.setModelMarkers(editor.getModel(), 'owner', []);
        ipc.updateEditorCode({
            type: identify.type,
            name: identify.name,
            newData: editor.getValue()
        });
    });
    ipc.addEventListener("editor-error", (data) => {
        let message = translateKey(`errors:${data.errorCode}`, data.context);
        if (message === `error:${data.errorCode}`)
            message = `${data.message} (fallback)`;
        monaco.editor.setModelMarkers(editor.getModel(), 'owner', [
            {
                message: message + ` (cs ${data.location.charStart} ce ${data.location.charEnd} ln ${data.location.line}) \n\n` + data.stack,
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: data.location.line + 1,
                startColumn: data.location.charStart + 1,
                endLineNumber: data.location.line + 1,
                endColumn: data.location.charEnd + 2,
            },
        ]);
    });
}
