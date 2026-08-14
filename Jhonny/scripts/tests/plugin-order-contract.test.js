"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const test = require("node:test");
const vm = require("vm");

const HELPER_NAME = "Jhonny_MapMode";
const pluginConfigPath = path.join(__dirname, "..", "..", "js", "plugins.js");

function parsePluginConfig(filePath) {
    const context = {};
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
    if (!Array.isArray(context.$plugins)) throw new Error("plugins.js must define a $plugins array");
    return context.$plugins;
}

function validatePluginContract(plugins) {
    const issues = [];
    const helperEntries = plugins.map((plugin, index) => ({ plugin, index })).filter(entry => entry.plugin.name === HELPER_NAME);
    if (helperEntries.length !== 1) {
        issues.push(`HELPER_ENTRY_COUNT: expected 1, found ${helperEntries.length}`);
        return issues;
    }
    const helper = helperEntries[0];
    if (helper.plugin.status !== true) issues.push("HELPER_INACTIVE: Jhonny_MapMode must be active");
    const parameterKeys = Object.keys(helper.plugin.parameters || {});
    if (parameterKeys.length > 0) issues.push(`HELPER_PARAMETERS: unexpected keys ${parameterKeys.join(",")}`);
    const activeVisuIndexes = plugins
        .map((plugin, index) => ({ plugin, index }))
        .filter(entry => entry.plugin.status === true && entry.plugin.name.startsWith("VisuMZ_"))
        .map(entry => entry.index);
    if (activeVisuIndexes.length > 0 && helper.index < Math.max(...activeVisuIndexes)) {
        issues.push("HELPER_BEFORE_VISUSTELLA: Jhonny_MapMode must load after every active VisuMZ plugin");
    }
    return issues;
}

function plugin(name, status = true, parameters = {}) {
    return { name, status, parameters };
}

test("accepts one active parameterless helper after active VisuStella plugins", () => {
    const plugins = [plugin("VisuMZ_0_CoreEngine"), plugin("VisuMZ_1_EventsMoveCore"), plugin(HELPER_NAME)];
    assert.deepStrictEqual(validatePluginContract(plugins), []);
});

test("rejects duplicate, inactive, parameterized, and misordered helper entries", () => {
    assert.deepStrictEqual(validatePluginContract([plugin(HELPER_NAME), plugin(HELPER_NAME)]), ["HELPER_ENTRY_COUNT: expected 1, found 2"]);
    assert.deepStrictEqual(validatePluginContract([plugin(HELPER_NAME, false)]), ["HELPER_INACTIVE: Jhonny_MapMode must be active"]);
    assert.deepStrictEqual(validatePluginContract([plugin(HELPER_NAME, true, { legacy: "1" })]), ["HELPER_PARAMETERS: unexpected keys legacy"]);
    assert.deepStrictEqual(validatePluginContract([plugin(HELPER_NAME), plugin("VisuMZ_0_CoreEngine")]), ["HELPER_BEFORE_VISUSTELLA: Jhonny_MapMode must load after every active VisuMZ plugin"]);
});

test("project plugins.js satisfies the approved helper contract", () => {
    const plugins = parsePluginConfig(pluginConfigPath);
    assert.deepStrictEqual(validatePluginContract(plugins), []);
});

module.exports = { parsePluginConfig, validatePluginContract };
