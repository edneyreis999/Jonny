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
 * NAO implementa logica de jogo - apenas helpers puros.
 *
 * API global em window.JhonnyRace:
 *   - rollSceneType()    → 0 (SINAL, 60%) ou 1 (CURVA, 40%)
 *   - rollPCena()        → multiplo de 10 (0, 10, ..., 100)
 *   - rollD100()         → 0..99
 *   - clamp(val, min, max) → valor restringido
 *   - createPRNG(seed)   → gerador PRNG mulberry32 (reservado v2)
 *   - playRaceStartEffect() → toca a transicao visual/sonora antes da corrida
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
            console.log("RACE_EVENT:", JSON.stringify(entry, null, 2));
            return entry;
        } catch (e) {
            console.warn("RACE_EVENT: error logging:", e);
            return null;
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
        captureRaceState
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
