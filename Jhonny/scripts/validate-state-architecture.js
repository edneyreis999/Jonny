"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const VALID_MAP_MODES = new Set(["vn", "exploration", "minigame", "transition"]);
const VERTICAL_MAP_IDS = Object.freeze([27, 28, 29, 30, 31]);
const MAP_EXCLUSIONS = new Map([
  [32, "EDITOR_GROUP_PLACEHOLDER: Visual Novel"],
  [33, "EDITOR_GROUP_PLACEHOLDER: Gameplay"],
  [34, "EDITOR_GROUP_PLACEHOLDER: Corrida"],
  [35, "EDITOR_GROUP_PLACEHOLDER: RPG"]
]);
const PROJECT_WARNING_ALLOWLIST = new Map([
  ["EPHEMERAL_AUTORUN_ERASE|Map001 EV1 P1", "legacy Map001 autorun; remediation is outside plan 011"],
  ["EPHEMERAL_AUTORUN_ERASE|Map001 EV1 P2", "legacy Map001 autorun; remediation is outside plan 011"],
  ["EPHEMERAL_AUTORUN_ERASE|Map001 EV1 P3", "legacy Map001 autorun; remediation is outside plan 011"],
  ["UNNAMED_STATE_REFERENCE|CE20 Fala-ID1", "legacy dialogue switch 43; naming is outside plan 011"],
  ["UNNAMED_STATE_REFERENCE|CE21 Fala-ID2", "legacy dialogue switch 44; naming is outside plan 011"],
  ["UNNAMED_STATE_REFERENCE|CE22 Fala-ID3", "legacy dialogue switch 45; naming is outside plan 011"],
  ["UNNAMED_STATE_REFERENCE|CE23 Fala-ID4", "legacy dialogue switch 46; naming is outside plan 011"]
]);

function createFinding(code, severity, source, evidence) {
  return { code, severity, source, evidence };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getMapPath(projectRoot, mapId) {
  return path.join(projectRoot, "data", `Map${String(mapId).padStart(3, "0")}.json`);
}

function mapSource(mapId) {
  return `Map${String(mapId).padStart(3, "0")}`;
}

function loadPlugins(projectRoot, findings) {
  const pluginPath = path.join(projectRoot, "js", "plugins.js");
  const context = {};
  vm.createContext(context);
  try {
    vm.runInContext(fs.readFileSync(pluginPath, "utf8"), context, { filename: pluginPath });
  } catch (error) {
    findings.push(createFinding("PLUGIN_CONFIG_PARSE_ERROR", "error", "js/plugins.js", error.message));
    return new Set();
  }
  if (!Array.isArray(context.$plugins)) {
    findings.push(createFinding("PLUGIN_CONFIG_MISSING", "error", "js/plugins.js", "$plugins is not an array"));
    return new Set();
  }
  return new Set(context.$plugins.filter(plugin => plugin.status).map(plugin => plugin.name));
}

function loadMaps(projectRoot, mapInfos, findings) {
  const maps = new Map();
  for (const info of mapInfos.filter(Boolean)) {
    try {
      maps.set(info.id, readJson(getMapPath(projectRoot, info.id)));
    } catch (error) {
      findings.push(createFinding("MAP_PARSE_ERROR", "error", mapSource(info.id), error.message));
    }
  }
  return maps;
}

function checkNamedRange(names, firstId, lastId, source, kind, findings) {
  for (let id = firstId; id <= lastId; id++) {
    if (!names[id]) {
      findings.push(createFinding("UNNAMED_STATE_REFERENCE", "warning", source, `${kind} ${id} has no name in System.json`));
    }
  }
}

function checkPageConditions(page, source, system, findings) {
  const conditions = page.conditions || {};
  if (conditions.switch1Valid) checkNamedRange(system.switches, conditions.switch1Id, conditions.switch1Id, source, "switch", findings);
  if (conditions.switch2Valid) checkNamedRange(system.switches, conditions.switch2Id, conditions.switch2Id, source, "switch", findings);
  if (conditions.variableValid) checkNamedRange(system.variables, conditions.variableId, conditions.variableId, source, "variable", findings);
}

function checkDirectTransfer(parameters, source, context) {
  if (parameters[0] !== 0) return;
  const [designation, mapId, x, y] = parameters;
  void designation;
  const target = context.maps.get(mapId);
  if (!target) {
    context.findings.push(createFinding("INVALID_TRANSFER_TARGET", "error", source, `Map ${mapId} does not exist`));
    return;
  }
  if (MAP_EXCLUSIONS.has(mapId)) {
    context.findings.push(createFinding("TRANSFER_TO_EXCLUDED_MAP", "error", source, `Map ${mapId} is excluded: ${MAP_EXCLUSIONS.get(mapId)}`));
  }
  if (x < 0 || y < 0 || x >= target.width || y >= target.height) {
    context.findings.push(createFinding("INVALID_TRANSFER_COORDINATES", "error", source, `Map ${mapId} coordinate (${x},${y}) is outside ${target.width}x${target.height}`));
  }
}

function checkCommand(command, source, context) {
  const parameters = command.parameters || [];
  if (command.code === 121) checkNamedRange(context.system.switches, parameters[0], parameters[1], source, "switch", context.findings);
  if (command.code === 122) checkNamedRange(context.system.variables, parameters[0], parameters[1], source, "variable", context.findings);
  if (command.code === 117 && !context.commonEvents[parameters[0]]) {
    context.findings.push(createFinding("MISSING_COMMON_EVENT", "error", source, `Common Event ${parameters[0]} does not exist`));
  }
  if (command.code === 201) checkDirectTransfer(parameters, source, context);
  if (command.code === 357 && !context.activePlugins.has(parameters[0])) {
    context.findings.push(createFinding("INACTIVE_PLUGIN_COMMAND", "warning", source, `Plugin ${parameters[0]} is not active`));
  }
}

function isValidPersistentCommand(command) {
  const parameters = command.parameters || [];
  if (command.code === 121) {
    return Number.isInteger(parameters[0]) && Number.isInteger(parameters[1]) && parameters[0] <= parameters[1] && [0, 1].includes(parameters[2]);
  }
  if (command.code === 122) {
    return Number.isInteger(parameters[0]) && Number.isInteger(parameters[1]) && parameters[0] <= parameters[1] && parameters[2] >= 0 && parameters[2] <= 5 && parameters[3] >= 0 && parameters[3] <= 4;
  }
  return command.code === 123 && /^[A-D]$/.test(parameters[0]) && [0, 1].includes(parameters[1]);
}

function hasPersistentCommitBefore(page, terminalIndex) {
  const list = page.list || [];
  const terminalIndent = list[terminalIndex].indent || 0;
  return list.slice(0, terminalIndex).some(command => isValidPersistentCommand(command) && (command.indent || 0) <= terminalIndent);
}

function checkAutorunPersistence(page, source, findings) {
  if (page.trigger !== 3) return;
  const list = page.list || [];
  for (let index = 0; index < list.length; index++) {
    if (list[index].code === 214 && !hasPersistentCommitBefore(page, index)) {
      findings.push(createFinding("EPHEMERAL_AUTORUN_ERASE", "warning", source, "Autorun reaches Erase Event without a valid persistent commit earlier on the same or parent path"));
    }
  }
}

function extractMapMode(note) {
  const match = String(note || "").match(/<JhonnyMapMode\s*:\s*([^>]+)>/i);
  return match ? match[1].trim() : "";
}

function checkMapExclusions(maps, mapInfos, findings) {
  for (const [mapId, reason] of MAP_EXCLUSIONS) {
    if (!mapInfos[mapId]) continue;
    const map = maps.get(mapId);
    if (!map) continue;
    const eventCount = (map.events || []).filter(Boolean).length;
    if (extractMapMode(map.note) || eventCount > 0) {
      findings.push(createFinding("INVALID_MAP_EXCLUSION", "error", mapSource(mapId), `${reason} no longer matches an empty, untagged grouping map`));
    }
  }
}

function checkMap(info, map, context) {
  const source = mapSource(info.id);
  const mode = extractMapMode(map.note);
  if (!mode) context.findings.push(createFinding("MISSING_MAP_MODE", "warning", source, "JhonnyMapMode is required for playable maps"));
  if (mode && !VALID_MAP_MODES.has(mode)) context.findings.push(createFinding("INVALID_MAP_MODE", "warning", source, `Unsupported mode: ${mode}`));
  for (const event of (map.events || []).filter(Boolean)) {
    for (let pageIndex = 0; pageIndex < event.pages.length; pageIndex++) {
      const page = event.pages[pageIndex];
      const pageSource = `${source} EV${event.id} P${pageIndex + 1}`;
      checkPageConditions(page, pageSource, context.system, context.findings);
      for (const command of page.list || []) checkCommand(command, pageSource, context);
      checkAutorunPersistence(page, pageSource, context.findings);
    }
  }
}

function collectStateReferences(maps) {
  const references = [];
  for (const [mapId, map] of maps) {
    for (const event of (map.events || []).filter(Boolean)) {
      for (let pageIndex = 0; pageIndex < event.pages.length; pageIndex++) {
        collectPageReferences(mapId, event, pageIndex, references);
      }
    }
  }
  return references;
}

function collectPageReferences(mapId, event, pageIndex, references) {
  const page = event.pages[pageIndex];
  const source = `${mapSource(mapId)} EV${event.id} P${pageIndex + 1}`;
  const conditions = page.conditions || {};
  if (conditions.variableValid && conditions.variableId === 6) references.push({ state: "VAR6", kind: "reader", source });
  if ((conditions.switch1Valid && conditions.switch1Id === 30) || (conditions.switch2Valid && conditions.switch2Id === 30)) references.push({ state: "SW30", kind: "reader", source });
  for (const command of page.list || []) collectCommandReference(command, source, references);
}

function collectCommandReference(command, source, references) {
  const parameters = command.parameters || [];
  if (command.code === 121 && parameters[0] <= 30 && parameters[1] >= 30) references.push({ state: "SW30", kind: "writer", source, command });
  if (command.code === 122 && parameters[0] <= 6 && parameters[1] >= 6) references.push({ state: "VAR6", kind: "writer", source, command });
  if (command.code === 111 && parameters[0] === 0 && parameters[1] === 30) references.push({ state: "SW30", kind: "reader", source, command });
  if (command.code === 111 && parameters[0] === 1 && parameters[1] === 6) references.push({ state: "VAR6", kind: "reader", source, command });
  if ([355, 655].includes(command.code)) checkScriptStateReference(String(parameters[0] || ""), source, references);
}

function checkScriptStateReference(script, source, references) {
  if (/\$gameVariables\.(?:value|setValue)\(\s*6\s*[,)]/.test(script)) references.push({ state: "VAR6", kind: "script", source });
  if (/\$gameSwitches\.(?:value|setValue)\(\s*30\s*[,)]/.test(script)) references.push({ state: "SW30", kind: "script", source });
}

function checkStateRegistry(maps, findings) {
  const allowed = new Set([
    "VAR6|writer|Map030 EV1 P1",
    "VAR6|reader|Map029 EV2 P2",
    "VAR6|reader|Map030 EV1 P2",
    "SW30|writer|Map028 EV1 P1",
    "SW30|reader|Map029 EV1 P2",
    "SW30|reader|Map031 EV1 P1"
  ]);
  const required = new Set([...allowed].filter(key => key !== "VAR6|reader|Map030 EV1 P2"));
  const references = collectStateReferences(maps);
  for (const reference of references) {
    const key = `${reference.state}|${reference.kind}|${reference.source}`;
    if (reference.kind === "script" || !allowed.has(key)) findings.push(createFinding("UNDECLARED_STATE_OWNER", "error", reference.source, `${reference.kind} of ${reference.state} is not in the approved registry`));
    required.delete(key);
  }
  for (const key of required) findings.push(createFinding("MISSING_STATE_OWNER", "error", "state-registry", key));
}

function commandIndex(page, predicate) {
  return (page.list || []).findIndex(predicate);
}

function exactCommand(code, parameters) {
  return command => command.code === code && JSON.stringify(command.parameters || []) === JSON.stringify(parameters);
}

function hasDirectTransfer(page, mapId) {
  return commandIndex(page, command => command.code === 201 && command.parameters[0] === 0 && command.parameters[1] === mapId) >= 0;
}

function hasSelfSwitchPage(event, pageIndex, channel = "A") {
  const page = event.pages[pageIndex];
  return Boolean(page && page.conditions && page.conditions.selfSwitchValid && page.conditions.selfSwitchCh === channel);
}

function addContractError(findings, source, evidence) {
  findings.push(createFinding("VERTICAL_FLOW_CONTRACT", "error", source, evidence));
}

function checkMap27Contract(map, findings) {
  const event = map.events[1];
  const transfer = map.events[2];
  if (!event || !transfer || commandIndex(event.pages[0], exactCommand(123, ["A", 0])) < 0 || !hasSelfSwitchPage(event, 1) || !hasDirectTransfer(transfer.pages[0], 29)) {
    addContractError(findings, "Map027", "school owner, self-switch terminal, or Map029 transfer is invalid");
  }
}

function checkMap28Contract(map, findings) {
  const event = map.events[1];
  if (!event || !event.pages[1]) return addContractError(findings, "Map028", "garage owner or terminal page is missing");
  const page = event.pages[0];
  const switchIndex = commandIndex(page, exactCommand(121, [30, 30, 0]));
  const selfIndex = commandIndex(page, exactCommand(123, ["A", 0]));
  const transferIndex = commandIndex(page, command => command.code === 201 && command.parameters[0] === 0 && command.parameters[1] === 30);
  if (!(switchIndex >= 0 && switchIndex < selfIndex && selfIndex < transferIndex) || !hasSelfSwitchPage(event, 1)) addContractError(findings, "Map028", "switch/self-switch commits must precede the Map030 transfer");
}

function checkMap29Contract(map, findings) {
  const event = map.events[2];
  const unlocked = event && event.pages.find(page => page.conditions && page.conditions.variableValid && page.conditions.variableId === 6 && page.conditions.variableValue === 1);
  if (!unlocked || ![27, 28, 31, 10].every(mapId => hasDirectTransfer(unlocked, mapId))) addContractError(findings, "Map029", "world-access page does not expose the approved destinations at threshold 1");
}

function checkMap30Contract(map, findings) {
  const event = map.events[1];
  if (!event) return addContractError(findings, "Map030", "cutscene owner is missing");
  const page = event.pages[0];
  const commitIndex = commandIndex(page, exactCommand(122, [6, 6, 0, 0, 1]));
  const transferIndex = commandIndex(page, command => command.code === 201 && command.parameters[0] === 0 && command.parameters[1] === 31);
  if (!(commitIndex >= 0 && commitIndex < transferIndex)) addContractError(findings, "Map030", "constant VAR6=1 commit must precede the Map031 transfer");
}

function checkMap31Contract(map, findings) {
  const event = map.events[1];
  const page = event && event.pages[0];
  const switchCondition = page && page.conditions && page.conditions.switch1Valid && page.conditions.switch1Id === 30;
  if (!page || !switchCondition || commandIndex(page, exactCommand(123, ["A", 0])) < 0 || !hasSelfSwitchPage(event, 1)) addContractError(findings, "Map031", "garage gate, self-switch commit, or terminal page is invalid");
}

function checkDeclaredControllerPages(mapId, event, findings) {
  if (event.id !== 1) return findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", mapSource(mapId), "State Controller must reuse EV1"));
  if (mapId === 30) {
    const terminal = event.pages[1];
    const transferIndex = terminal ? commandIndex(terminal, command => command.code === 201 && command.parameters[0] === 0 && command.parameters[1] === 31) : -1;
    const exitIndex = terminal ? commandIndex(terminal, command => command.code === 115) : -1;
    const validCondition = terminal && terminal.trigger === 3 && terminal.conditions.variableValid && terminal.conditions.variableId === 6 && terminal.conditions.variableValue === 1;
    if (!validCondition || transferIndex < 0 || exitIndex <= transferIndex) findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", "Map030 EV1 P2", "terminal recovery page must use VAR6 >= 1, transfer to Map031, then exit"));
    return;
  }
  if (!hasSelfSwitchPage(event, 1) || event.pages[1].trigger !== 0) findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", `${mapSource(mapId)} EV1 P2`, "terminal page must be the later non-automatic self-switch A page"));
}

function checkDeclaredControllers(maps, findings) {
  const expectedIds = [27, 28, 30, 31];
  const declared = [];
  for (const [mapId, map] of maps) {
    const owners = (map.events || []).filter(event => event && event.name === "State Controller");
    if (owners.length > 1) findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", mapSource(mapId), "more than one State Controller is declared"));
    if (owners.length === 1) declared.push({ mapId, event: owners[0] });
  }
  if (declared.length === 0) return;
  const actualIds = new Set(declared.map(item => item.mapId));
  for (const mapId of expectedIds) if (!actualIds.has(mapId)) findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", mapSource(mapId), "approved local State Controller is missing"));
  for (const item of declared) {
    if (!expectedIds.includes(item.mapId)) findings.push(createFinding("STATE_CONTROLLER_CONTRACT", "error", mapSource(item.mapId), "State Controller is not approved for this map"));
    else checkDeclaredControllerPages(item.mapId, item.event, findings);
  }
}

function checkVerticalFlow(maps, findings) {
  if (!VERTICAL_MAP_IDS.every(mapId => maps.has(mapId))) return;
  checkMap27Contract(maps.get(27), findings);
  checkMap28Contract(maps.get(28), findings);
  checkMap29Contract(maps.get(29), findings);
  checkMap30Contract(maps.get(30), findings);
  checkMap31Contract(maps.get(31), findings);
  checkStateRegistry(maps, findings);
  checkDeclaredControllers(maps, findings);
}

function triageFindings(findings, warningAllowlist) {
  return findings.map(finding => {
    if (finding.severity !== "warning") return { ...finding, triage: "not-applicable" };
    const justification = warningAllowlist.get(`${finding.code}|${finding.source}`);
    return justification ? { ...finding, triage: "allowlisted", justification } : { ...finding, triage: "untriaged" };
  });
}

function sortFindings(findings) {
  return findings.sort((left, right) => [left.code, left.source, left.evidence].join("\u0000").localeCompare([right.code, right.source, right.evidence].join("\u0000")));
}

function summarize(findings) {
  return findings.reduce((result, finding) => {
    result[finding.severity] += 1;
    if (finding.triage === "allowlisted") result.allowlistedWarning += 1;
    if (finding.triage === "untriaged") result.untriagedWarning += 1;
    return result;
  }, { error: 0, warning: 0, allowlistedWarning: 0, untriagedWarning: 0 });
}

function validateProject(projectRoot, options = {}) {
  const findings = [];
  let system;
  let commonEvents;
  let mapInfos;
  try {
    system = readJson(path.join(projectRoot, "data", "System.json"));
    commonEvents = readJson(path.join(projectRoot, "data", "CommonEvents.json"));
    mapInfos = readJson(path.join(projectRoot, "data", "MapInfos.json"));
  } catch (error) {
    const failed = [{ ...createFinding("PROJECT_DATA_PARSE_ERROR", "error", "data", error.message), triage: "not-applicable" }];
    return { findings: failed, summary: summarize(failed) };
  }
  const maps = loadMaps(projectRoot, mapInfos, findings);
  const context = { system, commonEvents, mapInfos, maps, activePlugins: loadPlugins(projectRoot, findings), findings };
  checkMapExclusions(maps, mapInfos, findings);
  for (const commonEvent of commonEvents.filter(Boolean)) for (const command of commonEvent.list || []) checkCommand(command, `CE${commonEvent.id} ${commonEvent.name}`, context);
  for (const info of mapInfos.filter(Boolean)) if (!MAP_EXCLUSIONS.has(info.id) && maps.has(info.id)) checkMap(info, maps.get(info.id), context);
  checkVerticalFlow(maps, findings);
  const warningAllowlist = Object.hasOwn(options, "warningAllowlist") ? options.warningAllowlist : PROJECT_WARNING_ALLOWLIST;
  const sortedFindings = sortFindings(triageFindings(findings, warningAllowlist));
  return { findings: sortedFindings, summary: summarize(sortedFindings) };
}

function formatHumanReport(result) {
  const summary = result.summary;
  const lines = [`State architecture validation: ${summary.error} error(s), ${summary.warning} warning(s) (${summary.allowlistedWarning} allowlisted, ${summary.untriagedWarning} untriaged)`];
  for (const finding of result.findings) {
    const label = finding.severity === "warning" ? `${finding.severity}:${finding.triage}` : finding.severity;
    const suffix = finding.justification ? `; allowlist: ${finding.justification}` : "";
    lines.push(`[${label}] ${finding.code} ${finding.source}: ${finding.evidence}${suffix}`);
  }
  return lines.join("\n");
}

function runCli() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const rootArgument = args.find(argument => argument !== "--json");
  const projectRoot = path.resolve(rootArgument || path.join(__dirname, ".."));
  const result = validateProject(projectRoot);
  process.stdout.write(`${asJson ? JSON.stringify(result, null, 2) : formatHumanReport(result)}\n`);
  process.exitCode = result.summary.error > 0 || result.summary.untriagedWarning > 0 ? 1 : 0;
}

if (require.main === module) runCli();

module.exports = {
  MAP_EXCLUSIONS,
  PROJECT_WARNING_ALLOWLIST,
  VALID_MAP_MODES,
  extractMapMode,
  formatHumanReport,
  validateProject
};
