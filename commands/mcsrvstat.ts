import { response } from "../interfaces/response";

const { colors } = require("../config/main.json");
const { green, red } = colors;
const require_dir = require("require-dir");
const helper = require_dir("./helper");

async function mcsrvstat(
    args: string[],
    authorID: string,
    author: string,
    channelID: string,
    channel: any,
    creator: any,
    bot: any,
    messageObject: any
): Promise<response> {
    if (args.length !== 1) {
        return {
            color: red,
            title: "Too many arguments",
            message: "This command only takes in 1 argument.",
        };
    }

    // Get the status of the server
    let status: any = await helper.download(
        `https://api.mcsrvstat.us/2/${args[0]}`
    );

    // Error handling
    if (status === "error") {
        return {
            color: red,
            title: "An error has occured",
            message: "MCSrvStat was unreachable",
        };
    } else if (status.ip === "") {
        return {
            color: green,
            title: "Failed to get info",
            message: `${args[0]} is unreachable by the MCSrvStat API`,
        };
    } else if (!Object.keys(status).includes("players")) {
        return {
            color: green,
            title: "Failed to get info",
            message: `${args[0]} is not a Minecraft server`,
        };
    }

    let { ip, port, hostname, version } = status;
    let { online, max } = status.players;
    let motd = status.motd.clean;

    let message = "**";
    message += `IP and Port: ${ip}:${port}\n`;
    message += `Hostname: ${hostname}\n`;
    message += `Versions: ${version}\n`;
    message += `Players: ${online}/${max}\n`;
    message += `MOTD: ${motd}\n`;
    message += `**`;

    return {
        color: green,
        title: `MCSrvStat for ${args[0]}`,
        message: `${message}`,
    };
}

module.exports = mcsrvstat;
module.exports.help = "Get general information about a Minecraft server";
