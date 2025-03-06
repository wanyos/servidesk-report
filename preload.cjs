const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  btn: (arg) => ipcRenderer.send('btn-click', arg),
  openDialog: () => ipcRenderer.send('open-dialog'),
  onFileSelected: (callback) => ipcRenderer.on('selected-file', callback),
  initProcess: (arg) => ipcRenderer.send('init-process', arg) 
})