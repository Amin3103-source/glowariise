const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  getData:        ()     => ipcRenderer.invoke("get-data"),
  saveData:       (d)    => ipcRenderer.invoke("save-data", d),
  startSession:   (opts) => ipcRenderer.invoke("start-session", opts),
  endSession:     ()     => ipcRenderer.invoke("end-session"),
  startFreigang:  (opts) => ipcRenderer.invoke("start-freigang", opts),
  endFreigang:    ()     => ipcRenderer.invoke("end-freigang"),
  setAlwaysOn:    (on)   => ipcRenderer.invoke("set-always-on", on),
  checkWritable:  ()     => ipcRenderer.invoke("check-writable"),
  quitApp:        ()     => ipcRenderer.invoke("quit-app"),
  onSessionEnded: (cb)   => ipcRenderer.on("session-ended", cb),
  onFreigangEnded:(cb)   => ipcRenderer.on("freigang-ended", cb),
});
