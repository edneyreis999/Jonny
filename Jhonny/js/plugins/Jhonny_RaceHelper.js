//=============================================================================
// Jhonny_RaceHelper.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Helpers para o minigame de Corrida. RNG, clamp, W/S/A/D, logger, HUD e transicao.
 * @author Coreto Team
 *
 * @param EnableDebugLogs
 * @type boolean
 * @desc Ativa logs estruturados no console (F12)
 * @default true
 *
 * @help Jhonny_RaceHelper.js
 *
 * Plugin utilitario para o minigame de Corrida do jogo Jhonny.
 * NAO altera logica de jogo. Centraliza helpers e a camada visual do HUD.
 *
 * API global em window.JhonnyRace:
 *   - rollSceneType()    → 0 (SINAL, 60%) ou 1 (CURVA, 40%)
 *   - rollPCena()        → multiplo de 10 (0, 10, ..., 100)
 *   - rollD100()         → 0..99
 *   - clamp(val, min, max) → valor restringido
 *   - createPRNG(seed)   → gerador PRNG mulberry32 (reservado v2)
 *   - playRaceStartEffect() → toca a transicao visual/sonora antes da corrida
 *   - notifyHudEvent(type, payload) → dispara microfeedback visual no HUD
 *   - logger(enabled, level, ...args) → log estruturado
 *
 * Input.keyMapper estendido:
 *   - W (87) → up
 *   - S (83) → down
 *   - A (65) → left
 *   - D (68) → right
 *
 * Plugin Commands:
 *   - logRaceEvent { type: "STRING" } → registra evento estruturado no console (F12).
 *     Captura frame, variaveis 100-117 e switches 100-105. Prefixo "RACE_EVENT:".
 *
 * @command logRaceEvent
 * @text Log Race Event
 * @desc Registra evento do minigame como JSON estruturado no console.
 *
 * @arg type
 * @text Event Type
 * @desc Tipo do evento (ex: SAFE_CLICK, RISK_SUCCESS, CRASH, VICTORY).
 * @type string
 * @default UNKNOWN
 */

(function() {
    'use strict';

    const pluginName = 'Jhonny_RaceHelper';
    const parameters = PluginManager.parameters(pluginName);
    const enableDebugLogs = parameters['EnableDebugLogs'] === 'true';
    const HUD_WIDTH = 1280;
    const HUD_HEIGHT = 720;
    const FRAME_RATE = 60;
    const DISCIPLINE_MAX = 50;
    const DISCIPLINE_READY = 40;
    const BUTTON_PICTURE_IDS = {
        41: "safe",
        42: "risk",
        43: "risk",
        44: "safe"
    };
    const VAR_IDS = {
        raceId: 100,
        sceneIndex: 101,
        sceneType: 102,
        scenePower: 103,
        conscience: 104,
        glory: 105,
        timerFrames: 108,
        totalScenes: 111,
        attempt: 112,
        gloryTarget: 119,
        timerSeconds: 120,
        sceneDisplay: 121
    };
    const SWITCH_IDS = {
        raceActive: 100,
        inputLocked: 101,
        crashFlag: 102
    };

    //=============================================================================
    // Logger estruturado
    //=============================================================================
    const logger = (enabled, level, ...args) => {
        if (!enabled) return;
        const timestamp = new Date().toISOString();
        const prefix = `[${pluginName}]`;
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        console[level](`${timestamp} ${prefix} ${message}`);
    };

    //=============================================================================
    // RNG Helpers (v1: Math.random())
    //=============================================================================
    const rollSceneType = () => {
        // 60% SINAL (0), 40% CURVA (1)
        return Math.random() < 0.6 ? 0 : 1;
    };

    const rollPCena = () => {
        // Uniforme em {0, 10, 20, ..., 100}
        return Math.floor(Math.random() * 11) * 10;
    };

    const rollD100 = () => {
        // 0..99
        return Math.floor(Math.random() * 100);
    };

    //=============================================================================
    // Race start transition
    //=============================================================================
    const RACE_START_EFFECT_DURATION = 60;

    const playRaceStartEffect = () => {
        const scene = SceneManager && SceneManager._scene;
        if (!(scene instanceof Scene_Map)) {
            return false;
        }
        if (typeof SoundManager !== "undefined" && SoundManager.playBattleStart) {
            SoundManager.playBattleStart();
        }
        scene._jhonnyRaceStartEffect = {
            duration: RACE_START_EFFECT_DURATION,
            speed: RACE_START_EFFECT_DURATION,
            zoomX: Math.floor(Graphics.boxWidth / 2),
            zoomY: Math.floor(Graphics.boxHeight / 2)
        };
        return true;
    };

    //=============================================================================
    // Utilitario: clamp
    //=============================================================================
    const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    //=============================================================================
    // PRNG: mulberry32 (reservado para v2)
    //=============================================================================
    const createPRNG = (seed) => {
        // Mulberry32 algorithm
        let state = seed >>> 0;
        return () => {
            var t = state += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    };

    //=============================================================================
    // Estender Input.keyMapper para W/S/A/D
    //=============================================================================
    const _Input_keyMapper = Input.keyMapper;
    Input.keyMapper = Object.assign({}, _Input_keyMapper, {
        65: 'left',   // A
        68: 'right',  // D
        83: 'down',   // S
        87: 'up'      // W
    });

    //=============================================================================
    // API Global
    //=============================================================================
    const VAR_NAMES = {
        100: "RACE_ID", 101: "SCENE_INDEX", 102: "SCENE_TYPE", 103: "P_CENA",
        104: "CONSCIENCIA", 105: "PONTOS_GLORIA", 106: "TAXA_SUCESSO",
        107: "ROLL_RESULT", 108: "TIMER_FRAMES", 109: "SCENE_START",
        110: "SEED", 111: "RACE_N_CENAS", 112: "ATTEMPT_N",
        113: "LAST_RENDERED_INDEX", 115: "HOVER_LEVEL",
        116: "TIMER_TIMEOUT_FLAG", 117: "VITORIA_PASSOU",
        119: "GLORIA_META", 120: "TIMER_SECONDS", 121: "SCENE_DISPLAY"
    };
    const SWITCH_NAMES = {
        100: "RACE_ACTIVE", 101: "INPUT_LOCKED", 102: "CRASH_FLAG",
        103: "LAST_ACTION_SAFE", 104: "PAUSED", 105: "IS_CURVA_DIABO"
    };

    const captureRaceState = () => {
        const vars = {};
        for (const id in VAR_NAMES) {
            if (VAR_NAMES.hasOwnProperty(id)) {
                vars[VAR_NAMES[id]] = $gameVariables.value(parseInt(id, 10));
            }
        }
        const switches = {};
        for (const id in SWITCH_NAMES) {
            if (SWITCH_NAMES.hasOwnProperty(id)) {
                switches[SWITCH_NAMES[id]] = $gameSwitches.value(parseInt(id, 10));
            }
        }
        return { vars, switches };
    };

    const hudEvents = [];

    const notifyHudEvent = (type, payload) => {
        hudEvents.push({
            type: String(type || "UNKNOWN"),
            payload: payload || {},
            frame: Graphics.frameCount
        });
        while (hudEvents.length > 16) {
            hudEvents.shift();
        }
    };

    const takeHudEvents = () => {
        const events = hudEvents.slice();
        hudEvents.length = 0;
        return events;
    };

    const logRaceEvent = (args) => {
        try {
            const type = args && args.type ? String(args.type) : "UNKNOWN";
            const { vars, switches } = captureRaceState();
            const entry = {
                type,
                frame: Graphics.frameCount,
                vars,
                switches,
                timestamp: new Date().toISOString()
            };
            notifyHudEvent(type, entry);
            console.log("RACE_EVENT:", JSON.stringify(entry, null, 2));
            return entry;
        } catch (e) {
            console.warn("RACE_EVENT: error logging:", e);
            return null;
        }
    };

    //=============================================================================
    // Race HUD Juice Layer
    //=============================================================================
    const gameVar = (id) => {
        return $gameVariables ? Number($gameVariables.value(id) || 0) : 0;
    };

    const gameSwitch = (id) => {
        return $gameSwitches ? !!$gameSwitches.value(id) : false;
    };

    const hudFont = (size, weight) => {
        const family = $gameSystem ? $gameSystem.mainFontFace() : "sans-serif";
        return `${weight || "bold"} ${size}px ${family}`;
    };

    const chanceColor = (chance) => {
        if (chance >= 70) return "#63df70";
        if (chance >= 40) return "#ffd15a";
        return "#ff4b4b";
    };

    const failureColor = (failure) => {
        if (failure >= 70) return "#ff4b4b";
        if (failure >= 40) return "#ffd15a";
        return "#63df70";
    };

    const placeFromGlory = (glory, total) => {
        const goal = Math.max(1, total || 1);
        if (glory >= goal) return 1;
        if (glory >= Math.ceil(goal * 2 / 3)) return 2;
        if (glory >= Math.ceil(goal / 3)) return 3;
        return 4;
    };

    const orderedRunners = (playerPlace) => {
        const rivals = ["Max", "Nina", "Toni"];
        const result = [];
        for (let place = 1; place <= 4; place++) {
            if (place === playerPlace) {
                result.push("Jhonny");
            } else {
                result.push(rivals.shift());
            }
        }
        return result;
    };

    const roundedRect = (ctx, x, y, width, height, radius) => {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    const fillRoundRect = (ctx, x, y, width, height, radius, color) => {
        roundedRect(ctx, x, y, width, height, radius);
        ctx.fillStyle = color;
        ctx.fill();
    };

    const strokeRoundRect = (ctx, x, y, width, height, radius, color, lineWidth) => {
        roundedRect(ctx, x, y, width, height, radius);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 2;
        ctx.stroke();
    };

    const drawHudText = (ctx, text, x, y, size, color, align, width, weight) => {
        ctx.font = hudFont(size, weight);
        ctx.textAlign = align || "left";
        ctx.textBaseline = "middle";
        ctx.lineWidth = Math.max(3, Math.floor(size / 7));
        ctx.strokeStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillStyle = color;
        ctx.strokeText(String(text), x, y, width || 1000);
        ctx.fillText(String(text), x, y, width || 1000);
    };

    const drawShimmer = (ctx, x, y, width, height, progress, alpha) => {
        const pos = x + ((Graphics.frameCount % 90) / 90) * (width + 60) - 30;
        const gradient = ctx.createLinearGradient(pos - 30, y, pos + 30, y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.save();
        roundedRect(ctx, x, y, width * progress, height, 6);
        ctx.clip();
        ctx.fillStyle = gradient;
        ctx.fillRect(pos - 30, y, 60, height);
        ctx.restore();
    };

    function Sprite_JhonnyRaceHud() {
        this.initialize(...arguments);
    }

    Sprite_JhonnyRaceHud.prototype = Object.create(Sprite.prototype);
    Sprite_JhonnyRaceHud.prototype.constructor = Sprite_JhonnyRaceHud;

    Sprite_JhonnyRaceHud.prototype.initialize = function() {
        const width = Graphics.width || Graphics.boxWidth || HUD_WIDTH;
        const height = Graphics.height || Graphics.boxHeight || HUD_HEIGHT;
        Sprite.prototype.initialize.call(this, new Bitmap(width, height));
        this._wasVisible = false;
        this._displayGlory = 0;
        this._displayRisk = 0;
        this._displayConscience = 0;
        this._displayBaseSuccess = 0;
        this._displayDisciplineBonus = 0;
        this._displayPlace = 4;
        this._lastGlory = null;
        this._lastRisk = null;
        this._lastDiscipline = null;
        this._lastTimer = null;
        this._lastPlace = null;
        this._gloryPulse = 0;
        this._riskPulse = 0;
        this._timerPulse = 0;
        this._safePulse = 0;
        this._riskButtonPulse = 0;
        this._positionPulse = 0;
        this._dangerPulse = 0;
        this.visible = false;
    };

    Sprite_JhonnyRaceHud.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.visible = gameSwitch(SWITCH_IDS.raceActive);
        if (!this.visible) {
            this.clearWhenHidden();
            return;
        }
        const state = this.currentState();
        this.consumeEvents();
        this.updateAnimatedState(state);
        this.updateButtonPictures(state);
        this.redraw(state);
        this._wasVisible = true;
    };

    Sprite_JhonnyRaceHud.prototype.clearWhenHidden = function() {
        if (this._wasVisible) {
            this.bitmap.clear();
            this._wasVisible = false;
            this._lastGlory = null;
            this._lastRisk = null;
            this._lastTimer = null;
            this._lastPlace = null;
        }
    };

    Sprite_JhonnyRaceHud.prototype.currentState = function() {
        const raceId = gameVar(VAR_IDS.raceId);
        const helper = window.JhonnyRace;
        const fallback = helper && helper.thresholdFor ? helper.thresholdFor(raceId) : 60;
        const total = gameVar(VAR_IDS.gloryTarget) || fallback;
        const scenePower = clamp(gameVar(VAR_IDS.scenePower), 0, 100);
        const discipline = clamp(gameVar(VAR_IDS.conscience), 0, DISCIPLINE_MAX);
        const chance = clamp(discipline + scenePower, 0, 100);
        const disciplineBonus = Math.min(discipline, Math.max(0, 100 - scenePower));
        const glory = Math.max(0, gameVar(VAR_IDS.glory));
        const timerFrames = gameVar(VAR_IDS.timerFrames);
        const timer = gameVar(VAR_IDS.timerSeconds) || Math.ceil(timerFrames / FRAME_RATE);
        const totalScenes = Math.max(1, gameVar(VAR_IDS.totalScenes));
        const sceneDisplay = gameVar(VAR_IDS.sceneDisplay) || gameVar(VAR_IDS.sceneIndex) + 1;
        return {
            raceId,
            sceneType: gameVar(VAR_IDS.sceneType),
            scenePower,
            conscience: discipline,
            discipline,
            baseSuccess: scenePower,
            disciplineBonus,
            chance,
            success: chance,
            risk: 100 - chance,
            failure: 100 - chance,
            glory,
            total,
            timer,
            totalScenes,
            sceneDisplay: clamp(sceneDisplay, 1, totalScenes),
            attempt: gameVar(VAR_IDS.attempt),
            place: placeFromGlory(glory, total),
            inputLocked: gameSwitch(SWITCH_IDS.inputLocked),
            crashed: gameSwitch(SWITCH_IDS.crashFlag)
        };
    };

    Sprite_JhonnyRaceHud.prototype.consumeEvents = function() {
        for (const event of takeHudEvents()) {
            if (event.type === "safe_press" || event.type === "SAFE_CLICK") this._safePulse = 20;
            if (event.type === "risk_press") this._riskButtonPulse = 20;
            if (event.type === "RISK_SUCCESS") this._riskButtonPulse = 28;
            if (event.type === "RISK_FAIL" || event.type === "CRASH") this._dangerPulse = 42;
            if (event.type === "SAFE_CLICK" || event.type === "RISK_SUCCESS") this._gloryPulse = 30;
            if (event.type === "RISK_SUCCESS" || event.type === "RISK_FAIL") this._riskPulse = 30;
        }
    };

    Sprite_JhonnyRaceHud.prototype.updateAnimatedState = function(state) {
        if (this._lastGlory === null) {
            this.snapToState(state);
        }
        if (state.glory !== this._lastGlory) this._gloryPulse = 34;
        if (state.discipline !== this._lastDiscipline) this._gloryPulse = 34;
        if (state.failure !== this._lastRisk) this._riskPulse = 24;
        if (state.timer !== this._lastTimer) this._timerPulse = state.timer <= 3 ? 28 : 16;
        if (state.place !== this._lastPlace) this._positionPulse = 48;
        this._displayGlory += (state.glory - this._displayGlory) * 0.18;
        this._displayRisk += (state.failure - this._displayRisk) * 0.20;
        this._displayConscience += (state.discipline - this._displayConscience) * 0.18;
        this._displayBaseSuccess += (state.baseSuccess - this._displayBaseSuccess) * 0.20;
        this._displayDisciplineBonus += (state.disciplineBonus - this._displayDisciplineBonus) * 0.20;
        this._displayPlace += (state.place - this._displayPlace) * 0.16;
        this._lastGlory = state.glory;
        this._lastRisk = state.failure;
        this._lastDiscipline = state.discipline;
        this._lastTimer = state.timer;
        this._lastPlace = state.place;
        this.tickPulses();
    };

    Sprite_JhonnyRaceHud.prototype.snapToState = function(state) {
        this._displayGlory = state.glory;
        this._displayRisk = state.failure;
        this._displayConscience = state.discipline;
        this._displayBaseSuccess = state.baseSuccess;
        this._displayDisciplineBonus = state.disciplineBonus;
        this._displayPlace = state.place;
        this._lastGlory = state.glory;
        this._lastRisk = state.failure;
        this._lastDiscipline = state.discipline;
        this._lastTimer = state.timer;
        this._lastPlace = state.place;
    };

    Sprite_JhonnyRaceHud.prototype.tickPulses = function() {
        this._gloryPulse = Math.max(0, this._gloryPulse - 1);
        this._riskPulse = Math.max(0, this._riskPulse - 1);
        this._timerPulse = Math.max(0, this._timerPulse - 1);
        this._safePulse = Math.max(0, this._safePulse - 1);
        this._riskButtonPulse = Math.max(0, this._riskButtonPulse - 1);
        this._positionPulse = Math.max(0, this._positionPulse - 1);
        this._dangerPulse = Math.max(0, this._dangerPulse - 1);
    };

    Sprite_JhonnyRaceHud.prototype.redraw = function(state) {
        const bitmap = this.bitmap;
        const ctx = bitmap.context;
        bitmap.clear();
        ctx.save();
        ctx.scale(bitmap.width / HUD_WIDTH, bitmap.height / HUD_HEIGHT);
        this.drawDisciplinePanel(ctx, state);
        this.drawRiskPanel(ctx, state);
        this.drawTimer(ctx, state);
        this.drawPositionBoard(ctx, state);
        ctx.restore();
        bitmap.baseTexture.update();
    };

    Sprite_JhonnyRaceHud.prototype.drawDisciplinePanel = function(ctx, state) {
        const x = 58;
        const y = 86;
        const w = 104;
        const h = 548;
        const progress = clamp(this._displayConscience / DISCIPLINE_MAX, 0, 1);
        const pulse = this._gloryPulse / 34;
        const ready = state.discipline >= DISCIPLINE_READY;
        const full = state.discipline >= DISCIPLINE_MAX;
        const glow = ready ? 0.28 + (Math.sin(Graphics.frameCount / 10) + 1) * 0.16 : 0;
        fillRoundRect(ctx, x, y, w, h, 8, "rgb(7, 17, 18)");
        if (ready) {
            ctx.save();
            ctx.shadowColor = full ? "#fff06a" : "#73ff8d";
            ctx.shadowBlur = full ? 20 : 12;
            strokeRoundRect(ctx, x, y, w, h, 8, full ? `rgba(255, 240, 106, ${0.65 + glow})` : `rgba(115, 255, 141, ${0.55 + glow})`, 4);
            ctx.restore();
        }
        strokeRoundRect(ctx, x, y, w, h, 8, `rgba(148, 240, 143, ${0.55 + pulse * 0.35 + glow})`, 3);
        fillRoundRect(ctx, x + 26, y + 86, 52, 360, 8, "rgb(8, 19, 16)");
        const fillHeight = Math.round(360 * progress);
        const fy = y + 86 + 360 - fillHeight;
        fillRoundRect(ctx, x + 26, fy, 52, fillHeight, 8, full ? "#fff06a" : "#63df70");
        drawShimmer(ctx, x + 26, fy, 52, fillHeight, 1, full ? 0.42 : 0.28);
        drawHudText(ctx, "DISCIPLINA", x + w / 2, y + 28, 16, "#94f08f", "center", w);
        drawHudText(ctx, `${Math.round(this._displayConscience)}%`, x + w / 2, y + h - 32, 18, full ? "#fff06a" : "#94f08f", "center", w);
    };

    Sprite_JhonnyRaceHud.prototype.drawRiskPanel = function(ctx, state) {
        const x = 530;
        const y = 376;
        const w = 300;
        const h = 54;
        const base = clamp(this._displayBaseSuccess / 100, 0, 1);
        const bonus = clamp(this._displayDisciplineBonus / 100, 0, 1);
        const success = clamp(base + bonus, 0, 1);
        const pulse = Math.max(this._riskPulse / 30, this._dangerPulse / 42);
        const shake = state.success <= 30 ? Math.sin(Graphics.frameCount * 0.9) * 3 * (0.3 + pulse) : 0;
        const color = failureColor(state.failure);
        const barX = x + 18 + shake;
        const barY = y + 28;
        const barW = w - 36;
        const barH = 12;
        const baseW = Math.round(barW * base);
        const bonusW = Math.round(barW * bonus);
        fillRoundRect(ctx, x + shake, y, w, h, 8, "rgb(16, 10, 12)");
        strokeRoundRect(ctx, x + shake, y, w, h, 8, `rgba(255, 75, 75, ${0.48 + pulse * 0.35})`, 3);
        ctx.save();
        roundedRect(ctx, barX, barY, barW, barH, 6);
        ctx.clip();
        ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = "#63df70";
        ctx.fillRect(barX, barY, baseW, barH);
        ctx.fillStyle = "#6ee7ff";
        ctx.fillRect(barX + baseW, barY, bonusW, barH);
        ctx.restore();
        drawShimmer(ctx, barX, barY, barW, barH, success, 0.22);
        drawHudText(ctx, `FRACASSO ${Math.round(this._displayRisk)}%`, x + 18 + shake, y + 15, 18, color, "left", w - 36);
        drawHudText(ctx, `SUCESSO ${Math.round(100 - this._displayRisk)}%`, x + w - 18 + shake, y + 15, 18, "#ffffff", "right", w - 36);
    };

    Sprite_JhonnyRaceHud.prototype.drawTimer = function(ctx, state) {
        const x = 514;
        const y = 10;
        const w = 252;
        const h = 58;
        const critical = state.timer <= 3;
        const pulse = this._timerPulse / (critical ? 28 : 16);
        const scale = 1 + pulse * (critical ? 0.12 : 0.06);
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
        fillRoundRect(ctx, x, y, w, h, 8, "rgba(6, 8, 12, 0.72)");
        strokeRoundRect(ctx, x, y, w, h, 8, critical ? "#ff5858" : "#ffffff", 3);
        drawHudText(ctx, `TIMER ${state.timer}s`, cx, cy, critical ? 33 : 31, critical ? "#ffd45d" : "#ffffff", "center", w);
        ctx.restore();
    };

    Sprite_JhonnyRaceHud.prototype.buttonSpecs = function(state) {
        if (state.sceneType === 0) {
            return { safe: { x: 448, y: 560, id: 41 }, risk: { x: 704, y: 560, id: 42 } };
        }
        return { safe: { x: 472, y: 532, id: 44 }, risk: { x: 733, y: 532, id: 43 } };
    };

    Sprite_JhonnyRaceHud.prototype.drawPositionBoard = function(ctx, state) {
        const x = 892;
        const y = 228;
        const w = 330;
        const h = 280;
        const pulse = this._positionPulse / 48;
        fillRoundRect(ctx, x, y, w, h, 8, "rgb(238, 238, 226)");
        strokeRoundRect(ctx, x, y, w, h, 8, `rgba(255, 221, 112, ${0.45 + pulse * 0.45})`, 4);
        drawHudText(ctx, "POSICOES", x + 20, y + 30, 23, "#111111", "left", w - 40);
        this.drawRunnerRows(ctx, x + 22, y + 68, w - 44, state, pulse);
        if (pulse > 0) drawHudText(ctx, "ULTRAPASSOU!", x + w / 2, y + h - 18, 18, "#c48a00", "center", w - 40);
    };

    Sprite_JhonnyRaceHud.prototype.drawRunnerRows = function(ctx, x, y, width, state, pulse) {
        const names = orderedRunners(state.place);
        for (let i = 0; i < names.length; i++) {
            const rowY = y + i * 44;
            const isPlayer = names[i] === "Jhonny";
            const rowColor = isPlayer ? `rgba(255, 220, 90, ${0.42 + pulse * 0.35})` : "rgba(0, 0, 0, 0.08)";
            fillRoundRect(ctx, x, rowY, width, 34, 8, rowColor);
            drawHudText(ctx, `${i + 1}.`, x + 20, rowY + 17, 18, "#171717", "left", 40);
            drawHudText(ctx, names[i], x + 62, rowY + 17, isPlayer ? 22 : 19, isPlayer ? "#111111" : "#333333", "left", 120);
            if (isPlayer) drawHudText(ctx, ">>", x + width - 24, rowY + 17, 18, "#b77700", "right", 40);
        }
    };

    Sprite_JhonnyRaceHud.prototype.updateButtonPictures = function(state) {
        const scene = SceneManager._scene;
        const spriteset = scene && scene._spriteset;
        const container = spriteset && spriteset._pictureContainer;
        if (!container) return;
        const specs = this.buttonSpecs(state);
        this.scaleButtonSprite(container, specs.safe.id, this._safePulse / 20, 0.025);
        this.scaleButtonSprite(container, specs.risk.id, this._riskButtonPulse / 28, 0.045);
    };

    Sprite_JhonnyRaceHud.prototype.scaleButtonSprite = function(container, pictureId, pulse, idlePower) {
        const sprite = container.children[pictureId - 1];
        const picture = sprite && sprite.picture && sprite.picture();
        if (!sprite || !picture || !sprite.bitmap) return;
        const idle = 1 + Math.sin(Graphics.frameCount / 32) * idlePower;
        const pop = 1 + Math.max(0, pulse) * 0.11;
        const extra = idle * pop;
        const baseX = picture.scaleX() / 100;
        const baseY = picture.scaleY() / 100;
        sprite.scale.x = baseX * extra;
        sprite.scale.y = baseY * extra;
        if (picture.origin() === 0) {
            sprite.x -= Math.round(sprite.bitmap.width * baseX * (extra - 1) / 2);
            sprite.y -= Math.round(sprite.bitmap.height * baseY * (extra - 1) / 2);
        }
    };

    //=============================================================================
    // Config Namespace — THRESHOLDS table (single source of truth for victory)
    // Mirrors the dict-with-fallback previously inlined in CE 19 (EV_VitoriaCorrida):
    //   { 1: 200, 2: 400, 3: 600 } with fallback || 60.
    // Refactor changes nothing about game balance; values match CE 19 verbatim.
    //=============================================================================
    const JhonnyRace = window.JhonnyRace || {};
    JhonnyRace.Config = JhonnyRace.Config || {};

    JhonnyRace.Config.THRESHOLDS = Object.freeze({
        1: 200,
        2: 400,
        3: 600
    });

    JhonnyRace.Config.DEFAULT_THRESHOLD = 60;

    JhonnyRace.isVictory = function (pontosGloria, raceId) {
        const t = this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
        return (pontosGloria | 0) >= t;
    };

    JhonnyRace.thresholdFor = function (raceId) {
        return this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
    };

    Object.assign(JhonnyRace, {
        rollSceneType,
        rollPCena,
        rollD100,
        clamp,
        createPRNG,
        playRaceStartEffect,
        logger: (level, ...args) => logger(enableDebugLogs, level, ...args),
        logRaceEvent,
        captureRaceState,
        notifyHudEvent
    });

    window.JhonnyRace = JhonnyRace;

    //=============================================================================
    // Scene_Map patch: encounter-like race transition without entering battle
    //=============================================================================
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateJhonnyRaceStartEffect();
    };

    Scene_Map.prototype.updateJhonnyRaceStartEffect = function() {
        const effect = this._jhonnyRaceStartEffect;
        if (!effect || effect.duration <= 0) {
            return;
        }
        effect.duration--;
        const n = effect.speed - effect.duration;
        const p = n / effect.speed;
        const q = ((p - 1) * 20 * p + 5) * p + 1;
        if (n === 2 || n === Math.floor(effect.speed / 6)) {
            $gameScreen.startFlash([255, 255, 255, 255], Math.floor(effect.speed / 2));
        }
        if (n === Math.floor(effect.speed / 2)) {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        $gameScreen.setZoom(effect.zoomX, effect.zoomY, q);
        if (effect.duration <= 0) {
            this._jhonnyRaceStartEffect = null;
            $gameScreen.setZoom(0, 0, 1);
            this.startFadeIn(12, false);
        }
    };

    const _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.call(this);
        this.createJhonnyRaceHudLayer();
    };

    Spriteset_Base.prototype.createJhonnyRaceHudLayer = function() {
        this._jhonnyRaceHudLayer = new Sprite_JhonnyRaceHud();
        this.addChild(this._jhonnyRaceHudLayer);
    };

    if (Sprite_Picture.prototype.onClick) {
        const _Sprite_Picture_onClick = Sprite_Picture.prototype.onClick;
        Sprite_Picture.prototype.onClick = function() {
            const picture = this.picture();
            const kind = BUTTON_PICTURE_IDS[this._pictureId];
            if (picture && kind) {
                notifyHudEvent(`${kind}_press`, { pictureId: this._pictureId });
            }
            _Sprite_Picture_onClick.call(this);
        };
    }

    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        const nextValue = variableId === VAR_IDS.conscience && typeof value === "number"
            ? clamp(value, 0, DISCIPLINE_MAX)
            : value;
        _Game_Variables_setValue.call(this, variableId, nextValue);
    };

    //=============================================================================
    // Plugin Commands (MZ API)
    //=============================================================================
    if (typeof PluginManager !== "undefined") {
        PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent);
    }

    //=============================================================================
    // Inicializacao
    //=============================================================================
    logger(enableDebugLogs, 'info', 'JhonnyRace helper inicializado.');

})();
