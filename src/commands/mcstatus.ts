import { response } from "../interfaces/response";

const { colors } = require("../../config/main.json");
const { green, red } = colors;
const require_dir = require("require-dir");
const helper = require_dir("./helper");

// List of services to be pinged
const services: string[] = [
    "minecraft.net",
    "session.minecraft.net",
    "account.mojang.com",
    "authserver.mojang.com",
    "sessionserver.mojang.com",
    "api.mojang.com",
    "textures.minecraft.net",
    "mojang.com",
    "piston-meta.mojang.com",
    "auth.xboxlive.com",
];

async function mcstatus(
    args: string[],
    authorID: string,
    author: string,
    channelID: string,
    channel: any,
    creator: any,
    bot: any,
    messageObject: any
): Promise<response> {
    let versions = await helper.download(
        "https://launchermeta.mojang.com/mc/game/version_manifest.json"
    );
    let message: string = "**";

    // Handle domains
    for (let i = 0; i < services.length; i++) {
        let workingService = services[i]; // The domain being checked
        let status: Boolean = false;

        if (workingService === "session.minecraft.net") {
            let HTTPCode = await helper.getHTTPCode(`http://${workingService}`);
            if (HTTPCode !== "error") {
                status = true;
            }
        } else {
            status = await helper.pingDomain(workingService);
        }

        if (status) {
            message += `:green_square: ${workingService} \n`;
        } else {
            message += `:red_square: ${workingService} \n`;
        }
    }
    message += `\n`;

    //Handle MC versions
    if (versions === "error" || versions === undefined) {
        message += `https://launchermeta.mojang.com/mc/game/version_manifest.json is not reachable.`;
    } else {
        let { release, snapshot } = versions.latest;
        message += `Versions:\n`;
        message += `Latest Release: ${release}\n`;
        message += `Latest Snapshot: ${snapshot}\n`;
    }
    message += `**`;
    return { color: green, title: "MCServices Check", message: message };
}

module.exports = mcstatus;
module.exports.help =
    "Show the status of Mojang + Minecraft + Microsoft services";
