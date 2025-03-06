import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import dayjs from 'dayjs';
import { fileURLToPath } from 'node:url';
import { createFileIss, createFileIntegria } from './create_files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let filePath;

function createWindow() {
    const preloadPath = path.join(__dirname, 'preload.cjs');
    mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
      webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true
    }
  });

  // Carga la URL adecuada dependiendo del entorno
  if (isDev) {
    // console.log('Cargando desde el servidor de desarrollo Vite');
    mainWindow.loadURL('http://localhost:6173/');
    // mainWindow.webContents.openDevTools();
  } else {
    // console.log('Cargando desde la carpeta dist');
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('btn-click', (event, arg) => {
    // console.log('Button clicked:', arg);
    event.reply('btn-click-reply', `Received: ${arg}`);
});
  
ipcMain.on('open-dialog', (event) => { 
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      filePath = result.filePaths[0];
      const fileName = path.basename(filePath); // Extraer el nombre del archivo
      event.reply('selected-file', fileName); // Enviar solo el nombre del archivo al renderer
  }
  }).catch(err => {
    console.log(err)
  })
})


ipcMain.on('init-process', (event, arg) => {
  const openDate = dayjs(arg.initDate, 'DD/MM/YYYY');
  const closeDate = dayjs(arg.endDate, 'DD/MM/YYYY');

 createFileIss(filePath, openDate, closeDate);
 createFileIntegria(openDate, closeDate);
})