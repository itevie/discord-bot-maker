// To trick typescript into thinking ipc is the IpcApi interface.
let ipc;
//@ts-ignore
ipc = ipcApi;
console.log("testttt");
export default ipc;
