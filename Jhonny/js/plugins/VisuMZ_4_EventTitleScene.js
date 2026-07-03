//=============================================================================
// VisuStella MZ - Event Title Scene
// VisuMZ_4_EventTitleScene.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_4_EventTitleScene = true;

var VisuMZ = VisuMZ || {};
VisuMZ.EventTitleScene = VisuMZ.EventTitleScene || {};
VisuMZ.EventTitleScene.version = 1.06;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 4] [Version 1.06] [EventTitleScene]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Event_Title_Scene_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * For those who feel compelled to create their own custom title scene using
 * in-game maps and events, this plugin will replace Scene_Title with a new
 * dedicated map scene to allow such a thing to happen. Customize it however
 * you can within your abilities and utilize the full power of RPG Maker MZ's
 * eventing system. Just don't forget to use an Autorun event to kick things
 * off, alright?
 *
 * Features include all (but not limited to) the following:
 * 
 * * Dedicated map scene to use for custom map title scenes.
 * * Going to the Game End screen to return to the title screen will take the
 *   player back to the dedicated map scene.
 * * Customize which map to use and where on the map to display.
 * * Determine the player's position, visibility, facing direction, and whether
 *   or not followers are shown, too.
 * * Disable or enable movement on the title scene if you want.
 * * Plugin Commands that facilitate the New Game, Continue, and Options
 *   command as seen before in the title screen.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 4 ------
 *
 * This plugin is a Tier 4 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Autosave
 * 
 * - Autosaving is disabled on the event title scene map. This is to prevent
 * any instances of the player loading into an unintended map by accident.
 *
 * ---
 * 
 * Movement Disable
 * 
 * - Through the Plugin Parameters, you can disable input and mouse movement
 * from the player for the dedicated event title scene.
 * 
 * ---
 * 
 * Menu and Debug Disable
 * 
 * - On the dedicated event title scene, calling the Main Menu and debug menu
 * is disabled to prevent errors.
 * 
 * ---
 *
 * ============================================================================
 * VisuStella MZ Compatibility
 * ============================================================================
 *
 * While this plugin is compatible with the majority of the VisuStella MZ
 * plugin library, it is not compatible with specific plugins or specific
 * features. This section will highlight the main plugins/features that will
 * not be compatible with this plugin or put focus on how the make certain
 * features compatible.
 *
 * ---
 * 
 * VisuMZ_0_CoreEngine
 * 
 * Those using the VisuStella MZ Core Engine will now have the "Title Picture
 * Buttons" imported into the Event Title Scene. They can be interacted the
 * same way. The picture buttons will appear above all else so keep that in
 * mind for how you position them.
 * 
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. 
 *
 * === Continue-Related Text Codes ===
 * 
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Show Choice Text Only)
 * ------------------   -------------------------------------------------------
 * 
 * <Continue>           Put this text code inside of a Show Choice and it will
 *                      enable that choice if there is a save file available.
 *                      It will disable that choice if there are no saves.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === System-Type Plugin Commands ===
 * 
 * ---
 *
 * System: Start New Game
 * - Leaves the current scene and starts a new game.
 *
 *   Slow Fade Out?:
 *   - Use a slow fade out transition to the next scene?
 *
 * ---
 *
 * System: Open Load Scene
 * - Leaves the current scene and opens the load game scene.
 *
 *   Slow Fade Out?:
 *   - Use a slow fade out transition to the next scene?
 *
 * ---
 *
 * System: Open Options Scene
 * - Leaves the current scene and opens the options scene.
 *
 *   Slow Fade Out?:
 *   - Use a slow fade out transition to the next scene?
 *
 * ---
 *
 * ============================================================================
 * Script Calls
 * ============================================================================
 *
 * The following are Script Calls that can be used with this plugin. These are
 * made for JavaScript proficient users. We are not responsible if you use them
 * incorrectly or for unintended usage.
 *
 * ---
 * 
 * === Continue-Related Script Calls ===
 * 
 * ---
 *
 * DataManager.isAnySavefileExists()
 * 
 * - Use this in a 'Conditional Branch' event command script check.
 * - This will return 'true' if there are save files to load from.
 * - This will return 'false' if there are no save files to load from.
 * - This code is available outside of this plugin.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the settings available through the plugin parameters to adjust how
 * the map title scene plays out.
 *
 * ---
 *
 * Title Scene Coordinates
 * 
 *   Map ID:
 *   - Select the map used for the evented title scene.
 * 
 *   Map X:
 *   - Select the X coordinate for the evented title scene.
 * 
 *   Map Y:
 *   - Select the Y coordinate for the evented title scene.
 * 
 *   Face Direction:
 *   - What direction will the player face on the title scene?
 *   - This is assuming the player is visible.
 *
 * ---
 *
 * Player Character
 * 
 *   Transparent?:
 *   - Make the player transparent on the title scene?
 * 
 *   Can Input Move?:
 *   - Can the player move while on the title scene?
 * 
 *   Show Followers?:
 *   - Show player followers on the title scene?
 *   - This is assuming the player is visible.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Irina
 * * Arisu
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.06: September 14, 2023
 * * Bug Fixes!
 * ** Fixed a bug where single save slots loaded by the VisuMZ Save Core would
 *    not play the map BGM and BGS. Fix made by Olivia.
 * ** Fixed a bug where there is not a soft fade in after using the single slot
 *    loading screen from the VisuMZ Save Core. Fix made by Olivia.
 * 
 * Version 1.05: February 24, 2022
 * * Bug Fixes!
 * ** Added failsafe to prevent title screen transition change from causing a
 *    crash while utilizing tileset-based sprites. Fix made by Arisu.
 * 
 * Version 1.04: February 3, 2022
 * * Feature Update!
 * ** Autosave no longer triggers from starting a new game with the locked
 *    save style. Update made by Irina.
 * 
 * Version 1.03: December 23, 2021
 * * Feature Update!
 * ** Added an extra save file exist check for the Load Screen Plugin Command
 *    using the Single Save Slot type plugin parameter in Save Core. Update
 *    made by Irina.
 * 
 * Version 1.02: December 16, 2021
 * * Compatibility Update!
 * ** This plugin now works properly with the Save Core's single save slot
 *    style plugin parameters setting. Update made by Irina.
 * ** This plugin now works properly with the Save Core's single locked slot
 *    style plugin parameters setting. Update made by Irina.
 * * Feature Update!
 * ** Autosave no longer triggers from starting a new game. It will be after
 *    the transition is done that any further requests for autosave can be
 *    utilized. Update made by Irina.
 * 
 * Version 1.01: June 25, 2021
 * * Documentation Update!
 * ** Added section for VisuStella compatibility.
 * *** Those using the VisuStella MZ Core Engine will now have the "Title
 *     Picture Buttons" imported into the Event Title Scene. They can be
 *     interacted the same way. The picture buttons will appear above all else
 *     so keep that in mind for how you position them.
 * * Compatibility Update!
 * ** This plugin is now compatible with the VisuMZ Core Engine's Title Picture
 *    Buttons and will have them displayed on the same scene. Update by Arisu.
 * 
 * Version 1.00 Official Release Date: July 9, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command NewGame
 * @text System: Start New Game
 * @desc Leaves the current scene and starts a new game.
 *
 * @arg SlowFade:eval
 * @text Slow Fade Out?
 * @type boolean
 * @on Slow
 * @off Normal
 * @desc Use a slow fade out transition to the next scene?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command LoadScreen
 * @text System: Open Load Scene
 * @desc Leaves the current scene and opens the load game scene.
 *
 * @arg SlowFade:eval
 * @text Slow Fade Out?
 * @type boolean
 * @on Slow
 * @off Normal
 * @desc Use a slow fade out transition to the next scene?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Options
 * @text System: Open Options Scene
 * @desc Leaves the current scene and opens the options scene.
 *
 * @arg SlowFade:eval
 * @text Slow Fade Out?
 * @type boolean
 * @on Slow
 * @off Normal
 * @desc Use a slow fade out transition to the next scene?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param EventTitleScene
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param Coordinates
 * @text Title Scene Coordinates
 *
 * @param MapID:num
 * @text Map ID
 * @parent Coordinates
 * @type number
 * @min 1
 * @max 999
 * @desc Select the map used for the evented title scene.
 * @default 1
 *
 * @param MapX:num
 * @text Map X
 * @parent Coordinates
 * @type number
 * @min 0
 * @max 255
 * @desc Select the X coordinate for the evented title scene.
 * @default 10
 *
 * @param MapY:num
 * @text Map Y
 * @parent Coordinates
 * @type number
 * @min 0
 * @max 255
 * @desc Select the Y coordinate for the evented title scene.
 * @default 10
 *
 * @param FaceDirection:num
 * @text Face Direction
 * @parent Coordinates
 * @type select
 * @option Down Left
 * @value 1
 * @option Down
 * @value 2
 * @option Down Right
 * @value 3
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up Left
 * @value 7
 * @option Up
 * @value 8
 * @option Up Right
 * @value 9
 * @desc What direction will the player face on the title scene?
 * This is assuming the player is visible.
 * @default 2
 * 
 * @param Player
 * @text Player Character
 *
 * @param PlayerTransparent:eval
 * @text Transparent?
 * @parent Player
 * @type boolean
 * @on Transparent
 * @off Opaque
 * @desc Make the player transparent on the title scene?
 * @default true
 *
 * @param CanInputMove:eval
 * @text Can Input Move?
 * @parent Player
 * @type boolean
 * @on Allow
 * @off Disallow
 * @desc Can the player move while on the title scene?
 * @default false
 *
 * @param ShowFollowers:eval
 * @text Show Followers?
 * @parent Player
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show player followers on the title scene?
 * This is assuming the player is visible.
 * @default false
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x5e2066=_0x553d;(function(_0x42c33b,_0x47e9f5){const _0x459e86=_0x553d,_0x2d41e3=_0x42c33b();while(!![]){try{const _0x2a8168=parseInt(_0x459e86(0x1ee))/0x1*(-parseInt(_0x459e86(0x1e3))/0x2)+parseInt(_0x459e86(0x19d))/0x3*(parseInt(_0x459e86(0x1df))/0x4)+-parseInt(_0x459e86(0x1a5))/0x5+parseInt(_0x459e86(0x1aa))/0x6*(-parseInt(_0x459e86(0x1d8))/0x7)+parseInt(_0x459e86(0x179))/0x8*(parseInt(_0x459e86(0x1c6))/0x9)+parseInt(_0x459e86(0x1dc))/0xa+-parseInt(_0x459e86(0x1ab))/0xb;if(_0x2a8168===_0x47e9f5)break;else _0x2d41e3['push'](_0x2d41e3['shift']());}catch(_0x3bfe07){_0x2d41e3['push'](_0x2d41e3['shift']());}}}(_0x2d5d,0xe2d19));function _0x2d5d(){const _0x29a095=['setTransparent','createTitleButtons','VisuMZ_1_OptionsCore','start','registerCommand','parameters','parse','isTriggered','status','includes','tileset','yKQWx','EVAL','popScene','9318520AtaBOa','initialize','STRUCT','processOptionsCoreFailsafe','gAddi','create','_scene','setTileBitmap','isPlaytest','isMapTouchOk','FaceDirection','Sprite_Character_setTileBitmap','SceneManager_goto','isSceneTitleMap','enableContinueTextTag','addChild','prototype','ARRAYSTR','EventTitleScene','VisuMZ_1_SaveCore','getInputDirection','needsFadeIn','makeCommandList','FvIxD','nvwDC','single','isSceneMap','loadFailureConfirmationWindow','oWetC','ShowFollowers','update','Save','filter','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','loadGame','name','2282835EQdKpZ','FNZYp','MapID','right','constructor','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','kPzTp','toUpperCase','7427675TndxwO','ESfaN','hideFollowers','playLoad','Scene_Base_isAutosaveEnabled','293358dVZkdI','2101165vXzcOi','FUNC','match','ARRAYNUM','max','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','fadeOutAll','Duration','onLoadFailure','initMembers','catch','isMenuCalled','pictureButtons','down','xQBPC','map','updateOptionsCoreFailsafe','MapX','qXfEn','onLoadSuccess','Settings','SceneManager_push','TQmhB','updateCallDebug','prepareEventedTitleScreen','ARRAYSTRUCT','ARRAYEVAL','9OLHkUi','goto','Game_Player_getInputDirection','PlayerTransparent','push','SaveCore','SlowFade','then','reloadMapIfUpdated','NzRAQ','length','Scene_Map_start','onSaveCoreLoadFailure','MapY','Scene_Map_needsFadeIn','updateEncounter','left','SaveConfirm','28ewqzDr','showFollowers','Options','ARRAYFUNC','9612010zWVUrR','WqYhp','format','8twxxwG','EinMz','version','call','2dUKnWy','_optionsCoreFailsafeCheck','JSON','nlFbF','OnLoadFailureJS','isPreviousScene','trim','callMenu','STR','description','NfXaA','846735WlXhju','exit','CanInputMove','isDebugCalled','Window_ChoiceList_makeCommandList','Tlvfs','isAutosaveEnabled','save','ConvertParams','isAnySavefileExists','_pickLockedSaveSlot','nSbRr','ARRAYJSON','VisuMZ_0_CoreEngine','assistMode','setupNewGame'];_0x2d5d=function(){return _0x29a095;};return _0x2d5d();}var label=_0x5e2066(0x18b),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x5e2066(0x199)](function(_0x2e9628){const _0x434403=_0x5e2066;return _0x2e9628[_0x434403(0x173)]&&_0x2e9628['description'][_0x434403(0x174)]('['+label+']');})[0x0];function _0x553d(_0x4c7863,_0x3a5e06){const _0x2d5d88=_0x2d5d();return _0x553d=function(_0x553d13,_0x69d948){_0x553d13=_0x553d13-0x15c;let _0x2a697e=_0x2d5d88[_0x553d13];return _0x2a697e;},_0x553d(_0x4c7863,_0x3a5e06);}VisuMZ[label][_0x5e2066(0x1bf)]=VisuMZ[label][_0x5e2066(0x1bf)]||{},VisuMZ[_0x5e2066(0x163)]=function(_0x4ad3b4,_0xd469c){const _0x1fae25=_0x5e2066;for(const _0x42dbf7 in _0xd469c){if(_0x42dbf7[_0x1fae25(0x1ad)](/(.*):(.*)/i)){const _0x547fc5=String(RegExp['$1']),_0x5896b5=String(RegExp['$2'])[_0x1fae25(0x1a4)]()[_0x1fae25(0x1e9)]();let _0x106845,_0x2b5005,_0xae634e;switch(_0x5896b5){case'NUM':_0x106845=_0xd469c[_0x42dbf7]!==''?Number(_0xd469c[_0x42dbf7]):0x0;break;case _0x1fae25(0x1ae):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005[_0x1fae25(0x1ba)](_0x4e40e6=>Number(_0x4e40e6));break;case _0x1fae25(0x177):_0x106845=_0xd469c[_0x42dbf7]!==''?eval(_0xd469c[_0x42dbf7]):null;break;case _0x1fae25(0x1c5):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005['map'](_0x11017b=>eval(_0x11017b));break;case _0x1fae25(0x1e5):_0x106845=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):'';break;case _0x1fae25(0x167):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005[_0x1fae25(0x1ba)](_0x611a56=>JSON[_0x1fae25(0x171)](_0x611a56));break;case _0x1fae25(0x1ac):_0x106845=_0xd469c[_0x42dbf7]!==''?new Function(JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7])):new Function('return\x200');break;case _0x1fae25(0x1db):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON['parse'](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005[_0x1fae25(0x1ba)](_0xcffbce=>new Function(JSON[_0x1fae25(0x171)](_0xcffbce)));break;case _0x1fae25(0x1eb):_0x106845=_0xd469c[_0x42dbf7]!==''?String(_0xd469c[_0x42dbf7]):'';break;case _0x1fae25(0x18a):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON['parse'](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005[_0x1fae25(0x1ba)](_0x1afb42=>String(_0x1afb42));break;case _0x1fae25(0x17b):_0xae634e=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):{},_0x106845=VisuMZ[_0x1fae25(0x163)]({},_0xae634e);break;case _0x1fae25(0x1c4):_0x2b5005=_0xd469c[_0x42dbf7]!==''?JSON[_0x1fae25(0x171)](_0xd469c[_0x42dbf7]):[],_0x106845=_0x2b5005[_0x1fae25(0x1ba)](_0x3f597f=>VisuMZ[_0x1fae25(0x163)]({},JSON[_0x1fae25(0x171)](_0x3f597f)));break;default:continue;}_0x4ad3b4[_0x547fc5]=_0x106845;}}return _0x4ad3b4;},(_0x5567df=>{const _0x1e340d=_0x5e2066,_0x3443ce=_0x5567df['name'];for(const _0x3801c0 of dependencies){if(_0x1e340d(0x1bd)!=='qXfEn')return _0x401da3[_0x1e340d(0x18b)][_0x1e340d(0x1bf)]['CanInputMove'];else{if(!Imported[_0x3801c0]){if('SoMIC'===_0x1e340d(0x166))_0x26e916['_scene'][_0x1e340d(0x1b1)]();else{alert(_0x1e340d(0x1a2)[_0x1e340d(0x1de)](_0x3443ce,_0x3801c0)),SceneManager[_0x1e340d(0x15c)]();break;}}}}const _0x3f1a3d=_0x5567df[_0x1e340d(0x1ec)];if(_0x3f1a3d['match'](/\[Version[ ](.*?)\]/i)){if('rsfIE'!==_0x1e340d(0x1cf)){const _0x214788=Number(RegExp['$1']);_0x214788!==VisuMZ[label][_0x1e340d(0x1e1)]&&(alert(_0x1e340d(0x1b0)[_0x1e340d(0x1de)](_0x3443ce,_0x214788)),SceneManager['exit']());}else _0x4da7b2[_0x1e340d(0x17f)][_0x1e340d(0x1b1)]();}if(_0x3f1a3d['match'](/\[Tier[ ](\d+)\]/i)){const _0x46550b=Number(RegExp['$1']);_0x46550b<tier?_0x1e340d(0x1c1)===_0x1e340d(0x1c1)?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x1e340d(0x1de)](_0x3443ce,_0x46550b,tier)),SceneManager['exit']()):(_0x4c8fba[_0x1e340d(0x189)][_0x1e340d(0x16e)][_0x1e340d(0x1e2)](this),_0x7a1fc1[_0x1e340d(0x19b)](0x0)['then'](()=>this[_0x1e340d(0x1be)]())[_0x1e340d(0x1b5)](()=>this[_0x1e340d(0x1b3)]())):tier=Math[_0x1e340d(0x1af)](_0x46550b,tier);}VisuMZ['ConvertParams'](VisuMZ[label][_0x1e340d(0x1bf)],_0x5567df[_0x1e340d(0x170)]);})(pluginData),PluginManager[_0x5e2066(0x16f)](pluginData['name'],'NewGame',_0x233aa5=>{const _0x4d0edc=_0x5e2066;VisuMZ[_0x4d0edc(0x163)](_0x233aa5,_0x233aa5);const _0x186c98=_0x233aa5[_0x4d0edc(0x1cc)];if(_0x186c98){if(_0x4d0edc(0x1b9)!==_0x4d0edc(0x191))SceneManager[_0x4d0edc(0x17f)]['fadeOutAll']();else return _0x34c095[_0x4d0edc(0x18b)][_0x4d0edc(0x1d4)][_0x4d0edc(0x1e2)](this)||_0x110fe1['isPreviousScene'](_0x4afba2);}Imported['VisuMZ_1_SaveCore']&&StorageManager['saveStyle']()==='locked'?(DataManager[_0x4d0edc(0x16a)](),$gameTemp[_0x4d0edc(0x165)]=!![],SceneManager[_0x4d0edc(0x1ca)](Scene_Save)):_0x4d0edc(0x160)===_0x4d0edc(0x1dd)?_0x4b1d18[_0x4d0edc(0x189)][_0x4d0edc(0x17a)]['call'](this):SceneManager[_0x4d0edc(0x1ca)](Scene_TitleTransition);}),PluginManager[_0x5e2066(0x16f)](pluginData[_0x5e2066(0x19c)],'LoadScreen',_0x2ca2c2=>{const _0x28d5f0=_0x5e2066;VisuMZ[_0x28d5f0(0x163)](_0x2ca2c2,_0x2ca2c2);const _0x1de77e=_0x2ca2c2['SlowFade'];_0x1de77e&&(_0x28d5f0(0x176)==='yKQWx'?SceneManager[_0x28d5f0(0x17f)][_0x28d5f0(0x1b1)]():this[_0x28d5f0(0x17a)](...arguments));if(Imported[_0x28d5f0(0x18c)]&&StorageManager['saveStyle']()===_0x28d5f0(0x192)){if(_0x28d5f0(0x190)===_0x28d5f0(0x195)){const _0x10f824=[0x8,0x8,0x2,0x2,0x4,0x6,0x4,0x6];this[_0x28d5f0(0x1e4)]=this[_0x28d5f0(0x1e4)]||0x0,_0x21e51b===_0x10f824[this[_0x28d5f0(0x1e4)]]?this['_optionsCoreFailsafeCheck']++:this[_0x28d5f0(0x1e4)]=0x0,this['_optionsCoreFailsafeCheck']===_0x10f824['length']&&(_0x1f17d7[_0x28d5f0(0x169)]=!![],_0x26dbd8[_0x28d5f0(0x162)](),_0x1477dd[_0x28d5f0(0x1a8)]());}else DataManager[_0x28d5f0(0x164)]()?SceneManager[_0x28d5f0(0x1ca)](Scene_SingleLoadTransition):(SoundManager['playBuzzer'](),SceneManager['_scene']['loadFailureConfirmationWindow']());}else SceneManager[_0x28d5f0(0x1ca)](Scene_Load);}),PluginManager[_0x5e2066(0x16f)](pluginData[_0x5e2066(0x19c)],_0x5e2066(0x1da),_0x38d115=>{const _0x485a7b=_0x5e2066;VisuMZ[_0x485a7b(0x163)](_0x38d115,_0x38d115);const _0x3d02a4=_0x38d115['SlowFade'];if(_0x3d02a4){if(_0x485a7b(0x17d)!=='gAddi')return 0x0;else SceneManager[_0x485a7b(0x17f)]['fadeOutAll']();}SceneManager[_0x485a7b(0x1ca)](Scene_Options);}),DataManager[_0x5e2066(0x1c3)]=function(){const _0x504f82=_0x5e2066;this[_0x504f82(0x16a)]();const _0x37ffb5=VisuMZ['EventTitleScene']['Settings'][_0x504f82(0x19f)],_0x2bfbcb=VisuMZ[_0x504f82(0x18b)][_0x504f82(0x1bf)][_0x504f82(0x1bc)],_0x5f37ee=VisuMZ['EventTitleScene']['Settings'][_0x504f82(0x1d3)],_0x3861fc=VisuMZ[_0x504f82(0x18b)][_0x504f82(0x1bf)][_0x504f82(0x183)];$gamePlayer['reserveTransfer'](_0x37ffb5,_0x2bfbcb,_0x5f37ee,_0x3861fc,0x0);},SceneManager[_0x5e2066(0x193)]=function(){const _0x4b8959=_0x5e2066;return this['_scene']&&this['_scene'][_0x4b8959(0x1a1)]===Scene_Map;},SceneManager[_0x5e2066(0x186)]=function(){const _0x57ba1e=_0x5e2066;return this['_scene']&&this[_0x57ba1e(0x17f)]['constructor']===Scene_EventedTitleMap;},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x185)]=SceneManager['goto'],SceneManager[_0x5e2066(0x1c7)]=function(_0x2a4c54){const _0x11209c=_0x5e2066;if(_0x2a4c54===Scene_Title||_0x2a4c54===Scene_EventedTitleMap){if(_0x11209c(0x1a3)!==_0x11209c(0x1a6))DataManager['prepareEventedTitleScreen'](),_0x2a4c54=Scene_EventedTitleMap;else{_0x4287c9[_0x11209c(0x163)](_0xb8c2fa,_0x1685b2);const _0x34a5ea=_0x357ed3[_0x11209c(0x1cc)];_0x34a5ea&&_0x38de5e[_0x11209c(0x17f)]['fadeOutAll'](),_0x3b08af[_0x11209c(0x1ca)](_0x49c720);}}VisuMZ[_0x11209c(0x18b)][_0x11209c(0x185)][_0x11209c(0x1e2)](this,_0x2a4c54);},VisuMZ['EventTitleScene'][_0x5e2066(0x1c0)]=SceneManager[_0x5e2066(0x1ca)],SceneManager[_0x5e2066(0x1ca)]=function(_0xf6bdca){const _0x5957ca=_0x5e2066;if(_0xf6bdca===Scene_Title||_0xf6bdca===Scene_EventedTitleMap){if('eYIHz'===_0x5957ca(0x1e6)){const _0x46ea35=_0x5e4771(_0x576225['$1']);_0x46ea35<_0x1c9a98?(_0x53b131(_0x5957ca(0x19a)[_0x5957ca(0x1de)](_0x4cb34e,_0x46ea35,_0x3a2290)),_0x50deaf['exit']()):_0x495324=_0x423d20[_0x5957ca(0x1af)](_0x46ea35,_0x2cdbd3);}else DataManager['prepareEventedTitleScreen'](),_0xf6bdca=Scene_EventedTitleMap;}VisuMZ[_0x5957ca(0x18b)][_0x5957ca(0x1c0)]['call'](this,_0xf6bdca);},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x1c8)]=Game_Player[_0x5e2066(0x189)][_0x5e2066(0x18d)],Game_Player['prototype']['getInputDirection']=function(){const _0x18fe95=_0x5e2066;if(!VisuMZ['EventTitleScene'][_0x18fe95(0x1bf)][_0x18fe95(0x15d)]&&SceneManager[_0x18fe95(0x186)]())return 0x0;return VisuMZ[_0x18fe95(0x18b)][_0x18fe95(0x1c8)]['call'](this);};function Scene_EventedTitleMap(){const _0x2b88d5=_0x5e2066;this[_0x2b88d5(0x17a)](...arguments);}Scene_EventedTitleMap['prototype']=Object[_0x5e2066(0x17e)](Scene_Map[_0x5e2066(0x189)]),Scene_EventedTitleMap[_0x5e2066(0x189)]['constructor']=Scene_EventedTitleMap,Scene_EventedTitleMap['prototype']['initialize']=function(){const _0x3ccb99=_0x5e2066;Scene_Map[_0x3ccb99(0x189)][_0x3ccb99(0x17a)]['call'](this),this[_0x3ccb99(0x1b4)]();},Scene_EventedTitleMap[_0x5e2066(0x189)]['initMembers']=function(){const _0xbb64f5=_0x5e2066;$gamePlayer[_0xbb64f5(0x16b)](VisuMZ[_0xbb64f5(0x18b)][_0xbb64f5(0x1bf)][_0xbb64f5(0x1c9)]),VisuMZ[_0xbb64f5(0x18b)][_0xbb64f5(0x1bf)][_0xbb64f5(0x196)]?$gamePlayer[_0xbb64f5(0x1d9)]():$gamePlayer[_0xbb64f5(0x1a7)]();},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x161)]=function(){return![];},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x182)]=function(){const _0x45b757=_0x5e2066;return VisuMZ[_0x45b757(0x18b)][_0x45b757(0x1bf)]['CanInputMove'];},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x1d5)]=function(){},Scene_EventedTitleMap['prototype'][_0x5e2066(0x1b6)]=function(){return![];},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x1ea)]=function(){},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x1c2)]=function(){},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x15e)]=function(){return![];},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x16e)]=function(){const _0x53e4ab=_0x5e2066;Scene_Map[_0x53e4ab(0x189)][_0x53e4ab(0x16e)]['call'](this);if(Imported[_0x53e4ab(0x168)]){if('sKXhN'!==_0x53e4ab(0x1ed))this[_0x53e4ab(0x16c)]();else{const _0xff236d=_0x4e7d0f(_0x1d187d['$1']);_0xff236d!==_0x5c67bb[_0x3bbb16][_0x53e4ab(0x1e1)]&&(_0x454d6f(_0x53e4ab(0x1b0)[_0x53e4ab(0x1de)](_0x17137c,_0xff236d)),_0x1e940b[_0x53e4ab(0x15c)]());}}},Scene_EventedTitleMap[_0x5e2066(0x189)][_0x5e2066(0x16c)]=function(){const _0x36aff3=_0x5e2066;for(const _0x5f1965 of Scene_Title[_0x36aff3(0x1b7)]){const _0x3308f9=new Sprite_TitlePictureButton(_0x5f1965);this[_0x36aff3(0x188)](_0x3308f9);}},Scene_EventedTitleMap['prototype']['update']=function(){const _0xd197d2=_0x5e2066;Scene_Map[_0xd197d2(0x189)][_0xd197d2(0x197)]['call'](this),this[_0xd197d2(0x1bb)]();},Scene_EventedTitleMap[_0x5e2066(0x189)]['updateOptionsCoreFailsafe']=function(){const _0x300b52=_0x5e2066;if(ConfigManager[_0x300b52(0x169)])return;if($gameTemp[_0x300b52(0x181)]())return;if(!Imported[_0x300b52(0x16d)])return;if(Input['isTriggered'](_0x300b52(0x1b8)))this[_0x300b52(0x17c)](0x2);if(Input['isTriggered'](_0x300b52(0x1d6)))this[_0x300b52(0x17c)](0x4);if(Input[_0x300b52(0x172)](_0x300b52(0x1a0)))this['processOptionsCoreFailsafe'](0x6);if(Input[_0x300b52(0x172)]('up'))this[_0x300b52(0x17c)](0x8);},Scene_EventedTitleMap['prototype'][_0x5e2066(0x17c)]=function(_0x52c54f){const _0x414ddb=_0x5e2066,_0x1f7e06=[0x8,0x8,0x2,0x2,0x4,0x6,0x4,0x6];this[_0x414ddb(0x1e4)]=this['_optionsCoreFailsafeCheck']||0x0;_0x52c54f===_0x1f7e06[this['_optionsCoreFailsafeCheck']]?'EinMz'===_0x414ddb(0x1e0)?this['_optionsCoreFailsafeCheck']++:this[_0x414ddb(0x16c)]():this[_0x414ddb(0x1e4)]=0x0;if(this[_0x414ddb(0x1e4)]===_0x1f7e06[_0x414ddb(0x1d0)]){if('KyYwg'!==_0x414ddb(0x19e))ConfigManager[_0x414ddb(0x169)]=!![],ConfigManager[_0x414ddb(0x162)](),SoundManager[_0x414ddb(0x1a8)]();else return this[_0x414ddb(0x17f)]&&this[_0x414ddb(0x17f)]['constructor']===_0x27568d;}};function Scene_TitleTransition(){const _0x4ad780=_0x5e2066;this[_0x4ad780(0x17a)](...arguments);}Scene_TitleTransition[_0x5e2066(0x189)]=Object['create'](Scene_Base[_0x5e2066(0x189)]),Scene_TitleTransition[_0x5e2066(0x189)][_0x5e2066(0x1a1)]=Scene_TitleTransition,Scene_TitleTransition[_0x5e2066(0x189)][_0x5e2066(0x17a)]=function(){const _0x546527=_0x5e2066;Scene_Base['prototype'][_0x546527(0x17a)][_0x546527(0x1e2)](this);},Scene_TitleTransition[_0x5e2066(0x189)][_0x5e2066(0x16e)]=function(){const _0x26214b=_0x5e2066;Scene_Base['prototype'][_0x26214b(0x16e)][_0x26214b(0x1e2)](this),DataManager[_0x26214b(0x16a)](),SceneManager['goto'](Scene_Map);},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x1a9)]=Scene_Base[_0x5e2066(0x189)][_0x5e2066(0x161)],Scene_Base[_0x5e2066(0x189)][_0x5e2066(0x161)]=function(){const _0x27e81a=_0x5e2066;if(SceneManager[_0x27e81a(0x1e8)](Scene_TitleTransition))return![];if(SceneManager[_0x27e81a(0x1e8)](Scene_Save))return![];return VisuMZ[_0x27e81a(0x18b)][_0x27e81a(0x1a9)]['call'](this);};function Scene_SingleLoadTransition(){const _0x1d728d=_0x5e2066;this[_0x1d728d(0x17a)](...arguments);}Scene_SingleLoadTransition[_0x5e2066(0x189)]=Object[_0x5e2066(0x17e)](Scene_Base[_0x5e2066(0x189)]),Scene_SingleLoadTransition[_0x5e2066(0x189)]['constructor']=Scene_SingleLoadTransition,Scene_SingleLoadTransition[_0x5e2066(0x189)][_0x5e2066(0x17a)]=function(){const _0x17b648=_0x5e2066;Scene_Base[_0x17b648(0x189)]['initialize'][_0x17b648(0x1e2)](this);},Scene_SingleLoadTransition[_0x5e2066(0x189)][_0x5e2066(0x16e)]=function(){const _0x47ff6b=_0x5e2066;Scene_Base['prototype'][_0x47ff6b(0x16e)]['call'](this),DataManager['loadGame'](0x0)[_0x47ff6b(0x1cd)](()=>this[_0x47ff6b(0x1be)]())[_0x47ff6b(0x1b5)](()=>this['onLoadFailure']());},Scene_SingleLoadTransition[_0x5e2066(0x189)]['onLoadSuccess']=function(){const _0x48d3ef=_0x5e2066;SoundManager['playLoad'](),this[_0x48d3ef(0x1b1)](),Scene_Load[_0x48d3ef(0x189)][_0x48d3ef(0x1ce)](),SceneManager[_0x48d3ef(0x1c7)](Scene_Map),VisuMZ[_0x48d3ef(0x1cb)][_0x48d3ef(0x1bf)][_0x48d3ef(0x198)]['OnLoadSuccessJS'][_0x48d3ef(0x1e2)](this);},Scene_SingleLoadTransition[_0x5e2066(0x189)][_0x5e2066(0x1d2)]=function(){const _0x80337f=_0x5e2066;SoundManager['playBuzzer'](),VisuMZ['SaveCore'][_0x80337f(0x1bf)]['Save'][_0x80337f(0x1e7)][_0x80337f(0x1e2)](this),this[_0x80337f(0x194)]();},Scene_SingleLoadTransition['prototype'][_0x5e2066(0x1b3)]=function(){const _0x587cf0=_0x5e2066;SoundManager['playBuzzer'](),VisuMZ['SaveCore'][_0x587cf0(0x1bf)]['Save']['OnLoadFailureJS']['call'](this),this[_0x587cf0(0x194)]();const _0x5d944a=VisuMZ[_0x587cf0(0x1cb)]['Settings'][_0x587cf0(0x1d7)][_0x587cf0(0x1b2)];setTimeout(this[_0x587cf0(0x178)]['bind'](this),_0x5d944a);},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x1d1)]=Scene_Map[_0x5e2066(0x189)][_0x5e2066(0x16e)],Scene_Map[_0x5e2066(0x189)]['start']=function(){const _0x28233d=_0x5e2066;VisuMZ[_0x28233d(0x18b)][_0x28233d(0x1d1)]['call'](this),SceneManager[_0x28233d(0x1e8)](Scene_SingleLoadTransition)&&$gameMap['autoplay']();},VisuMZ[_0x5e2066(0x18b)]['Scene_Map_needsFadeIn']=Scene_Map[_0x5e2066(0x189)][_0x5e2066(0x18e)],Scene_Map[_0x5e2066(0x189)][_0x5e2066(0x18e)]=function(){const _0x59759a=_0x5e2066;return VisuMZ[_0x59759a(0x18b)][_0x59759a(0x1d4)][_0x59759a(0x1e2)](this)||SceneManager[_0x59759a(0x1e8)](Scene_SingleLoadTransition);},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x184)]=Sprite_Character['prototype'][_0x5e2066(0x180)],Sprite_Character['prototype'][_0x5e2066(0x180)]=function(){const _0x569b51=_0x5e2066;if(!$gameMap[_0x569b51(0x175)]())return;VisuMZ[_0x569b51(0x18b)][_0x569b51(0x184)][_0x569b51(0x1e2)](this);},VisuMZ[_0x5e2066(0x18b)][_0x5e2066(0x15f)]=Window_ChoiceList['prototype']['makeCommandList'],Window_ChoiceList[_0x5e2066(0x189)][_0x5e2066(0x18f)]=function(){const _0x5446a9=_0x5e2066;VisuMZ[_0x5446a9(0x18b)][_0x5446a9(0x15f)][_0x5446a9(0x1e2)](this),this[_0x5446a9(0x187)]();},Window_ChoiceList['prototype']['enableContinueTextTag']=function(){const _0x9d8a81=_0x5e2066;for(const _0x18c48a of this['_list']){if(!_0x18c48a)continue;if(!_0x18c48a[_0x9d8a81(0x19c)][_0x9d8a81(0x1ad)](/<CONTINUE>/i))continue;_0x18c48a[_0x9d8a81(0x19c)]=_0x18c48a[_0x9d8a81(0x19c)]['replace'](/<CONTINUE>/gi,'')['trim'](),_0x18c48a['enabled']=DataManager[_0x9d8a81(0x164)]();}};