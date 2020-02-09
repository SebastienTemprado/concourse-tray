const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;

function createMainWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    // Open DevTools.
    //win.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.whenReady().then(createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // Sur macOS, il est commun pour une application et leur barre de menu
    // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.on('ready', () => {
    tray = new Tray(path.join(__dirname, '/concourse-logo-red.png'));

    if (process.platform === 'win32') {
        tray.on('click', tray.popUpContextMenu);
    }

    const menu = Menu.buildFromTemplate([
        {
            label: 'Setup',
            click() {
                createSetupWindow();
            }
        },
        {
            label: 'Quit',
            click() {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Concourse Tray');
    tray.setContextMenu(menu);

});

// In this file you can include the rest of your app's specific main process
// code. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

function createSetupWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('setup.html');

    win.once('ready-to-show', () => {
        //win.show();
    })
};



ipcMain.on('submit-setup', (event, arg) => {
    tray.setImage(path.join(__dirname, '/concourse-logo-green.png'));

    try {
        fs.writeFileSync('config.json', JSON.stringify(arg), 'utf-8');
    }
    catch (e) {
        console.log('Failed to save the setup file !');
    }
});