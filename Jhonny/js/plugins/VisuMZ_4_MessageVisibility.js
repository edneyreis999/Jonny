//=============================================================================
// VisuStella MZ - Message Visibility
// VisuMZ_4_MessageVisibility.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_4_MessageVisibility = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MessageVisibility = VisuMZ.MessageVisibility || {};
VisuMZ.MessageVisibility.version = 1.03;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 4] [Version 1.03] [MessageVisibility]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Message_Visibility_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 * @orderAfter VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_2_ExtMessageFunc
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds in the functionality to toggle the visibility of the
 * Message Window on the map scene so that the player can observe the full view
 * of the screen, to better visualize any pictures, parallaxes, and/or
 * backgrounds before them. This can be done via a shortcut key or, if you're
 * using the Extended Message Functionality plugin, by button. These options
 * are only available to the Message Window on the map scene and do not work
 * in battle.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Use a shortcut key to show or hide the Message Window.
 * * Shortcut key also works while the Choice Window, Gold Window, Number Input
 *   Window, or Event Item Windows are active.
 * * Those using the Extended Message Functionality plugin can also bind this
 *   effect to the Button Console.
 * * Those using the Message Core can bind Common Events that run whenever the
 *   Message Window is hidden or becomes visible. This can be used to hide or
 *   show the windows that aren't covered automatically by the plugin.
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
 * Extra Features
 * ============================================================================
 *
 * There are some extra features found if other VisuStella MZ plugins are found
 * present in the Plugin Manager list.
 *
 * ---
 *
 * VisuMZ_1_MessageCore
 *
 * Those using the Message Core can bind Common Events that run whenever the
 * Message Window is hidden or becomes visible. This can be used to hide or
 * show the windows that aren't covered automatically by the plugin.
 *
 * ---
 *
 * VisuMZ_2_ExtMessageFunc
 * 
 * The Message Visibility plugin enables the "Hide" button found in the
 * Extended Message Functionality plugin's Button Console to make the Message
 * Window visible or invisible.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the Plugin Parameters available for the Message Visibility plugin.
 * Some of these features require certain plugins to be installed in order to
 * have an effect.
 *
 * ---
 *
 * General
 * 
 *   Toggle Key:
 *   - This is the key used for toggling message visibility.
 *   - Does not work in battle!
 *
 * ---
 *
 * Compatibility > VisuMZ_1_MessageCore
 * - These require VisuMZ_1_MessageCore to be installed!
 * 
 *   Common Event on Show:
 *   - Select a Common Event to run whenever the Message Window becomes
 *     visible.
 *   - Use 0 for none.
 *   - Best used for making certain UI elements that aren't controlled by this
 *     plugin to be manually made visible.
 * 
 *   Common Event on Hide:
 *   - Select a Common Event to run whenever the Message Window becomes
 *     hidden.
 *   - Use 0 for none.
 *   - Best used for making certain UI elements that aren't controlled by this
 *     plugin to be manually made hidden.
 *
 * ---
 *
 * Compatibility > VisuMZ_2_ExtMessageFunc
 * - These require VisuMZ_2_ExtMessageFunc to be installed!
 * 
 *   Button Name:
 *   - How is this option's text displayed in-game?
 *   - Requires VisuMZ_2_ExtMessageFunc!
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
 * Version 1.03: February 20, 2025
 * * Compatibility Update!
 * ** Added better compatibility with some of the more recent Message Core
 *    additions.
 * 
 * Version 1.02: August 6, 2021
 * * Documentation Update!
 * ** Plugin URL now updated to most recent one.
 * 
 * Version 1.01: July 30, 2021
 * * Bug Fixes!
 * ** Stops an unusual crash from happening. Fix made by Irina.
 * 
 * Version 1.00 Official Release Date: August 6, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param MessageVisibility
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param General
 *
 * @param ToggleKey:str
 * @text Toggle Key
 * @parent General
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for toggling message visibility.
 * Does not work in battle!
 * @default tab
 * 
 * @param Compatibility
 * 
 * @param VisuMZ_1_MessageCore
 * @parent Compatibility
 *
 * @param CommonEventShow:num
 * @text Common Event on Show
 * @parent VisuMZ_1_MessageCore
 * @type common_event
 * @desc Select a Common Event to run whenever the
 * Message Window becomes visible. Use 0 for none.
 * @default 0
 *
 * @param CommonEventHide:num
 * @text Common Event on Hide
 * @parent VisuMZ_1_MessageCore
 * @type common_event
 * @desc Select a Common Event to run whenever the
 * Message Window becomes hidden. Use 0 for none.
 * @default 0
 * 
 * @param VisuMZ_2_ExtMessageFunc
 * @parent Compatibility
 *
 * @param ButtonName:str
 * @text Button Name
 * @parent VisuMZ_2_ExtMessageFunc
 * @desc How is this option's text displayed in-game?
 * Requires VisuMZ_2_ExtMessageFunc!
 * @default HIDE
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
/* ----------------------------------------------------------------------------
 * General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~General:
 *
 * @param Category
 * @text Stuff
 *
 */
//=============================================================================

const _0xdfd8c5=_0x3583;function _0x3583(_0x164723,_0x2f8176){const _0x1684e1=_0x1684();return _0x3583=function(_0x358313,_0x4ceb5a){_0x358313=_0x358313-0x1ef;let _0x2937d5=_0x1684e1[_0x358313];return _0x2937d5;},_0x3583(_0x164723,_0x2f8176);}(function(_0x94c43,_0x380ff0){const _0x2a457b=_0x3583,_0x52df54=_0x94c43();while(!![]){try{const _0x1d6227=parseInt(_0x2a457b(0x1f0))/0x1+-parseInt(_0x2a457b(0x20c))/0x2+parseInt(_0x2a457b(0x20b))/0x3*(parseInt(_0x2a457b(0x1f3))/0x4)+parseInt(_0x2a457b(0x222))/0x5+parseInt(_0x2a457b(0x235))/0x6+-parseInt(_0x2a457b(0x1ff))/0x7*(parseInt(_0x2a457b(0x209))/0x8)+parseInt(_0x2a457b(0x20e))/0x9*(-parseInt(_0x2a457b(0x20f))/0xa);if(_0x1d6227===_0x380ff0)break;else _0x52df54['push'](_0x52df54['shift']());}catch(_0x5039e4){_0x52df54['push'](_0x52df54['shift']());}}}(_0x1684,0x5e2cb));var label='MessageVisibility',tier=tier||0x0,dependencies=[],pluginData=$plugins[_0xdfd8c5(0x247)](function(_0x34e7ec){const _0x56eade=_0xdfd8c5;return _0x34e7ec[_0x56eade(0x243)]&&_0x34e7ec[_0x56eade(0x205)][_0x56eade(0x246)]('['+label+']');})[0x0];VisuMZ[label][_0xdfd8c5(0x22e)]=VisuMZ[label]['Settings']||{},VisuMZ['ConvertParams']=function(_0x42c57a,_0x329b00){const _0x750e2e=_0xdfd8c5;for(const _0x4d6b21 in _0x329b00){if(_0x4d6b21[_0x750e2e(0x242)](/(.*):(.*)/i)){const _0x5ecf86=String(RegExp['$1']),_0x580662=String(RegExp['$2'])['toUpperCase']()[_0x750e2e(0x1f6)]();let _0x1c79e7,_0x1b9ea1,_0xd0c835;switch(_0x580662){case'NUM':_0x1c79e7=_0x329b00[_0x4d6b21]!==''?Number(_0x329b00[_0x4d6b21]):0x0;break;case _0x750e2e(0x22d):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON['parse'](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1[_0x750e2e(0x245)](_0xa82cae=>Number(_0xa82cae));break;case _0x750e2e(0x221):_0x1c79e7=_0x329b00[_0x4d6b21]!==''?eval(_0x329b00[_0x4d6b21]):null;break;case _0x750e2e(0x23c):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1[_0x750e2e(0x245)](_0x146221=>eval(_0x146221));break;case _0x750e2e(0x226):_0x1c79e7=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):'';break;case _0x750e2e(0x1fe):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1[_0x750e2e(0x245)](_0x217421=>JSON['parse'](_0x217421));break;case _0x750e2e(0x230):_0x1c79e7=_0x329b00[_0x4d6b21]!==''?new Function(JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21])):new Function(_0x750e2e(0x1f5));break;case _0x750e2e(0x1f9):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1['map'](_0x40a26e=>new Function(JSON[_0x750e2e(0x240)](_0x40a26e)));break;case _0x750e2e(0x23d):_0x1c79e7=_0x329b00[_0x4d6b21]!==''?String(_0x329b00[_0x4d6b21]):'';break;case _0x750e2e(0x1f8):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1[_0x750e2e(0x245)](_0x37ca1e=>String(_0x37ca1e));break;case _0x750e2e(0x224):_0xd0c835=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):{},_0x1c79e7=VisuMZ[_0x750e2e(0x202)]({},_0xd0c835);break;case _0x750e2e(0x212):_0x1b9ea1=_0x329b00[_0x4d6b21]!==''?JSON[_0x750e2e(0x240)](_0x329b00[_0x4d6b21]):[],_0x1c79e7=_0x1b9ea1[_0x750e2e(0x245)](_0x30e206=>VisuMZ[_0x750e2e(0x202)]({},JSON[_0x750e2e(0x240)](_0x30e206)));break;default:continue;}_0x42c57a[_0x5ecf86]=_0x1c79e7;}}return _0x42c57a;},(_0x12ebd7=>{const _0xd3687c=_0xdfd8c5,_0x208db4=_0x12ebd7[_0xd3687c(0x21c)];for(const _0x2dd5b2 of dependencies){if(!Imported[_0x2dd5b2]){alert(_0xd3687c(0x21a)[_0xd3687c(0x21d)](_0x208db4,_0x2dd5b2)),SceneManager['exit']();break;}}const _0x5bcf40=_0x12ebd7[_0xd3687c(0x205)];if(_0x5bcf40[_0xd3687c(0x242)](/\[Version[ ](.*?)\]/i)){const _0x52a897=Number(RegExp['$1']);_0x52a897!==VisuMZ[label][_0xd3687c(0x229)]&&(alert(_0xd3687c(0x23f)[_0xd3687c(0x21d)](_0x208db4,_0x52a897)),SceneManager[_0xd3687c(0x210)]());}if(_0x5bcf40[_0xd3687c(0x242)](/\[Tier[ ](\d+)\]/i)){const _0x2ab098=Number(RegExp['$1']);_0x2ab098<tier?(alert(_0xd3687c(0x23b)['format'](_0x208db4,_0x2ab098,tier)),SceneManager[_0xd3687c(0x210)]()):tier=Math[_0xd3687c(0x1fb)](_0x2ab098,tier);}VisuMZ[_0xd3687c(0x202)](VisuMZ[label][_0xd3687c(0x22e)],_0x12ebd7[_0xd3687c(0x215)]);})(pluginData);TextManager[_0xdfd8c5(0x201)]&&(VisuMZ['MessageVisibility']['TextManager_msgButtonConsole']=TextManager[_0xdfd8c5(0x201)],TextManager[_0xdfd8c5(0x201)]=function(_0x894025){const _0x5158e3=_0xdfd8c5;if(_0x894025===_0x5158e3(0x244))return VisuMZ[_0x5158e3(0x20a)]['Settings'][_0x5158e3(0x220)];return VisuMZ['MessageVisibility']['TextManager_msgButtonConsole'][_0x5158e3(0x21e)](this,_0x894025);});function _0x1684(){const _0x5b8ee1=['%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','parse','ToggleKey','match','status','hide','map','includes','filter','Window_EventItem','533992uqJkho','_choiceListHelpWindow','launchMessageCommonEvent','20jIaLTL','VISIBILITY_COMMON_EVENT_HIDE','return\x200','trim','canToggleVisibility','ARRAYSTR','ARRAYFUNC','_choiceListWindow','max','processCursorMove','VisuMZ_1_MessageCore','ARRAYJSON','7qxvCcv','VISIBILITY_TOGGLE_KEY','msgButtonConsole','ConvertParams','isSceneMap','isHandled','description','runVisibilityCommonEvent','_cannotToggleVisibility','pagedown','4783384HaYPFL','MessageVisibility','187773geQPYN','569686zBKcSU','scale','9rrDFKL','8636360SpkDgR','exit','setWindowVisibility','ARRAYSTRUCT','_scene','prototype','parameters','_goldWindow','Window_Message','VISIBILITY_COMMON_EVENT_SHOW','_numberInputWindow','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','showMessageWindowVisibility','name','format','call','Window_Message_isTriggered','ButtonName','EVAL','3031715QXdBnw','isCursorMovable','STRUCT','Window_NumberInput','JSON','enableToggleVisibility','Window_Selectable_processCursorMove','version','Window_Selectable_processTouch','isRepeated','pageup','ARRAYNUM','Settings','setVisibility','FUNC','toggleVisibility','left','clear','_eventItemWindow','4073106XWcOdY','isTriggered','down','_messageWindow','processTouch','CommonEventHide','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','ARRAYEVAL','STR','constructor'];_0x1684=function(){return _0x5b8ee1;};return _0x1684();};SceneManager['isSceneMap']=function(){const _0x1b8b54=_0xdfd8c5;return this[_0x1b8b54(0x213)]&&this['_scene'][_0x1b8b54(0x23e)]===Scene_Map;},Game_Temp[_0xdfd8c5(0x214)]['toggleMessageWindowVisibility']=function(){const _0x513d1f=_0xdfd8c5,_0x3fd2c5=SceneManager['_scene'][_0x513d1f(0x238)];_0x3fd2c5&&_0x3fd2c5[_0x513d1f(0x231)]();},Game_Temp['prototype'][_0xdfd8c5(0x21b)]=function(){const _0x4c519f=_0xdfd8c5,_0x5bb136=SceneManager['_scene'][_0x4c519f(0x238)];_0x5bb136&&_0x5bb136[_0x4c519f(0x22f)](!![]);},Window_Selectable[_0xdfd8c5(0x214)][_0xdfd8c5(0x1f7)]=function(){const _0x3b0f72=_0xdfd8c5;if(!SceneManager[_0x3b0f72(0x203)]())return![];if(this['_pictureChoicesHidden'])return![];const _0x18dd6b=[_0x3b0f72(0x217),'Window_ChoiceList',_0x3b0f72(0x225),_0x3b0f72(0x1ef)];return _0x18dd6b[_0x3b0f72(0x246)](this[_0x3b0f72(0x23e)][_0x3b0f72(0x21c)]);},VisuMZ[_0xdfd8c5(0x20a)][_0xdfd8c5(0x228)]=Window_Selectable[_0xdfd8c5(0x214)][_0xdfd8c5(0x1fc)],Window_Selectable[_0xdfd8c5(0x214)][_0xdfd8c5(0x1fc)]=function(){const _0x4ded84=_0xdfd8c5;if(this[_0x4ded84(0x223)]()){if(Input[_0x4ded84(0x236)](Window_Message[_0x4ded84(0x200)])){if(this[_0x4ded84(0x1f7)]())return $gameTemp['toggleMessageWindowVisibility']();}else{if(this[_0x4ded84(0x20d)]['x']<=0x0&&this[_0x4ded84(0x1f7)]()){if(Input[_0x4ded84(0x22b)](_0x4ded84(0x237)))return $gameTemp[_0x4ded84(0x21b)]();if(Input[_0x4ded84(0x22b)]('up'))return $gameTemp[_0x4ded84(0x21b)]();if(Input[_0x4ded84(0x22b)]('right'))return $gameTemp[_0x4ded84(0x21b)]();if(Input[_0x4ded84(0x22b)](_0x4ded84(0x232)))return $gameTemp[_0x4ded84(0x21b)]();if(!this['isHandled'](_0x4ded84(0x208))&&Input[_0x4ded84(0x236)](_0x4ded84(0x208)))return $gameTemp[_0x4ded84(0x21b)]();if(!this[_0x4ded84(0x204)]('pageup')&&Input['isTriggered'](_0x4ded84(0x22c)))return $gameTemp[_0x4ded84(0x21b)]();return;}}}VisuMZ[_0x4ded84(0x20a)][_0x4ded84(0x228)][_0x4ded84(0x21e)](this);},VisuMZ['MessageVisibility'][_0xdfd8c5(0x22a)]=Window_Selectable[_0xdfd8c5(0x214)][_0xdfd8c5(0x239)],Window_Selectable[_0xdfd8c5(0x214)][_0xdfd8c5(0x239)]=function(){const _0x57994f=_0xdfd8c5;if(this['isOpenAndActive']()){if(this[_0x57994f(0x20d)]['x']<=0x0&&this['canToggleVisibility']()){if(TouchInput[_0x57994f(0x236)]()||TouchInput['isCancelled']())return $gameTemp[_0x57994f(0x21b)]();}}VisuMZ[_0x57994f(0x20a)]['Window_Selectable_processTouch'][_0x57994f(0x21e)](this);},Window_Message['VISIBILITY_TOGGLE_KEY']=VisuMZ['MessageVisibility'][_0xdfd8c5(0x22e)][_0xdfd8c5(0x241)],Window_Message[_0xdfd8c5(0x218)]=VisuMZ[_0xdfd8c5(0x20a)][_0xdfd8c5(0x22e)]['CommonEventShow'],Window_Message[_0xdfd8c5(0x1f4)]=VisuMZ['MessageVisibility'][_0xdfd8c5(0x22e)][_0xdfd8c5(0x23a)],VisuMZ['MessageVisibility'][_0xdfd8c5(0x21f)]=Window_Message[_0xdfd8c5(0x214)][_0xdfd8c5(0x236)],Window_Message[_0xdfd8c5(0x214)][_0xdfd8c5(0x236)]=function(){const _0x155a0c=_0xdfd8c5,_0x25523f=VisuMZ[_0x155a0c(0x20a)][_0x155a0c(0x21f)][_0x155a0c(0x21e)](this);if(this[_0x155a0c(0x20d)]['x']<=0x0&&_0x25523f)return this['setVisibility'](!![]),![];else return Input['isTriggered'](Window_Message[_0x155a0c(0x200)])?(this[_0x155a0c(0x231)](),![]):_0x25523f;},Window_Message[_0xdfd8c5(0x214)][_0xdfd8c5(0x231)]=function(){const _0x490252=_0xdfd8c5,_0x20843d=!(this[_0x490252(0x20d)]['x']>0x0);this[_0x490252(0x22f)](_0x20843d);},Window_Message['prototype'][_0xdfd8c5(0x22f)]=function(_0x39826e){const _0x1d21fa=_0xdfd8c5;if(!SceneManager[_0x1d21fa(0x203)]())return;SoundManager['playCancel'](),this[_0x1d21fa(0x211)](_0x39826e),this[_0x1d21fa(0x206)](_0x39826e),Input[_0x1d21fa(0x233)](),TouchInput['clear']();},Window_Message['prototype'][_0xdfd8c5(0x227)]=function(){const _0x58bbb5=_0xdfd8c5;this[_0x58bbb5(0x207)]=![];},Window_Message[_0xdfd8c5(0x214)][_0xdfd8c5(0x211)]=function(_0x2d4282){const _0x51cda5=_0xdfd8c5,_0x480302=[this,this[_0x51cda5(0x216)],this['_nameBoxWindow'],this[_0x51cda5(0x1fa)],this[_0x51cda5(0x219)],this[_0x51cda5(0x234)],this[_0x51cda5(0x1f1)]],_0x143f79=_0x2d4282?0x1:0x0;for(const _0x56355c of _0x480302){if(!_0x56355c)continue;_0x56355c['scale']['x']=_0x143f79,_0x56355c[_0x51cda5(0x20d)]['y']=_0x143f79;}},Window_Message[_0xdfd8c5(0x214)][_0xdfd8c5(0x206)]=function(_0x345978){const _0xdf331b=_0xdfd8c5;if(!Imported[_0xdf331b(0x1fd)])return;const _0x48693c=_0x345978?Window_Message[_0xdf331b(0x218)]:Window_Message[_0xdf331b(0x1f4)];$dataCommonEvents[_0x48693c]&&this[_0xdf331b(0x1f2)](_0x48693c);};