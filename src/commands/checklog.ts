import { detections, allFlags } from "../interfaces/checklog"; // Import the response interface
import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

const require_dir = require("require-dir");
const helper = require_dir("./helper");
const fs = require("fs");

const { colors, prefix } = require("../../config/main.json");
const { green, red } = colors;

async function checklog(p: Parameters): Promise<response> {
	let detections: detections = JSON.parse(
		fs.readFileSync("./config/detections.json", "utf8")
	); // Object containing all the detections
	let link: string = p.args.join("");

	// Process the link
	if (link.includes("https://pastebin.com")) {
		if (link.charAt(link.length - 1) === "/") {
			link = link.substr(0, link.length - 1); // Remove the last character if it is /
		}
		link = "https://pastebin.com/raw/" + link.split("/").pop(); // Turn it into a raw pastebin link so no processing is needed
	} else if (link === "" || link === undefined) {
		return {
			color: red,
			title: `Missing link`,
			message: `**Missing URL.**`,
		};
	}

	// CURL the URL

	let contents: any = await helper.download(link);
	if (contents === "error") {
		return {
			color: red,
			title: `Failed to download contents`,
			message: `**Failed to download contents of link. Try again.**`,
		};
	}

	// Process the contents if it's from ubuntu pastebin
	if (
		link.includes("https://paste.ubuntu.com") ||
		link.includes("https://pastebin.ubuntu.com")
	) {
		contents = contents.substring(
			contents.indexOf('<div class="paste"><pre><span></span>') + 37
		);
		contents = contents.split("</pre></div>")[0];
	}

	let type: string;
	let message: string = "";
	let allFlags: allFlags[];

	// Determine what type of log file it is and set allFlags accordingly

	if (contents.includes("Logfile of HiJackThis Fork by Alex Dragokas")) {
		allFlags = detections.hjt;
		type = "Dragokas' HiJackThis log";
	} else if (contents.includes("Logfile of Trend Micro HijackThis")) {
		allFlags = detections.hjt;
		type = "Trend Micro HiJackThis Log";
		message +=
			"Ran with Trend Micro HijackThis, This bot is incompatible with this, Please do not rely on this bot for information with these types of logs!\n";
		message +=
			"Use https://github.com/dragokas/hijackthis/raw/devel/binary/HiJackThis.exe for complete compatiblity. If you cannot do this then use Absol or Butterfly.\n\n";
	} else if (
		contents.includes("Hijackthis alternative for Unix using bash")
	) {
		type = "Unix HiJackThis Log";
		return {
			color: red,
			title: `Not Implemented`,
			message: `Unix HijackThis has not been implemented yet`,
		};
	} else if (contents.includes("---- Minecraft Crash Report ----")) {
		allFlags = detections.mccr;
		type = "Minecraft Crash Report";
	} else if (contents.includes("Time of this report")) {
		type = "DXDiag Report";
		return {
			color: red,
			title: `Not Implemented`,
			message: `DXDiag reports have not been implemented yet`,
		};
	} else {
		type = "Unknown log file type";
		return {
			color: red,
			title: `Unknown log file type`,
			message: `Unknown log file type`,
		};
	}

	// Start scanning the log
	for (let i = 0; i < allFlags.length; i++) {
		let flags = allFlags[i].flags; // Flags corresponding to one suggestion
		let res = allFlags[i].res; // The suggestion of Flags are seen
		let hasDetected: boolean = false; // If a flag inside the flags var was detected
		let flagsDetected: string[] = []; // List of flags detected

		for (let j = 0; j < flags.length; j++) {
			let flag: string = flags[j];
			if (contents.includes(flag)) {
				hasDetected = true;
				flagsDetected.push(flag);
			}
		}

		if (hasDetected) {
			message += `${flagsDetected.join(", ")}:\n`;
			message += `**${res}** \n\n`;
		}
	}

	if (message == "") {
		message += "**:green_square: No detections found.**";
	}

	return {
		color: green,
		title: `Done scanning ${link} - ${type}`,
		message: `${message}`,
	};
}

module.exports = checklog;
module.exports.help = "Scan a log. Usage:  ``" + prefix + "checklog <link>``";
