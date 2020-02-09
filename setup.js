const { ipcRenderer } = require('electron');


function submitSetup() {
    const setupForm = {
        host: document.getElementById("host").value,
        team: document.getElementById("team").value
    };
    ipcRenderer.send('submit-setup', setupForm);
};



