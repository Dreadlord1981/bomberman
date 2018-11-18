/* global process */
/* global require */

var express = require("express");
var app = express();
var fs = require("fs");

var stdin = process.stdin;
var stdout = process.stdout;
var b_started = false;

function bootMenu() {
	console.log("\u001b[2J\u001b[0;0H");
	console.log("**************************");
	console.log("*                        *");
	console.log("*    Server boot menu    *");
	console.log("*                        *");
	console.log("*                        *");
	console.log("**************************");
	console.log("");
	console.log("1 Start:");
	console.log("2 Quit:");
	stdout.write("Option: ");
}

function init() {
	app.use(express.static(".", {
		maxAge: 0
	}));

	app.all("*", function (req, res) {
		res.status(404).send("fail");
	});
}

function startServer() {
	app.listen(8880);
	console.log("Running at http://localhost:8880/");
}

function f_start (n_input) {

	var b_result = false;
	if (n_input) {
		if (isNaN(n_input)) {
			console.log("Invalid option");
			console.log("Only use intergers..");
			stdout.write("Option: ");
		}
		else {
			switch (n_input) {
				case 1:
					b_result = true;
					break;
				case 2:
					process.exit();
					break;
				default:
					console.log("Invalid option");
					stdout.write("Option: ");
					break;
			}
		}
	}
	else {
		console.log("Invalid option");
		stdout.write("Option: ");
	}
	return b_result;
}

stdin.resume();
stdin.setEncoding('utf8');

stdin.on("data", function(data) {

	if (!b_started) {
		var n_input = Number(data);
		b_started = f_start(n_input);
		if (b_started) {
			startServer();
		}
	}
});

bootMenu();
init();

