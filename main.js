import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
    const preloadPath = path.join(__dirname, 'preload.cjs');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
      webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Carga la URL adecuada dependiendo del entorno
  if (isDev) {
    // console.log('Cargando desde el servidor de desarrollo Vite');
    win.loadURL('http://localhost:5173/');
    win.webContents.openDevTools();
  } else {
    // console.log('Cargando desde la carpeta dist');
    win.loadFile(path.join(__dirname, 'dist/index.html'));
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
    console.log('Button clicked:', arg);
    event.reply('btn-click-reply', `Received: ${arg}`);
  });