import { response } from "../interfaces/response";

const os = require("os");
const osutils = require("node-os-utils");
const cdd = require("check-disk-space");

const require_dir = require("require-dir");
const helper = require_dir("./helper");

const { drives, colors } = require("../../config/main.json");
const { green } = colors;

async function htop(): Promise<response> {
	let title: string = "System Status for " + helper.getADate();
	let message: string = "";

	function MBtoGB(mb) {
		let gb = mb / 1000;
		return gb.toFixed(2);
	}

	let loadAvg: number[] = os.loadavg(); // 1, 5, 15 load averages
	let opersys: string = await osutils.os.oos(); // Operating system
	let {
		totalMemMb,
		usedMemMb,
		freeMemMb,
		freeMemPercentage,
	} = await osutils.mem.info(); // Memory info
	let cpuUsage: number = await osutils.cpu.usage(); // CPU usage
	let kernel: string = await helper.execBash("uname -r"); // Kernel
	let uptime: number = helper.secondsToDHMS(await osutils.os.uptime()); // Uptime in DHMS

	message += "**";
	message += `System Information\n`;
	message += `Operating System: ${opersys}\n`;
	message += `Kernel: ${kernel}\n`;
	message += `Uptime: ${uptime}\n\n`;

	message += `CPU and Memory \n`;
	message += `CPU Usage: ${cpuUsage}% usage\n`;
	message += `Load Avg: ${loadAvg[0]}, ${loadAvg[1]}, ${loadAvg[2]}\n`;
	message += `Used Mem: ${MBtoGB(usedMemMb)}GB / ${MBtoGB(
		totalMemMb
	)}GB used\n`;
	message += `Free Mem: ${MBtoGB(
		freeMemMb
	)}GB or ${freeMemPercentage}% free\n\n`;

	message += "Disk Space \n";
	for (let i = 0; i < drives.length; i++) {
		let currentDrive = drives[i];
		let info = await cdd(currentDrive);

		let { diskPath, free, size } = info;
		free = (free / 1073741824).toFixed(2); // Convert free to GB
		size = (size / 1073741824).toFixed(2); // Convert size to GB

		message += diskPath + ": " + free + "/" + size + " GiB free \n";
	}

	message += "**";
	return { color: green, title: title, message: message };
}

module.exports = htop;
module.exports.help = "Get system stats about the host";
