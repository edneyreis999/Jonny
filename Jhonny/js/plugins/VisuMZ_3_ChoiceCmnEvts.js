//=============================================================================
// VisuStella MZ - Choice Common Events
// VisuMZ_3_ChoiceCmnEvts.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_3_ChoiceCmnEvts = true;

var VisuMZ = VisuMZ || {};
VisuMZ.ChoiceCmnEvts = VisuMZ.ChoiceCmnEvts || {};
VisuMZ.ChoiceCmnEvts.version = 1.02;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 3] [Version 1.02] [ChoiceCmnEvts]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Choice_Common_Events_VisuStella_MZ
 * @base VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_1_MessageCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Ever wanted to have Common Events run when an option in the Choice Window is
 * selected without requiring the player to press OK? This plugin allows you,
 * the game dev, to make it so that specific choices will run Common Events in
 * the background (on the map scene) without any interruptions. Have a legion
 * of Common Events that change what picture is shown based on the selected
 * choice or make some events on the screen jump up and down whenever their
 * names are selected in the Choice Window.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Use specific text codes to determine which Common Event will run for a
 *   specific choice when selected without the need to press OK.
 * * Common Events ran this way won't interrupt the ongoing event.
 * * Can be used to create effects such as a shifting picture gallery or making
 *   events jump up and down when their name is selected.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * * VisuMZ_1_MessageCore
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 *
 * ------ Tier 3 ------
 *
 * This plugin is a Tier 3 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. 
 *
 * === Choice-Related Text Codes ===
 * 
 * ---
 *
 * -------------------------   ------------------------------------------------
 * Text Code                   Effect (Show Choice Text Only)
 * -------------------------   ------------------------------------------------
 * 
 * <Choice Common Event: id>   Makes the Common Event 'id' run when the choice
 *                             is selected (not confirmed) without having to
 *                             close the Choice Window. This only works on the
 *                             map scene.
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
 * Version 1.02: October 17, 2024
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.01: July 2, 2021
 * * Bug Fixes!
 * ** Default selected choice should now trigger upon the opening of the Choice
 *    List Window. Fix made by Arisu.
 * 
 * Version 1.00 Official Release Date: July 7, 2021
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
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x1d0b8f=_0x29b3;(function(_0x28c1f8,_0x2068f9){const _0x3b7014=_0x29b3,_0x12d2b7=_0x28c1f8();while(!![]){try{const _0x3ab889=-parseInt(_0x3b7014(0x1ce))/0x1*(parseInt(_0x3b7014(0x1b5))/0x2)+-parseInt(_0x3b7014(0x1d9))/0x3+-parseInt(_0x3b7014(0x1d1))/0x4+-parseInt(_0x3b7014(0x1d4))/0x5*(parseInt(_0x3b7014(0x1bd))/0x6)+-parseInt(_0x3b7014(0x1b0))/0x7*(-parseInt(_0x3b7014(0x1b1))/0x8)+parseInt(_0x3b7014(0x1cf))/0x9*(-parseInt(_0x3b7014(0x1c5))/0xa)+parseInt(_0x3b7014(0x1d7))/0xb;if(_0x3ab889===_0x2068f9)break;else _0x12d2b7['push'](_0x12d2b7['shift']());}catch(_0xf5bd3e){_0x12d2b7['push'](_0x12d2b7['shift']());}}}(_0x3050,0xb6756));function _0x3050(){const _0x2e150=['prototype','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','2bQSkmS','filter','STRUCT','_choiceCommonEvents','EVAL','name','ARRAYSTRUCT','map','474OUJBGZ','ARRAYNUM','_scene','_choiceCommonEventAlert','version','parse','ARRAYJSON','select','10yRQbtV','ChoiceCmnEvts','makeCommandList','Window_Selectable_select','Window_ChoiceList','format','ARRAYFUNC','ConvertParams','return\x200','1260372tpawwa','11440872ixVevx','onSelectChoiceCommonEvents','3564540CWAosF','includes','match','37540JADAFf','JSON','VisuMZ_1_MessageCore','54612030AUuFQt','exit','1288227scrYSB','STR','indexOf','Settings','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','description','parameters','status','call','trim','ARRAYSTR','_list','constructor','applyChoiceCommonEvents','Window_ChoiceList_makeCommandList','max','replace','clearChoiceCommonEvents','Choice\x20Common\x20Events\x20only\x20work\x20on\x20the\x20map\x20scene!','7jdvaex','1823008xKZouz','isSceneMap'];_0x3050=function(){return _0x2e150;};return _0x3050();}var label='ChoiceCmnEvts',tier=tier||0x0,dependencies=[_0x1d0b8f(0x1d6)],pluginData=$plugins[_0x1d0b8f(0x1b6)](function(_0x3ac056){const _0x4b4e1b=_0x1d0b8f;return _0x3ac056[_0x4b4e1b(0x1e0)]&&_0x3ac056[_0x4b4e1b(0x1de)][_0x4b4e1b(0x1d2)]('['+label+']');})[0x0];function _0x29b3(_0x2b81ee,_0x2284a7){const _0x30509f=_0x3050();return _0x29b3=function(_0x29b3e2,_0xb9be69){_0x29b3e2=_0x29b3e2-0x1a7;let _0xa44bbb=_0x30509f[_0x29b3e2];return _0xa44bbb;},_0x29b3(_0x2b81ee,_0x2284a7);}VisuMZ[label]['Settings']=VisuMZ[label][_0x1d0b8f(0x1dc)]||{},VisuMZ['ConvertParams']=function(_0x2f8d3e,_0x27204c){const _0x4d0353=_0x1d0b8f;for(const _0x56f0be in _0x27204c){if(_0x56f0be['match'](/(.*):(.*)/i)){const _0x40b9b4=String(RegExp['$1']),_0x303f53=String(RegExp['$2'])['toUpperCase']()[_0x4d0353(0x1e2)]();let _0x5aa4f1,_0x400bf9,_0x816063;switch(_0x303f53){case'NUM':_0x5aa4f1=_0x27204c[_0x56f0be]!==''?Number(_0x27204c[_0x56f0be]):0x0;break;case _0x4d0353(0x1be):_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON['parse'](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x309db8=>Number(_0x309db8));break;case _0x4d0353(0x1b9):_0x5aa4f1=_0x27204c[_0x56f0be]!==''?eval(_0x27204c[_0x56f0be]):null;break;case'ARRAYEVAL':_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON[_0x4d0353(0x1c2)](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x2af45c=>eval(_0x2af45c));break;case _0x4d0353(0x1d5):_0x5aa4f1=_0x27204c[_0x56f0be]!==''?JSON[_0x4d0353(0x1c2)](_0x27204c[_0x56f0be]):'';break;case _0x4d0353(0x1c3):_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON['parse'](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x11fcdd=>JSON[_0x4d0353(0x1c2)](_0x11fcdd));break;case'FUNC':_0x5aa4f1=_0x27204c[_0x56f0be]!==''?new Function(JSON['parse'](_0x27204c[_0x56f0be])):new Function(_0x4d0353(0x1cd));break;case _0x4d0353(0x1cb):_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON[_0x4d0353(0x1c2)](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x281a41=>new Function(JSON['parse'](_0x281a41)));break;case _0x4d0353(0x1da):_0x5aa4f1=_0x27204c[_0x56f0be]!==''?String(_0x27204c[_0x56f0be]):'';break;case _0x4d0353(0x1a7):_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON['parse'](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x45163c=>String(_0x45163c));break;case _0x4d0353(0x1b7):_0x816063=_0x27204c[_0x56f0be]!==''?JSON[_0x4d0353(0x1c2)](_0x27204c[_0x56f0be]):{},_0x5aa4f1=VisuMZ['ConvertParams']({},_0x816063);break;case _0x4d0353(0x1bb):_0x400bf9=_0x27204c[_0x56f0be]!==''?JSON[_0x4d0353(0x1c2)](_0x27204c[_0x56f0be]):[],_0x5aa4f1=_0x400bf9[_0x4d0353(0x1bc)](_0x22e2d1=>VisuMZ[_0x4d0353(0x1cc)]({},JSON[_0x4d0353(0x1c2)](_0x22e2d1)));break;default:continue;}_0x2f8d3e[_0x40b9b4]=_0x5aa4f1;}}return _0x2f8d3e;},(_0x1209c3=>{const _0x1025ca=_0x1d0b8f,_0x4cfcaa=_0x1209c3[_0x1025ca(0x1ba)];for(const _0x393037 of dependencies){if(!Imported[_0x393037]){alert(_0x1025ca(0x1b4)[_0x1025ca(0x1ca)](_0x4cfcaa,_0x393037)),SceneManager['exit']();break;}}const _0x38b694=_0x1209c3[_0x1025ca(0x1de)];if(_0x38b694[_0x1025ca(0x1d3)](/\[Version[ ](.*?)\]/i)){const _0x1b47da=Number(RegExp['$1']);_0x1b47da!==VisuMZ[label][_0x1025ca(0x1c1)]&&(alert(_0x1025ca(0x1dd)[_0x1025ca(0x1ca)](_0x4cfcaa,_0x1b47da)),SceneManager[_0x1025ca(0x1d8)]());}if(_0x38b694[_0x1025ca(0x1d3)](/\[Tier[ ](\d+)\]/i)){const _0x45b3bd=Number(RegExp['$1']);_0x45b3bd<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x1025ca(0x1ca)](_0x4cfcaa,_0x45b3bd,tier)),SceneManager['exit']()):tier=Math[_0x1025ca(0x1ac)](_0x45b3bd,tier);}VisuMZ['ConvertParams'](VisuMZ[label][_0x1025ca(0x1dc)],_0x1209c3[_0x1025ca(0x1df)]);})(pluginData),SceneManager['isSceneMap']=function(){const _0x539000=_0x1d0b8f;return this['_scene']&&this['_scene'][_0x539000(0x1a9)]===Scene_Map;},VisuMZ['ChoiceCmnEvts'][_0x1d0b8f(0x1ab)]=Window_ChoiceList[_0x1d0b8f(0x1b3)][_0x1d0b8f(0x1c7)],Window_ChoiceList['prototype'][_0x1d0b8f(0x1c7)]=function(){const _0x40c2f7=_0x1d0b8f;this['_index']=-0x1,VisuMZ[_0x40c2f7(0x1c6)][_0x40c2f7(0x1ab)][_0x40c2f7(0x1e1)](this),this[_0x40c2f7(0x1ae)](),this[_0x40c2f7(0x1aa)]();},Window_ChoiceList['prototype'][_0x1d0b8f(0x1ae)]=function(){const _0x319ab4=_0x1d0b8f;this[_0x319ab4(0x1b8)]={};},Window_ChoiceList[_0x1d0b8f(0x1b3)]['applyChoiceCommonEvents']=function(){const _0x22ba31=_0x1d0b8f,_0x3e028c=/<(?:CHOICE|SELECT) (?:COMMON EVENT|EVENT|COMMONEVENT):[ ](\d+)>/gi;for(const _0x471035 of this[_0x22ba31(0x1a8)]){if(!_0x471035)continue;if(_0x471035[_0x22ba31(0x1ba)]['match'](_0x3e028c)){const _0x5644fb=Number(RegExp['$1']),_0xeaf7d9=this[_0x22ba31(0x1a8)][_0x22ba31(0x1db)](_0x471035);this['_choiceCommonEvents'][_0xeaf7d9]=_0x5644fb,_0x471035['name']=_0x471035[_0x22ba31(0x1ba)][_0x22ba31(0x1ad)](_0x3e028c,'')[_0x22ba31(0x1e2)]();}}},VisuMZ['ChoiceCmnEvts']['Window_Selectable_select']=Window_Selectable[_0x1d0b8f(0x1b3)][_0x1d0b8f(0x1c4)],Window_Selectable[_0x1d0b8f(0x1b3)]['select']=function(_0x3fed4a){const _0x240c6b=_0x1d0b8f,_0x46c979=this['index']();VisuMZ['ChoiceCmnEvts'][_0x240c6b(0x1c8)][_0x240c6b(0x1e1)](this,_0x3fed4a),this[_0x240c6b(0x1a9)][_0x240c6b(0x1ba)]===_0x240c6b(0x1c9)&&this[_0x240c6b(0x1d0)](_0x3fed4a,_0x46c979);},Window_ChoiceList[_0x1d0b8f(0x1b3)][_0x1d0b8f(0x1d0)]=function(_0x1e1978,_0x17f867){const _0x1c0d89=_0x1d0b8f;if(_0x1e1978<0x0)return;this[_0x1c0d89(0x1b8)]===undefined&&this[_0x1c0d89(0x1ae)]();if(_0x1e1978===_0x17f867)return;const _0x4c887c=this[_0x1c0d89(0x1b8)][_0x1e1978]||0x0;if(!_0x4c887c)return;if(!this['isSceneSelectChoiceCommonEventValid']()){$gameTemp['isPlaytest']()&&!$gameTemp['_choiceCommonEventAlert']&&($gameTemp[_0x1c0d89(0x1c0)]=!![],alert(_0x1c0d89(0x1af)));return;}$gameMap&&$gameMap['addMessageCommonEvent'](_0x4c887c);},Window_ChoiceList[_0x1d0b8f(0x1b3)]['isSceneSelectChoiceCommonEventValid']=function(){const _0x2aeb82=_0x1d0b8f,_0x4a9d42=['Scene_EventedTitleMap'];return SceneManager[_0x2aeb82(0x1b2)]()||_0x4a9d42[_0x2aeb82(0x1d2)](SceneManager[_0x2aeb82(0x1bf)]['constructor'][_0x2aeb82(0x1ba)]);};