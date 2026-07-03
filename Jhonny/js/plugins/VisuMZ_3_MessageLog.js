//=============================================================================
// VisuStella MZ - Message Log
// VisuMZ_3_MessageLog.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_3_MessageLog = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MessageLog = VisuMZ.MessageLog || {};
VisuMZ.MessageLog.version = 1.08;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 3] [Version 1.08] [MessageLog]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Message_Log_VisuStella_MZ
 * @base VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_1_MessageCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Message Log plugin will take and record any Show Message entries played
 * on the map screen so that players can go back to them and review them at a
 * later point in time when needed. This is helpful for players who may have
 * missed important information that would have been displayed or those who
 * would like to review what was said previously. The Message Log will not
 * record any of the text displayed in the battle scene in order to preserve
 * the data to one specific scene.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Record messages written out in the "Show Text" command while the player is
 *   on the map screen.
 * * Players can access the Message Log through either the Main Menu or by a
 *   shortcut key whenever the Message Window is open.
 * * Faces and speaker names will also be recorded.
 * * Choice List selections, Number Inputs, and selected Event Items will also
 *   be recorded.
 * * Those using the Extended Message Functionality plugin can also bind this
 *   effect to the Button Console.
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
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Replaced Message Text Codes
 * 
 * Some text codes are not compatible with the Message Log when viewed such as
 * wait commands, showing the gold window, etc. When that happens, those text
 * codes will be removed from visibility in the Message Log in order to prevent
 * any problems. The following is a list of the Message Text Codes that will
 * not appear in the Message Log:
 * 
 *   --------------------
 *   Default RPG Maker MZ
 *   --------------------
 *   \$
 *   \.
 *   \|
 *   \!
 *   \>
 *   \<
 *   \^
 * 
 *   --------------------
 *   VisuMZ_1_MessageCore
 *   --------------------
 *   \Picture<x>
 *   \CenterPicture<x>
 *   \CommonEvent[x]
 *   \Wait[x]
 *   \NormalBG
 *   \DimBG
 *   \TransparentBG
 *   \WindowMoveTo: ?>
 *   \WindowMoveBy: ?>
 *   \WindowReset
 *   \TroopMember[x]
 *   \TroopNameMember[x]
 *   \ChangeFace<?>
 *   \FaceIndex[x]
 *   <Auto>
 *   <Auto Width>
 *   <Auto Height>
 *   <Auto Actor: x>
 *   <Auto Party: x>
 *   <Auto Enemy: x>
 *   <Auto Event: x>
 *   <Auto Player>
 *   <Show>
 *   <Show Switch: x>
 *   <Show All Switches: x,x,x>
 *   <Show Any Switches: x,x,x>
 *   <Hide>
 *   <Hide Switch: x>
 *   <Hide All Switches: x,x,x>
 *   <Hide Any Switches: x,x,x>
 *   <Enable>
 *   <Enable Switch: x>
 *   <Enable All Switches: x,x,x>
 *   <Enable Any Switches: x,x,x>
 *   <Disable>
 *   <Disable Switch: x>
 *   <Disable All Switches: x,x,x>
 *   <Disable Any Switches: x,x,x>
 *   <Position: ?>
 *   <Coordinates: ?>
 *   <Dimensions: ?>
 * 
 *   -----------------------
 *   VisuMZ_2_ExtMessageFunc
 *   -----------------------
 *   <Hide Buttons>
 * 
 *   -----------------------
 *   VisuMZ_2_PictureChoices
 *   -----------------------
 *   <Bind Picture: id>
 *   <Hide Choice Window>
 * 
 *   ----------------------
 *   VisuMZ_3_ChoiceCmnEvts
 *   ----------------------
 *   <Choice Common Event: id>
 * 
 *   -------------------
 *   VisuMZ_3_MessageLog
 *   -------------------
 *   <Bypass Message Log>
 * 
 *   ----------------------
 *   VisuMZ_3_MessageSounds
 *   ----------------------
 *   <Letter Sound On>
 *   <Letter Sound Off>
 *   \LetterSoundName<filename>
 *   \LetterSoundVolume[x]
 *   \LetterSoundPitch[x]
 *   \LetterSoundPan[x]
 *   \LetterSoundVolumeVar[x]
 *   \LetterSoundPitchVar[x]
 *   \LetterSoundPanVar[x]
 *   \LSON
 *   \LSOFF
 *   \LSN<filename>
 *   \LSV[x]
 *   \LSPI[x]
 *   \LSPA[x]
 *   \LSVV[x]
 *   \LSPIV[x]
 *   \LSPAV[x]
 * 
 *   ------------------------
 *   VisuMZ_4_EventTitleScene
 *   ------------------------
 *   <Continue>
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
 * VisuMZ_2_ExtMessageFunc
 * 
 * The Extended Message Functionality plugin enables the "Log" button found in
 * the Button Console to let the player go and review the text that has been
 * displayed in the map scene. This does not include the text found in battle
 * to avoid conflicting logged messages across different situations.
 * 
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. 
 *
 * === Log-Related Text Codes ===
 * 
 * ---
 *
 * --------------------   -----------------------------------------------------
 * Text Code              Effect
 * --------------------   -----------------------------------------------------
 * 
 * <Bypass Message Log>   Prevents the specific "Show Text" window from being
 *                        recorded into the Message Log.
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
 * === Bypass Plugin Commands ===
 * 
 * ---
 *
 * Bypass: Message Logging?
 * - Bypass message logging until turned off.
 *
 *   Bypass?:
 *   - Bypasses Message Logging until turned off.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Enable Message Log in Menu?
 * - Enables/disables Message Log menu inside the main menu.
 *
 *   Enable/Disable?:
 *   - Enables/disables Message Log menu inside the main menu.
 *
 * ---
 *
 * System: Show Message Log in Menu?
 * - Shows/hides Message Log menu inside the main menu.
 *
 *   Show/Hide?:
 *   - Shows/hides Message Log menu inside the main menu.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * General Settings for the Message Log.
 *
 * ---
 *
 * Settings
 * 
 *   Entry Limit:
 *   - How many message entries will be stored before the game will start
 *     trimming them?
 * 
 *   Shortcut Key:
 *   - This is the key used for opening the Message Log scene.
 *   - Does not work in battle!
 * 
 *   Show Faces?
 *   - Show face graphics in the Message Log?
 * 
 *   Pad Sides?
 *   - Pad the sides of the screen even without faces?
 *   - Ignore if the screen is too small.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Main Menu Settings
 * ============================================================================
 *
 * Main Menu settings for Message Log.
 *
 * ---
 *
 * Settings
 * 
 *   Command Name:
 *   - Name of the 'Message Log' option in the Main Menu.
 * 
 *   Show in Main Menu?:
 *   - Add the 'Message Log' option to the Main Menu by default?
 * 
 *   Enable in Main Menu?:
 *   - Enable the 'Message Log' option to the Main Menu by default?
 *   - This will be automatically disabled if there are no entries available.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Background Settings
 * ============================================================================
 *
 * Background settings for Scene_MessageLog.
 *
 * ---
 *
 * Settings
 * 
 *   Snapshop Opacity:
 *   - Snapshot opacity for the scene.
 * 
 *   Background 1:
 *   - Filename used for the bottom background image.
 *   - Leave empty if you don't wish to use one.
 * 
 *   Background 2:
 *   - Filename used for the upper background image.
 *   - Leave empty if you don't wish to use one.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Vocabulary Settings
 * ============================================================================
 *
 * These settings let you adjust the text displayed for this plugin.
 *
 * ---
 *
 * ExtMessageFunc
 * 
 *   Button Name:
 *   - How is this option's text displayed in-game?
 *   - Requires VisuMZ_2_ExtMessageFunc!
 *
 * ---
 *
 * Button Assist Window
 * 
 *   Slow Scroll:
 *   - Text used for slow scrolling.
 * 
 *   Fast Scroll:
 *   - Text used for fast scrolling.
 *
 * ---
 *
 * Choice Window Logging
 * 
 *   Text Format:
 *   - Text format for logging the selected choice text.
 *   - %1 - Selected Choice Text
 * 
 *   Cancel:
 *   - Text used when cancel branch is selected.
 *
 * ---
 *
 * Number Input Logging
 * 
 *   Text Format:
 *   - Text format for logging the inputted number value.
 *   - %1 - Number Value
 *
 * ---
 *
 * Event Item Logging
 * 
 *   Text Format:
 *   - Text format for logging the selected event Item.
 *   - %1 - Selected Event Item Text
 * 
 *   Name Format:
 *   - Text format for how item names are displayed.
 *   - %1 - Item Icon, %2 - Item Name
 * 
 *   No Item:
 *   - Text used when no item is selected.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * Window settings for Scene_MessageLog.
 *
 * ---
 *
 * Message Log Window
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Appearance
 * 
 *   Speaker Name X:
 *   - What X coordinate do you want the speaker name to appear at?
 *
 * ---
 *
 * Color Lock
 * 
 *   Choices:
 *   - Color lock the logged choices?
 * 
 *   Number Inputs:
 *   - Color lock the logged Number Inputs?
 * 
 *   Event Item:
 *   - Color lock the logged selected Event Item?
 *
 * ---
 *
 * Scrolling > Slow
 * 
 *   Scroll Speed:
 *   - What speed will Up/Down scroll the window at?
 *   - Lower is slower. Higher is faster.
 * 
 *   Sound Frequency:
 *   - How frequent will Up/Down scrolling make sounds?
 *   - Lower is quicker. Higher is later.
 *
 * ---
 *
 * Scrolling > Fast
 * 
 *   Scroll Speed:
 *   - What speed will PageUp/PageDn scroll the window at?
 *   - Lower is slower. Higher is faster.
 * 
 *   Sound Frequency:
 *   - How frequent will PageUp/PageDn scrolling make sounds?
 *   - Lower is quicker. Higher is later.
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
 * * Trihan
 * * Arisu
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.08: August 29, 2024
 * * Bug Fixes!
 * ** Fixed a bug that caused the replay button to not appear. Fix by Irina.
 * 
 * Version 1.07: April 18, 2024
 * * Compatibility Update!
 * ** Added extra compatibility for Voice Acting Control's version update. 
 * 
 * Version 1.06: January 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where text from battle transitions would merge into the
 *    Message Log. Fix made by Olivia.
 * 
 * Version 1.05: September 14, 2023
 * * Bug Fixes!
 * ** Fixed a bug where text macros from VisuMZ Message Core did not convert
 *    properly into the Message Log. Fix made by Irina.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina.
 * ** Plugin Parameters > General > Pad Sides?
 * *** Pad the sides of the screen even without faces?
 * *** Ignore if the screen is too small.
 * 
 * Version 1.04: March 16, 2023
 * * Compatibility Update!
 * ** Added compatibility for the recent Message Core additions.
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.03: October 7, 2021
 * * Bug Fixes!
 * ** Message Log should now work with automatic word wrap. Fix by Irina.
 * 
 * Version 1.02: September 3, 2021
 * * Bug Fixes!
 * ** Fixed a crash pertaining to specific message windows that haven't
 *    declared a speaker name from an older RPG Maker version. Fix by Irina.
 * 
 * Version 1.01: August 6, 2021
 * * Documentation Update!
 * ** Plugin URL now updated to most recent one.
 *
 * Version 1.00 Official Release Date: August 4, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command BypassMessageLogging
 * @text Bypass: Message Logging?
 * @desc Bypass message logging until turned off.
 *
 * @arg Bypass:eval
 * @text Bypass?
 * @type boolean
 * @on Bypass
 * @off Enable
 * @desc Bypasses Message Logging until turned off.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemEnableMessageLogMenu
 * @text System: Enable Message Log in Menu?
 * @desc Enables/disables Message Log menu inside the main menu.
 *
 * @arg Enable:eval
 * @text Enable/Disable?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables/disables Message Log menu inside the main menu.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemShowMessageLogMenu
 * @text System: Show Message Log in Menu?
 * @desc Shows/hides Message Log menu inside the main menu.
 *
 * @arg Show:eval
 * @text Show/Hide?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/hides Message Log menu inside the main menu.
 * @default true
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
 * @param MessageLog
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param General:struct
 * @text General Settings
 * @type struct<General>
 * @desc General Settings for the Message Log.
 * @default {"EntryLimit:num":"50","ShortcutKey:str":"pageup","ShowFaces:eval":"true"}
 *
 * @param MainMenu:struct
 * @text Main Menu Settings
 * @type struct<MainMenu>
 * @desc Main Menu settings for Message Log.
 * @default {"Name:str":"Message Log","ShowMainMenu:eval":"true","EnableMainMenu:eval":"true"}
 *
 * @param BgSettings:struct
 * @text Background Settings
 * @type struct<BgSettings>
 * @desc Background settings for Scene_MessageLog.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Vocab:struct
 * @text Vocabulary Settings
 * @type struct<Vocab>
 * @desc These settings let you adjust the text displayed for this plugin.
 * @default {"ExtMessageFunc":"","ButtonName:str":"LOG","ButtonAssist":"","SlowScroll:str":"Scroll","FastScroll:str":"Fast Scroll","ChoiceLogging":"","ChoiceFmt:str":"\\C[4]Choice >\\C[0] %1","ChoiceCancel:str":"Cancel","NumberLogging":"","NumberFmt:str":"\\C[4]Amount >\\C[0] %1","EventItemLogging":"","ItemFmt:str":"\\C[4]Choice >\\C[0] %1","ItemNameFmt:str":"%1%2","NoItem:str":"Nothing"}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc Window settings for Scene_MessageLog.
 * @default {"MessageLogWindow":"","MessageLogMenu_BgType:num":"0","MessageLogMenu_RectJS:func":"\"const wx = 0;\\nconst wy = this.mainAreaTop();\\nconst ww = Graphics.boxWidth;\\nconst wh = this.mainAreaHeight();\\n\\nreturn new Rectangle(wx, wy, ww, wh);\"","Appearance":"","SpeakerNameX:num":"128","ColorLock":"","ColorLockChoice:eval":"false","ColorLockNumber:eval":"true","ColorLockItem:eval":"true","Scrolling":"","Slow":"","SlowScrollSpeed:num":"8","SlowSoundFreq:num":"8","Fast":"","FastScrollSpeed:num":"32","FastSoundFreq:num":"4"}
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
 * @param EntryLimit:num
 * @text Entry Limit
 * @parent General
 * @type number
 * @min 1
 * @max 999
 * @desc How many message entries will be stored before the game
 * will start trimming them?
 * @default 50
 *
 * @param ShortcutKey:str
 * @text Shortcut Key
 * @parent General
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for opening the Message Log scene.
 * Does not work in battle!
 * @default pageup
 *
 * @param ShowFaces:eval
 * @text Show Faces?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show face graphics in the Message Log?
 * @default true
 *
 * @param PadSides:eval
 * @text Pad Sides?
 * @type boolean
 * @on Pad
 * @off Don't Pad
 * @desc Pad the sides of the screen even without faces?
 * Ignore if the screen is too small.
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * MainMenu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MainMenu:
 *
 * @param Name:str
 * @text Command Name
 * @parent Options
 * @desc Name of the 'Message Log' option in the Main Menu.
 * @default Message Log
 *
 * @param ShowMainMenu:eval
 * @text Show in Main Menu?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Add the 'Message Log' option to the Main Menu by default?
 * @default true
 *
 * @param EnableMainMenu:eval
 * @text Enable in Main Menu?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable the 'Message Log' option to the Main Menu by default?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BgSettings:
 *
 * @param SnapshotOpacity:num
 * @text Snapshop Opacity
 * @type number
 * @min 0
 * @max 255
 * @desc Snapshot opacity for the scene.
 * @default 192
 *
 * @param BgFilename1:str
 * @text Background 1
 * @type file
 * @dir img/titles1/
 * @require 1
 * @desc Filename used for the bottom background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 * @param BgFilename2:str
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @require 1
 * @desc Filename used for the upper background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 */
/* ----------------------------------------------------------------------------
 * Vocabulary Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Vocab:
 * 
 * @param ExtMessageFunc
 *
 * @param ButtonName:str
 * @text Button Name
 * @parent ExtMessageFunc
 * @desc How is this option's text displayed in-game?
 * Requires VisuMZ_2_ExtMessageFunc!
 * @default LOG
 *
 * @param ButtonAssist
 * @text Button Assist Window
 *
 * @param SlowScroll:str
 * @text Slow Scroll
 * @parent ButtonAssist
 * @desc Text used for slow scrolling.
 * @default Scroll
 *
 * @param FastScroll:str
 * @text Fast Scroll
 * @parent ButtonAssist
 * @desc Text used for fast scrolling.
 * @default Fast Scroll
 *
 * @param ChoiceLogging
 * @text Choice Window Logging
 *
 * @param ChoiceFmt:str
 * @text Text Format
 * @parent ChoiceLogging
 * @desc Text format for logging the selected choice text.
 * %1 - Selected Choice Text
 * @default \C[4]Choice >\C[0] %1
 *
 * @param ChoiceCancel:str
 * @text Cancel
 * @parent ChoiceLogging
 * @desc Text used when cancel branch is selected.
 * @default Cancel
 *
 * @param NumberLogging
 * @text Number Input Logging
 *
 * @param NumberFmt:str
 * @text Text Format
 * @parent NumberLogging
 * @desc Text format for logging the inputted number value.
 * %1 - Number Value
 * @default \C[4]Amount >\C[0] %1
 *
 * @param EventItemLogging
 * @text Event Item Logging
 *
 * @param ItemFmt:str
 * @text Text Format
 * @parent EventItemLogging
 * @desc Text format for logging the selected event Item.
 * %1 - Selected Event Item Text
 * @default \C[4]Choice >\C[0] %1
 *
 * @param ItemNameFmt:str
 * @text Name Format
 * @parent EventItemLogging
 * @desc Text format for how item names are displayed.
 * %1 - Item Icon, %2 - Item Name
 * @default %1%2
 *
 * @param NoItem:str
 * @text No Item
 * @parent EventItemLogging
 * @desc Text used when no item is selected.
 * @default Nothing
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 * 
 * @param MessageLogWindow
 * @text Message Log Window
 *
 * @param MessageLogMenu_BgType:num
 * @text Background Type
 * @parent MessageLogWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param MessageLogMenu_RectJS:func
 * @text JS: X, Y, W, H
 * @parent MessageLogWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this.mainAreaTop();\nconst ww = Graphics.boxWidth;\nconst wh = this.mainAreaHeight();\n\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param Appearance
 *
 * @param SpeakerNameX:num
 * @text Speaker Name X
 * @parent Appearance
 * @type number
 * @min 0
 * @desc What X coordinate do you want the speaker name to appear at?
 * @default 128
 *
 * @param ColorLock
 * @text Color Lock
 *
 * @param ColorLockChoice:eval
 * @text Choices
 * @parent ColorLock
 * @type boolean
 * @on Color Lock
 * @off Don't Color Lock
 * @desc Color lock the logged choices?
 * @default false
 *
 * @param ColorLockNumber:eval
 * @text Number Inputs
 * @parent ColorLock
 * @type boolean
 * @on Color Lock
 * @off Don't Color Lock
 * @desc Color lock the logged Number Inputs?
 * @default true
 *
 * @param ColorLockItem:eval
 * @text Event Item
 * @parent ColorLock
 * @type boolean
 * @on Color Lock
 * @off Don't Color Lock
 * @desc Color lock the logged selected Event Item?
 * @default true
 *
 * @param Scrolling
 *
 * @param Slow
 * @parent Scrolling
 *
 * @param SlowScrollSpeed:num
 * @text Scroll Speed
 * @parent Slow
 * @type number
 * @min 1
 * @desc What speed will Up/Down scroll the window at?
 * Lower is slower. Higher is faster.
 * @default 8
 *
 * @param SlowSoundFreq:num
 * @text Sound Frequency
 * @parent Slow
 * @type number
 * @min 1
 * @desc How frequent will Up/Down scrolling make sounds?
 * Lower is quicker. Higher is later.
 * @default 8
 *
 * @param Fast
 * @parent Scrolling
 *
 * @param FastScrollSpeed:num
 * @text Scroll Speed
 * @parent Fast
 * @type number
 * @min 1
 * @desc What speed will PageUp/PageDn scroll the window at?
 * Lower is slower. Higher is faster.
 * @default 32
 *
 * @param FastSoundFreq:num
 * @text Sound Frequency
 * @parent Fast
 * @type number
 * @min 1
 * @desc How frequent will PageUp/PageDn scrolling make sounds?
 * Lower is quicker. Higher is later.
 * @default 4
 *
 */
//=============================================================================

const _0x5506eb=_0x922a;(function(_0x2b1956,_0x2f2ec4){const _0x31eef=_0x922a,_0x8bf3a4=_0x2b1956();while(!![]){try{const _0x724598=parseInt(_0x31eef(0x259))/0x1*(-parseInt(_0x31eef(0x264))/0x2)+-parseInt(_0x31eef(0x20e))/0x3*(-parseInt(_0x31eef(0x225))/0x4)+-parseInt(_0x31eef(0x244))/0x5*(-parseInt(_0x31eef(0x1d2))/0x6)+-parseInt(_0x31eef(0x2d9))/0x7*(-parseInt(_0x31eef(0x26e))/0x8)+-parseInt(_0x31eef(0x2b7))/0x9*(-parseInt(_0x31eef(0x1d7))/0xa)+-parseInt(_0x31eef(0x1e4))/0xb+-parseInt(_0x31eef(0x27d))/0xc;if(_0x724598===_0x2f2ec4)break;else _0x8bf3a4['push'](_0x8bf3a4['shift']());}catch(_0x3d61a0){_0x8bf3a4['push'](_0x8bf3a4['shift']());}}}(_0x16b3,0xe8479));var label=_0x5506eb(0x26f),tier=tier||0x0,dependencies=[],pluginData=$plugins['filter'](function(_0x528fa5){const _0x14c4af=_0x5506eb;return _0x528fa5[_0x14c4af(0x1d8)]&&_0x528fa5[_0x14c4af(0x213)][_0x14c4af(0x2c2)]('['+label+']');})[0x0];VisuMZ[label][_0x5506eb(0x1f0)]=VisuMZ[label]['Settings']||{},VisuMZ[_0x5506eb(0x2ca)]=function(_0x10bf91,_0x1b8f9a){const _0x255a66=_0x5506eb;for(const _0x20d9fa in _0x1b8f9a){if(_0x20d9fa[_0x255a66(0x27f)](/(.*):(.*)/i)){const _0x440c70=String(RegExp['$1']),_0x17c9fa=String(RegExp['$2'])[_0x255a66(0x1df)]()[_0x255a66(0x2a3)]();let _0x5a248a,_0x33fc4b,_0x3d879d;switch(_0x17c9fa){case _0x255a66(0x1d6):_0x5a248a=_0x1b8f9a[_0x20d9fa]!==''?Number(_0x1b8f9a[_0x20d9fa]):0x0;break;case _0x255a66(0x1cb):_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x14c19b=>Number(_0x14c19b));break;case _0x255a66(0x2bd):_0x5a248a=_0x1b8f9a[_0x20d9fa]!==''?eval(_0x1b8f9a[_0x20d9fa]):null;break;case _0x255a66(0x29a):_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x2f98fb=>eval(_0x2f98fb));break;case _0x255a66(0x1cf):_0x5a248a=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):'';break;case _0x255a66(0x2b2):_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON['parse'](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x5c374f=>JSON['parse'](_0x5c374f));break;case _0x255a66(0x2b5):_0x5a248a=_0x1b8f9a[_0x20d9fa]!==''?new Function(JSON['parse'](_0x1b8f9a[_0x20d9fa])):new Function(_0x255a66(0x2aa));break;case _0x255a66(0x218):_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON['parse'](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x53eb79=>new Function(JSON[_0x255a66(0x235)](_0x53eb79)));break;case _0x255a66(0x1c9):_0x5a248a=_0x1b8f9a[_0x20d9fa]!==''?String(_0x1b8f9a[_0x20d9fa]):'';break;case _0x255a66(0x2ad):_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x1decc9=>String(_0x1decc9));break;case _0x255a66(0x24d):_0x3d879d=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):{},_0x5a248a=VisuMZ[_0x255a66(0x2ca)]({},_0x3d879d);break;case'ARRAYSTRUCT':_0x33fc4b=_0x1b8f9a[_0x20d9fa]!==''?JSON[_0x255a66(0x235)](_0x1b8f9a[_0x20d9fa]):[],_0x5a248a=_0x33fc4b[_0x255a66(0x23f)](_0x54156e=>VisuMZ[_0x255a66(0x2ca)]({},JSON['parse'](_0x54156e)));break;default:continue;}_0x10bf91[_0x440c70]=_0x5a248a;}}return _0x10bf91;},(_0x1bc89a=>{const _0x4b716e=_0x5506eb,_0xf64a1d=_0x1bc89a[_0x4b716e(0x2a8)];for(const _0x4c3e0a of dependencies){if(!Imported[_0x4c3e0a]){alert(_0x4b716e(0x1f6)[_0x4b716e(0x29f)](_0xf64a1d,_0x4c3e0a)),SceneManager[_0x4b716e(0x2dc)]();break;}}const _0x154bbe=_0x1bc89a[_0x4b716e(0x213)];if(_0x154bbe[_0x4b716e(0x27f)](/\[Version[ ](.*?)\]/i)){const _0x2c4060=Number(RegExp['$1']);_0x2c4060!==VisuMZ[label]['version']&&(alert(_0x4b716e(0x243)[_0x4b716e(0x29f)](_0xf64a1d,_0x2c4060)),SceneManager[_0x4b716e(0x2dc)]());}if(_0x154bbe['match'](/\[Tier[ ](\d+)\]/i)){const _0x51234c=Number(RegExp['$1']);_0x51234c<tier?(alert(_0x4b716e(0x1d1)['format'](_0xf64a1d,_0x51234c,tier)),SceneManager['exit']()):tier=Math[_0x4b716e(0x23b)](_0x51234c,tier);}VisuMZ[_0x4b716e(0x2ca)](VisuMZ[label]['Settings'],_0x1bc89a['parameters']);})(pluginData),PluginManager[_0x5506eb(0x2a1)](pluginData[_0x5506eb(0x2a8)],'BypassMessageLogging',_0x518b0a=>{const _0x2a39c3=_0x5506eb;VisuMZ[_0x2a39c3(0x2ca)](_0x518b0a,_0x518b0a),$gameSystem['setBypassMessageLogging'](_0x518b0a[_0x2a39c3(0x200)]);}),PluginManager['registerCommand'](pluginData[_0x5506eb(0x2a8)],'SystemEnableMessageLogMenu',_0x3bb466=>{const _0x1dc56f=_0x5506eb;VisuMZ['ConvertParams'](_0x3bb466,_0x3bb466),$gameSystem[_0x1dc56f(0x1cd)](_0x3bb466['Enable']);}),PluginManager[_0x5506eb(0x2a1)](pluginData[_0x5506eb(0x2a8)],_0x5506eb(0x285),_0x3b1f29=>{const _0x40211e=_0x5506eb;VisuMZ['ConvertParams'](_0x3b1f29,_0x3b1f29),$gameSystem[_0x40211e(0x298)](_0x3b1f29[_0x40211e(0x293)]);}),TextManager[_0x5506eb(0x1ff)]=VisuMZ[_0x5506eb(0x26f)]['Settings'][_0x5506eb(0x21c)]['Name'],TextManager[_0x5506eb(0x214)]=VisuMZ['MessageLog'][_0x5506eb(0x1f0)][_0x5506eb(0x240)][_0x5506eb(0x26c)],TextManager[_0x5506eb(0x245)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x240)][_0x5506eb(0x223)],TextManager[_0x5506eb(0x2e1)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Vocab'][_0x5506eb(0x2c8)],TextManager['MessageLogChoiceListFmt']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Vocab'][_0x5506eb(0x207)],TextManager[_0x5506eb(0x1ea)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Vocab'][_0x5506eb(0x2a6)],TextManager[_0x5506eb(0x22d)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x240)]['NumberFmt'],TextManager[_0x5506eb(0x2b9)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x240)][_0x5506eb(0x1e2)],TextManager['MessageLogItemNameFmt']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x240)][_0x5506eb(0x22f)],TextManager[_0x5506eb(0x262)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x240)]['NoItem'];TextManager[_0x5506eb(0x238)]&&(VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x2d0)]=TextManager[_0x5506eb(0x238)],TextManager['msgButtonConsole']=function(_0x544506){const _0x52b208=_0x5506eb;if([_0x52b208(0x263),_0x52b208(0x234)]['includes'](_0x544506))return TextManager[_0x52b208(0x214)];return VisuMZ[_0x52b208(0x26f)]['TextManager_msgButtonConsole']['call'](this,_0x544506);});;SceneManager[_0x5506eb(0x20c)]=function(){const _0xda2a0f=_0x5506eb;return this[_0xda2a0f(0x2ae)]&&this[_0xda2a0f(0x2ae)][_0xda2a0f(0x202)]===Scene_Map;},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x28b)]=SceneManager[_0x5506eb(0x2e8)],SceneManager[_0x5506eb(0x2e8)]=function(_0x161163){const _0x4fb24c=_0x5506eb;_0x161163===Scene_MessageLog&&this[_0x4fb24c(0x1ec)](),VisuMZ[_0x4fb24c(0x26f)][_0x4fb24c(0x28b)][_0x4fb24c(0x260)](this,_0x161163);},SceneManager[_0x5506eb(0x1ec)]=function(){const _0x45b954=_0x5506eb,_0x404ddc=$gameSystem[_0x45b954(0x1e3)]();for(const _0x3ffe1d of _0x404ddc){if(!_0x3ffe1d)continue;const _0x168583=_0x3ffe1d[_0x45b954(0x1e6)];_0x168583!==''&&ImageManager[_0x45b954(0x1f1)](_0x168583);}},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x2c4)]=Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x282)],Game_System['prototype'][_0x5506eb(0x282)]=function(){const _0x14553c=_0x5506eb;VisuMZ[_0x14553c(0x26f)][_0x14553c(0x2c4)][_0x14553c(0x260)](this),this[_0x14553c(0x1da)](),this[_0x14553c(0x1dd)]();},Game_System['prototype']['initMessageLogMainMenu']=function(){const _0x271070=_0x5506eb;this[_0x271070(0x29c)]={'shown':VisuMZ[_0x271070(0x26f)][_0x271070(0x1f0)][_0x271070(0x21c)][_0x271070(0x20d)],'enabled':VisuMZ[_0x271070(0x26f)]['Settings']['MainMenu'][_0x271070(0x267)]},this[_0x271070(0x286)]=![];},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x23e)]=function(){const _0x3a144b=_0x5506eb;if(this[_0x3a144b(0x29c)]===undefined)this[_0x3a144b(0x1da)]();return this[_0x3a144b(0x29c)][_0x3a144b(0x26d)];},Game_System[_0x5506eb(0x1f5)]['setMainMenuMessageLogVisible']=function(_0x4dd411){const _0x41dbf7=_0x5506eb;if(this[_0x41dbf7(0x29c)]===undefined)this[_0x41dbf7(0x1da)]();this[_0x41dbf7(0x29c)]['shown']=_0x4dd411;},Game_System[_0x5506eb(0x1f5)]['isMainMenuMessageLogEnabled']=function(){const _0x59db8c=_0x5506eb;if(this[_0x59db8c(0x29c)]===undefined)this['initMessageLogMainMenu']();if(this[_0x59db8c(0x1e3)]()[_0x59db8c(0x237)]<=0x0)return![];return this['_MessageLog_MainMenu']['enabled'];},Game_System[_0x5506eb(0x1f5)]['setMainMenuMessageLogEnabled']=function(_0x5224a0){const _0x543c5d=_0x5506eb;if(this[_0x543c5d(0x29c)]===undefined)this['initMessageLogMainMenu']();this[_0x543c5d(0x29c)][_0x543c5d(0x239)]=_0x5224a0;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x2b8)]=function(){const _0x578230=_0x5506eb;if(this[_0x578230(0x286)]===undefined)this[_0x578230(0x1da)]();return this[_0x578230(0x286)];},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x257)]=function(_0x142702){const _0x476dfd=_0x5506eb;if(this[_0x476dfd(0x286)]===undefined)this[_0x476dfd(0x1da)]();this[_0x476dfd(0x286)]=_0x142702;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x1dd)]=function(){const _0x32f018=_0x5506eb;this[_0x32f018(0x283)]=[],this['createNewLoggedMessageEntry']();},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x1e3)]=function(){const _0x381441=_0x5506eb;return this[_0x381441(0x283)]===undefined&&this[_0x381441(0x1dd)](),this[_0x381441(0x283)];},Game_System['prototype'][_0x5506eb(0x2d4)]=function(){const _0x393493=_0x5506eb;this[_0x393493(0x278)]={'speaker':'','faceName':'','faceIndex':0x0,'messageBody':''};},Game_System['prototype'][_0x5506eb(0x29e)]=function(){const _0x3674ca=_0x5506eb,_0x28ee04=this[_0x3674ca(0x1e3)](),_0x1a764c=this[_0x3674ca(0x2c7)]();if(this[_0x3674ca(0x2b8)]())return;_0x1a764c[_0x3674ca(0x20f)]=_0x1a764c['messageBody']||'';if(_0x1a764c[_0x3674ca(0x20f)]['match'](/<BYPASS MESSAGE LOG>/i))return;if(_0x1a764c[_0x3674ca(0x20f)][_0x3674ca(0x2a3)]()[_0x3674ca(0x237)]<=0x0)return;const _0x4c6061=_0x28ee04[_0x28ee04[_0x3674ca(0x237)]-0x1];if(JSON[_0x3674ca(0x1e5)](_0x1a764c)===JSON['stringify'](_0x4c6061))return;_0x28ee04[_0x3674ca(0x2e8)](_0x1a764c);while(_0x28ee04[_0x3674ca(0x237)]>Window_MessageLog[_0x3674ca(0x242)]){_0x28ee04['shift']();}},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x2c7)]=function(){const _0xa062de=_0x5506eb;return this[_0xa062de(0x278)]===undefined&&this[_0xa062de(0x2d4)](),this[_0xa062de(0x278)];},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x290)]=function(_0x398ddc){const _0x33320c=_0x5506eb;if($gameParty[_0x33320c(0x25c)]()&&!$gameSystem['_addTextToMessageLog'])return;const _0x27c232=this[_0x33320c(0x2c7)]();this[_0x33320c(0x270)]()&&(_0x398ddc='<WORDWRAP>'+_0x398ddc);_0x398ddc=this[_0x33320c(0x227)](_0x398ddc);Imported[_0x33320c(0x275)]&&(_0x398ddc=this['convertVoiceActControlLines'](_0x398ddc,_0x27c232));if(_0x27c232[_0x33320c(0x20f)][_0x33320c(0x237)]>0x0)_0x27c232[_0x33320c(0x20f)]+='\x0a';_0x27c232[_0x33320c(0x20f)]+=_0x398ddc;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x227)]=function(_0x5ee65c){const _0x3a4ed8=_0x5506eb;return _0x5ee65c=this[_0x3a4ed8(0x26b)](_0x5ee65c),_0x5ee65c=this[_0x3a4ed8(0x21a)](_0x5ee65c),_0x5ee65c=this[_0x3a4ed8(0x2a0)](_0x5ee65c),_0x5ee65c=this[_0x3a4ed8(0x1ce)](_0x5ee65c),_0x5ee65c=this[_0x3a4ed8(0x21a)](_0x5ee65c),_0x5ee65c;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x26b)]=function(_0x288d08){const _0x1d4273=_0x5506eb;for(const _0x3b9ab9 of VisuMZ[_0x1d4273(0x1f9)][_0x1d4273(0x1f0)]['TextMacros']){_0x288d08[_0x1d4273(0x27f)](_0x3b9ab9[_0x1d4273(0x2e9)])&&(this[_0x1d4273(0x250)]=!![],_0x288d08=_0x288d08[_0x1d4273(0x2cb)](_0x3b9ab9[_0x1d4273(0x2e9)],_0x3b9ab9['textCodeResult'][_0x1d4273(0x2ba)](this)));}return _0x288d08;},Game_System['prototype'][_0x5506eb(0x21a)]=function(_0x2f3b89){const _0x36f3ac=_0x5506eb;while(_0x2f3b89[_0x36f3ac(0x27f)](/\\V\[(\d+)\]/gi)){_0x2f3b89=_0x2f3b89[_0x36f3ac(0x2cb)](/\\V\[(\d+)\]/gi,(_0x3d7815,_0x425da4)=>$gameVariables[_0x36f3ac(0x236)](parseInt(_0x425da4)));}return _0x2f3b89;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x2a0)]=function(_0x5c6ba3){const _0x5052b0=_0x5506eb,_0x4b7ee1=this[_0x5052b0(0x2c7)]();return _0x5c6ba3=_0x5c6ba3[_0x5052b0(0x2cb)](/\\ItemQuantity\[(\d+)\]/gi,(_0x433a32,_0x114457)=>$gameParty['numItems']($dataItems[Number(_0x114457)])||0x0),_0x5c6ba3=_0x5c6ba3[_0x5052b0(0x2cb)](/\\WeaponQuantity\[(\d+)\]/gi,(_0x1b4010,_0x8e6f78)=>$gameParty['numItems']($dataWeapons[Number(_0x8e6f78)])||0x0),_0x5c6ba3=_0x5c6ba3['replace'](/\\ArmorQuantity\[(\d+)\]/gi,(_0x406a30,_0x1037b0)=>$gameParty['numItems']($dataArmors[Number(_0x1037b0)])||0x0),_0x5c6ba3=_0x5c6ba3[_0x5052b0(0x2cb)](/\\ArmorQuantity\[(\d+)\]/gi,(_0x15f624,_0x27694e)=>$gameParty[_0x5052b0(0x2a7)]($dataArmors[Number(_0x27694e)])||0x0),_0x5c6ba3=_0x5c6ba3['replace'](/\\LastGainObjQuantity/gi,Window_Base[_0x5052b0(0x1f5)][_0x5052b0(0x2c0)]()),_0x5c6ba3=_0x5c6ba3['replace'](/\\LastGainObjName/gi,Window_Base[_0x5052b0(0x1f5)][_0x5052b0(0x2e0)](![])),_0x5c6ba3=_0x5c6ba3['replace'](/\\LastGainObj/gi,Window_Base[_0x5052b0(0x1f5)][_0x5052b0(0x2e0)](!![])),_0x5c6ba3=_0x5c6ba3[_0x5052b0(0x2cb)](/\\ActorFace\[(\d+)\]/gi,(_0x393ba6,_0x41efaf)=>{const _0x8d3cf1=_0x5052b0,_0x5cd709=$gameActors[_0x8d3cf1(0x2b3)](Number(_0x41efaf));return _0x5cd709&&(_0x4b7ee1[_0x8d3cf1(0x1e6)]=_0x5cd709[_0x8d3cf1(0x1e6)](),_0x4b7ee1[_0x8d3cf1(0x2e6)]=_0x5cd709[_0x8d3cf1(0x2e6)]()),'';}),_0x5c6ba3=_0x5c6ba3[_0x5052b0(0x2cb)](/\\PartyFace\[(\d+)\]/gi,(_0x17a21d,_0x350ed5)=>{const _0x307959=_0x5052b0,_0x401851=$gameParty[_0x307959(0x249)]()[Number(_0x350ed5)-0x1];return _0x401851&&(_0x4b7ee1['faceName']=_0x401851['faceName'](),_0x4b7ee1[_0x307959(0x2e6)]=_0x401851[_0x307959(0x2e6)]()),'';}),_0x5c6ba3;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x1ce)]=function(_0x48971d){const _0x1da150=_0x5506eb;_0x48971d=_0x48971d['replace'](/\x1b/gi,'\x5c');const _0x408a2e=this[_0x1da150(0x271)]();for(const _0x9be97 of _0x408a2e){_0x48971d=_0x48971d[_0x1da150(0x2cb)](_0x9be97,'');}return _0x48971d;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x271)]=function(){const _0x333d0a=_0x5506eb;let _0x56c701=[];return _0x56c701[_0x333d0a(0x2e8)](/\\$/gi,/\\\./gi,/\\\|/gi,/\\\!/gi),_0x56c701[_0x333d0a(0x2e8)](/\\>/gi,/\\</gi,/\\\^/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:Picture|CenterPicture)<(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/\\COMMONEVENT\[(\d+)\]>/gi,/\\WAIT\[(\d+)\]/gi),_0x56c701['push'](/<(?:AUTO|AUTOSIZE|AUTO SIZE)>/gi,/<(?:AUTOWIDTH|AUTO WIDTH)>/gi,/<(?:AUTOHEIGHT|AUTO HEIGHT)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<(?:AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi,/<(?:AUTOPARTY|AUTO PARTY):[ ](.*?)>/gi,/<(?:AUTOENEMY|AUTO ENEMY):[ ](.*?)>/gi),_0x56c701['push'](/<(?:AUTOPLAYER|AUTO PLAYER)>/gi,/<(?:AUTOEVENT|AUTO EVENT):[ ](.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<SHOW>/gi,/<SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<HIDE>/gi,/<HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<ENABLE>/gi,/<ENABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<ENABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<ENABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<DISABLE>/gi,/<DISABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<DISABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi,/<DISABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(.*?)>/gi),_0x56c701['push'](/\\NormalBG/gi,/\\DimBG/gi,/\\TransparentBG/gi),_0x56c701[_0x333d0a(0x2e8)](/<POSITION:[ ]*(.*?)>/gi,/<COORDINATES:[ ]*(.*?)>/gi,/<DIMENSIONS:[ ]*(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:WindowMoveTo|WindowMoveBy):[ ]*(.*?)/gi,/\\WindowReset/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:TroopMember|TroopNameMember)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\ChangeFace<(.*?)>/gi,/\\FaceIndex\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/<(?:BGCOLOR|BG COLOR):[ ](.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<OFFSET:[ ]*(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<(?:HELP|HELP DESCRIPTION|DESCRIPTION)>\s*([\s\S]*)\s*<\/(?:HELP|HELP DESCRIPTION|DESCRIPTION)>/i),_0x56c701[_0x333d0a(0x2e8)](/<ENABLE IF CAN CREATE CHARACTER>/gi),_0x56c701[_0x333d0a(0x2e8)](/<ENABLE IF CAN DISMISS CHARACTERS>/gi),_0x56c701[_0x333d0a(0x2e8)](/<ENABLE IF CAN RETRAIN CHARACTERS>/gi),_0x56c701['push'](/<ENABLE IF HAVE CREATED CHARACTERS>/gi),_0x56c701[_0x333d0a(0x2e8)](/<HIDE (?:BUTTON CONSOLE|CONSOLE|BUTTONS)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<HIDE CHOICE WINDOW>/gi,/<BIND (?:PICTURE|PICTURES):[ ](\d+)>/gi),_0x56c701[_0x333d0a(0x2e8)](/<(?:CHOICE|SELECT) (?:COMMON EVENT|EVENT|COMMONEVENT):[ ](\d+)>/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LSON|LSOFF|LETTER SOUND ON|LETTERSOUNDON|LETTER SOUND OFF|LETTERSOUNDOFF)/gi),_0x56c701['push'](/\\(?:LETTERSOUNDNAME|LSN)<(.*?)>/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDINTERVAL|LSI)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDVOLUME|LSV)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDPITCH|LSPI)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDPAN|LSPA)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDVOLUMEVARIANCE|LETTERSOUNDVOLUMEVAR|LSVV)\[(\d+)\]/gi),_0x56c701['push'](/\\(?:LETTERSOUNDPITCHVARIANCE|LETTERSOUNDPITCHVAR|LSPIV)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/\\(?:LETTERSOUNDPANVARIANCE|LETTERSOUNDPANVAR|LSPAV)\[(\d+)\]/gi),_0x56c701[_0x333d0a(0x2e8)](/<CONTINUE>/gi),_0x56c701;},Game_System[_0x5506eb(0x1f5)]['convertVoiceActControlLines']=function(_0x2eaffe,_0x4dbcf3){const _0x2262ac=_0x5506eb,_0x460391=VisuMZ['VoiceActControl'][_0x2262ac(0x1e0)];return _0x2eaffe=_0x2eaffe['replace'](_0x460391[_0x2262ac(0x2b6)],(_0x3a2a61,_0xe7c25f)=>{const _0x11e5e9=_0x2262ac;_0xe7c25f=_0xe7c25f[_0x11e5e9(0x2cb)](/\x1bWrapBreak\[0\]/gi,'\x20');const _0x30ae62=_0xe7c25f['split'](',')['map'](_0x2e5eab=>_0x2e5eab['trim']()),_0x1a04ff={'name':String(_0x30ae62[0x0]??''),'volume':Number(_0x30ae62[0x1]??0x64)[_0x11e5e9(0x2d3)](0x0,0x64),'pitch':Number(_0x30ae62[0x2]??0x64)['clamp'](0x0,0x64),'pan':Number(_0x30ae62[0x3]??0x0)[_0x11e5e9(0x2d3)](-0x64,0x64)};return _0x4dbcf3['replayVoiceSound']=_0x1a04ff,'';}),_0x2eaffe=_0x2eaffe['replace'](_0x460391['MsgNoReplay'],''),_0x2eaffe;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x2e5)]=function(_0x377e99){const _0x3bd7ee=_0x5506eb,_0x4e9aa7=this[_0x3bd7ee(0x2c7)]();_0x377e99=this[_0x3bd7ee(0x201)](_0x377e99),_0x377e99=this[_0x3bd7ee(0x227)](_0x377e99),_0x4e9aa7['speaker']=_0x377e99||'';},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x201)]=function(_0x51d9c9){const _0x4e8e15=_0x5506eb;if(!_0x51d9c9)return'';const _0x415582=[/<LEFT>/gi,/<CENTER>/gi,/<RIGHT>/gi,/<\/LEFT>/gi,/<\/CENTER>/gi,/<\/RIGHT>/gi,/<POSITION:[ ](\d+)>/gi];for(const _0x11eccc of _0x415582){_0x51d9c9=_0x51d9c9[_0x4e8e15(0x2cb)](_0x11eccc,'');}return _0x51d9c9;},Game_System[_0x5506eb(0x1f5)][_0x5506eb(0x1cc)]=function(_0x83aef7,_0x182241){const _0xe0ef44=_0x5506eb,_0x392706=this[_0xe0ef44(0x2c7)]();_0x392706[_0xe0ef44(0x1e6)]=_0x83aef7||'',_0x392706[_0xe0ef44(0x2e6)]=_0x182241||0x0;},VisuMZ['MessageLog'][_0x5506eb(0x220)]=Game_Message[_0x5506eb(0x1f5)]['add'],Game_Message['prototype']['add']=function(_0x5afd30){const _0x5eebfe=_0x5506eb;VisuMZ['MessageLog'][_0x5eebfe(0x220)][_0x5eebfe(0x260)](this,_0x5afd30),$gameSystem[_0x5eebfe(0x290)](_0x5afd30);},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x212)]=Game_Message['prototype']['setSpeakerName'],Game_Message[_0x5506eb(0x1f5)][_0x5506eb(0x27a)]=function(_0x179d4f){const _0x12d39b=_0x5506eb;VisuMZ[_0x12d39b(0x26f)]['Game_Message_setSpeakerName'][_0x12d39b(0x260)](this,_0x179d4f),$gameSystem[_0x12d39b(0x2e5)](_0x179d4f);},VisuMZ['MessageLog']['Game_Message_setFaceImage']=Game_Message[_0x5506eb(0x1f5)][_0x5506eb(0x2c3)],Game_Message[_0x5506eb(0x1f5)][_0x5506eb(0x2c3)]=function(_0x47a973,_0x291ab9){const _0x47c029=_0x5506eb;VisuMZ[_0x47c029(0x26f)][_0x47c029(0x21e)][_0x47c029(0x260)](this,_0x47a973,_0x291ab9),$gameSystem[_0x47c029(0x1cc)](_0x47a973,_0x291ab9);},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x206)]=Game_Interpreter[_0x5506eb(0x1f5)][_0x5506eb(0x28f)],Game_Interpreter[_0x5506eb(0x1f5)][_0x5506eb(0x28f)]=function(_0x5ecc75){const _0xa80414=_0x5506eb;$gameSystem['createNewLoggedMessageEntry'](),$gameSystem[_0xa80414(0x281)]=!![];let _0x3936af=VisuMZ[_0xa80414(0x26f)][_0xa80414(0x206)][_0xa80414(0x260)](this,_0x5ecc75);return $gameSystem[_0xa80414(0x29e)](),$gameSystem[_0xa80414(0x281)]=![],_0x3936af;},VisuMZ[_0x5506eb(0x26f)]['BattleManager_setup']=BattleManager['setup'],BattleManager[_0x5506eb(0x21d)]=function(_0x4bf6cf,_0xf79ef,_0x1efb56){const _0x24ba8f=_0x5506eb;$gameSystem['createNewLoggedMessageEntry'](),VisuMZ[_0x24ba8f(0x26f)][_0x24ba8f(0x27b)][_0x24ba8f(0x260)](this,_0x4bf6cf,_0xf79ef,_0x1efb56);},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x266)]=Scene_Menu[_0x5506eb(0x1f5)][_0x5506eb(0x1fb)],Scene_Menu[_0x5506eb(0x1f5)][_0x5506eb(0x1fb)]=function(){const _0x3b3d29=_0x5506eb;VisuMZ[_0x3b3d29(0x26f)][_0x3b3d29(0x266)][_0x3b3d29(0x260)](this);const _0x2d3d59=this[_0x3b3d29(0x1db)];_0x2d3d59[_0x3b3d29(0x2c5)](_0x3b3d29(0x27c),this[_0x3b3d29(0x1d0)][_0x3b3d29(0x2ba)](this));},Scene_Menu[_0x5506eb(0x1f5)][_0x5506eb(0x1d0)]=function(){const _0x4dd61d=_0x5506eb;SceneManager[_0x4dd61d(0x2e8)](Scene_MessageLog);};function _0x16b3(){const _0x4a529c=['EntryLimit','messageLogWindowRect','SlowScroll','COLOR_LOCK_NUMBER','4eyVpWc','Window_ChoiceList_callCancelHandler','convertMessageLogTextCodes','buttonAssistKey3','canCallMessageLog','scrollToTop','COLOR_LOCK_CHOICE','centerSprite','MessageLogNumberInputFmt','MessageLogMenu_BgType','ItemNameFmt','width','choices','setScrollAccel','setXyPosition','log','parse','value','length','msgButtonConsole','enabled','PadSides','max','faceWidth','drawTextEx','isMainMenuMessageLogVisible','map','Vocab','Window_EventItem_onOk','ENTRY_LIMIT','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','245wiiQaT','MessageLogScroll','_lineY','resetFontSettings','FAST_SCROLL_SPEED','members','isMainMenuMessageLogEnabled','<ColorLock>%1</ColorLock>','MessageLogChoiceListFmt','STRUCT','faceHeight','createContents','_textMacroFound','buttonAssistKey1','choiceCancelType','loadTitle1','SnapshotOpacity','BgFilename2','SLOW_SOUND_FREQUENCY','setBypassMessageLogging','addMessageLogCommand','43xBmtmD','addMessageLogCommandAutomatically','mainAreaTop','inBattle','_allowVoiceReplay','cancel','remove','call','innerWidth','MessageLogItemNothing','backlog','1658SlyvJv','drawAllText','Scene_Menu_createCommandWindow','EnableMainMenu','addInnerChild','end','ShowFaces','convertMessageLogTextMacros','ButtonName','shown','2166536JjfvDQ','MessageLog','isMessageWindowWordWrap','getRemovedMessageLogTextCodes','_backSprite2','addLoadListener','isMessageLogCommandEnabled','VisuMZ_2_VoiceActControl','COLOR_LOCK_ITEM','HORZ_LINE_THICKNESS','_newMessageLogEntry','isTriggered','setSpeakerName','BattleManager_setup','messageLog','9507096qzpBTC','processAllText','match','createCustomBackgroundImages','_addTextToMessageLog','initialize','_loggedMessages','changeTextColor','SystemShowMessageLogMenu','_MessageLog_Bypass','addMessageLogEntry','pageup','ColorLockNumber','removeAllReplayVoiceSprites','SceneManager_push','Window','refresh','BgFilename1','command101','addTextToMessageLog','VisuMZ_1_MainMenuCore','SHORTCUT_KEY','Show','playOkSound','drawing','createMessageLogWindow','clearNameColor','setMainMenuMessageLogVisible','addWindow','ARRAYEVAL','innerHeight','_MessageLog_MainMenu','drawHorzLine','addNewLoggedMessageEntry','format','convertMessageLogTextReplacement','registerCommand','SlowScrollSpeed','trim','onOk','Window_NumberInput_processOk','ChoiceCancel','numItems','name','mainAreaHeight','return\x200','currentExt','FastSoundFreq','ARRAYSTR','_scene','bitmap','Window_MenuCommand_addOriginalCommands','replayVoiceSound','ARRAYJSON','actor','PAD_SIDES','FUNC','MsgVoiceSfx','575235ZntyJQ','isBypassMessageLogging','MessageLogEventItemFmt','bind','resetWordWrap','_clientArea','EVAL','General','processFastScroll','lastGainedObjectQuantity','_forcedNameColor','includes','setFaceImage','Game_System_initialize','setHandler','iconIndex','getLatestMessageLogEntry','FastScroll','outputHeight','ConvertParams','replace','boxWidth','drawRect','MessageLogItemNameFmt','isMessageLogCommandVisible','TextManager_msgButtonConsole','_innerChildren','pagedown','clamp','createNewLoggedMessageEntry','addCommand','getBackgroundOpacity','_backSprite1','_isHotKeyPressed','14GsZgoP','processCursorMove','callCancelHandler','exit','textColor','playCursorSound','preConvertEscapeCharacters','lastGainedObjectName','MessageLogFastScroll','addChild','processSlowScroll','Window_ChoiceList_callOkHandler','setSpeakerToMessageLog','faceIndex','calculateTextHeight','push','textCodeCheck','create','STR','\x5cI[%1]','ARRAYNUM','setFaceToMessageLog','setMainMenuMessageLogEnabled','convertMessageLogTextRemoval','JSON','commandMessageLog','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','201714JnzMUH','buttonAssistKey4','adjustSprite','SLOW_SCROLL_SPEED','NUM','50NDuVeA','status','ColorLockItem','initMessageLogMainMenu','_commandWindow','height','initMessageLogSettings','SHOW_FACES','toUpperCase','RegExp','lineHeight','ItemFmt','getLoggedMessages','19581749oOONEn','stringify','faceName','_messageLogWindow','activate','forceNameColor','MessageLogChoiceCancel','resetTextColor','prepareMessageLogFaces','Window_Message_isTriggered','down','scrollToBottom','Settings','loadFace','SlowSoundFreq','createBackground','isPressed','prototype','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','helpAreaHeight','ColorLockChoice','MessageCore','origin','createCommandWindow','frameCount','onCancel','SCENE_MAP_ONLY','MessageLogMenuCommand','Bypass','convertMessageLogNameRemoval','constructor','SpeakerNameX','_replayVoiceSprites','NameBoxWindowDefaultColor','Game_Interpreter_command101','ChoiceFmt','speaker','processOk','callOkHandler','buttonAssistText3','isSceneMap','ShowMainMenu','3152823KZvJPa','messageBody','callMessageLog','_allTextHeight','Game_Message_setSpeakerName','description','MessageLogButtonName','drawMessageText','getInputMultiButtonStrings','textSizeEx','ARRAYFUNC','Window_Base_preConvertEscapeCharacters','convertMessageLogVariableTextCodes','item','MainMenu','setup','Game_Message_setFaceImage','iconWidth','Game_Message_add'];_0x16b3=function(){return _0x4a529c;};return _0x16b3();}function _0x922a(_0xdf9732,_0x2ed625){const _0x16b389=_0x16b3();return _0x922a=function(_0x922a8,_0x44dd11){_0x922a8=_0x922a8-0x1c8;let _0x5736df=_0x16b389[_0x922a8];return _0x5736df;},_0x922a(_0xdf9732,_0x2ed625);}function Scene_MessageLog(){const _0x4c09e8=_0x5506eb;this[_0x4c09e8(0x282)](...arguments);}Scene_MessageLog[_0x5506eb(0x1f5)]=Object['create'](Scene_MenuBase[_0x5506eb(0x1f5)]),Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x202)]=Scene_MessageLog,Scene_MessageLog['prototype'][_0x5506eb(0x282)]=function(){const _0x5ca981=_0x5506eb;Scene_MenuBase[_0x5ca981(0x1f5)]['initialize'][_0x5ca981(0x260)](this);},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1f7)]=function(){return 0x0;},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1c8)]=function(){const _0x44174f=_0x5506eb;Scene_MenuBase[_0x44174f(0x1f5)]['create']['call'](this),this[_0x44174f(0x296)]();},Scene_MessageLog['prototype'][_0x5506eb(0x296)]=function(){const _0x4efdf9=_0x5506eb,_0x2b2791=this['messageLogWindowRect']();this['_messageLogWindow']=new Window_MessageLog(_0x2b2791),this[_0x4efdf9(0x299)](this[_0x4efdf9(0x1e7)]),this[_0x4efdf9(0x1e7)][_0x4efdf9(0x2c5)](_0x4efdf9(0x25e),this['popScene'][_0x4efdf9(0x2ba)](this)),this[_0x4efdf9(0x1e7)]['setBackgroundType'](VisuMZ[_0x4efdf9(0x26f)][_0x4efdf9(0x1f0)][_0x4efdf9(0x28c)][_0x4efdf9(0x22e)]);},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x222)]=function(){const _0x3287cd=_0x5506eb,_0x33a67c=VisuMZ[_0x3287cd(0x26f)][_0x3287cd(0x1f0)][_0x3287cd(0x28c)]['MessageLogMenu_RectJS'];if(_0x33a67c)return _0x33a67c['call'](this);const _0x5010da=0x0,_0x45b4c8=this[_0x3287cd(0x25b)](),_0xdb816c=Graphics[_0x3287cd(0x2cc)],_0x43c36f=this[_0x3287cd(0x2a9)]();return new Rectangle(_0x5010da,_0x45b4c8,_0xdb816c,_0x43c36f);},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1f3)]=function(){const _0x3d2c5e=_0x5506eb;Scene_MenuBase[_0x3d2c5e(0x1f5)][_0x3d2c5e(0x1f3)][_0x3d2c5e(0x260)](this),this['setBackgroundOpacity'](this[_0x3d2c5e(0x2d6)]()),this[_0x3d2c5e(0x280)]();},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x2d6)]=function(){const _0x44b47f=_0x5506eb;return VisuMZ[_0x44b47f(0x26f)][_0x44b47f(0x1f0)]['BgSettings'][_0x44b47f(0x254)];},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x280)]=function(){const _0x143083=_0x5506eb,_0x242a9c=VisuMZ[_0x143083(0x26f)][_0x143083(0x1f0)]['BgSettings'];_0x242a9c&&(_0x242a9c[_0x143083(0x28e)]!==''||_0x242a9c[_0x143083(0x255)]!=='')&&(this[_0x143083(0x2d7)]=new Sprite(ImageManager[_0x143083(0x253)](_0x242a9c[_0x143083(0x28e)])),this[_0x143083(0x272)]=new Sprite(ImageManager['loadTitle2'](_0x242a9c['BgFilename2'])),this[_0x143083(0x2e2)](this['_backSprite1']),this[_0x143083(0x2e2)](this[_0x143083(0x272)]),this[_0x143083(0x2d7)][_0x143083(0x2af)][_0x143083(0x273)](this['adjustSprite'][_0x143083(0x2ba)](this,this[_0x143083(0x2d7)])),this[_0x143083(0x272)][_0x143083(0x2af)][_0x143083(0x273)](this['adjustSprite'][_0x143083(0x2ba)](this,this[_0x143083(0x272)])));},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1d4)]=function(_0x467f8b){const _0x23d00f=_0x5506eb;this['scaleSprite'](_0x467f8b),this[_0x23d00f(0x22c)](_0x467f8b);},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x251)]=function(){const _0x4b2c23=_0x5506eb;return TextManager[_0x4b2c23(0x216)](_0x4b2c23(0x288),_0x4b2c23(0x2d2));},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x228)]=function(){const _0x5313ac=_0x5506eb;return TextManager[_0x5313ac(0x216)]('up','down');},Scene_MessageLog['prototype'][_0x5506eb(0x1d3)]=function(){return'';},Scene_MessageLog[_0x5506eb(0x1f5)]['buttonAssistText1']=function(){return TextManager['MessageLogFastScroll'];},Scene_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x20b)]=function(){const _0x46cb2f=_0x5506eb;return TextManager[_0x46cb2f(0x245)];},VisuMZ['MessageLog']['Window_MenuCommand_addOriginalCommands']=Window_MenuCommand[_0x5506eb(0x1f5)]['addOriginalCommands'],Window_MenuCommand[_0x5506eb(0x1f5)]['addOriginalCommands']=function(){const _0x3e7d47=_0x5506eb;VisuMZ['MessageLog'][_0x3e7d47(0x2b0)][_0x3e7d47(0x260)](this),this[_0x3e7d47(0x258)]();},Window_MenuCommand[_0x5506eb(0x1f5)][_0x5506eb(0x258)]=function(){const _0x451d3e=_0x5506eb;if(!this[_0x451d3e(0x25a)]())return;if(!this[_0x451d3e(0x2cf)]())return;const _0x20568b=TextManager['MessageLogMenuCommand'],_0x4434c5=this[_0x451d3e(0x274)]();this[_0x451d3e(0x2d5)](_0x20568b,'messageLog',_0x4434c5);},Window_MenuCommand[_0x5506eb(0x1f5)]['addMessageLogCommandAutomatically']=function(){const _0x57b1ba=_0x5506eb;return Imported[_0x57b1ba(0x291)]?![]:!![];},Window_MenuCommand['prototype'][_0x5506eb(0x2cf)]=function(){const _0x5b3cca=_0x5506eb;return $gameSystem[_0x5b3cca(0x23e)]();},Window_MenuCommand[_0x5506eb(0x1f5)][_0x5506eb(0x274)]=function(){const _0x48f77d=_0x5506eb;return $gameSystem[_0x48f77d(0x24a)]();},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x2e4)]=Window_ChoiceList[_0x5506eb(0x1f5)][_0x5506eb(0x20a)],Window_ChoiceList[_0x5506eb(0x1f5)][_0x5506eb(0x20a)]=function(){const _0x565e7c=_0x5506eb;(SceneManager['isSceneMap']()||!Window_MessageLog[_0x565e7c(0x1fe)])&&this[_0x565e7c(0x287)](!![]),VisuMZ['MessageLog']['Window_ChoiceList_callOkHandler'][_0x565e7c(0x260)](this);},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x226)]=Window_ChoiceList[_0x5506eb(0x1f5)][_0x5506eb(0x2db)],Window_ChoiceList[_0x5506eb(0x1f5)][_0x5506eb(0x2db)]=function(){const _0x3c7e8b=_0x5506eb;(SceneManager[_0x3c7e8b(0x20c)]()||!Window_MessageLog[_0x3c7e8b(0x1fe)])&&this['addMessageLogEntry'](![]),VisuMZ[_0x3c7e8b(0x26f)]['Window_ChoiceList_callCancelHandler'][_0x3c7e8b(0x260)](this);},Window_ChoiceList['prototype']['addMessageLogEntry']=function(_0x5cfc02){const _0x4ef424=_0x5506eb;$gameSystem[_0x4ef424(0x2d4)]();const _0x5e49e4=TextManager[_0x4ef424(0x24c)];let _0x3fd992='';if(_0x5cfc02){let _0x315058=this[_0x4ef424(0x2ab)](),_0x59540c=$gameMessage[_0x4ef424(0x231)]()[_0x315058];Window_MessageLog[_0x4ef424(0x22b)]&&(_0x59540c=_0x4ef424(0x24b)[_0x4ef424(0x29f)](_0x59540c)),_0x3fd992=_0x5e49e4[_0x4ef424(0x29f)](_0x59540c);}else{if(!_0x5cfc02&&!this['needsCancelButton']()){let _0x14e289=$gameMessage[_0x4ef424(0x252)](),_0x415704=$gameMessage[_0x4ef424(0x231)]()[_0x14e289];Window_MessageLog[_0x4ef424(0x22b)]&&(_0x415704=_0x4ef424(0x24b)[_0x4ef424(0x29f)](_0x415704)),_0x3fd992=_0x5e49e4[_0x4ef424(0x29f)](_0x415704);}else _0x3fd992=_0x5e49e4[_0x4ef424(0x29f)](TextManager[_0x4ef424(0x1ea)]);}$gameSystem[_0x4ef424(0x290)](_0x3fd992),$gameSystem['addNewLoggedMessageEntry']();},VisuMZ['MessageLog'][_0x5506eb(0x2a5)]=Window_NumberInput[_0x5506eb(0x1f5)][_0x5506eb(0x209)],Window_NumberInput[_0x5506eb(0x1f5)]['processOk']=function(){const _0x1425e4=_0x5506eb;(SceneManager[_0x1425e4(0x20c)]()||!Window_MessageLog[_0x1425e4(0x1fe)])&&this[_0x1425e4(0x287)](),VisuMZ[_0x1425e4(0x26f)][_0x1425e4(0x2a5)][_0x1425e4(0x260)](this);},Window_NumberInput[_0x5506eb(0x1f5)][_0x5506eb(0x287)]=function(){const _0x995b4a=_0x5506eb;$gameSystem[_0x995b4a(0x2d4)]();const _0x269561=TextManager['MessageLogNumberInputFmt'];let _0x5bd999=this['_number'];Window_MessageLog[_0x995b4a(0x224)]&&(_0x5bd999=_0x995b4a(0x24b)[_0x995b4a(0x29f)](_0x5bd999));let _0x2a2228=_0x269561[_0x995b4a(0x29f)](_0x5bd999);$gameSystem[_0x995b4a(0x290)](_0x2a2228),$gameSystem[_0x995b4a(0x29e)]();},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x241)]=Window_EventItem['prototype'][_0x5506eb(0x2a4)],Window_EventItem['prototype']['onOk']=function(){const _0x2abe79=_0x5506eb;(SceneManager['isSceneMap']()||!Window_MessageLog[_0x2abe79(0x1fe)])&&this[_0x2abe79(0x287)](this[_0x2abe79(0x21b)]()),VisuMZ[_0x2abe79(0x26f)][_0x2abe79(0x241)]['call'](this);},VisuMZ[_0x5506eb(0x26f)]['Window_EventItem_onCancel']=Window_EventItem[_0x5506eb(0x1f5)]['onCancel'],Window_EventItem['prototype'][_0x5506eb(0x1fd)]=function(){const _0x176e64=_0x5506eb;(SceneManager['isSceneMap']()||!Window_MessageLog['SCENE_MAP_ONLY'])&&this['addMessageLogEntry'](![]),VisuMZ[_0x176e64(0x26f)]['Window_EventItem_onCancel'][_0x176e64(0x260)](this);},Window_EventItem['prototype'][_0x5506eb(0x287)]=function(_0x2f2de3){const _0x59e851=_0x5506eb;$gameSystem[_0x59e851(0x2d4)]();const _0x215167=TextManager[_0x59e851(0x2b9)];let _0x4447c1='';if(_0x2f2de3){let _0x1b9d61=TextManager[_0x59e851(0x2ce)],_0x13b741=_0x1b9d61[_0x59e851(0x29f)](_0x59e851(0x1ca)[_0x59e851(0x29f)](_0x2f2de3[_0x59e851(0x2c6)]),_0x2f2de3['name']);Window_MessageLog[_0x59e851(0x276)]&&(_0x13b741='<ColorLock>%1</ColorLock>'[_0x59e851(0x29f)](_0x13b741)),_0x4447c1=_0x215167['format'](_0x13b741);}else _0x4447c1=_0x215167['format'](TextManager[_0x59e851(0x262)]);$gameSystem['addTextToMessageLog'](_0x4447c1),$gameSystem[_0x59e851(0x29e)]();},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x219)]=Window_Base[_0x5506eb(0x1f5)]['preConvertEscapeCharacters'],Window_Base[_0x5506eb(0x1f5)][_0x5506eb(0x2df)]=function(_0x53036b){const _0x393c8d=_0x5506eb;return _0x53036b=VisuMZ['MessageLog']['Window_Base_preConvertEscapeCharacters']['call'](this,_0x53036b),_0x53036b=_0x53036b[_0x393c8d(0x2cb)](/<BYPASS MESSAGE LOG>/i,''),_0x53036b;},VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1ed)]=Window_Message[_0x5506eb(0x1f5)]['isTriggered'],Window_Message[_0x5506eb(0x1f5)]['isTriggered']=function(){const _0x49eedd=_0x5506eb;let _0xed1215=VisuMZ[_0x49eedd(0x26f)][_0x49eedd(0x1ed)][_0x49eedd(0x260)](this);return this[_0x49eedd(0x229)]()&&Input[_0x49eedd(0x279)](Window_MessageLog[_0x49eedd(0x292)])?(this[_0x49eedd(0x210)](),![]):_0xed1215;},Window_Message[_0x5506eb(0x1f5)][_0x5506eb(0x229)]=function(){const _0x3cf77e=_0x5506eb;return SceneManager[_0x3cf77e(0x20c)]()&&$gameSystem['isMainMenuMessageLogEnabled']();},Window_Message[_0x5506eb(0x1f5)][_0x5506eb(0x210)]=function(){const _0x3e2f57=_0x5506eb;this[_0x3e2f57(0x294)](),SceneManager[_0x3e2f57(0x2e8)](Scene_MessageLog);};function Window_MessageLog(){this['initialize'](...arguments);}Window_MessageLog[_0x5506eb(0x1f5)]=Object[_0x5506eb(0x1c8)](Window_Selectable[_0x5506eb(0x1f5)]),Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x202)]=Window_MessageLog,Window_MessageLog[_0x5506eb(0x1fe)]=!![],Window_MessageLog['ENTRY_LIMIT']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x2be)][_0x5506eb(0x221)],Window_MessageLog[_0x5506eb(0x292)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['General']['ShortcutKey'],Window_MessageLog['SHOW_FACES']=VisuMZ['MessageLog'][_0x5506eb(0x1f0)][_0x5506eb(0x2be)][_0x5506eb(0x26a)]??!![],Window_MessageLog[_0x5506eb(0x2b4)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['General'][_0x5506eb(0x23a)]??!![],Window_MessageLog[_0x5506eb(0x277)]=0x4,Window_MessageLog['SPEAKER_NAME_X']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x28c)][_0x5506eb(0x203)],Window_MessageLog['COLOR_LOCK_CHOICE']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Window'][_0x5506eb(0x1f8)],Window_MessageLog[_0x5506eb(0x224)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x28c)][_0x5506eb(0x289)],Window_MessageLog[_0x5506eb(0x276)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Window'][_0x5506eb(0x1d9)],Window_MessageLog[_0x5506eb(0x1d5)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x28c)][_0x5506eb(0x2a2)],Window_MessageLog['FAST_SCROLL_SPEED']=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)][_0x5506eb(0x28c)]['FastScrollSpeed'],Window_MessageLog[_0x5506eb(0x256)]=VisuMZ[_0x5506eb(0x26f)][_0x5506eb(0x1f0)]['Window'][_0x5506eb(0x1f2)],Window_MessageLog['FAST_SOUND_FREQUENCY']=VisuMZ['MessageLog']['Settings'][_0x5506eb(0x28c)][_0x5506eb(0x2ac)],Window_MessageLog['prototype'][_0x5506eb(0x282)]=function(_0x51e691){const _0x5a54f6=_0x5506eb;this[_0x5a54f6(0x2d8)]=Input[_0x5a54f6(0x1f4)](Window_MessageLog[_0x5a54f6(0x292)]),Window_Selectable[_0x5a54f6(0x1f5)][_0x5a54f6(0x282)][_0x5a54f6(0x260)](this,_0x51e691),this[_0x5a54f6(0x211)]=0x0,this[_0x5a54f6(0x25d)]=!![],this['refresh'](),this[_0x5a54f6(0x1e8)]();},Window_MessageLog[_0x5506eb(0x1f5)]['isAutoColorAffected']=function(){return!![];},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x28d)]=function(){const _0x363c79=_0x5506eb;this[_0x363c79(0x28a)](),this[_0x363c79(0x2e7)](),this[_0x363c79(0x24f)](),this[_0x363c79(0x265)]();},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x28a)]=function(){const _0x38d22e=_0x5506eb;if(!Imported[_0x38d22e(0x275)])return;this[_0x38d22e(0x204)]=this[_0x38d22e(0x204)]||[],this[_0x38d22e(0x2bc)][_0x38d22e(0x25d)]=!![];const _0x2589af=[];for(const _0x4a8c44 of this[_0x38d22e(0x204)]){this[_0x38d22e(0x2d1)][_0x38d22e(0x25f)](_0x4a8c44),this[_0x38d22e(0x2bc)]['removeChild'](_0x4a8c44),_0x2589af['push'](_0x4a8c44);}for(const _0xc810bd of _0x2589af){this['_replayVoiceSprites']['remove'](_0xc810bd);}},Window_MessageLog['prototype'][_0x5506eb(0x2e7)]=function(){const _0x89a6d=_0x5506eb,_0x2fcfc3=this[_0x89a6d(0x1e1)](),_0x3b4682=$gameSystem[_0x89a6d(0x1e3)]();this[_0x89a6d(0x211)]=_0x2fcfc3;for(const _0x30c19d of _0x3b4682){if(!_0x30c19d)continue;if(_0x30c19d['speaker']!=='')this[_0x89a6d(0x211)]+=this[_0x89a6d(0x217)](_0x30c19d['speaker'])[_0x89a6d(0x1dc)];let _0x5d4db5=_0x30c19d[_0x89a6d(0x1e6)]!==''&&Window_MessageLog['SHOW_FACES']?ImageManager[_0x89a6d(0x24e)]:0x0,_0x3bbeae=this['textSizeEx'](_0x30c19d['messageBody'])[_0x89a6d(0x1dc)];this['_allTextHeight']+=Math[_0x89a6d(0x23b)](_0x5d4db5,_0x3bbeae),this[_0x89a6d(0x211)]+=_0x2fcfc3;}},Window_MessageLog[_0x5506eb(0x1f5)]['contentsHeight']=function(){const _0x4302a2=_0x5506eb;return Math[_0x4302a2(0x23b)](this[_0x4302a2(0x211)],0x1);},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x265)]=function(){const _0x448321=_0x5506eb;this['_lineY']=0x0,this[_0x448321(0x29d)]();const _0xd45e0a=$gameSystem[_0x448321(0x1e3)]();for(const _0x59aff9 of _0xd45e0a){if(!_0x59aff9)continue;this[_0x448321(0x247)](),this[_0x448321(0x215)](_0x59aff9),this[_0x448321(0x2bb)]();}this['scrollToBottom']();},Window_MessageLog['prototype']['drawHorzLine']=function(){const _0x4cc528=_0x5506eb,_0x1bd786=new Rectangle(0x4,this[_0x4cc528(0x246)],this[_0x4cc528(0x261)]-0x8,this[_0x4cc528(0x1e1)]());this[_0x4cc528(0x247)]();const _0x32cb9a=Window_MessageLog[_0x4cc528(0x277)],_0x1f0067=_0x1bd786['y']+(_0x1bd786['height']-_0x32cb9a)/0x2;this[_0x4cc528(0x2cd)](_0x1bd786['x'],_0x1f0067,_0x1bd786[_0x4cc528(0x230)],_0x32cb9a),this['_lineY']+=this[_0x4cc528(0x1e1)]();},Window_MessageLog['prototype'][_0x5506eb(0x217)]=function(_0x5ab7e2){const _0x27d944=_0x5506eb;let _0x2c1ae3=this[_0x27d944(0x261)]-(ImageManager[_0x27d944(0x23c)]+0x18)*0x2;Graphics[_0x27d944(0x2cc)]<=0x330&&(_0x2c1ae3=this[_0x27d944(0x261)]-0x8);this[_0x27d944(0x247)](),this['resetWordWrap']();const _0x2b6135=this['createTextState'](_0x5ab7e2,0x0,0x0,_0x2c1ae3);return _0x2b6135[_0x27d944(0x295)]=![],this[_0x27d944(0x27e)](_0x2b6135),this[_0x27d944(0x2bb)](),{'width':_0x2b6135['outputWidth'],'height':_0x2b6135[_0x27d944(0x2c9)]};},Window_MessageLog['prototype']['drawMessageText']=function(_0x4684e7){const _0x4174f5=_0x5506eb;let _0x477151=0x4,_0x3981ff=ImageManager[_0x4174f5(0x23c)]+0x14,_0x3c4c20=this[_0x4174f5(0x261)]-(_0x3981ff+0x4)*0x2;_0x4684e7[_0x4174f5(0x208)]!==''&&(this['forceNameColor'](),this[_0x4174f5(0x23d)](_0x4684e7[_0x4174f5(0x208)],Window_MessageLog['SPEAKER_NAME_X'],this[_0x4174f5(0x246)],_0x3c4c20),this['_lineY']+=this[_0x4174f5(0x217)](_0x4684e7[_0x4174f5(0x208)])['height'],this[_0x4174f5(0x297)]());this[_0x4174f5(0x247)](),this['resetWordWrap']();if(Window_MessageLog[_0x4174f5(0x1de)]&&_0x4684e7[_0x4174f5(0x1e6)]){let _0x4c18b1=_0x477151,_0x153742=this[_0x4174f5(0x246)],_0x6b2317=ImageManager[_0x4174f5(0x23c)],_0x47c4b4=ImageManager[_0x4174f5(0x24e)];this['drawFace'](_0x4684e7[_0x4174f5(0x1e6)],_0x4684e7[_0x4174f5(0x2e6)],_0x4c18b1,_0x153742,_0x6b2317,_0x47c4b4),Graphics[_0x4174f5(0x2cc)]<=0x330&&(_0x3c4c20=this[_0x4174f5(0x261)]-(_0x3981ff+0x4));}else(!Window_MessageLog[_0x4174f5(0x2b4)]||Graphics[_0x4174f5(0x2cc)]<=0x330)&&(_0x3981ff=0x4,_0x3c4c20=this[_0x4174f5(0x261)]-0x8,Imported[_0x4174f5(0x275)]&&(_0x4684e7[_0x4174f5(0x2b1)]&&(_0x3981ff+=ImageManager[_0x4174f5(0x21f)]+0x4,_0x3c4c20-=ImageManager[_0x4174f5(0x21f)]+0x4)));this[_0x4174f5(0x23d)](_0x4684e7['messageBody'],_0x3981ff,this[_0x4174f5(0x246)],_0x3c4c20);let _0x10485f=this[_0x4174f5(0x217)](_0x4684e7[_0x4174f5(0x20f)])['height'],_0x1360f2=_0x4684e7[_0x4174f5(0x1e6)]!==''&&Window_MessageLog[_0x4174f5(0x1de)]?ImageManager[_0x4174f5(0x24e)]:0x0;Imported[_0x4174f5(0x275)]&&this['addReplayVoiceSprite'](_0x4684e7,_0x477151,this[_0x4174f5(0x246)]),this[_0x4174f5(0x246)]+=Math['max'](_0x1360f2,_0x10485f),this[_0x4174f5(0x247)](),this[_0x4174f5(0x2bb)](),this[_0x4174f5(0x29d)]();},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1e9)]=function(){const _0xa997f=_0x5506eb,_0x345c05=VisuMZ[_0xa997f(0x1f9)][_0xa997f(0x1f0)]['General'][_0xa997f(0x205)];this['_forcedNameColor']=ColorManager[_0xa997f(0x2dd)](_0x345c05);},Window_MessageLog['prototype']['clearNameColor']=function(){const _0x384d68=_0x5506eb;this[_0x384d68(0x2c1)]=undefined;},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x1eb)]=function(){const _0x3d900d=_0x5506eb;Window_Selectable[_0x3d900d(0x1f5)][_0x3d900d(0x1eb)][_0x3d900d(0x260)](this),this[_0x3d900d(0x2c1)]&&this[_0x3d900d(0x284)](this[_0x3d900d(0x2c1)]);},Window_MessageLog['prototype']['addReplayVoiceSprite']=function(_0x7f9778,_0x3a60a5,_0x148c18){const _0x30479a=_0x5506eb;if(!_0x7f9778[_0x30479a(0x2b1)])return;this[_0x30479a(0x204)]=this['_replayVoiceSprites']||[];(Window_MessageLog['SHOW_FACES']&&_0x7f9778[_0x30479a(0x1e6)]||Graphics[_0x30479a(0x2cc)]>0x330)&&(_0x3a60a5+=ImageManager['faceWidth']-ImageManager['iconWidth']);const _0x75fe1e=new Sprite_ReplayVoiceLine();_0x75fe1e['setSound'](_0x7f9778[_0x30479a(0x2b1)]),_0x75fe1e[_0x30479a(0x233)](_0x3a60a5,_0x148c18),this[_0x30479a(0x204)][_0x30479a(0x2e8)](_0x75fe1e),this[_0x30479a(0x268)](_0x75fe1e);},Window_MessageLog['prototype']['updateOrigin']=function(){},Window_MessageLog['prototype'][_0x5506eb(0x2da)]=function(){const _0x16d722=_0x5506eb;if(Input[_0x16d722(0x1f4)](Window_MessageLog['SHORTCUT_KEY'])&&this[_0x16d722(0x2d8)])return;this[_0x16d722(0x2d8)]=![];if(Input['isPressed'](_0x16d722(0x1ee)))this[_0x16d722(0x2e3)](!![]);else{if(Input['isPressed']('up'))this[_0x16d722(0x2e3)](![]);else{if(Input[_0x16d722(0x1f4)](_0x16d722(0x2d2)))this[_0x16d722(0x2bf)](!![]);else{if(Input[_0x16d722(0x1f4)](_0x16d722(0x288)))this['processFastScroll'](![]);else{if(Input['isTriggered']('home'))this[_0x16d722(0x22a)](!![]);else Input[_0x16d722(0x279)](_0x16d722(0x269))&&this[_0x16d722(0x1ef)](!![]);}}}}},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x2e3)]=function(_0x51e128){const _0x45fbed=_0x5506eb;let _0x2890bb=this['origin']['y'];this['origin']['y']+=(_0x51e128?0x1:-0x1)*Window_MessageLog[_0x45fbed(0x1d5)];let _0x21ead1=Math['max'](0x0,this[_0x45fbed(0x211)]-this[_0x45fbed(0x29b)]);this[_0x45fbed(0x1fa)]['y']=this[_0x45fbed(0x1fa)]['y'][_0x45fbed(0x2d3)](0x0,_0x21ead1);if(_0x2890bb!==this[_0x45fbed(0x1fa)]['y']&&Graphics[_0x45fbed(0x1fc)]%Window_MessageLog[_0x45fbed(0x256)]===0x0)this[_0x45fbed(0x2de)]();},Window_MessageLog['prototype'][_0x5506eb(0x2bf)]=function(_0x2f8204){const _0x58a32e=_0x5506eb;let _0x3404e0=this[_0x58a32e(0x1fa)]['y'];this[_0x58a32e(0x1fa)]['y']+=(_0x2f8204?0x1:-0x1)*Window_MessageLog[_0x58a32e(0x248)];let _0x4ffe5b=Math[_0x58a32e(0x23b)](0x0,this['_allTextHeight']-this['innerHeight']);this[_0x58a32e(0x1fa)]['y']=this[_0x58a32e(0x1fa)]['y'][_0x58a32e(0x2d3)](0x0,_0x4ffe5b);if(_0x3404e0!==this[_0x58a32e(0x1fa)]['y']&&Graphics[_0x58a32e(0x1fc)]%Window_MessageLog['FAST_SOUND_FREQUENCY']===0x0)this[_0x58a32e(0x2de)]();},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x22a)]=function(_0x35b9b2){const _0x778ba2=_0x5506eb;let _0x5cacf9=this[_0x778ba2(0x1fa)]['y'];this[_0x778ba2(0x1fa)]['y']=0x0;if(_0x35b9b2&&_0x5cacf9!==this[_0x778ba2(0x1fa)]['y'])this['playCursorSound']();},Window_MessageLog['prototype'][_0x5506eb(0x1ef)]=function(_0x2905dc){const _0x5c7133=_0x5506eb;let _0x2bed10=this[_0x5c7133(0x1fa)]['y'],_0x104554=Math[_0x5c7133(0x23b)](0x0,this[_0x5c7133(0x211)]-this[_0x5c7133(0x29b)]);this[_0x5c7133(0x1fa)]['y']=_0x104554;if(_0x2905dc&&_0x2bed10!==this[_0x5c7133(0x1fa)]['y'])this['playCursorSound']();},Window_MessageLog[_0x5506eb(0x1f5)]['smoothScrollBy']=function(_0x288c35,_0x5c4520){const _0x4c998c=_0x5506eb;this['origin']['y']+=_0x5c4520;let _0x100dc1=Math['max'](0x0,this[_0x4c998c(0x211)]-this['innerHeight']);this[_0x4c998c(0x1fa)]['y']=this[_0x4c998c(0x1fa)]['y']['clamp'](0x0,_0x100dc1);},Window_MessageLog[_0x5506eb(0x1f5)][_0x5506eb(0x232)]=function(_0x26aeaa,_0x287224){const _0x279cb9=_0x5506eb;this[_0x279cb9(0x1fa)]['y']+=_0x287224;let _0x3833cc=Math['max'](0x0,this[_0x279cb9(0x211)]-this[_0x279cb9(0x29b)]);this[_0x279cb9(0x1fa)]['y']=this[_0x279cb9(0x1fa)]['y'][_0x279cb9(0x2d3)](0x0,_0x3833cc);};