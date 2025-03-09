const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  btn: (arg) => ipcRenderer.send('btn-click', arg),
  openDialog: () => ipcRenderer.send('open-dialog'),
  onFileSelected: (callback) => ipcRenderer.on('selected-file', callback),
  initProcess: (dates) => ipcRenderer.invoke('init-process', dates),
  createFile: (callback) => ipcRenderer.on('create-file', callback),
  startDrag: (filePath) => ipcRenderer.send('start-drag', filePath),
  checkFileExists: (filePath) => ipcRenderer.invoke('checkFileExists', filePath)
})