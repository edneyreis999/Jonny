//=============================================================================
// VisuStella MZ - Core Engine
// VisuMZ_0_CoreEngine.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_0_CoreEngine = true;

var VisuMZ = VisuMZ || {};
VisuMZ.CoreEngine = VisuMZ.CoreEngine || {};
VisuMZ.CoreEngine.version = 1.85;

//=============================================================================
/*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 0] [Version 1.85] [CoreEngine]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Core_Engine_VisuStella_MZ
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Core Engine plugin is designed to fix any bugs that may have slipped
 * past RPG Maker MZ's source code and to give game devs more control over
 * RPG Maker MZ's various features, ranging from mechanics to aesthetics to
 * quality of life improvements.
 *
 * Features include all (but not limited to) the following:
 *
 * * Bug fixes for the problems existing in the RPG Maker MZ base code.
 * * Failsafes added for Script Call related event commands.
 * * Lots of Quality of Life Settings that can be activated through the
 *   Plugin Parameters.
 * * Control over the various Text Colors used throughout the game.
 * * Change up the maximum amount of gold carried, give it an icon attached to
 *   the label, and include text for overlap specifics.
 * * Preload images as the game boots up.
 * * Add specific background images for menus found throughout the game.
 * * A button assist window will appear at the top or bottom of the screen,
 *   detailing which buttons do what when inside a menu. This feature can be
 *   turned off.
 * * Choose which in-game battler parameters to display inside menus (ie ATK,
 *   DEF, AGI, etc.) and determine their maximum values, along with plenty of
 *   notetags to give more control over parameter, x-parameter, s-parameter
 *   bonuses through equipment, states, and other trait objects.
 * * Control over how the UI objects appear (such as the menu button, cancel
 *   button, left/right actor switch buttons).
 * * Reposition actors and enemies if the battle resolution is larger.
 * * Allow class names and nicknames to support text codes when displayed.
 * * Determine how windows behave in the game, if they will mask other windows,
 *   their line height properties, and more.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 0 ------
 *
 * This plugin is a Tier 0 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ Plugin library.
 *
 * ============================================================================
 * Important Changes: Bug Fixes
 * ============================================================================
 *
 * This plugin also serves to fix various bugs found in RPG Maker MZ that have
 * been unaddressed or not yet taken care of. The following is a list of bugs
 * that have been fixed by this plugin:
 *
 * ---
 *
 * Attack Skill Trait
 *
 * Enemies are unaffected by the Attack Skill Trait. This means if they have
 * an Attack action, they will always use Attack over and over even if their
 * Attack Skill Trait has been changed. This plugin will change it up so that
 * the Attack skill will comply with whatever their Attack Skill Trait's skill
 * is set to.
 *
 * ---
 *
 * Auto Battle Actor Skill Usage
 *
 * If an actor with Auto Battle has access to a skill but not have any access
 * to that skill's type, that actor will still be able to use the skill during
 * Auto Battle despite the fact that the actor cannot use that skill during
 * manual input.
 *
 * ---
 *
 * Auto Battle Attack Seal Bypass
 *
 * By default, if the attack skill is sealed via a trait and an actor has
 * auto-battle, the action can still be used via auto-battle. This is now fixed
 * and actors should not be able to attack via auto-battle if their attack
 * ability is sealed.
 *
 * ---
 *
 * Auto Battle Lock Up
 *
 * If an auto battle Actor fights against an enemy whose DEF/MDF is too high,
 * they will not use any actions at all. This can cause potential game freezing
 * and softlocks. This plugin will change that and have them default to a
 * regular Attack.
 *
 * ---
 *
 * Auto Save After New Game
 *
 * Normally, when starting a new game through the "New Game" option, there is
 * no auto save trigger. However, if you start a new game or load a saved game,
 * then go to the Game End screen, return back to the title screen, then start
 * a New Game, the auto save trigger occurs when it shouldn't. The Core Engine
 * will now patch this and prevent the trigger from taking place.
 *
 * ---
 *
 * Battle Forced End Action Crash
 *
 * Depending on various circumstances, currently active battlers can be cleared
 * from the battle system at will due to a number of reasons. However, if it
 * just so happens that the targets are cleared, too, with actions remaining,
 * then a crash will follow up. This plugin will prevent that change. Fix made
 * by Olivia.
 *
 * ---
 *
 * Debug Console Refresh Bug
 *
 * When pressing F5 to refresh while the debug console (DevTools) is open,
 * some graphics will fail to load properly. This started occurring since the
 * RPG Maker MZ 1.5.0 update and the code for loading the images has now been
 * reverted to the 1.4.4 version where it was last stable.
 *
 * ---
 *
 * Gamepad Repeat Input
 *
 * Cleared inputs on gamepads do not have a downtime and will trigger the
 * following input frame. The causes problems with certain RPG Maker MZ menus
 * where the inputs have to be cleared as the next immediate frame will have
 * them inputted again. This plugin changes it so that whenever inputs are
 * cleared, there is a downtime equal to the keyboard clear frames before the
 * gamepad input is registered once more.
 *
 * ---
 *
 * Invisible Battle Sprites
 *
 * If you removed a party member during battle and added that exact party
 * member back into the same slot, their sprite would appear invisible. The
 * VisuStella Core Engine will fix this problem and prevent it from happening.
 *
 * ---
 *
 * Instant Text Discrepancy for Window_Message
 *
 * Window_Message displays text differently when it draws letters one by one
 * versus when the text is displayed instantly. This isn't noticeable with the
 * default font, but it's very visible when using something like Arial. The
 * error is due to Bitmap.measureTextWidth yielding a rounded value per letter
 * versus per word. The Core Engine will provide a bug fix that will single out
 * the cause and make it so that only Window_Message will not utilize any round
 * number values when determining the width of each letter, whether or not it
 * is shown instantly. This change will only affect Window_Message and not any
 * other window in order to prevent unintended side effects.
 *
 * This can be disabled through the Plugin Parameters:
 *
 * Plugin Parameters > QoL Settings > Misc > Font Width Fix
 *
 * ---
 *
 * Move Picture, Origin Differences
 *
 * If a Show Picture event command is made with an Origin setting of
 * "Upper Left" and a Move Picture event command is made afterwards with an
 * Origin setting of "Center", RPG Maker MZ would originally have it instantly
 * jump into the new origin setting without making a clean transition between
 * them. This plugin will create that clean transition between origins.
 *
 * ---
 *
 * Overly-Protective Substitute
 *
 * When an ally with critical health is being targeted by a friendly non-
 * Certain Hit skill (such as a heal or buff) and another ally has the
 * substitute state, the other ally would "protect" the originally targeted
 * ally and take the heal or buff.
 *
 * The new changed behavior is that now, substitute will not trigger for any
 * actions whose scope targets allies.
 *
 * ---
 *
 * Skill List Active After Party Member Change
 *
 * If the skill list is active (ie. the player can move the cursor around) and
 * the party member currently being viewed is changed via the button commands,
 * then previously, RPG Maker MZ would still have that window be active despite
 * having the cursor hidden temporarily. Upon pressing direction buttons, the
 * cursor reveals itself and both the skill type window and skill list window
 * are both active, making way for lots of potential problems to happen.
 *
 * ---
 *
 * Sprite Removal and Destroy Crash
 *
 * A texture check will now occur for sprites that are being removed and
 * destroyed in order to prevent crashes. In the off chance that someone
 * creates a sprite through a script call and removes it through such, the
 * likelihood of this occurance becomes higher. This makes the "destroy"
 * property take into account a texture check in order to see if the sprite
 * removal is taking extra steps and will reduce those extra steps.
 *
 * ---
 *
 * Status Window Name Vertical Cutoffs
 *
 * In the battle status windows, whenever actor names are displayed, the bitmap
 * used to display their name text do not extend vertically all the way,
 * causing letters like lowercase "Q" and "G" to be cut off, making them hard
 * to distinguish from one another. The Core Engine will remedy this by
 * extending the bitmap to allow enough room. Fix made by Irina.
 *
 * ---
 *
 * Termination Clear Effects
 *
 * In RPG Maker MZ, requesting an animation while transitioning between
 * scenes, such as going from the map scene to the battle scene, can cause
 * crashes. This is because the animation queue does not take off immediately
 * and will likely register incorrect targets for the scene. This plugin will
 * forcefully clear any registered animations and balloon effects when
 * terminating a scene in order to prevent crashes.
 *
 * ---
 *
 * Timer Sprite
 *
 * By default, RPG Maker MZ adds Sprite_Timer into its spriteset, either for
 * maps or for battles. There is one major problem with this: when spritesets
 * are affected by filters, zooms, and/or blurs, this hinders how readable the
 * timer sprite is, making the information perceived by the player to be much
 * harder than it needs to be. The Core Engine adds the sprite to the parent
 * scene instead of the spriteset to ensure it's unobscured by anything else.
 *
 * ---
 *
 * Unusable Battle Items
 *
 * If any party member is able to use an item in battle, then all party members
 * are able to use said item, even if that party member is supposed to be
 * unable to use that item. This is now changed so that battle items are
 * checked on an individual basis and not on a party-wide basis.
 *
 * ---
 *
 * Water Tile Bug
 *
 * It seems like there's a new bug that occurs if you create a tileset from
 * scratch in RPG Maker MZ version 1.5.0+ and version 1.6.0+! What this bug
 * does is it causes many tiles to become water tiles without intending to.
 * You can find this out by turning off all the plugins in your project,
 * putting a Ship or Boat on what are normally ground tiles, and then seeing
 * the Ship or Boat traverse through it.
 *
 * There are two ways to fix this. We cannot fix it through code in this plugin
 * as it's a problem that involves the tileset json data there are ways to work
 * around it so that you can get the proper water-flags to go where they need
 * to be at.
 *
 * 1. Copy a working un-bugged tileset onto the currently bugged one and
 *    reapply the tile features like passability, terrain tags, etc. This will
 *    make sure the water-passability tiles get copied over correctly.
 *
 * 2. If you're on RPG Maker MZ version 1.5.0 or above, select a working
 *    un-bugged tileset (usually a pre-existing tileset when a new project is
 *    made), click the "Copy Page" button, go to the bugged tileset and press
 *    "Paste Page". You'll have to reapply any different properties like
 *    passabilities and terrain tags, but the water tile flags should now be
 *    working properly.
 *
 * The plugin will not fix the problem itself since flag data is delicate and
 * should not be tampered with midgame as the changes made by the plugin might
 * not match the desired settings.
 *
 * This plugin, however, will also send out an alert message when coming across
 * such a tile. Pay attention to it and do one of the following two steps above
 * to fix the problem.
 *
 * ---
 *
 * Window Arrows Sprite Tearing
 *
 * If a window object in RPG Maker MZ were to have an odd number for width size
 * then the arrow elements found for the window would be positioned on a half
 * pixel, giving it a blurry look and also have sprite tearing issues. This is
 * now fixed by rounding the number to the nearest whole number.
 *
 * ---
 *
 * Window Client Area Scaling Bug
 *
 * If the window has a scale value different from 1.0, the client area (the
 * interactable parts) will not scale properly and appear clipped out. This
 * is now fixed by adjusting the client area to the window's scale values and
 * rounding upward to the nearest whole number.
 *
 * ---
 *
 * Window Skin Bleeding
 *
 * This bug is fixed in the core scripts for RPG Maker MZ v1.3.0+.
 *
 * Since the v1.2.0 update, Window.prototype._refreshBack's frame value has
 * been set from 96 to 95. This results in the window skin bleeding past the
 * window's intended borders. The Core Engine now reverts this change to
 * prevent the bleeding effect from happening.
 *
 * ---
 *
 * ============================================================================
 * Major Changes: New Hard-Coded Features
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Scroll-Linked Pictures
 *
 * - If a Parallax has a ! at the start of its filename, it is bound to the map
 * scrolling. The same thing now happens with pictures. If a Picture has a ! at
 * the start of its filename, it is bound to the map's scrolling as well.
 *
 * ---
 *
 * Movement Route Scripts
 *
 * - If code in a Movement Route Script command fails, instead of crashing the
 * game, it will now act as if nothing happened except to display the cause of
 * the error inside the console.
 *
 * ---
 *
 * Script Call Failsafes
 *
 * - If code found in Conditional Branches, Control Variables, and/or Script
 * Calls fail to activate, instead of crashing the game, it will now act as if
 * nothing happened except to display the cause of the error inside the
 * console.
 *
 * ---
 *
 * Digit Grouping
 *
 * - There exists an option to change how numbers are displayed and converted
 * in your game. This option can be enabled or disabled by going into the
 * Plugin Manager > VisuMZ_0_OptionsCore > Quality of Life Settings >
 * Digit Grouping and toggling on/off whichever ones you want.
 *
 * - Digit Grouping will follow the rules of whatever country/locale the Plugin
 * Parameters are set to. If it's to default 'en-US', then 1234567.123456 will
 * become 1,234,567.123456. Set it to 'es-ES' and it becomes 1.234.567,123456
 * instead.
 *
 * - This uses JavaScript's Number.toLocaleString() function and will therefore
 * follow whatever rules it has. This means if there are trailing zeroes at the
 * end of a decimal, it will cut them off. Numbers like 123.45000 will become
 * 123.45 instead. Excess numbers past 6 decimal places will be rounded. A
 * number like 0.123456789 will become 0.123457 instead.
 *
 * - Numbers in between [ and ], < and > will be excluded from digit grouping
 * in order for text codes to be preserved accurately. \I[1234] will remain as
 * \I[1234].
 *
 * - If you would like to enter in a number without digit grouping, surround it
 * with {{ and }}. Typing in {{1234567890}} will yield 1234567890.
 *
 * ---
 *
 * Show Scrolling Text, additional functionality
 *
 * The event command "Show Scrolling Text" now has additional functionality as
 * long as the VisuStella MZ Core Engine is installed. If the game dev inserts
 * "// Script Call" (without the quotes) inside the scrolling text, then the
 * entirity of the Show Scrolling Text event command will be ran as a giant
 * script call event command.
 *
 * The reason why this functionality is added is because the "Script..." event
 * command contains only 12 lines maximum. This means for any script call
 * larger than 12 lines of code cannot be done by normal means as each script
 * call is ran as a separate instance.
 *
 * By repurposing the "Show Scrolling Text" event command to be able to
 * function as an extended "Script..." event command, such a thing is now
 * possible with less hassle and more lines to code with.
 *
 * This effect does not occur if the Show Scrolling Text event command does not
 * have "// Script Call" in its contents.
 *
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * ---
 *
 * === Actors-Related Notetags ===
 *
 * Parameter limits can be adjusted in the Plugin Parameters, but this won't
 * lift the ability to change the values of an actor's initial or max level
 * past the editor's limits. Instead, this must be done through the usage of
 * notetags to accomplish the feat.
 *
 * ---
 *
 * <Max Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's max level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * <Initial Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's initial level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * === Classes-Related Notetags ===
 *
 * As actor levels can now surpass 99 due to the notetag system, there may be
 * some skills you wish certain classes can learn upon reaching higher levels
 * past 99, too.
 *
 * ---
 *
 * <Learn At Level: x>
 *
 * - Used for: Class Skill Learn Notetags
 * - Replace 'x' with an integer to determine the level this class will learn
 *   the associated skill at.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the class's database value.
 *
 * ---
 *
 * === Enemies-Related Notetags ===
 *
 * Enemies are now given levels. The levels don't do anything except to serve
 * as a container for a number value. This way, levels can be used in damage
 * formulas (ie. a.atk - b.level) without causing any errors. To give enemies
 * levels, use the notetags below. These notetags also allow you to adjust the
 * base parameters, EXP, and Gold past the database limitations.
 *
 * ---
 *
 * <Level: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's level.
 * - If no level is declared, the level will default to 1.
 *
 * ---
 *
 * <param: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to alter.
 *   - This notetag does NOT work with X Parameters, S Parameters, or any
 *     custom parameters. This notetag ONLY works with the base parameters.
 * - Replace 'x' with an integer to set an enemy's 'param' base value.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 *
 * <EXP: x>
 * <Gold: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's EXP or Gold values.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 *
 * === Animations-Related Notetags ===
 *
 * Animations in RPG Maker MZ are done by Effekseer and the animation system
 * has been revamped. However, the animations are only centered on the targets
 * now, and cannot be attached to the head or foot. Insert these tags into
 * the names of the animations in the database to adjust their positions.
 *
 * ---
 *
 * <Head>
 * <Foot>
 *
 * - Used for: Animation Name Tags
 * - Will set the animation to anchor on top of the sprite (if <Head> is used)
 *   or at the bottom of the sprite (if <Foot> is used).
 *
 * ---
 *
 * <Anchor X: x>
 * <Anchor Y: y>
 *
 * <Anchor: x, y>
 *
 * - Used for: Animation Name Tags
 * - Will anchor the animation at a specific point within the sprite based on
 *   the 'x' and 'y' values.
 * - Replace 'x' and 'y' with numeric values representing their positions based
 *   on a rate where 0.0 is the furthest left/up (x, y respectively) to 1.0 for
 *   the furthest right/down (x, y respectively).
 *
 * Examples:
 *
 * <Anchor X: 0.4>
 * <Anchor Y: 0.8>
 *
 * <Anchor: 0.2, 0.9>
 *
 * ---
 *
 * <Offset X: +x>
 * <Offset X: -x>
 * <Offset Y: +y>
 * <Offset Y: -y>
 *
 * <Offset: +x, +y>
 * <Offset: -x, -y>
 *
 * - Used for: Animation Name Tags
 * - Will anchor the animation to be offset by an exact number of pixels.
 * - This does the same the editor does, except it lets you input values
 *   greater than 999 and lower than -999.
 * - Replace 'x' and 'y' with numeric values the exact number of pixels to
 *   offset the animation's x and y coordinates by.
 *
 * Examples:
 *
 * <Offset X: +20>
 * <Offset Y: -50>
 *
 * <Offset: +10, -30>
 *
 * ---
 *
 * <Mirror Offset X>
 * <No Mirror Offset X>
 *
 * - Used for: Animation Name Tags
 * - If an animation is mirrored, you can choose to have the animation's Offset
 *   X value be mirrored, too (or not at all).
 * - If no name tag is discovered, this will use the setting found in the
 *   Plugin Parameters > QoL Settings > Misc > Ani: Mirror Offset X setting.
 *
 * ---
 *
 * <Rate: x>
 *
 * - Used for: MV Animation Name Tags
 * - Allows you to adjust the update for this MV Animation.
 *   - Does NOT work with Effekseer animations.
 * - The lower the number, the faster.
 * - Replace 'x' with a number representing the animation update rate.
 *   - Default rate: 4.
 *   - Minimum rate: 1.
 *   - Maximum rate: 10.
 *
 * ---
 *
 * === Quality of Life-Related Notetags ===
 *
 * By default, RPG Maker MZ does not offer an encounter step minimum after a
 * random encounter has finished. This means that one step immediately after
 * finishing a battle, the player can immediately enter another battle. The
 * Quality of Life improvement: Minimum Encounter Steps allows you to set a
 * buffer range between battles for the player to have some breathing room.
 *
 * ---
 *
 * <Minimum Encounter Steps: x>
 *
 * - Used for: Map Notetags
 * - Replace 'x' with the minimum number of steps before the player enters a
 *   random encounter on that map.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => Encounter Rate Min.
 *
 * ---
 *
 * Tile shadows are automatically added to certain tiles in the map editor.
 * These tile shadows may or may not fit some types of maps. You can turn them
 * on/off with the Quality of Life Plugin Parameters or you can override the
 * settings with the following notetags:
 *
 * ---
 *
 * <Show Tile Shadows>
 * <Hide Tile Shadows>
 *
 * - Used for: Map Notetags
 * - Use the respective notetag for the function you wish to achieve.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => No Tile Shadows.
 *
 * ---
 *
 * <Scroll Lock X>
 * <Scroll Lock Y>
 *
 * - Used for: Map Notetags
 * - Will prevent the map from being able to scroll left/right(x) or up/down(y)
 *   if these notetags are present.
 * - Useful for when maps are just slightly smaller than normal and the tiny
 *   scrolling is distracting.
 * - This will use the display nudge setting found in the Plugin Parameters.
 * - This setting will be disabled if the map is zoomed in.
 *
 * ---
 *
 * <Scroll Lock X: x>
 * <Scroll Lock Y: y>
 *
 * - Used for: Map Notetags
 * - Will prevent the map from being able to scroll left/right(x) or up/down(y)
 *   if these notetags are present and will nudge the map camera slightly.
 * - Useful for when maps are just slightly smaller than normal and the tiny
 *   scrolling is distracting.
 * - Replace 'x' and 'y' with numbers between 0 and 1 to represent how much is
 *   being judged.
 *   - For example, for a 1280x720 resolution, a 27 tile wide map will benefit
 *     from a nudge of 0.15625. Play with these numbers to determine the best
 *     value for your maps.
 * - This setting will be disabled if the map is zoomed in.
 *
 * ---
 *
 * === Basic, X, and S Parameters-Related Notetags ===
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * behaviors and give boosts to trait objects in a more controlled manner.
 *
 * ---
 *
 * <param Plus: +x>
 * <param Plus: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Rate: x%>
 * <param Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'param' value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Flat: +x>
 * <param Flat: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Max: x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Sets max caps for the 'param' to be 'x'. If there are multiple max caps
 *   available to the unit, then the highest will be selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer to determine what the max cap should be.
 * - This does NOT set the max cap to be lower than the default cap.
 *
 * ---
 *
 * <xparam Plus: +x%>
 * <xparam Plus: -x%>
 *
 * <xparam Plus: +x.x>
 * <xparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Rate: x%>
 * <xparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'xparam' value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Flat: +x%>
 * <xparam Flat: -x%>
 *
 * <xparam Flat: +x.x>
 * <xparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <sparam Plus: +x%>
 * <sparam Plus: -x%>
 *
 * <sparam Plus: +x.x>
 * <sparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Rate: x%>
 * <sparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'sparam' value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Flat: +x%>
 * <sparam Flat: -x%>
 *
 * <sparam Flat: +x.x>
 * <sparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * === Tileset-Related Notetags ===
 *
 * ---
 *
 * <Taller By x: id>
 *
 * - Used for: Tileset Notetags
 * - Changes any page B, C, D, E tile marked by terrain tag 'id' to be taller
 *   by 'x' tiles.
 *   - Replace 'x' with a number representing the tiles to be taller by.
 *   - Replace 'id' with a number representing the Terrain Tag you will use to
 *     mark this tile with in the Database editor.
 * - When placing these tiles on the map, all you have to do is just place the
 *   bottom tile.
 *   - ie.: For a tree that's one tile taller, just place the tile at the
 *     bottom where you see the trunk.
 *   - Then, in-game, the tree will appear taller by one tile as marked.
 * - Depending on the priority settings, the tile will appear on different
 *   layers.
 *   - O will place the tile on the below player layer.
 *   - X will place the tile on the same level as the player.
 *   - ★ will place the tile on the above player layer.
 *   - O/X layer tiles have a special property where tall sprites standing in
 *     front of it will no longer clip the top of the sprite, while sprites
 *     standing behind it will be covered by it.
 *   - The X layer sprite will only have a hitbox of 1x1 at the base.
 * - This does not work with events using tiles as graphics. Instead, if you
 *   want to do similar, use the Event & Movement Core's <Tile Expand> notetags
 *   for better control.
 *
 * ---
 *
 * === JavaScript Notetags: Basic, X, and S Parameters ===
 *
 * The following are notetags made for users with JavaScript knowledge. These
 * notetags are primarily aimed at Basic, X, and S Parameters.
 *
 * ---
 *
 * <JS param Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' plus value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' rate value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' flat value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Max: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to determine what the max cap for 'param' should be. If there
 *   are multiple max caps available to the unit, then the highest is selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine the max cap for the
 *   desired parameter.
 *
 * ---
 *
 * <JS xparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' plus value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the X parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS xparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' rate value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the X parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS xparam Flat: code>
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' flat value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the X parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' plus value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the S parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' rate value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the S parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' flat value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the S parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * === Battle Setting-Related Notetags ===
 *
 * These tags will change the settings for battle regardless of how the battle
 * system is set up normally. Insert these tags in either the noteboxes of maps
 * or the names of troops for them to take effect. If both are present for a
 * specific battle, then priority goes to the setting found in the troop name.
 *
 * ---
 *
 * <FV>
 * <Front View>
 * <Battle View: FV>
 * <Battle View: Front View>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the perspective of battle to front view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/enemies/
 *   folder as they will used instead of the "sv_enemies" graphics.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 *
 * ---
 *
 * <SV>
 * <Side View>
 * <Battle View: SV>
 * <Battle View: Side View>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the perspective of battle to side view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/sv_enemies/
 *   folder as they will used instead of the "enemies" graphics.
 * - Make sure your actors have "sv_actor" graphics attached to them.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 *
 * ---
 *
 * <DTB>
 * <Battle System: DTB>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the default battle system (DTB).
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 *
 * ---
 *
 * <TPB Active>
 * <ATB Active>
 * <Battle System: TPB Active>
 * <Battle System: ATB Active>
 *
 * <TPB Wait>
 * <ATB Wait>
 * <Battle System: TPB Wait>
 * <Battle System: ATB Wait>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the time progress battle system (TPB) or
 *   active turn battle system (ATB) if you have VisuMZ_2_BattleSystemATB
 *   installed for the game project.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 *
 * ---
 *
 * <BTB>
 * <Battle System: BTB>
 *
 * <CTB>
 * <Battle System: CTB>
 *
 * <ETB>
 * <Battle System: ETB>
 *
 * <FTB>
 * <Battle System: FTB>
 *
 * <OTB>
 * <Battle System: OTB>
 *
 * <PTB>
 * <Battle System: PTB>
 *
 * <STB>
 * <Battle System: STB>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Changes the battle system to the respective battle system as long as you
 *   have those plugins installed in the current project.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 *
 * ---
 *
 * <Grid>
 * <Battle Grid>
 *
 * <No Grid>
 * <No Battle Grid>
 *
 * - Used for: Map Notetags, Troop Name Tags, and Troop Comment Tags
 * - Requires VisuMZ_2_BattleGridSystem!
 * - Changes the battle system to utilize the Battle Grid System or not.
 * - If using Troop Comment Tags, then as long as the tag appears in a comment
 *   found on any of the Troop's pages (even if they don't run), the tag will
 *   be considered in effect.
 * - If none of these notetags or comment tags are found, refer to the default
 *   settings found in the Plugin Parameters.
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
 * === Animation Commands ===
 *
 * ---
 *
 * Animation: Play at Coordinate
 * - Plays an animation on the screen at a specific x, y coordinate even if
 *   there is no sprite attached.
 *
 *   Animation ID:
 *   - Plays this animation.
 *
 *   Coordinates:
 *
 *     X:
 *     Y:
 *     - X/Y coordinate used for the animation.
 *       You may use JavaScript code.
 *
 *   Mirror Animation?:
 *   - Mirror the animation?
 *
 *   Mute Animation?:
 *   - Mute the animation?
 *
 * ---
 *
 * === Audio Plugin Commands ===
 *
 * ---
 *
 * Audio: Change Current BGM Volume
 * - Changes the current BGM volume without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Volume:
 *   - Change the current BGM's volume to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 0 to 100.
 *
 * ---
 *
 * Audio: Change Current BGM Pitch
 * - Changes the current BGM pitch without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Pitch:
 *   - Change the current BGM's pitch to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 50 to 150.
 *
 * ---
 *
 * Audio: Change Current BGM Pan
 * - Changes the current BGM pan without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Pan:
 *   - Change the current BGM's pan to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from -100 to 100.
 *
 * ---
 *
 * Audio: Change Current BGM Volume
 * - Changes the current BGM volume without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Volume:
 *   - Change the current BGM's volume to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 0 to 100.
 *
 * ---
 *
 * Audio: Change Current BGM Pitch
 * - Changes the current BGM pitch without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Pitch:
 *   - Change the current BGM's pitch to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from 50 to 150.
 *
 * ---
 *
 * Audio: Change Current BGM Pan
 * - Changes the current BGM pan without changing any of the current BGM's
 *   other properties and without restarting the BGM.
 *
 *   Pan:
 *   - Change the current BGM's pan to what amount?
 *   - You may use JavaScript code.
 *   - Use numbers from -100 to 100.
 *
 * ---
 *
 * === Debug Plugin Commands ===
 *
 * ---
 *
 * Debug: Current Controller ID
 * - PLAY TEST ONLY.
 * - Shows current controller ID in debug console.
 * - If you press a key on the keyboard, this data will be erased.
 * - Also copies to computer clipboard if possible.
 *
 * ---
 *
 * === Export Plugin Commands ===
 *
 * ---
 *
 * Export: All Maps Text
 * - PLAY TEST ONLY. Exports all of the text from all maps,
 *   their events, event pages, and any associated Common Events.
 *
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *
 * ---
 *
 * Export: All Troops Text
 * - PLAY TEST ONLY. Exports all of the text from all troops,
 *   their event pages, and any associated Common Events.
 *
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *
 * ---
 *
 * Export: Current Map Text
 * - PLAY TEST ONLY. Exports all of the text on the current map,
 *   its events, the event pages, and any associated Common Events.
 *
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *   - If not in battle, this Plugin Command will not work.
 *
 * ---
 *
 * Export: Current Troop Text
 * - PLAY TEST ONLY. Exports all of the text on the current troop,
 *   the troop's event pages, and any associated Common Events.
 *
 *   - Exports 'Show Text' event commands.
 *   - Exports 'Show Choices' event commands.
 *   - Exports 'Show Scrolling Text' event commands.
 *   - Exports 'Comments' event commands.
 *   - Only the raw text will be exported.
 *   - Only usable during Play Test.
 *   - If not in battle, this Plugin Command will not work.
 *
 * ---
 *
 * === Game Plugin Commands ===
 *
 * ---
 *
 * Game: Open URL
 * - Opens a website URL from the game.
 *
 *   URL:
 *   - Where do you want to take the player?
 *
 * ---
 *
 * === Gold Plugin Commands ===
 *
 * ---
 *
 * Gold: Gain/Lose
 * - Allows you to give/take more gold than the event editor limit.
 *
 *   Value:
 *   - How much gold should the player gain/lose?
 *   - Use negative values to remove gold.
 *
 * ---
 *
 * === Map Plugin Commands ===
 *
 * ---
 *
 * Map: Once Parallel
 * - Plays a Common Event parallel to the event once without repeating itself
 *   when done.
 * - Map only!
 *
 *   Common Event ID:
 *   - The ID of the parallel Common Event to play.
 *   - Does NOT repeat itself when finished.
 *   - When exiting map scene or changing maps, all Once Parallels are cleared.
 *   - Once Parallels are not retained upon reentering the scene or map.
 *   - Once Parallels are not stored in memory and cannot be saved.
 *
 * ---
 *
 * === Picture Plugin Commands ===
 *
 * ---
 *
 * Picture: Coordinates Mode
 * - Play Test Mode only! Gets the coordinates of a specific picture as you
 *   move it across the screen.
 *
 *   Picture ID:
 *   - The ID of the pictures to track the coordinates of.
 *
 * ---
 *
 * Picture: Easing Type
 * - Changes the easing type to a number of options.
 *
 *   Picture ID:
 *   - Which picture do you wish to apply this easing to?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 *   Instructions:
 *   - Insert this Plugin Command after a "Move Picture" event command.
 *   - Turn off "Wait for Completion" in the "Move Picture" event.
 *   - You may have to add in your own "Wait" event command after.
 *
 * ---
 *
 * Picture: Erase All
 * - Erases all pictures on the screen because it's extremely tedious to do it
 *   one by one.
 *
 * ---
 *
 * Picture: Erase Range
 * - Erases all pictures within a range of numbers because it's extremely
 *   tedious to do it one by one.
 *
 *   Starting ID:
 *   - The starting ID of the pictures to erase.
 *
 *   Ending ID:
 *   - The ending ID of the pictures to erase.
 *
 * ---
 *
 * Picture: Rotate by Angle
 * - Rotates target picture by a amount angle over a set duration instead of
 *   continuously.
 *
 *   Picture ID Number:
 *   - What is the ID of the picture you wish to rotate?
 *   - Use a number between 1 and 100.
 *   - You may use JavaScript code.
 *
 *   Adjust Angle:
 *   - What is the angle you wish to rotate the picture by?
 *   - Use degrees (360 degrees per full rotation).
 *   - You may use JavaScript code.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 *   Duration:
 *   - Duration of rotation effect in frames.
 *   - 60 frames = 1 second.
 *   - You may use JavaScript code.
 *
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 *
 * ---
 *
 * Picture: Rotate to Angle
 * - Rotates target picture to a certain angle over a set duration
 *   instead of continuously.
 *
 *   Picture ID Number:
 *   - What is the ID of the picture you wish to rotate?
 *   - Use a number between 1 and 100.
 *   - You may use JavaScript code.
 *
 *   Target Angle:
 *   - What is the target angle you wish to rotate the picture?
 *   - Use degrees (360 degrees per full rotation).
 *   - You may use JavaScript code.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 *   Duration:
 *   - Duration of rotation effect in frames.
 *   - 60 frames = 1 second.
 *   - You may use JavaScript code.
 *
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 *
 * ---
 *
 * Picture: Show Icon
 * - Shows an icon instead of a picture image.
 * - The picture icon can be controlled like any other picture.
 *
 *   General:
 *
 *     Picture ID Number:
 *     - What is the ID of the picture you wish to show at?
 *     - Use a number between 1 and 100.
 *     - You may use JavaScript code.
 *
 *     Icon Index:
 *     - Select the icon index to use for this picture.
 *     - You may use JavaScript code.
 *
 *     Smooth Icon?:
 *     - This will make the icon smoothed out or pixelated.
 *
 *   Picture Settings:
 *
 *     Position:
 *
 *       Origin:
 *       - What is the origin of this picture icon?
 *         - Upper Left
 *         - Center
 *
 *       Position X:
 *       - X coordinate of the picture.
 *       - You may use JavaScript code.
 *
 *       Position Y:
 *       - Y coordinate of the picture.
 *       - You may use JavaScript code.
 *
 *     Scale:
 *
 *       Width %:
 *       - Horizontal scale of the picture.
 *       - You may use JavaScript code.
 *       - 100 is 100%
 *
 *       Height %:
 *       - Vertical scale of the picture.
 *       - You may use JavaScript code.
 *       - 100 is 100%
 *
 *     Blend:
 *
 *       Opacity:
 *       - Insert a number to determine opacity level.
 *       - Use a number between 0 and 255.
 *       - You may use JavaScript code.
 *
 *       Blend Mode:
 *       - What kind of blend mode do you wish to apply to the picture?
 *
 * ---
 *
 * === Screen Shake Plugin Commands ===
 *
 * ---
 *
 * Screen Shake: Custom:
 * - Creates a custom screen shake effect and also sets the following uses of
 *   screen shake to this style.
 *
 *   Shake Style:
 *   - Select shake style type.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 *
 *   Power:
 *   - Power level for screen shake.
 *
 *   Speed:
 *   - Speed level for screen shake.
 *
 *   Duration:
 *   - Duration of screenshake.
 *   - You can use code as well.
 *
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 *
 * ---
 *
 * === Switch Plugin Commands ===
 *
 * ---
 *
 * Switches: Randomize ID(s)
 * - Select specific Switch ID's to randomize ON/OFF.
 *
 *   Switch ID(s):
 *   - Select which Switch ID(s) to toggle.
 *
 *   Chance for ON:
 *   - Chance out of 100 that determines the switches to be ON.
 *
 * ---
 *
 * Switches: Randomize Range
 * - Select specific Switch ID Range to randomize ON/OFF.
 * - The ratio determines the ON/OFF distribution.
 *
 *   Starting ID:
 *   - The starting ID of the Switch to toggle.
 *
 *   Ending ID:
 *   - The ending ID of the Switch to toggle.
 *
 *   Chance for ON:
 *   - Chance out of 100 that determines the switches to be ON.
 *
 * ---
 *
 * Switches: Toggle ID(s)
 * - Select specific Switch ID's to toggle ON/OFF.
 * - ON becomes OFF. OFF becomes ON.
 *
 *   Switch ID(s):
 *   - Select which Switch ID(s) to toggle.
 *
 * ---
 *
 * Switches: Toggle Range
 * - Select specific Switch ID Range to toggle ON/OFF.
 * - ON becomes OFF. OFF becomes ON.
 *
 *   Starting ID:
 *   - The starting ID of the Switch to toggle.
 *
 *   Ending ID:
 *   - The ending ID of the Switch to toggle.
 *
 * ---
 *
 * === System Plugin Commands ===
 *
 * ---
 *
 * System: Battle System Change
 * - Switch to a different battle system in-game.
 * - Some battle systems REQUIRE their specific plugins!
 *
 *   Change To:
 *   - Choose which battle system to switch to.
 *     - Database Default (Use game database setting)
 *     - -
 *     - DTB: Default Turn Battle
 *     - TPB Active: Time Progress Battle (Active)
 *     - TPB Wait: Time Progress Battle (Wait)
 *     - -
 *     - BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *     - CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *     - OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *     - STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 *
 * ---
 *
 * System: Load Images
 * - Allows you to (pre) load up images ahead of time.
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory?
 *
 * ---
 *
 * System: Main Font Size
 * - Set the game's main font size.
 *
 *   Change To:
 *   - Change the font size to this number.
 *
 * ---
 *
 * System: Side View Battle
 * - Switch between Front View or Side View for battle.
 *
 *   Change To:
 *   - Choose which view type to switch to.
 *
 * ---
 *
 * System: Window Padding
 * - Change the game's window padding amount.
 *
 *   Change To:
 *   - Change the game's standard window padding to this value.
 *
 * ---
 *
 * === Text Popup Command ===
 *
 * ---
 *
 * Text Popup: Show Text
 * - Adds text to a text popup window to briefly appear.
 * - Multiple text popups will be queued.
 * - Does not halt the game and works parallel to game activity.
 *
 *   Text:
 *   - Write the text that you want to appear here.
 *   - You may use text codes.
 *
 * ---
 *
 * === Variable Plugin Commands ===
 *
 * ---
 *
 * Variable: JS Eval
 * - Pick a variable ID and value to alter through JS.
 * - Allows one line of code for variable ID and operand.
 * - Functions like RM2k3's Variable Pointers.
 *
 *   Variable ID:
 *   - This is the target variable to alter.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 *
 *   Operation Type:
 *   - What operation do you wish to use for this Plugin Command?
 *
 *   Operand Modifier:
 *   - Value to be used in calculating the target variable.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 *
 * ---
 *
 * Variable: JS Block
 * - Pick a variable ID and value to alter through JS.
 * - Allows JS block code for variable ID and operand.
 * - Functions like RM2k3's Variable Pointers.
 *
 *   Variable ID:
 *   - This is the target variable to alter.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 *
 *   Operation Type:
 *   - What operation do you wish to use for this Plugin Command?
 *
 *   Operand Modifier:
 *   - Value to be used in calculating the target variable.
 *   - You may use JavaScript.
 *   - ie: $gameVariables.value(1)
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quality of Life Settings
 * ============================================================================
 *
 * A variety of (optional) settings and changes are added with the Core Engine
 * to improve the quality of life for both the game devs and players alike.
 *
 * ---
 *
 * Play Test
 *
 *   New Game on Boot:
 *   - Automatically start a new game on Play Test?
 *   - Only enabled during Play Test.
 *
 *   No Play Test Mode:
 *   - Force the game to be out of Play Test mode when play testing.
 *
 *   Open Console on Boot:
 *   - Open the Debug Console upon booting up your game?
 *   - Only enabled during Play Test.
 *
 *   F6: Toggle Sound:
 *   - F6 Key Function: Turn on all sound to 100% or to 0%, toggling between
 *     the two.
 *   - Only enabled during Play Test.
 *
 *   F7: Toggle Fast Mode:
 *   - F7 Key Function: Toggle fast mode.
 *   - Only enabled during Play Test.
 *
 *   CTRL + n: Quick Load:
 *   - CTRL + a number from 1 to 9 will yield a quick load of that safe file.
 *   - Does not count auto saves.
 *
 *   New Game > Common Event:
 *   - Runs a common event each time a new game is started.
 *   - Only enabled during Play Test.
 *
 * ---
 *
 * Battle Test
 *
 *   Add Item Type:
 *   Add Weapon Type:
 *   Add Armor Type:
 *   - Add copies of each database item, weapon, and/or armor?
 *   - Effective only during battle test.
 *
 *   Added Quantity:
 *   - Determines how many items are added during a battle test instead of
 *     the maximum amount.
 *
 *   Shift+R: Recover All:
 *   - For Play Test only!
 *   - During battle, pressing SHIFT + R will refill the whole party's HP
 *     and MP and status.
 *
 *   Shift+T: Full TP
 *   - For Play Test only!
 *   - During battle, pressing SHIFT + T will refill the whole party's TP.
 *
 * ---
 *
 * Digit Grouping
 *
 *   Standard Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for standard text
 *     inside windows?
 *
 *   Ex Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for ex text,
 *     written through drawTextEx (like messages)?
 *
 *   Damage Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for in-battle
 *     damage sprites?
 *
 *   Gauge Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for visible gauge
 *     sprites such as HP, MP, and TP gauges?
 *
 *   Country/Locale
 *   - Base the digit grouping on which country/locale?
 *   - This will follow all of the digit grouping rules found here:
 *     https://www.w3schools.com/JSREF/jsref_tolocalestring_number.asp
 *
 * ---
 *
 * Player Benefit
 *
 *   Encounter Rate Min:
 *   - Minimum number of steps the player can take without any
 *     random encounters.
 *
 *   Escape Always:
 *   - If the player wants to escape a battle, let them escape the battle
 *     with 100% chance.
 *
 *   Accuracy Formula:
 *   - Accuracy formula calculation change to
 *     Skill Hit% * (User HIT - Target EVA) for better results.
 *
 *   Accuracy Boost:
 *   - Boost HIT and EVA rates in favor of the player.
 *
 *   Level Up -> Full HP:
 *   Level Up -> Full MP:
 *   - Recovers full HP or MP when an actor levels up.
 *
 * ---
 *
 * Picture-Related
 *
 *   Anti-Zoom Pictures:
 *   - If on, prevents pictures from being affected by zoom.
 *
 *   Picture Containers > Detach in Battle:
 *   - If detached, picture container will be separated from the spriteset
 *     while on the battle scene.
 *   - This will prevent any visual effects that alter the entire spriteset
 *     from affecting the detached picture container.
 *
 *   Picture Containers > Detach in Map:
 *   - If detached, picture container will be separated from the spriteset
 *     while on the map scene.
 *   - This will prevent any visual effects that alter the entire spriteset
 *     from affecting the detached picture container.
 *
 * ---
 *
 * Misc
 *
 *   Animation: Mirror Offset X:
 *   - When animations are mirrored, mirror their Offset X values, too.
 *   - The animation name tags <Mirror Offset X> and <No Mirror Offset X> will
 *     override this effect for that specific animation.
 *
 *   Font Shadows:
 *   - If on, text uses shadows instead of outlines.
 *
 *   Font Smoothing:
 *   - If on, smoothes fonts shown in-game.
 *
 *   Font Width Fix:
 *   - Fixes the font width issue with instant display non-monospaced fonts
 *     in the Message Window.
 *
 *   Key Item Protection:
 *   - If on, prevents Key Items from being able to be sold and from being
 *     able to be consumed.
 *
 *   Map Name Text Code:
 *   - If on, map names will use text codes.
 *   - If off, only the raw map name will be used.
 *
 *   Modern Controls:
 *   - If on, allows usage of the Home/End buttons.
 *   - Home would scroll to the first item on a list.
 *   - End would scroll to the last item on a list.
 *   - Shift + Up would page up.
 *   - Shift + Down would page down.
 *
 *   MV Animation Rate:
 *   - Adjusts the rate at which MV animations play.
 *   - Default: 4.
 *   - Lower for faster.
 *   - Higher for slower.
 *
 *   NewGame > CommonEvent:
 *   - Runs a common event each time a new game during any session is started.
 *   - Applies to all types of sessions, play test or not.
 *
 *   No Tile Shadows:
 *   - Removes tile shadows from being displayed in-game.
 *
 *   Pixel Image Rendering:
 *   - If on, pixelates the image rendering (for pixel games).
 *
 *   Require Focus?
 *   - Requires the game to be focused? If the game isn't focused, it will
 *     pause if it's not the active window.
 *
 *   Shortcut Scripts:
 *   - Enables shortcut-based script variables and functions that can be used
 *     for script calls.
 *   - Shortcut list enabled for this is as follows:
 *
 *     $commonEvent(id)
 *     - Queues a common event.
 *     - This does not interrupt the current event to run the desired common
 *       event. Any queued common events will run after the current event list
 *       has finished.
 *     - Replace 'id' with the ID of the common event you wish to queue.
 *     - Common events only run in the map scene and battle scene.
 *
 *     $onceParallel(id)
 *     - Runs a common event in the background as a once parallel event.
 *     - Once parallel events will run in the background like a parallel
 *       process, except that it does not repeat after finishing.
 *     - Replace 'id' with the ID of the common event you wish to run.
 *     - Only works in the map scene and battle scene. Battle scene usage will
 *       require VisuMZ_1_BattleCore.
 *
 *     $scene
 *     - Returns current scene.
 *
 *     $spriteset
 *     - Returns current scene's spriteset if there is one.
 *
 *     $subject
 *     - Returns last recorded identity of the battle's subject/user.
 *
 *     $targets
 *     - Returns last recorded targets marked in battle.
 *
 *     $target
 *     - Returns last recorded target marked in battle.
 *     - Works better with VisuMZ_1_BattleCore.
 *
 *     $event
 *     - Returns currently initiated map event.
 *
 *   Smart Event Collision:
 *   - Makes events only able to collide with one another if they're
 *    'Same as characters' priority.
 *
 *   Subfolder Name Purge:
 *   - Purge subfolder name from Plugin Parameters when reading data to let
 *     Plugin Commands work properly.
 *   - This is for plugins (such as the VisuMZ library) that utilize dynamic
 *     name registrations for Plugin Commands. Turn this on if you plan on
 *     using subfolders with VisuMZ plugins.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle System
 * ============================================================================
 *
 * Choose which battle system to use for your game.
 *
 * Some battle systems REQUIRE their specific plugins! This means if you do not
 * have the required battle system plugin installed, it will not change over.
 * The Core Engine plugin does not contain data for all of the battle systems
 * inside its code.
 *
 * ---
 *
 *   Database Default (Use game database setting)
 *
 *   -
 *
 *   DTB: Default Turn Battle
 *   TPB Active: Time Progress Battle (Active)
 *   TPB Wait: Time Progress Battle (Wait)
 *
 *   -
 *
 *   BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *   CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *   ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 *   FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 *   OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *   PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 *   STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 *
 *   -
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Color Settings
 * ============================================================================
 *
 * These settings allow you, the game dev, to have more control over which
 * colors appear for what conditions found in the game. You can use regular
 * numbers to use the colors predetermined by the game's Window Skin or you
 * can use the #rrggbb format for a hex color code.
 *
 * If the game's Window Skin is changed mid-game, the colors used will still be
 * based off the default Window Skin's colors. This is due to storing them in a
 * cache and preventing extra processing and reduces lag.
 *
 * You can find out what hex codes belong to which color from this website:
 * https://htmlcolorcodes.com/
 *
 * ---
 *
 * Basic Colors
 * - These are colors that almost never change and are used globally throughout
 *   the in-game engine.
 *
 *   Normal:
 *   System:
 *   Crisis:
 *   Death:
 *   Gauge Back:
 *   HP Gauge:
 *   MP Gauge:
 *   MP Cost:
 *   Power Up:
 *   Power Down:
 *   CT Gauge:
 *   TP Gauge:
 *   Pending Color:
 *   EXP Gauge:
 *   MaxLv Gauge:
 *   - Use #rrggbb for custom colors or regular numbers
 *   for text colors from the Window Skin.
 *
 * ---
 *
 * Alpha Colors:
 * - These are colors that have a bit of transparency to them and are specified
 *   by the 'rgba(red, green, blue, alpha)' format.
 * - Replace 'red' with a number between 0-255 (integer).
 * - Replace 'green' with a number between 0-255 (integer).
 * - Replace 'blue' with a number between 0-255 (integer).
 * - Replace 'alpha' with a number between 0 and 1 (decimal).
 *
 *   Window Font Outline:
 *   Gauge Number Outline:
 *   Dim Color:
 *   Item Back Color:
 *   - Colors with a bit of alpha settings.
 *   - Format rgba(0-255, 0-255, 0-255, 0-1)
 *
 * ---
 *
 * Conditional Colors:
 * - These require a bit of JavaScript knowledge. These determine what colors
 *   to use under which situations and uses such as different values of HP, MP,
 *   TP, for comparing equipment, and determine damage popup colors.
 *
 *   JS: Actor HP Color:
 *   JS: Actor MP Color:
 *   JS: Actor TP Color:
 *   - Code used for determining what HP, MP, or TP color to use for actors.
 *
 *   JS: Parameter Change:
 *   - Code used for determining whatcolor to use for parameter changes.
 *
 *   JS: Damage Colors:
 *   - Code used for determining what color to use for damage types.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gold Settings
 * ============================================================================
 *
 * Gold is the main currency in RPG Maker MZ. The settings provided here will
 * determine how Gold appears in the game and certain behaviors Gold has.
 *
 * ---
 *
 * Gold Settings
 *
 *   Gold Max:
 *   - Maximum amount of Gold the party can hold.
 *   - Default 99999999
 *
 *   Gold Font Size:
 *   - Font size used for displaying Gold inside Gold Windows.
 *   - Default: 26
 *
 *   Gold Icon:
 *   - Icon used to represent Gold.
 *   - Use 0 for no icon.
 *
 *   Gold Overlap:
 *   - Text used too much Gold to fit in the window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Image Loading
 * ============================================================================
 *
 * Not all images are loaded at once in-game. RPG Maker MZ uses asynchronous
 * loading which means images are loaded when needed. This may cause delays in
 * when you want certain images to appear. However, if an image is loaded
 * beforehand, they can be used immediately provided they aren't removed from
 * the image cache.
 *
 * ---
 *
 * Image Loading
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory upon starting
 *     up the game?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Keyboard Input Settings
 * ============================================================================
 *
 * Settings for the game that utilize keyboard input. These are primarily for
 * the name input scene (Scene_Name) and the number input event command. These
 * settings have only been tested on English keyboards and may or may not be
 * compatible with other languages, so please disable these features if they do
 * not fit in with your game.
 *
 * If a controller is connected upon entering the name change scene, it will
 * use the default manual-entry mode instead of the keyboard-entry mode. If a
 * controller button is pressed during the keyboard-entry mode, it will
 * automatically switch to the manual-entry mode.
 *
 * This plugin does not provide support for controllers that are undetected by
 * RPG Maker MZ's default controller support.
 *
 * ---
 *
 * Controls
 *
 *   WASD Movement:
 *   - Enables or disables WASD movement for your game project.
 *   - Moves the W page down button to E.
 *
 *   R Button: Dash Toggle:
 *   - Enables or disables R button as an Always Dash option toggle.
 *
 * ---
 *
 * Name Input
 *
 *   Enable?:
 *   - Enables keyboard input for name entry.
 *   - Only tested with English keyboards.
 *
 *   Default Mode:
 *   - Select default mode when entering the scene.
 *     - Default - Uses Arrow Keys to select letters.
 *     - Keyboard - Uses Keyboard to type in letters.
 *
 *   QWERTY Layout:
 *   - Uses the QWERTY layout for manual entry.
 *
 *   Keyboard Message:
 *   - The message displayed when allowing keyboard entry.
 *   - You may use text codes here.
 *
 *   Banned Words:
 *   - Players cannot use these words for names.
 *   - These include words inside the names.
 *   - If a banned word is used, a buzzer sound will play.
 *
 * ---
 *
 * Number Input
 *
 *   Enable?:
 *   - Enables keyboard input for number entry.
 *   - Only tested with English keyboards.
 *
 * ---
 *
 * Button Assist
 *
 *   Finish Entry:
 *   - Text used to describe finish entry.
 *
 *   Page Change:
 *   - Text used to describe character page changing.
 *
 *   Switch to Keyboard:
 *   - Text used to describe the keyboard switch.
 *
 *   Switch To Manual:
 *   - Text used to describe the manual entry switch.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Background Settings
 * ============================================================================
 *
 * These settings in the Plugin Parameters allow you to adjust the background
 * images used for each of the scenes. The images will be taken from the game
 * project folders img/titles1/ and img/titles2/ to load into the game.
 *
 * These settings are only available to scenes found within the Main Menu, the
 * Shop scene, and the Actor Naming scene.
 *
 * ---
 *
 * Menu Background Settings:
 *
 *   Blur Strength:
 *   - Strength used for menu background snapshots.
 *   - Default: 8. Higher is stronger. Lower is weaker.
 *
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Individual background settings for the scene.
 *
 *   Scene_Unlisted
 *   - Individual background settings for any scenes that aren't listed above.
 *
 * ---
 *
 * Background Settings
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
 * Plugin Parameters: Menu Button Assist Window
 * ============================================================================
 *
 * In most modern RPG's, there exist small windows on the screen which tell the
 * player what the control schemes are for that scene. This plugin gives you
 * the option to add that window to the menu scenes in the form of a Button
 * Assist Window.
 *
 * ---
 *
 * General
 *
 *   Enable:
 *   - Enable the Menu Button Assist Window.
 *
 *   Location:
 *   - Determine the location of the Button Assist Window.
 *   - Requires Plugin Parameters => UI => Side Buttons ON.
 *
 *   Background Type:
 *   - Select background type for this window.
 *
 *   Split "Escape":
 *   - Used ONLY for those making their own custom keyboard key input maps.
 *   - "Split" option makes separate instances of "Cancel" and "Menu" keys.
 *   - "Don't" option will consolidate both into "Escape" keys.
 *
 * ---
 *
 * Text
 *
 *   Text Format:
 *   - Format on how the buttons are displayed.
 *   - Text codes allowed. %1 - Key, %2 - Text
 *
 *   Multi-Key Format:
 *   - Format for actions with multiple keys.
 *   - Text codes allowed. %1 - Key 1, %2 - Key 2
 *
 *   OK Text:
 *   Cancel Text:
 *   Switch Actor Text:
 *   - Default text used to display these various actions.
 *
 * ---
 *
 * Keys
 *
 *   Key: Unlisted Format:
 *   - If a key is not listed below, use this format.
 *   - Text codes allowed. %1 - Key
 *
 *   Key: Up:
 *   Key: Down:
 *   Key: Left:
 *   Key: Right:
 *   Key: Shift:
 *   Key: Tab:
 *   Key: A through Z:
 *   - How this key is shown in-game.
 *   - Text codes allowed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Controller Button Assist Settings
 * ============================================================================
 *
 * These are sub-settings for the Button Assist Window Plugin Parameters. Where
 * the Button Assist Window Plugin Parameters are focused on keyboard entries,
 * these sections are focused on gamepad controllers.
 *
 * Add multiple gamepads to the list to give them different button assist text.
 * If a gamepad is being used but not listed here, the button assist text will
 * default to the keyboard version.
 *
 * For those looking for more information regarding controllers, visit this
 * site: https://gamepad-tester.com/
 *
 * ---
 *
 * ID Information
 *
 *   Controller ID Name:
 *   - Exact string used for this controller ID.
 *   - Plugin Command "Debug: Current Controller ID" for ID help.
 *   - Example: Xbox 360 Controller (XInput STANDARD GAMEPAD)
 *
 *   Similarity Match:
 *   - Partial string used to check for controller ID.
 *   - Plugin Command "Debug: Current Controller ID" for ID help.
 *   - This check occurs secondary to the exact name.
 *   - Example: Xbox
 *
 * ---
 *
 * Directions
 *
 *   Up:
 *   Left:
 *   Right:
 *   Down:
 *   - How this button is shown in-game.
 *   - Text codes allowed.
 *
 * ---
 *
 * Actions
 *
 *   OK:
 *   Cancel:
 *   Menu:
 *   Shift:
 *   Page Up:
 *   Page Down:
 *   - How this button is shown in-game.
 *   - Text codes allowed.
 *   - *NOTE*: Controllers use a different mapping scheme from keyboards.
 *     - The "cancel" button is separate from the "menu" button though, for the
 *       majority of the button assist window help text, we'll be referring to
 *       the cancel button usually.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Layout Settings
 * ============================================================================
 *
 * These settings allow you to rearrange the positions of the scenes accessible
 * from the Main Menu, the Shop scene, and the Actor Naming scene. This will
 * require you to have some JavaScript knowledge to make the windows work the
 * way you would like.
 *
 * ---
 *
 * Menu Layout Settings
 *
 *   Scene_Title:
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Various options on adjusting the selected scene.
 *
 * ---
 *
 * Scene Window Settings
 *
 *   Background Type:
 *   - Selects the background type for the selected window.
 *   - Window
 *   - Dim
 *   - Transparent
 *
 *   JS: X, Y, W, H
 *   - Code used to determine the dimensions for the selected window.
 *
 * ---
 *
 * Scene_Title Settings
 * - The following are settings unique to Scene_Title.
 *
 * Title Screen
 *
 *   Document Title Format:
 *   - Format to display text in document title.
 *   - %1 - Main Title, %2 - Subtitle, %3 - Version
 *
 *   Subtitle:
 *   - Subtitle to be displayed under the title name.
 *
 *   Version:
 *   - Version to be display in the title screen corner.
 *
 *   JS: Draw Title:
 *   - Code used to draw the game title.
 *
 *   JS: Draw Subtitle:
 *   - Code used to draw the game subtitle.
 *
 *   JS: Draw Version:
 *   - Code used to draw the game version.
 *
 *   Button Fade Speed:
 *   - Speed at which the buttons fade in at (1-255).
 *
 * ---
 *
 * Scene_GameEnd Settings
 * - The following are settings unique to Scene_GameEnd.
 *
 *   Command Window List:
 *   - Window commands used by the title screen.
 *   - Add new commands here.
 *
 * ---
 *
 * Command Window List
 * - This is found under Scene_Title and Scene_GameEnd settings.
 *
 *   Symbol:
 *   - The symbol used for this command.
 *
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 *
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 *
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 *
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 *
 * ---
 *
 * Title Picture Buttons:
 * - This is found under Scene_Title settings.
 *
 *   Picture's Filename:
 *   - Filename used for the picture.
 *
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 *
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 *
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Parameter Settings
 * ============================================================================
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * their behaviors and give boosts to trait objects in a controlled manner.
 *
 * ---
 *
 * Parameter Settings
 *
 *   Displayed Parameters
 *   - A list of the parameters that will be displayed in-game.
 *   - Shown in the Equip Menu.
 *   - Shown in the Status Menu.
 *
 *   Extended Parameters
 *   - The list shown in extended scenes (for other VisuStella plugins).
 *
 * ---
 *
 * === Basic Parameters ===
 *
 * MHP - MaxHP
 * - This is the maximum health points value. The amount of health points (HP)
 * a battler has determines whether or not the battler is in a living state or
 * a dead state. If the HP value is above 0, then the battler is living. If it
 * is 0 or below, the battler is in a dead state unless the battler has a way
 * to counteract death (usually through immortality). When the battler takes
 * damage, it is usually dealt to the HP value and reduces it. If the battler
 * is healed, then the HP value is increased. The MaxHP value determines what's
 * the maximum amount the HP value can be held at, meaning the battler cannot
 * be healed past that point.
 *
 * MMP - MaxMP
 * - This is the maximum magic points value. Magic points (MP) are typically
 * used for the cost of skills and spells in battle. If the battler has enough
 * MP to fit the cost of the said skill, the battler is able to use the said
 * skill provided that all of the skill's other conditions are met. If not, the
 * battler is then unable to use the skill. Upon using a skill that costs MP,
 * the battler's MP is reduced. However, the battler's MP can be recovered and
 * results in a gain of MP. The MaxMP value determines what is the maximum
 * amount the MP value can be held at, meaning the battler cannot recover MP
 * past the MaxMP value.
 *
 * ATK - Attack
 * - This is the attack value of the battler. By default, this stat is used for
 * the purpose of damage calculations only, and is typically used to represent
 * the battler's physical attack power. Given normal damage formulas, higher
 * values mean higher damage output for physical attacks.
 *
 * DEF - Defense
 * - This is the defense value of the battler. By default, this stat is used
 * for the purpose of damage calculations only, and is typically used to
 * represent the battler's physical defense. Given normal damage formulas,
 * higher values mean less damage received from physical attacks.
 *
 * MAT - Magic Attack
 * - This is the magic attack value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical attack power. Given normal damage formulas,
 * higher values mean higher damage output for magical attacks.
 *
 * MDF - Magic Defense
 * - This is the magic defense value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical defense. Given normal damage formulas,
 * higher values mean less damage received from magical attacks.
 *
 * AGI - Agility
 * - This is the agility value of the battler. By default, this stat is used to
 * determine battler's position in the battle turn's order. Given a normal turn
 * calculation formula, the higher the value, the faster the battler is, and
 * the more likely the battler will have its turn earlier in a turn.
 *
 * LUK - Luck
 * - This is the luck value of the battler. By default, this stat is used to
 * affect the success rate of states, buffs, and debuffs applied by the battler
 * and received by the battler. If the user has a higher LUK value, the state,
 * buff, or debuff is more likely to succeed. If the target has a higher LUK
 * value, then the state, buff, or debuff is less likely to succeed.
 *
 * ---
 *
 * Basic Parameters
 *
 *   Show Actor Level?:
 *   - Show the actor level when displaying actors?
 *   - Affects for most windows in-game.
 *
 *   HP Crisis Rate:
 *   - HP Ratio at which a battler can be considered in crisis mode.
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 8 basic parameters:
 *   - MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 *
 * Parameter Caps:
 *
 *   MaxHP Cap:
 *   MaxMP Cap:
 *   ATK Cap:
 *   DEF Cap:
 *   MAT Cap:
 *   MDF Cap:
 *   AGI Cap:
 *   LUK Cap:
 *   - Formula used to determine the selected parameter's cap.
 *   - These settings DO NOT raise the editor's maximum values. If you want to
 *     raise an enemy's maximum parameter value past their default cap, use the
 *     associated notetag for them instead.
 *
 * ---
 *
 * === X Parameters ===
 *
 * HIT - Hit Rate%
 * - This determines the physical hit success rate of the any physical action.
 * All physical attacks make a check through the HIT rate to see if the attack
 * will connect. If the HIT value passes the randomizer check, the attack will
 * connect. If the HIT value fails to pass the randomizer check, the attack
 * will be considered a MISS.
 *
 * EVA - Evasion Rate%
 * - This determines the physical evasion rate against any incoming physical
 * actions. If the HIT value passes, the action is then passed to the EVA check
 * through a randomizer check. If the randomizer check passes, the physical
 * attack is evaded and will fail to connect. If the randomizer check passes,
 * the attempt to evade the action will fail and the action connects.
 *
 * CRI - Critical Hit Rate%
 * - Any actions that enable Critical Hits will make a randomizer check with
 * this number. If the randomizer check passes, extra damage will be carried
 * out by the initiated action. If the randomizer check fails, no extra damage
 * will be added upon the action.
 *
 * CEV - Critical Evasion Rate%
 * - This value is put against the Critical Hit Rate% in a multiplicative rate.
 * If the Critical Hit Rate is 90% and the Critical Evasion Rate is
 * 20%, then the randomizer check will make a check against 72% as the values
 * are calculated by the source code as CRI * (1 - CEV), therefore, with values
 * as 0.90 * (1 - 0.20) === 0.72.
 *
 * MEV - Magic Evasion Rate%
 * - Where EVA is the evasion rate against physical actions, MEV is the evasion
 * rate against magical actions. As there is not magical version of HIT, the
 * MEV value will always be bit against when a magical action is initiated. If
 * the randomizer check passes for MEV, the magical action will not connect. If
 * the randomizer check fails for MEV, the magical action will connect.
 *
 * MRF - Magic Reflect Rate%
 * - If a magical action connects and passes, there is a chance the magical
 * action can be bounced back to the caster. That chance is the Magic Reflect
 * Rate. If the randomizer check for the Magic Reflect Rate passes, then the
 * magical action is bounced back to the caster, ignoring the caster's Magic
 * Evasion Rate. If the randomizer check for the Magic Reflect Rate fails, then
 * the magical action will connect with its target.
 *
 * CNT - Counter Attack Rate%
 * - If a physical action connects and passes, there is a chance the physical
 * action can be avoided and a counter attack made by the user will land on the
 * attacking unit. This is the Counter Attack Rate. If the randomizer check for
 * the Counter Attack Rate passes, the physical action is evaded and the target
 * will counter attack the user. If the randomizer check fails, the physical
 * action will connect to the target.
 *
 * HRG - HP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxHP as gained HP with a 100% success rate.
 *
 * MRG - MP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxMP as gained MP with a 100% success rate.
 *
 * TRG - TP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxTP as gained TP with a 100% success rate.
 *
 * ---
 *
 * X Parameters
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 10 X parameters:
 *   - HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 *
 * Vocabulary
 *
 *   HIT:
 *   EVA:
 *   CRI:
 *   CEV:
 *   MEV:
 *   MRF:
 *   CNT:
 *   HRG:
 *   MRG:
 *   TRG:
 *   - In-game vocabulary used for the selected X Parameter.
 *
 * ---
 *
 * === S Parameters ===
 *
 * TGR - Target Rate
 * - Against the standard enemy, the Target Rate value determines the odds of
 * an enemy specifically targeting the user for a single target attack. At 0%,
 * the enemy will almost never target the user. At 100%, it will have normal
 * targeting opportunity. At 100%+, the user will have an increased chance of
 * being targeted.
 * *NOTE: For those using the Battle A.I. Core, any actions that have specific
 * target conditions will bypass the TGR rate.
 *
 * GRD - Guard Effect
 * - This is the effectiveness of guarding. This affects the guard divisor
 * value of 2. At 100% GRD, damage will become 'damage / (2 * 1.00)'. At 50%
 * GRD, damage will become 'damage / (2 * 0.50)'. At 200% GRD, damage will
 * become 'damage / (2 * 2.00)' and so forth.
 *
 * REC - Recovery Effect
 * - This is how effective heals are towards the user. The higher the REC rate,
 * the more the user is healed. If a spell were to heal for 100 and the user
 * has 300% REC, then the user is healed for 300 instead.
 *
 * PHA - Pharmacology
 * - This is how effective items are when used by the user. The higher the PHA
 * rate, the more effective the item effect. If the user is using a Potion that
 * recovers 100% on a target ally and the user has 300% PHA, then the target
 * ally will receive healing for 300 instead.
 *
 * MCR - MP Cost Rate
 * - This rate affects how much MP skills with an MP Cost will require to use.
 * If the user has 100% MCR, then the MP Cost will be standard. If the user has
 * 50% MCR, then all skills that cost MP will cost only half the required MP.
 * If the user has 200% MCR, then all skills will cost 200% their MP cost.
 *
 * TCR - TP Charge Rate
 * - This rate affects how much TP skills with an TP will charge when gaining
 * TP through various actions. At 100%, TP will charge normally. At 50%, TP
 * will charge at half speed. At 200%, TP will charge twice as fast.
 *
 * PDR - Physical Damage Rate
 * - This rate affects how much damage the user will take from physical damage.
 * If the user has 100% PDR, then the user takes the normal amount. If the user
 * has 50% PDR, then all physical damage dealt to the user is halved. If the
 * user has 200% PDR, then all physical damage dealt to the user is doubled.
 *
 * MDR - Magical Damage Rate
 * - This rate affects how much damage the user will take from magical damage.
 * If the user has 100% MDR, then the user takes the normal amount. If the user
 * has 50% MDR, then all magical damage dealt to the user is halved. If the
 * user has 200% MDR, then all magical damage dealt to the user is doubled.
 *
 * FDR - Floor Damage Rate
 * - On the field map, this alters how much damage the user will take when the
 * player walks over a tile that damages the party. The FDR value only affects
 * the damage dealt to the particular actor and not the whole party. If FDR is
 * at 100%, then the user takes the full damage. If FDR is at 50%, then only
 * half of the damage goes through. If FDR is at 200%, then floor damage is
 * doubled for that actor.
 *
 * EXR - Experience Rate
 * - This determines the amount of experience gain the user whenever the user
 * gains any kind of EXP. At 100% EXR, the rate of experience gain is normal.
 * At 50%, the experience gain is halved. At 200%, the experience gain for the
 * user is doubled.
 *
 * ---
 *
 * S Parameters
 *
 *   JS: Formula
 *   - Formula used to determine the total value all 10 S parameters:
 *   - TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 *
 * Vocabulary
 *
 *   TGR:
 *   GRD:
 *   REC:
 *   PHA:
 *   MCR:
 *   TCR:
 *   PDR:
 *   MDR:
 *   FDR:
 *   EXR:
 *   - In-game vocabulary used for the selected S Parameter.
 *
 * ---
 *
 * Icons
 *
 *   Draw Icons?
 *   - Draw icons next to parameter names?
 *
 *   MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK:
 *   HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG:
 *   TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR:
 *   - Icon used for the selected parameter.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Custom Parameters Settings
 * ============================================================================
 *
 * As of version 1.07, you can add Custom Parameters to your game if RPG Maker
 * MZ's default set of parameters isn't enough for you. These parameters can
 * have variable functionality depending on how you code it. More importantly,
 * these are compatible with the VisuStella MZ menus and the VisuStella Core
 * Engine's Parameters settings.
 *
 * For clarification, these settings do NOT create brand-new parameters for you
 * to use and add to your game nor are the bonuses supported by other plugins
 * in the VisuStella MZ library. These settings exist to function as a bridge
 * for non-VisuStella MZ plugins that have created their own parameter values
 * and to show them inside VisuStella menus.
 *
 * ---
 *
 * Custom Parameter
 *
 *   Parameter Name:
 *   - What's the parameter's name?
 *   - Used for VisuStella MZ menus.
 *
 *   Abbreviation:
 *   - What abbreviation do you want to use for the parameter?
 *   - Do not use special characters. Avoid numbers if possible.
 *
 *   Icon:
 *   - What icon do you want to use to represent this parameter?
 *   - Used for VisuStella MZ menus.
 *
 *   Type:
 *   - What kind of number value will be returned with this parameter?
 *     - Integer (Whole Numbers Only)
 *     - Float (Decimals are Allowed)
 *
 *   JS: Value:
 *   - Run this code when this parameter is to be returned.
 *
 * ---
 *
 * Instructions on Adding Custom Parameters to VisuStella Menus
 *
 * In the Core Engine and Elements and Status Menu Core plugins, there are
 * plugin parameter fields for you to insert the parameters you want displayed
 * and visible to the player.
 *
 * Insert in those the abbreviation of the custom parameter. For example, if
 * you want to add the "Strength" custom parameter and the abbreviation is
 * "str", then add "str" to the Core Engine/Elements and Status Menu Core's
 * plugin parameter field for "Strength" to appear in-game. Case does not
 * matter here so you can insert "str" or "STR" and it will register all the
 * same to make them appear in-game.
 *
 * ---
 *
 * Instructions on Using Custom Parameters as Mechanics
 *
 * If you want to use a custom parameter in, say, a damage formula, refer to
 * the abbreviation you have set for the custom parameter. For example, if you
 * want to call upon the "Strength" custom parameter's value and its set
 * abbreviation is "str", then refer to it as such. This is case sensitive.
 *
 * An example damage formula would be something like the following if using
 * "str" for "Strength" and "con" for "Constitution":
 *
 *   a.str - b.con
 *
 * These values are attached to the Game_Battlerbase prototype class.
 *
 * ---
 *
 * Instructions on Setting Custom Parameter Values
 *
 * This requires JavaScript knowledge. There is no way around it. Whatever code
 * you insert into the "JS: Value" field will return the value desired. The
 * 'user' variable will refer to the Game_Battlerbase prototype object in which
 * the information is to be drawn from.
 *
 * Depending on the "type" you've set for the Custom Parameter, the returned
 * value will be rounded using Math.round for integers and left alone if set as
 * a float number.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Screen Resolution Settings
 * ============================================================================
 *
 * Alter various properties to make the game look better for varying screen
 * resolutions. This is mostly for RPG Maker MZ version 1.3.0 and up where the
 * Troops tab has been updated to match the screen resolution settings found in
 * the System 2 Database tab.
 *
 * ---
 *
 * Maps
 *
 *   Scroll Lock Small X?:
 *   Scroll Lock Small Y?:
 *   - Automatically scroll lock X/Y scrolling if the map is too small?
 *   - Useful for 1280x720 resolutions when the map is 27 tiles wide.
 *     - This will get rid of the subtle scrolling when moving from one half of
 *       the screen to the other.
 *   - This setting will be disabled if the map is zoomed in.
 *
 *   Locked Display X?:
 *   Locked Display Y?:
 *   - What display X/Y value do you want for auto-scroll locked maps?
 *   - Use a number between 0 and 1 for best results.
 *
 * ---
 *
 * Troops
 *
 *   Reposition Actors:
 *   - Update the position of actors in battle if the screen resolution
 *     has changed to become larger than 816x624.
 *   - Ignore if using the VisuStella MZ Battle Core.
 *   - When using the VisuStella MZ Battle Core, adjust the position through
 *     Battle Core > Parameters > Actor Battler Settings > JS: Home Position
 *
 *   Reposition Enemies:
 *   - Update the position of enemies in battle if the screen resolution
 *     has changed to become larger than 816x624.
 *
 *     For MZ 1.3.0+?:
 *     - Both this parameter and its parent parameter need to be on when using
 *       RPG Maker MZ 1.3.0+.
 *     - If the Core Script is below 1.3.0, this setting is ignored. This does
 *       not take into account what version the editor is on. Pay attention to
 *       that as the plugin will not auto adjust for it.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Screen Shake Settings
 * ============================================================================
 *
 * Get more screen shake effects into your game!
 *
 * These effects have been added by Aries of Sheratan!
 *
 * ---
 *
 * Settings
 *
 *   Default Style:
 *   - The default style used for screen shakes.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 *
 *   JS: Original Style:
 *   JS: Random Style
 *   JS: Horizontal Style
 *   JS: Vertical Style
 *   - This code gives you control over screen shake for this screen
 *     shake style.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Command List Settings
 * ============================================================================
 *
 * This plugin parameter allows you to adjust the commands that appear on the
 * title screen. Some JavaScript knowledge is needed.
 *
 * ---
 *
 * Title Command
 *
 *   Symbol:
 *   - The symbol used for this command.
 *
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 *
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 *
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 *
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Picture Buttons Settings
 * ============================================================================
 *
 * These allow you to insert picture buttons on your title screen that can
 * send users to various links on the internet when clicked.
 *
 * ---
 *
 * Settings
 *
 *   Picture's Filename:
 *   - Filename used for the picture.
 *
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 *
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 *
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: UI Settings
 * ============================================================================
 *
 * In previous iterations of RPG Maker, the Core Engine would allow you to
 * change the screen resolution. In MZ, that functionality is provided by
 * default but a number of UI settings still remain. These settings allow you
 * adjust how certain in-game objects and menus are displayed.
 *
 * ---
 *
 * UI Area
 *
 *   Fade Speed:
 *   - Default fade speed for transitions.
 *
 *   Box Margin:
 *   - Set the margin in pixels for the screen borders.
 *
 *   Command Window Width:
 *   - Sets the width for standard Command Windows.
 *
 *   Bottom Help Window:
 *   - Put the Help Window at the bottom of the screen?
 *
 *   Right Aligned Menus:
 *   - Put most command windows to the right side of the screen.
 *
 *   Show Buttons:
 *   - Show clickable buttons in your game?
 *
 *     Show Cancel Button:
 *     Show Menu Button:
 *     Show Page Up/Down:
 *     Show Number Buttons:
 *     - Show/hide these respective buttons if the above is enabled.
 *     - If 'Show Buttons' is false, these will be hidden no matter what.
 *
 *   Button Area Height:
 *   - Sets the height for the button area.
 *
 *   Bottom Buttons:
 *   - Put the buttons at the bottom of the screen?
 *
 *   Side Buttons:
 *   - Push buttons to the side of the UI if there is room.
 *
 *   State Icons Non-Frame:
 *   - Replace sprite frame system for non-frame.
 *   - Better for any instances where icons are zoomed.
 *
 * ---
 *
 * Larger Resolutions
 *
 * ---
 *
 * Menu Objects
 *
 *   Level -> EXP Gauge:
 *   - Draw an EXP Gauge under the drawn level.
 *
 *   Parameter Arrow:
 *   - The arrow used to show changes in the parameter values.
 *
 * ---
 *
 * Text Code Support
 *
 *   Class Names:
 *   - Make class names support text codes?
 *
 *   Nicknames:
 *   - Make nicknames support text codes?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * Adjust the default settings of the windows in-game. This ranges from things
 * such as the line height (to better fit your font size) to the opacity level
 * (to fit your window skins).
 *
 * These settings also allow you to add scroll bars to scrollable windows,
 * letting the player know how much of the window's contents there are left for
 * scrolling. The scroll bar can be enabled, disabled, have its thickness
 * changed, colors changed, etc.
 *
 * ---
 *
 * Window Defaults
 *
 *   Enable Masking:
 *   - Enable window masking (windows hide other windows behind them)?
 *   - WARNING: Turning it on can obscure data.
 *
 *   Correct Skin Bleed:
 *   - Allows you to enable/disable the window skin bleeding correction for
 *     those who wish to use the 95 calculator instead of 96 to augment higher
 *     and larger screen resolutions.
 *   - Read the "Bug Fixes" section if you don't understand what the window
 *     skin bleeding problem is.
 *
 *   Line Height:
 *   - Default line height used for standard windows.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 *
 *   Item Padding:
 *   - Default line padding used for standard windows.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 *
 *   Back Opacity:
 *   - Default back opacity used for standard windows.
 *   - As of version 1.3.0, this is no longer needed.
 *   - This will still work for lower versions.
 *
 *   Translucent Opacity:
 *   - Default translucent opacity used for standard windows.
 *
 *   Window Opening Speed:
 *   - Default open speed used for standard windows.
 *   - Default: 32 (Use a number between 0-255)
 *
 *   Column Spacing:
 *   - Default column spacing for selectable windows.
 *   - Default: 8
 *
 *   Row Spacing:
 *   - Default row spacing for selectable windows.
 *   - Default: 4
 *
 * ---
 *
 * Scroll Bar
 *
 *   Show Scroll Bar?:
 *   - Show the scroll bar for scrollable windows?
 *
 *   Thickness:
 *   - How thick do you want the scroll bar to be?
 *
 *   Offset:
 *   - How much do you want to offset the scroll bar by?
 *
 *   Bar Body Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 *   Off Bar Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 *   Off Bar Opacity:
 *   - What opacity value do you want the off bar opacity to be?
 *   - Use a number between 0 and 255.
 *
 * ---
 *
 * Selectable Items:
 *
 *   Show Background?:
 *   - Selectable menu items have dark boxes behind them. Show them?
 *
 *   Item Height Padding:
 *   - Default padding for selectable items.
 *   - Avoid using odd numbers.
 *   - Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 *
 *   JS: Draw Background:
 *   - Code used to draw the background rectangle behind clickable menu objects
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: JS: Quick Functions
 * ============================================================================
 *
 * WARNING: This feature is highly experimental! Use it at your own risk!
 *
 * JavaScript Quick Functions allow you to quickly declare functions in the
 * global namespace for ease of access. It's so that these functions can be
 * used in Script Calls, Control Variable Script Inputs, Conditional Branch
 * Script Inputs, Damage Formulas, and more.
 *
 * ---
 *
 * JS: Quick Function
 *
 *   Function Name:
 *   - The function's name in the global namespace.
 *   - Will not overwrite functions/variables of the same name.
 *
 *   JS: Code:
 *   - Run this code when using the function.
 *
 * ---
 *
 * If you have a Function Name of "Example", then typing "Example()" in a
 * Script Call, Conditional Branch Script Input, or similar field will yield
 * whatever the code is instructed to return.
 *
 * If a function or variable of a similar name already exists in the global
 * namespace, then the quick function will be ignored and not created.
 *
 * If a quick function contains bad code that would otherwise crash the game,
 * a fail safe has been implemented to prevent it from doing so, display an
 * error log, and then return a 0 value.
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
 * ============================================================================
 * Credits
 * ============================================================================
 *
 * If you are using this plugin, credit the following people in your game:
 *
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.85: October 17, 2024
 * * Feature Updates!
 * ** Updated to fit RPG Maker MZ's updated 1.8.1 version better.
 *
 * Version 1.84: August 29, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New notetags added by Arisu:
 * *** Tileset Notetag: <Taller By x: id>
 * **** Changes any page B, C, D, E tile marked by terrain tag 'id' to be
 *      taller by 'x' tiles.
 * **** When placing these tiles on the map, all you have to do is just place
 *      the bottom tile.
 * ***** ie.: For a tree that's one tile taller, just place the tile at the
 *       bottom where you see the trunk. Then, in-game, the tree will appear
 *       taller by one tile as marked.
 * **** O/X layer tiles have a special property where tall sprites standing in
 *      front of it will no longer clip the top of the sprite, while sprites
 *      standing behind it will be covered by it.
 * **** This does not work with events using tiles as graphics. Instead, if
 *      you want to do similar, use the Event & Movement Core's <Tile Expand>
 *      notetags for better control.
 *
 * Version 1.83: June 13, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Updated documentation for <param Max: x> notetag.
 * *** This does not set the max cap to be lower than the default cap.
 * * New Feature!
 * ** New Plugin Parameters added by Olivia:
 * *** Plugin Parameters > UI Settings > State Icons Non-Frame
 * **** Replace sprite frame system for non-frame.
 * **** Better for any instances where icons are zoomed.
 *
 * Version 1.82: April 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Added failsafe for $textPopup when some windows have not been initialized
 *    and requesting the text popup.
 * * New Feature!
 * ** New Plugin Parameter and playtest shortcut added by Arisu:
 * *** Plugin Parameters > QoL Settings > Playtest > CTRL + n: Quick Load
 * **** CTRL + a number from 1 to 9 will yield a quick load of that save file.
 * **** Does not count auto saves.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.81: February 15, 2024
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetags added for future plugin: VisuMZ_2_BattleGridSystem
 * *** <Grid>
 * *** <No Grid>
 * **** Requires the future plugin VisuMZ_2_BattleGridSystem!
 * **** Read the help section for more information on these.
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > Window > Correct Skin Bleed
 * **** Allows you to enable/disable the window skin bleeding correction for
 *      those who wish to use the 95 calculator instead of 96 to augment higher
 *      and larger screen resolutions.
 * **** Read the "Bug Fixes" section if you don't understand what the window
 *      skin bleeding problem is.
 *
 * Version 1.80: January 18, 2024
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Auto Save After New Game
 * **** Normally, when starting a new game through the "New Game" option, there
 *      is no auto save trigger. However, if you start a new game or load a
 *      saved game, then go to the Game End screen, return back to the title
 *      screen, then start a New Game, the auto save trigger occurs when it
 *      shouldn't. The Core Engine will now patch this and prevent the trigger
 *      from taking place.
 *
 * Version 1.79: November 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Plugin Command added by Arisu:
 * ** Text Popup: Show Text
 * *** Adds text to a text popup window to briefly appear.
 * *** Multiple text popups will be queued.
 * *** Does not halt the game and works parallel to game activity.
 *
 * Version 1.78: October 12, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Olivia and sponsored by AndyL:
 * *** QoL Settings > Battle Test > Shift+R: Recover All
 * **** For Play Test only! During battle, pressing SHIFT + R will refill the
 *      whole party's HP and MP and status.
 * *** QoL Settings > Battle Test > Shift+T: Full TP
 * **** For Play Test only! During battle, pressing SHIFT + T will refill the
 *      whole party's TP.
 *
 * Version 1.77: August 17, 2023
 * * Bug Fixes!
 * ** Fixed a bug that would cause the BGS related Plugin Commands to crash.
 *    Fix made by Arisu.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Scroll-Linked Pictures now work if the image file are in a folder within
 *    the img/pictures/ folder without the folder needing a ! at the start.
 * * New Features!
 * ** New Plugin Commands added by Arisu:
 * *** Picture: Rotate by Angle
 * **** Rotates target picture by a amount angle over a set duration instead of
 *      continuously.
 * **** View help file for more information on the Plugin Command.
 * *** Picture: Rotate to Angle
 * **** Rotates target picture to a certain angle over a set duration instead
 *      of continuously.
 * **** View help file for more information on the Plugin Command.
 * ** New Plugin Parameter added by Irina:
 * *** Parameters > Menu Button Assist > General > Split "Escape":
 * **** Used ONLY for those making their own custom keyboard key input maps.
 * **** "Split" option makes separate instances of "Cancel" and "Menu" keys.
 * **** "Don't" option will consolidate both into "Escape" keys.
 *
 * Version 1.76: June 15, 2023
 * * Bug Fixes!
 * ** Fixed a bug that displayed the incorrect button press key for name input
 *    processing's cancel action. Fix made by Olivia.
 *
 * Version 1.75: March 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** In Scene_Name, when using the Keyboard Input, the button assist windows
 *    will no longer display the keyboard shortcuts for Ok and Cancel, but
 *    instead, show them for ENTER and BKSP. Update made by Arisu.
 * ** In Scene_Name, when manual inputting, the Page Up/Dn keys are now
 *    displayed to show changing character pages.
 * * New Features!
 * ** New Plugin Parameters added by Arisu and sponsored by AndyL:
 * *** Params > Keyboard Input > Button Assist > Finish Entry
 * **** Text used to describe finish entry.
 * *** Params > Keyboard Input > Button Assist > Page Change
 * **** Text used to describe changing character pages.
 * *** Params > Window Settings > Scroll Bar
 * **** These settings also allow you to add scroll bars to scrollable windows,
 *      letting the player know how much of the window's contents there are
 *      left for scrolling. The scroll bar can be enabled, disabled, have its
 *      thickness changed, colors changed, etc.
 *
 * Version 1.74: February 16, 2023
 * * Compatibility Update!
 * ** Plugin Commands for: Audio: Change Current BGM/BGS Volume/Pitch/Pan
 *    should now work properly with the updated RPG Maker MZ version and
 *    WebAudio changes. Update made by Arisu.
 *
 * Version 1.73: January 20, 2023
 * * Compatibility Update!
 * ** Added better Effekseer version compatibility.
 *
 * Version 1.72: December 15, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Skill List Active After Party Member Change
 * **** If the skill list is active (ie. the player can move the cursor around)
 *      and the party member currently being viewed is changed via the button
 *      commands, then previously, RPG Maker MZ would still have that window be
 *      active despite having the cursor hidden temporarily. Upon pressing
 *      direction buttons, the cursor reveals itself and both the skill type
 *      window and skill list window are both active, making way for lots of
 *      potential problems to happen.
 * ** Water Tile Bug
 * *** It seems like there's a new bug that occurs if you create a tileset from
 *     scratch in RPG Maker MZ version 1.5.0+ and version 1.6.0+! What this bug
 *     does is it causes many tiles to become water tiles without intending to.
 *     You can find this out by turning off all the plugins in your project,
 *     putting a Ship or Boat on what are normally ground tiles, and then
 *     seeing the Ship or Boat traverse through it.
 * *** There are two ways to fix this. We cannot fix it through code in this
 *     plugin as it's a problem that involves the tileset json data there are
 *     ways to work around it so that you can get the proper water-flags to go
 *     where they need to be at.
 * **** 1. Copy a working un-bugged tileset onto the currently bugged one and
 *      reapply the tile features like passability, terrain tags, etc. This
 *      will make sure the water-passability tiles get copied over correctly.
 * **** 2. If you're on RPG Maker MZ version 1.5.0 or above, select a working
 *      un-bugged tileset (usually a pre-existing tileset when a new project is
 *      made), click the "Copy Page" button, go to the bugged tileset and press
 *      "Paste Page". You'll have to reapply any different properties like
 *      passabilities and terrain tags, but the water tile flags should now be
 *      working properly.
 * *** The plugin will not fix the problem itself since flag data is delicate
 *     and should not be tampered with midgame as the changes made by the
 *     plugin might not match the desired settings.
 * *** This plugin, however, will also send out an alert message when coming
 *     across such a tile. Pay attention to it and do one of the following two
 *     steps above to fix the problem.
 * * Documentation Update!
 * ** Added "Skill List Active After Party Member Change" section to the
 *    "Important Changes: Bug Fixes" section of the help file.
 * ** Added "Water Tile Bug" section to the "Important Changes: Bug Fixes"
 *    section of the help file.
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Menu Backgrounds > Blur Strength
 * **** Strength used for menu background snapshots.
 *
 * Version 1.71: November 10, 2022
 * * Bug Fixes!
 * ** Title Command Window should now allow for more than 4 custom commands
 *    without hidden commands. Fix made by Irina.
 * ** Fixed a problem with repeating animations from Visual State Effects
 *    causing softlocks. Fix made by Olivia.
 *
 * Version 1.70: October 6, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** A texture check will now occur for sprites that are being removed and
 *     destroyed in order to prevent crashes. In the off chance that someone
 *     creates a sprite through a script call and removes it through such, the
 *     likelihood of this occurance becomes higher. This makes the destroy
 *     property take into account a texture check in order to see if the sprite
 *     removal is taking extra steps and will reduce those extra steps.
 * * Documentation Update!
 * ** Added "Sprite Removal and Destroy Crash" section to the "Important
 *    Changes: Bug Fixes" section.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.69: September 8, 2022
 * * Bug Fixes!
 * ** Fixed the combination of Button Assist Location: Top with Help Location:
 *    Bottom combination not working properly. Fix made by Irina.
 *
 * Version 1.68: August 4, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Olivia and sponsored by Archeia:
 * *** Audio: Change Current BGM Volume
 * *** Audio: Change Current BGM Pitch
 * *** Audio: Change Current BGM Pan
 * *** Audio: Change Current BGS Volume
 * *** Audio: Change Current BGS Pitch
 * *** Audio: Change Current BGS Pan
 * **** Changes the current BGM/BGS volume/pitch/pan without changing any of
 *      the current BGM/BGS's other properties and without restarting BGM/BGS.
 *
 * Version 1.67: July 28, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added notes for Line Height and Item Padding parameters:
 * *** Avoid using odd numbers.
 * *** Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 * *** This setting will be disabled if the map is zoomed in.
 * * New Features!
 * ** New map notetags added by Irina and sponsored by AndyL:
 * *** <Scroll Lock X>
 * *** <Scroll Lock X: x>
 * *** <Scroll Lock Y>
 * *** <Scroll Lock Y: y>
 * **** Causes the map to not scroll left/right(x) or up/down(y). Useful for
 *      when maps are just slightly smaller than normal and the tiny scrolling
 *      is distracting.
 * ** New Plugin Parameters added by Irina and sponsored by AndyL:
 * *** Plugin Parameters > Screen Resolution > Maps > Scroll Lock Small X?
 * *** Plugin Parameters > Screen Resolution > Maps > Scroll Lock Small Y?
 * *** Plugin Parameters > Screen Resolution > Maps > Locked Display X?
 * *** Plugin Parameters > Screen Resolution > Maps > Locked Display Y?
 * **** Automatically scroll locks small maps to prevent them from scrolling
 *      horizontally/vertically. Useful for 1280x720 resolutions when the map
 *      is 27 tiles wide. This will get rid of the subtle scrolling when moving
 *      from one half of the screen to the other.
 * **** This setting will be disabled if the map is zoomed in.
 * * Feature Update!
 * ** Warnings added to Line Height and Item Padding parameters:
 * *** Avoid using odd numbers.
 * *** Visuals in RPG Maker and general game dev don't work well with odd
 *     numbers so avoid them unless you want your game's visuals to behave
 *     inconsistently.
 *
 * Version 1.66: July 14, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Debug Console Refresh Bug
 * **** When pressing F5 to refresh while the debug console (DevTools) is open,
 *      some graphics will fail to load properly. This started occurring since
 *      the RPG Maker MZ 1.5.0 update and the code for loading the images has
 *      now been reverted to the 1.4.4 version where it was last stable.
 * * Documentation Update!
 * ** Help file updated for new major bug fix.
 *
 * Version 1.65: June 30, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Parameter Settings > Show Actor Level?
 * **** Show the actor level when displaying actors?
 * **** Used for most windows in-game.
 *
 * Version 1.64: June 9, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command made by Arisu and sponsored by
 *    ImGonnaPutMyGameOnXboxAndYouCantStopMe:
 * *** Debug: Current Controller ID
 * **** PLAY TEST ONLY. Shows current controller ID in debug console.
 * **** Also copies to computer clipboard if possible.
 * ** New Plugin Parameters made by Arisu and sponsored by
 *    ImGonnaPutMyGameOnXboxAndYouCantStopMe:
 * *** Subsettings for Button Assist Window: Controller Button Assist
 * **** These are sub-settings for the Button Assist Window Plugin Parameters.
 *      Where the Button Assist Window Plugin Parameters are focused on
 *      keyboard entries, these sections are focused on gamepad controllers.
 * **** Add multiple gamepads to the list to give them different button assist
 *      text. If a gamepad is being used but not listed here, the button assist
 *      text will default to the keyboard version.
 *
 * Version 1.63: May 2, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > QoL Settings > Misc > Map Name Text Code
 * **** If on, map names will use text codes.
 * **** If off, only the raw map name will be used.
 * * Feature Update!
 * ** The map name text code change will no longer be on forcefully. It is now
 *    something that can be toggled by Plugin Parameters. Update by Irina.
 *
 * Version 1.62: April 28, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu and sponsored by Archeia:
 * *** Variable: JS Eval
 * **** Pick a variable ID and value to alter through JS.
 * **** Allows one line of code for variable ID and operand.
 * **** Functions like RM2k3's Variable Pointers.
 * *** Variable: JS Block
 * **** Pick a variable ID and value to alter through JS.
 * **** Allows JS block code for variable ID and operand.
 * **** Functions like RM2k3's Variable Pointers.
 * ** Map names can now use text codes. Made by Arisu and sponsored by Archeia.
 *
 * Version 1.61: April 21, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Battle Forced End Action Crash
 * **** Depending on various circumstances, currently active battlers can be
 *      cleared from the battle system at will due to a number of reasons.
 *      However, if it just so happens that the targets are cleared, too, with
 *      actions remaining, then a crash will follow up. This plugin will
 *      prevent that change. Fix made by Olivia.
 *
 * Version 1.60: April 14, 2022
 * * Bug Fixes!
 * ** Number Input window will now respond to Home/End keys properly.
 *    Fix made by Olivia.
 *
 * Version 1.59: April 7, 2022
 * * Compatibility Update!
 * ** RPG Maker MZ 1.4.4 compatibility update!
 * *** "Shutdown" command should now be more compatible with other aspects of
 *     the client when running from Node JS client on other OS's.
 *
 * Version 1.58: March 24, 2022
 * * Feature Update!
 * ** Plugin Commands now have separators for easier selection.
 *
 * Version 1.57: March 3, 2022
 * * Compatibility Update!
 * ** The "Shutdown" command from the title screen should now be compatible
 *    with RPG Maker MZ 1.4.4 and up. Update made by Olivia.
 *
 * Version 1.56: February 10, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New features added by Arisu and sponsored by Anon:
 * *** Plugin Parameters > QoL > Misc > Shortcut Scripts
 * **** Enables shortcut-based script variables and functions that can be used
 *      for script calls.
 * **** Shortcut list enabled for this is as follows:
 * ***** $commonEvent(id), $onceParallel(id), $scene, $spriteset, $subject,
 *       $targets, $target, $event
 * ***** For more information on how to use them, review the help file.
 *
 * Version 1.55: January 27, 2022
 * * Feature Update!
 * ** Once Parallels for the map are now able to update even while other events
 *    are running. Update made by Arisu.
 *
 * Version 1.54: January 13, 2022
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** Overly-Protective Substitute
 * *** When an ally with critical health is being targeted by a friendly non-
 *     Certain Hit skill (such as a heal or buff) and another ally has the
 *     substitute state, the other ally would "protect" the originally targeted
 *     ally and take the heal or buff.
 * *** The new changed behavior is that now, substitute will not trigger for
 *     any actions whose scope targets allies.
 * *** Fix made by Olivia.
 * * Documentation Update!
 * ** Added documentation for new MZ Bug: Overly-Protective Substitute.
 * * Feature Update!
 * ** Added a failsafe for those who did not update the plugin parameter
 *    settings and are using MV Animations.
 *
 * Version 1.53: December 30, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Notetag added by Olivia:
 * *** <Rate: x>
 * **** Allows you to adjust the update for this MV Animation.
 * ***** Does NOT work with Effekseer animations.
 * **** The lower the number, the faster.
 * **** Replace 'x' with a number representing the animation update rate.
 * ***** Default rate: 4.
 * ***** Minimum rate: 1.
 * ***** Maximum rate: 10.
 * ** New Plugin Parameter added by Olivia:
 * *** Plugin Parameters > Qualify of Life Settings > MV Animation Rate
 * **** Adjusts the rate at which MV animations play.
 * **** Default: 4. Lower for faster. Higher for slower.
 * * Optimization Update!
 * ** MV Animations should run more optimized.
 *
 * Version 1.52: December 16, 2021
 * * Compatibility Update!
 * ** RPG Maker MZ 1.4.0 compatibility update!
 * *** MV Animations played on screen level will now show up properly in the
 *     center of the screen.
 *
 * Version 1.51: December 9, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** In the battle status windows, whenever actor names are displayed, the
 *     bitmap used to display their name text do not extend vertically all the
 *     way, causing letters like lowercase "Q" and "G" to be cut off, making
 *     them hard to distinguish from one another. The Core Engine will remedy
 *     this by extending the bitmap to allow enough room. Fix made by Irina.
 *
 * Version 1.50: November 4, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug Fix!
 * *** By default, if the attack skill is sealed via a trait and an actor has
 *     auto-battle, the action can still be used via auto-battle. This is now
 *     fixed and actors should not be able to attack via auto-battle if their
 *     attack ability is sealed. Fix made by Yanfly.
 * * Documentation Update!
 * ** Help file updated for new RPG Maker MZ bug fix.
 *
 * Version 1.49: October 28, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Command added by Arisu and sponsored by Anon:
 * *** Map: Once Parallel
 * **** Plays a Common Event parallel to the event once without repeating
 *      itself when done. Map only!
 * **** When exiting map scene or changing maps, all Once Parallels are cleared
 * **** Once Parallels are not retained upon reentering the scene or map.
 * **** Once Parallels are not stored in memory and cannot be saved.
 *
 * Version 1.48: October 21, 2021
 * * Feature Update!
 * ** Bitmap.blt function will now have source coordinates and destination X
 *    and Y coordinates rounded to prevent blurring. Update made by Olivia.
 *
 * Version 1.47: October 14, 2021
 * * Bug Fixes!
 * ** Prevents Number Input window from having a NaN value due to holding down
 *    the fast forward key. Fix made by Arisu.
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameter added by Yanfly:
 * *** Plugin Parameters > QoL Settings > Misc > Font Width Fix
 * **** Fixes the font width issue with non-monospaced fonts in the Message
 *      Window. This is now an optional fix.
 *
 * Version 1.46: September 23, 2021
 * * Documentation Update!
 * ** Added line to Plugin Command: "System: Battle System Change":
 * *** Some battle systems REQUIRE their specific plugins!
 * ** Added lines to "Plugin Parameters: Battle System":
 * *** Some battle systems REQUIRE their specific plugins! This means if you do
 *     not have the required battle system plugin installed, it will not change
 *     over. The Core Engine plugin does not contain data for all of the battle
 *     systems inside its code.
 *
 * Version 1.45: September 17, 2021
 * * Bug Fixes!
 * ** Fixed a problem with "Picture: Coordinates Mode" to properly utilize the
 *    correct picture ID. Fix made by Arisu.
 * ** RPG Maker MZ Bug Fix:
 * *** Instant Text Discrepancy for Window_Message
 * **** Window_Message displays text differently when it draws letters one by
 *      one versus when the text is displayed instantly. This isn't noticeable
 *      with the default font, but it's very visible when using something like
 *      Arial. The error is due to Bitmap.measureTextWidth yielding a rounded
 *      value per letter versus per word. The Core Engine will provide a bug
 *      fix that will single out the cause and make it so that only
 *      Window_Message will not utilize any round number values when
 *      determining the width of each letter, whether or not it is shown
 *      instantly. This change will only affect Window_Message and not any
 *      other window in order to prevent unintended side effects.
 * **** Fix made by Yanfly.
 * * Compatibility Update!
 * ** RPG Maker MZ 1.3.3 compatibility.
 * *** Updated how gauges are drawn.
 * * Documentation Update!
 * ** Help file updated for new RPG Maker MZ bug fix.
 *
 * Version 1.44: August 20, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Anon.
 * *** "Animation: Play at Coordinate"
 * **** Plays an animation on the screen at a specific x, y coordinate even if
 *      there is no sprite attached.
 *
 * Version 1.43: July 23, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Archeia!
 * *** "Picture: Coordinates Mode"
 * **** Play Test Mode only!
 * **** Gets the coordinates of a specific picture as you move it across the
 *      screen.
 * **** Helpful for those who don't want to do guess work on the screen
 *      coordinates when it comes to placing down pictures.
 *
 * Version 1.42: July 16, 2021
 * * Documentation Update
 * ** Added text to "Plugin Parameters: Color Settings" for clarification:
 * *** If the game's Window Skin is changed mid-game, the colors used will
 *     still be based off the default Window Skin's colors. This is due to
 *     storing them in a cache and preventing extra processing and reduces lag.
 *
 * Version 1.41: July 2, 2021
 * * Compatibility Update
 * ** Further compatibility update with RPG Maker MZ 1.3.0+.
 * * Documentation Update
 * ** Added extra notes to "Important Changes: Bug Fixes" section for the
 *    "Window Skin Bleeding" bug:
 * *** This bug is fixed in the core scripts for RPG Maker MZ v1.3.0+.
 *
 * Version 1.40: June 25, 2021
 * * Compatibility Update
 * ** Compatibility update with RPG Maker MZ 1.3.0+.
 * * Documentation Update:
 * ** Plugin Parameters > Window Settings > Back Opacity
 * *** As of version 1.3.0, this is no longer needed.
 * *** This will still work for lower versions.
 * ** Help file updated for new features.
 * * Feature Updates!
 * ** Window Skin Bleeding fix updated to newest version.
 * * New Plugin Parameters added:
 * ** Plugin Parmaeters > Screen Resolution Settings
 * *** These settings have been moved from the UI settings to be its own thing.
 * **** This is mostly for RPG Maker MZ version 1.3.0 and up where the Troops
 *      tab has been updated to match the screen resolution settings found in
 *      the System 2 Database tab.
 * *** Reposition Enemies > For MZ 1.3.0+?
 * **** Both of these plugin parameters need to be set to true in order for the
 *      repositioning to work for MZ v1.3.0.
 * **** If the Core Script is below 1.3.0, this setting is ignored. This does
 *      not take into account what version the editor is on. Pay attention to
 *      that as the plugin will not auto adjust for it.
 *
 * Version 1.39: June 18, 2021
 * * Bug Fixes!
 * ** Number Inputs should now work with the controller if keyboard Number
 *    Input is enabled. Fix made by Olivia.
 * ** RPG Maker Bug: Termination Clear Effects
 * *** In RPG Maker MZ, requesting an animation while transitioning between
 *     scenes, such as going from the map scene to the battle scene, can cause
 *     crashes. This is because the animation queue does not take off
 *     immediately and will likely register incorrect targets for the scene.
 *     This plugin will forcefully clear any registered animations and balloon
 *     effects when terminating a scene in order to prevent crashes.
 * * Documentation Update!
 * ** Help file updated for updated features.
 * * Feature Update!
 * ** <Battle View: x> Troop Name tags can now work with comment tags.
 * ** <Battle System: x> Troop Name tags can now work with comment tags.
 * *** Updates made by Irina.
 *
 * Version 1.38: June 11, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Caz!
 * *** Picture: Show Icon
 * **** Shows an icon instead of a picture image.
 * **** The picture icon can be controlled like any other picture.
 *
 * Version 1.37: May 21, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu:
 * *** Switches: Randomize ID(s)
 * *** Switches: Randomize Range
 * *** Switches: Toggle ID(s)
 * *** Switches: Toggle Range
 * **** These Plugin Commands allow you to randomize the ON/OFF positions of
 *      switches or toggle them so that they flip their ON/OFF status.
 *
 * Version 1.36: May 14, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Irina:
 * *** Export: All Maps Text
 * *** Export: All Troops Text
 * *** Export: Current Map Text
 * *** Export: Current Troop Text
 * **** Play Test Only Plugin Commands. These Plugin Commands are used for
 *      extracting all messages, show choices, comments, and scrolling text to
 *      parse and export them as a TXT file. Useful for getting a game's script
 *      to a voice actor or voice actress.
 *
 * Version 1.35: May 7, 2021
 * * Documentation Update!
 * ** Added the following text to "Parameter Settings" Plugin Parameters for
 *    extra clarity regarding Parameter Caps:
 * *** These settings DO NOT raise the editor's maximum values. If you want to
 *     raise an enemy's maximum parameter value past their default cap, use the
 *     associated notetag for them instead.
 *
 * Version 1.34: April 23, 2021
 * * Bug Fixes!
 * ** For the vanilla Equip Status window, custom parameters with integer
 *    values will now show up as integers and not percentiles. Fix by Olivia.
 * * Documentation Update!
 * ** Added clarity to the <param: x> notetag for enemies.
 * *** This notetag does NOT work with X Parameters, S Parameters, or any
 *     custom parameters. This notetag ONLY works with the base parameters.
 *
 * Version 1.33: April 9, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Window Skin Bleeding
 * *** Since the v1.2.0 update, Window.prototype._refreshBack's frame value has
 *     been set from 96 to 95. This results in the window skin bleeding past
 *     the window's intended borders. The Core Engine now reverts this change
 *     to prevent the bleeding effect from happening.
 * * Feature Update!
 * ** "Encounter Rate Minimum" now has a valid minimum value of 1. Update made
 *    by Olivia.
 *
 * Version 1.32: April 2, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Yanfly:
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Item Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Weapon Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Add Armor Type
 * *** Plugin Parameters > QoL Settings > Battle Test > Added Quantity
 * **** By default, RPG Maker MZ only adds 99 of items and not weapons or armor
 *      making it awkward for testing specific battle mechanics. These settings
 *      allow you to add in custom amounts of items, weapons, and/or armors if
 *      you so wish.
 *
 * Version 1.31: March 26, 2021
 * * Feature Update!
 * ** Title screen buttons will now become fully opaque when hovered over them
 *    instead of only when pressed. Update made by Yanfly.
 *
 * Version 1.30: March 19, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Invisible Battle Sprites
 * *** If you removed a party member during battle and added that exact party
 *     member back into the same slot, their sprite would appear invisible. The
 *     VisuStella Core Engine will fix this problem and prevent it from
 *     happening. Fix made by Olivia.
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > QoL Settings > Misc > Ani: Mirror Offset
 * **** When animations are mirrored, mirror their Offset X values, too.
 * ** New animation name tags added by Arisu:
 * *** <Mirror Offset X> and <No Mirror Offset X>
 * **** If these text tags are placed in an animation's name, it will cause the
 *      offset X value to be mirrored when the animation is mirrored or have it
 *      ignored despite being mirrored.
 *
 * Version 1.29: March 12, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Interactable window client area does not conform to the
 *    window's declared scale when the scale is anything but 1.0. This will now
 *    be fixed through this plugin. Fix made by Olivia.
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * ** Help file updated for updated features.
 * * Feature Update!
 * ** Name Input should be more controller-friendly. If a controller is
 *    connected upon entering the name change scene, it will use the default
 *    manual-entry mode instead of the keyboard-entry mode. If a controller
 *    button is pressed during the keyboard-entry mode, it will automatically
 *    switch to the manual-entry mode.
 * ** This plugin does not provide support for controllers that are undetected
 *    by RPG Maker MZ's default controller support.
 * ** This feature was already implemented since version 1.27 but wasn't
 *    documented so here we are. Update made by Irina.
 *
 * Version 1.28: March 5, 2021
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: The arrows drawn by a window skin will no longer by
 *    placed on a half pixel when a window's size is an odd number. This would
 *    cause sprite tearing problems and look awful. Fix made by Irina.
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 *
 * Version 1.27: February 26, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Moved "Show Scrolling Text, additional functionality" section from Bug
 *    Fixes to Major Changes as it was placed in the wrong section.
 * * New Features!
 * ** New Plugin Parameter added by Yanfly.
 * *** Plugin Parameters > Keyboard Input > Name Input > Banned Words
 * **** Insert words you don't want your players to use for character names.
 *
 * Version 1.26: February 19, 2021
 * * Bug Fixes!
 * ** Certain Plugin Parameters no longer have settings that restrict them to
 *    a maximum of 1. Fix made by Arisu.
 * * Feature Update!
 * ** Changed the default value for a New Game > Common Event upon Play Testing
 *    to 0 to prevent confusion. Update made by Arisu.
 *
 * Version 1.25: February 5, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** Show Scrolling Text, additional functionality added by Arisu
 * *** The event command "Show Scrolling Text" now has additional functionality
 *     as long as the VisuStella MZ Core Engine is installed. If the game dev
 *     inserts "// Script Call" (without the quotes) inside the scrolling text,
 *     then the entirity of the Show Scrolling Text event command will be ran
 *     as a giant script call event command.
 * *** The reason why this functionality is added is because the "Script..."
 *     event command contains only 12 lines maximum. This means for any script
 *     call larger than 12 lines of code cannot be done by normal means as each
 *     script call is ran as a separate instance.
 * *** By repurposing the "Show Scrolling Text" event command to be able to
 *     function as an extended "Script..." event command, such a thing is now
 *     possible with less hassle and more lines to code with.
 * *** This effect does not occur if the Show Scrolling Text event command does
 *     not have "// Script Call" in its contents.
 *
 * Version 1.24: January 29, 2021
 * * Documentation Update!
 * ** Plugin Parameters: Custom Parameters Settings added the following note:
 * *** For clarification, these settings do NOT create brand-new parameters for
 *     you to use and add to your game nor are the bonuses supported by other
 *     plugins in the VisuStella MZ library. These settings exist to function
 *     as a bridge for non-VisuStella MZ plugins that have created their own
 *     parameter values and to show them inside VisuStella menus.
 * * Feature Update!
 * ** Default JS Plugin Parameter for the Title Command: "Shutdown" now has a
 *    note in it that reads: "Do NOT use this command with mobile devices or
 *    browser games. All it does is cause the game to display a blank, black
 *    canvas which the player is unable to do anything with. It does NOT force
 *    close the browser tab nor the app."
 * *** This is also why this command is disabled by default for any non-NodeJS
 *     client deployed game versions.
 * ** Disabled some bug fixes made by the Core Engine for the default RMMZ code
 *    base since the 1.1.1 version now contains those very same fixes.
 *
 * Version 1.23: January 22, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.22: January 15, 2021
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Sprite_Timer is added to the spriteset for the parent
 *    scene, making it affected by any filers, zooms, and/or blurs, hindering
 *    its readability.
 *
 * Version 1.21: January 8, 2021
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Plugin Parameters > Keyboard Input > Controls > WASD Movement
 * *** Plugin Parameters > Keyboard Input > Controls > R Button: Dash Toggle
 *
 * Version 1.20: January 1, 2021
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 *
 * Version 1.19: December 25, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s) and feature updates!
 * * Bug Fixes!
 * ** Fixed typo inside of the comments inside the JS: Quick Functions.
 * * Feature Update!
 * ** Plugin Parameters > Color Settings > Outline Color is now renamed to
 *    Font Outline.
 * * New Features!
 * ** New Plugin Parameters added by Shaz!
 * *** Plugin Parameters > Color Settings > Gauge Number Outline
 *
 * Version 1.18: December 18, 2020
 * * Bug Fixes!
 * ** Compatible string text from the Items and Equips Core will no longer
 *    register MaxHP and MaxMP as percentile values for the info window.
 * ** RPG Maker MZ Bug: Gamepads no longer go rapidfire after a cleared input.
 *    There is now a period of delay for gamepads after an input clear.
 * ** RPG Maker MZ Bug: Unusable items on an individual-actor basis will no
 *    longer be overwritten by party-based usability for battle. Fix by Yanfly.
 * ** RPG Maker MV animations will no longer crash for unplayable sound
 *    effects. Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * New Features!
 * ** New Plugin Parameters added by Yanfly!
 * *** Plugin Parameters > Button Assist > Key: Shift
 * *** Plugin Parameters > Button Assist > Key: Tab
 * **** These let you assign text codes to the Shift and Tab buttons for the
 *      Button Assist windows.
 * *** Plugin Parameters > QoL Settings > Misc > NewGame > CommonEvent
 * **** For an all version (including non-play test) common event to start new
 *      games with.
 *
 * Version 1.17: December 11, 2020
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 *
 * Version 1.16: December 4, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Button Assist Window for the change name scene will now default to "Tab"
 *    for switching between both modes. Update made by Yanfly.
 * * New Features!
 * ** New Plugin Parameter added by Yanfly:
 * *** Plugin Parameters > Keyboard Input > Default Mode
 * **** Select default mode when entering the scene.
 *
 * Version 1.15: November 29, 2020
 * * Bug Fixes!
 * ** Pressing "Enter" in the change name scene while the actor's name is
 *    completely empty will no longer result in endless buzzer sounds. Fix made
 *    by Arisu.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** For the name change scene, the "Tab" key now also lets the user switch
 *    between the two modes. Update made by Yanfly.
 * * New Features!
 * ** Two new plugin parameters added to Keyboard Input:
 * *** "Switch To Keyboard" and "Switch To Manual"
 * **** These determine the text used for the button assist window when
 *      switching between the two modes. Update made by Yanfly.
 * **** Button Assist window now takes into consideration for these texts.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.14: November 22, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Command added by Yanfly!
 * *** System: Load Images
 * **** Allows you to (pre) load up images ahead of time.
 *
 * Version 1.13: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.12: November 8, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Screen Shake Plugin Parameters and JS: Quick Function Plugin Parameters
 *    have been taken off experimental status.
 * * New Features!
 * ** New plugin parameters added by Arisu.
 * *** Plugin Parameters > Keyboard Input
 * **** Settings for the game that utilize keyboard input. These are primarily
 *      for the name input scene (Scene_Name) and the number input event
 *      command. These settings have only been tested on English keyboards and
 *      may or may not be compatible with other languages, so please disable
 *      these features if they do not fit in with your game.
 *
 * Version 1.11: November 1, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Feature Update!
 * ** Bitmap smoothing now takes into consideration for rounding coordinates.
 *    Update made by Irina.
 *
 * Version 1.10: October 25, 2020
 * * Feature Update!
 * ** Sprite animation location now adjusts position relative to the sprite's
 *    scale, too. Update made by Arisu.
 *
 * Version 1.09: October 18, 2020
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Auto Battle Lock Up. Fixed by Yanfly.
 * *** If an auto battle Actor fights against an enemy whose DEF/MDF is too
 *     high, they will not use any actions at all. This can cause potential
 *     game freezing and softlocks. This plugin will change that and have them
 *     default to a regular Attack.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 *
 * Version 1.08: October 11, 2020
 * * Feature Update!
 * ** Altered sprite bitmaps via the various draw functions will now be marked
 *    as modified and will automatically purge themselves from graphical memory
 *    upon a sprite's removal to free up more resources. Change made by Yanfly.
 * ** Picture Sprite Origin anchors are now tied to the Game_Picture show and
 *    move commands instead of the Game_Interpretter commands. Change by Arisu.
 *
 * Version 1.07: October 4, 2020
 * * Documentation Update!
 * ** New documentation added for the new Plugin Parameter category:
 *    "Custom Parameters".
 * * New Features!
 * ** New Plugin Parameter "Custom Parameters" added by Yanfly.
 * *** Create custom parameters for your game! These will appear in
 *     VisuStella MZ menus.
 *
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Battler evasion pose can now occur if there is a miss. These were made
 *    separate in RPG Maker MZ and misses didn't enable the evasion pose. Fix
 *    made by Olivia.
 * * New Features!
 * ** New notetags for Maps and name tags for Troops added by Yanfly!
 * *** <Frontview>, <Sideview> to change the battle view for that specific map,
 *     or troop regardless of what other settings are.
 * *** <DTB>, <TPB Active>, <TPB Wait> to change the battle system for that
 *     specific map or troop regardless of what other settings are.
 *
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** <Level: x> notetag for enemies is now fixed! Fix made by Arisu.
 * * Documentation Update!
 * ** Documentation added for the new "System: Battle System Change" Plugin
 *    Command and removed the old "System: Set Time Progress Battle".
 * * Feature Update!
 * ** The Plugin Command "System: Set Time Progress Battle" has been replaced
 *    with "System: Battle System Change" instead. This is to accommodate
 *    future plugins that allow for different battle systems. Added by Yanfly.
 * *** If you have previously used "System: Set Time Progress Battle", please
 *     replace them. We apologize for the inconvenience.
 * * New Features!
 * ** In the Core Engine's plugin parameters, you can now set the Battle System
 *    used. This will default to whatever is the game database's setting. This
 *    feature is used for the future when new battle systems are made. Feature
 *    added by Yanfly.
 *
 * Version 1.04: September 13, 2020
 * * Documentation Update!
 * ** Added new documentation for the "Title Command List" and Title Picture
 *    Buttons" plugin parameters. They now have a dedicated section each.
 * * Feature Updates!
 * ** Moved the "Title Command List" and "Title Picture Buttons" parameters
 *    from the Menu Layout > Title settings. They were far too hidden away and
 *    users had a hard time finding them. Update made by Yanfly.
 * *** Users who have customized these settings before will need to readjust
 *     them again. We apologize for the inconvenience.
 *
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Having QoL > Modern Controls disabled (why would you) used to prevent the
 *    down button from working. It works again. Fix made by Yanfly.
 * * New Feature!
 * ** Plugin default settings now come with a "Game End" option on the title
 *    screen. For those updating from version 1.02 or order, you can add this
 *    in by opening the Core Engine > Plugin Parameters > Menu Layout Settings
 *    > press "delete" on Scene_Title > open it up, then the new settings will
 *    fill in automatically.
 * * New Experimental Feature Added:
 * ** Screen Shake Settings added to the Plugin Parameters.
 * *** Screen Shake: Custom Plugin Command added!
 * *** Credit to Aries of Sheratan, who gave us permission to use her formula.
 * *** We'll be expanding on more screen shaking options in the future.
 * * Optimization Update
 * ** Digit Grouping now works more efficiently.
 *
 * Version 1.02: August 30, 2020
 * * New Feature!
 * ** New Plugin Command: "Picture: Erase All". Added by Olivia.
 * *** Erases all pictures on the screen because it's extremely tedious to do
 *     it one by one.
 * ** New Plugin Command: "Picture: Erase Range"
 * *** Erases all pictures within a range of numbers because it's extremely
 *     tedious to do it one by one.
 * * Optimization Update
 * ** Added a more accurate means of parsing numbers for Digit Grouping.
 * ** Window_Base.prototype.textSizeEx now stores data to a cache.
 * * Documentation Update
 * ** Added a section to Major Changes: New Hard-Coded Features on
 *    Digit Grouping and explaining its intricacies.
 * ** Added a note to Plugin Parameters > UI > Reposition Actors to ignore the
 *    setting if using the Battle Core.
 *
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Digit grouping fixed to allow text codes to detect values larger than
 *    1000. Fix made by Olivia and Yanfly.
 * ** Param Plus, Rate, Flat notetags fixed. Fix made by Yanfly.
 * * New Experimental Feature Added:
 * ** JS: Quick Functions found in the Plugin Parameters
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Animation
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AnimationPoint
 * @text Animation: Play at Coordinate
 * @desc Plays an animation on the screen at a specific x, y
 * coordinate even if there is no sprite attached.
 *
 * @arg AnimationID:num
 * @text Animation ID
 * @parent Animation
 * @type animation
 * @desc Plays this animation.
 * @default 1
 *
 * @arg Coordinates
 *
 * @arg pointX:eval
 * @text X
 * @parent Coordinates
 * @desc X coordinate used for the animation.
 * You may use JavaScript code.
 * @default Graphics.width / 2
 *
 * @arg pointY:eval
 * @text Y
 * @parent Coordinates
 * @desc Y coordinate used for the animation.
 * You may use JavaScript code.
 * @default Graphics.height / 2
 *
 * @arg Mirror:eval
 * @text Mirror Animation?
 * @parent Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 *
 * @arg Mute:eval
 * @text Mute Animation?
 * @parent Animation
 * @type boolean
 * @on Mute
 * @off Normal
 * @desc Mute the animation?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Audio
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmVolume
 * @text Audio: Change Current BGM Volume
 * @desc Changes the current BGM volume without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg volume:eval
 * @text Volume
 * @desc Change the current BGM's volume to what amount?
 * You may use JavaScript code. Use numbers from 0 to 100.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmPitch
 * @text Audio: Change Current BGM Pitch
 * @desc Changes the current BGM pitch without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg pitch:eval
 * @text Pitch
 * @desc Change the current BGM's pitch to what amount?
 * You may use JavaScript code. Use numbers from 50 to 150.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgmPan
 * @text Audio: Change Current BGM Pan
 * @desc Changes the current BGM pan without changing any of the
 * current BGM's other properties and without restarting the BGM.
 *
 * @arg pan:eval
 * @text Pan
 * @desc Change the current BGM's pan to what amount?
 * You may use JavaScript code. Use numbers from -100 to 100.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsVolume
 * @text Audio: Change Current BGS Volume
 * @desc Changes the current BGS volume without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg volume:eval
 * @text Volume
 * @desc Change the current BGS's volume to what amount?
 * You may use JavaScript code. Use numbers from 0 to 100.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsPitch
 * @text Audio: Change Current BGS Pitch
 * @desc Changes the current BGS pitch without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg pitch:eval
 * @text Pitch
 * @desc Change the current BGS's pitch to what amount?
 * You may use JavaScript code. Use numbers from 50 to 150.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AudioChangeBgsPan
 * @text Audio: Change Current BGS Pan
 * @desc Changes the current BGS pan without changing any of the
 * current BGS's other properties and without restarting the BGS.
 *
 * @arg pan:eval
 * @text Pan
 * @desc Change the current BGS's pan to what amount?
 * You may use JavaScript code. Use numbers from -100 to 100.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Debug
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command DebugConsoleLastControllerID
 * @text Debug: Current Controller ID
 * @desc PLAY TEST ONLY. Shows current controller ID in debug console.
 * Also copies to computer clipboard if possible.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Export
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExportAllMapText
 * @text Export: All Maps Text
 * @desc PLAY TEST ONLY. Exports all of the text from all maps,
 * their events, event pages, and any associated Common Events.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExportAllTroopText
 * @text Export: All Troops Text
 * @desc PLAY TEST ONLY. Exports all of the text from all troops,
 * their event pages, and any associated Common Events.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExportCurMapText
 * @text Export: Current Map Text
 * @desc PLAY TEST ONLY. Exports all of the text on the current map,
 * its events, the event pages, and any associated Common Events.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ExportCurTroopText
 * @text Export: Current Troop Text
 * @desc PLAY TEST ONLY. Exports all of the text on the current troop,
 * the troop's event pages, and any associated Common Events.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Game
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command OpenURL
 * @text Game: Open URL
 * @desc Opens a website URL from the game.
 *
 * @arg URL:str
 * @text URL
 * @desc Where do you want to take the player?
 * @default https://www.google.com/
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Gold
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GoldChange
 * @text Gold: Gain/Lose
 * @desc Allows you to give/take more gold than the event editor limit.
 *
 * @arg value:eval
 * @text Value
 * @desc How much gold should the player gain/lose?
 * Use negative values to remove gold. You may use JS.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Map
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MapOnceParallel
 * @text Map: Once Parallel
 * @desc Plays a Common Event parallel to the event once without
 * repeating itself when done. Map only!
 *
 * @arg CommonEventID:num
 * @text Common Event ID
 * @type common_event
 * @desc The ID of the parallel Common Event to play.
 * Does NOT repeat itself when finished.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Picture
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureCoordinatesMode
 * @text Picture: Coordinates Mode
 * @desc Play Test Mode only! Gets the coordinates of a specific
 * picture as you move it across the screen.
 *
 * @arg PictureID:num
 * @text Picture ID
 * @type number
 * @min 1
 * @max 100
 * @desc The ID of the pictures to track the coordinates of.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEasingType
 * @text Picture: Easing Type
 * @desc Changes the easing type to a number of options.
 *
 * @arg pictureId:num
 * @text Picture ID
 * @type number
 * @min 1
 * @max 100
 * @desc Which picture do you wish to apply this easing to?
 * @default 1
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg LineBreak
 * @text ------------------------
 * @default --------------------------------
 *
 * @arg Instructions1
 * @text Instructions
 * @default Insert this Plugin Command after
 *
 * @arg Instructions2
 * @text -
 * @default a "Move Picture" event command.
 *
 * @arg Instructions3
 * @text -
 * @default Turn off "Wait for Completion"
 *
 * @arg Instructions4
 * @text -
 * @default in the "Move Picture" event.
 *
 * @arg Instructions5
 * @text -
 * @default You may have to add in your own
 *
 * @arg Instructions6
 * @text -
 * @default "Wait" event command after.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseAll
 * @text Picture: Erase All
 * @desc Erases all pictures on the screen because it's extremely
 * tedious to do it one by one.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseRange
 * @text Picture: Erase Range
 * @desc Erases all pictures within a range of numbers because it's
 * extremely tedious to do it one by one.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type number
 * @min 1
 * @max 100
 * @desc The starting ID of the pictures to erase.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type number
 * @min 1
 * @max 100
 * @desc The ending ID of the pictures to erase.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureRotateBy
 * @text Picture: Rotate By Angle
 * @desc Rotates target picture by a amount angle over a set duration
 * instead of continuously.
 *
 * @arg PictureID:eval
 * @text Picture ID Number
 * @desc What is the ID of the picture you wish to rotate? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 *
 * @arg AdjustAngle:eval
 * @text Adjust Angle
 * @desc What is the angle you wish to rotate the picture by?
 * Use degrees (360 degrees per full rotation).
 * @default 0
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of rotation effect in frames.
 * 60 frames = 1 second. You may use JavaScript code.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureRotate
 * @text Picture: Rotate to Angle
 * @desc Rotates target picture to a certain angle over a set duration
 * instead of continuously.
 *
 * @arg PictureID:eval
 * @text Picture ID Number
 * @desc What is the ID of the picture you wish to rotate? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 *
 * @arg TargetAngle:eval
 * @text Target Angle
 * @desc What is the target angle you wish to rotate the picture?
 * Use degrees (360 degrees per full rotation).
 * @default 0
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of rotation effect in frames.
 * 60 frames = 1 second. You may use JavaScript code.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureShowIcon
 * @text Picture: Show Icon
 * @desc Shows an icon instead of a picture image.
 * The picture icon can be controlled like any other picture.
 *
 * @arg General
 *
 * @arg PictureID:eval
 * @text Picture ID Number
 * @parent General
 * @desc What is the ID of the picture you wish to show at? Use a
 * number between 1 and 100. You may use JavaScript code.
 * @default 1
 *
 * @arg IconIndex:eval
 * @text Icon Index
 * @parent General
 * @desc Select the icon index to use for this picture.
 * You may use JavaScript code.
 * @default 23
 *
 * @arg Smooth:eval
 * @text Smooth Icon?
 * @parent General
 * @type boolean
 * @on Smooth
 * @off Pixelate
 * @desc This will make the icon smoothed out or pixelated.
 * @default false
 *
 * @arg PictureSettings
 * @text Picture Settings
 *
 * @arg Settings:struct
 * @text Settings
 * @parent PictureSettings
 * @type struct<ShowPicture>
 * @desc Alter the settings for how the picture will be shown.
 * @default {"Position":"","Origin:num":"0","PositionX:eval":"0","PositionY:eval":"0","Scale":"","ScaleX:eval":"100","ScaleY:eval":"100","Blend":"","Opacity:eval":"255","BlendMode:num":"0"}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_ScreenShake
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ScreenShake
 * @text Screen Shake: Custom
 * @desc Creates a custom screen shake effect and also sets
 * the following uses of screen shake to this style.
 *
 * @arg Type:str
 * @text Shake Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc Select shake style type.
 * @default random
 *
 * @arg Power:num
 * @text Power
 * @type number
 * @min 1
 * @max 9
 * @desc Power level for screen shake.
 * @default 5
 *
 * @arg Speed:num
 * @text Speed
 * @type number
 * @min 1
 * @max 9
 * @desc Speed level for screen shake.
 * @default 5
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of screenshake.
 * You can use code as well.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Switch
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchRandomizeOne
 * @text Switches: Randomize ID(s)
 * @desc Select specific Switch ID's to randomize ON/OFF.
 *
 * @arg IDs:arraynum
 * @text Switch ID(s)
 * @type switch[]
 * @desc Select which Switch ID(s) to toggle.
 * @default ["1"]
 *
 * @arg Chance:num
 * @text Chance for ON
 * @type number
 * @min 1
 * @max 100
 * @desc Chance out of 100 that determines the switches to be ON.
 * @default 50
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchRandomizeRange
 * @text Switches: Randomize Range
 * @desc Select specific Switch ID Range to randomize ON/OFF.
 * The ratio determines the ON/OFF distribution.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type switch
 * @desc The starting ID of the Switch to toggle.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type switch
 * @desc The ending ID of the Switch to toggle.
 * @default 20
 *
 * @arg Chance:num
 * @text Chance for ON
 * @type number
 * @min 1
 * @max 100
 * @desc Chance out of 100 that determines the switches to be ON.
 * @default 50
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchToggleOne
 * @text Switches: Toggle ID(s)
 * @desc Select specific Switch ID's to toggle ON/OFF.
 * ON becomes OFF. OFF becomes ON.
 *
 * @arg IDs:arraynum
 * @text Switch ID(s)
 * @type switch[]
 * @desc Select which Switch ID(s) to toggle.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchToggleRange
 * @text Switches: Toggle Range
 * @desc Select specific Switch ID Range to toggle ON/OFF.
 * ON becomes OFF. OFF becomes ON.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type switch
 * @desc The starting ID of the Switch to toggle.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type switch
 * @desc The ending ID of the Switch to toggle.
 * @default 20
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_System
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetBattleSystem
 * @text System: Battle System Change
 * @desc Switch to a different battle system in-game.
 * Some battle systems REQUIRE their specific plugins!
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB Wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 * @value etb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 * @value ptb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to switch to.
 * @default database
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemLoadImages
 * @text System: Load Images
 * @desc Allows you to (pre) load up images ahead of time.
 *
 * @arg animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetFontSize
 * @text System: Main Font Size
 * @desc Set the game's main font size.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @min 1
 * @desc Change the font size to this number.
 * @default 26
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetSideView
 * @text System: Side View Battle
 * @desc Switch between Front View or Side View for battle.
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Front View
 * @value Front View
 * @option Side View
 * @value Side View
 * @option Toggle
 * @value Toggle
 * @desc Choose which view type to switch to.
 * @default Toggle
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetWindowPadding
 * @text System: Window Padding
 * @desc Change the game's window padding amount.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @min 1
 * @desc Change the game's standard window padding to this value.
 * Default: 12
 * @default 12
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_TextPopup
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command TextPopupShow
 * @text Text Popup: Show Text
 * @desc Adds text to a text popup window to briefly appear.
 * Multiple text popups will be queued.
 *
 * @arg text:json
 * @text Text
 * @type note
 * @desc Write the text that you want to appear here.
 * You may use text codes.
 * @default "Insert message here."
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Variable
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command VariableEvalReference
 * @text Variable: JS Eval
 * @desc Pick a variable ID and value to alter through JS.
 * Functions like RM2k3's Variable Pointers.
 *
 * @arg id:eval
 * @text Variable ID
 * @desc This is the target variable to alter.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default 1
 *
 * @arg operation:str
 * @text Operation Type
 * @type select
 * @option Set
 * @value =
 * @option Add
 * @value +
 * @option Sub
 * @value -
 * @option Mul
 * @value *
 * @option Div
 * @value /
 * @option Mod
 * @value %
 * @desc What operation do you wish to use for this Plugin Command?
 * @default =
 *
 * @arg operand:eval
 * @text Operand Modifier
 * @desc Value to be used in calculating the target variable.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command VariableJsBlock
 * @text Variable: JS Block
 * @desc Pick a variable ID and value to alter through JS.
 * Functions like RM2k3's Variable Pointers.
 *
 * @arg id:func
 * @text Variable ID
 * @type note
 * @desc This is the target variable to alter.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default "// Declare Variables\nlet varID = 1;\n\n// Perform Calculations\n\n// Return Variable ID\nreturn varID;"
 *
 * @arg operation:str
 * @text Operation Type
 * @type select
 * @option Set
 * @value =
 * @option Add
 * @value +
 * @option Sub
 * @value -
 * @option Mul
 * @value *
 * @option Div
 * @value /
 * @option Mod
 * @value %
 * @desc What operation do you wish to use for this Plugin Command?
 * @default =
 *
 * @arg operand:func
 * @text Operand Modifier
 * @type note
 * @desc Value to be used in calculating the target variable.
 * You may use JavaScript. ie: $gameVariables.value(1)
 * @default "// Declare Variables\nlet value = 0;\n\n// Perform Calculations\n\n// Return Variable ID\nreturn value;"
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
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
 * @param CoreEngine
 * @default Plugin Parameters
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param QoL:struct
 * @text Quality of Life Settings
 * @type struct<QoLSettings>
 * @desc Quality of Life settings for both developers and players.
 * @default {"PlayTest":"","NewGameBoot:eval":"false","ForceNoPlayTest:eval":"false","OpenConsole:eval":"true","F6key:eval":"true","F7key:eval":"true","NewGameCommonEvent:num":"0","BattleTest":"","BTestItems:eval":"true","BTestWeapons:eval":"true","BTestArmors:eval":"true","BTestAddedQuantity:num":"90","ShiftR_Toggle:eval":"true","ShiftT_Toggle:eval":"true","DigitGrouping":"","DigitGroupingStandardText:eval":"true","DigitGroupingExText:eval":"true","DigitGroupingDamageSprites:eval":"true","DigitGroupingGaugeSprites:eval":"true","DigitGroupingLocale:str":"en-US","PlayerBenefit":"","EncounterRateMinimum:num":"10","EscapeAlways:eval":"true","ImprovedAccuracySystem:eval":"true","AccuracyBoost:eval":"true","LevelUpFullHp:eval":"true","LevelUpFullMp:eval":"true","Pictures":"","AntiZoomPictures:eval":"true","PictureContainers":"","DetachBattlePictureContainer:eval":"false","DetachMapPictureContainer:eval":"false","Misc":"","AnimationMirrorOffset:eval":"false","AutoStretch:str":"default","FontShadows:eval":"false","FontSmoothing:eval":"true","FontWidthFix:eval":"true","KeyItemProtect:eval":"true","MapNameTextCode:eval":"true","ModernControls:eval":"true","MvAnimationRate:num":"4","NewGameCommonEventAll:num":"0","NoTileShadows:eval":"false","PixelateImageRendering:eval":"false","RequireFocus:eval":"false","ShortcutScripts:eval":"true","SmartEventCollisionPriority:eval":"true","SubfolderParse:eval":"true"}
 *
 * @param BattleSystem:str
 * @text Battle System
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option ETB: Energy Turn Battle (Req VisuMZ_2_BattleSystemETB)
 * @value etb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option PTB: Press Turn Battle (Req VisuMZ_2_BattleSystemPTB)
 * @value ptb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to use for your game.
 * Some battle systems REQUIRE their specific plugins!
 * @default database
 *
 * @param Color:struct
 * @text Color Settings
 * @type struct<Color>
 * @desc Change the colors used for in-game text.
 * @default {"BasicColors":"","ColorNormal:str":"0","ColorSystem:str":"16","ColorCrisis:str":"17","ColorDeath:str":"18","ColorGaugeBack:str":"19","ColorHPGauge1:str":"20","ColorHPGauge2:str":"21","ColorMPGauge1:str":"22","ColorMPGauge2:str":"23","ColorMPCost:str":"23","ColorPowerUp:str":"24","ColorPowerDown:str":"25","ColorCTGauge1:str":"26","ColorCTGauge2:str":"27","ColorTPGauge1:str":"28","ColorTPGauge2:str":"29","ColorTPCost:str":"29","ColorPending:str":"#2a847d","ColorExpGauge1:str":"30","ColorExpGauge2:str":"31","ColorMaxLvGauge1:str":"14","ColorMaxLvGauge2:str":"6","AlphaColors":"","OutlineColor:str":"rgba(0, 0, 0, 0.6)","DimColor1:str":"rgba(0, 0, 0, 0.6)","DimColor2:str":"rgba(0, 0, 0, 0)","ItemBackColor1:str":"rgba(32, 32, 32, 0.5)","ItemBackColor2:str":"rgba(0, 0, 0, 0.5)","ConditionalColors":"","ActorHPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If the actor is dead, return death color.\\n} else if (actor.isDead()) {\\n    return this.deathColor();\\n\\n// If the actor is dying, return crisis color.\\n} else if (actor.isDying()) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorMPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If MP rate is below 25%, return crisis color.\\n} else if (actor.mpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorTPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If TP rate is below 25%, return crisis color.\\n} else if (actor.tpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ParamChange:func":"\"// Set the variables used in this function.\\nlet change = arguments[0];\\n\\n// If a positive change, use power up color.\\nif (change > 0) {\\n    return this.powerUpColor();\\n\\n// If a negative change, use power down color.\\n} else if (change < 0) {\\n    return this.powerDownColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","DamageColor:func":"\"// Set the variables used in this function.\\nlet colorType = arguments[0];\\n\\n// Check the value of the color type\\n// and return an appropriate color.\\nswitch (colorType) {\\n\\n    case 0: // HP damage\\n        return \\\"#ffffff\\\";\\n\\n    case 1: // HP recover\\n        return \\\"#b9ffb5\\\";\\n\\n    case 2: // MP damage\\n        return \\\"#bb88bb\\\";\\n\\n    case 3: // MP recover\\n        return \\\"#80b0ff\\\";\\n\\n    default:\\n        return \\\"#808080\\\";\\n}\""}
 *
 * @param Gold:struct
 * @text Gold Settings
 * @type struct<Gold>
 * @desc Change up how gold operates and is displayed in-game.
 * @default {"GoldMax:num":"999999999","GoldFontSize:num":"24","GoldIcon:num":"314","GoldOverlap:str":"A Lot","ItemStyle:eval":"true"}
 *
 * @param ImgLoad:struct
 * @text Image Loading
 * @type struct<ImgLoad>
 * @desc Game images that will be loaded upon booting up the game.
 * Use this responsibly!!!
 * @default {"animations:arraystr":"[]","battlebacks1:arraystr":"[]","battlebacks2:arraystr":"[]","characters:arraystr":"[]","enemies:arraystr":"[]","faces:arraystr":"[]","parallaxes:arraystr":"[]","pictures:arraystr":"[]","sv_actors:arraystr":"[]","sv_enemies:arraystr":"[]","system:arraystr":"[\"Balloon\",\"IconSet\"]","tilesets:arraystr":"[]","titles1:arraystr":"[]","titles2:arraystr":"[]"}
 *
 * @param KeyboardInput:struct
 * @text Keyboard Input
 * @type struct<KeyboardInput>
 * @desc Settings for the game that utilize keyboard input.
 * @default {"Controls":"","WASD:eval":"false","DashToggleR:eval":"false","NameInput":"","EnableNameInput:eval":"true","DefaultMode:str":"keyboard","QwertyLayout:eval":"true","NameInputMessage:eval":"\"Type in this character's name.\\nPress \\\\c[5]ENTER\\\\c[0] when you're done.\\n\\n-or-\\n\\nPress \\\\c[5]arrow keys\\\\c[0]/\\\\c[5]TAB\\\\c[0] to switch\\nto manual character entry.\\n\\nPress \\\\c[5]ESC\\\\c[0]/\\\\c[5]TAB\\\\c[0] to use to keyboard.\"","NumberInput":"","EnableNumberInput:eval":"true","ButtonAssist":"","Keyboard:str":"Keyboard","Manual:str":"Manual"}
 *
 * @param MenuBg:struct
 * @text Menu Background Settings
 * @type struct<MenuBg>
 * @desc Change how menu backgrounds look for each scene.
 * @default {"Scene_Menu:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Item:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Skill:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Equip:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Status:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Options:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Save:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Load:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_GameEnd:struct":"{\"SnapshotOpacity:num\":\"128\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Shop:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Name:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Unlisted:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}"}
 *
 * @param ButtonAssist:struct
 * @text Menu Button Assist Window
 * @type struct<ButtonAssist>
 * @desc Settings pertaining to the Button Assist window found in in-game menus.
 * @default {"General":"","Enable:eval":"true","Location:str":"bottom","BgType:num":"0","Text":"","TextFmt:str":"%1:%2","MultiKeyFmt:str":"%1/%2","OkText:str":"Select","CancelText:str":"Back","SwitchActorText:str":"Switch Ally","Keys":"","KeyUnlisted:str":"\\}❪%1❫\\{","KeyUP:str":"^","KeyDOWN:str":"v","KeyLEFT:str":"<<","KeyRIGHT:str":">>","KeySHIFT:str":"\\}❪SHIFT❫\\{","KeyTAB:str":"\\}❪TAB❫\\{","KeyA:str":"A","KeyB:str":"B","KeyC:str":"C","KeyD:str":"D","KeyE:str":"E","KeyF:str":"F","KeyG:str":"G","KeyH:str":"H","KeyI:str":"I","KeyJ:str":"J","KeyK:str":"K","KeyL:str":"L","KeyM:str":"M","KeyN:str":"N","KeyO:str":"O","KeyP:str":"P","KeyQ:str":"Q","KeyR:str":"R","KeyS:str":"S","KeyT:str":"T","KeyU:str":"U","KeyV:str":"V","KeyW:str":"W","KeyX:str":"X","KeyY:str":"Y","KeyZ:str":"Z"}
 *
 * @param ControllerButtons:arraystruct
 * @text Controller Button Assist
 * @parent ButtonAssist:struct
 * @type struct<ControllerButtons>[]
 * @desc Make different icons appear for the Button Assist window when using different controllers.
 * @default []
 *
 * @param MenuLayout:struct
 * @text Menu Layout Settings
 * @type struct<MenuLayout>
 * @desc Change how menu layouts look for each scene.
 * @default {"Title:struct":"{\"TitleScreen\":\"\",\"DocumentTitleFmt:str\":\"%1: %2 - Version %3\",\"Subtitle:str\":\"Subtitle\",\"Version:str\":\"0.00\",\"drawGameTitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = $dataSystem.gameTitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 8;\\\\nbitmap.fontSize = 72;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameSubtitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4 + 72;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = Scene_Title.subtitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 6;\\\\nbitmap.fontSize = 48;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameVersion:func\":\"\\\"const bitmap = this._gameTitleSprite.bitmap;\\\\nconst x = 0;\\\\nconst y = Graphics.height - 20;\\\\nconst width = Math.round(Graphics.width / 4);\\\\nconst height = 20;\\\\nconst c1 = ColorManager.dimColor1();\\\\nconst c2 = ColorManager.dimColor2();\\\\nconst text = 'Version ' + Scene_Title.version;\\\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 3;\\\\nbitmap.fontSize = 16;\\\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\\\\\"left\\\\\\\");\\\"\",\"CommandRect:func\":\"\\\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\\\nconst rows = this.commandWindowRows();\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ButtonFadeSpeed:num\":\"4\"}","MainMenu:struct":"{\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const width = this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight();\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ItemMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaBottom() - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SkillMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SkillTypeWindow\":\"\",\"SkillTypeBgType:num\":\"0\",\"SkillTypeRect:func\":\"\\\"const rows = 3;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this._skillTypeWindow.height;\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._statusWindow.y + this._statusWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","EquipMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = this.statusWidth();\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = this.statusWidth();\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SlotWindow\":\"\",\"SlotBgType:num\":\"0\",\"SlotRect:func\":\"\\\"const commandWindowRect = this.commandWindowRect();\\\\nconst x = this.statusWidth();\\\\nconst y = commandWindowRect.y + commandWindowRect.height;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"return this.slotWindowRect();\\\"\"}","StatusMenu:struct":"{\"ProfileWindow\":\"\",\"ProfileBgType:num\":\"0\",\"ProfileRect:func\":\"\\\"const width = Graphics.boxWidth;\\\\nconst height = this.profileHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.statusParamsWindowRect().y - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusParamsWindow\":\"\",\"StatusParamsBgType:num\":\"0\",\"StatusParamsRect:func\":\"\\\"const width = this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusEquipWindow\":\"\",\"StatusEquipBgType:num\":\"0\",\"StatusEquipRect:func\":\"\\\"const width = Graphics.boxWidth - this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = this.statusParamsWidth();\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","OptionsMenu:struct":"{\"OptionsWindow\":\"\",\"OptionsBgType:num\":\"0\",\"OptionsRect:func\":\"\\\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\\\nconst width = 400;\\\\nconst height = this.calcWindowHeight(n, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SaveMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","LoadMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","GameEnd:struct":"{\"CommandList:arraystruct\":\"[\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"toTitle\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.toTitle;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"cancel\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.cancel;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.popScene();\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const rows = 2;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ShopMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const wx = 0;\\\\nconst wy = this.helpAreaTop();\\\\nconst ww = Graphics.boxWidth;\\\\nconst wh = this.helpAreaHeight();\\\\nreturn new Rectangle(wx, wy, ww, wh);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = this._goldWindow.x;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"DummyWindow\":\"\",\"DummyBgType:num\":\"0\",\"DummyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._commandWindow.y + this._commandWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"NumberWindow\":\"\",\"NumberBgType:num\":\"0\",\"NumberRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this._dummyWindow.y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"BuyWindow\":\"\",\"BuyBgType:num\":\"0\",\"BuyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SellWindow\":\"\",\"SellBgType:num\":\"0\",\"SellRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height =\\\\n    this.mainAreaHeight() -\\\\n    this._commandWindow.height -\\\\n    this._categoryWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","NameMenu:struct":"{\"EditWindow\":\"\",\"EditBgType:num\":\"0\",\"EditRect:func\":\"\\\"const rows = 9;\\\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\\\nconst padding = $gameSystem.windowPadding();\\\\nconst width = 600;\\\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"InputWindow\":\"\",\"InputBgType:num\":\"0\",\"InputRect:func\":\"\\\"const x = this._editWindow.x;\\\\nconst y = this._editWindow.y + this._editWindow.height;\\\\nconst rows = 9;\\\\nconst width = this._editWindow.width;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}"}
 *
 * @param Param:struct
 * @text Parameter Settings
 * @type struct<Param>
 * @desc Change up the limits of parameters and how they're calculated.
 * @default {"DisplayedParams:arraystr":"[\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","ExtDisplayedParams:arraystr":"[\"MaxHP\",\"MaxMP\",\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","BasicParameters":"","CrisisRate:num":"0.25","BasicParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet paramId = arguments[0];\\nlet base = this.paramBase(paramId);\\nlet plus = this.paramPlus(paramId);\\nlet paramRate = this.paramRate(paramId);\\nlet buffRate = this.paramBuffRate(paramId);\\nlet flatBonus = this.paramFlatBonus(paramId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\\n\\n// Determine the limits\\nconst maxValue = this.paramMax(paramId);\\nconst minValue = this.paramMin(paramId);\\n\\n// Final value\\nreturn Math.round(value.clamp(minValue, maxValue));\"","BasicParamCaps":"","BasicActorParamCaps":"","BasicActorParamMax0:str":"9999","BasicActorParamMax1:str":"9999","BasicActorParamMax2:str":"999","BasicActorParamMax3:str":"999","BasicActorParamMax4:str":"999","BasicActorParamMax5:str":"999","BasicActorParamMax6:str":"999","BasicActorParamMax7:str":"999","BasicEnemyParamCaps":"","BasicEnemyParamMax0:str":"999999","BasicEnemyParamMax1:str":"9999","BasicEnemyParamMax2:str":"999","BasicEnemyParamMax3:str":"999","BasicEnemyParamMax4:str":"999","BasicEnemyParamMax5:str":"999","BasicEnemyParamMax6:str":"999","BasicEnemyParamMax7:str":"999","XParameters":"","XParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet xparamId = arguments[0];\\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\\nlet plus = this.xparamPlus(xparamId);\\nlet paramRate = this.xparamRate(xparamId);\\nlet flatBonus = this.xparamFlatBonus(xparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","XParamVocab":"","XParamVocab0:str":"Hit","XParamVocab1:str":"Evasion","XParamVocab2:str":"Critical Rate","XParamVocab3:str":"Critical Evade","XParamVocab4:str":"Magic Evade","XParamVocab5:str":"Magic Reflect","XParamVocab6:str":"Counter","XParamVocab7:str":"HP Regen","XParamVocab8:str":"MP Regen","XParamVocab9:str":"TP Regen","SParameters":"","SParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet sparamId = arguments[0];\\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\\nlet plus = this.sparamPlus(sparamId);\\nlet paramRate = this.sparamRate(sparamId);\\nlet flatBonus = this.sparamFlatBonus(sparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","SParamVocab":"","SParamVocab0:str":"Aggro","SParamVocab1:str":"Guard","SParamVocab2:str":"Recovery","SParamVocab3:str":"Item Effect","SParamVocab4:str":"MP Cost","SParamVocab5:str":"TP Charge","SParamVocab6:str":"Physical DMG","SParamVocab7:str":"Magical DMG","SParamVocab8:str":"Floor DMG","SParamVocab9:str":"EXP Gain","Icons":"","DrawIcons:eval":"true","IconParam0:str":"84","IconParam1:str":"165","IconParam2:str":"76","IconParam3:str":"81","IconParam4:str":"101","IconParam5:str":"133","IconParam6:str":"140","IconParam7:str":"87","IconXParam0:str":"102","IconXParam1:str":"82","IconXParam2:str":"78","IconXParam3:str":"82","IconXParam4:str":"171","IconXParam5:str":"222","IconXParam6:str":"77","IconXParam7:str":"72","IconXParam8:str":"72","IconXParam9:str":"72","IconSParam0:str":"5","IconSParam1:str":"128","IconSParam2:str":"72","IconSParam3:str":"176","IconSParam4:str":"165","IconSParam5:str":"164","IconSParam6:str":"76","IconSParam7:str":"79","IconSParam8:str":"141","IconSParam9:str":"73"}
 *
 * @param CustomParam:arraystruct
 * @text Custom Parameters
 * @parent Param:struct
 * @type struct<CustomParam>[]
 * @desc Create custom parameters for your game!
 * These will appear in VisuStella MZ menus.
 * @default ["{\"ParamName:str\":\"Strength\",\"Abbreviation:str\":\"str\",\"Icon:num\":\"77\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.atk * 0.75) + (user.def * 0.25);\\\"\"}","{\"ParamName:str\":\"Dexterity\",\"Abbreviation:str\":\"dex\",\"Icon:num\":\"82\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.agi * 0.75) + (user.atk * 0.25);\\\"\"}","{\"ParamName:str\":\"Constitution\",\"Abbreviation:str\":\"con\",\"Icon:num\":\"81\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.def * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Intelligence\",\"Abbreviation:str\":\"int\",\"Icon:num\":\"79\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mat * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Wisdom\",\"Abbreviation:str\":\"wis\",\"Icon:num\":\"72\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mdf * 0.75) + (user.luk * 0.25);\\\"\"}","{\"ParamName:str\":\"Charisma\",\"Abbreviation:str\":\"cha\",\"Icon:num\":\"84\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.luk * 0.75) + (user.agi * 0.25);\\\"\"}"]
 *
 * @param ScreenResolution:struct
 * @text Screen Resolution Settings
 * @type struct<ScreenResolution>
 * @desc Alter various properties to make the game look better for varying screen resolutions.
 * @default {"Maps":"","AutoScrollLockX:eval":"true","AutoScrollLockY:eval":"true","DisplayLockX:num":"0.15625","DisplayLockY:num":"0.00000","Troops":"","RepositionActors:eval":"true","RepositionEnemies:eval":"true","RepositionEnemies130:eval":"false"}
 *
 * @param ScreenShake:struct
 * @text Screen Shake Settings
 * @type struct<ScreenShake>
 * @desc Get more screen shake effects into your game!
 * @default {"DefaultStyle:str":"random","originalJS:func":"\"// Calculation\\nthis.x += Math.round($gameScreen.shake());\"","randomJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","horzJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","vertJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\""}
 *
 * @param TitleCommandList:arraystruct
 * @text Title Command List
 * @type struct<Command>[]
 * @desc Window commands used by the title screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"newGame\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.newGame;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandNewGame();\\\"\"}","{\"Symbol:str\":\"continue\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.continue_;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return DataManager.isAnySavefileExists();\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandContinue();\\\"\"}","{\"Symbol:str\":\"options\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.options;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandOptions();\\\"\"}","{\"Symbol:str\":\"shutdown\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.gameEnd;\\\"\",\"ShowJS:func\":\"\\\"return Utils.isNwjs();\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager.exit();\\\\n\\\\n// Note!\\\\n// Do NOT use this command with mobile devices or\\\\n// browser games. All it does is cause the game to\\\\n// display a blank, black canvas which the player\\\\n// is unable to do anything with. It does NOT force\\\\n// close the browser tab nor the app.\\\"\"}"]
 *
 * @param TitlePicButtons:arraystruct
 * @text Title Picture Buttons
 * @type struct<TitlePictureButton>[]
 * @desc Buttons that can be inserted into the title screen.
 * Add new title buttons here.
 * @default []
 *
 * @param UI:struct
 * @text UI Settings
 * @type struct<UI>
 * @desc Change up various in-game UI aspects.
 * @default {"UIArea":"","FadeSpeed:num":"24","BoxMargin:num":"4","CommandWidth:num":"240","BottomHelp:eval":"false","RightMenus:eval":"true","ShowButtons:eval":"true","cancelShowButton:eval":"true","menuShowButton:eval":"true","pagedownShowButton:eval":"true","numberShowButton:eval":"true","ButtonHeight:num":"52","BottomButtons:eval":"false","SideButtons:eval":"true","MenuObjects":"","LvExpGauge:eval":"true","ParamArrow:str":"→","TextCodeSupport":"","TextCodeClassNames:eval":"true","TextCodeNicknames:eval":"true"}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc Adjust various in-game window settings.
 * @default {"WindowDefaults":"","EnableMasking:eval":"false","LineHeight:num":"36","ItemPadding:num":"8","BackOpacity:num":"192","TranslucentOpacity:num":"160","OpenSpeed:num":"32","ColSpacing:num":"8","RowSpacing:num":"4","ScrollBar":"","ShowScrollBar:eval":"true","BarThickness:num":"2","BarOffset:num":"+2","BarBodyColor:str":"0","OffBarColor:str":"7","OffBarOpacity:num":"128","SelectableItems":"","ShowItemBackground:eval":"true","ItemHeight:num":"8","DrawItemBackgroundJS:func":"\"const rect = arguments[0];\\nconst c1 = ColorManager.itemBackColor1();\\nconst c2 = ColorManager.itemBackColor2();\\nconst x = rect.x;\\nconst y = rect.y;\\nconst w = rect.width;\\nconst h = rect.height;\\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\\nthis.contentsBack.strokeRect(x, y, w, h, c1);\"","TextPopup":"","DurationPerChat:num":"1.5","MinDuration:num":"90","MaxDuration:num":"300"}
 *
 * @param jsQuickFunc:arraystruct
 * @text JS: Quick Functions
 * @type struct<jsQuickFunc>[]
 * @desc Create quick JavaScript functions available from the
 * global namespace. Use with caution and moderation!!!
 * @default ["{\"FunctionName:str\":\"Example\",\"CodeJS:json\":\"\\\"// Insert this as a function anywhere you can input code\\\\n// such as Script Calls or Conditional Branch Scripts.\\\\n\\\\n// Process Code\\\\nreturn 'Example';\\\"\"}","{\"FunctionName:str\":\"Bad  Code  Name\",\"CodeJS:json\":\"\\\"// If a function name has spaces in them, the spaces will\\\\n// be removed. \\\\\\\"Bad  Code  Name\\\\\\\" becomes \\\\\\\"BadCodeName\\\\\\\".\\\\n\\\\n// Process Code\\\\nOhNoItsBadCode()\\\\n\\\\n// If a function has bad code, a fail safe will catch the\\\\n// error and display it in the console.\\\"\"}","{\"FunctionName:str\":\"RandomNumber\",\"CodeJS:json\":\"\\\"// This generates a random number from 0 to itself.\\\\n// Example: RandomNumber(10)\\\\n\\\\n// Process Code\\\\nconst number = (arguments[0] || 0) + 1;\\\\nreturn Math.floor(number * Math.random());\\\"\"}","{\"FunctionName:str\":\"RandomBetween\",\"CodeJS:json\":\"\\\"// This generates a random number between two arguments.\\\\n// Example: RandomBetween(5, 10)\\\\n\\\\n// Process Code\\\\nlet min = Math.min(arguments[0] || 0, arguments[1] || 0);\\\\nlet max = Math.max(arguments[0] || 0, arguments[1] || 0);\\\\nreturn Math.floor(Math.random() * (max - min + 1) + min);\\\"\"}","{\"FunctionName:str\":\"RandomFrom\",\"CodeJS:json\":\"\\\"// Selects a number from the list of inserted numbers.\\\\n// Example: RandomFrom(5, 10, 15, 20)\\\\n\\\\n// Process Code\\\\nreturn arguments[Math.randomInt(arguments.length)];\\\"\"}"]
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
 * Quality of Life Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~QoLSettings:
 *
 * @param PlayTest
 * @text Play Test
 *
 * @param NewGameBoot:eval
 * @text New Game on Boot
 * @parent PlayTest
 * @type boolean
 * @on Start New Game
 * @off Keep Title Screen
 * @desc Automatically start a new game on Play Test?
 * Only enabled during Play Test.
 * @default false
 *
 * @param ForceNoPlayTest:eval
 * @text No Play Test Mode
 * @parent PlayTest
 * @type boolean
 * @on Cancel Play Test
 * @off Keep Play Test
 * @desc Force the game to be out of Play Test mode when play testing.
 * @default false
 *
 * @param OpenConsole:eval
 * @text Open Console on Boot
 * @parent PlayTest
 * @type boolean
 * @on Open
 * @off Don't Open
 * @desc Open the Debug Console upon booting up your game?
 * Only enabled during Play Test.
 * @default true
 *
 * @param F6key:eval
 * @text F6: Toggle Sound
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F6 Key Function: Turn on all sound to 100% or to 0%,
 * toggling between the two.
 * @default true
 *
 * @param F7key:eval
 * @text F7: Toggle Fast Mode
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F7 Key Function: Toggle fast mode.
 * @default true
 *
 * @param CtrlQuickLoad:eval
 * @text CTRL + n: Quick Load
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc CTRL + a number from 1 to 9 will yield a quick load of
 * that safe file. Does not count auto saves.
 * @default true
 *
 * @param NewGameCommonEvent:num
 * @text NewGame > CommonEvent
 * @parent PlayTest
 * @type common_event
 * @desc Runs a common event each time a new game during play test
 * session is started.
 * @default 0
 *
 * @param BattleTest
 * @text Battle Test
 *
 * @param BTestItems:eval
 * @text Add Item Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database item?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestWeapons:eval
 * @text Add Weapon Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database weapon?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestArmors:eval
 * @text Add Armor Type
 * @parent BattleTest
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add copies of each database armor?
 * Effective only during battle test.
 * @default true
 *
 * @param BTestAddedQuantity:num
 * @text Added Quantity
 * @parent BattleTest
 * @type number
 * @min 1
 * @desc Determines how many items are added during a battle test instead of the maximum amount.
 * @default 90
 *
 * @param ShiftR_Toggle:eval
 * @text Shift+R: Recover All
 * @parent BattleTest
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc For Play Test only! During battle, pressing SHIFT + R will refill the whole party's HP and MP and status.
 * @default true
 *
 * @param ShiftT_Toggle:eval
 * @text Shift+T: Full TP
 * @parent BattleTest
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc For Play Test only! During battle, pressing SHIFT + T will refill the whole party's TP.
 * @default true
 *
 * @param DigitGrouping
 * @text Digit Grouping
 *
 * @param DigitGroupingStandardText:eval
 * @text Standard Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * standard text inside windows?
 * @default true
 *
 * @param DigitGroupingExText:eval
 * @text Ex Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * ex text, written through drawTextEx (like messages)?
 * @default true
 *
 * @param DigitGroupingDamageSprites:eval
 * @text Damage Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * in-battle damage sprites?
 * @default true
 *
 * @param DigitGroupingGaugeSprites:eval
 * @text Gauge Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * visible gauge sprites such as HP, MP, and TP gauges?
 * @default true
 *
 * @param DigitGroupingLocale:str
 * @text Country/Locale
 * @parent DigitGrouping
 * @type combo
 * @option ar-SA
 * @option bn-BD
 * @option bn-IN
 * @option cs-CZ
 * @option da-DK
 * @option de-AT
 * @option de-CH
 * @option de-DE
 * @option el-GR
 * @option en-AU
 * @option en-CA
 * @option en-GB
 * @option en-IE
 * @option en-IN
 * @option en-NZ
 * @option en-US
 * @option en-ZA
 * @option es-AR
 * @option es-CL
 * @option es-CO
 * @option es-ES
 * @option es-MX
 * @option es-US
 * @option fi-FI
 * @option fr-BE
 * @option fr-CA
 * @option fr-CH
 * @option fr-FR
 * @option he-IL
 * @option hi-IN
 * @option hu-HU
 * @option id-ID
 * @option it-CH
 * @option it-IT
 * @option jp-JP
 * @option ko-KR
 * @option nl-BE
 * @option nl-NL
 * @option no-NO
 * @option pl-PL
 * @option pt-BR
 * @option pt-PT
 * @option ro-RO
 * @option ru-RU
 * @option sk-SK
 * @option sv-SE
 * @option ta-IN
 * @option ta-LK
 * @option th-TH
 * @option tr-TR
 * @option zh-CN
 * @option zh-HK
 * @option zh-TW
 * @desc Base the digit grouping on which country/locale?
 * @default en-US
 *
 * @param PlayerBenefit
 * @text Player Benefit
 *
 * @param EncounterRateMinimum:num
 * @text Encounter Rate Min
 * @parent PlayerBenefit
 * @min 1
 * @desc Minimum number of steps the player can take without any random encounters.
 * @default 10
 *
 * @param EscapeAlways:eval
 * @text Escape Always
 * @parent PlayerBenefit
 * @type boolean
 * @on Always
 * @off Default
 * @desc If the player wants to escape a battle, let them escape the battle with 100% chance.
 * @default true
 *
 * @param ImprovedAccuracySystem:eval
 * @text Accuracy Formula
 * @parent PlayerBenefit
 * @type boolean
 * @on Improve
 * @off Default
 * @desc Accuracy formula calculation change to
 * Skill Hit% * (User HIT - Target EVA) for better results.
 * @default true
 *
 * @param AccuracyBoost:eval
 * @text Accuracy Boost
 * @parent PlayerBenefit
 * @type boolean
 * @on Boost
 * @off Default
 * @desc Boost HIT and EVA rates in favor of the player.
 * @default true
 *
 * @param LevelUpFullHp:eval
 * @text Level Up -> Full HP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full HP when an actor levels up.
 * @default true
 *
 * @param LevelUpFullMp:eval
 * @text Level Up -> Full MP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full MP when an actor levels up.
 * @default true
 *
 * @param Pictures
 * @text Picture-Related
 *
 * @param AntiZoomPictures:eval
 * @text Anti-Zoom Pictures
 * @parent Pictures
 * @type boolean
 * @on Anti-Zoom
 * @off Normal
 * @desc If on, prevents pictures from being affected by zoom.
 * @default true
 *
 * @param PictureContainers
 * @text Picture Containers
 * @parent Pictures
 *
 * @param DetachBattlePictureContainer:eval
 * @text Detach in Battle
 * @parent PictureContainers
 * @type boolean
 * @on Detach
 * @off Normal
 * @desc If detached, picture container will be separated from
 * the spriteset while on the battle scene.
 * @default false
 *
 * @param DetachMapPictureContainer:eval
 * @text Detach in Map
 * @parent PictureContainers
 * @type boolean
 * @on Detach
 * @off Normal
 * @desc If detached, picture container will be separated from
 * the spriteset while on the map scene.
 * @default false
 *
 * @param Misc
 * @text Misc
 *
 * @param AnimationMirrorOffset:eval
 * @text Ani: Mirror Offset
 * @parent Misc
 * @type boolean
 * @on Mirror
 * @off Don't Mirror
 * @desc When animations are mirrored,
 * mirror their Offset X values, too.
 * @default false
 *
 * @param AutoStretch:str
 * @text Auto-Stretch
 * @parent Misc
 * @type select
 * @option Default
 * @value default
 * @option Stretch
 * @value stretch
 * @option Normal
 * @value normal
 * @desc Automatically stretch the game to fit the size of the client?
 * @default default
 *
 * @param FontShadows:eval
 * @text Font Shadows
 * @parent Misc
 * @type boolean
 * @on Shadows
 * @off Outlines
 * @desc If on, text uses shadows instead of outlines.
 * @default false
 *
 * @param FontSmoothing:eval
 * @text Font Smoothing
 * @parent Misc
 * @type boolean
 * @on Smooth
 * @off None
 * @desc If on, smoothes fonts shown in-game.
 * @default true
 *
 * @param FontWidthFix:eval
 * @text Font Width Fix
 * @parent Misc
 * @type boolean
 * @on Fix
 * @off Default
 * @desc Fixes the font width issue with instant display
 * non-monospaced fonts in the Message Window.
 * @default true
 *
 * @param KeyItemProtect:eval
 * @text Key Item Protection
 * @parent Misc
 * @type boolean
 * @on Unsellable
 * @off Sellable
 * @desc If on, prevents Key Items from being able to be sold and from being able to be consumed.
 * @default true
 *
 * @param MapNameTextCode:eval
 * @text Map Name Text Code
 * @parent Misc
 * @type boolean
 * @on Text Codes
 * @off Raw Text
 * @desc If on, map names will use text codes.
 * If off, only the raw map name will be used.
 * @default true
 *
 * @param ModernControls:eval
 * @text Modern Controls
 * @parent Misc
 * @type boolean
 * @on Enable
 * @off Default
 * @desc If on, allows usage of the Home/End buttons as well as other modern configs. Affects other VisuStella plugins.
 * @default true
 *
 * @param MvAnimationRate:num
 * @text MV Animation Rate
 * @parent Misc
 * @min 1
 * @max 10
 * @desc Adjusts the rate at which MV animations play.
 * Default: 4. Lower for faster. Higher for slower.
 * @default 4
 *
 * @param NewGameCommonEventAll:num
 * @text NewGame > CommonEvent
 * @parent Misc
 * @type common_event
 * @desc Runs a common event each time a new game during any session is started.
 * @default 0
 *
 * @param NoTileShadows:eval
 * @text No Tile Shadows
 * @parent Misc
 * @type boolean
 * @on Disable Tile Shadows
 * @off Default
 * @desc Removes tile shadows from being displayed in-game.
 * @default false
 *
 * @param PixelateImageRendering:eval
 * @text Pixel Image Rendering
 * @parent Misc
 * @type boolean
 * @on Pixelate
 * @off Smooth
 * @desc If on, pixelates the image rendering (for pixel games).
 * @default false
 *
 * @param RequireFocus:eval
 * @text Require Focus?
 * @parent Misc
 * @type boolean
 * @on Require
 * @off No Requirement
 * @desc Requires the game to be focused? If the game isn't
 * focused, it will pause if it's not the active window.
 * @default true
 *
 * @param ShortcutScripts:eval
 * @text Shortcut Scripts
 * @parent Misc
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables shortcut-based scripts.
 * View the helpfile for more information.
 * @default true
 *
 * @param SmartEventCollisionPriority:eval
 * @text Smart Event Collision
 * @parent Misc
 * @type boolean
 * @on Only Same Level
 * @off Default
 * @desc Makes events only able to collide with one another if they're 'Same as characters' priority.
 * @default true
 *
 * @param SubfolderParse:eval
 * @text Subfolder Name Purge
 * @parent Misc
 * @type boolean
 * @on Purge Subfolders Names
 * @off Don't Purge Name
 * @desc Purge subfolder name from Plugin Parameters when reading
 * data to let Plugin Commands work properly.
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Color:
 *
 * @param BasicColors
 * @text Basic Colors
 *
 * @param ColorNormal:str
 * @text Normal
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorSystem:str
 * @text System
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 16
 *
 * @param ColorCrisis:str
 * @text Crisis
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 17
 *
 * @param ColorDeath:str
 * @text Death
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 18
 *
 * @param ColorGaugeBack:str
 * @text Gauge Back
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param ColorHPGauge1:str
 * @text HP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 20
 *
 * @param ColorHPGauge2:str
 * @text HP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 21
 *
 * @param ColorMPGauge1:str
 * @text MP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 22
 *
 * @param ColorMPGauge2:str
 * @text MP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorMPCost:str
 * @text MP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorPowerUp:str
 * @text Power Up
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorPowerDown:str
 * @text Power Down
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 25
 *
 * @param ColorCTGauge1:str
 * @text CT Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 26
 *
 * @param ColorCTGauge2:str
 * @text CT Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param ColorTPGauge1:str
 * @text TP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 28
 *
 * @param ColorTPGauge2:str
 * @text TP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorTPCost:str
 * @text TP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorPending:str
 * @text Pending Color
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #2a847d
 *
 * @param ColorExpGauge1:str
 * @text EXP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 30
 *
 * @param ColorExpGauge2:str
 * @text EXP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 31
 *
 * @param ColorMaxLvGauge1:str
 * @text MaxLv Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 14
 *
 * @param ColorMaxLvGauge2:str
 * @text MaxLv Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 6
 *
 * @param AlphaColors
 * @text Alpha Colors
 *
 * @param OutlineColor:str
 * @text Window Font Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param OutlineColorGauge:str
 * @text Gauge Number Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 1.0)
 *
 * @param DimColor1:str
 * @text Dim Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param DimColor2:str
 * @text Dim Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0)
 *
 * @param ItemBackColor1:str
 * @text Item Back Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(32, 32, 32, 0.5)
 *
 * @param ItemBackColor2:str
 * @text Item Back Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.5)
 *
 * @param ConditionalColors
 * @text Conditional Colors
 *
 * @param ActorHPColor:func
 * @text JS: Actor HP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what HP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If the actor is dead, return death color.\n} else if (actor.isDead()) {\n    return this.deathColor();\n\n// If the actor is dying, return crisis color.\n} else if (actor.isDying()) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorMPColor:func
 * @text JS: Actor MP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what MP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If MP rate is below 25%, return crisis color.\n} else if (actor.mpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorTPColor:func
 * @text JS: Actor TP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what TP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If TP rate is below 25%, return crisis color.\n} else if (actor.tpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ParamChange:func
 * @text JS: Parameter Change
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining whatcolor to use for parameter changes.
 * @default "// Set the variables used in this function.\nlet change = arguments[0];\n\n// If a positive change, use power up color.\nif (change > 0) {\n    return this.powerUpColor();\n\n// If a negative change, use power down color.\n} else if (change < 0) {\n    return this.powerDownColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param DamageColor:func
 * @text JS: Damage Colors
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what color to use for damage types.
 * @default "// Set the variables used in this function.\nlet colorType = arguments[0];\n\n// Check the value of the color type\n// and return an appropriate color.\nswitch (colorType) {\n\n    case 0: // HP damage\n        return \"#ffffff\";\n\n    case 1: // HP recover\n        return \"#b9ffb5\";\n\n    case 2: // MP damage\n        return \"#bb88bb\";\n\n    case 3: // MP recover\n        return \"#80b0ff\";\n\n    default:\n        return \"#808080\";\n}"
 */
/* ----------------------------------------------------------------------------
 * Gold Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gold:
 *
 * @param GoldMax:num
 * @text Gold Max
 * @type num
 * @min 1
 * @desc Maximum amount of Gold the party can hold.
 * Default 99999999
 * @default 99999999
 *
 * @param GoldFontSize:num
 * @text Gold Font Size
 * @type number
 * @min 1
 * @desc Font size used for displaying Gold inside Gold Windows.
 * Default: 26
 * @default 24
 *
 * @param GoldIcon:num
 * @text Gold Icon
 * @desc Icon used to represent Gold.
 * Use 0 for no icon.
 * @default 314
 *
 * @param GoldOverlap:str
 * @text Gold Overlap
 * @desc Text used too much Gold to fit in the window.
 * @default A Lot
 *
 * @param ItemStyle:eval
 * @text Item Style
 * @type boolean
 * @on Enable
 * @off Normal
 * @desc Draw gold in the item style?
 * ie: Icon, Label, Value
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Image Loading Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ImgLoad:
 *
 * @param animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default ["Balloon","IconSet"]
 *
 * @param tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Keyboard Input Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~KeyboardInput:
 *
 * @param Controls
 *
 * @param WASD:eval
 * @text WASD Movement
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables WASD movement for your game project.
 * Moves the W page down button to E.
 * @default false
 *
 * @param DashToggleR:eval
 * @text R Button: Dash Toggle
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables R button as an Always Dash option toggle.
 * @default false
 *
 * @param NameInput
 * @text Name Input
 *
 * @param EnableNameInput:eval
 * @text Enable?
 * @parent NameInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for name entry.
 * Only tested with English keyboards.
 * @default true
 *
 * @param DefaultMode:str
 * @text Default Mode
 * @parent NameInput
 * @type select
 * @option Default - Uses Arrow Keys to select letters.
 * @value default
 * @option Keyboard - Uses Keyboard to type in letters.
 * @value keyboard
 * @desc Select default mode when entering the scene.
 * @default keyboard
 *
 * @param QwertyLayout:eval
 * @text QWERTY Layout
 * @parent NameInput
 * @type boolean
 * @on QWERTY Layout
 * @off ABCDEF Layout
 * @desc Uses the QWERTY layout for manual entry.
 * @default true
 *
 * @param NameInputMessage:eval
 * @text Keyboard Message
 * @parent NameInput
 * @type note
 * @desc The message displayed when allowing keyboard entry.
 * You may use text codes here.
 * @default "Type in this character's name.\nPress \\c[5]ENTER\\c[0] when you're done.\n\n-or-\n\nPress \\c[5]arrow keys\\c[0]/\\c[5]TAB\\c[0] to switch\nto manual character entry.\n\nPress \\c[5]ESC\\c[0]/\\c[5]TAB\\c[0] to use to keyboard."
 *
 * @param BannedWords:arraystr
 * @text Banned Words
 * @parent NameInput
 * @type string[]
 * @desc Players cannot use these words for names.
 * These include words inside the names.
 * @default []
 *
 * @param NumberInput
 * @text Number Input
 *
 * @param EnableNumberInput:eval
 * @text Enable?
 * @parent NumberInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for number entry.
 * Only tested with English keyboards.
 * @default true
 *
 * @param ButtonAssist
 * @text Button Assist
 *
 * @param Finish:str
 * @text Finish Entry
 * @parent ButtonAssist
 * @desc Text used to describe finish entry.
 * @default Finish
 *
 * @param PageChange:str
 * @text Page Change
 * @parent ButtonAssist
 * @desc Text used to describe character page changing.
 * @default Page
 *
 * @param Keyboard:str
 * @text Switch To Keyboard
 * @parent ButtonAssist
 * @desc Text used to describe the keyboard switch.
 * @default Keyboard
 *
 * @param Manual:str
 * @text Switch To Manual
 * @parent ButtonAssist
 * @desc Text used to describe the manual entry switch.
 * @default Manual
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuBg:
 *
 * @param BlurStrength:num
 * @text Blur Strength
 * @desc Strength used for menu background snapshots.
 * Default: 8. Higher is stronger. Lower is weaker.
 * @default 8
 *
 * @param Scene_Menu:struct
 * @text Scene_Menu
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Item:struct
 * @text Scene_Item
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Skill:struct
 * @text Scene_Skill
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Equip:struct
 * @text Scene_Equip
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Status:struct
 * @text Scene_Status
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Options:struct
 * @text Scene_Options
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Save:struct
 * @text Scene_Save
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Load:struct
 * @text Scene_Load
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_GameEnd:struct
 * @text Scene_GameEnd
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"128","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Shop:struct
 * @text Scene_Shop
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Name:struct
 * @text Scene_Name
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Unlisted:struct
 * @text Scene_Unlisted
 * @type struct<BgSettings>
 * @desc The individual background settings for any scenes that aren't listed here.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
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
 * @desc Filename used for the bottom background image.
 * Leave empty if you don't wish to use one.
 * @default
 *
 * @param BgFilename2:str
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @desc Filename used for the upper background image.
 * Leave empty if you don't wish to use one.
 * @default
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Button Assist Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ButtonAssist:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Enable the Menu Button Assist Window.
 * @default true
 *
 * @param Location:str
 * @text Location
 * @parent General
 * @type select
 * @option Top of Screen
 * @value top
 * @option Bottom of Screen
 * @value bottom
 * @desc Determine the location of the Button Assist Window.
 * Requires Plugin Parameters => UI => Side Buttons ON.
 * @default bottom
 *
 * @param BgType:num
 * @text Background Type
 * @parent General
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
 * @param SplitEscape:eval
 * @text Split "Escape"
 * @parent General
 * @type boolean
 * @on Split
 * @off Don't
 * @desc "Split" makes separate instances of "Cancel" and "Menu".
 * "Don't" will consolidate both into "Escape".
 * @default false
 *
 * @param Text
 *
 * @param TextFmt:str
 * @text Text Format
 * @parent Text
 * @desc Format on how the buttons are displayed.
 * Text codes allowed. %1 - Key, %2 - Text
 * @default %1:%2
 *
 * @param MultiKeyFmt:str
 * @text Multi-Key Format
 * @parent Text
 * @desc Format for actions with multiple keys.
 * Text codes allowed. %1 - Key 1, %2 - Key 2
 * @default %1/%2
 *
 * @param OkText:str
 * @text OK Text
 * @parent Text
 * @desc Default text used to display OK Key Action.
 * Text codes allowed.
 * @default Select
 *
 * @param CancelText:str
 * @text Cancel Text
 * @parent Text
 * @desc Default text used to display Cancel Key Action.
 * Text codes allowed.
 * @default Back
 *
 * @param SwitchActorText:str
 * @text Switch Actor Text
 * @parent Text
 * @desc Default text used to display Switch Actor Action.
 * Text codes allowed.
 * @default Switch Ally
 *
 * @param Keys
 *
 * @param KeyUnlisted:str
 * @text Key: Unlisted Format
 * @parent Keys
 * @desc If a key is not listed below, use this format.
 * Text codes allowed. %1 - Key
 * @default \}❪%1❫\{
 *
 * @param KeyUP:str
 * @text Key: Up
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default ^
 *
 * @param KeyDOWN:str
 * @text Key: Down
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default v
 *
 * @param KeyLEFT:str
 * @text Key: Left
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default <<
 *
 * @param KeyRIGHT:str
 * @text Key: Right
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default >>
 *
 * @param KeySHIFT:str
 * @text Key: Shift
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪SHIFT❫\{
 *
 * @param KeyTAB:str
 * @text Key: Tab
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪TAB❫\{
 *
 * @param KeyA:str
 * @text Key: A
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default A
 *
 * @param KeyB:str
 * @text Key: B
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default B
 *
 * @param KeyC:str
 * @text Key: C
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default C
 *
 * @param KeyD:str
 * @text Key: D
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default D
 *
 * @param KeyE:str
 * @text Key: E
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default E
 *
 * @param KeyF:str
 * @text Key: F
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default F
 *
 * @param KeyG:str
 * @text Key: G
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default G
 *
 * @param KeyH:str
 * @text Key: H
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default H
 *
 * @param KeyI:str
 * @text Key: I
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default I
 *
 * @param KeyJ:str
 * @text Key: J
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default J
 *
 * @param KeyK:str
 * @text Key: K
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default K
 *
 * @param KeyL:str
 * @text Key: L
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default L
 *
 * @param KeyM:str
 * @text Key: M
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default M
 *
 * @param KeyN:str
 * @text Key: N
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default N
 *
 * @param KeyO:str
 * @text Key: O
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default O
 *
 * @param KeyP:str
 * @text Key: P
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default P
 *
 * @param KeyQ:str
 * @text Key: Q
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Q
 *
 * @param KeyR:str
 * @text Key: R
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default R
 *
 * @param KeyS:str
 * @text Key: S
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default S
 *
 * @param KeyT:str
 * @text Key: T
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default T
 *
 * @param KeyU:str
 * @text Key: U
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default U
 *
 * @param KeyV:str
 * @text Key: V
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default V
 *
 * @param KeyW:str
 * @text Key: W
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default W
 *
 * @param KeyX:str
 * @text Key: X
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default X
 *
 * @param KeyY:str
 * @text Key: Y
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Y
 *
 * @param KeyZ:str
 * @text Key: Z
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Z
 *
 */
/* ----------------------------------------------------------------------------
 * Controller Buttons Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ControllerButtons:
 *
 * @param ID
 * @text ID Information
 *
 * @param Name:str
 * @text Controller ID Name
 * @parent ID
 * @desc Exact string used for this controller ID. Plugin Command
 * "Debug: Current Controller ID" for ID help.
 * @default Untitled
 *
 * @param Match:str
 * @text Similarity Match
 * @parent ID
 * @desc Similar text used for this controller ID. Plugin Command
 * "Debug: Current Controller ID" for ID help.
 * @default Untitled
 *
 * @param Directions
 *
 * @param up:str
 * @text Up
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param left:str
 * @text Left
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param right:str
 * @text Right
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param down:str
 * @text Down
 * @parent Directions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param Actions
 *
 * @param ok:str
 * @text OK
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param cancel:str
 * @text Cancel
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param menu:str
 * @text Menu
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param shift:str
 * @text Shift
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param pageup:str
 * @text Page Up
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 * @param pagedown:str
 * @text Page Down
 * @parent Actions
 * @desc How this button is shown in-game.
 * Text codes allowed.
 * @default
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Layout Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuLayout:
 *
 * @param Title:struct
 * @text Scene_Title
 * @parent SceneSettings
 * @type struct<Title>
 * @desc Various options on adjusting the Title Scene.
 * @default {"TitleScreen":"","DocumentTitleFmt:str":"%1: %2 - Version %3","Subtitle:str":"Subtitle","Version:str":"0.00","drawGameTitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = $dataSystem.gameTitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 8;\\nbitmap.fontSize = 72;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameSubtitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4 + 72;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = Scene_Title.subtitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 6;\\nbitmap.fontSize = 48;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameVersion:func":"\"const bitmap = this._gameTitleSprite.bitmap;\\nconst x = 0;\\nconst y = Graphics.height - 20;\\nconst width = Math.round(Graphics.width / 4);\\nconst height = 20;\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\nconst text = 'Version ' + Scene_Title.version;\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 3;\\nbitmap.fontSize = 16;\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\"left\\\");\"","CommandRect:func":"\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\nconst rows = this.commandWindowRows();\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\nreturn new Rectangle(x, y, width, height);\"","ButtonFadeSpeed:num":"4"}
 *
 * @param MainMenu:struct
 * @text Scene_Menu
 * @parent SceneSettings
 * @type struct<MainMenu>
 * @desc Various options on adjusting the Main Menu Scene.
 * @default {"CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const width = this.mainCommandWidth();\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this.mainAreaHeight();\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ItemMenu:struct
 * @text Scene_Item
 * @parent SceneSettings
 * @type struct<ItemMenu>
 * @desc Various options on adjusting the Item Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaBottom() - y;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SkillMenu:struct
 * @text Scene_Skill
 * @parent SceneSettings
 * @type struct<SkillMenu>
 * @desc Various options on adjusting the Skill Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","SkillTypeWindow":"","SkillTypeBgType:num":"0","SkillTypeRect:func":"\"const rows = 3;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this._skillTypeWindow.height;\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._statusWindow.y + this._statusWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param EquipMenu:struct
 * @text Scene_Equip
 * @parent SceneSettings
 * @type struct<EquipMenu>
 * @desc Various options on adjusting the Equip Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = this.statusWidth();\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = this.statusWidth();\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SlotWindow":"","SlotBgType:num":"0","SlotRect:func":"\"const commandWindowRect = this.commandWindowRect();\\nconst x = this.statusWidth();\\nconst y = commandWindowRect.y + commandWindowRect.height;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"return this.slotWindowRect();\""}
 *
 * @param StatusMenu:struct
 * @text Scene_Status
 * @parent SceneSettings
 * @type struct<StatusMenu>
 * @desc Various options on adjusting the Status Menu Scene.
 * @default {"ProfileWindow":"","ProfileBgType:num":"0","ProfileRect:func":"\"const width = Graphics.boxWidth;\\nconst height = this.profileHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.statusParamsWindowRect().y - y;\\nreturn new Rectangle(x, y, width, height);\"","StatusParamsWindow":"","StatusParamsBgType:num":"0","StatusParamsRect:func":"\"const width = this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusEquipWindow":"","StatusEquipBgType:num":"0","StatusEquipRect:func":"\"const width = Graphics.boxWidth - this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = this.statusParamsWidth();\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param OptionsMenu:struct
 * @text Scene_Options
 * @parent SceneSettings
 * @type struct<OptionsMenu>
 * @desc Various options on adjusting the Options Menu Scene.
 * @default {"OptionsWindow":"","OptionsBgType:num":"0","OptionsRect:func":"\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\nconst width = 400;\\nconst height = this.calcWindowHeight(n, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SaveMenu:struct
 * @text Scene_Save
 * @parent SceneSettings
 * @type struct<SaveMenu>
 * @desc Various options on adjusting the Save Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param LoadMenu:struct
 * @text Scene_Load
 * @parent SceneSettings
 * @type struct<LoadMenu>
 * @desc Various options on adjusting the Load Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param GameEnd:struct
 * @text Scene_GameEnd
 * @parent SceneSettings
 * @type struct<GameEnd>
 * @desc Various options on adjusting the Game End Scene.
 * @default {"CommandList:arraystruct":"[\"{\\\"Symbol:str\\\":\\\"toTitle\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.toTitle;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\"\\\"}\",\"{\\\"Symbol:str\\\":\\\"cancel\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.cancel;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.popScene();\\\\\\\"\\\"}\"]","CommandBgType:num":"0","CommandRect:func":"\"const rows = 2;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ShopMenu:struct
 * @text Scene_Shop
 * @parent SceneSettings
 * @type struct<ShopMenu>
 * @desc Various options on adjusting the Shop Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const wx = 0;\\nconst wy = this.helpAreaTop();\\nconst ww = Graphics.boxWidth;\\nconst wh = this.helpAreaHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = this._goldWindow.x;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","DummyWindow":"","DummyBgType:num":"0","DummyRect:func":"\"const x = 0;\\nconst y = this._commandWindow.y + this._commandWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","NumberWindow":"","NumberBgType:num":"0","NumberRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = this.statusWidth();\\nconst height = this._dummyWindow.height;\\nconst x = Graphics.boxWidth - width;\\nconst y = this._dummyWindow.y;\\nreturn new Rectangle(x, y, width, height);\"","BuyWindow":"","BuyBgType:num":"0","BuyRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SellWindow":"","SellBgType:num":"0","SellRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height =\\n    this.mainAreaHeight() -\\n    this._commandWindow.height -\\n    this._categoryWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param NameMenu:struct
 * @text Scene_Name
 * @parent SceneSettings
 * @type struct<NameMenu>
 * @desc Various options on adjusting the Actor Rename Scene.
 * @default {"EditWindow":"","EditBgType:num":"0","EditRect:func":"\"const rows = 9;\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\nconst padding = $gameSystem.windowPadding();\\nconst width = 600;\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","InputWindow":"","InputBgType:num":"0","InputRect:func":"\"const x = this._editWindow.x;\\nconst y = this._editWindow.y + this._editWindow.height;\\nconst rows = 9;\\nconst width = this._editWindow.width;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\""}
 *
 */
/* ----------------------------------------------------------------------------
 * Main Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MainMenu:
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.mainCommandWidth();\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
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
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this.mainAreaHeight();\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Item Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ItemMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
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
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaBottom() - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
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
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SkillMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param SkillTypeBgType:num
 * @text Background Type
 * @parent SkillTypeWindow
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
 * @param SkillTypeRect:func
 * @text JS: X, Y, W, H
 * @parent SkillTypeWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 3;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this._skillTypeWindow.height;\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._statusWindow.y + this._statusWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._statusWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
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
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Equip Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~EquipMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = this.statusWidth();\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this.statusWidth();\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SlotWindow
 * @text Slot Window
 *
 * @param SlotBgType:num
 * @text Background Type
 * @parent SlotWindow
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
 * @param SlotRect:func
 * @text JS: X, Y, W, H
 * @parent SlotWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const commandWindowRect = this.commandWindowRect();\nconst x = this.statusWidth();\nconst y = commandWindowRect.y + commandWindowRect.height;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.mainAreaHeight() - commandWindowRect.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "return this.slotWindowRect();"
 *
 */
/* ----------------------------------------------------------------------------
 * Status Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~StatusMenu:
 *
 * @param ProfileWindow
 * @text Profile Window
 *
 * @param ProfileBgType:num
 * @text Background Type
 * @parent ProfileWindow
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
 * @param ProfileRect:func
 * @text JS: X, Y, W, H
 * @parent ProfileWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth;\nconst height = this.profileHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.statusParamsWindowRect().y - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusParamsWindow
 * @text Parameters Window
 *
 * @param StatusParamsBgType:num
 * @text Background Type
 * @parent StatusParamsWindow
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
 * @param StatusParamsRect:func
 * @text JS: X, Y, W, H
 * @parent StatusParamsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusEquipWindow
 * @text Equipment Window
 *
 * @param StatusEquipBgType:num
 * @text Background Type
 * @parent StatusEquipWindow
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
 * @param StatusEquipRect:func
 * @text JS: X, Y, W, H
 * @parent StatusEquipWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = this.statusParamsWidth();\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Options Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~OptionsMenu:
 *
 * @param OptionsWindow
 * @text Options Window
 *
 * @param OptionsBgType:num
 * @text Background Type
 * @parent OptionsWindow
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
 * @param OptionsRect:func
 * @text JS: X, Y, W, H
 * @parent OptionsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\nconst width = 400;\nconst height = this.calcWindowHeight(n, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Save Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SaveMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
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
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Load Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~LoadMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
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
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Game End Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameEnd:
 *
 * @param CommandList:arraystruct
 * @text Command Window List
 * @type struct<Command>[]
 * @desc Window commands used by the Game End screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"toTitle\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.toTitle;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandToTitle();\\\"\"}","{\"Symbol:str\":\"cancel\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.cancel;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.popScene();\\\"\"}"]
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandList:arraystruct
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandList:arraystruct
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 2;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Shop Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShopMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this.helpAreaTop();\nconst ww = Graphics.boxWidth;\nconst wh = this.helpAreaHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
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
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = this._goldWindow.x;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param DummyWindow
 * @text Dummy Window
 *
 * @param DummyBgType:num
 * @text Background Type
 * @parent DummyWindow
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
 * @param DummyRect:func
 * @text JS: X, Y, W, H
 * @parent DummyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._commandWindow.y + this._commandWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._commandWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param NumberWindow
 * @text Number Window
 *
 * @param NumberBgType:num
 * @text Background Type
 * @parent NumberWindow
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
 * @param NumberRect:func
 * @text JS: X, Y, W, H
 * @parent NumberWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusWidth();\nconst height = this._dummyWindow.height;\nconst x = Graphics.boxWidth - width;\nconst y = this._dummyWindow.y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param BuyWindow
 * @text Buy Window
 *
 * @param BuyBgType:num
 * @text Background Type
 * @parent BuyWindow
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
 * @param BuyRect:func
 * @text JS: X, Y, W, H
 * @parent BuyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
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
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SellWindow
 * @text Sell Window
 *
 * @param SellBgType:num
 * @text Background Type
 * @parent SellWindow
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
 * @param SellRect:func
 * @text JS: X, Y, W, H
 * @parent SellWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height =\n    this.mainAreaHeight() -\n    this._commandWindow.height -\n    this._categoryWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Name Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~NameMenu:
 *
 * @param EditWindow
 * @text Edit Window
 *
 * @param EditBgType:num
 * @text Background Type
 * @parent EditWindow
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
 * @param EditRect:func
 * @text JS: X, Y, W, H
 * @parent EditWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 9;\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\nconst padding = $gameSystem.windowPadding();\nconst width = 600;\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param InputWindow
 * @text Input Window
 *
 * @param InputBgType:num
 * @text Background Type
 * @parent InputWindow
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
 * @param InputRect:func
 * @text JS: X, Y, W, H
 * @parent InputWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this._editWindow.x;\nconst y = this._editWindow.y + this._editWindow.height;\nconst rows = 9;\nconst width = this._editWindow.width;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Title Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Title:
 *
 * @param TitleScreen
 * @text Title Screen
 *
 * @param DocumentTitleFmt:str
 * @text Document Title Format
 * @parent TitleScreen
 * @desc Format to display text in document title.
 * %1 - Main Title, %2 - Subtitle, %3 - Version
 * @default %1: %2 - Version %3
 *
 * @param Subtitle:str
 * @text Subtitle
 * @parent TitleScreen
 * @desc Subtitle to be displayed under the title name.
 * @default Subtitle
 *
 * @param Version:str
 * @text Version
 * @parent TitleScreen
 * @desc Version to be display in the title screen corner.
 * @default 0.00
 *
 * @param drawGameTitle:func
 * @text JS: Draw Title
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game title.
 * @default "const x = 20;\nconst y = Graphics.height / 4;\nconst maxWidth = Graphics.width - x * 2;\nconst text = $dataSystem.gameTitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 8;\nbitmap.fontSize = 72;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameSubtitle:func
 * @text JS: Draw Subtitle
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game subtitle.
 * @default "const x = 20;\nconst y = Graphics.height / 4 + 72;\nconst maxWidth = Graphics.width - x * 2;\nconst text = Scene_Title.subtitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 6;\nbitmap.fontSize = 48;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameVersion:func
 * @text JS: Draw Version
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game version.
 * @default "const bitmap = this._gameTitleSprite.bitmap;\nconst x = 0;\nconst y = Graphics.height - 20;\nconst width = Math.round(Graphics.width / 4);\nconst height = 20;\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\nconst text = 'Version ' + Scene_Title.version;\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 3;\nbitmap.fontSize = 16;\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \"left\");"
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent TitleScreen
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const offsetX = $dataSystem.titleCommandWindow.offsetX;\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\nconst rows = this.commandWindowRows();\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\nconst y = Graphics.boxHeight - height - 96 + offsetY;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ButtonFadeSpeed:num
 * @text Button Fade Speed
 * @parent TitleScreen
 * @type number
 * @min 1
 * @max 255
 * @desc Speed at which the buttons fade in at (1-255).
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Param:
 *
 * @param DisplayedParams:arraystr
 * @text Displayed Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc A list of the parameters that will be displayed in-game.
 * @default ["ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param ExtDisplayedParams:arraystr
 * @text Extended Parameters
 * @parent DisplayedParams:arraystr
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc The list shown in extended scenes (for other VisuStella plugins).
 * @default ["MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param BasicParameters
 * @text Basic Parameters
 *
 * @param ShowActorLevel:eval
 * @text Show Actor Level?
 * @parent BasicParameters
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the actor level when displaying actors?
 * Affects for most windows in-game.
 * @default true
 *
 * @param CrisisRate:num
 * @text HP Crisis Rate
 * @parent BasicParameters
 * @desc HP Ratio at which a battler can be considered in crisis mode.
 * @default 0.25
 *
 * @param BasicParameterFormula:func
 * @text JS: Formula
 * @parent BasicParameters
 * @type note
 * @desc Formula used to determine the total value all 8 basic parameters: MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 * @default "// Determine the variables used in this calculation.\nlet paramId = arguments[0];\nlet base = this.paramBase(paramId);\nlet plus = this.paramPlus(paramId);\nlet paramRate = this.paramRate(paramId);\nlet buffRate = this.paramBuffRate(paramId);\nlet flatBonus = this.paramFlatBonus(paramId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\n\n// Determine the limits\nconst maxValue = this.paramMax(paramId);\nconst minValue = this.paramMin(paramId);\n\n// Final value\nreturn Math.round(value.clamp(minValue, maxValue));"
 *
 * @param BasicParamCaps
 * @text Parameter Caps
 * @parent BasicParameters
 *
 * @param BasicActorParamCaps
 * @text Actors
 * @parent BasicParamCaps
 *
 * @param BasicActorParamMax0:str
 * @text MaxHP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax1:str
 * @text MaxMP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax2:str
 * @text ATK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax3:str
 * @text DEF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax4:str
 * @text MAT Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax5:str
 * @text MDF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax6:str
 * @text AGI Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax7:str
 * @text LUK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamCaps
 * @text Enemies
 * @parent BasicParamCaps
 *
 * @param BasicEnemyParamMax0:str
 * @text MaxHP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999999
 *
 * @param BasicEnemyParamMax1:str
 * @text MaxMP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicEnemyParamMax2:str
 * @text ATK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax3:str
 * @text DEF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax4:str
 * @text MAT Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax5:str
 * @text MDF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax6:str
 * @text AGI Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax7:str
 * @text LUK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param XParameters
 * @text X Parameters
 *
 * @param XParameterFormula:func
 * @text JS: Formula
 * @parent XParameters
 * @type note
 * @desc Formula used to determine the total value all 10 X parameters: HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 * @default "// Determine the variables used in this calculation.\nlet xparamId = arguments[0];\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\nlet plus = this.xparamPlus(xparamId);\nlet paramRate = this.xparamRate(xparamId);\nlet flatBonus = this.xparamFlatBonus(xparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param XParamVocab
 * @text Vocabulary
 * @parent XParameters
 *
 * @param XParamVocab0:str
 * @text HIT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Hit
 *
 * @param XParamVocab1:str
 * @text EVA
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Evasion
 *
 * @param XParamVocab2:str
 * @text CRI
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Rate
 *
 * @param XParamVocab3:str
 * @text CEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Evade
 *
 * @param XParamVocab4:str
 * @text MEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Evade
 *
 * @param XParamVocab5:str
 * @text MRF
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Reflect
 *
 * @param XParamVocab6:str
 * @text CNT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Counter
 *
 * @param XParamVocab7:str
 * @text HRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default HP Regen
 *
 * @param XParamVocab8:str
 * @text MRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default MP Regen
 *
 * @param XParamVocab9:str
 * @text TRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default TP Regen
 *
 * @param SParameters
 * @text S Parameters
 *
 * @param SParameterFormula:func
 * @text JS: Formula
 * @parent SParameters
 * @type note
 * @desc Formula used to determine the total value all 10 S parameters: TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 * @default "// Determine the variables used in this calculation.\nlet sparamId = arguments[0];\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\nlet plus = this.sparamPlus(sparamId);\nlet paramRate = this.sparamRate(sparamId);\nlet flatBonus = this.sparamFlatBonus(sparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param SParamVocab
 * @text Vocabulary
 * @parent SParameters
 *
 * @param SParamVocab0:str
 * @text TGR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Aggro
 *
 * @param SParamVocab1:str
 * @text GRD
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Guard
 *
 * @param SParamVocab2:str
 * @text REC
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Recovery
 *
 * @param SParamVocab3:str
 * @text PHA
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Item Effect
 *
 * @param SParamVocab4:str
 * @text MCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default MP Cost
 *
 * @param SParamVocab5:str
 * @text TCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default TP Charge
 *
 * @param SParamVocab6:str
 * @text PDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Physical DMG
 *
 * @param SParamVocab7:str
 * @text MDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Magical DMG
 *
 * @param SParamVocab8:str
 * @text FDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Floor DMG
 *
 * @param SParamVocab9:str
 * @text EXR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default EXP Gain
 *
 * @param Icons
 * @text Icons
 *
 * @param DrawIcons:eval
 * @text Draw Icons?
 * @parent Icons
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Draw icons next to parameter names?
 * @default true
 *
 * @param IconParam0:str
 * @text MaxHP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 84
 *
 * @param IconParam1:str
 * @text MaxMP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconParam2:str
 * @text ATK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconParam3:str
 * @text DEF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 81
 *
 * @param IconParam4:str
 * @text MAT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 101
 *
 * @param IconParam5:str
 * @text MDF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 133
 *
 * @param IconParam6:str
 * @text AGI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 140
 *
 * @param IconParam7:str
 * @text LUK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 87
 *
 * @param IconXParam0:str
 * @text HIT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 102
 *
 * @param IconXParam1:str
 * @text EVA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam2:str
 * @text CRI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 78
 *
 * @param IconXParam3:str
 * @text CEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam4:str
 * @text MEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 171
 *
 * @param IconXParam5:str
 * @text MRF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 222
 *
 * @param IconXParam6:str
 * @text CNT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 77
 *
 * @param IconXParam7:str
 * @text HRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam8:str
 * @text MRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam9:str
 * @text TRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam0:str
 * @text TGR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 5
 *
 * @param IconSParam1:str
 * @text GRD
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 128
 *
 * @param IconSParam2:str
 * @text REC
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam3:str
 * @text PHA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 176
 *
 * @param IconSParam4:str
 * @text MCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconSParam5:str
 * @text TCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 164
 *
 * @param IconSParam6:str
 * @text PDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconSParam7:str
 * @text MDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 79
 *
 * @param IconSParam8:str
 * @text FDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 141
 *
 * @param IconSParam9:str
 * @text EXR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 73
 *
 */
/* ----------------------------------------------------------------------------
 * Commands Struct
 * ----------------------------------------------------------------------------
 */
/*~struct~Command:
 *
 * @param Symbol:str
 * @text Symbol
 * @desc The symbol used for this command.
 * @default Symbol
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc Displayed text used for this title command.
 * If this has a value, ignore the JS: Text version.
 * @default Untitled
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine string used for the displayed name.
 * @default "return 'Text';"
 *
 * @param ShowJS:func
 * @text JS: Show
 * @type note
 * @desc JavaScript code used to determine if the item is shown or not.
 * @default "return true;"
 *
 * @param EnableJS:func
 * @text JS: Enable
 * @type note
 * @desc JavaScript code used to determine if the item is enabled or not.
 * @default "return true;"
 *
 * @param ExtJS:func
 * @text JS: Ext
 * @type note
 * @desc JavaScript code used to determine any ext data that should be added.
 * @default "return null;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this command is selected.
 * @default ""
 *
 */
/* ----------------------------------------------------------------------------
 * Title Picture Buttons
 * ----------------------------------------------------------------------------
 */
/*~struct~TitlePictureButton:
 *
 * @param PictureFilename:str
 * @text Picture's Filename
 * @type file
 * @dir img/pictures/
 * @desc Filename used for the picture.
 * @default
 *
 * @param ButtonURL:str
 * @text Button URL
 * @desc URL for the button to go to upon being clicked.
 * @default https://www.google.com/
 *
 * @param PositionJS:func
 * @text JS: Position
 * @type note
 * @desc JavaScript code that helps determine the button's Position.
 * @default "this.x = Graphics.width - this.bitmap.width - 20;\nthis.y = Graphics.height - this.bitmap.height - 20;"
 *
 * @param OnLoadJS:func
 * @text JS: On Load
 * @type note
 * @desc JavaScript code that runs once this button bitmap is loaded.
 * @default "this.opacity = 0;\nthis.visible = true;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this button is pressed.
 * @default "const url = this._data.ButtonURL;\nVisuMZ.openURL(url);"
 *
 */
/* ----------------------------------------------------------------------------
 * UI Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~UI:
 *
 * @param UIArea
 * @text UI Area
 *
 * @param FadeSpeed:num
 * @text Fade Speed
 * @parent UIArea
 * @desc Default fade speed for transitions.
 * @default 24
 *
 * @param BoxMargin:num
 * @text Box Margin
 * @parent UIArea
 * @type number
 * @min 0
 * @desc Set the margin in pixels for the screen borders.
 * Default: 4
 * @default 4
 *
 * @param CommandWidth:num
 * @text Command Window Width
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the width for standard Command Windows.
 * Default: 240
 * @default 240
 *
 * @param BottomHelp:eval
 * @text Bottom Help Window
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the Help Window at the bottom of the screen?
 * @default false
 *
 * @param RightMenus:eval
 * @text Right Aligned Menus
 * @parent UIArea
 * @type boolean
 * @on Right
 * @off Left
 * @desc Put most command windows to the right side of the screen.
 * @default true
 *
 * @param ShowButtons:eval
 * @text Show Buttons
 * @parent UIArea
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show clickable buttons in your game?
 * This will affect all buttons.
 * @default true
 *
 * @param cancelShowButton:eval
 * @text Show Cancel Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show cancel button?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param menuShowButton:eval
 * @text Show Menu Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show main menu button from the map scene?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param pagedownShowButton:eval
 * @text Show Page Up/Down
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show page up/down buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param numberShowButton:eval
 * @text Show Number Buttons
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show number adjustment buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param ButtonHeight:num
 * @text Button Area Height
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the height for the button area.
 * Default: 52
 * @default 52
 *
 * @param BottomButtons:eval
 * @text Bottom Buttons
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the buttons at the bottom of the screen?
 * @default false
 *
 * @param SideButtons:eval
 * @text Side Buttons
 * @parent UIArea
 * @type boolean
 * @on Side
 * @off Normal
 * @desc Push buttons to the side of the UI if there is room.
 * @default true
 *
 * @param StateIconsNonFrame:eval
 * @text State Icons Non-Frame
 * @parent UIArea
 * @type boolean
 * @on Non-Frame
 * @off Normal
 * @desc Replace sprite frame system for non-frame.
 * Better for any instances where icons are zoomed.
 * @default true
 *
 * @param MenuObjects
 * @text Menu Objects
 *
 * @param LvExpGauge:eval
 * @text Level -> EXP Gauge
 * @parent MenuObjects
 * @type boolean
 * @on Draw Gauge
 * @off Keep As Is
 * @desc Draw an EXP Gauge under the drawn level.
 * @default true
 *
 * @param ParamArrow:str
 * @text Parameter Arrow
 * @parent MenuObjects
 * @desc The arrow used to show changes in the parameter values.
 * @default →
 *
 * @param TextCodeSupport
 * @text Text Code Support
 *
 * @param TextCodeClassNames:eval
 * @text Class Names
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make class names support text codes?
 * @default true
 *
 * @param TextCodeNicknames:eval
 * @text Nicknames
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make nicknames support text codes?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param WindowDefaults
 * @text Defaults
 *
 * @param EnableMasking:eval
 * @text Enable Masking
 * @parent WindowDefaults
 * @type boolean
 * @on Masking On
 * @off Masking Off
 * @desc Enable window masking (windows hide other windows behind
 * them)? WARNING: Turning it on can obscure data.
 * @default false
 *
 * @param CorrectSkinBleeding:eval
 * @text Correct Skin Bleed
 * @parent WindowDefaults
 * @type boolean
 * @on Correct
 * @off Don't Correct
 * @desc Corrects window skin bleeding bug when used with higher
 * screen resolutions?
 * @default true
 *
 * @param LineHeight:num
 * @text Line Height
 * @parent WindowDefaults
 * @desc Default line height used for standard windows.
 * Default: 36. Avoid using odd numbers.
 * @default 36
 *
 * @param ItemPadding:num
 * @text Item Padding
 * @parent WindowDefaults
 * @desc Default line padding used for standard windows.
 * Default: 8. Avoid using odd numbers.
 * @default 8
 *
 * @param BackOpacity:num
 * @text Back Opacity
 * @parent WindowDefaults
 * @desc Default back opacity used for standard windows.
 * Default: 192
 * @default 192
 *
 * @param TranslucentOpacity:num
 * @text Translucent Opacity
 * @parent WindowDefaults
 * @desc Default translucent opacity used for standard windows.
 * Default: 160
 * @default 160
 *
 * @param OpenSpeed:num
 * @text Window Opening Speed
 * @parent WindowDefaults
 * @desc Default open speed used for standard windows.
 * Default: 32 (Use a number between 0-255)
 * @default 32
 * @default 24
 *
 * @param ColSpacing:num
 * @text Column Spacing
 * @parent WindowDefaults
 * @desc Default column spacing for selectable windows.
 * Default: 8
 * @default 8
 *
 * @param RowSpacing:num
 * @text Row Spacing
 * @parent WindowDefaults
 * @desc Default row spacing for selectable windows.
 * Default: 4
 * @default 4
 *
 * @param ScrollBar
 * @text Scroll Bar
 *
 * @param ShowScrollBar:eval
 * @text Show Scroll Bar?
 * @parent ScrollBar
 * @type boolean
 * @on Show Scroll Bar
 * @off Don't Show
 * @desc Show the scroll bar for scrollable windows?
 * @default true
 *
 * @param BarThickness:num
 * @text Thickness
 * @parent ScrollBar
 * @type number
 * @min 1
 * @desc How thick do you want the scroll bar to be?
 * @default 2
 *
 * @param BarOffset:num
 * @text Offset
 * @parent ScrollBar
 * @desc How much do you want to offset the scroll bar by?
 * @default +2
 *
 * @param BarBodyColor:str
 * @text Bar Body Color
 * @parent ScrollBar
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param OffBarColor:str
 * @text Off Bar Color
 * @parent ScrollBar
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 7
 *
 * @param OffBarOpacity:num
 * @text Off Bar Opacity
 * @parent ScrollBar
 * @type number
 * @min 1
 * @max 255
 * @desc What opacity value do you want the off bar opacity
 * to be? Use a number between 0 and 255.
 * @default 128
 *
 * @param SelectableItems
 * @text Selectable Items
 *
 * @param ShowItemBackground:eval
 * @text Show Background?
 * @parent SelectableItems
 * @type boolean
 * @on Show Backgrounds
 * @off No Backgrounds
 * @desc Selectable menu items have dark boxes behind them. Show them?
 * @default true
 *
 * @param ItemHeight:num
 * @text Item Height Padding
 * @parent SelectableItems
 * @desc Default padding for selectable items.
 * Default: 8. Avoid using odd numbers.
 * @default 8
 *
 * @param DrawItemBackgroundJS:func
 * @text JS: Draw Background
 * @parent SelectableItems
 * @type note
 * @desc Code used to draw the background rectangle behind clickable menu objects
 * @default "const rect = arguments[0];\nconst c1 = ColorManager.itemBackColor1();\nconst c2 = ColorManager.itemBackColor2();\nconst x = rect.x;\nconst y = rect.y;\nconst w = rect.width;\nconst h = rect.height;\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\nthis.contentsBack.strokeRect(x, y, w, h, c1);"
 *
 * @param TextPopup
 * @text Text Popup Window
 *
 * @param DurationPerChat:num
 * @text Duration Per Text
 * @parent TextPopup
 * @desc What is the increase in duration per text character?
 * @default 1.5
 *
 * @param MinDuration:num
 * @text Minimum Duration
 * @parent TextPopup
 * @type number
 * @min 1
 * @desc Minimum duration for window to stay on the screen.
 * @default 90
 *
 * @param MaxDuration:num
 * @text Maximum Duration
 * @parent TextPopup
 * @type number
 * @min 1
 * @desc Maximum duration for window to stay on the screen.
 * @default 300
 *
 */
/* ----------------------------------------------------------------------------
 * Screen Resolution Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScreenResolution:
 *
 * @param Maps
 *
 * @param AutoScrollLockX:eval
 * @text Scroll Lock Small X?
 * @parent Maps
 * @type boolean
 * @on Auto-Lock
 * @off Keep As Is
 * @desc Automatically scroll lock X scrolling if the map is too small?
 * @default true
 *
 * @param AutoScrollLockY:eval
 * @text Scroll Lock Small Y?
 * @parent Maps
 * @type boolean
 * @on Auto-Lock
 * @off Keep As Is
 * @desc Automatically scroll lock Y scrolling if the map is too small?
 * @default true
 *
 * @param DisplayLockX:num
 * @text Locked Display X?
 * @parent Maps
 * @desc What display X value do you want for auto-scroll locked
 * maps? Use a number between 0 and 1 for best results.
 * @default 0.15625
 *
 * @param DisplayLockY:num
 * @text Locked Display Y?
 * @parent Maps
 * @desc What display Y value do you want for auto-scroll locked
 * maps? Use a number between 0 and 1 for best results.
 * @default 0.00000
 *
 * @param Troops
 *
 * @param RepositionActors:eval
 * @text Reposition Actors
 * @parent Troops
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of actors in battle if the screen resolution has changed. Ignore if using Battle Core.
 * @default true
 *
 * @param RepositionEnemies:eval
 * @text Reposition Enemies
 * @parent Troops
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of enemies in battle if the screen resolution has changed.
 * @default true
 *
 * @param RepositionEnemies130:eval
 * @text For MZ 1.3.0+?
 * @parent RepositionEnemies:eval
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Both this parameter and its parent parameter need to be on when using RPG Maker MZ 1.3.0+.
 * @default false
 *
 */
/* ----------------------------------------------------------------------------
 * Screen Shake Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScreenShake:
 *
 * @param DefaultStyle:str
 * @text Default Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc The default style used for screen shakes.
 * @default random
 *
 * @param originalJS:func
 * @text JS: Original Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\nthis.x += Math.round($gameScreen.shake());"
 *
 * @param randomJS:func
 * @text JS: Random Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param horzJS:func
 * @text JS: Horizontal Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param vertJS:func
 * @text JS: Vertical Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 */
/* ----------------------------------------------------------------------------
 * Custom Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~CustomParam:
 *
 * @param ParamName:str
 * @text Parameter Name
 * @desc What's the parameter's name?
 * Used for VisuStella MZ menus.
 * @default Untitled
 *
 * @param Abbreviation:str
 * @text Abbreviation
 * @parent ParamName:str
 * @desc What abbreviation do you want to use for the parameter?
 * Do not use special characters. Avoid numbers if possible.
 * @default unt
 *
 * @param Icon:num
 * @text Icon
 * @parent ParamName:str
 * @desc What icon do you want to use to represent this parameter?
 * Used for VisuStella MZ menus.
 * @default 160
 *
 * @param Type:str
 * @text Type
 * @parent ParamName:str
 * @type select
 * @option Integer (Whole Numbers Only)
 * @value integer
 * @option Float (Decimals are Allowed)
 * @value float
 * @desc What kind of number value will be returned with this parameter?
 * @default integer
 *
 * @param ValueJS:json
 * @text JS: Value
 * @type note
 * @desc Run this code when this parameter is to be returned.
 * @default "// Declare Constants\nconst user = this;\n\n// Calculations\nreturn 1;"
 *
 */
/* ----------------------------------------------------------------------------
 * Show Picture Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShowPicture:
 *
 * @param Position
 *
 * @param Origin:num
 * @text Origin
 * @parent Position
 * @type select
 * @option 0 - Upper Left
 * @value 0
 * @option 1 - Center
 * @value 1
 * @desc What is the origin of this picture icon?
 * @default 0
 *
 * @param PositionX:eval
 * @text Position X
 * @parent Position
 * @desc X coordinate of the picture.
 * You may use JavaScript code.
 * @default 0
 *
 * @param PositionY:eval
 * @text Position Y
 * @parent Position
 * @desc Y coordinate of the picture.
 * You may use JavaScript code.
 * @default 0
 *
 * @param Scale
 *
 * @param ScaleX:eval
 * @text Width %
 * @parent Scale
 * @desc Horizontal scale of the picture.
 * You may use JavaScript code.
 * @default 100
 *
 * @param ScaleY:eval
 * @text Height %
 * @parent Scale
 * @desc Vertical scale of the picture.
 * You may use JavaScript code.
 * @default 100
 *
 * @param Blend
 *
 * @param Opacity:eval
 * @text Opacity
 * @parent Blend
 * @desc Insert a number to determine opacity level. Use a
 * number between 0 and 255. You may use JavaScript code.
 * @default 255
 *
 * @param BlendMode:num
 * @text Blend Mode
 * @parent Blend
 * @type select
 * @option 0 - Normal
 * @value 0
 * @option 1 - Additive
 * @value 1
 * @option 2 - Multiply
 * @value 2
 * @option 3 - Screen
 * @value 3
 * @desc What kind of blend mode do you wish to apply to the picture?
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * JS Quick Function Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~jsQuickFunc:
 *
 * @param FunctionName:str
 * @text Function Name
 * @desc The function's name in the global namespace.
 * Will not overwrite functions/variables of the same name.
 * @default Untitled
 *
 * @param CodeJS:json
 * @text JS: Code
 * @type note
 * @desc Run this code when using the function.
 * @default "// Insert this as a function anywhere you can input code\n// such as Script Calls or Conditional Branch Scripts.\n\n// Process Code\n"
 *
 */
//=============================================================================

function _0x55f7(_0x1adab5, _0x13b21a) {
  const _0x43c8b7 = _0x43c8();
  return (
    (_0x55f7 = function (_0x55f763, _0x21f309) {
      _0x55f763 = _0x55f763 - 0xdf;
      let _0x1d2220 = _0x43c8b7[_0x55f763];
      return _0x1d2220;
    }),
    _0x55f7(_0x1adab5, _0x13b21a)
  );
}
const _0x17b060 = _0x55f7;
(function (_0x4a1a2e, _0x444b5b) {
  const _0x4d75f7 = _0x55f7,
    _0x3fe1e6 = _0x4a1a2e();
  while (!![]) {
    try {
      const _0xe77c4d =
        (-parseInt(_0x4d75f7(0x2f1)) / 0x1) * (-parseInt(_0x4d75f7(0x34d)) / 0x2) +
        (parseInt(_0x4d75f7(0x838)) / 0x3) * (parseInt(_0x4d75f7(0x1ff)) / 0x4) +
        (-parseInt(_0x4d75f7(0x3e5)) / 0x5) * (-parseInt(_0x4d75f7(0x117)) / 0x6) +
        parseInt(_0x4d75f7(0xf0)) / 0x7 +
        (parseInt(_0x4d75f7(0xee)) / 0x8) * (parseInt(_0x4d75f7(0x397)) / 0x9) +
        (parseInt(_0x4d75f7(0x376)) / 0xa) * (-parseInt(_0x4d75f7(0x6e5)) / 0xb) +
        -parseInt(_0x4d75f7(0x815)) / 0xc;
      if (_0xe77c4d === _0x444b5b) break;
      else _0x3fe1e6['push'](_0x3fe1e6['shift']());
    } catch (_0x4fa499) {
      _0x3fe1e6['push'](_0x3fe1e6['shift']());
    }
  }
})(_0x43c8, 0x7e53f);
function _0x43c8() {
  const _0x32af4b = [
    'system',
    'Sprite_Animation_setViewport',
    'successRate',
    'updateClose',
    '\x0a\x0a\x0a\x0a\x0a',
    'DigitGroupingDamageSprites',
    'TimeProgress',
    'EREOF',
    '_mapX',
    'sparamPlus',
    'setCoreEngineUpdateWindowBg',
    '_closing',
    'IconParam4',
    'isBottomHelpMode',
    'SCROLLBAR',
    'valueOutlineColor',
    'exp',
    'INBACK',
    'tpGaugeColor1',
    'EnableMasking',
    'bind',
    '_startDecrypting',
    'cursorLeft',
    'battlebacks1',
    '%1〘End\x20Choice\x20Selection〙%1',
    'yScrollLinkedOffset',
    '_logWindow',
    'GoldFontSize',
    'isScrollBarVisible',
    'OkText',
    'SEPARATOR',
    'boxWidth',
    'MultiKeyFmt',
    'CoreEngine',
    'paramWidth',
    'ShowScrollBar',
    '_bypassCanCounterCheck',
    '_hovered',
    '_previousClass',
    'xparamFlatJS',
    'addChild',
    'PERIOD',
    'ScreenShake',
    'buttonAssistWindowButtonRect',
    'updatePositionCoreEngine',
    'picture',
    'MvAnimationRate',
    'bitmapHeight',
    'Game_Interpreter_command355',
    'ItemMenu',
    'setAttack',
    'Scene_Boot_onDatabaseLoaded',
    '(\x5cd+)([%％])>',
    'MainMenu',
    'createDimmerSprite',
    'measureTextWidth',
    'ColorExpGauge2',
    'updateKeyText',
    'gold',
    '_animationQueue',
    'playTestF6',
    'isNormalPriority',
    'log',
    'gaugeLineHeight',
    'centerSprite',
    'Window_Base_createContents',
    '_targetScaleY',
    'PreserveNumbers',
    'playMiss',
    'index',
    'ScreenResolution',
    'onDatabaseLoaded',
    'param',
    'ParseWeaponNotetags',
    'send',
    'deselect',
    'Game_Interpreter_updateWaitMode',
    'isBottomButtonMode',
    'F17',
    'Game_Actor_paramBase',
    '_addSpotTile',
    'SCALE_MODES',
    'setTargetAnchor',
    'Game_BattlerBase_refresh',
    'setHome',
    'QoL',
    'NUMPAD9',
    'ColSpacing',
    'OPEN_BRACKET',
    'EnableJS',
    'background',
    'END',
    'setSideView',
    'refreshWithTextCodeSupport',
    '_commandWindow',
    'playOnceParallelInterpreter',
    'restore',
    'paramY',
    '_battleField',
    'Flat',
    '_buttonType',
    'destroyContents',
    'Manual',
    'EISU',
    'F13',
    'number',
    'catchException',
    'setColorTone',
    'pagedown',
    'NewGameCommonEventAll',
    '_action',
    'ColorDeath',
    'doesNameContainBannedWords',
    'F15',
    '_createInternalTextures',
    'ColorGaugeBack',
    '_playTestFastMode',
    'result',
    'loadMapData',
    'LoadError',
    'InputBgType',
    'Flat1',
    'bitmap',
    'createWindowLayer',
    'AutoScrollLockY',
    'BaseTexture',
    'makeFontBigger',
    'gameTitle',
    'contains',
    '%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.',
    '_cacheScaleX',
    'SCROLL_LOCK',
    'INCUBIC',
    '_pagedownButton',
    'xparamRate1',
    'VariableEvalReference',
    'DigitGroupingExText',
    'Sprite_Animation_processSoundTimings',
    'NUMPAD4',
    'setAction',
    'Scene_Menu_create',
    'test',
    'ParseClassNotetags',
    'Game_Map_scrollUp',
    'ShowDevTools',
    'setEvent',
    '_stored_mpGaugeColor2',
    'bgsVolume',
    'EndingID',
    'PictureShowIcon',
    'onInputOk',
    'requestPointAnimation',
    'itemPadding',
    'apply',
    'Layer',
    'shift',
    'paramchangeTextColor',
    'originalJS',
    'repositionEnemiesByResolution',
    'setMoveEasingType',
    'max',
    'Sprite_AnimationMV_updatePosition',
    '_shiftY',
    'isGamepadAxisMoved',
    'canUse',
    'Window_Selectable_drawBackgroundRect',
    'GET',
    'sparamFlat1',
    'Plus2',
    'Game_Map_setDisplayPos',
    'FTB',
    'padding',
    'sparamRateJS',
    'getControllerInputButtonString',
    '_lastX',
    'Smooth',
    'mute',
    'ENTER_SPECIAL',
    'loadBitmap',
    '_CoreEngineSettings',
    '_forcedBattleGridSystem',
    'refresh',
    'textWidth',
    'SmartEventCollisionPriority',
    'getCoreEngineScreenShakeStyle',
    '_forcedTroopView',
    'setLastPluginCommandInterpreter',
    'fromCharCode',
    '21144792aNjvCA',
    'focus',
    'maxCols',
    'isSideButtonLayout',
    '〖〖〖\x20Map\x20%1:\x20%2\x20Script\x20〗〗〗\x0a\x0a',
    'exit',
    '_startPlaying',
    'child_process',
    'itemRect',
    'goldWindowRect',
    'markCoreEngineModified',
    'GoldChange',
    '_animationSprites',
    'onXhrError',
    'ItemBgType',
    'cos',
    'setCommonEvent',
    'paramBaseAboveLevel99',
    'imageSmoothingEnabled',
    'TCR',
    'processDigitChange',
    'scale',
    'DigitGroupingLocale',
    '_cacheScaleY',
    'areButtonsOutsideMainUI',
    'MINUS',
    'DamageColor',
    'backOpacity',
    'setupFont',
    '_muteSound',
    '_shouldPreventDefault',
    'clearForcedGameTroopSettingsCoreEngine',
    'lineHeight',
    '_stored_expGaugeColor2',
    'adjustX',
    '13431fFHzQW',
    'Exported_Script_%1.txt',
    'maxBattleMembers',
    'makeFontSmaller',
    'makeDeepCopy',
    'WIN_OEM_FJ_ROYA',
    'concat',
    'removeAnimationFromContainer',
    'Scene_Boot_startNormalGame',
    'retreat',
    'ButtonHeight',
    'EXR',
    '_backSprite1',
    'Tilemap_addShadow',
    'BarThickness',
    'requestFauxAnimation',
    'tilesets',
    'randomInt',
    'offsetY',
    'Window_TitleCommand_selectLast',
    '_timerSprite',
    'GoldRect',
    'ActorMPColor',
    'turn',
    'textBaseline',
    'origin',
    '_lastPluginCommandInterpreter',
    'toLowerCase',
    'BannedWords',
    'Max',
    'onKeyDown',
    'blendFunc',
    'paintOpacity',
    'ARRAYNUM',
    'updateFrameCoreEngine',
    '_anchor',
    'context',
    'note',
    'applyEasing',
    'title',
    '_onKeyPress',
    'COMMA',
    'ButtonAssist',
    'string',
    'Window_NameInput_cursorPagedown',
    'statusWindowRect',
    'loadWindowskin',
    'alpha',
    '_backSprite2',
    '_patternHeight',
    '_anglePlus',
    'F20',
    'setupScrollBarBitmap',
    'OutlineColorGauge',
    'BattleManager_invokeCounterAttack',
    'xdg-open',
    'initRotationCoreEngine',
    '_downArrowSprite',
    'AutoStretch',
    'playCursorSound',
    'OpenConsole',
    '([\x5c+\x5c-]\x5cd+)>',
    'QwertyLayout',
    '_texture',
    'EscapeAlways',
    'makeEncounterCount',
    'isEventTest',
    'onInputBannedWords',
    'createExtendedTileSprite',
    'updatePositionCoreEngineShakeHorz',
    'Window_NameInput_cursorDown',
    '_bitmap',
    'SwitchToggleRange',
    'processSoundTimings',
    'IconSParam1',
    'Scene_Options_create',
    '_storedStack',
    'ActorBgType',
    'Scene_MenuBase_helpAreaTop',
    'IconSParam6',
    'removeOnceParallelInterpreter',
    'HIT',
    'reservePlayTestNewGameCommonEvent',
    'STRUCT',
    'ShowButtons',
    '_pictureName',
    'isKeyItem',
    'EXCLAMATION',
    'initRotation',
    'isForFriend',
    'addLoadListener',
    'setupCustomRateCoreEngine',
    'isPlaying',
    'faces',
    'scrollLeft',
    'code',
    'updateScrollBars',
    '_windowskin',
    '<%1\x20%2:[\x20]',
    'Input_pollGamepads',
    'checkCacheKey',
    'ParamChange',
    'WIN_OEM_FJ_TOUROKU',
    'helpAreaHeight',
    'buttonAssistText1',
    '_scrollDuration',
    'Game_Picture_angle',
    'updateMainMultiply',
    '(\x5cd+\x5c.?\x5cd+)>',
    'animationShouldMirror',
    'pan',
    'playTestShiftT',
    'xparamPlus',
    'FontSize',
    'Scene_Battle_createCancelButton',
    'IconSParam5',
    'BTestAddedQuantity',
    'CLOSE_BRACKET',
    '_moveEasingType',
    'drawIcon',
    '_buyWindow',
    'Scene_Map_shouldAutosave',
    'Game_Interpreter_command105',
    '_destroyCanvas',
    'MenuBg',
    'drawActorClass',
    'PositionY',
    'anglePlus',
    '_statusEquipWindow',
    'PGDN',
    'playOk',
    'Scene_Map_createSpriteset',
    '_centerElementCoreEngine',
    'original',
    'Wait',
    'backgroundBitmap',
    'Scene_Name_onInputOk',
    'BgFilename1',
    'titleCommandWindow',
    'drawCurrentParam',
    'currentLevelExp',
    'showPointAnimations',
    'EXECUTE',
    '_pointAnimationQueue',
    'alignBottom',
    'Window_NameInput_initialize',
    'paramRate2',
    'escape',
    'LUK',
    'updateAnglePlus',
    '1016936MHBUBU',
    'nw.gui',
    '6470688UJWloy',
    'setBattleSystem',
    'currentExp',
    '_data',
    'scrollbarHeight',
    'updatePositionCoreEngineShakeVert',
    '_targets',
    'getColor',
    'fontSize',
    'mainFontSize',
    'Y:\x20%1',
    'Match',
    'StatusParamsRect',
    'BattleManager_update',
    'Bitmap_strokeRect',
    'Window_Selectable_cursorDown',
    'CRSEL',
    'CodeJS',
    '_stored_gaugeBackColor',
    'asin',
    'drawActorNickname',
    'sparamRate2',
    'createFauxAnimationQueue',
    'alwaysDash',
    'defaultInputMode',
    'isAnimationPlaying',
    '%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.',
    '_spriteset',
    'getLevel',
    'encounterStepsMinimum',
    '_opacity',
    'cursorPagedown',
    '_stored_crisisColor',
    'ControllerMatches',
    'IconXParam7',
    'characters',
    '_mirror',
    'URL',
    'overallHeight',
    '18cYdPXZ',
    'offOpacity',
    'Spriteset_Base_updatePosition',
    'PDR',
    'isOpening',
    'setMute',
    'Scene_Base_terminateAnimationClearBugFix',
    'setupTileExtendTerrainTags',
    'MRF',
    'OPEN_CURLY_BRACKET',
    'MDR',
    'pop',
    'drawGauge',
    'actor',
    'Graphics_centerElement',
    'wholeDuration',
    '_defaultStretchMode',
    'SkillMenu',
    'F14',
    'mpGaugeColor1',
    'BgType',
    'sparam',
    'setBackgroundType',
    'encounterStep',
    'active',
    'META',
    'command111',
    '_clickHandler',
    'itemSuccessRate',
    'IconSParam4',
    'ATK',
    'updateScrollBarVisibility',
    'mainAreaTop',
    'framesPerChar',
    'button',
    'processPointAnimationRequests',
    'Key%1',
    'itemLineRect',
    'toLocaleString',
    'makeAutoBattleActions',
    'onload',
    'IconParam1',
    'openness',
    'name',
    'BuyBgType',
    'BTestArmors',
    'Bitmap_clearRect',
    'home',
    'drawIconBySize',
    'MAXMP',
    'SParamVocab2',
    'volume',
    'createTextPopupWindow',
    '_backSprite',
    '\x5c}❪TAB❫\x5c{',
    '_targetOffsetY',
    '_onKeyDown',
    'gaugeBackColor',
    '_lastOrigin',
    'slice',
    'checkPassage',
    '_saveFileID',
    'menu',
    'VisuMZ_2_BattleSystemSTB',
    'Scene_Map_updateMainMultiply',
    'mpCostColor',
    'keys',
    'titles2',
    'Basic',
    'scrollX',
    'updateFrame',
    'ValueJS',
    'ShiftT_Toggle',
    'Window_NameInput_processTouch',
    'removeTileExtendSprites',
    'maxItems',
    'ctGaugeColor1',
    'processKeyboardDigitChange',
    'getInputMultiButtonStrings',
    'horzJS',
    'Window_NameInput_cursorLeft',
    'Sprite_Button_initialize',
    'AudioChangeBgmPan',
    'onKeyDownKeysF6F7',
    'DELETE',
    'IconXParam0',
    'enableDigitGrouping',
    'contents',
    'updateBgsParameters',
    'allTiles',
    '_stored_hpGaugeColor2',
    'isMaxLevel',
    'isCursorMovable',
    'initialLevel',
    'createPointAnimationTargets',
    'resetTextColor',
    'CallHandlerJS',
    '〘Show\x20Text〙\x0a',
    'RIGHT',
    'CLEAR',
    'Scene_Name_create',
    'Game_Picture_x',
    'MEV',
    'removeAllPointAnimations',
    'text%1',
    'paramRateJS',
    'initCoreEngine',
    'Mirror',
    'makeInputButtonString',
    'textAlign',
    'isNwjs',
    'updateOpen',
    'destroyScrollBarBitmaps',
    'drawCharacter',
    'BTB',
    'subject',
    'ARRAYSTRUCT',
    '_iconIndex',
    'INOUTQUINT',
    'Tilemap_addSpotTile',
    'ColorHPGauge2',
    'process_VisuMZ_CoreEngine_RegExp',
    'hpGaugeColor1',
    'Version',
    'gaugeHeight',
    '_backgroundFilter',
    'down',
    '_animation',
    'KeyboardInput',
    'show',
    '_baseTexture',
    'ETB',
    'processKeyboardDelete',
    'filter',
    'itypeId',
    'pendingColor',
    'remove',
    'F24',
    'renderNoMask',
    '_stored_mpGaugeColor1',
    'processKeyboardHome',
    'status',
    'BlendMode',
    '_isWindow',
    'dimColor2',
    'FDR',
    'drawText',
    'processTouchModernControls',
    'Total',
    'PictureRotate',
    'QUOTE',
    'includes',
    'resize',
    'target',
    'clearRect',
    'Sprite_Gauge_gaugeRate',
    'calcEasing',
    'VisuMZ_2_BattleSystemETB',
    'GoldIcon',
    'showDevTools',
    '_lastGamepad',
    'INOUTELASTIC',
    'CONVERT',
    'updateScrollBarPosition',
    'EditRect',
    'RegExp',
    '_opening',
    'Scene_SingleLoadTransition',
    'addAnimationSpriteToContainer',
    'isCollidedWithEvents',
    'isDying',
    'jsQuickFunc',
    'INQUART',
    'Game_Action_numRepeats',
    '_drawTextBody',
    'Item-%1-%2',
    'Bitmap_gradientFillRect',
    'GRD',
    'command357',
    'TitlePicButtons',
    '_skillTypeWindow',
    '_profileWindow',
    'processCursorHomeEndTrigger',
    'Untitled',
    'quit',
    'prepare',
    'SHIFT',
    'canAttack',
    'setAnglePlusData',
    '_dimmerSprite',
    'Mute',
    'parameters',
    'targetScaleX',
    'makeActionList',
    'redraw',
    'thickness',
    'SlotBgType',
    'Game_Picture_show',
    '_fauxAnimationSprites',
    'onButtonImageLoad',
    'format',
    '_pauseSignSprite',
    'currentClass',
    'rgba(0,\x200,\x200,\x201.0)',
    'makeDocumentTitle',
    '_baseSprite',
    'Game_Interpreter_command111',
    'AudioChangeBgsVolume',
    'F6key',
    '《《《\x20Event\x20%1:\x20%2,\x20Page\x20%3\x20》》》\x0a%4\x0a',
    'isOpenAndActive',
    'eventsXyNt',
    'initButtonHidden',
    'tilesetFlags',
    'Map%1',
    'createFauxAnimation',
    'loadSystem',
    'ColorPowerUp',
    'tileWidth',
    'CreateBattleSystemID',
    'clearOnceParallelInterpreters',
    'buttonAssistWindowRect',
    'startAutoNewGame',
    'targetObjects',
    'processCursorMove',
    'Scene_MenuBase_mainAreaTop',
    'DisplayLockX',
    'buttonAssistOk',
    'buttonAssistKey1',
    'NoTileShadows',
    'F7key',
    'getCustomBackgroundSettings',
    '188ncXhOs',
    'HYPHEN_MINUS',
    'isOptionValid',
    'Bitmap_fillRect',
    'IconXParam9',
    'LESS_THAN',
    'setMainFontSize',
    'transform',
    'OPEN_PAREN',
    'itemBackColor1',
    'AnimationMirrorOffset',
    'Enable',
    'XParamVocab8',
    '_scrollBarHorz',
    'mmp',
    'Scene_MenuBase_createCancelButton',
    'canEquip',
    'HANJA',
    'stretch',
    'NameInputMessage',
    'updateCurrentEvent',
    'sparamRate',
    'MinDuration',
    'coreEngineRepositionEnemies',
    'playBuzzer',
    'HELP',
    '_updateGamepadState',
    '_blank',
    '_movementDuration',
    'TextFmt',
    'buttonAssistText4',
    'PGUP',
    'Troop%1',
    'createKeyJS',
    'floor',
    'VisuMZ_2_BattleSystemCTB',
    'substring',
    'getLastUsedGamepadType',
    'buttonAssistCancel',
    'refreshSpritesetForExtendedTiles',
    'Page',
    'GameEnd',
    'Scene_Equip_create',
    'requiredWtypeId1',
    'Scene_Map_updateScene',
    'Window_Base_drawCharacter',
    'AnimationID',
    'textSizeEx',
    'sparamRate1',
    'SaveMenu',
    'SystemLoadAudio',
    'RPGMAKER_VERSION',
    '_cache',
    '_listWindow',
    'ItemBackColor2',
    '_stored_tpCostColor',
    '_digitGroupingEx',
    'fillStyle',
    '_offsetX',
    'determineSideButtonLayoutValid',
    'Padding',
    'processTouch',
    'option',
    'checkSmartEventCollision',
    'targetOpacity',
    'BACK_QUOTE',
    'isItemStyle',
    'Abbreviation',
    'BarOffset',
    'enableDigitGroupingEx',
    'lastAnimationSprite',
    'GoldOverlap',
    '_centerElement',
    'isMenuButtonAssistEnabled',
    'terminate',
    '_textQueue',
    'CLOSE_CURLY_BRACKET',
    'return\x200',
    'CommandBgType',
    'Game_Picture_updateRotation',
    '_refreshBack',
    'BasicParameterFormula',
    'tileHeight',
    'IconSParam2',
    'TextManager_param',
    '_digitGrouping',
    'textHeight',
    'scrollRight',
    '_cancelButton',
    'LINEAR',
    'isMaskingEnabled',
    'createMenuButton',
    'PixelateImageRendering',
    'worldTransform',
    'setupButtonImage',
    'save',
    'setWindowPadding',
    'TGR',
    '【%1】\x0a',
    '_pageupButton',
    'WIN_ICO_00',
    'createTitleButtons',
    '\x20Origin:\x20%1',
    'isInputting',
    'BuyRect',
    'STENCIL_BUFFER_BIT',
    'Spriteset_Base_isAnimationPlaying',
    'gainItem',
    'isLoopHorizontal',
    'ShortcutScripts',
    'contentsBack',
    'maxLvGaugeColor1',
    'isGameActive',
    'buttonAssistOffset%1',
    '_tile',
    'drawItem',
    'Subtitle',
    'join',
    'iconHeight',
    'horizontal',
    '_onLoad',
    'members',
    '_shakePower',
    'ShowJS',
    'Window_EquipItem_isEnabled',
    'useDigitGrouping',
    '_hp',
    'center',
    'F21',
    '_stored_systemColor',
    'updateShadow',
    'keyCode',
    'nickname',
    'IconSet',
    'isPressed',
    'Window_Scrollable_update',
    'BKSP',
    '_isButtonHidden',
    'ParseTilesetNotetags',
    'CIRCUMFLEX',
    'paramFlatJS',
    'areButtonsHidden',
    '_itemWindow',
    'playtestQuickLoad',
    'INCIRC',
    'skillId',
    'FadeSpeed',
    'isBusy',
    'ParseArmorNotetags',
    'TextStr',
    'helpWindowRect',
    '_effectsContainer',
    'MAT',
    'consumable',
    'scrollUp',
    'MAX_SAFE_INTEGER',
    'ActorHPColor',
    'createPointAnimation',
    'createPointAnimationQueue',
    'toUpperCase',
    'Click\x20\x22Copy\x20Page\x22\x20from\x20another\x20tileset\x27s\x20pages',
    'moveRelativeToResolutionChange',
    'helpAreaBottom',
    'targetBackOpacity',
    'isSpecialCode',
    'createTileExtendSprites',
    'destroy',
    'bitmapWidth',
    'measureText',
    'Window_Base_initialize',
    '》Comment《\x0a%1\x0a',
    'process_VisuMZ_CoreEngine_Functions',
    'iconWidth',
    'tileset',
    'ARRAYFUNC',
    'Window_NameInput_cursorRight',
    '_subject',
    'left',
    'loadTitle2',
    '(\x5cd+)>',
    'processAlwaysEscape',
    'VisuMZ_1_BattleCore',
    'style',
    'EditBgType',
    '_shakeSpeed',
    'sqrt',
    'CommandWidth',
    'match',
    'updateFauxAnimations',
    'adjustBoxSize',
    'Scene_Base_createWindowLayer',
    'getLastPluginCommandInterpreter',
    'buttonAssistOffset1',
    'AccuracyBoost',
    'SEMICOLON',
    'IconXParam6',
    'PRESERVCONVERSION(%1)',
    'FontShadows',
    'height',
    'responseText',
    'pressed',
    'SParamVocab8',
    'reserveNewGameCommonEvent',
    'CustomParamAbb',
    'updateEffekseer',
    '_displayY',
    'reserveCommonEvent',
    'EVA',
    'Type',
    'end',
    'StatusParamsBgType',
    'Unnamed',
    '_inputString',
    'seVolume',
    'clear',
    'savefileInfo',
    'SideView',
    'SParamVocab5',
    'DEFAULT_SHIFT_Y',
    'Sprite_Button_updateOpacity',
    'WIN_OEM_PA3',
    'updateScene',
    'outlineColorDmg',
    'levelUp',
    'selectLast',
    '_duration',
    'clearZoom',
    'PictureEraseRange',
    'makeCoreEngineCommandList',
    'ShowActorLevel',
    '_offsetY',
    'KeyItemProtect',
    'DIVIDE',
    'XParamVocab7',
    'Bitmap_initialize',
    'TextCodeNicknames',
    'createTextState',
    'numRepeats',
    'createCustomParameter',
    'OUTELASTIC',
    '%1〘Choice\x20%2〙\x20%3%1',
    'Game_BattlerBase_initMembers',
    '1kaJhrQ',
    'pitch',
    '_actor',
    'EQUAL',
    'ESC',
    'initVisuMZCoreEngine',
    'item',
    'ConvertParams',
    '_scene',
    'VOLUME_DOWN',
    'Window_Base_destroyContents',
    '_targetX',
    'PageChange',
    'ENTER',
    'randomJS',
    'ctrlKey',
    'isTriggered',
    'PLAY',
    'BattleManager_processEscape',
    'AutoScrollLockX',
    '_targetAnchor',
    'profileWindowRect',
    'useDigitGroupingEx',
    'RightMenus',
    'prepareNextScene',
    'AGI',
    'ApplyEasing',
    'isAlive',
    'sv_enemies',
    'DisplayLockY',
    'vertJS',
    'isOpen',
    'runCombinedScrollingTextAsCode',
    'Game_Picture_initBasic',
    'PictureRotateBy',
    'cancel',
    'default',
    'framebuffer',
    'BACKSPACE',
    'SnapshotOpacity',
    'update',
    'altKey',
    'BACK_SLASH',
    'loadTileset',
    '%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.',
    'registerCommand',
    'INELASTIC',
    'missed',
    'width',
    'ProfileRect',
    'HOME',
    'updatePictureCoordinates',
    '1.4.4',
    'setupBattleTestItems',
    '\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%2\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27JS\x20Quick\x20Function\x20\x22%1\x22\x20Error!\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20',
    'DummyBgType',
    '_encounterCount',
    'INBOUNCE',
    'createChildSprite',
    '_hideButtons',
    'Game_Picture_y',
    'Game_Picture_calcEasing',
    'isHandled',
    'OpenURL',
    '<JS\x20%1\x20%2:[\x20](.*)>',
    '_lastCommandSymbol',
    'playCursor',
    '_rate',
    'repeat',
    'up2',
    'SplitEscape',
    'PictureID',
    'clearStencil',
    'sin',
    'darwin',
    'initMembersCoreEngine',
    'Input_onKeyDown',
    'KeySHIFT',
    'PositionX',
    'startAnimation',
    'Game_Map_scrollLeft',
    '_refreshPauseSign',
    'RequireFocus',
    'SystemSetFontSize',
    '_stored_maxLvGaugeColor2',
    'textColor',
    'targetEvaRate',
    '_targetOpacity',
    'StatusBgType',
    'isArrowPressed',
    'overallWidth',
    '_fauxAnimationQueue',
    '799438koyMAm',
    'paramBase',
    'AudioChangeBgmVolume',
    'buttonAssistKey5',
    'Window_Base_drawIcon',
    'Window_Selectable_processCursorMove',
    'exportAllTroopStrings',
    '_maxDigits',
    'onlyfilename',
    'WIN_OEM_FINISH',
    'executeLoad',
    'process_VisuMZ_CoreEngine_Notetags',
    'removeChild',
    'ATTN',
    'NUM',
    'Game_Action_setAttack',
    'damageColor',
    'Sprite_Battler_startMove',
    '_pictureCoordinatesMode',
    'createCancelButton',
    'platform',
    '_allTextHeight',
    'contentsOpacity',
    'keyboard',
    'addEventListener',
    'deathColor',
    'NUMPAD3',
    'maxTurns',
    'Graphics_defaultStretchMode',
    '_stored_tpGaugeColor1',
    'gainSilentTp',
    'process_VisuMZ_CoreEngine_CustomParameters',
    'playBgm',
    '_editWindow',
    'movePageButtonSideButtonLayout',
    '_helpWindow',
    'addCommand',
    'object',
    'updateDashToggle',
    '_currentBgm',
    '_onceParallelInterpreters',
    '11810mdpeOh',
    'connected',
    'Game_Map_scrollDown',
    'resetBattleSystem',
    'WIN_OEM_ATTN',
    'UpdatePictureCoordinates',
    'SceneManager_isGameActive',
    'Speed',
    'setTopRow',
    'updateMove',
    'Center',
    'setupNewGame',
    'Settings',
    'equips',
    'drawBackground',
    'VisuMZ_2_BattleSystemBTB',
    'TAB',
    'offset',
    'initCoreEngineScreenShake',
    'itemHit',
    'getKeyboardInputButtonString',
    'indexOf',
    '_repositioned',
    'drawRightArrow',
    'Scene_Shop_create',
    'paramPlus',
    'NON_FRAME',
    'GoldBgType',
    'PRINT',
    'Sprite_Gauge_currentValue',
    'updateBackOpacity',
    'adjustY',
    'Sprite_Picture_loadBitmap',
    '9VpyMGN',
    '_onError',
    'ExportCurMapText',
    'ParseActorNotetags',
    'editWindowRect',
    '0.00',
    'replace',
    'EnableNumberInput',
    'gaugeRate',
    '_url',
    '_commonEventLayers',
    'Game_Character_processMoveCommand',
    'destroyed',
    'isExpGaugeDrawn',
    '_lastScrollBarValues',
    'Scene_Item_create',
    'ParseItemNotetags',
    'map',
    'onEscapeSuccess',
    'makeCommandList',
    'isClosing',
    'Bitmap_drawText',
    'MODECHANGE',
    'zoomScale',
    'addChildToBack',
    'LevelUpFullMp',
    'paramPlusJS',
    '_srcBitmap',
    'updatePosition',
    'numActions',
    'popScene',
    'parse',
    'helpAreaTop',
    'updateOpacity',
    'ALWAYS',
    'createBackground',
    'pointY',
    'OUTBOUNCE',
    'processKeyboardHandling',
    'MDF',
    'ColorHPGauge1',
    'expRate',
    'LevelUpFullHp',
    'IconSParam8',
    '%1%2',
    'setEasingType',
    '_timeDuration',
    'faceWidth',
    'Graphics_printError',
    'XParamVocab4',
    'BgFilename2',
    'setAnchor',
    '_changingClass',
    'applyForcedGameTroopSettingsCoreEngine',
    'MAXHP',
    'buttonAssistSwitch',
    'currentValue',
    'createSubSprite',
    'EnableNameInput',
    'OptionsRect',
    'moveMenuButtonSideButtonLayout',
    'Bitmap_measureTextWidth',
    'colSpacing',
    'Scene_Map_initialize',
    'ParseAllNotetags',
    'ParseStateNotetags',
    'Bitmap_resize',
    'WASD',
    'Export\x20Troop\x20Text\x20operation\x20will\x20finish\x20in\x20%1\x20ms(s)',
    'NewGameBoot',
    'font-smooth',
    'ACCEPT',
    'xparamFlat2',
    'initialize',
    'showIncompleteTilesetError',
    'maxVert',
    'createScrollBarSprites',
    'EncounterRateMinimum',
    '1445095mwOYJz',
    'destroyCoreEngineMarkedBitmaps',
    'paramRate',
    'opacity',
    '_name',
    '_battlerName',
    'areTileShadowsHidden',
    'buttonAreaHeight',
    'scaleX',
    'WARNING:\x20%1\x20has\x20already\x20been\x20declared\x0aand\x20cannot\x20be\x20used\x20as\x20a\x20Quick\x20JS\x20Function',
    'IconSParam9',
    'drawCircle',
    'terms',
    'setHandler',
    'rightArrowWidth',
    'stencilOp',
    'updateText',
    'create',
    'ColorTPCost',
    'blt',
    'DrawItemBackgroundJS',
    'SELECT',
    'maxScrollbar',
    '_displayX',
    'isMagical',
    'round',
    'image-rendering',
    '_pressed',
    'WIN_OEM_PA2',
    'SLASH',
    'isEnabled',
    'buttonAssistOffset2',
    'ExportAllTroopText',
    'deactivate',
    'setActorHomeRepositioned',
    'updatePlayTestF7',
    'outlineColor',
    'activate',
    'TargetAngle',
    'buttonAssistOffset5',
    'get',
    'version',
    'ItemHeight',
    'seek',
    'updateDocumentTitle',
    'tab',
    'erasePicture',
    'onNameOk',
    'sv_actors',
    'updateTransform',
    '_bgmBuffer',
    'mainAreaHeight',
    'DigitGroupingGaugeSprites',
    'ColorCTGauge2',
    'buttonAssistWindowSideRect',
    'OUTCUBIC',
    '_viewportSize',
    'advanced',
    'loadSystemImages',
    'ImprovedAccuracySystem',
    '_shakeDuration',
    'updatePadding',
    'updatePictureSettings',
    'battlebacks2',
    'smooth',
    'WIN_OEM_WSCTRL',
    'setValue',
    'OS_KEY',
    'Scene_Boot_updateDocumentTitle',
    'DetachBattlePictureContainer',
    'clamp',
    'Game_Interpreter_PluginCommand',
    'CustomParamNames',
    'COLON',
    '%1:\x20Exit\x20',
    'setBackgroundOpacity',
    'SceneManager_initialize',
    'HelpRect',
    'Scene_Map_createMenuButton',
    'XParamVocab0',
    'anchor',
    'XParamVocab1',
    'xparamRate2',
    'Symbol',
    'JSON',
    'CONTEXT_MENU',
    '%1\x0a',
    'getBattleSystem',
    'sceneTerminationClearEffects',
    'Game_Map_setup',
    'This\x20scene\x20cannot\x20utilize\x20a\x20Once\x20Parallel!',
    '_mode',
    'PictureFilename',
    'isTileExtended',
    'NUMPAD8',
    'ShiftR_Toggle',
    'Window_StatusBase_drawActorSimpleStatus',
    '_showDevTools',
    'TextJS',
    'Game_Screen_initialize',
    'DisplayedParams',
    '_coreEasing',
    'IconXParam2',
    'isMapScrollLinked',
    'needsUpdate',
    'animationNextDelay',
    'setupCoreEngine',
    'valueOutlineWidth',
    'Export\x20Map\x20Text\x20operation\x20will\x20finish\x20in\x20%1\x20ms(s)',
    'VisuMZ_2_BattleSystemOTB',
    'drawAllParams',
    '_pictureContainer',
    'Sprite_Actor_setActorHome',
    'fillRect',
    'processBack',
    'VisuMZ_2_BattleSystemFTB',
    'dummyWindowRect',
    'inBattle',
    'bgs',
    'getPointAnimationLayer',
    'PRINTSCREEN',
    'Scene_Title',
    'smoothSelect',
    'OUTQUAD',
    'requestMotion',
    'outlineColorGauge',
    'playLoad',
    'windowOpacity',
    '_screenY',
    'Duration',
    'exportAllMapStrings',
    'etypeId',
    'setSideButtonLayout',
    'Window_Base_drawFace',
    'Scene_Boot_loadSystemImages',
    'INOUTBACK',
    'Game_Picture_scaleY',
    'padZero',
    '_sideButtonLayout',
    'setCoreEngineScreenShakeStyle',
    'OutlineColor',
    'cursorPageup',
    '_isPlaytest',
    'smallParamFontSize',
    'easingType',
    'pow',
    'xparam',
    'ColorCrisis',
    'Input_shouldPreventDefault',
    'paramFlatBonus',
    'AudioChangeBgsPitch',
    'actorWindowRect',
    'updateRotation',
    'statusEquipWindowRect',
    'gainGold',
    'Game_Picture_updateMove',
    'ParseSkillNotetags',
    'isSceneMap',
    'maxScrollY',
    'isActiveTpb',
    'TranslucentOpacity',
    '〘Common\x20Event\x20%1:\x20%2〙\x20End',
    'playBgs',
    'crisisColor',
    'drawTextEx',
    '_optionsWindow',
    'paramRate1',
    'isPointAnimationPlaying',
    'drawNewParam',
    'IconParam0',
    'NONCONVERT',
    'Sprite_AnimationMV_processTimingData',
    'buyWindowRect',
    'TRAIT_PARAM',
    'rowSpacing',
    'NUMPAD0',
    'PA1',
    'NumberRect',
    'ZERO',
    'updateBgmParameters',
    'setEnemyAction',
    'SystemSetSideView',
    'applyCoreEasing',
    'OffBarColor',
    'loading',
    'Game_Event_isCollidedWithEvents',
    'pictureId',
    'SystemSetWindowPadding',
    'isSideView',
    'showFauxAnimations',
    'Enemy-%1-%2',
    'EXSEL',
    'paramX',
    'Window_ShopSell_isEnabled',
    '_stored_ctGaugeColor1',
    'subjectHitRate',
    'ALTGR',
    'ColorMaxLvGauge2',
    'Scene_Battle_update',
    'Scene_Map_createSpritesetFix',
    'Title',
    'drawFace',
    'Upper\x20Left',
    'ControllerButtons',
    'IDs',
    'isMVAnimation',
    '_commandList',
    'level',
    'ExtractStrFromTroop',
    'startNormalGame',
    'Chance',
    'switchModes',
    'isGamepadConnected',
    'ExtDisplayedParams',
    'CEV',
    'NEAREST',
    'GroupDigits',
    'enabled',
    'expGaugeColor1',
    'ctrl',
    '_coreEasingType',
    '_text',
    'cursorUp',
    'playTestF7',
    'updatePositionCoreEngineShakeRand',
    'battleSystem',
    'arePageButtonsEnabled',
    'VisuMZ_3_EventChainReact',
    '_image',
    'systemColor',
    'MaxDuration',
    'cursorDown',
    'itemEva',
    'EquipMenu',
    'INEXPO',
    'rgba(0,\x200,\x200,\x200.7)',
    'changeAnglePlusData',
    'removePointAnimation',
    'buttonAssistOffset4',
    'paramValueByName',
    'subtitle',
    'skillTypeWindowRect',
    'hpGaugeColor2',
    'allowShiftScrolling',
    'globalAlpha',
    'expGaugeColor2',
    'traitsPi',
    'isActor',
    'initialBattleSystem',
    'endAction',
    'ActorTPColor',
    'refreshScrollBarBitmap',
    'DOWN',
    'commandWindowRect',
    'scrollbar',
    'pages',
    'changeClass',
    '_categoryWindow',
    'retrievePointAnimation',
    'getControllerInputButtonMatch',
    'Game_Party_consumeItem',
    'cursorRight',
    '_stored_deathColor',
    'REC',
    '_textPopupWindow',
    '_scaleY',
    'slotWindowRect',
    'buttonAssistText2',
    'adjustSprite',
    'inputWindowRect',
    'key%1',
    'TextPopupShow',
    'enemies',
    'move',
    'CategoryBgType',
    'NameMenu',
    'moveCancelButtonSideButtonLayout',
    'makeTargetSprites',
    '_lastIconIndex',
    'startMove',
    '_tempActor',
    'Window_NameInput_cursorPageup',
    'titles1',
    'fadeSpeed',
    '_statusWindow',
    'BattleManager_checkSubstitute',
    'xScrollLinkedOffset',
    'drawParamName',
    'Window_Selectable_itemRect',
    '_targetScaleX',
    '_tileExtendSprites',
    'OUTQUART',
    'boxHeight',
    'Scene_GameEnd_createBackground',
    '_setupEventHandlers',
    'CorrectSkinBleeding',
    'HASH',
    '_height',
    'createFauxAnimationSprite',
    'initDigitGrouping',
    'ALT',
    'right',
    'Game_Actor_levelUp',
    'Window_Selectable_processTouch',
    'createPointAnimationSprite',
    'Name',
    'isLoopVertical',
    'pictureButtons',
    'isFullDocumentTitle',
    'ItemRect',
    'updateMain',
    '_troopId',
    'keyMapper',
    'isSceneBattle',
    'State-%1-%2',
    'LoadMenu',
    '_tileSprite',
    'stringKeyMap',
    'flush',
    'IconXParam8',
    'maxTp',
    'Finish',
    'DefaultStyle',
    'StateIconsNonFrame',
    'WIN_ICO_HELP',
    'buttonAssistText3',
    'command355',
    'currencyUnit',
    '_inputWindow',
    'drawActorExpGauge',
    'checkSubstitute',
    'atypeId',
    'updateMotion',
    '%1〘Choice\x20Cancel〙%1',
    'scaleSprite',
    'F11',
    '_makeFontNameText',
    'parseForcedGameTroopSettingsCoreEngine',
    'BoxMargin',
    '_clientArea',
    'description',
    'sparamFlatBonus',
    'targets',
    'list',
    'Input_clear',
    'NUMPAD2',
    'strokeRect',
    'length',
    'Window_MapName_refresh',
    'xparamFlat1',
    'isAutoColorAffected',
    'hideButtonFromView',
    'Bitmap_blt',
    'Keyboard',
    'innerWidth',
    'toString',
    'F12',
    'prototype',
    'targetY',
    'removeFauxAnimation',
    'SceneManager_exit',
    'createPageButtons',
    '\x5c}❪SHIFT❫\x5c{',
    'SideButtons',
    'stypeId',
    'Sprite_StateIcon_loadBitmap',
    'filterArea',
    '_upArrowSprite',
    'cancelShowButton',
    'WIN_OEM_FJ_LOYA',
    'INSINE',
    '_currentMap',
    'Window_NumberInput_start',
    '_tilemap',
    'PositionJS',
    'processEscape',
    'setLastGamepadUsed',
    'render',
    'KEEP',
    'initBasic',
    'ParseEnemyNotetags',
    'dashToggle',
    'isInstanceOfSceneMap',
    'categoryWindowRect',
    'isClosed',
    'drawParamText',
    'Game_System_initialize',
    '_inputSpecialKeyCode',
    'centerY',
    'scrollDown',
    'offColor',
    'font',
    'setDisplayPos',
    'applyEasingAnglePlus',
    'buttonAssistKey3',
    'ExportCurTroopText',
    'Window_refreshBack',
    'WIN_OEM_FJ_JISHO',
    'DimColor1',
    '_pointAnimationSprites',
    'ExtJS',
    'Rate2',
    'X:\x20%1',
    '_context',
    'RowSpacing',
    'INOUTCUBIC',
    '%1/',
    'powerDownColor',
    'levelUpRecovery',
    'framesMax',
    'animations',
    'drawTextTopAligned',
    'StatusEquipBgType',
    'addQueue',
    'BattleSystem',
    'getCombinedScrollingText',
    'Icon',
    'printError',
    'dimColor1',
    'getGamepads',
    'xparamPlusJS',
    'Scene_Unlisted',
    'Scene_Map_update',
    'EQUALS',
    'Window_NumberInput_processDigitChange',
    'BarBodyColor',
    'DimColor2',
    '_slotWindow',
    'Plus',
    'waiting',
    'TitleCommandList',
    'atbActive',
    'pageup',
    'current',
    'Game_Action_updateLastTarget',
    '_windowLayer',
    'HRG',
    'animationBaseDelay',
    'ARRAYEVAL',
    'ColorTPGauge2',
    'SkillTypeRect',
    'windowPadding',
    'centerCameraCheckData',
    'process_VisuMZ_CoreEngine_jsQuickFunctions',
    'SETTINGS',
    '_buttonAssistWindow',
    'updateOnceParallelInterpreters',
    'Game_Map_scrollRight',
    'updatePointAnimations',
    'createCustomBackgroundImages',
    '_drawTextOutline',
    'drawActorLevel',
    'displayName',
    'params',
    'random',
    'Spriteset_Base_destroy',
    '_width',
    'integer',
    'ShopMenu',
    'MenuLayout',
    'traitObjects',
    'toFixed',
    'STENCIL_TEST',
    'position',
    'RepositionEnemies',
    'down2',
    '_coreEngineShakeStyle',
    'Scene_MenuBase_mainAreaHeight',
    'setViewportCoreEngineFix',
    'Window_NameInput_processHandling',
    'openURL',
    'isNumpadPressed',
    'centerX',
    'itemWindowRect',
    'SParamVocab9',
    'resetFontSettings',
    'OpenSpeed',
    'OUTCIRC',
    'FontSmoothing',
    'mhp',
    'updateLastTarget',
    'retrieveFauxAnimation',
    'SPACE',
    'meVolume',
    'Window_Base_drawText',
    'itemHitImprovedAccuracy',
    'RevertPreserveNumbers',
    'ColorCTGauge1',
    'duration',
    'nextLevelExp',
    '_hideTileShadows',
    'DETACH_PICTURE_CONTAINER',
    'updateOrigin',
    'createJsQuickFunction',
    'checkPlayerLocation',
    'updateData',
    'ADD',
    '《《《\x20Page\x20%1\x20》》》\x0a%2\x0a',
    'angle',
    'ColorManager_loadWindowskin',
    'XParamVocab9',
    'IconParam2',
    'drawGameTitle',
    'itemBackColor2',
    'createCommandWindow',
    'numberShowButton',
    'ModernControls',
    'Window_StatusBase_drawActorLevel',
    'CustomParamIcons',
    'WIN_OEM_CLEAR',
    'helpAreaTopSideButtonLayout',
    'MIN_SAFE_INTEGER',
    '_phase',
    'scaleMode',
    'Game_Picture_scaleX',
    'IconIndex',
    'ListRect',
    'sparamFlat2',
    'command105',
    '_sellWindow',
    'setupRate',
    'CommonEventID',
    '_list',
    'STB',
    'createContents',
    'keyRepeatWait',
    'expParams',
    'CANCEL',
    'updatePictureAntiZoom',
    'maxVisibleItems',
    'addOnceParallelInterpreter',
    'pictures',
    'touchUI',
    'drawValue',
    'DataManager_setupNewGame',
    'enable',
    'QUESTION_MARK',
    'windowRect',
    'targetX',
    'loadBitmapCoreEngine',
    'Scene_Title_drawGameTitle',
    'catchLoadError',
    'XParamVocab5',
    'updateDuration',
    'forceOutOfPlaytest',
    'createDigits',
    'Window',
    'catchUnknownError',
    '_stored_pendingColor',
    '_playtestF7Looping',
    'split',
    'constructor',
    'maxLvGaugeColor2',
    'BlurFilter',
    'onMoveEnd',
    'mainCommandWidth',
    '#%1',
    'hasEncryptedImages',
    'removeAnimation',
    'img/%1/',
    'loadTitle1',
    'ColorNormal',
    '_storedMapText',
    '_menuButton',
    'IconXParam5',
    'command122',
    'getBackgroundOpacity',
    'GetParamIcon',
    '_numberWindow',
    'Map%1.json',
    'SellRect',
    'tpCostColor',
    'Armor-%1-%2',
    'initCoreEasing',
    'drawActorSimpleStatus',
    '_colorCache',
    'displayY',
    'fillText',
    'pos',
    'Color',
    'type',
    'ItemBackColor1',
    'SubfolderParse',
    'Game_Actor_changeClass',
    'win32',
    'isSmartEventCollisionOn',
    'removeAllFauxAnimations',
    'CTB',
    'Scene_Base_terminate',
    'baseTextRect',
    'Bitmap_drawTextOutline',
    '([\x5c+\x5c-]\x5cd+)([%％])>',
    'WIN_ICO_CLEAR',
    'calcCoreEasing',
    'numberWindowRect',
    'Window_NameInput_refresh',
    '_tileExtendTerrainTags',
    'reduce',
    'checkScrollBarBitmap',
    'drawGameSubtitle',
    '_drawTextShadow',
    '_gamepadWait',
    'ExtractStrFromMap',
    'Game_Troop_setup',
    'bodyColor',
    '_currentBgs',
    'getParameter',
    'PictureEasingType',
    'updateAnchor',
    'ExtractStrFromList',
    'processMoveCommand',
    'OTB',
    'drawGameVersion',
    'Show\x20Scrolling\x20Text\x20Script\x20Error',
    'innerHeight',
    'Game_Action_itemHit',
    'defineProperty',
    'call',
    'isTouchedInsideFrame',
    'animationId',
    'targetContentsOpacity',
    '_forcedBattleSys',
    'layoutSettings',
    'setSize',
    'TRG',
    'isRepeated',
    '_updateFilterArea',
    'Bitmap_drawCircle',
    'menuShowButton',
    'ParamMax',
    'PTB',
    'charAt',
    'OptionsBgType',
    'Window_Selectable_cursorUp',
    'NUM_LOCK',
    'ONE',
    'Spriteset_Map_createTilemap',
    'Scene_Base_create',
    'isEnemy',
    'displayX',
    'SUBTRACT',
    'ButtonFadeSpeed',
    'isAnimationOffsetXMirrored',
    'gradientFillRect',
    'PAUSE',
    'saveViewport',
    'OptionsMenu',
    'Input_updateGamepadState',
    'Rate1',
    'Input_update',
    'Pixelated',
    'process_VisuMZ_CoreEngine_Settings',
    'FontWidthFix',
    'getButtonAssistLocation',
    'showPicture',
    'setFrame',
    '$dataMap',
    '_bgsBuffer',
    'Window_Gold_refresh',
    'Flat2',
    'isCancelled',
    'HelpBgType',
    'shake',
    'select',
    'setup',
    'framesMin',
    'isPhysical',
    'VisuMZ_1_OptionsCore',
    'VisuMZ_2_BattleSystemPTB',
    'GREATER_THAN',
    'Actor-%1-%2',
    '_origin',
    '_screenX',
    'SParamVocab1',
    'DocumentTitleFmt',
    'Scene_MenuBase_createBackground',
    'DEF',
    'process_VisuMZ_CoreEngine_ControllerButtons',
    'Scene_Skill_create',
    'getColorDataFromPluginParameters',
    'sellWindowRect',
    'clearCachedKeys',
    'dropItems',
    'INOUTQUART',
    'createEnemies',
    'optSideView',
    'Window_Base_update',
    'guardSkillId',
    'ExportStrFromAllTroops',
    'itemHeight',
    'open',
    'F19',
    'WIN_OEM_COPY',
    'statusParamsWindowRect',
    'MRG',
    'Game_Picture_move',
    'getTileExtendTerrainTags',
    'ASTERISK',
    'Game_Event_start',
    '_scaleX',
    'Gold',
    'mainAreaBottom',
    'filters',
    'mpGaugeColor2',
    'processCursorMoveModernControls',
    'processFauxAnimationRequests',
    'Scene_Map_updateMain',
    'Linear',
    'addWindow',
    'VisuMZ_4_UniqueTileEffects',
    'F16',
    'operand',
    'hit',
    'start',
    'CRI',
    'drawGoldItemStyle',
    'SwitchActorText',
    'top',
    'createButtonAssistWindow',
    'createTilemap',
    '_eventId',
    'en-US',
    'ActorRect',
    '_centerCameraCheck',
    'mapId',
    'AudioChangeBgsPan',
    'AMPERSAND',
    '_originalViewport',
    '%2%1%3',
    'listWindowRect',
    '_actorWindow',
    'CategoryRect',
    'abs',
    'playEscape',
    'isGamepadButtonPressed',
    'Power',
    'OffBarOpacity',
    'batch',
    'drawBackgroundRect',
    'ctGaugeColor2',
    'Current\x20tileset\x20has\x20incomplete\x20flag\x20data.',
    'F23',
    'autoRemovalTiming',
    'catchNormalError',
    '_movementWholeDuration',
    'Renderer',
    'Game_Interpreter_command122',
    'createSpriteset',
    'wait',
    'scaleY',
    'SceneManager_onKeyDown',
    'targetScaleY',
    'DigitGroupingStandardText',
    'MCR',
    'isGamepadTriggered',
    'faceHeight',
    'XParamVocab3',
    '_goldWindow',
    'isFauxAnimationPlaying',
    'isPlaytest',
    'setViewport',
    '_customModified',
    'IconSParam0',
    'StartID',
    'buttonAssistKey%1',
    'ItemPadding',
    '_active',
    'recoverAll',
    '2321yxmMCC',
    'Scene_MenuBase_createPageButtons',
    'onerror',
    'WIN_OEM_ENLW',
    'processTimingData',
    'learnings',
    'WindowLayer_render',
    'IconSParam7',
    'maxLevel',
    'isWindowMaskingEnabled',
    'tilesetNames',
    'buttonAssistKey4',
    'changeTextColor',
    'push',
    'Scene_Load',
    'bgm',
    '_lastY',
    'setClickHandler',
    'CustomParamType',
    'WIN_OEM_BACKTAB',
    'eva',
    'LEFT',
    'FINAL',
    'value',
    '_realScale',
    '_targetOffsetX',
    'isUseModernControls',
    'DebugConsoleLastControllerID',
    'min',
    'sparamPlusJS',
    'ColorTPGauge1',
    'checkCoreEngineDisplayCenter',
    '_pictureCoordinatesWindow',
    'outbounce',
    '_scrollBarVert',
    'mirror',
    'wtypeId',
    'createTroopNote',
    'shouldAutosave',
    'children',
    'visible',
    'CommandRect',
    'skillTypes',
    'WIN_OEM_AUTO',
    'trim',
    'setTileFrame',
    'getInputButtonString',
    'drawCurrencyValue',
    'xparamRateJS',
    'disable',
    '_stored_maxLvGaugeColor1',
    'endAnimation',
    'tpGaugeColor2',
    'KeyUnlisted',
    'StatusRect',
    'ColorMPGauge1',
    'Param',
    'loadGameImagesCoreEngine',
    'Origin',
    'ceil',
    'KeyTAB',
    'Sprite_StateIcon_updateFrame',
    'stencilFunc',
    'CTRL',
    'XParameterFormula',
    'sparamPlus1',
    'AnimationPoint',
    'PHA',
    '_backgroundSprite',
    'processHandling',
    'buttonAssistText%1',
    'onActorChange',
    'GoldMax',
    'useFontWidthFix',
    'vert',
    'DATABASE',
    'PictureEraseAll',
    'storeMapData',
    'updateCoreEasing',
    'XParamVocab6',
    'ExportString',
    'Scene_Battle_createSpriteset',
    'buttons',
    'measureTextWidthNoRounding',
    'INOUTEXPO',
    'ParamArrow',
    'getLastGamepadUsed',
    'anchorCoreEasing',
    'Spriteset_Base_initialize',
    'INQUINT',
    'ARRAYSTR',
    'processKeyboardBackspace',
    '_registerKeyInput',
    'xparamFlatBonus',
    'normalColor',
    'Sprite_destroy',
    'Sprite_Picture_updateOrigin',
    'enter',
    '_colorTone',
    'SParamVocab0',
    'Scene_Map_createSpriteset_detach',
    'openingSpeed',
    'JUNJA',
    '_number',
    'pixelated',
    '_mapNameWindow',
    'close',
    'OUTQUINT',
    'text',
    'REPLACE',
    'evaluate',
    '_margin',
    'invokeCounterAttack',
    'isItem',
    'Scene_Battle_createSpritesetFix',
    'ForceNoPlayTest',
  ];
  _0x43c8 = function () {
    return _0x32af4b;
  };
  return _0x43c8();
}
var label = _0x17b060(0x77a),
  tier = tier || 0x0,
  dependencies = [],
  pluginData = $plugins['filter'](function (_0x5560a) {
    const _0x285477 = _0x17b060;
    return _0x5560a[_0x285477(0x1a4)] && _0x5560a[_0x285477(0x539)][_0x285477(0x1ae)]('[' + label + ']');
  })[0x0];
(VisuMZ[label][_0x17b060(0x382)] = VisuMZ[label]['Settings'] || {}),
  (VisuMZ[_0x17b060(0x2f8)] = function (_0x3b4416, _0xacddb4) {
    const _0x5360a9 = _0x17b060;
    for (const _0x585a11 in _0xacddb4) {
      if (_0x585a11[_0x5360a9(0x2ba)](/(.*):(.*)/i)) {
        const _0x1de12d = String(RegExp['$1']),
          _0x5fc5f1 = String(RegExp['$2'])[_0x5360a9(0x29e)]()[_0x5360a9(0x711)]();
        let _0x2d7712, _0xc11f1b, _0x1d9206;
        switch (_0x5fc5f1) {
          case _0x5360a9(0x35b):
            _0x2d7712 = _0xacddb4[_0x585a11] !== '' ? Number(_0xacddb4[_0x585a11]) : 0x0;
            break;
          case _0x5360a9(0x859):
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : []), (_0x2d7712 = _0xc11f1b['map'](_0x1ed892 => Number(_0x1ed892)));
            break;
          case 'EVAL':
            _0x2d7712 = _0xacddb4[_0x585a11] !== '' ? eval(_0xacddb4[_0x585a11]) : null;
            break;
          case _0x5360a9(0x59b):
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : []), (_0x2d7712 = _0xc11f1b[_0x5360a9(0x3a8)](_0x4534c4 => eval(_0x4534c4)));
            break;
          case _0x5360a9(0x439):
            _0x2d7712 = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : '';
            break;
          case 'ARRAYJSON':
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON['parse'](_0xacddb4[_0x585a11]) : []), (_0x2d7712 = _0xc11f1b[_0x5360a9(0x3a8)](_0x5a3aee => JSON[_0x5360a9(0x3b6)](_0x5a3aee)));
            break;
          case 'FUNC':
            _0x2d7712 = _0xacddb4[_0x585a11] !== '' ? new Function(JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11])) : new Function(_0x5360a9(0x24c));
            break;
          case _0x5360a9(0x2ad):
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : []),
              (_0x2d7712 = _0xc11f1b[_0x5360a9(0x3a8)](_0x3511c3 => new Function(JSON[_0x5360a9(0x3b6)](_0x3511c3))));
            break;
          case 'STR':
            _0x2d7712 = _0xacddb4[_0x585a11] !== '' ? String(_0xacddb4[_0x585a11]) : '';
            break;
          case _0x5360a9(0x73f):
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON['parse'](_0xacddb4[_0x585a11]) : []), (_0x2d7712 = _0xc11f1b[_0x5360a9(0x3a8)](_0x289ea1 => String(_0x289ea1)));
            break;
          case _0x5360a9(0x88b):
            (_0x1d9206 = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : {}), (_0x3b4416[_0x1de12d] = {}), VisuMZ['ConvertParams'](_0x3b4416[_0x1de12d], _0x1d9206);
            continue;
          case _0x5360a9(0x18b):
            (_0xc11f1b = _0xacddb4[_0x585a11] !== '' ? JSON[_0x5360a9(0x3b6)](_0xacddb4[_0x585a11]) : []),
              (_0x2d7712 = _0xc11f1b[_0x5360a9(0x3a8)](_0x47faf2 => VisuMZ[_0x5360a9(0x2f8)]({}, JSON[_0x5360a9(0x3b6)](_0x47faf2))));
            break;
          default:
            continue;
        }
        _0x3b4416[_0x1de12d] = _0x2d7712;
      }
    }
    return _0x3b4416;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x54d)] = SceneManager[_0x17b060(0x81a)]),
  (SceneManager[_0x17b060(0x81a)] = function () {
    const _0x224270 = _0x17b060;
    VisuMZ[_0x224270(0x77a)][_0x224270(0x54d)][_0x224270(0x64e)](this);
    if (Utils[_0x224270(0x232)] >= _0x224270(0x325)) {
      if (typeof nw === _0x224270(0x372)) nw['App'][_0x224270(0x1cf)]();
    }
  }),
  (_0x1936a0 => {
    const _0x30be9d = _0x17b060,
      _0x8eb08b = _0x1936a0[_0x30be9d(0x142)];
    for (const _0x597fa4 of dependencies) {
      if (!Imported[_0x597fa4]) {
        alert(_0x30be9d(0x7da)[_0x30be9d(0x1df)](_0x8eb08b, _0x597fa4)), SceneManager[_0x30be9d(0x81a)]();
        break;
      }
    }
    const _0x28b32d = _0x1936a0['description'];
    if (_0x28b32d[_0x30be9d(0x2ba)](/\[Version[ ](.*?)\]/i)) {
      const _0x141fa1 = Number(RegExp['$1']);
      _0x141fa1 !== VisuMZ[label]['version'] && (alert(_0x30be9d(0x31d)[_0x30be9d(0x1df)](_0x8eb08b, _0x141fa1)), SceneManager[_0x30be9d(0x81a)]());
    }
    if (_0x28b32d[_0x30be9d(0x2ba)](/\[Tier[ ](\d+)\]/i)) {
      const _0x27f33a = Number(RegExp['$1']);
      _0x27f33a < tier ? (alert(_0x30be9d(0x10a)['format'](_0x8eb08b, _0x27f33a, tier)), SceneManager['exit']()) : (tier = Math[_0x30be9d(0x7f9)](_0x27f33a, tier));
    }
    VisuMZ['ConvertParams'](VisuMZ[label][_0x30be9d(0x382)], _0x1936a0[_0x30be9d(0x1d6)]);
  })(pluginData),
  (() => {
    const _0xc74098 = _0x17b060;
    if (VisuMZ[_0xc74098(0x77a)][_0xc74098(0x382)][_0xc74098(0x7ae)][_0xc74098(0x62b)] ?? !![])
      for (const _0x27c508 in $plugins) {
        const _0x1995e8 = $plugins[_0x27c508];
        _0x1995e8[_0xc74098(0x142)][_0xc74098(0x2ba)](/(.*)\/(.*)/i) && (_0x1995e8[_0xc74098(0x142)] = String(RegExp['$2']['trim']()));
      }
  })(),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x727), _0x39f637 => {
    const _0x39ef5f = _0x17b060;
    if (!SceneManager[_0x39ef5f(0x2f9)]) return;
    if (!SceneManager['_scene'][_0x39ef5f(0x10b)]) return;
    VisuMZ[_0x39ef5f(0x2f8)](_0x39f637, _0x39f637);
    const _0x33a688 = Math[_0x39ef5f(0x3fe)](_0x39f637['pointX']),
      _0x1ee92e = Math[_0x39ef5f(0x3fe)](_0x39f637[_0x39ef5f(0x3bb)]);
    $gameTemp[_0x39ef5f(0x7f0)](_0x33a688, _0x1ee92e, _0x39f637[_0x39ef5f(0x22d)], _0x39f637[_0x39ef5f(0x182)], _0x39f637[_0x39ef5f(0x1d5)]);
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x34f), _0x1e09de => {
    const _0xf5a14 = _0x17b060;
    VisuMZ[_0xf5a14(0x2f8)](_0x1e09de, _0x1e09de);
    const _0x2cfd77 = Math[_0xf5a14(0x3fe)](_0x1e09de[_0xf5a14(0x14a)])[_0xf5a14(0x42b)](0x0, 0x64),
      _0xd7f252 = AudioManager[_0xf5a14(0x374)];
    _0xd7f252 &&
      ((_0xd7f252['volume'] = _0x2cfd77),
      (_0xd7f252['pos'] = AudioManager[_0xf5a14(0x417)][_0xf5a14(0x410)]()),
      AudioManager['updateBgmParameters'](_0xd7f252),
      AudioManager[_0xf5a14(0x36d)](_0xd7f252, _0xd7f252[_0xf5a14(0x627)]),
      AudioManager['_bgmBuffer'][_0xf5a14(0x81b)](_0xd7f252[_0xf5a14(0x627)]));
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], 'AudioChangeBgmPitch', _0x392e6d => {
    const _0x507a47 = _0x17b060;
    VisuMZ['ConvertParams'](_0x392e6d, _0x392e6d);
    const _0x38af8b = Math[_0x507a47(0x3fe)](_0x392e6d[_0x507a47(0x2f2)])[_0x507a47(0x42b)](0x32, 0x96),
      _0x5c304c = AudioManager[_0x507a47(0x374)];
    _0x5c304c &&
      ((_0x5c304c[_0x507a47(0x2f2)] = _0x38af8b),
      (_0x5c304c[_0x507a47(0x627)] = AudioManager[_0x507a47(0x417)][_0x507a47(0x410)]()),
      AudioManager[_0x507a47(0x498)](_0x5c304c),
      AudioManager[_0x507a47(0x36d)](_0x5c304c, _0x5c304c[_0x507a47(0x627)]),
      AudioManager[_0x507a47(0x417)][_0x507a47(0x81b)](_0x5c304c[_0x507a47(0x627)]));
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x169), _0x44633d => {
    const _0x3a2324 = _0x17b060;
    VisuMZ[_0x3a2324(0x2f8)](_0x44633d, _0x44633d);
    const _0x3a87bc = Math[_0x3a2324(0x3fe)](_0x44633d[_0x3a2324(0x8a6)])['clamp'](-0x64, 0x64),
      _0x1afea9 = AudioManager[_0x3a2324(0x374)];
    _0x1afea9 &&
      ((_0x1afea9[_0x3a2324(0x8a6)] = _0x3a87bc),
      (_0x1afea9[_0x3a2324(0x627)] = AudioManager[_0x3a2324(0x417)][_0x3a2324(0x410)]()),
      AudioManager[_0x3a2324(0x498)](_0x1afea9),
      AudioManager[_0x3a2324(0x36d)](_0x1afea9, _0x1afea9[_0x3a2324(0x627)]),
      AudioManager['_bgmBuffer']['_startPlaying'](_0x1afea9['pos']));
  }),
  PluginManager[_0x17b060(0x31e)](pluginData['name'], _0x17b060(0x1e6), _0x16b684 => {
    const _0x7a179d = _0x17b060;
    VisuMZ[_0x7a179d(0x2f8)](_0x16b684, _0x16b684);
    const _0x4a03b5 = Math[_0x7a179d(0x3fe)](_0x16b684[_0x7a179d(0x14a)])[_0x7a179d(0x42b)](0x0, 0x64),
      _0x5800d7 = AudioManager[_0x7a179d(0x642)];
    _0x5800d7 &&
      ((_0x5800d7[_0x7a179d(0x14a)] = _0x4a03b5),
      (_0x5800d7[_0x7a179d(0x627)] = AudioManager['_bgsBuffer']['seek']()),
      AudioManager[_0x7a179d(0x16f)](_0x5800d7),
      AudioManager[_0x7a179d(0x487)](_0x5800d7, _0x5800d7[_0x7a179d(0x627)]),
      AudioManager['_bgsBuffer'][_0x7a179d(0x81b)](_0x5800d7[_0x7a179d(0x627)]));
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x47b), _0x1b0393 => {
    const _0x522e50 = _0x17b060;
    VisuMZ['ConvertParams'](_0x1b0393, _0x1b0393);
    const _0x40915f = Math[_0x522e50(0x3fe)](_0x1b0393[_0x522e50(0x2f2)])['clamp'](0x32, 0x96),
      _0x4ea46e = AudioManager[_0x522e50(0x642)];
    _0x4ea46e &&
      ((_0x4ea46e[_0x522e50(0x2f2)] = _0x40915f),
      (_0x4ea46e['pos'] = AudioManager['_bgsBuffer'][_0x522e50(0x410)]()),
      AudioManager[_0x522e50(0x16f)](_0x4ea46e),
      AudioManager['playBgs'](_0x4ea46e, _0x4ea46e[_0x522e50(0x627)]),
      AudioManager[_0x522e50(0x676)][_0x522e50(0x81b)](_0x4ea46e[_0x522e50(0x627)]));
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x6ba), _0x3c3a7f => {
    const _0xfd4976 = _0x17b060;
    VisuMZ[_0xfd4976(0x2f8)](_0x3c3a7f, _0x3c3a7f);
    const _0x279e5b = Math[_0xfd4976(0x3fe)](_0x3c3a7f['pan'])[_0xfd4976(0x42b)](-0x64, 0x64),
      _0x42555f = AudioManager[_0xfd4976(0x642)];
    _0x42555f &&
      ((_0x42555f[_0xfd4976(0x8a6)] = _0x279e5b),
      (_0x42555f['pos'] = AudioManager[_0xfd4976(0x676)]['seek']()),
      AudioManager[_0xfd4976(0x16f)](_0x42555f),
      AudioManager[_0xfd4976(0x487)](_0x42555f, _0x42555f[_0xfd4976(0x627)]),
      AudioManager[_0xfd4976(0x676)][_0xfd4976(0x81b)](_0x42555f['pos']));
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x700), _0x472807 => {
    const _0x5589fc = _0x17b060;
    if (!$gameTemp['isPlaytest']()) return;
    const _0x3900ed = Input[_0x5589fc(0x224)]();
    console[_0x5589fc(0x797)](_0x3900ed);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], 'ExportAllMapText', _0x1e691c => {
    const _0x189d5c = _0x17b060;
    if (!$gameTemp[_0x189d5c(0x6dc)]()) return;
    if (!Utils[_0x189d5c(0x185)]()) return;
    (SceneManager['_scene']['_active'] = ![]), VisuMZ[_0x189d5c(0x77a)]['ExportStrFromAllMaps']();
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x405), _0x29fe51 => {
    const _0xe1df04 = _0x17b060;
    if (!$gameTemp['isPlaytest']()) return;
    if (!Utils[_0xe1df04(0x185)]()) return;
    (SceneManager[_0xe1df04(0x2f9)]['_active'] = ![]), VisuMZ[_0xe1df04(0x77a)][_0xe1df04(0x695)]();
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x399), _0x20c5d8 => {
    const _0x113bb7 = _0x17b060;
    if (!$gameTemp[_0x113bb7(0x6dc)]()) return;
    if (!Utils[_0x113bb7(0x185)]()) return;
    if (!$gameMap) return;
    if ($gameMap[_0x113bb7(0x6b9)]() <= 0x0) return;
    VisuMZ[_0x113bb7(0x2f8)](_0x20c5d8, _0x20c5d8);
    const _0x36df58 = _0x113bb7(0x1ed)[_0x113bb7(0x1df)]($gameMap['mapId']()['padZero'](0x3)),
      _0xeb8a16 = VisuMZ[_0x113bb7(0x77a)]['ExtractStrFromMap']($gameMap[_0x113bb7(0x6b9)]());
    VisuMZ[_0x113bb7(0x77a)]['ExportString'](_0xeb8a16, _0x36df58, !![]);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x570), _0xbaa6cf => {
    const _0x3d363a = _0x17b060;
    if (!$gameTemp[_0x3d363a(0x6dc)]()) return;
    if (!Utils[_0x3d363a(0x185)]()) return;
    if (!$gameParty['inBattle']()) return;
    VisuMZ[_0x3d363a(0x2f8)](_0xbaa6cf, _0xbaa6cf);
    const _0x369d69 = _0x3d363a(0x21f)[_0x3d363a(0x1df)]($gameTroop[_0x3d363a(0x51c)][_0x3d363a(0x46e)](0x4)),
      _0x1f55f3 = VisuMZ[_0x3d363a(0x77a)][_0x3d363a(0x4b5)]($gameTroop['_troopId']);
    VisuMZ[_0x3d363a(0x77a)]['ExportString'](_0x1f55f3, _0x369d69, !![]);
  }),
  (VisuMZ['CoreEngine']['ExportString'] = function (_0x573d12, _0xb434fb, _0x30e773) {
    const _0xdc521b = _0x17b060,
      _0x30c812 = require('fs');
    let _0x1b5431 = _0xdc521b(0x839)[_0xdc521b(0x1df)](_0xb434fb || '0');
    _0x30c812['writeFile'](_0x1b5431, _0x573d12, _0x43a32b => {
      const _0x5bd402 = _0xdc521b;
      if (_0x43a32b) throw err;
      else _0x30e773 && alert('Saved\x20file\x20as\x20%1\x20in\x20project\x20folder.'[_0x5bd402(0x1df)](_0x1b5431));
    });
  }),
  (VisuMZ['CoreEngine']['ExportStrFromAllMaps'] = function () {
    const _0x504625 = _0x17b060,
      _0x5c9921 = [];
    for (const _0x272617 of $dataMapInfos) {
      if (!_0x272617) continue;
      _0x5c9921[_0x504625(0x6f2)](_0x272617['id']);
    }
    const _0x178373 = _0x5c9921[_0x504625(0x540)] * 0x64 + Math['randomInt'](0x64);
    alert(_0x504625(0x451)['format'](_0x178373)), (this[_0x504625(0x617)] = []), (this[_0x504625(0x558)] = $dataMap);
    for (const _0x1030fa of _0x5c9921) {
      VisuMZ[_0x504625(0x77a)][_0x504625(0x7cf)](_0x1030fa);
    }
    setTimeout(VisuMZ[_0x504625(0x77a)][_0x504625(0x467)][_0x504625(0x76d)](this), _0x178373);
  }),
  (VisuMZ[_0x17b060(0x77a)]['loadMapData'] = function (_0x32fd3d) {
    const _0x1fd1d3 = _0x17b060,
      _0x1b28dc = _0x1fd1d3(0x61e)[_0x1fd1d3(0x1df)](_0x32fd3d[_0x1fd1d3(0x46e)](0x3)),
      _0x15a275 = new XMLHttpRequest(),
      _0x5e1a20 = 'data/' + _0x1b28dc;
    _0x15a275['open'](_0x1fd1d3(0x7ff), _0x5e1a20),
      _0x15a275['overrideMimeType']('application/json'),
      (_0x15a275[_0x1fd1d3(0x13f)] = () => this[_0x1fd1d3(0x732)](_0x15a275, _0x32fd3d, _0x1b28dc, _0x5e1a20)),
      (_0x15a275['onerror'] = () => DataManager[_0x1fd1d3(0x822)](_0x1fd1d3(0x675), _0x1b28dc, _0x5e1a20)),
      _0x15a275[_0x1fd1d3(0x7a3)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x732)] = function (_0x33f047, _0x2240f0, _0x2fe6b1, _0x16bf30) {
    const _0x572f89 = _0x17b060;
    ($dataMap = JSON['parse'](_0x33f047[_0x572f89(0x2c6)])),
      DataManager['onLoad']($dataMap),
      (this[_0x572f89(0x617)][_0x2240f0] = VisuMZ[_0x572f89(0x77a)][_0x572f89(0x63f)](_0x2240f0)),
      ($dataMap = this[_0x572f89(0x558)]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x467)] = function () {
    const _0x420d07 = _0x17b060,
      _0x44928e = 'AllMaps';
    this[_0x420d07(0x617)][_0x420d07(0x19f)](undefined)[_0x420d07(0x19f)]('')[_0x420d07(0x19f)](null);
    const _0xa75ce = this['_storedMapText'][_0x420d07(0x274)](_0x420d07(0x75d))[_0x420d07(0x711)]();
    VisuMZ[_0x420d07(0x77a)][_0x420d07(0x735)](_0xa75ce, _0x44928e, !![]), (SceneManager[_0x420d07(0x2f9)][_0x420d07(0x6e3)] = !![]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x63f)] = function (_0x896c42) {
    const _0x55ffc8 = _0x17b060;
    if (!$dataMap) return '';
    let _0x329386 = '█'['repeat'](0x46) + '\x0a\x0a',
      _0x1b57dd = '═'['repeat'](0x46) + '\x0a\x0a',
      _0x408faa = '';
    this['_commonEventLayers'] = 0x0;
    for (const _0x34a266 of $dataMap['events']) {
      if (!_0x34a266) continue;
      let _0x3c5f6e = _0x34a266['id'],
        _0x2b81e4 = _0x34a266[_0x55ffc8(0x142)],
        _0x44a33c = _0x34a266[_0x55ffc8(0x4e4)];
      for (const _0x3814d8 of _0x44a33c) {
        const _0x5aa0a5 = _0x44a33c[_0x55ffc8(0x38b)](_0x3814d8) + 0x1;
        let _0x5750ba = _0x1b57dd + _0x55ffc8(0x1e8),
          _0x4d143f = VisuMZ[_0x55ffc8(0x77a)][_0x55ffc8(0x646)](_0x3814d8[_0x55ffc8(0x53c)]);
        if (_0x4d143f[_0x55ffc8(0x540)] > 0x0) {
          if (_0x408faa[_0x55ffc8(0x540)] > 0x0) _0x408faa += _0x1b57dd + _0x55ffc8(0x75d);
          else {
            const _0x4e8a0a = $dataMapInfos[_0x896c42]['name'];
            _0x408faa += _0x329386 + _0x55ffc8(0x819)[_0x55ffc8(0x1df)](_0x896c42, _0x4e8a0a || _0x55ffc8(0x2d2)) + _0x329386;
          }
          _0x408faa += _0x5750ba['format'](_0x3c5f6e, _0x2b81e4, _0x5aa0a5, _0x4d143f);
        }
      }
    }
    return _0x408faa['length'] > 0x0 && (_0x408faa += _0x1b57dd), _0x408faa;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x695)] = function () {
    const _0x5db182 = _0x17b060,
      _0x3910c4 = $dataTroops['length'] * 0xa + Math['randomInt'](0xa);
    alert(_0x5db182(0x3db)[_0x5db182(0x1df)](_0x3910c4));
    const _0x168642 = [];
    for (const _0x1bdd82 of $dataTroops) {
      if (!_0x1bdd82) continue;
      const _0x4d1fdd = _0x1bdd82['id'];
      _0x168642[_0x4d1fdd] = VisuMZ[_0x5db182(0x77a)]['ExtractStrFromTroop'](_0x4d1fdd);
    }
    setTimeout(VisuMZ['CoreEngine'][_0x5db182(0x353)][_0x5db182(0x76d)](this, _0x168642), _0x3910c4);
  }),
  (VisuMZ[_0x17b060(0x77a)]['ExtractStrFromTroop'] = function (_0x51a765) {
    const _0x5a3590 = _0x17b060;
    if (!$dataTroops[_0x51a765]) return '';
    let _0x25ebad = '█'[_0x5a3590(0x335)](0x46) + '\x0a\x0a',
      _0x4aafe5 = '═'['repeat'](0x46) + '\x0a\x0a',
      _0x44620f = '';
    this[_0x5a3590(0x3a1)] = 0x0;
    const _0x2b1fd6 = $dataTroops[_0x51a765];
    let _0x3658a8 = _0x2b1fd6[_0x5a3590(0x4e4)];
    for (const _0x519103 of _0x3658a8) {
      const _0x39ce02 = _0x3658a8['indexOf'](_0x519103) + 0x1;
      let _0x574bf2 = _0x4aafe5 + _0x5a3590(0x5d6),
        _0x1bcd5b = VisuMZ['CoreEngine']['ExtractStrFromList'](_0x519103[_0x5a3590(0x53c)]);
      _0x1bcd5b[_0x5a3590(0x540)] > 0x0 &&
        (_0x44620f[_0x5a3590(0x540)] > 0x0
          ? (_0x44620f += _0x4aafe5 + '\x0a\x0a\x0a\x0a\x0a')
          : (_0x44620f += _0x25ebad + '〖〖〖\x20Troop\x20%1:\x20%2\x20Script\x20〗〗〗\x0a\x0a'['format'](_0x51a765, _0x2b1fd6['name'] || _0x5a3590(0x2d2)) + _0x25ebad),
        (_0x44620f += _0x574bf2[_0x5a3590(0x1df)](_0x39ce02, _0x1bcd5b)));
    }
    return _0x44620f[_0x5a3590(0x540)] > 0x0 && (_0x44620f += _0x4aafe5), _0x44620f;
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x353)] = function (_0x4a7ec1) {
    const _0x33d522 = _0x17b060,
      _0x5269d2 = 'AllTroops';
    _0x4a7ec1[_0x33d522(0x19f)](undefined)[_0x33d522(0x19f)]('')[_0x33d522(0x19f)](null);
    const _0x156c79 = _0x4a7ec1[_0x33d522(0x274)](_0x33d522(0x75d))[_0x33d522(0x711)]();
    VisuMZ['CoreEngine'][_0x33d522(0x735)](_0x156c79, _0x5269d2, !![]), (SceneManager[_0x33d522(0x2f9)][_0x33d522(0x6e3)] = !![]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x646)] = function (_0xc1f7cd) {
    const _0x45ea67 = _0x17b060;
    let _0x5bae25 = '\x0a' + '─'[_0x45ea67(0x335)](0x46) + '\x0a',
      _0x3426b4 = '\x0a' + '┄'[_0x45ea67(0x335)](0x46) + '\x0a',
      _0x22591d = '';
    for (const _0x50df28 of _0xc1f7cd) {
      if (!_0x50df28) continue;
      if (_0x50df28[_0x45ea67(0x897)] === 0x65)
        (_0x22591d += _0x5bae25 + '\x0a'),
          (_0x22591d += _0x45ea67(0x178)),
          _0x50df28[_0x45ea67(0x1d6)][0x4] !== '' && _0x50df28[_0x45ea67(0x1d6)][0x4] !== undefined && (_0x22591d += _0x45ea67(0x261)[_0x45ea67(0x1df)](_0x50df28['parameters'][0x4]));
      else {
        if (_0x50df28[_0x45ea67(0x897)] === 0x191) _0x22591d += _0x45ea67(0x43b)['format'](_0x50df28['parameters'][0x0]);
        else {
          if (_0x50df28[_0x45ea67(0x897)] === 0x192)
            (_0x22591d += _0x5bae25), (_0x22591d += _0x45ea67(0x2ef)['format'](_0x3426b4, _0x50df28[_0x45ea67(0x1d6)][0x0] + 0x1, _0x50df28[_0x45ea67(0x1d6)][0x1]));
          else {
            if (_0x50df28[_0x45ea67(0x897)] === 0x193) (_0x22591d += _0x5bae25), (_0x22591d += _0x45ea67(0x532)[_0x45ea67(0x1df)](_0x3426b4));
            else {
              if (_0x50df28[_0x45ea67(0x897)] === 0x194) (_0x22591d += _0x5bae25), (_0x22591d += _0x45ea67(0x771)['format'](_0x3426b4));
              else {
                if (_0x50df28['code'] === 0x69) (_0x22591d += _0x5bae25 + '\x0a'), (_0x22591d += '〘Scrolling\x20Text〙\x0a');
                else {
                  if (_0x50df28['code'] === 0x6c) (_0x22591d += _0x5bae25 + '\x0a'), (_0x22591d += _0x45ea67(0x2a9)['format'](_0x50df28[_0x45ea67(0x1d6)][0x0]));
                  else {
                    if (_0x50df28[_0x45ea67(0x897)] === 0x198) _0x22591d += _0x45ea67(0x43b)[_0x45ea67(0x1df)](_0x50df28['parameters'][0x0]);
                    else {
                      if (_0x50df28['code'] === 0x75) {
                        const _0x319d61 = $dataCommonEvents[_0x50df28['parameters'][0x0]];
                        if (_0x319d61 && this['_commonEventLayers'] <= 0xa) {
                          this[_0x45ea67(0x3a1)]++;
                          let _0x3eb5ac = VisuMZ[_0x45ea67(0x77a)][_0x45ea67(0x646)](_0x319d61[_0x45ea67(0x53c)]);
                          _0x3eb5ac[_0x45ea67(0x540)] > 0x0 &&
                            ((_0x22591d += _0x5bae25),
                            (_0x22591d += _0x3426b4),
                            (_0x22591d += '〘Common\x20Event\x20%1:\x20%2〙\x20Start'[_0x45ea67(0x1df)](_0x319d61['id'], _0x319d61[_0x45ea67(0x142)])),
                            (_0x22591d += _0x3426b4),
                            (_0x22591d += _0x3eb5ac),
                            (_0x22591d += _0x3426b4),
                            (_0x22591d += _0x45ea67(0x486)[_0x45ea67(0x1df)](_0x319d61['id'], _0x319d61[_0x45ea67(0x142)])),
                            (_0x22591d += _0x3426b4)),
                            this[_0x45ea67(0x3a1)]--;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return _0x22591d[_0x45ea67(0x540)] > 0x0 && (_0x22591d += _0x5bae25), _0x22591d;
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x330), _0x48e636 => {
    const _0x5e2423 = _0x17b060;
    VisuMZ[_0x5e2423(0x2f8)](_0x48e636, _0x48e636);
    const _0xdeb104 = _0x48e636[_0x5e2423(0x115)];
    VisuMZ[_0x5e2423(0x5bb)](_0xdeb104);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x820), _0x3473ba => {
    const _0x2172e2 = _0x17b060;
    VisuMZ[_0x2172e2(0x2f8)](_0x3473ba, _0x3473ba);
    const _0x5eccb8 = _0x3473ba[_0x2172e2(0x6fc)] || 0x0;
    $gameParty[_0x2172e2(0x47f)](_0x5eccb8);
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], 'MapOnceParallel', _0x531786 => {
    const _0xfd994e = _0x17b060;
    if (!SceneManager['isSceneMap']()) return;
    VisuMZ['ConvertParams'](_0x531786, _0x531786);
    const _0x1128fd = _0x531786[_0xfd994e(0x5ee)];
    SceneManager[_0xfd994e(0x2f9)][_0xfd994e(0x7b8)](_0x1128fd);
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], 'PictureCoordinatesMode', _0x47e259 => {
    const _0x1c2443 = _0x17b060;
    if (!$gameTemp['isPlaytest']()) return;
    if (!Utils['isNwjs']()) return;
    VisuMZ['ConvertParams'](_0x47e259, _0x47e259);
    const _0x4c11a7 = _0x47e259[_0x1c2443(0x338)] || 0x1;
    $gameTemp[_0x1c2443(0x35f)] = _0x4c11a7;
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x644), _0xe75448 => {
    const _0x45e3ea = _0x17b060;
    VisuMZ[_0x45e3ea(0x2f8)](_0xe75448, _0xe75448);
    const _0x5a26e5 = _0xe75448[_0x45e3ea(0x49f)] || 0x1,
      _0x1e58b3 = _0xe75448['easingType'] || _0x45e3ea(0x6a8),
      _0x454055 = $gameScreen['picture'](_0x5a26e5);
    _0x454055 && _0x454055['setEasingType'](_0x1e58b3);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x731), _0x1107fd => {
    const _0x553ddf = _0x17b060;
    for (let _0x171233 = 0x1; _0x171233 <= 0x64; _0x171233++) {
      $gameScreen[_0x553ddf(0x413)](_0x171233);
    }
  }),
  PluginManager['registerCommand'](pluginData['name'], _0x17b060(0x2e2), _0x246b91 => {
    const _0x470cad = _0x17b060;
    VisuMZ[_0x470cad(0x2f8)](_0x246b91, _0x246b91);
    const _0x33cc27 = Math[_0x470cad(0x701)](_0x246b91[_0x470cad(0x6e0)], _0x246b91['EndingID']),
      _0x116197 = Math[_0x470cad(0x7f9)](_0x246b91[_0x470cad(0x6e0)], _0x246b91['EndingID']);
    for (let _0x1006f4 = _0x33cc27; _0x1006f4 <= _0x116197; _0x1006f4++) {
      $gameScreen[_0x470cad(0x413)](_0x1006f4);
    }
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x313), _0x1240ae => {
    const _0x55f73a = _0x17b060;
    VisuMZ[_0x55f73a(0x2f8)](_0x1240ae, _0x1240ae);
    const _0x38909b = Math['round'](_0x1240ae[_0x55f73a(0x338)])['clamp'](0x1, 0x64),
      _0x4ac008 = -Number(_0x1240ae['AdjustAngle'] || 0x0),
      _0x464127 = Math['max'](_0x1240ae['Duration'] || 0x0, 0x0),
      _0x5a4fb4 = _0x1240ae['easingType'] || _0x55f73a(0x6a8),
      _0x156ffd = _0x1240ae[_0x55f73a(0x8be)],
      _0x5d17eb = $gameScreen[_0x55f73a(0x786)](_0x38909b);
    if (!_0x5d17eb) return;
    _0x5d17eb[_0x55f73a(0x4d1)](_0x4ac008, _0x464127, _0x5a4fb4);
    if (_0x156ffd) {
      const _0x24028f = $gameTemp[_0x55f73a(0x2be)]();
      if (_0x24028f) _0x24028f[_0x55f73a(0x6d1)](_0x464127);
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x1ac), _0x1e71df => {
    const _0x40ec59 = _0x17b060;
    VisuMZ[_0x40ec59(0x2f8)](_0x1e71df, _0x1e71df);
    const _0x14ca3c = Math[_0x40ec59(0x3fe)](_0x1e71df[_0x40ec59(0x338)])[_0x40ec59(0x42b)](0x1, 0x64),
      _0x4982e1 = -Number(_0x1e71df[_0x40ec59(0x40b)] || 0x0),
      _0x5d109b = Math[_0x40ec59(0x7f9)](_0x1e71df['Duration'] || 0x0, 0x0),
      _0x3732c8 = _0x1e71df[_0x40ec59(0x475)] || 'Linear',
      _0x313b56 = _0x1e71df['Wait'],
      _0x2a9038 = $gameScreen[_0x40ec59(0x786)](_0x14ca3c);
    if (!_0x2a9038) return;
    _0x2a9038[_0x40ec59(0x1d3)](_0x4982e1, _0x5d109b, _0x3732c8);
    if (_0x313b56) {
      const _0x52b81c = $gameTemp[_0x40ec59(0x2be)]();
      if (_0x52b81c) _0x52b81c[_0x40ec59(0x6d1)](_0x5d109b);
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x7ee), _0x2c7a46 => {
    const _0x1559ce = _0x17b060;
    VisuMZ[_0x1559ce(0x2f8)](_0x2c7a46, _0x2c7a46);
    const _0x652a1 = Math[_0x1559ce(0x3fe)](_0x2c7a46[_0x1559ce(0x338)])[_0x1559ce(0x42b)](0x1, 0x64),
      _0x33eb33 = _0x2c7a46[_0x1559ce(0x382)],
      _0x9853c = _0x33eb33[_0x1559ce(0x71f)][_0x1559ce(0x42b)](0x0, 0x1),
      _0x33e247 = Math[_0x1559ce(0x3fe)](_0x33eb33[_0x1559ce(0x33f)] || 0x0),
      _0xd89c24 = Math[_0x1559ce(0x3fe)](_0x33eb33[_0x1559ce(0x8b6)] || 0x0),
      _0x346e07 = Math['round'](_0x33eb33['ScaleX'] || 0x0),
      _0x2b1c84 = Math[_0x1559ce(0x3fe)](_0x33eb33['ScaleY'] || 0x0),
      _0x58bf67 = Math[_0x1559ce(0x3fe)](_0x33eb33['Opacity'])[_0x1559ce(0x42b)](0x0, 0xff),
      _0x5e638d = _0x33eb33[_0x1559ce(0x1a5)],
      _0x205451 = 'VisuMZ\x20CoreEngine\x20PictureIcon\x20%1\x20%2',
      _0x362650 = _0x2c7a46[_0x1559ce(0x808)] ? _0x1559ce(0x808) : _0x1559ce(0x66f),
      _0x3f47e1 = _0x205451[_0x1559ce(0x1df)](_0x2c7a46[_0x1559ce(0x5e8)], _0x362650);
    $gameScreen[_0x1559ce(0x673)](_0x652a1, _0x3f47e1, _0x9853c, _0x33e247, _0xd89c24, _0x346e07, _0x2b1c84, _0x58bf67, _0x5e638d);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x783), _0x3f449d => {
    const _0x38529d = _0x17b060;
    VisuMZ[_0x38529d(0x2f8)](_0x3f449d, _0x3f449d);
    const _0x2ac1d6 = _0x3f449d['Type'] || _0x38529d(0x5ab),
      _0x313efb = _0x3f449d[_0x38529d(0x6c4)][_0x38529d(0x42b)](0x1, 0x9),
      _0x4409b3 = _0x3f449d[_0x38529d(0x37d)]['clamp'](0x1, 0x9),
      _0xff260c = _0x3f449d[_0x38529d(0x466)] || 0x1,
      _0x3bd023 = _0x3f449d[_0x38529d(0x8be)];
    $gameScreen[_0x38529d(0x470)](_0x2ac1d6), $gameScreen['startShake'](_0x313efb, _0x4409b3, _0xff260c);
    if (_0x3bd023) {
      const _0x28789b = $gameTemp[_0x38529d(0x2be)]();
      if (_0x28789b) _0x28789b[_0x38529d(0x6d1)](_0xff260c);
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], 'SwitchRandomizeOne', _0x5f06f2 => {
    const _0x27d73c = _0x17b060;
    if ($gameParty[_0x27d73c(0x45a)]()) return;
    VisuMZ[_0x27d73c(0x2f8)](_0x5f06f2, _0x5f06f2);
    const _0x2dcfed = _0x5f06f2[_0x27d73c(0x4b1)],
      _0x2efd1c = (_0x5f06f2[_0x27d73c(0x4b7)] || 0x0) / 0x64;
    for (const _0x5f2333 of _0x2dcfed) {
      const _0x29c570 = Math[_0x27d73c(0x5ab)]() <= _0x2efd1c;
      $gameSwitches[_0x27d73c(0x427)](_0x5f2333, _0x29c570);
    }
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], 'SwitchRandomizeRange', _0x48341c => {
    const _0x32b3aa = _0x17b060;
    if ($gameParty['inBattle']()) return;
    VisuMZ[_0x32b3aa(0x2f8)](_0x48341c, _0x48341c);
    const _0x24a50e = Math[_0x32b3aa(0x701)](_0x48341c[_0x32b3aa(0x6e0)], _0x48341c[_0x32b3aa(0x7ed)]),
      _0x1991e2 = Math[_0x32b3aa(0x7f9)](_0x48341c['StartID'], _0x48341c[_0x32b3aa(0x7ed)]),
      _0x39dcfb = (_0x48341c['Chance'] || 0x0) / 0x64;
    for (let _0x40c7e4 = _0x24a50e; _0x40c7e4 <= _0x1991e2; _0x40c7e4++) {
      const _0x28daac = Math[_0x32b3aa(0x5ab)]() <= _0x39dcfb;
      $gameSwitches[_0x32b3aa(0x427)](_0x40c7e4, _0x28daac);
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], 'SwitchToggleOne', _0x3a76e0 => {
    const _0x515dbe = _0x17b060;
    if ($gameParty['inBattle']()) return;
    VisuMZ[_0x515dbe(0x2f8)](_0x3a76e0, _0x3a76e0);
    const _0xd280fa = _0x3a76e0[_0x515dbe(0x4b1)];
    for (const _0xe931c0 of _0xd280fa) {
      const _0x451aaf = $gameSwitches['value'](_0xe931c0);
      $gameSwitches['setValue'](_0xe931c0, !_0x451aaf);
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x880), _0x32cb91 => {
    const _0x43327a = _0x17b060;
    if ($gameParty[_0x43327a(0x45a)]()) return;
    VisuMZ[_0x43327a(0x2f8)](_0x32cb91, _0x32cb91);
    const _0x2e7e32 = Math[_0x43327a(0x701)](_0x32cb91[_0x43327a(0x6e0)], _0x32cb91[_0x43327a(0x7ed)]),
      _0x5239c7 = Math[_0x43327a(0x7f9)](_0x32cb91[_0x43327a(0x6e0)], _0x32cb91[_0x43327a(0x7ed)]);
    for (let _0x455698 = _0x2e7e32; _0x455698 <= _0x5239c7; _0x455698++) {
      const _0x3a92be = $gameSwitches[_0x43327a(0x6fc)](_0x455698);
      $gameSwitches['setValue'](_0x455698, !_0x3a92be);
    }
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x344), _0x50b234 => {
    const _0x3593a4 = _0x17b060;
    VisuMZ['ConvertParams'](_0x50b234, _0x50b234);
    const _0x4e202f = _0x50b234[_0x3593a4(0x23d)] || 0x1;
    $gameSystem[_0x3593a4(0x205)](_0x4e202f);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x49a), _0x422888 => {
    const _0x4171ad = _0x17b060;
    if ($gameParty[_0x4171ad(0x45a)]()) return;
    VisuMZ[_0x4171ad(0x2f8)](_0x422888, _0x422888);
    const _0x71a913 = _0x422888['option'];
    if (_0x71a913[_0x4171ad(0x2ba)](/Front/i)) $gameSystem[_0x4171ad(0x7b5)](![]);
    else _0x71a913[_0x4171ad(0x2ba)](/Side/i) ? $gameSystem[_0x4171ad(0x7b5)](!![]) : $gameSystem[_0x4171ad(0x7b5)](!$gameSystem[_0x4171ad(0x4a1)]());
  }),
  PluginManager[_0x17b060(0x31e)](pluginData['name'], _0x17b060(0x231), _0x3dd95c => {
    const _0x11ce04 = _0x17b060;
    if ($gameParty['inBattle']()) return;
    VisuMZ['ConvertParams'](_0x3dd95c, _0x3dd95c);
    const _0x37e212 = [_0x11ce04(0x6f4), _0x11ce04(0x45b), 'me', 'se'];
    for (const _0x5f5d3c of _0x37e212) {
      const _0x3ddfa0 = _0x3dd95c[_0x5f5d3c],
        _0x2054d7 = _0x11ce04(0x57b)[_0x11ce04(0x1df)](_0x5f5d3c);
      for (const _0x14fb78 of _0x3ddfa0) {
        AudioManager['createBuffer'](_0x2054d7, _0x14fb78);
      }
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], 'SystemLoadImages', _0x3803d0 => {
    const _0xb37514 = _0x17b060;
    if ($gameParty['inBattle']()) return;
    VisuMZ['ConvertParams'](_0x3803d0, _0x3803d0);
    const _0x126f32 = [
      'animations',
      'battlebacks1',
      _0xb37514(0x424),
      'characters',
      _0xb37514(0x4f5),
      _0xb37514(0x895),
      'parallaxes',
      _0xb37514(0x5f8),
      _0xb37514(0x415),
      _0xb37514(0x30d),
      _0xb37514(0x759),
      _0xb37514(0x848),
      _0xb37514(0x4ff),
      _0xb37514(0x15a),
    ];
    for (const _0x2e02f9 of _0x126f32) {
      const _0x3708fe = _0x3803d0[_0x2e02f9],
        _0x38b68a = _0xb37514(0x614)[_0xb37514(0x1df)](_0x2e02f9);
      for (const _0x4bafce of _0x3708fe) {
        ImageManager[_0xb37514(0x80b)](_0x38b68a, _0x4bafce);
      }
    }
  }),
  PluginManager[_0x17b060(0x31e)](pluginData['name'], 'SystemSetBattleSystem', _0x472344 => {
    const _0x3cb4dd = _0x17b060;
    if ($gameParty['inBattle']()) return;
    VisuMZ[_0x3cb4dd(0x2f8)](_0x472344, _0x472344);
    const _0x290eb5 = _0x472344['option'][_0x3cb4dd(0x29e)]()[_0x3cb4dd(0x711)](),
      _0x4ec3b7 = VisuMZ[_0x3cb4dd(0x77a)][_0x3cb4dd(0x1f2)](_0x290eb5);
    $gameSystem[_0x3cb4dd(0xf1)](_0x4ec3b7);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x1f2)] = function (_0x199539) {
    const _0x286930 = _0x17b060;
    (_0x199539 = _0x199539 || _0x286930(0x730)), (_0x199539 = String(_0x199539)[_0x286930(0x29e)]()['trim']());
    switch (_0x199539) {
      case 'DTB':
        return 0x0;
      case 'TPB\x20ACTIVE':
        Imported[_0x286930(0x680)] && (ConfigManager['atbActive'] = !![]);
        return 0x1;
      case 'TPB\x20WAIT':
        Imported[_0x286930(0x680)] && (ConfigManager[_0x286930(0x594)] = ![]);
        return 0x2;
      case _0x286930(0x630):
        if (Imported[_0x286930(0x222)]) return 'CTB';
        break;
      case _0x286930(0x5f0):
        if (Imported['VisuMZ_2_BattleSystemSTB']) return 'STB';
        break;
      case _0x286930(0x189):
        if (Imported[_0x286930(0x385)]) return _0x286930(0x189);
        break;
      case 'FTB':
        if (Imported[_0x286930(0x458)]) return _0x286930(0x803);
        break;
      case 'OTB':
        if (Imported[_0x286930(0x452)]) return _0x286930(0x648);
        break;
      case 'ETB':
        if (Imported[_0x286930(0x1b4)]) return 'ETB';
        break;
      case _0x286930(0x65b):
        if (Imported[_0x286930(0x681)]) return 'PTB';
        break;
    }
    return $dataSystem[_0x286930(0x4c6)];
  }),
  PluginManager[_0x17b060(0x31e)](pluginData['name'], _0x17b060(0x4a0), _0x5eb197 => {
    const _0x37a84f = _0x17b060;
    VisuMZ[_0x37a84f(0x2f8)](_0x5eb197, _0x5eb197);
    const _0x28c875 = _0x5eb197[_0x37a84f(0x23d)] || 0x1;
    $gameSystem[_0x37a84f(0x25f)](_0x28c875);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], _0x17b060(0x4f4), _0x3b0c97 => {
    const _0xca3703 = _0x17b060;
    VisuMZ[_0xca3703(0x2f8)](_0x3b0c97, _0x3b0c97);
    const _0x4bd6e8 = _0x3b0c97[_0xca3703(0x751)] || '';
    $textPopup(_0x4bd6e8);
  }),
  PluginManager['registerCommand'](pluginData[_0x17b060(0x142)], _0x17b060(0x7e0), _0x588db5 => {
    const _0x4ef43d = _0x17b060;
    VisuMZ[_0x4ef43d(0x2f8)](_0x588db5, _0x588db5);
    const _0x16010d = _0x588db5['id'] || 0x1,
      _0x5f0bc7 = _0x588db5['operation'],
      _0xc6afce = _0x588db5[_0x4ef43d(0x6ac)] || 0x0;
    let _0x1dc901 = $gameVariables['value'](_0x16010d) || 0x0;
    switch (_0x5f0bc7) {
      case '=':
        _0x1dc901 = _0xc6afce;
        break;
      case '+':
        _0x1dc901 += _0xc6afce;
        break;
      case '-':
        _0x1dc901 -= _0xc6afce;
        break;
      case '*':
        _0x1dc901 *= _0xc6afce;
        break;
      case '/':
        _0x1dc901 /= _0xc6afce;
        break;
      case '%':
        _0x1dc901 %= _0xc6afce;
        break;
    }
    (_0x1dc901 = _0x1dc901 || 0x0), $gameVariables[_0x4ef43d(0x427)](_0x16010d, _0x1dc901);
  }),
  PluginManager[_0x17b060(0x31e)](pluginData[_0x17b060(0x142)], 'VariableJsBlock', _0x4d9c3e => {
    const _0x3c2884 = _0x17b060;
    VisuMZ['ConvertParams'](_0x4d9c3e, _0x4d9c3e);
    const _0x3934a6 = _0x4d9c3e['id']() || 0x1,
      _0x15bfea = _0x4d9c3e['operation'],
      _0xa75b82 = _0x4d9c3e['operand']() || 0x0;
    let _0x514bc2 = $gameVariables[_0x3c2884(0x6fc)](_0x3934a6) || 0x0;
    switch (_0x15bfea) {
      case '=':
        _0x514bc2 = _0xa75b82;
        break;
      case '+':
        _0x514bc2 += _0xa75b82;
        break;
      case '-':
        _0x514bc2 -= _0xa75b82;
        break;
      case '*':
        _0x514bc2 *= _0xa75b82;
        break;
      case '/':
        _0x514bc2 /= _0xa75b82;
        break;
      case '%':
        _0x514bc2 %= _0xa75b82;
        break;
    }
    (_0x514bc2 = _0x514bc2 || 0x0), $gameVariables[_0x3c2884(0x427)](_0x3934a6, _0x514bc2);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x78c)] = Scene_Boot['prototype']['onDatabaseLoaded']),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x7a0)] = function () {
    const _0x1fb9ce = _0x17b060;
    VisuMZ[_0x1fb9ce(0x77a)]['Scene_Boot_onDatabaseLoaded'][_0x1fb9ce(0x64e)](this),
      this[_0x1fb9ce(0x190)](),
      this[_0x1fb9ce(0x358)](),
      this['process_VisuMZ_CoreEngine_Settings'](),
      this[_0x1fb9ce(0x2aa)](),
      this[_0x1fb9ce(0x36c)](),
      this[_0x1fb9ce(0x68a)](),
      VisuMZ[_0x1fb9ce(0x3d7)]();
  }),
  (VisuMZ[_0x17b060(0x77a)]['RegExp'] = {}),
  (Scene_Boot[_0x17b060(0x54a)]['process_VisuMZ_CoreEngine_RegExp'] = function () {
    const _0x5ace87 = _0x17b060,
      _0x29326d = ['MAXHP', _0x5ace87(0x148), _0x5ace87(0x135), _0x5ace87(0x689), _0x5ace87(0x297), _0x5ace87(0x3be), 'AGI', _0x5ace87(0xec)],
      _0x37596f = [_0x5ace87(0x889), _0x5ace87(0x2ce), _0x5ace87(0x6af), 'CEV', _0x5ace87(0x17d), _0x5ace87(0x11f), 'CNT', _0x5ace87(0x599), _0x5ace87(0x69b), _0x5ace87(0x655)],
      _0x2c5c1a = [_0x5ace87(0x260), _0x5ace87(0x1c8), _0x5ace87(0x4ec), _0x5ace87(0x728), _0x5ace87(0x6d6), _0x5ace87(0x828), _0x5ace87(0x11a), _0x5ace87(0x121), 'FDR', 'EXR'],
      _0x34d5f = [_0x29326d, _0x37596f, _0x2c5c1a],
      _0x515c61 = [_0x5ace87(0x591), 'Plus1', _0x5ace87(0x801), _0x5ace87(0x855), 'Rate', _0x5ace87(0x66d), _0x5ace87(0x576), _0x5ace87(0x7bc), 'Flat1', _0x5ace87(0x678)];
    for (const _0xe43769 of _0x34d5f) {
      let _0x4dd7e1 = '';
      if (_0xe43769 === _0x29326d) _0x4dd7e1 = 'param';
      if (_0xe43769 === _0x37596f) _0x4dd7e1 = 'xparam';
      if (_0xe43769 === _0x2c5c1a) _0x4dd7e1 = _0x5ace87(0x12c);
      for (const _0x2ed46f of _0x515c61) {
        let _0x122106 = _0x5ace87(0x3c3)[_0x5ace87(0x1df)](_0x4dd7e1, _0x2ed46f);
        (VisuMZ[_0x5ace87(0x77a)][_0x5ace87(0x1bc)][_0x122106] = []), (VisuMZ[_0x5ace87(0x77a)][_0x5ace87(0x1bc)][_0x122106 + 'JS'] = []);
        let _0x1c1ea2 = _0x5ace87(0x89a);
        if ([_0x5ace87(0x591), 'Flat'][_0x5ace87(0x1ae)](_0x2ed46f)) _0x1c1ea2 += _0x5ace87(0x875);
        else {
          if (['Plus1', _0x5ace87(0x7d2)][_0x5ace87(0x1ae)](_0x2ed46f)) _0x1c1ea2 += _0x5ace87(0x634);
          else {
            if ([_0x5ace87(0x801), _0x5ace87(0x678)][_0x5ace87(0x1ae)](_0x2ed46f)) _0x1c1ea2 += '([\x5c+\x5c-]\x5cd+\x5c.?\x5cd+)>';
            else {
              if (_0x2ed46f === 'Max') _0x1c1ea2 += _0x5ace87(0x2b2);
              else {
                if (_0x2ed46f === _0x5ace87(0x66d)) _0x1c1ea2 += _0x5ace87(0x78d);
                else _0x2ed46f === _0x5ace87(0x576) && (_0x1c1ea2 += _0x5ace87(0x8a4));
              }
            }
          }
        }
        for (const _0x334e14 of _0xe43769) {
          let _0x202b57 = _0x2ed46f[_0x5ace87(0x39d)](/[\d+]/g, '')[_0x5ace87(0x29e)]();
          const _0x5b6828 = _0x1c1ea2['format'](_0x334e14, _0x202b57);
          VisuMZ[_0x5ace87(0x77a)][_0x5ace87(0x1bc)][_0x122106]['push'](new RegExp(_0x5b6828, 'i'));
          const _0x15fc7b = _0x5ace87(0x331)[_0x5ace87(0x1df)](_0x334e14, _0x202b57);
          VisuMZ[_0x5ace87(0x77a)][_0x5ace87(0x1bc)][_0x122106 + 'JS'][_0x5ace87(0x6f2)](new RegExp(_0x15fc7b, 'i'));
        }
      }
    }
  }),
  (Scene_Boot['prototype'][_0x17b060(0x358)] = function () {
    const _0x52e800 = _0x17b060;
    if (VisuMZ[_0x52e800(0x3d7)]) return;
  }),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x670)] = function () {
    const _0x3735f2 = _0x17b060,
      _0xdf3565 = VisuMZ['CoreEngine']['Settings'];
    _0xdf3565[_0x3735f2(0x7ae)][_0x3735f2(0x874)] && VisuMZ[_0x3735f2(0x7e9)](!![]);
    _0xdf3565[_0x3735f2(0x7ae)]['ModernControls'] && ((Input[_0x3735f2(0x51d)][0x23] = 'end'), (Input['keyMapper'][0x24] = _0x3735f2(0x146)));
    if (_0xdf3565[_0x3735f2(0x862)]) {
      const _0x5a426d = _0xdf3565['ButtonAssist'];
      (_0x5a426d[_0x3735f2(0x33e)] = _0x5a426d[_0x3735f2(0x33e)] || _0x3735f2(0x54f)), (_0x5a426d[_0x3735f2(0x721)] = _0x5a426d[_0x3735f2(0x721)] || _0x3735f2(0x14d));
    }
    _0xdf3565[_0x3735f2(0x197)][_0x3735f2(0x3da)] &&
      ((Input[_0x3735f2(0x51d)][0x57] = 'up'),
      (Input[_0x3735f2(0x51d)][0x41] = _0x3735f2(0x2b0)),
      (Input[_0x3735f2(0x51d)][0x53] = 'down'),
      (Input['keyMapper'][0x44] = _0x3735f2(0x512)),
      (Input[_0x3735f2(0x51d)][0x45] = _0x3735f2(0x7c5))),
      _0xdf3565[_0x3735f2(0x197)]['DashToggleR'] && (Input[_0x3735f2(0x51d)][0x52] = _0x3735f2(0x562)),
      (_0xdf3565[_0x3735f2(0x71d)]['DisplayedParams'] = _0xdf3565['Param'][_0x3735f2(0x449)]['map'](_0x4de857 => _0x4de857[_0x3735f2(0x29e)]()[_0x3735f2(0x711)]())),
      (_0xdf3565[_0x3735f2(0x71d)][_0x3735f2(0x4ba)] = _0xdf3565[_0x3735f2(0x71d)][_0x3735f2(0x4ba)][_0x3735f2(0x3a8)](_0x3e329c => _0x3e329c[_0x3735f2(0x29e)]()['trim']())),
      (_0xdf3565[_0x3735f2(0x7ae)][_0x3735f2(0x444)] = _0xdf3565[_0x3735f2(0x7ae)][_0x3735f2(0x444)] ?? !![]),
      (_0xdf3565[_0x3735f2(0x7ae)][_0x3735f2(0x15f)] = _0xdf3565[_0x3735f2(0x7ae)]['ShiftT_Toggle'] ?? !![]);
  }),
  (Scene_Boot['prototype'][_0x17b060(0x2aa)] = function () {
    this['process_VisuMZ_CoreEngine_jsQuickFunctions']();
  }),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x5a0)] = function () {
    const _0x57c94d = _0x17b060,
      _0x5a3f3f = VisuMZ[_0x57c94d(0x77a)]['Settings'][_0x57c94d(0x1c2)];
    for (const _0x518fbd of _0x5a3f3f) {
      const _0x10f2db = _0x518fbd['FunctionName'][_0x57c94d(0x39d)](/[ ]/g, ''),
        _0x296eca = _0x518fbd[_0x57c94d(0x101)];
      VisuMZ['CoreEngine'][_0x57c94d(0x5d2)](_0x10f2db, _0x296eca);
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x5d2)] = function (_0x25f348, _0x5f4929) {
    const _0x516fc1 = _0x17b060;
    if (!!window[_0x25f348]) {
      if ($gameTemp[_0x516fc1(0x6dc)]()) console[_0x516fc1(0x797)](_0x516fc1(0x3ee)['format'](_0x25f348));
    }
    const _0x4baf97 = _0x516fc1(0x327)['format'](_0x25f348, _0x5f4929);
    window[_0x25f348] = new Function(_0x4baf97);
  }),
  (Scene_Boot[_0x17b060(0x54a)]['process_VisuMZ_CoreEngine_CustomParameters'] = function () {
    const _0x476fd3 = _0x17b060,
      _0x20f506 = VisuMZ['CoreEngine'][_0x476fd3(0x382)]['CustomParam'];
    if (!_0x20f506) return;
    for (const _0x185cb2 of _0x20f506) {
      if (!_0x185cb2) continue;
      VisuMZ[_0x476fd3(0x77a)][_0x476fd3(0x2ed)](_0x185cb2);
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x42d)] = {}),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x5e1)] = {}),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x6f7)] = {}),
  (VisuMZ[_0x17b060(0x77a)]['CustomParamAbb'] = {}),
  (VisuMZ[_0x17b060(0x77a)]['createCustomParameter'] = function (_0x1f8ed7) {
    const _0x4ed798 = _0x17b060,
      _0x3bf3db = _0x1f8ed7[_0x4ed798(0x242)],
      _0x1d2bd9 = _0x1f8ed7['ParamName'],
      _0x68f719 = _0x1f8ed7[_0x4ed798(0x585)],
      _0x581d78 = _0x1f8ed7[_0x4ed798(0x2cf)],
      _0x36e0e1 = new Function(_0x1f8ed7[_0x4ed798(0x15e)]);
    (VisuMZ[_0x4ed798(0x77a)][_0x4ed798(0x42d)][_0x3bf3db[_0x4ed798(0x29e)]()[_0x4ed798(0x711)]()] = _0x1d2bd9),
      (VisuMZ[_0x4ed798(0x77a)][_0x4ed798(0x5e1)][_0x3bf3db['toUpperCase']()[_0x4ed798(0x711)]()] = _0x68f719),
      (VisuMZ['CoreEngine'][_0x4ed798(0x6f7)][_0x3bf3db[_0x4ed798(0x29e)]()[_0x4ed798(0x711)]()] = _0x581d78),
      (VisuMZ[_0x4ed798(0x77a)]['CustomParamAbb'][_0x3bf3db['toUpperCase']()[_0x4ed798(0x711)]()] = _0x3bf3db),
      Object[_0x4ed798(0x64d)](Game_BattlerBase[_0x4ed798(0x54a)], _0x3bf3db, {
        get() {
          const _0x2c7d1f = _0x4ed798,
            _0x1af904 = _0x36e0e1[_0x2c7d1f(0x64e)](this);
          return _0x581d78 === 'integer' ? Math[_0x2c7d1f(0x3fe)](_0x1af904) : _0x1af904;
        },
      });
  }),
  (VisuMZ[_0x17b060(0x77a)]['ControllerButtons'] = {}),
  (VisuMZ['CoreEngine'][_0x17b060(0x111)] = {}),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x68a)] = function () {
    const _0x230318 = _0x17b060,
      _0x28398b = VisuMZ['CoreEngine'][_0x230318(0x382)][_0x230318(0x4b0)];
    for (const _0x39d6fc of _0x28398b) {
      const _0x58c40e = (_0x39d6fc[_0x230318(0x516)] || '')['toLowerCase']()[_0x230318(0x711)](),
        _0x462b79 = (_0x39d6fc[_0x230318(0xfb)] || '')[_0x230318(0x853)]()[_0x230318(0x711)]();
      (VisuMZ[_0x230318(0x77a)][_0x230318(0x4b0)][_0x58c40e] = _0x39d6fc), (VisuMZ[_0x230318(0x77a)][_0x230318(0x111)][_0x462b79] = _0x58c40e);
    }
  }),
  (VisuMZ[_0x17b060(0x3d7)] = function () {
    const _0x293081 = _0x17b060;
    for (const _0x55810f of $dataActors) {
      if (_0x55810f) VisuMZ[_0x293081(0x39a)](_0x55810f);
    }
    for (const _0x3ad72a of $dataClasses) {
      if (_0x3ad72a) VisuMZ[_0x293081(0x7e7)](_0x3ad72a);
    }
    for (const _0x505e5d of $dataSkills) {
      if (_0x505e5d) VisuMZ[_0x293081(0x481)](_0x505e5d);
    }
    for (const _0xbc4ede of $dataItems) {
      if (_0xbc4ede) VisuMZ[_0x293081(0x3a7)](_0xbc4ede);
    }
    for (const _0x25d20c of $dataWeapons) {
      if (_0x25d20c) VisuMZ[_0x293081(0x7a2)](_0x25d20c);
    }
    for (const _0x5e6354 of $dataArmors) {
      if (_0x5e6354) VisuMZ[_0x293081(0x293)](_0x5e6354);
    }
    for (const _0x486bad of $dataEnemies) {
      if (_0x486bad) VisuMZ[_0x293081(0x561)](_0x486bad);
    }
    for (const _0x4b3b14 of $dataStates) {
      if (_0x4b3b14) VisuMZ[_0x293081(0x3d8)](_0x4b3b14);
    }
    for (const _0x3c2da3 of $dataTilesets) {
      if (_0x3c2da3) VisuMZ[_0x293081(0x289)](_0x3c2da3);
    }
  }),
  (VisuMZ[_0x17b060(0x39a)] = function (_0x352f16) {}),
  (VisuMZ[_0x17b060(0x7e7)] = function (_0x384fab) {}),
  (VisuMZ[_0x17b060(0x481)] = function (_0x3b0c16) {}),
  (VisuMZ[_0x17b060(0x3a7)] = function (_0x1e8cb9) {}),
  (VisuMZ[_0x17b060(0x7a2)] = function (_0x2496cb) {}),
  (VisuMZ['ParseArmorNotetags'] = function (_0x5caf26) {}),
  (VisuMZ['ParseEnemyNotetags'] = function (_0x47d788) {}),
  (VisuMZ[_0x17b060(0x3d8)] = function (_0xfb77de) {}),
  (VisuMZ['ParseTilesetNotetags'] = function (_0x29d5f2) {}),
  (VisuMZ[_0x17b060(0x77a)]['ParseActorNotetags'] = VisuMZ[_0x17b060(0x39a)]),
  (VisuMZ[_0x17b060(0x39a)] = function (_0x583f00) {
    const _0x23001b = _0x17b060;
    VisuMZ[_0x23001b(0x77a)]['ParseActorNotetags']['call'](this, _0x583f00);
    const _0x3b896e = _0x583f00[_0x23001b(0x85d)];
    if (_0x3b896e[_0x23001b(0x2ba)](/<MAX LEVEL:[ ](\d+)>/i)) {
      _0x583f00[_0x23001b(0x6ed)] = Number(RegExp['$1']);
      if (_0x583f00[_0x23001b(0x6ed)] === 0x0) _0x583f00[_0x23001b(0x6ed)] = Number[_0x23001b(0x29a)];
    }
    _0x3b896e['match'](/<INITIAL LEVEL:[ ](\d+)>/i) && (_0x583f00[_0x23001b(0x174)] = Math[_0x23001b(0x701)](Number(RegExp['$1']), _0x583f00[_0x23001b(0x6ed)]));
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x7e7)] = VisuMZ[_0x17b060(0x7e7)]),
  (VisuMZ[_0x17b060(0x7e7)] = function (_0x3526dd) {
    const _0x360d00 = _0x17b060;
    VisuMZ[_0x360d00(0x77a)]['ParseClassNotetags'][_0x360d00(0x64e)](this, _0x3526dd);
    if (_0x3526dd[_0x360d00(0x6ea)])
      for (const _0x21e2af of _0x3526dd[_0x360d00(0x6ea)]) {
        _0x21e2af['note'][_0x360d00(0x2ba)](/<LEARN AT LEVEL:[ ](\d+)>/i) && (_0x21e2af[_0x360d00(0x4b4)] = Math[_0x360d00(0x7f9)](Number(RegExp['$1']), 0x1));
      }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x561)] = VisuMZ['ParseEnemyNotetags']),
  (VisuMZ[_0x17b060(0x561)] = function (_0x21ff67) {
    const _0x5cc252 = _0x17b060;
    VisuMZ[_0x5cc252(0x77a)][_0x5cc252(0x561)][_0x5cc252(0x64e)](this, _0x21ff67), (_0x21ff67['level'] = 0x1);
    const _0x160a0b = _0x21ff67['note'];
    if (_0x160a0b[_0x5cc252(0x2ba)](/<LEVEL:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x4b4)] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<MAXHP:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x0] = Number(RegExp['$1']);
    if (_0x160a0b['match'](/<MAXMP:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x1] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<ATK:[ ](\d+)>/i)) _0x21ff67['params'][0x2] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<DEF:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x3] = Number(RegExp['$1']);
    if (_0x160a0b['match'](/<MAT:[ ](\d+)>/i)) _0x21ff67['params'][0x4] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<MDF:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x5] = Number(RegExp['$1']);
    if (_0x160a0b['match'](/<AGI:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x6] = Number(RegExp['$1']);
    if (_0x160a0b['match'](/<LUK:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x5aa)][0x7] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<EXP:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x769)] = Number(RegExp['$1']);
    if (_0x160a0b[_0x5cc252(0x2ba)](/<GOLD:[ ](\d+)>/i)) _0x21ff67[_0x5cc252(0x793)] = Number(RegExp['$1']);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x369)] = Graphics[_0x17b060(0x127)]),
  (Graphics[_0x17b060(0x127)] = function () {
    const _0x234fbe = _0x17b060;
    switch (VisuMZ[_0x234fbe(0x77a)]['Settings'][_0x234fbe(0x7ae)][_0x234fbe(0x872)]) {
      case _0x234fbe(0x211):
        return !![];
      case 'normal':
        return ![];
      default:
        return VisuMZ[_0x234fbe(0x77a)][_0x234fbe(0x369)][_0x234fbe(0x64e)](this);
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x3c7)] = Graphics[_0x17b060(0x586)]),
  (Graphics[_0x17b060(0x586)] = function (_0x4d7078, _0x119b37, _0x52e825 = null) {
    const _0x141ad1 = _0x17b060;
    VisuMZ[_0x141ad1(0x77a)][_0x141ad1(0x3c7)]['call'](this, _0x4d7078, _0x119b37, _0x52e825), VisuMZ['ShowDevTools'](![]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x125)] = Graphics[_0x17b060(0x247)]),
  (Graphics[_0x17b060(0x247)] = function (_0x1efcb3) {
    const _0x17c5c2 = _0x17b060;
    VisuMZ[_0x17c5c2(0x77a)][_0x17c5c2(0x125)]['call'](this, _0x1efcb3), this[_0x17c5c2(0x8bc)](_0x1efcb3);
  }),
  (Graphics[_0x17b060(0x8bc)] = function (_0x49b98a) {
    const _0x5f17df = _0x17b060;
    VisuMZ[_0x5f17df(0x77a)][_0x5f17df(0x382)]['QoL'][_0x5f17df(0x5c3)] && (_0x49b98a['style'][_0x5f17df(0x3dd)] = 'none');
    VisuMZ[_0x5f17df(0x77a)][_0x5f17df(0x382)][_0x5f17df(0x7ae)][_0x5f17df(0x25b)] && (_0x49b98a[_0x5f17df(0x2b5)][_0x5f17df(0x3ff)] = _0x5f17df(0x74d));
    const _0x7f113c = Math['max'](0x0, Math[_0x5f17df(0x221)](_0x49b98a[_0x5f17df(0x321)] * this[_0x5f17df(0x6fd)])),
      _0x368442 = Math[_0x5f17df(0x7f9)](0x0, Math[_0x5f17df(0x221)](_0x49b98a[_0x5f17df(0x2c5)] * this[_0x5f17df(0x6fd)]));
    (_0x49b98a['style'][_0x5f17df(0x321)] = _0x7f113c + 'px'), (_0x49b98a[_0x5f17df(0x2b5)]['height'] = _0x368442 + 'px');
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x2e9)] = Bitmap[_0x17b060(0x54a)][_0x17b060(0x3e0)]),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x2e7b39, _0x5a9f1d) {
    const _0x334ae7 = _0x17b060;
    VisuMZ[_0x334ae7(0x77a)][_0x334ae7(0x2e9)]['call'](this, _0x2e7b39, _0x5a9f1d), (this['_smooth'] = !(VisuMZ[_0x334ae7(0x77a)][_0x334ae7(0x382)][_0x334ae7(0x7ae)][_0x334ae7(0x25b)] ?? !![]));
  }),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x81f)] = function () {
    const _0x5c3f13 = _0x17b060;
    this[_0x5c3f13(0x6de)] = !![];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x744)] = Sprite[_0x17b060(0x54a)][_0x17b060(0x2a5)]),
  (Sprite[_0x17b060(0x54a)][_0x17b060(0x2a5)] = function () {
    const _0x46b16d = _0x17b060;
    if (this[_0x46b16d(0x877)]) VisuMZ[_0x46b16d(0x77a)][_0x46b16d(0x744)]['call'](this);
    this[_0x46b16d(0x3e6)]();
  }),
  (Sprite[_0x17b060(0x54a)][_0x17b060(0x3e6)] = function () {
    const _0x2c29a3 = _0x17b060;
    if (!this['bitmap']) return;
    if (!this['bitmap'][_0x2c29a3(0x6de)]) return;
    this[_0x2c29a3(0x7d3)][_0x2c29a3(0x199)] && !this[_0x2c29a3(0x87f)]['_baseTexture'][_0x2c29a3(0x3a3)] && this[_0x2c29a3(0x7d3)][_0x2c29a3(0x2a5)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x3d9)] = Bitmap[_0x17b060(0x54a)]['resize']),
  (Bitmap['prototype'][_0x17b060(0x1af)] = function (_0x474b8c, _0x7ee6d4) {
    const _0x11a23f = _0x17b060;
    VisuMZ['CoreEngine'][_0x11a23f(0x3d9)][_0x11a23f(0x64e)](this, _0x474b8c, _0x7ee6d4), this['markCoreEngineModified']();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x545)] = Bitmap[_0x17b060(0x54a)]['blt']),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x3f8)] = function (_0x5ef1e2, _0x22e1dd, _0x13e10e, _0x1cf98a, _0x31c555, _0x2bb588, _0x2dfdd1, _0xf23487, _0x26f9f5) {
    const _0x53fa81 = _0x17b060;
    (_0x22e1dd = Math['round'](_0x22e1dd)),
      (_0x13e10e = Math[_0x53fa81(0x3fe)](_0x13e10e)),
      (_0x1cf98a = Math[_0x53fa81(0x3fe)](_0x1cf98a)),
      (_0x31c555 = Math[_0x53fa81(0x3fe)](_0x31c555)),
      (_0x2bb588 = Math[_0x53fa81(0x3fe)](_0x2bb588)),
      (_0x2dfdd1 = Math[_0x53fa81(0x3fe)](_0x2dfdd1)),
      VisuMZ[_0x53fa81(0x77a)][_0x53fa81(0x545)][_0x53fa81(0x64e)](this, _0x5ef1e2, _0x22e1dd, _0x13e10e, _0x1cf98a, _0x31c555, _0x2bb588, _0x2dfdd1, _0xf23487, _0x26f9f5),
      this[_0x53fa81(0x81f)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x145)] = Bitmap[_0x17b060(0x54a)][_0x17b060(0x1b1)]),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x1b1)] = function (_0x1553fe, _0x3b0ecd, _0x40beda, _0x29d5bd) {
    const _0x5d41a2 = _0x17b060;
    VisuMZ[_0x5d41a2(0x77a)][_0x5d41a2(0x145)][_0x5d41a2(0x64e)](this, _0x1553fe, _0x3b0ecd, _0x40beda, _0x29d5bd), this[_0x5d41a2(0x81f)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x202)] = Bitmap['prototype'][_0x17b060(0x456)]),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x456)] = function (_0x24f9fe, _0x31904c, _0x3a63f8, _0x15d93a, _0x5d1286) {
    const _0x49fb83 = _0x17b060;
    VisuMZ[_0x49fb83(0x77a)][_0x49fb83(0x202)][_0x49fb83(0x64e)](this, _0x24f9fe, _0x31904c, _0x3a63f8, _0x15d93a, _0x5d1286), this[_0x49fb83(0x81f)]();
  }),
  (VisuMZ[_0x17b060(0x77a)]['Bitmap_strokeRect'] = Bitmap[_0x17b060(0x54a)]['strokeRect']),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x53f)] = function (_0x3d6850, _0x922595, _0x3ca704, _0x15aa62, _0x4e3478) {
    const _0x519bd5 = _0x17b060;
    VisuMZ['CoreEngine'][_0x519bd5(0xfe)][_0x519bd5(0x64e)](this, _0x3d6850, _0x922595, _0x3ca704, _0x15aa62, _0x4e3478), this[_0x519bd5(0x81f)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x1c7)] = Bitmap['prototype'][_0x17b060(0x668)]),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x668)] = function (_0x4af518, _0x546f44, _0x555be7, _0x2f90eb, _0x2f5d80, _0x37985d, _0x408c5e) {
    const _0xb0f006 = _0x17b060;
    VisuMZ[_0xb0f006(0x77a)]['Bitmap_gradientFillRect'][_0xb0f006(0x64e)](this, _0x4af518, _0x546f44, _0x555be7, _0x2f90eb, _0x2f5d80, _0x37985d, _0x408c5e), this['markCoreEngineModified']();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x658)] = Bitmap[_0x17b060(0x54a)][_0x17b060(0x3f0)]),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x3f0)] = function (_0x389e71, _0x830bbf, _0x30ebf6, _0x2688be) {
    const _0xa485b1 = _0x17b060;
    (_0x389e71 = Math[_0xa485b1(0x3fe)](_0x389e71)),
      (_0x830bbf = Math[_0xa485b1(0x3fe)](_0x830bbf)),
      (_0x30ebf6 = Math[_0xa485b1(0x3fe)](_0x30ebf6)),
      VisuMZ[_0xa485b1(0x77a)][_0xa485b1(0x658)][_0xa485b1(0x64e)](this, _0x389e71, _0x830bbf, _0x30ebf6, _0x2688be),
      this[_0xa485b1(0x81f)]();
  }),
  (VisuMZ[_0x17b060(0x77a)]['Bitmap_measureTextWidth'] = Bitmap[_0x17b060(0x54a)][_0x17b060(0x790)]),
  (Bitmap['prototype'][_0x17b060(0x790)] = function (_0x38725a) {
    const _0x1718f8 = _0x17b060;
    return Math[_0x1718f8(0x720)](VisuMZ[_0x1718f8(0x77a)][_0x1718f8(0x3d4)][_0x1718f8(0x64e)](this, _0x38725a));
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x3ac)] = Bitmap[_0x17b060(0x54a)][_0x17b060(0x1a9)]),
  (Bitmap[_0x17b060(0x54a)]['drawText'] = function (_0x55c3b, _0xe82e56, _0x298c26, _0x35abdc, _0x45ccde, _0x12c324) {
    const _0x1cd7e0 = _0x17b060;
    (_0xe82e56 = Math[_0x1cd7e0(0x3fe)](_0xe82e56)),
      (_0x298c26 = Math[_0x1cd7e0(0x3fe)](_0x298c26)),
      (_0x35abdc = Math[_0x1cd7e0(0x720)](_0x35abdc)),
      (_0x45ccde = Math[_0x1cd7e0(0x720)](_0x45ccde)),
      VisuMZ[_0x1cd7e0(0x77a)]['Bitmap_drawText'][_0x1cd7e0(0x64e)](this, _0x55c3b, _0xe82e56, _0x298c26, _0x35abdc, _0x45ccde, _0x12c324),
      this[_0x1cd7e0(0x81f)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x633)] = Bitmap['prototype']['_drawTextOutline']),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x5a7)] = function (_0x2aeeb4, _0x262abc, _0x31642d, _0x371448) {
    const _0x405cd1 = _0x17b060;
    VisuMZ['CoreEngine'][_0x405cd1(0x382)][_0x405cd1(0x7ae)][_0x405cd1(0x2c4)]
      ? this['_drawTextShadow'](_0x2aeeb4, _0x262abc, _0x31642d, _0x371448)
      : VisuMZ[_0x405cd1(0x77a)][_0x405cd1(0x633)][_0x405cd1(0x64e)](this, _0x2aeeb4, _0x262abc, _0x31642d, _0x371448);
  }),
  (Bitmap[_0x17b060(0x54a)][_0x17b060(0x63d)] = function (_0x311fbe, _0x1fe5c2, _0xc52b59, _0x5f163c) {
    const _0x475c40 = _0x17b060,
      _0x43999d = this[_0x475c40(0x85c)];
    (_0x43999d[_0x475c40(0x238)] = this['outlineColor']), _0x43999d[_0x475c40(0x626)](_0x311fbe, _0x1fe5c2 + 0x2, _0xc52b59 + 0x2, _0x5f163c);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x53d)] = Input[_0x17b060(0x2d5)]),
  (Input[_0x17b060(0x2d5)] = function () {
    const _0xc700c2 = _0x17b060;
    VisuMZ[_0xc700c2(0x77a)][_0xc700c2(0x53d)]['call'](this), (this[_0xc700c2(0x2d3)] = undefined), (this['_inputSpecialKeyCode'] = undefined), (this[_0xc700c2(0x63e)] = Input[_0xc700c2(0x5f2)]);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x66e)] = Input[_0x17b060(0x319)]),
  (Input[_0x17b060(0x319)] = function () {
    const _0x4e0b17 = _0x17b060;
    VisuMZ[_0x4e0b17(0x77a)][_0x4e0b17(0x66e)][_0x4e0b17(0x64e)](this);
    if (this[_0x4e0b17(0x63e)]) this[_0x4e0b17(0x63e)]--;
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x89b)] = Input['_pollGamepads']),
  (Input['_pollGamepads'] = function () {
    const _0x2f0024 = _0x17b060;
    if (this[_0x2f0024(0x63e)]) return;
    VisuMZ[_0x2f0024(0x77a)]['Input_pollGamepads'][_0x2f0024(0x64e)](this);
  }),
  (VisuMZ['CoreEngine']['Input_setupEventHandlers'] = Input['_setupEventHandlers']),
  (Input[_0x17b060(0x50b)] = function () {
    const _0x36d1da = _0x17b060;
    VisuMZ['CoreEngine']['Input_setupEventHandlers']['call'](this), document[_0x36d1da(0x365)]('keypress', this[_0x36d1da(0x860)][_0x36d1da(0x76d)](this));
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x33d)] = Input['_onKeyDown']),
  (Input[_0x17b060(0x14f)] = function (_0x3f180e) {
    const _0x121686 = _0x17b060;
    (this[_0x121686(0x568)] = _0x3f180e[_0x121686(0x282)]), VisuMZ[_0x121686(0x77a)]['Input_onKeyDown'][_0x121686(0x64e)](this, _0x3f180e), this[_0x121686(0x55d)](null);
  }),
  (Input[_0x17b060(0x860)] = function (_0x386217) {
    const _0x446160 = _0x17b060;
    this[_0x446160(0x741)](_0x386217);
  }),
  (Input['_registerKeyInput'] = function (_0x4a1fe8) {
    const _0x566cff = _0x17b060;
    this[_0x566cff(0x568)] = _0x4a1fe8[_0x566cff(0x282)];
    let _0x20721c = String[_0x566cff(0x814)](_0x4a1fe8['charCode']);
    this['_inputString'] === undefined ? (this['_inputString'] = _0x20721c) : (this[_0x566cff(0x2d3)] += _0x20721c);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x479)] = Input['_shouldPreventDefault']),
  (Input[_0x17b060(0x833)] = function (_0x575253) {
    const _0x15fed4 = _0x17b060;
    if (_0x575253 === 0x8) return ![];
    return VisuMZ[_0x15fed4(0x77a)][_0x15fed4(0x479)]['call'](this, _0x575253);
  }),
  (Input[_0x17b060(0x2a3)] = function (_0x311559) {
    const _0x191afb = _0x17b060;
    if (_0x311559[_0x191afb(0x2ba)](/backspace/i)) return this[_0x191afb(0x568)] === 0x8;
    if (_0x311559['match'](/enter/i)) return this[_0x191afb(0x568)] === 0xd;
    if (_0x311559['match'](/escape/i)) return this[_0x191afb(0x568)] === 0x1b;
  }),
  (Input[_0x17b060(0x5bc)] = function () {
    const _0x473f59 = _0x17b060;
    return [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39][_0x473f59(0x7d9)](this[_0x473f59(0x568)]);
  }),
  (Input[_0x17b060(0x34a)] = function () {
    const _0x495bbc = _0x17b060;
    return [0x25, 0x26, 0x27, 0x28][_0x495bbc(0x7d9)](this[_0x495bbc(0x568)]);
  }),
  (Input[_0x17b060(0x4b9)] = function () {
    const _0x23a803 = _0x17b060;
    if (navigator['getGamepads']) {
      const _0x363f7b = navigator['getGamepads']();
      if (_0x363f7b)
        for (const _0x27db76 of _0x363f7b) {
          if (_0x27db76 && _0x27db76[_0x23a803(0x377)]) return !![];
        }
    }
    return ![];
  }),
  (Input[_0x17b060(0x6d7)] = function () {
    const _0x942640 = _0x17b060;
    if (navigator[_0x942640(0x588)]) {
      const _0xda76e8 = navigator[_0x942640(0x588)]();
      if (_0xda76e8)
        for (const _0x533173 of _0xda76e8) {
          if (_0x533173 && _0x533173['connected']) {
            if (this[_0x942640(0x6c3)](_0x533173)) return !![];
            if (this[_0x942640(0x7fc)](_0x533173)) return !![];
          }
        }
    }
    return ![];
  }),
  (Input[_0x17b060(0x6c3)] = function (_0x32217e) {
    const _0x3549c2 = _0x17b060,
      _0x3a650e = _0x32217e[_0x3549c2(0x737)];
    for (let _0x368bd7 = 0x0; _0x368bd7 < _0x3a650e['length']; _0x368bd7++) {
      if (_0x3a650e[_0x368bd7][_0x3549c2(0x2c7)]) return !![];
    }
    return ![];
  }),
  (Input[_0x17b060(0x7fc)] = function (_0x1d9d1f) {
    const _0x470373 = _0x1d9d1f['axes'],
      _0x1763ed = 0.5;
    if (_0x470373[0x0] < -_0x1763ed) return !![];
    if (_0x470373[0x0] > _0x1763ed) return !![];
    if (_0x470373[0x1] < -_0x1763ed) return !![];
    if (_0x470373[0x1] > _0x1763ed) return !![];
    return ![];
  }),
  (Input[_0x17b060(0x73b)] = function () {
    return this['_lastGamepad'] || null;
  }),
  (Input['setLastGamepadUsed'] = function (_0x5beb23) {
    const _0x5226ba = _0x17b060;
    this[_0x5226ba(0x1b7)] = _0x5beb23;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x66c)] = Input['_updateGamepadState']),
  (Input[_0x17b060(0x219)] = function (_0x3838db) {
    const _0x29091e = _0x17b060;
    VisuMZ[_0x29091e(0x77a)][_0x29091e(0x66c)][_0x29091e(0x64e)](this, _0x3838db), (this[_0x29091e(0x6c3)](_0x3838db) || this[_0x29091e(0x7fc)](_0x3838db)) && this[_0x29091e(0x55d)](_0x3838db);
  }),
  (Input[_0x17b060(0x224)] = function () {
    const _0x2b861d = _0x17b060;
    return this[_0x2b861d(0x1b7)] ? this[_0x2b861d(0x1b7)]['id'] : _0x2b861d(0x546);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x845)] = Tilemap[_0x17b060(0x54a)]['_addShadow']),
  (Tilemap['prototype']['_addShadow'] = function (_0x26687d, _0x4e93ba, _0x479bed, _0x663b7c) {
    const _0x251567 = _0x17b060;
    if ($gameMap && $gameMap[_0x251567(0x3eb)]()) return;
    VisuMZ['CoreEngine'][_0x251567(0x845)][_0x251567(0x64e)](this, _0x26687d, _0x4e93ba, _0x479bed, _0x663b7c);
  }),
  (Tilemap[_0x17b060(0x6ce)][_0x17b060(0x54a)][_0x17b060(0x7cb)] = function () {
    const _0x9bdbfc = _0x17b060;
    this['_destroyInternalTextures']();
    for (let _0xeedd8f = 0x0; _0xeedd8f < Tilemap[_0x9bdbfc(0x7f3)]['MAX_GL_TEXTURES']; _0xeedd8f++) {
      const _0x156d53 = new PIXI[_0x9bdbfc(0x7d6)]();
      _0x156d53[_0x9bdbfc(0x654)](0x800, 0x800),
        VisuMZ[_0x9bdbfc(0x77a)]['Settings'][_0x9bdbfc(0x7ae)][_0x9bdbfc(0x25b)] && (_0x156d53[_0x9bdbfc(0x5e6)] = PIXI[_0x9bdbfc(0x7aa)][_0x9bdbfc(0x4bc)]),
        this['_internalTextures'][_0x9bdbfc(0x6f2)](_0x156d53);
    }
  }),
  (WindowLayer['prototype'][_0x17b060(0x259)] = function () {
    const _0x1cd621 = _0x17b060;
    return SceneManager && SceneManager[_0x1cd621(0x2f9)] ? SceneManager['_scene'][_0x1cd621(0x6ee)]() : !![];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x6eb)] = WindowLayer[_0x17b060(0x54a)][_0x17b060(0x55e)]),
  (WindowLayer[_0x17b060(0x54a)][_0x17b060(0x55e)] = function render(_0x4dff3e) {
    const _0x1095ba = _0x17b060;
    this[_0x1095ba(0x259)]() ? VisuMZ[_0x1095ba(0x77a)][_0x1095ba(0x6eb)][_0x1095ba(0x64e)](this, _0x4dff3e) : this[_0x1095ba(0x1a1)](_0x4dff3e);
  }),
  (WindowLayer[_0x17b060(0x54a)][_0x17b060(0x1a1)] = function render(_0x179cdd) {
    const _0x55eaf9 = _0x17b060;
    if (!this[_0x55eaf9(0x70d)]) return;
    const _0x115129 = new PIXI['Graphics'](),
      _0x32c8b8 = _0x179cdd['gl'],
      _0x5543c6 = this[_0x55eaf9(0x70c)]['clone']();
    _0x179cdd[_0x55eaf9(0x316)]['forceStencil'](),
      (_0x115129['transform'] = this[_0x55eaf9(0x206)]),
      _0x179cdd[_0x55eaf9(0x6c6)][_0x55eaf9(0x523)](),
      _0x32c8b8[_0x55eaf9(0x5fc)](_0x32c8b8['STENCIL_TEST']);
    while (_0x5543c6[_0x55eaf9(0x540)] > 0x0) {
      const _0x487f7c = _0x5543c6[_0x55eaf9(0x7f4)]();
      _0x487f7c[_0x55eaf9(0x1a6)] &&
        _0x487f7c[_0x55eaf9(0x70d)] &&
        _0x487f7c[_0x55eaf9(0x141)] > 0x0 &&
        (_0x32c8b8[_0x55eaf9(0x723)](_0x32c8b8[_0x55eaf9(0x2f4)], 0x0, ~0x0),
        _0x32c8b8[_0x55eaf9(0x3f4)](_0x32c8b8[_0x55eaf9(0x55f)], _0x32c8b8['KEEP'], _0x32c8b8['KEEP']),
        _0x487f7c[_0x55eaf9(0x55e)](_0x179cdd),
        _0x179cdd['batch'][_0x55eaf9(0x523)](),
        _0x115129['clear'](),
        _0x32c8b8[_0x55eaf9(0x723)](_0x32c8b8[_0x55eaf9(0x3b9)], 0x1, ~0x0),
        _0x32c8b8[_0x55eaf9(0x3f4)](_0x32c8b8[_0x55eaf9(0x752)], _0x32c8b8[_0x55eaf9(0x752)], _0x32c8b8[_0x55eaf9(0x752)]),
        _0x32c8b8[_0x55eaf9(0x857)](_0x32c8b8[_0x55eaf9(0x497)], _0x32c8b8[_0x55eaf9(0x660)]),
        _0x115129[_0x55eaf9(0x55e)](_0x179cdd),
        _0x179cdd['batch'][_0x55eaf9(0x523)](),
        _0x32c8b8[_0x55eaf9(0x857)](_0x32c8b8[_0x55eaf9(0x660)], _0x32c8b8['ONE_MINUS_SRC_ALPHA']));
    }
    _0x32c8b8[_0x55eaf9(0x716)](_0x32c8b8[_0x55eaf9(0x5b3)]),
      _0x32c8b8[_0x55eaf9(0x2d5)](_0x32c8b8[_0x55eaf9(0x268)]),
      _0x32c8b8[_0x55eaf9(0x339)](0x0),
      _0x179cdd[_0x55eaf9(0x6c6)][_0x55eaf9(0x523)]();
    for (const _0xb99c56 of this[_0x55eaf9(0x70c)]) {
      !_0xb99c56[_0x55eaf9(0x1a6)] && _0xb99c56[_0x55eaf9(0x70d)] && _0xb99c56[_0x55eaf9(0x55e)](_0x179cdd);
    }
    _0x179cdd[_0x55eaf9(0x6c6)][_0x55eaf9(0x523)]();
  }),
  (DataManager[_0x17b060(0x88e)] = function (_0x416760) {
    return this['isItem'](_0x416760) && _0x416760['itypeId'] === 0x2;
  }),
  (VisuMZ[_0x17b060(0x77a)]['DataManager_setupNewGame'] = DataManager[_0x17b060(0x381)]),
  (DataManager['setupNewGame'] = function () {
    const _0x24aa04 = _0x17b060;
    VisuMZ['CoreEngine'][_0x24aa04(0x5fb)][_0x24aa04(0x64e)](this), this[_0x24aa04(0x88a)](), this[_0x24aa04(0x2c9)]();
  }),
  (DataManager['reservePlayTestNewGameCommonEvent'] = function () {
    const _0x2a5bc1 = _0x17b060;
    if ($gameTemp[_0x2a5bc1(0x6dc)]()) {
      const _0x24d25a = VisuMZ[_0x2a5bc1(0x77a)][_0x2a5bc1(0x382)][_0x2a5bc1(0x7ae)]['NewGameCommonEvent'];
      if (_0x24d25a > 0x0) $gameTemp[_0x2a5bc1(0x2cd)](_0x24d25a);
    }
  }),
  (DataManager[_0x17b060(0x2c9)] = function () {
    const _0x4bbcc8 = _0x17b060,
      _0x50ae8b = VisuMZ[_0x4bbcc8(0x77a)]['Settings'][_0x4bbcc8(0x7ae)][_0x4bbcc8(0x7c6)] || 0x0;
    if (_0x50ae8b > 0x0) $gameTemp[_0x4bbcc8(0x2cd)](_0x50ae8b);
  }),
  (DataManager[_0x17b060(0x70a)] = function (_0x4b9848) {
    const _0x3f469a = _0x17b060,
      _0x29e4ad = $dataTroops[_0x4b9848];
    if (!_0x29e4ad) return '';
    let _0x185d2d = '';
    _0x185d2d += _0x29e4ad[_0x3f469a(0x142)];
    for (const _0x2118cb of _0x29e4ad['pages']) {
      for (const _0x29e1c9 of _0x2118cb[_0x3f469a(0x53c)]) {
        [0x6c, 0x198]['includes'](_0x29e1c9['code']) && ((_0x185d2d += '\x0a'), (_0x185d2d += _0x29e1c9[_0x3f469a(0x1d6)][0x0]));
      }
    }
    return _0x185d2d;
  });
(VisuMZ['CoreEngine'][_0x17b060(0x382)]['QoL'][_0x17b060(0x26c)] ?? !![]) &&
  (($scene = null),
  (VisuMZ['CoreEngine']['Scene_Base_create'] = Scene_Base[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Base['prototype'][_0x17b060(0x3f6)] = function () {
    const _0x641582 = _0x17b060;
    VisuMZ['CoreEngine'][_0x641582(0x662)][_0x641582(0x64e)](this), ($scene = this);
  }),
  ($spriteset = null),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x8bb)] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x6d0)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x6d0)] = function () {
    const _0x28f609 = _0x17b060;
    VisuMZ[_0x28f609(0x77a)][_0x28f609(0x8bb)][_0x28f609(0x64e)](this), ($spriteset = this[_0x28f609(0x10b)]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x736)] = Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x6d0)]),
  (Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x6d0)] = function () {
    const _0x2c73c7 = _0x17b060;
    VisuMZ[_0x2c73c7(0x77a)][_0x2c73c7(0x736)][_0x2c73c7(0x64e)](this), ($spriteset = this[_0x2c73c7(0x10b)]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x631)] = Scene_Base[_0x17b060(0x54a)][_0x17b060(0x249)]),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x249)] = function () {
    const _0x3545b4 = _0x17b060;
    VisuMZ[_0x3545b4(0x77a)][_0x3545b4(0x631)][_0x3545b4(0x64e)](this), ($spriteset = null), ($subject = null), ($targets = null), ($target = null);
  }),
  ($subject = null),
  ($targets = null),
  ($target = null),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0xfd)] = BattleManager[_0x17b060(0x319)]),
  (BattleManager['update'] = function (_0x3794c4) {
    const _0x4a754b = _0x17b060;
    VisuMZ[_0x4a754b(0x77a)][_0x4a754b(0xfd)][_0x4a754b(0x64e)](this, _0x3794c4),
      ($subject = this[_0x4a754b(0x2af)]),
      ($targets = this[_0x4a754b(0xf6)]),
      ($target = this['_target'] || this['_targets'][0x0]);
  }),
  ($event = null),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x69f)] = Game_Event[_0x17b060(0x54a)]['start']),
  (Game_Event[_0x17b060(0x54a)][_0x17b060(0x6ae)] = function () {
    const _0x1ce59a = _0x17b060;
    VisuMZ['CoreEngine'][_0x1ce59a(0x69f)][_0x1ce59a(0x64e)](this), ($event = this);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x58b)] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x319)]),
  (Scene_Map[_0x17b060(0x54a)]['update'] = function () {
    const _0x46eb85 = _0x17b060;
    VisuMZ[_0x46eb85(0x77a)][_0x46eb85(0x58b)][_0x46eb85(0x64e)](this), $gameMap[_0x46eb85(0x213)]();
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x213)] = function () {
    !this['isEventRunning']() && $event !== null && ($event = null);
  }),
  ($commonEvent = function (_0x44453e) {
    const _0x360f9a = _0x17b060;
    if ($gameTemp) $gameTemp[_0x360f9a(0x2cd)](_0x44453e);
  }));
($onceParallel = function (_0x1c4631, _0x39b91c) {
  const _0x1f6e41 = _0x17b060;
  if (SceneManager[_0x1f6e41(0x482)]()) SceneManager[_0x1f6e41(0x2f9)][_0x1f6e41(0x7b8)](_0x1c4631, _0x39b91c);
  else {
    if (SceneManager[_0x1f6e41(0x51e)]()) {
      if (Imported[_0x1f6e41(0x2b4)]) SceneManager[_0x1f6e41(0x2f9)][_0x1f6e41(0x7b8)](_0x1c4631);
      else $gameTemp && $gameTemp[_0x1f6e41(0x6dc)]() && alert('Once\x20Parallel\x20for\x20Battle\x20requires\x20VisuMZ_1_BattleCore!');
    } else $gameTemp && $gameTemp[_0x1f6e41(0x6dc)]() && alert(_0x1f6e41(0x43f));
  }
}),
  (StorageManager['jsonToZip'] = function (_0x43f675) {
    return new Promise((_0x5e9df1, _0x201f8d) => {
      const _0x158795 = _0x55f7;
      try {
        const _0x773f30 = pako['deflate'](_0x43f675, { to: _0x158795(0x863), level: 0x1 });
        if (_0x773f30[_0x158795(0x540)] >= 0xc350) {
        }
        _0x5e9df1(_0x773f30);
      } catch (_0x2590c2) {
        _0x201f8d(_0x2590c2);
      }
    });
  }),
  (TextManager['stringKeyMap'] = [
    '',
    '',
    '',
    _0x17b060(0x5f4),
    '',
    '',
    _0x17b060(0x218),
    '',
    _0x17b060(0x317),
    _0x17b060(0x386),
    '',
    '',
    _0x17b060(0x17a),
    _0x17b060(0x2fe),
    _0x17b060(0x80a),
    '',
    _0x17b060(0x1d1),
    _0x17b060(0x724),
    _0x17b060(0x511),
    _0x17b060(0x669),
    'CAPSLOCK',
    'KANA',
    _0x17b060(0x7c0),
    _0x17b060(0x74b),
    _0x17b060(0x6fb),
    _0x17b060(0x210),
    '',
    _0x17b060(0x2f5),
    _0x17b060(0x1b9),
    _0x17b060(0x48f),
    _0x17b060(0x3de),
    _0x17b060(0x3ad),
    _0x17b060(0x5c7),
    _0x17b060(0x21e),
    _0x17b060(0x8b9),
    _0x17b060(0x7b4),
    _0x17b060(0x323),
    _0x17b060(0x6fa),
    'UP',
    _0x17b060(0x179),
    _0x17b060(0x4e1),
    _0x17b060(0x3fa),
    _0x17b060(0x392),
    _0x17b060(0xe6),
    _0x17b060(0x45d),
    'INSERT',
    _0x17b060(0x16b),
    '',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    _0x17b060(0x42e),
    'SEMICOLON',
    _0x17b060(0x204),
    _0x17b060(0x58c),
    _0x17b060(0x682),
    _0x17b060(0x5fd),
    'AT',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    _0x17b060(0x428),
    '',
    _0x17b060(0x43a),
    '',
    'SLEEP',
    _0x17b060(0x494),
    'NUMPAD1',
    _0x17b060(0x53e),
    _0x17b060(0x367),
    _0x17b060(0x7e3),
    'NUMPAD5',
    'NUMPAD6',
    'NUMPAD7',
    _0x17b060(0x443),
    _0x17b060(0x7af),
    'MULTIPLY',
    _0x17b060(0x5d5),
    _0x17b060(0x777),
    _0x17b060(0x665),
    'DECIMAL',
    _0x17b060(0x2e7),
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    _0x17b060(0x534),
    _0x17b060(0x549),
    _0x17b060(0x7c1),
    _0x17b060(0x129),
    _0x17b060(0x7ca),
    _0x17b060(0x6ab),
    _0x17b060(0x7a7),
    'F18',
    _0x17b060(0x698),
    _0x17b060(0x86b),
    _0x17b060(0x27f),
    'F22',
    _0x17b060(0x6ca),
    _0x17b060(0x1a0),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    _0x17b060(0x65f),
    _0x17b060(0x7dc),
    _0x17b060(0x572),
    'WIN_OEM_FJ_MASSHOU',
    _0x17b060(0x89e),
    _0x17b060(0x556),
    _0x17b060(0x83d),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    _0x17b060(0x28a),
    _0x17b060(0x88f),
    'DOUBLE_QUOTE',
    _0x17b060(0x50d),
    'DOLLAR',
    'PERCENT',
    _0x17b060(0x6bb),
    'UNDERSCORE',
    _0x17b060(0x207),
    'CLOSE_PAREN',
    _0x17b060(0x69e),
    'PLUS',
    'PIPE',
    _0x17b060(0x200),
    _0x17b060(0x120),
    _0x17b060(0x24b),
    'TILDE',
    '',
    '',
    '',
    '',
    'VOLUME_MUTE',
    _0x17b060(0x2fa),
    'VOLUME_UP',
    '',
    '',
    _0x17b060(0x2c1),
    'EQUALS',
    _0x17b060(0x861),
    _0x17b060(0x82e),
    _0x17b060(0x782),
    _0x17b060(0x402),
    _0x17b060(0x240),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    _0x17b060(0x7b1),
    _0x17b060(0x31b),
    _0x17b060(0x8ad),
    _0x17b060(0x1ad),
    '',
    _0x17b060(0x130),
    _0x17b060(0x4a9),
    '',
    _0x17b060(0x529),
    _0x17b060(0x263),
    '',
    _0x17b060(0x635),
    '',
    '',
    'WIN_OEM_RESET',
    'WIN_OEM_JUMP',
    'WIN_OEM_PA1',
    _0x17b060(0x401),
    _0x17b060(0x2db),
    _0x17b060(0x426),
    'WIN_OEM_CUSEL',
    _0x17b060(0x37a),
    _0x17b060(0x356),
    _0x17b060(0x699),
    _0x17b060(0x710),
    _0x17b060(0x6e8),
    _0x17b060(0x6f8),
    _0x17b060(0x35a),
    _0x17b060(0x100),
    _0x17b060(0x4a4),
    _0x17b060(0x760),
    _0x17b060(0x302),
    'ZOOM',
    '',
    _0x17b060(0x495),
    _0x17b060(0x5e2),
    '',
  ]),
  (TextManager['buttonAssistOk'] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x862)][_0x17b060(0x776)]),
  (TextManager[_0x17b060(0x225)] = VisuMZ['CoreEngine']['Settings']['ButtonAssist']['CancelText']),
  (TextManager[_0x17b060(0x3ce)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x862)][_0x17b060(0x6b1)]),
  (VisuMZ['CoreEngine'][_0x17b060(0x253)] = TextManager[_0x17b060(0x7a1)]),
  (TextManager[_0x17b060(0x7a1)] = function (_0x2c1915) {
    const _0x43b79e = _0x17b060;
    return typeof _0x2c1915 === _0x43b79e(0x7c2) ? VisuMZ[_0x43b79e(0x77a)]['TextManager_param'][_0x43b79e(0x64e)](this, _0x2c1915) : this['paramName'](_0x2c1915);
  }),
  (TextManager['paramName'] = function (_0x548bd2) {
    const _0x213e4f = _0x17b060;
    _0x548bd2 = String(_0x548bd2 || '')['toUpperCase']();
    const _0x447ca3 = VisuMZ[_0x213e4f(0x77a)][_0x213e4f(0x382)]['Param'];
    if (_0x548bd2 === _0x213e4f(0x3cd)) return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x0];
    if (_0x548bd2 === _0x213e4f(0x148)) return $dataSystem[_0x213e4f(0x3f1)]['params'][0x1];
    if (_0x548bd2 === _0x213e4f(0x135)) return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x2];
    if (_0x548bd2 === _0x213e4f(0x689)) return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x3];
    if (_0x548bd2 === 'MAT') return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x4];
    if (_0x548bd2 === _0x213e4f(0x3be)) return $dataSystem['terms'][_0x213e4f(0x5aa)][0x5];
    if (_0x548bd2 === _0x213e4f(0x30a)) return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x6];
    if (_0x548bd2 === _0x213e4f(0xec)) return $dataSystem[_0x213e4f(0x3f1)][_0x213e4f(0x5aa)][0x7];
    if (_0x548bd2 === _0x213e4f(0x889)) return _0x447ca3[_0x213e4f(0x434)];
    if (_0x548bd2 === _0x213e4f(0x2ce)) return _0x447ca3[_0x213e4f(0x436)];
    if (_0x548bd2 === 'CRI') return _0x447ca3['XParamVocab2'];
    if (_0x548bd2 === _0x213e4f(0x4bb)) return _0x447ca3[_0x213e4f(0x6d9)];
    if (_0x548bd2 === _0x213e4f(0x17d)) return _0x447ca3[_0x213e4f(0x3c8)];
    if (_0x548bd2 === _0x213e4f(0x11f)) return _0x447ca3[_0x213e4f(0x603)];
    if (_0x548bd2 === 'CNT') return _0x447ca3[_0x213e4f(0x734)];
    if (_0x548bd2 === _0x213e4f(0x599)) return _0x447ca3[_0x213e4f(0x2e8)];
    if (_0x548bd2 === _0x213e4f(0x69b)) return _0x447ca3[_0x213e4f(0x20b)];
    if (_0x548bd2 === _0x213e4f(0x655)) return _0x447ca3[_0x213e4f(0x5d9)];
    if (_0x548bd2 === _0x213e4f(0x260)) return _0x447ca3[_0x213e4f(0x748)];
    if (_0x548bd2 === 'GRD') return _0x447ca3[_0x213e4f(0x686)];
    if (_0x548bd2 === 'REC') return _0x447ca3[_0x213e4f(0x149)];
    if (_0x548bd2 === _0x213e4f(0x728)) return _0x447ca3['SParamVocab3'];
    if (_0x548bd2 === 'MCR') return _0x447ca3['SParamVocab4'];
    if (_0x548bd2 === _0x213e4f(0x828)) return _0x447ca3[_0x213e4f(0x2d8)];
    if (_0x548bd2 === _0x213e4f(0x11a)) return _0x447ca3['SParamVocab6'];
    if (_0x548bd2 === _0x213e4f(0x121)) return _0x447ca3['SParamVocab7'];
    if (_0x548bd2 === _0x213e4f(0x1a8)) return _0x447ca3[_0x213e4f(0x2c8)];
    if (_0x548bd2 === 'EXR') return _0x447ca3[_0x213e4f(0x5bf)];
    if (VisuMZ[_0x213e4f(0x77a)][_0x213e4f(0x42d)][_0x548bd2]) return VisuMZ[_0x213e4f(0x77a)][_0x213e4f(0x42d)][_0x548bd2];
    return '';
  }),
  (TextManager['getInputButtonString'] = function (_0x4789b2) {
    const _0x4f3be0 = _0x17b060,
      _0x2dcaaf = Input['getLastUsedGamepadType']();
    return _0x2dcaaf === 'Keyboard' ? this['getKeyboardInputButtonString'](_0x4789b2) : this[_0x4f3be0(0x806)](_0x2dcaaf, _0x4789b2);
  }),
  (TextManager[_0x17b060(0x38a)] = function (_0x41e1a6) {
    const _0x1c6085 = _0x17b060,
      _0x50544a = VisuMZ[_0x1c6085(0x77a)][_0x1c6085(0x382)][_0x1c6085(0x862)][_0x1c6085(0x337)];
    if (!_0x50544a) {
      if (_0x41e1a6 === _0x1c6085(0x314)) _0x41e1a6 = _0x1c6085(0xeb);
      if (_0x41e1a6 === 'menu') _0x41e1a6 = _0x1c6085(0xeb);
    }
    let _0x1b2287 = [];
    for (let _0x1ddb59 in Input[_0x1c6085(0x51d)]) {
      _0x1ddb59 = Number(_0x1ddb59);
      if (_0x1ddb59 >= 0x60 && _0x1ddb59 <= 0x69) continue;
      if ([0x12, 0x20][_0x1c6085(0x1ae)](_0x1ddb59)) continue;
      _0x41e1a6 === Input[_0x1c6085(0x51d)][_0x1ddb59] && _0x1b2287[_0x1c6085(0x6f2)](_0x1ddb59);
    }
    for (let _0x49eee4 = 0x0; _0x49eee4 < _0x1b2287['length']; _0x49eee4++) {
      _0x1b2287[_0x49eee4] = TextManager[_0x1c6085(0x522)][_0x1b2287[_0x49eee4]];
    }
    return this[_0x1c6085(0x183)](_0x1b2287);
  }),
  (TextManager[_0x17b060(0x183)] = function (_0x3f4f2d) {
    const _0x3d691f = _0x17b060,
      _0x2d03c2 = VisuMZ[_0x3d691f(0x77a)][_0x3d691f(0x382)]['ButtonAssist'],
      _0x30f15a = _0x2d03c2[_0x3d691f(0x71a)],
      _0xee4f66 = _0x3f4f2d[_0x3d691f(0x122)](),
      _0x23ac41 = _0x3d691f(0x13b)[_0x3d691f(0x1df)](_0xee4f66);
    return _0x2d03c2[_0x23ac41] ? _0x2d03c2[_0x23ac41] : _0x30f15a[_0x3d691f(0x1df)](_0xee4f66);
  }),
  (TextManager[_0x17b060(0x165)] = function (_0x54b7cf, _0x470e3a) {
    const _0x12b7c2 = _0x17b060,
      _0x5c9745 = VisuMZ[_0x12b7c2(0x77a)][_0x12b7c2(0x382)][_0x12b7c2(0x862)],
      _0xf79293 = _0x5c9745[_0x12b7c2(0x779)],
      _0x54c0d4 = this[_0x12b7c2(0x713)](_0x54b7cf),
      _0x2abf08 = this[_0x12b7c2(0x713)](_0x470e3a);
    return _0xf79293[_0x12b7c2(0x1df)](_0x54c0d4, _0x2abf08);
  }),
  (TextManager[_0x17b060(0x806)] = function (_0x38aa38, _0x3fe345) {
    const _0x42a932 = _0x17b060,
      _0x4dd6c0 = _0x38aa38['toLowerCase']()[_0x42a932(0x711)](),
      _0x380080 = VisuMZ[_0x42a932(0x77a)][_0x42a932(0x4b0)][_0x4dd6c0];
    if (!_0x380080) return this[_0x42a932(0x4e8)](_0x38aa38, _0x3fe345);
    return _0x380080[_0x3fe345] || this[_0x42a932(0x38a)](_0x38aa38, _0x3fe345);
  }),
  (TextManager[_0x17b060(0x4e8)] = function (_0x3db79a, _0x3cc328) {
    const _0x2042ed = _0x17b060,
      _0x482976 = _0x3db79a[_0x2042ed(0x853)]()['trim']();
    for (const _0x28a5fd in VisuMZ[_0x2042ed(0x77a)][_0x2042ed(0x111)]) {
      if (_0x482976[_0x2042ed(0x1ae)](_0x28a5fd)) {
        const _0x5b90d9 = VisuMZ[_0x2042ed(0x77a)][_0x2042ed(0x111)][_0x28a5fd],
          _0x344f5e = VisuMZ[_0x2042ed(0x77a)][_0x2042ed(0x4b0)][_0x5b90d9];
        return _0x344f5e[_0x3cc328] || this['getKeyboardInputButtonString'](_0x3cc328);
      }
    }
    return this['getKeyboardInputButtonString'](_0x3cc328);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x5d8)] = ColorManager[_0x17b060(0x866)]),
  (ColorManager['loadWindowskin'] = function () {
    const _0x9e4713 = _0x17b060;
    VisuMZ['CoreEngine'][_0x9e4713(0x5d8)]['call'](this), (this[_0x9e4713(0x624)] = this[_0x9e4713(0x624)] || {});
  }),
  (ColorManager['getColorDataFromPluginParameters'] = function (_0x5c941d, _0x312ef4) {
    const _0x5a4669 = _0x17b060;
    return (
      (_0x312ef4 = String(_0x312ef4)),
      (this['_colorCache'] = this[_0x5a4669(0x624)] || {}),
      _0x312ef4[_0x5a4669(0x2ba)](/#(.*)/i)
        ? (this[_0x5a4669(0x624)][_0x5c941d] = _0x5a4669(0x611)[_0x5a4669(0x1df)](String(RegExp['$1'])))
        : (this[_0x5a4669(0x624)][_0x5c941d] = this[_0x5a4669(0x346)](Number(_0x312ef4))),
      this['_colorCache'][_0x5c941d]
    );
  }),
  (ColorManager[_0x17b060(0xf7)] = function (_0x1bc991) {
    const _0x52353b = _0x17b060;
    return (_0x1bc991 = String(_0x1bc991)), _0x1bc991[_0x52353b(0x2ba)](/#(.*)/i) ? _0x52353b(0x611)[_0x52353b(0x1df)](String(RegExp['$1'])) : this[_0x52353b(0x346)](Number(_0x1bc991));
  }),
  (ColorManager[_0x17b060(0x68e)] = function () {
    this['_colorCache'] = {};
  }),
  (ColorManager[_0x17b060(0x743)] = function () {
    const _0x1cecea = _0x17b060,
      _0x472e84 = '_stored_normalColor';
    this['_colorCache'] = this[_0x1cecea(0x624)] || {};
    if (this[_0x1cecea(0x624)][_0x472e84]) return this[_0x1cecea(0x624)][_0x472e84];
    const _0x57c1d8 = VisuMZ[_0x1cecea(0x77a)][_0x1cecea(0x382)][_0x1cecea(0x628)][_0x1cecea(0x616)];
    return this[_0x1cecea(0x68c)](_0x472e84, _0x57c1d8);
  }),
  (ColorManager[_0x17b060(0x4ca)] = function () {
    const _0x155b6c = _0x17b060,
      _0x327076 = _0x155b6c(0x280);
    this['_colorCache'] = this['_colorCache'] || {};
    if (this['_colorCache'][_0x327076]) return this[_0x155b6c(0x624)][_0x327076];
    const _0x5c3d8b = VisuMZ[_0x155b6c(0x77a)]['Settings']['Color']['ColorSystem'];
    return this[_0x155b6c(0x68c)](_0x327076, _0x5c3d8b);
  }),
  (ColorManager[_0x17b060(0x488)] = function () {
    const _0x4e4a6f = _0x17b060,
      _0x562045 = _0x4e4a6f(0x110);
    this[_0x4e4a6f(0x624)] = this[_0x4e4a6f(0x624)] || {};
    if (this[_0x4e4a6f(0x624)][_0x562045]) return this['_colorCache'][_0x562045];
    const _0x3cd747 = VisuMZ['CoreEngine'][_0x4e4a6f(0x382)]['Color'][_0x4e4a6f(0x478)];
    return this[_0x4e4a6f(0x68c)](_0x562045, _0x3cd747);
  }),
  (ColorManager[_0x17b060(0x366)] = function () {
    const _0x3c3384 = _0x17b060,
      _0x1e034b = _0x3c3384(0x4eb);
    this[_0x3c3384(0x624)] = this[_0x3c3384(0x624)] || {};
    if (this[_0x3c3384(0x624)][_0x1e034b]) return this[_0x3c3384(0x624)][_0x1e034b];
    const _0x918163 = VisuMZ[_0x3c3384(0x77a)][_0x3c3384(0x382)][_0x3c3384(0x628)][_0x3c3384(0x7c8)];
    return this[_0x3c3384(0x68c)](_0x1e034b, _0x918163);
  }),
  (ColorManager['gaugeBackColor'] = function () {
    const _0x232d56 = _0x17b060,
      _0x3188b5 = _0x232d56(0x102);
    this[_0x232d56(0x624)] = this['_colorCache'] || {};
    if (this[_0x232d56(0x624)][_0x3188b5]) return this[_0x232d56(0x624)][_0x3188b5];
    const _0x4f594e = VisuMZ[_0x232d56(0x77a)][_0x232d56(0x382)][_0x232d56(0x628)][_0x232d56(0x7cc)];
    return this['getColorDataFromPluginParameters'](_0x3188b5, _0x4f594e);
  }),
  (ColorManager[_0x17b060(0x191)] = function () {
    const _0x26083e = _0x17b060,
      _0x367ced = '_stored_hpGaugeColor1';
    this[_0x26083e(0x624)] = this[_0x26083e(0x624)] || {};
    if (this[_0x26083e(0x624)][_0x367ced]) return this[_0x26083e(0x624)][_0x367ced];
    const _0x18ce34 = VisuMZ['CoreEngine'][_0x26083e(0x382)][_0x26083e(0x628)][_0x26083e(0x3bf)];
    return this[_0x26083e(0x68c)](_0x367ced, _0x18ce34);
  }),
  (ColorManager[_0x17b060(0x4d7)] = function () {
    const _0x1fdfc3 = _0x17b060,
      _0x10cf62 = _0x1fdfc3(0x171);
    this[_0x1fdfc3(0x624)] = this[_0x1fdfc3(0x624)] || {};
    if (this[_0x1fdfc3(0x624)][_0x10cf62]) return this[_0x1fdfc3(0x624)][_0x10cf62];
    const _0x2d18de = VisuMZ[_0x1fdfc3(0x77a)][_0x1fdfc3(0x382)][_0x1fdfc3(0x628)][_0x1fdfc3(0x18f)];
    return this[_0x1fdfc3(0x68c)](_0x10cf62, _0x2d18de);
  }),
  (ColorManager[_0x17b060(0x12a)] = function () {
    const _0x15d6d6 = _0x17b060,
      _0x5bf613 = _0x15d6d6(0x1a2);
    this['_colorCache'] = this['_colorCache'] || {};
    if (this[_0x15d6d6(0x624)][_0x5bf613]) return this[_0x15d6d6(0x624)][_0x5bf613];
    const _0x4ff817 = VisuMZ['CoreEngine'][_0x15d6d6(0x382)][_0x15d6d6(0x628)][_0x15d6d6(0x71c)];
    return this[_0x15d6d6(0x68c)](_0x5bf613, _0x4ff817);
  }),
  (ColorManager[_0x17b060(0x6a4)] = function () {
    const _0x116caf = _0x17b060,
      _0x453915 = _0x116caf(0x7eb);
    this[_0x116caf(0x624)] = this[_0x116caf(0x624)] || {};
    if (this[_0x116caf(0x624)][_0x453915]) return this[_0x116caf(0x624)][_0x453915];
    const _0x59fe6f = VisuMZ[_0x116caf(0x77a)]['Settings']['Color']['ColorMPGauge2'];
    return this[_0x116caf(0x68c)](_0x453915, _0x59fe6f);
  }),
  (ColorManager[_0x17b060(0x158)] = function () {
    const _0x4d2d4f = _0x17b060,
      _0x1bc893 = '_stored_mpCostColor';
    this[_0x4d2d4f(0x624)] = this[_0x4d2d4f(0x624)] || {};
    if (this[_0x4d2d4f(0x624)][_0x1bc893]) return this[_0x4d2d4f(0x624)][_0x1bc893];
    const _0x2e5e82 = VisuMZ[_0x4d2d4f(0x77a)][_0x4d2d4f(0x382)]['Color']['ColorMPCost'];
    return this[_0x4d2d4f(0x68c)](_0x1bc893, _0x2e5e82);
  }),
  (ColorManager['powerUpColor'] = function () {
    const _0x12aea8 = _0x17b060,
      _0x1c8e65 = '_stored_powerUpColor';
    this[_0x12aea8(0x624)] = this[_0x12aea8(0x624)] || {};
    if (this['_colorCache'][_0x1c8e65]) return this[_0x12aea8(0x624)][_0x1c8e65];
    const _0x3e602a = VisuMZ[_0x12aea8(0x77a)][_0x12aea8(0x382)][_0x12aea8(0x628)][_0x12aea8(0x1f0)];
    return this[_0x12aea8(0x68c)](_0x1c8e65, _0x3e602a);
  }),
  (ColorManager[_0x17b060(0x57c)] = function () {
    const _0x3e310c = _0x17b060,
      _0x55cc26 = '_stored_powerDownColor';
    this['_colorCache'] = this['_colorCache'] || {};
    if (this[_0x3e310c(0x624)][_0x55cc26]) return this[_0x3e310c(0x624)][_0x55cc26];
    const _0x28e0b6 = VisuMZ[_0x3e310c(0x77a)][_0x3e310c(0x382)][_0x3e310c(0x628)]['ColorPowerDown'];
    return this['getColorDataFromPluginParameters'](_0x55cc26, _0x28e0b6);
  }),
  (ColorManager[_0x17b060(0x163)] = function () {
    const _0x2544ab = _0x17b060,
      _0x28453c = _0x2544ab(0x4a7);
    this[_0x2544ab(0x624)] = this[_0x2544ab(0x624)] || {};
    if (this['_colorCache'][_0x28453c]) return this[_0x2544ab(0x624)][_0x28453c];
    const _0x15d943 = VisuMZ[_0x2544ab(0x77a)]['Settings'][_0x2544ab(0x628)][_0x2544ab(0x5cc)];
    return this[_0x2544ab(0x68c)](_0x28453c, _0x15d943);
  }),
  (ColorManager[_0x17b060(0x6c8)] = function () {
    const _0x4d5b13 = _0x17b060,
      _0x15403a = '_stored_ctGaugeColor2';
    this[_0x4d5b13(0x624)] = this[_0x4d5b13(0x624)] || {};
    if (this[_0x4d5b13(0x624)][_0x15403a]) return this['_colorCache'][_0x15403a];
    const _0x65bde = VisuMZ[_0x4d5b13(0x77a)]['Settings'][_0x4d5b13(0x628)][_0x4d5b13(0x41a)];
    return this['getColorDataFromPluginParameters'](_0x15403a, _0x65bde);
  }),
  (ColorManager[_0x17b060(0x76b)] = function () {
    const _0x4ba0a3 = _0x17b060,
      _0x2851a3 = _0x4ba0a3(0x36a);
    this['_colorCache'] = this[_0x4ba0a3(0x624)] || {};
    if (this[_0x4ba0a3(0x624)][_0x2851a3]) return this[_0x4ba0a3(0x624)][_0x2851a3];
    const _0x4028b5 = VisuMZ[_0x4ba0a3(0x77a)][_0x4ba0a3(0x382)][_0x4ba0a3(0x628)][_0x4ba0a3(0x703)];
    return this['getColorDataFromPluginParameters'](_0x2851a3, _0x4028b5);
  }),
  (ColorManager[_0x17b060(0x719)] = function () {
    const _0x1bd3ee = _0x17b060,
      _0x3c6e11 = '_stored_tpGaugeColor2';
    this[_0x1bd3ee(0x624)] = this[_0x1bd3ee(0x624)] || {};
    if (this['_colorCache'][_0x3c6e11]) return this[_0x1bd3ee(0x624)][_0x3c6e11];
    const _0x48c8e8 = VisuMZ[_0x1bd3ee(0x77a)][_0x1bd3ee(0x382)]['Color'][_0x1bd3ee(0x59c)];
    return this[_0x1bd3ee(0x68c)](_0x3c6e11, _0x48c8e8);
  }),
  (ColorManager[_0x17b060(0x620)] = function () {
    const _0x410fd0 = _0x17b060,
      _0x3158d6 = _0x410fd0(0x236);
    this[_0x410fd0(0x624)] = this[_0x410fd0(0x624)] || {};
    if (this['_colorCache'][_0x3158d6]) return this[_0x410fd0(0x624)][_0x3158d6];
    const _0x31fad1 = VisuMZ['CoreEngine'][_0x410fd0(0x382)]['Color'][_0x410fd0(0x3f7)];
    return this[_0x410fd0(0x68c)](_0x3158d6, _0x31fad1);
  }),
  (ColorManager[_0x17b060(0x19e)] = function () {
    const _0x411454 = _0x17b060,
      _0x5363db = _0x411454(0x609);
    this[_0x411454(0x624)] = this[_0x411454(0x624)] || {};
    if (this[_0x411454(0x624)][_0x5363db]) return this[_0x411454(0x624)][_0x5363db];
    const _0x510f99 = VisuMZ[_0x411454(0x77a)][_0x411454(0x382)][_0x411454(0x628)][_0x411454(0x3f7)];
    return this[_0x411454(0x68c)](_0x5363db, _0x510f99);
  }),
  (ColorManager[_0x17b060(0x4bf)] = function () {
    const _0x14a5f3 = _0x17b060,
      _0x189443 = '_stored_expGaugeColor1';
    this['_colorCache'] = this[_0x14a5f3(0x624)] || {};
    if (this[_0x14a5f3(0x624)][_0x189443]) return this[_0x14a5f3(0x624)][_0x189443];
    const _0x30c189 = VisuMZ[_0x14a5f3(0x77a)][_0x14a5f3(0x382)][_0x14a5f3(0x628)]['ColorExpGauge1'];
    return this[_0x14a5f3(0x68c)](_0x189443, _0x30c189);
  }),
  (ColorManager[_0x17b060(0x4da)] = function () {
    const _0x54d49c = _0x17b060,
      _0x7c9d6a = _0x54d49c(0x836);
    this[_0x54d49c(0x624)] = this[_0x54d49c(0x624)] || {};
    if (this[_0x54d49c(0x624)][_0x7c9d6a]) return this[_0x54d49c(0x624)][_0x7c9d6a];
    const _0x225b2c = VisuMZ[_0x54d49c(0x77a)][_0x54d49c(0x382)][_0x54d49c(0x628)][_0x54d49c(0x791)];
    return this[_0x54d49c(0x68c)](_0x7c9d6a, _0x225b2c);
  }),
  (ColorManager[_0x17b060(0x26e)] = function () {
    const _0x538e0c = _0x17b060,
      _0x1813ae = _0x538e0c(0x717);
    this['_colorCache'] = this[_0x538e0c(0x624)] || {};
    if (this[_0x538e0c(0x624)][_0x1813ae]) return this[_0x538e0c(0x624)][_0x1813ae];
    const _0x3e53d1 = VisuMZ[_0x538e0c(0x77a)]['Settings'][_0x538e0c(0x628)]['ColorMaxLvGauge1'];
    return this[_0x538e0c(0x68c)](_0x1813ae, _0x3e53d1);
  }),
  (ColorManager[_0x17b060(0x60d)] = function () {
    const _0x35ef46 = _0x17b060,
      _0xbca6f8 = _0x35ef46(0x345);
    this[_0x35ef46(0x624)] = this[_0x35ef46(0x624)] || {};
    if (this[_0x35ef46(0x624)][_0xbca6f8]) return this[_0x35ef46(0x624)][_0xbca6f8];
    const _0xf3ac20 = VisuMZ[_0x35ef46(0x77a)][_0x35ef46(0x382)][_0x35ef46(0x628)][_0x35ef46(0x4aa)];
    return this[_0x35ef46(0x68c)](_0xbca6f8, _0xf3ac20);
  }),
  (ColorManager['hpColor'] = function (_0x572785) {
    const _0x16b050 = _0x17b060;
    return VisuMZ[_0x16b050(0x77a)][_0x16b050(0x382)][_0x16b050(0x628)][_0x16b050(0x29b)][_0x16b050(0x64e)](this, _0x572785);
  }),
  (ColorManager['mpColor'] = function (_0x12c388) {
    const _0x3ead23 = _0x17b060;
    return VisuMZ[_0x3ead23(0x77a)]['Settings'][_0x3ead23(0x628)][_0x3ead23(0x84e)][_0x3ead23(0x64e)](this, _0x12c388);
  }),
  (ColorManager['tpColor'] = function (_0x16fc6f) {
    const _0x539c1d = _0x17b060;
    return VisuMZ[_0x539c1d(0x77a)]['Settings'][_0x539c1d(0x628)][_0x539c1d(0x4df)][_0x539c1d(0x64e)](this, _0x16fc6f);
  }),
  (ColorManager[_0x17b060(0x7f5)] = function (_0x47a94b) {
    const _0x786be0 = _0x17b060;
    return VisuMZ[_0x786be0(0x77a)]['Settings']['Color'][_0x786be0(0x89d)][_0x786be0(0x64e)](this, _0x47a94b);
  }),
  (ColorManager[_0x17b060(0x35d)] = function (_0x322b59) {
    const _0x4f907c = _0x17b060;
    return VisuMZ[_0x4f907c(0x77a)][_0x4f907c(0x382)]['Color'][_0x4f907c(0x82f)][_0x4f907c(0x64e)](this, _0x322b59);
  }),
  (ColorManager[_0x17b060(0x409)] = function () {
    const _0x292508 = _0x17b060;
    return VisuMZ['CoreEngine'][_0x292508(0x382)][_0x292508(0x628)][_0x292508(0x471)];
  }),
  (ColorManager[_0x17b060(0x2dd)] = function () {
    const _0x34df83 = _0x17b060;
    return VisuMZ[_0x34df83(0x77a)]['Settings'][_0x34df83(0x628)]['OutlineColorDmg'] || _0x34df83(0x4d0);
  }),
  (ColorManager[_0x17b060(0x462)] = function () {
    const _0x1c493b = _0x17b060;
    return VisuMZ[_0x1c493b(0x77a)][_0x1c493b(0x382)][_0x1c493b(0x628)][_0x1c493b(0x86d)] || _0x1c493b(0x1e2);
  }),
  (ColorManager[_0x17b060(0x587)] = function () {
    const _0x26da2b = _0x17b060;
    return VisuMZ['CoreEngine'][_0x26da2b(0x382)]['Color'][_0x26da2b(0x573)];
  }),
  (ColorManager[_0x17b060(0x1a7)] = function () {
    const _0x2d736c = _0x17b060;
    return VisuMZ[_0x2d736c(0x77a)][_0x2d736c(0x382)][_0x2d736c(0x628)][_0x2d736c(0x58f)];
  }),
  (ColorManager[_0x17b060(0x208)] = function () {
    const _0x24df95 = _0x17b060;
    return VisuMZ[_0x24df95(0x77a)]['Settings'][_0x24df95(0x628)][_0x24df95(0x62a)];
  }),
  (ColorManager[_0x17b060(0x5dc)] = function () {
    const _0x18ce1d = _0x17b060;
    return VisuMZ[_0x18ce1d(0x77a)][_0x18ce1d(0x382)][_0x18ce1d(0x628)][_0x18ce1d(0x235)];
  }),
  (SceneManager[_0x17b060(0x884)] = []),
  (SceneManager[_0x17b060(0x51e)] = function () {
    const _0x31ba36 = _0x17b060;
    return this[_0x31ba36(0x2f9)] && this[_0x31ba36(0x2f9)][_0x31ba36(0x60c)] === Scene_Battle;
  }),
  (SceneManager[_0x17b060(0x482)] = function () {
    const _0x1c780d = _0x17b060;
    return this[_0x1c780d(0x2f9)] && this[_0x1c780d(0x2f9)][_0x1c780d(0x60c)] === Scene_Map;
  }),
  (SceneManager[_0x17b060(0x563)] = function () {
    const _0x1b708c = _0x17b060;
    return this[_0x1b708c(0x2f9)] && this[_0x1b708c(0x2f9)] instanceof Scene_Map;
  }),
  (VisuMZ[_0x17b060(0x77a)]['SceneManager_initialize'] = SceneManager[_0x17b060(0x3e0)]),
  (SceneManager[_0x17b060(0x3e0)] = function () {
    const _0x31b7fd = _0x17b060;
    VisuMZ[_0x31b7fd(0x77a)][_0x31b7fd(0x431)][_0x31b7fd(0x64e)](this), this['initVisuMZCoreEngine']();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x6d3)] = SceneManager[_0x17b060(0x856)]),
  (SceneManager['onKeyDown'] = function (_0x158091) {
    const _0x3db093 = _0x17b060;
    if ($gameTemp) this[_0x3db093(0x16a)](_0x158091);
    VisuMZ[_0x3db093(0x77a)][_0x3db093(0x6d3)]['call'](this, _0x158091);
  }),
  (SceneManager[_0x17b060(0x16a)] = function (_0x246409) {
    const _0x3614dd = _0x17b060;
    if (!_0x246409[_0x3614dd(0x300)] && !_0x246409[_0x3614dd(0x31a)])
      switch (_0x246409[_0x3614dd(0x282)]) {
        case 0x52:
          this['playTestShiftR']();
          break;
        case 0x54:
          this['playTestShiftT']();
          break;
        case 0x75:
          this['playTestF6']();
          break;
        case 0x76:
          if (Input[_0x3614dd(0x285)](_0x3614dd(0x7f4)) || Input['isPressed'](_0x3614dd(0x4c0))) return;
          this[_0x3614dd(0x4c4)]();
          break;
      }
    else {
      if (_0x246409[_0x3614dd(0x300)]) {
        let _0x3c1b76 = _0x246409[_0x3614dd(0x282)];
        if (_0x3c1b76 >= 0x31 && _0x3c1b76 <= 0x39) {
          const _0xbaf8f2 = _0x3c1b76 - 0x30;
          return SceneManager[_0x3614dd(0x28e)](_0xbaf8f2);
        } else {
          if (_0x3c1b76 >= 0x61 && _0x3c1b76 <= 0x69) {
            const _0x13a9f9 = _0x3c1b76 - 0x60;
            return SceneManager['playtestQuickLoad'](_0x13a9f9);
          }
        }
      }
    }
  }),
  (SceneManager[_0x17b060(0x795)] = function () {
    const _0x45a318 = _0x17b060;
    if ($gameTemp[_0x45a318(0x6dc)]() && VisuMZ['CoreEngine'][_0x45a318(0x382)][_0x45a318(0x7ae)][_0x45a318(0x1e7)]) {
      ConfigManager[_0x45a318(0x2d4)] !== 0x0
        ? ((ConfigManager['bgmVolume'] = 0x0), (ConfigManager[_0x45a318(0x7ec)] = 0x0), (ConfigManager['meVolume'] = 0x0), (ConfigManager['seVolume'] = 0x0))
        : ((ConfigManager['bgmVolume'] = 0x64), (ConfigManager[_0x45a318(0x7ec)] = 0x64), (ConfigManager[_0x45a318(0x5c8)] = 0x64), (ConfigManager['seVolume'] = 0x64));
      ConfigManager[_0x45a318(0x25e)]();
      if (this[_0x45a318(0x2f9)]['constructor'] === Scene_Options) {
        if (this['_scene'][_0x45a318(0x48a)]) this[_0x45a318(0x2f9)][_0x45a318(0x48a)][_0x45a318(0x80e)]();
        if (this[_0x45a318(0x2f9)][_0x45a318(0x234)]) this['_scene'][_0x45a318(0x234)][_0x45a318(0x80e)]();
      }
    }
  }),
  (SceneManager[_0x17b060(0x4c4)] = function () {
    const _0x434172 = _0x17b060;
    $gameTemp[_0x434172(0x6dc)]() && VisuMZ[_0x434172(0x77a)]['Settings'][_0x434172(0x7ae)][_0x434172(0x1fd)] && ($gameTemp[_0x434172(0x7cd)] = !$gameTemp[_0x434172(0x7cd)]);
  }),
  (SceneManager['playTestShiftR'] = function () {
    const _0x1f2b5d = _0x17b060;
    if (!VisuMZ[_0x1f2b5d(0x77a)][_0x1f2b5d(0x382)][_0x1f2b5d(0x7ae)]['ShiftR_Toggle']) return;
    if (!$gameTemp[_0x1f2b5d(0x6dc)]()) return;
    if (!SceneManager[_0x1f2b5d(0x51e)]()) return;
    if (!Input[_0x1f2b5d(0x285)](_0x1f2b5d(0x7f4))) return;
    for (const _0x56efd7 of $gameParty[_0x1f2b5d(0x278)]()) {
      if (!_0x56efd7) continue;
      _0x56efd7[_0x1f2b5d(0x6e4)]();
    }
  }),
  (SceneManager[_0x17b060(0x8a7)] = function () {
    const _0x251c8f = _0x17b060;
    if (!VisuMZ[_0x251c8f(0x77a)][_0x251c8f(0x382)][_0x251c8f(0x7ae)]['ShiftT_Toggle']) return;
    if (!$gameTemp[_0x251c8f(0x6dc)]()) return;
    if (!SceneManager[_0x251c8f(0x51e)]()) return;
    if (!Input[_0x251c8f(0x285)](_0x251c8f(0x7f4))) return;
    for (const _0x3338ac of $gameParty[_0x251c8f(0x278)]()) {
      if (!_0x3338ac) continue;
      _0x3338ac[_0x251c8f(0x36b)](_0x3338ac[_0x251c8f(0x525)]());
    }
  }),
  (SceneManager[_0x17b060(0x28e)] = function (_0x1e8a2f) {
    const _0x383312 = _0x17b060;
    if (!$gameTemp[_0x383312(0x6dc)]()) return;
    if (!DataManager[_0x383312(0x2d6)](_0x1e8a2f)) return;
    if (!(VisuMZ[_0x383312(0x77a)]['Settings'][_0x383312(0x7ae)]['CtrlQuickLoad'] ?? !![])) return;
    this[_0x383312(0x6f2)](Scene_QuickLoad), this[_0x383312(0x309)](_0x1e8a2f);
  }),
  (SceneManager[_0x17b060(0x2f6)] = function () {
    const _0x4ee423 = _0x17b060;
    (this[_0x4ee423(0x46f)] = ![]), (this[_0x4ee423(0x32c)] = !VisuMZ[_0x4ee423(0x77a)][_0x4ee423(0x382)]['UI'][_0x4ee423(0x88c)]);
  }),
  (SceneManager['setSideButtonLayout'] = function (_0x1d4ab0) {
    const _0x3ef50c = _0x17b060;
    VisuMZ['CoreEngine'][_0x3ef50c(0x382)]['UI'][_0x3ef50c(0x550)] && (this[_0x3ef50c(0x46f)] = _0x1d4ab0);
  }),
  (SceneManager['isSideButtonLayout'] = function () {
    return this['_sideButtonLayout'];
  }),
  (SceneManager[_0x17b060(0x28c)] = function () {
    const _0x3cbd53 = _0x17b060;
    return this[_0x3cbd53(0x32c)];
  }),
  (SceneManager[_0x17b060(0x82d)] = function () {
    const _0x171497 = _0x17b060;
    return this[_0x171497(0x28c)]() || this['isSideButtonLayout']();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x37c)] = SceneManager[_0x17b060(0x26f)]),
  (SceneManager['isGameActive'] = function () {
    const _0x2edac8 = _0x17b060;
    return VisuMZ[_0x2edac8(0x77a)][_0x2edac8(0x382)][_0x2edac8(0x7ae)][_0x2edac8(0x343)] ? VisuMZ[_0x2edac8(0x77a)]['SceneManager_isGameActive']['call'](this) : !![];
  }),
  (SceneManager[_0x17b060(0x7c3)] = function (_0xb8f811) {
    const _0x446132 = _0x17b060;
    if (_0xb8f811 instanceof Error) this[_0x446132(0x6cc)](_0xb8f811);
    else _0xb8f811 instanceof Array && _0xb8f811[0x0] === _0x446132(0x7d0) ? this[_0x446132(0x602)](_0xb8f811) : this[_0x446132(0x608)](_0xb8f811);
    this['stop']();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x303)] = BattleManager[_0x17b060(0x55c)]),
  (BattleManager[_0x17b060(0x55c)] = function () {
    const _0x44a201 = _0x17b060;
    return VisuMZ[_0x44a201(0x77a)]['Settings'][_0x44a201(0x7ae)][_0x44a201(0x878)] ? this[_0x44a201(0x2b3)]() : VisuMZ[_0x44a201(0x77a)]['BattleManager_processEscape'][_0x44a201(0x64e)](this);
  }),
  (BattleManager['processAlwaysEscape'] = function () {
    const _0x523b20 = _0x17b060;
    return $gameParty['performEscape'](), SoundManager[_0x523b20(0x6c2)](), this[_0x523b20(0x3a9)](), !![];
  }),
  (BattleManager['isTpb'] = function () {
    const _0x2577e6 = _0x17b060;
    return $gameSystem[_0x2577e6(0x43c)]() >= 0x1;
  }),
  (BattleManager[_0x17b060(0x484)] = function () {
    const _0x3c570e = _0x17b060;
    return $gameSystem[_0x3c570e(0x43c)]() === 0x1;
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Temp_initialize'] = Game_Temp[_0x17b060(0x54a)]['initialize']),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function () {
    const _0x41037f = _0x17b060;
    VisuMZ['CoreEngine']['Game_Temp_initialize'][_0x41037f(0x64e)](this), this[_0x41037f(0x605)](), this['createFauxAnimationQueue'](), this['createPointAnimationQueue']();
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x605)] = function () {
    const _0x11d48d = _0x17b060;
    VisuMZ['CoreEngine'][_0x11d48d(0x382)][_0x11d48d(0x7ae)][_0x11d48d(0x758)] && (this[_0x11d48d(0x473)] = ![]);
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x813)] = function (_0x8b00c1) {
    const _0x41257d = _0x17b060;
    this[_0x41257d(0x852)] = _0x8b00c1;
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x2be)] = function () {
    const _0x2c97e5 = _0x17b060;
    return this[_0x2c97e5(0x852)];
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x834)] = function () {
    const _0x438d7c = _0x17b060;
    (this[_0x438d7c(0x812)] = undefined), (this['_forcedBattleSys'] = undefined), (this['_forcedBattleGridSystem'] = undefined);
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x3cc)] = function (_0x3195b0) {
    const _0x4a627c = _0x17b060;
    $gameMap && $dataMap && $dataMap[_0x4a627c(0x85d)] && this[_0x4a627c(0x536)]($dataMap[_0x4a627c(0x85d)]);
    const _0x183171 = $dataTroops[_0x3195b0];
    if (_0x183171) {
      let _0x445050 = DataManager[_0x4a627c(0x70a)](_0x183171['id']);
      this[_0x4a627c(0x536)](_0x445050);
    }
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x536)] = function (_0x499d88) {
    const _0xe09c5c = _0x17b060;
    if (!_0x499d88) return;
    if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:FRONTVIEW|FRONT VIEW|FV)>/i)) this[_0xe09c5c(0x812)] = 'FV';
    else {
      if (_0x499d88['match'](/<(?:SIDEVIEW|SIDE VIEW|SV)>/i)) this['_forcedTroopView'] = 'SV';
      else {
        if (_0x499d88['match'](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)) {
          const _0x17ac41 = String(RegExp['$1']);
          if (_0x17ac41[_0xe09c5c(0x2ba)](/(?:FRONTVIEW|FRONT VIEW|FV)/i)) this[_0xe09c5c(0x812)] = 'FV';
          else _0x17ac41[_0xe09c5c(0x2ba)](/(?:SIDEVIEW|SIDE VIEW|SV)/i) && (this[_0xe09c5c(0x812)] = 'SV');
        }
      }
    }
    if (_0x499d88['match'](/<(?:DTB)>/i)) this[_0xe09c5c(0x652)] = 0x0;
    else {
      if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:TPB|ATB)[ ]ACTIVE>/i)) this[_0xe09c5c(0x652)] = 0x1;
      else {
        if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:TPB|ATB)[ ]WAIT>/i)) this[_0xe09c5c(0x652)] = 0x2;
        else {
          if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:TPB|ATB)>/i)) this[_0xe09c5c(0x652)] = 0x2;
          else {
            if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:CTB)>/i)) Imported[_0xe09c5c(0x222)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x630));
            else {
              if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:STB)>/i)) Imported[_0xe09c5c(0x156)] && (this[_0xe09c5c(0x652)] = 'STB');
              else {
                if (_0x499d88['match'](/<(?:BTB)>/i)) Imported[_0xe09c5c(0x385)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x189));
                else {
                  if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:FTB)>/i)) Imported[_0xe09c5c(0x458)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x803));
                  else {
                    if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:OTB)>/i)) Imported[_0xe09c5c(0x452)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x648));
                    else {
                      if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:ETB)>/i)) Imported[_0xe09c5c(0x1b4)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x19a));
                      else {
                        if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:PTB)>/i)) Imported[_0xe09c5c(0x681)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x65b));
                        else {
                          if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)) {
                            const _0x33ca51 = String(RegExp['$1']);
                            if (_0x33ca51[_0xe09c5c(0x2ba)](/DTB/i)) this[_0xe09c5c(0x652)] = 0x0;
                            else {
                              if (_0x33ca51[_0xe09c5c(0x2ba)](/(?:TPB|ATB)[ ]ACTIVE/i)) this[_0xe09c5c(0x652)] = 0x1;
                              else {
                                if (_0x33ca51[_0xe09c5c(0x2ba)](/(?:TPB|ATB)[ ]WAIT/i)) this[_0xe09c5c(0x652)] = 0x2;
                                else {
                                  if (_0x33ca51['match'](/CTB/i)) Imported['VisuMZ_2_BattleSystemCTB'] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x630));
                                  else {
                                    if (_0x33ca51[_0xe09c5c(0x2ba)](/STB/i)) Imported[_0xe09c5c(0x156)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x5f0));
                                    else {
                                      if (_0x33ca51[_0xe09c5c(0x2ba)](/BTB/i)) Imported[_0xe09c5c(0x385)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x189));
                                      else {
                                        if (_0x33ca51[_0xe09c5c(0x2ba)](/FTB/i)) Imported[_0xe09c5c(0x458)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x803));
                                        else {
                                          if (_0x33ca51[_0xe09c5c(0x2ba)](/OTB/i)) Imported['VisuMZ_2_BattleSystemOTB'] && (this[_0xe09c5c(0x652)] = 'OTB');
                                          else {
                                            if (_0x33ca51['match'](/ETB/i)) Imported[_0xe09c5c(0x1b4)] && (this[_0xe09c5c(0x652)] = _0xe09c5c(0x19a));
                                            else _0x33ca51[_0xe09c5c(0x2ba)](/PTB/i) && Imported['VisuMZ_2_BattleSystemPTB'] && (this['_forcedBattleSys'] = _0xe09c5c(0x65b));
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (_0x499d88[_0xe09c5c(0x2ba)](/<(?:|BATTLE )GRID>/i)) this[_0xe09c5c(0x80d)] = !![];
    else _0x499d88[_0xe09c5c(0x2ba)](/<NO (?:|BATTLE )GRID>/i) && (this[_0xe09c5c(0x80d)] = ![]);
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x106)] = function () {
    this['_fauxAnimationQueue'] = [];
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x847)] = function (_0x5ad0b9, _0x137def, _0x57f971, _0x15ab21) {
    const _0x5e0dab = _0x17b060;
    if (!this[_0x5e0dab(0x4a2)]()) return;
    (_0x57f971 = _0x57f971 || ![]), (_0x15ab21 = _0x15ab21 || ![]);
    if ($dataAnimations[_0x137def]) {
      const _0x2bce0e = { targets: _0x5ad0b9, animationId: _0x137def, mirror: _0x57f971, mute: _0x15ab21 };
      this[_0x5e0dab(0x34c)][_0x5e0dab(0x6f2)](_0x2bce0e);
      for (const _0x5929f6 of _0x5ad0b9) {
        _0x5929f6[_0x5e0dab(0x340)] && _0x5929f6['startAnimation']();
      }
    }
  }),
  (Game_Temp[_0x17b060(0x54a)]['showFauxAnimations'] = function () {
    return !![];
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x5c6)] = function () {
    const _0x4ec32b = _0x17b060;
    return this['_fauxAnimationQueue'][_0x4ec32b(0x7f4)]();
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x29d)] = function () {
    this['_pointAnimationQueue'] = [];
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x7f0)] = function (_0x466c8a, _0x40a1ac, _0x3be11d, _0x460596, _0x7137f4) {
    const _0xbeebb8 = _0x17b060;
    if (!this['showPointAnimations']()) return;
    (_0x460596 = _0x460596 || ![]), (_0x7137f4 = _0x7137f4 || ![]);
    if ($dataAnimations[_0x3be11d]) {
      const _0x3e7fea = { x: _0x466c8a, y: _0x40a1ac, animationId: _0x3be11d, mirror: _0x460596, mute: _0x7137f4 };
      this[_0xbeebb8(0xe7)][_0xbeebb8(0x6f2)](_0x3e7fea);
    }
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0xe5)] = function () {
    return !![];
  }),
  (Game_Temp['prototype']['retrievePointAnimation'] = function () {
    const _0x1d2347 = _0x17b060;
    return this[_0x1d2347(0xe7)][_0x1d2347(0x7f4)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x567)] = Game_System[_0x17b060(0x54a)]['initialize']),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function () {
    const _0x546b34 = _0x17b060;
    VisuMZ[_0x546b34(0x77a)][_0x546b34(0x567)][_0x546b34(0x64e)](this), this[_0x546b34(0x181)]();
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0x181)] = function () {
    const _0x49fe81 = _0x17b060;
    this[_0x49fe81(0x80c)] = { SideView: $dataSystem[_0x49fe81(0x692)], BattleSystem: this['initialBattleSystem'](), FontSize: $dataSystem['advanced']['fontSize'], Padding: 0xc };
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0x4a1)] = function () {
    const _0x5cafda = _0x17b060;
    if ($gameTemp[_0x5cafda(0x812)] === 'SV') return !![];
    else {
      if ($gameTemp[_0x5cafda(0x812)] === 'FV') return ![];
    }
    if (this[_0x5cafda(0x80c)] === undefined) this[_0x5cafda(0x181)]();
    if (this[_0x5cafda(0x80c)][_0x5cafda(0x2d7)] === undefined) this['initCoreEngine']();
    return this['_CoreEngineSettings'][_0x5cafda(0x2d7)];
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0x7b5)] = function (_0x245e2e) {
    const _0x5b2ad3 = _0x17b060;
    if (this[_0x5b2ad3(0x80c)] === undefined) this[_0x5b2ad3(0x181)]();
    if (this[_0x5b2ad3(0x80c)]['SideView'] === undefined) this[_0x5b2ad3(0x181)]();
    this['_CoreEngineSettings'][_0x5b2ad3(0x2d7)] = _0x245e2e;
  }),
  (Game_System['prototype'][_0x17b060(0x379)] = function () {
    const _0x1f03ac = _0x17b060;
    if (this[_0x1f03ac(0x80c)] === undefined) this[_0x1f03ac(0x181)]();
    this[_0x1f03ac(0x80c)][_0x1f03ac(0x583)] = this[_0x1f03ac(0x4dd)]();
  }),
  (Game_System['prototype'][_0x17b060(0x4dd)] = function () {
    const _0x227850 = _0x17b060,
      _0x4dc85e = (VisuMZ[_0x227850(0x77a)][_0x227850(0x382)][_0x227850(0x583)] || _0x227850(0x730))['toUpperCase']()[_0x227850(0x711)]();
    return VisuMZ[_0x227850(0x77a)][_0x227850(0x1f2)](_0x4dc85e);
  }),
  (Game_System[_0x17b060(0x54a)]['getBattleSystem'] = function () {
    const _0x271533 = _0x17b060;
    if ($gameTemp[_0x271533(0x652)] !== undefined) return $gameTemp['_forcedBattleSys'];
    if (this[_0x271533(0x80c)] === undefined) this[_0x271533(0x181)]();
    if (this[_0x271533(0x80c)][_0x271533(0x583)] === undefined) this[_0x271533(0x379)]();
    return this[_0x271533(0x80c)][_0x271533(0x583)];
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0xf1)] = function (_0x3b293c) {
    const _0x57e0ec = _0x17b060;
    if (this[_0x57e0ec(0x80c)] === undefined) this['initCoreEngine']();
    if (this['_CoreEngineSettings']['BattleSystem'] === undefined) this['resetBattleSystem']();
    this[_0x57e0ec(0x80c)]['BattleSystem'] = _0x3b293c;
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0xf9)] = function () {
    const _0x44686b = _0x17b060;
    if (this['_CoreEngineSettings'] === undefined) this['initCoreEngine']();
    if (this[_0x44686b(0x80c)][_0x44686b(0x8a9)] === undefined) this['initCoreEngine']();
    return this[_0x44686b(0x80c)][_0x44686b(0x8a9)];
  }),
  (Game_System[_0x17b060(0x54a)][_0x17b060(0x205)] = function (_0x106882) {
    const _0x7dc570 = _0x17b060;
    if (this[_0x7dc570(0x80c)] === undefined) this[_0x7dc570(0x181)]();
    if (this[_0x7dc570(0x80c)][_0x7dc570(0x75f)] === undefined) this['initCoreEngine']();
    this['_CoreEngineSettings']['FontSize'] = _0x106882;
  }),
  (Game_System['prototype'][_0x17b060(0x59e)] = function () {
    const _0x2620a2 = _0x17b060;
    if (this[_0x2620a2(0x80c)] === undefined) this[_0x2620a2(0x181)]();
    if (this[_0x2620a2(0x80c)][_0x2620a2(0x23b)] === undefined) this[_0x2620a2(0x181)]();
    return this[_0x2620a2(0x80c)][_0x2620a2(0x23b)];
  }),
  (Game_System['prototype'][_0x17b060(0x25f)] = function (_0x3bbb8d) {
    const _0x474cdf = _0x17b060;
    if (this[_0x474cdf(0x80c)] === undefined) this[_0x474cdf(0x181)]();
    if (this['_CoreEngineSettings'][_0x474cdf(0x75f)] === undefined) this['initCoreEngine']();
    this[_0x474cdf(0x80c)]['Padding'] = _0x3bbb8d;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x448)] = Game_Screen['prototype'][_0x17b060(0x3e0)]),
  (Game_Screen['prototype']['initialize'] = function () {
    const _0x3759cc = _0x17b060;
    VisuMZ[_0x3759cc(0x77a)]['Game_Screen_initialize'][_0x3759cc(0x64e)](this), this[_0x3759cc(0x388)]();
  }),
  (Game_Screen[_0x17b060(0x54a)][_0x17b060(0x388)] = function () {
    const _0x4f72e5 = _0x17b060,
      _0x4629a9 = VisuMZ[_0x4f72e5(0x77a)][_0x4f72e5(0x382)][_0x4f72e5(0x783)];
    this[_0x4f72e5(0x5b7)] = _0x4629a9?.[_0x4f72e5(0x527)] || 'random';
  }),
  (Game_Screen[_0x17b060(0x54a)][_0x17b060(0x811)] = function () {
    const _0x53c235 = _0x17b060;
    if (this[_0x53c235(0x5b7)] === undefined) this[_0x53c235(0x388)]();
    return this[_0x53c235(0x5b7)];
  }),
  (Game_Screen['prototype'][_0x17b060(0x470)] = function (_0x344eac) {
    const _0x3b1e95 = _0x17b060;
    if (this[_0x3b1e95(0x5b7)] === undefined) this[_0x3b1e95(0x388)]();
    this[_0x3b1e95(0x5b7)] = _0x344eac['toLowerCase']()[_0x3b1e95(0x711)]();
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x44c)] = function () {
    const _0x38bd2a = _0x17b060;
    if ($gameParty['inBattle']()) return ![];
    return this[_0x38bd2a(0x355)]() && this['onlyfilename']()[_0x38bd2a(0x65c)](0x0) === '!';
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x355)] = function () {
    const _0x4ee2ff = _0x17b060;
    return this[_0x4ee2ff(0x3e9)][_0x4ee2ff(0x60b)]('/')[_0x4ee2ff(0x122)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x17c)] = Game_Picture[_0x17b060(0x54a)]['x']),
  (Game_Picture[_0x17b060(0x54a)]['x'] = function () {
    const _0x2d1274 = _0x17b060;
    return this[_0x2d1274(0x44c)]() ? this[_0x2d1274(0x503)]() : VisuMZ[_0x2d1274(0x77a)][_0x2d1274(0x17c)]['call'](this);
  }),
  (Game_Picture['prototype']['xScrollLinkedOffset'] = function () {
    const _0x2d640c = _0x17b060,
      _0x4db073 = $gameMap[_0x2d640c(0x664)]() * $gameMap['tileWidth']();
    return (this['_x'] - _0x4db073) * $gameScreen[_0x2d640c(0x3ae)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x32d)] = Game_Picture[_0x17b060(0x54a)]['y']),
  (Game_Picture[_0x17b060(0x54a)]['y'] = function () {
    const _0x9bdfe1 = _0x17b060;
    return this[_0x9bdfe1(0x44c)]() ? this[_0x9bdfe1(0x772)]() : VisuMZ['CoreEngine'][_0x9bdfe1(0x32d)][_0x9bdfe1(0x64e)](this);
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x772)] = function () {
    const _0x4c77bc = _0x17b060,
      _0x22e623 = $gameMap[_0x4c77bc(0x625)]() * $gameMap[_0x4c77bc(0x251)]();
    return (this['_y'] - _0x22e623) * $gameScreen[_0x4c77bc(0x3ae)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x5e7)] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x3ed)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x3ed)] = function () {
    const _0x5749a7 = _0x17b060;
    let _0x1313c0 = VisuMZ[_0x5749a7(0x77a)][_0x5749a7(0x5e7)][_0x5749a7(0x64e)](this);
    return this[_0x5749a7(0x44c)]() && (_0x1313c0 *= $gameScreen[_0x5749a7(0x3ae)]()), _0x1313c0;
  }),
  (VisuMZ['CoreEngine']['Game_Picture_scaleY'] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x6d2)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x6d2)] = function () {
    const _0x418fd8 = _0x17b060;
    let _0x5ba4b0 = VisuMZ[_0x418fd8(0x77a)][_0x418fd8(0x46d)][_0x418fd8(0x64e)](this);
    return this['isMapScrollLinked']() && (_0x5ba4b0 *= $gameScreen['zoomScale']()), _0x5ba4b0;
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x3c4)] = function (_0x1ba4eb) {
    const _0x405ce5 = _0x17b060;
    this[_0x405ce5(0x4c1)] = _0x1ba4eb;
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Picture_calcEasing'] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x1b3)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x1b3)] = function (_0x7375d6) {
    const _0x557a72 = _0x17b060;
    return (
      (this[_0x557a72(0x4c1)] = this[_0x557a72(0x4c1)] || 0x0),
      [0x0, 0x1, 0x2, 0x3][_0x557a72(0x1ae)](this[_0x557a72(0x4c1)])
        ? VisuMZ[_0x557a72(0x77a)][_0x557a72(0x32e)][_0x557a72(0x64e)](this, _0x7375d6)
        : VisuMZ[_0x557a72(0x30b)](_0x7375d6, this[_0x557a72(0x4c1)])
    );
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Picture_initRotation'] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x890)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x890)] = function () {
    const _0xb95915 = _0x17b060;
    VisuMZ['CoreEngine']['Game_Picture_initRotation'][_0xb95915(0x64e)](this), this[_0xb95915(0x870)]();
  }),
  (Game_Picture[_0x17b060(0x54a)]['initRotationCoreEngine'] = function () {
    const _0x2dd427 = _0x17b060;
    this['_anglePlus'] = { current: 0x0, target: 0x0, duration: 0x0, wholeDuration: 0x0, easingType: _0x2dd427(0x6a8) };
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x8a2)] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x5d7)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x5d7)] = function () {
    const _0x4e625c = _0x17b060;
    let _0x80f477 = VisuMZ[_0x4e625c(0x77a)][_0x4e625c(0x8a2)][_0x4e625c(0x64e)](this);
    return (_0x80f477 += this[_0x4e625c(0x8b7)]()), _0x80f477;
  }),
  (Game_Picture['prototype']['anglePlus'] = function () {
    const _0x33e46d = _0x17b060;
    if (this[_0x33e46d(0x86a)] === undefined) this[_0x33e46d(0x870)]();
    return this['_anglePlus']['current'] || 0x0;
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x1d3)] = function (_0x207de3, _0x1a50e4, _0x4fe5a3) {
    const _0x44dc70 = _0x17b060;
    if (this[_0x44dc70(0x86a)] === undefined) this['initRotationCoreEngine']();
    (this[_0x44dc70(0x86a)][_0x44dc70(0x1b0)] = _0x207de3 || 0x0),
      (this[_0x44dc70(0x86a)]['duration'] = _0x1a50e4 || 0x0),
      (this[_0x44dc70(0x86a)]['wholeDuration'] = _0x1a50e4 || 0x0),
      (this['_anglePlus'][_0x44dc70(0x475)] = _0x4fe5a3 || _0x44dc70(0x6a8)),
      _0x1a50e4 <= 0x0 && (this[_0x44dc70(0x86a)][_0x44dc70(0x596)] = this[_0x44dc70(0x86a)][_0x44dc70(0x1b0)]);
  }),
  (Game_Picture['prototype']['changeAnglePlusData'] = function (_0x172497, _0x3a46dd, _0x28403f) {
    const _0x5b14a9 = _0x17b060;
    if (this[_0x5b14a9(0x86a)] === undefined) this[_0x5b14a9(0x870)]();
    (this[_0x5b14a9(0x86a)][_0x5b14a9(0x1b0)] += _0x172497 || 0x0),
      (this[_0x5b14a9(0x86a)][_0x5b14a9(0x5cd)] = _0x3a46dd || 0x0),
      (this[_0x5b14a9(0x86a)][_0x5b14a9(0x126)] = _0x3a46dd || 0x0),
      (this[_0x5b14a9(0x86a)][_0x5b14a9(0x475)] = _0x28403f || 'Linear'),
      _0x3a46dd <= 0x0 && (this[_0x5b14a9(0x86a)][_0x5b14a9(0x596)] = this['_anglePlus'][_0x5b14a9(0x1b0)]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x24e)] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x47d)]),
  (Game_Picture[_0x17b060(0x54a)]['updateRotation'] = function () {
    const _0x13493d = _0x17b060;
    VisuMZ[_0x13493d(0x77a)][_0x13493d(0x24e)]['call'](this), this[_0x13493d(0xed)]();
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0xed)] = function () {
    const _0x3150d1 = _0x17b060;
    if (this[_0x3150d1(0x86a)] === undefined) this[_0x3150d1(0x870)]();
    const _0x3f33f7 = this[_0x3150d1(0x86a)];
    if (_0x3f33f7[_0x3150d1(0x5cd)] <= 0x0) return;
    (_0x3f33f7[_0x3150d1(0x596)] = this['applyEasingAnglePlus'](_0x3f33f7[_0x3150d1(0x596)], _0x3f33f7[_0x3150d1(0x1b0)])),
      _0x3f33f7[_0x3150d1(0x5cd)]--,
      _0x3f33f7[_0x3150d1(0x5cd)] <= 0x0 && (_0x3f33f7[_0x3150d1(0x596)] = _0x3f33f7[_0x3150d1(0x1b0)]);
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x56e)] = function (_0x12939d, _0x13b166) {
    const _0x423f1f = _0x17b060,
      _0x2d298a = this[_0x423f1f(0x86a)],
      _0xb1db9d = _0x2d298a['easingType'],
      _0x4c9b11 = _0x2d298a[_0x423f1f(0x5cd)],
      _0x308f40 = _0x2d298a[_0x423f1f(0x126)],
      _0x44b40e = VisuMZ[_0x423f1f(0x30b)]((_0x308f40 - _0x4c9b11) / _0x308f40, _0xb1db9d),
      _0x234ef4 = VisuMZ[_0x423f1f(0x30b)]((_0x308f40 - _0x4c9b11 + 0x1) / _0x308f40, _0xb1db9d),
      _0x364eb8 = (_0x12939d - _0x13b166 * _0x44b40e) / (0x1 - _0x44b40e);
    return _0x364eb8 + (_0x13b166 - _0x364eb8) * _0x234ef4;
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Action_itemHit'] = Game_Action[_0x17b060(0x54a)]['itemHit']),
  (Game_Action['prototype'][_0x17b060(0x389)] = function (_0x2b1f08) {
    const _0x63091f = _0x17b060;
    return VisuMZ[_0x63091f(0x77a)][_0x63091f(0x382)]['QoL'][_0x63091f(0x420)] ? this[_0x63091f(0x5ca)](_0x2b1f08) : VisuMZ[_0x63091f(0x77a)][_0x63091f(0x64c)][_0x63091f(0x64e)](this, _0x2b1f08);
  }),
  (Game_Action[_0x17b060(0x54a)][_0x17b060(0x5ca)] = function (_0xa652ab) {
    const _0x427b23 = _0x17b060,
      _0x423490 = this[_0x427b23(0x133)](_0xa652ab),
      _0x1da599 = this[_0x427b23(0x4a8)](_0xa652ab),
      _0x4d6046 = this[_0x427b23(0x347)](_0xa652ab);
    return _0x423490 * (_0x1da599 - _0x4d6046);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Action_itemEva'] = Game_Action[_0x17b060(0x54a)][_0x17b060(0x4cd)]),
  (Game_Action['prototype']['itemEva'] = function (_0x4ff88b) {
    const _0x7ad7d2 = _0x17b060;
    return VisuMZ[_0x7ad7d2(0x77a)][_0x7ad7d2(0x382)]['QoL'][_0x7ad7d2(0x420)] ? 0x0 : VisuMZ[_0x7ad7d2(0x77a)]['Game_Action_itemEva'][_0x7ad7d2(0x64e)](this, _0x4ff88b);
  }),
  (Game_Action['prototype']['itemSuccessRate'] = function (_0x133293) {
    const _0x298eb5 = _0x17b060;
    return this[_0x298eb5(0x2f7)]()[_0x298eb5(0x75b)] * 0.01;
  }),
  (Game_Action[_0x17b060(0x54a)]['subjectHitRate'] = function (_0xbd9ce2) {
    const _0x362fee = _0x17b060;
    if (VisuMZ[_0x362fee(0x77a)]['Settings'][_0x362fee(0x7ae)][_0x362fee(0x2c0)] && this[_0x362fee(0x756)]()) return 0x1;
    return this[_0x362fee(0x67f)]()
      ? VisuMZ['CoreEngine'][_0x362fee(0x382)][_0x362fee(0x7ae)][_0x362fee(0x2c0)] && this[_0x362fee(0x18a)]()[_0x362fee(0x4dc)]()
        ? this['subject']()[_0x362fee(0x6ad)] + 0.05
        : this[_0x362fee(0x18a)]()[_0x362fee(0x6ad)]
      : 0x1;
  }),
  (Game_Action[_0x17b060(0x54a)][_0x17b060(0x347)] = function (_0x4c52e5) {
    const _0x1e0339 = _0x17b060;
    if (this[_0x1e0339(0x18a)]()[_0x1e0339(0x4dc)]() === _0x4c52e5[_0x1e0339(0x4dc)]()) return 0x0;
    if (this[_0x1e0339(0x67f)]())
      return VisuMZ[_0x1e0339(0x77a)][_0x1e0339(0x382)][_0x1e0339(0x7ae)][_0x1e0339(0x2c0)] && _0x4c52e5[_0x1e0339(0x663)]() ? _0x4c52e5[_0x1e0339(0x6f9)] - 0.05 : _0x4c52e5['eva'];
    else return this[_0x1e0339(0x3fd)]() ? _0x4c52e5['mev'] : 0x0;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x597)] = Game_Action[_0x17b060(0x54a)]['updateLastTarget']),
  (Game_Action[_0x17b060(0x54a)][_0x17b060(0x5c5)] = function (_0x1ff43d) {
    const _0x20fb97 = _0x17b060;
    VisuMZ[_0x20fb97(0x77a)][_0x20fb97(0x597)][_0x20fb97(0x64e)](this, _0x1ff43d);
    if (VisuMZ[_0x20fb97(0x77a)][_0x20fb97(0x382)]['QoL'][_0x20fb97(0x420)]) return;
    const _0x287f17 = _0x1ff43d[_0x20fb97(0x7ce)]();
    _0x287f17[_0x20fb97(0x320)] && 0x1 - this[_0x20fb97(0x4cd)](_0x1ff43d) > this['itemHit'](_0x1ff43d) && ((_0x287f17[_0x20fb97(0x320)] = ![]), (_0x287f17['evaded'] = !![]));
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x2f0)] = Game_BattlerBase[_0x17b060(0x54a)]['initMembers']),
  (Game_BattlerBase['prototype']['initMembers'] = function () {
    const _0x334020 = _0x17b060;
    (this[_0x334020(0x233)] = {}), VisuMZ[_0x334020(0x77a)]['Game_BattlerBase_initMembers']['call'](this);
  }),
  (VisuMZ['CoreEngine']['Game_BattlerBase_refresh'] = Game_BattlerBase[_0x17b060(0x54a)]['refresh']),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x80e)] = function () {
    const _0x3bfcb0 = _0x17b060;
    (this[_0x3bfcb0(0x233)] = {}), VisuMZ['CoreEngine'][_0x3bfcb0(0x7ac)]['call'](this);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x89c)] = function (_0x21ecbf) {
    const _0x20e34d = _0x17b060;
    return (this[_0x20e34d(0x233)] = this['_cache'] || {}), this[_0x20e34d(0x233)][_0x21ecbf] !== undefined;
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x38f)] = function (_0x4ffc24) {
    const _0x5d2754 = _0x17b060,
      _0x237c88 = (_0x24549b, _0x34b290) => {
        const _0xaaafa9 = _0x55f7;
        if (!_0x34b290) return _0x24549b;
        if (_0x34b290[_0xaaafa9(0x85d)][_0xaaafa9(0x2ba)](VisuMZ['CoreEngine'][_0xaaafa9(0x1bc)][_0xaaafa9(0x38f)][_0x4ffc24])) {
          var _0x15fe55 = Number(RegExp['$1']);
          _0x24549b += _0x15fe55;
        }
        if (_0x34b290[_0xaaafa9(0x85d)]['match'](VisuMZ[_0xaaafa9(0x77a)][_0xaaafa9(0x1bc)][_0xaaafa9(0x3b1)][_0x4ffc24])) {
          var _0x3fdebb = String(RegExp['$1']);
          try {
            _0x24549b += eval(_0x3fdebb);
          } catch (_0x26b578) {
            if ($gameTemp[_0xaaafa9(0x6dc)]()) console[_0xaaafa9(0x797)](_0x26b578);
          }
        }
        return _0x24549b;
      };
    return this[_0x5d2754(0x5b1)]()[_0x5d2754(0x63a)](_0x237c88, this['_paramPlus'][_0x4ffc24]);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)]['paramMax'] = function (_0xaac53a) {
    const _0x5e0547 = _0x17b060;
    var _0x25c56d = _0x5e0547(0x15b) + (this[_0x5e0547(0x4dc)]() ? 'Actor' : 'Enemy') + _0x5e0547(0x65a) + _0xaac53a;
    if (this['checkCacheKey'](_0x25c56d)) return this[_0x5e0547(0x233)][_0x25c56d];
    this[_0x5e0547(0x233)][_0x25c56d] = eval(VisuMZ['CoreEngine'][_0x5e0547(0x382)][_0x5e0547(0x71d)][_0x25c56d]);
    const _0x312a0c = (_0x257d46, _0x5d717c) => {
      const _0x507f01 = _0x5e0547;
      if (!_0x5d717c) return _0x257d46;
      if (_0x5d717c[_0x507f01(0x85d)]['match'](VisuMZ[_0x507f01(0x77a)][_0x507f01(0x1bc)]['paramMax'][_0xaac53a])) {
        var _0x3468ec = Number(RegExp['$1']);
        if (_0x3468ec === 0x0) _0x3468ec = Number[_0x507f01(0x29a)];
        _0x257d46 = Math['max'](_0x257d46, _0x3468ec);
      }
      if (_0x5d717c[_0x507f01(0x85d)]['match'](VisuMZ['CoreEngine'][_0x507f01(0x1bc)]['paramMaxJS'][_0xaac53a])) {
        var _0x1d732b = String(RegExp['$1']);
        try {
          _0x257d46 = Math[_0x507f01(0x7f9)](_0x257d46, Number(eval(_0x1d732b)));
        } catch (_0x2aaee8) {
          if ($gameTemp['isPlaytest']()) console[_0x507f01(0x797)](_0x2aaee8);
        }
      }
      return _0x257d46;
    };
    if (this[_0x5e0547(0x233)][_0x25c56d] === 0x0) this[_0x5e0547(0x233)][_0x25c56d] = Number[_0x5e0547(0x29a)];
    return (this['_cache'][_0x25c56d] = this[_0x5e0547(0x5b1)]()['reduce'](_0x312a0c, this[_0x5e0547(0x233)][_0x25c56d])), this[_0x5e0547(0x233)][_0x25c56d];
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x3e7)] = function (_0x12a4df) {
    const _0x121d5a = _0x17b060,
      _0x4f1f88 = this[_0x121d5a(0x4db)](Game_BattlerBase[_0x121d5a(0x492)], _0x12a4df),
      _0x27dcf0 = (_0x21307d, _0x5c3f4e) => {
        const _0x3205b8 = _0x121d5a;
        if (!_0x5c3f4e) return _0x21307d;
        if (_0x5c3f4e['note']['match'](VisuMZ['CoreEngine'][_0x3205b8(0x1bc)][_0x3205b8(0x48b)][_0x12a4df])) {
          var _0x2abb45 = Number(RegExp['$1']) / 0x64;
          _0x21307d *= _0x2abb45;
        }
        if (_0x5c3f4e[_0x3205b8(0x85d)][_0x3205b8(0x2ba)](VisuMZ[_0x3205b8(0x77a)][_0x3205b8(0x1bc)][_0x3205b8(0xea)][_0x12a4df])) {
          var _0x2abb45 = Number(RegExp['$1']);
          _0x21307d *= _0x2abb45;
        }
        if (_0x5c3f4e[_0x3205b8(0x85d)][_0x3205b8(0x2ba)](VisuMZ[_0x3205b8(0x77a)][_0x3205b8(0x1bc)][_0x3205b8(0x180)][_0x12a4df])) {
          var _0x3d1486 = String(RegExp['$1']);
          try {
            _0x21307d *= eval(_0x3d1486);
          } catch (_0xd7fe5d) {
            if ($gameTemp['isPlaytest']()) console['log'](_0xd7fe5d);
          }
        }
        return _0x21307d;
      };
    return this[_0x121d5a(0x5b1)]()['reduce'](_0x27dcf0, _0x4f1f88);
  }),
  (Game_BattlerBase['prototype'][_0x17b060(0x47a)] = function (_0x795d67) {
    const _0x75f978 = _0x17b060,
      _0x37bd8f = (_0x49b3ea, _0xb67d7b) => {
        const _0x2765f0 = _0x55f7;
        if (!_0xb67d7b) return _0x49b3ea;
        if (_0xb67d7b[_0x2765f0(0x85d)]['match'](VisuMZ[_0x2765f0(0x77a)][_0x2765f0(0x1bc)]['paramFlat'][_0x795d67])) {
          var _0x18d1e5 = Number(RegExp['$1']);
          _0x49b3ea += _0x18d1e5;
        }
        if (_0xb67d7b[_0x2765f0(0x85d)][_0x2765f0(0x2ba)](VisuMZ[_0x2765f0(0x77a)]['RegExp'][_0x2765f0(0x28b)][_0x795d67])) {
          var _0x303b7b = String(RegExp['$1']);
          try {
            _0x49b3ea += eval(_0x303b7b);
          } catch (_0x13f7c7) {
            if ($gameTemp[_0x2765f0(0x6dc)]()) console[_0x2765f0(0x797)](_0x13f7c7);
          }
        }
        return _0x49b3ea;
      };
    return this[_0x75f978(0x5b1)]()['reduce'](_0x37bd8f, 0x0);
  }),
  (Game_BattlerBase['prototype'][_0x17b060(0x7a1)] = function (_0x19a360) {
    const _0x54ce6a = _0x17b060;
    let _0x41b693 = _0x54ce6a(0x7a1) + _0x19a360 + 'Total';
    if (this[_0x54ce6a(0x89c)](_0x41b693)) return this[_0x54ce6a(0x233)][_0x41b693];
    return (
      (this['_cache'][_0x41b693] = Math[_0x54ce6a(0x3fe)](VisuMZ[_0x54ce6a(0x77a)][_0x54ce6a(0x382)][_0x54ce6a(0x71d)][_0x54ce6a(0x250)][_0x54ce6a(0x64e)](this, _0x19a360))), this['_cache'][_0x41b693]
    );
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x8a8)] = function (_0x4fd2fe) {
    const _0x53a2e1 = _0x17b060,
      _0x2f17be = (_0x54502e, _0xd068c6) => {
        const _0x4f5254 = _0x55f7;
        if (!_0xd068c6) return _0x54502e;
        if (_0xd068c6[_0x4f5254(0x85d)][_0x4f5254(0x2ba)](VisuMZ[_0x4f5254(0x77a)][_0x4f5254(0x1bc)]['xparamPlus1'][_0x4fd2fe])) {
          var _0x797e40 = Number(RegExp['$1']) / 0x64;
          _0x54502e += _0x797e40;
        }
        if (_0xd068c6[_0x4f5254(0x85d)][_0x4f5254(0x2ba)](VisuMZ[_0x4f5254(0x77a)]['RegExp']['xparamPlus2'][_0x4fd2fe])) {
          var _0x797e40 = Number(RegExp['$1']);
          _0x54502e += _0x797e40;
        }
        if (_0xd068c6[_0x4f5254(0x85d)][_0x4f5254(0x2ba)](VisuMZ[_0x4f5254(0x77a)][_0x4f5254(0x1bc)][_0x4f5254(0x589)][_0x4fd2fe])) {
          var _0x98531f = String(RegExp['$1']);
          try {
            _0x54502e += eval(_0x98531f);
          } catch (_0x5793b0) {
            if ($gameTemp[_0x4f5254(0x6dc)]()) console[_0x4f5254(0x797)](_0x5793b0);
          }
        }
        return _0x54502e;
      };
    return this[_0x53a2e1(0x5b1)]()['reduce'](_0x2f17be, 0x0);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)]['xparamRate'] = function (_0x468ed2) {
    const _0x1bb3ca = _0x17b060,
      _0x354036 = (_0x777197, _0x549ab7) => {
        const _0x1db599 = _0x55f7;
        if (!_0x549ab7) return _0x777197;
        if (_0x549ab7[_0x1db599(0x85d)][_0x1db599(0x2ba)](VisuMZ['CoreEngine'][_0x1db599(0x1bc)][_0x1db599(0x7df)][_0x468ed2])) {
          var _0x9ba7bb = Number(RegExp['$1']) / 0x64;
          _0x777197 *= _0x9ba7bb;
        }
        if (_0x549ab7['note'][_0x1db599(0x2ba)](VisuMZ['CoreEngine']['RegExp'][_0x1db599(0x437)][_0x468ed2])) {
          var _0x9ba7bb = Number(RegExp['$1']);
          _0x777197 *= _0x9ba7bb;
        }
        if (_0x549ab7[_0x1db599(0x85d)][_0x1db599(0x2ba)](VisuMZ[_0x1db599(0x77a)][_0x1db599(0x1bc)][_0x1db599(0x715)][_0x468ed2])) {
          var _0x1a6b54 = String(RegExp['$1']);
          try {
            _0x777197 *= eval(_0x1a6b54);
          } catch (_0x2139f3) {
            if ($gameTemp[_0x1db599(0x6dc)]()) console[_0x1db599(0x797)](_0x2139f3);
          }
        }
        return _0x777197;
      };
    return this[_0x1bb3ca(0x5b1)]()[_0x1bb3ca(0x63a)](_0x354036, 0x1);
  }),
  (Game_BattlerBase['prototype'][_0x17b060(0x742)] = function (_0x1784fe) {
    const _0x48b55f = _0x17b060,
      _0x2c9eab = (_0x5a6c6e, _0x8b8bd0) => {
        const _0x104b0c = _0x55f7;
        if (!_0x8b8bd0) return _0x5a6c6e;
        if (_0x8b8bd0[_0x104b0c(0x85d)][_0x104b0c(0x2ba)](VisuMZ[_0x104b0c(0x77a)]['RegExp'][_0x104b0c(0x542)][_0x1784fe])) {
          var _0x217742 = Number(RegExp['$1']) / 0x64;
          _0x5a6c6e += _0x217742;
        }
        if (_0x8b8bd0[_0x104b0c(0x85d)][_0x104b0c(0x2ba)](VisuMZ['CoreEngine']['RegExp'][_0x104b0c(0x3df)][_0x1784fe])) {
          var _0x217742 = Number(RegExp['$1']);
          _0x5a6c6e += _0x217742;
        }
        if (_0x8b8bd0[_0x104b0c(0x85d)][_0x104b0c(0x2ba)](VisuMZ[_0x104b0c(0x77a)][_0x104b0c(0x1bc)][_0x104b0c(0x780)][_0x1784fe])) {
          var _0x520ec5 = String(RegExp['$1']);
          try {
            _0x5a6c6e += eval(_0x520ec5);
          } catch (_0x396547) {
            if ($gameTemp[_0x104b0c(0x6dc)]()) console['log'](_0x396547);
          }
        }
        return _0x5a6c6e;
      };
    return this[_0x48b55f(0x5b1)]()[_0x48b55f(0x63a)](_0x2c9eab, 0x0);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x477)] = function (_0x33597e) {
    const _0x113493 = _0x17b060;
    let _0x468144 = 'xparam' + _0x33597e + _0x113493(0x1ab);
    if (this['checkCacheKey'](_0x468144)) return this[_0x113493(0x233)][_0x468144];
    return (this[_0x113493(0x233)][_0x468144] = VisuMZ[_0x113493(0x77a)][_0x113493(0x382)][_0x113493(0x71d)][_0x113493(0x725)][_0x113493(0x64e)](this, _0x33597e)), this[_0x113493(0x233)][_0x468144];
  }),
  (Game_BattlerBase['prototype'][_0x17b060(0x762)] = function (_0x34f340) {
    const _0x58b674 = _0x17b060,
      _0x283c25 = (_0x2fdf38, _0x5a69a2) => {
        const _0x3ae329 = _0x55f7;
        if (!_0x5a69a2) return _0x2fdf38;
        if (_0x5a69a2[_0x3ae329(0x85d)][_0x3ae329(0x2ba)](VisuMZ[_0x3ae329(0x77a)][_0x3ae329(0x1bc)][_0x3ae329(0x726)][_0x34f340])) {
          var _0x40c8ae = Number(RegExp['$1']) / 0x64;
          _0x2fdf38 += _0x40c8ae;
        }
        if (_0x5a69a2[_0x3ae329(0x85d)][_0x3ae329(0x2ba)](VisuMZ[_0x3ae329(0x77a)][_0x3ae329(0x1bc)]['sparamPlus2'][_0x34f340])) {
          var _0x40c8ae = Number(RegExp['$1']);
          _0x2fdf38 += _0x40c8ae;
        }
        if (_0x5a69a2[_0x3ae329(0x85d)][_0x3ae329(0x2ba)](VisuMZ[_0x3ae329(0x77a)][_0x3ae329(0x1bc)][_0x3ae329(0x702)][_0x34f340])) {
          var _0x4b4b1d = String(RegExp['$1']);
          try {
            _0x2fdf38 += eval(_0x4b4b1d);
          } catch (_0x265bbe) {
            if ($gameTemp[_0x3ae329(0x6dc)]()) console[_0x3ae329(0x797)](_0x265bbe);
          }
        }
        return _0x2fdf38;
      };
    return this[_0x58b674(0x5b1)]()[_0x58b674(0x63a)](_0x283c25, 0x0);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x214)] = function (_0x5e64e5) {
    const _0x330683 = _0x17b060,
      _0x13aaea = (_0x5d23e5, _0x55e56c) => {
        const _0x472b47 = _0x55f7;
        if (!_0x55e56c) return _0x5d23e5;
        if (_0x55e56c[_0x472b47(0x85d)]['match'](VisuMZ['CoreEngine'][_0x472b47(0x1bc)][_0x472b47(0x22f)][_0x5e64e5])) {
          var _0x4a7ee6 = Number(RegExp['$1']) / 0x64;
          _0x5d23e5 *= _0x4a7ee6;
        }
        if (_0x55e56c[_0x472b47(0x85d)][_0x472b47(0x2ba)](VisuMZ['CoreEngine'][_0x472b47(0x1bc)][_0x472b47(0x105)][_0x5e64e5])) {
          var _0x4a7ee6 = Number(RegExp['$1']);
          _0x5d23e5 *= _0x4a7ee6;
        }
        if (_0x55e56c['note']['match'](VisuMZ[_0x472b47(0x77a)][_0x472b47(0x1bc)][_0x472b47(0x805)][_0x5e64e5])) {
          var _0x2f57b0 = String(RegExp['$1']);
          try {
            _0x5d23e5 *= eval(_0x2f57b0);
          } catch (_0x16b101) {
            if ($gameTemp[_0x472b47(0x6dc)]()) console[_0x472b47(0x797)](_0x16b101);
          }
        }
        return _0x5d23e5;
      };
    return this[_0x330683(0x5b1)]()[_0x330683(0x63a)](_0x13aaea, 0x1);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x53a)] = function (_0x57a8c6) {
    const _0xa9d446 = (_0x140e23, _0x593424) => {
      const _0x440a9c = _0x55f7;
      if (!_0x593424) return _0x140e23;
      if (_0x593424[_0x440a9c(0x85d)][_0x440a9c(0x2ba)](VisuMZ[_0x440a9c(0x77a)][_0x440a9c(0x1bc)][_0x440a9c(0x800)][_0x57a8c6])) {
        var _0x2f3a32 = Number(RegExp['$1']) / 0x64;
        _0x140e23 += _0x2f3a32;
      }
      if (_0x593424[_0x440a9c(0x85d)][_0x440a9c(0x2ba)](VisuMZ[_0x440a9c(0x77a)][_0x440a9c(0x1bc)][_0x440a9c(0x5ea)][_0x57a8c6])) {
        var _0x2f3a32 = Number(RegExp['$1']);
        _0x140e23 += _0x2f3a32;
      }
      if (_0x593424[_0x440a9c(0x85d)][_0x440a9c(0x2ba)](VisuMZ[_0x440a9c(0x77a)][_0x440a9c(0x1bc)]['sparamFlatJS'][_0x57a8c6])) {
        var _0x5b8e11 = String(RegExp['$1']);
        try {
          _0x140e23 += eval(_0x5b8e11);
        } catch (_0x508b07) {
          if ($gameTemp[_0x440a9c(0x6dc)]()) console[_0x440a9c(0x797)](_0x508b07);
        }
      }
      return _0x140e23;
    };
    return this['traitObjects']()['reduce'](_0xa9d446, 0x0);
  }),
  (Game_BattlerBase[_0x17b060(0x54a)]['sparam'] = function (_0x1f1a09) {
    const _0x126f08 = _0x17b060;
    let _0xd9075c = _0x126f08(0x12c) + _0x1f1a09 + _0x126f08(0x1ab);
    if (this[_0x126f08(0x89c)](_0xd9075c)) return this['_cache'][_0xd9075c];
    return (this[_0x126f08(0x233)][_0xd9075c] = VisuMZ['CoreEngine'][_0x126f08(0x382)]['Param']['SParameterFormula'][_0x126f08(0x64e)](this, _0x1f1a09)), this['_cache'][_0xd9075c];
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x4d4)] = function (_0xd86464, _0x418308) {
    const _0x59b7be = _0x17b060;
    if (typeof paramId === _0x59b7be(0x7c2)) return this['param'](_0xd86464);
    _0xd86464 = String(_0xd86464 || '')[_0x59b7be(0x29e)]();
    if (_0xd86464 === 'MAXHP') return this[_0x59b7be(0x7a1)](0x0);
    if (_0xd86464 === _0x59b7be(0x148)) return this['param'](0x1);
    if (_0xd86464 === _0x59b7be(0x135)) return this[_0x59b7be(0x7a1)](0x2);
    if (_0xd86464 === 'DEF') return this['param'](0x3);
    if (_0xd86464 === _0x59b7be(0x297)) return this[_0x59b7be(0x7a1)](0x4);
    if (_0xd86464 === _0x59b7be(0x3be)) return this[_0x59b7be(0x7a1)](0x5);
    if (_0xd86464 === 'AGI') return this[_0x59b7be(0x7a1)](0x6);
    if (_0xd86464 === _0x59b7be(0xec)) return this['param'](0x7);
    if (_0xd86464 === _0x59b7be(0x889)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x477)](0x0) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x0);
    if (_0xd86464 === _0x59b7be(0x2ce)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x477)](0x1) * 0x64)) + '%' : this['xparam'](0x1);
    if (_0xd86464 === _0x59b7be(0x6af)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x477)](0x2) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x2);
    if (_0xd86464 === _0x59b7be(0x4bb)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x477)](0x3) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x3);
    if (_0xd86464 === _0x59b7be(0x17d)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x477)](0x4) * 0x64)) + '%' : this['xparam'](0x4);
    if (_0xd86464 === _0x59b7be(0x11f)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x477)](0x5) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x5);
    if (_0xd86464 === 'CNT') return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x477)](0x6) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x6);
    if (_0xd86464 === _0x59b7be(0x599)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x477)](0x7) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x7);
    if (_0xd86464 === _0x59b7be(0x69b)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x477)](0x8) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x8);
    if (_0xd86464 === _0x59b7be(0x655)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this['xparam'](0x9) * 0x64)) + '%' : this[_0x59b7be(0x477)](0x9);
    if (_0xd86464 === 'TGR') return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this['sparam'](0x0) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x0);
    if (_0xd86464 === _0x59b7be(0x1c8)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x12c)](0x1) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x1);
    if (_0xd86464 === _0x59b7be(0x4ec)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x2) * 0x64)) + '%' : this['sparam'](0x2);
    if (_0xd86464 === _0x59b7be(0x728)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x3) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x3);
    if (_0xd86464 === _0x59b7be(0x6d6)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x12c)](0x4) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x4);
    if (_0xd86464 === _0x59b7be(0x828)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x5) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x5);
    if (_0xd86464 === _0x59b7be(0x11a)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x6) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x6);
    if (_0xd86464 === _0x59b7be(0x121)) return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x7) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x7);
    if (_0xd86464 === _0x59b7be(0x1a8)) return _0x418308 ? String(Math['round'](this[_0x59b7be(0x12c)](0x8) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x8);
    if (_0xd86464 === 'EXR') return _0x418308 ? String(Math[_0x59b7be(0x3fe)](this[_0x59b7be(0x12c)](0x9) * 0x64)) + '%' : this[_0x59b7be(0x12c)](0x9);
    if (VisuMZ[_0x59b7be(0x77a)][_0x59b7be(0x2ca)][_0xd86464]) {
      const _0x2a0b4f = VisuMZ[_0x59b7be(0x77a)][_0x59b7be(0x2ca)][_0xd86464],
        _0x57ce2a = this[_0x2a0b4f];
      return VisuMZ[_0x59b7be(0x77a)][_0x59b7be(0x6f7)][_0xd86464] === _0x59b7be(0x5ae) ? _0x57ce2a : _0x418308 ? String(Math[_0x59b7be(0x3fe)](_0x57ce2a * 0x64)) + '%' : _0x57ce2a;
    }
    return '';
  }),
  (Game_BattlerBase[_0x17b060(0x54a)][_0x17b060(0x1c1)] = function () {
    const _0x1752a0 = _0x17b060;
    return this[_0x1752a0(0x30c)]() && this[_0x1752a0(0x27d)] < this[_0x1752a0(0x5c4)] * VisuMZ[_0x1752a0(0x77a)]['Settings'][_0x1752a0(0x71d)]['CrisisRate'];
  }),
  (Game_Battler[_0x17b060(0x54a)]['performMiss'] = function () {
    const _0x29faf0 = _0x17b060;
    SoundManager[_0x29faf0(0x79d)](), this[_0x29faf0(0x461)]('evade');
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x7a8)] = Game_Actor[_0x17b060(0x54a)][_0x17b060(0x34e)]),
  (Game_Actor[_0x17b060(0x54a)][_0x17b060(0x34e)] = function (_0x2df4a8) {
    const _0x3c48e3 = _0x17b060;
    if (this[_0x3c48e3(0x4b4)] > 0x63) return this[_0x3c48e3(0x826)](_0x2df4a8);
    return VisuMZ[_0x3c48e3(0x77a)][_0x3c48e3(0x7a8)][_0x3c48e3(0x64e)](this, _0x2df4a8);
  }),
  (Game_Actor[_0x17b060(0x54a)][_0x17b060(0x826)] = function (_0x59bd83) {
    const _0x42f048 = _0x17b060,
      _0x196055 = this[_0x42f048(0x1e1)]()[_0x42f048(0x5aa)][_0x59bd83][0x63],
      _0x583eb3 = this[_0x42f048(0x1e1)]()[_0x42f048(0x5aa)][_0x59bd83][0x62];
    return _0x196055 + (_0x196055 - _0x583eb3) * (this[_0x42f048(0x4b4)] - 0x63);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x62c)] = Game_Actor[_0x17b060(0x54a)]['changeClass']),
  (Game_Actor['prototype'][_0x17b060(0x4e5)] = function (_0x4bc638, _0x5ab567) {
    const _0xd0b60d = _0x17b060;
    ($gameTemp[_0xd0b60d(0x3cb)] = !![]), VisuMZ[_0xd0b60d(0x77a)][_0xd0b60d(0x62c)][_0xd0b60d(0x64e)](this, _0x4bc638, _0x5ab567), ($gameTemp[_0xd0b60d(0x3cb)] = undefined);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Actor_levelUp'] = Game_Actor[_0x17b060(0x54a)][_0x17b060(0x2de)]),
  (Game_Actor[_0x17b060(0x54a)][_0x17b060(0x2de)] = function () {
    const _0x52921a = _0x17b060;
    VisuMZ[_0x52921a(0x77a)][_0x52921a(0x513)][_0x52921a(0x64e)](this);
    if (!$gameTemp[_0x52921a(0x3cb)]) this[_0x52921a(0x57d)]();
  }),
  (Game_Actor[_0x17b060(0x54a)]['levelUpRecovery'] = function () {
    const _0x55bfa6 = _0x17b060;
    this[_0x55bfa6(0x233)] = {};
    if (VisuMZ[_0x55bfa6(0x77a)]['Settings']['QoL'][_0x55bfa6(0x3c1)]) this['_hp'] = this[_0x55bfa6(0x5c4)];
    if (VisuMZ['CoreEngine'][_0x55bfa6(0x382)][_0x55bfa6(0x7ae)][_0x55bfa6(0x3b0)]) this['_mp'] = this[_0x55bfa6(0x20d)];
  }),
  (Game_Actor[_0x17b060(0x54a)][_0x17b060(0x3c0)] = function () {
    const _0xbc7428 = _0x17b060;
    if (this[_0xbc7428(0x172)]()) return 0x1;
    const _0x5c40d4 = this[_0xbc7428(0x5ce)]() - this[_0xbc7428(0xe4)](),
      _0x4c5b57 = this[_0xbc7428(0xf2)]() - this[_0xbc7428(0xe4)]();
    return (_0x4c5b57 / _0x5c40d4)[_0xbc7428(0x42b)](0x0, 0x1);
  }),
  (Game_Actor[_0x17b060(0x54a)][_0x17b060(0x5b1)] = function () {
    const _0x522f5e = _0x17b060,
      _0x35f0a3 = Game_Battler[_0x522f5e(0x54a)][_0x522f5e(0x5b1)][_0x522f5e(0x64e)](this);
    for (const _0x3fd305 of this[_0x522f5e(0x383)]()) {
      _0x3fd305 && _0x35f0a3[_0x522f5e(0x6f2)](_0x3fd305);
    }
    return _0x35f0a3[_0x522f5e(0x6f2)](this[_0x522f5e(0x1e1)](), this['actor']()), _0x35f0a3;
  }),
  Object[_0x17b060(0x64d)](Game_Enemy[_0x17b060(0x54a)], _0x17b060(0x4b4), {
    get: function () {
      const _0x30e58c = _0x17b060;
      return this[_0x30e58c(0x10c)]();
    },
    configurable: !![],
  }),
  (Game_Enemy['prototype']['getLevel'] = function () {
    const _0x5497ad = _0x17b060;
    return this['enemy']()[_0x5497ad(0x4b4)];
  }),
  (Game_Enemy[_0x17b060(0x54a)]['moveRelativeToResolutionChange'] = function () {
    const _0x2528f5 = _0x17b060;
    !this[_0x2528f5(0x38c)] &&
      ((this[_0x2528f5(0x465)] += Math[_0x2528f5(0x3fe)]((Graphics[_0x2528f5(0x2c5)] - 0x270) / 0x2)),
      (this[_0x2528f5(0x465)] -= Math[_0x2528f5(0x221)]((Graphics['height'] - Graphics[_0x2528f5(0x509)]) / 0x2)),
      $gameSystem[_0x2528f5(0x4a1)]()
        ? (this[_0x2528f5(0x685)] -= Math['floor']((Graphics[_0x2528f5(0x321)] - Graphics[_0x2528f5(0x778)]) / 0x2))
        : (this['_screenX'] += Math[_0x2528f5(0x3fe)]((Graphics[_0x2528f5(0x778)] - 0x330) / 0x2))),
      (this['_repositioned'] = !![]);
  }),
  (Game_Party[_0x17b060(0x54a)]['maxGold'] = function () {
    const _0x4320ea = _0x17b060;
    return VisuMZ[_0x4320ea(0x77a)][_0x4320ea(0x382)][_0x4320ea(0x6a1)][_0x4320ea(0x72d)];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x4e9)] = Game_Party[_0x17b060(0x54a)]['consumeItem']),
  (Game_Party['prototype']['consumeItem'] = function (_0x6bdce9) {
    const _0x434f92 = _0x17b060;
    if (VisuMZ[_0x434f92(0x77a)][_0x434f92(0x382)][_0x434f92(0x7ae)][_0x434f92(0x2e6)] && DataManager[_0x434f92(0x88e)](_0x6bdce9)) return;
    VisuMZ[_0x434f92(0x77a)][_0x434f92(0x4e9)][_0x434f92(0x64e)](this, _0x6bdce9);
  }),
  (Game_Party['prototype'][_0x17b060(0x326)] = function () {
    const _0x714457 = _0x17b060,
      _0x57adee = VisuMZ[_0x714457(0x77a)]['Settings'][_0x714457(0x7ae)],
      _0x13c979 = _0x57adee[_0x714457(0x8ac)] ?? 0x63;
    let _0x1452c6 = [];
    (_0x57adee['BTestItems'] ?? !![]) && (_0x1452c6 = _0x1452c6[_0x714457(0x83e)]($dataItems));
    (_0x57adee['BTestWeapons'] ?? !![]) && (_0x1452c6 = _0x1452c6[_0x714457(0x83e)]($dataWeapons));
    (_0x57adee[_0x714457(0x144)] ?? !![]) && (_0x1452c6 = _0x1452c6['concat']($dataArmors));
    for (const _0x34046d of _0x1452c6) {
      if (!_0x34046d) continue;
      if (_0x34046d[_0x714457(0x142)][_0x714457(0x711)]() <= 0x0) continue;
      if (_0x34046d[_0x714457(0x142)][_0x714457(0x2ba)](/-----/i)) continue;
      this[_0x714457(0x26a)](_0x34046d, _0x13c979);
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x640)] = Game_Troop[_0x17b060(0x54a)][_0x17b060(0x67d)]),
  (Game_Troop['prototype'][_0x17b060(0x67d)] = function (_0x401ad1) {
    const _0x3bec9c = _0x17b060;
    $gameTemp[_0x3bec9c(0x834)](), $gameTemp[_0x3bec9c(0x3cc)](_0x401ad1), VisuMZ[_0x3bec9c(0x77a)][_0x3bec9c(0x640)][_0x3bec9c(0x64e)](this, _0x401ad1);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x43e)] = Game_Map[_0x17b060(0x54a)][_0x17b060(0x67d)]),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x67d)] = function (_0x32a702) {
    const _0xd9cf0e = _0x17b060;
    VisuMZ[_0xd9cf0e(0x77a)][_0xd9cf0e(0x43e)][_0xd9cf0e(0x64e)](this, _0x32a702), this['checkCoreEngineDisplayCenter'](), this[_0xd9cf0e(0x44f)](_0x32a702), this[_0xd9cf0e(0x11e)]();
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x44f)] = function () {
    const _0x3aa15 = _0x17b060;
    this[_0x3aa15(0x5cf)] = VisuMZ[_0x3aa15(0x77a)][_0x3aa15(0x382)][_0x3aa15(0x7ae)][_0x3aa15(0x1fc)] || ![];
    const _0x4d55b2 = VisuMZ['CoreEngine']['Settings']['ScreenResolution'],
      _0x40d722 = $dataMap ? $dataMap[_0x3aa15(0x85d)] || '' : '';
    if (_0x40d722[_0x3aa15(0x2ba)](/<SHOW TILE SHADOWS>/i)) this[_0x3aa15(0x5cf)] = ![];
    else _0x40d722[_0x3aa15(0x2ba)](/<HIDE TILE SHADOWS>/i) && (this[_0x3aa15(0x5cf)] = !![]);
    if (_0x40d722['match'](/<SCROLL LOCK X>/i)) (this['centerCameraCheckData']()[_0x3aa15(0x5bd)] = !![]), (this[_0x3aa15(0x59f)]()[_0x3aa15(0x664)] = _0x4d55b2[_0x3aa15(0x1f9)]);
    else _0x40d722['match'](/<SCROLL LOCK X: (.*?)>/i) && ((this[_0x3aa15(0x59f)]()['centerX'] = !![]), (this[_0x3aa15(0x59f)]()[_0x3aa15(0x664)] = Number(RegExp['$1'])));
    if (_0x40d722[_0x3aa15(0x2ba)](/<SCROLL LOCK Y>/i)) (this['centerCameraCheckData']()['centerY'] = !![]), (this['centerCameraCheckData']()['displayY'] = _0x4d55b2[_0x3aa15(0x30e)]);
    else _0x40d722[_0x3aa15(0x2ba)](/<SCROLL LOCK Y: (.*?)>/i) && ((this[_0x3aa15(0x59f)]()[_0x3aa15(0x569)] = !![]), (this[_0x3aa15(0x59f)]()[_0x3aa15(0x625)] = Number(RegExp['$1'])));
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x3eb)] = function () {
    const _0x5d8683 = _0x17b060;
    if (this['_hideTileShadows'] === undefined) this[_0x5d8683(0x44f)]();
    return this[_0x5d8683(0x5cf)];
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x704)] = function () {
    const _0x56b414 = _0x17b060,
      _0x3aab20 = VisuMZ[_0x56b414(0x77a)]['Settings'][_0x56b414(0x79f)];
    this[_0x56b414(0x6b8)] = { centerX: ![], centerY: ![], displayX: 0x0, displayY: 0x0 };
    if (_0x3aab20[_0x56b414(0x304)]) {
      const _0x2dc602 = Graphics[_0x56b414(0x321)] / this[_0x56b414(0x1f1)]();
      _0x2dc602 % 0x1 !== 0x0 &&
        Math[_0x56b414(0x720)](_0x2dc602) === this[_0x56b414(0x321)]() &&
        !this[_0x56b414(0x26b)]() &&
        ((this['_centerCameraCheck']['centerX'] = !![]), (this[_0x56b414(0x6b8)][_0x56b414(0x664)] = _0x3aab20['DisplayLockX'] || 0x0));
    }
    if (_0x3aab20[_0x56b414(0x7d5)]) {
      const _0x1c1002 = Graphics[_0x56b414(0x2c5)] / this['tileHeight']();
      _0x1c1002 % 0x1 !== 0x0 &&
        Math[_0x56b414(0x720)](_0x1c1002) === this[_0x56b414(0x2c5)]() &&
        !this[_0x56b414(0x517)]() &&
        ((this[_0x56b414(0x6b8)][_0x56b414(0x569)] = !![]), (this[_0x56b414(0x6b8)][_0x56b414(0x625)] = _0x3aab20['DisplayLockY'] || 0x0));
    }
    $gameScreen['zoomScale']() === 0x1 &&
      (this[_0x56b414(0x59f)]()[_0x56b414(0x5bd)] && (this['_displayX'] = this[_0x56b414(0x59f)]()[_0x56b414(0x664)]),
      this['centerCameraCheckData']()['centerY'] && (this[_0x56b414(0x2cc)] = this[_0x56b414(0x59f)]()[_0x56b414(0x625)]));
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x802)] = Game_Map['prototype'][_0x17b060(0x56d)]),
  (Game_Map[_0x17b060(0x54a)]['setDisplayPos'] = function (_0x3aa4e5, _0x3872c8) {
    const _0x8aae7 = _0x17b060;
    VisuMZ['CoreEngine'][_0x8aae7(0x802)][_0x8aae7(0x64e)](this, _0x3aa4e5, _0x3872c8),
      $gameScreen[_0x8aae7(0x3ae)]() === 0x1 &&
        (!this[_0x8aae7(0x26b)]() && this[_0x8aae7(0x59f)]()[_0x8aae7(0x5bd)] && (this[_0x8aae7(0x3fc)] = this[_0x8aae7(0x59f)]()[_0x8aae7(0x664)]),
        !this['isLoopVertical']() && this[_0x8aae7(0x59f)]()[_0x8aae7(0x569)] && (this['_displayY'] = this['centerCameraCheckData']()[_0x8aae7(0x625)]));
  }),
  (Game_Map['prototype'][_0x17b060(0x59f)] = function () {
    const _0x15549d = _0x17b060;
    if (this[_0x15549d(0x6b8)] === undefined) this[_0x15549d(0x704)]();
    return this['_centerCameraCheck'];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x378)] = Game_Map['prototype']['scrollDown']),
  (Game_Map['prototype'][_0x17b060(0x56a)] = function (_0x1b6b1e) {
    const _0x521fbd = _0x17b060;
    if (this['centerCameraCheckData']()['centerY'] && $gameScreen['zoomScale']() === 0x1) {
      this[_0x521fbd(0x2cc)] = this['centerCameraCheckData']()[_0x521fbd(0x625)];
      return;
    }
    VisuMZ['CoreEngine'][_0x521fbd(0x378)][_0x521fbd(0x64e)](this, _0x1b6b1e);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Map_scrollLeft'] = Game_Map[_0x17b060(0x54a)]['scrollLeft']),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x896)] = function (_0x112bcc) {
    const _0x2b3682 = _0x17b060;
    if (this[_0x2b3682(0x59f)]()[_0x2b3682(0x5bd)] && $gameScreen[_0x2b3682(0x3ae)]() === 0x1) {
      this['_displayX'] = this[_0x2b3682(0x59f)]()[_0x2b3682(0x664)];
      return;
    }
    VisuMZ[_0x2b3682(0x77a)][_0x2b3682(0x341)][_0x2b3682(0x64e)](this, _0x112bcc);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x5a4)] = Game_Map[_0x17b060(0x54a)][_0x17b060(0x256)]),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x256)] = function (_0x46754b) {
    const _0x238a76 = _0x17b060;
    if (this[_0x238a76(0x59f)]()[_0x238a76(0x5bd)] && $gameScreen[_0x238a76(0x3ae)]() === 0x1) {
      this[_0x238a76(0x3fc)] = this[_0x238a76(0x59f)]()['displayX'];
      return;
    }
    VisuMZ[_0x238a76(0x77a)]['Game_Map_scrollRight']['call'](this, _0x46754b);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Map_scrollUp'] = Game_Map[_0x17b060(0x54a)][_0x17b060(0x299)]),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x299)] = function (_0x4bb29f) {
    const _0x2a96b2 = _0x17b060;
    if (this[_0x2a96b2(0x59f)]()[_0x2a96b2(0x569)] && $gameScreen[_0x2a96b2(0x3ae)]() === 0x1) {
      this[_0x2a96b2(0x2cc)] = this[_0x2a96b2(0x59f)]()['displayY'];
      return;
    }
    VisuMZ['CoreEngine'][_0x2a96b2(0x7e8)][_0x2a96b2(0x64e)](this, _0x4bb29f);
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x11e)] = function () {
    const _0x3a93ab = _0x17b060;
    this['_tileExtendTerrainTags'] = {};
    const _0xd6cb1e = this['tileset']();
    if (!_0xd6cb1e) return {};
    const _0x7cdf88 = _0xd6cb1e[_0x3a93ab(0x85d)] || '',
      _0x4ac0b2 = /<(?:TALLER|EXT|EXTEND|RAISE)[ ]BY[ ](\d+):[ ](.*)>/gi;
    let _0x3dd22c = {};
    const _0xf28a9a = _0x7cdf88['match'](_0x4ac0b2);
    if (_0xf28a9a)
      for (const _0x88b2df of _0xf28a9a) {
        _0x88b2df[_0x3a93ab(0x2ba)](_0x4ac0b2);
        const _0x2ff926 = Number(RegExp['$1'])[_0x3a93ab(0x42b)](0x1, 0x10),
          _0xa9c8bd = String(RegExp['$2'])
            [_0x3a93ab(0x60b)](',')
            [_0x3a93ab(0x3a8)](_0x411612 => Number(_0x411612)[_0x3a93ab(0x42b)](0x1, 0x7));
        for (const _0x48a112 of _0xa9c8bd) {
          _0x3dd22c[_0x48a112] = _0x2ff926;
        }
      }
    this[_0x3a93ab(0x639)] = _0x3dd22c;
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x69d)] = function () {
    const _0x3c658e = _0x17b060;
    if (this[_0x3c658e(0x639)] === undefined) this[_0x3c658e(0x11e)]();
    return this[_0x3c658e(0x639)];
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x442)] = function (_0x298439) {
    const _0x3fea95 = _0x17b060;
    if (_0x298439 >= 0x400) return ![];
    const _0x390b85 = $gameMap['getTileExtendTerrainTags']();
    if (Object[_0x3fea95(0x159)](_0x390b85)[_0x3fea95(0x540)] <= 0x0) return ![];
    const _0x353100 = this[_0x3fea95(0x1ec)](),
      _0x4ab4c9 = _0x353100[_0x298439] >> 0xc,
      _0x4b0ad8 = _0x390b85[_0x4ab4c9] || 0x0;
    return _0x4b0ad8 > 0x0;
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x226)] = function () {
    const _0x396ef1 = _0x17b060,
      _0x2b8f9a = this[_0x396ef1(0x69d)]();
    if (Object[_0x396ef1(0x159)](_0x2b8f9a)[_0x396ef1(0x540)] <= 0x0) return;
    $spriteset && ($spriteset[_0x396ef1(0x161)] && $spriteset[_0x396ef1(0x161)](), $spriteset[_0x396ef1(0x2a4)] && $spriteset[_0x396ef1(0x2a4)]());
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x3a2)] = Game_Character[_0x17b060(0x54a)][_0x17b060(0x647)]),
  (Game_Character[_0x17b060(0x54a)]['processMoveCommand'] = function (_0x251d88) {
    const _0x3977ca = _0x17b060;
    try {
      VisuMZ[_0x3977ca(0x77a)][_0x3977ca(0x3a2)][_0x3977ca(0x64e)](this, _0x251d88);
    } catch (_0x1cfe37) {
      if ($gameTemp[_0x3977ca(0x6dc)]()) console[_0x3977ca(0x797)](_0x1cfe37);
    }
  }),
  (Game_Player[_0x17b060(0x54a)][_0x17b060(0x879)] = function () {
    const _0x25a98b = _0x17b060,
      _0x9b4a1c = $gameMap[_0x25a98b(0x12e)]();
    this[_0x25a98b(0x329)] = Math['randomInt'](_0x9b4a1c) + Math[_0x25a98b(0x849)](_0x9b4a1c) + this[_0x25a98b(0x10d)]();
  }),
  (Game_Player[_0x17b060(0x54a)]['encounterStepsMinimum'] = function () {
    const _0x556f3a = _0x17b060;
    return $dataMap && $dataMap[_0x556f3a(0x85d)] && $dataMap['note']['match'](/<MINIMUM ENCOUNTER STEPS:[ ](\d+)>/i)
      ? Number(RegExp['$1'])
      : VisuMZ[_0x556f3a(0x77a)]['Settings'][_0x556f3a(0x7ae)][_0x556f3a(0x3e4)];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x49e)] = Game_Event[_0x17b060(0x54a)]['isCollidedWithEvents']),
  (Game_Event[_0x17b060(0x54a)][_0x17b060(0x1c0)] = function (_0x196ad0, _0x5abaf0) {
    const _0x49cc71 = _0x17b060;
    return this[_0x49cc71(0x62e)]() ? this[_0x49cc71(0x23e)](_0x196ad0, _0x5abaf0) : VisuMZ[_0x49cc71(0x77a)][_0x49cc71(0x49e)][_0x49cc71(0x64e)](this, _0x196ad0, _0x5abaf0);
  }),
  (Game_Event[_0x17b060(0x54a)][_0x17b060(0x62e)] = function () {
    const _0x3f6047 = _0x17b060;
    return VisuMZ['CoreEngine'][_0x3f6047(0x382)][_0x3f6047(0x7ae)][_0x3f6047(0x810)];
  }),
  (Game_Event[_0x17b060(0x54a)][_0x17b060(0x23e)] = function (_0x2acd8f, _0x358505) {
    const _0x391cf5 = _0x17b060;
    if (!this[_0x391cf5(0x796)]()) return ![];
    else {
      const _0x998e29 = $gameMap[_0x391cf5(0x1ea)](_0x2acd8f, _0x358505)[_0x391cf5(0x19c)](_0x3ca5f4 => _0x3ca5f4[_0x391cf5(0x796)]());
      return _0x998e29[_0x391cf5(0x540)] > 0x0;
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x8b2)] = Game_Interpreter['prototype'][_0x17b060(0x5eb)]),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x5eb)] = function (_0xa620e0) {
    const _0x437ada = _0x17b060,
      _0x34316d = this[_0x437ada(0x584)]();
    return _0x34316d[_0x437ada(0x2ba)](/\/\/[ ]SCRIPT[ ]CALL/i) ? this[_0x437ada(0x311)](_0x34316d) : VisuMZ['CoreEngine'][_0x437ada(0x8b2)][_0x437ada(0x64e)](this, _0xa620e0);
  }),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x584)] = function () {
    const _0x3cbec2 = _0x17b060;
    let _0x4284ef = '',
      _0x51513e = this['_index'] + 0x1;
    while (this[_0x3cbec2(0x5ef)][_0x51513e] && this[_0x3cbec2(0x5ef)][_0x51513e]['code'] === 0x195) {
      (_0x4284ef += this[_0x3cbec2(0x5ef)][_0x51513e]['parameters'][0x0] + '\x0a'), _0x51513e++;
    }
    return _0x4284ef;
  }),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x311)] = function (_0x2f1999) {
    const _0x59e059 = _0x17b060;
    try {
      eval(_0x2f1999);
    } catch (_0x3df119) {
      $gameTemp[_0x59e059(0x6dc)]() && (console[_0x59e059(0x797)](_0x59e059(0x64a)), console[_0x59e059(0x797)](_0x3df119));
    }
    return !![];
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x1e5)] = Game_Interpreter[_0x17b060(0x54a)]['command111']),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x131)] = function (_0x5faaea) {
    const _0x494f1b = _0x17b060;
    try {
      VisuMZ[_0x494f1b(0x77a)][_0x494f1b(0x1e5)]['call'](this, _0x5faaea);
    } catch (_0x6ec052) {
      $gameTemp[_0x494f1b(0x6dc)]() && (console['log']('Conditional\x20Branch\x20Script\x20Error'), console[_0x494f1b(0x797)](_0x6ec052)), this['skipBranch']();
    }
    return !![];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x6cf)] = Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x61a)]),
  (Game_Interpreter['prototype']['command122'] = function (_0x12daf7) {
    const _0x4d3e08 = _0x17b060;
    try {
      VisuMZ[_0x4d3e08(0x77a)][_0x4d3e08(0x6cf)][_0x4d3e08(0x64e)](this, _0x12daf7);
    } catch (_0x466dba) {
      $gameTemp[_0x4d3e08(0x6dc)]() && (console['log']('Control\x20Variables\x20Script\x20Error'), console[_0x4d3e08(0x797)](_0x466dba));
    }
    return !![];
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Interpreter_command355'] = Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x52b)]),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x52b)] = function () {
    const _0x260cfe = _0x17b060;
    try {
      VisuMZ[_0x260cfe(0x77a)][_0x260cfe(0x789)][_0x260cfe(0x64e)](this);
    } catch (_0x1dd101) {
      $gameTemp[_0x260cfe(0x6dc)]() && (console[_0x260cfe(0x797)]('Script\x20Call\x20Error'), console[_0x260cfe(0x797)](_0x1dd101));
    }
    return !![];
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Interpreter_PluginCommand'] = Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x1c9)]),
  (Game_Interpreter[_0x17b060(0x54a)][_0x17b060(0x1c9)] = function (_0x94b6a0) {
    const _0x1ab88a = _0x17b060;
    return $gameTemp[_0x1ab88a(0x813)](this), VisuMZ[_0x1ab88a(0x77a)][_0x1ab88a(0x42c)][_0x1ab88a(0x64e)](this, _0x94b6a0);
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x500)] = function () {
    const _0x11d0f2 = _0x17b060;
    return VisuMZ[_0x11d0f2(0x77a)]['Settings']['UI'][_0x11d0f2(0x291)];
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x766)] = function () {
    const _0x25c436 = _0x17b060;
    return VisuMZ[_0x25c436(0x77a)]['Settings']['UI']['BottomHelp'];
  }),
  (Scene_Base['prototype'][_0x17b060(0x7a6)] = function () {
    const _0x78eb35 = _0x17b060;
    return VisuMZ[_0x78eb35(0x77a)][_0x78eb35(0x382)]['UI']['BottomButtons'];
  }),
  (Scene_Base['prototype']['isRightInputMode'] = function () {
    const _0x5b9723 = _0x17b060;
    return VisuMZ[_0x5b9723(0x77a)][_0x5b9723(0x382)]['UI'][_0x5b9723(0x308)];
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x610)] = function () {
    const _0x3d020c = _0x17b060;
    return VisuMZ[_0x3d020c(0x77a)][_0x3d020c(0x382)]['UI'][_0x3d020c(0x2b9)];
  }),
  (Scene_Base['prototype']['buttonAreaHeight'] = function () {
    const _0x2bd1a4 = _0x17b060;
    return VisuMZ[_0x2bd1a4(0x77a)][_0x2bd1a4(0x382)]['UI'][_0x2bd1a4(0x842)];
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x6ee)] = function () {
    const _0x2b8d96 = _0x17b060;
    return VisuMZ[_0x2b8d96(0x77a)][_0x2b8d96(0x382)]['Window'][_0x2b8d96(0x76c)];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x2bd)] = Scene_Base[_0x17b060(0x54a)]['createWindowLayer']),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x7d4)] = function () {
    const _0x206aca = _0x17b060;
    VisuMZ[_0x206aca(0x77a)]['Scene_Base_createWindowLayer'][_0x206aca(0x64e)](this),
      this[_0x206aca(0x6b3)](),
      this[_0x206aca(0x14b)](),
      (this[_0x206aca(0x598)]['x'] = Math[_0x206aca(0x3fe)](this['_windowLayer']['x'])),
      (this[_0x206aca(0x598)]['y'] = Math['round'](this['_windowLayer']['y']));
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x6b3)] = function () {}),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x14b)] = function () {
    const _0x5c8390 = _0x17b060;
    (this[_0x5c8390(0x4ed)] = new Window_TextPopup()), this[_0x5c8390(0x781)](this['_textPopupWindow']);
  }),
  ($textPopup = function (_0x4b79df) {
    const _0x3fcd48 = _0x17b060,
      _0x3662e8 = SceneManager[_0x3fcd48(0x2f9)][_0x3fcd48(0x4ed)];
    _0x3662e8 && _0x3662e8['addQueue'](_0x4b79df);
  }),
  (Scene_Base['prototype'][_0x17b060(0x1fb)] = function () {
    const _0x22bf8b = _0x17b060;
    return TextManager[_0x22bf8b(0x165)]('pageup', _0x22bf8b(0x7c5));
  }),
  (Scene_Base[_0x17b060(0x54a)]['buttonAssistKey2'] = function () {
    const _0x4fe1ae = _0x17b060;
    return TextManager[_0x4fe1ae(0x713)]('tab');
  }),
  (Scene_Base['prototype'][_0x17b060(0x56f)] = function () {
    const _0x2c0ea4 = _0x17b060;
    return TextManager[_0x2c0ea4(0x713)](_0x2c0ea4(0x7f4));
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x6f0)] = function () {
    const _0x1966c2 = _0x17b060;
    return TextManager[_0x1966c2(0x713)]('ok');
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x350)] = function () {
    const _0x2080b9 = _0x17b060;
    return TextManager[_0x2080b9(0x713)](_0x2080b9(0x314));
  }),
  (Scene_Base[_0x17b060(0x54a)]['buttonAssistText1'] = function () {
    const _0x29a54b = _0x17b060;
    return this['_pageupButton'] && this[_0x29a54b(0x262)][_0x29a54b(0x70d)] ? TextManager[_0x29a54b(0x3ce)] : '';
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x4f0)] = function () {
    return '';
  }),
  (Scene_Base[_0x17b060(0x54a)]['buttonAssistText3'] = function () {
    return '';
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x21d)] = function () {
    const _0x35ddd9 = _0x17b060;
    return TextManager[_0x35ddd9(0x1fa)];
  }),
  (Scene_Base['prototype']['buttonAssistText5'] = function () {
    const _0x49b538 = _0x17b060;
    return TextManager[_0x49b538(0x225)];
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x2bf)] = function () {
    return 0x0;
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x404)] = function () {
    return 0x0;
  }),
  (Scene_Base[_0x17b060(0x54a)]['buttonAssistOffset3'] = function () {
    return 0x0;
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x4d3)] = function () {
    return 0x0;
  }),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x40c)] = function () {
    return 0x0;
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x46b)] = Scene_Boot['prototype'][_0x17b060(0x41f)]),
  (Scene_Boot['prototype'][_0x17b060(0x41f)] = function () {
    const _0x57a7fa = _0x17b060;
    VisuMZ[_0x57a7fa(0x77a)][_0x57a7fa(0x46b)][_0x57a7fa(0x64e)](this), this[_0x57a7fa(0x71e)]();
  }),
  (Scene_Boot['prototype'][_0x17b060(0x71e)] = function () {
    const _0x38dbf4 = _0x17b060,
      _0x193745 = [
        _0x38dbf4(0x57f),
        _0x38dbf4(0x770),
        _0x38dbf4(0x424),
        _0x38dbf4(0x113),
        _0x38dbf4(0x4f5),
        _0x38dbf4(0x895),
        'parallaxes',
        _0x38dbf4(0x5f8),
        _0x38dbf4(0x415),
        'sv_enemies',
        _0x38dbf4(0x759),
        _0x38dbf4(0x848),
        'titles1',
        'titles2',
      ];
    for (const _0x1712ef of _0x193745) {
      const _0x1ac2d3 = VisuMZ[_0x38dbf4(0x77a)][_0x38dbf4(0x382)]['ImgLoad'][_0x1712ef],
        _0x3c6c70 = _0x38dbf4(0x614)[_0x38dbf4(0x1df)](_0x1712ef);
      for (const _0x55e467 of _0x1ac2d3) {
        ImageManager['loadBitmap'](_0x3c6c70, _0x55e467);
      }
    }
  }),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Boot_startNormalGame'] = Scene_Boot[_0x17b060(0x54a)]['startNormalGame']),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x4b6)] = function () {
    const _0x33c4c0 = _0x17b060;
    Utils['isOptionValid'](_0x33c4c0(0x7e6)) && VisuMZ[_0x33c4c0(0x77a)][_0x33c4c0(0x382)]['QoL'][_0x33c4c0(0x3dc)] ? this[_0x33c4c0(0x1f5)]() : VisuMZ['CoreEngine'][_0x33c4c0(0x840)]['call'](this);
  }),
  (Scene_Boot[_0x17b060(0x54a)]['startAutoNewGame'] = function () {
    const _0x4eb48d = _0x17b060;
    this[_0x4eb48d(0x5d3)](), DataManager[_0x4eb48d(0x381)](), SceneManager['goto'](Scene_Map);
  }),
  (Scene_Boot['prototype'][_0x17b060(0x2bc)] = function () {
    const _0x56b56b = _0x17b060,
      _0x42715b = $dataSystem[_0x56b56b(0x41e)]['uiAreaWidth'],
      _0x39991e = $dataSystem[_0x56b56b(0x41e)]['uiAreaHeight'],
      _0x5bd333 = VisuMZ[_0x56b56b(0x77a)][_0x56b56b(0x382)]['UI'][_0x56b56b(0x537)];
    (Graphics[_0x56b56b(0x778)] = _0x42715b - _0x5bd333 * 0x2), (Graphics[_0x56b56b(0x509)] = _0x39991e - _0x5bd333 * 0x2), this[_0x56b56b(0x23a)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x429)] = Scene_Boot[_0x17b060(0x54a)]['updateDocumentTitle']),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x411)] = function () {
    const _0x4b52b4 = _0x17b060;
    this[_0x4b52b4(0x519)]() ? this[_0x4b52b4(0x1e3)]() : VisuMZ[_0x4b52b4(0x77a)][_0x4b52b4(0x429)][_0x4b52b4(0x64e)](this);
  }),
  (Scene_Boot['prototype'][_0x17b060(0x519)] = function () {
    const _0x5b3ac2 = _0x17b060;
    if (Scene_Title[_0x5b3ac2(0x4d5)] === '') return ![];
    if (Scene_Title[_0x5b3ac2(0x4d5)] === 'Subtitle') return ![];
    if (Scene_Title[_0x5b3ac2(0x40e)] === '') return ![];
    if (Scene_Title[_0x5b3ac2(0x40e)] === _0x5b3ac2(0x39c)) return ![];
    return !![];
  }),
  (Scene_Boot[_0x17b060(0x54a)][_0x17b060(0x1e3)] = function () {
    const _0x132c7e = _0x17b060,
      _0x3890b4 = $dataSystem[_0x132c7e(0x7d8)],
      _0x52a23e = Scene_Title[_0x132c7e(0x4d5)] || '',
      _0x22e1eb = Scene_Title['version'] || '',
      _0x3c1328 = VisuMZ[_0x132c7e(0x77a)][_0x132c7e(0x382)][_0x132c7e(0x5b0)][_0x132c7e(0x4ad)][_0x132c7e(0x687)],
      _0x5e652a = _0x3c1328[_0x132c7e(0x1df)](_0x3890b4, _0x52a23e, _0x22e1eb);
    document[_0x132c7e(0x85f)] = _0x5e652a;
  }),
  (Scene_Boot['prototype'][_0x17b060(0x23a)] = function () {
    const _0x55010c = _0x17b060;
    if (VisuMZ[_0x55010c(0x77a)][_0x55010c(0x382)]['UI'][_0x55010c(0x550)]) {
      const _0x37094b = Graphics[_0x55010c(0x321)] - Graphics[_0x55010c(0x778)] - VisuMZ['CoreEngine'][_0x55010c(0x382)]['UI'][_0x55010c(0x537)] * 0x2,
        _0x5cb59e = Sprite_Button[_0x55010c(0x54a)]['blockWidth'][_0x55010c(0x64e)](this) * 0x4;
      if (_0x37094b >= _0x5cb59e) SceneManager[_0x55010c(0x469)](!![]);
    }
  }),
  (Scene_Title[_0x17b060(0x4d5)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x4ad)][_0x17b060(0x273)]),
  (Scene_Title[_0x17b060(0x40e)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x4ad)][_0x17b060(0x192)]),
  (Scene_Title[_0x17b060(0x518)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x1ca)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x601)] = Scene_Title[_0x17b060(0x54a)]['drawGameTitle']),
  (Scene_Title[_0x17b060(0x54a)]['drawGameTitle'] = function () {
    const _0x3e81e7 = _0x17b060;
    VisuMZ[_0x3e81e7(0x77a)][_0x3e81e7(0x382)][_0x3e81e7(0x5b0)][_0x3e81e7(0x4ad)][_0x3e81e7(0x5db)]['call'](this);
    if (Scene_Title[_0x3e81e7(0x4d5)] !== '' && Scene_Title[_0x3e81e7(0x4d5)] !== _0x3e81e7(0x273)) this['drawGameSubtitle']();
    if (Scene_Title['version'] !== '' && Scene_Title['version'] !== _0x3e81e7(0x39c)) this[_0x3e81e7(0x649)]();
  }),
  (Scene_Title[_0x17b060(0x54a)]['drawGameSubtitle'] = function () {
    const _0x2df58 = _0x17b060;
    VisuMZ['CoreEngine'][_0x2df58(0x382)][_0x2df58(0x5b0)][_0x2df58(0x4ad)][_0x2df58(0x63c)][_0x2df58(0x64e)](this);
  }),
  (Scene_Title[_0x17b060(0x54a)][_0x17b060(0x649)] = function () {
    const _0x137299 = _0x17b060;
    VisuMZ[_0x137299(0x77a)][_0x137299(0x382)][_0x137299(0x5b0)]['Title'][_0x137299(0x649)][_0x137299(0x64e)](this);
  }),
  (Scene_Title[_0x17b060(0x54a)][_0x17b060(0x5dd)] = function () {
    const _0x224c79 = _0x17b060;
    this['createTitleButtons']();
    const _0x5a9fd1 = $dataSystem[_0x224c79(0xe2)][_0x224c79(0x7b3)],
      _0xc19986 = this[_0x224c79(0x4e2)]();
    (this[_0x224c79(0x7b7)] = new Window_TitleCommand(_0xc19986)), this[_0x224c79(0x7b7)]['setBackgroundType'](_0x5a9fd1);
    const _0xb4fca5 = this['commandWindowRect']();
    this['_commandWindow'][_0x224c79(0x4f6)](_0xb4fca5['x'], _0xb4fca5['y'], _0xb4fca5[_0x224c79(0x321)], _0xb4fca5[_0x224c79(0x2c5)]),
      this['_commandWindow'][_0x224c79(0x5f1)](),
      this[_0x224c79(0x7b7)][_0x224c79(0x80e)](),
      this[_0x224c79(0x7b7)][_0x224c79(0x2df)](),
      this[_0x224c79(0x6a9)](this[_0x224c79(0x7b7)]);
  }),
  (Scene_Title['prototype']['commandWindowRows'] = function () {
    const _0x47855a = _0x17b060;
    return this[_0x47855a(0x7b7)] ? this[_0x47855a(0x7b7)][_0x47855a(0x162)]() : VisuMZ[_0x47855a(0x77a)]['Settings']['TitleCommandList'][_0x47855a(0x540)];
  }),
  (Scene_Title[_0x17b060(0x54a)][_0x17b060(0x4e2)] = function () {
    const _0x3109f7 = _0x17b060;
    return VisuMZ[_0x3109f7(0x77a)][_0x3109f7(0x382)][_0x3109f7(0x5b0)][_0x3109f7(0x4ad)][_0x3109f7(0x70e)][_0x3109f7(0x64e)](this);
  }),
  (Scene_Title[_0x17b060(0x54a)][_0x17b060(0x264)] = function () {
    const _0x2c6390 = _0x17b060;
    for (const _0x3e6b8 of Scene_Title[_0x2c6390(0x518)]) {
      const _0x3812e6 = new Sprite_TitlePictureButton(_0x3e6b8);
      this[_0x2c6390(0x781)](_0x3812e6);
    }
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x3d6)] = Scene_Map[_0x17b060(0x54a)]['initialize']),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function () {
    const _0x3630ee = _0x17b060;
    VisuMZ[_0x3630ee(0x77a)][_0x3630ee(0x3d6)][_0x3630ee(0x64e)](this), $gameTemp[_0x3630ee(0x834)](), this[_0x3630ee(0x1f3)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x157)] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x8a3)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x8a3)] = function () {
    const _0x5f33eb = _0x17b060;
    VisuMZ['CoreEngine'][_0x5f33eb(0x157)][_0x5f33eb(0x64e)](this), $gameTemp[_0x5f33eb(0x7cd)] && !$gameMessage[_0x5f33eb(0x292)]() && (this[_0x5f33eb(0x51b)](), SceneManager[_0x5f33eb(0x2cb)]());
  }),
  (Scene_Map['prototype'][_0x17b060(0x249)] = function () {
    const _0x2fe0bc = _0x17b060;
    Scene_Message[_0x2fe0bc(0x54a)][_0x2fe0bc(0x249)][_0x2fe0bc(0x64e)](this),
      !SceneManager['isNextScene'](Scene_Battle) &&
        (this[_0x2fe0bc(0x10b)][_0x2fe0bc(0x319)](), this[_0x2fe0bc(0x74e)]['hide'](), (this['_windowLayer'][_0x2fe0bc(0x70d)] = ![]), SceneManager['snapForBackground']()),
      $gameScreen[_0x2fe0bc(0x2e1)](),
      this[_0x2fe0bc(0x1f3)]();
  }),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Map_createMenuButton'] = Scene_Map['prototype'][_0x17b060(0x25a)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x25a)] = function () {
    const _0x473360 = _0x17b060;
    VisuMZ[_0x473360(0x77a)][_0x473360(0x433)][_0x473360(0x64e)](this), SceneManager['isSideButtonLayout']() && this[_0x473360(0x3d3)]();
  }),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x3d3)] = function () {
    const _0x54250c = _0x17b060;
    this[_0x54250c(0x618)]['x'] = Graphics[_0x54250c(0x778)] + 0x4;
  }),
  (VisuMZ['CoreEngine']['Scene_Map_updateScene'] = Scene_Map[_0x17b060(0x54a)]['updateScene']),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x2dc)] = function () {
    const _0x403875 = _0x17b060;
    VisuMZ[_0x403875(0x77a)][_0x403875(0x22b)][_0x403875(0x64e)](this), this[_0x403875(0x373)]();
  }),
  (Scene_Map['prototype'][_0x17b060(0x373)] = function () {
    const _0x5e8d97 = _0x17b060;
    Input[_0x5e8d97(0x301)](_0x5e8d97(0x562)) && ((ConfigManager['alwaysDash'] = !ConfigManager[_0x5e8d97(0x107)]), ConfigManager[_0x5e8d97(0x25e)]());
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x6a7)] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x51b)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x51b)] = function () {
    const _0x428359 = _0x17b060;
    VisuMZ[_0x428359(0x77a)][_0x428359(0x6a7)]['call'](this), this[_0x428359(0x5a3)]();
  }),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x1f3)] = function () {
    const _0x577cc5 = _0x17b060;
    this[_0x577cc5(0x375)] = [];
  }),
  (Scene_Map[_0x17b060(0x54a)]['updateOnceParallelInterpreters'] = function () {
    const _0x188f46 = _0x17b060;
    if (!this[_0x188f46(0x375)]) return;
    for (const _0xa684b of this[_0x188f46(0x375)]) {
      _0xa684b && _0xa684b['update']();
    }
  }),
  (Scene_Map['prototype'][_0x17b060(0x7b8)] = function (_0x471363, _0x39bcf3) {
    const _0xca1afd = _0x17b060,
      _0x517a35 = $dataCommonEvents[_0x471363];
    if (!_0x517a35) return;
    const _0x1c0cbc = new Game_OnceParallelInterpreter();
    this[_0xca1afd(0x5f7)](_0x1c0cbc), _0x1c0cbc['setCommonEvent'](_0x471363), _0x1c0cbc['setEvent'](_0x39bcf3);
  }),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x5f7)] = function (_0x484601) {
    const _0x3e4084 = _0x17b060;
    (this[_0x3e4084(0x375)] = this[_0x3e4084(0x375)] || []), this[_0x3e4084(0x375)][_0x3e4084(0x6f2)](_0x484601);
  }),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x888)] = function (_0x28a615) {
    const _0x2e629d = _0x17b060;
    (this[_0x2e629d(0x375)] = this[_0x2e629d(0x375)] || []), this['_onceParallelInterpreters']['remove'](_0x28a615);
  });
function Game_OnceParallelInterpreter() {
  const _0x460306 = _0x17b060;
  this[_0x460306(0x3e0)](...arguments);
}
(Game_OnceParallelInterpreter[_0x17b060(0x54a)] = Object[_0x17b060(0x3f6)](Game_Interpreter[_0x17b060(0x54a)])),
  (Game_OnceParallelInterpreter['prototype'][_0x17b060(0x60c)] = Game_OnceParallelInterpreter),
  (Game_OnceParallelInterpreter['prototype'][_0x17b060(0x825)] = function (_0x5229da) {
    const _0x24ac66 = _0x17b060,
      _0x4a0386 = $dataCommonEvents[_0x5229da];
    _0x4a0386 ? this['setup'](_0x4a0386[_0x24ac66(0x53c)], 0x0) : this['terminate']();
  }),
  (Game_OnceParallelInterpreter[_0x17b060(0x54a)][_0x17b060(0x7ea)] = function (_0x33045b) {
    const _0x2333a0 = _0x17b060;
    this[_0x2333a0(0x6b5)] = _0x33045b || 0x0;
  }),
  (Game_OnceParallelInterpreter['prototype'][_0x17b060(0x249)] = function () {
    const _0x1bd1cf = _0x17b060;
    if (!SceneManager[_0x1bd1cf(0x482)]()) return;
    SceneManager[_0x1bd1cf(0x2f9)][_0x1bd1cf(0x888)](this), Game_Interpreter[_0x1bd1cf(0x54a)]['terminate'][_0x1bd1cf(0x64e)](this);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Scene_MenuBase_helpAreaTop'] = Scene_MenuBase['prototype'][_0x17b060(0x3b7)]),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x3b7)] = function () {
    const _0x56bfe3 = _0x17b060;
    let _0x2d8f1a = 0x0;
    return SceneManager[_0x56bfe3(0x82d)]() ? (_0x2d8f1a = this['helpAreaTopSideButtonLayout']()) : (_0x2d8f1a = VisuMZ[_0x56bfe3(0x77a)][_0x56bfe3(0x886)][_0x56bfe3(0x64e)](this)), _0x2d8f1a;
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x5e3)] = function () {
    const _0x1df23e = _0x17b060;
    return this['isBottomHelpMode']() ? this[_0x1df23e(0x6a2)]() : 0x0;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x1f8)] = Scene_MenuBase['prototype'][_0x17b060(0x137)]),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x137)] = function () {
    const _0x49b34b = _0x17b060;
    return SceneManager[_0x49b34b(0x82d)]() ? this['mainAreaTopSideButtonLayout']() : VisuMZ['CoreEngine'][_0x49b34b(0x1f8)][_0x49b34b(0x64e)](this);
  }),
  (Scene_MenuBase[_0x17b060(0x54a)]['mainAreaTopSideButtonLayout'] = function () {
    const _0x2a0e64 = _0x17b060;
    if (!this[_0x2a0e64(0x766)]()) return this[_0x2a0e64(0x2a1)]();
    else return this[_0x2a0e64(0x248)]() && this[_0x2a0e64(0x672)]() === _0x2a0e64(0x6b2) ? Window_ButtonAssist[_0x2a0e64(0x54a)][_0x2a0e64(0x835)]() : 0x0;
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x5b8)] = Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x418)]),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x418)] = function () {
    const _0x43aa77 = _0x17b060;
    let _0x14d7c9 = 0x0;
    return (
      SceneManager[_0x43aa77(0x82d)]() ? (_0x14d7c9 = this['mainAreaHeightSideButtonLayout']()) : (_0x14d7c9 = VisuMZ[_0x43aa77(0x77a)][_0x43aa77(0x5b8)]['call'](this)),
      this['isMenuButtonAssistEnabled']() && this[_0x43aa77(0x672)]() !== 'button' && (_0x14d7c9 -= Window_ButtonAssist[_0x43aa77(0x54a)]['lineHeight']()),
      _0x14d7c9
    );
  }),
  (Scene_MenuBase['prototype']['mainAreaHeightSideButtonLayout'] = function () {
    const _0x3c2be2 = _0x17b060;
    return Graphics[_0x3c2be2(0x509)] - this[_0x3c2be2(0x89f)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x688)] = Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x3ba)]),
  (Scene_MenuBase[_0x17b060(0x54a)]['createBackground'] = function () {
    const _0x3bd2f2 = _0x17b060,
      _0x4084b7 = VisuMZ[_0x3bd2f2(0x77a)][_0x3bd2f2(0x382)][_0x3bd2f2(0x8b4)]['BlurStrength'] ?? 0x8;
    (this[_0x3bd2f2(0x194)] = new PIXI[_0x3bd2f2(0x6a3)][_0x3bd2f2(0x60e)](_0x4084b7)),
      (this['_backgroundSprite'] = new Sprite()),
      (this[_0x3bd2f2(0x729)][_0x3bd2f2(0x7d3)] = SceneManager[_0x3bd2f2(0xdf)]()),
      (this[_0x3bd2f2(0x729)][_0x3bd2f2(0x6a3)] = [this[_0x3bd2f2(0x194)]]),
      this['addChild'](this['_backgroundSprite']),
      this[_0x3bd2f2(0x430)](0xc0),
      this[_0x3bd2f2(0x430)](this[_0x3bd2f2(0x61b)]()),
      this[_0x3bd2f2(0x5a6)]();
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x61b)] = function () {
    const _0x513392 = _0x17b060,
      _0x695992 = String(this[_0x513392(0x60c)][_0x513392(0x142)]),
      _0x5b324f = this[_0x513392(0x1fe)](_0x695992);
    return _0x5b324f ? _0x5b324f[_0x513392(0x318)] : 0xc0;
  }),
  (Scene_MenuBase[_0x17b060(0x54a)]['createCustomBackgroundImages'] = function () {
    const _0x231982 = _0x17b060,
      _0x29c8c4 = String(this[_0x231982(0x60c)][_0x231982(0x142)]),
      _0x2b9d40 = this['getCustomBackgroundSettings'](_0x29c8c4);
    _0x2b9d40 &&
      (_0x2b9d40[_0x231982(0xe1)] !== '' || _0x2b9d40['BgFilename2'] !== '') &&
      ((this[_0x231982(0x844)] = new Sprite(ImageManager[_0x231982(0x615)](_0x2b9d40[_0x231982(0xe1)]))),
      (this[_0x231982(0x868)] = new Sprite(ImageManager[_0x231982(0x2b1)](_0x2b9d40[_0x231982(0x3c9)]))),
      this['addChild'](this[_0x231982(0x844)]),
      this[_0x231982(0x781)](this[_0x231982(0x868)]),
      this['_backSprite1'][_0x231982(0x7d3)]['addLoadListener'](this[_0x231982(0x4f1)]['bind'](this, this[_0x231982(0x844)])),
      this[_0x231982(0x868)][_0x231982(0x7d3)]['addLoadListener'](this[_0x231982(0x4f1)][_0x231982(0x76d)](this, this[_0x231982(0x868)])));
  }),
  (Scene_MenuBase['prototype']['getCustomBackgroundSettings'] = function (_0x16b01a) {
    const _0x28179d = _0x17b060;
    return VisuMZ[_0x28179d(0x77a)][_0x28179d(0x382)][_0x28179d(0x8b4)][_0x16b01a] || VisuMZ[_0x28179d(0x77a)][_0x28179d(0x382)][_0x28179d(0x8b4)][_0x28179d(0x58a)];
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x4f1)] = function (_0x18bac0) {
    const _0x1e90fc = _0x17b060;
    this[_0x1e90fc(0x533)](_0x18bac0), this[_0x1e90fc(0x799)](_0x18bac0);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x20e)] = Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x360)]),
  (Scene_MenuBase['prototype'][_0x17b060(0x360)] = function () {
    const _0x5de073 = _0x17b060;
    VisuMZ[_0x5de073(0x77a)]['Scene_MenuBase_createCancelButton']['call'](this), SceneManager[_0x5de073(0x818)]() && this[_0x5de073(0x4f9)]();
  }),
  (Scene_MenuBase['prototype']['moveCancelButtonSideButtonLayout'] = function () {
    const _0x493f68 = _0x17b060;
    this[_0x493f68(0x257)]['x'] = Graphics[_0x493f68(0x778)] + 0x4;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x6e6)] = Scene_MenuBase['prototype']['createPageButtons']),
  (Scene_MenuBase['prototype'][_0x17b060(0x54e)] = function () {
    const _0xbde0c9 = _0x17b060;
    VisuMZ['CoreEngine'][_0xbde0c9(0x6e6)][_0xbde0c9(0x64e)](this), SceneManager[_0xbde0c9(0x818)]() && this[_0xbde0c9(0x36f)]();
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x36f)] = function () {
    const _0xcbea14 = _0x17b060;
    (this[_0xcbea14(0x262)]['x'] = -0x1 * (this[_0xcbea14(0x262)]['width'] + this[_0xcbea14(0x7de)][_0xcbea14(0x321)] + 0x8)),
      (this['_pagedownButton']['x'] = -0x1 * (this['_pagedownButton']['width'] + 0x4));
  }),
  (Scene_MenuBase['prototype'][_0x17b060(0x248)] = function () {
    const _0x412d6f = _0x17b060;
    return VisuMZ[_0x412d6f(0x77a)][_0x412d6f(0x382)][_0x412d6f(0x862)][_0x412d6f(0x20a)];
  }),
  (Scene_MenuBase['prototype'][_0x17b060(0x672)] = function () {
    const _0x2ca8f6 = _0x17b060;
    return SceneManager[_0x2ca8f6(0x818)]() || SceneManager[_0x2ca8f6(0x28c)]() ? VisuMZ[_0x2ca8f6(0x77a)][_0x2ca8f6(0x382)]['ButtonAssist']['Location'] : _0x2ca8f6(0x139);
  }),
  (Scene_MenuBase[_0x17b060(0x54a)]['createButtonAssistWindow'] = function () {
    const _0x5c3dac = _0x17b060;
    if (!this[_0x5c3dac(0x248)]()) return;
    const _0x2e0a29 = this[_0x5c3dac(0x1f4)]();
    (this['_buttonAssistWindow'] = new Window_ButtonAssist(_0x2e0a29)), this['addWindow'](this[_0x5c3dac(0x5a2)]);
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x1f4)] = function () {
    const _0x2ff668 = _0x17b060;
    return this['getButtonAssistLocation']() === _0x2ff668(0x139) ? this[_0x2ff668(0x784)]() : this[_0x2ff668(0x41b)]();
  }),
  (Scene_MenuBase[_0x17b060(0x54a)]['buttonAssistWindowButtonRect'] = function () {
    const _0x2a1ebd = _0x17b060,
      _0xce4a46 = ConfigManager[_0x2a1ebd(0x5f9)] ? (Sprite_Button[_0x2a1ebd(0x54a)]['blockWidth']() + 0x6) * 0x2 : 0x0,
      _0x1a1cd5 = this['buttonY'](),
      _0x4c7b7e = Graphics['boxWidth'] - _0xce4a46 * 0x2,
      _0x9e6dce = this[_0x2a1ebd(0x3ec)]();
    return new Rectangle(_0xce4a46, _0x1a1cd5, _0x4c7b7e, _0x9e6dce);
  }),
  (Scene_MenuBase[_0x17b060(0x54a)][_0x17b060(0x41b)] = function () {
    const _0x55ded4 = _0x17b060,
      _0x271d80 = Graphics['boxWidth'],
      _0x45b624 = Window_ButtonAssist[_0x55ded4(0x54a)][_0x55ded4(0x835)](),
      _0x547cda = 0x0;
    let _0x2321c2 = 0x0;
    return this[_0x55ded4(0x672)]() === _0x55ded4(0x6b2) ? (_0x2321c2 = 0x0) : (_0x2321c2 = Graphics['boxHeight'] - _0x45b624), new Rectangle(_0x547cda, _0x2321c2, _0x271d80, _0x45b624);
  }),
  (Scene_Menu[_0x17b060(0x653)] = VisuMZ['CoreEngine'][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x78e)]),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Menu_create'] = Scene_Menu[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Menu['prototype']['create'] = function () {
    const _0x428576 = _0x17b060;
    VisuMZ[_0x428576(0x77a)][_0x428576(0x7e5)][_0x428576(0x64e)](this), this[_0x428576(0x763)]();
  }),
  (Scene_Menu['prototype']['setCoreEngineUpdateWindowBg'] = function () {
    const _0x599d36 = _0x17b060;
    this[_0x599d36(0x7b7)] && this[_0x599d36(0x7b7)]['setBackgroundType'](Scene_Menu[_0x599d36(0x653)]['CommandBgType']),
      this['_goldWindow'] && this['_goldWindow'][_0x599d36(0x12d)](Scene_Menu['layoutSettings'][_0x599d36(0x391)]),
      this[_0x599d36(0x501)] && this[_0x599d36(0x501)][_0x599d36(0x12d)](Scene_Menu[_0x599d36(0x653)][_0x599d36(0x349)]);
  }),
  (Scene_Menu[_0x17b060(0x54a)][_0x17b060(0x4e2)] = function () {
    const _0x4673fd = _0x17b060;
    return Scene_Menu[_0x4673fd(0x653)][_0x4673fd(0x70e)]['call'](this);
  }),
  (Scene_Menu[_0x17b060(0x54a)][_0x17b060(0x81e)] = function () {
    const _0x112a56 = _0x17b060;
    return Scene_Menu[_0x112a56(0x653)][_0x112a56(0x84d)][_0x112a56(0x64e)](this);
  }),
  (Scene_Menu['prototype']['statusWindowRect'] = function () {
    const _0x4c0fe7 = _0x17b060;
    return Scene_Menu['layoutSettings'][_0x4c0fe7(0x71b)][_0x4c0fe7(0x64e)](this);
  }),
  (Scene_Item[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x78a)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x3a6)] = Scene_Item[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Item[_0x17b060(0x54a)]['create'] = function () {
    const _0x2579a9 = _0x17b060;
    VisuMZ[_0x2579a9(0x77a)]['Scene_Item_create'][_0x2579a9(0x64e)](this), this['setCoreEngineUpdateWindowBg']();
  }),
  (Scene_Item[_0x17b060(0x54a)][_0x17b060(0x763)] = function () {
    const _0x2e81f4 = _0x17b060;
    this[_0x2e81f4(0x370)] && this[_0x2e81f4(0x370)][_0x2e81f4(0x12d)](Scene_Item['layoutSettings']['HelpBgType']),
      this[_0x2e81f4(0x4e6)] && this[_0x2e81f4(0x4e6)][_0x2e81f4(0x12d)](Scene_Item[_0x2e81f4(0x653)][_0x2e81f4(0x4f7)]),
      this[_0x2e81f4(0x28d)] && this['_itemWindow'][_0x2e81f4(0x12d)](Scene_Item['layoutSettings'][_0x2e81f4(0x823)]),
      this[_0x2e81f4(0x6bf)] && this[_0x2e81f4(0x6bf)]['setBackgroundType'](Scene_Item[_0x2e81f4(0x653)][_0x2e81f4(0x885)]);
  }),
  (Scene_Item[_0x17b060(0x54a)][_0x17b060(0x295)] = function () {
    const _0x1b468a = _0x17b060;
    return Scene_Item[_0x1b468a(0x653)][_0x1b468a(0x432)][_0x1b468a(0x64e)](this);
  }),
  (Scene_Item[_0x17b060(0x54a)][_0x17b060(0x564)] = function () {
    const _0x222902 = _0x17b060;
    return Scene_Item[_0x222902(0x653)][_0x222902(0x6c0)][_0x222902(0x64e)](this);
  }),
  (Scene_Item[_0x17b060(0x54a)]['itemWindowRect'] = function () {
    const _0x602b8a = _0x17b060;
    return Scene_Item[_0x602b8a(0x653)][_0x602b8a(0x51a)][_0x602b8a(0x64e)](this);
  }),
  (Scene_Item[_0x17b060(0x54a)][_0x17b060(0x47c)] = function () {
    const _0x5d5f22 = _0x17b060;
    return Scene_Item[_0x5d5f22(0x653)][_0x5d5f22(0x6b7)][_0x5d5f22(0x64e)](this);
  }),
  (Scene_Skill[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x128)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x68b)] = Scene_Skill[_0x17b060(0x54a)]['create']),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0x1cdb57 = _0x17b060;
    VisuMZ[_0x1cdb57(0x77a)][_0x1cdb57(0x68b)][_0x1cdb57(0x64e)](this), this[_0x1cdb57(0x763)]();
  }),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x763)] = function () {
    const _0x3d4a3c = _0x17b060;
    this['_helpWindow'] && this[_0x3d4a3c(0x370)][_0x3d4a3c(0x12d)](Scene_Skill[_0x3d4a3c(0x653)][_0x3d4a3c(0x67a)]),
      this[_0x3d4a3c(0x1cb)] && this[_0x3d4a3c(0x1cb)]['setBackgroundType'](Scene_Skill[_0x3d4a3c(0x653)]['SkillTypeBgType']),
      this[_0x3d4a3c(0x501)] && this[_0x3d4a3c(0x501)][_0x3d4a3c(0x12d)](Scene_Skill[_0x3d4a3c(0x653)][_0x3d4a3c(0x349)]),
      this[_0x3d4a3c(0x28d)] && this[_0x3d4a3c(0x28d)][_0x3d4a3c(0x12d)](Scene_Skill[_0x3d4a3c(0x653)][_0x3d4a3c(0x823)]),
      this[_0x3d4a3c(0x6bf)] && this['_actorWindow']['setBackgroundType'](Scene_Skill['layoutSettings']['ActorBgType']);
  }),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x295)] = function () {
    const _0x32561c = _0x17b060;
    return Scene_Skill[_0x32561c(0x653)]['HelpRect']['call'](this);
  }),
  (Scene_Skill['prototype'][_0x17b060(0x4d6)] = function () {
    const _0x179b4a = _0x17b060;
    return Scene_Skill[_0x179b4a(0x653)][_0x179b4a(0x59d)]['call'](this);
  }),
  (Scene_Skill['prototype'][_0x17b060(0x865)] = function () {
    const _0x2a4654 = _0x17b060;
    return Scene_Skill['layoutSettings']['StatusRect'][_0x2a4654(0x64e)](this);
  }),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x5be)] = function () {
    const _0x37efb9 = _0x17b060;
    return Scene_Skill[_0x37efb9(0x653)][_0x37efb9(0x51a)][_0x37efb9(0x64e)](this);
  }),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x47c)] = function () {
    const _0x3a4d5e = _0x17b060;
    return Scene_Skill[_0x3a4d5e(0x653)][_0x3a4d5e(0x6b7)][_0x3a4d5e(0x64e)](this);
  }),
  (Scene_Equip['layoutSettings'] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x4ce)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x229)] = Scene_Equip[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Equip['prototype'][_0x17b060(0x3f6)] = function () {
    const _0x3762ea = _0x17b060;
    VisuMZ[_0x3762ea(0x77a)][_0x3762ea(0x229)][_0x3762ea(0x64e)](this), this['setCoreEngineUpdateWindowBg']();
  }),
  (Scene_Equip[_0x17b060(0x54a)][_0x17b060(0x763)] = function () {
    const _0x52a2f7 = _0x17b060;
    this[_0x52a2f7(0x370)] && this['_helpWindow'][_0x52a2f7(0x12d)](Scene_Equip['layoutSettings'][_0x52a2f7(0x67a)]),
      this['_statusWindow'] && this[_0x52a2f7(0x501)]['setBackgroundType'](Scene_Equip['layoutSettings']['StatusBgType']),
      this[_0x52a2f7(0x7b7)] && this[_0x52a2f7(0x7b7)]['setBackgroundType'](Scene_Equip[_0x52a2f7(0x653)][_0x52a2f7(0x24d)]),
      this[_0x52a2f7(0x590)] && this[_0x52a2f7(0x590)][_0x52a2f7(0x12d)](Scene_Equip[_0x52a2f7(0x653)][_0x52a2f7(0x1db)]),
      this[_0x52a2f7(0x28d)] && this['_itemWindow'][_0x52a2f7(0x12d)](Scene_Equip[_0x52a2f7(0x653)]['ItemBgType']);
  }),
  (Scene_Equip[_0x17b060(0x54a)]['helpWindowRect'] = function () {
    const _0x169627 = _0x17b060;
    return Scene_Equip[_0x169627(0x653)][_0x169627(0x432)][_0x169627(0x64e)](this);
  }),
  (Scene_Equip['prototype']['statusWindowRect'] = function () {
    const _0x5ea8ed = _0x17b060;
    return Scene_Equip[_0x5ea8ed(0x653)][_0x5ea8ed(0x71b)][_0x5ea8ed(0x64e)](this);
  }),
  (Scene_Equip[_0x17b060(0x54a)]['commandWindowRect'] = function () {
    const _0x11e738 = _0x17b060;
    return Scene_Equip[_0x11e738(0x653)][_0x11e738(0x70e)][_0x11e738(0x64e)](this);
  }),
  (Scene_Equip[_0x17b060(0x54a)][_0x17b060(0x4ef)] = function () {
    const _0x20dcac = _0x17b060;
    return Scene_Equip[_0x20dcac(0x653)]['SlotRect'][_0x20dcac(0x64e)](this);
  }),
  (Scene_Equip[_0x17b060(0x54a)][_0x17b060(0x5be)] = function () {
    const _0x3096ba = _0x17b060;
    return Scene_Equip[_0x3096ba(0x653)][_0x3096ba(0x51a)]['call'](this);
  }),
  (Scene_Status[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)]['MenuLayout']['StatusMenu']),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Status_create'] = Scene_Status[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Status['prototype']['create'] = function () {
    const _0x399570 = _0x17b060;
    VisuMZ[_0x399570(0x77a)]['Scene_Status_create'][_0x399570(0x64e)](this), this[_0x399570(0x763)]();
  }),
  (Scene_Status['prototype'][_0x17b060(0x763)] = function () {
    const _0x3f7889 = _0x17b060;
    this[_0x3f7889(0x1cc)] && this[_0x3f7889(0x1cc)][_0x3f7889(0x12d)](Scene_Status[_0x3f7889(0x653)]['ProfileBgType']),
      this[_0x3f7889(0x501)] && this[_0x3f7889(0x501)][_0x3f7889(0x12d)](Scene_Status[_0x3f7889(0x653)]['StatusBgType']),
      this['_statusParamsWindow'] && this['_statusParamsWindow'][_0x3f7889(0x12d)](Scene_Status[_0x3f7889(0x653)][_0x3f7889(0x2d1)]),
      this[_0x3f7889(0x8b8)] && this[_0x3f7889(0x8b8)][_0x3f7889(0x12d)](Scene_Status[_0x3f7889(0x653)][_0x3f7889(0x581)]);
  }),
  (Scene_Status['prototype'][_0x17b060(0x306)] = function () {
    const _0x41df70 = _0x17b060;
    return Scene_Status[_0x41df70(0x653)][_0x41df70(0x322)][_0x41df70(0x64e)](this);
  }),
  (Scene_Status[_0x17b060(0x54a)]['statusWindowRect'] = function () {
    const _0x18682d = _0x17b060;
    return Scene_Status[_0x18682d(0x653)]['StatusRect']['call'](this);
  }),
  (Scene_Status['prototype'][_0x17b060(0x69a)] = function () {
    const _0x23720c = _0x17b060;
    return Scene_Status[_0x23720c(0x653)][_0x23720c(0xfc)][_0x23720c(0x64e)](this);
  }),
  (Scene_Status[_0x17b060(0x54a)][_0x17b060(0x47e)] = function () {
    const _0x47e52a = _0x17b060;
    return Scene_Status[_0x47e52a(0x653)]['StatusEquipRect'][_0x47e52a(0x64e)](this);
  }),
  (Scene_Options['layoutSettings'] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x66b)]),
  (VisuMZ['CoreEngine']['Scene_Options_create'] = Scene_Options[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Options[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0x30d68f = _0x17b060;
    VisuMZ[_0x30d68f(0x77a)][_0x30d68f(0x883)]['call'](this), this[_0x30d68f(0x763)]();
  }),
  (Scene_Options[_0x17b060(0x54a)][_0x17b060(0x763)] = function () {
    const _0x3f88f7 = _0x17b060;
    this['_optionsWindow'] && this[_0x3f88f7(0x48a)][_0x3f88f7(0x12d)](Scene_Options[_0x3f88f7(0x653)][_0x3f88f7(0x65d)]);
  }),
  (Scene_Options[_0x17b060(0x54a)]['optionsWindowRect'] = function () {
    const _0x7a4801 = _0x17b060;
    return Scene_Options[_0x7a4801(0x653)][_0x7a4801(0x3d2)][_0x7a4801(0x64e)](this);
  }),
  (Scene_Save[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x230)]),
  (Scene_Save[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0xc35e34 = _0x17b060;
    Scene_File[_0xc35e34(0x54a)][_0xc35e34(0x3f6)][_0xc35e34(0x64e)](this), this[_0xc35e34(0x763)]();
  }),
  (Scene_Save['prototype'][_0x17b060(0x763)] = function () {
    const _0xd9b66b = _0x17b060;
    this[_0xd9b66b(0x370)] && this[_0xd9b66b(0x370)][_0xd9b66b(0x12d)](Scene_Save[_0xd9b66b(0x653)][_0xd9b66b(0x67a)]),
      this[_0xd9b66b(0x234)] && this[_0xd9b66b(0x234)][_0xd9b66b(0x12d)](Scene_Save['layoutSettings']['ListBgType']);
  }),
  (Scene_Save[_0x17b060(0x54a)][_0x17b060(0x295)] = function () {
    const _0x57a7d6 = _0x17b060;
    return Scene_Save[_0x57a7d6(0x653)][_0x57a7d6(0x432)][_0x57a7d6(0x64e)](this);
  }),
  (Scene_Save[_0x17b060(0x54a)]['listWindowRect'] = function () {
    const _0x2fcb5b = _0x17b060;
    return Scene_Save['layoutSettings'][_0x2fcb5b(0x5e9)][_0x2fcb5b(0x64e)](this);
  }),
  (Scene_Load[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x520)]),
  (Scene_Load[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0x239c50 = _0x17b060;
    Scene_File[_0x239c50(0x54a)][_0x239c50(0x3f6)][_0x239c50(0x64e)](this), this[_0x239c50(0x763)]();
  }),
  (Scene_Load[_0x17b060(0x54a)][_0x17b060(0x763)] = function () {
    const _0x6300a3 = _0x17b060;
    this[_0x6300a3(0x370)] && this[_0x6300a3(0x370)][_0x6300a3(0x12d)](Scene_Load[_0x6300a3(0x653)][_0x6300a3(0x67a)]),
      this[_0x6300a3(0x234)] && this[_0x6300a3(0x234)][_0x6300a3(0x12d)](Scene_Load[_0x6300a3(0x653)]['ListBgType']);
  }),
  (Scene_Load[_0x17b060(0x54a)][_0x17b060(0x295)] = function () {
    const _0x49baec = _0x17b060;
    return Scene_Load[_0x49baec(0x653)][_0x49baec(0x432)][_0x49baec(0x64e)](this);
  }),
  (Scene_Load['prototype'][_0x17b060(0x6be)] = function () {
    const _0x4e547a = _0x17b060;
    return Scene_Load[_0x4e547a(0x653)][_0x4e547a(0x5e9)][_0x4e547a(0x64e)](this);
  });
function Scene_QuickLoad() {
  const _0x1e3390 = _0x17b060;
  this[_0x1e3390(0x3e0)](...arguments);
}
(Scene_QuickLoad[_0x17b060(0x54a)] = Object[_0x17b060(0x3f6)](Scene_Load['prototype'])),
  (Scene_QuickLoad[_0x17b060(0x54a)][_0x17b060(0x60c)] = Scene_QuickLoad),
  (Scene_QuickLoad['prototype'][_0x17b060(0x3e0)] = function () {
    const _0x402d9b = _0x17b060;
    Scene_Load[_0x402d9b(0x54a)][_0x402d9b(0x3e0)]['call'](this);
  }),
  (Scene_QuickLoad[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0x2cdbba = _0x17b060;
    this[_0x2cdbba(0x357)](this['_saveFileID']);
  }),
  (Scene_QuickLoad['prototype'][_0x17b060(0x1d0)] = function (_0x36a4ec) {
    const _0x22b95a = _0x17b060;
    this[_0x22b95a(0x154)] = _0x36a4ec;
  }),
  (Scene_QuickLoad[_0x17b060(0x54a)][_0x17b060(0x6ae)] = function () {
    const _0x572716 = _0x17b060;
    Scene_MenuBase['prototype'][_0x572716(0x6ae)]['call'](this);
  }),
  (Scene_GameEnd['layoutSettings'] = VisuMZ[_0x17b060(0x77a)]['Settings'][_0x17b060(0x5b0)]['GameEnd']),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x50a)] = Scene_GameEnd['prototype'][_0x17b060(0x3ba)]),
  (Scene_GameEnd[_0x17b060(0x54a)][_0x17b060(0x3ba)] = function () {
    const _0x23dc0b = _0x17b060;
    Scene_MenuBase[_0x23dc0b(0x54a)][_0x23dc0b(0x3ba)][_0x23dc0b(0x64e)](this);
  }),
  (Scene_GameEnd[_0x17b060(0x54a)][_0x17b060(0x5dd)] = function () {
    const _0x401e7f = _0x17b060,
      _0x12e040 = this[_0x401e7f(0x4e2)]();
    (this[_0x401e7f(0x7b7)] = new Window_GameEnd(_0x12e040)),
      this[_0x401e7f(0x7b7)][_0x401e7f(0x3f2)]('cancel', this[_0x401e7f(0x3b5)][_0x401e7f(0x76d)](this)),
      this[_0x401e7f(0x6a9)](this[_0x401e7f(0x7b7)]),
      this['_commandWindow'][_0x401e7f(0x12d)](Scene_GameEnd['layoutSettings'][_0x401e7f(0x24d)]);
  }),
  (Scene_GameEnd['prototype'][_0x17b060(0x4e2)] = function () {
    const _0x54a179 = _0x17b060;
    return Scene_GameEnd['layoutSettings'][_0x54a179(0x70e)][_0x54a179(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x653)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x5b0)][_0x17b060(0x5af)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x38e)] = Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0x17e150 = _0x17b060;
    VisuMZ['CoreEngine'][_0x17e150(0x38e)]['call'](this), this[_0x17e150(0x763)]();
  }),
  (Scene_Shop['prototype'][_0x17b060(0x763)] = function () {
    const _0x115622 = _0x17b060;
    this['_helpWindow'] && this[_0x115622(0x370)][_0x115622(0x12d)](Scene_Shop[_0x115622(0x653)][_0x115622(0x67a)]),
      this['_goldWindow'] && this[_0x115622(0x6da)][_0x115622(0x12d)](Scene_Shop[_0x115622(0x653)]['GoldBgType']),
      this[_0x115622(0x7b7)] && this[_0x115622(0x7b7)]['setBackgroundType'](Scene_Shop[_0x115622(0x653)][_0x115622(0x24d)]),
      this['_dummyWindow'] && this['_dummyWindow'][_0x115622(0x12d)](Scene_Shop[_0x115622(0x653)][_0x115622(0x328)]),
      this[_0x115622(0x61d)] && this[_0x115622(0x61d)][_0x115622(0x12d)](Scene_Shop['layoutSettings']['NumberBgType']),
      this[_0x115622(0x501)] && this[_0x115622(0x501)][_0x115622(0x12d)](Scene_Shop['layoutSettings'][_0x115622(0x349)]),
      this[_0x115622(0x8b0)] && this[_0x115622(0x8b0)][_0x115622(0x12d)](Scene_Shop[_0x115622(0x653)][_0x115622(0x143)]),
      this[_0x115622(0x4e6)] && this[_0x115622(0x4e6)]['setBackgroundType'](Scene_Shop[_0x115622(0x653)][_0x115622(0x4f7)]),
      this[_0x115622(0x5ec)] && this['_sellWindow']['setBackgroundType'](Scene_Shop[_0x115622(0x653)]['SellBgType']);
  }),
  (Scene_Shop['prototype'][_0x17b060(0x295)] = function () {
    const _0xd3ed69 = _0x17b060;
    return Scene_Shop[_0xd3ed69(0x653)][_0xd3ed69(0x432)][_0xd3ed69(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)]['goldWindowRect'] = function () {
    const _0x78e01f = _0x17b060;
    return Scene_Shop['layoutSettings'][_0x78e01f(0x84d)][_0x78e01f(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x4e2)] = function () {
    const _0x2fc734 = _0x17b060;
    return Scene_Shop[_0x2fc734(0x653)][_0x2fc734(0x70e)]['call'](this);
  }),
  (Scene_Shop['prototype'][_0x17b060(0x459)] = function () {
    const _0x5361f3 = _0x17b060;
    return Scene_Shop[_0x5361f3(0x653)]['DummyRect'][_0x5361f3(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x637)] = function () {
    const _0x4e8a60 = _0x17b060;
    return Scene_Shop['layoutSettings'][_0x4e8a60(0x496)][_0x4e8a60(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)]['statusWindowRect'] = function () {
    const _0x2a33a3 = _0x17b060;
    return Scene_Shop[_0x2a33a3(0x653)]['StatusRect']['call'](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x491)] = function () {
    const _0x41da84 = _0x17b060;
    return Scene_Shop[_0x41da84(0x653)][_0x41da84(0x267)][_0x41da84(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x564)] = function () {
    const _0x25f108 = _0x17b060;
    return Scene_Shop['layoutSettings'][_0x25f108(0x6c0)][_0x25f108(0x64e)](this);
  }),
  (Scene_Shop[_0x17b060(0x54a)][_0x17b060(0x68d)] = function () {
    const _0x4ba4c1 = _0x17b060;
    return Scene_Shop['layoutSettings'][_0x4ba4c1(0x61f)]['call'](this);
  }),
  (Scene_Name[_0x17b060(0x653)] = VisuMZ['CoreEngine']['Settings'][_0x17b060(0x5b0)][_0x17b060(0x4f8)]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x17b)] = Scene_Name[_0x17b060(0x54a)][_0x17b060(0x3f6)]),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x3f6)] = function () {
    const _0xc0e2d5 = _0x17b060;
    VisuMZ[_0xc0e2d5(0x77a)][_0xc0e2d5(0x17b)][_0xc0e2d5(0x64e)](this), this['setCoreEngineUpdateWindowBg']();
  }),
  (Scene_Name['prototype'][_0x17b060(0x763)] = function () {
    const _0x3bf21c = _0x17b060;
    this[_0x3bf21c(0x36e)] && this[_0x3bf21c(0x36e)][_0x3bf21c(0x12d)](Scene_Name[_0x3bf21c(0x653)][_0x3bf21c(0x2b6)]),
      this['_inputWindow'] && this['_inputWindow'][_0x3bf21c(0x12d)](Scene_Name[_0x3bf21c(0x653)][_0x3bf21c(0x7d1)]);
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x89f)] = function () {
    return 0x0;
  }),
  (Scene_Name['prototype'][_0x17b060(0x39b)] = function () {
    const _0x90a830 = _0x17b060;
    return Scene_Name[_0x90a830(0x653)][_0x90a830(0x1bb)]['call'](this);
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x4f2)] = function () {
    const _0x26b3d2 = _0x17b060;
    return Scene_Name['layoutSettings']['InputRect'][_0x26b3d2(0x64e)](this);
  }),
  (Scene_Name[_0x17b060(0x54a)]['EnableNameInput'] = function () {
    const _0x5d0e32 = _0x17b060;
    if (!this[_0x5d0e32(0x52d)]) return ![];
    return VisuMZ[_0x5d0e32(0x77a)]['Settings'][_0x5d0e32(0x197)]['EnableNameInput'];
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x1fb)] = function () {
    const _0x455cc7 = _0x17b060;
    if (this['EnableNameInput']() && this['_inputWindow'][_0x455cc7(0x440)] !== 'keyboard') return TextManager[_0x455cc7(0x165)](_0x455cc7(0x595), _0x455cc7(0x7c5));
    return Scene_MenuBase[_0x455cc7(0x54a)][_0x455cc7(0x1fb)][_0x455cc7(0x64e)](this);
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x56f)] = function () {
    const _0x33a0a0 = _0x17b060;
    return this['EnableNameInput']() ? TextManager[_0x33a0a0(0x713)](_0x33a0a0(0x412)) : Scene_MenuBase[_0x33a0a0(0x54a)][_0x33a0a0(0x56f)]['call'](this);
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x6f0)] = function () {
    const _0xa76c00 = _0x17b060;
    if (this[_0xa76c00(0x3d1)]() && this[_0xa76c00(0x52d)][_0xa76c00(0x440)] === 'keyboard') return TextManager[_0xa76c00(0x183)]([_0xa76c00(0x2fe)]);
    return Scene_MenuBase[_0xa76c00(0x54a)][_0xa76c00(0x6f0)][_0xa76c00(0x64e)](this);
  }),
  (Scene_Name['prototype']['buttonAssistKey5'] = function () {
    const _0x1d7188 = _0x17b060;
    if (this[_0x1d7188(0x3d1)]() && this['_inputWindow'][_0x1d7188(0x440)] === _0x1d7188(0x364)) return TextManager[_0x1d7188(0x183)]([_0x1d7188(0x287)]);
    return Scene_MenuBase[_0x1d7188(0x54a)]['buttonAssistKey5']['call'](this);
  }),
  (Scene_Name[_0x17b060(0x54a)]['buttonAssistText1'] = function () {
    const _0x264f46 = _0x17b060;
    if (this[_0x264f46(0x3d1)]() && this[_0x264f46(0x52d)]['_mode'] !== _0x264f46(0x364)) {
      const _0x34c842 = VisuMZ['CoreEngine'][_0x264f46(0x382)]['KeyboardInput'];
      return _0x34c842[_0x264f46(0x2fd)] || _0x264f46(0x227);
    }
    return Scene_MenuBase[_0x264f46(0x54a)][_0x264f46(0x8a0)]['call'](this);
  }),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x52a)] = function () {
    const _0x3560c2 = _0x17b060;
    if (this[_0x3560c2(0x3d1)]()) {
      const _0xea0106 = VisuMZ['CoreEngine'][_0x3560c2(0x382)][_0x3560c2(0x197)];
      return this['_inputWindow'][_0x3560c2(0x440)] === _0x3560c2(0x364) ? _0xea0106[_0x3560c2(0x546)] || 'Keyboard' : _0xea0106[_0x3560c2(0x7bf)] || 'Manual';
    } else return Scene_MenuBase[_0x3560c2(0x54a)][_0x3560c2(0x52a)][_0x3560c2(0x64e)](this);
  }),
  (Scene_Name['prototype'][_0x17b060(0x21d)] = function () {
    const _0x433d9f = _0x17b060;
    if (this[_0x433d9f(0x3d1)]()) {
      const _0xe347cb = VisuMZ[_0x433d9f(0x77a)]['Settings']['KeyboardInput'];
      if (this['_inputWindow'][_0x433d9f(0x440)] === 'keyboard') return _0xe347cb[_0x433d9f(0x526)] || 'Finish';
    }
    return Scene_MenuBase[_0x433d9f(0x54a)]['buttonAssistText4'][_0x433d9f(0x64e)](this);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0xe0)] = Scene_Name[_0x17b060(0x54a)]['onInputOk']),
  (Scene_Name[_0x17b060(0x54a)][_0x17b060(0x7ef)] = function () {
    const _0x2e0169 = _0x17b060;
    this['doesNameContainBannedWords']() ? this[_0x2e0169(0x87b)]() : VisuMZ[_0x2e0169(0x77a)][_0x2e0169(0xe0)][_0x2e0169(0x64e)](this);
  }),
  (Scene_Name['prototype'][_0x17b060(0x7c9)] = function () {
    const _0x18908d = _0x17b060,
      _0x2e9374 = VisuMZ[_0x18908d(0x77a)][_0x18908d(0x382)][_0x18908d(0x197)];
    if (!_0x2e9374) return ![];
    const _0x28c914 = _0x2e9374[_0x18908d(0x854)];
    if (!_0x28c914) return ![];
    const _0x2aaa31 = this[_0x18908d(0x36e)][_0x18908d(0x142)]()[_0x18908d(0x853)]();
    for (const _0x14b840 of _0x28c914) {
      if (_0x2aaa31[_0x18908d(0x1ae)](_0x14b840[_0x18908d(0x853)]())) return !![];
    }
    return ![];
  }),
  (Scene_Name[_0x17b060(0x54a)]['onInputBannedWords'] = function () {
    const _0x3ab85f = _0x17b060;
    SoundManager[_0x3ab85f(0x217)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x4ab)] = Scene_Battle[_0x17b060(0x54a)]['update']),
  (Scene_Battle['prototype'][_0x17b060(0x319)] = function () {
    const _0x1c3d9b = _0x17b060;
    VisuMZ['CoreEngine'][_0x1c3d9b(0x4ab)][_0x1c3d9b(0x64e)](this);
    if ($gameTemp['_playTestFastMode']) this[_0x1c3d9b(0x408)]();
  }),
  (Scene_Battle[_0x17b060(0x54a)]['updatePlayTestF7'] = function () {
    const _0x822ad1 = _0x17b060;
    !BattleManager[_0x822ad1(0x266)]() &&
      !this[_0x822ad1(0x60a)] &&
      !$gameMessage[_0x822ad1(0x292)]() &&
      ((this[_0x822ad1(0x60a)] = !![]), this['update'](), SceneManager[_0x822ad1(0x2cb)](), (this[_0x822ad1(0x60a)] = ![]));
  }),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Battle_createCancelButton'] = Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x360)]),
  (Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x360)] = function () {
    const _0x578a73 = _0x17b060;
    VisuMZ[_0x578a73(0x77a)][_0x578a73(0x8aa)]['call'](this), SceneManager[_0x578a73(0x818)]() && this['repositionCancelButtonSideButtonLayout']();
  }),
  (Scene_Battle[_0x17b060(0x54a)]['repositionCancelButtonSideButtonLayout'] = function () {
    const _0x288e78 = _0x17b060;
    (this[_0x288e78(0x257)]['x'] = Graphics[_0x288e78(0x778)] + 0x4),
      this[_0x288e78(0x7a6)]() ? (this[_0x288e78(0x257)]['y'] = Graphics[_0x288e78(0x509)] - this[_0x288e78(0x3ec)]()) : (this[_0x288e78(0x257)]['y'] = 0x0);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Sprite_Button_initialize'] = Sprite_Button[_0x17b060(0x54a)]['initialize']),
  (Sprite_Button[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x432252) {
    const _0x226b58 = _0x17b060;
    VisuMZ['CoreEngine'][_0x226b58(0x168)]['call'](this, _0x432252), this[_0x226b58(0x1eb)]();
  }),
  (Sprite_Button[_0x17b060(0x54a)][_0x17b060(0x1eb)] = function () {
    const _0x45c166 = _0x17b060,
      _0x4ef540 = VisuMZ[_0x45c166(0x77a)][_0x45c166(0x382)]['UI'];
    this[_0x45c166(0x288)] = ![];
    switch (this[_0x45c166(0x7bd)]) {
      case _0x45c166(0x314):
        this[_0x45c166(0x288)] = !_0x4ef540[_0x45c166(0x555)];
        break;
      case 'pageup':
      case _0x45c166(0x7c5):
        this[_0x45c166(0x288)] = !_0x4ef540['pagedownShowButton'];
        break;
      case _0x45c166(0x195):
      case 'up':
      case _0x45c166(0x5b6):
      case _0x45c166(0x336):
      case 'ok':
        this[_0x45c166(0x288)] = !_0x4ef540[_0x45c166(0x5de)];
        break;
      case _0x45c166(0x155):
        this[_0x45c166(0x288)] = !_0x4ef540[_0x45c166(0x659)];
        break;
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x2da)] = Sprite_Button[_0x17b060(0x54a)]['updateOpacity']),
  (Sprite_Button['prototype'][_0x17b060(0x3b8)] = function () {
    const _0x2a15de = _0x17b060;
    SceneManager['areButtonsHidden']() || this[_0x2a15de(0x288)] ? this['hideButtonFromView']() : VisuMZ[_0x2a15de(0x77a)][_0x2a15de(0x2da)][_0x2a15de(0x64e)](this);
  }),
  (Sprite_Button[_0x17b060(0x54a)][_0x17b060(0x544)] = function () {
    const _0x45b71c = _0x17b060;
    (this[_0x45b71c(0x70d)] = ![]), (this['opacity'] = 0x0), (this['x'] = Graphics[_0x45b71c(0x321)] * 0xa), (this['y'] = Graphics[_0x45b71c(0x2c5)] * 0xa);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x35e)] = Sprite_Battler['prototype'][_0x17b060(0x4fc)]),
  (Sprite_Battler[_0x17b060(0x54a)][_0x17b060(0x4fc)] = function (_0xe57293, _0x4a17b4, _0x2fd31a) {
    const _0x36c7f3 = _0x17b060;
    (this[_0x36c7f3(0x6fe)] !== _0xe57293 || this[_0x36c7f3(0x14e)] !== _0x4a17b4) && (this['setMoveEasingType'](_0x36c7f3(0x6a8)), (this[_0x36c7f3(0x6cd)] = _0x2fd31a)),
      VisuMZ[_0x36c7f3(0x77a)][_0x36c7f3(0x35e)][_0x36c7f3(0x64e)](this, _0xe57293, _0x4a17b4, _0x2fd31a);
  }),
  (Sprite_Battler[_0x17b060(0x54a)][_0x17b060(0x7f8)] = function (_0x3a9741) {
    this['_moveEasingType'] = _0x3a9741;
  }),
  (Sprite_Battler[_0x17b060(0x54a)][_0x17b060(0x37f)] = function () {
    const _0x2e4193 = _0x17b060;
    if (this[_0x2e4193(0x21b)] <= 0x0) return;
    const _0x4a94b7 = this[_0x2e4193(0x21b)],
      _0x14c513 = this[_0x2e4193(0x6cd)],
      _0x4f1dc8 = this[_0x2e4193(0x8ae)];
    (this[_0x2e4193(0x239)] = this['applyEasing'](this[_0x2e4193(0x239)], this[_0x2e4193(0x6fe)], _0x4a94b7, _0x14c513, _0x4f1dc8)),
      (this[_0x2e4193(0x2e5)] = this[_0x2e4193(0x85e)](this[_0x2e4193(0x2e5)], this[_0x2e4193(0x14e)], _0x4a94b7, _0x14c513, _0x4f1dc8)),
      this[_0x2e4193(0x21b)]--;
    if (this[_0x2e4193(0x21b)] <= 0x0) this[_0x2e4193(0x60f)]();
  }),
  (Sprite_Battler[_0x17b060(0x54a)]['applyEasing'] = function (_0xcac1ca, _0x1a7857, _0x7ad6e5, _0x456dec, _0x4b129a) {
    const _0x5bad91 = _0x17b060,
      _0x1aeca8 = VisuMZ[_0x5bad91(0x30b)]((_0x456dec - _0x7ad6e5) / _0x456dec, _0x4b129a || _0x5bad91(0x6a8)),
      _0x49937f = VisuMZ['ApplyEasing']((_0x456dec - _0x7ad6e5 + 0x1) / _0x456dec, _0x4b129a || _0x5bad91(0x6a8)),
      _0x128e92 = (_0xcac1ca - _0x1a7857 * _0x1aeca8) / (0x1 - _0x1aeca8);
    return _0x128e92 + (_0x1a7857 - _0x128e92) * _0x49937f;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x455)] = Sprite_Actor[_0x17b060(0x54a)]['setActorHome']),
  (Sprite_Actor[_0x17b060(0x54a)]['setActorHome'] = function (_0x4e6725) {
    const _0x31dffe = _0x17b060;
    VisuMZ[_0x31dffe(0x77a)][_0x31dffe(0x382)]['UI']['RepositionActors'] ? this[_0x31dffe(0x407)](_0x4e6725) : VisuMZ[_0x31dffe(0x77a)][_0x31dffe(0x455)]['call'](this, _0x4e6725);
  }),
  (Sprite_Actor[_0x17b060(0x54a)][_0x17b060(0x407)] = function (_0x27717c) {
    const _0xe6977f = _0x17b060;
    let _0x5982ad = Math[_0xe6977f(0x3fe)](Graphics[_0xe6977f(0x321)] / 0x2 + 0xc0);
    (_0x5982ad -= Math['floor']((Graphics[_0xe6977f(0x321)] - Graphics[_0xe6977f(0x778)]) / 0x2)), (_0x5982ad += _0x27717c * 0x20);
    let _0x3ab84d = Graphics['height'] - 0xc8 - $gameParty[_0xe6977f(0x83a)]() * 0x30;
    (_0x3ab84d -= Math['floor']((Graphics[_0xe6977f(0x2c5)] - Graphics[_0xe6977f(0x509)]) / 0x2)), (_0x3ab84d += _0x27717c * 0x30), this[_0xe6977f(0x7ad)](_0x5982ad, _0x3ab84d);
  }),
  (Sprite_Actor[_0x17b060(0x54a)][_0x17b060(0x841)] = function () {
    const _0xa4a681 = _0x17b060;
    this[_0xa4a681(0x4fc)](0x4b0, 0x0, 0x78);
  }),
  (Sprite_Animation['prototype'][_0x17b060(0x11c)] = function (_0xd5ff56) {
    const _0x54f0d2 = _0x17b060;
    this[_0x54f0d2(0x832)] = _0xd5ff56;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x7e2)] = Sprite_Animation['prototype'][_0x17b060(0x881)]),
  (Sprite_Animation[_0x17b060(0x54a)]['processSoundTimings'] = function () {
    const _0x209c94 = _0x17b060;
    if (this['_muteSound']) return;
    VisuMZ[_0x209c94(0x77a)][_0x209c94(0x7e2)][_0x209c94(0x64e)](this);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Sprite_Animation_setViewport'] = Sprite_Animation[_0x17b060(0x54a)][_0x17b060(0x6dd)]),
  (Sprite_Animation[_0x17b060(0x54a)][_0x17b060(0x6dd)] = function (_0x3c8dad) {
    const _0x36120c = _0x17b060;
    this[_0x36120c(0x667)]() ? this[_0x36120c(0x5b9)](_0x3c8dad) : VisuMZ[_0x36120c(0x77a)][_0x36120c(0x75a)][_0x36120c(0x64e)](this, _0x3c8dad);
  }),
  (Sprite_Animation[_0x17b060(0x54a)][_0x17b060(0x667)] = function () {
    const _0x481944 = _0x17b060;
    if (!this['_animation']) return ![];
    const _0x4c0c7f = this[_0x481944(0x196)][_0x481944(0x142)] || '';
    if (_0x4c0c7f['match'](/<MIRROR OFFSET X>/i)) return !![];
    if (_0x4c0c7f[_0x481944(0x2ba)](/<NO MIRROR OFFSET X>/i)) return ![];
    return VisuMZ[_0x481944(0x77a)][_0x481944(0x382)][_0x481944(0x7ae)][_0x481944(0x209)];
  }),
  (Sprite_Animation[_0x17b060(0x54a)][_0x17b060(0x5b9)] = function (_0x5a4897) {
    const _0x4b9ed0 = _0x17b060,
      _0x3340fd = this[_0x4b9ed0(0x41d)],
      _0x1290b5 = this[_0x4b9ed0(0x41d)],
      _0x101f59 = this[_0x4b9ed0(0x196)]['offsetX'] * (this[_0x4b9ed0(0x114)] ? -0x1 : 0x1) - _0x3340fd / 0x2,
      _0x30a36e = this[_0x4b9ed0(0x196)][_0x4b9ed0(0x84a)] - _0x1290b5 / 0x2,
      _0x2d0d17 = this['targetPosition'](_0x5a4897);
    _0x5a4897['gl']['viewport'](_0x101f59 + _0x2d0d17['x'], _0x30a36e + _0x2d0d17['y'], _0x3340fd, _0x1290b5);
  }),
  (Sprite_Animation['prototype']['targetSpritePosition'] = function (_0x30b23f) {
    const _0x1c019f = _0x17b060;
    if (_0x30b23f['_mainSprite']) {
    }
    const _0x3f1c89 = this[_0x1c019f(0x196)]['name'];
    let _0x515cc9 = _0x30b23f[_0x1c019f(0x2c5)] * _0x30b23f[_0x1c019f(0x82a)]['y'],
      _0x434008 = 0x0,
      _0x11a131 = -_0x515cc9 / 0x2;
    if (_0x3f1c89['match'](/<(?:HEAD|HEADER|TOP)>/i)) _0x11a131 = -_0x515cc9;
    if (_0x3f1c89[_0x1c019f(0x2ba)](/<(?:FOOT|FOOTER|BOTTOM)>/i)) _0x11a131 = 0x0;
    if (this['_animation'][_0x1c019f(0xe8)]) _0x11a131 = 0x0;
    if (_0x3f1c89[_0x1c019f(0x2ba)](/<(?:LEFT)>/i)) _0x434008 = -_0x30b23f['width'] / 0x2;
    if (_0x3f1c89['match'](/<(?:RIGHT)>/i)) _0x434008 = _0x30b23f['width'] / 0x2;
    _0x3f1c89[_0x1c019f(0x2ba)](/<ANCHOR X:[ ](\d+\.?\d*)>/i) && (_0x434008 = Number(RegExp['$1']) * _0x30b23f[_0x1c019f(0x321)]);
    _0x3f1c89[_0x1c019f(0x2ba)](/<ANCHOR Y:[ ](\d+\.?\d*)>/i) && (_0x11a131 = (0x1 - Number(RegExp['$1'])) * -_0x515cc9);
    _0x3f1c89['match'](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i) && ((_0x434008 = Number(RegExp['$1']) * _0x30b23f[_0x1c019f(0x321)]), (_0x11a131 = (0x1 - Number(RegExp['$2'])) * -_0x515cc9));
    if (_0x3f1c89[_0x1c019f(0x2ba)](/<OFFSET X:[ ]([\+\-]\d+)>/i)) _0x434008 += Number(RegExp['$1']);
    if (_0x3f1c89[_0x1c019f(0x2ba)](/<OFFSET Y:[ ]([\+\-]\d+)>/i)) _0x11a131 += Number(RegExp['$1']);
    _0x3f1c89[_0x1c019f(0x2ba)](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i) && ((_0x434008 += Number(RegExp['$1'])), (_0x11a131 += Number(RegExp['$2'])));
    const _0x7d4820 = new Point(_0x434008, _0x11a131);
    return _0x30b23f[_0x1c019f(0x416)](), _0x30b23f[_0x1c019f(0x25c)][_0x1c019f(0x7f2)](_0x7d4820);
  }),
  (Sprite_AnimationMV[_0x17b060(0x54a)][_0x17b060(0x5ed)] = function () {
    const _0x2dbc56 = _0x17b060;
    (this[_0x2dbc56(0x334)] = VisuMZ[_0x2dbc56(0x77a)][_0x2dbc56(0x382)][_0x2dbc56(0x7ae)][_0x2dbc56(0x787)] ?? 0x4),
      this[_0x2dbc56(0x893)](),
      (this[_0x2dbc56(0x334)] = this[_0x2dbc56(0x334)][_0x2dbc56(0x42b)](0x1, 0xa));
  }),
  (Sprite_AnimationMV[_0x17b060(0x54a)]['setupCustomRateCoreEngine'] = function () {
    const _0x30c680 = _0x17b060;
    if (!this[_0x30c680(0x196)]);
    const _0x2d3b56 = this[_0x30c680(0x196)]['name'] || '';
    _0x2d3b56[_0x30c680(0x2ba)](/<RATE:[ ](\d+)>/i) && (this[_0x30c680(0x334)] = (Number(RegExp['$1']) || 0x1)[_0x30c680(0x42b)](0x1, 0xa));
  }),
  (Sprite_AnimationMV[_0x17b060(0x54a)][_0x17b060(0x11c)] = function (_0x578d42) {
    this['_muteSound'] = _0x578d42;
  }),
  (VisuMZ[_0x17b060(0x77a)]['Sprite_AnimationMV_processTimingData'] = Sprite_AnimationMV[_0x17b060(0x54a)][_0x17b060(0x6e9)]),
  (Sprite_AnimationMV[_0x17b060(0x54a)][_0x17b060(0x6e9)] = function (_0x5affee) {
    const _0x2cbb4c = _0x17b060;
    this[_0x2cbb4c(0x832)] && ((_0x5affee = JsonEx[_0x2cbb4c(0x83c)](_0x5affee)), _0x5affee['se'] && (_0x5affee['se'][_0x2cbb4c(0x14a)] = 0x0)),
      VisuMZ[_0x2cbb4c(0x77a)][_0x2cbb4c(0x490)][_0x2cbb4c(0x64e)](this, _0x5affee);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x7fa)] = Sprite_AnimationMV['prototype'][_0x17b060(0x3b3)]),
  (Sprite_AnimationMV[_0x17b060(0x54a)][_0x17b060(0x3b3)] = function () {
    const _0x1385eb = _0x17b060;
    VisuMZ[_0x1385eb(0x77a)][_0x1385eb(0x7fa)]['call'](this);
    if (this['_animation'][_0x1385eb(0x5b4)] === 0x3) {
      if (this['x'] === 0x0) this['x'] = Math['round'](Graphics[_0x1385eb(0x321)] / 0x2);
      if (this['y'] === 0x0) this['y'] = Math['round'](Graphics[_0x1385eb(0x2c5)] / 0x2);
    }
  }),
  (Sprite_Damage[_0x17b060(0x54a)][_0x17b060(0x606)] = function (_0x44d7a1) {
    const _0x526b23 = _0x17b060;
    let _0x1a9080 = Math[_0x526b23(0x6c1)](_0x44d7a1)[_0x526b23(0x548)]();
    this['useDigitGrouping']() && (_0x1a9080 = VisuMZ[_0x526b23(0x4bd)](_0x1a9080));
    const _0x56a27a = this[_0x526b23(0xf8)](),
      _0x306676 = Math[_0x526b23(0x221)](_0x56a27a * 0.75);
    for (let _0x30e4f2 = 0x0; _0x30e4f2 < _0x1a9080[_0x526b23(0x540)]; _0x30e4f2++) {
      const _0x3c2c0f = this[_0x526b23(0x32b)](_0x306676, _0x56a27a);
      _0x3c2c0f[_0x526b23(0x7d3)]['drawText'](_0x1a9080[_0x30e4f2], 0x0, 0x0, _0x306676, _0x56a27a, _0x526b23(0x27e)),
        (_0x3c2c0f['x'] = (_0x30e4f2 - (_0x1a9080[_0x526b23(0x540)] - 0x1) / 0x2) * _0x306676),
        (_0x3c2c0f['dy'] = -_0x30e4f2);
    }
  }),
  (Sprite_Damage['prototype']['useDigitGrouping'] = function () {
    const _0x1b113d = _0x17b060;
    return VisuMZ['CoreEngine'][_0x1b113d(0x382)][_0x1b113d(0x7ae)][_0x1b113d(0x75e)];
  }),
  (Sprite_Damage[_0x17b060(0x54a)][_0x17b060(0x768)] = function () {
    const _0xa0e910 = _0x17b060;
    return ColorManager[_0xa0e910(0x2dd)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x1b2)] = Sprite_Gauge['prototype'][_0x17b060(0x39f)]),
  (Sprite_Gauge['prototype'][_0x17b060(0x39f)] = function () {
    const _0x2d088e = _0x17b060;
    return VisuMZ[_0x2d088e(0x77a)]['Sprite_Gauge_gaugeRate'][_0x2d088e(0x64e)](this)['clamp'](0x0, 0x1);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Sprite_Gauge_currentValue'] = Sprite_Gauge[_0x17b060(0x54a)][_0x17b060(0x3cf)]),
  (Sprite_Gauge[_0x17b060(0x54a)][_0x17b060(0x3cf)] = function () {
    const _0x3d8d2a = _0x17b060;
    let _0x5866d4 = VisuMZ[_0x3d8d2a(0x77a)][_0x3d8d2a(0x393)][_0x3d8d2a(0x64e)](this);
    return _0x5866d4;
  }),
  (Sprite_Gauge[_0x17b060(0x54a)][_0x17b060(0x5fa)] = function () {
    const _0x36a051 = _0x17b060;
    let _0x30e50b = this[_0x36a051(0x3cf)]();
    this[_0x36a051(0x27c)]() && (_0x30e50b = VisuMZ['GroupDigits'](_0x30e50b));
    const _0x47c280 = this[_0x36a051(0x2a6)]() - 0x1,
      _0x355f37 = this[_0x36a051(0x255)] ? this[_0x36a051(0x255)]() : this[_0x36a051(0x788)]();
    this['setupValueFont'](), this[_0x36a051(0x7d3)][_0x36a051(0x1a9)](_0x30e50b, 0x0, 0x0, _0x47c280, _0x355f37, 'right');
  }),
  (Sprite_Gauge['prototype'][_0x17b060(0x450)] = function () {
    return 0x3;
  }),
  (Sprite_Gauge[_0x17b060(0x54a)][_0x17b060(0x27c)] = function () {
    const _0x2d14f9 = _0x17b060;
    return VisuMZ[_0x2d14f9(0x77a)][_0x2d14f9(0x382)][_0x2d14f9(0x7ae)][_0x2d14f9(0x419)];
  }),
  (Sprite_Gauge[_0x17b060(0x54a)][_0x17b060(0x768)] = function () {
    const _0x5b28b8 = _0x17b060;
    return ColorManager[_0x5b28b8(0x462)]();
  }),
  (Sprite_StateIcon[_0x17b060(0x390)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)]['UI'][_0x17b060(0x528)] ?? !![]),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x552)] = Sprite_StateIcon[_0x17b060(0x54a)]['loadBitmap']),
  (Sprite_StateIcon[_0x17b060(0x54a)][_0x17b060(0x80b)] = function () {
    const _0x1ebfac = _0x17b060;
    Sprite_StateIcon[_0x1ebfac(0x390)] ? this['loadBitmapCoreEngine']() : VisuMZ[_0x1ebfac(0x77a)]['Sprite_StateIcon_loadBitmap'][_0x1ebfac(0x64e)](this);
  }),
  (Sprite_StateIcon[_0x17b060(0x54a)][_0x17b060(0x600)] = function () {
    const _0xc16426 = _0x17b060;
    (this[_0xc16426(0x7d3)] = new Bitmap(ImageManager['iconWidth'], ImageManager[_0xc16426(0x275)])), (this[_0xc16426(0x3b2)] = ImageManager[_0xc16426(0x1ef)](_0xc16426(0x284)));
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x722)] = Sprite_StateIcon['prototype'][_0x17b060(0x15d)]),
  (Sprite_StateIcon[_0x17b060(0x54a)]['updateFrame'] = function () {
    const _0x3738b6 = _0x17b060;
    Sprite_StateIcon[_0x3738b6(0x390)] ? this[_0x3738b6(0x85a)]() : VisuMZ[_0x3738b6(0x77a)][_0x3738b6(0x722)][_0x3738b6(0x64e)](this);
  }),
  (Sprite_StateIcon[_0x17b060(0x54a)]['updateFrameCoreEngine'] = function () {
    const _0x2df468 = _0x17b060;
    if (this[_0x2df468(0x4fb)] === this[_0x2df468(0x18c)]) return;
    this[_0x2df468(0x4fb)] = this[_0x2df468(0x18c)];
    const _0x17bca0 = ImageManager[_0x2df468(0x2ab)],
      _0x2e60d7 = ImageManager['iconHeight'],
      _0x3b7359 = (this[_0x2df468(0x18c)] % 0x10) * _0x17bca0,
      _0x17589e = Math[_0x2df468(0x221)](this[_0x2df468(0x18c)] / 0x10) * _0x2e60d7,
      _0x467d2d = this[_0x2df468(0x3b2)],
      _0x2cf560 = this[_0x2df468(0x7d3)];
    _0x2cf560['clear'](), _0x2cf560[_0x2df468(0x3f8)](_0x467d2d, _0x3b7359, _0x17589e, _0x17bca0, _0x2e60d7, 0x0, 0x0, _0x2cf560['width'], _0x2cf560[_0x2df468(0x2c5)]);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x396)] = Sprite_Picture['prototype'][_0x17b060(0x80b)]),
  (Sprite_Picture[_0x17b060(0x54a)][_0x17b060(0x80b)] = function () {
    const _0x61a42f = _0x17b060;
    this[_0x61a42f(0x88d)] && this[_0x61a42f(0x88d)][_0x61a42f(0x2ba)](/VisuMZ CoreEngine PictureIcon (\d+)/i)
      ? this['loadIconBitmap'](Number(RegExp['$1']))
      : VisuMZ[_0x61a42f(0x77a)]['Sprite_Picture_loadBitmap'][_0x61a42f(0x64e)](this);
  }),
  (Sprite_Picture[_0x17b060(0x54a)]['loadIconBitmap'] = function (_0x5dbb0c) {
    const _0x432a2e = _0x17b060,
      _0x1b8d58 = ImageManager[_0x432a2e(0x2ab)],
      _0x45560d = ImageManager['iconHeight'],
      _0x1f1916 = this[_0x432a2e(0x88d)]['match'](/SMOOTH/i);
    this['bitmap'] = new Bitmap(_0x1b8d58, _0x45560d);
    const _0x2262e4 = ImageManager['loadSystem']('IconSet'),
      _0x3eae14 = (_0x5dbb0c % 0x10) * _0x1b8d58,
      _0x254064 = Math[_0x432a2e(0x221)](_0x5dbb0c / 0x10) * _0x45560d;
    (this[_0x432a2e(0x7d3)][_0x432a2e(0x425)] = _0x1f1916), this['bitmap'][_0x432a2e(0x3f8)](_0x2262e4, _0x3eae14, _0x254064, _0x1b8d58, _0x45560d, 0x0, 0x0, _0x1b8d58, _0x45560d);
  });
function Sprite_TitlePictureButton() {
  const _0x4f64e9 = _0x17b060;
  this[_0x4f64e9(0x3e0)](...arguments);
}
(Sprite_TitlePictureButton[_0x17b060(0x54a)] = Object['create'](Sprite_Clickable[_0x17b060(0x54a)])),
  (Sprite_TitlePictureButton[_0x17b060(0x54a)][_0x17b060(0x60c)] = Sprite_TitlePictureButton),
  (Sprite_TitlePictureButton['prototype']['initialize'] = function (_0x1be69e) {
    const _0x16c9f8 = _0x17b060;
    Sprite_Clickable['prototype'][_0x16c9f8(0x3e0)][_0x16c9f8(0x64e)](this), (this[_0x16c9f8(0xf3)] = _0x1be69e), (this[_0x16c9f8(0x132)] = null), this['setup']();
  }),
  (Sprite_TitlePictureButton[_0x17b060(0x54a)][_0x17b060(0x67d)] = function () {
    const _0x490bee = _0x17b060;
    (this['x'] = Graphics[_0x490bee(0x321)]), (this['y'] = Graphics['height']), (this[_0x490bee(0x70d)] = ![]), this['setupButtonImage']();
  }),
  (Sprite_TitlePictureButton['prototype'][_0x17b060(0x25d)] = function () {
    const _0x2c4a5d = _0x17b060;
    (this[_0x2c4a5d(0x7d3)] = ImageManager['loadPicture'](this['_data'][_0x2c4a5d(0x441)])), this['bitmap'][_0x2c4a5d(0x892)](this[_0x2c4a5d(0x1de)]['bind'](this));
  }),
  (Sprite_TitlePictureButton['prototype'][_0x17b060(0x1de)] = function () {
    const _0x2f638d = _0x17b060;
    this[_0x2f638d(0xf3)]['OnLoadJS'][_0x2f638d(0x64e)](this), this[_0x2f638d(0xf3)][_0x2f638d(0x55b)][_0x2f638d(0x64e)](this), this[_0x2f638d(0x6f6)](this['_data'][_0x2f638d(0x177)]['bind'](this));
  }),
  (Sprite_TitlePictureButton[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0x1e999d = _0x17b060;
    Sprite_Clickable[_0x1e999d(0x54a)][_0x1e999d(0x319)][_0x1e999d(0x64e)](this), this['updateOpacity'](), this[_0x1e999d(0x23c)]();
  }),
  (Sprite_TitlePictureButton['prototype'][_0x17b060(0x500)] = function () {
    const _0x319c9c = _0x17b060;
    return VisuMZ[_0x319c9c(0x77a)][_0x319c9c(0x382)][_0x319c9c(0x5b0)][_0x319c9c(0x4ad)][_0x319c9c(0x666)];
  }),
  (Sprite_TitlePictureButton[_0x17b060(0x54a)][_0x17b060(0x3b8)] = function () {
    const _0x46f4f7 = _0x17b060;
    this[_0x46f4f7(0x400)] || this[_0x46f4f7(0x77e)]
      ? (this['opacity'] = 0xff)
      : ((this['opacity'] += this[_0x46f4f7(0x70d)] ? this['fadeSpeed']() : -0x1 * this[_0x46f4f7(0x500)]()), (this[_0x46f4f7(0x3e8)] = Math[_0x46f4f7(0x701)](0xc0, this[_0x46f4f7(0x3e8)])));
  }),
  (Sprite_TitlePictureButton['prototype'][_0x17b060(0x6f6)] = function (_0x1517ab) {
    const _0x3a224c = _0x17b060;
    this[_0x3a224c(0x132)] = _0x1517ab;
  }),
  (Sprite_TitlePictureButton['prototype']['onClick'] = function () {
    const _0x48b3c4 = _0x17b060;
    this[_0x48b3c4(0x132)] && this['_clickHandler']();
  });
function Sprite_ExtendedTile() {
  const _0x4b9211 = _0x17b060;
  this[_0x4b9211(0x3e0)](...arguments);
}
(Sprite_ExtendedTile[_0x17b060(0x54a)] = Object[_0x17b060(0x3f6)](Sprite[_0x17b060(0x54a)])),
  (Sprite_ExtendedTile[_0x17b060(0x54a)][_0x17b060(0x60c)] = Sprite_ExtendedTile),
  (Sprite_ExtendedTile[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x408bad, _0x3962ce, _0x3d4896, _0x30d030) {
    const _0x498d0d = _0x17b060;
    (this[_0x498d0d(0x7fb)] = Game_CharacterBase[_0x498d0d(0x2d9)] || -0x6),
      (this[_0x498d0d(0x761)] = _0x408bad),
      (this['_mapY'] = _0x3962ce),
      (this['_tile'] = _0x3d4896),
      (this[_0x498d0d(0x869)] = _0x30d030),
      Sprite[_0x498d0d(0x54a)][_0x498d0d(0x3e0)][_0x498d0d(0x64e)](this),
      this[_0x498d0d(0x3d0)](),
      this['loadTileBitmap'](),
      this[_0x498d0d(0x712)](),
      this[_0x498d0d(0x319)]();
  }),
  (Sprite_ExtendedTile[_0x17b060(0x54a)][_0x17b060(0x3d0)] = function () {
    const _0x5866de = _0x17b060;
    (this[_0x5866de(0x521)] = new Sprite()),
      (this[_0x5866de(0x521)][_0x5866de(0x435)]['x'] = 0.5),
      (this[_0x5866de(0x521)][_0x5866de(0x435)]['y'] = 0x1),
      (this[_0x5866de(0x521)]['y'] = -this[_0x5866de(0x7fb)] + 0x1),
      this[_0x5866de(0x781)](this[_0x5866de(0x521)]);
  }),
  (Sprite_ExtendedTile['prototype']['loadTileBitmap'] = function () {
    const _0x5ca703 = _0x17b060,
      _0x5f2641 = $gameMap[_0x5ca703(0x2ac)](),
      _0x530b2b = 0x5 + Math[_0x5ca703(0x221)](this[_0x5ca703(0x271)] / 0x100);
    this['_tileSprite']['bitmap'] = ImageManager[_0x5ca703(0x31c)](_0x5f2641[_0x5ca703(0x6ef)][_0x530b2b]);
  }),
  (Sprite_ExtendedTile[_0x17b060(0x54a)][_0x17b060(0x712)] = function () {
    const _0xec58e2 = _0x17b060,
      _0x375776 = this[_0xec58e2(0x271)],
      _0x5bfd8c = $gameMap[_0xec58e2(0x1f1)](),
      _0xcf8ef6 = $gameMap[_0xec58e2(0x251)](),
      _0x35bfbb = ((Math[_0xec58e2(0x221)](_0x375776 / 0x80) % 0x2) * 0x8 + (_0x375776 % 0x8)) * _0x5bfd8c,
      _0x1d60ed = (Math['floor']((_0x375776 % 0x100) / 0x8) % 0x10) * _0xcf8ef6,
      _0x248d5b = this[_0xec58e2(0x869)] * _0xcf8ef6;
    this['_tileSprite'][_0xec58e2(0x674)](_0x35bfbb, _0x1d60ed - _0x248d5b, _0x5bfd8c, _0xcf8ef6 + _0x248d5b);
  }),
  (Sprite_ExtendedTile['prototype'][_0x17b060(0x319)] = function () {
    const _0x434caa = _0x17b060;
    Sprite[_0x434caa(0x54a)]['update'][_0x434caa(0x64e)](this), this[_0x434caa(0x3b3)]();
  }),
  (Sprite_ExtendedTile['prototype'][_0x17b060(0x3b3)] = function () {
    const _0x1c9caf = _0x17b060,
      _0x1238ca = $gameMap[_0x1c9caf(0x1f1)](),
      _0x641365 = $gameMap[_0x1c9caf(0x251)](),
      _0x3b174f = this['_mapX'],
      _0x148e2a = this['_mapY'];
    (this['x'] = Math[_0x1c9caf(0x221)](($gameMap[_0x1c9caf(0x837)](_0x3b174f) + 0.5) * _0x1238ca)),
      (this['y'] = Math[_0x1c9caf(0x221)](($gameMap[_0x1c9caf(0x395)](_0x148e2a) + 0x1) * _0x641365) + this[_0x1c9caf(0x7fb)] - 0x1);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x73d)] = Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x3e0)]),
  (Spriteset_Base['prototype'][_0x17b060(0x3e0)] = function () {
    const _0x1ff7da = _0x17b060;
    VisuMZ[_0x1ff7da(0x77a)][_0x1ff7da(0x73d)][_0x1ff7da(0x64e)](this), this[_0x1ff7da(0x33c)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x33c)] = function () {
    const _0x741c93 = _0x17b060;
    (this[_0x741c93(0x1dd)] = []), (this[_0x741c93(0x574)] = []), (this[_0x741c93(0x7db)] = this['scale']['x']), (this[_0x741c93(0x82c)] = this['scale']['y']);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Spriteset_Base_destroy'] = Spriteset_Base[_0x17b060(0x54a)]['destroy']),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x2a5)] = function (_0x493567) {
    const _0x1f09f5 = _0x17b060;
    this[_0x1f09f5(0x62f)](), this[_0x1f09f5(0x17e)](), VisuMZ[_0x1f09f5(0x77a)][_0x1f09f5(0x5ac)][_0x1f09f5(0x64e)](this, _0x493567);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Spriteset_Base_update'] = Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x319)]),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0x42daf4 = _0x17b060;
    VisuMZ['CoreEngine']['Spriteset_Base_update'][_0x42daf4(0x64e)](this), this[_0x42daf4(0x423)](), this[_0x42daf4(0x5f5)](), this[_0x42daf4(0x2bb)](), this[_0x42daf4(0x5a5)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x423)] = function () {}),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x5f5)] = function () {
    const _0x34961c = _0x17b060;
    if (!VisuMZ[_0x34961c(0x77a)][_0x34961c(0x382)][_0x34961c(0x7ae)]['AntiZoomPictures']) return;
    if (this[_0x34961c(0x7db)] === this['scale']['x'] && this[_0x34961c(0x82c)] === this['scale']['y']) return;
    this['adjustPictureAntiZoom'](), (this['_cacheScaleX'] = this[_0x34961c(0x82a)]['x']), (this[_0x34961c(0x82c)] = this[_0x34961c(0x82a)]['y']);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['adjustPictureAntiZoom'] = function () {
    const _0x3c06f9 = _0x17b060;
    if (SceneManager[_0x3c06f9(0x482)]() && Spriteset_Map[_0x3c06f9(0x5d0)]) return;
    else {
      if (SceneManager[_0x3c06f9(0x51e)]() && Spriteset_Battle['DETACH_PICTURE_CONTAINER']) return;
    }
    this['scale']['x'] !== 0x0 && ((this[_0x3c06f9(0x454)][_0x3c06f9(0x82a)]['x'] = 0x1 / this[_0x3c06f9(0x82a)]['x']), (this['_pictureContainer']['x'] = -(this['x'] / this[_0x3c06f9(0x82a)]['x']))),
      this[_0x3c06f9(0x82a)]['y'] !== 0x0 &&
        ((this[_0x3c06f9(0x454)][_0x3c06f9(0x82a)]['y'] = 0x1 / this[_0x3c06f9(0x82a)]['y']), (this['_pictureContainer']['y'] = -(this['y'] / this['scale']['y'])));
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x119)] = Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x3b3)]),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x3b3)] = function () {
    const _0x10c37c = _0x17b060;
    VisuMZ[_0x10c37c(0x77a)][_0x10c37c(0x119)][_0x10c37c(0x64e)](this), this[_0x10c37c(0x785)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x785)] = function () {
    const _0x515bfb = _0x17b060;
    if (!$gameScreen) return;
    if ($gameScreen['_shakeDuration'] <= 0x0) return;
    this['x'] -= Math[_0x515bfb(0x3fe)]($gameScreen[_0x515bfb(0x67b)]());
    const _0xbdc378 = $gameScreen[_0x515bfb(0x811)]();
    switch ($gameScreen[_0x515bfb(0x811)]()) {
      case _0x515bfb(0x8bd):
        this['updatePositionCoreEngineShakeOriginal']();
        break;
      case _0x515bfb(0x276):
        this[_0x515bfb(0x87d)]();
        break;
      case 'vertical':
        this[_0x515bfb(0xf5)]();
        break;
      default:
        this[_0x515bfb(0x4c5)]();
        break;
    }
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['updatePositionCoreEngineShakeOriginal'] = function () {
    const _0x2a919d = _0x17b060,
      _0x4d245a = VisuMZ['CoreEngine']['Settings'][_0x2a919d(0x783)];
    if (_0x4d245a && _0x4d245a['originalJS']) return _0x4d245a[_0x2a919d(0x7f6)][_0x2a919d(0x64e)](this);
    this['x'] += Math[_0x2a919d(0x3fe)]($gameScreen[_0x2a919d(0x67b)]());
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['updatePositionCoreEngineShakeRand'] = function () {
    const _0x452eca = _0x17b060,
      _0x469fea = VisuMZ[_0x452eca(0x77a)][_0x452eca(0x382)]['ScreenShake'];
    if (_0x469fea && _0x469fea[_0x452eca(0x2ff)]) return _0x469fea[_0x452eca(0x2ff)]['call'](this);
    const _0x4de2ac = $gameScreen[_0x452eca(0x279)] * 0.75,
      _0x106cb5 = $gameScreen[_0x452eca(0x2b7)] * 0.6,
      _0xaaaf36 = $gameScreen[_0x452eca(0x421)];
    (this['x'] += Math[_0x452eca(0x3fe)](Math[_0x452eca(0x849)](_0x4de2ac) - Math[_0x452eca(0x849)](_0x106cb5)) * (Math[_0x452eca(0x701)](_0xaaaf36, 0x1e) * 0.5)),
      (this['y'] += Math[_0x452eca(0x3fe)](Math[_0x452eca(0x849)](_0x4de2ac) - Math[_0x452eca(0x849)](_0x106cb5)) * (Math['min'](_0xaaaf36, 0x1e) * 0.5));
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x87d)] = function () {
    const _0x9d335a = _0x17b060,
      _0x13d54c = VisuMZ['CoreEngine'][_0x9d335a(0x382)][_0x9d335a(0x783)];
    if (_0x13d54c && _0x13d54c[_0x9d335a(0x166)]) return _0x13d54c['horzJS'][_0x9d335a(0x64e)](this);
    const _0x2ce884 = $gameScreen[_0x9d335a(0x279)] * 0.75,
      _0x576fdd = $gameScreen['_shakeSpeed'] * 0.6,
      _0x218857 = $gameScreen[_0x9d335a(0x421)];
    this['x'] += Math['round'](Math[_0x9d335a(0x849)](_0x2ce884) - Math[_0x9d335a(0x849)](_0x576fdd)) * (Math[_0x9d335a(0x701)](_0x218857, 0x1e) * 0.5);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['updatePositionCoreEngineShakeVert'] = function () {
    const _0x5746ec = _0x17b060,
      _0x3bf59e = VisuMZ[_0x5746ec(0x77a)][_0x5746ec(0x382)][_0x5746ec(0x783)];
    if (_0x3bf59e && _0x3bf59e[_0x5746ec(0x30f)]) return _0x3bf59e['vertJS'][_0x5746ec(0x64e)](this);
    const _0x2287f5 = $gameScreen['_shakePower'] * 0.75,
      _0x44221f = $gameScreen['_shakeSpeed'] * 0.6,
      _0x2c3d03 = $gameScreen[_0x5746ec(0x421)];
    this['y'] += Math[_0x5746ec(0x3fe)](Math[_0x5746ec(0x849)](_0x2287f5) - Math[_0x5746ec(0x849)](_0x44221f)) * (Math[_0x5746ec(0x701)](_0x2c3d03, 0x1e) * 0.5);
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x2bb)] = function () {
    const _0x39b681 = _0x17b060;
    for (const _0x273940 of this[_0x39b681(0x1dd)]) {
      !_0x273940[_0x39b681(0x894)]() && this['removeFauxAnimation'](_0x273940);
    }
    this[_0x39b681(0x6a6)]();
  }),
  (Spriteset_Base['prototype'][_0x17b060(0x6a6)] = function () {
    const _0x1a25d1 = _0x17b060;
    for (;;) {
      const _0x1979e5 = $gameTemp[_0x1a25d1(0x5c6)]();
      if (_0x1979e5) this[_0x1a25d1(0x1ee)](_0x1979e5);
      else break;
    }
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x1ee)] = function (_0x5d7766) {
    const _0x31824b = _0x17b060,
      _0x3cae58 = $dataAnimations[_0x5d7766[_0x31824b(0x650)]],
      _0x3694f0 = _0x5d7766[_0x31824b(0x53b)],
      _0x27c412 = _0x5d7766[_0x31824b(0x708)],
      _0xc957a = _0x5d7766[_0x31824b(0x809)];
    let _0x7a5806 = this[_0x31824b(0x59a)]();
    const _0x3bbaeb = this[_0x31824b(0x44e)]();
    if (this['isAnimationForEach'](_0x3cae58))
      for (const _0x74d3f3 of _0x3694f0) {
        this[_0x31824b(0x50f)]([_0x74d3f3], _0x3cae58, _0x27c412, _0x7a5806, _0xc957a), (_0x7a5806 += _0x3bbaeb);
      }
    else this[_0x31824b(0x50f)](_0x3694f0, _0x3cae58, _0x27c412, _0x7a5806, _0xc957a);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['createAnimationSprite'] = function (_0x5e2be0, _0x420454, _0x491355, _0x24fd50) {
    const _0x5e8da6 = _0x17b060,
      _0x1ad0bf = this[_0x5e8da6(0x4b2)](_0x420454),
      _0x123765 = new (_0x1ad0bf ? Sprite_AnimationMV : Sprite_Animation)(),
      _0x2898c7 = this[_0x5e8da6(0x4fa)](_0x5e2be0),
      _0x5114fa = this['animationBaseDelay'](),
      _0x254321 = _0x24fd50 > _0x5114fa ? this[_0x5e8da6(0x245)]() : null;
    this['animationShouldMirror'](_0x5e2be0[0x0]) && (_0x491355 = !_0x491355),
      (_0x123765[_0x5e8da6(0x1f6)] = _0x5e2be0),
      _0x123765[_0x5e8da6(0x67d)](_0x2898c7, _0x420454, _0x491355, _0x24fd50, _0x254321),
      this[_0x5e8da6(0x1bf)](_0x123765),
      this[_0x5e8da6(0x821)][_0x5e8da6(0x6f2)](_0x123765);
  }),
  (Spriteset_Base['prototype'][_0x17b060(0x50f)] = function (_0x50c3d4, _0x58cc05, _0x5436b6, _0x1793ab, _0x4116aa) {
    const _0x23b950 = _0x17b060,
      _0x3dc258 = this[_0x23b950(0x4b2)](_0x58cc05),
      _0x43ec3c = new (_0x3dc258 ? Sprite_AnimationMV : Sprite_Animation)(),
      _0x52caac = this[_0x23b950(0x4fa)](_0x50c3d4);
    this[_0x23b950(0x8a5)](_0x50c3d4[0x0]) && (_0x5436b6 = !_0x5436b6);
    (_0x43ec3c['targetObjects'] = _0x50c3d4), _0x43ec3c[_0x23b950(0x67d)](_0x52caac, _0x58cc05, _0x5436b6, _0x1793ab), _0x43ec3c[_0x23b950(0x11c)](_0x4116aa), this[_0x23b950(0x1bf)](_0x43ec3c);
    if (this[_0x23b950(0x821)]) this[_0x23b950(0x821)][_0x23b950(0x19f)](_0x43ec3c);
    this['_fauxAnimationSprites'][_0x23b950(0x6f2)](_0x43ec3c);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['addAnimationSpriteToContainer'] = function (_0x73e2a3) {
    const _0x8def52 = _0x17b060;
    this[_0x8def52(0x296)][_0x8def52(0x781)](_0x73e2a3);
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x613)] = function (_0x5daed4) {
    const _0x1b429f = _0x17b060;
    this[_0x1b429f(0x821)][_0x1b429f(0x19f)](_0x5daed4), this[_0x1b429f(0x83f)](_0x5daed4);
    for (const _0x428047 of _0x5daed4[_0x1b429f(0x1f6)]) {
      _0x428047[_0x1b429f(0x718)] && _0x428047[_0x1b429f(0x718)]();
    }
    _0x5daed4[_0x1b429f(0x2a5)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x54c)] = function (_0x3571be) {
    const _0x51a176 = _0x17b060;
    this['_fauxAnimationSprites']['remove'](_0x3571be), this['removeAnimationFromContainer'](_0x3571be);
    for (const _0x2b4e99 of _0x3571be[_0x51a176(0x1f6)]) {
      _0x2b4e99[_0x51a176(0x718)] && _0x2b4e99['endAnimation']();
    }
    _0x3571be[_0x51a176(0x2a5)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x83f)] = function (_0x5a1d93) {
    const _0x47ced4 = _0x17b060;
    this['_effectsContainer'][_0x47ced4(0x359)](_0x5a1d93);
  }),
  (Spriteset_Base['prototype']['removeAllFauxAnimations'] = function () {
    const _0x15b565 = _0x17b060;
    for (const _0x4ff37a of this[_0x15b565(0x1dd)]) {
      this[_0x15b565(0x54c)](_0x4ff37a);
    }
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x6db)] = function () {
    const _0x2d3fb9 = _0x17b060;
    return this[_0x2d3fb9(0x1dd)][_0x2d3fb9(0x540)] > 0x0;
  }),
  (Spriteset_Base['prototype'][_0x17b060(0x5a5)] = function () {
    const _0x3afa98 = _0x17b060;
    for (const _0x1def45 of this[_0x3afa98(0x574)]) {
      !_0x1def45['isPlaying']() && this[_0x3afa98(0x4d2)](_0x1def45);
    }
    this[_0x3afa98(0x13a)]();
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x13a)] = function () {
    const _0x42d0b9 = _0x17b060;
    for (;;) {
      const _0x26b8ea = $gameTemp[_0x42d0b9(0x4e7)]();
      if (_0x26b8ea) this[_0x42d0b9(0x29c)](_0x26b8ea);
      else break;
    }
  }),
  (Spriteset_Base['prototype'][_0x17b060(0x29c)] = function (_0x6b74) {
    const _0x267361 = _0x17b060,
      _0x1c8b41 = $dataAnimations[_0x6b74[_0x267361(0x650)]],
      _0x354b0c = this[_0x267361(0x175)](_0x6b74),
      _0x2a012f = _0x6b74[_0x267361(0x708)],
      _0x5b60b8 = _0x6b74[_0x267361(0x809)];
    let _0x28f07a = this[_0x267361(0x59a)]();
    const _0x49f9f9 = this[_0x267361(0x44e)]();
    if (this['isAnimationForEach'](_0x1c8b41))
      for (const _0x3a9c6f of _0x354b0c) {
        this[_0x267361(0x515)]([_0x3a9c6f], _0x1c8b41, _0x2a012f, _0x28f07a, _0x5b60b8), (_0x28f07a += _0x49f9f9);
      }
    else this[_0x267361(0x515)](_0x354b0c, _0x1c8b41, _0x2a012f, _0x28f07a, _0x5b60b8);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['createPointAnimationTargets'] = function (_0x412e33) {
    const _0x4140a6 = _0x17b060,
      _0x39951d = new Sprite_Clickable(),
      _0xc9f3ff = this[_0x4140a6(0x45c)]();
    (_0x39951d['x'] = _0x412e33['x'] - _0xc9f3ff['x']), (_0x39951d['y'] = _0x412e33['y'] - _0xc9f3ff['y']), (_0x39951d['z'] = 0x64);
    const _0x5e7a63 = this[_0x4140a6(0x45c)]();
    return _0x5e7a63['addChild'](_0x39951d), [_0x39951d];
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x45c)] = function () {
    return this;
  }),
  (Spriteset_Map[_0x17b060(0x54a)][_0x17b060(0x45c)] = function () {
    return this['_tilemap'] || this;
  }),
  (Spriteset_Battle[_0x17b060(0x54a)][_0x17b060(0x45c)] = function () {
    const _0x36c865 = _0x17b060;
    return this[_0x36c865(0x7bb)] || this;
  }),
  (Spriteset_Base['prototype']['createPointAnimationSprite'] = function (_0x50df75, _0x1aa2f3, _0x1829aa, _0x281142, _0x2d2dcc) {
    const _0xfa7510 = _0x17b060,
      _0x26dcbb = this[_0xfa7510(0x4b2)](_0x1aa2f3),
      _0x515313 = new (_0x26dcbb ? Sprite_AnimationMV : Sprite_Animation)();
    (_0x515313[_0xfa7510(0x1f6)] = _0x50df75),
      _0x515313[_0xfa7510(0x67d)](_0x50df75, _0x1aa2f3, _0x1829aa, _0x281142),
      _0x515313['setMute'](_0x2d2dcc),
      this[_0xfa7510(0x1bf)](_0x515313),
      this['_pointAnimationSprites'][_0xfa7510(0x6f2)](_0x515313);
  }),
  (Spriteset_Base[_0x17b060(0x54a)]['removePointAnimation'] = function (_0x53aac7) {
    const _0x340ea6 = _0x17b060;
    this['_pointAnimationSprites']['remove'](_0x53aac7), this['_effectsContainer'][_0x340ea6(0x359)](_0x53aac7);
    for (const _0x27ef4a of _0x53aac7[_0x340ea6(0x1f6)]) {
      _0x27ef4a[_0x340ea6(0x718)] && _0x27ef4a[_0x340ea6(0x718)]();
      const _0x3ce828 = this['getPointAnimationLayer']();
      if (_0x3ce828) _0x3ce828[_0x340ea6(0x359)](_0x27ef4a);
    }
    _0x53aac7[_0x340ea6(0x2a5)]();
  }),
  (Spriteset_Base['prototype'][_0x17b060(0x17e)] = function () {
    const _0x508dfc = _0x17b060;
    for (const _0x191396 of this[_0x508dfc(0x574)]) {
      this[_0x508dfc(0x4d2)](_0x191396);
    }
  }),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x48c)] = function () {
    const _0x56f433 = _0x17b060;
    return this[_0x56f433(0x574)][_0x56f433(0x540)] > 0x0;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x269)] = Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x109)]),
  (Spriteset_Base[_0x17b060(0x54a)][_0x17b060(0x109)] = function () {
    const _0xe10629 = _0x17b060;
    return VisuMZ[_0xe10629(0x77a)]['Spriteset_Base_isAnimationPlaying']['call'](this) || this[_0xe10629(0x48c)]();
  }),
  (Spriteset_Map[_0x17b060(0x5d0)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)]['QoL']['DetachMapPictureContainer'] || ![]),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Map_createSpriteset_detach'] = Scene_Map[_0x17b060(0x54a)]['createSpriteset']),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x6d0)] = function () {
    const _0x9bd2bb = _0x17b060;
    VisuMZ[_0x9bd2bb(0x77a)][_0x9bd2bb(0x749)]['call'](this);
    if (!Spriteset_Map['DETACH_PICTURE_CONTAINER']) return;
    const _0x3c792c = this[_0x9bd2bb(0x10b)];
    if (!_0x3c792c) return;
    this[_0x9bd2bb(0x454)] = _0x3c792c[_0x9bd2bb(0x454)];
    if (!this['_pictureContainer']) return;
    this['addChild'](this['_pictureContainer']);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Spriteset_Map_createTilemap'] = Spriteset_Map[_0x17b060(0x54a)][_0x17b060(0x6b4)]),
  (Spriteset_Map[_0x17b060(0x54a)]['createTilemap'] = function () {
    const _0x4e0aea = _0x17b060;
    VisuMZ['CoreEngine'][_0x4e0aea(0x661)][_0x4e0aea(0x64e)](this), this['createTileExtendSprites']();
  }),
  (Spriteset_Map[_0x17b060(0x54a)][_0x17b060(0x2a4)] = function () {
    const _0x51ee4a = _0x17b060,
      _0x4ddf0d = $gameMap[_0x51ee4a(0x2ac)]();
    if (!_0x4ddf0d) return;
    const _0x12bd7d = $gameMap[_0x51ee4a(0x69d)]();
    if (Object[_0x51ee4a(0x159)](_0x12bd7d)[_0x51ee4a(0x540)] <= 0x0) return;
    const _0x1862c5 = $gameMap['tilesetFlags']();
    this[_0x51ee4a(0x507)] = this[_0x51ee4a(0x507)] || [];
    for (let _0x5c43c8 = 0x0; _0x5c43c8 < $gameMap[_0x51ee4a(0x2c5)](); _0x5c43c8++) {
      for (let _0x4f80e5 = 0x0; _0x4f80e5 < $gameMap[_0x51ee4a(0x321)](); _0x4f80e5++) {
        for (const _0x4dd52c of $gameMap['layeredTiles'](_0x4f80e5, _0x5c43c8)) {
          const _0x22ad32 = _0x1862c5[_0x4dd52c] >> 0xc,
            _0x57403c = _0x12bd7d[_0x22ad32] || 0x0;
          if (_0x57403c <= 0x0) continue;
          this[_0x51ee4a(0x87c)](_0x4f80e5, _0x5c43c8, _0x4dd52c, _0x57403c);
        }
      }
    }
  }),
  (Spriteset_Map[_0x17b060(0x54a)][_0x17b060(0x161)] = function () {
    const _0x38fea6 = _0x17b060;
    this[_0x38fea6(0x507)] = this[_0x38fea6(0x507)] || [];
    for (const _0x24cb17 of this[_0x38fea6(0x507)]) {
      this['_tilemap'][_0x38fea6(0x359)](_0x24cb17);
    }
    this[_0x38fea6(0x507)] = [];
  }),
  (Spriteset_Map[_0x17b060(0x54a)][_0x17b060(0x87c)] = function (_0x52d19d, _0x4dec34, _0x3f8463, _0x3591c2) {
    const _0xa6901f = _0x17b060,
      _0x1541c7 = new Sprite_ExtendedTile(_0x52d19d, _0x4dec34, _0x3f8463, _0x3591c2),
      _0x10413a = $gameMap[_0xa6901f(0x1ec)]();
    _0x10413a[_0x3f8463] & 0x10 ? (_0x1541c7['z'] = 0x4) : (_0x1541c7['z'] = 0x3), this[_0xa6901f(0x55a)][_0xa6901f(0x781)](_0x1541c7), this[_0xa6901f(0x507)][_0xa6901f(0x6f2)](_0x1541c7);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x18e)] = Tilemap['prototype'][_0x17b060(0x7a9)]),
  (Tilemap[_0x17b060(0x54a)][_0x17b060(0x7a9)] = function (_0x35d0b2, _0x49ccdb, _0x5f1570) {
    const _0x5232c8 = _0x17b060;
    if ($gameMap[_0x5232c8(0x442)](_0x35d0b2)) return;
    VisuMZ[_0x5232c8(0x77a)][_0x5232c8(0x18e)][_0x5232c8(0x64e)](this, _0x35d0b2, _0x49ccdb, _0x5f1570);
  }),
  (Spriteset_Battle[_0x17b060(0x5d0)] = VisuMZ[_0x17b060(0x77a)]['Settings'][_0x17b060(0x7ae)][_0x17b060(0x42a)] || ![]),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Battle_createSpriteset_detach'] = Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x6d0)]),
  (Scene_Battle[_0x17b060(0x54a)]['createSpriteset'] = function () {
    const _0x43b27a = _0x17b060;
    VisuMZ['CoreEngine']['Scene_Battle_createSpriteset_detach'][_0x43b27a(0x64e)](this);
    if (!Spriteset_Battle['DETACH_PICTURE_CONTAINER']) return;
    const _0x4b75da = this[_0x43b27a(0x10b)];
    if (!_0x4b75da) return;
    this[_0x43b27a(0x454)] = _0x4b75da[_0x43b27a(0x454)];
    if (!this['_pictureContainer']) return;
    this[_0x43b27a(0x781)](this['_pictureContainer']);
  }),
  (Spriteset_Battle[_0x17b060(0x54a)]['createBackground'] = function () {
    const _0x122d75 = _0x17b060;
    (this[_0x122d75(0x194)] = new PIXI[_0x122d75(0x6a3)][_0x122d75(0x60e)]((clamp = !![]))),
      (this[_0x122d75(0x729)] = new Sprite()),
      (this[_0x122d75(0x729)]['bitmap'] = SceneManager[_0x122d75(0xdf)]()),
      (this['_backgroundSprite']['filters'] = [this[_0x122d75(0x194)]]),
      this[_0x122d75(0x1e4)][_0x122d75(0x781)](this[_0x122d75(0x729)]);
  }),
  (VisuMZ['CoreEngine']['Spriteset_Battle_createEnemies'] = Spriteset_Battle[_0x17b060(0x54a)][_0x17b060(0x691)]),
  (Spriteset_Battle[_0x17b060(0x54a)][_0x17b060(0x691)] = function () {
    const _0x1e35ac = _0x17b060;
    this[_0x1e35ac(0x216)]() && this[_0x1e35ac(0x7f7)](), VisuMZ[_0x1e35ac(0x77a)]['Spriteset_Battle_createEnemies']['call'](this);
  }),
  (Spriteset_Battle[_0x17b060(0x54a)][_0x17b060(0x216)] = function () {
    const _0x3f948b = _0x17b060,
      _0x4f0184 = VisuMZ[_0x3f948b(0x77a)][_0x3f948b(0x382)]['ScreenResolution'];
    if (!_0x4f0184) return ![];
    if (Utils[_0x3f948b(0x232)] >= '1.3.0' && !_0x4f0184['RepositionEnemies130']) return ![];
    return _0x4f0184[_0x3f948b(0x5b5)];
  }),
  (Spriteset_Battle[_0x17b060(0x54a)][_0x17b060(0x7f7)] = function () {
    const _0x332c9d = _0x17b060;
    for (member of $gameTroop[_0x332c9d(0x278)]()) {
      member[_0x332c9d(0x2a0)]();
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x2a8)] = Window_Base[_0x17b060(0x54a)][_0x17b060(0x3e0)]),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x38f749) {
    const _0x37ee09 = _0x17b060;
    (_0x38f749['x'] = Math['round'](_0x38f749['x'])),
      (_0x38f749['y'] = Math[_0x37ee09(0x3fe)](_0x38f749['y'])),
      (_0x38f749[_0x37ee09(0x321)] = Math['round'](_0x38f749['width'])),
      (_0x38f749[_0x37ee09(0x2c5)] = Math[_0x37ee09(0x3fe)](_0x38f749[_0x37ee09(0x2c5)])),
      this[_0x37ee09(0x510)](),
      VisuMZ[_0x37ee09(0x77a)][_0x37ee09(0x2a8)][_0x37ee09(0x64e)](this, _0x38f749),
      this[_0x37ee09(0x622)]();
  }),
  (Window_Base[_0x17b060(0x54a)]['initDigitGrouping'] = function () {
    const _0x30de37 = _0x17b060;
    (this[_0x30de37(0x254)] = VisuMZ[_0x30de37(0x77a)][_0x30de37(0x382)][_0x30de37(0x7ae)][_0x30de37(0x6d5)]),
      (this['_digitGroupingEx'] = VisuMZ[_0x30de37(0x77a)][_0x30de37(0x382)][_0x30de37(0x7ae)][_0x30de37(0x7e1)]);
  }),
  (Window_Base[_0x17b060(0x54a)]['lineHeight'] = function () {
    const _0x39e309 = _0x17b060;
    return VisuMZ[_0x39e309(0x77a)]['Settings']['Window']['LineHeight'];
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x7f1)] = function () {
    const _0x52902e = _0x17b060;
    return VisuMZ[_0x52902e(0x77a)][_0x52902e(0x382)][_0x52902e(0x607)][_0x52902e(0x6e2)];
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x394)] = function () {
    const _0x7953e1 = _0x17b060;
    $gameSystem[_0x7953e1(0x464)] ? (this[_0x7953e1(0x830)] = $gameSystem[_0x7953e1(0x464)]()) : (this['backOpacity'] = VisuMZ[_0x7953e1(0x77a)]['Settings']['Window']['BackOpacity']);
  }),
  (Window_Base[_0x17b060(0x54a)]['translucentOpacity'] = function () {
    const _0x19ac3c = _0x17b060;
    return VisuMZ[_0x19ac3c(0x77a)][_0x19ac3c(0x382)][_0x19ac3c(0x607)][_0x19ac3c(0x485)];
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x74a)] = function () {
    const _0x2dbcc2 = _0x17b060;
    return VisuMZ['CoreEngine'][_0x2dbcc2(0x382)][_0x2dbcc2(0x607)][_0x2dbcc2(0x5c1)];
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_Base_update'] = Window_Base['prototype'][_0x17b060(0x319)]),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0x2ce843 = _0x17b060;
    VisuMZ[_0x2ce843(0x77a)][_0x2ce843(0x693)][_0x2ce843(0x64e)](this), this[_0x2ce843(0x733)]();
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x186)] = function () {
    const _0x417c23 = _0x17b060;
    this[_0x417c23(0x1bd)] && ((this[_0x417c23(0x141)] += this['openingSpeed']()), this[_0x417c23(0x310)]() && (this[_0x417c23(0x1bd)] = ![]));
  }),
  (Window_Base['prototype'][_0x17b060(0x75c)] = function () {
    const _0x53c96e = _0x17b060;
    this[_0x53c96e(0x764)] && ((this[_0x53c96e(0x141)] -= this[_0x53c96e(0x74a)]()), this[_0x53c96e(0x565)]() && (this[_0x53c96e(0x764)] = ![]));
  }),
  (VisuMZ['CoreEngine']['Window_Base_drawText'] = Window_Base[_0x17b060(0x54a)][_0x17b060(0x1a9)]),
  (Window_Base['prototype']['drawText'] = function (_0x5922b6, _0x19e441, _0x4e22f3, _0x32c5e9, _0x4ce86d) {
    const _0x209e8a = _0x17b060;
    if (this[_0x209e8a(0x27c)]()) _0x5922b6 = VisuMZ[_0x209e8a(0x4bd)](_0x5922b6);
    VisuMZ[_0x209e8a(0x77a)][_0x209e8a(0x5c9)][_0x209e8a(0x64e)](this, _0x5922b6, _0x19e441, _0x4e22f3, _0x32c5e9, _0x4ce86d);
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x27c)] = function () {
    const _0x276374 = _0x17b060;
    return this[_0x276374(0x254)];
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_Base_createTextState'] = Window_Base[_0x17b060(0x54a)][_0x17b060(0x2eb)]),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x2eb)] = function (_0x33b85b, _0x50c7df, _0x53d2bc, _0x3cc8fb) {
    const _0x2e48f9 = _0x17b060;
    var _0x226262 = VisuMZ['CoreEngine']['Window_Base_createTextState'][_0x2e48f9(0x64e)](this, _0x33b85b, _0x50c7df, _0x53d2bc, _0x3cc8fb);
    if (this[_0x2e48f9(0x307)]()) _0x226262[_0x2e48f9(0x751)] = String(VisuMZ[_0x2e48f9(0x4bd)](_0x226262[_0x2e48f9(0x751)])) || '';
    return _0x226262;
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x307)] = function () {
    const _0x37ed1d = _0x17b060;
    return this[_0x37ed1d(0x237)];
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x16d)] = function (_0x3df029) {
    const _0x5c561c = _0x17b060;
    this[_0x5c561c(0x254)] = _0x3df029;
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x244)] = function (_0x114631) {
    const _0x5d6722 = _0x17b060;
    this[_0x5d6722(0x237)] = _0x114631;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x351)] = Window_Base['prototype'][_0x17b060(0x8af)]),
  (Window_Base[_0x17b060(0x54a)]['drawIcon'] = function (_0x1a8840, _0x1a5f42, _0x339979) {
    const _0x899adb = _0x17b060;
    (_0x1a5f42 = Math[_0x899adb(0x3fe)](_0x1a5f42)), (_0x339979 = Math['round'](_0x339979)), VisuMZ[_0x899adb(0x77a)][_0x899adb(0x351)][_0x899adb(0x64e)](this, _0x1a8840, _0x1a5f42, _0x339979);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x46a)] = Window_Base['prototype'][_0x17b060(0x4ae)]),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x4ae)] = function (_0x137661, _0x1946e1, _0x522811, _0x4a0d7a, _0x3b70cd, _0x260f68) {
    const _0x5b6344 = _0x17b060;
    (_0x3b70cd = _0x3b70cd || ImageManager[_0x5b6344(0x3c6)]),
      (_0x260f68 = _0x260f68 || ImageManager[_0x5b6344(0x6d8)]),
      (_0x522811 = Math[_0x5b6344(0x3fe)](_0x522811)),
      (_0x4a0d7a = Math['round'](_0x4a0d7a)),
      (_0x3b70cd = Math['round'](_0x3b70cd)),
      (_0x260f68 = Math['round'](_0x260f68)),
      VisuMZ[_0x5b6344(0x77a)][_0x5b6344(0x46a)]['call'](this, _0x137661, _0x1946e1, _0x522811, _0x4a0d7a, _0x3b70cd, _0x260f68);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x22c)] = Window_Base[_0x17b060(0x54a)][_0x17b060(0x188)]),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x188)] = function (_0x1dc008, _0x131db5, _0x4fe065, _0x250a40) {
    const _0x83b097 = _0x17b060;
    (_0x4fe065 = Math[_0x83b097(0x3fe)](_0x4fe065)),
      (_0x250a40 = Math['round'](_0x250a40)),
      VisuMZ['CoreEngine']['Window_Base_drawCharacter']['call'](this, _0x1dc008, _0x131db5, _0x4fe065, _0x250a40);
  }),
  (VisuMZ['CoreEngine']['Window_Selectable_itemRect'] = Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x81d)]),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x81d)] = function (_0x275c08) {
    const _0x372a1c = _0x17b060;
    let _0x7dd8bd = VisuMZ[_0x372a1c(0x77a)][_0x372a1c(0x505)][_0x372a1c(0x64e)](this, _0x275c08);
    return (
      (_0x7dd8bd['x'] = Math[_0x372a1c(0x3fe)](_0x7dd8bd['x'])),
      (_0x7dd8bd['y'] = Math[_0x372a1c(0x3fe)](_0x7dd8bd['y'])),
      (_0x7dd8bd[_0x372a1c(0x321)] = Math[_0x372a1c(0x3fe)](_0x7dd8bd[_0x372a1c(0x321)])),
      (_0x7dd8bd['height'] = Math[_0x372a1c(0x3fe)](_0x7dd8bd[_0x372a1c(0x2c5)])),
      _0x7dd8bd
    );
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x445)] = Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x623)]),
  (Window_StatusBase[_0x17b060(0x54a)]['drawActorSimpleStatus'] = function (_0x4ee2ce, _0x11d251, _0x49f8ea) {
    const _0x41e968 = _0x17b060;
    (_0x11d251 = Math[_0x41e968(0x3fe)](_0x11d251)), (_0x49f8ea = Math['round'](_0x49f8ea)), VisuMZ[_0x41e968(0x77a)][_0x41e968(0x445)][_0x41e968(0x64e)](this, _0x4ee2ce, _0x11d251, _0x49f8ea);
  }),
  (Window_Base['prototype']['initCoreEasing'] = function () {
    const _0x40b190 = _0x17b060;
    this[_0x40b190(0x44a)] = {
      duration: 0x0,
      wholeDuration: 0x0,
      type: _0x40b190(0x258),
      targetX: this['x'],
      targetY: this['y'],
      targetScaleX: this['scale']['x'],
      targetScaleY: this[_0x40b190(0x82a)]['y'],
      targetOpacity: this[_0x40b190(0x3e8)],
      targetBackOpacity: this[_0x40b190(0x830)],
      targetContentsOpacity: this[_0x40b190(0x363)],
    };
  }),
  (Window_Base[_0x17b060(0x54a)]['updateCoreEasing'] = function () {
    const _0x50ced9 = _0x17b060;
    if (!this[_0x50ced9(0x44a)]) return;
    if (this[_0x50ced9(0x44a)]['duration'] <= 0x0) return;
    (this['x'] = this['applyCoreEasing'](this['x'], this['_coreEasing'][_0x50ced9(0x5ff)])),
      (this['y'] = this[_0x50ced9(0x49b)](this['y'], this['_coreEasing'][_0x50ced9(0x54b)])),
      (this[_0x50ced9(0x82a)]['x'] = this[_0x50ced9(0x49b)](this[_0x50ced9(0x82a)]['x'], this['_coreEasing'][_0x50ced9(0x1d7)])),
      (this['scale']['y'] = this[_0x50ced9(0x49b)](this[_0x50ced9(0x82a)]['y'], this[_0x50ced9(0x44a)][_0x50ced9(0x6d4)])),
      (this[_0x50ced9(0x3e8)] = this[_0x50ced9(0x49b)](this[_0x50ced9(0x3e8)], this['_coreEasing'][_0x50ced9(0x23f)])),
      (this[_0x50ced9(0x830)] = this['applyCoreEasing'](this[_0x50ced9(0x830)], this[_0x50ced9(0x44a)][_0x50ced9(0x2a2)])),
      (this[_0x50ced9(0x363)] = this['applyCoreEasing'](this[_0x50ced9(0x363)], this[_0x50ced9(0x44a)][_0x50ced9(0x651)])),
      this['_coreEasing'][_0x50ced9(0x5cd)]--;
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x49b)] = function (_0x1ae5d2, _0x5f70f5) {
    const _0x2de3a6 = _0x17b060;
    if (!this[_0x2de3a6(0x44a)]) return _0x5f70f5;
    const _0x23e5dc = this['_coreEasing'][_0x2de3a6(0x5cd)],
      _0x4a950b = this['_coreEasing']['wholeDuration'],
      _0x54aa3c = this[_0x2de3a6(0x636)]((_0x4a950b - _0x23e5dc) / _0x4a950b),
      _0xc5f981 = this[_0x2de3a6(0x636)]((_0x4a950b - _0x23e5dc + 0x1) / _0x4a950b),
      _0x4ce097 = (_0x1ae5d2 - _0x5f70f5 * _0x54aa3c) / (0x1 - _0x54aa3c);
    return _0x4ce097 + (_0x5f70f5 - _0x4ce097) * _0xc5f981;
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x636)] = function (_0x3f2efb) {
    const _0x3bfffa = _0x17b060;
    if (!this[_0x3bfffa(0x44a)]) return _0x3f2efb;
    return VisuMZ[_0x3bfffa(0x30b)](_0x3f2efb, this[_0x3bfffa(0x44a)][_0x3bfffa(0x629)] || _0x3bfffa(0x258));
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x73c)] = function (_0x4f5e11, _0x42590d) {
    const _0x4b9d6e = _0x17b060;
    if (!this[_0x4b9d6e(0x44a)]) return;
    (this['x'] = this['_coreEasing']['targetX']),
      (this['y'] = this[_0x4b9d6e(0x44a)][_0x4b9d6e(0x54b)]),
      (this[_0x4b9d6e(0x82a)]['x'] = this[_0x4b9d6e(0x44a)]['targetScaleX']),
      (this[_0x4b9d6e(0x82a)]['y'] = this['_coreEasing'][_0x4b9d6e(0x6d4)]),
      (this[_0x4b9d6e(0x3e8)] = this[_0x4b9d6e(0x44a)][_0x4b9d6e(0x23f)]),
      (this[_0x4b9d6e(0x830)] = this[_0x4b9d6e(0x44a)]['targetBackOpacity']),
      (this[_0x4b9d6e(0x363)] = this[_0x4b9d6e(0x44a)]['targetContentsOpacity']),
      this['setupCoreEasing'](
        _0x4f5e11,
        _0x42590d,
        this['x'],
        this['y'],
        this[_0x4b9d6e(0x82a)]['x'],
        this[_0x4b9d6e(0x82a)]['y'],
        this[_0x4b9d6e(0x3e8)],
        this['backOpacity'],
        this['contentsOpacity'],
      );
  }),
  (Window_Base[_0x17b060(0x54a)]['setupCoreEasing'] = function (_0x4b3725, _0x16380c, _0x299fa8, _0x52036d, _0x51176e, _0x28414d, _0x1598c2, _0x171061, _0x4d74c2) {
    const _0x19a6e0 = _0x17b060;
    this[_0x19a6e0(0x44a)] = {
      duration: _0x4b3725,
      wholeDuration: _0x4b3725,
      type: _0x16380c,
      targetX: _0x299fa8,
      targetY: _0x52036d,
      targetScaleX: _0x51176e,
      targetScaleY: _0x28414d,
      targetOpacity: _0x1598c2,
      targetBackOpacity: _0x171061,
      targetContentsOpacity: _0x4d74c2,
    };
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x714)] = function (_0x47f0b9, _0x3862a8, _0xf3fa03, _0x336c68, _0x2df7dd) {
    const _0x4bd99c = _0x17b060;
    this['resetFontSettings'](), (this[_0x4bd99c(0x16e)]['fontSize'] = VisuMZ[_0x4bd99c(0x77a)]['Settings'][_0x4bd99c(0x6a1)][_0x4bd99c(0x774)]);
    const _0x55ea3c = VisuMZ['CoreEngine'][_0x4bd99c(0x382)][_0x4bd99c(0x6a1)][_0x4bd99c(0x1b5)];
    if (_0x55ea3c > 0x0 && _0x3862a8 === TextManager[_0x4bd99c(0x52c)]) {
      const _0xd99da8 = _0x336c68 + (this[_0x4bd99c(0x835)]() - ImageManager[_0x4bd99c(0x275)]) / 0x2;
      this[_0x4bd99c(0x8af)](_0x55ea3c, _0xf3fa03 + (_0x2df7dd - ImageManager[_0x4bd99c(0x2ab)]), _0xd99da8), (_0x2df7dd -= ImageManager['iconWidth'] + 0x4);
    } else this[_0x4bd99c(0x6f1)](ColorManager[_0x4bd99c(0x4ca)]()), this['drawText'](_0x3862a8, _0xf3fa03, _0x336c68, _0x2df7dd, _0x4bd99c(0x512)), (_0x2df7dd -= this['textWidth'](_0x3862a8) + 0x6);
    this[_0x4bd99c(0x176)]();
    const _0x432022 = this[_0x4bd99c(0x80f)](this[_0x4bd99c(0x254)] ? VisuMZ[_0x4bd99c(0x4bd)](_0x47f0b9) : _0x47f0b9);
    _0x432022 > _0x2df7dd
      ? this[_0x4bd99c(0x1a9)](VisuMZ[_0x4bd99c(0x77a)][_0x4bd99c(0x382)][_0x4bd99c(0x6a1)][_0x4bd99c(0x246)], _0xf3fa03, _0x336c68, _0x2df7dd, _0x4bd99c(0x512))
      : this[_0x4bd99c(0x1a9)](_0x47f0b9, _0xf3fa03, _0x336c68, _0x2df7dd, _0x4bd99c(0x512)),
      this['resetFontSettings']();
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x147)] = function (_0x28958f, _0x594fb0, _0x1ea074, _0x15f068, _0x8448a7) {
    const _0x2a4700 = _0x17b060,
      _0x44759b = ImageManager[_0x2a4700(0x1ef)]('IconSet'),
      _0x1b54b5 = ImageManager[_0x2a4700(0x2ab)],
      _0x283557 = ImageManager[_0x2a4700(0x275)],
      _0x111ab2 = (_0x28958f % 0x10) * _0x1b54b5,
      _0x18494b = Math[_0x2a4700(0x221)](_0x28958f / 0x10) * _0x283557,
      _0x58d561 = _0x15f068,
      _0x2d61c0 = _0x15f068;
    (this['contents'][_0x2a4700(0x578)][_0x2a4700(0x827)] = _0x8448a7),
      this[_0x2a4700(0x16e)][_0x2a4700(0x3f8)](_0x44759b, _0x111ab2, _0x18494b, _0x1b54b5, _0x283557, _0x594fb0, _0x1ea074, _0x58d561, _0x2d61c0),
      (this[_0x2a4700(0x16e)]['_context'][_0x2a4700(0x827)] = !![]);
  }),
  (Window_Base[_0x17b060(0x54a)]['drawGauge'] = function (_0x2d0dcc, _0x12c61e, _0x2abb18, _0x257044, _0x2954c9, _0x3525f3) {
    const _0x37f98e = _0x17b060,
      _0xcf1bf4 = Math[_0x37f98e(0x221)]((_0x2abb18 - 0x2) * _0x257044),
      _0x115acc = Sprite_Gauge[_0x37f98e(0x54a)][_0x37f98e(0x193)][_0x37f98e(0x64e)](this),
      _0x28a73d = _0x12c61e + this[_0x37f98e(0x835)]() - _0x115acc - 0x2;
    this['contents'][_0x37f98e(0x456)](_0x2d0dcc, _0x28a73d, _0x2abb18, _0x115acc, ColorManager[_0x37f98e(0x150)]()),
      this[_0x37f98e(0x16e)][_0x37f98e(0x668)](_0x2d0dcc + 0x1, _0x28a73d + 0x1, _0xcf1bf4, _0x115acc - 0x2, _0x2954c9, _0x3525f3);
  }),
  (Window_Scrollable[_0x17b060(0x767)] = {
    enabled: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x77c)] ?? !![],
    thickness: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x846)] ?? 0x2,
    offset: VisuMZ['CoreEngine'][_0x17b060(0x382)]['Window'][_0x17b060(0x243)] ?? 0x2,
    bodyColor: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x58e)] ?? 0x0,
    offColor: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x49c)] ?? 0x7,
    offOpacity: VisuMZ[_0x17b060(0x77a)]['Settings'][_0x17b060(0x607)][_0x17b060(0x6c5)] ?? 0x80,
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x775)] = function () {
    const _0x1c66a9 = _0x17b060;
    return Window_Scrollable[_0x1c66a9(0x767)][_0x1c66a9(0x4be)] && Window_Scrollable[_0x1c66a9(0x767)][_0x1c66a9(0x1da)] > 0x0;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x79a)] = Window_Base[_0x17b060(0x54a)]['createContents']),
  (Window_Base['prototype'][_0x17b060(0x5f1)] = function () {
    const _0x2599db = _0x17b060;
    VisuMZ[_0x2599db(0x77a)][_0x2599db(0x79a)][_0x2599db(0x64e)](this), this[_0x2599db(0x3e3)](), this[_0x2599db(0x86c)](!![]), this[_0x2599db(0x86c)](![]);
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x3e3)] = function () {
    const _0x5021e2 = _0x17b060;
    if (!this['isScrollBarVisible']()) return;
    if (this[_0x5021e2(0x20c)] || this[_0x5021e2(0x707)]) return;
    (this['_lastScrollBarValues'] = { horz: null, vert: null, maxHorz: null, maxVert: null }),
      (this['_scrollBarHorz'] = new Sprite()),
      (this['_scrollBarVert'] = new Sprite()),
      this[_0x5021e2(0x781)](this[_0x5021e2(0x20c)]),
      this[_0x5021e2(0x781)](this['_scrollBarVert']);
  }),
  (Window_Base[_0x17b060(0x54a)]['setupScrollBarBitmap'] = function (_0x2e0382) {
    const _0x4fb92d = _0x17b060,
      _0x3cdcdc = _0x2e0382 ? this[_0x4fb92d(0x20c)] : this[_0x4fb92d(0x707)];
    if (!_0x3cdcdc) return;
    const _0xf74512 = Window_Scrollable[_0x4fb92d(0x767)],
      _0x5e859a = _0xf74512[_0x4fb92d(0x1da)],
      _0x1febc8 = _0x2e0382 ? this['innerWidth'] - _0x5e859a * 0x2 : _0x5e859a,
      _0x1f218c = _0x2e0382 ? _0x5e859a : this['innerHeight'] - _0x5e859a * 0x2;
    (_0x3cdcdc[_0x4fb92d(0x7d3)] = new Bitmap(_0x1febc8, _0x1f218c)), _0x3cdcdc[_0x4fb92d(0x674)](0x0, 0x0, _0x1febc8, _0x1f218c), this[_0x4fb92d(0x1ba)](_0x2e0382);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x2fb)] = Window_Base['prototype']['destroyContents']),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x7be)] = function () {
    const _0x4f5f84 = _0x17b060;
    VisuMZ[_0x4f5f84(0x77a)]['Window_Base_destroyContents'][_0x4f5f84(0x64e)](this), this['destroyScrollBarBitmaps']();
  }),
  (Window_Base['prototype'][_0x17b060(0x187)] = function () {
    const _0x3d33e6 = _0x17b060,
      _0x5b7b60 = [this['_scrollBarHorz'], this['_scrollBarVert']];
    for (const _0x40e349 of _0x5b7b60) {
      if (_0x40e349 && _0x40e349[_0x3d33e6(0x7d3)]) _0x40e349['bitmap'][_0x3d33e6(0x2a5)]();
    }
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_Scrollable_update'] = Window_Scrollable[_0x17b060(0x54a)][_0x17b060(0x319)]),
  (Window_Scrollable['prototype'][_0x17b060(0x319)] = function () {
    const _0x355f44 = _0x17b060;
    VisuMZ[_0x355f44(0x77a)][_0x355f44(0x286)][_0x355f44(0x64e)](this), this[_0x355f44(0x898)]();
  }),
  (Window_Scrollable['prototype'][_0x17b060(0x898)] = function () {
    const _0x4e67a4 = _0x17b060;
    this[_0x4e67a4(0x136)](), this['checkScrollBarBitmap'](!![]), this[_0x4e67a4(0x63b)](![]), this[_0x4e67a4(0x1ba)](!![]), this[_0x4e67a4(0x1ba)](![]);
  }),
  (Window_Scrollable[_0x17b060(0x54a)][_0x17b060(0x136)] = function () {
    const _0x4c298c = _0x17b060,
      _0x3ae0a5 = [this['_scrollBarHorz'], this[_0x4c298c(0x707)]];
    for (const _0x5d5aae of _0x3ae0a5) {
      _0x5d5aae && (_0x5d5aae[_0x4c298c(0x70d)] = this[_0x4c298c(0x775)]() && this['isOpen']());
    }
  }),
  (Window_Scrollable[_0x17b060(0x54a)]['checkScrollBarBitmap'] = function (_0x2bcc65) {
    const _0x2ec2ae = _0x17b060;
    if (!this[_0x2ec2ae(0x3a5)]) return;
    const _0x16d16a = this[_0x2ec2ae(0x4e3)](_0x2bcc65),
      _0x47bf65 = this[_0x2ec2ae(0x3fb)](_0x2bcc65),
      _0x3c7407 = _0x2bcc65 ? 'horz' : _0x2ec2ae(0x72f),
      _0x281d31 = _0x2bcc65 ? 'maxHorz' : _0x2ec2ae(0x3e2);
    (this[_0x2ec2ae(0x3a5)][_0x3c7407] !== _0x16d16a || this[_0x2ec2ae(0x3a5)][_0x281d31] !== _0x47bf65) &&
      ((this['_lastScrollBarValues'][_0x3c7407] = _0x16d16a), (this['_lastScrollBarValues'][_0x281d31] = _0x47bf65), this[_0x2ec2ae(0x4e0)](_0x2bcc65, _0x16d16a, _0x47bf65));
  }),
  (Window_Scrollable['prototype'][_0x17b060(0x4e3)] = function (_0x5a210b) {
    const _0x415b33 = _0x17b060;
    if (this[_0x415b33(0x362)] !== undefined) return _0x5a210b ? this['scrollX']() : this['origin']['y'];
    return _0x5a210b ? this[_0x415b33(0x15c)]() : this['scrollY']();
  }),
  (Window_Scrollable['prototype'][_0x17b060(0x3fb)] = function (_0x3ded80) {
    const _0x7eac21 = _0x17b060;
    if (this[_0x7eac21(0x362)] !== undefined) return _0x3ded80 ? this['maxScrollX']() : Math[_0x7eac21(0x7f9)](0x0, this[_0x7eac21(0x362)] - this[_0x7eac21(0x64b)]);
    return _0x3ded80 ? this['maxScrollX']() : this[_0x7eac21(0x483)]();
  }),
  (Window_Scrollable[_0x17b060(0x54a)][_0x17b060(0xf4)] = function () {
    const _0x4e17e7 = _0x17b060;
    if (this[_0x4e17e7(0x362)] !== undefined) return Math['max'](0x0, this[_0x4e17e7(0x362)]);
    return this[_0x4e17e7(0x116)]();
  }),
  (Window_Scrollable['prototype'][_0x17b060(0x4e0)] = function (_0x220302, _0x2b81af, _0xb3aca8) {
    const _0x5e7b60 = _0x17b060,
      _0xd0127d = _0x220302 ? this[_0x5e7b60(0x20c)] : this[_0x5e7b60(0x707)];
    if (!_0xd0127d) return;
    if (!_0xd0127d[_0x5e7b60(0x7d3)]) return;
    const _0x4400f8 = _0xd0127d[_0x5e7b60(0x7d3)];
    _0x4400f8[_0x5e7b60(0x2d5)]();
    if (_0xb3aca8 <= 0x0) return;
    const _0x208b19 = _0x220302 ? this['innerWidth'] / this[_0x5e7b60(0x34b)]() : this[_0x5e7b60(0x64b)] / this[_0x5e7b60(0xf4)](),
      _0x9c4fbd = _0x220302 ? Math[_0x5e7b60(0x3fe)](_0x2b81af * _0x208b19) : 0x0,
      _0x5dd37d = _0x220302 ? 0x0 : Math[_0x5e7b60(0x3fe)](_0x2b81af * _0x208b19),
      _0x274f77 = _0x220302 ? Math['round'](_0x4400f8['width'] * _0x208b19) : _0x4400f8['width'],
      _0x5a94e8 = _0x220302 ? _0x4400f8[_0x5e7b60(0x2c5)] : Math['round'](_0x4400f8[_0x5e7b60(0x2c5)] * _0x208b19),
      _0x3b7bd8 = Window_Scrollable[_0x5e7b60(0x767)],
      _0x13a3da = ColorManager[_0x5e7b60(0xf7)](_0x3b7bd8[_0x5e7b60(0x56b)]),
      _0x430b98 = ColorManager[_0x5e7b60(0xf7)](_0x3b7bd8[_0x5e7b60(0x641)]),
      _0x4d2da4 = _0x3b7bd8[_0x5e7b60(0x118)];
    (_0x4400f8[_0x5e7b60(0x858)] = _0x4d2da4),
      _0x4400f8['fillAll'](_0x13a3da),
      (_0x4400f8[_0x5e7b60(0x858)] = 0xff),
      _0x4400f8[_0x5e7b60(0x456)](_0x9c4fbd, _0x5dd37d, _0x274f77, _0x5a94e8, _0x430b98);
  }),
  (Window_Base['prototype']['updateScrollBarPosition'] = function (_0xccb051) {
    const _0x212367 = _0x17b060,
      _0x4fab7c = _0xccb051 ? this['_scrollBarHorz'] : this[_0x212367(0x707)];
    if (!_0x4fab7c) return;
    const _0x32339e = Window_Scrollable['SCROLLBAR'],
      _0x401fe9 = _0x32339e[_0x212367(0x1da)],
      _0x1a0f05 = _0x32339e[_0x212367(0x387)];
    if (!_0x4fab7c[_0x212367(0x206)]) return;
    (_0x4fab7c['x'] = this[_0x212367(0x804)] + (_0xccb051 ? _0x401fe9 : this[_0x212367(0x547)] + _0x1a0f05)),
      (_0x4fab7c['y'] = this[_0x212367(0x804)] + (_0xccb051 ? this[_0x212367(0x64b)] + _0x1a0f05 : _0x401fe9));
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x4cc)] = function (_0x36ced9) {
    const _0x30ff88 = _0x17b060;
    let _0x3d8770 = this[_0x30ff88(0x79e)]();
    const _0x5518b1 = this[_0x30ff88(0x162)](),
      _0x5030ad = this[_0x30ff88(0x817)]();
    if (this[_0x30ff88(0x6ff)]() && (_0x3d8770 < _0x5518b1 || (_0x36ced9 && _0x5030ad === 0x1))) {
      _0x3d8770 += _0x5030ad;
      if (_0x3d8770 >= _0x5518b1) _0x3d8770 = _0x5518b1 - 0x1;
      this['smoothSelect'](_0x3d8770);
    } else !this['isUseModernControls']() && (_0x3d8770 < _0x5518b1 - _0x5030ad || (_0x36ced9 && _0x5030ad === 0x1)) && this['smoothSelect']((_0x3d8770 + _0x5030ad) % _0x5518b1);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0xff)] = Window_Selectable['prototype']['cursorDown']),
  (Window_Selectable[_0x17b060(0x54a)]['cursorDown'] = function (_0x17406d) {
    const _0x36d118 = _0x17b060;
    this[_0x36d118(0x6ff)]() && _0x17406d && this[_0x36d118(0x817)]() === 0x1 && this[_0x36d118(0x79e)]() === this[_0x36d118(0x162)]() - 0x1
      ? this[_0x36d118(0x45f)](0x0)
      : VisuMZ[_0x36d118(0x77a)][_0x36d118(0xff)][_0x36d118(0x64e)](this, _0x17406d);
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x4c3)] = function (_0x1854d0) {
    const _0x3f594d = _0x17b060;
    let _0x3fe4f3 = Math[_0x3f594d(0x7f9)](0x0, this['index']());
    const _0x5354ac = this[_0x3f594d(0x162)](),
      _0x3aba83 = this[_0x3f594d(0x817)]();
    if ((this[_0x3f594d(0x6ff)]() && _0x3fe4f3 > 0x0) || (_0x1854d0 && _0x3aba83 === 0x1)) {
      _0x3fe4f3 -= _0x3aba83;
      if (_0x3fe4f3 <= 0x0) _0x3fe4f3 = 0x0;
      this[_0x3f594d(0x45f)](_0x3fe4f3);
    } else !this['isUseModernControls']() && (_0x3fe4f3 >= _0x3aba83 || (_0x1854d0 && _0x3aba83 === 0x1)) && this[_0x3f594d(0x45f)]((_0x3fe4f3 - _0x3aba83 + _0x5354ac) % _0x5354ac);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x65e)] = Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x4c3)]),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x4c3)] = function (_0x4b03cc) {
    const _0x16443b = _0x17b060;
    this[_0x16443b(0x6ff)]() && _0x4b03cc && this['maxCols']() === 0x1 && this['index']() === 0x0
      ? this[_0x16443b(0x45f)](this[_0x16443b(0x162)]() - 0x1)
      : VisuMZ[_0x16443b(0x77a)][_0x16443b(0x65e)][_0x16443b(0x64e)](this, _0x4b03cc);
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x6ff)] = function () {
    const _0x287b7c = _0x17b060;
    return VisuMZ[_0x287b7c(0x77a)][_0x287b7c(0x382)][_0x287b7c(0x7ae)][_0x287b7c(0x5df)];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x352)] = Window_Selectable[_0x17b060(0x54a)]['processCursorMove']),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x1f7)] = function () {
    const _0x46643d = _0x17b060;
    this[_0x46643d(0x6ff)]() ? (this[_0x46643d(0x6a5)](), this['processCursorHomeEndTrigger']()) : VisuMZ[_0x46643d(0x77a)][_0x46643d(0x352)][_0x46643d(0x64e)](this);
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x4d8)] = function () {
    return !![];
  }),
  (Window_Selectable['prototype'][_0x17b060(0x6a5)] = function () {
    const _0x6c36a7 = _0x17b060;
    if (this[_0x6c36a7(0x173)]()) {
      const _0x1f1868 = this[_0x6c36a7(0x79e)]();
      Input['isRepeated']('down') &&
        (Input[_0x6c36a7(0x285)](_0x6c36a7(0x7f4)) && this[_0x6c36a7(0x4d8)]() ? this[_0x6c36a7(0x10f)]() : this[_0x6c36a7(0x4cc)](Input[_0x6c36a7(0x301)](_0x6c36a7(0x195)))),
        Input[_0x6c36a7(0x656)]('up') && (Input[_0x6c36a7(0x285)](_0x6c36a7(0x7f4)) && this[_0x6c36a7(0x4d8)]() ? this[_0x6c36a7(0x472)]() : this[_0x6c36a7(0x4c3)](Input['isTriggered']('up'))),
        Input[_0x6c36a7(0x656)](_0x6c36a7(0x512)) && this['cursorRight'](Input[_0x6c36a7(0x301)](_0x6c36a7(0x512))),
        Input[_0x6c36a7(0x656)](_0x6c36a7(0x2b0)) && this[_0x6c36a7(0x76f)](Input[_0x6c36a7(0x301)](_0x6c36a7(0x2b0))),
        !this[_0x6c36a7(0x32f)](_0x6c36a7(0x7c5)) && Input['isRepeated'](_0x6c36a7(0x7c5)) && this['cursorPagedown'](),
        !this['isHandled']('pageup') && Input[_0x6c36a7(0x656)]('pageup') && this[_0x6c36a7(0x472)](),
        this[_0x6c36a7(0x79e)]() !== _0x1f1868 && this[_0x6c36a7(0x873)]();
    }
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x1cd)] = function () {
    const _0x141188 = _0x17b060;
    if (this['isCursorMovable']()) {
      const _0x220bdd = this['index']();
      Input['isTriggered']('home') && this['smoothSelect'](Math[_0x141188(0x701)](this[_0x141188(0x79e)](), 0x0)),
        Input[_0x141188(0x301)](_0x141188(0x2d0)) && this[_0x141188(0x45f)](Math['max'](this[_0x141188(0x79e)](), this['maxItems']() - 0x1)),
        this[_0x141188(0x79e)]() !== _0x220bdd && this['playCursorSound']();
    }
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_Selectable_processTouch'] = Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x23c)]),
  (Window_Selectable['prototype'][_0x17b060(0x23c)] = function () {
    const _0x40b2f1 = _0x17b060;
    this[_0x40b2f1(0x6ff)]() ? this[_0x40b2f1(0x1aa)]() : VisuMZ['CoreEngine']['Window_Selectable_processTouch']['call'](this);
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x1aa)] = function () {
    const _0x202259 = _0x17b060;
    VisuMZ[_0x202259(0x77a)][_0x202259(0x514)][_0x202259(0x64e)](this);
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x3d5)] = function () {
    const _0x3b9a8f = _0x17b060;
    return VisuMZ[_0x3b9a8f(0x77a)][_0x3b9a8f(0x382)][_0x3b9a8f(0x607)][_0x3b9a8f(0x7b0)];
  }),
  (Window_Selectable['prototype'][_0x17b060(0x493)] = function () {
    const _0x3068aa = _0x17b060;
    return VisuMZ['CoreEngine'][_0x3068aa(0x382)][_0x3068aa(0x607)][_0x3068aa(0x579)];
  }),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x696)] = function () {
    const _0x513e81 = _0x17b060;
    return Window_Scrollable[_0x513e81(0x54a)][_0x513e81(0x696)][_0x513e81(0x64e)](this) + VisuMZ[_0x513e81(0x77a)][_0x513e81(0x382)]['Window'][_0x513e81(0x40f)];
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x7fe)] = Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x6c7)]),
  (Window_Selectable[_0x17b060(0x54a)][_0x17b060(0x6c7)] = function (_0x27cf56) {
    const _0x32252a = _0x17b060,
      _0x5a2bad = VisuMZ['CoreEngine'][_0x32252a(0x382)][_0x32252a(0x607)];
    if (_0x5a2bad['ShowItemBackground'] === ![]) return;
    _0x5a2bad['DrawItemBackgroundJS'] ? _0x5a2bad[_0x32252a(0x3f9)][_0x32252a(0x64e)](this, _0x27cf56) : VisuMZ[_0x32252a(0x77a)][_0x32252a(0x7fe)][_0x32252a(0x64e)](this, _0x27cf56);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_Gold_refresh'] = Window_Gold[_0x17b060(0x54a)][_0x17b060(0x80e)]),
  (Window_Gold[_0x17b060(0x54a)][_0x17b060(0x80e)] = function () {
    const _0xf94b02 = _0x17b060;
    this['isItemStyle']() ? this[_0xf94b02(0x6b0)]() : VisuMZ[_0xf94b02(0x77a)][_0xf94b02(0x677)]['call'](this);
  }),
  (Window_Gold[_0x17b060(0x54a)][_0x17b060(0x241)] = function () {
    const _0x16d801 = _0x17b060;
    if (TextManager[_0x16d801(0x52c)] !== this[_0x16d801(0x52c)]()) return ![];
    return VisuMZ[_0x16d801(0x77a)]['Settings'][_0x16d801(0x6a1)]['ItemStyle'];
  }),
  (Window_Gold[_0x17b060(0x54a)][_0x17b060(0x6b0)] = function () {
    const _0x47f6e8 = _0x17b060;
    this[_0x47f6e8(0x5c0)](), this[_0x47f6e8(0x16e)]['clear'](), (this['contents']['fontSize'] = VisuMZ[_0x47f6e8(0x77a)][_0x47f6e8(0x382)][_0x47f6e8(0x6a1)]['GoldFontSize']);
    const _0x2ae8f8 = VisuMZ[_0x47f6e8(0x77a)][_0x47f6e8(0x382)][_0x47f6e8(0x6a1)][_0x47f6e8(0x1b5)],
      _0x479d2e = this[_0x47f6e8(0x13c)](0x0);
    if (_0x2ae8f8 > 0x0) {
      const _0x2a4d2b = _0x479d2e['y'] + (this[_0x47f6e8(0x835)]() - ImageManager[_0x47f6e8(0x275)]) / 0x2;
      this[_0x47f6e8(0x8af)](_0x2ae8f8, _0x479d2e['x'], _0x2a4d2b);
      const _0x18e32b = ImageManager[_0x47f6e8(0x2ab)] + 0x4;
      (_0x479d2e['x'] += _0x18e32b), (_0x479d2e[_0x47f6e8(0x321)] -= _0x18e32b);
    }
    this[_0x47f6e8(0x6f1)](ColorManager[_0x47f6e8(0x4ca)]()), this[_0x47f6e8(0x1a9)](this[_0x47f6e8(0x52c)](), _0x479d2e['x'], _0x479d2e['y'], _0x479d2e[_0x47f6e8(0x321)], _0x47f6e8(0x2b0));
    const _0xc599e9 = this['textWidth'](this[_0x47f6e8(0x52c)]()) + 0x6;
    (_0x479d2e['x'] += _0xc599e9), (_0x479d2e['width'] -= _0xc599e9), this[_0x47f6e8(0x176)]();
    const _0x4e72be = this[_0x47f6e8(0x6fc)](),
      _0x149d8f = this[_0x47f6e8(0x80f)](this[_0x47f6e8(0x254)] ? VisuMZ[_0x47f6e8(0x4bd)](this[_0x47f6e8(0x6fc)]()) : this[_0x47f6e8(0x6fc)]());
    _0x149d8f > _0x479d2e[_0x47f6e8(0x321)]
      ? this[_0x47f6e8(0x1a9)](VisuMZ[_0x47f6e8(0x77a)][_0x47f6e8(0x382)][_0x47f6e8(0x6a1)]['GoldOverlap'], _0x479d2e['x'], _0x479d2e['y'], _0x479d2e[_0x47f6e8(0x321)], _0x47f6e8(0x512))
      : this[_0x47f6e8(0x1a9)](this['value'](), _0x479d2e['x'], _0x479d2e['y'], _0x479d2e['width'], 'right'),
      this[_0x47f6e8(0x5c0)]();
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x566)] = function (_0x275375, _0x4f15f5, _0x2630e6, _0x33baf7, _0x233c9e) {
    const _0x43fb8c = _0x17b060;
    _0x33baf7 = String(_0x33baf7 || '')[_0x43fb8c(0x29e)]();
    if (VisuMZ[_0x43fb8c(0x77a)][_0x43fb8c(0x382)][_0x43fb8c(0x71d)]['DrawIcons']) {
      const _0x3f1877 = VisuMZ[_0x43fb8c(0x61c)](_0x33baf7);
      _0x233c9e
        ? (this[_0x43fb8c(0x147)](_0x3f1877, _0x275375, _0x4f15f5, this[_0x43fb8c(0x798)]()), (_0x2630e6 -= this[_0x43fb8c(0x798)]() + 0x2), (_0x275375 += this[_0x43fb8c(0x798)]() + 0x2))
        : (this['drawIcon'](_0x3f1877, _0x275375 + 0x2, _0x4f15f5 + 0x2), (_0x2630e6 -= ImageManager[_0x43fb8c(0x2ab)] + 0x4), (_0x275375 += ImageManager['iconWidth'] + 0x4));
    }
    const _0x57904f = TextManager[_0x43fb8c(0x7a1)](_0x33baf7);
    this[_0x43fb8c(0x5c0)](),
      this[_0x43fb8c(0x6f1)](ColorManager['systemColor']()),
      _0x233c9e
        ? ((this[_0x43fb8c(0x16e)][_0x43fb8c(0xf8)] = this[_0x43fb8c(0x474)]()),
          this[_0x43fb8c(0x16e)][_0x43fb8c(0x1a9)](_0x57904f, _0x275375, _0x4f15f5, _0x2630e6, this[_0x43fb8c(0x798)](), _0x43fb8c(0x2b0)))
        : this[_0x43fb8c(0x1a9)](_0x57904f, _0x275375, _0x4f15f5, _0x2630e6),
      this[_0x43fb8c(0x5c0)]();
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x474)] = function () {
    const _0x36f5e2 = _0x17b060;
    return $gameSystem[_0x36f5e2(0xf9)]() - 0x8;
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x8b5)] = function (_0x52cae7, _0x3d4760, _0x1d25f4, _0x215b46) {
    const _0x52b411 = _0x17b060;
    (_0x215b46 = _0x215b46 || 0xa8), this['resetTextColor']();
    if (VisuMZ[_0x52b411(0x77a)]['Settings']['UI']['TextCodeClassNames']) this['drawTextEx'](_0x52cae7['currentClass']()['name'], _0x3d4760, _0x1d25f4, _0x215b46);
    else {
      const _0x4cd101 = _0x52cae7[_0x52b411(0x1e1)]()[_0x52b411(0x142)]['replace'](/\\I\[(\d+)\]/gi, '');
      this['drawText'](_0x4cd101, _0x3d4760, _0x1d25f4, _0x215b46);
    }
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x104)] = function (_0x2fb355, _0x47c468, _0x3114df, _0x5d6890) {
    const _0x341f4b = _0x17b060;
    (_0x5d6890 = _0x5d6890 || 0x10e), this['resetTextColor']();
    if (VisuMZ[_0x341f4b(0x77a)][_0x341f4b(0x382)]['UI'][_0x341f4b(0x2ea)]) this[_0x341f4b(0x489)](_0x2fb355['nickname'](), _0x47c468, _0x3114df, _0x5d6890);
    else {
      const _0x67fa8b = _0x2fb355[_0x341f4b(0x283)]()['replace'](/\\I\[(\d+)\]/gi, '');
      this[_0x341f4b(0x1a9)](_0x2fb355[_0x341f4b(0x283)](), _0x47c468, _0x3114df, _0x5d6890);
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x5e0)] = Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x5a8)]),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x5a8)] = function (_0x50c52a, _0x1a9afd, _0x43a171) {
    const _0x4e0da0 = _0x17b060;
    if (VisuMZ[_0x4e0da0(0x77a)]['Settings']['Param'][_0x4e0da0(0x2e4)] === ![]) return;
    if (this['isExpGaugeDrawn']()) this[_0x4e0da0(0x52e)](_0x50c52a, _0x1a9afd, _0x43a171);
    VisuMZ[_0x4e0da0(0x77a)][_0x4e0da0(0x5e0)]['call'](this, _0x50c52a, _0x1a9afd, _0x43a171);
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x3a4)] = function () {
    const _0x1f42d5 = _0x17b060;
    return VisuMZ[_0x1f42d5(0x77a)][_0x1f42d5(0x382)]['UI']['LvExpGauge'];
  }),
  (Window_StatusBase[_0x17b060(0x54a)][_0x17b060(0x52e)] = function (_0x886650, _0x71f59e, _0x4e9a07) {
    const _0x44788b = _0x17b060;
    if (!_0x886650) return;
    if (!_0x886650['isActor']()) return;
    const _0x38c877 = 0x80,
      _0x4729c3 = _0x886650['expRate']();
    let _0x54d487 = ColorManager['expGaugeColor1'](),
      _0x132dca = ColorManager['expGaugeColor2']();
    _0x4729c3 >= 0x1 && ((_0x54d487 = ColorManager[_0x44788b(0x26e)]()), (_0x132dca = ColorManager[_0x44788b(0x60d)]())),
      this[_0x44788b(0x123)](_0x71f59e, _0x4e9a07, _0x38c877, _0x4729c3, _0x54d487, _0x132dca);
  }),
  (Window_EquipStatus['prototype'][_0x17b060(0x453)] = function () {
    const _0x1a3d5f = _0x17b060;
    let _0x2bc42f = 0x0;
    for (const _0xb7db5c of VisuMZ['CoreEngine'][_0x1a3d5f(0x382)][_0x1a3d5f(0x71d)][_0x1a3d5f(0x449)]) {
      const _0x284bca = this['itemPadding'](),
        _0x590c71 = this[_0x1a3d5f(0x7ba)](_0x2bc42f);
      this[_0x1a3d5f(0x272)](_0x284bca, _0x590c71, _0xb7db5c), _0x2bc42f++;
    }
  }),
  (Window_EquipStatus['prototype'][_0x17b060(0x504)] = function (_0x4efc72, _0x5ea768, _0x5a8eea) {
    const _0x1a84a6 = _0x17b060,
      _0x13959e = this[_0x1a84a6(0x4a5)]() - this[_0x1a84a6(0x7f1)]() * 0x2;
    this[_0x1a84a6(0x566)](_0x4efc72, _0x5ea768, _0x13959e, _0x5a8eea, ![]);
  }),
  (Window_EquipStatus[_0x17b060(0x54a)][_0x17b060(0xe3)] = function (_0x3ed45d, _0x4674e8, _0x2fdadd) {
    const _0x1a5cc9 = _0x17b060,
      _0x112e19 = this[_0x1a5cc9(0x77b)]();
    this[_0x1a5cc9(0x176)](), this['drawText'](this[_0x1a5cc9(0x2f3)][_0x1a5cc9(0x4d4)](_0x2fdadd, !![]), _0x3ed45d, _0x4674e8, _0x112e19, _0x1a5cc9(0x512));
  }),
  (Window_EquipStatus[_0x17b060(0x54a)][_0x17b060(0x38d)] = function (_0x45102b, _0x5a9354) {
    const _0x3a8b75 = _0x17b060,
      _0x397542 = this[_0x3a8b75(0x3f3)]();
    this[_0x3a8b75(0x6f1)](ColorManager[_0x3a8b75(0x4ca)]());
    const _0x2fef3c = VisuMZ['CoreEngine'][_0x3a8b75(0x382)]['UI'][_0x3a8b75(0x73a)];
    this[_0x3a8b75(0x1a9)](_0x2fef3c, _0x45102b, _0x5a9354, _0x397542, _0x3a8b75(0x27e));
  }),
  (Window_EquipStatus[_0x17b060(0x54a)][_0x17b060(0x48d)] = function (_0x22abfc, _0x5bc0fa, _0x4e4f4c) {
    const _0xc9d3bb = _0x17b060,
      _0x4e16ea = this[_0xc9d3bb(0x77b)](),
      _0x53a635 = this[_0xc9d3bb(0x4fd)][_0xc9d3bb(0x4d4)](_0x4e4f4c),
      _0xf534c8 = _0x53a635 - this[_0xc9d3bb(0x2f3)][_0xc9d3bb(0x4d4)](_0x4e4f4c);
    this[_0xc9d3bb(0x6f1)](ColorManager[_0xc9d3bb(0x7f5)](_0xf534c8)),
      this[_0xc9d3bb(0x1a9)](this[_0xc9d3bb(0x4fd)][_0xc9d3bb(0x4d4)](_0x4e4f4c, !![]), _0x22abfc, _0x5bc0fa, _0x4e16ea, _0xc9d3bb(0x512));
  }),
  (VisuMZ['CoreEngine']['Window_EquipItem_isEnabled'] = Window_EquipItem[_0x17b060(0x54a)][_0x17b060(0x403)]),
  (Window_EquipItem['prototype'][_0x17b060(0x403)] = function (_0x3fa86b) {
    const _0x5c5baa = _0x17b060;
    return _0x3fa86b && this['_actor'] ? this['_actor'][_0x5c5baa(0x20f)](_0x3fa86b) : VisuMZ['CoreEngine'][_0x5c5baa(0x27b)][_0x5c5baa(0x64e)](this, _0x3fa86b);
  }),
  (Window_StatusParams[_0x17b060(0x54a)][_0x17b060(0x162)] = function () {
    const _0x2cae27 = _0x17b060;
    return VisuMZ['CoreEngine'][_0x2cae27(0x382)][_0x2cae27(0x71d)][_0x2cae27(0x449)]['length'];
  }),
  (Window_StatusParams['prototype'][_0x17b060(0x272)] = function (_0x6464a9) {
    const _0x50e937 = _0x17b060,
      _0x4e55fd = this[_0x50e937(0x13c)](_0x6464a9),
      _0x5426fa = VisuMZ['CoreEngine']['Settings']['Param'][_0x50e937(0x449)][_0x6464a9],
      _0x24023b = TextManager['param'](_0x5426fa),
      _0x547ff5 = this[_0x50e937(0x2f3)][_0x50e937(0x4d4)](_0x5426fa, !![]);
    this[_0x50e937(0x566)](_0x4e55fd['x'], _0x4e55fd['y'], 0xa0, _0x5426fa, ![]),
      this['resetTextColor'](),
      this[_0x50e937(0x1a9)](_0x547ff5, _0x4e55fd['x'] + 0xa0, _0x4e55fd['y'], 0x3c, _0x50e937(0x512));
  });
if (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x197)][_0x17b060(0x3d1)]) {
  VisuMZ[_0x17b060(0x77a)]['Settings']['KeyboardInput'][_0x17b060(0x876)] &&
    (Window_NameInput['LATIN1'] = [
      'Q',
      'W',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P',
      'A',
      'S',
      'D',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      '\x27',
      '`',
      'Z',
      'X',
      'C',
      'V',
      'B',
      'N',
      'M',
      ',',
      '.',
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ':',
      '~',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      '\x22',
      ';',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '<',
      '>',
      '[',
      ']',
      '-',
      '_',
      '/',
      '\x20',
      _0x17b060(0x227),
      'OK',
    ]);
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0xe9)] = Window_NameInput[_0x17b060(0x54a)]['initialize']),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x40c0eb) {
      const _0x58b533 = _0x17b060;
      (this['_mode'] = this['defaultInputMode']()),
        VisuMZ['CoreEngine'][_0x58b533(0xe9)]['call'](this, _0x40c0eb),
        this['_mode'] === _0x58b533(0x315) ? this[_0x58b533(0x67c)](0x0) : (Input[_0x58b533(0x2d5)](), this[_0x58b533(0x7a4)]());
    }),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x108)] = function () {
      const _0x5d234b = _0x17b060;
      if (Input[_0x5d234b(0x4b9)]()) return _0x5d234b(0x315);
      return VisuMZ[_0x5d234b(0x77a)][_0x5d234b(0x382)]['KeyboardInput']['DefaultMode'] || 'keyboard';
    }),
    (VisuMZ['CoreEngine'][_0x17b060(0x5ba)] = Window_NameInput['prototype'][_0x17b060(0x72a)]),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x72a)] = function () {
      const _0x208e50 = _0x17b060;
      if (!this['isOpen']()) return;
      if (!this[_0x208e50(0x12f)]) return;
      if (this['_mode'] === 'keyboard' && Input[_0x208e50(0x6d7)]()) this['switchModes'](_0x208e50(0x315));
      else {
        if (Input[_0x208e50(0x2a3)]('backspace')) Input['clear'](), this[_0x208e50(0x457)]();
        else {
          if (Input[_0x208e50(0x301)]('tab')) Input[_0x208e50(0x2d5)](), this['_mode'] === _0x208e50(0x364) ? this[_0x208e50(0x4b8)]('default') : this[_0x208e50(0x4b8)](_0x208e50(0x364));
          else {
            if (this[_0x208e50(0x440)] === _0x208e50(0x364)) this[_0x208e50(0x3bd)]();
            else Input[_0x208e50(0x2a3)]('escape') ? (Input[_0x208e50(0x2d5)](), this['switchModes'](_0x208e50(0x364))) : VisuMZ['CoreEngine'][_0x208e50(0x5ba)][_0x208e50(0x64e)](this);
          }
        }
      }
    }),
    (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x160)] = Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x23c)]),
    (Window_NameInput['prototype'][_0x17b060(0x23c)] = function () {
      const _0x4ec1ee = _0x17b060;
      if (!this[_0x4ec1ee(0x1e9)]()) return;
      if (this[_0x4ec1ee(0x440)] === _0x4ec1ee(0x364)) {
        if (TouchInput[_0x4ec1ee(0x301)]() && this[_0x4ec1ee(0x64f)]()) this['switchModes'](_0x4ec1ee(0x315));
        else TouchInput[_0x4ec1ee(0x679)]() && this['switchModes'](_0x4ec1ee(0x315));
      } else VisuMZ['CoreEngine'][_0x4ec1ee(0x160)][_0x4ec1ee(0x64e)](this);
    }),
    (Window_NameInput[_0x17b060(0x54a)]['processKeyboardHandling'] = function () {
      const _0x18ca6f = _0x17b060;
      if (Input['isSpecialCode'](_0x18ca6f(0x746))) Input[_0x18ca6f(0x2d5)](), this[_0x18ca6f(0x414)]();
      else {
        if (Input['_inputString'] !== undefined) {
          let _0x55234e = Input[_0x18ca6f(0x2d3)],
            _0x4e5fe6 = _0x55234e['length'];
          for (let _0x130a71 = 0x0; _0x130a71 < _0x4e5fe6; ++_0x130a71) {
            this['_editWindow']['add'](_0x55234e[_0x130a71]) ? SoundManager[_0x18ca6f(0x8ba)]() : SoundManager[_0x18ca6f(0x217)]();
          }
          Input[_0x18ca6f(0x2d5)]();
        }
      }
    }),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x4b8)] = function (_0x48459f) {
      const _0x4848b4 = _0x17b060;
      let _0x2443d5 = this[_0x4848b4(0x440)];
      (this['_mode'] = _0x48459f),
        _0x2443d5 !== this[_0x4848b4(0x440)] && (this[_0x4848b4(0x80e)](), SoundManager[_0x4848b4(0x8ba)](), this[_0x4848b4(0x440)] === 'default' ? this['select'](0x0) : this[_0x4848b4(0x67c)](-0x1));
    }),
    (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x87e)] = Window_NameInput[_0x17b060(0x54a)]['cursorDown']),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x4cc)] = function (_0x1fcfd8) {
      const _0x419e68 = _0x17b060;
      if (this[_0x419e68(0x440)] === 'keyboard' && !Input[_0x419e68(0x34a)]()) return;
      if (Input['isNumpadPressed']()) return;
      VisuMZ[_0x419e68(0x77a)][_0x419e68(0x87e)][_0x419e68(0x64e)](this, _0x1fcfd8), this[_0x419e68(0x4b8)](_0x419e68(0x315));
    }),
    (VisuMZ[_0x17b060(0x77a)]['Window_NameInput_cursorUp'] = Window_NameInput['prototype'][_0x17b060(0x4c3)]),
    (Window_NameInput['prototype'][_0x17b060(0x4c3)] = function (_0x4e648f) {
      const _0x26ba1f = _0x17b060;
      if (this['_mode'] === 'keyboard' && !Input[_0x26ba1f(0x34a)]()) return;
      if (Input[_0x26ba1f(0x5bc)]()) return;
      VisuMZ[_0x26ba1f(0x77a)]['Window_NameInput_cursorUp'][_0x26ba1f(0x64e)](this, _0x4e648f), this[_0x26ba1f(0x4b8)](_0x26ba1f(0x315));
    }),
    (VisuMZ['CoreEngine'][_0x17b060(0x2ae)] = Window_NameInput[_0x17b060(0x54a)]['cursorRight']),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x4ea)] = function (_0x22cda8) {
      const _0x127e20 = _0x17b060;
      if (this[_0x127e20(0x440)] === _0x127e20(0x364) && !Input[_0x127e20(0x34a)]()) return;
      if (Input['isNumpadPressed']()) return;
      VisuMZ[_0x127e20(0x77a)][_0x127e20(0x2ae)][_0x127e20(0x64e)](this, _0x22cda8), this[_0x127e20(0x4b8)](_0x127e20(0x315));
    }),
    (VisuMZ['CoreEngine'][_0x17b060(0x167)] = Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x76f)]),
    (Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x76f)] = function (_0x149c00) {
      const _0x30df40 = _0x17b060;
      if (this[_0x30df40(0x440)] === _0x30df40(0x364) && !Input[_0x30df40(0x34a)]()) return;
      if (Input[_0x30df40(0x5bc)]()) return;
      VisuMZ['CoreEngine'][_0x30df40(0x167)][_0x30df40(0x64e)](this, _0x149c00), this[_0x30df40(0x4b8)](_0x30df40(0x315));
    }),
    (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x864)] = Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x10f)]),
    (Window_NameInput[_0x17b060(0x54a)]['cursorPagedown'] = function () {
      const _0x593c48 = _0x17b060;
      if (this[_0x593c48(0x440)] === _0x593c48(0x364)) return;
      if (Input[_0x593c48(0x5bc)]()) return;
      VisuMZ[_0x593c48(0x77a)]['Window_NameInput_cursorPagedown'][_0x593c48(0x64e)](this), this[_0x593c48(0x4b8)](_0x593c48(0x315));
    }),
    (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x4fe)] = Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x472)]),
    (Window_NameInput[_0x17b060(0x54a)]['cursorPageup'] = function () {
      const _0x18245c = _0x17b060;
      if (this[_0x18245c(0x440)] === _0x18245c(0x364)) return;
      if (Input[_0x18245c(0x5bc)]()) return;
      VisuMZ[_0x18245c(0x77a)][_0x18245c(0x4fe)][_0x18245c(0x64e)](this), this[_0x18245c(0x4b8)](_0x18245c(0x315));
    }),
    (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x638)] = Window_NameInput[_0x17b060(0x54a)][_0x17b060(0x80e)]),
    (Window_NameInput['prototype']['refresh'] = function () {
      const _0x4e1159 = _0x17b060;
      if (this['_mode'] === _0x4e1159(0x364)) {
        this[_0x4e1159(0x16e)][_0x4e1159(0x2d5)](), this[_0x4e1159(0x26d)][_0x4e1159(0x2d5)](), this['resetTextColor']();
        let _0x16a10c = VisuMZ['CoreEngine'][_0x4e1159(0x382)][_0x4e1159(0x197)][_0x4e1159(0x212)][_0x4e1159(0x60b)]('\x0a'),
          _0x295dd7 = _0x16a10c[_0x4e1159(0x540)],
          _0x26e460 = (this[_0x4e1159(0x64b)] - _0x295dd7 * this['lineHeight']()) / 0x2;
        for (let _0x8fc7fe = 0x0; _0x8fc7fe < _0x295dd7; ++_0x8fc7fe) {
          let _0x2f88fd = _0x16a10c[_0x8fc7fe],
            _0x5329bc = this[_0x4e1159(0x22e)](_0x2f88fd)[_0x4e1159(0x321)],
            _0x311225 = Math['floor']((this[_0x4e1159(0x16e)][_0x4e1159(0x321)] - _0x5329bc) / 0x2);
          this[_0x4e1159(0x489)](_0x2f88fd, _0x311225, _0x26e460), (_0x26e460 += this['lineHeight']());
        }
      } else VisuMZ[_0x4e1159(0x77a)]['Window_NameInput_refresh'][_0x4e1159(0x64e)](this);
    });
}
(VisuMZ['CoreEngine'][_0x17b060(0x4a6)] = Window_ShopSell[_0x17b060(0x54a)]['isEnabled']),
  (Window_ShopSell['prototype'][_0x17b060(0x403)] = function (_0x399e9b) {
    const _0x41b716 = _0x17b060;
    return VisuMZ[_0x41b716(0x77a)][_0x41b716(0x382)][_0x41b716(0x7ae)]['KeyItemProtect'] && DataManager[_0x41b716(0x88e)](_0x399e9b)
      ? ![]
      : VisuMZ[_0x41b716(0x77a)][_0x41b716(0x4a6)][_0x41b716(0x64e)](this, _0x399e9b);
  }),
  (Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x6ff)] = function () {
    return ![];
  });
VisuMZ[_0x17b060(0x77a)]['Settings'][_0x17b060(0x197)][_0x17b060(0x39e)] &&
  ((VisuMZ[_0x17b060(0x77a)]['Window_NumberInput_start'] = Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x6ae)]),
  (Window_NumberInput['prototype'][_0x17b060(0x6ae)] = function () {
    const _0x3019db = _0x17b060;
    VisuMZ[_0x3019db(0x77a)][_0x3019db(0x559)][_0x3019db(0x64e)](this), this[_0x3019db(0x67c)](this[_0x3019db(0x354)] - 0x1), Input[_0x3019db(0x2d5)]();
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x58d)] = Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x829)]),
  (Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x829)] = function () {
    const _0x51d68c = _0x17b060;
    if (!this[_0x51d68c(0x1e9)]()) return;
    if (Input[_0x51d68c(0x5bc)]()) this[_0x51d68c(0x164)]();
    else {
      if (Input['isSpecialCode']('backspace')) this[_0x51d68c(0x740)]();
      else {
        if (Input[_0x51d68c(0x568)] === 0x2e) this['processKeyboardDelete']();
        else {
          if (Input[_0x51d68c(0x568)] === 0x24) this[_0x51d68c(0x1a3)]();
          else Input[_0x51d68c(0x568)] === 0x23 ? this['processKeyboardEnd']() : VisuMZ[_0x51d68c(0x77a)][_0x51d68c(0x58d)][_0x51d68c(0x64e)](this);
        }
      }
    }
  }),
  (Window_NumberInput['prototype']['processCursorMove'] = function () {
    const _0x36a640 = _0x17b060;
    if (!this[_0x36a640(0x173)]()) return;
    Input[_0x36a640(0x5bc)]() ? this[_0x36a640(0x164)]() : Window_Selectable['prototype']['processCursorMove']['call'](this);
  }),
  (Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x1cd)] = function () {}),
  (Window_NumberInput[_0x17b060(0x54a)]['processKeyboardDigitChange'] = function () {
    const _0x2d753d = _0x17b060;
    if (String(this['_number'])[_0x2d753d(0x540)] >= this[_0x2d753d(0x354)]) return;
    const _0x2b2ac3 = Number(String(this['_number']) + Input[_0x2d753d(0x2d3)]);
    if (isNaN(_0x2b2ac3)) return;
    this[_0x2d753d(0x74c)] = _0x2b2ac3;
    const _0x40a709 = '9'[_0x2d753d(0x335)](this[_0x2d753d(0x354)]);
    (this['_number'] = this[_0x2d753d(0x74c)][_0x2d753d(0x42b)](0x0, _0x40a709)),
      Input['clear'](),
      this[_0x2d753d(0x80e)](),
      SoundManager[_0x2d753d(0x333)](),
      this[_0x2d753d(0x67c)](this[_0x2d753d(0x354)] - 0x1);
  }),
  (Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x740)] = function () {
    const _0x51a750 = _0x17b060;
    (this[_0x51a750(0x74c)] = Number(String(this[_0x51a750(0x74c)])[_0x51a750(0x152)](0x0, -0x1))),
      (this[_0x51a750(0x74c)] = Math[_0x51a750(0x7f9)](0x0, this[_0x51a750(0x74c)])),
      Input[_0x51a750(0x2d5)](),
      this[_0x51a750(0x80e)](),
      SoundManager[_0x51a750(0x333)](),
      this[_0x51a750(0x67c)](this[_0x51a750(0x354)] - 0x1);
  }),
  (Window_NumberInput['prototype'][_0x17b060(0x19b)] = function () {
    const _0x2a0ce1 = _0x17b060;
    (this['_number'] = Number(String(this[_0x2a0ce1(0x74c)])[_0x2a0ce1(0x223)](0x1))),
      (this[_0x2a0ce1(0x74c)] = Math[_0x2a0ce1(0x7f9)](0x0, this[_0x2a0ce1(0x74c)])),
      Input['clear'](),
      this[_0x2a0ce1(0x80e)](),
      SoundManager[_0x2a0ce1(0x333)](),
      this[_0x2a0ce1(0x67c)](this[_0x2a0ce1(0x354)] - 0x1);
  }),
  (Window_NumberInput[_0x17b060(0x54a)][_0x17b060(0x1a3)] = function () {
    const _0x3ec5d4 = _0x17b060;
    if (this[_0x3ec5d4(0x79e)]() === 0x0) return;
    Input[_0x3ec5d4(0x2d5)](), this[_0x3ec5d4(0x80e)](), SoundManager[_0x3ec5d4(0x333)](), this[_0x3ec5d4(0x67c)](0x0);
  }),
  (Window_NumberInput[_0x17b060(0x54a)]['processKeyboardEnd'] = function () {
    const _0xd6ad00 = _0x17b060;
    if (this[_0xd6ad00(0x79e)]() === this['_maxDigits'] - 0x1) return;
    Input[_0xd6ad00(0x2d5)](), this[_0xd6ad00(0x80e)](), SoundManager[_0xd6ad00(0x333)](), this[_0xd6ad00(0x67c)](this[_0xd6ad00(0x354)] - 0x1);
  }));
(VisuMZ[_0x17b060(0x77a)]['Window_MapName_refresh'] = Window_MapName[_0x17b060(0x54a)]['refresh']),
  (Window_MapName[_0x17b060(0x54a)][_0x17b060(0x80e)] = function () {
    const _0x22b8cc = _0x17b060;
    VisuMZ[_0x22b8cc(0x77a)]['Settings'][_0x22b8cc(0x7ae)]['MapNameTextCode'] ? this[_0x22b8cc(0x7b6)]() : VisuMZ[_0x22b8cc(0x77a)][_0x22b8cc(0x541)]['call'](this);
  }),
  (Window_MapName[_0x17b060(0x54a)]['refreshWithTextCodeSupport'] = function () {
    const _0xd20f01 = _0x17b060;
    this[_0xd20f01(0x16e)][_0xd20f01(0x2d5)]();
    if ($gameMap[_0xd20f01(0x5a9)]()) {
      const _0xbff367 = this[_0xd20f01(0x547)];
      this[_0xd20f01(0x384)](0x0, 0x0, _0xbff367, this[_0xd20f01(0x835)]());
      const _0x51062f = this['textSizeEx']($gameMap[_0xd20f01(0x5a9)]())[_0xd20f01(0x321)];
      this[_0xd20f01(0x489)]($gameMap['displayName'](), Math[_0xd20f01(0x221)]((_0xbff367 - _0x51062f) / 0x2), 0x0);
    }
  }),
  (Window_TitleCommand[_0x17b060(0x4b3)] = VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x593)]),
  (Window_TitleCommand[_0x17b060(0x54a)][_0x17b060(0x3aa)] = function () {
    const _0x5ad3c3 = _0x17b060;
    this[_0x5ad3c3(0x2e3)]();
  }),
  (Window_TitleCommand['prototype'][_0x17b060(0x2e3)] = function () {
    const _0x4f6441 = _0x17b060;
    for (const _0x426847 of Window_TitleCommand[_0x4f6441(0x4b3)]) {
      if (_0x426847[_0x4f6441(0x27a)][_0x4f6441(0x64e)](this)) {
        const _0x39806b = _0x426847['Symbol'];
        let _0x12027b = _0x426847[_0x4f6441(0x294)];
        if (['', _0x4f6441(0x1ce)][_0x4f6441(0x1ae)](_0x12027b)) _0x12027b = _0x426847[_0x4f6441(0x447)]['call'](this);
        const _0xa8032 = _0x426847['EnableJS'][_0x4f6441(0x64e)](this),
          _0x5ddaf8 = _0x426847[_0x4f6441(0x575)][_0x4f6441(0x64e)](this);
        this[_0x4f6441(0x371)](_0x12027b, _0x39806b, _0xa8032, _0x5ddaf8), this[_0x4f6441(0x3f2)](_0x39806b, _0x426847[_0x4f6441(0x177)][_0x4f6441(0x76d)](this, _0x5ddaf8));
      }
    }
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x84b)] = Window_TitleCommand[_0x17b060(0x54a)]['selectLast']),
  (Window_TitleCommand[_0x17b060(0x54a)][_0x17b060(0x2df)] = function () {
    const _0x398adf = _0x17b060;
    VisuMZ['CoreEngine']['Window_TitleCommand_selectLast'][_0x398adf(0x64e)](this);
    if (!Window_TitleCommand[_0x398adf(0x332)]) return;
    const _0x13234b = this['findSymbol'](Window_TitleCommand['_lastCommandSymbol']),
      _0x1b5ad5 = Math[_0x398adf(0x221)](this[_0x398adf(0x5f6)]() / 0x2) - 0x1;
    this[_0x398adf(0x45f)](_0x13234b), this[_0x398adf(0x8a1)] > 0x1 && ((this[_0x398adf(0x8a1)] = 0x1), this['updateSmoothScroll']()), this[_0x398adf(0x37e)](_0x13234b - _0x1b5ad5);
  }),
  (Window_GameEnd[_0x17b060(0x4b3)] = VisuMZ[_0x17b060(0x77a)]['Settings']['MenuLayout'][_0x17b060(0x228)]['CommandList']),
  (Window_GameEnd[_0x17b060(0x54a)][_0x17b060(0x3aa)] = function () {
    const _0x3af7bf = _0x17b060;
    this[_0x3af7bf(0x2e3)]();
  }),
  (Window_GameEnd[_0x17b060(0x54a)][_0x17b060(0x2e3)] = function () {
    const _0x11dd4c = _0x17b060;
    for (const _0x208bf1 of Window_GameEnd[_0x11dd4c(0x4b3)]) {
      if (_0x208bf1[_0x11dd4c(0x27a)][_0x11dd4c(0x64e)](this)) {
        const _0x4fb797 = _0x208bf1[_0x11dd4c(0x438)];
        let _0x432d41 = _0x208bf1[_0x11dd4c(0x294)];
        if (['', _0x11dd4c(0x1ce)][_0x11dd4c(0x1ae)](_0x432d41)) _0x432d41 = _0x208bf1[_0x11dd4c(0x447)][_0x11dd4c(0x64e)](this);
        const _0xae8130 = _0x208bf1[_0x11dd4c(0x7b2)][_0x11dd4c(0x64e)](this),
          _0x128343 = _0x208bf1[_0x11dd4c(0x575)][_0x11dd4c(0x64e)](this);
        this[_0x11dd4c(0x371)](_0x432d41, _0x4fb797, _0xae8130, _0x128343), this[_0x11dd4c(0x3f2)](_0x4fb797, _0x208bf1['CallHandlerJS']['bind'](this, _0x128343));
      }
    }
  });
function Window_ButtonAssist() {
  this['initialize'](...arguments);
}
(Window_ButtonAssist[_0x17b060(0x54a)] = Object[_0x17b060(0x3f6)](Window_Base[_0x17b060(0x54a)])),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x60c)] = Window_ButtonAssist),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function (_0x4ad60c) {
    const _0x4ce15d = _0x17b060;
    (this[_0x4ce15d(0xf3)] = {}),
      Window_Base[_0x4ce15d(0x54a)][_0x4ce15d(0x3e0)][_0x4ce15d(0x64e)](this, _0x4ad60c),
      this[_0x4ce15d(0x12d)](VisuMZ['CoreEngine']['Settings'][_0x4ce15d(0x862)][_0x4ce15d(0x12b)] || 0x0),
      this[_0x4ce15d(0x80e)]();
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x7d7)] = function () {
    const _0x241b62 = _0x17b060;
    this[_0x241b62(0x16e)][_0x241b62(0xf8)] <= 0x60 && (this['contents']['fontSize'] += 0x6);
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x83b)] = function () {
    const _0x345bb5 = _0x17b060;
    this[_0x345bb5(0x16e)][_0x345bb5(0xf8)] >= 0x18 && (this[_0x345bb5(0x16e)][_0x345bb5(0xf8)] -= 0x6);
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0xddb5b6 = _0x17b060;
    Window_Base[_0xddb5b6(0x54a)][_0xddb5b6(0x319)]['call'](this), this['updateKeyText']();
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)]['updatePadding'] = function () {
    const _0x1f198e = _0x17b060;
    this[_0x1f198e(0x804)] = SceneManager['_scene'][_0x1f198e(0x672)]() !== _0x1f198e(0x139) ? 0x0 : 0x8;
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)][_0x17b060(0x792)] = function () {
    const _0x4f9e8c = _0x17b060,
      _0xdf4b31 = SceneManager[_0x4f9e8c(0x2f9)];
    for (let _0x28b4b4 = 0x1; _0x28b4b4 <= 0x5; _0x28b4b4++) {
      if (this[_0x4f9e8c(0xf3)][_0x4f9e8c(0x4f3)['format'](_0x28b4b4)] !== _0xdf4b31[_0x4f9e8c(0x6e1)[_0x4f9e8c(0x1df)](_0x28b4b4)]()) return this[_0x4f9e8c(0x80e)]();
      if (this[_0x4f9e8c(0xf3)]['text%1'[_0x4f9e8c(0x1df)](_0x28b4b4)] !== _0xdf4b31[_0x4f9e8c(0x72b)[_0x4f9e8c(0x1df)](_0x28b4b4)]()) return this[_0x4f9e8c(0x80e)]();
    }
  }),
  (Window_ButtonAssist['prototype'][_0x17b060(0x80e)] = function () {
    const _0x5a64c8 = _0x17b060;
    this['contents'][_0x5a64c8(0x2d5)]();
    for (let _0xee5f7c = 0x1; _0xee5f7c <= 0x5; _0xee5f7c++) {
      this['drawSegment'](_0xee5f7c);
    }
  }),
  (Window_ButtonAssist[_0x17b060(0x54a)]['drawSegment'] = function (_0x642d6f) {
    const _0x234cee = _0x17b060,
      _0x89393a = this[_0x234cee(0x547)] / 0x5,
      _0x21bead = SceneManager[_0x234cee(0x2f9)],
      _0x101880 = _0x21bead[_0x234cee(0x6e1)[_0x234cee(0x1df)](_0x642d6f)](),
      _0x26ef36 = _0x21bead[_0x234cee(0x72b)['format'](_0x642d6f)]();
    (this[_0x234cee(0xf3)][_0x234cee(0x4f3)[_0x234cee(0x1df)](_0x642d6f)] = _0x101880), (this[_0x234cee(0xf3)][_0x234cee(0x17f)[_0x234cee(0x1df)](_0x642d6f)] = _0x26ef36);
    if (_0x101880 === '') return;
    if (_0x26ef36 === '') return;
    const _0x4a852d = _0x21bead[_0x234cee(0x270)[_0x234cee(0x1df)](_0x642d6f)](),
      _0x21025d = this['itemPadding'](),
      _0x14900a = _0x89393a * (_0x642d6f - 0x1) + _0x21025d + _0x4a852d,
      _0x48cf85 = VisuMZ['CoreEngine']['Settings']['ButtonAssist'][_0x234cee(0x21c)];
    this[_0x234cee(0x489)](_0x48cf85['format'](_0x101880, _0x26ef36), _0x14900a, 0x0, _0x89393a - _0x21025d * 0x2);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x7a5)] = Game_Interpreter[_0x17b060(0x54a)]['updateWaitMode']),
  (Game_Interpreter['prototype']['updateWaitMode'] = function () {
    const _0x152eac = _0x17b060;
    if ($gameTemp[_0x152eac(0x35f)] !== undefined) return VisuMZ['CoreEngine'][_0x152eac(0x37b)]();
    return VisuMZ[_0x152eac(0x77a)][_0x152eac(0x7a5)][_0x152eac(0x64e)](this);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x37b)] = function () {
    const _0x38ba2b = _0x17b060,
      _0x1ddb80 = $gameTemp[_0x38ba2b(0x35f)] || 0x0;
    (_0x1ddb80 < 0x0 || _0x1ddb80 > 0x64 || TouchInput['isCancelled']() || Input['isTriggered']('cancel')) &&
      (($gameTemp['_pictureCoordinatesMode'] = undefined), Input[_0x38ba2b(0x2d5)](), TouchInput[_0x38ba2b(0x2d5)]());
    const _0xa76341 = $gameScreen[_0x38ba2b(0x786)](_0x1ddb80);
    return _0xa76341 && ((_0xa76341['_x'] = TouchInput['_x']), (_0xa76341['_y'] = TouchInput['_y'])), VisuMZ[_0x38ba2b(0x77a)]['updatePictureCoordinates'](), $gameTemp[_0x38ba2b(0x35f)] !== undefined;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x324)] = function () {
    const _0x369424 = _0x17b060,
      _0x355ed0 = SceneManager[_0x369424(0x2f9)];
    if (!_0x355ed0) return;
    !_0x355ed0[_0x369424(0x705)] && (SoundManager[_0x369424(0x463)](), (_0x355ed0[_0x369424(0x705)] = new Window_PictureCoordinates()), _0x355ed0['addChild'](_0x355ed0['_pictureCoordinatesWindow'])),
      $gameTemp[_0x369424(0x35f)] === undefined && (SoundManager['playCancel'](), _0x355ed0['removeChild'](_0x355ed0[_0x369424(0x705)]), (_0x355ed0[_0x369424(0x705)] = undefined));
  });
function Window_PictureCoordinates() {
  const _0x413aea = _0x17b060;
  this[_0x413aea(0x3e0)](...arguments);
}
(Window_PictureCoordinates[_0x17b060(0x54a)] = Object['create'](Window_Base[_0x17b060(0x54a)])),
  (Window_PictureCoordinates[_0x17b060(0x54a)][_0x17b060(0x60c)] = Window_PictureCoordinates),
  (Window_PictureCoordinates[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function () {
    const _0x3a234d = _0x17b060;
    (this[_0x3a234d(0x151)] = 'nah'), (this[_0x3a234d(0x807)] = 'nah'), (this[_0x3a234d(0x6f5)] = 'nah');
    const _0x25b8dc = this[_0x3a234d(0x5fe)]();
    Window_Base['prototype'][_0x3a234d(0x3e0)][_0x3a234d(0x64e)](this, _0x25b8dc), this[_0x3a234d(0x12d)](0x2);
  }),
  (Window_PictureCoordinates['prototype'][_0x17b060(0x5fe)] = function () {
    const _0x49c5fb = _0x17b060;
    let _0x1d5f56 = 0x0,
      _0x4d65b1 = Graphics[_0x49c5fb(0x2c5)] - this[_0x49c5fb(0x835)](),
      _0x1eb384 = Graphics['width'],
      _0x5442e7 = this[_0x49c5fb(0x835)]();
    return new Rectangle(_0x1d5f56, _0x4d65b1, _0x1eb384, _0x5442e7);
  }),
  (Window_PictureCoordinates[_0x17b060(0x54a)][_0x17b060(0x422)] = function () {
    const _0x3ab085 = _0x17b060;
    this[_0x3ab085(0x804)] = 0x0;
  }),
  (Window_PictureCoordinates[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0xb5cea4 = _0x17b060;
    Window_Base['prototype'][_0xb5cea4(0x319)][_0xb5cea4(0x64e)](this), this[_0xb5cea4(0x5d4)]();
  }),
  (Window_PictureCoordinates[_0x17b060(0x54a)][_0x17b060(0x5d4)] = function () {
    if (!this['needsUpdate']()) return;
    this['refresh']();
  }),
  (Window_PictureCoordinates['prototype'][_0x17b060(0x44d)] = function () {
    const _0x40d8ca = _0x17b060,
      _0x252f6c = $gameTemp['_pictureCoordinatesMode'],
      _0x4a03e7 = $gameScreen[_0x40d8ca(0x786)](_0x252f6c);
    return _0x4a03e7 ? this[_0x40d8ca(0x151)] !== _0x4a03e7[_0x40d8ca(0x684)] || this[_0x40d8ca(0x807)] !== _0x4a03e7['_x'] || this[_0x40d8ca(0x6f5)] !== _0x4a03e7['_y'] : ![];
  }),
  (Window_PictureCoordinates['prototype'][_0x17b060(0x80e)] = function () {
    const _0x582af4 = _0x17b060;
    this[_0x582af4(0x16e)][_0x582af4(0x2d5)]();
    const _0x60d73d = $gameTemp[_0x582af4(0x35f)],
      _0x5cad2e = $gameScreen[_0x582af4(0x786)](_0x60d73d);
    if (!_0x5cad2e) return;
    (this['_lastOrigin'] = _0x5cad2e[_0x582af4(0x684)]), (this['_lastX'] = _0x5cad2e['_x']), (this[_0x582af4(0x6f5)] = _0x5cad2e['_y']);
    const _0x10956b = ColorManager['itemBackColor1']();
    this[_0x582af4(0x16e)][_0x582af4(0x456)](0x0, 0x0, this[_0x582af4(0x547)], this[_0x582af4(0x64b)], _0x10956b);
    const _0x490fa3 = _0x582af4(0x265)[_0x582af4(0x1df)](_0x5cad2e['_origin'] === 0x0 ? _0x582af4(0x4af) : _0x582af4(0x380)),
      _0x588ac6 = _0x582af4(0x577)['format'](_0x5cad2e['_x']),
      _0x40da1f = _0x582af4(0xfa)[_0x582af4(0x1df)](_0x5cad2e['_y']),
      _0x1cde39 = _0x582af4(0x42f)[_0x582af4(0x1df)](TextManager[_0x582af4(0x713)](_0x582af4(0x314)));
    let _0x2d2ba2 = Math[_0x582af4(0x221)](this[_0x582af4(0x547)] / 0x4);
    this[_0x582af4(0x1a9)](_0x490fa3, _0x2d2ba2 * 0x0, 0x0, _0x2d2ba2),
      this[_0x582af4(0x1a9)](_0x588ac6, _0x2d2ba2 * 0x1, 0x0, _0x2d2ba2, _0x582af4(0x27e)),
      this[_0x582af4(0x1a9)](_0x40da1f, _0x2d2ba2 * 0x2, 0x0, _0x2d2ba2, _0x582af4(0x27e));
    const _0x5f22fe = this[_0x582af4(0x22e)](_0x1cde39)[_0x582af4(0x321)],
      _0x301e60 = this[_0x582af4(0x547)] - _0x5f22fe;
    this[_0x582af4(0x489)](_0x1cde39, _0x301e60, 0x0, _0x5f22fe);
  });
function Window_TextPopup() {
  const _0x83bdb1 = _0x17b060;
  this[_0x83bdb1(0x3e0)](...arguments);
}
(Window_TextPopup[_0x17b060(0x54a)] = Object[_0x17b060(0x3f6)](Window_Base[_0x17b060(0x54a)])),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x60c)] = Window_TextPopup),
  (Window_TextPopup['SETTINGS'] = {
    framesPerChar: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)]['DurationPerChat'] ?? 1.5,
    framesMin: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x215)] ?? 0x5a,
    framesMax: VisuMZ[_0x17b060(0x77a)][_0x17b060(0x382)][_0x17b060(0x607)][_0x17b060(0x4cb)] ?? 0x12c,
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x3e0)] = function () {
    const _0x58d930 = _0x17b060,
      _0x226bfd = new Rectangle(0x0, 0x0, 0x1, 0x1);
    Window_Base[_0x58d930(0x54a)][_0x58d930(0x3e0)][_0x58d930(0x64e)](this, _0x226bfd),
      (this[_0x58d930(0x141)] = 0x0),
      (this['_text'] = ''),
      (this[_0x58d930(0x24a)] = []),
      (this['_timeDuration'] = 0x0);
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x543)] = function () {
    return !![];
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x582)] = function (_0x214315) {
    const _0x4e48e8 = _0x17b060;
    if (this[_0x4e48e8(0x24a)][this[_0x4e48e8(0x24a)]['length'] - 0x1] === _0x214315) return;
    this['_textQueue'][_0x4e48e8(0x6f2)](_0x214315), SceneManager['_scene'][_0x4e48e8(0x781)](this);
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x319)] = function () {
    const _0x1b74bb = _0x17b060;
    Window_Base['prototype'][_0x1b74bb(0x319)][_0x1b74bb(0x64e)](this), this['updateText'](), this['updateDuration']();
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x3f5)] = function () {
    const _0x293071 = _0x17b060;
    if (this[_0x293071(0x4c2)] !== '') return;
    if (this['_textQueue']['length'] <= 0x0) return;
    if (!this[_0x293071(0x565)]()) return;
    this[_0x293071(0x4c2)] = this[_0x293071(0x24a)][_0x293071(0x7f4)]();
    const _0x2e37b9 = Window_TextPopup[_0x293071(0x5a1)],
      _0x10ea5a = Math[_0x293071(0x720)](this['_text'][_0x293071(0x540)] * _0x2e37b9[_0x293071(0x138)]);
    this[_0x293071(0x3c5)] = _0x10ea5a['clamp'](_0x2e37b9[_0x293071(0x67e)], _0x2e37b9[_0x293071(0x57e)]);
    const _0x1c5b66 = this[_0x293071(0x22e)](this[_0x293071(0x4c2)]);
    let _0x2183e1 = _0x1c5b66['width'] + this[_0x293071(0x7f1)]() * 0x2;
    _0x2183e1 += $gameSystem['windowPadding']() * 0x2;
    let _0xb54f94 = Math[_0x293071(0x7f9)](_0x1c5b66['height'], this['lineHeight']());
    _0xb54f94 += $gameSystem['windowPadding']() * 0x2;
    const _0x55a147 = Math[_0x293071(0x3fe)]((Graphics[_0x293071(0x321)] - _0x2183e1) / 0x2),
      _0x39ee70 = Math[_0x293071(0x3fe)]((Graphics[_0x293071(0x2c5)] - _0xb54f94) / 0x2),
      _0x5d2ffb = new Rectangle(_0x55a147, _0x39ee70, _0x2183e1, _0xb54f94);
    this[_0x293071(0x4f6)](_0x5d2ffb['x'], _0x5d2ffb['y'], _0x5d2ffb['width'], _0x5d2ffb['height']),
      this[_0x293071(0x5f1)](),
      this[_0x293071(0x80e)](),
      this[_0x293071(0x697)](),
      SceneManager[_0x293071(0x2f9)]['addChild'](this);
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x80e)] = function () {
    const _0x10fb83 = _0x17b060,
      _0x3dfb75 = this[_0x10fb83(0x632)]();
    this[_0x10fb83(0x16e)][_0x10fb83(0x2d5)](), this['drawTextEx'](this[_0x10fb83(0x4c2)], _0x3dfb75['x'], _0x3dfb75['y'], _0x3dfb75[_0x10fb83(0x321)]);
  }),
  (Window_TextPopup[_0x17b060(0x54a)][_0x17b060(0x604)] = function () {
    const _0x40985c = _0x17b060;
    if (this[_0x40985c(0x11b)]() || this[_0x40985c(0x3ab)]()) return;
    if (this[_0x40985c(0x3c5)] <= 0x0) return;
    this[_0x40985c(0x3c5)]--, this['_timeDuration'] <= 0x0 && (this[_0x40985c(0x74f)](), (this[_0x40985c(0x4c2)] = ''));
  }),
  (VisuMZ['ShowDevTools'] = function (_0x405341) {
    const _0x233097 = _0x17b060;
    if (Utils[_0x233097(0x201)](_0x233097(0x7e6))) {
      var _0x190372 = require(_0x233097(0xef))[_0x233097(0x607)][_0x233097(0x40d)]();
      SceneManager[_0x233097(0x1b6)]();
      if (_0x405341) setTimeout(_0x190372[_0x233097(0x816)][_0x233097(0x76d)](_0x190372), 0x190);
    }
  }),
  (VisuMZ[_0x17b060(0x30b)] = function (_0x1d315c, _0x1b9af5) {
    const _0x4fb29e = _0x17b060;
    _0x1b9af5 = _0x1b9af5[_0x4fb29e(0x29e)]();
    var _0x4d953c = 1.70158,
      _0x31262c = 0.7;
    switch (_0x1b9af5) {
      case _0x4fb29e(0x258):
        return _0x1d315c;
      case _0x4fb29e(0x557):
        return -0x1 * Math[_0x4fb29e(0x824)](_0x1d315c * (Math['PI'] / 0x2)) + 0x1;
      case 'OUTSINE':
        return Math[_0x4fb29e(0x33a)](_0x1d315c * (Math['PI'] / 0x2));
      case 'INOUTSINE':
        return -0.5 * (Math[_0x4fb29e(0x824)](Math['PI'] * _0x1d315c) - 0x1);
      case 'INQUAD':
        return _0x1d315c * _0x1d315c;
      case _0x4fb29e(0x460):
        return _0x1d315c * (0x2 - _0x1d315c);
      case 'INOUTQUAD':
        return _0x1d315c < 0.5 ? 0x2 * _0x1d315c * _0x1d315c : -0x1 + (0x4 - 0x2 * _0x1d315c) * _0x1d315c;
      case _0x4fb29e(0x7dd):
        return _0x1d315c * _0x1d315c * _0x1d315c;
      case _0x4fb29e(0x41c):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return _0x4e8a72 * _0x4e8a72 * _0x4e8a72 + 0x1;
      case _0x4fb29e(0x57a):
        return _0x1d315c < 0.5 ? 0x4 * _0x1d315c * _0x1d315c * _0x1d315c : (_0x1d315c - 0x1) * (0x2 * _0x1d315c - 0x2) * (0x2 * _0x1d315c - 0x2) + 0x1;
      case _0x4fb29e(0x1c3):
        return _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c;
      case _0x4fb29e(0x508):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return 0x1 - _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72;
      case _0x4fb29e(0x690):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return _0x1d315c < 0.5 ? 0x8 * _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c : 0x1 - 0x8 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72;
      case _0x4fb29e(0x73e):
        return _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c;
      case _0x4fb29e(0x750):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return 0x1 + _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72;
      case _0x4fb29e(0x18d):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return _0x1d315c < 0.5 ? 0x10 * _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c * _0x1d315c : 0x1 + 0x10 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72 * _0x4e8a72;
      case _0x4fb29e(0x4cf):
        if (_0x1d315c === 0x0) return 0x0;
        return Math['pow'](0x2, 0xa * (_0x1d315c - 0x1));
      case 'OUTEXPO':
        if (_0x1d315c === 0x1) return 0x1;
        return -Math['pow'](0x2, -0xa * _0x1d315c) + 0x1;
      case _0x4fb29e(0x739):
        if (_0x1d315c === 0x0 || _0x1d315c === 0x1) return _0x1d315c;
        var _0x2a8baa = _0x1d315c * 0x2,
          _0x2d3f1c = _0x2a8baa - 0x1;
        if (_0x2a8baa < 0x1) return 0.5 * Math['pow'](0x2, 0xa * _0x2d3f1c);
        return 0.5 * (-Math[_0x4fb29e(0x476)](0x2, -0xa * _0x2d3f1c) + 0x2);
      case _0x4fb29e(0x28f):
        var _0x2a8baa = _0x1d315c / 0x1;
        return -0x1 * (Math[_0x4fb29e(0x2b8)](0x1 - _0x2a8baa * _0x1d315c) - 0x1);
      case _0x4fb29e(0x5c2):
        var _0x4e8a72 = _0x1d315c - 0x1;
        return Math[_0x4fb29e(0x2b8)](0x1 - _0x4e8a72 * _0x4e8a72);
      case 'INOUTCIRC':
        var _0x2a8baa = _0x1d315c * 0x2,
          _0x2d3f1c = _0x2a8baa - 0x2;
        if (_0x2a8baa < 0x1) return -0.5 * (Math['sqrt'](0x1 - _0x2a8baa * _0x2a8baa) - 0x1);
        return 0.5 * (Math[_0x4fb29e(0x2b8)](0x1 - _0x2d3f1c * _0x2d3f1c) + 0x1);
      case _0x4fb29e(0x76a):
        return _0x1d315c * _0x1d315c * ((_0x4d953c + 0x1) * _0x1d315c - _0x4d953c);
      case 'OUTBACK':
        var _0x2a8baa = _0x1d315c / 0x1 - 0x1;
        return _0x2a8baa * _0x2a8baa * ((_0x4d953c + 0x1) * _0x2a8baa + _0x4d953c) + 0x1;
      case _0x4fb29e(0x46c):
        var _0x2a8baa = _0x1d315c * 0x2,
          _0x2f97f8 = _0x2a8baa - 0x2,
          _0x52df47 = _0x4d953c * 1.525;
        if (_0x2a8baa < 0x1) return 0.5 * _0x2a8baa * _0x2a8baa * ((_0x52df47 + 0x1) * _0x2a8baa - _0x52df47);
        return 0.5 * (_0x2f97f8 * _0x2f97f8 * ((_0x52df47 + 0x1) * _0x2f97f8 + _0x52df47) + 0x2);
      case _0x4fb29e(0x31f):
        if (_0x1d315c === 0x0 || _0x1d315c === 0x1) return _0x1d315c;
        var _0x2a8baa = _0x1d315c / 0x1,
          _0x2d3f1c = _0x2a8baa - 0x1,
          _0x2c8527 = 0x1 - _0x31262c,
          _0x52df47 = (_0x2c8527 / (0x2 * Math['PI'])) * Math[_0x4fb29e(0x103)](0x1);
        return -(Math[_0x4fb29e(0x476)](0x2, 0xa * _0x2d3f1c) * Math[_0x4fb29e(0x33a)](((_0x2d3f1c - _0x52df47) * (0x2 * Math['PI'])) / _0x2c8527));
      case _0x4fb29e(0x2ee):
        var _0x2c8527 = 0x1 - _0x31262c,
          _0x2a8baa = _0x1d315c * 0x2;
        if (_0x1d315c === 0x0 || _0x1d315c === 0x1) return _0x1d315c;
        var _0x52df47 = (_0x2c8527 / (0x2 * Math['PI'])) * Math[_0x4fb29e(0x103)](0x1);
        return Math[_0x4fb29e(0x476)](0x2, -0xa * _0x2a8baa) * Math['sin'](((_0x2a8baa - _0x52df47) * (0x2 * Math['PI'])) / _0x2c8527) + 0x1;
      case _0x4fb29e(0x1b8):
        var _0x2c8527 = 0x1 - _0x31262c;
        if (_0x1d315c === 0x0 || _0x1d315c === 0x1) return _0x1d315c;
        var _0x2a8baa = _0x1d315c * 0x2,
          _0x2d3f1c = _0x2a8baa - 0x1,
          _0x52df47 = (_0x2c8527 / (0x2 * Math['PI'])) * Math[_0x4fb29e(0x103)](0x1);
        if (_0x2a8baa < 0x1) return -0.5 * (Math['pow'](0x2, 0xa * _0x2d3f1c) * Math[_0x4fb29e(0x33a)](((_0x2d3f1c - _0x52df47) * (0x2 * Math['PI'])) / _0x2c8527));
        return Math[_0x4fb29e(0x476)](0x2, -0xa * _0x2d3f1c) * Math['sin'](((_0x2d3f1c - _0x52df47) * (0x2 * Math['PI'])) / _0x2c8527) * 0.5 + 0x1;
      case _0x4fb29e(0x3bc):
        var _0x2a8baa = _0x1d315c / 0x1;
        if (_0x2a8baa < 0x1 / 2.75) return 7.5625 * _0x2a8baa * _0x2a8baa;
        else {
          if (_0x2a8baa < 0x2 / 2.75) {
            var _0x2f97f8 = _0x2a8baa - 1.5 / 2.75;
            return 7.5625 * _0x2f97f8 * _0x2f97f8 + 0.75;
          } else {
            if (_0x2a8baa < 2.5 / 2.75) {
              var _0x2f97f8 = _0x2a8baa - 2.25 / 2.75;
              return 7.5625 * _0x2f97f8 * _0x2f97f8 + 0.9375;
            } else {
              var _0x2f97f8 = _0x2a8baa - 2.625 / 2.75;
              return 7.5625 * _0x2f97f8 * _0x2f97f8 + 0.984375;
            }
          }
        }
      case _0x4fb29e(0x32a):
        var _0x208c0c = 0x1 - VisuMZ[_0x4fb29e(0x30b)](0x1 - _0x1d315c, _0x4fb29e(0x706));
        return _0x208c0c;
      case 'INOUTBOUNCE':
        if (_0x1d315c < 0.5) var _0x208c0c = VisuMZ[_0x4fb29e(0x30b)](_0x1d315c * 0x2, 'inbounce') * 0.5;
        else var _0x208c0c = VisuMZ[_0x4fb29e(0x30b)](_0x1d315c * 0x2 - 0x1, _0x4fb29e(0x706)) * 0.5 + 0.5;
        return _0x208c0c;
      default:
        return _0x1d315c;
    }
  }),
  (VisuMZ[_0x17b060(0x61c)] = function (_0x2288c7) {
    const _0x5dc83d = _0x17b060;
    _0x2288c7 = String(_0x2288c7)[_0x5dc83d(0x29e)]();
    const _0x1993b7 = VisuMZ[_0x5dc83d(0x77a)][_0x5dc83d(0x382)][_0x5dc83d(0x71d)];
    if (_0x2288c7 === _0x5dc83d(0x3cd)) return _0x1993b7[_0x5dc83d(0x48e)];
    if (_0x2288c7 === _0x5dc83d(0x148)) return _0x1993b7[_0x5dc83d(0x140)];
    if (_0x2288c7 === _0x5dc83d(0x135)) return _0x1993b7[_0x5dc83d(0x5da)];
    if (_0x2288c7 === _0x5dc83d(0x689)) return _0x1993b7['IconParam3'];
    if (_0x2288c7 === _0x5dc83d(0x297)) return _0x1993b7[_0x5dc83d(0x765)];
    if (_0x2288c7 === _0x5dc83d(0x3be)) return _0x1993b7['IconParam5'];
    if (_0x2288c7 === _0x5dc83d(0x30a)) return _0x1993b7['IconParam6'];
    if (_0x2288c7 === _0x5dc83d(0xec)) return _0x1993b7['IconParam7'];
    if (_0x2288c7 === _0x5dc83d(0x889)) return _0x1993b7[_0x5dc83d(0x16c)];
    if (_0x2288c7 === 'EVA') return _0x1993b7['IconXParam1'];
    if (_0x2288c7 === 'CRI') return _0x1993b7[_0x5dc83d(0x44b)];
    if (_0x2288c7 === _0x5dc83d(0x4bb)) return _0x1993b7['IconXParam3'];
    if (_0x2288c7 === _0x5dc83d(0x17d)) return _0x1993b7['IconXParam4'];
    if (_0x2288c7 === _0x5dc83d(0x11f)) return _0x1993b7[_0x5dc83d(0x619)];
    if (_0x2288c7 === 'CNT') return _0x1993b7[_0x5dc83d(0x2c2)];
    if (_0x2288c7 === _0x5dc83d(0x599)) return _0x1993b7[_0x5dc83d(0x112)];
    if (_0x2288c7 === 'MRG') return _0x1993b7[_0x5dc83d(0x524)];
    if (_0x2288c7 === 'TRG') return _0x1993b7[_0x5dc83d(0x203)];
    if (_0x2288c7 === _0x5dc83d(0x260)) return _0x1993b7[_0x5dc83d(0x6df)];
    if (_0x2288c7 === _0x5dc83d(0x1c8)) return _0x1993b7[_0x5dc83d(0x882)];
    if (_0x2288c7 === _0x5dc83d(0x4ec)) return _0x1993b7[_0x5dc83d(0x252)];
    if (_0x2288c7 === _0x5dc83d(0x728)) return _0x1993b7['IconSParam3'];
    if (_0x2288c7 === 'MCR') return _0x1993b7[_0x5dc83d(0x134)];
    if (_0x2288c7 === 'TCR') return _0x1993b7[_0x5dc83d(0x8ab)];
    if (_0x2288c7 === _0x5dc83d(0x11a)) return _0x1993b7[_0x5dc83d(0x887)];
    if (_0x2288c7 === _0x5dc83d(0x121)) return _0x1993b7[_0x5dc83d(0x6ec)];
    if (_0x2288c7 === _0x5dc83d(0x1a8)) return _0x1993b7[_0x5dc83d(0x3c2)];
    if (_0x2288c7 === _0x5dc83d(0x843)) return _0x1993b7[_0x5dc83d(0x3ef)];
    if (VisuMZ[_0x5dc83d(0x77a)][_0x5dc83d(0x5e1)][_0x2288c7]) return VisuMZ[_0x5dc83d(0x77a)][_0x5dc83d(0x5e1)][_0x2288c7] || 0x0;
    return 0x0;
  }),
  (VisuMZ['ConvertNumberToString'] = function (_0x221497, _0x35134e, _0x3a4e19) {
    const _0x2524bd = _0x17b060;
    if (_0x3a4e19 === undefined && _0x221497 % 0x1 === 0x0) return _0x221497;
    if (
      _0x3a4e19 !== undefined &&
      [_0x2524bd(0x3cd), _0x2524bd(0x148), _0x2524bd(0x135), _0x2524bd(0x689), _0x2524bd(0x297), _0x2524bd(0x3be), _0x2524bd(0x30a), _0x2524bd(0xec)][_0x2524bd(0x1ae)](
        String(_0x3a4e19)[_0x2524bd(0x29e)]()['trim'](),
      )
    )
      return _0x221497;
    _0x35134e = _0x35134e || 0x0;
    if (VisuMZ['CoreEngine'][_0x2524bd(0x2ca)][_0x3a4e19])
      return VisuMZ['CoreEngine'][_0x2524bd(0x6f7)][_0x3a4e19] === 'integer' ? _0x221497 : String((_0x221497 * 0x64)[_0x2524bd(0x5b2)](_0x35134e)) + '%';
    return String((_0x221497 * 0x64)[_0x2524bd(0x5b2)](_0x35134e)) + '%';
  }),
  (VisuMZ['GroupDigits'] = function (_0x468fbd) {
    const _0x426005 = _0x17b060;
    _0x468fbd = String(_0x468fbd);
    if (!_0x468fbd) return _0x468fbd;
    if (typeof _0x468fbd !== 'string') return _0x468fbd;
    const _0x288b55 = VisuMZ[_0x426005(0x77a)][_0x426005(0x382)][_0x426005(0x7ae)][_0x426005(0x82b)] || _0x426005(0x6b6),
      _0x5c44d8 = { maximumFractionDigits: 0x6 };
    (_0x468fbd = _0x468fbd[_0x426005(0x39d)](/\[(.*?)\]/g, (_0x38a741, _0x1a1af9) => {
      const _0x5f29e6 = _0x426005;
      return VisuMZ[_0x5f29e6(0x79c)](_0x1a1af9, '[', ']');
    })),
      (_0x468fbd = _0x468fbd[_0x426005(0x39d)](/<(.*?)>/g, (_0x230da8, _0x5915ee) => {
        const _0x5be0aa = _0x426005;
        return VisuMZ[_0x5be0aa(0x79c)](_0x5915ee, '<', '>');
      })),
      (_0x468fbd = _0x468fbd[_0x426005(0x39d)](/\{\{(.*?)\}\}/g, (_0x3fce4e, _0x402ec2) => {
        const _0x5ac686 = _0x426005;
        return VisuMZ[_0x5ac686(0x79c)](_0x402ec2, '', '');
      })),
      (_0x468fbd = _0x468fbd[_0x426005(0x39d)](/(\d+\.?\d*)/g, (_0x1e6b32, _0x887fea) => {
        const _0x4709e6 = _0x426005;
        let _0x2eccca = _0x887fea;
        if (_0x2eccca[0x0] === '0') return _0x2eccca;
        if (_0x2eccca[_0x2eccca[_0x4709e6(0x540)] - 0x1] === '.') return Number(_0x2eccca)['toLocaleString'](_0x288b55, _0x5c44d8) + '.';
        else return _0x2eccca[_0x2eccca[_0x4709e6(0x540)] - 0x1] === ',' ? Number(_0x2eccca)['toLocaleString'](_0x288b55, _0x5c44d8) + ',' : Number(_0x2eccca)[_0x4709e6(0x13d)](_0x288b55, _0x5c44d8);
      }));
    let _0x7738e6 = 0x3;
    while (_0x7738e6--) {
      _0x468fbd = VisuMZ[_0x426005(0x5cb)](_0x468fbd);
    }
    return _0x468fbd;
  }),
  (VisuMZ['PreserveNumbers'] = function (_0x4e0edd, _0x4a06ed, _0x569235) {
    const _0x2416dd = _0x17b060;
    return (
      (_0x4e0edd = _0x4e0edd['replace'](/(\d)/gi, (_0xe91ae6, _0x1d1093) => _0x2416dd(0x2c3)[_0x2416dd(0x1df)](Number(_0x1d1093)))), _0x2416dd(0x6bd)[_0x2416dd(0x1df)](_0x4e0edd, _0x4a06ed, _0x569235)
    );
  }),
  (VisuMZ['RevertPreserveNumbers'] = function (_0x54207f) {
    const _0xea07ad = _0x17b060;
    return (_0x54207f = _0x54207f[_0xea07ad(0x39d)](/PRESERVCONVERSION\((\d+)\)/gi, (_0x52e58c, _0x533a04) => Number(parseInt(_0x533a04)))), _0x54207f;
  }),
  (VisuMZ['openURL'] = function (_0x5abb2e) {
    const _0x12cae4 = _0x17b060;
    SoundManager[_0x12cae4(0x8ba)]();
    if (!Utils[_0x12cae4(0x185)]()) {
      const _0x22e065 = window['open'](_0x5abb2e, _0x12cae4(0x21a));
    } else {
      const _0x449432 = process[_0x12cae4(0x361)] == _0x12cae4(0x33b) ? _0x12cae4(0x697) : process[_0x12cae4(0x361)] == _0x12cae4(0x62d) ? _0x12cae4(0x6ae) : _0x12cae4(0x86f);
      require(_0x12cae4(0x81c))['exec'](_0x449432 + '\x20' + _0x5abb2e);
    }
  }),
  (VisuMZ[_0x17b060(0x220)] = function (_0x30cc12, _0x5c0cdc) {
    const _0x4b0eaf = _0x17b060;
    if (!_0x30cc12) return '';
    const _0x40f181 = _0x30cc12['baseId'] || _0x30cc12['id'];
    let _0xd4b27d = '';
    return (
      _0x30cc12[_0x4b0eaf(0x174)] !== undefined && _0x30cc12[_0x4b0eaf(0x283)] !== undefined && (_0xd4b27d = _0x4b0eaf(0x683)[_0x4b0eaf(0x1df)](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x5f3)] !== undefined && _0x30cc12['learnings'] !== undefined && (_0xd4b27d = 'Class-%1-%2'['format'](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x551)] !== undefined && _0x30cc12[_0x4b0eaf(0x22a)] !== undefined && (_0xd4b27d = 'Skill-%1-%2'['format'](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x19d)] !== undefined && _0x30cc12[_0x4b0eaf(0x298)] !== undefined && (_0xd4b27d = _0x4b0eaf(0x1c6)[_0x4b0eaf(0x1df)](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x709)] !== undefined && _0x30cc12[_0x4b0eaf(0x468)] === 0x1 && (_0xd4b27d = 'Weapon-%1-%2'[_0x4b0eaf(0x1df)](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x530)] !== undefined && _0x30cc12['etypeId'] > 0x1 && (_0xd4b27d = _0x4b0eaf(0x621)[_0x4b0eaf(0x1df)](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x68f)] !== undefined && _0x30cc12['battlerHue'] !== undefined && (_0xd4b27d = _0x4b0eaf(0x4a3)[_0x4b0eaf(0x1df)](_0x40f181, _0x5c0cdc)),
      _0x30cc12[_0x4b0eaf(0x6cb)] !== undefined && _0x30cc12[_0x4b0eaf(0x368)] !== undefined && (_0xd4b27d = _0x4b0eaf(0x51f)['format'](_0x40f181, _0x5c0cdc)),
      _0xd4b27d
    );
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x435)] = function () {
    const _0x5ea12d = _0x17b060;
    return this[_0x5ea12d(0x85b)];
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x312)] = Game_Picture[_0x17b060(0x54a)]['initBasic']),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x560)] = function () {
    const _0x3e6c0b = _0x17b060;
    VisuMZ[_0x3e6c0b(0x77a)][_0x3e6c0b(0x312)]['call'](this), (this[_0x3e6c0b(0x85b)] = { x: 0x0, y: 0x0 }), (this[_0x3e6c0b(0x305)] = { x: 0x0, y: 0x0 });
  }),
  (VisuMZ['CoreEngine']['Game_Picture_updateMove'] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x37f)]),
  (Game_Picture['prototype'][_0x17b060(0x37f)] = function () {
    const _0x388f86 = _0x17b060;
    this['updateAnchor']();
    const _0x3d770b = this[_0x388f86(0x2e0)];
    VisuMZ[_0x388f86(0x77a)][_0x388f86(0x480)][_0x388f86(0x64e)](this),
      _0x3d770b > 0x0 &&
        this[_0x388f86(0x2e0)] <= 0x0 &&
        ((this['_x'] = this[_0x388f86(0x2fc)]),
        (this['_y'] = this['_targetY']),
        (this[_0x388f86(0x6a0)] = this[_0x388f86(0x506)]),
        (this[_0x388f86(0x4ee)] = this[_0x388f86(0x79b)]),
        (this[_0x388f86(0x10e)] = this[_0x388f86(0x348)]),
        this[_0x388f86(0x85b)] && ((this[_0x388f86(0x85b)]['x'] = this['_targetAnchor']['x']), (this['_anchor']['y'] = this[_0x388f86(0x305)]['y'])));
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x1dc)] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x198)]),
  (Game_Picture['prototype']['show'] = function (_0x38605b, _0xd70500, _0x4332be, _0xff6244, _0x31a9f2, _0x4a0392, _0x2f3b88, _0xd0c5e5) {
    const _0x3d0b9b = _0x17b060;
    VisuMZ[_0x3d0b9b(0x77a)]['Game_Picture_show'][_0x3d0b9b(0x64e)](this, _0x38605b, _0xd70500, _0x4332be, _0xff6244, _0x31a9f2, _0x4a0392, _0x2f3b88, _0xd0c5e5),
      this[_0x3d0b9b(0x3ca)](
        [
          { x: 0x0, y: 0x0 },
          { x: 0.5, y: 0.5 },
        ][_0xd70500] || { x: 0x0, y: 0x0 },
      );
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x69c)] = Game_Picture[_0x17b060(0x54a)][_0x17b060(0x4f6)]),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x4f6)] = function (_0x2f29f8, _0xd5c01f, _0x37a4e1, _0x3d3e8f, _0x6a9b00, _0x3eaa35, _0xcadf96, _0x3a7624, _0x5e594a) {
    const _0xd9d797 = _0x17b060;
    VisuMZ['CoreEngine'][_0xd9d797(0x69c)]['call'](this, _0x2f29f8, _0xd5c01f, _0x37a4e1, _0x3d3e8f, _0x6a9b00, _0x3eaa35, _0xcadf96, _0x3a7624, _0x5e594a),
      this[_0xd9d797(0x7ab)](
        [
          { x: 0x0, y: 0x0 },
          { x: 0.5, y: 0.5 },
        ][_0x2f29f8] || { x: 0x0, y: 0x0 },
      );
  }),
  (Game_Picture['prototype'][_0x17b060(0x645)] = function () {
    const _0x55a087 = _0x17b060;
    this[_0x55a087(0x2e0)] > 0x0 &&
      ((this[_0x55a087(0x85b)]['x'] = this[_0x55a087(0x85e)](this[_0x55a087(0x85b)]['x'], this['_targetAnchor']['x'])),
      (this[_0x55a087(0x85b)]['y'] = this[_0x55a087(0x85e)](this['_anchor']['y'], this[_0x55a087(0x305)]['y'])));
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x3ca)] = function (_0x16276b) {
    const _0x104b84 = _0x17b060;
    (this[_0x104b84(0x85b)] = _0x16276b), (this[_0x104b84(0x305)] = JsonEx[_0x104b84(0x83c)](this[_0x104b84(0x85b)]));
  }),
  (Game_Picture[_0x17b060(0x54a)][_0x17b060(0x7ab)] = function (_0x55c4d1) {
    this['_targetAnchor'] = _0x55c4d1;
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x745)] = Sprite_Picture['prototype'][_0x17b060(0x5d1)]),
  (Sprite_Picture[_0x17b060(0x54a)]['updateOrigin'] = function () {
    const _0x1d3c01 = _0x17b060,
      _0x2844a9 = this[_0x1d3c01(0x786)]();
    !_0x2844a9['anchor']()
      ? VisuMZ['CoreEngine'][_0x1d3c01(0x745)][_0x1d3c01(0x64e)](this)
      : ((this['anchor']['x'] = _0x2844a9[_0x1d3c01(0x435)]()['x']), (this[_0x1d3c01(0x435)]['y'] = _0x2844a9[_0x1d3c01(0x435)]()['y']));
  }),
  (Game_Action[_0x17b060(0x54a)][_0x17b060(0x499)] = function (_0x13346d) {
    const _0x4405b2 = _0x17b060;
    if (_0x13346d) {
      const _0x462244 = _0x13346d[_0x4405b2(0x290)];
      if (_0x462244 === 0x1 && this[_0x4405b2(0x18a)]()['attackSkillId']() !== 0x1) this[_0x4405b2(0x78b)]();
      else _0x462244 === 0x2 && this[_0x4405b2(0x18a)]()[_0x4405b2(0x694)]() !== 0x2 ? this['setGuard']() : this['setSkill'](_0x462244);
    } else this[_0x4405b2(0x2d5)]();
  }),
  (Game_Actor[_0x17b060(0x54a)]['usableSkills'] = function () {
    const _0x4d2d8c = _0x17b060;
    return this['skills']()[_0x4d2d8c(0x19c)](_0x504bcf => this['canUse'](_0x504bcf) && this[_0x4d2d8c(0x70f)]()[_0x4d2d8c(0x1ae)](_0x504bcf[_0x4d2d8c(0x551)]));
  }),
  (Window_Base[_0x17b060(0x54a)][_0x17b060(0x78f)] = function () {
    const _0x4f4c3a = _0x17b060;
    (this['_dimmerSprite'] = new Sprite()), (this[_0x4f4c3a(0x1d4)]['bitmap'] = new Bitmap(0x0, 0x0)), (this[_0x4f4c3a(0x1d4)]['x'] = 0x0), this[_0x4f4c3a(0x3af)](this[_0x4f4c3a(0x1d4)]);
  }),
  (Window_Base['prototype']['refreshDimmerBitmap'] = function () {
    const _0x30353d = _0x17b060;
    if (this[_0x30353d(0x1d4)]) {
      const _0x477e8f = this[_0x30353d(0x1d4)]['bitmap'],
        _0x4d58a9 = this[_0x30353d(0x321)],
        _0x59b570 = this[_0x30353d(0x2c5)],
        _0x280df4 = this[_0x30353d(0x804)],
        _0x22870a = ColorManager[_0x30353d(0x587)](),
        _0x1ab2fe = ColorManager[_0x30353d(0x1a7)]();
      _0x477e8f['resize'](_0x4d58a9, _0x59b570),
        _0x477e8f[_0x30353d(0x668)](0x0, 0x0, _0x4d58a9, _0x280df4, _0x1ab2fe, _0x22870a, !![]),
        _0x477e8f[_0x30353d(0x456)](0x0, _0x280df4, _0x4d58a9, _0x59b570 - _0x280df4 * 0x2, _0x22870a),
        _0x477e8f[_0x30353d(0x668)](0x0, _0x59b570 - _0x280df4, _0x4d58a9, _0x280df4, _0x22870a, _0x1ab2fe, !![]),
        this[_0x30353d(0x1d4)]['setFrame'](0x0, 0x0, _0x4d58a9, _0x59b570);
    }
  }),
  (Game_Actor['prototype'][_0x17b060(0x13e)] = function () {
    const _0x41409f = _0x17b060;
    for (let _0x130af8 = 0x0; _0x130af8 < this[_0x41409f(0x3b4)](); _0x130af8++) {
      const _0x2c79ef = this[_0x41409f(0x1d8)]();
      let _0x162ee4 = Number[_0x41409f(0x5e4)];
      this[_0x41409f(0x7e4)](_0x130af8, _0x2c79ef[0x0]);
      for (const _0xd0ccf9 of _0x2c79ef) {
        const _0x25e5cb = _0xd0ccf9[_0x41409f(0x753)]();
        _0x25e5cb > _0x162ee4 && ((_0x162ee4 = _0x25e5cb), this[_0x41409f(0x7e4)](_0x130af8, _0xd0ccf9));
      }
    }
    this['setActionState'](_0x41409f(0x592));
  }),
  (Window_BattleItem['prototype']['isEnabled'] = function (_0x480b0a) {
    const _0x260cd3 = _0x17b060;
    return BattleManager[_0x260cd3(0x124)]() ? BattleManager[_0x260cd3(0x124)]()[_0x260cd3(0x7fd)](_0x480b0a) : Window_ItemList[_0x260cd3(0x54a)][_0x260cd3(0x403)]['call'](this, _0x480b0a);
  }),
  (VisuMZ[_0x17b060(0x77a)]['Scene_Map_createSpritesetFix'] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x6d0)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x6d0)] = function () {
    const _0x2ef4f6 = _0x17b060;
    VisuMZ[_0x2ef4f6(0x77a)][_0x2ef4f6(0x4ac)][_0x2ef4f6(0x64e)](this);
    const _0x33adf0 = this[_0x2ef4f6(0x10b)]['_timerSprite'];
    if (_0x33adf0) this[_0x2ef4f6(0x781)](_0x33adf0);
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x757)] = Scene_Battle[_0x17b060(0x54a)][_0x17b060(0x6d0)]),
  (Scene_Battle[_0x17b060(0x54a)]['createSpriteset'] = function () {
    const _0x2bf102 = _0x17b060;
    VisuMZ['CoreEngine']['Scene_Battle_createSpritesetFix'][_0x2bf102(0x64e)](this);
    const _0x2a3a4d = this[_0x2bf102(0x10b)][_0x2bf102(0x84c)];
    if (_0x2a3a4d) this[_0x2bf102(0x781)](_0x2a3a4d);
  }),
  (Sprite_Actor['prototype'][_0x17b060(0x319)] = function () {
    const _0x49bf94 = _0x17b060;
    Sprite_Battler[_0x49bf94(0x54a)][_0x49bf94(0x319)]['call'](this), this[_0x49bf94(0x281)]();
    if (this[_0x49bf94(0x2f3)]) this[_0x49bf94(0x531)]();
    else this['_battlerName'] !== '' && (this[_0x49bf94(0x3ea)] = '');
  }),
  (Window[_0x17b060(0x54a)]['_refreshArrows'] = function () {
    const _0x28bd7d = _0x17b060,
      _0x324885 = this[_0x28bd7d(0x5ad)],
      _0x1e6793 = this['_height'],
      _0x1e486c = 0x18,
      _0x563cf3 = _0x1e486c / 0x2,
      _0x46e7b1 = 0x60 + _0x1e486c,
      _0x47be87 = 0x0 + _0x1e486c;
    (this['_downArrowSprite']['bitmap'] = this['_windowskin']),
      (this['_downArrowSprite'][_0x28bd7d(0x435)]['x'] = 0.5),
      (this[_0x28bd7d(0x871)][_0x28bd7d(0x435)]['y'] = 0.5),
      this[_0x28bd7d(0x871)]['setFrame'](_0x46e7b1 + _0x563cf3, _0x47be87 + _0x563cf3 + _0x1e486c, _0x1e486c, _0x563cf3),
      this[_0x28bd7d(0x871)][_0x28bd7d(0x4f6)](Math['round'](_0x324885 / 0x2), Math['round'](_0x1e6793 - _0x563cf3)),
      (this[_0x28bd7d(0x554)][_0x28bd7d(0x7d3)] = this[_0x28bd7d(0x899)]),
      (this['_upArrowSprite'][_0x28bd7d(0x435)]['x'] = 0.5),
      (this['_upArrowSprite'][_0x28bd7d(0x435)]['y'] = 0.5),
      this[_0x28bd7d(0x554)][_0x28bd7d(0x674)](_0x46e7b1 + _0x563cf3, _0x47be87, _0x1e486c, _0x563cf3),
      this[_0x28bd7d(0x554)][_0x28bd7d(0x4f6)](Math[_0x28bd7d(0x3fe)](_0x324885 / 0x2), Math[_0x28bd7d(0x3fe)](_0x563cf3));
  }),
  (Window[_0x17b060(0x54a)][_0x17b060(0x342)] = function () {
    const _0x147b45 = _0x17b060,
      _0x30b7a6 = 0x90,
      _0x2d3bd6 = 0x60,
      _0x283d00 = 0x18;
    (this[_0x147b45(0x1e0)][_0x147b45(0x7d3)] = this[_0x147b45(0x899)]),
      (this['_pauseSignSprite'][_0x147b45(0x435)]['x'] = 0.5),
      (this['_pauseSignSprite'][_0x147b45(0x435)]['y'] = 0x1),
      this['_pauseSignSprite'][_0x147b45(0x4f6)](Math[_0x147b45(0x3fe)](this[_0x147b45(0x5ad)] / 0x2), this[_0x147b45(0x50e)]),
      this['_pauseSignSprite']['setFrame'](_0x30b7a6, _0x2d3bd6, _0x283d00, _0x283d00),
      (this[_0x147b45(0x1e0)][_0x147b45(0x867)] = 0xff);
  }),
  (Window['prototype'][_0x17b060(0x657)] = function () {
    const _0x206ec7 = _0x17b060,
      _0x3858be = this[_0x206ec7(0x538)][_0x206ec7(0x25c)][_0x206ec7(0x7f2)](new Point(0x0, 0x0)),
      _0x52df8e = this[_0x206ec7(0x538)][_0x206ec7(0x553)];
    (_0x52df8e['x'] = _0x3858be['x'] + this[_0x206ec7(0x851)]['x']),
      (_0x52df8e['y'] = _0x3858be['y'] + this[_0x206ec7(0x851)]['y']),
      (_0x52df8e['width'] = Math[_0x206ec7(0x720)](this[_0x206ec7(0x547)] * this[_0x206ec7(0x82a)]['x'])),
      (_0x52df8e['height'] = Math[_0x206ec7(0x720)](this['innerHeight'] * this[_0x206ec7(0x82a)]['y']));
  }),
  (VisuMZ[_0x17b060(0x77a)]['Window_refreshBack'] = Window[_0x17b060(0x54a)][_0x17b060(0x24f)]),
  (Window[_0x17b060(0x54a)]['_refreshBack'] = function () {
    const _0x57ce20 = _0x17b060,
      _0x2cb8ef = VisuMZ['CoreEngine']['Settings'][_0x57ce20(0x607)][_0x57ce20(0x50c)] ?? !![];
    if (!_0x2cb8ef) return VisuMZ[_0x57ce20(0x77a)][_0x57ce20(0x571)][_0x57ce20(0x64e)](this);
    const _0xfe4301 = this[_0x57ce20(0x754)],
      _0x26fc87 = Math[_0x57ce20(0x7f9)](0x0, this[_0x57ce20(0x5ad)] - _0xfe4301 * 0x2),
      _0xb93fe3 = Math['max'](0x0, this[_0x57ce20(0x50e)] - _0xfe4301 * 0x2),
      _0x193926 = this[_0x57ce20(0x14c)],
      _0x2c57b4 = _0x193926['children'][0x0];
    (_0x193926[_0x57ce20(0x7d3)] = this[_0x57ce20(0x899)]),
      _0x193926[_0x57ce20(0x674)](0x0, 0x0, 0x60, 0x60),
      _0x193926[_0x57ce20(0x4f6)](_0xfe4301, _0xfe4301),
      (_0x193926['scale']['x'] = _0x26fc87 / 0x60),
      (_0x193926[_0x57ce20(0x82a)]['y'] = _0xb93fe3 / 0x60),
      (_0x2c57b4[_0x57ce20(0x7d3)] = this[_0x57ce20(0x899)]),
      _0x2c57b4[_0x57ce20(0x674)](0x0, 0x60, 0x60, 0x60),
      _0x2c57b4[_0x57ce20(0x4f6)](0x0, 0x0, _0x26fc87, _0xb93fe3),
      (_0x2c57b4[_0x57ce20(0x82a)]['x'] = 0x1 / _0x193926['scale']['x']),
      (_0x2c57b4[_0x57ce20(0x82a)]['y'] = 0x1 / _0x193926[_0x57ce20(0x82a)]['y']),
      _0x193926[_0x57ce20(0x7c4)](this[_0x57ce20(0x747)]);
  }),
  (Game_Temp[_0x17b060(0x54a)][_0x17b060(0x43d)] = function () {
    const _0xb5eec = _0x17b060;
    (this[_0xb5eec(0x794)] = []), (this[_0xb5eec(0x34c)] = []), (this[_0xb5eec(0xe7)] = []), (this['_balloonQueue'] = []);
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x11d)] = Scene_Base[_0x17b060(0x54a)][_0x17b060(0x249)]),
  (Scene_Base[_0x17b060(0x54a)][_0x17b060(0x249)] = function () {
    const _0x7cf8b5 = _0x17b060;
    if ($gameTemp) $gameTemp['sceneTerminationClearEffects']();
    VisuMZ[_0x7cf8b5(0x77a)][_0x7cf8b5(0x11d)][_0x7cf8b5(0x64e)](this);
  }),
  (Bitmap['prototype'][_0x17b060(0x738)] = function (_0x588a80) {
    const _0x284567 = _0x17b060,
      _0x4e3ef0 = this['context'];
    _0x4e3ef0['save'](), (_0x4e3ef0[_0x284567(0x56c)] = this[_0x284567(0x535)]());
    const _0x2fbd7a = _0x4e3ef0[_0x284567(0x2a7)](_0x588a80)['width'];
    return _0x4e3ef0['restore'](), _0x2fbd7a;
  }),
  (Window_Message[_0x17b060(0x54a)]['textWidth'] = function (_0x24d48b) {
    const _0x428573 = _0x17b060;
    return this[_0x428573(0x72e)]() ? this[_0x428573(0x16e)][_0x428573(0x738)](_0x24d48b) : Window_Base[_0x428573(0x54a)][_0x428573(0x80f)][_0x428573(0x64e)](this, _0x24d48b);
  }),
  (Window_Message[_0x17b060(0x54a)]['useFontWidthFix'] = function () {
    const _0x19fad4 = _0x17b060;
    return VisuMZ[_0x19fad4(0x77a)][_0x19fad4(0x382)][_0x19fad4(0x7ae)][_0x19fad4(0x671)] ?? !![];
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x1c4)] = Game_Action[_0x17b060(0x54a)][_0x17b060(0x2ec)]),
  (Game_Action['prototype'][_0x17b060(0x2ec)] = function () {
    const _0x425ae0 = _0x17b060;
    return this['item']() ? VisuMZ[_0x425ae0(0x77a)][_0x425ae0(0x1c4)][_0x425ae0(0x64e)](this) : 0x0;
  }),
  (VisuMZ[_0x17b060(0x77a)]['Game_Action_setAttack'] = Game_Action['prototype'][_0x17b060(0x78b)]),
  (Game_Action[_0x17b060(0x54a)][_0x17b060(0x78b)] = function () {
    const _0x1403f8 = _0x17b060;
    if (this[_0x1403f8(0x18a)]() && this[_0x1403f8(0x18a)]()[_0x1403f8(0x1d2)]()) VisuMZ[_0x1403f8(0x77a)][_0x1403f8(0x35c)][_0x1403f8(0x64e)](this);
    else BattleManager[_0x1403f8(0x77d)] ? VisuMZ[_0x1403f8(0x77a)][_0x1403f8(0x35c)][_0x1403f8(0x64e)](this) : this[_0x1403f8(0x2d5)]();
  }),
  (VisuMZ[_0x17b060(0x77a)][_0x17b060(0x86e)] = BattleManager[_0x17b060(0x755)]),
  (BattleManager[_0x17b060(0x755)] = function (_0x9da7e4, _0xd4885b) {
    const _0x939869 = _0x17b060;
    (this['_bypassCanCounterCheck'] = !![]), VisuMZ[_0x939869(0x77a)][_0x939869(0x86e)]['call'](this, _0x9da7e4, _0xd4885b), (this[_0x939869(0x77d)] = undefined);
  }),
  (Sprite_Name['prototype'][_0x17b060(0x788)] = function () {
    return 0x24;
  }),
  (Sprite_Name[_0x17b060(0x54a)][_0x17b060(0x1d9)] = function () {
    const _0xd28ab1 = _0x17b060,
      _0x3fce7f = this[_0xd28ab1(0x142)](),
      _0x10492f = this[_0xd28ab1(0x2a6)](),
      _0x41fd8e = this[_0xd28ab1(0x788)]();
    this[_0xd28ab1(0x831)](), this[_0xd28ab1(0x7d3)]['clear'](), this[_0xd28ab1(0x7d3)][_0xd28ab1(0x580)](_0x3fce7f, 0x4, 0x0, _0x10492f - 0xa, _0x41fd8e, _0xd28ab1(0x2b0));
  }),
  (Bitmap['prototype']['drawTextTopAligned'] = function (_0x6049c8, _0xd927d5, _0x2d8075, _0x1850ff, _0x2ad1d3, _0x39be36) {
    const _0x253915 = _0x17b060,
      _0x33cde5 = this[_0x253915(0x85c)],
      _0x1e2840 = _0x33cde5[_0x253915(0x4d9)];
    _0x1850ff = _0x1850ff || 0xffffffff;
    let _0x4821de = _0xd927d5,
      _0x86d49 = Math['round'](_0x2d8075 + 0x18 / 0x2 + this[_0x253915(0xf8)] * 0.35);
    _0x39be36 === _0x253915(0x27e) && (_0x4821de += _0x1850ff / 0x2),
      _0x39be36 === _0x253915(0x512) && (_0x4821de += _0x1850ff),
      _0x33cde5[_0x253915(0x25e)](),
      (_0x33cde5['font'] = this['_makeFontNameText']()),
      (_0x33cde5[_0x253915(0x184)] = _0x39be36),
      (_0x33cde5[_0x253915(0x850)] = 'alphabetic'),
      (_0x33cde5[_0x253915(0x4d9)] = 0x1),
      this['_drawTextOutline'](_0x6049c8, _0x4821de, _0x86d49, _0x1850ff),
      (_0x33cde5[_0x253915(0x4d9)] = _0x1e2840),
      this[_0x253915(0x1c5)](_0x6049c8, _0x4821de, _0x86d49, _0x1850ff),
      _0x33cde5[_0x253915(0x7b9)](),
      this[_0x253915(0x199)]['update']();
  }),
  (VisuMZ[_0x17b060(0x77a)]['BattleManager_checkSubstitute'] = BattleManager[_0x17b060(0x52f)]),
  (BattleManager[_0x17b060(0x52f)] = function (_0x4071db) {
    const _0x566c3e = _0x17b060;
    if (this[_0x566c3e(0x7c7)][_0x566c3e(0x891)]()) return ![];
    return VisuMZ[_0x566c3e(0x77a)][_0x566c3e(0x502)]['call'](this, _0x4071db);
  }),
  (BattleManager[_0x17b060(0x4de)] = function () {
    const _0x16336b = _0x17b060;
    if (this[_0x16336b(0x2af)]) this[_0x16336b(0x773)][_0x16336b(0x4de)](this[_0x16336b(0x2af)]);
    (this[_0x16336b(0x5e5)] = _0x16336b(0x84f)),
      this[_0x16336b(0x2af)] && this['_subject'][_0x16336b(0x3b4)]() === 0x0 && (this['endBattlerActions'](this[_0x16336b(0x2af)]), (this['_subject'] = null));
  }),
  (Bitmap['prototype']['_startLoading'] = function () {
    const _0x33d153 = _0x17b060;
    (this[_0x33d153(0x4c9)] = new Image()),
      (this[_0x33d153(0x4c9)][_0x33d153(0x13f)] = this[_0x33d153(0x277)][_0x33d153(0x76d)](this)),
      (this['_image'][_0x33d153(0x6e7)] = this[_0x33d153(0x398)][_0x33d153(0x76d)](this)),
      this[_0x33d153(0x8b3)](),
      (this['_loadingState'] = _0x33d153(0x49d)),
      Utils[_0x33d153(0x612)]()
        ? this[_0x33d153(0x76e)]()
        : ((this[_0x33d153(0x4c9)]['src'] = this[_0x33d153(0x3a0)]), ![] && this[_0x33d153(0x4c9)][_0x33d153(0x321)] > 0x0 && ((this[_0x33d153(0x4c9)]['onload'] = null), this[_0x33d153(0x277)]()));
  }),
  (Scene_Skill[_0x17b060(0x54a)][_0x17b060(0x72c)] = function () {
    const _0x53da6e = _0x17b060;
    Scene_MenuBase[_0x53da6e(0x54a)][_0x53da6e(0x72c)][_0x53da6e(0x64e)](this),
      this['refreshActor'](),
      this[_0x53da6e(0x28d)][_0x53da6e(0x406)](),
      this[_0x53da6e(0x28d)][_0x53da6e(0x7a4)](),
      this[_0x53da6e(0x1cb)][_0x53da6e(0x40a)]();
  }),
  (Scene_Skill['prototype'][_0x17b060(0x4c7)] = function () {
    const _0x2387c7 = _0x17b060;
    return this['_skillTypeWindow'] && this[_0x2387c7(0x1cb)]['active'];
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x153)] = function (_0x1bb270, _0x23819e, _0x2f548b) {
    const _0x2b0aff = _0x17b060,
      _0x599163 = this[_0x2b0aff(0x1ec)](),
      _0x4ef113 = this[_0x2b0aff(0x170)](_0x1bb270, _0x23819e);
    for (const _0x4a7b04 of _0x4ef113) {
      const _0x25281b = _0x599163[_0x4a7b04];
      if (_0x25281b === undefined || _0x25281b === null) {
        if ($gameTemp[_0x2b0aff(0x6dc)]() && !DataManager[_0x2b0aff(0x87a)]()) {
          let _0x33c37f = _0x2b0aff(0x6c9) + '\x0a';
          (_0x33c37f += _0x2b0aff(0x29f) + '\x0a'),
            (_0x33c37f += 'and\x20add\x20it\x20onto\x20this\x20one.'),
            this[_0x2b0aff(0x3e1)]()
              ? (alert(_0x33c37f), SceneManager[_0x2b0aff(0x81a)]())
              : (console[_0x2b0aff(0x797)](_0x33c37f), !$gameTemp[_0x2b0aff(0x446)] && (($gameTemp[_0x2b0aff(0x446)] = !![]), SceneManager[_0x2b0aff(0x1b6)]()));
        }
      }
      if ((_0x25281b & 0x10) !== 0x0) continue;
      if ((_0x25281b & _0x2f548b) === 0x0) return !![];
      if ((_0x25281b & _0x2f548b) === _0x2f548b) return ![];
    }
    return ![];
  }),
  (Game_Map[_0x17b060(0x54a)][_0x17b060(0x3e1)] = function () {
    const _0x2a1bb6 = _0x17b060;
    if (Imported[_0x2a1bb6(0x4c8)]) return !![];
    if (Imported[_0x2a1bb6(0x6aa)]) return !![];
    return ![];
  }),
  (Sprite_Animation['prototype'][_0x17b060(0x66a)] = function (_0x24c8d8) {
    const _0x55ec5d = _0x17b060;
    !this[_0x55ec5d(0x6bc)] && (this['_originalViewport'] = _0x24c8d8['gl'][_0x55ec5d(0x643)](_0x24c8d8['gl']['VIEWPORT']));
  }),
  (VisuMZ['CoreEngine'][_0x17b060(0x8b1)] = Scene_Map[_0x17b060(0x54a)][_0x17b060(0x70b)]),
  (Scene_Map[_0x17b060(0x54a)][_0x17b060(0x70b)] = function () {
    const _0x49d876 = _0x17b060,
      _0x202de9 = SceneManager[_0x49d876(0x77f)][_0x49d876(0x142)];
    if ([_0x49d876(0x45e), _0x49d876(0x6f3), 'Scene_TitleTransition', _0x49d876(0x1be)][_0x49d876(0x1ae)](_0x202de9)) return ![];
    return VisuMZ[_0x49d876(0x77a)][_0x49d876(0x8b1)][_0x49d876(0x64e)](this);
  });
