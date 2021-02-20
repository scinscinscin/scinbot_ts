import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

const { colors } = require("../../config/main.json");
const green: string = colors.green;

function about(p: Parameters): response {
	let message: string;
	message = "**";
	message += "Info: \n";
	message += `Discord bot in TypeScript \n\n`;
	message += `Creator: ${p.creator.username}#${p.creator.discriminator} \n`;
	message += `Creator ID: ${p.creator.id} \n`;
	message += `Bot: ${p.bot.username}#${p.bot.discriminator} \n`;
	message += `Bot ID: ${p.bot.id} \n`;
	message += "**";

	return {
		color: green,
		title: `About ${p.bot.username}`,
		message: `${message}`,
	};
}

module.exports = about;
module.exports.help = "Print information about scinbot_ts";
