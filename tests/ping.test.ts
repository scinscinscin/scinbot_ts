import { Parameters } from "../src/interfaces/parameters";
const ping = require("../src/commands/ping");
const { colors } = require("../config/main.json");
const parameters: Parameters = require("./parameters.json");

test("Test the about command", () => {
	let response = ping(parameters);
	expect(response.color === colors.green && response.title === "Ping").toBe(
		true
	);
});
