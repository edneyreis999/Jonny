"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const test = require("node:test");
const vm = require("vm");

const pluginPath = path.join(__dirname, "..", "..", "js", "plugins", "Jhonny_MapMode.js");

function createHarness(initialMode = "exploration") {
    const calls = [];
    function SceneMap() {}
    SceneMap.prototype.onMapLoaded = function() { calls.push("scene-loaded"); };
    function GameMap() {}
    GameMap.prototype.setup = function(mapId) { calls.push(`map-setup:${mapId}`); };
    function GamePlayer() {}
    GamePlayer.prototype.canMove = function() { return this.baseCanMove; };
    const player = new GamePlayer();
    player.baseCanMove = true;
    player.transparent = false;
    player.followersVisible = true;
    player.setTransparent = value => {
        player.transparent = value;
        calls.push(`transparent:${value}`);
    };
    player.showFollowers = () => {
        player.followersVisible = true;
        calls.push("followers:true");
    };
    player.hideFollowers = () => {
        player.followersVisible = false;
        calls.push("followers:false");
    };
    const context = {
        Scene_Map: SceneMap,
        Game_Map: GameMap,
        Game_Player: GamePlayer,
        $gamePlayer: player,
        $dataMap: { meta: { JhonnyMapMode: initialMode } }
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(pluginPath, "utf8"), context);
    return {
        calls,
        context,
        player,
        setMode(mode) {
            context.$dataMap.meta.JhonnyMapMode = mode;
        },
        snapshot() {
            return {
                transparent: player.transparent,
                followersVisible: player.followersVisible,
                canMove: player.canMove()
            };
        }
    };
}

test("resolves every approved policy without engine state", () => {
    const loaded = createHarness();
    const expected = {
        vn: { transparent: true, followers: false, canMove: false },
        exploration: { transparent: false, followers: true, canMove: true },
        minigame: { transparent: false, followers: false, canMove: true },
        transition: { transparent: true, followers: false, canMove: false }
    };
    for (const [mode, policy] of Object.entries(expected)) {
        assert.deepStrictEqual(JSON.parse(JSON.stringify(loaded.context.JhonnyMapMode.resolvePolicy(mode))), policy);
    }
});

test("applies the map policy during Game_Map.setup before scene load", () => {
    const loaded = createHarness("vn");
    new loaded.context.Game_Map().setup(30);
    assert.deepStrictEqual(loaded.calls, ["map-setup:30", "transparent:true", "followers:false"]);
    assert.deepStrictEqual(loaded.snapshot(), { transparent: true, followersVisible: false, canMove: false });
});

test("preserves deterministic state across every mode transition", () => {
    const loaded = createHarness();
    const scene = new loaded.context.Scene_Map();
    const modes = ["exploration", "vn", "transition", "minigame", "exploration"];
    const expected = [
        { transparent: false, followersVisible: true, canMove: true },
        { transparent: true, followersVisible: false, canMove: false },
        { transparent: true, followersVisible: false, canMove: false },
        { transparent: false, followersVisible: false, canMove: true },
        { transparent: false, followersVisible: true, canMove: true }
    ];
    const observed = modes.map(mode => {
        loaded.setMode(mode);
        scene.onMapLoaded();
        return loaded.snapshot();
    });
    assert.deepStrictEqual(observed, expected);
});

test("is idempotent when the same mode is applied repeatedly", () => {
    const loaded = createHarness("minigame");
    const scene = new loaded.context.Scene_Map();
    scene.onMapLoaded();
    const first = loaded.snapshot();
    scene.onMapLoaded();
    new loaded.context.Game_Map().setup(10);
    assert.deepStrictEqual(loaded.snapshot(), first);
});

test("keeps unknown modes fail-open without mutating the current player state", () => {
    const loaded = createHarness("unknown");
    loaded.player.transparent = true;
    loaded.player.followersVisible = false;
    new loaded.context.Game_Map().setup(99);
    assert.deepStrictEqual(loaded.snapshot(), { transparent: true, followersVisible: false, canMove: true });
    assert.strictEqual(loaded.context.JhonnyMapMode.resolvePolicy("unknown"), null);
});

test("combines an allowed policy with the original movement guard", () => {
    const loaded = createHarness("exploration");
    loaded.player.baseCanMove = false;
    assert.strictEqual(loaded.player.canMove(), false);
    loaded.player.baseCanMove = true;
    assert.strictEqual(loaded.player.canMove(), true);
    loaded.setMode("vn");
    assert.strictEqual(loaded.player.canMove(), false);
});
