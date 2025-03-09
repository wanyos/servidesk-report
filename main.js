import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron';
import path from 'node:path';
import dayjs from 'dayjs';
import { fileURLToPath } from 'node:url';
import { createFileIss, createFileIntegria } from './create_files.js';
import fs from 'node:fs';

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
    mainWindow.loadURL('http://localhost:6173/');
    // mainWindow.webContents.openDevTools();
  } else {
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

// ipcMain.handle('init-process', async (event, arg) => {
//   const openDate = dayjs(arg.initDate, 'DD/MM/YYYY');
//   const closeDate = dayjs(arg.endDate, 'DD/MM/YYYY');

//   const filesIss = await createFileIss(filePath, openDate, closeDate);
//   const filesIntegria = await createFileIntegria(openDate, closeDate);

//   return [...filesIss, ...filesIntegria];
// });


ipcMain.handle('init-process', async (event, arg) => {
  const openDate = dayjs(arg.initDate, 'DD/MM/YYYY');
  const closeDate = dayjs(arg.endDate, 'DD/MM/YYYY');

  const filesIss = await createFileIss(filePath, openDate, closeDate);
  const filesIntegria = await createFileIntegria(openDate, closeDate);

  return [
    ...filesIss, 
    ...filesIntegria
  ].map(file => ({
    name: path.basename(file),
    path: path.resolve(file) // Asegura path absoluto
  }));
});


// Añade este handler para el drag
ipcMain.on('start-drag', (event, filePath) => {
  try {
    const iconPath = path.join(__dirname, 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    
    // Verificación extrema del path
    if (!path.isAbsolute(filePath)) {
      throw new Error(`Path relativo detectado: ${filePath}`);
    }

    // Verificación de extensión del archivo
    if (path.extname(filePath) !== '.xlsx') {
      throw new Error('Solo se permiten archivos .xlsx');
    }

    event.sender.startDrag({
      file: filePath,
      icon: icon.resize({ width: 32, height: 32 })
    });
    
  } catch (error) {
    console.error('Fallo catastrófico en drag:', error);
    // app.quit(); // Cierre controlado para evitar corrupción
  }
});

ipcMain.handle('checkFileExists', (event, filePath) => {
  return fs.existsSync(filePath);
});