const { ipcRenderer } = require('electron');

ipcRenderer.on("concat-content", function(event, data){
    document.getElementById('content').innerHTML += `<div>${data}</div>`;
});
