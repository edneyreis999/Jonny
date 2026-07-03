//=============================================================================
// VisuStella MZ - Extended Message Functionality
// VisuMZ_2_ExtMessageFunc.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_ExtMessageFunc = true;

var VisuMZ = VisuMZ || {};
VisuMZ.ExtMessageFunc = VisuMZ.ExtMessageFunc || {};
VisuMZ.ExtMessageFunc.version = 1.22;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.22] [ExtMessageFunc]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Extended_Message_Functionality_VisuStella_MZ
 * @base VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_1_MessageCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Extended Message Function plugin adds onto RPG Maker MZ's Message Window
 * and adds in various features you would normally see found in modern RPG's.
 * Things like automatically moving the text forward after a set amount of time
 * or fast forward are available. Saving and loading during a message is also
 * possible as well as going to the Options menu or returning back to the title
 * screen. These options are only available to the Message Window on the map
 * scene and do not work in battle.
 *
 * Features include all (but not limited to) the following:
 * 
 * * The Button Console appears on the Message Window let the player activate
 *   various commands via touch/click.
 * * Extended Fast Forward Mode is an expanded feature upon the Message Core's
 *   Fast Forward function to fast forward all events and not just messages.
 *   This can be optionally disabled.
 * * A Message Cursor will appear where the text has ended for those who want
 *   that kind of aesthetic in their game.
 * * Auto-Forward will automatically move messages onward after a certain
 *   amount of time has passed. Time required will be determined based on the
 *   length of the message in question.
 * * Saving and Loading can be done from the Message Window akin to how many
 *   visual novels work. Requires the Save Core, but you're already using that,
 *   right? Right?
 * * Also be able to jump straight into the Options scene from the Message
 *   Window to change any settings on the fly. Requires the Options Core, but
 *   you're using that, too, correct?
 * * And for those who want to jump back to the title screen, they can do so
 *   by selecting a Game End option, too.
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
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
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
 * VisuMZ_1_OptionsCore
 *
 * The Options Core is a required plugin in order to make use of the "Options"
 * (aka "Config") button found in the Button Console.
 *
 * ---
 *
 * VisuMZ_1_SaveCore
 *
 * The Options Core is a required plugin in order to make use of the "Save" and
 * "Load" buttons found in the Button Console.
 *
 * ---
 * 
 * VisuMZ_3_MessageLog
 * 
 * The Message Log plugin enables the "Log" button found in the Button Console
 * to let the player go and review the text that has been displayed in the map
 * scene. This does not include the text found in battle to avoid conflicting
 * logged messages across different situations.
 * 
 * ---
 * 
 * VisuMZ_4_MessageVisibility
 * 
 * The Message Visibility plugin enables the "Hide" button found in the
 * Button Console to make the Message Window visible or invisible.
 * 
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. 
 *
 * === Button Console-Related Text Codes ===
 * 
 * ---
 *
 * --------------------   -----------------------------------------------------
 * Text Code              Effect (Message Window Only)
 * --------------------   -----------------------------------------------------
 * 
 * <Hide Buttons>         Hides the Button Console from this current Message
 *                        Window's text assuming that nothing else is hiding
 *                        the Button Console from view.
 * 
 * ---
 * 
 * === Message Tail-Related Text Codes ===
 *
 * --------------------   -----------------------------------------------------
 * Text Code              Effect (Message Window Only)
 * --------------------   -----------------------------------------------------
 * 
 * <Tail Bottom Left: x>  Creates a message tail at x coordinate pointing to
 *                        the bottom left.
 * <Tail Bottom Right: x> Creates a message tail at x coordinate pointing to
 *                        the bottom right.
 * <Tail Upper Left: x>   Creates a message tail at x coordinate pointing to
 *                        the upper left.
 * <Tail Upper Right: x>  Creates a message tail at x coordinate pointing to
 *                        the upper right.
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
 * === Fast Forward Plugin Commands ===
 * 
 * ---
 *
 * Fast Forward: Allow/Disallow
 * - Change whether or not Fast Forward is allowed/disallowed.
 * - Must be enabled by the Plugin Parameters.
 *
 *   Allow?:
 *   - Allow or disallow the Extended Fast Forward feature?
 *   - Must be enabled by the Plugin Parameters.
 *
 * ---
 * 
 * === Message Button Console Plugin Commands ===
 * 
 * ---
 *
 * Message Button Console: Show/Hide
 * - Determine if the Message Button Console is visible or hidden.
 * - Only appears on the map. 
 * - Does not appear in battle.
 *
 *   Visible?:
 *   - Show or hide the Message Button Console feature?
 *   - Only appears on the map.
 *   - Does not appear in battle.
 *
 * ---
 * 
 * === Message Cursor Plugin Commands ===
 * 
 * ---
 *
 * Message Cursor: Change Settings
 * - Change the Message Cursor settings used.
 *
 *   Change Settings:
 *   - Change the Message Cursor settings.
 *   - Settings are the same as the ones found in the Plugin Parameters.
 *
 * ---
 * 
 * === Message Tail Plugin Commands ===
 * 
 * ---
 * 
 * Message Tail: Change Settings
 * - Change the Message Tail settings.
 * 
 *   Message Tail Settings:
 *   - Message Tail settings used for Message Windows.
 *   - Requires images and text codes to appear.
 *   - See Plugin Parameters. They have the same parameters.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Auto-Forward Settings
 * ============================================================================
 *
 * Auto-Forward settings used for this game. Auto-Forward is a feature that
 * once enabled, the game will automatically move the "Show Text" event
 * commands forward after a certain amount of time. The amount of time will be
 * determined by how many characters are displayed on the screen. There is a
 * lower boundary, where if the wait time does not meet the amount, the timer
 * will be set to the minimum wait value instead.
 *
 * ---
 *
 * Settings
 * 
 *   Wait per Character:
 *   - How many frames should the game wait per character?
 *   - Average: 60 frames per second.
 * 
 *   Minimum Wait:
 *   - What is the minimum amount of frames to wait?
 *   - Average: 60 frames per second.
 *
 * ---
 * 
 * Compatibility
 * 
 *   Voice Act Padding:
 *   - How many frames to wait after a voice line finishes?
 *   - Average: 60 frames per second.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Fast Forward (Extended) Settings
 * ============================================================================
 *
 * Extended Fast Forward settings used for this game. If enabled, this will
 * replace the Message Core's Fast Forward functionality. The Extended Fast
 * Forward feature will not only fast forward through messages but any running
 * events that are not found in a parallel event.
 * 
 * It can also be activated the Message Core's Fast Forward shortcut key.
 *
 * ---
 *
 * Settings
 * 
 *   Enable?:
 *   - Enable or disable the Extended Fast Forward feature?
 * 
 *   Speed:
 *   - What is the speed at which Extended Fast Forward works at?
 *   - Higher numbers are faster.
 * 
 *   Reset on Scene Change?:
 *   - Reset Fast Forward setting on scene changes (ie battle, menu, or
 *     map transfers)?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Message Button Console Settings
 * ============================================================================
 *
 * Message Button Console settings used for this game.
 * 
 * It will only appear in the Message Window on the map scene. It will NOT
 * appear in battle. The reason it won't appear in battle is because many of
 * the functions there will clash with how the battle scene behaves.
 * 
 * The Button Console will add extra padding to the Message Window and appear
 * at either the top of bottom of the Message Window (your choice). A row of
 * buttons will appear each with a different functionality.
 * 
 * These Plugin Parameters also allow you to customize the appearance of how
 * the buttons look in-game. Adjust them accordingly.
 *
 * ---
 *
 * General
 * 
 *   Show by Default?:
 *   - Show or hide the Message Button Console by default?
 * 
 *   Position:
 *   - Where do you wish to display the Message Button Console?
 *     - Top of Message Window
 *     - Bottom of Message Window
 * 
 *   Auto-Size Hide?:
 *   - Hide the button console when using auto-size text codes?
 *
 * ---
 *
 * Appearance
 * 
 *   Window Skin:
 *   - What is the window skin used for the buttons?
 *   - Ignore if using Background Images.
 * 
 *   Font Name:
 *   - What font do you wish to use for the Message Button Console?
 * 
 *     Font Size:
 *     - What font size do you wish to use for the Message Button Console?
 * 
 *   Text Colors:
 * 
 *     Normal Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *     Toggled Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *     Disabled Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *   Visuals:
 * 
 *     Offset X:
 *     - Offsets the buttons x position.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - Offsets the buttons y position.
 *     - Negative: up. Positive: down.
 * 
 *     Width:
 *     - What is the width of each button?
 * 
 *     Height:
 *     - What is the height of each button?
 * 
 *     Buffer:
 *     - What is the buffer between each button?
 * 
 *   Background Images:
 * 
 *     Disabled Image:
 *     Enabled Image:
 *     Toggled Image:
 *     - Filename of the background image when the button is disabled,
 *       enabled, or toggled.
 *     - This will hide the window skin for this button.
 * 
 *     Offset X:
 *     - Offsets the X position of this image.
 *     - Negative: left; Positive: right
 * 
 *     Offset Y:
 *     - Offsets the Y position of this image.
 *     - Negative: up; Positive: down
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Button Settings
 * ============================================================================
 *
 * Settings for which buttons appear and how they appear. These settings will
 * determine which buttons appear (provided that their required plugins are
 * available), what shortcut keys are applied to them, and what kind of text
 * will be displayed to represent them.
 * 
 * In case you are wondering where the Fast Forward shortcut key is, that
 * setting is found in the Message Core.
 *
 * ---
 *
 * General
 * 
 *   List:
 *   - Which buttons appear and in what order?
 *   - Some commands require certain plugins installed.
 *
 * ---
 *
 * Shortcut Keys
 * 
 *   Auto-Forward Key:
 *   - This is the key used for auto-forwarding messages.
 * 
 *   Save Key:
 *   - This is the key used for quick saving.
 *   - Requires VisuMZ_1_SaveCore!
 * 
 *   Load Key:
 *   - This is the key used for quick load.
 *   - Requires VisuMZ_1_SaveCore!
 * 
 *   Options Key:
 *   - This is the key used for opening options.
 *   - Requires VisuMZ_1_OptionsCore!
 * 
 *   Game End Key:
 *   - This is the key used for ending the game.
 *
 * ---
 *
 * Vocabulary
 * 
 *   Auto-Forward:
 *   - How is this option's text displayed in-game?
 * 
 *   Fast Forward:
 *   - How is this option's text displayed in-game?
 * 
 *   Save Game:
 *   - How is this option's text displayed in-game?
 *   - Requires VisuMZ_1_SaveCore!
 * 
 *   Load Game:
 *   - How is this option's text displayed in-game?
 *   - Requires VisuMZ_1_SaveCore!
 * 
 *   Options:
 *   - How is this option's text displayed in-game?
 *   - Requires VisuMZ_1_OptionsCore!
 * 
 *   Game End:
 *   - How is this option's text displayed in-game?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Message Cursor Settings
 * ============================================================================
 *
 * Message Cursor settings used for this game. The cursor, if enabled, will
 * appear where the text is currently displayed at and adds a new type of
 * aesthetic to the game.
 *
 * ---
 *
 * General
 * 
 *   Enable?:
 *   - Enable or disable the message cursor?
 * 
 *   Graphic Type:
 *   - What is the cursor's graphic type?
 *     - Icon - From img/system/IconSet.png
 *     - Image - An animated image from img/system/
 *     - Window Skin - Use the default Window Skin cursor
 *
 * ---
 *
 * Icon
 * 
 *   Icon Index:
 *   - This is icon used for the Message Cursor.
 * 
 *   Flip Speed Multiplier:
 *   - What is the flip speed multiplier for the Message Cursor?
 *   - Use 0 for no flipping.
 *
 * ---
 *
 * Image
 * 
 *   Filename:
 *   - Filename of the image found inside the img/system/ folder.
 * 
 *   Image Rows:
 *   - How many rows are there for the image?
 * 
 *   Image Columns:
 *   - How many columns are there for the image?
 * 
 *   Frame Delay:
 *   - How many frames delayed are there per animated cell?
 *
 * ---
 *
 * Appearance
 * 
 *   Anchor X:
 *   Anchor Y:
 *   - Determine the Message Cursor's X/Y position.
 *   - Use a number between 0 and 1 for best results.
 * 
 *   Offset X:
 *   Offset Y:
 *   - Offset the Message Cursor's X/Y position by how many pixels?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Message Tail Settings
 * ============================================================================
 *
 * Message Tails can be made to appear from the Message Window and point
 * towards the speaker, similar to how speech bubbles in comics point towards
 * their speakers. The Message Tails do not appear on their own, and only come
 * out when using auto-position text codes (if enabled) such as <Auto Player>
 * or when text codes are used to make them appear such as <Tail Upper Left: x>
 * and <Tail Lower Right: x>.
 * 
 * These settings require custom graphics that this plugin does not come with.
 * You will need to add them on your own or else they will not appear.
 *
 * ---
 *
 * Auto-Position
 * 
 *   Enable?:
 *   - Show Message Tails with Auto-Position text codes?
 *   - Message Tails will appear when using the following text codes:
 *     - <Auto Actor: x>
 *     - <Auto Party: x>
 *     - <Auto Player>
 *     - <Auto Event: x>
 *     - <Auto Enemy: x>
 * 
 *   Face Left?:
 *   - Which direction does the Message Tail point to?
 *   - Left or right?
 * 
 *   Auto-Correct X:
 *   - Auto-corrects Message Tail position X when used with Auto-Position but
 *     are too close to edge of screen.
 * 
 *   Offset X:
 *   Offset Y:
 *   - Message Window's X offset with auto-position.
 *   - X: Negative: left. Positive: right.
 *   - Y: Negative: up. Positive: down.
 *
 * ---
 *
 * Tail Directions
 * Tail Directions > Bottom Left
 * Tail Directions > Bottom Right
 * Tail Directions > Upper Left
 * Tail Directions > Upper Right
 * 
 *   Filename:
 *   - Filename of the Message Tail graphic going towards the
 *     specified direction.
 * 
 *   Anchor X:
 *   - Anchor value X. Use a number between 0 and 1.
 *   - 0.0 - Left; 0.5 - Center; 1.0 - Right
 * 
 *   Anchor Y:
 *   - Anchor value Y. Use a number between 0 and 1.
 *   - 0.0 - Top; 0.5 - Middle; 1.0 - Bottom
 * 
 *   Offset X:
 *   - Offset the Message Tail's X position.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offset the Message Tail's Y position.
 *   - Negative: left. Positive: right.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Scroll Wheel Settings
 * ============================================================================
 *
 * Emulates Eastern Visual Novel controls regarding mouse scroll wheel
 * functionality. If enabled, the scroll wheel can be used to "continue" the
 * current "Show Text" message by scrolling down on the mouse wheel or if the
 * VisuStella MZ Message Log is installed, scrolling up will reveal the message
 * log to show what was previously said.
 * 
 * This feature will be temporarily disabled whenever any supporting windows
 * are visible and active, such as the "Show Choice", "Input Number", "Select
 * Item" windows. This is because those windows typically have scroll wheel
 * controls of their own and theirs will take priority. Even if they do not
 * have scroll wheel controls temporarily, the function will remain disabled
 * for control consistency.
 *
 * ---
 * 
 * Settings
 * 
 *   Enable?:
 *   - Enable disable scroll wheel controls?
 *   - Temporarily disabled during support windows
 *     - ie. Show Choice, Input Number, etc.
 * 
 *   Scroll Down: Next?:
 *   - Set "Scroll Down" to "Next"?
 * 
 *   Scroll Up: Log?:
 *   - Set "Scroll Up" to "Message Log"?
 *   - Requires VisuMZ_3_MessageLog!
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
 * Version 1.22: December 15, 2025
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Plugin Parameters added by Irina:
 * ** Parameters > Scroll Wheel Settings
 * *** Emulates Eastern Visual Novel controls regarding mouse scroll wheel
 *     functionality. If enabled, the scroll wheel can be used to "continue"
 *     the current "Show Text" message by scrolling down on the mouse wheel or
 *     if the VisuStella MZ Message Log is installed, scrolling up will reveal
 *     the message log to show what was previously said.
 * *** This feature will be temporarily disabled whenever any supporting
 *     windows are visible and active, such as the "Show Choice", "Input
 *     Number", "Select Item" windows. This is because those windows typically
 *     have scroll wheel controls of their own and theirs will take priority.
 *     Even if they do not have scroll wheel controls temporarily, the function
 *     will remain disabled for control consistency.
 * 
 * Version 1.21: November 13, 2025
 * * Compatibility Update!
 * ** "Auto-Forward" functionality now plays nice with VisuMZ_2_VoiceActControl
 *    and waits for voice lines to finish before continuing.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina:
 * *** Parameters > Auto-Forward Settings > Compatibility > Voice Act Padding
 * **** How many frames to wait after a voice line finishes?
 * **** Average: 60 frames per second.
 * 
 * Version 1.20: April 17, 2025
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Parameters > Message Tails > Auto-Position > Auto-Correct X
 * **** Auto-corrects Message Tail position X when used with Auto-Position but
 *      are too close to edge of screen.
 * 
 * Version 1.19: February 20, 2025
 * * Compatibility Update!
 * ** Updated for RPG Maker MZ Core Scripts 1.9.0!
 * *** Better compatibility with different face sizes.
 * 
 * Version 1.18: December 19, 2024
 * * Bug Fixes!
 * ** Fixed a bug where if the button console was top positioned and the
 *    buttons were hidden, the rest of the text would not readjust. Fix made
 *    by Irina.
 * 
 * Version 1.17: June 13, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina:
 * *** Parameters > Message Button Console > Button Visuals > Offset X
 * *** Parameters > Message Button Console > Button Visuals > Offset Y
 * **** Adjusts the X/Y position of the buttons.
 * 
 * Version 1.16: March 14, 2024
 * * Bug Fixes!
 * ** Fixed a text positioning issue with the message window when shown in
 *    battle and a top-aligned button console. Fix made by Irina.
 * 
 * Version 1.15: December 14, 2023
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.14: May 18, 2023
 * * Bug Fixes!
 * ** Fixed a bug that made hidden buttons via <Hide Button Console> still able
 *    to be pressed. Fix made by Irina.
 * 
 * Version 1.13: February 16, 2023
 * * Bug Fixes!
 * ** Fixed a bug that prevents <Hide Button Console> from working when word
 *    wrap is enabled. Fix made by Irina.
 * 
 * Version 1.12: December 15, 2022
 * * Bug Fixes!
 * ** Fixed a bug where the menu background settings from VisuMZ Core Engine
 *    did not carry over to the save menu when accessing it through the Message
 *    Button Console. Fix made by Olivia.
 * 
 * Version 1.11: November 10, 2022
 * * Bug Fixes!
 * ** Plugin Command "Message Cursor: Change Settings" no longer leaves behind
 *    the old cursor sprite when a new one is selected. Fix made by Irina.
 * 
 * Version 1.10: August 11, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina
 * *** Plugin Parameters > Fast Forward > Reset on Scene Change?
 * **** Reset Fast Forward setting on scene changes (ie battle, menu, or
 *      map transfers)?
 * 
 * Version 1.09: April 7, 2022
 * * Bug Fixes!
 * ** Default message cursor no longer appears in the wrong place when no
 *    message cursor skin is used for auto-sized messages. Fix by Arisu.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter option added by Arisu and sponsored by Archeia:
 * *** Plugin Parameters > Message Cursor Settings > Graphics Type
 * **** New option added: Window Skin - Use the default Window Skin cursor
 * **** This is for those who wish to use the default window skin cursor
 *      instead of icons or images.
 * 
 * Version 1.08: March 17, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands, Text Codes, and Plugin Parameters added by Irina
 *    and sponsored by Archeia!
 * *** Message Tails can be made to appear from the Message Window and point
 *     towards the speaker, similar to how speech bubbles in comics point
 *     towards their speakers. The Message Tails do not appear on their own,
 *     and only come out when using auto-position text codes (if enabled) such
 *     as <Auto Player> or when text codes are used to make them appear such as
 *     <Tail Upper Left: x> and <Tail Lower Right: x>.
 * *** These settings require custom graphics that this plugin does not come
 *     with. You will need to add them on your own or else they will not
 *     appear.
 * *** Text Codes added: <Tail Bottom Left: x>, <Tail Bottom Right: x>,
 *     <Tail Upper Left: x>, <Tail Upper Right: x>
 * *** Plugin Command Added: Message Tail: Change Settings
 * *** Plugin Parameters Added: Message Tail Settings
 * 
 * Version 1.07: March 3, 2022
 * * Compatibility Update
 * ** Added better compatibility functionality with other plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina and sponsored by AndyL:
 * *** Plugin Parameters > Message Button Console > Auto-Size Hide?
 * **** Hide the button console when using auto-size text codes?
 * 
 * Version 1.06: November 18, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.05: November 4, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina and sponsored by Archeia:
 * *** Plugin Parameters > Message Button Console > Background Images
 * **** Adds a background image to this button instead of using a window skin.
 * **** This will disable the window skin.
 * **** Various images can be used for "Disabled", "Enabled", and "Toggled".
 * **** Offset X and Y positions.
 * 
 * Version 1.04: October 14, 2021
 * * Feature Update!
 * ** Added an alert requirement for those who are using very old versions of
 *    the Message Core that cannot sustain the requirements of this plugin.
 *    Added by Irina.
 * 
 * Version 1.03: September 3, 2021
 * * Bug Fixes!
 * ** Pause sprite, for the Message Window, will no longer show multiple copies
 *    if the message cursor sprite is disabled. Fix made by Irina.
 * 
 * Version 1.02: August 6, 2021
 * * Documentation Update!
 * ** Plugin URL now updated to most recent one.
 * 
 * Version 1.01: July 30, 2021
 * * Feature Update!
 * ** Added graphic pre-loading for save/load menu preparation. Added by Irina.
 * 
 * Version 1.00 Official Release Date: August 2, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExtFastFwdDisallow
 * @text Fast Forward: Allow/Disallow
 * @desc Change whether or not Fast Forward is allowed/disallowed.
 * Must be enabled by the Plugin Parameters.
 *
 * @arg Allow:eval
 * @text Allow?
 * @parent General
 * @type boolean
 * @on Allow
 * @off Disallow
 * @desc Allow or disallow the Extended Fast Forward feature?
 * Must be enabled by the Plugin Parameters.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MsgButtonConsole
 * @text Message Button Console: Show/Hide
 * @desc Determine if the Message Button Console is visible or hidden.
 * Only appears on the map. Does not appear in battle.
 *
 * @arg Visible:eval
 * @text Visible?
 * @parent General
 * @type boolean
 * @on Visible
 * @off Hidden
 * @desc Show or hide the Message Button Console feature?
 * Only appears on the map. Does not appear in battle.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MessageCursorSettings
 * @text Message Cursor: Change Settings
 * @desc Change the Message Cursor settings used.
 *
 * @arg MsgCursor:struct
 * @text Change Settings
 * @type struct<MsgCursor>
 * @desc Change the Message Cursor settings.
 * @default {"General":"","Enable:eval":"true","GraphicType:str":"icon","Icon":"","IconIndex:str":"188","FlipMultiplier:str":"0.125","Image":"","Filename:str":"","Rows:num":"1","Cols:num":"1","FrameDelay:num":"4","Appearance":"","AnchorX:num":"0.5","AnchorY:num":"1","OffsetX:num":"+0","OffsetY:num":"-4"}
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command MessageTailSettings
 * @text Message Tail: Change Settings
 * @desc Change the Message Tail settings.
 *
 * @arg Settings:struct
 * @text Message Tail Settings
 * @type struct<MsgTail>
 * @desc Message Tail settings used for Message Windows.
 * Requires images and text codes to appear.
 * @default {"AutoPosition":"","autoPositionTail:eval":"true","autoPositionLeft:eval":"true","autoPositionOffsetX:num":"+0","autoPositionOffsetY:num":"+0","TailDir":"","BottomLeft":"","bottomLeftFilename:str":"","bottomLeftAnchorX:num":"0.5","bottomLeftAnchorY:num":"0.0","bottomLeftOffsetX:num":"+0","bottomLeftOffsetY:num":"+0","BottomRight":"","bottomRightFilename:str":"","bottomRightAnchorX:num":"0.5","bottomRightAnchorY:num":"0.0","bottomRightOffsetX:num":"+0","bottomRightOffsetY:num":"+0","UpperLeft":"","upperLeftFilename:str":"","upperLeftAnchorX:num":"0.5","upperLeftAnchorY:num":"1.0","upperLeftOffsetX:num":"+0","upperLeftOffsetY:num":"+0","UpperRight":"","upperRightFilename:str":"","upperRightAnchorX:num":"0.5","upperRightAnchorY:num":"1.0","upperRightOffsetX:num":"+0","upperRightOffsetY:num":"+0"}
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
 * @param ExtMessageFunc
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Auto:struct
 * @text Auto-Forward Settings
 * @type struct<Auto>
 * @desc Auto-Forward settings used for this game.
 * @default {"WaitPerChar:num":"6","MinimumWait:num":"300"}
 *
 * @param FastFwd:struct
 * @text Fast Forward (Extended)
 * @type struct<FastFwd>
 * @desc Extended Fast Forward settings used for this game.
 * @default {"Enable:eval":"true","Speed:num":"8","SceneChangeReset:eval":"true"}
 *
 * @param MsgButtonConsole:struct
 * @text Message Button Console
 * @type struct<MsgButtonConsole>
 * @desc Message Button Console settings used for this game.
 * @default {"General":"","ShowDefault:eval":"true","Position:str":"bottom","Appearance":"","WindowSkin:str":"Window","FontFace:str":"Arial","FontSize:num":"18","TextColors":"","NormalColor:str":"0","ToggledColor:str":"24","DisabledColor:str":"7","Visuals":"","ButtonWidth:num":"86","ButtonHeight:num":"36","ButtonBuffer:num":"6"}
 *
 * @param Buttons:struct
 * @text Button Settings
 * @parent MsgButtonConsole:struct
 * @type struct<Buttons>
 * @desc Settings for which buttons appear and how they appear.
 * @default {"General":"","List:arraystr":"[\"auto\",\"fastFwd\",\"log\",\"hide\",\"save\",\"load\",\"options\",\"gameEnd\"]","AutoKey:str":"none","Shortcuts":"","SaveKey:str":"none","LoadKey:str":"none","OptionsKey:str":"none","GameEndKey:str":"none","Vocab":"","Auto:str":"AUTO","FastFwd:str":"FAST","Save:str":"SAVE","Load:str":"LOAD","Options:str":"CONFIG","GameEnd:str":"TITLE"}
 *
 * @param MsgCursor:struct
 * @text Message Cursor Settings
 * @type struct<MsgCursor>
 * @desc Message Cursor settings used for this game.
 * @default {"General":"","Enable:eval":"true","GraphicType:str":"icon","Icon":"","IconIndex:str":"188","FlipMultiplier:str":"0.125","Image":"","Filename:str":"","Rows:num":"1","Cols:num":"1","FrameDelay:num":"4","Appearance":"","AnchorX:num":"0.5","AnchorY:num":"1","OffsetX:num":"+0","OffsetY:num":"-4"}
 *
 * @param MsgTail:struct
 * @text Message Tail Settings
 * @type struct<MsgTail>
 * @desc Message Tail settings used for Message Windows.
 * Requires images and text codes to appear.
 * @default {"AutoPosition":"","autoPositionTail:eval":"true","autoPositionLeft:eval":"true","autoPositionOffsetX:num":"+0","autoPositionOffsetY:num":"+0","TailDir":"","BottomLeft":"","bottomLeftFilename:str":"","bottomLeftAnchorX:num":"0.5","bottomLeftAnchorY:num":"0.0","bottomLeftOffsetX:num":"+0","bottomLeftOffsetY:num":"+0","BottomRight":"","bottomRightFilename:str":"","bottomRightAnchorX:num":"0.5","bottomRightAnchorY:num":"0.0","bottomRightOffsetX:num":"+0","bottomRightOffsetY:num":"+0","UpperLeft":"","upperLeftFilename:str":"","upperLeftAnchorX:num":"0.5","upperLeftAnchorY:num":"1.0","upperLeftOffsetX:num":"+0","upperLeftOffsetY:num":"+0","UpperRight":"","upperRightFilename:str":"","upperRightAnchorX:num":"0.5","upperRightAnchorY:num":"1.0","upperRightOffsetX:num":"+0","upperRightOffsetY:num":"+0"}
 *
 * @param ScrollWheel:struct
 * @text Scroll Wheel Settings
 * @type struct<ScrollWheel>
 * @desc Emulates Eastern Visual Novel controls regarding mouse scroll wheel functionality.
 * @default {"Enable:eval":"true","ScrollDownNext:eval":"true","ScrollUpMsgLog:eval":"true"}
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
 * Auto-Forward Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Auto:
 *
 * @param WaitPerChar:num
 * @text Wait per Character
 * @parent General
 * @type number
 * @min 1
 * @desc How many frames should the game wait per character?
 * Average: 60 frames per second.
 * @default 6
 *
 * @param MinimumWait:num
 * @text Minimum Wait
 * @parent General
 * @type number
 * @min 1
 * @desc What is the minimum amount of frames to wait?
 * Average: 60 frames per second.
 * @default 300
 * 
 * @param VoiceAct
 * @text Compatibility
 * @default VisuMZ_2_VoiceActControl
 *
 * @param VoiceActAutoPadding:num
 * @text Voice Act Padding
 * @parent VoiceAct
 * @type number
 * @min 1
 * @desc How many frames to wait after a voice line finishes?
 * Average: 60 frames per second.
 * @default 60
 *
 */
/* ----------------------------------------------------------------------------
 * Extended Fast Forward Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~FastFwd:
 *
 * @param Enable:eval
 * @text Enable?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable or disable the Extended Fast Forward feature?
 * @default true
 *
 * @param Speed:num
 * @text Speed
 * @parent General
 * @type number
 * @min 2
 * @desc What is the speed at which Extended Fast Forward works at?
 * Higher numbers are faster.
 * @default 8
 *
 * @param SceneChangeReset:eval
 * @text Reset on Scene Change?
 * @parent General
 * @type boolean
 * @on Reset
 * @off Keep
 * @desc Reset Fast Forward setting on scene changes (ie battle, menu, or map transfers)?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Message Button Console Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MsgButtonConsole:
 *
 * @param General
 *
 * @param ShowDefault:eval
 * @text Show by Default?
 * @parent General
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show or hide the Message Button Console by default?
 * @default true
 *
 * @param Position:str
 * @text Position
 * @parent General
 * @type select
 * @option Top of Message Window
 * @value top
 * @option Bottom of Message Window
 * @value bottom
 * @desc Where do you wish to display the Message Button Console?
 * @default bottom
 *
 * @param AutoSizeHide:eval
 * @text Auto-Size Hide?
 * @parent General
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Hide the button console when using auto-size text codes?
 * @default false
 *
 * @param Appearance
 *
 * @param WindowSkin:str
 * @text Window Skin
 * @parent Appearance
 * @type file
 * @dir img/system/
 * @require 1
 * @desc What is the window skin used for the buttons?
 * Ignore if using Background Images.
 * @default Window
 *
 * @param FontFace:str
 * @text Font Name
 * @parent Appearance
 * @desc What font do you wish to use for the Message Button Console?
 * @default Arial
 *
 * @param FontSize:num
 * @text Font Size
 * @parent FontFace:str
 * @type number
 * @min 1
 * @desc What font size do you wish to use for the Message Button Console?
 * @default 18
 * 
 * @param TextColors
 * @text Text Colors
 * @parent Appearance
 *
 * @param NormalColor:str
 * @text Normal Color
 * @parent TextColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ToggledColor:str
 * @text Toggled Color
 * @parent TextColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param DisabledColor:str
 * @text Disabled Color
 * @parent TextColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 7
 *
 * @param Visuals
 * @text Button Visuals
 * @parent Appearance
 *
 * @param ButtonOffsetX:num
 * @text Offset X
 * @parent Visuals
 * @desc Offsets the buttons x position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param ButtonOffsetY:num
 * @text Offset Y
 * @parent Visuals
 * @desc Offsets the buttons y position.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param ButtonWidth:num
 * @text Width
 * @parent Visuals
 * @type number
 * @min 1
 * @desc What is the width of each button?
 * @default 86
 *
 * @param ButtonHeight:num
 * @text Height
 * @parent Visuals
 * @type number
 * @min 1
 * @desc What is the height of each button?
 * @default 36
 *
 * @param ButtonBuffer:num
 * @text Buffer
 * @parent Visuals
 * @type number
 * @min 1
 * @desc What is the buffer between each button?
 * @default 6
 *
 * @param Images
 * @text Background Images
 * @parent Appearance
 *
 * @param ImgDisabled:str
 * @text Disabled Image
 * @parent Images
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the background image when the button is disabled.
 * @default 
 *
 * @param ImgDisabledOffsetX:num
 * @text Offset X
 * @parent ImgDisabled:str
 * @desc Offsets the X position of this image.
 * Negative: left; Positive: right
 * @default +0
 *
 * @param ImgDisabledOffsetY:num
 * @text Offset Y
 * @parent ImgDisabled:str
 * @desc Offsets the Y position of this image.
 * Negative: up; Positive: down
 * @default +0
 *
 * @param ImgEnabled:str
 * @text Enabled Image
 * @parent Images
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the background image when the button is enabled.
 * @default 
 *
 * @param ImgEnabledOffsetX:num
 * @text Offset X
 * @parent ImgEnabled:str
 * @desc Offsets the X position of this image.
 * Negative: left; Positive: right
 * @default +0
 *
 * @param ImgEnabledOffsetY:num
 * @text Offset Y
 * @parent ImgEnabled:str
 * @desc Offsets the Y position of this image.
 * Negative: up; Positive: down
 * @default +0
 *
 * @param ImgToggled:str
 * @text Toggled Image
 * @parent Images
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the background image when the button is toggled.
 * @default 
 *
 * @param ImgToggledOffsetX:num
 * @text Offset X
 * @parent ImgToggled:str
 * @desc Offsets the X position of this image.
 * Negative: left; Positive: right
 * @default +0
 *
 * @param ImgToggledOffsetY:num
 * @text Offset Y
 * @parent ImgToggled:str
 * @desc Offsets the Y position of this image.
 * Negative: up; Positive: down
 * @default +0
 *
 */
/* ----------------------------------------------------------------------------
 * Buttons Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Buttons:
 *
 * @param General
 *
 * @param List:arraystr
 * @text List
 * @parent General
 * @type combo[]
 * @option auto
 * @option log
 * @option fastFwd
 * @option gameEnd
 * @option hide
 * @option load
 * @option options
 * @option save
 * @desc Which buttons appear and in what order?
 * Some commands require certain plugins installed.
 * @default ["auto","fastFwd","log","hide","save","load","options","gameEnd"]
 * 
 * @param Shortcuts
 * @text Shortcut Keys
 *
 * @param AutoKey:str
 * @text Auto-Forward Key
 * @parent General
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for auto-forwarding messages.
 * @default none
 * 
 * @param SaveKey:str
 * @text Save Key
 * @parent Shortcuts
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for quick saving.
 * Requires VisuMZ_1_SaveCore!
 * @default none
 * 
 * @param LoadKey:str
 * @text Load Key
 * @parent Shortcuts
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for quick load.
 * Requires VisuMZ_1_SaveCore!
 * @default none
 * 
 * @param OptionsKey:str
 * @text Options Key
 * @parent Shortcuts
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for opening options.
 * Requires VisuMZ_1_OptionsCore!
 * @default none
 * 
 * @param GameEndKey:str
 * @text Game End Key
 * @parent Shortcuts
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for ending the game.
 * @default none
 *
 * @param Vocab
 * @text Vocabulary
 *
 * @param Auto:str
 * @text Auto-Forward
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * @default AUTO
 *
 * @param FastFwd:str
 * @text Fast Forward
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * @default FAST
 *
 * @param Save:str
 * @text Save Game
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * Requires VisuMZ_1_SaveCore!
 * @default SAVE
 *
 * @param Load:str
 * @text Load Game
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * Requires VisuMZ_1_SaveCore!
 * @default LOAD
 *
 * @param Options:str
 * @text Options
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * Requires VisuMZ_1_OptionsCore!
 * @default CONFIG
 *
 * @param GameEnd:str
 * @text Game End
 * @parent Vocab
 * @desc How is this option's text displayed in-game?
 * @default TITLE
 *
 */
/* ----------------------------------------------------------------------------
 * Message Cursor Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MsgCursor:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable or disable the message cursor?
 * @default true
 *
 * @param GraphicType:str
 * @text Graphic Type
 * @parent General
 * @type select
 * @option Icon - From img/system/IconSet.png
 * @value icon
 * @option Image - An animated image from img/system/
 * @value image
 * @option Window Skin - Use the default Window Skin cursor
 * @value windowskin
 * @desc What is the cursor's graphic type?
 * @default icon
 * 
 * @param Icon
 *
 * @param IconIndex:str
 * @text Icon Index
 * @parent Icon
 * @desc This is icon used for the Message Cursor.
 * @default 188
 *
 * @param FlipMultiplier:str
 * @text Flip Speed Multiplier
 * @parent Icon
 * @desc What is the flip speed multiplier for the Message Cursor?
 * Use 0 for no flipping.
 * @default 1
 * 
 * @param Image
 *
 * @param Filename:str
 * @text Filename
 * @parent Image
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the image found inside the img/system/ folder.
 * @default 
 *
 * @param Rows:num
 * @text Image Rows
 * @parent Image
 * @type number
 * @min 1
 * @desc How many rows are there for the image?
 * @default 1
 *
 * @param Cols:num
 * @text Image Columns
 * @parent Image
 * @type number
 * @min 1
 * @desc How many columns are there for the image?
 * @default 1
 *
 * @param FrameDelay:num
 * @text Frame Delay
 * @parent Image
 * @type number
 * @min 1
 * @desc How many frames delayed are there per animated cell?
 * @default 4
 * 
 * @param Appearance
 *
 * @param AnchorX:num
 * @text Anchor X
 * @parent Appearance
 * @desc Determine the Message Cursor's X position.
 * Use a number between 0 and 1 for best results.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor Y
 * @parent Appearance
 * @desc Determine the Message Cursor's Y position.
 * Use a number between 0 and 1 for best results.
 * @default 1
 *
 * @param OffsetX:num
 * @text Offset X
 * @parent Appearance
 * @desc Offset the Message Cursor's X position by how many pixels?
 * @default +0
 *
 * @param OffsetY:num
 * @text Offset Y
 * @parent Appearance
 * @desc Offset the Message Cursor's Y position by how many pixels?
 * @default -8
 *
 */
/* ----------------------------------------------------------------------------
 * Message Tail Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MsgTail:
 *
 * @param AutoPosition
 * @text Auto-Position
 *
 * @param autoPositionTail:eval
 * @text Enable?
 * @parent AutoPosition
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Show Message Tails with Auto-Position text codes?
 * @default true
 *
 * @param autoPositionLeft:eval
 * @text Face Left?
 * @parent AutoPosition
 * @type boolean
 * @on Face Left
 * @off Face Right
 * @desc Which direction does the Message Tail point to?
 * @default true
 *
 * @param autoCorrectX:eval
 * @text Auto-Correct X
 * @parent AutoPosition
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Auto-corrects Message Tail position X when used with
 * Auto-Position but are too close to edge of screen.
 * @default true
 *
 * @param autoPositionOffsetX:num
 * @text Offset X
 * @parent AutoPosition
 * @desc Message Window's X offset with auto-position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param autoPositionOffsetY:num
 * @text Offset Y
 * @parent AutoPosition
 * @desc Message Window's Y offset with auto-position.
 * Negative: up. Positive: down.
 * @default +0
 * 
 * @param TailDir
 * @text Tail Directions
 *
 * @param BottomLeft
 * @text Bottom Left
 * @parent TailDir
 *
 * @param bottomLeftFilename:str
 * @text Filename
 * @parent BottomLeft
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the Message Tail graphic going towards
 * the bottom left.
 * @default 
 *
 * @param bottomLeftAnchorX:num
 * @text Anchor X
 * @parent BottomLeft
 * @desc Anchor value X. Use a number between 0 and 1.
 * 0.0 - Left; 0.5 - Center; 1.0 - Right
 * @default 0.5
 *
 * @param bottomLeftAnchorY:num
 * @text Anchor Y
 * @parent BottomLeft
 * @desc Anchor value Y. Use a number between 0 and 1.
 * 0.0 - Top; 0.5 - Middle; 1.0 - Bottom
 * @default 0.0
 *
 * @param bottomLeftOffsetX:num
 * @text Offset X
 * @parent BottomLeft
 * @desc Offset the Message Tail's X position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param bottomLeftOffsetY:num
 * @text Offset Y
 * @parent BottomLeft
 * @desc Offset the Message Tail's Y position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param BottomRight
 * @text Bottom Right
 * @parent TailDir
 *
 * @param bottomRightFilename:str
 * @text Filename
 * @parent BottomRight
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the Message Tail graphic going towards
 * the bottom right.
 * @default 
 *
 * @param bottomRightAnchorX:num
 * @text Anchor X
 * @parent BottomRight
 * @desc Anchor value X. Use a number between 0 and 1.
 * 0.0 - Left; 0.5 - Center; 1.0 - Right
 * @default 0.5
 *
 * @param bottomRightAnchorY:num
 * @text Anchor Y
 * @parent BottomRight
 * @desc Anchor value Y. Use a number between 0 and 1.
 * 0.0 - Top; 0.5 - Middle; 1.0 - Bottom
 * @default 0.0
 *
 * @param bottomRightOffsetX:num
 * @text Offset X
 * @parent BottomRight
 * @desc Offset the Message Tail's X position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param bottomRightOffsetY:num
 * @text Offset Y
 * @parent BottomRight
 * @desc Offset the Message Tail's Y position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param UpperLeft
 * @text Upper Left
 * @parent TailDir
 *
 * @param upperLeftFilename:str
 * @text Filename
 * @parent UpperLeft
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the Message Tail graphic going towards
 * the upper left.
 * @default 
 *
 * @param upperLeftAnchorX:num
 * @text Anchor X
 * @parent UpperLeft
 * @desc Anchor value X. Use a number between 0 and 1.
 * 0.0 - Left; 0.5 - Center; 1.0 - Right
 * @default 0.5
 *
 * @param upperLeftAnchorY:num
 * @text Anchor Y
 * @parent UpperLeft
 * @desc Anchor value Y. Use a number between 0 and 1.
 * 0.0 - Top; 0.5 - Middle; 1.0 - Bottom
 * @default 1.0
 *
 * @param upperLeftOffsetX:num
 * @text Offset X
 * @parent UpperLeft
 * @desc Offset the Message Tail's X position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param upperLeftOffsetY:num
 * @text Offset Y
 * @parent UpperLeft
 * @desc Offset the Message Tail's Y position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param UpperRight
 * @text Upper Right
 * @parent TailDir
 *
 * @param upperRightFilename:str
 * @text Filename
 * @parent UpperRight
 * @type file
 * @dir img/system/
 * @require 1
 * @desc Filename of the Message Tail graphic going towards
 * the upper right.
 * @default 
 *
 * @param upperRightAnchorX:num
 * @text Anchor X
 * @parent UpperRight
 * @desc Anchor value X. Use a number between 0 and 1.
 * 0.0 - Left; 0.5 - Center; 1.0 - Right
 * @default 0.5
 *
 * @param upperRightAnchorY:num
 * @text Anchor Y
 * @parent UpperRight
 * @desc Anchor value Y. Use a number between 0 and 1.
 * 0.0 - Top; 0.5 - Middle; 1.0 - Bottom
 * @default 1.0
 *
 * @param upperRightOffsetX:num
 * @text Offset X
 * @parent UpperRight
 * @desc Offset the Message Tail's X position.
 * Negative: left. Positive: right.
 * @default +0
 *
 * @param upperRightOffsetY:num
 * @text Offset Y
 * @parent UpperRight
 * @desc Offset the Message Tail's Y position.
 * Negative: left. Positive: right.
 * @default +0
 *
 */
/* ----------------------------------------------------------------------------
 * Scroll Wheel Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScrollWheel:
 *
 * @param Enable:eval
 * @text Enable?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable disable scroll wheel controls? Temporarily disabled
 * during support windows (Show Choice, Input Number, etc.)
 * @default true
 *
 * @param ScrollDownNext:eval
 * @text Scroll Down: Next?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Set "Scroll Down" to "Next"?
 * @default true
 *
 * @param ScrollUpMsgLog:eval
 * @text Scroll Up: Log?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Set "Scroll Up" to "Message Log"?
 * Requires VisuMZ_3_MessageLog!
 * @default true
 *
 */
//=============================================================================

const _0x2833f3=_0x33cf;(function(_0x320705,_0x7315f5){const _0x63dccf=_0x33cf,_0xceb237=_0x320705();while(!![]){try{const _0x1e2abf=-parseInt(_0x63dccf(0x283))/0x1*(parseInt(_0x63dccf(0x1c4))/0x2)+-parseInt(_0x63dccf(0x279))/0x3+parseInt(_0x63dccf(0x268))/0x4+parseInt(_0x63dccf(0x27f))/0x5*(parseInt(_0x63dccf(0x1ec))/0x6)+-parseInt(_0x63dccf(0x1b5))/0x7*(parseInt(_0x63dccf(0x2e0))/0x8)+-parseInt(_0x63dccf(0x25d))/0x9*(-parseInt(_0x63dccf(0x302))/0xa)+parseInt(_0x63dccf(0x325))/0xb*(parseInt(_0x63dccf(0x2f2))/0xc);if(_0x1e2abf===_0x7315f5)break;else _0xceb237['push'](_0xceb237['shift']());}catch(_0x132e56){_0xceb237['push'](_0xceb237['shift']());}}}(_0x1305,0x2afe0));var label=_0x2833f3(0x281),tier=tier||0x0,dependencies=[_0x2833f3(0x313)],pluginData=$plugins[_0x2833f3(0x24e)](function(_0x4841fc){const _0x1873b2=_0x2833f3;return _0x4841fc[_0x1873b2(0x2c2)]&&_0x4841fc[_0x1873b2(0x20e)][_0x1873b2(0x254)]('['+label+']');})[0x0];VisuMZ[label][_0x2833f3(0x277)]=VisuMZ[label][_0x2833f3(0x277)]||{},VisuMZ[_0x2833f3(0x2ec)]=function(_0x54ce72,_0xacff61){const _0x258fe1=_0x2833f3;for(const _0x1348fb in _0xacff61){if(_0x1348fb[_0x258fe1(0x23f)](/(.*):(.*)/i)){const _0xd4b7f9=String(RegExp['$1']),_0x499ef5=String(RegExp['$2'])[_0x258fe1(0x28d)]()[_0x258fe1(0x29a)]();let _0x2f01fa,_0x329795,_0x55d4b2;switch(_0x499ef5){case _0x258fe1(0x285):_0x2f01fa=_0xacff61[_0x1348fb]!==''?Number(_0xacff61[_0x1348fb]):0x0;break;case _0x258fe1(0x233):_0x329795=_0xacff61[_0x1348fb]!==''?JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795[_0x258fe1(0x1f3)](_0x317b1d=>Number(_0x317b1d));break;case'EVAL':_0x2f01fa=_0xacff61[_0x1348fb]!==''?eval(_0xacff61[_0x1348fb]):null;break;case'ARRAYEVAL':_0x329795=_0xacff61[_0x1348fb]!==''?JSON['parse'](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795['map'](_0x4919f8=>eval(_0x4919f8));break;case _0x258fe1(0x25b):_0x2f01fa=_0xacff61[_0x1348fb]!==''?JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb]):'';break;case _0x258fe1(0x21f):_0x329795=_0xacff61[_0x1348fb]!==''?JSON['parse'](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795[_0x258fe1(0x1f3)](_0x3dfa84=>JSON[_0x258fe1(0x280)](_0x3dfa84));break;case _0x258fe1(0x276):_0x2f01fa=_0xacff61[_0x1348fb]!==''?new Function(JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb])):new Function(_0x258fe1(0x2f1));break;case'ARRAYFUNC':_0x329795=_0xacff61[_0x1348fb]!==''?JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795[_0x258fe1(0x1f3)](_0x58e8e2=>new Function(JSON[_0x258fe1(0x280)](_0x58e8e2)));break;case'STR':_0x2f01fa=_0xacff61[_0x1348fb]!==''?String(_0xacff61[_0x1348fb]):'';break;case _0x258fe1(0x1e1):_0x329795=_0xacff61[_0x1348fb]!==''?JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795[_0x258fe1(0x1f3)](_0x26b98b=>String(_0x26b98b));break;case'STRUCT':_0x55d4b2=_0xacff61[_0x1348fb]!==''?JSON[_0x258fe1(0x280)](_0xacff61[_0x1348fb]):{},_0x2f01fa=VisuMZ[_0x258fe1(0x2ec)]({},_0x55d4b2);break;case'ARRAYSTRUCT':_0x329795=_0xacff61[_0x1348fb]!==''?JSON['parse'](_0xacff61[_0x1348fb]):[],_0x2f01fa=_0x329795[_0x258fe1(0x1f3)](_0x326269=>VisuMZ[_0x258fe1(0x2ec)]({},JSON['parse'](_0x326269)));break;default:continue;}_0x54ce72[_0xd4b7f9]=_0x2f01fa;}}return _0x54ce72;},(_0x187458=>{const _0x14a086=_0x2833f3,_0x7c7176=_0x187458[_0x14a086(0x32b)];for(const _0x56661a of dependencies){if(!Imported[_0x56661a]){alert(_0x14a086(0x307)['format'](_0x7c7176,_0x56661a)),SceneManager[_0x14a086(0x1e7)]();break;}}const _0x354414=_0x187458[_0x14a086(0x20e)];if(_0x354414['match'](/\[Version[ ](.*?)\]/i)){const _0x478d0c=Number(RegExp['$1']);_0x478d0c!==VisuMZ[label][_0x14a086(0x252)]&&(alert(_0x14a086(0x251)[_0x14a086(0x1c1)](_0x7c7176,_0x478d0c)),SceneManager[_0x14a086(0x1e7)]());}if(_0x354414[_0x14a086(0x23f)](/\[Tier[ ](\d+)\]/i)){const _0x4bdad4=Number(RegExp['$1']);_0x4bdad4<tier?(alert(_0x14a086(0x267)[_0x14a086(0x1c1)](_0x7c7176,_0x4bdad4,tier)),SceneManager[_0x14a086(0x1e7)]()):tier=Math['max'](_0x4bdad4,tier);}VisuMZ['ConvertParams'](VisuMZ[label][_0x14a086(0x277)],_0x187458['parameters']);})(pluginData),PluginManager[_0x2833f3(0x2da)](pluginData[_0x2833f3(0x32b)],_0x2833f3(0x1c0),_0xde3096=>{const _0x4e144d=_0x2833f3;VisuMZ[_0x4e144d(0x2ec)](_0xde3096,_0xde3096);const _0x4ce6e6=!_0xde3096['Allow'];$gameSystem[_0x4e144d(0x327)](_0x4ce6e6);}),PluginManager['registerCommand'](pluginData[_0x2833f3(0x32b)],_0x2833f3(0x298),_0x284e0d=>{const _0x2a577f=_0x2833f3;VisuMZ['ConvertParams'](_0x284e0d,_0x284e0d);const _0x269746=_0x284e0d[_0x2a577f(0x22f)];$gameSystem[_0x2a577f(0x217)](_0x269746);}),PluginManager[_0x2833f3(0x2da)](pluginData[_0x2833f3(0x32b)],_0x2833f3(0x29d),_0x274561=>{const _0x4fc331=_0x2833f3;VisuMZ[_0x4fc331(0x2ec)](_0x274561,_0x274561);const _0x14fa49=_0x274561[_0x4fc331(0x273)];$gameSystem['setMessageCursorSettings'](_0x14fa49);const _0x41dc3b=SceneManager[_0x4fc331(0x29e)][_0x4fc331(0x230)];_0x41dc3b&&(_0x41dc3b['_createPauseSignSprites'](),_0x41dc3b[_0x4fc331(0x225)]());}),PluginManager['registerCommand'](pluginData[_0x2833f3(0x32b)],_0x2833f3(0x30c),_0x5621be=>{const _0xb3f881=_0x2833f3;VisuMZ[_0xb3f881(0x2ec)](_0x5621be,_0x5621be),$gameSystem['setMessageTailSettings'](_0x5621be[_0xb3f881(0x277)]);}),TextManager['msgButtonConsole']=function(_0x5ce59a){const _0xc8398a=_0x2833f3;if(Window_ButtonConsole['VOCAB'][_0x5ce59a])return Window_ButtonConsole[_0xc8398a(0x1eb)][_0x5ce59a];return _0x5ce59a['toUpperCase']()[_0xc8398a(0x29a)]();},ColorManager[_0x2833f3(0x2f6)]=function(_0x3b2fe9){const _0x128540=_0x2833f3;return _0x3b2fe9=String(_0x3b2fe9),_0x3b2fe9['match'](/#(.*)/i)?'#%1'[_0x128540(0x1c1)](String(RegExp['$1'])):this['textColor'](Number(_0x3b2fe9));},SceneManager[_0x2833f3(0x2b5)]=function(){const _0x3afe1e=_0x2833f3;return this[_0x3afe1e(0x29e)]&&this[_0x3afe1e(0x29e)][_0x3afe1e(0x228)]===Scene_Battle;},SceneManager[_0x2833f3(0x2dd)]=function(){const _0x522690=_0x2833f3;return this['_scene']&&this['_scene'][_0x522690(0x228)]===Scene_Map;},VisuMZ[_0x2833f3(0x281)]['SceneManager_push']=SceneManager[_0x2833f3(0x1ca)],SceneManager['push']=function(_0x551751){const _0xd98eb=_0x2833f3;VisuMZ[_0xd98eb(0x281)]['SceneManager_push']['call'](this,_0x551751),[Scene_SaveButtonConsole,Scene_Save,Scene_Load][_0xd98eb(0x254)](_0x551751)&&this[_0xd98eb(0x1c5)]();},SceneManager[_0x2833f3(0x1c5)]=function(){const _0x1150fc=_0x2833f3;for(const _0x1e22b0 of $gameParty[_0x1150fc(0x246)]()){_0x1e22b0[_0x1150fc(0x321)]()&&ImageManager[_0x1150fc(0x2c5)](_0x1e22b0[_0x1150fc(0x321)]()),_0x1e22b0[_0x1150fc(0x1f7)]()&&ImageManager['loadCharacter'](_0x1e22b0[_0x1150fc(0x1f7)]()),_0x1e22b0['battlerName']()&&ImageManager[_0x1150fc(0x26f)](_0x1e22b0['battlerName']());}},Game_Temp['prototype']['isMessageAutoForwardMode']=function(){const _0x318cbd=_0x2833f3;return this[_0x318cbd(0x295)];},Game_Temp[_0x2833f3(0x22e)][_0x2833f3(0x263)]=function(_0x51072c){const _0x2b77c9=_0x2833f3;this[_0x2b77c9(0x295)]=_0x51072c,$gameMessage['refreshButtonConsole']();},Game_Temp['prototype'][_0x2833f3(0x291)]=function(){const _0x2d91dc=_0x2833f3;return this[_0x2d91dc(0x2f3)];},Game_Temp['prototype'][_0x2833f3(0x2bc)]=function(_0x5e85b1){const _0x30b1b8=_0x2833f3;this[_0x30b1b8(0x2f3)]=_0x5e85b1,$gameMessage['refreshButtonConsole']();},VisuMZ['ExtMessageFunc'][_0x2833f3(0x2d0)]=Game_Temp['prototype']['requestAnimation'],Game_Temp[_0x2833f3(0x22e)]['requestAnimation']=function(_0x58f18b,_0x15a6cb,_0x5cdbf5){const _0x20650f=_0x2833f3;if(this[_0x20650f(0x2e8)]())return;VisuMZ[_0x20650f(0x281)][_0x20650f(0x2d0)][_0x20650f(0x1d0)](this,_0x58f18b,_0x15a6cb,_0x5cdbf5);},Game_Temp[_0x2833f3(0x22e)][_0x2833f3(0x2e8)]=function(){const _0x3889f1=_0x2833f3,_0x3351d5=SceneManager[_0x3889f1(0x29e)];return _0x3351d5&&_0x3351d5[_0x3889f1(0x291)]&&_0x3351d5[_0x3889f1(0x291)]();},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x223)]=Game_System[_0x2833f3(0x22e)][_0x2833f3(0x32d)],Game_System[_0x2833f3(0x22e)]['initialize']=function(){const _0x21e043=_0x2833f3;VisuMZ['ExtMessageFunc'][_0x21e043(0x223)][_0x21e043(0x1d0)](this),this['initMessageButtonConsole'](),this[_0x21e043(0x1f9)](),this[_0x21e043(0x296)]();},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x201)]=function(){const _0x232653=_0x2833f3;this[_0x232653(0x2cc)]=Window_ButtonConsole[_0x232653(0x1f8)];},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x310)]=function(){const _0x2385c0=_0x2833f3;return this['_messageButtonConsoleVisible']===undefined&&this[_0x2385c0(0x201)](),this[_0x2385c0(0x2cc)];},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x217)]=function(_0x541363){const _0x234cd3=_0x2833f3;this[_0x234cd3(0x2cc)]===undefined&&this[_0x234cd3(0x201)](),this[_0x234cd3(0x2cc)]=_0x541363;},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x1f9)]=function(){const _0x76a5f6=_0x2833f3;this[_0x76a5f6(0x1c7)]=![];},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x255)]=function(){const _0x1053fc=_0x2833f3;return this[_0x1053fc(0x1c7)]===undefined&&this[_0x1053fc(0x1f9)](),this[_0x1053fc(0x1c7)];},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x327)]=function(_0x1e9681){const _0x31c814=_0x2833f3;this[_0x31c814(0x1c7)]===undefined&&this['initExtendedFastForward'](),this['_disallowFastForward']=_0x1e9681;},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x296)]=function(){const _0x8a7ad8=_0x2833f3;this['_msgCursorSettings']=JsonEx['makeDeepCopy'](VisuMZ[_0x8a7ad8(0x281)]['Settings'][_0x8a7ad8(0x273)]);},Game_System[_0x2833f3(0x22e)][_0x2833f3(0x2a0)]=function(){const _0x176765=_0x2833f3;return this['_msgCursorSettings']===undefined&&this[_0x176765(0x296)](),this[_0x176765(0x2e3)];},Game_System[_0x2833f3(0x22e)]['setMessageCursorSettings']=function(_0x69cff){const _0xb22464=_0x2833f3;this['_msgCursorSettings']===undefined&&this['initMessageCursorSettings'](),this[_0xb22464(0x2e3)]=JsonEx[_0xb22464(0x24d)](_0x69cff);},Game_System['prototype']['getMessageTailSettings']=function(){const _0x56ba7a=_0x2833f3;if(this['_messageTailSettings']===undefined){const _0xd824ce=VisuMZ['ExtMessageFunc'][_0x56ba7a(0x277)][_0x56ba7a(0x2b9)];this[_0x56ba7a(0x2d8)]=JsonEx[_0x56ba7a(0x24d)](_0xd824ce);}return this[_0x56ba7a(0x2d8)];},Game_System[_0x2833f3(0x22e)]['setMessageTailSettings']=function(_0x360a14){const _0x5aaf8d=_0x2833f3;this[_0x5aaf8d(0x2d8)]=JsonEx[_0x5aaf8d(0x24d)](_0x360a14);},Game_Message[_0x2833f3(0x22e)][_0x2833f3(0x1cd)]=function(){const _0x111b7c=_0x2833f3,_0x316d84=SceneManager[_0x111b7c(0x29e)];if(!_0x316d84)return;const _0x2f4cb9=_0x316d84['_messageWindow'];if(!_0x2f4cb9)return;_0x2f4cb9[_0x111b7c(0x1cd)]();},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x1bd)]=Scene_Boot[_0x2833f3(0x22e)][_0x2833f3(0x2d3)],Scene_Boot['prototype']['loadSystemImages']=function(){const _0x477fd2=_0x2833f3;VisuMZ[_0x477fd2(0x281)][_0x477fd2(0x1bd)][_0x477fd2(0x1d0)](this),this[_0x477fd2(0x250)]();},Scene_Boot[_0x2833f3(0x22e)][_0x2833f3(0x250)]=function(){const _0x844fd6=_0x2833f3,_0xc78e=VisuMZ[_0x844fd6(0x281)][_0x844fd6(0x277)][_0x844fd6(0x298)],_0x39570e=[_0x844fd6(0x293),'ImgEnabled',_0x844fd6(0x2ef)];for(const _0x32fbbd of _0x39570e){_0xc78e[_0x32fbbd]=_0xc78e[_0x32fbbd]??'',_0xc78e[_0x32fbbd]!==''&&ImageManager['loadSystem'](_0xc78e[_0x32fbbd]);}},Scene_Message['EXT_FAST_FORWARD_ENABLED']=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x331)]['Enable'],Scene_Message[_0x2833f3(0x1ee)]=VisuMZ[_0x2833f3(0x281)]['Settings'][_0x2833f3(0x331)][_0x2833f3(0x328)],Scene_Message['EXT_FAST_FORWARD_STOP_ON_SCENE_CHANGE']=VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)][_0x2833f3(0x331)]['SceneChangeReset']??!![],VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x26e)]=Scene_Message[_0x2833f3(0x22e)][_0x2833f3(0x21b)],Scene_Message[_0x2833f3(0x22e)]['createAllWindows']=function(){const _0x5487b8=_0x2833f3;VisuMZ['ExtMessageFunc'][_0x5487b8(0x26e)][_0x5487b8(0x1d0)](this),Scene_Message[_0x5487b8(0x1f0)]&&$gameTemp[_0x5487b8(0x2bc)](![]);},Scene_Message[_0x2833f3(0x22e)]['isExtendedFastForwardMode']=function(){const _0x4fae66=_0x2833f3;if(!Scene_Message[_0x4fae66(0x1d9)])return![];if($gameSystem[_0x4fae66(0x255)]())return![];if(this[_0x4fae66(0x21e)]())return![];return this['isActivatedExtendedFastForwardMode']();},Scene_Message[_0x2833f3(0x22e)][_0x2833f3(0x269)]=function(){const _0x53c614=_0x2833f3;if(Imported['VisuMZ_2_FurnitureSystem']&&$gameMap[_0x53c614(0x1fb)]())return![];if(Imported[_0x53c614(0x27e)]){if(SceneManager[_0x53c614(0x28a)]())return![];if(SceneManager['_afterQteSessionDelay'])return![];}if(!this[_0x53c614(0x21e)]()){if(Input[_0x53c614(0x1df)](VisuMZ[_0x53c614(0x1cf)][_0x53c614(0x277)]['General'][_0x53c614(0x25c)]))return!![];}return $gameTemp[_0x53c614(0x291)]();},Scene_Message[_0x2833f3(0x22e)][_0x2833f3(0x21e)]=function(){const _0x5858d0=_0x2833f3;if(this[_0x5858d0(0x292)]&&this['_choiceListWindow'][_0x5858d0(0x282)])return!![];if(this[_0x5858d0(0x1ef)]&&this['_numberInputWindow'][_0x5858d0(0x282)])return!![];if(this[_0x5858d0(0x30f)]&&this[_0x5858d0(0x30f)][_0x5858d0(0x282)])return!![];return![];},Scene_Message['prototype'][_0x2833f3(0x206)]=function(){const _0x37a96e=_0x2833f3;return Input[_0x37a96e(0x20b)]('escape')||TouchInput[_0x37a96e(0x209)]()?($gameTemp[_0x37a96e(0x2bc)](![]),!![]):![];},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x2cb)]=Scene_Map[_0x2833f3(0x22e)][_0x2833f3(0x2ba)],Scene_Map[_0x2833f3(0x22e)][_0x2833f3(0x2ba)]=function(){const _0x470381=_0x2833f3;this[_0x470381(0x291)]()?this[_0x470381(0x221)]():VisuMZ[_0x470381(0x281)][_0x470381(0x2cb)][_0x470381(0x1d0)](this);},Scene_Map[_0x2833f3(0x22e)][_0x2833f3(0x291)]=function(){const _0x35e7c2=_0x2833f3;return Scene_Message[_0x35e7c2(0x22e)][_0x35e7c2(0x291)]['call'](this)&&$gameMap[_0x35e7c2(0x2af)]();},Scene_Map[_0x2833f3(0x22e)][_0x2833f3(0x221)]=function(){const _0x454ba1=_0x2833f3;let _0x41366e=Scene_Message['EXT_FAST_FORWARD_LOOPS'];while(_0x41366e--&&$gameMap[_0x454ba1(0x2af)]()&&!this[_0x454ba1(0x21e)]()){this[_0x454ba1(0x1c6)](),this[_0x454ba1(0x2eb)](),this['updateMain'](),SceneManager[_0x454ba1(0x271)]();if(this[_0x454ba1(0x206)]())break;}};function Scene_SaveButtonConsole(){const _0x53d1fe=_0x2833f3;this[_0x53d1fe(0x32d)](...arguments);}Scene_SaveButtonConsole[_0x2833f3(0x22e)]=Object[_0x2833f3(0x2fe)](Scene_Save[_0x2833f3(0x22e)]),Scene_SaveButtonConsole[_0x2833f3(0x22e)]['constructor']=Scene_SaveButtonConsole,Scene_SaveButtonConsole['prototype'][_0x2833f3(0x23e)]=function(){const _0x5c1d00=_0x2833f3;this[_0x5c1d00(0x324)]=0x0;let _0x2f862f=$gameMap[_0x5c1d00(0x1fe)];for(;;){if(_0x2f862f[_0x5c1d00(0x2c6)])_0x2f862f=_0x2f862f[_0x5c1d00(0x2c6)];else{this['_cachedIndex']=_0x2f862f[_0x5c1d00(0x1f5)],_0x2f862f[_0x5c1d00(0x1f5)]=_0x2f862f[_0x5c1d00(0x2a8)];break;}}Scene_Save[_0x5c1d00(0x22e)]['onSavefileOk'][_0x5c1d00(0x1d0)](this),_0x2f862f['_index']=this[_0x5c1d00(0x324)];},Scene_SaveButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x309)]=function(_0x53075f){const _0x5dba27=_0x2833f3;return Scene_Save['prototype'][_0x5dba27(0x309)]['call'](this,_0x5dba27(0x220));},VisuMZ['ExtMessageFunc']['Game_Interpreter_command101']=Game_Interpreter[_0x2833f3(0x22e)]['command101'],Game_Interpreter[_0x2833f3(0x22e)][_0x2833f3(0x2a4)]=function(_0x2f2cd5){const _0x5b1de1=_0x2833f3;return this['_lastExtMsgFuncIndex']=this[_0x5b1de1(0x1f5)],VisuMZ[_0x5b1de1(0x281)][_0x5b1de1(0x301)][_0x5b1de1(0x1d0)](this,_0x2f2cd5);},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x2c0)]=Scene_Battle[_0x2833f3(0x22e)]['update'],Scene_Battle[_0x2833f3(0x22e)][_0x2833f3(0x2e4)]=function(){const _0x1e021f=_0x2833f3;VisuMZ['ExtMessageFunc']['Scene_Battle_update'][_0x1e021f(0x1d0)](this);if(this['isExtendedFastForwardMode']())this[_0x1e021f(0x221)]();},Scene_Battle['prototype'][_0x2833f3(0x291)]=function(){const _0x510426=_0x2833f3;return![];return Scene_Message['prototype'][_0x510426(0x291)][_0x510426(0x1d0)](this)&&$gameTroop['isEventRunning']()&&!this[_0x510426(0x2fa)];},Scene_Battle[_0x2833f3(0x22e)][_0x2833f3(0x221)]=function(){const _0x17c49f=_0x2833f3;this['_extFastForwardLooping']=!![];let _0x97f395=Scene_Message[_0x17c49f(0x1ee)];while(_0x97f395--&&$gameTroop['isEventRunning']()&&!this[_0x17c49f(0x21e)]()){this['update'](),SceneManager[_0x17c49f(0x271)]();if(this[_0x17c49f(0x206)]())break;}this[_0x17c49f(0x2fa)]=![];},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x30d)]=WindowLayer[_0x2833f3(0x22e)][_0x2833f3(0x2e4)],WindowLayer['prototype']['update']=function(){if(SceneManager['_scene']['_extFastForwardLooping'])return;VisuMZ['ExtMessageFunc']['WindowLayer_update']['call'](this);},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x2d9)]=Window_Base['prototype'][_0x2833f3(0x1d2)],Window_Base[_0x2833f3(0x22e)][_0x2833f3(0x1d2)]=function(_0x4c0cfe){const _0x4a7f66=_0x2833f3;this['constructor']['name']===_0x4a7f66(0x318)&&this['addAutoForwardDelay'](_0x4c0cfe),VisuMZ[_0x4a7f66(0x281)][_0x4a7f66(0x2d9)]['call'](this,_0x4c0cfe),this[_0x4a7f66(0x228)][_0x4a7f66(0x32b)]===_0x4a7f66(0x318)&&this['moveCustomMessageCursorPauseSign'](_0x4c0cfe);},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x22d)]=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x32d)],Window_Message[_0x2833f3(0x22e)]['initialize']=function(_0x57569c){const _0x5ce4b0=_0x2833f3;VisuMZ[_0x5ce4b0(0x281)]['Window_Message_initialize'][_0x5ce4b0(0x1d0)](this,_0x57569c),this[_0x5ce4b0(0x227)]();},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x1fc)]=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2e4)],Window_Message['prototype'][_0x2833f3(0x2e4)]=function(){const _0x239f63=_0x2833f3;VisuMZ[_0x239f63(0x281)]['Window_Message_update'][_0x239f63(0x1d0)](this),this[_0x239f63(0x308)](),this[_0x239f63(0x1be)]();},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x308)]=function(){const _0x40719f=_0x2833f3;if(!this[_0x40719f(0x1d4)]())return;$gameTemp[_0x40719f(0x234)]()&&$gameTemp[_0x40719f(0x263)](![]),$gameTemp[_0x40719f(0x291)]()&&$gameTemp[_0x40719f(0x2bc)](![]);},Window_Message[_0x2833f3(0x22e)]['meetExtMsgFuncResetRequirements']=function(){const _0x527a02=_0x2833f3;if(SceneManager[_0x527a02(0x2dd)]()&&$gameMap&&!$gameMap[_0x527a02(0x2af)]())return!![];else{if(SceneManager['isSceneBattle']()&&!$gameMap[_0x527a02(0x2af)]())return!![];}return![];},VisuMZ['ExtMessageFunc']['Window_Message_isTriggered']=Window_Message[_0x2833f3(0x22e)]['isTriggered'],Window_Message['prototype']['isTriggered']=function(){const _0x5f0fcc=_0x2833f3;if(SceneManager[_0x5f0fcc(0x29e)]['isExtendedFastForwardMode']())return!![];else{if(Input[_0x5f0fcc(0x20b)](Window_ButtonConsole['SHORTCUT_KEY'][_0x5f0fcc(0x29f)]))return this[_0x5f0fcc(0x2f8)](),![];else{if(Input[_0x5f0fcc(0x20b)](Window_ButtonConsole['SHORTCUT_KEY'][_0x5f0fcc(0x31a)]))return this['processButtonShortcut']('save'),![];else{if(Input[_0x5f0fcc(0x20b)](Window_ButtonConsole[_0x5f0fcc(0x319)][_0x5f0fcc(0x2b4)]))return this[_0x5f0fcc(0x287)](_0x5f0fcc(0x2b4)),![];else{if(Input[_0x5f0fcc(0x20b)](Window_ButtonConsole[_0x5f0fcc(0x319)][_0x5f0fcc(0x2d6)]))return this[_0x5f0fcc(0x287)](_0x5f0fcc(0x2d6)),![];else{if(Input['isTriggered'](Window_ButtonConsole[_0x5f0fcc(0x319)][_0x5f0fcc(0x23c)]))return this['processButtonShortcut']('gameend'),![];else return this[_0x5f0fcc(0x2cd)]&&$gameTemp[_0x5f0fcc(0x234)]()?this['autoForwardTriggered']():VisuMZ[_0x5f0fcc(0x281)][_0x5f0fcc(0x2d5)]['call'](this);}}}}}},VisuMZ['ExtMessageFunc'][_0x2833f3(0x1fd)]=Window_Message['prototype'][_0x2833f3(0x26a)],Window_Message['prototype'][_0x2833f3(0x26a)]=function(_0x57731b){const _0x30d860=_0x2833f3;this[_0x30d860(0x261)](_0x57731b),this[_0x30d860(0x31b)](),this[_0x30d860(0x1b8)](_0x57731b),VisuMZ[_0x30d860(0x281)][_0x30d860(0x1fd)][_0x30d860(0x1d0)](this,_0x57731b),this[_0x30d860(0x1d6)]=0x0;},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x1d3)]=function(){const _0x4f9f4b=_0x2833f3,_0x5831ee=ImageManager['standardFaceWidth']||0x90,_0x4d254d=$gameMessage[_0x4f9f4b(0x321)](),_0x17723b=$gameMessage[_0x4f9f4b(0x1d1)](),_0x542c79=$gameMessage['isRTL']();let _0x1e1447=_0x5831ee,_0x377bf7=this['innerHeight'],_0xa5ef7e=_0x542c79?this['innerWidth']-_0x1e1447-0x4:0x4,_0x298869=0x0;_0x377bf7-=this['addedHeight'](),this['drawFace'](_0x4d254d,_0x17723b,_0xa5ef7e,_0x298869,_0x1e1447,_0x377bf7);},Window_Message[_0x2833f3(0x2e6)]=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x317)][_0x2833f3(0x245)],Window_Message[_0x2833f3(0x27d)]=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x317)]['MinimumWait'],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x1ed)]=function(_0x4cfc9a){const _0x570bc0=_0x2833f3;this[_0x570bc0(0x1d6)]=this[_0x570bc0(0x1d6)]||0x0,this[_0x570bc0(0x1d6)]=Math[_0x570bc0(0x32e)](this[_0x570bc0(0x1d6)],0x0);const _0x5e3eda=(_0x4cfc9a['buffer']||'')[_0x570bc0(0x226)];this[_0x570bc0(0x1d6)]+=_0x5e3eda*Window_Message[_0x570bc0(0x2e6)];},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2f8)]=function(){const _0x475eaf=_0x2833f3;if(this[_0x475eaf(0x2ac)])return;if(!$gameSystem[_0x475eaf(0x310)]())return;let _0x51a44f=!$gameTemp[_0x475eaf(0x234)]();$gameTemp[_0x475eaf(0x263)](_0x51a44f),_0x51a44f?this['playOkSound']():SoundManager[_0x475eaf(0x26d)]();},Window_Message['prototype'][_0x2833f3(0x27c)]=function(){const _0x37f151=_0x2833f3;this[_0x37f151(0x1d6)]=this[_0x37f151(0x1d6)]||0x0;if(VisuMZ[_0x37f151(0x281)][_0x37f151(0x2d5)][_0x37f151(0x1d0)](this))return SoundManager['playCancel'](),$gameTemp[_0x37f151(0x263)](![]),!![];else{if(Imported[_0x37f151(0x299)]&&this[_0x37f151(0x1d6)]>0x0){if(AudioManager[_0x37f151(0x1d8)][_0x37f151(0x226)]>0x0){if(AudioManager[_0x37f151(0x1d8)][0x0][_0x37f151(0x215)]()){const _0x3ff3e4=VisuMZ[_0x37f151(0x281)][_0x37f151(0x277)][_0x37f151(0x317)][_0x37f151(0x2c9)]??0x14;this[_0x37f151(0x1d6)]=Math['max'](_0x3ff3e4,this[_0x37f151(0x1d6)]);}}}return this[_0x37f151(0x1d6)]--<=0x0;}},VisuMZ['ExtMessageFunc'][_0x2833f3(0x1dc)]=Window_Message[_0x2833f3(0x22e)]['startPause'],Window_Message[_0x2833f3(0x22e)]['startPause']=function(){const _0x4b4c85=_0x2833f3;VisuMZ[_0x4b4c85(0x281)][_0x4b4c85(0x1dc)][_0x4b4c85(0x1d0)](this),this[_0x4b4c85(0x1d6)]=this[_0x4b4c85(0x1d6)]||0x0,this['_autoForwardCount']=Math['max'](this[_0x4b4c85(0x1d6)],Window_Message[_0x4b4c85(0x27d)]);},VisuMZ[_0x2833f3(0x281)]['Window_Message_initMembers']=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x1bf)],Window_Message[_0x2833f3(0x22e)]['initMembers']=function(){const _0x5d7f17=_0x2833f3;VisuMZ[_0x5d7f17(0x281)]['Window_Message_initMembers'][_0x5d7f17(0x1d0)](this),this[_0x5d7f17(0x2c8)]();},VisuMZ['ExtMessageFunc'][_0x2833f3(0x249)]=Window_Base['prototype'][_0x2833f3(0x213)],Window_Base[_0x2833f3(0x22e)][_0x2833f3(0x213)]=function(_0x1b50c3){const _0x2d11de=_0x2833f3;return _0x1b50c3=_0x1b50c3[_0x2d11de(0x1fa)](/<HIDE (?:BUTTON CONSOLE|CONSOLE|BUTTONS)>/gi,_0x2d11de(0x1f6)),_0x1b50c3=VisuMZ[_0x2d11de(0x281)][_0x2d11de(0x249)]['call'](this,_0x1b50c3),_0x1b50c3;},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x261)]=function(_0x3f34d6){const _0xb593ef=_0x2833f3;let _0x355082=_0x3f34d6[_0xb593ef(0x23b)];this['_hideButtonConsole']=![],_0x355082=_0x355082[_0xb593ef(0x1fa)]('<HIDEBUTTONCONSOLE>',()=>{const _0x6efd9d=_0xb593ef;return this[_0x6efd9d(0x2ac)]=!![],'';}),this[_0xb593ef(0x320)](_0x355082)&&(this[_0xb593ef(0x2ac)]=!![]),_0x3f34d6[_0xb593ef(0x23b)]=_0x355082;};function _0x33cf(_0x375e17,_0xc86245){const _0x130547=_0x1305();return _0x33cf=function(_0x33cfa3,_0x1b7963){_0x33cfa3=_0x33cfa3-0x1b4;let _0x26a147=_0x130547[_0x33cfa3];return _0x26a147;},_0x33cf(_0x375e17,_0xc86245);}if(!Window_Message['prototype'][_0x2833f3(0x31c)]){let text='';text+=_0x2833f3(0x24a),text+=_0x2833f3(0x1e2),text+=_0x2833f3(0x24c),alert(text),SceneManager[_0x2833f3(0x1e7)]();}Window_Message[_0x2833f3(0x22e)]['hideButtonConsoleAutoSize']=function(_0x5a6bfb){const _0x1c38e5=_0x2833f3;if(!VisuMZ[_0x1c38e5(0x281)][_0x1c38e5(0x277)][_0x1c38e5(0x298)]['AutoSizeHide'])return![];if(_0x5a6bfb[_0x1c38e5(0x23f)](Window_Message[_0x1c38e5(0x202)]))return!![];if(_0x5a6bfb[_0x1c38e5(0x23f)](Window_Message[_0x1c38e5(0x2be)]))return!![];return![];},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x259)]=Window_Message['prototype'][_0x2833f3(0x31c)],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x31c)]=function(){const _0x55d576=_0x2833f3;let _0x42f263=VisuMZ[_0x55d576(0x281)][_0x55d576(0x259)][_0x55d576(0x1d0)](this);if(this[_0x55d576(0x2ac)])return _0x42f263;return SceneManager[_0x55d576(0x2dd)]()&&$gameSystem[_0x55d576(0x310)]()&&([_0x55d576(0x211),_0x55d576(0x323)][_0x55d576(0x254)](Window_ButtonConsole[_0x55d576(0x200)][_0x55d576(0x2a9)]()[_0x55d576(0x29a)]())&&(_0x42f263+=Window_ButtonConsole[_0x55d576(0x1b7)])),_0x42f263;},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x316)]=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x288)],Window_Message[_0x2833f3(0x22e)]['updateDimensions']=function(){const _0x31e1a8=_0x2833f3;VisuMZ[_0x31e1a8(0x281)][_0x31e1a8(0x316)][_0x31e1a8(0x1d0)](this),this[_0x31e1a8(0x25f)](),this['refreshButtonConsole']();},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x25f)]=function(){const _0x82e772=_0x2833f3;if(!SceneManager[_0x82e772(0x2dd)]())return;for(const _0x3fb921 of this[_0x82e772(0x31f)]){!this['_hideButtonConsole']&&$gameSystem[_0x82e772(0x310)]()?_0x3fb921['show']():_0x3fb921[_0x82e772(0x1c3)]();}this[_0x82e772(0x239)]();},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x1cd)]=function(){const _0x3a2b25=_0x2833f3;for(const _0x3fa969 of this[_0x3a2b25(0x31f)]){_0x3fa969[_0x3a2b25(0x1ba)]();}},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2c8)]=function(){const _0xeb29b9=_0x2833f3;this[_0xeb29b9(0x31f)]=[];for(const _0x1e5116 of Window_ButtonConsole[_0xeb29b9(0x232)]){this['addButtonConsoleObject'](_0x1e5116);}this['alignButtonConsoleButtons']();},Window_Message['prototype']['addButtonConsoleObject']=function(_0xeb8921){const _0x6b1a3b=_0x2833f3;_0xeb8921=_0xeb8921[_0x6b1a3b(0x2a9)]()[_0x6b1a3b(0x29a)]();switch(_0xeb8921){case _0x6b1a3b(0x2e5):if(!Scene_Message[_0x6b1a3b(0x1d9)])return;break;case'options':if(!Imported[_0x6b1a3b(0x2f7)])return;break;case'save':case _0x6b1a3b(0x2b4):if(!Imported['VisuMZ_1_SaveCore'])return;break;case _0x6b1a3b(0x1c3):if(!Imported['VisuMZ_4_MessageVisibility'])return;break;case _0x6b1a3b(0x1dd):case _0x6b1a3b(0x240):if(!Imported[_0x6b1a3b(0x2ed)])return;break;}const _0x661551=new Window_ButtonConsole(_0xeb8921,this);this[_0x6b1a3b(0x31f)]['push'](_0x661551),this['addChild'](_0x661551);},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x239)]=function(){const _0x32a094=_0x2833f3;if(!SceneManager[_0x32a094(0x2dd)]())return;const _0x56d5da=Window_ButtonConsole[_0x32a094(0x200)][_0x32a094(0x2a9)]()[_0x32a094(0x29a)](),_0x1ed602=this[_0x32a094(0x31f)];this[_0x32a094(0x1f2)]['x']=this['_contentsSprite']['y']=0x0;if(!$gameSystem[_0x32a094(0x310)]())return;if([_0x32a094(0x211),'bottom'][_0x32a094(0x254)](_0x56d5da)){let _0x497d08=_0x1ed602[_0x32a094(0x226)]*Window_ButtonConsole[_0x32a094(0x216)];_0x497d08+=(_0x1ed602[_0x32a094(0x226)]-0x1)*Window_ButtonConsole[_0x32a094(0x2ae)];let _0x32d094=Math['floor']((this[_0x32a094(0x247)]-_0x497d08)/0x2),_0x506897=_0x32d094;_0x506897+=Window_ButtonConsole['BUTTON_OFFSET_X'];for(const _0x2c6b7a of _0x1ed602){_0x2c6b7a['x']=_0x506897,_0x506897+=Window_ButtonConsole[_0x32a094(0x216)]+Window_ButtonConsole[_0x32a094(0x2ae)];}}if(_0x56d5da===_0x32a094(0x211)){let _0x17a56f=Window_ButtonConsole[_0x32a094(0x2ae)];for(const _0x377cc9 of _0x1ed602){_0x377cc9['y']=_0x17a56f;}if(this[_0x32a094(0x2ac)])return;_0x17a56f=Window_ButtonConsole[_0x32a094(0x1b7)],_0x17a56f+=Window_ButtonConsole[_0x32a094(0x2de)],this[_0x32a094(0x1f2)]['y']=_0x17a56f;};if(_0x56d5da===_0x32a094(0x323)){let _0x3c8ff9=this[_0x32a094(0x1bb)]-Window_ButtonConsole[_0x32a094(0x1b7)];_0x3c8ff9-=Window_ButtonConsole[_0x32a094(0x2ae)],_0x3c8ff9+=Window_ButtonConsole[_0x32a094(0x2de)];for(const _0x41c4bc of _0x1ed602){_0x41c4bc['y']=_0x3c8ff9;}}},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x287)]=function(_0x2a4980){const _0x668fc6=_0x2833f3;if(this[_0x668fc6(0x2ac)])return;if(!$gameSystem[_0x668fc6(0x310)]())return;_0x2a4980=_0x2a4980[_0x668fc6(0x2a9)]()[_0x668fc6(0x29a)]();switch(_0x2a4980){case _0x668fc6(0x31a):$gameSystem[_0x668fc6(0x27a)]()&&SceneManager['isSceneMap']()?(this[_0x668fc6(0x2a2)](),SceneManager[_0x668fc6(0x1ca)](Scene_SaveButtonConsole)):this[_0x668fc6(0x314)]();break;case _0x668fc6(0x2b4):DataManager[_0x668fc6(0x303)]()&&SceneManager[_0x668fc6(0x2dd)]()?(this['playOkSound'](),SceneManager['push'](Scene_Load)):this['playBuzzerSound']();break;case'options':SceneManager['isSceneMap']()?(this[_0x668fc6(0x2a2)](),SceneManager['push'](Scene_Options)):this['playBuzzerSound']();break;case _0x668fc6(0x23c):SceneManager[_0x668fc6(0x2dd)]()?(this['playOkSound'](),SceneManager['push'](Scene_GameEnd)):this[_0x668fc6(0x314)]();break;}},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x218)]=Window_Message['prototype'][_0x2833f3(0x2a5)],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2a5)]=function(_0x415e9b){const _0x681e5a=_0x2833f3;if(SceneManager[_0x681e5a(0x29e)][_0x681e5a(0x291)]())return;VisuMZ['ExtMessageFunc'][_0x681e5a(0x218)][_0x681e5a(0x1d0)](this,_0x415e9b);},Window_Message['prototype'][_0x2833f3(0x270)]=function(){const _0x4149e9=_0x2833f3,_0x1c1d03=$gameSystem[_0x4149e9(0x2a0)]();return _0x1c1d03[_0x4149e9(0x20c)];},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x294)]=function(){const _0x3c2051=_0x2833f3;this['isCustomMessageCursorEnabled']()?(this[_0x3c2051(0x22a)](),this[_0x3c2051(0x1d7)]()):Window_Base['prototype'][_0x3c2051(0x294)][_0x3c2051(0x1d0)](this);},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x22a)]=function(){const _0xb00a55=_0x2833f3;if(!this[_0xb00a55(0x2f5)])return;this[_0xb00a55(0x315)](this[_0xb00a55(0x2f5)]);},Window_Message['prototype'][_0x2833f3(0x1d7)]=function(){const _0x16123f=_0x2833f3,_0x495abc=$gameSystem['getMessageCursorSettings']();this['_pauseSignSprite']=new Sprite(),this[_0x16123f(0x29b)](this[_0x16123f(0x2f5)]),this[_0x16123f(0x2f5)][_0x16123f(0x2ff)]['x']=_0x495abc['AnchorX'],this['_pauseSignSprite'][_0x16123f(0x2ff)]['y']=_0x495abc[_0x16123f(0x2b7)],this[_0x16123f(0x1e8)]=0x0;},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x225)]=function(){const _0x185d38=_0x2833f3;this[_0x185d38(0x270)]()?this[_0x185d38(0x21c)]():(Window_Base[_0x185d38(0x22e)]['_refreshPauseSign'][_0x185d38(0x1d0)](this),this['updatePauseSignHeightextMsgFunction']());},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x21c)]=function(){const _0x23479d=_0x2833f3,_0x53e320=this[_0x23479d(0x2f5)];if(!_0x53e320)return;const _0x1ac699=$gameSystem['getMessageCursorSettings'](),_0x27b9fd=_0x1ac699['GraphicType'][_0x23479d(0x2a9)]()[_0x23479d(0x29a)]();if(_0x27b9fd===_0x23479d(0x235))_0x53e320['bitmap']=ImageManager[_0x23479d(0x275)](_0x1ac699[_0x23479d(0x258)]);else{if(_0x27b9fd===_0x23479d(0x27b)){const _0x4f1868=0x90,_0x5d5b1f=0x60,_0x50b78c=0x18;_0x53e320[_0x23479d(0x26c)]=this[_0x23479d(0x2e9)],_0x53e320[_0x23479d(0x304)](_0x4f1868,_0x5d5b1f,_0x50b78c,_0x50b78c);}else _0x53e320[_0x23479d(0x26c)]=ImageManager[_0x23479d(0x275)](_0x23479d(0x2fb));}},Window_Message[_0x2833f3(0x22e)]['updatePauseSignHeightextMsgFunction']=function(){const _0x14dbb8=_0x2833f3,_0xe15aac=this[_0x14dbb8(0x2f5)];if(!_0xe15aac)return;if(!$gameSystem[_0x14dbb8(0x310)]())return;if(this[_0x14dbb8(0x31d)])return;_0xe15aac['y']-=Window_ButtonConsole[_0x14dbb8(0x1b7)];},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x278)]=function(){const _0x458064=_0x2833f3;this[_0x458064(0x270)]()?this[_0x458064(0x2bd)]():Window_Base['prototype'][_0x458064(0x278)][_0x458064(0x1d0)](this);},Window_Message[_0x2833f3(0x22e)]['updateCustomMessageCursorPauseSignSprites']=function(){const _0x422804=_0x2833f3;if(this[_0x422804(0x2c1)]===Graphics[_0x422804(0x256)])return;this[_0x422804(0x2c1)]=Graphics['frameCount'];const _0x43c803=this[_0x422804(0x2f5)];if(!_0x43c803)return;const _0x526be8=_0x43c803[_0x422804(0x26c)];if(_0x526be8[_0x422804(0x247)]<=0x0)return;const _0x34b817=$gameSystem[_0x422804(0x2a0)](),_0x46694c=_0x34b817[_0x422804(0x305)][_0x422804(0x2a9)]()['trim'](),_0x1ffa09=this['isAnySubWindowActive']()||this[_0x422804(0x300)]();_0x43c803[_0x422804(0x1c9)]=_0x1ffa09?0x0:0x1;if(_0x43c803[_0x422804(0x1c9)]<=0x0)return;const _0x358435=_0x34b817['Rows']*_0x34b817[_0x422804(0x260)];this[_0x422804(0x1e8)]++;while(this['_pauseSignAnimationCount']>=_0x358435*_0x34b817[_0x422804(0x32f)]){this[_0x422804(0x1e8)]-=_0x358435*_0x34b817[_0x422804(0x32f)];}if(_0x46694c===_0x422804(0x235))this[_0x422804(0x2aa)]();else _0x46694c==='windowskin'?Window_Base['prototype'][_0x422804(0x278)][_0x422804(0x1d0)](this):this[_0x422804(0x286)]();},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2aa)]=function(){const _0x5d17fd=_0x2833f3,_0x1b4bc8=this[_0x5d17fd(0x2f5)],_0x5c58c1=_0x1b4bc8['bitmap'],_0x11b0fa=$gameSystem[_0x5d17fd(0x2a0)](),_0x24ca95=Math[_0x5d17fd(0x2ee)](this['_pauseSignAnimationCount']/_0x11b0fa[_0x5d17fd(0x32f)]),_0x1343f2=Math[_0x5d17fd(0x2ee)](_0x5c58c1['width']/_0x11b0fa[_0x5d17fd(0x260)]),_0x2d10fb=Math['floor'](_0x5c58c1['height']/_0x11b0fa[_0x5d17fd(0x2a6)]),_0x40465a=_0x24ca95%_0x11b0fa['Cols']*_0x1343f2,_0x2b71b7=Math['floor'](_0x24ca95/_0x11b0fa['Cols'])*_0x2d10fb;_0x1b4bc8[_0x5d17fd(0x304)](_0x40465a,_0x2b71b7,_0x1343f2,_0x2d10fb),_0x1b4bc8['visible']=this[_0x5d17fd(0x1b6)]();},Window_Message[_0x2833f3(0x22e)]['updateIconMessageCursorPauseSignSprites']=function(){const _0x52f483=_0x2833f3,_0x539569=this[_0x52f483(0x2f5)],_0x4dc491=$gameSystem['getMessageCursorSettings'](),_0xb748c7=_0x4dc491[_0x52f483(0x1f4)],_0x3685cd=ImageManager['iconWidth'],_0x2d119c=ImageManager[_0x52f483(0x229)],_0x969f5c=_0xb748c7%0x10*_0x3685cd,_0x92c735=Math[_0x52f483(0x2ee)](_0xb748c7/0x10)*_0x2d119c;_0x539569['setFrame'](_0x969f5c,_0x92c735,_0x3685cd,_0x2d119c),_0x539569[_0x52f483(0x264)]=this[_0x52f483(0x1b6)]();if(_0x4dc491['FlipMultiplier']===0x0)return;_0x539569[_0x52f483(0x214)]['x']=Math[_0x52f483(0x30b)](Graphics['frameCount']*_0x4dc491[_0x52f483(0x244)]);},Window_Message[_0x2833f3(0x2ca)]=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)]['MsgCursor'][_0x2833f3(0x2b0)]??!![],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x210)]=function(_0x4a6fa0){const _0x4b0422=_0x2833f3;if(!_0x4a6fa0)return;if(!_0x4a6fa0[_0x4b0422(0x2ab)])return;if(!this['isCustomMessageCursorEnabled']())return;const _0x155f39=this['_pauseSignSprite'];if(!_0x155f39)return;const _0x3c5df8=$gameSystem['getMessageCursorSettings']();_0x155f39['x']=_0x4a6fa0['x']+this['padding']+_0x3c5df8[_0x4b0422(0x2e7)]+_0x155f39[_0x4b0422(0x247)]/0x2,_0x155f39['x']+=this[_0x4b0422(0x1f2)]['x'],_0x155f39['y']=_0x4a6fa0['y']+this[_0x4b0422(0x329)]+_0x4a6fa0[_0x4b0422(0x1bb)]+_0x3c5df8[_0x4b0422(0x2c3)],_0x155f39['y']+=this[_0x4b0422(0x1f2)]['y'],_0x155f39['x']=Math[_0x4b0422(0x1cc)](_0x155f39['x'][_0x4b0422(0x28b)](this[_0x4b0422(0x329)],this[_0x4b0422(0x247)])),_0x155f39['y']=Math[_0x4b0422(0x1cc)](_0x155f39['y'][_0x4b0422(0x28b)](this[_0x4b0422(0x329)],this[_0x4b0422(0x1bb)]-this[_0x4b0422(0x329)]));},Window_Message['prototype'][_0x2833f3(0x227)]=function(){const _0x32d214=_0x2833f3;this['_messageTailSprite']=new Sprite(),this['_messageTailSprite']['visible']=![],this[_0x32d214(0x29b)](this[_0x32d214(0x2df)]);},Window_Message['prototype'][_0x2833f3(0x31b)]=function(){const _0x4feede=_0x2833f3;this[_0x4feede(0x24f)]={'visible':![],'lastFile':'','location':_0x4feede(0x323),'direction':_0x4feede(0x2e1),'positionX':_0x4feede(0x29f)};},Window_Message['prototype']['parseMessageTailTextCodes']=function(_0x386aac){const _0x5c561c=_0x2833f3;_0x386aac[_0x5c561c(0x23b)]=this[_0x5c561c(0x2f9)](_0x386aac['text']),_0x386aac[_0x5c561c(0x23b)]=this['convertMessageTailEscapeCodes'](_0x386aac[_0x5c561c(0x23b)]);},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x231)]=function(_0xdf2627){const _0x2609ce=_0x2833f3;return _0xdf2627=_0xdf2627[_0x2609ce(0x1fa)](/<TAIL (?:BL|BOTTOM LEFT|DL|DOWN LEFT):[ ](\d+)>/gi,(_0x3c0c57,_0x4f1618)=>{const _0x14f57e=_0x2609ce;return this[_0x14f57e(0x290)](!![],!![],_0x4f1618),'';}),_0xdf2627=_0xdf2627['replace'](/<TAIL (?:BR|BOTTOM RIGHT|DL|DOWN RIGHT):[ ](\d+)>/gi,(_0x75a5c,_0x332f92)=>{const _0xfa64a0=_0x2609ce;return this[_0xfa64a0(0x290)](!![],![],_0x332f92),'';}),_0xdf2627=_0xdf2627[_0x2609ce(0x1fa)](/<TAIL (?:UL|UPPER LEFT|UP LEFT):[ ](\d+)>/gi,(_0x5d2a32,_0x481839)=>{const _0x2b71f9=_0x2609ce;return this[_0x2b71f9(0x290)](![],!![],_0x481839),'';}),_0xdf2627=_0xdf2627[_0x2609ce(0x1fa)](/<TAIL (?:UR|UPPER RIGHT|UP RIGHT):[ ](\d+)>/gi,(_0x27dd4f,_0x464a90)=>{const _0xc50601=_0x2609ce;return this[_0xc50601(0x290)](![],![],_0x464a90),'';}),_0xdf2627;},Window_Message[_0x2833f3(0x22e)]['setupMessageTailSettings']=function(_0x4f8fa4,_0x465377,_0x3079e0){const _0x59d9f2=_0x2833f3;if(!this['_messageTail'])this[_0x59d9f2(0x31b)]();this[_0x59d9f2(0x24f)][_0x59d9f2(0x264)]=!![],this[_0x59d9f2(0x24f)][_0x59d9f2(0x23a)]=_0x4f8fa4?_0x59d9f2(0x323):_0x59d9f2(0x284),this[_0x59d9f2(0x24f)][_0x59d9f2(0x238)]=_0x465377?_0x59d9f2(0x2e1):_0x59d9f2(0x2e2),this[_0x59d9f2(0x24f)][_0x59d9f2(0x203)]=Number(_0x3079e0);},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x248)]=Window_Message[_0x2833f3(0x22e)]['updateAutoPosition'],Window_Message['prototype']['updateAutoPosition']=function(){const _0x4f1ed6=_0x2833f3;VisuMZ[_0x4f1ed6(0x281)][_0x4f1ed6(0x248)]['call'](this);if(!this[_0x4f1ed6(0x2a1)])return;if(!this['_messageTailSprite'])return;if(!this[_0x4f1ed6(0x24f)])return;if(this[_0x4f1ed6(0x1cb)]()){const _0x3eab3e=$gameSystem[_0x4f1ed6(0x23d)](),_0x3e1e41=_0x3eab3e[_0x4f1ed6(0x1de)]?_0x4f1ed6(0x2e1):_0x4f1ed6(0x2e2);this[_0x4f1ed6(0x24f)][_0x4f1ed6(0x264)]=!![],this[_0x4f1ed6(0x24f)][_0x4f1ed6(0x1ea)]='',this[_0x4f1ed6(0x24f)]['location']=_0x4f1ed6(0x323),this['_messageTail'][_0x4f1ed6(0x238)]=_0x3e1e41,this['_messageTail']['positionX']=_0x4f1ed6(0x29f);}},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x1cb)]=function(){const _0x22ad5a=_0x2833f3,_0x161f9f=$gameSystem[_0x22ad5a(0x23d)]();if(!_0x161f9f)return![];if(!_0x161f9f[_0x22ad5a(0x1e9)])return![];const _0x52aafd=_0x161f9f[_0x22ad5a(0x1de)]?'Left':_0x22ad5a(0x289),_0x4474ee=_0x22ad5a(0x311)[_0x22ad5a(0x1c1)](_0x52aafd),_0x54987e=_0x161f9f[_0x4474ee]||'';return _0x54987e[_0x22ad5a(0x29a)]()!=='';},VisuMZ['ExtMessageFunc'][_0x2833f3(0x2dc)]=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2d4)],Window_Message[_0x2833f3(0x22e)]['autoPositionOffsetX']=function(){const _0x164615=_0x2833f3;let _0x38dbf9=VisuMZ[_0x164615(0x281)][_0x164615(0x2dc)][_0x164615(0x1d0)](this);const _0x4b0505=$gameSystem['getMessageTailSettings']();return _0x4b0505&&_0x4b0505['autoPositionTail']&&(_0x38dbf9+=_0x4b0505[_0x164615(0x2d4)]),_0x38dbf9;},VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x25e)]=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2b1)],Window_Message['prototype']['autoPositionOffsetY']=function(){const _0x21b90e=_0x2833f3;let _0x3657ba=VisuMZ[_0x21b90e(0x281)]['Window_Message_autoPositionOffsetY'][_0x21b90e(0x1d0)](this);const _0x499c19=$gameSystem[_0x21b90e(0x23d)]();return _0x499c19&&_0x499c19[_0x21b90e(0x1e9)]&&(_0x3657ba+=_0x499c19[_0x21b90e(0x2b1)]),_0x3657ba;},Window_Message[_0x2833f3(0x22e)]['updateMessageTailSprite']=function(){const _0x2f98a1=_0x2833f3;if(!this[_0x2f98a1(0x2df)])return;if(!this[_0x2f98a1(0x24f)])return;this[_0x2f98a1(0x219)](),this['updateMessageTailVisibility'](),this[_0x2f98a1(0x2cf)]();},Window_Message[_0x2833f3(0x22e)]['getMessageTailMainKey']=function(){const _0x2753a7=_0x2833f3,_0x350e77=this[_0x2753a7(0x24f)],_0x4b661b=_0x350e77[_0x2753a7(0x23a)]===_0x2753a7(0x284)?_0x2753a7(0x284):_0x2753a7(0x323),_0x216a93=_0x350e77['direction']===_0x2753a7(0x2e1)?_0x2753a7(0x1e5):_0x2753a7(0x289);return _0x2753a7(0x205)['format'](_0x4b661b,_0x216a93);},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x219)]=function(){const _0x2cd5c5=_0x2833f3,_0x30ebae=this[_0x2cd5c5(0x2df)],_0x2e46aa=this[_0x2cd5c5(0x24f)],_0x14441d=$gameSystem[_0x2cd5c5(0x23d)](),_0x9ef68f=this[_0x2cd5c5(0x257)]();if(_0x2e46aa['lastFile']===_0x14441d[_0x2cd5c5(0x21a)['format'](_0x9ef68f)])return;const _0x40aa11=_0x14441d[_0x2cd5c5(0x21a)['format'](_0x9ef68f)];_0x2e46aa[_0x2cd5c5(0x1ea)]=_0x40aa11,_0x40aa11?_0x30ebae[_0x2cd5c5(0x26c)]=ImageManager[_0x2cd5c5(0x275)](_0x40aa11):_0x30ebae[_0x2cd5c5(0x26c)]=new Bitmap(0x1,0x1);},Window_Message['prototype']['updateMessageTailVisibility']=function(){const _0x29884b=_0x2833f3,_0x2b4164=this['_messageTailSprite'],_0x34c5c0=this['_messageTail'];_0x2b4164[_0x29884b(0x264)]=_0x34c5c0[_0x29884b(0x264)]&&this[_0x29884b(0x1e4)]===0xff;},Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x2cf)]=function(){const _0x14534a=_0x2833f3,_0x50a33a=this['_messageTailSprite'],_0x56bf28=this[_0x14534a(0x24f)],_0x376fc6=$gameSystem[_0x14534a(0x23d)](),_0x10ca2b=this[_0x14534a(0x257)]();_0x50a33a[_0x14534a(0x2ff)]['x']=_0x376fc6[_0x14534a(0x2c4)[_0x14534a(0x1c1)](_0x10ca2b)],_0x50a33a[_0x14534a(0x2ff)]['y']=_0x376fc6[_0x14534a(0x21d)[_0x14534a(0x1c1)](_0x10ca2b)],_0x56bf28[_0x14534a(0x203)]===_0x14534a(0x29f)?(_0x50a33a['x']=Math[_0x14534a(0x1cc)](this[_0x14534a(0x247)]/0x2),_0x50a33a['x']+=this['correctAutoMessageTailOffsetX']()):(_0x56bf28[_0x14534a(0x203)]=Number(_0x56bf28['positionX']),_0x50a33a['x']=Math['round'](_0x56bf28[_0x14534a(0x203)])),_0x56bf28['location']===_0x14534a(0x284)?_0x50a33a['y']=0x0:_0x50a33a['y']=this[_0x14534a(0x1bb)],_0x50a33a['x']+=_0x376fc6[_0x14534a(0x1c8)['format'](_0x10ca2b)],_0x50a33a['y']+=_0x376fc6[_0x14534a(0x22c)['format'](_0x10ca2b)];},VisuMZ[_0x2833f3(0x281)]['Window_Message_clampPlacementPosition']=Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x266)],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x266)]=function(_0x13e996,_0x16e6da){const _0x213e4f=_0x2833f3;this[_0x213e4f(0x32c)]=0x0;const _0x1cde36=this['x'];VisuMZ[_0x213e4f(0x281)][_0x213e4f(0x1da)][_0x213e4f(0x1d0)](this,_0x13e996,_0x16e6da);const _0x5d619d=this['x'];this[_0x213e4f(0x32c)]=_0x1cde36-_0x5d619d;},Window_Message[_0x2833f3(0x22e)]['correctAutoMessageTailOffsetX']=function(){const _0x3b9108=_0x2833f3;return $gameSystem['getMessageTailSettings']()[_0x3b9108(0x330)]??!![]?this[_0x3b9108(0x32c)]||0x0:0x0;},Window_Message[_0x2833f3(0x241)]={'enable':VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)][_0x2833f3(0x1c2)]['Enable'],'scrollDownNext':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x1c2)][_0x2833f3(0x28c)],'scrollUpMsgLog':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)]['ScrollWheel'][_0x2833f3(0x208)]};Window_Message[_0x2833f3(0x241)][_0x2833f3(0x207)]&&(VisuMZ['ExtMessageFunc'][_0x2833f3(0x2d2)]=Window_Message[_0x2833f3(0x22e)]['isTriggered'],Window_Message[_0x2833f3(0x22e)][_0x2833f3(0x20b)]=function(){const _0x138214=_0x2833f3;if(VisuMZ[_0x138214(0x281)][_0x138214(0x2d2)]['call'](this))return!![];const _0x2a7787=Window_Message['EXT_SCROLL_WHEEL'],_0x26c5fb=0x14;if(_0x2a7787['scrollDownNext']&&TouchInput[_0x138214(0x22b)]>=_0x26c5fb)return!![];if(_0x2a7787[_0x138214(0x2a7)]&&TouchInput[_0x138214(0x22b)]<=-_0x26c5fb)return Imported[_0x138214(0x2ed)]&&(this[_0x138214(0x2a2)](),SceneManager[_0x138214(0x1ca)](Scene_MessageLog)),![];return![];});;function Window_ButtonConsole(){const _0x5d6e4e=_0x2833f3;this[_0x5d6e4e(0x32d)](...arguments);}function _0x1305(){const _0x2e31fb=['BUTTON_BUFFER','isEventRunning','FollowText','autoPositionOffsetY','changeTextColor','updateColor','load','isSceneBattle','DisabledColor','AnchorY','clear','MsgTail','updateMainMultiply','fastfwd','setExtendedFastForwardMode','updateCustomMessageCursorPauseSignSprites','_autoPosRegExp','FONT_SIZE','Scene_Battle_update','_cache_customMessageCursorFrameCount','status','OffsetY','%1AnchorX','loadFace','_childInterpreter','checkBackImageSprites','createButtonConsole','VoiceActAutoPadding','EXT_CURSOR_FOLLOW_TEXT','Scene_Map_updateMainMultiply','_messageButtonConsoleVisible','pause','Options','updateMessageTailPosition','Game_Temp_requestAnimation','ButtonBuffer','Window_Message_isTriggered_ScrollWheel','loadSystemImages','autoPositionOffsetX','Window_Message_isTriggered','options','ButtonHeight','_messageTailSettings','Window_Base_flushTextState','registerCommand','_buttonConsoleSprites','Window_Message_autoPositionOffsetX','isSceneMap','BUTTON_OFFSET_Y','_messageTailSprite','72UAYiLa','left','right','_msgCursorSettings','update','skip','AUTO_FORWARD_DELAY_PER_CHAR','OffsetX','isSceneUsingExFastForward','_windowskin','FontFace','updateColorFilter','ConvertParams','VisuMZ_3_MessageLog','floor','ImgToggled','ButtonOffsetY','return\x200','4697016fXxaBj','_extendedFastForwardMode','updateConsoleVisibility','_pauseSignSprite','getColor','VisuMZ_1_OptionsCore','toggleAutoForward','convertVariableEscapeCharacters','_extFastForwardLooping','IconSet','LoadKey','isTouchScrollEnabled','create','anchor','isClosing','Game_Interpreter_command101','1870070SpfZNj','isAnySavefileExists','setFrame','GraphicType','loadWindowskin','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','updateExtMsgFuncResetTimers','getCustomBackgroundSettings','VisuMZ_4_MessageVisibility','cos','MessageTailSettings','WindowLayer_update','GameEnd','_eventItemWindow','isMessageButtonConsoleVisible','bottom%1Filename','opacity','VisuMZ_1_MessageCore','playBuzzerSound','removeChild','Window_Message_updateDimensions','Auto','Window_Message','SHORTCUT_KEY','save','resetMessageTailSettings','addedHeight','_currentAutoSize','TEXT_COLOR_NORMAL','_buttonConsoleButtons','hideButtonConsoleAutoSize','faceName','updateBackOpacity','bottom','_cachedIndex','11NucysP','_heldDownFastFwd','setExtendedFastForwardDisallowed','Speed','padding','Buttons','name','_correctAutoMessageTailOffsetX','initialize','max','FrameDelay','autoCorrectX','FastFwd','ImgEnabled','259518rJFmvb','isOpen','BUTTON_HEIGHT','parseMessageTailTextCodes','addChildToBack','refresh','height','FontSize','Scene_Boot_loadSystemImages','updateMessageTailSprite','initMembers','ExtFastFwdDisallow','format','ScrollWheel','hide','16NvwmLj','loadPartyGraphics','updateFade','_disallowFastForward','%1OffsetX','alpha','push','usesAutoPositionMessageTail','round','refreshButtonConsole','createContents','MessageCore','call','faceIndex','flushTextState','drawMessageFace','meetExtMsgFuncResetRequirements','updatePadding','_autoForwardCount','createCustomMessageCursorPauseSignSprites','_voiceBuffers','EXT_FAST_FORWARD_ENABLED','Window_Message_clampPlacementPosition','resetFontSettings','Window_Message_startPause','backlog','autoPositionLeft','isPressed','fontFace','ARRAYSTR','The\x20latest\x20version\x20is\x20required\x20to\x20use\x0a','textColorID','openness','Left','USE_BACK_IMAGE_SPRITES','exit','_pauseSignAnimationCount','autoPositionTail','lastFile','VOCAB','74244uvEvZq','addAutoForwardDelay','EXT_FAST_FORWARD_LOOPS','_numberInputWindow','EXT_FAST_FORWARD_STOP_ON_SCENE_CHANGE','WindowSkin','_contentsSprite','map','IconIndex','_index','<HIDEBUTTONCONSOLE>','characterName','DEFAULT_SHOW','initExtendedFastForward','replace','isFurnitureSystemMode','Window_Message_update','Window_Message_newPage','_interpreter','OptionsKey','POSITION','initMessageButtonConsole','_autoSizeRegexp','positionX','ToggledColor','%1%2','updateExtendedFastForwardCancel','enable','ScrollUpMsgLog','isCancelled','drawText','isTriggered','Enable','itemPadding','description','onTouchScrollStart','moveCustomMessageCursorPauseSign','top','General','preConvertEscapeCharacters','scale','isPlaying','BUTTON_WIDTH','setMessageButtonConsoleVisible','Window_Message_startWait','updateMessageTailBitmap','%1Filename','createAllWindows','refreshCustomMessageCursorPauseSign','%1AnchorY','anyActiveMessageInputWindows','ARRAYJSON','Scene_Save','updateExtendedFastForwardMode','ButtonWidth','Game_System_initialize','Position','_refreshPauseSign','length','createMessageTailSprite','constructor','iconHeight','removeExistingPauseSignSprites','wheelY','%1OffsetY','Window_Message_initialize','prototype','Visible','_messageWindow','convertMessageTailEscapeCodes','BUTTON_ORDER','ARRAYNUM','isMessageAutoForwardMode','image','createBackImageSprites','_parentWindow','direction','alignButtonConsoleButtons','location','text','gameend','getMessageTailSettings','onSavefileOk','match','log','EXT_SCROLL_WHEEL','FONT_FACE','Save','FlipMultiplier','WaitPerChar','members','width','Window_Message_updateAutoPosition','Window_Base_preConvertEscapeCharacters','VisuMZ_1_MessageCore\x20is\x20out\x20of\x20date.\x0a','SaveKey','the\x20VisuMZ_2_ExtMessageFunc\x20plugin.','makeDeepCopy','filter','_messageTail','loadSystemImagesForExtMessageFunc','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','version','List','includes','isExtendedFastForwardDisallowed','frameCount','getMessageTailMainKey','Filename','Window_Message_addedHeight','fontSize','JSON','FastForwardKey','9yBbSVa','Window_Message_autoPositionOffsetY','showButtonConsole','Cols','prepareHideButtonConsoleTextCode','msgButtonConsole','setMessageAutoForwardMode','visible','TEXT_COLOR_TOGGLED','clampPlacementPosition','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','909004VpqWoX','isActivatedExtendedFastForwardMode','newPage','isMainMenuMessageLogEnabled','bitmap','playCancel','Scene_Message_createAllWindows','loadSvActor','isCustomMessageCursorEnabled','updateEffekseer','SKIN','MsgCursor','Load','loadSystem','FUNC','Settings','_updatePauseSign','869616wACbZg','isSaveEnabled','windowskin','autoForwardTriggered','AUTO_FORWARD_MIN_DELAY','VisuMZ_2_QTE_TriggerSys','5MKbVoA','parse','ExtMessageFunc','active','2302UaqcDT','upper','NUM','updateIconMessageCursorPauseSignSprites','processButtonShortcut','updateDimensions','Right','isPlayingQTE','clamp','ScrollDownNext','toUpperCase','contents','_type','setupMessageTailSettings','isExtendedFastForwardMode','_choiceListWindow','ImgDisabled','_createPauseSignSprites','_messageAutoForwardMode','initMessageCursorSettings','TEXT_COLOR_DISABLED','MsgButtonConsole','VisuMZ_2_VoiceActControl','trim','addChild','center','MessageCursorSettings','_scene','auto','getMessageCursorSettings','_autoPositionTarget','playOkSound','GameEndKey','command101','startWait','Rows','scrollUpMsgLog','_lastExtMsgFuncIndex','toLowerCase','updateImageMessageCursorPauseSignSprites','drawing','_hideButtonConsole','updateBackImageSpriteVisibility'];_0x1305=function(){return _0x2e31fb;};return _0x1305();}Window_ButtonConsole[_0x2833f3(0x22e)]=Object[_0x2833f3(0x2fe)](Window_Scrollable[_0x2833f3(0x22e)]),Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x228)]=Window_ButtonConsole,Window_ButtonConsole['DEFAULT_SHOW']=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x298)]['ShowDefault'],Window_ButtonConsole[_0x2833f3(0x200)]=VisuMZ[_0x2833f3(0x281)]['Settings']['MsgButtonConsole'][_0x2833f3(0x224)],Window_ButtonConsole[_0x2833f3(0x272)]=VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)][_0x2833f3(0x298)][_0x2833f3(0x1f1)],Window_ButtonConsole[_0x2833f3(0x242)]=VisuMZ[_0x2833f3(0x281)]['Settings'][_0x2833f3(0x298)][_0x2833f3(0x2ea)],Window_ButtonConsole[_0x2833f3(0x2bf)]=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x298)][_0x2833f3(0x1bc)],Window_ButtonConsole['TEXT_COLOR_NORMAL']=VisuMZ['ExtMessageFunc']['Settings']['MsgButtonConsole']['NormalColor'],Window_ButtonConsole['TEXT_COLOR_TOGGLED']=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x298)][_0x2833f3(0x204)],Window_ButtonConsole['TEXT_COLOR_DISABLED']=VisuMZ[_0x2833f3(0x281)]['Settings'][_0x2833f3(0x298)][_0x2833f3(0x2b6)],Window_ButtonConsole['BUTTON_OFFSET_X']=VisuMZ['ExtMessageFunc']['Settings'][_0x2833f3(0x298)]['ButtonOffsetX']??0x0,Window_ButtonConsole[_0x2833f3(0x2de)]=VisuMZ[_0x2833f3(0x281)]['Settings'][_0x2833f3(0x298)][_0x2833f3(0x2f0)]??0x0,Window_ButtonConsole[_0x2833f3(0x216)]=VisuMZ['ExtMessageFunc']['Settings'][_0x2833f3(0x298)][_0x2833f3(0x222)],Window_ButtonConsole[_0x2833f3(0x1b7)]=VisuMZ[_0x2833f3(0x281)]['Settings']['MsgButtonConsole'][_0x2833f3(0x2d7)],Window_ButtonConsole['BUTTON_BUFFER']=VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x298)][_0x2833f3(0x2d1)],Window_ButtonConsole['BUTTON_ORDER']=VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x253)],Window_ButtonConsole[_0x2833f3(0x1eb)]={'auto':VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x317)],'fastfwd':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)]['Buttons'][_0x2833f3(0x331)],'save':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x243)],'load':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x274)],'options':VisuMZ['ExtMessageFunc'][_0x2833f3(0x277)]['Buttons'][_0x2833f3(0x2ce)],'gameend':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x30e)]},Window_ButtonConsole['SHORTCUT_KEY']={'auto':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)]['AutoKey'],'save':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x24b)],'load':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x2fc)],'options':VisuMZ[_0x2833f3(0x281)][_0x2833f3(0x277)][_0x2833f3(0x32a)][_0x2833f3(0x1ff)],'gameend':VisuMZ['ExtMessageFunc']['Settings'][_0x2833f3(0x32a)][_0x2833f3(0x2a3)]},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x32d)]=function(_0x4f0b11,_0x472740){const _0x3a84a6=_0x2833f3,_0x36c10b=new Rectangle(0x0,0x0,Window_ButtonConsole[_0x3a84a6(0x216)],Window_ButtonConsole[_0x3a84a6(0x1b7)]);this[_0x3a84a6(0x237)]=_0x472740,Window_Scrollable[_0x3a84a6(0x22e)][_0x3a84a6(0x32d)][_0x3a84a6(0x1d0)](this,_0x36c10b),this['createBackImageSprites'](),this[_0x3a84a6(0x28f)]=_0x4f0b11[_0x3a84a6(0x2a9)]()[_0x3a84a6(0x29a)](),this[_0x3a84a6(0x1ba)](),this[_0x3a84a6(0x1c3)]();},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x20d)]=function(){return 0x0;},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x306)]=function(){const _0x99c3d1=_0x2833f3;this[_0x99c3d1(0x27b)]=ImageManager[_0x99c3d1(0x275)](Window_ButtonConsole[_0x99c3d1(0x272)]);},Window_ButtonConsole['prototype'][_0x2833f3(0x1d5)]=function(){const _0x5b2bc5=_0x2833f3;this[_0x5b2bc5(0x329)]=0x0;},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x322)]=function(){this['backOpacity']=0xff;},Window_ButtonConsole['prototype'][_0x2833f3(0x236)]=function(){const _0x40264f=_0x2833f3;Window_ButtonConsole[_0x40264f(0x1e6)]===undefined&&this[_0x40264f(0x2c7)]();if(!Window_ButtonConsole[_0x40264f(0x1e6)])return;this[_0x40264f(0x312)]=0x0;const _0x331e33=VisuMZ[_0x40264f(0x281)]['Settings'][_0x40264f(0x298)],_0x9960fb=[_0x40264f(0x293),_0x40264f(0x1b4),'ImgToggled'];this[_0x40264f(0x2db)]={};for(const _0x33dedc of _0x9960fb){if(_0x331e33[_0x33dedc]!==''){const _0x54577e=ImageManager['loadSystem'](_0x331e33[_0x33dedc]);this[_0x40264f(0x2db)][_0x33dedc]=new Sprite(_0x54577e);const _0xcac73c=this[_0x40264f(0x2db)][_0x33dedc];this[_0x40264f(0x1b9)](_0xcac73c),_0xcac73c['x']=_0x331e33[_0x40264f(0x1c8)[_0x40264f(0x1c1)](_0x33dedc)]||0x0,_0xcac73c['y']=_0x331e33[_0x40264f(0x22c)[_0x40264f(0x1c1)](_0x33dedc)]||0x0;}}this[_0x40264f(0x2ad)]();},Window_ButtonConsole[_0x2833f3(0x22e)]['checkBackImageSprites']=function(){const _0x6102fa=_0x2833f3;Window_ButtonConsole['USE_BACK_IMAGE_SPRITES']=![];const _0x9e2692=VisuMZ[_0x6102fa(0x281)]['Settings'][_0x6102fa(0x298)],_0x3c59ef=[_0x6102fa(0x293),_0x6102fa(0x1b4),'ImgToggled'];for(const _0x3c64f4 of _0x3c59ef){if(_0x9e2692[_0x3c64f4]!==''){Window_ButtonConsole[_0x6102fa(0x1e6)]=!![];break;}}},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x1db)]=function(){const _0xa773a0=_0x2833f3;Window_Scrollable['prototype'][_0xa773a0(0x1db)][_0xa773a0(0x1d0)](this),this['contents'][_0xa773a0(0x1e0)]=Window_ButtonConsole[_0xa773a0(0x242)],this[_0xa773a0(0x28e)][_0xa773a0(0x25a)]=Window_ButtonConsole[_0xa773a0(0x2bf)];},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x1ba)]=function(){const _0x45bdfc=_0x2833f3;this[_0x45bdfc(0x1ce)](),this[_0x45bdfc(0x1db)]();const _0x362f1f=TextManager[_0x45bdfc(0x262)](this[_0x45bdfc(0x28f)]),_0x3aa920=this[_0x45bdfc(0x1e3)]();this[_0x45bdfc(0x2b2)](ColorManager[_0x45bdfc(0x2f6)](_0x3aa920)),this[_0x45bdfc(0x20a)](_0x362f1f,0x0,0x0,this['innerWidth'],_0x45bdfc(0x29c));},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x1e3)]=function(){const _0x53a280=_0x2833f3;switch(this[_0x53a280(0x28f)]){case'auto':if($gameTemp[_0x53a280(0x234)]())return Window_ButtonConsole[_0x53a280(0x265)];break;case _0x53a280(0x2bb):const _0x280cc9=SceneManager[_0x53a280(0x29e)];if($gameSystem[_0x53a280(0x255)]())return Window_ButtonConsole[_0x53a280(0x297)];else{if(_0x280cc9&&_0x280cc9[_0x53a280(0x269)]&&_0x280cc9[_0x53a280(0x269)]())return Window_ButtonConsole[_0x53a280(0x265)];}break;case _0x53a280(0x31a):if(!$gameSystem[_0x53a280(0x27a)]()||!SceneManager[_0x53a280(0x2dd)]())return Window_ButtonConsole[_0x53a280(0x297)];break;case'load':if(!DataManager[_0x53a280(0x303)]()||!SceneManager[_0x53a280(0x2dd)]())return Window_ButtonConsole[_0x53a280(0x297)];break;case _0x53a280(0x2d6):case _0x53a280(0x23c):if(!SceneManager[_0x53a280(0x2dd)]())return Window_ButtonConsole['TEXT_COLOR_DISABLED'];break;case _0x53a280(0x1dd):case _0x53a280(0x240):if(!$gameSystem[_0x53a280(0x26b)]()||!SceneManager['isSceneMap']())return Window_ButtonConsole[_0x53a280(0x297)];break;}return Window_ButtonConsole[_0x53a280(0x31e)];},Window_ButtonConsole['prototype'][_0x2833f3(0x2fd)]=function(){return!![];},Window_ButtonConsole['prototype'][_0x2833f3(0x20f)]=function(){const _0x2b6e1d=_0x2833f3;if(this[_0x2b6e1d(0x1e4)]<0xff)return;if(!this[_0x2b6e1d(0x264)])return;switch(this[_0x2b6e1d(0x28f)]){case'auto':let _0x4d3c26=!$gameTemp[_0x2b6e1d(0x234)]();$gameTemp[_0x2b6e1d(0x263)](_0x4d3c26);_0x4d3c26?this[_0x2b6e1d(0x2a2)]():SoundManager[_0x2b6e1d(0x26d)]();break;case _0x2b6e1d(0x2bb):if(!$gameSystem['isExtendedFastForwardDisallowed']()){let _0x4cf30d=!$gameTemp[_0x2b6e1d(0x291)]();$gameTemp[_0x2b6e1d(0x2bc)](_0x4cf30d),_0x4cf30d?this[_0x2b6e1d(0x2a2)]():SoundManager[_0x2b6e1d(0x26d)](),this[_0x2b6e1d(0x1ba)]();}else this[_0x2b6e1d(0x314)]();break;case _0x2b6e1d(0x31a):$gameSystem[_0x2b6e1d(0x27a)]()&&SceneManager[_0x2b6e1d(0x2dd)]()?(this[_0x2b6e1d(0x2a2)](),SceneManager[_0x2b6e1d(0x1ca)](Scene_SaveButtonConsole)):this[_0x2b6e1d(0x314)]();break;case _0x2b6e1d(0x2b4):DataManager[_0x2b6e1d(0x303)]()&&SceneManager[_0x2b6e1d(0x2dd)]()?(this[_0x2b6e1d(0x2a2)](),SceneManager[_0x2b6e1d(0x1ca)](Scene_Load)):this['playBuzzerSound']();break;case _0x2b6e1d(0x2d6):SceneManager[_0x2b6e1d(0x2dd)]()?(this[_0x2b6e1d(0x2a2)](),SceneManager[_0x2b6e1d(0x1ca)](Scene_Options)):this[_0x2b6e1d(0x314)]();break;case _0x2b6e1d(0x23c):SceneManager[_0x2b6e1d(0x2dd)]()?(this['playOkSound'](),SceneManager[_0x2b6e1d(0x1ca)](Scene_GameEnd)):this['playBuzzerSound']();break;case _0x2b6e1d(0x1c3):Imported[_0x2b6e1d(0x30a)]&&$gameTemp['toggleMessageWindowVisibility']();break;case'backlog':case _0x2b6e1d(0x240):Imported[_0x2b6e1d(0x2ed)]&&($gameSystem['isMainMenuMessageLogEnabled']()&&SceneManager[_0x2b6e1d(0x2dd)]()?(this['playOkSound'](),SceneManager[_0x2b6e1d(0x1ca)](Scene_MessageLog)):this[_0x2b6e1d(0x314)]());break;}TouchInput[_0x2b6e1d(0x2b8)]();},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x2e4)]=function(){const _0x3ec022=_0x2833f3;Window_Scrollable[_0x3ec022(0x22e)][_0x3ec022(0x2e4)][_0x3ec022(0x1d0)](this),this['updateConsoleVisibility'](),this['updateColor'](),this[_0x3ec022(0x2ad)]();},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x2f4)]=function(){const _0x32afde=_0x2833f3;if(!this['_parentWindow'])return;this[_0x32afde(0x1e4)]=this[_0x32afde(0x237)]['openness'];},Window_ButtonConsole[_0x2833f3(0x22e)][_0x2833f3(0x2b3)]=function(){const _0x5ed779=_0x2833f3;this[_0x5ed779(0x28f)]===_0x5ed779(0x2bb)&&(this[_0x5ed779(0x326)]!==Input[_0x5ed779(0x1df)](VisuMZ[_0x5ed779(0x1cf)]['Settings'][_0x5ed779(0x212)]['FastForwardKey'])&&(this[_0x5ed779(0x326)]=Input[_0x5ed779(0x1df)](VisuMZ[_0x5ed779(0x1cf)][_0x5ed779(0x277)][_0x5ed779(0x212)][_0x5ed779(0x25c)]),this[_0x5ed779(0x1ba)]()));},Window_ButtonConsole['prototype'][_0x2833f3(0x2ad)]=function(){const _0x2fd31f=_0x2833f3;if(!Window_ButtonConsole[_0x2fd31f(0x1e6)])return;if(this['_buttonConsoleSprites'][_0x2fd31f(0x293)]){const _0x172077=this['_buttonConsoleSprites'][_0x2fd31f(0x293)];_0x172077['visible']=this[_0x2fd31f(0x1e3)]()===Window_ButtonConsole[_0x2fd31f(0x297)];}if(this['_buttonConsoleSprites'][_0x2fd31f(0x1b4)]){const _0x419c84=this['_buttonConsoleSprites'][_0x2fd31f(0x1b4)];_0x419c84[_0x2fd31f(0x264)]=this[_0x2fd31f(0x1e3)]()===Window_ButtonConsole[_0x2fd31f(0x31e)];}if(this[_0x2fd31f(0x2db)][_0x2fd31f(0x2ef)]){const _0x46a614=this[_0x2fd31f(0x2db)][_0x2fd31f(0x2ef)];_0x46a614[_0x2fd31f(0x264)]=this[_0x2fd31f(0x1e3)]()===Window_ButtonConsole[_0x2fd31f(0x265)];}};