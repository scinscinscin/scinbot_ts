import { Parameters } from "../src/interfaces/parameters";
const about = require("../src/commands/about");
const { colors } = require("../config/main.json");
const parameters: Parameters = require("./parameters.json");

test("Test the about command", () => {
	expect(about(parameters).color).toBe(colors.green);
});
