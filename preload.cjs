const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  btn: (arg) => ipcRenderer.send('btn-click', arg),
  openDialog: () => ipcRenderer.send('open-dialog'),
  onFileSelected: (callback) => ipcRenderer.on('selected-file', callback),
  initProcess: (dates) => ipcRenderer.invoke('init-process', dates),
  createFile: (callback) => ipcRenderer.on('create-file', callback),
  // startDrag: (filePath) => ipcRenderer.send('start-drag', filePath),
  checkFileExists: (filePath) => ipcRenderer.invoke('checkFileExists', filePath),
  

 
  onDraggingFile: (callback) => ipcRenderer.on("dragging-file", (_, data) => callback(data)),

  startDrag: (filePath, arrayName, index) => ipcRenderer.send("start-drag", filePath, arrayName, index),
  dragend: (item, arrayName) => ipcRenderer.send('drag-end', item, arrayName)
 // onFileDroppedOutside: (callback) => ipcRenderer.on("file-dropped-outside", (_, data) => callback(data)),
  // onCancelDrag: (callback) => ipcRenderer.on("cancel-drag", () => callback()),
})