//=============================================================================
// Jhonny_RaceHelper.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Helpers para o minigame de Corrida (sem logica de jogo). RNG, clamp, W/S/A/D, logger.
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
 *   - logger(enabled, level, ...args) → log estruturado
 *
 * Input.keyMapper estendido:
 *   - W (87) → up
 *   - S (83) → down
 *   - A (65) → left
 *   - D (68) → right
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
    window.JhonnyRace = {
        rollSceneType,
        rollPCena,
        rollD100,
        clamp,
        createPRNG,
        logger: (level, ...args) => logger(enableDebugLogs, level, ...args)
    };

    //=============================================================================
    // Inicializacao
    //=============================================================================
    logger(enableDebugLogs, 'info', 'JhonnyRace helper inicializado.');

})();
