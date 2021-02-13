import { response } from "../interfaces/response";

export {};
//const fs = require('fs');
//const commit = fs.readFileSync(`gitCommit`, {encoding:'utf8', flag:'r'});
const { colors } = require("../config/main.json");
const green = colors.green;

function test(
    args: string[],
    authorID: string,
    author: string,
    channelID: string,
    channel: any,
    creator: any,
    bot: any,
    messageObject: any
): response {
    let message: string;
    message = "**";
    message += "Info: \n";
    //message += `Commit Hash: ${commit}`;
    message += `Author: ${author} \n`;
    message += `Author ID: ${authorID} \n`;
    message += `Channel ID: ${channelID} \n`;
    message += `Arguments: ${args.join(" ")} \n`;
    message += " **";
    return { color: green, title: "Test Successful", message: message };
}

module.exports = test;
module.exports.help = "This is a test command";
