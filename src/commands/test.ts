import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

//const fs = require('fs');
//const commit = fs.readFileSync(`gitCommit`, {encoding:'utf8', flag:'r'});
const { colors } = require("../../config/main.json");
const green = colors.green;

function test(p: Parameters): response {
	let message: string;
	message = "**";
	message += "Info: \n";
	//message += `Commit Hash: ${commit}`;
	message += `Author: ${p.author} \n`;
	message += `Author ID: ${p.authorID} \n`;
	message += `Channel ID: ${p.channelID} \n`;
	message += `Arguments: ${p.args.join(" ")} \n`;
	message += " **";
	return { color: green, title: "Test Successful", message: message };
}

module.exports = test;
module.exports.help = "This is a test command";
