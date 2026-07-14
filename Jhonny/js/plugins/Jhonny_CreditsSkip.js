//=============================================================================
// Jhonny_CreditsSkip.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Permite pular o Scroll Text dos creditos em mapas configurados.
 * @author Coreto Team
 *
 * @param Credits Map IDs
 * @type string
 * @desc Lista de IDs de mapas de creditos separados por virgula.
 * @default 9,14
 *
 * @param Allow OK
 * @type boolean
 * @desc Permite pular com OK/confirmar.
 * @default true
 *
 * @param Allow Cancel
 * @type boolean
 * @desc Permite pular com Cancel.
 * @default true
 *
 * @param Allow Shift
 * @type boolean
 * @desc Permite pular com Shift.
 * @default true
 *
 * @param Allow Touch
 * @type boolean
 * @desc Permite pular com mouse/touch.
 * @default true
 *
 * @help Jhonny_CreditsSkip.js
 *
 * Helper de projeto para pular imediatamente o Scroll Text dos creditos.
 *
 * O plugin nao retorna ao titulo diretamente. Ele apenas encerra a mensagem de
 * Scroll Text nos mapas configurados, permitindo que o evento continue sua
 * lista normal de comandos e alcance o Return to Title planejado.
 *
 * O arquivo precisa estar ativo em js/plugins.js para afetar o runtime.
 */

(() => {
    "use strict";

    const pluginName = "Jhonny_CreditsSkip";
    const parameters = PluginManager.parameters(pluginName);
    const root = globalThis.Jhonny = globalThis.Jhonny || {};

    const parseBoolean = value => String(value || "false") === "true";
    const parseMapIds = value => String(value || "9,14")
        .split(",")
        .map(entry => Number(entry.trim()))
        .filter(Number.isInteger);

    const settings = {
        mapIds: parseMapIds(parameters["Credits Map IDs"]),
        allowOk: parseBoolean(parameters["Allow OK"] ?? "true"),
        allowCancel: parseBoolean(parameters["Allow Cancel"] ?? "true"),
        allowShift: parseBoolean(parameters["Allow Shift"] ?? "true"),
        allowTouch: parseBoolean(parameters["Allow Touch"] ?? "true")
    };

    const isCreditsMap = () => {
        return Boolean($gameMap) && settings.mapIds.includes($gameMap.mapId());
    };

    const isSkipPressed = () => {
        return (
            (settings.allowOk && Input.isPressed("ok")) ||
            (settings.allowCancel && Input.isPressed("cancel")) ||
            (settings.allowShift && Input.isPressed("shift")) ||
            (settings.allowTouch && TouchInput.isPressed())
        );
    };

    const shouldSkip = scrollWindow => {
        return Boolean(scrollWindow._text) && isCreditsMap() && isSkipPressed();
    };

    Object.assign(root, {
        creditsSkip: {
            settings,
            isCreditsMap,
            isSkipPressed
        }
    });

    const updateMessage = Window_ScrollText.prototype.updateMessage;
    Window_ScrollText.prototype.updateMessage = function() {
        if (shouldSkip(this)) {
            this.terminateMessage();
            return;
        }
        updateMessage.call(this);
    };
})();
