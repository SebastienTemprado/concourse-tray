const { app, BrowserWindow, ipcMain, Menu, net, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let setupAlreadyOpened = false;
let config = {};

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
    config = getConfig();
    initTray();

    getDataFromServer();

});

function initTray() {
    tray = new Tray(path.join(__dirname, '/concourse-logo-green.png'));

    if (process.platform === 'win32') {
        tray.on('click', tray.popUpContextMenu);
    }
    const menu = Menu.buildFromTemplate([
        {
            label: 'Setup',
            click() {
                if (!setupAlreadyOpened) {
                    createSetupWindow();
                    setupAlreadyOpened = true;
                }
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
}

function createSetupWindow() {
    const win = new BrowserWindow({
        width: 650,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('setup.html');
    win.on('closed', _ => {
        setupAlreadyOpened = false;
    });
};

ipcMain.on('submit-setup', (event, arg) => {
    //tray.setImage(path.join(__dirname, '/concourse-logo-green.png'));
    //tray = new Tray(path.join(__dirname, '/concourse-logo-green.png'));
    setupAlreadyOpened = false;
    try {
        fs.writeFileSync('config.json', JSON.stringify(arg), 'utf-8');
        config = getConfig();
        getDataFromServer();
    }
    catch (e) {
        console.log('Failed to save the setup file !');
    }
});

function getConfig() {
    return JSON.parse(fs.readFileSync('config.json', 'utf8'));
}

function getDataFromServer() {
    console.log("request: " + config.host);
    const request = net.request(config.host);

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });
    request.end();   
}