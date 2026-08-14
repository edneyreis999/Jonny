"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { validateProject } = require("../validate-state-architecture");

const projectRoot = path.join(__dirname, "..", "..");

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value));
}

function createPage(options = {}) {
  return {
    trigger: options.trigger ?? 3,
    conditions: options.conditions || {},
    list: options.list || [{ code: 0, parameters: [], indent: 0 }]
  };
}

function createMap(options = {}) {
  return {
    width: options.width || 17,
    height: options.height || 13,
    note: options.note || "",
    events: options.events || [null, { id: 1, name: "Fixture", pages: [createPage(options)] }]
  };
}

function createFixture(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jhonny-state-validator-"));
  writeJson(path.join(root, "data", "System.json"), { switches: ["", "Named Switch"], variables: ["", "Named Variable"] });
  writeJson(path.join(root, "data", "CommonEvents.json"), [null]);
  writeJson(path.join(root, "data", "MapInfos.json"), [null, { id: 1, name: "Fixture" }]);
  writeJson(path.join(root, "data", "Map001.json"), createMap(options));
  fs.mkdirSync(path.join(root, "js"), { recursive: true });
  fs.writeFileSync(path.join(root, "js", "plugins.js"), "var $plugins = [{ name: 'KnownPlugin', status: true, parameters: {} }];");
  return root;
}

function validateFixture(root) {
  return validateProject(root, { warningAllowlist: new Map() });
}

function copyJson(source, target) {
  writeJson(target, JSON.parse(fs.readFileSync(source, "utf8")));
}

function createVerticalFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jhonny-vertical-validator-"));
  copyJson(path.join(projectRoot, "data", "System.json"), path.join(root, "data", "System.json"));
  writeJson(path.join(root, "data", "CommonEvents.json"), [null]);
  const sourceInfos = JSON.parse(fs.readFileSync(path.join(projectRoot, "data", "MapInfos.json"), "utf8"));
  const mapInfos = [null];
  for (const mapId of [10, 27, 28, 29, 30, 31]) {
    mapInfos[mapId] = sourceInfos[mapId];
    copyJson(path.join(projectRoot, "data", `Map${String(mapId).padStart(3, "0")}.json`), path.join(root, "data", `Map${String(mapId).padStart(3, "0")}.json`));
  }
  writeJson(path.join(root, "data", "MapInfos.json"), mapInfos);
  fs.mkdirSync(path.join(root, "js"), { recursive: true });
  fs.copyFileSync(path.join(projectRoot, "js", "plugins.js"), path.join(root, "js", "plugins.js"));
  return root;
}

test("reports missing map mode and unnamed state references", () => {
  const root = createFixture({ list: [{ code: 121, parameters: [2, 2, 0], indent: 0 }] });
  const result = validateFixture(root);
  assert.ok(result.findings.some(finding => finding.code === "MISSING_MAP_MODE"));
  assert.ok(result.findings.some(finding => finding.code === "UNNAMED_STATE_REFERENCE"));
  assert.strictEqual(result.summary.untriagedWarning, 2);
});

test("reports an autorun erased without a prior persistent commit", () => {
  const root = createFixture({ note: "<JhonnyMapMode: vn>", list: [{ code: 214, parameters: [], indent: 0 }, { code: 121, parameters: [1, 1, 0], indent: 0 }] });
  const result = validateFixture(root);
  assert.ok(result.findings.some(finding => finding.code === "EPHEMERAL_AUTORUN_ERASE"));
});

test("accepts a shaped commit before erase and an active plugin command", () => {
  const list = [
    { code: 121, parameters: [1, 1, 0], indent: 0 },
    { code: 214, parameters: [], indent: 0 },
    { code: 357, parameters: ["KnownPlugin", "Run", "", {}], indent: 0 }
  ];
  const result = validateFixture(createFixture({ note: "<JhonnyMapMode: vn>", list }));
  assert.ok(!result.findings.some(finding => finding.code === "EPHEMERAL_AUTORUN_ERASE"));
  assert.ok(!result.findings.some(finding => finding.code === "INACTIVE_PLUGIN_COMMAND"));
});

test("discovers maps added beyond the former 1..31 hardcode", () => {
  const root = createFixture({ note: "<JhonnyMapMode: vn>" });
  writeJson(path.join(root, "data", "MapInfos.json"), [null, { id: 1, name: "Fixture" }, { id: 2, name: "New Map" }]);
  writeJson(path.join(root, "data", "Map002.json"), createMap());
  const result = validateFixture(root);
  assert.ok(result.findings.some(finding => finding.code === "MISSING_MAP_MODE" && finding.source === "Map002"));
});

test("rejects a state commit to the wrong variable", () => {
  const root = createVerticalFixture();
  const mapPath = path.join(root, "data", "Map030.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const commit = map.events[1].pages[0].list.find(command => command.code === 122);
  commit.parameters = [7, 7, 0, 0, 1];
  writeJson(mapPath, map);
  const result = validateFixture(root);
  assert.ok(result.findings.some(finding => finding.code === "VERTICAL_FLOW_CONTRACT" && finding.source === "Map030"));
  assert.ok(result.findings.some(finding => finding.code === "MISSING_STATE_OWNER"));
});

test("rejects an invalid declared controller terminal threshold", () => {
  const root = createVerticalFixture();
  for (const mapId of [27, 28, 30, 31]) {
    const mapPath = path.join(root, "data", `Map${String(mapId).padStart(3, "0")}.json`);
    const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
    map.events[1].name = "State Controller";
    if (mapId === 30) {
      const terminal = map.events[1].pages[1] || createPage({
        trigger: 3,
        conditions: { variableValid: true, variableId: 6, variableValue: 1 },
        list: [{ code: 201, parameters: [0, 31, 8, 6, 2, 0], indent: 0 }, { code: 115, parameters: [], indent: 0 }, { code: 0, parameters: [], indent: 0 }]
      });
      terminal.conditions.variableValue = 0;
      map.events[1].pages[1] = terminal;
    }
    writeJson(mapPath, map);
  }
  const result = validateFixture(root);
  assert.ok(result.findings.some(finding => finding.code === "STATE_CONTROLLER_CONTRACT" && finding.source === "Map030 EV1 P2"));
});

test("accepts the current vertical flow and triages every known warning", () => {
  const result = validateProject(projectRoot);
  assert.ok(!result.findings.some(finding => finding.code === "VERTICAL_FLOW_CONTRACT"));
  assert.strictEqual(result.summary.error, 0);
  assert.strictEqual(result.summary.warning, 7);
  assert.strictEqual(result.summary.allowlistedWarning, 7);
  assert.strictEqual(result.summary.untriagedWarning, 0);
});
