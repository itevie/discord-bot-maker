// To trick typescript into thinking ipc is the IpcApi interface.
let ipc;
//@ts-ignore
ipc = ipcApi;
export default ipc;
