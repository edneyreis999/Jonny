/*:
 * @target MZ
 * @plugindesc Applies the Jhonny map-mode player policy on every map load.
 * @help
 * Add one tag to each playable map note:
 * <JhonnyMapMode: vn|exploration|minigame|transition>
 *
 * This plugin does not store custom save data.
 */

(() => {
    "use strict";

    const policies = Object.freeze({
        vn: Object.freeze({ transparent: true, followers: false, canMove: false }),
        exploration: Object.freeze({ transparent: false, followers: true, canMove: true }),
        minigame: Object.freeze({ transparent: false, followers: false, canMove: true }),
        transition: Object.freeze({ transparent: true, followers: false, canMove: false })
    });

    const api = globalThis.JhonnyMapMode = globalThis.JhonnyMapMode || {};

    api.resolvePolicy = mode => policies[mode] || null;

    api.applyPolicy = mode => {
        const policy = api.resolvePolicy(mode);
        if (!policy || !globalThis.$gamePlayer) return policy;
        $gamePlayer.setTransparent(policy.transparent);
        if (policy.followers) $gamePlayer.showFollowers();
        else $gamePlayer.hideFollowers();
        return policy;
    };

    if (!globalThis.Scene_Map || !globalThis.Game_Player) return;

    if (globalThis.Game_Map) {
        const gameMapSetup = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function(mapId) {
            gameMapSetup.call(this, mapId);
            const mode = globalThis.$dataMap && $dataMap.meta ? $dataMap.meta.JhonnyMapMode : "";
            api.applyPolicy(mode);
        };
    }

    const sceneMapOnMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        sceneMapOnMapLoaded.call(this);
        const mode = globalThis.$dataMap && $dataMap.meta ? $dataMap.meta.JhonnyMapMode : "";
        api.applyPolicy(mode);
    };

    const gamePlayerCanMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        const mode = globalThis.$dataMap && $dataMap.meta ? $dataMap.meta.JhonnyMapMode : "";
        const policy = api.resolvePolicy(mode);
        return (!policy || policy.canMove) && gamePlayerCanMove.call(this);
    };

})();
