const { ipcRenderer } = require('electron');
const fs = require('fs');

function initSetup() {
    const setupForm = JSON.parse(fs.readFileSync('config.json','utf8'));
    document.getElementById("host").value = setupForm.host;
    document.getElementById("team").value = setupForm.team;
};

function submitSetup() {
    const setupForm = {
        host: document.getElementById("host").value,
        team: document.getElementById("team").value
    };
    ipcRenderer.send('submit-setup', setupForm);
    this.close();
};

function closeSetup() {
    this.close();
};


