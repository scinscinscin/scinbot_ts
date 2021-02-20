import { Parameters } from "../src/interfaces/parameters";
const testCommand = require("../src/commands/test");
const { colors } = require("../config/main.json");
let parameters: Parameters = require("./paramters.json");

test("Test the about command", () => {
	expect(testCommand(parameters).title).toBe("Test Successful");
});
