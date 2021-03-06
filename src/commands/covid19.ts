import { response } from "../interfaces/response";
import { Parameters } from "../interfaces/parameters";

const coronaAPI = "https://coronavirus-tracker-api.herokuapp.com";

const require_dir = require("require-dir");
const helper = require_dir("./helper");
const { colors, prefix } = require("../../config/main.json");
const { red, green } = colors;

async function covid19(p: Parameters): Promise<response> {
	// Determine which API endpoint to use
	let endpoint: string;
	if (p.args.length === 0) {
		endpoint = "/v2/latest";
	} else if (p.args.length === 1) {
		endpoint = "/v2/locations";
	} else {
		return {
			color: red,
			title: `Incorrect amount of arguments`,
			message: `**This command only takes 1 argument**`,
		};
	}

	let result: any = await helper.download(`${coronaAPI}${endpoint}`); // Object containing statistics
	let message: string = "";

	if (result === "error" || result === undefined) {
		return {
			color: red,
			title: "Unable to reach API",
			message: `**${coronaAPI} could not be reached**`,
		};
	}

	if (p.args.length === 0) {
		// If the user doesn't specify a country
		let { confirmed, deaths, recovered } = result.latest; // Get the individual statistics
		message += `**`;
		message += `:red_square: Confirmed: ${confirmed}\n`;
		message += `:black_large_square: Deaths: ${deaths}\n`;
		message += `:green_square: Recovered: ${recovered}\n`;
		message += `**`;

		return {
			color: green,
			title: "Worldwide COVID-19 statistics",
			message: `${message}`,
		};
	} else {
		let country: string = p.args[0]; // The country / country code
		let check: string = country.length == 2 ? "country_code" : "country"; // Determine to check against country name / country code
		country = check === "country_code" ? country.toUpperCase() : country; // Force the country to uppercase if it is a country code
		var countryObj: object[] = result.locations.filter((obj) => {
			// The object containing information about the country
			return obj[check] === country;
		});

		if (countryObj.length === 0) {
			return {
				color: red,
				title: `Cannot find ${country}`,
				message: `**Cannot find a country whose name/ 2 etter code is ${country}**`,
			};
		}

		let countryName: string = countryObj[0]["country"];
		let population: number = countryObj[0]["country_population"];
		let { confirmed, deaths, recovered } = countryObj[0]["latest"];

		message += `**`;
		message += `:blue_square: Population ${population}\n`;
		message += `:red_square: Confirmed: ${confirmed}\n`;
		message += `:black_large_square: Deaths: ​​​​${deaths}\n`;
		message += `:green_square: Recovered: ${recovered}\n`;
		message += `**`;

		return {
			color: green,
			title: `COVID-19 statistics for ${countryName}`,
			message: `${message}`,
		};
	}
}

module.exports = covid19;
module.exports.help =
	"Get COVID-19 information. Usage: ``" + prefix + "covid19 <country>``";
