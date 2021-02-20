import { Parameters } from "../src/interfaces/parameters";
const bind = require("../src/commands/bind");
const { colors } = require("../config/main.json");
const parameters: Parameters = require("./paramters.json");

test("Test existing bind", () => {
	let localParameters = parameters;
	localParameters.args = ["hosts.windows"];
	expect(bind(localParameters).title === "hosts.windows").toBe(true);
});

test("Test list bind", () => {
	let localParameters = parameters;
	localParameters.args = ["list"];
	expect(bind(localParameters).title.includes("List of Binds")).toBe(true);
});

test("Test unexisting bind", () => {
	let localParameters = parameters;
	localParameters.args = ["bind.that.does.not.exist"];
	expect(bind(localParameters).color).toBe(colors.red);
});
