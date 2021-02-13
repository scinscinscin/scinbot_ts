import { response } from "../interfaces/response";

export {};
const { colors } = require("../config/main.json");
const { green, red } = colors;
const require_dir = require("require-dir");
const helper = require_dir("./helper");
const { hypixelToken } = require("../config/token.json");

async function hypixel(
    args: string[],
    authorID: string,
    author: string,
    channelID: string,
    channel: any,
    creator: any,
    bot: any,
    messageObject: any
): Promise<response> {
    // Check amount of arguments passed
    if (args.length !== 1) {
        return {
            color: red,
            title: "Too many arguments",
            message: "This command only takes in 1 argument.",
        };
    }

    let response: any = await helper.download(
        `https://api.hypixel.net/player?key=${hypixelToken}&name=${args[0]}`
    );

    // Return error if the player doesn't exist or if the API is not reachable
    if (response === "error") {
        return {
            color: red,
            title: "Failed to get info",
            message: `The Hypixel API is unreachable`,
        };
    } else if (response.player === null) {
        return {
            color: red,
            title: "Not a player",
            message: `${args[0]} cannot be found in the API. Check the spelling`,
        };
    }

    let player: any = response.player;
    let message: string = "**";

    try {
        //general info about the user
        message += `Display Name: ${player.displayname}\n`;
        message += `Hypixel ID: ${player["_id"]}\n`;
        message += `UUID: ${player.uuid}\n`;
        message += `Aliases: ${player.knownAliases.join(", ")}\n`;
        message += `First Login: ${new Date(
            player.firstLogin
        ).toLocaleString()}\n`;
        message += `Latest Login: ${new Date(
            player.lastLogin
        ).toLocaleString()}\n`;
        message += `Latest Logout: ${new Date(
            player.lastLogout
        ).toLocaleString()}\n`;
        message += `Experience: ${player.networkExp}\n`;
        message += `Most Recent Game Type: ${player.mostRecentGameType}`;
        message += "**";

        return {
            color: green,
            title: `General Info for ${args[0]}`,
            message: `${message}`,
        };
    } catch {
        return {
            color: red,
            title: `API error`,
            message: `**${args[0]} exists but the API has not returned the proper info.**`,
        };
    }
}

module.exports = hypixel;
module.exports.help = "Get general information about a Hypixel player";
