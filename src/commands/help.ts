import { response } from "../interfaces/response";

const require_dir = require("require-dir");
const commands = require_dir("./");

const { colors, prefix } = require("../../config/main.json");
const { green } = colors;

function help(): response {
	const commandNames: string[] = Object.keys(commands); // List of commands
	let message: string = "**";

	for (let i = 0; i < commandNames.length; i++) {
		let workingCommand = commandNames[i]; // Command name
		let help: string = commands[workingCommand]["help"]; // Help instruction for that command

		message += `${prefix}${workingCommand}: ${help}\n`;
	}

	message += `${prefix}help: Print this summary`;
	message += `**`;

	return { color: green, title: "Help", message: message };
}

module.exports = help;
