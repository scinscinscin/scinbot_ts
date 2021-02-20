import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

const { colors } = require("../../config/main.json");
const { green } = colors;

function ping(p: Parameters): response {
	let messageSent: number = p.messageObject.createdTimestamp;
	let currentTime: number = Math.floor(Date.now());
	let ping: number = currentTime - messageSent;

	return { color: green, title: `Ping`, message: `**${ping}ms**` };
}

module.exports = ping;
module.exports.help = "Ping scinbot_ts and get response time";
