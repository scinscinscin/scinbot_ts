import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

const { colors } = require("../../config/main.json");
const { green, red } = colors;
const require_dir = require("require-dir");
const helper = require_dir("./helper");
const xml2js = require("xml2js");

const jarTypes: Object = {
	vanilla_client: async function (ver: string): Promise<response> {
		return await vanilla(ver, "client");
	},
	vanilla_server: async function (ver: string): Promise<response> {
		return await vanilla(ver, "server");
	},
	fabric: async function (ver: string): Promise<response> {
		let versionsList: any = await helper.download(
			"https://launchermeta.mojang.com/mc/game/version_manifest.json" // Get the versions list
		);
		let downloadObject: any = versionsList.versions.filter((obj) => {
			return obj.id === ver; // Get the object where the version is the version put in the user
		})[0];

		// Error handling if the user put in a version of minecraft that doesn't exist
		if (downloadObject === undefined) {
			return {
				color: red,
				title: `Cannot find ${ver}`,
				message: `${ver} does not exist as a minecraft version`,
			};
		}

		let releaseTime = downloadObject.time;
		let fabricCompatible: Boolean = // Check if the version that was put in is compatible with fabric
			new Date(releaseTime).valueOf() -
				new Date("2019-08-22T12:46:36+00:00").valueOf() >=
				0 && ver !== "18w43a";

		if (!fabricCompatible) {
			return {
				color: red,
				title: `${ver} is not compatible with fabric`,
				message: `${ver} is too old and incompatible with the fabric installer`,
			};
		}

		//Download and convert XML to JSON
		let latestBuildXML = await helper.download(
			"https://maven.fabricmc.net/net/fabricmc/fabric-installer/maven-metadata.xml"
		);
		let latestBuildJSON: any;
		xml2js.parseString(latestBuildXML, (err, result) => {
			if (err) {
				console.log("Failed to convert XML to JSON");
			}

			latestBuildJSON = result;
		});
		let latestBuild = latestBuildJSON.metadata.versioning[0].latest[0];
		let latestBuildLink = `https://maven.fabricmc.net/net/fabricmc/fabric-installer/${latestBuild}/fabric-installer-${latestBuild}.jar`;

		// Form and send message to user
		let message = "**";
		message +=
			"Download the latest version of the fabric installer from: \n";
		message += `${latestBuildLink} \n\n`;
		message += "Install it using the following command for a client: \n";
		message += "**";
		message +=
			"```java -jar ./fabric-installer-" +
			latestBuild +
			'.jar client -mcversion "' +
			ver +
			'"\n```';
		message += "**";
		message += "Install it using the following command for a server: \n";
		message += "**";
		message +=
			"```java -jar ./fabric-installer-" +
			latestBuild +
			'.jar server -mcversion "' +
			ver +
			'" -downloadMinecraft```';

		return { color: green, title: `${ver}`, message: `${message}` };
	},
	spigot: async function (ver: string): Promise<response> {
		return await bukkitSpigot(ver, "spigot");
	},
	bukkit: async function (ver: string): Promise<response> {
		return await bukkitSpigot(ver, "bukkit");
	},
	paper: async function (ver: string): Promise<response> {
		const pAPI = "https://papermc.io/api/v2/projects/paper/versions/";
		let supportedVersions: string[] = (
			await helper.download("https://papermc.io/api/v2/projects/paper/")
		).versions;
		if (!supportedVersions.includes(ver)) {
			return {
				color: red,
				title: "Not a paper version",
				message: `Either it isn't a version number, or it is unsupported by Paper`,
			};
		}

		// This warcrime was sponsored by the Paper API
		let buildsJSON = await helper.download(
			`https://papermc.io/api/v2/projects/paper/versions/${ver}`
		);
		let latestBuild = buildsJSON.builds[buildsJSON.builds.length - 1];
		let buildNameJSON = await helper.download(
			`https://papermc.io/api/v2/projects/paper/versions/${ver}/builds/${latestBuild}/`
		);
		let buildName = buildNameJSON.downloads.application.name;
		let downloadLink = `https://papermc.io/api/v2/projects/paper/versions/${ver}/builds/${latestBuild}/downloads/${buildName}`;

		return {
			color: green,
			title: `${ver}-${latestBuild}`,
			message: `${downloadLink}`,
		};
	},
	tuinity: async function (ver: string): Promise<response> {
		return {
			color: green,
			title: `Tuinity`,
			message: `https://ci.codemc.io/job/Spottedleaf/job/Tuinity/lastSuccessfulBuild/artifact/tuinity-paperclip.jar`,
		};
	},
	forge: async function (ver: string): Promise<response> {
		let promotions: any = await helper.download(
			"https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json"
		);
		let build = promotions["promos"][`${ver}-latest`];

		if (build === undefined) {
			return {
				color: red,
				title: "Not a forge version",
				message: `Cannot find a forge build for ${ver}`,
			};
		}

		let downloadLink = `**https://files.minecraftforge.net/maven/net/minecraftforge/forge/${ver}-${build}/forge-${ver}-${build}-installer.jar**`;
		return { color: green, title: `${ver}`, message: `${downloadLink}` };
	},
	spongevanilla: async function (ver: string): Promise<response> {
		return {
			color: green,
			title: `SpongeVanilla`,
			message: `**This might be outdated**\n\nhttps://repo.spongepowered.org/maven/org/spongepowered/spongevanilla/1.12.2-7.3.1-RC391/spongevanilla-1.12.2-7.3.1-RC391.jar`,
		};
	},
	mohist: async function (ver: string): Promise<response> {
		let status = await helper.download(
			`https://ci.codemc.io/job/Mohist-Community/job/Mohist-${ver}/`
		);
		if (status === "error") {
			return {
				color: red,
				title: "Not a Mohist version",
				message: `Either it isn't a version number, or it is unsupported by Mohist`,
			};
		}

		let downloadLink = `https://ci.codemc.io/job/Mohist-Community/job/Mohist-${ver}/lastSuccessfulBuild/artifact/*zip*/archive.zip`;
		return {
			color: green,
			title: `${ver}`,
			message: `${downloadLink}`,
		};
	},
	magma: async function (ver: string): Promise<response> {
		return {
			color: green,
			title: `Magma`,
			message: `https://ci.hexeption.dev/job/Magma%20Foundation/job/Magma/job/master/lastSuccessfulBuild/artifact/*zip*/archive.zip`,
		};
	},
};

// Functions so we don't reuse code
async function vanilla(ver: string, type: string): Promise<response> {
	let versionsList = await helper.download(
		"https://launchermeta.mojang.com/mc/game/version_manifest.json" // Get the versions list
	);
	let downloadObject: any = versionsList.versions.filter((obj) => {
		return obj.id === ver; // Get the object where the version is the version put in the user
	})[0];

	// Error handling if the user put in a version of minecraft that doesn't exist
	if (downloadObject === undefined) {
		return {
			color: red,
			title: `Cannot find ${ver}`,
			message: `${ver} does not exist as a minecraft version`,
		};
	}
	// Get the versionJSON
	let versionJSON: Promise<object> = await helper.download(
		downloadObject.url
	);
	// Return url for client/server from the versionJSON
	return {
		color: green,
		title: `${ver}`,
		message: `**${versionJSON["downloads"][type]["url"]}**`,
	};
}

async function bukkitSpigot(ver: string, type: string): Promise<response> {
	// Check if the supplied version is supported by BuildTools using the same check it uses
	let download = await helper.download(
		`https://hub.spigotmc.org/versions/${ver}.json`
	);
	if (download === "error") {
		return {
			color: red,
			title: `Cannot find ${ver}`,
			message: `${ver} does not exist as a ${type} version`,
		};
	}

	let message: string = "**";
	message += "Download the latest version of BuildTools from: \n";
	message +=
		"https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar\n";
	message += "And build using: \n";
	message += "**";

	if (type === "bukkit") {
		message +=
			'```java -jar BuildTools.jar --compile craftbukkit --rev "' +
			ver +
			'"```\n';
	} else if (type === "spigot") {
		message += '```java -jar BuildTools.jar --rev "' + ver + '"```\n';
	}

	return { color: green, title: `${ver}`, message: `${message}` };
}
async function mcjar(p: Parameters): Promise<response> {
	// Check amount of arguments
	if (p.args.length !== 2) {
		return {
			color: red,
			title: "Incorrect amount of arguments",
			message: "This command only takes in 2 argument.",
		};
	}

	// Get jartype and version
	let jarType: string = p.args.shift()!.toLowerCase();
	let version: string = p.args.shift()!;

	// Sub command handler
	if (!Object.keys(jarTypes).includes(jarType)) {
		return {
			color: red,
			title: "Unknown jartype",
			message: `**Cannot find jartype ${jarType}.\nRecognized jar types include: ${Object.keys(
				jarTypes
			).join(", ")}**`,
		};
	} else {
		let response: Promise<response> = await jarTypes[jarType](version);
		return response;
	}
}

module.exports = mcjar;
module.exports.help =
	"Get the download link + instructions on deploying a server";
