const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#090d16',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  // الانتظار قليلاً حتى يعمل الخادم ثم تحميل الرابط المحلي
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3001');
  }, 2000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // تشغيل خادم Next.js تلقائياً عند فتح التطبيق
  nextServer = spawn('npx', ['next', 'dev', '--webpack'], {
    cwd: __dirname,
    shell: true,
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (nextServer) nextServer.kill();
  if (process.platform !== 'darwin') app.stop ? app.quit() : app.quit();
});

