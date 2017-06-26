'use strict';
const electron = require('electron');
const express = require('express');
const expressApp = express();
const bodyParser = require('body-parser');

const app = electron.app;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

expressApp.use(bodyParser.urlencoded({extended:false}));
expressApp.use(bodyParser.json());

expressApp.post('/',function(req,res){
		console.log(req.body);
		mainWindow.webContents.send("store-data", req.body);
		res.send(req.body);
});

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	// create express server
	expressApp.listen(3000, function(){
		console.log("Express app listening on port 3000");
	});
});
