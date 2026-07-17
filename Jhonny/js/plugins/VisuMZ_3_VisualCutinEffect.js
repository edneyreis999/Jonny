//=============================================================================
// VisuStella MZ - Visual Cutin Effect
// VisuMZ_3_VisualCutinEffect.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_3_VisualCutinEffect = true;

var VisuMZ = VisuMZ || {};
VisuMZ.VisualCutinEffect = VisuMZ.VisualCutinEffect || {};
VisuMZ.VisualCutinEffect.version = 1.02;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 3] [Version 1.02] [VisualCutinEffect]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Visual_Cutin_Effect_VisuStella_MZ
 * @base VisuMZ_0_CoreEngine
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * A good Visual Cutin Effect can add more impact to a scene, allude to a
 * different character focus, or add hype to an action sequence in battle.
 * This plugin allows you to create Visual Cutin Effects of your choosing, with
 * a plethora of types to pick from. Their different visual appearances each
 * fit a variety of situations for your game.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Pick from 20 different cutin styles of all shapes and sizes that have
 *   variations of their own for more than 60+ total cutin choices.
 * * Select a background color to use, a parallax to go with it, and a portrait
 *   to represent a character in specific.
 * * Create custom masks and outlines to determine how cutins will be shaped.
 * * Various options allow for more versatility when creating a cutin effect.
 * * Animate the cutins via their styles, entrance and exit coordinates, as
 *   well as how the portraits and parallaxes animate.
 * * Cutins are controlled completely by their Plugin Commands from when they
 *   start to their properties to changing the portraits and parallaxes midway
 *   to the moment they end.
 * * Additional features with the Battle Core where Action Sequences can create
 *   a Visual Cutin Effect using Battle Portraits for both actors and enemies.
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
 * * VisuMZ_0_CoreEngine
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
 * Understanding Visual Cutin Effects
 * ============================================================================
 *
 * This section will explain various properties of this plugin.
 *
 * ---
 *
 * Visual Cutin Effect Layer
 * 
 * For the purpose of making cutins visible enough, they will appear over all
 * spriteset objects (ie tilesets, events, battlebacks, battlers, pictures,
 * battle animations) but will appear under the majority of windows.
 *
 * ---
 * 
 * One of Each Type
 * 
 * Although you can bring out cutins at practically any time during the map (or
 * battle as long as you have the VisuMZ Battle Core), you can only bring out
 * one cutin of each type. For example, only one "LeftMajor" cutin-type can be
 * used at a time and the existing "LeftMajor" cutin must be ended before using
 * another "LeftMajor" cutin.
 * 
 * The type-restriction does NOT apply to its variations. For example, you can
 * use "LeftMajor" with "RightMajor" simultaneously without any problems.
 * Likewise, you can use "TwelvePack1" with "TwelvePack2" and "TwelvePack3".
 * 
 * What the "One of Each Type" rule means is that you cannot use multiple
 * "LeftMajor" cutins together. Not that it'd make much sense either since they
 * would just overlap each other.
 * 
 * ---
 * 
 * Order They Start
 * 
 * Cutins are layered in the order they are started with the most recent cutin
 * at the top and the oldest cutin at the back. This means if you have two
 * cutins "LeftHorzSlash" and "RightVertSlash", they will overlap each other
 * based on who has more recently started, with the more recent one on top.
 * 
 * ---
 * 
 * Visual Cutin Masking
 * 
 * Visual Cutin Effects will utilize Pixi JS's masking functions to keep their
 * contents contained within specific boundaries. All the Visual Cutin Effect's
 * individual parts (ie the portrait, parallax, outline, and background color)
 * are all affected by the mask and will not appear outside of it.
 * 
 * ---
 * 
 * Plugin-Generated Masks and Outlines
 * 
 * If you do not provide custom files for masks and outlines (don't worry, it's
 * not required), then the plugin will automatically generate them for you.
 * Each of the 20 different styles and their many variations will have a
 * generated mask and outline that can be used without the need of custom image
 * files, especially for those unfamiliar with how Pixi JS masking works.
 * 
 * ---
 * 
 * There is NO One-Size-Fits-All
 * 
 * The plugin-generated masks and outlines are of many different shapes and
 * sizes. And as images used as portraits and parallaxes can be of many varying
 * shapes and sizes as well, there's not going to be a perfect setting for
 * everything. Different cutin-types need to be experimented with different
 * settings in order to find out what works best.
 * 
 * ---
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
 * VisuMZ_1_BattleCore
 * 
 * In order to use Visual Cutin Effects in battle, the VisuMZ Battle Core must
 * be used in order to properly utilize them. You will also be able to utilize
 * specific battle portrait-related Action Sequence Plugin Commands found in
 * the Battle Core, too.
 * 
 * There will be some Battle Core specific notetags that can be used from this
 * plugin as well.
 * 
 * ---
 * 
 * VisuMZ_4_AnimatedPictures
 * 
 * Animated Pictures can also be used as a portrait for a Visual Cutin Effect.
 * The looping and delay information is set up via the Plugin Command settings.
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
 * === Enemy-Related Notetags ===
 * 
 * ---
 *
 * <Cutin Portrait: filename>
 *
 * - Used for: Enemy Notetags
 * - Gives the enemy a portrait to use when using Visual Cutin Effects.
 * - Replace 'filename' with a picture found within your game project's
 *   img/pictures/ folder. Filenames are case sensitive. Leave out the filename
 *   extension from the notetag.
 *
 * ---
 *
 * <Cutin Flip Horz>
 * <Cutin Flip Horzontal>
 * <Cutin Flip Horzontally>
 *
 * - Used for: Enemy Notetags
 * - Flips the enemy's portrait horizontally.
 * - There are no differences between the variations in notetags. The one you
 *   use is entirely up to your own personal preferences.
 *
 * ---
 *
 * <Cutin Flip Vert>
 * <Cutin Flip Vertical>
 * <Cutin Flip Vertically>
 *
 * - Used for: Enemy Notetags
 * - Flips the enemy's portrait vertically.
 * - There are no differences between the variations in notetags. The one you
 *   use is entirely up to your own personal preferences.
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
 * === Cutin Add - Plugin Commands ===
 * 
 * ---
 *
 * Cutin Add: Add Visual Cutin Effect
 * - Adds the Visual Cutin Effect using these desired settings.
 * - Only one of each cutin-style type can be present at a time.
 *
 *   Basic Settings:
 * 
 *     Cutin Style Type:
 *     - What Visual Cutin Effect style type do you wish to use?
 *     - Refer to VisuMZ wiki for visuals on styles.
 *
 *     Portrait Filename:
 *     - Pick a portrait to use for the Visual Cutin Effect.
 *     - Pick (None) to not use a portrait.
 *
 *     Parallax Filename:
 *     - Pick a parallax to use for the Visual Cutin Effect.
 *     - Pick (None) to not use a parallax.
 *
 *     Background Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 *
 *   Extra Settings:
 *   - Extra Plugin Command settings pertaining to this Visual Cutin Effect.
 *   - These settings will be displayed in a later section.
 * 
 *   Wait for Entrance:
 *   - Wait until cutin entrance is finished before performing the next
 *     event command?
 *
 * ---
 * 
 * === Cutin Change - Plugin Commands ===
 * 
 * ---
 *
 * Cutin Change: Portrait Swap
 * - Changes target cutin-type's portrait with a different image.
 *
 *   Basic Settings:
 *
 *     Cutin Style Type:
 *     - What Visual Cutin Effect style type to update?
 *     - This determines which existing cutin-type to change.
 *
 *     Portrait Filename:
 *     - Pick a portrait to swap for the Visual Cutin Effect.
 *     - Pick (None) to not use a portrait.
 *
 *   Extra Settings:
 *   - Extra Plugin Command settings pertaining to this Visual Cutin Effect's
 *     portrait only.
 *   - These settings will be displayed in a later section.
 *   - This Plugin Command will only have the Portrait-related settings.
 *
 * ---
 *
 * Cutin Change: Parallax Swap
 * - Changes target cutin-type's parallax with a different image.
 *
 *   Basic Settings:
 *
 *     Cutin Style Type:
 *     - What Visual Cutin Effect style type to update?
 *     - This determines which existing cutin-type to change.
 *
 *     Parallax Filename:
 *     - Pick a parallax to swap for the Visual Cutin Effect.
 *     - Pick (None) to not use a parallax.
 *
 *   Extra Settings:
 *   - Extra Plugin Command settings pertaining to this Visual Cutin Effect's
 *     parallax only.
 *   - These settings will be displayed in a later section.
 *   - This Plugin Command will only have the Parallax-related settings.
 *
 * ---
 * 
 * === Cutin End - Plugin Commands ===
 * 
 * ---
 *
 * Cutin End: End Visual Cutin Effect (All)
 * - Ends all Visual Cutin Effects currently present.
 * 
 *   Wait for Exit:
 *   - Wait until cutin exit is finished before performing the next
 *     event command?
 *
 * ---
 *
 * Cutin End: End Visual Cutin Effect (Type)
 * - Ends the Visual Cutin Effect with the matching type.
 *
 *   Cutin Style Type:
 *   - What Visual Cutin Effect style type do you wish to end?
 * 
 *   Wait for Exit:
 *   - Wait until cutin exit is finished before performing the next
 *     event command?
 *
 * ---
 * 
 * === Cutin Wait - Plugin Commands ===
 * 
 * ---
 * 
 * Cutin Wait: Wait for Entrance
 * - Wait until all cutin entrances are finished before performing the next
 *   event command.
 * 
 * ---
 * 
 * Cutin Wait: Wait for Exit
 * - Wait until all cutin exits are finished before performing the next
 *   event command.
 * 
 * ---
 * 
 * === Extra Settings ===
 * 
 * ---
 * 
 * These are the settings found in the "Extra Settings" for various cutin
 * Plugin Commands.
 * 
 * ---
 * 
 * Transition
 * 
 *   Entrance Duration:
 *   - How many frames does it take to fully enter?
 *   - Used when a Visual Cutin Effect starts.
 * 
 *   Exit Duration:
 *   - How many frames does it take to fully exit?
 *   - Used when a Visual Cutin Effect ends.
 * 
 * ---
 * 
 * Cutin Settings
 * 
 *   Show BG Color?:
 *   - Add a background color for this cutin?
 *   - Background colors appear behind the parallax.
 * 
 *   Show Outline?:
 *   - Show the cutin outline?
 * 
 * ---
 * 
 * Portrait Settings > Base Properties
 * 
 *   Anchor X:
 *   - Determines the sprite anchor X alignment.
 *   - 0.0: Left, 0.5: Center, 1.0: Right.
 * 
 *   Anchor Y:
 *   - Determines the sprite anchor Y alignment.
 *   - 0.0: Top, 0.5: Middle, 1.0: Bottom.
 * 
 *   Hue:
 *   - Do you wish to adjust this cutin's portrait hue?
 * 
 *   Opacity:
 *   - What is the opacity level of this cutin's portrait?
 * 
 *   Offset X:
 *   - Offsets the cutin portrait's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin portrait's Y location.
 *   - Negative: up. Positive: down.
 * 
 * ---
 * 
 * Portrait Settings > Entrance Properties
 * 
 *   Entrance X:
 *   - Sets the cutin portrait's X entrance.
 *   - Negative: from left. Positive: from right.
 * 
 *   Entrance Y:
 *   - Sets the cutin portrait's Y entrance.
 *   - Negative: from up. Positive: from down.
 * 
 *   Entrance Easing:
 *   - Select which easing type you wish to apply.
 * 
 * ---
 * 
 * Portrait Settings > Exit Properties
 * 
 *   Exit X:
 *   - Sets the cutin portrait's X exit.
 *   - Negative: to left. Positive: to right.
 * 
 *   Exit Y:
 *   - Sets the cutin portrait's Y exit.
 *   - Negative: to up. Positive: to down.
 * 
 *   Exit Easing:
 *   - Select which easing type you wish to apply.
 * 
 * ---
 * 
 * Portrait Settings > Flip Properties
 * 
 *   Flip Horizontally?:
 *   - Flip the cutin portrait horizontally?
 * 
 *   Flip Vertically?:
 *   - Flip the cutin portrait vertically?
 * 
 * ---
 *
 * Portrait Settings > Scaling Properties
 * 
 *   Forced Scaling:
 *   - Do you want to force a scaling ratio?
 *   - Leave as 0 for none.
 *   - Disables "Fit to Scale?".
 *   - There is NO one size fits all setting for this. Different cutin sizes
 *     will look better with different settings for this parameter.
 * 
 *   Fit to Scale?:
 *   - Scale the cutin portrait to fit the cutin style?
 *   - Cannot be used with "Forced Scaling".
 *   - There is NO one size fits all setting for this. Different cutin sizes
 *     will look better with different settings for this parameter.
 * 
 *     Scale Max?:
 *     - Scale the cutin portrait to the maximum fit or scale the cutin
 *       portrait to the minimum fit.
 *     - There is NO one size fits all setting for this. Different cutin sizes
 *       will look better with different settings for this parameter.
 * 
 * ---
 * 
 * Portrait Settings > Animated Portraits
 * 
 *   Loop?:
 *   - Will loop back to beginning once ended.
 *   - Requires VisuMZ_4_AnimatedPictures!
 * 
 *   Wait Frames:
 *   - Frames to wait before moving to next cell.
 *   - Requires VisuMZ_4_AnimatedPictures!
 *
 * ---
 *
 * Parallax Settings > Base Settings
 * 
 *   Blend Mode:
 *   - What kind of blend mode do you wish to apply to the cutin?
 * 
 *   Hue:
 *   - Do you wish to adjust this cutin's parallax hue?
 * 
 *   Opacity:
 *   - What is the opacity level of this cutin's parallax?
 * 
 * ---
 * 
 * Parallax Settings > Scrolling Settings
 * 
 *   Offset X:
 *   - Offsets the cutin parallax's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin parallax's Y location.
 *   - Negative: up. Positive: down.
 * 
 *   Scroll X:
 *   - How many pixels does the parallax scroll horizontally?
 *   - Negative: Scroll to right. Positive: Scroll to left.
 * 
 *   Scroll Y:
 *   - How many pixels does the parallax scroll vertically?
 *   - Negative: Scroll to down. Positive: Scroll to up.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Cutin Style Settings
 * ============================================================================
 *
 * The settings used for each of the various cutin styles. These adjust the
 * ways cutins appear in-game.
 *
 * ---
 *
 * Insert Style Name
 * 
 *   Insert Style Variations:
 *   - The settings used for this specific cutin style.
 *   - Each of them will contain the following sub-settings.
 *
 * ---
 *
 * Cutin
 * 
 *   Offset X:
 *   - Offsets the cutin overall's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin overall's Y location.
 *   - Negative: up. Positive: down.
 * 
 * ---
 * 
 * Entrance Movement
 * 
 *   Entrance X:
 *   - Sets the whole cutin's X entrance.
 *   - Negative: from left. Positive: from right.
 * 
 *   Entrance Y:
 *   - Sets the whole cutin's Y entrance.
 *   - Negative: from up. Positive: from down.
 * 
 *   Entrance Easing:
 *   - Select which easing type you wish to apply.
 *
 * ---
 * 
 * Exit Movement
 * 
 *   Exit X:
 *   - Sets the whole cutin's X entrance.
 *   - Negative: to left. Positive: to right.
 * 
 *   Exit Y:
 *   - Sets the whole cutin's Y entrance.
 *   - Negative: to up. Positive: to down.
 * 
 *   Exit Easing:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * Mask
 * 
 *   Filename:
 *   - Filename used for a custom cutin mask.
 *   - Leave empty for plugin-generated mask.
 * 
 * ---
 * 
 * Outline
 * 
 *   Filename:
 *   - Filename used for a custom cutin outline.
 *   - Leave empty for plugin-generated outline.
 * 
 *   Offset X:
 *   - Offsets the cutin outline's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin outline's Y location.
 *   - Negative: up. Positive: down.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Outline Settings
 * ============================================================================
 *
 * The settings used for plugin-generated outlines.
 *
 * ---
 *
 * Outer Layer
 * 
 *   Line Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Line Width:
 *   - What is the width of the line?
 *
 * ---
 *
 * Middle Layer
 * 
 *   Line Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Line Width:
 *   - What is the width of the line?
 *
 * ---
 *
 * Inner Layer
 * 
 *   Line Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Line Width:
 *   - What is the width of the line?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: "Extra Settings" Defaults
 * ============================================================================
 *
 * Default "Extra Settings" values if the "Extra Settings" Plugin Command
 * parameter is left untouched. In other words, if you just want the various
 * Plugin Commands to use a global set of settings, leave it empty and it will
 * draw from these instead.
 * 
 * For those wondering, yes, these are replica plugin parameters of the
 * "Extra Settings" found for the Plugin Commands.
 * 
 * With all that said, keep in mind that there is no one-size-fits all set of
 * "Extra Settings" that you can set as the default. The plugin-generated masks
 * and outlines are of many different shapes and sizes. And as images used as
 * portraits and parallaxes can be of many varying shapes and sizes as well,
 * there's not going to be a perfect setting for everything. Different
 * cutin-types need to be experimented with different settings in order to find
 * out what works best.
 *
 * ---
 * 
 * Transition
 * 
 *   Entrance Duration:
 *   - How many frames does it take to fully enter?
 *   - Used when a Visual Cutin Effect starts.
 * 
 *   Exit Duration:
 *   - How many frames does it take to fully exit?
 *   - Used when a Visual Cutin Effect ends.
 * 
 * ---
 * 
 * Cutin Settings
 * 
 *   Show BG Color?:
 *   - Add a background color for this cutin?
 *   - Background colors appear behind the parallax.
 * 
 *   Show Outline?:
 *   - Show the cutin outline?
 * 
 * ---
 * 
 * Portrait Settings > Base Properties
 * 
 *   Anchor X:
 *   - Determines the sprite anchor X alignment.
 *   - 0.0: Left, 0.5: Center, 1.0: Right.
 * 
 *   Anchor Y:
 *   - Determines the sprite anchor Y alignment.
 *   - 0.0: Top, 0.5: Middle, 1.0: Bottom.
 * 
 *   Hue:
 *   - Do you wish to adjust this cutin's portrait hue?
 * 
 *   Opacity:
 *   - What is the opacity level of this cutin's portrait?
 * 
 *   Offset X:
 *   - Offsets the cutin portrait's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin portrait's Y location.
 *   - Negative: up. Positive: down.
 * 
 * ---
 * 
 * Portrait Settings > Entrance Properties
 * 
 *   Entrance X:
 *   - Sets the cutin portrait's X entrance.
 *   - Negative: from left. Positive: from right.
 * 
 *   Entrance Y:
 *   - Sets the cutin portrait's Y entrance.
 *   - Negative: from up. Positive: from down.
 * 
 *   Entrance Easing:
 *   - Select which easing type you wish to apply.
 * 
 * ---
 * 
 * Portrait Settings > Exit Properties
 * 
 *   Exit X:
 *   - Sets the cutin portrait's X exit.
 *   - Negative: to left. Positive: to right.
 * 
 *   Exit Y:
 *   - Sets the cutin portrait's Y exit.
 *   - Negative: to up. Positive: to down.
 * 
 *   Exit Easing:
 *   - Select which easing type you wish to apply.
 * 
 * ---
 * 
 * Portrait Settings > Flip Properties
 * 
 *   Flip Horizontally?:
 *   - Flip the cutin portrait horizontally?
 * 
 *   Flip Vertically?:
 *   - Flip the cutin portrait vertically?
 * 
 * ---
 *
 * Portrait Settings > Scaling Properties
 * 
 *   Forced Scaling:
 *   - Do you want to force a scaling ratio?
 *   - Leave as 0 for none.
 *   - Disables "Fit to Scale?".
 *   - There is NO one size fits all setting for this. Different cutin sizes
 *     will look better with different settings for this parameter.
 * 
 *   Fit to Scale?:
 *   - Scale the cutin portrait to fit the cutin style?
 *   - Cannot be used with "Forced Scaling".
 *   - There is NO one size fits all setting for this. Different cutin sizes
 *     will look better with different settings for this parameter.
 * 
 *     Scale Max?:
 *     - Scale the cutin portrait to the maximum fit or scale the cutin
 *       portrait to the minimum fit.
 *     - There is NO one size fits all setting for this. Different cutin sizes
 *       will look better with different settings for this parameter.
 * 
 * ---
 * 
 * Portrait Settings > Animated Portraits
 * 
 *   Loop?:
 *   - Will loop back to beginning once ended.
 *   - Requires VisuMZ_4_AnimatedPictures!
 * 
 *   Wait Frames:
 *   - Frames to wait before moving to next cell.
 *   - Requires VisuMZ_4_AnimatedPictures!
 *
 * ---
 *
 * Parallax Settings > Base Settings
 * 
 *   Blend Mode:
 *   - What kind of blend mode do you wish to apply to the cutin?
 * 
 *   Hue:
 *   - Do you wish to adjust this cutin's parallax hue?
 * 
 *   Opacity:
 *   - What is the opacity level of this cutin's parallax?
 * 
 * ---
 * 
 * Parallax Settings > Scrolling Settings
 * 
 *   Offset X:
 *   - Offsets the cutin parallax's X location.
 *   - Negative: left. Positive: right.
 * 
 *   Offset Y:
 *   - Offsets the cutin parallax's Y location.
 *   - Negative: up. Positive: down.
 * 
 *   Scroll X:
 *   - How many pixels does the parallax scroll horizontally?
 *   - Negative: Scroll to right. Positive: Scroll to left.
 * 
 *   Scroll Y:
 *   - How many pixels does the parallax scroll vertically?
 *   - Negative: Scroll to down. Positive: Scroll to up.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Cutin Layer Settings
 * ============================================================================
 *
 * These settings determine where the visual cutin layer is placed.
 *
 * ---
 * 
 * Settings
 * 
 *   Cutin Layer:
 *   - Where do you want the visual cutins layer placed?
 *     - Top - Above Everything Else
 *     - Below - Below UI Elements (Default)
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
 * Version 1.02: March 20, 2025
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Olivia:
 * *** Plugin Parameters > Cutin Layer
 * **** Where do you want the visual cutins layer placed?
 * ***** Top - Above Everything Else
 * ***** Below - Below UI Elements (Default)
 * 
 * Version 1.01: October 17, 2024
 * * Bug Fixes!
 * ** Fixed a crash where clearing cutins under certain conditions would cause
 *    an error. Fix made by Arisu.
 * 
 * Version 1.00 Official Release Date: March 1, 2023
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinStart_VisualCutinEffect
 * @text Cutin Add: Add Visual Cutin Effect
 * @desc Adds the Visual Cutin Effect using these desired settings.
 * Only one of each cutin-style type can be present at a time.
 * 
 * @arg Basic
 * @text Basic Settings
 * 
 * @arg type:str
 * @text Cutin Style Type
 * @parent Basic
 * @type select
 * @option -
 * @option Whole
 * @option -
 * @option Showcase
 * @option -
 * @option LeftHorzSpan
 * @option CenterHorzSpan
 * @option RightHorzSpan
 * @option -
 * @option LeftHorzSlash
 * @option RightHorzSlash
 * @option -
 * @option LeftVertSlash
 * @option RightVertSlash
 * @option -
 * @option LeftMajor
 * @option RightMajor
 * @option -
 * @option LeftMinor
 * @option CenterMinor
 * @option RightMinor
 * @option -
 * @option LeftDiamond
 * @option CenterDiamond
 * @option RightDiamond
 * @option -
 * @option LeftGemstone
 * @option CenterGemstone
 * @option RightGemstone
 * @option -
 * @option TopLeftQuad
 * @option TopRightQuad
 * @option BottomLeftQuad
 * @option BottomRightQuad
 * @option -
 * @option TopLeftCorner
 * @option TopRightCorner
 * @option BottomLeftCorner
 * @option BottomRightCorner
 * @option -
 * @option Row1stThird
 * @option Row2ndThird
 * @option Row3rdThird
 * @option -
 * @option Row1stFourth
 * @option Row2ndFourth
 * @option Row3rdFourth
 * @option Row4thFourth
 * @option -
 * @option Row1stFifth
 * @option Row2ndFifth
 * @option Row3rdFifth
 * @option Row4thFifth
 * @option Row5thFifth
 * @option -
 * @option Col1stThird
 * @option Col2ndThird
 * @option Col3rdThird
 * @option -
 * @option Col1stFourth
 * @option Col2ndFourth
 * @option Col3rdFourth
 * @option Col4thFourth
 * @option -
 * @option Col1stFifth
 * @option Col2ndFifth
 * @option Col3rdFifth
 * @option Col4thFifth
 * @option Col5thFifth
 * @option -
 * @option SixPack1
 * @option SixPack2
 * @option SixPack3
 * @option SixPack4
 * @option SixPack5
 * @option SixPack6
 * @option -
 * @option EightPack1
 * @option EightPack2
 * @option EightPack3
 * @option EightPack4
 * @option EightPack5
 * @option EightPack6
 * @option EightPack7
 * @option EightPack8
 * @option -
 * @option TwelvePack1
 * @option TwelvePack2
 * @option TwelvePack3
 * @option TwelvePack4
 * @option TwelvePack5
 * @option TwelvePack6
 * @option TwelvePack7
 * @option TwelvePack8
 * @option TwelvePack9
 * @option TwelvePack10
 * @option TwelvePack11
 * @option TwelvePack12
 * @option -
 * @desc What Visual Cutin Effect style type do you wish to use?
 * Refer to VisuMZ wiki for visuals on styles.
 * @default CenterHorzSpan
 *
 * @arg portraitFilename:str
 * @text Portrait Filename
 * @parent Basic
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Pick a portrait to use for the Visual Cutin Effect.
 * Pick (None) to not use a portrait.
 * @default >>>ATTENTION<<<
 *
 * @arg parallaxFilename:str
 * @text Parallax Filename
 * @parent Basic
 * @type file
 * @dir img/parallaxes/
 * @require 1
 * @desc Pick a parallax to use for the Visual Cutin Effect.
 * Pick (None) to not use a parallax.
 * @default >>>ATTENTION<<<
 *
 * @arg bgColor:str
 * @text Background Color
 * @parent Basic
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #888888
 *
 * @arg ExtraSettings:struct
 * @text Extra Settings
 * @type struct<Command>
 * @desc Extra Plugin Command settings pertaining to this Visual Cutin Effect.
 * @default {}
 * 
 * @arg WaitForEntrance:eval
 * @text Wait For Entrance
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until cutin entrance is finished before performing
 * the next event command?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_CutinChange
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinChange_PortraitSwap
 * @text Cutin Change: Portrait Swap
 * @desc Changes target cutin-type's portrait with a different image.
 * 
 * @arg Basic
 * @text Basic Settings
 * 
 * @arg type:str
 * @text Cutin Style Type
 * @parent Basic
 * @type select
 * @option -
 * @option Whole
 * @option -
 * @option Showcase
 * @option -
 * @option LeftHorzSpan
 * @option CenterHorzSpan
 * @option RightHorzSpan
 * @option -
 * @option LeftHorzSlash
 * @option RightHorzSlash
 * @option -
 * @option LeftVertSlash
 * @option RightVertSlash
 * @option -
 * @option LeftMajor
 * @option RightMajor
 * @option -
 * @option LeftMinor
 * @option CenterMinor
 * @option RightMinor
 * @option -
 * @option LeftDiamond
 * @option CenterDiamond
 * @option RightDiamond
 * @option -
 * @option LeftGemstone
 * @option CenterGemstone
 * @option RightGemstone
 * @option -
 * @option TopLeftQuad
 * @option TopRightQuad
 * @option BottomLeftQuad
 * @option BottomRightQuad
 * @option -
 * @option TopLeftCorner
 * @option TopRightCorner
 * @option BottomLeftCorner
 * @option BottomRightCorner
 * @option -
 * @option Row1stThird
 * @option Row2ndThird
 * @option Row3rdThird
 * @option -
 * @option Row1stFourth
 * @option Row2ndFourth
 * @option Row3rdFourth
 * @option Row4thFourth
 * @option -
 * @option Row1stFifth
 * @option Row2ndFifth
 * @option Row3rdFifth
 * @option Row4thFifth
 * @option Row5thFifth
 * @option -
 * @option Col1stThird
 * @option Col2ndThird
 * @option Col3rdThird
 * @option -
 * @option Col1stFourth
 * @option Col2ndFourth
 * @option Col3rdFourth
 * @option Col4thFourth
 * @option -
 * @option Col1stFifth
 * @option Col2ndFifth
 * @option Col3rdFifth
 * @option Col4thFifth
 * @option Col5thFifth
 * @option -
 * @option SixPack1
 * @option SixPack2
 * @option SixPack3
 * @option SixPack4
 * @option SixPack5
 * @option SixPack6
 * @option -
 * @option EightPack1
 * @option EightPack2
 * @option EightPack3
 * @option EightPack4
 * @option EightPack5
 * @option EightPack6
 * @option EightPack7
 * @option EightPack8
 * @option -
 * @option TwelvePack1
 * @option TwelvePack2
 * @option TwelvePack3
 * @option TwelvePack4
 * @option TwelvePack5
 * @option TwelvePack6
 * @option TwelvePack7
 * @option TwelvePack8
 * @option TwelvePack9
 * @option TwelvePack10
 * @option TwelvePack11
 * @option TwelvePack12
 * @option -
 * @desc What Visual Cutin Effect style type to update?
 * This determines which existing cutin-type to change.
 * @default CenterHorzSpan
 *
 * @arg portraitFilename:str
 * @text Portrait Filename
 * @parent Basic
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Pick a portrait to swap for the Visual Cutin Effect.
 * Pick (None) to not use a portrait.
 * @default >>>ATTENTION<<<
 *
 * @arg ExtraSettings:struct
 * @text Extra Settings
 * @type struct<Portrait>
 * @desc Extra Plugin Command settings pertaining to this Visual
 * Cutin Effect's portrait only.
 * @default {}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinChange_ParallaxSwap
 * @text Cutin Change: Parallax Swap
 * @desc Changes target cutin-type's parallax with a different image.
 * 
 * @arg Basic
 * @text Basic Settings
 * 
 * @arg type:str
 * @text Cutin Style Type
 * @parent Basic
 * @type select
 * @option -
 * @option Whole
 * @option -
 * @option Showcase
 * @option -
 * @option LeftHorzSpan
 * @option CenterHorzSpan
 * @option RightHorzSpan
 * @option -
 * @option LeftHorzSlash
 * @option RightHorzSlash
 * @option -
 * @option LeftVertSlash
 * @option RightVertSlash
 * @option -
 * @option LeftMajor
 * @option RightMajor
 * @option -
 * @option LeftMinor
 * @option CenterMinor
 * @option RightMinor
 * @option -
 * @option LeftDiamond
 * @option CenterDiamond
 * @option RightDiamond
 * @option -
 * @option LeftGemstone
 * @option CenterGemstone
 * @option RightGemstone
 * @option -
 * @option TopLeftQuad
 * @option TopRightQuad
 * @option BottomLeftQuad
 * @option BottomRightQuad
 * @option -
 * @option TopLeftCorner
 * @option TopRightCorner
 * @option BottomLeftCorner
 * @option BottomRightCorner
 * @option -
 * @option Row1stThird
 * @option Row2ndThird
 * @option Row3rdThird
 * @option -
 * @option Row1stFourth
 * @option Row2ndFourth
 * @option Row3rdFourth
 * @option Row4thFourth
 * @option -
 * @option Row1stFifth
 * @option Row2ndFifth
 * @option Row3rdFifth
 * @option Row4thFifth
 * @option Row5thFifth
 * @option -
 * @option Col1stThird
 * @option Col2ndThird
 * @option Col3rdThird
 * @option -
 * @option Col1stFourth
 * @option Col2ndFourth
 * @option Col3rdFourth
 * @option Col4thFourth
 * @option -
 * @option Col1stFifth
 * @option Col2ndFifth
 * @option Col3rdFifth
 * @option Col4thFifth
 * @option Col5thFifth
 * @option -
 * @option SixPack1
 * @option SixPack2
 * @option SixPack3
 * @option SixPack4
 * @option SixPack5
 * @option SixPack6
 * @option -
 * @option EightPack1
 * @option EightPack2
 * @option EightPack3
 * @option EightPack4
 * @option EightPack5
 * @option EightPack6
 * @option EightPack7
 * @option EightPack8
 * @option -
 * @option TwelvePack1
 * @option TwelvePack2
 * @option TwelvePack3
 * @option TwelvePack4
 * @option TwelvePack5
 * @option TwelvePack6
 * @option TwelvePack7
 * @option TwelvePack8
 * @option TwelvePack9
 * @option TwelvePack10
 * @option TwelvePack11
 * @option TwelvePack12
 * @option -
 * @desc What Visual Cutin Effect style type to update?
 * This determines which existing cutin-type to change.
 * @default CenterHorzSpan
 *
 * @arg parallaxFilename:str
 * @text Parallax Filename
 * @parent Basic
 * @type file
 * @dir img/parallaxes/
 * @require 1
 * @desc Pick a parallax to swap for the Visual Cutin Effect.
 * Pick (None) to not use a parallax.
 * @default >>>ATTENTION<<<
 *
 * @arg ExtraSettings:struct
 * @text Extra Settings
 * @type struct<Parallax>
 * @desc Extra Plugin Command settings pertaining to this Visual
 * Cutin Effect's parallax only.
 * @default {}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_CutinEnd
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinEnd_VisualCutinEffectAll
 * @text Cutin End: End Visual Cutin Effect (All)
 * @desc Ends all Visual Cutin Effects currently present.
 * 
 * @arg WaitForExit:eval
 * @text Wait For Exit
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until cutin exit is finished before performing
 * the next event command?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinEnd_VisualCutinEffectType
 * @text Cutin End: End Visual Cutin Effect (Type)
 * @desc Ends the Visual Cutin Effect with the matching type.
 * 
 * @arg type:str
 * @text Cutin Style Type
 * @type select
 * @option -
 * @option Whole
 * @option -
 * @option Showcase
 * @option -
 * @option LeftHorzSpan
 * @option CenterHorzSpan
 * @option RightHorzSpan
 * @option -
 * @option LeftHorzSlash
 * @option RightHorzSlash
 * @option -
 * @option LeftVertSlash
 * @option RightVertSlash
 * @option -
 * @option LeftMajor
 * @option RightMajor
 * @option -
 * @option LeftMinor
 * @option CenterMinor
 * @option RightMinor
 * @option -
 * @option LeftDiamond
 * @option CenterDiamond
 * @option RightDiamond
 * @option -
 * @option LeftGemstone
 * @option CenterGemstone
 * @option RightGemstone
 * @option -
 * @option TopLeftQuad
 * @option TopRightQuad
 * @option BottomLeftQuad
 * @option BottomRightQuad
 * @option -
 * @option TopLeftCorner
 * @option TopRightCorner
 * @option BottomLeftCorner
 * @option BottomRightCorner
 * @option -
 * @option Row1stThird
 * @option Row2ndThird
 * @option Row3rdThird
 * @option -
 * @option Row1stFourth
 * @option Row2ndFourth
 * @option Row3rdFourth
 * @option Row4thFourth
 * @option -
 * @option Row1stFifth
 * @option Row2ndFifth
 * @option Row3rdFifth
 * @option Row4thFifth
 * @option Row5thFifth
 * @option -
 * @option Col1stThird
 * @option Col2ndThird
 * @option Col3rdThird
 * @option -
 * @option Col1stFourth
 * @option Col2ndFourth
 * @option Col3rdFourth
 * @option Col4thFourth
 * @option -
 * @option Col1stFifth
 * @option Col2ndFifth
 * @option Col3rdFifth
 * @option Col4thFifth
 * @option Col5thFifth
 * @option -
 * @option SixPack1
 * @option SixPack2
 * @option SixPack3
 * @option SixPack4
 * @option SixPack5
 * @option SixPack6
 * @option -
 * @option EightPack1
 * @option EightPack2
 * @option EightPack3
 * @option EightPack4
 * @option EightPack5
 * @option EightPack6
 * @option EightPack7
 * @option EightPack8
 * @option -
 * @option TwelvePack1
 * @option TwelvePack2
 * @option TwelvePack3
 * @option TwelvePack4
 * @option TwelvePack5
 * @option TwelvePack6
 * @option TwelvePack7
 * @option TwelvePack8
 * @option TwelvePack9
 * @option TwelvePack10
 * @option TwelvePack11
 * @option TwelvePack12
 * @option -
 * @desc What Visual Cutin Effect style type do you wish to end?
 * @default CenterHorzSpan
 * 
 * @arg WaitForExit:eval
 * @text Wait For Exit
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until cutin exit is finished before performing
 * the next event command?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Wait
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinWait_WaitForEntrance
 * @text Cutin Wait: Wait for Entrance
 * @desc Wait until all cutin entrances are finished before performing the next event command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CutinWait_WaitForExit
 * @text Cutin Wait: Wait for Exit
 * @desc Wait until all cutin exits are finished before performing the next event command.
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
 * @param VisualCutinEffect
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Styles:struct
 * @text Cutin Style Settings
 * @type struct<Styles>
 * @desc The settings used for each of the various cutin styles.
 * @default {"WholeStyles":"","whole:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","ShowcaseStyles":"","showcase:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","HorzSpanStyles":"","lefthorzspan:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","centerhorzspan:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","righthorzspan:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","HorzSlashStyles":"","lefthorzslash:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","righthorzslash:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","VertSlashStyles":"","leftvertslash:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","rightvertslash:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","MajorStyles":"","leftmajor:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","rightmajor:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","MinorStyles":"","leftminor:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","centerminor:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","rightminor:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","DiamondStyles":"","leftdiamond:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-96\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","centerdiamond:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","rightdiamond:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+96\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","GemstoneStyles":"","leftgemstone:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-96\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","centergemstone:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","rightgemstone:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+96\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+96\",\"exitY:num\":\"+96\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","QuadStyles":"","topleftquad:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","toprightquad:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","bottomleftquad:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","bottomrightquad:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","CornerStyles":"","topleftcorner:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","toprightcorner:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","bottomleftcorner:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","bottomrightcorner:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","RowThirdStyles":"","row1stthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-36\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+36\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row2ndthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-36\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+36\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row3rdthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-36\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+36\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","RowFourthStyles":"","row1stfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row2ndfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row3rdfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row4thfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","RowFifthStyles":"","row1stfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row2ndfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row3rdfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row4thfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","row5thfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-24\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+24\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","ColThirdStyles":"","col1stthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col2ndthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col3rdthird:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","ColFourthStyles":"","col1stfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col2ndfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col3rdfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col4thfourth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","ColFifthStyles":"","col1stfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col2ndfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col3rdfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col4thfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","col5thfifth:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+96\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-96\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","PackSixStyles":"","sixpack1:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","sixpack2:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","sixpack3:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","sixpack4:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","sixpack5:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+0\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+0\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","sixpack6:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","PackEightStyles":"","eightpack1:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack2:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-24\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-24\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack3:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+24\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+24\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack4:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack5:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack6:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-24\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-24\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack7:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+24\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+24\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","eightpack8:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","PackTwelveStyles":"","twelvepack1:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack2:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-24\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-24\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack3:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+24\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+24\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack4:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"-48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"-48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack5:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack6:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack7:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack8:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+0\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+0\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack9:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack10:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"-24\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"-24\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack11:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+24\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+24\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","twelvepack12:struct":"{\"Cutin\":\"\",\"cutinOffsetX:num\":\"+0\",\"cutinOffsetY:num\":\"+0\",\"Enter\":\"\",\"enterX:num\":\"+48\",\"enterY:num\":\"+48\",\"enterEasingType:str\":\"InOutSine\",\"Exit\":\"\",\"exitX:num\":\"+48\",\"exitY:num\":\"+48\",\"exitEasingType:str\":\"InOutSine\",\"Mask\":\"\",\"maskFilename:str\":\"\",\"Outline\":\"\",\"outlineFilename:str\":\"\",\"outlineOffsetX:num\":\"+0\",\"outlineOffsetY:num\":\"+0\"}","End":""}
 *
 * @param Outline:struct
 * @text Outline Settings
 * @type struct<Outline>
 * @desc The settings used for plugin-generated outlines.
 * @default {"Outer":"","outerOutlineColor:str":"#000000","outerOutlineWeight:num":"4","Middle":"","middleOutlineColor:str":"#ffffff","middleOutlineWeight:num":"8","Inner":"","innerOutlineColor:str":"#000000","innerOutlineWeight:num":"4"}
 *
 * @param ExtraDefaults:struct
 * @text "Extra Settings" Defaults
 * @type struct<Command>
 * @desc Default "Extra Settings" values if the "Extra Settings"
 * Plugin Command parameter is left untouched.
 * @default {"Transition":"","enterDuration:num":"12","exitDuration:num":"12","Cutin":"","bgShow:eval":"true","outlineShow:eval":"true","Portrait":"","PortraitBase":"","portraitAnchorX:num":"0.5","portraitAnchorY:num":"0.5","portraitHue:num":"0","portraitOpacity:num":"255","portraitOffsetX:num":"+0","portraitOffsetY:num":"+0","PortraitEnter":"","portraitEnterX:num":"+0","portraitEnterY:num":"+0","portraitEnterEasingType:str":"InOutSine","PortraitExit":"","portraitExitX:num":"+0","portraitExitY:num":"+0","portraitExitEasingType:str":"InOutSine","PortraitFlip":"","portraitFlipHorz:eval":"false","portraitFlipVert:eval":"false","PortraitScale":"","portraitForcedScale:num":"0.0","portraitScaleToFit:eval":"true","portraitScaleMax:eval":"false","PortraitAni":"","animatedPortraitLooping:eval":"true","animatedPortraitWaitFrames:num":"4","Parallax":"","ParallaxBase":"","parallaxBlendMode:num":"0","parallaxHue:num":"0","parallaxOpacity:num":"255","ParallaxScroll":"","parallaxOffsetX:num":"+0.0","parallaxOffsetY:num":"+0.0","parallaxScrollX:num":"+0.0","parallaxScrollY:num":"+0.0"}
 *
 * @param CutinLayer:str
 * @text Cutin Layer
 * @type select
 * @option Top - Above Everything Else
 * @value top
 * @option Below - Below UI Elements (Default)
 * @value below
 * @desc Where do you want the visual cutins layer placed?
 * @default below
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
 * Styles Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Styles:
 *
 * @param WholeStyles
 * @text ---Whole Style---
 *
 * @param whole:struct
 * @text Whole
 * @parent WholeStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param ShowcaseStyles
 * @text ---Showcase Style---
 *
 * @param showcase:struct
 * @text Showcase
 * @parent ShowcaseStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param HorzSpanStyles
 * @text ---Horizontal Span---
 *
 * @param lefthorzspan:struct
 * @text LeftHorzSpan
 * @parent HorzSpanStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param centerhorzspan:struct
 * @text CenterHorzSpan
 * @parent HorzSpanStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param righthorzspan:struct
 * @text RightHorzSpan
 * @parent HorzSpanStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param HorzSlashStyles
 * @text ---Horizontal Slash---
 *
 * @param lefthorzslash:struct
 * @text LeftHorzSlash
 * @parent HorzSlashStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param righthorzslash:struct
 * @text RightHorzSlash
 * @parent HorzSlashStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param VertSlashStyles
 * @text ---Vertical Slash---
 *
 * @param leftvertslash:struct
 * @text LeftVertSlash
 * @parent VertSlashStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param rightvertslash:struct
 * @text RightVertSlash
 * @parent VertSlashStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param MajorStyles
 * @text ---Major Styles---
 *
 * @param leftmajor:struct
 * @text LeftMajor
 * @parent MajorStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param rightmajor:struct
 * @text RightMajor
 * @parent MajorStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param MinorStyles
 * @text ---Minor Styles---
 *
 * @param leftminor:struct
 * @text LeftMinor
 * @parent MinorStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param centerminor:struct
 * @text CenterMinor
 * @parent MinorStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param rightminor:struct
 * @text RightMinor
 * @parent MinorStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param DiamondStyles
 * @text ---Diamond Styles---
 *
 * @param leftdiamond:struct
 * @text LeftDiamond
 * @parent DiamondStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-96","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param centerdiamond:struct
 * @text CenterDiamond
 * @parent DiamondStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param rightdiamond:struct
 * @text RightDiamond
 * @parent DiamondStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+96","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param GemstoneStyles
 * @text ---Gemstone Styles---
 *
 * @param leftgemstone:struct
 * @text LeftGemstone
 * @parent GemstoneStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-96","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param centergemstone:struct
 * @text CenterGemstone
 * @parent GemstoneStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param rightgemstone:struct
 * @text RightGemstone
 * @parent GemstoneStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+96","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+96","exitY:num":"+96","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param QuadStyles
 * @text ---Quadrant Styles---
 *
 * @param topleftquad:struct
 * @text TopLeftQuad
 * @parent QuadStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.0, 0.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param toprightquad:struct
 * @text TopRightQuad
 * @parent QuadStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 1.0, 0.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param bottomleftquad:struct
 * @text BottomLeftQuad
 * @parent QuadStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.0, 1.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param bottomrightquad:struct
 * @text BottomRightQuad
 * @parent QuadStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 1.0, 1.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param CornerStyles
 * @text ---Corner Styles---
 *
 * @param topleftcorner:struct
 * @text TopLeftCorner
 * @parent CornerStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.0, 0.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param toprightcorner:struct
 * @text TopRightCorner
 * @parent CornerStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 1.0, 0.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param bottomleftcorner:struct
 * @text BottomLeftCorner
 * @parent CornerStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.0, 1.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param bottomrightcorner:struct
 * @text BottomRightCorner
 * @parent CornerStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 1.0, 1.0
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param RowThirdStyles
 * @text ---Row Thirds---
 *
 * @param row1stthird:struct
 * @text Row1stThird
 * @parent RowThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-36","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+36","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row2ndthird:struct
 * @text Row2ndThird
 * @parent RowThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-36","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+36","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row3rdthird:struct
 * @text Row3rdThird
 * @parent RowThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-36","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+36","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param RowFourthStyles
 * @text ---Row Fourths---
 *
 * @param row1stfourth:struct
 * @text Row1stFourth
 * @parent RowFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row2ndfourth:struct
 * @text Row2ndFourth
 * @parent RowFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row3rdfourth:struct
 * @text Row3rdFourth
 * @parent RowFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row4thfourth:struct
 * @text Row4thFourth
 * @parent RowFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param RowFifthStyles
 * @text ---Row Fifths---
 *
 * @param row1stfifth:struct
 * @text Row1stFifth
 * @parent RowFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row2ndfifth:struct
 * @text Row2ndFifth
 * @parent RowFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row3rdfifth:struct
 * @text Row3rdFifth
 * @parent RowFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row4thfifth:struct
 * @text Row4thFifth
 * @parent RowFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param row5thfifth:struct
 * @text Row5thFifth
 * @parent RowFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-24","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+24","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 * 
 * @param ColThirdStyles
 * @text ---Column Thirds---
 *
 * @param col1stthird:struct
 * @text Col1stThird
 * @parent ColThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col2ndthird:struct
 * @text Col2ndThird
 * @parent ColThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col3rdthird:struct
 * @text Col3rdThird
 * @parent ColThirdStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param ColFourthStyles
 * @text ---Column Fourths---
 *
 * @param col1stfourth:struct
 * @text Col1stFourth
 * @parent ColFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col2ndfourth:struct
 * @text Col2ndFourth
 * @parent ColFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col3rdfourth:struct
 * @text Col3rdFourth
 * @parent ColFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col4thfourth:struct
 * @text Col4thFourth
 * @parent ColFourthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param ColFifthStyles
 * @text ---Column Fifths---
 *
 * @param col1stfifth:struct
 * @text Col1stFifth
 * @parent ColFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col2ndfifth:struct
 * @text Col2ndFifth
 * @parent ColFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col3rdfifth:struct
 * @text Col3rdFifth
 * @parent ColFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col4thfifth:struct
 * @text Col4thFifth
 * @parent ColFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param col5thfifth:struct
 * @text Col5thFifth
 * @parent ColFifthStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+96","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-96","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param PackSixStyles
 * @text ---Six Pack---
 *
 * @param sixpack1:struct
 * @text SixPack1
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param sixpack2:struct
 * @text SixPack2
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param sixpack3:struct
 * @text SixPack3
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param sixpack4:struct
 * @text SixPack4
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param sixpack5:struct
 * @text SixPack5
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+0","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+0","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param sixpack6:struct
 * @text SixPack6
 * @parent PackSixStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param PackEightStyles
 * @text ---Eight Pack---
 *
 * @param eightpack1:struct
 * @text EightPack1
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack2:struct
 * @text EightPack2
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-24","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-24","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack3:struct
 * @text EightPack3
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+24","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+24","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack4:struct
 * @text EightPack4
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack5:struct
 * @text EightPack5
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack6:struct
 * @text EightPack6
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-24","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-24","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack7:struct
 * @text EightPack7
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+24","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+24","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param eightpack8:struct
 * @text EightPack8
 * @parent PackEightStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param PackTwelveStyles
 * @text ---Twelve Pack---
 *
 * @param twelvepack1:struct
 * @text TwelvePack1
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack2:struct
 * @text TwelvePack2
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-24","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-24","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack3:struct
 * @text TwelvePack3
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+24","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+24","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack4:struct
 * @text TwelvePack4
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"-48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"-48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack5:struct
 * @text TwelvePack5
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack6:struct
 * @text TwelvePack6
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack7:struct
 * @text TwelvePack7
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack8:struct
 * @text TwelvePack8
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+0","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+0","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack9:struct
 * @text TwelvePack9
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack10:struct
 * @text TwelvePack10
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"-24","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"-24","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack11:struct
 * @text TwelvePack11
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+24","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+24","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param twelvepack12:struct
 * @text TwelvePack12
 * @parent PackTwelveStyles
 * @type struct<StyleData>
 * @desc The settings used for this specific cutin style.
 * Anchor X/Y: 0.5, 0.5
 * @default {"Cutin":"","cutinOffsetX:num":"+0","cutinOffsetY:num":"+0","Enter":"","enterX:num":"+48","enterY:num":"+48","enterEasingType:str":"InOutSine","Exit":"","exitX:num":"+48","exitY:num":"+48","exitEasingType:str":"InOutSine","Mask":"","maskFilename:str":"","Outline":"","outlineFilename:str":"","outlineOffsetX:num":"+0","outlineOffsetY:num":"+0"}
 *
 * @param End
 * @text --------------------
 *
 */
/* ----------------------------------------------------------------------------
 * Style Data Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~StyleData:
 *
 * @param Cutin
 * 
 * @param cutinOffsetX:num
 * @text Offset X
 * @parent Cutin
 * @desc Offsets the cutin overall's X location.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param cutinOffsetY:num
 * @text Offset Y
 * @parent Cutin
 * @desc Offsets the cutin overall's Y location.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param Enter
 * @text Entrance Movement
 * 
 * @param enterX:num
 * @text Entrance X
 * @parent Enter
 * @desc Sets the whole cutin's X entrance.
 * Negative: from left. Positive: from right.
 * @default +0
 * 
 * @param enterY:num
 * @text Entrance Y
 * @parent Enter
 * @desc Sets the whole cutin's Y entrance.
 * Negative: from up. Positive: from down.
 * @default +0
 *
 * @param enterEasingType:str
 * @text Entrance Easing
 * @parent Enter
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
 * @default InOutSine
 *
 * @param Exit
 * @text Exit Movement
 * 
 * @param exitX:num
 * @text Exit X
 * @parent Exit
 * @desc Sets the whole cutin's X exit.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param exitY:num
 * @text Exit Y
 * @parent Exit
 * @desc Sets the whole cutin's Y exit.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param exitEasingType:str
 * @text Exit Easing
 * @parent Exit
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
 * @default InOutSine
 *
 * @param Mask
 *
 * @param maskFilename:str
 * @text Filename
 * @parent Mask
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for a custom cutin mask.
 * Leave empty for plugin-generated mask.
 * @default 
 *
 * @param Outline
 *
 * @param outlineFilename:str
 * @text Filename
 * @parent Outline
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for a custom cutin outline.
 * Leave empty for plugin-generated outline.
 * @default 
 * 
 * @param outlineOffsetX:num
 * @text Offset X
 * @parent Outline
 * @desc Offsets the cutin outline's X location.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param outlineOffsetY:num
 * @text Offset Y
 * @parent Outline
 * @desc Offsets the cutin outline's Y location.
 * Negative: up. Positive: down.
 * @default +0
 *
 */
/* ----------------------------------------------------------------------------
 * Outline Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Outline:
 *
 * @param Outer
 * @text Outer Layer
 *
 * @param outerOutlineColor:str
 * @text Line Color
 * @parent Outer
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #000000
 * 
 * @param outerOutlineWeight:num
 * @text Line Width
 * @parent Outer
 * @type number
 * @desc What is the width of the line?
 * @default 4
 *
 * @param Middle
 * @text Middle Layer
 *
 * @param middleOutlineColor:str
 * @text Line Color
 * @parent Middle
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #ffffff
 * 
 * @param middleOutlineWeight:num
 * @text Line Width
 * @parent Middle
 * @type number
 * @desc What is the width of the line?
 * @default 8
 *
 * @param Inner
 * @text Inner Layer
 *
 * @param innerOutlineColor:str
 * @text Line Color
 * @parent Inner
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #000000
 * 
 * @param innerOutlineWeight:num
 * @text Line Width
 * @parent Inner
 * @type number
 * @desc What is the width of the line?
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Command Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Command:
 *
 * @param Transition
 * 
 * @param enterDuration:num
 * @text Entrance Duration
 * @parent Transition
 * @type number
 * @desc How many frames does it take to fully enter?
 * Used when a Visual Cutin Effect starts.
 * @default 12
 * 
 * @param exitDuration:num
 * @text Exit Duration
 * @parent Transition
 * @type number
 * @desc How many frames does it take to fully exit?
 * Used when a Visual Cutin Effect ends.
 * @default 12
 *
 * @param Cutin
 * @text Cutin Settings
 *
 * @param bgShow:eval
 * @text Show BG Color?
 * @parent Cutin
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Add a background color for this cutin?
 * Background colors appear behind the parallax.
 * @default true
 *
 * @param outlineShow:eval
 * @text Show Outline?
 * @parent Cutin
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show the cutin outline?
 * @default true
 *
 * @param Portrait
 * @text Portrait Settings
 *
 * @param PortraitBase
 * @text Base Properties
 * @parent Portrait
 * 
 * @param portraitAnchorX:num
 * @text Anchor X
 * @parent PortraitBase
 * @desc Determines the sprite anchor X alignment.
 * 0.0: Left, 0.5: Center, 1.0: Right.
 * @default 0.5
 * 
 * @param portraitAnchorY:num
 * @text Anchor Y
 * @parent PortraitBase
 * @desc Determines the sprite anchor Y alignment.
 * 0.0: Top, 0.5: Middle, 1.0: Bottom.
 * @default 0.5
 *
 * @param portraitHue:num
 * @text Hue
 * @parent PortraitBase
 * @type number
 * @min 0
 * @max 360
 * @desc Do you wish to adjust this cutin's portrait hue?
 * @default 0
 * 
 * @param portraitOpacity:num
 * @text Opacity
 * @parent PortraitBase
 * @type number
 * @max 255
 * @desc What is the opacity level of this cutin's portrait?
 * @default 255
 * 
 * @param portraitOffsetX:num
 * @text Offset X
 * @parent PortraitBase
 * @desc Offsets the cutin portrait's X location.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param portraitOffsetY:num
 * @text Offset Y
 * @parent PortraitBase
 * @desc Offsets the cutin portrait's Y location.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param PortraitEnter
 * @text Entrance Properties
 * @parent Portrait
 * 
 * @param portraitEnterX:num
 * @text Entrance X
 * @parent PortraitEnter
 * @desc Sets the cutin portrait's X entrance.
 * Negative: from left. Positive: from right.
 * @default +0
 * 
 * @param portraitEnterY:num
 * @text Entrance Y
 * @parent PortraitEnter
 * @desc Sets the cutin portrait's Y entrance.
 * Negative: from up. Positive: from down.
 * @default +0
 *
 * @param portraitEnterEasingType:str
 * @text Entrance Easing
 * @parent PortraitEnter
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
 * @default InOutSine
 *
 * @param PortraitExit
 * @text Exit Properties
 * @parent Portrait
 * 
 * @param portraitExitX:num
 * @text Exit X
 * @parent PortraitExit
 * @desc Sets the cutin portrait's X exit.
 * Negative: to left. Positive: to right.
 * @default +0
 * 
 * @param portraitExitY:num
 * @text Exit Y
 * @parent PortraitExit
 * @desc Sets the cutin portrait's Y exit.
 * Negative: to up. Positive: to down.
 * @default +0
 *
 * @param portraitExitEasingType:str
 * @text Exit Easing
 * @parent PortraitExit
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
 * @default InOutSine
 *
 * @param PortraitFlip
 * @text Flip Properties
 * @parent Portrait
 *
 * @param portraitFlipHorz:eval
 * @text Flip Horizontally?
 * @parent PortraitFlip
 * @type boolean
 * @on Flip
 * @off Don't Flip
 * @desc Flip the cutin portrait horizontally?
 * @default false
 *
 * @param portraitFlipVert:eval
 * @text Flip Vertically?
 * @parent PortraitFlip
 * @type boolean
 * @on Flip
 * @off Don't Flip
 * @desc Flip the cutin portrait vertically?
 * @default false
 *
 * @param PortraitScale
 * @text Scaling Properties
 * @parent Portrait
 * 
 * @param portraitForcedScale:num
 * @text Forced Scaling
 * @parent PortraitScale
 * @desc Do you want to force a scaling ratio?
 * Leave as 0 for none. Disables "Fit to Scale?".
 * @default 0.0
 *
 * @param portraitScaleToFit:eval
 * @text Fit to Scale?
 * @parent PortraitScale
 * @type boolean
 * @on Fit to Scale
 * @off Don't Scale
 * @desc Scale the cutin portrait to fit the cutin style?
 * Cannot be used with "Forced Scaling".
 * @default true
 *
 * @param portraitScaleMax:eval
 * @text Scale Max?
 * @parent portraitScaleToFit:eval
 * @type boolean
 * @on Scale Maximum
 * @off Scale Minimum
 * @desc Scale the cutin portrait to the maximum fit or
 * scale the cutin portrait to the minimum fit.
 * @default false
 *
 * @param PortraitAni
 * @text Animated Portraits
 * @parent Portrait
 *
 * @param animatedPortraitLooping:eval
 * @text Loop?
 * @parent PortraitAni
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Will loop back to beginning once ended.
 * Requires VisuMZ_4_AnimatedPictures!
 * @default true
 *
 * @param animatedPortraitWaitFrames:num
 * @text Wait Frames
 * @parent PortraitAni
 * @type number
 * @min 1
 * @desc Frames to wait before moving to next cell.
 * Requires VisuMZ_4_AnimatedPictures!
 * @default 4
 *
 * @param Parallax
 * @text Parallax Settings
 *
 * @param ParallaxBase
 * @text Base Settings
 * @parent Parallax
 *
 * @param parallaxBlendMode:num
 * @text Blend Mode
 * @parent ParallaxBase
 * @type select
 * @option 0 - Normal
 * @value 0
 * @option 1 - Additive
 * @value 1
 * @option 2 - Multiply
 * @value 2
 * @option 3 - Screen
 * @value 3
 * @desc What kind of blend mode do you wish to apply to the cutin?
 * @default 0
 *
 * @param parallaxHue:num
 * @text Hue
 * @parent ParallaxBase
 * @type number
 * @min 0
 * @max 360
 * @desc Do you wish to adjust this cutin's parallax hue?
 * @default 0
 * 
 * @param parallaxOpacity:num
 * @text Opacity
 * @parent ParallaxBase
 * @type number
 * @max 255
 * @desc What is the opacity level of this cutin's parallax?
 * @default 255
 *
 * @param ParallaxScroll
 * @text Scrolling Settings
 * @parent Parallax
 * 
 * @param parallaxOffsetX:num
 * @text Offset X
 * @parent ParallaxScroll
 * @desc Offsets the cutin parallax's X location.
 * Negative: left. Positive: right.
 * @default +0.0
 * 
 * @param parallaxOffsetY:num
 * @text Offset Y
 * @parent ParallaxScroll
 * @desc Offsets the cutin parallax's Y location.
 * Negative: up. Positive: down.
 * @default +0.0
 * 
 * @param parallaxScrollX:num
 * @text Scroll X
 * @parent ParallaxScroll
 * @desc How many pixels does the parallax scroll horizontally?
 * Negative: Scroll to right. Positive: Scroll to left.
 * @default +0.0
 * 
 * @param parallaxScrollY:num
 * @text Scroll Y
 * @parent ParallaxScroll
 * @desc How many pixels does the parallax scroll vertically?
 * Negative: Scroll to down. Positive: Scroll to up.
 * @default +0.0
 *
 */
/* ----------------------------------------------------------------------------
 * Portrait Change Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Portrait:
 *
 * @param Portrait
 * @text Portrait Settings
 *
 * @param PortraitBase
 * @text Base Properties
 * @parent Portrait
 * 
 * @param portraitAnchorX:num
 * @text Anchor X
 * @parent PortraitBase
 * @desc Determines the sprite anchor X alignment.
 * 0.0: Left, 0.5: Center, 1.0: Right.
 * @default 0.5
 * 
 * @param portraitAnchorY:num
 * @text Anchor Y
 * @parent PortraitBase
 * @desc Determines the sprite anchor Y alignment.
 * 0.0: Top, 0.5: Middle, 1.0: Bottom.
 * @default 0.5
 *
 * @param portraitHue:num
 * @text Hue
 * @parent PortraitBase
 * @type number
 * @min 0
 * @max 360
 * @desc Do you wish to adjust this cutin's portrait hue?
 * @default 0
 * 
 * @param portraitOpacity:num
 * @text Opacity
 * @parent PortraitBase
 * @type number
 * @max 255
 * @desc What is the opacity level of this cutin's portrait?
 * @default 255
 * 
 * @param portraitOffsetX:num
 * @text Offset X
 * @parent PortraitBase
 * @desc Offsets the cutin portrait's X location.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param portraitOffsetY:num
 * @text Offset Y
 * @parent PortraitBase
 * @desc Offsets the cutin portrait's Y location.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param PortraitEnter
 * @text Entrance Properties
 * @parent Portrait
 * 
 * @param portraitEnterX:num
 * @text Entrance X
 * @parent PortraitEnter
 * @desc Sets the cutin portrait's X entrance.
 * Negative: from left. Positive: from right.
 * @default +0
 * 
 * @param portraitEnterY:num
 * @text Entrance Y
 * @parent PortraitEnter
 * @desc Sets the cutin portrait's Y entrance.
 * Negative: from up. Positive: from down.
 * @default +0
 *
 * @param portraitEnterEasingType:str
 * @text Entrance Easing
 * @parent PortraitEnter
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
 * @default InOutSine
 *
 * @param PortraitExit
 * @text Exit Properties
 * @parent Portrait
 * 
 * @param portraitExitX:num
 * @text Exit X
 * @parent PortraitExit
 * @desc Sets the cutin portrait's X exit.
 * Negative: to left. Positive: to right.
 * @default +0
 * 
 * @param portraitExitY:num
 * @text Exit Y
 * @parent PortraitExit
 * @desc Sets the cutin portrait's Y exit.
 * Negative: to up. Positive: to down.
 * @default +0
 *
 * @param portraitExitEasingType:str
 * @text Exit Easing
 * @parent PortraitExit
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
 * @default InOutSine
 *
 * @param PortraitFlip
 * @text Flip Properties
 * @parent Portrait
 *
 * @param portraitFlipHorz:eval
 * @text Flip Horizontally?
 * @parent PortraitFlip
 * @type boolean
 * @on Flip
 * @off Don't Flip
 * @desc Flip the cutin portrait horizontally?
 * @default false
 *
 * @param portraitFlipVert:eval
 * @text Flip Vertically?
 * @parent PortraitFlip
 * @type boolean
 * @on Flip
 * @off Don't Flip
 * @desc Flip the cutin portrait vertically?
 * @default false
 *
 * @param PortraitScale
 * @text Scaling Properties
 * @parent Portrait
 * 
 * @param portraitForcedScale:num
 * @text Forced Scaling
 * @parent PortraitScale
 * @desc Do you want to force a scaling ratio?
 * Leave as 0 for none. Disables "Fit to Scale?".
 * @default 0.0
 *
 * @param portraitScaleToFit:eval
 * @text Fit to Scale?
 * @parent PortraitScale
 * @type boolean
 * @on Fit to Scale
 * @off Don't Scale
 * @desc Scale the cutin portrait to fit the cutin style?
 * Cannot be used with "Forced Scaling".
 * @default true
 *
 * @param portraitScaleMax:eval
 * @text Scale Max?
 * @parent portraitScaleToFit:eval
 * @type boolean
 * @on Scale Maximum
 * @off Scale Minimum
 * @desc Scale the cutin portrait to the maximum fit or
 * scale the cutin portrait to the minimum fit.
 * @default true
 *
 * @param PortraitAni
 * @text Animated Portraits
 * @parent Portrait
 *
 * @param animatedPortraitLooping:eval
 * @text Loop?
 * @parent PortraitAni
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Will loop back to beginning once ended.
 * Requires VisuMZ_4_AnimatedPictures!
 * @default true
 *
 * @param animatedPortraitWaitFrames:num
 * @text Wait Frames
 * @parent PortraitAni
 * @type number
 * @min 1
 * @desc Frames to wait before moving to next cell.
 * Requires VisuMZ_4_AnimatedPictures!
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Parallax Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Parallax:
 *
 * @param Parallax
 * @text Parallax Settings
 *
 * @param ParallaxBase
 * @text Base Settings
 * @parent Parallax
 *
 * @param parallaxBlendMode:num
 * @text Blend Mode
 * @parent ParallaxBase
 * @type select
 * @option 0 - Normal
 * @value 0
 * @option 1 - Additive
 * @value 1
 * @option 2 - Multiply
 * @value 2
 * @option 3 - Screen
 * @value 3
 * @desc What kind of blend mode do you wish to apply to the cutin?
 * @default 0
 *
 * @param parallaxHue:num
 * @text Hue
 * @parent ParallaxBase
 * @type number
 * @min 0
 * @max 360
 * @desc Do you wish to adjust this cutin's parallax hue?
 * @default 0
 * 
 * @param parallaxOpacity:num
 * @text Opacity
 * @parent ParallaxBase
 * @type number
 * @max 255
 * @desc What is the opacity level of this cutin's parallax?
 * @default 255
 *
 * @param ParallaxScroll
 * @text Scrolling Settings
 * @parent Parallax
 * 
 * @param parallaxOffsetX:num
 * @text Offset X
 * @parent ParallaxScroll
 * @desc Offsets the cutin parallax's X location.
 * Negative: left. Positive: right.
 * @default +0.0
 * 
 * @param parallaxOffsetY:num
 * @text Offset Y
 * @parent ParallaxScroll
 * @desc Offsets the cutin parallax's Y location.
 * Negative: up. Positive: down.
 * @default +0.0
 * 
 * @param parallaxScrollX:num
 * @text Scroll X
 * @parent ParallaxScroll
 * @desc How many pixels does the parallax scroll horizontally?
 * Negative: Scroll to right. Positive: Scroll to left.
 * @default +0.0
 * 
 * @param parallaxScrollY:num
 * @text Scroll Y
 * @parent ParallaxScroll
 * @desc How many pixels does the parallax scroll vertically?
 * Negative: Scroll to down. Positive: Scroll to up.
 * @default +0.0
 *
 */
//=============================================================================

function _0x15e7(_0x261e82,_0x5c2ead){const _0xcc1f51=_0xcc1f();return _0x15e7=function(_0x15e7d6,_0x4c8a26){_0x15e7d6=_0x15e7d6-0x157;let _0x538543=_0xcc1f51[_0x15e7d6];return _0x538543;},_0x15e7(_0x261e82,_0x5c2ead);}const _0x1d0c3d=_0x15e7;(function(_0x2c1a5b,_0x34968b){const _0x493ced=_0x15e7,_0x34f0e4=_0x2c1a5b();while(!![]){try{const _0x51cd30=-parseInt(_0x493ced(0x165))/0x1+parseInt(_0x493ced(0x20d))/0x2*(-parseInt(_0x493ced(0x223))/0x3)+parseInt(_0x493ced(0x1b2))/0x4*(parseInt(_0x493ced(0x1e3))/0x5)+parseInt(_0x493ced(0x243))/0x6+parseInt(_0x493ced(0x29e))/0x7*(parseInt(_0x493ced(0x288))/0x8)+parseInt(_0x493ced(0x206))/0x9*(-parseInt(_0x493ced(0x183))/0xa)+-parseInt(_0x493ced(0x1a7))/0xb*(-parseInt(_0x493ced(0x23a))/0xc);if(_0x51cd30===_0x34968b)break;else _0x34f0e4['push'](_0x34f0e4['shift']());}catch(_0x5e8576){_0x34f0e4['push'](_0x34f0e4['shift']());}}}(_0xcc1f,0x67e98));var label=_0x1d0c3d(0x2ad),tier=tier||0x0,dependencies=[_0x1d0c3d(0x2c6)],pluginData=$plugins[_0x1d0c3d(0x18f)](function(_0x3d4c30){const _0x1caf35=_0x1d0c3d;return _0x3d4c30[_0x1caf35(0x2d4)]&&_0x3d4c30['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x1d0c3d(0x280)]=VisuMZ[label][_0x1d0c3d(0x280)]||{},VisuMZ[_0x1d0c3d(0x254)]=function(_0x39a747,_0x330432){const _0x2f02cb=_0x1d0c3d;for(const _0x54890a in _0x330432){if(_0x54890a['match'](/(.*):(.*)/i)){const _0x1ae958=String(RegExp['$1']),_0x593622=String(RegExp['$2'])[_0x2f02cb(0x2c0)]()[_0x2f02cb(0x2b1)]();let _0x1e05b7,_0x565d3b,_0x2c21b9;switch(_0x593622){case _0x2f02cb(0x204):_0x1e05b7=_0x330432[_0x54890a]!==''?Number(_0x330432[_0x54890a]):0x0;break;case _0x2f02cb(0x1f3):_0x565d3b=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b[_0x2f02cb(0x2db)](_0x2870bc=>Number(_0x2870bc));break;case _0x2f02cb(0x2ce):_0x1e05b7=_0x330432[_0x54890a]!==''?eval(_0x330432[_0x54890a]):null;break;case _0x2f02cb(0x220):_0x565d3b=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b[_0x2f02cb(0x2db)](_0x3229d9=>eval(_0x3229d9));break;case _0x2f02cb(0x2bb):_0x1e05b7=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):'';break;case _0x2f02cb(0x213):_0x565d3b=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b['map'](_0x52fcde=>JSON[_0x2f02cb(0x19f)](_0x52fcde));break;case _0x2f02cb(0x1c4):_0x1e05b7=_0x330432[_0x54890a]!==''?new Function(JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a])):new Function(_0x2f02cb(0x2cc));break;case'ARRAYFUNC':_0x565d3b=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b[_0x2f02cb(0x2db)](_0x79a049=>new Function(JSON[_0x2f02cb(0x19f)](_0x79a049)));break;case _0x2f02cb(0x224):_0x1e05b7=_0x330432[_0x54890a]!==''?String(_0x330432[_0x54890a]):'';break;case _0x2f02cb(0x26c):_0x565d3b=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b[_0x2f02cb(0x2db)](_0x47597b=>String(_0x47597b));break;case _0x2f02cb(0x218):_0x2c21b9=_0x330432[_0x54890a]!==''?JSON[_0x2f02cb(0x19f)](_0x330432[_0x54890a]):{},_0x1e05b7=VisuMZ[_0x2f02cb(0x254)]({},_0x2c21b9);break;case'ARRAYSTRUCT':_0x565d3b=_0x330432[_0x54890a]!==''?JSON['parse'](_0x330432[_0x54890a]):[],_0x1e05b7=_0x565d3b[_0x2f02cb(0x2db)](_0x5eadea=>VisuMZ[_0x2f02cb(0x254)]({},JSON[_0x2f02cb(0x19f)](_0x5eadea)));break;default:continue;}_0x39a747[_0x1ae958]=_0x1e05b7;}}return _0x39a747;},(_0x9ab457=>{const _0x5dcbe2=_0x1d0c3d,_0xfddb24=_0x9ab457['name'];for(const _0x625664 of dependencies){if(!Imported[_0x625664]){alert(_0x5dcbe2(0x2a1)[_0x5dcbe2(0x1b9)](_0xfddb24,_0x625664)),SceneManager[_0x5dcbe2(0x21f)]();break;}}const _0x35bbc3=_0x9ab457['description'];if(_0x35bbc3[_0x5dcbe2(0x230)](/\[Version[ ](.*?)\]/i)){const _0x2ae114=Number(RegExp['$1']);_0x2ae114!==VisuMZ[label][_0x5dcbe2(0x241)]&&(alert(_0x5dcbe2(0x21d)[_0x5dcbe2(0x1b9)](_0xfddb24,_0x2ae114)),SceneManager[_0x5dcbe2(0x21f)]());}if(_0x35bbc3['match'](/\[Tier[ ](\d+)\]/i)){const _0x27e0f8=Number(RegExp['$1']);_0x27e0f8<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'['format'](_0xfddb24,_0x27e0f8,tier)),SceneManager['exit']()):tier=Math[_0x5dcbe2(0x1b1)](_0x27e0f8,tier);}VisuMZ[_0x5dcbe2(0x254)](VisuMZ[label][_0x5dcbe2(0x280)],_0x9ab457['parameters']);})(pluginData),VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x207)]=function(_0x1d4f48){const _0x2efa23=_0x1d0c3d,_0x3f6ed5={};_0x1d4f48[_0x2efa23(0x2e8)]!==undefined?(_0x3f6ed5[_0x2efa23(0x226)]=String(_0x1d4f48['typeJS']()||_0x2efa23(0x287))[_0x2efa23(0x161)]()[_0x2efa23(0x2b1)](),_0x3f6ed5[_0x2efa23(0x2da)]=String(_0x1d4f48['bgColorJS']),_0x3f6ed5[_0x2efa23(0x18b)]=String(_0x1d4f48['parallaxFilenameJS']()||'')['trim'](),_0x3f6ed5['portraitFilename']=String(_0x1d4f48[_0x2efa23(0x158)]()||'')[_0x2efa23(0x2b1)]()):(_0x3f6ed5[_0x2efa23(0x226)]=_0x1d4f48['type']['toLowerCase']()[_0x2efa23(0x2b1)](),_0x3f6ed5[_0x2efa23(0x2da)]=_0x1d4f48['bgColor']||_0x2efa23(0x2d6),_0x3f6ed5['parallaxFilename']=_0x1d4f48['parallaxFilename']['trim'](),_0x3f6ed5[_0x2efa23(0x1ee)]=_0x1d4f48['portraitFilename'][_0x2efa23(0x2b1)]());_0x3f6ed5[_0x2efa23(0x18b)][_0x2efa23(0x161)]()==='>>>attention<<<'&&(_0x3f6ed5[_0x2efa23(0x18b)]='');_0x3f6ed5[_0x2efa23(0x1ee)]['toLowerCase']()===_0x2efa23(0x270)&&(_0x3f6ed5[_0x2efa23(0x1ee)]='');const _0x116811=VisuMZ['VisualCutinEffect'][_0x2efa23(0x280)][_0x2efa23(0x272)],_0x59d24b=_0x1d4f48[_0x2efa23(0x1d9)]||{},_0x2393cf=[_0x2efa23(0x1ce),'exitDuration',_0x2efa23(0x2c7),_0x2efa23(0x197),'portraitOpacity',_0x2efa23(0x2c3),_0x2efa23(0x1a6),_0x2efa23(0x2c1),_0x2efa23(0x2d1),_0x2efa23(0x20b),_0x2efa23(0x282),_0x2efa23(0x1a4),'portraitExitX',_0x2efa23(0x25c),_0x2efa23(0x249),_0x2efa23(0x252),_0x2efa23(0x296),_0x2efa23(0x1d0),_0x2efa23(0x194),_0x2efa23(0x2a3),_0x2efa23(0x1b7),'animatedPortraitWaitFrames',_0x2efa23(0x188),_0x2efa23(0x17b),_0x2efa23(0x2ac),_0x2efa23(0x299),_0x2efa23(0x19b),_0x2efa23(0x211),'parallaxScrollY','bgShow'];for(const _0x1d9883 of _0x2393cf){_0x3f6ed5[_0x1d9883]=_0x59d24b[_0x1d9883]??_0x116811[_0x1d9883]??0x0;}return _0x3f6ed5;},PluginManager[_0x1d0c3d(0x26e)](pluginData[_0x1d0c3d(0x2cd)],_0x1d0c3d(0x295),_0x15a096=>{const _0x203ff2=_0x1d0c3d;if(SceneManager[_0x203ff2(0x1e1)]()&&!Imported['VisuMZ_1_BattleCore'])return;VisuMZ[_0x203ff2(0x254)](_0x15a096,_0x15a096);const _0x5ab669=VisuMZ[_0x203ff2(0x2ad)][_0x203ff2(0x207)](_0x15a096);SceneManager[_0x203ff2(0x196)][_0x203ff2(0x27c)](_0x5ab669);const _0x15afb8=$gameTemp[_0x203ff2(0x235)]();_0x15afb8&&_0x15a096['WaitForEntrance']&&_0x15afb8[_0x203ff2(0x17d)](_0x203ff2(0x1d4));}),PluginManager[_0x1d0c3d(0x26e)](pluginData[_0x1d0c3d(0x2cd)],_0x1d0c3d(0x289),_0x4da052=>{const _0x4f8474=_0x1d0c3d;if(SceneManager[_0x4f8474(0x1e1)]()&&!Imported['VisuMZ_1_BattleCore'])return;VisuMZ['ConvertParams'](_0x4da052,_0x4da052);const _0x38ca3c=VisuMZ[_0x4f8474(0x2ad)][_0x4f8474(0x207)](_0x4da052);SceneManager['_scene'][_0x4f8474(0x27c)](_0x38ca3c);}),PluginManager[_0x1d0c3d(0x26e)](pluginData['name'],_0x1d0c3d(0x217),_0x172184=>{const _0x42bf54=_0x1d0c3d;if(SceneManager[_0x42bf54(0x1e1)]()&&!Imported[_0x42bf54(0x283)])return;VisuMZ[_0x42bf54(0x254)](_0x172184,_0x172184);const _0x465593=_0x172184[_0x42bf54(0x226)][_0x42bf54(0x161)]()[_0x42bf54(0x2b1)]();let _0x18979d=_0x172184[_0x42bf54(0x1ee)][_0x42bf54(0x2b1)]();if(_0x18979d[_0x42bf54(0x161)]()[_0x42bf54(0x2b1)]()===_0x42bf54(0x270))_0x18979d='';const _0x2af35b=_0x172184['ExtraSettings']??{};SceneManager[_0x42bf54(0x196)][_0x42bf54(0x27f)](_0x465593,_0x18979d,_0x2af35b);}),PluginManager[_0x1d0c3d(0x26e)](pluginData['name'],_0x1d0c3d(0x233),_0x2f6b7e=>{const _0x318539=_0x1d0c3d;if(SceneManager['isSceneBattle']()&&!Imported[_0x318539(0x283)])return;VisuMZ['ConvertParams'](_0x2f6b7e,_0x2f6b7e);const _0x4076d8=_0x2f6b7e[_0x318539(0x226)]['toLowerCase']()[_0x318539(0x2b1)]();let _0x4e5726=_0x2f6b7e[_0x318539(0x18b)][_0x318539(0x2b1)]();if(_0x4e5726['toLowerCase']()[_0x318539(0x2b1)]()===_0x318539(0x270))_0x4e5726='';const _0x3f42a1=_0x2f6b7e[_0x318539(0x1d9)]??{};SceneManager['_scene'][_0x318539(0x27d)](_0x4076d8,_0x4e5726,_0x3f42a1);}),PluginManager[_0x1d0c3d(0x26e)](pluginData[_0x1d0c3d(0x2cd)],'CutinEnd_VisualCutinEffectAll',_0x2682f7=>{const _0x300648=_0x1d0c3d;if(SceneManager[_0x300648(0x1e1)]()&&!Imported[_0x300648(0x283)])return;VisuMZ['ConvertParams'](_0x2682f7,_0x2682f7),SceneManager[_0x300648(0x196)][_0x300648(0x293)]();const _0x1c2f36=$gameTemp['getLastPluginCommandInterpreter']();_0x1c2f36&&_0x2682f7[_0x300648(0x265)]&&_0x1c2f36[_0x300648(0x17d)](_0x300648(0x2e6));}),PluginManager[_0x1d0c3d(0x26e)](pluginData['name'],'CutinEnd_VisualCutinEffectType',_0x2458b8=>{const _0x1c5632=_0x1d0c3d;if(SceneManager[_0x1c5632(0x1e1)]()&&!Imported['VisuMZ_1_BattleCore'])return;VisuMZ[_0x1c5632(0x254)](_0x2458b8,_0x2458b8);const _0x52d775=_0x2458b8['type']['toLowerCase']()[_0x1c5632(0x2b1)]();SceneManager[_0x1c5632(0x196)][_0x1c5632(0x264)](_0x52d775);const _0x38b350=$gameTemp[_0x1c5632(0x235)]();_0x38b350&&_0x2458b8[_0x1c5632(0x265)]&&_0x38b350[_0x1c5632(0x17d)](_0x1c5632(0x2e6));}),PluginManager[_0x1d0c3d(0x26e)](pluginData['name'],'CutinWait_WaitForEntrance',_0x39b75f=>{const _0x25c4a6=_0x1d0c3d;if(SceneManager[_0x25c4a6(0x1e1)]()&&!Imported[_0x25c4a6(0x283)])return;const _0x2c8cdc=$gameTemp[_0x25c4a6(0x235)]();_0x2c8cdc[_0x25c4a6(0x17d)](_0x25c4a6(0x1d4));}),PluginManager[_0x1d0c3d(0x26e)](pluginData[_0x1d0c3d(0x2cd)],'CutinWait_WaitForExit',_0x54be4e=>{const _0x23a7c7=_0x1d0c3d;if(SceneManager[_0x23a7c7(0x1e1)]()&&!Imported[_0x23a7c7(0x283)])return;const _0x4a8b26=$gameTemp['getLastPluginCommandInterpreter']();_0x4a8b26[_0x23a7c7(0x17d)](_0x23a7c7(0x2e6));}),VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x1b3)]={'EnemyCutinPortraitName':/<CUTIN (?:PORTRAIT|PICTURE|IMAGE|IMG):[ ](.*?)>/i,'EnemyCutinFlipHorz':/<CUTIN FLIP (?:HORZ|HORIZONTAL|HORIZONTALLY)>/i,'EnemyCutinFlipVert':/<CUTIN FLIP (?:VERT|VERTICAL|VERTICALLY)>/i},Bitmap['prototype'][_0x1d0c3d(0x1d7)]=function(_0x2f9725,_0x180da6,_0x3ceacd,_0x3a6de4,_0x28ee17,_0x7ab688){const _0x36035b=_0x1d0c3d,_0x28e4e5=this['_context'];_0x28e4e5[_0x36035b(0x214)](),_0x28e4e5[_0x36035b(0x1ff)](),_0x28e4e5[_0x36035b(0x22f)](_0x2f9725[0x0],_0x2f9725[0x1]);for(var _0x3aebf2=0x2;_0x3aebf2<_0x2f9725[_0x36035b(0x1e6)];_0x3aebf2+=0x2){_0x28e4e5[_0x36035b(0x168)](_0x2f9725[_0x3aebf2],_0x2f9725[_0x3aebf2+0x1]);}_0x28e4e5[_0x36035b(0x168)](_0x2f9725[0x0],_0x2f9725[0x1]),_0x28e4e5['strokeStyle']=_0x180da6,_0x28e4e5[_0x36035b(0x2ed)]=_0x3a6de4,_0x7ab688&&_0x28e4e5[_0x36035b(0x200)](),_0x28e4e5['globalAlpha']=_0x28ee17,_0x28e4e5[_0x36035b(0x1ba)]=_0x3ceacd,_0x28e4e5['fill'](),_0x28e4e5['globalAlpha']=0x1,_0x28e4e5[_0x36035b(0x2c4)](),this['_baseTexture'][_0x36035b(0x1fd)]();},ImageManager[_0x1d0c3d(0x2ea)]={'outerOutlineColor':VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x280)][_0x1d0c3d(0x242)][_0x1d0c3d(0x1a8)],'outerOutlineWeight':VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x280)][_0x1d0c3d(0x242)][_0x1d0c3d(0x24b)],'middleOutlineColor':VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x280)][_0x1d0c3d(0x242)][_0x1d0c3d(0x1c9)],'middleOutlineWeight':VisuMZ[_0x1d0c3d(0x2ad)]['Settings']['Outline'][_0x1d0c3d(0x20f)],'innerOutlineColor':VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x280)][_0x1d0c3d(0x242)][_0x1d0c3d(0x1fa)],'innerOutlineWeight':VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x280)][_0x1d0c3d(0x242)]['innerOutlineWeight'],'styles':VisuMZ[_0x1d0c3d(0x2ad)]['Settings'][_0x1d0c3d(0x193)]},(ImageManager[_0x1d0c3d(0x2ea)][_0x1d0c3d(0x25d)]={'cutinOffsetX':0x0,'cutinOffsetY':0x0,'enterX':0x0,'enterY':0x0,'enterEasingType':_0x1d0c3d(0x1d5),'exitX':0x0,'exitY':0x0,'exitEasingType':_0x1d0c3d(0x1d5),'maskFilename':'','outlineFilename':'','outlineOffsetX':0x0,'outlineOffsetY':0x0},ImageManager[_0x1d0c3d(0x2ea)][_0x1d0c3d(0x191)]=ImageManager[_0x1d0c3d(0x2ea)][_0x1d0c3d(0x24b)]+ImageManager[_0x1d0c3d(0x2ea)][_0x1d0c3d(0x20f)]+ImageManager[_0x1d0c3d(0x2ea)]['innerOutlineWeight']),ImageManager['getVisualCutinStyleData']=function(_0x87e5b1){const _0x2428cc=_0x1d0c3d;_0x87e5b1=_0x87e5b1['toLowerCase']()[_0x2428cc(0x2b1)]();!ImageManager['VISUAL_CUTIN_EFFECT'][_0x2428cc(0x2a2)][_0x87e5b1]&&(ImageManager['VISUAL_CUTIN_EFFECT'][_0x2428cc(0x2a2)][_0x87e5b1]=JSON[_0x2428cc(0x19f)](JSON[_0x2428cc(0x1a3)](ImageManager[_0x2428cc(0x2ea)][_0x2428cc(0x25d)])));const _0x9a58eb=ImageManager[_0x2428cc(0x2ea)][_0x2428cc(0x2a2)][_0x87e5b1];if(_0x9a58eb['maskFilename']===undefined)_0x9a58eb[_0x2428cc(0x2bd)]='';if(_0x9a58eb[_0x2428cc(0x17f)]===undefined)_0x9a58eb['outlineFilename']='';if(_0x9a58eb[_0x2428cc(0x21a)]===undefined)_0x9a58eb[_0x2428cc(0x21a)]=0x0;if(_0x9a58eb[_0x2428cc(0x2b5)]===undefined)_0x9a58eb[_0x2428cc(0x2b5)]=0x0;if(_0x9a58eb[_0x2428cc(0x195)]===undefined)_0x9a58eb[_0x2428cc(0x195)]=0x0;if(_0x9a58eb[_0x2428cc(0x182)]===undefined)_0x9a58eb['cutinOffsetY']=0x0;if(_0x9a58eb[_0x2428cc(0x1d1)]===undefined)_0x9a58eb[_0x2428cc(0x1d1)]=0x0;if(_0x9a58eb[_0x2428cc(0x1da)]===undefined)_0x9a58eb['enterY']=0x0;if(_0x9a58eb[_0x2428cc(0x1c2)]===undefined)_0x9a58eb['enterEasingType']='Linear';if(_0x9a58eb[_0x2428cc(0x24e)]===undefined)_0x9a58eb[_0x2428cc(0x24e)]=0x0;if(_0x9a58eb[_0x2428cc(0x22e)]===undefined)_0x9a58eb['exitY']=0x0;if(_0x9a58eb[_0x2428cc(0x1c8)]===undefined)_0x9a58eb[_0x2428cc(0x1c8)]=_0x2428cc(0x1d5);return _0x9a58eb;},ImageManager['hasCustomCutinMaskAndOutline']=function(_0x42be76){const _0x14e7ab=_0x1d0c3d;return _0x42be76=_0x42be76[_0x14e7ab(0x161)]()[_0x14e7ab(0x2b1)](),ImageManager[_0x14e7ab(0x2d9)](_0x42be76)[_0x14e7ab(0x2bd)]!==''&&ImageManager['getVisualCutinStyleData'](_0x42be76)[_0x14e7ab(0x17f)];},ImageManager[_0x1d0c3d(0x262)]=function(_0x25645a){const _0x54c63b=_0x1d0c3d;if(this[_0x54c63b(0x16f)](_0x25645a)){const _0x43cc82=ImageManager['getVisualCutinStyleData'](_0x25645a)[_0x54c63b(0x2bd)];return ImageManager['loadPicture'](_0x43cc82);}_0x25645a=_0x25645a['toLowerCase']()[_0x54c63b(0x2b1)](),this[_0x54c63b(0x1f5)]=this[_0x54c63b(0x1f5)]||{};if(this[_0x54c63b(0x1f5)][_0x25645a])return this[_0x54c63b(0x1f5)][_0x25645a];const _0x2c2625=this[_0x54c63b(0x1a5)](_0x25645a,!![]);return _0x2c2625[_0x54c63b(0x2de)]=![],this[_0x54c63b(0x1f5)][_0x25645a]=_0x2c2625,this[_0x54c63b(0x1f5)][_0x25645a];},ImageManager[_0x1d0c3d(0x29a)]=function(_0x5005db){const _0x571044=_0x1d0c3d;if(this[_0x571044(0x16f)](_0x5005db)){const _0x325b3e=ImageManager[_0x571044(0x2d9)](_0x5005db)['outlineFilename'];return ImageManager[_0x571044(0x1db)](_0x325b3e);}_0x5005db=_0x5005db[_0x571044(0x161)]()[_0x571044(0x2b1)](),this[_0x571044(0x28e)]=this[_0x571044(0x28e)]||{};if(this[_0x571044(0x28e)][_0x5005db])return this['_cached_VisualCutinEffect_Outline'][_0x5005db];const _0x49cc04=this[_0x571044(0x1a5)](_0x5005db,![]);return _0x49cc04[_0x571044(0x2de)]=![],this[_0x571044(0x28e)][_0x5005db]=_0x49cc04,this['_cached_VisualCutinEffect_Outline'][_0x5005db];},ImageManager[_0x1d0c3d(0x1a5)]=function(_0x507600,_0x130560){const _0x41b3b6=_0x1d0c3d;switch(_0x507600){case'whole':return ImageManager['create_VisualCutinEffect_Bitmap_Whole'](_0x130560);case _0x41b3b6(0x2aa):return ImageManager[_0x41b3b6(0x261)](_0x130560);case _0x41b3b6(0x2c2):return ImageManager[_0x41b3b6(0x1b4)](_0x130560,0x0);case'centerhorzspan':return ImageManager[_0x41b3b6(0x1b4)](_0x130560,0x1);case _0x41b3b6(0x290):return ImageManager['create_VisualCutinEffect_Bitmap_HorzSpan'](_0x130560,0x2);case _0x41b3b6(0x29f):return ImageManager[_0x41b3b6(0x1b5)](_0x130560,0x0);case _0x41b3b6(0x2f5):return ImageManager[_0x41b3b6(0x1b5)](_0x130560,0x1);case _0x41b3b6(0x198):return ImageManager[_0x41b3b6(0x2e5)](_0x130560,0x0);case'rightvertslash':return ImageManager['create_VisualCutinEffect_Bitmap_VertSlash'](_0x130560,0x1);case _0x41b3b6(0x20c):case _0x41b3b6(0x1dd):return ImageManager['create_VisualCutinEffect_Bitmap_Pack'](_0x130560,0x2,1.5);case _0x41b3b6(0x24c):case'centerminor':case'rightminor':return ImageManager[_0x41b3b6(0x215)](_0x130560,0x3,1.5);case _0x41b3b6(0x2f4):case _0x41b3b6(0x166):case'rightdiamond':return ImageManager[_0x41b3b6(0x286)](_0x130560);case'leftgemstone':case _0x41b3b6(0x21b):case _0x41b3b6(0x232):return ImageManager['create_VisualCutinEffect_Bitmap_Gemstone'](_0x130560);case _0x41b3b6(0x2ee):return ImageManager['create_VisualCutinEffect_Bitmap_Quad'](_0x130560,0x0);case'toprightquad':return ImageManager[_0x41b3b6(0x1eb)](_0x130560,0x1);case _0x41b3b6(0x1ad):return ImageManager['create_VisualCutinEffect_Bitmap_Quad'](_0x130560,0x2);case _0x41b3b6(0x245):return ImageManager['create_VisualCutinEffect_Bitmap_Quad'](_0x130560,0x3);case _0x41b3b6(0x19c):return ImageManager[_0x41b3b6(0x256)](_0x130560,0x0);case _0x41b3b6(0x16d):return ImageManager[_0x41b3b6(0x256)](_0x130560,0x1);case'bottomleftcorner':return ImageManager[_0x41b3b6(0x256)](_0x130560,0x2);case'bottomrightcorner':return ImageManager['create_VisualCutinEffect_Bitmap_Corner'](_0x130560,0x3);case _0x41b3b6(0x1d3):case _0x41b3b6(0x2b2):case _0x41b3b6(0x16a):return ImageManager[_0x41b3b6(0x2b0)](_0x130560,0x3);case _0x41b3b6(0x21e):case'row2ndfourth':case'row3rdfourth':case'row4thfourth':return ImageManager['create_VisualCutinEffect_Bitmap_Rows'](_0x130560,0x4);case _0x41b3b6(0x192):case _0x41b3b6(0x2e2):case _0x41b3b6(0x170):case _0x41b3b6(0x159):case'row5thfifth':return ImageManager['create_VisualCutinEffect_Bitmap_Rows'](_0x130560,0x5);case _0x41b3b6(0x247):case'col2ndthird':case _0x41b3b6(0x15e):return ImageManager[_0x41b3b6(0x199)](_0x130560,0x3);case _0x41b3b6(0x1a9):case _0x41b3b6(0x2a7):case _0x41b3b6(0x18a):case _0x41b3b6(0x157):return ImageManager['create_VisualCutinEffect_Bitmap_Cols'](_0x130560,0x4);case _0x41b3b6(0x227):case _0x41b3b6(0x274):case'col3rdfifth':case _0x41b3b6(0x2ef):case _0x41b3b6(0x1f2):return ImageManager['create_VisualCutinEffect_Bitmap_Cols'](_0x130560,0x5);case _0x41b3b6(0x1b8):case _0x41b3b6(0x18c):case'sixpack3':case _0x41b3b6(0x20e):case'sixpack5':case'sixpack6':return ImageManager[_0x41b3b6(0x215)](_0x130560,0x3,0x2);case _0x41b3b6(0x1f8):case _0x41b3b6(0x163):case'eightpack3':case _0x41b3b6(0x1bf):case _0x41b3b6(0x1e5):case _0x41b3b6(0x2bc):case _0x41b3b6(0x27b):case _0x41b3b6(0x2e7):return ImageManager[_0x41b3b6(0x215)](_0x130560,0x4,0x2);case'twelvepack1':case _0x41b3b6(0x1a2):case _0x41b3b6(0x184):case _0x41b3b6(0x216):case _0x41b3b6(0x23f):case'twelvepack6':case _0x41b3b6(0x2d8):case _0x41b3b6(0x22a):case _0x41b3b6(0x266):case _0x41b3b6(0x172):case'twelvepack11':case _0x41b3b6(0x1c7):return ImageManager[_0x41b3b6(0x215)](_0x130560,0x4,0x3);default:return ImageManager[_0x41b3b6(0x291)](_0x130560);}},ImageManager['fill_VisualCutinEffect_Bitmap']=function(_0x5a7187,_0x3a0e27,_0x3e7c2e,_0x5727e0){const _0x22510f=_0x1d0c3d;if(_0x3e7c2e)_0x5a7187[_0x22510f(0x1d7)](_0x3a0e27,'black',_0x22510f(0x20a),0x0,0xff,![]);else{const _0x25c422=ImageManager[_0x22510f(0x2ea)],_0x491cbb=_0x22510f(0x1f0),_0x367782=_0x5727e0;{const _0x2a0d82=ColorManager['getColor'](_0x25c422[_0x22510f(0x1a8)]),_0x25c30f=_0x25c422[_0x22510f(0x24b)]*_0x367782+_0x25c422[_0x22510f(0x20f)]*_0x367782+_0x25c422['innerOutlineWeight']*_0x367782;_0x5a7187[_0x22510f(0x1d7)](_0x3a0e27,_0x2a0d82,_0x491cbb,_0x25c30f,0xff,!![]);}{const _0x2b44d3=ColorManager[_0x22510f(0x167)](_0x25c422['middleOutlineColor']),_0x5b8845=_0x25c422['middleOutlineWeight']*_0x367782+_0x25c422[_0x22510f(0x1ca)]*_0x367782;_0x5a7187[_0x22510f(0x1d7)](_0x3a0e27,_0x2b44d3,_0x491cbb,_0x5b8845,0xff,!![]);}{const _0x2da01a=ColorManager[_0x22510f(0x167)](_0x25c422[_0x22510f(0x1fa)]),_0x3db605=_0x25c422[_0x22510f(0x1ca)]*_0x367782;_0x5a7187[_0x22510f(0x1d7)](_0x3a0e27,_0x2da01a,_0x491cbb,_0x3db605,0xff,!![]);}}return _0x5a7187;},ImageManager[_0x1d0c3d(0x291)]=function(_0x142d0e){const _0x1243a5=_0x1d0c3d,_0x307909=Graphics[_0x1243a5(0x275)],_0x265484=Graphics[_0x1243a5(0x1fb)],_0x4581d0=new Bitmap(_0x307909,_0x265484),_0x43b737=[0x0,0x0,_0x307909,0x0,_0x307909,_0x265484,0x0,_0x265484];return this['fill_VisualCutinEffect_Bitmap'](_0x4581d0,_0x43b737,_0x142d0e,0x2);},ImageManager[_0x1d0c3d(0x261)]=function(_0xbfbb2f){const _0x41668f=_0x1d0c3d,_0x55b6a9=Math[_0x41668f(0x239)](Graphics[_0x41668f(0x275)]-0x50,0x330),_0x133889=Graphics[_0x41668f(0x1fb)]-Sprite_VisualCutin[_0x41668f(0x21c)][_0x41668f(0x1ea)]()-0x50,_0x2d3afe=new Bitmap(_0x55b6a9,_0x133889),_0x1b6ff7=0x3c,_0x5920df=[_0x1b6ff7,0x0,_0x55b6a9-_0x1b6ff7,0x0,_0x55b6a9,_0x1b6ff7,_0x55b6a9,_0x133889-_0x1b6ff7,_0x55b6a9-_0x1b6ff7,_0x133889,_0x1b6ff7,_0x133889,0x0,_0x133889-_0x1b6ff7,0x0,_0x1b6ff7];return this[_0x41668f(0x269)](_0x2d3afe,_0x5920df,_0xbfbb2f,0x2);},ImageManager[_0x1d0c3d(0x1b4)]=function(_0x331b50,_0x198802){const _0x596c3d=_0x1d0c3d,_0x21d5de=Graphics['width']+0x28,_0x5c698d=ImageManager[_0x596c3d(0x2e0)]*0x2,_0x3bb10c=new Bitmap(_0x21d5de,_0x5c698d),_0x4994ea=[[0x0,0x0,_0x21d5de,Math[_0x596c3d(0x2c8)](_0x5c698d*0x1/0x8),_0x21d5de,Math[_0x596c3d(0x267)](_0x5c698d*0x7/0x8),0x0,_0x5c698d],[0x0,0x0,_0x21d5de,0x0,_0x21d5de,_0x5c698d,0x0,_0x5c698d],[0x0,Math[_0x596c3d(0x2c8)](_0x5c698d*0x1/0x8),_0x21d5de,0x0,_0x21d5de,_0x5c698d,0x0,Math[_0x596c3d(0x267)](_0x5c698d*0x7/0x8)]];return this[_0x596c3d(0x269)](_0x3bb10c,_0x4994ea[_0x198802],_0x331b50,0x1);},ImageManager['create_VisualCutinEffect_Bitmap_HorzSlash']=function(_0x2390dc,_0x2d15b2){const _0x26c53f=_0x1d0c3d,_0xb513a8=Graphics[_0x26c53f(0x275)]+0x28,_0xa095cf=ImageManager[_0x26c53f(0x2e0)]*0x3,_0xa41088=new Bitmap(_0xb513a8,_0xa095cf),_0x2ec01f=[[0x0,Math['round'](_0xa095cf*0x3/0x5),_0xb513a8,0x0,_0xb513a8,Math[_0x26c53f(0x18d)](_0xa095cf*0x3/0x4),0x0,_0xa095cf],[0x0,0x0,_0xb513a8,Math['round'](_0xa095cf*0x3/0x5),_0xb513a8,_0xa095cf,0x0,Math[_0x26c53f(0x18d)](_0xa095cf*0x3/0x4)]];return this[_0x26c53f(0x269)](_0xa41088,_0x2ec01f[_0x2d15b2],_0x2390dc,0x2);},ImageManager[_0x1d0c3d(0x2e5)]=function(_0x3d64ec,_0x5b9c40){const _0x3f8a9f=_0x1d0c3d,_0x1cf893=Math[_0x3f8a9f(0x267)](Graphics[_0x3f8a9f(0x275)]/0x2),_0x524da4=Graphics[_0x3f8a9f(0x1fb)]+0x28,_0x35104a=new Bitmap(_0x1cf893,_0x524da4),_0x175e88=[[0x0,0x0,_0x1cf893,0x0,Math[_0x3f8a9f(0x18d)](_0x1cf893*0x3/0x4),_0x524da4,Math[_0x3f8a9f(0x18d)](_0x1cf893*0x1/0x2),_0x524da4],[0x0,0x0,_0x1cf893,0x0,Math[_0x3f8a9f(0x18d)](_0x1cf893*0x1/0x2),_0x524da4,Math['round'](_0x1cf893*0x1/0x4),_0x524da4]];return this[_0x3f8a9f(0x269)](_0x35104a,_0x175e88[_0x5b9c40],_0x3d64ec,0x2);},ImageManager[_0x1d0c3d(0x1de)]=function(_0x364439,_0x586dc1){const _0x5b7e47=_0x1d0c3d,_0x16f421=[0x1,0x2,0x1][_0x586dc1],_0x392c1e=Math[_0x5b7e47(0x267)](Graphics[_0x5b7e47(0x275)]*_0x16f421/0x3),_0x1df1e9=Math[_0x5b7e47(0x2c8)](Graphics[_0x5b7e47(0x275)]*0x1/0x3),_0x54ec33=Graphics[_0x5b7e47(0x1fb)],_0x1cf727=new Bitmap(_0x392c1e,_0x54ec33),_0x47c27a=[[0x0,0x0,_0x392c1e,0x0,Math[_0x5b7e47(0x2c8)](_0x392c1e/0x2),_0x54ec33,0x0,_0x54ec33],[0x0,_0x54ec33,_0x392c1e,_0x54ec33,_0x392c1e-Math[_0x5b7e47(0x18d)](_0x1df1e9/0x2),0x0,Math['round'](_0x1df1e9/0x2),0x0],[0x0,0x0,_0x392c1e,0x0,_0x392c1e,_0x54ec33,Math[_0x5b7e47(0x2c8)](_0x392c1e/0x2),_0x54ec33]];return this[_0x5b7e47(0x269)](_0x1cf727,_0x47c27a[_0x586dc1],_0x364439,0x2);},ImageManager[_0x1d0c3d(0x286)]=function(_0x171545){const _0x5cfe4e=_0x1d0c3d,_0xd84fad=Math[_0x5cfe4e(0x267)](Graphics[_0x5cfe4e(0x1fb)]*0x1/0x2)+0x14,_0x8fb5e6=Math[_0x5cfe4e(0x267)](Graphics['height']*0x1/0x2)+0x14,_0x3667ea=new Bitmap(_0xd84fad,_0x8fb5e6),_0x3df882=[Math['round'](_0xd84fad/0x2),0x0,_0xd84fad,Math['round'](_0x8fb5e6/0x2),Math[_0x5cfe4e(0x18d)](_0xd84fad/0x2),_0x8fb5e6,0x0,Math[_0x5cfe4e(0x18d)](_0x8fb5e6/0x2)];return this[_0x5cfe4e(0x269)](_0x3667ea,_0x3df882,_0x171545,0x2);},ImageManager[_0x1d0c3d(0x23e)]=function(_0x161805){const _0x41ba2c=_0x1d0c3d,_0x34f4f9=Math['ceil'](Graphics[_0x41ba2c(0x275)]/0x4)+0x28,_0x47087e=Math['ceil'](Graphics['height']*0x3/0x5),_0x5c4896=new Bitmap(_0x34f4f9,_0x47087e),_0x3d15ca=[Math[_0x41ba2c(0x18d)](_0x34f4f9*0x2/0x5),0x0,Math[_0x41ba2c(0x18d)](_0x34f4f9*0x7/0x8),Math[_0x41ba2c(0x18d)](_0x47087e*0x1/0x5),_0x34f4f9,Math[_0x41ba2c(0x18d)](_0x47087e*0x3/0x5),Math[_0x41ba2c(0x18d)](_0x34f4f9*0x3/0x5),_0x47087e,Math['round'](_0x34f4f9*0x1/0x8),Math['round'](_0x47087e*0x4/0x5),0x0,Math[_0x41ba2c(0x18d)](_0x47087e*0x2/0x5)];return this[_0x41ba2c(0x269)](_0x5c4896,_0x3d15ca,_0x161805,0x2);},ImageManager['create_VisualCutinEffect_Bitmap_Quad']=function(_0x424232,_0x332311){const _0x98559b=_0x1d0c3d,_0x23fe5c=ImageManager[_0x98559b(0x2ea)][_0x98559b(0x191)],_0x2ec9a1=ImageManager[_0x98559b(0x2ea)]['outerOutlineWeight'],_0xf45a19=Math['ceil'](Graphics['width']*0x1/0x2)+_0x23fe5c/0x2+Math[_0x98559b(0x2c8)](_0x2ec9a1/0x2),_0x4e622b=Math[_0x98559b(0x267)](Graphics[_0x98559b(0x1fb)]*0x1/0x2)+_0x23fe5c/0x2+Math[_0x98559b(0x2c8)](_0x2ec9a1/0x2),_0x25f43f=new Bitmap(_0xf45a19,_0x4e622b),_0x944ee1=[[0x0,0x0,_0xf45a19,0x0,_0xf45a19,_0x4e622b,0x0,_0x4e622b],[_0xf45a19,0x0,0x0,0x0,0x0,_0x4e622b,_0xf45a19,_0x4e622b],[0x0,_0x4e622b,_0xf45a19,_0x4e622b,_0xf45a19,0x0,0x0,0x0],[_0xf45a19,_0x4e622b,0x0,_0x4e622b,0x0,0x0,_0xf45a19,0x0]];return this[_0x98559b(0x269)](_0x25f43f,_0x944ee1[_0x332311],_0x424232,0x2);},ImageManager['create_VisualCutinEffect_Bitmap_Corner']=function(_0x4402f6,_0x270b93){const _0x4acebf=_0x1d0c3d,_0x989a59=ImageManager[_0x4acebf(0x2ea)][_0x4acebf(0x191)],_0x5466e8=Math[_0x4acebf(0x267)](Graphics[_0x4acebf(0x275)]/0x3)+_0x989a59,_0x285c76=Math['ceil'](Graphics[_0x4acebf(0x1fb)]/0x2)+_0x989a59,_0x50679d=new Bitmap(_0x5466e8,_0x285c76),_0x756f9f=[[0x0,0x0,_0x5466e8,0x0,Math['round'](_0x5466e8*0x5/0x6),Math[_0x4acebf(0x18d)](_0x285c76*0x5/0x6),0x0,_0x285c76],[_0x5466e8,0x0,0x0,0x0,Math[_0x4acebf(0x18d)](_0x5466e8*0x1/0x6),Math['round'](_0x285c76*0x5/0x6),_0x5466e8,_0x285c76],[0x0,_0x285c76,_0x5466e8,_0x285c76,Math[_0x4acebf(0x18d)](_0x5466e8*0x5/0x6),Math[_0x4acebf(0x18d)](_0x285c76*0x1/0x6),0x0,0x0],[_0x5466e8,_0x285c76,0x0,_0x285c76,Math[_0x4acebf(0x18d)](_0x5466e8*0x1/0x6),Math[_0x4acebf(0x18d)](_0x285c76*0x1/0x6),_0x5466e8,0x0]];return this[_0x4acebf(0x269)](_0x50679d,_0x756f9f[_0x270b93],_0x4402f6,0x2);},ImageManager[_0x1d0c3d(0x2b0)]=function(_0x1b9d72,_0x424118){const _0x50a772=_0x1d0c3d,_0x3b345f=Graphics['width']+0x28,_0x3e0e78=Math[_0x50a772(0x267)](Graphics[_0x50a772(0x1fb)]/_0x424118),_0x169f8d=new Bitmap(_0x3b345f,_0x3e0e78),_0x1da36f=0x5,_0x311941=[0x0,Math[_0x50a772(0x267)](_0x3e0e78*0x1/_0x1da36f),_0x3b345f,Math[_0x50a772(0x267)](_0x3e0e78*0x0/_0x1da36f),_0x3b345f,Math[_0x50a772(0x267)](_0x3e0e78*(_0x1da36f-0x1)/_0x1da36f),0x0,Math['ceil'](_0x3e0e78*_0x1da36f/_0x1da36f)];return this['fill_VisualCutinEffect_Bitmap'](_0x169f8d,_0x311941,_0x1b9d72,0.5);},ImageManager[_0x1d0c3d(0x199)]=function(_0xcc7673,_0x404398){const _0x5834bf=_0x1d0c3d,_0x46abaa=Math['ceil'](Graphics[_0x5834bf(0x275)]/_0x404398),_0x8e945d=Graphics[_0x5834bf(0x1fb)]+0x28,_0x159a6=new Bitmap(_0x46abaa,_0x8e945d),_0x1c1fbf=0x5,_0x24ad5c=[Math[_0x5834bf(0x267)](_0x46abaa*0x1/_0x1c1fbf),0x0,_0x46abaa,0x0,Math[_0x5834bf(0x267)](_0x46abaa*(_0x1c1fbf-0x1)/_0x1c1fbf),_0x8e945d,0x0,_0x8e945d];return this[_0x5834bf(0x269)](_0x159a6,_0x24ad5c,_0xcc7673,0x1);},ImageManager[_0x1d0c3d(0x215)]=function(_0x15351f,_0x6152fd,_0x4336c6){const _0x112b09=_0x1d0c3d,_0x49fe21=Math[_0x112b09(0x267)](Graphics['width']/_0x6152fd)-0x14,_0x10c224=Math[_0x112b09(0x267)](Graphics['height']/_0x4336c6)-0x14,_0x2cd398=new Bitmap(_0x49fe21,_0x10c224),_0x1403d9=0x5,_0x47f326=[Math[_0x112b09(0x267)](_0x49fe21*0x1/_0x1403d9),0x0,_0x49fe21,0x0,Math[_0x112b09(0x267)](_0x49fe21*(_0x1403d9-0x1)/_0x1403d9),_0x10c224,0x0,_0x10c224];return this[_0x112b09(0x269)](_0x2cd398,_0x47f326,_0x15351f,0x1);},ColorManager[_0x1d0c3d(0x167)]=function(_0x2d8906){const _0x151ac0=_0x1d0c3d;return _0x2d8906=String(_0x2d8906),_0x2d8906[_0x151ac0(0x230)](/#(.*)/i)?'#%1'[_0x151ac0(0x1b9)](String(RegExp['$1'])):this[_0x151ac0(0x1a0)](Number(_0x2d8906));},Game_Temp['prototype'][_0x1d0c3d(0x2df)]=function(_0x5ce479){const _0x18c997=_0x1d0c3d;let _0x5c3b40={};_0x5c3b40[_0x18c997(0x226)]=_0x5ce479[_0x18c997(0x161)]()[_0x18c997(0x2b1)](),_0x5c3b40[_0x18c997(0x1ce)]=0xc,_0x5c3b40['exitDuration']=0xc,_0x5c3b40['outlineShow']=!![],_0x5c3b40[_0x18c997(0x1ee)]='Actor1_2',_0x5c3b40['portraitOpacity']=0xff,_0x5c3b40[_0x18c997(0x252)]=![],_0x5c3b40[_0x18c997(0x296)]=![],_0x5c3b40[_0x18c997(0x1d0)]=!![],_0x5c3b40[_0x18c997(0x194)]=![],_0x5c3b40[_0x18c997(0x2a3)]=0x0,_0x5c3b40[_0x18c997(0x2c1)]=0x0,_0x5c3b40[_0x18c997(0x2d1)]=0x0,_0x5c3b40[_0x18c997(0x1b7)]=!![],_0x5c3b40[_0x18c997(0x1bb)]=0x4,_0x5c3b40[_0x18c997(0x18b)]=_0x18c997(0x1f7),_0x5c3b40[_0x18c997(0x2ac)]=0xff,_0x5c3b40[_0x18c997(0x211)]=0x1,_0x5c3b40[_0x18c997(0x176)]=0x0,_0x5c3b40['bgShow']=!![],_0x5c3b40['bgColor']=_0x18c997(0x285),SceneManager[_0x18c997(0x196)]['startVisualCutin'](_0x5c3b40);},VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x2a4)]=Game_Screen[_0x1d0c3d(0x21c)][_0x1d0c3d(0x164)],Game_Screen[_0x1d0c3d(0x21c)]['initialize']=function(){const _0x326226=_0x1d0c3d;VisuMZ[_0x326226(0x2ad)]['Game_Screen_initialize']['call'](this),this[_0x326226(0x15f)]();},Game_Screen['prototype'][_0x1d0c3d(0x15f)]=function(){const _0x75c0e9=_0x1d0c3d;this[_0x75c0e9(0x2b7)]={'order':{'map':[],'battle':[]},'settings':{'map':{},'battle':{}}};},Game_Screen[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1cb)]=function(_0x4bc3bb){const _0x2e0e90=_0x1d0c3d;if(this[_0x2e0e90(0x2b7)]===undefined)this[_0x2e0e90(0x15f)]();if(!_0x4bc3bb)return;if(!_0x4bc3bb[_0x2e0e90(0x226)])return;if(_0x4bc3bb[_0x2e0e90(0x226)]['trim']()==='')return;const _0x540abe=_0x4bc3bb[_0x2e0e90(0x226)][_0x2e0e90(0x161)]()[_0x2e0e90(0x2b1)](),_0x1a554d=this['_visualCutinEffect'],_0x35d435=_0x1a554d[_0x2e0e90(0x1f1)][SceneManager['isSceneBattle']()?'battle':_0x2e0e90(0x2db)],_0x15398f=_0x1a554d['settings'][SceneManager[_0x2e0e90(0x1e1)]()?_0x2e0e90(0x1e2):_0x2e0e90(0x2db)];if(_0x35d435['includes'](_0x540abe))return;_0x35d435[_0x2e0e90(0x203)](_0x540abe),_0x15398f[_0x540abe]=JSON[_0x2e0e90(0x19f)](JSON[_0x2e0e90(0x1a3)](_0x4bc3bb));},Game_Screen[_0x1d0c3d(0x21c)][_0x1d0c3d(0x181)]=function(_0xfd3648,_0x4badd4,_0x46cc6f){const _0xdcff0e=_0x1d0c3d;if(this[_0xdcff0e(0x2b7)]===undefined)this[_0xdcff0e(0x15f)]();if(!_0xfd3648)return;if(_0xfd3648['trim']()==='')return;_0xfd3648=_0xfd3648[_0xdcff0e(0x161)]()[_0xdcff0e(0x2b1)]();const _0x324463=this[_0xdcff0e(0x210)](_0xfd3648);_0x324463[_0xdcff0e(0x1ee)]=_0x4badd4,_0x324463[_0xdcff0e(0x2f1)]='';for(const _0x171d48 in _0x46cc6f){_0x324463[_0x171d48]=_0x46cc6f[_0x171d48];}},Game_Screen[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1b0)]=function(_0x1e6f5f,_0x2e3458,_0x2ededa){const _0x2f20d0=_0x1d0c3d;if(this[_0x2f20d0(0x2b7)]===undefined)this['initVisualCutinEffect']();if(!_0x1e6f5f)return;if(_0x1e6f5f['trim']()==='')return;_0x1e6f5f=_0x1e6f5f[_0x2f20d0(0x161)]()[_0x2f20d0(0x2b1)]();const _0x2c94d0=this[_0x2f20d0(0x210)](_0x1e6f5f);_0x2c94d0['parallaxFilename']=_0x2e3458;for(const _0x14707d in _0x2ededa){_0x2c94d0[_0x14707d]=_0x2ededa[_0x14707d];}},Game_Screen['prototype'][_0x1d0c3d(0x1fc)]=function(_0x2876fa){const _0x2242a8=_0x1d0c3d;if(this[_0x2242a8(0x2b7)]===undefined)this[_0x2242a8(0x15f)]();if(!_0x2876fa)return;if(_0x2876fa[_0x2242a8(0x2b1)]()==='')return;_0x2876fa=_0x2876fa[_0x2242a8(0x161)]()[_0x2242a8(0x2b1)]();const _0x588e1c=this[_0x2242a8(0x2b7)],_0x3aa8ca=_0x588e1c[_0x2242a8(0x1f1)][SceneManager[_0x2242a8(0x1e1)]()?_0x2242a8(0x1e2):_0x2242a8(0x2db)],_0xcc1889=_0x588e1c['settings'][SceneManager[_0x2242a8(0x1e1)]()?'battle':'map'];_0x3aa8ca['remove'](_0x2876fa),_0xcc1889[_0x2876fa]=undefined;},Game_Screen[_0x1d0c3d(0x21c)]['getVisualCutinEffectSpriteOrder']=function(){const _0x1133e6=_0x1d0c3d;if(this[_0x1133e6(0x2b7)]===undefined)this[_0x1133e6(0x15f)]();const _0x2d905=this['_visualCutinEffect'],_0x586b59=_0x2d905[_0x1133e6(0x1f1)][SceneManager[_0x1133e6(0x1e1)]()?_0x1133e6(0x1e2):_0x1133e6(0x2db)];return _0x586b59;},Game_Screen[_0x1d0c3d(0x21c)]['getVisualCutinEffectSettings']=function(_0x1d4777){const _0x4a09e0=_0x1d0c3d;if(this[_0x4a09e0(0x2b7)]===undefined)this[_0x4a09e0(0x15f)]();if(!_0x1d4777)return;if(_0x1d4777[_0x4a09e0(0x2b1)]()==='')return;_0x1d4777=_0x1d4777[_0x4a09e0(0x161)]()[_0x4a09e0(0x2b1)]();const _0x21a98=this[_0x4a09e0(0x2b7)],_0x2b4980=_0x21a98[_0x4a09e0(0x2d7)][SceneManager[_0x4a09e0(0x1e1)]()?_0x4a09e0(0x1e2):'map'];return _0x2b4980[_0x1d4777]||null;},Game_Actor['prototype']['visualCutinPortraitFilename']=function(){const _0x1eb661=_0x1d0c3d;if(this['getBattlePortraitFilename']()!=='')return this[_0x1eb661(0x208)]();return this[_0x1eb661(0x279)]();},Game_Actor[_0x1d0c3d(0x21c)][_0x1d0c3d(0x297)]=function(){const _0x50bbcc=_0x1d0c3d;if(this[_0x50bbcc(0x208)]()!=='')return 0x0;return this[_0x50bbcc(0x1c0)]();},Game_Actor[_0x1d0c3d(0x21c)]['visualCutinPortraitHue']=function(){return 0x0;},Game_Actor['prototype'][_0x1d0c3d(0x205)]=function(){if(this['getBattlePortraitFilename']()!=='')return'';return'face';},Game_Enemy[_0x1d0c3d(0x21c)][_0x1d0c3d(0x22d)]=function(){const _0x1c7e74=_0x1d0c3d;if(this['hasCustomVisualCutinPortrait']())return this[_0x1c7e74(0x15c)]();if(this[_0x1c7e74(0x1e0)]())return this['svBattlerName']();return this[_0x1c7e74(0x2dd)]();},Game_Enemy[_0x1d0c3d(0x21c)]['visualCutinPortraitIndex']=function(){return 0x0;},Game_Enemy['prototype'][_0x1d0c3d(0x1e8)]=function(){const _0x1c04e7=_0x1d0c3d;if(this[_0x1c04e7(0x1e0)]())return 0x0;return this[_0x1c04e7(0x28f)]();},Game_Enemy[_0x1d0c3d(0x21c)]['visualCutinPortraitType']=function(){const _0x294239=_0x1d0c3d;if(this[_0x294239(0x2dc)]())return'';if(this[_0x294239(0x1e0)]())return _0x294239(0x277);if($gameSystem[_0x294239(0x2cb)]())return _0x294239(0x1d2);return _0x294239(0x2f2);},Game_Enemy[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2dc)]=function(){const _0x34ffb0=_0x1d0c3d;return this[_0x34ffb0(0x15c)]()!=='';},Game_Enemy['prototype']['getCustomVisualCutinPortraitFilename']=function(){const _0x5eed1f=_0x1d0c3d;if(this[_0x5eed1f(0x1f9)]===undefined){this['_customVisualCutinPortraitFilename']='';const _0x2b2649=VisuMZ[_0x5eed1f(0x2ad)][_0x5eed1f(0x1b3)],_0xe48cf3=this[_0x5eed1f(0x2f2)]()[_0x5eed1f(0x201)];_0xe48cf3['match'](_0x2b2649['EnemyCutinPortraitName'])&&(this[_0x5eed1f(0x1f9)]=String(RegExp['$1'])[_0x5eed1f(0x2b1)]()),_0xe48cf3[_0x5eed1f(0x230)](_0x2b2649[_0x5eed1f(0x2ba)])&&(this[_0x5eed1f(0x253)]=!![]),_0xe48cf3[_0x5eed1f(0x230)](_0x2b2649[_0x5eed1f(0x28d)])&&(this[_0x5eed1f(0x2a8)]=!![]);}return this['_customVisualCutinPortraitFilename'];},Game_Enemy['prototype'][_0x1d0c3d(0x29b)]=function(){const _0x55108f=_0x1d0c3d;return(this[_0x55108f(0x2f2)]()[_0x55108f(0x201)]||'')[_0x55108f(0x230)](VisuMZ['VisualCutinEffect']['RegExp'][_0x55108f(0x2ba)]);},Game_Enemy[_0x1d0c3d(0x21c)][_0x1d0c3d(0x257)]=function(){const _0x164fa3=_0x1d0c3d;return(this[_0x164fa3(0x2f2)]()[_0x164fa3(0x201)]||'')[_0x164fa3(0x230)](VisuMZ['VisualCutinEffect'][_0x164fa3(0x1b3)][_0x164fa3(0x28d)]);},VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x251)]=Game_Interpreter[_0x1d0c3d(0x21c)]['updateWaitMode'],Game_Interpreter[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1f4)]=function(){const _0x147de0=_0x1d0c3d;switch(this[_0x147de0(0x2b4)]){case'cutinEnter':if(SceneManager[_0x147de0(0x196)]&&SceneManager[_0x147de0(0x196)]['isAnyCutinEntering']())return!![];this[_0x147de0(0x2b4)]='';break;case'cutinExit':if(SceneManager[_0x147de0(0x196)]&&SceneManager[_0x147de0(0x196)][_0x147de0(0x2ec)]())return!![];this[_0x147de0(0x2b4)]='';break;}return VisuMZ[_0x147de0(0x2ad)][_0x147de0(0x251)]['call'](this);},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x173)]=function(){const _0x53a47f=_0x1d0c3d;this['createVisualCutinContainer'](),this[_0x53a47f(0x179)]();},Scene_Message['prototype'][_0x1d0c3d(0x231)]=function(){const _0x2eff5c=_0x1d0c3d;this['_visualCutins']=this[_0x2eff5c(0x1cd)]||{},this[_0x2eff5c(0x219)]=new Sprite();const _0x2e0e21=this[_0x2eff5c(0x1ae)][_0x2eff5c(0x189)](this['_spriteset']);this[_0x2eff5c(0x26b)](this[_0x2eff5c(0x219)],_0x2e0e21+0x1);},Scene_Message[_0x1d0c3d(0x21c)]['createExistingVisualCutinSprites']=function(){const _0x27d144=_0x1d0c3d,_0x191bed=$gameScreen[_0x27d144(0x1af)]();for(const _0x295ee4 of _0x191bed){const _0x44334b=$gameScreen['getVisualCutinEffectSettings'](_0x295ee4);_0x44334b&&this['startVisualCutin'](_0x44334b);}this[_0x27d144(0x219)]['update']();},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x27c)]=function(_0x199118){const _0x5c66a8=_0x1d0c3d;if(!_0x199118)return;if(!_0x199118[_0x5c66a8(0x226)])return;if(_0x199118[_0x5c66a8(0x226)][_0x5c66a8(0x2b1)]()==='')return;this['updateVisualCutinLayer']();const _0x462db7=_0x199118[_0x5c66a8(0x226)][_0x5c66a8(0x161)]()[_0x5c66a8(0x2b1)]();if(this[_0x5c66a8(0x1cd)][_0x462db7]){if($gameTemp[_0x5c66a8(0x27a)]()){const _0x30d407=_0x5c66a8(0x1ab)+_0x5c66a8(0x1f6);console[_0x5c66a8(0x17c)](_0x30d407);}return;}$gameScreen[_0x5c66a8(0x1cb)](_0x199118);const _0x1fcb4b=new Sprite_VisualCutin(_0x199118);this[_0x5c66a8(0x1cd)][_0x462db7]=_0x1fcb4b,this[_0x5c66a8(0x219)]['addChild'](_0x1fcb4b);},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2e4)]=function(){const _0x50e8d9=_0x1d0c3d,_0xbf6fb1=VisuMZ[_0x50e8d9(0x2ad)][_0x50e8d9(0x280)][_0x50e8d9(0x23b)]??_0x50e8d9(0x2f3);_0xbf6fb1===_0x50e8d9(0x212)&&this[_0x50e8d9(0x1ed)](this[_0x50e8d9(0x219)]);},Scene_Message['prototype'][_0x1d0c3d(0x27f)]=function(_0x33bfea,_0x49af62,_0xc4cd5d){const _0x418119=_0x1d0c3d;if(_0x33bfea[_0x418119(0x2b1)]()==='')return;if(!this[_0x418119(0x1cd)][_0x33bfea])return;$gameScreen[_0x418119(0x181)](_0x33bfea,_0x49af62,_0xc4cd5d);const _0x590c26=this[_0x418119(0x1cd)][_0x33bfea];_0x590c26[_0x418119(0x244)]();},Scene_Message['prototype'][_0x1d0c3d(0x27d)]=function(_0x508965,_0x167795,_0x4fe705){const _0x511f0f=_0x1d0c3d;if(_0x508965[_0x511f0f(0x2b1)]()==='')return;if(!this[_0x511f0f(0x1cd)][_0x508965])return;$gameScreen[_0x511f0f(0x1b0)](_0x508965,_0x167795,_0x4fe705);const _0x9b9efa=this[_0x511f0f(0x1cd)][_0x508965];_0x9b9efa[_0x511f0f(0x1ec)]();},Scene_Message['prototype']['endVisualCutin']=function(_0x4947f6){const _0x386b5d=_0x1d0c3d;_0x4947f6=_0x4947f6[_0x386b5d(0x161)]()['trim']();if(!this['_visualCutins'][_0x4947f6])return;this['_visualCutins'][_0x4947f6][_0x386b5d(0x248)]();},Scene_Message[_0x1d0c3d(0x21c)]['removeVisualCutin']=function(_0x36805d){const _0x394d72=_0x1d0c3d;_0x36805d=_0x36805d[_0x394d72(0x161)]()[_0x394d72(0x2b1)]();if(!this[_0x394d72(0x1cd)][_0x36805d])return;$gameScreen[_0x394d72(0x1fc)](_0x36805d);const _0x3d6fe6=this[_0x394d72(0x1cd)][_0x36805d];this[_0x394d72(0x219)]['removeChild'](_0x3d6fe6),_0x3d6fe6[_0x394d72(0x1bc)](),this[_0x394d72(0x1cd)][_0x36805d]=undefined;},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x293)]=function(){const _0x1b3d9f=_0x1d0c3d,_0x5cabea=$gameScreen[_0x1b3d9f(0x1af)]();for(const _0x150757 of _0x5cabea){this[_0x1b3d9f(0x264)](_0x150757);}},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x15b)]=function(){const _0x161ae5=_0x1d0c3d;if(this['_visualCutinContainer'])return this[_0x161ae5(0x219)]['children'][_0x161ae5(0x2b9)](_0x4df765=>_0x4df765[_0x161ae5(0x1ac)]);return![];},Scene_Message[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2ec)]=function(){const _0x44860f=_0x1d0c3d;if(this[_0x44860f(0x219)])return this['_visualCutinContainer'][_0x44860f(0x1ae)][_0x44860f(0x2b9)](_0x4d17dc=>_0x4d17dc[_0x44860f(0x1c1)]);return![];},VisuMZ[_0x1d0c3d(0x2ad)][_0x1d0c3d(0x2d0)]=Scene_Map[_0x1d0c3d(0x21c)][_0x1d0c3d(0x234)],Scene_Map[_0x1d0c3d(0x21c)]['createSpriteset']=function(){const _0x138bb9=_0x1d0c3d;VisuMZ[_0x138bb9(0x2ad)][_0x138bb9(0x2d0)][_0x138bb9(0x24a)](this),this[_0x138bb9(0x173)]();},VisuMZ[_0x1d0c3d(0x2ad)]['Scene_Battle_createSpriteset']=Scene_Battle['prototype']['createSpriteset'],Scene_Battle[_0x1d0c3d(0x21c)]['createSpriteset']=function(){const _0x4b1162=_0x1d0c3d;VisuMZ[_0x4b1162(0x2ad)]['Scene_Battle_createSpriteset'][_0x4b1162(0x24a)](this),this['createVisualCutins']();};function Sprite_VisualCutin(){const _0x34ba7f=_0x1d0c3d;this[_0x34ba7f(0x164)](...arguments);}Sprite_VisualCutin[_0x1d0c3d(0x21c)]=Object[_0x1d0c3d(0x229)](Sprite[_0x1d0c3d(0x21c)]),Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x177)]=Sprite_VisualCutin,Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x164)]=function(_0xeaa703){const _0x1e0190=_0x1d0c3d;this[_0x1e0190(0x2b8)]=_0xeaa703[_0x1e0190(0x226)][_0x1e0190(0x161)]()[_0x1e0190(0x2b1)]();;Sprite[_0x1e0190(0x21c)][_0x1e0190(0x164)][_0x1e0190(0x24a)](this),this[_0x1e0190(0x273)](),this[_0x1e0190(0x228)](),this[_0x1e0190(0x160)]=this[_0x1e0190(0x160)]||[],this[_0x1e0190(0x1bd)]();},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x2d7)]=function(){const _0x7d5cb8=_0x1d0c3d;return $gameScreen[_0x7d5cb8(0x210)](this[_0x7d5cb8(0x2b8)]);},Sprite_VisualCutin[_0x1d0c3d(0x21c)]['initMembers']=function(){const _0x58f117=_0x1d0c3d;this[_0x58f117(0x28a)]=0x0,this[_0x58f117(0x19a)]=0x0,this[_0x58f117(0x1ac)]=!![],this[_0x58f117(0x1c1)]=![],this[_0x58f117(0x162)]=0x0,this[_0x58f117(0x24f)]=0x0;},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x228)]=function(){const _0x55b3a1=_0x1d0c3d,_0xaa4f4a=this[_0x55b3a1(0x2d7)]()[_0x55b3a1(0x226)],_0x34b2ed=this[_0x55b3a1(0x1ea)]();switch(_0xaa4f4a){case _0x55b3a1(0x2ee):case'bottomleftquad':case _0x55b3a1(0x19c):case'bottomleftcorner':this['anchor']['x']=0x0;break;case _0x55b3a1(0x287):case _0x55b3a1(0x2aa):case _0x55b3a1(0x20c):case _0x55b3a1(0x1dd):case _0x55b3a1(0x24c):case _0x55b3a1(0x271):case'rightminor':case'lefthorzspan':case _0x55b3a1(0x240):case _0x55b3a1(0x290):case _0x55b3a1(0x29f):case'righthorzslash':case _0x55b3a1(0x198):case _0x55b3a1(0x250):case'leftdiamond':case _0x55b3a1(0x166):case _0x55b3a1(0x15d):case _0x55b3a1(0x1ef):case _0x55b3a1(0x21b):case _0x55b3a1(0x232):case _0x55b3a1(0x1d3):case _0x55b3a1(0x2b2):case _0x55b3a1(0x16a):case _0x55b3a1(0x21e):case _0x55b3a1(0x16c):case'row3rdfourth':case _0x55b3a1(0x15a):case _0x55b3a1(0x192):case _0x55b3a1(0x2e2):case _0x55b3a1(0x170):case _0x55b3a1(0x159):case _0x55b3a1(0x2a5):case _0x55b3a1(0x247):case _0x55b3a1(0x292):case'col3rdthird':case _0x55b3a1(0x1a9):case _0x55b3a1(0x2a7):case _0x55b3a1(0x18a):case _0x55b3a1(0x157):case _0x55b3a1(0x227):case'col2ndfifth':case'col3rdfifth':case _0x55b3a1(0x2ef):case _0x55b3a1(0x1f2):case _0x55b3a1(0x1b8):case'sixpack2':case _0x55b3a1(0x260):case _0x55b3a1(0x20e):case'sixpack5':case _0x55b3a1(0x2f0):case _0x55b3a1(0x1f8):case _0x55b3a1(0x163):case _0x55b3a1(0x28b):case _0x55b3a1(0x1bf):case _0x55b3a1(0x1e5):case _0x55b3a1(0x2bc):case _0x55b3a1(0x27b):case _0x55b3a1(0x2e7):case _0x55b3a1(0x259):case _0x55b3a1(0x1a2):case'twelvepack3':case _0x55b3a1(0x216):case'twelvepack5':case'twelvepack6':case'twelvepack7':case _0x55b3a1(0x22a):case'twelvepack9':case'twelvepack10':case'twelvepack11':case _0x55b3a1(0x1c7):this[_0x55b3a1(0x2ae)]['x']=0.5;break;case _0x55b3a1(0x171):case _0x55b3a1(0x245):case _0x55b3a1(0x16d):case _0x55b3a1(0x2a6):this[_0x55b3a1(0x2ae)]['x']=0x1;break;}switch(_0xaa4f4a){case _0x55b3a1(0x2ee):case _0x55b3a1(0x171):case'topleftcorner':case _0x55b3a1(0x16d):this['anchor']['y']=0x0;break;case'whole':case'showcase':case _0x55b3a1(0x20c):case _0x55b3a1(0x1dd):case'leftminor':case'centerminor':case _0x55b3a1(0x225):case _0x55b3a1(0x2c2):case'centerhorzspan':case'righthorzspan':case'lefthorzslash':case _0x55b3a1(0x2f5):case'leftvertslash':case _0x55b3a1(0x250):case _0x55b3a1(0x2f4):case'centerdiamond':case _0x55b3a1(0x15d):case _0x55b3a1(0x1ef):case'centergemstone':case _0x55b3a1(0x232):case'row1stthird':case'row2ndthird':case'row3rdthird':case _0x55b3a1(0x21e):case _0x55b3a1(0x16c):case _0x55b3a1(0x23d):case _0x55b3a1(0x15a):case'row1stfifth':case _0x55b3a1(0x2e2):case _0x55b3a1(0x170):case'row4thfifth':case'row5thfifth':case _0x55b3a1(0x247):case _0x55b3a1(0x292):case _0x55b3a1(0x15e):case _0x55b3a1(0x1a9):case'col2ndfourth':case'col3rdfourth':case _0x55b3a1(0x157):case'col1stfifth':case _0x55b3a1(0x274):case _0x55b3a1(0x2c5):case'col4thfifth':case _0x55b3a1(0x1f2):case'sixpack1':case _0x55b3a1(0x18c):case'sixpack3':case _0x55b3a1(0x20e):case _0x55b3a1(0x17a):case'sixpack6':case _0x55b3a1(0x1f8):case _0x55b3a1(0x163):case _0x55b3a1(0x28b):case _0x55b3a1(0x1bf):case'eightpack5':case'eightpack6':case _0x55b3a1(0x27b):case _0x55b3a1(0x2e7):case _0x55b3a1(0x259):case _0x55b3a1(0x1a2):case _0x55b3a1(0x184):case _0x55b3a1(0x216):case _0x55b3a1(0x23f):case _0x55b3a1(0x238):case _0x55b3a1(0x2d8):case'twelvepack8':case'twelvepack9':case _0x55b3a1(0x172):case'twelvepack11':case _0x55b3a1(0x1c7):this[_0x55b3a1(0x2ae)]['y']=0.5;break;case _0x55b3a1(0x1ad):case _0x55b3a1(0x245):case _0x55b3a1(0x22c):case'bottomrightcorner':this[_0x55b3a1(0x2ae)]['y']=0x1;break;}switch(_0xaa4f4a){case _0x55b3a1(0x2ee):case _0x55b3a1(0x1ad):case'topleftcorner':case'bottomleftcorner':this['x']=-ImageManager[_0x55b3a1(0x2ea)][_0x55b3a1(0x191)];break;case'farleft':this['x']=0x0;break;case _0x55b3a1(0x287):case'showcase':case'lefthorzspan':case _0x55b3a1(0x240):case'righthorzspan':case _0x55b3a1(0x29f):case _0x55b3a1(0x2f5):case'leftvertslash':case _0x55b3a1(0x250):case _0x55b3a1(0x166):case _0x55b3a1(0x21b):case'row1stthird':case _0x55b3a1(0x2b2):case'row3rdthird':case _0x55b3a1(0x21e):case _0x55b3a1(0x16c):case _0x55b3a1(0x23d):case _0x55b3a1(0x15a):case _0x55b3a1(0x192):case _0x55b3a1(0x2e2):case _0x55b3a1(0x170):case'row4thfifth':case _0x55b3a1(0x2a5):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]/0x2);break;case _0x55b3a1(0x2f4):case'leftgemstone':this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*0x1/0x6)+0x28;break;case'rightdiamond':case _0x55b3a1(0x232):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*0x5/0x6)-0x28;break;case _0x55b3a1(0x1df):this['x']=Graphics['width'];break;case _0x55b3a1(0x171):case'bottomrightquad':case _0x55b3a1(0x16d):case _0x55b3a1(0x2a6):this['x']=Graphics[_0x55b3a1(0x275)]+ImageManager['VISUAL_CUTIN_EFFECT'][_0x55b3a1(0x191)];break;case _0x55b3a1(0x20c):this['x']=Math['round'](Graphics[_0x55b3a1(0x275)]*(0x1-0.5)/0x2);break;case'rightmajor':this['x']=Math['round'](Graphics[_0x55b3a1(0x275)]*(0x2-0.5)/0x2);break;case _0x55b3a1(0x24c):case _0x55b3a1(0x247):case'sixpack1':case _0x55b3a1(0x20e):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x1-0.5)/0x3);break;case _0x55b3a1(0x271):case _0x55b3a1(0x292):case _0x55b3a1(0x18c):case _0x55b3a1(0x17a):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x2-0.5)/0x3);break;case _0x55b3a1(0x225):case _0x55b3a1(0x15e):case _0x55b3a1(0x260):case'sixpack6':this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x3-0.5)/0x3);break;case _0x55b3a1(0x1a9):case _0x55b3a1(0x1f8):case _0x55b3a1(0x1e5):case _0x55b3a1(0x259):case _0x55b3a1(0x23f):case _0x55b3a1(0x266):this['x']=Math[_0x55b3a1(0x18d)](Graphics['width']*(0x1-0.5)/0x4);break;case'col2ndfourth':case _0x55b3a1(0x163):case _0x55b3a1(0x2bc):case _0x55b3a1(0x1a2):case _0x55b3a1(0x238):case _0x55b3a1(0x172):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x2-0.5)/0x4);break;case _0x55b3a1(0x18a):case _0x55b3a1(0x28b):case'eightpack7':case _0x55b3a1(0x184):case'twelvepack7':case'twelvepack11':this['x']=Math['round'](Graphics[_0x55b3a1(0x275)]*(0x3-0.5)/0x4);break;case'col4thfourth':case _0x55b3a1(0x1bf):case'eightpack8':case _0x55b3a1(0x216):case _0x55b3a1(0x22a):case _0x55b3a1(0x1c7):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x4-0.5)/0x4);break;case _0x55b3a1(0x227):this['x']=Math[_0x55b3a1(0x18d)](Graphics['width']*(0x1-0.5)/0x5);break;case _0x55b3a1(0x274):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x2-0.5)/0x5);break;case _0x55b3a1(0x2c5):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x3-0.5)/0x5);break;case _0x55b3a1(0x2ef):this['x']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x275)]*(0x4-0.5)/0x5);break;case _0x55b3a1(0x1f2):this['x']=Math[_0x55b3a1(0x18d)](Graphics['width']*(0x5-0.5)/0x5);break;}switch(_0xaa4f4a){case _0x55b3a1(0x2ee):case _0x55b3a1(0x171):case'topleftcorner':case'toprightcorner':this['y']=-ImageManager[_0x55b3a1(0x2ea)]['OutlineThickness'];break;case _0x55b3a1(0x212):this['y']=0x0;break;case _0x55b3a1(0x2aa):case _0x55b3a1(0x2c2):case _0x55b3a1(0x240):case _0x55b3a1(0x290):case _0x55b3a1(0x29f):case _0x55b3a1(0x2f5):case'leftmajor':case _0x55b3a1(0x1dd):case _0x55b3a1(0x24c):case _0x55b3a1(0x271):case _0x55b3a1(0x225):case _0x55b3a1(0x2f4):case _0x55b3a1(0x166):case _0x55b3a1(0x15d):case _0x55b3a1(0x1ef):case _0x55b3a1(0x21b):case _0x55b3a1(0x232):const _0x3be10d=Graphics[_0x55b3a1(0x1fb)]-_0x34b2ed;this['y']=Math['floor'](_0x3be10d/0x2);break;case _0x55b3a1(0x287):case'leftvertslash':case _0x55b3a1(0x250):case _0x55b3a1(0x247):case _0x55b3a1(0x292):case _0x55b3a1(0x15e):case _0x55b3a1(0x1a9):case _0x55b3a1(0x2a7):case _0x55b3a1(0x18a):case _0x55b3a1(0x157):case'col1stfifth':case _0x55b3a1(0x274):case'col3rdfifth':case'col4thfifth':case _0x55b3a1(0x1f2):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]/0x2);break;case _0x55b3a1(0x16b):this['y']=Graphics['height'];break;case'bottomleftquad':case _0x55b3a1(0x245):case'bottomleftcorner':case _0x55b3a1(0x2a6):this['y']=Graphics['height']+ImageManager[_0x55b3a1(0x2ea)]['OutlineThickness'];break;case'sixpack1':case _0x55b3a1(0x18c):case _0x55b3a1(0x260):case _0x55b3a1(0x1f8):case _0x55b3a1(0x163):case _0x55b3a1(0x28b):case'eightpack4':this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x1-0.5)/0x2);break;case'sixpack4':case'sixpack5':case _0x55b3a1(0x2f0):case'eightpack5':case _0x55b3a1(0x2bc):case _0x55b3a1(0x27b):case _0x55b3a1(0x2e7):this['y']=Math['round'](Graphics[_0x55b3a1(0x1fb)]*(0x2-0.5)/0x2);break;case _0x55b3a1(0x1d3):case _0x55b3a1(0x259):case _0x55b3a1(0x1a2):case'twelvepack3':case _0x55b3a1(0x216):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x1-0.5)/0x3);break;case'row2ndthird':case _0x55b3a1(0x23f):case _0x55b3a1(0x238):case _0x55b3a1(0x2d8):case _0x55b3a1(0x22a):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x2-0.5)/0x3);break;case _0x55b3a1(0x16a):case _0x55b3a1(0x266):case _0x55b3a1(0x172):case _0x55b3a1(0x27e):case _0x55b3a1(0x1c7):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x3-0.5)/0x3);break;case _0x55b3a1(0x21e):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x1-0.5)/0x4);break;case _0x55b3a1(0x16c):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x2-0.5)/0x4);break;case _0x55b3a1(0x23d):this['y']=Math['round'](Graphics[_0x55b3a1(0x1fb)]*(0x3-0.5)/0x4);break;case _0x55b3a1(0x15a):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x4-0.5)/0x4);break;case _0x55b3a1(0x192):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x1-0.5)/0x5);break;case _0x55b3a1(0x2e2):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x2-0.5)/0x5);break;case _0x55b3a1(0x170):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x3-0.5)/0x5);break;case'row4thfifth':this['y']=Math[_0x55b3a1(0x18d)](Graphics['height']*(0x4-0.5)/0x5);break;case _0x55b3a1(0x2a5):this['y']=Math[_0x55b3a1(0x18d)](Graphics[_0x55b3a1(0x1fb)]*(0x5-0.5)/0x5);break;}},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x1ea)]=function(){const _0x416e94=_0x1d0c3d;if(Imported[_0x416e94(0x283)]&&SceneManager[_0x416e94(0x1e1)]()){if(Imported[_0x416e94(0x268)]&&BattleManager['isUsingSideviewUiLayout']())return 0x0;if(SceneManager[_0x416e94(0x196)]['_statusWindow'])return SceneManager[_0x416e94(0x196)][_0x416e94(0x1cc)][_0x416e94(0x1fb)];}return SceneManager[_0x416e94(0x196)][_0x416e94(0x1b6)](0x4,SceneManager['isSceneBattle']());},Sprite_VisualCutin[_0x1d0c3d(0x21c)]['startEntrance']=function(){const _0x3f52c4=_0x1d0c3d,_0x310847=ImageManager[_0x3f52c4(0x2d9)](this['settings']()[_0x3f52c4(0x226)]);this['_entering']=!![],this[_0x3f52c4(0x28a)]=this['settings']()['enterDuration']||0x1,this['_fadeTarget']=0xff,this['_fadeRemove']=![],this[_0x3f52c4(0x1a1)]=this[_0x3f52c4(0x28a)],this['_moveWholeDuration']=this[_0x3f52c4(0x28a)],this['_moveEasingType']=_0x310847[_0x3f52c4(0x1c2)]||'Linear',this['x']+=_0x310847['cutinOffsetX']??0x0,this['y']+=_0x310847[_0x3f52c4(0x182)]??0x0,this['_moveTargetX']=this['x'],this['_moveTargetY']=this['y'],this['x']+=_0x310847['enterX']??0x0,this['y']+=_0x310847[_0x3f52c4(0x1da)]??0x0,this[_0x3f52c4(0x2e1)]=this[_0x3f52c4(0x28a)],this['_movePortraitWholeDuration']=this[_0x3f52c4(0x28a)],this[_0x3f52c4(0x18e)]=this['settings']()[_0x3f52c4(0x1a4)]||_0x3f52c4(0x1d5),this[_0x3f52c4(0x16e)]&&(this[_0x3f52c4(0x2b6)]=this[_0x3f52c4(0x16e)]['x'],this[_0x3f52c4(0x22b)]=this['_portraitSprite']['y'],this['_portraitSprite']['x']+=this['settings']()['portraitEnterX'],this[_0x3f52c4(0x16e)]['y']+=this[_0x3f52c4(0x2d7)]()['portraitEnterY']);},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x248)]=function(){const _0x3f4232=_0x1d0c3d,_0x1248e2=ImageManager['getVisualCutinStyleData'](this[_0x3f4232(0x2d7)]()[_0x3f4232(0x226)]);this[_0x3f4232(0x1c1)]=!![],this[_0x3f4232(0x28a)]=this['settings']()['exitDuration']||0x1,this['_fadeTarget']=0x0,this[_0x3f4232(0x2e9)]=!![],this[_0x3f4232(0x1a1)]=this[_0x3f4232(0x28a)],this[_0x3f4232(0x28c)]=this[_0x3f4232(0x28a)],this['_moveEasingType']=_0x1248e2['exitEasingType']||_0x3f4232(0x1d5),this[_0x3f4232(0x1c6)]=this['x']+_0x1248e2[_0x3f4232(0x24e)]??0x0,this[_0x3f4232(0x258)]=this['y']+_0x1248e2[_0x3f4232(0x22e)]??0x0,this['_portraitSprite']&&(this[_0x3f4232(0x2e1)]=this[_0x3f4232(0x28a)],this[_0x3f4232(0x202)]=this[_0x3f4232(0x28a)],this[_0x3f4232(0x18e)]=this['settings']()['portraitExitEasingType']||_0x3f4232(0x1d5),this[_0x3f4232(0x2b6)]=this[_0x3f4232(0x16e)]['x']+this[_0x3f4232(0x2d7)]()[_0x3f4232(0x278)],this[_0x3f4232(0x22b)]=this[_0x3f4232(0x16e)]['y']+this[_0x3f4232(0x2d7)]()[_0x3f4232(0x25c)]);},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1bc)]=function(){const _0x3f3fc7=_0x1d0c3d;Sprite['prototype']['destroy'][_0x3f3fc7(0x24a)](this),this[_0x3f3fc7(0x1e7)]&&this[_0x3f3fc7(0x1e7)][_0x3f3fc7(0x1bc)]();},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x1bd)]=function(){const _0x5d0e33=_0x1d0c3d;this['_loadingBitmaps']=[];if(ImageManager[_0x5d0e33(0x16f)](this[_0x5d0e33(0x2d7)]()['type'])){const _0xe4dac9=this[_0x5d0e33(0x2d7)]()[_0x5d0e33(0x226)]||'',_0x3a255a=ImageManager['cached_VisualCutinEffect_Mask'](_0xe4dac9);this['_loadingBitmaps'][_0x5d0e33(0x203)](_0x3a255a);const _0x421b6f=ImageManager[_0x5d0e33(0x29a)](_0xe4dac9);this[_0x5d0e33(0x263)][_0x5d0e33(0x203)](_0x421b6f);}if((this[_0x5d0e33(0x2d7)]()['parallaxFilename']||'')!==''){const _0x393a6c=ImageManager['loadParallax'](this[_0x5d0e33(0x2d7)]()[_0x5d0e33(0x18b)]);if(_0x393a6c[_0x5d0e33(0x2d3)]===_0x5d0e33(0x237))this[_0x5d0e33(0x263)][_0x5d0e33(0x203)](_0x393a6c);}if((this[_0x5d0e33(0x2d7)]()[_0x5d0e33(0x1ee)]||'')!==''){const _0x14c8c1=this['loadPortraitBitmap']();if(_0x14c8c1[_0x5d0e33(0x2d3)]===_0x5d0e33(0x237))this[_0x5d0e33(0x263)][_0x5d0e33(0x203)](_0x14c8c1);}if(this[_0x5d0e33(0x263)][_0x5d0e33(0x1e6)]<=0x0)this['createAllSprites']();else for(const _0x30e759 of this['_loadingBitmaps']){_0x30e759[_0x5d0e33(0x2c9)](this[_0x5d0e33(0x187)]['bind'](this,_0x30e759));}},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x187)]=function(_0x2fea62){const _0x5a5ea8=_0x1d0c3d;this[_0x5a5ea8(0x263)]['remove'](_0x2fea62);if(this['_loadingBitmaps']['length']<=0x0)this[_0x5a5ea8(0x246)]();},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x246)]=function(){const _0x4400fa=_0x1d0c3d;this[_0x4400fa(0x2ca)](),this['createMaskSprites'](),this['createBgColorSprite'](),this[_0x4400fa(0x2a0)](),this[_0x4400fa(0x2a9)](),this[_0x4400fa(0x284)](),this[_0x4400fa(0x26d)]();},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2ca)]=function(){const _0x2b471a=_0x1d0c3d;this[_0x2b471a(0x2bf)]=new Sprite(),this[_0x2b471a(0x2be)]=new Sprite();const _0x55cdc5=[this[_0x2b471a(0x2bf)],this[_0x2b471a(0x2be)]];for(const _0x3c81cb of _0x55cdc5){this['addChild'](_0x3c81cb),_0x3c81cb['filters']=_0x3c81cb[_0x2b471a(0x160)]||[],_0x3c81cb[_0x2b471a(0x2ae)]['x']=this[_0x2b471a(0x2ae)]['x'],_0x3c81cb[_0x2b471a(0x2ae)]['y']=this['anchor']['y'];}},Sprite_VisualCutin['prototype']['createMaskSprites']=function(){const _0x174b0c=_0x1d0c3d,_0x5d48ef=this[_0x174b0c(0x2d7)]()['type']||'';this[_0x174b0c(0x1c3)]=new Sprite(),this[_0x174b0c(0x1c3)][_0x174b0c(0x2d5)]=ImageManager['cached_VisualCutinEffect_Mask'](_0x5d48ef),this['addChild'](this[_0x174b0c(0x1c3)]),this[_0x174b0c(0x1c3)]['anchor']['x']=this[_0x174b0c(0x2ae)]['x'],this['_maskSprite'][_0x174b0c(0x2ae)]['y']=this['anchor']['y'],this[_0x174b0c(0x1cf)]=new PIXI[(_0x174b0c(0x185))](this[_0x174b0c(0x1c3)]),this['_backgroundContainer']['filters'][_0x174b0c(0x203)](this[_0x174b0c(0x1cf)]),this[_0x174b0c(0x1aa)]=new PIXI[(_0x174b0c(0x185))](this[_0x174b0c(0x1c3)]),this['_foregroundContainer'][_0x174b0c(0x160)][_0x174b0c(0x203)](this[_0x174b0c(0x1aa)]);},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x281)]=function(){const _0x9a882=_0x1d0c3d;this[_0x9a882(0x1e7)]=new Sprite(),this['_backgroundContainer']['addChild'](this[_0x9a882(0x1e7)]);if(this['settings']()['bgShow']){const _0xf37d0b=this[_0x9a882(0x1c3)]['bitmap'],_0x32391a=ColorManager[_0x9a882(0x167)](this['settings']()[_0x9a882(0x2da)]||_0x9a882(0x2d6));this[_0x9a882(0x1e7)][_0x9a882(0x2d5)]=new Bitmap(_0xf37d0b[_0x9a882(0x275)],_0xf37d0b[_0x9a882(0x1fb)]),this['_bgSprite'][_0x9a882(0x2d5)]['fillRect'](0x0,0x0,_0xf37d0b['width'],_0xf37d0b[_0x9a882(0x1fb)],_0x32391a);}this['_bgSprite'][_0x9a882(0x2ae)]['x']=this['anchor']['x'],this[_0x9a882(0x1e7)][_0x9a882(0x2ae)]['y']=this['anchor']['y'];},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2a0)]=function(){const _0x1e8513=_0x1d0c3d,_0x35200b=this[_0x1e8513(0x2d7)]()[_0x1e8513(0x18b)]||'';if(_0x35200b[_0x1e8513(0x2b1)]()==='')return;this[_0x1e8513(0x1d6)]=new TilingSprite(),this[_0x1e8513(0x2bf)][_0x1e8513(0x1ed)](this[_0x1e8513(0x1d6)]);const _0x4541a4=ImageManager['loadParallax'](_0x35200b);this[_0x1e8513(0x2eb)](_0x4541a4);},Sprite_VisualCutin[_0x1d0c3d(0x21c)]['applyParallaxBitmap']=function(_0xcfedf7){const _0x37643e=_0x1d0c3d;this[_0x37643e(0x1d6)][_0x37643e(0x2d5)]=_0xcfedf7;const _0x3b0967=this[_0x37643e(0x1c3)][_0x37643e(0x2d5)];this['_parallaxSprite'][_0x37643e(0x2f6)](0x0,0x0,_0x3b0967[_0x37643e(0x275)],_0x3b0967[_0x37643e(0x1fb)]),this[_0x37643e(0x1d6)][_0x37643e(0x19a)]=this[_0x37643e(0x2d7)]()[_0x37643e(0x2ac)]??0xff,this[_0x37643e(0x1cf)][_0x37643e(0x178)]=this['settings']()['parallaxBlendMode']??0x0,this[_0x37643e(0x1d6)]['anchor']['x']=this[_0x37643e(0x2ae)]['x'],this['_parallaxSprite'][_0x37643e(0x2ae)]['y']=this[_0x37643e(0x2ae)]['y'],this[_0x37643e(0x1d6)][_0x37643e(0x24d)]['x']+=this[_0x37643e(0x2d7)]()[_0x37643e(0x299)],this[_0x37643e(0x1d6)][_0x37643e(0x24d)]['y']+=this[_0x37643e(0x2d7)]()[_0x37643e(0x19b)],this['_parallaxColorFilter']=new ColorFilter(),this[_0x37643e(0x1d6)]['filters']=this[_0x37643e(0x1d6)][_0x37643e(0x160)]||[],this['_parallaxSprite'][_0x37643e(0x160)][_0x37643e(0x203)](this[_0x37643e(0x294)]),this[_0x37643e(0x294)][_0x37643e(0x29c)](this['settings']()[_0x37643e(0x17b)]??0x0);},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x1e4)]=function(){const _0x5cf1d8=_0x1d0c3d,_0x22763f=this[_0x5cf1d8(0x2d7)]()[_0x5cf1d8(0x1ee)];if(this[_0x5cf1d8(0x2d7)]()[_0x5cf1d8(0x2f1)]!==undefined){if(this['settings']()['portraitType']===_0x5cf1d8(0x2f2))return ImageManager[_0x5cf1d8(0x209)](_0x22763f);else{if(this[_0x5cf1d8(0x2d7)]()['portraitType']===_0x5cf1d8(0x1d2))return ImageManager[_0x5cf1d8(0x1fe)](_0x22763f);else{if(this['settings']()[_0x5cf1d8(0x2f1)]===_0x5cf1d8(0x277))return ImageManager['loadSvActor'](_0x22763f);else{if(this[_0x5cf1d8(0x2d7)]()[_0x5cf1d8(0x2f1)]===_0x5cf1d8(0x17e))return ImageManager['loadFace'](_0x22763f);}}}}return ImageManager['loadPicture'](_0x22763f);},Sprite_VisualCutin['prototype']['createPortraitSprite']=function(){const _0x1808bf=_0x1d0c3d,_0x41a460=this[_0x1808bf(0x2d7)]()['portraitFilename']||'';if(_0x41a460[_0x1808bf(0x2b1)]()==='')return;this['_portraitSprite']=new Sprite(),this[_0x1808bf(0x2be)]['addChild'](this[_0x1808bf(0x16e)]);const _0x53f7b8=this['loadPortraitBitmap']();this[_0x1808bf(0x1d8)](_0x53f7b8);},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1d8)]=function(_0x509775){const _0x109527=_0x1d0c3d;this[_0x109527(0x16e)][_0x109527(0x2d5)]=_0x509775,this[_0x109527(0x16e)][_0x109527(0x29c)](this[_0x109527(0x2d7)]()[_0x109527(0x197)]??0x0),this[_0x109527(0x16e)]['opacity']=this[_0x109527(0x2d7)]()[_0x109527(0x2e3)]??0xff,this[_0x109527(0x16e)][_0x109527(0x2ae)]['x']=this[_0x109527(0x2d7)]()[_0x109527(0x2c3)]??0.5,this[_0x109527(0x16e)][_0x109527(0x2ae)]['y']=this[_0x109527(0x2d7)]()[_0x109527(0x1a6)]??0.5;const _0x16becd=this[_0x109527(0x1c3)][_0x109527(0x2d5)];this['_portraitSprite']['x']=_0x16becd[_0x109527(0x275)]*(this['_portraitSprite']['anchor']['x']-this['anchor']['x']),this[_0x109527(0x16e)]['y']=_0x16becd[_0x109527(0x1fb)]*(this[_0x109527(0x16e)]['anchor']['y']-this['anchor']['y']),this['_portraitSprite']['x']+=this[_0x109527(0x2d7)]()[_0x109527(0x2c1)],this[_0x109527(0x16e)]['y']+=this[_0x109527(0x2d7)]()[_0x109527(0x2d1)],this[_0x109527(0x26f)]();if(this[_0x109527(0x2d7)]()[_0x109527(0x2a3)]!==0x0){const _0x57ce48=this[_0x109527(0x2d7)]()['portraitForcedScale'];this[_0x109527(0x16e)][_0x109527(0x1be)]['x']=_0x57ce48,this[_0x109527(0x16e)]['scale']['y']=_0x57ce48;}else{if(this['settings']()[_0x109527(0x1d0)]){const _0x434c38=_0x16becd[_0x109527(0x275)]/this['_portraitSprite'][_0x109527(0x275)],_0x540cfb=_0x16becd[_0x109527(0x1fb)]/this[_0x109527(0x16e)][_0x109527(0x1fb)],_0x2abf48=this['settings']()[_0x109527(0x194)]?Math[_0x109527(0x1b1)](_0x434c38,_0x540cfb):Math[_0x109527(0x239)](_0x434c38,_0x540cfb);this[_0x109527(0x16e)][_0x109527(0x1be)]['x']=_0x2abf48,this[_0x109527(0x16e)][_0x109527(0x1be)]['y']=_0x2abf48;}}if(this[_0x109527(0x2d7)]()[_0x109527(0x252)])this[_0x109527(0x16e)]['scale']['x']*=-0x1;if(this[_0x109527(0x2d7)]()[_0x109527(0x296)])this[_0x109527(0x16e)][_0x109527(0x1be)]['y']*=-0x1;},Sprite_VisualCutin['prototype']['applyPortraitFrame']=function(){const _0x3c53dc=_0x1d0c3d;if(this[_0x3c53dc(0x186)]()){this[_0x3c53dc(0x162)]=0x0,this[_0x3c53dc(0x24f)]=0x0,this[_0x3c53dc(0x26a)]();return;}const _0x1c8a4e=this[_0x3c53dc(0x16e)]['bitmap'],_0x836ade=this[_0x3c53dc(0x2d7)]()[_0x3c53dc(0x2f1)];if(_0x836ade!==undefined){if(_0x836ade===_0x3c53dc(0x17e)){const _0x55162e=this['settings']()[_0x3c53dc(0x298)],_0x18189a=ImageManager[_0x3c53dc(0x2ab)],_0x5e24d8=ImageManager[_0x3c53dc(0x2e0)],_0x3ac54f=Math[_0x3c53dc(0x2c8)](_0x55162e%0x4*_0x18189a/0x2),_0x35d47c=Math[_0x3c53dc(0x2c8)](Math[_0x3c53dc(0x2c8)](_0x55162e/0x4)*_0x5e24d8/0x2);this['_portraitSprite'][_0x3c53dc(0x236)](_0x3ac54f,_0x35d47c,_0x5e24d8,_0x5e24d8);return;}else{if(_0x836ade===_0x3c53dc(0x277)){const _0x539954=this[_0x3c53dc(0x2d7)]()[_0x3c53dc(0x1ee)][_0x3c53dc(0x230)](/\$/i),_0x50c7b6=_0x539954?0x1:ImageManager[_0x3c53dc(0x25e)],_0x1568f3=_0x539954?0x1:ImageManager[_0x3c53dc(0x1c5)],_0x3a3dec=_0x1c8a4e[_0x3c53dc(0x275)]/_0x50c7b6,_0x29571f=_0x1c8a4e[_0x3c53dc(0x1fb)]/_0x1568f3;this[_0x3c53dc(0x16e)][_0x3c53dc(0x236)](0x0,0x0,_0x3a3dec,_0x29571f);return;}}}this[_0x3c53dc(0x16e)][_0x3c53dc(0x236)](0x0,0x0,_0x1c8a4e[_0x3c53dc(0x275)],_0x1c8a4e[_0x3c53dc(0x1fb)]);},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x284)]=function(){const _0x4bea61=_0x1d0c3d;if(!this[_0x4bea61(0x2d7)]()[_0x4bea61(0x2c7)])return;const _0x3f563a=this['settings']()[_0x4bea61(0x226)]||'';this[_0x4bea61(0x25a)]=new Sprite(),this[_0x4bea61(0x2be)]['addChild'](this[_0x4bea61(0x25a)]),this[_0x4bea61(0x25a)][_0x4bea61(0x2d5)]=ImageManager['cached_VisualCutinEffect_Outline'](_0x3f563a),this[_0x4bea61(0x25a)][_0x4bea61(0x2ae)]['x']=0.5,this[_0x4bea61(0x25a)][_0x4bea61(0x2ae)]['y']=0.5;const _0x1ab0cc=this[_0x4bea61(0x1c3)][_0x4bea61(0x2d5)],_0x58eec1=ImageManager[_0x4bea61(0x2d9)](_0x3f563a);this[_0x4bea61(0x25a)]['x']=_0x1ab0cc[_0x4bea61(0x275)]*(0.5-this[_0x4bea61(0x2ae)]['x']),this[_0x4bea61(0x25a)]['x']+=_0x58eec1[_0x4bea61(0x21a)],this[_0x4bea61(0x25a)]['y']=_0x1ab0cc[_0x4bea61(0x1fb)]*(0.5-this['anchor']['y']),this[_0x4bea61(0x25a)]['y']+=_0x58eec1[_0x4bea61(0x2b5)];},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x1fd)]=function(){const _0x4980be=_0x1d0c3d;Sprite[_0x4980be(0x21c)]['update'][_0x4980be(0x24a)](this);if(!this[_0x4980be(0x2d7)]())return![];this['updateAnimatedPortrait'](),this[_0x4980be(0x221)](),this[_0x4980be(0x19d)](),this[_0x4980be(0x175)](),this[_0x4980be(0x25b)]();},Sprite_VisualCutin['prototype']['updateParallaxSprite']=function(){const _0x2c6399=_0x1d0c3d;if(!this[_0x2c6399(0x1d6)])return;this['settings']()[_0x2c6399(0x19e)]!==0x0&&(this[_0x2c6399(0x1d6)]['origin']['x']+=this['settings']()['parallaxScrollX']),this['settings']()[_0x2c6399(0x1dc)]!==0x0&&(this['_parallaxSprite'][_0x2c6399(0x24d)]['y']+=this[_0x2c6399(0x2d7)]()[_0x2c6399(0x176)]);},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x19d)]=function(){const _0x259773=_0x1d0c3d;if(this[_0x259773(0x1a1)]===undefined)return;if(this[_0x259773(0x1a1)]<=0x0)return;const _0x380aaa=this[_0x259773(0x1a1)],_0x5b76e6=this[_0x259773(0x28c)],_0xc4a484=this[_0x259773(0x2b3)];this[_0x259773(0x1c6)]!==undefined&&(this['x']=this[_0x259773(0x174)](this['x'],this[_0x259773(0x1c6)]??this['x'],_0x380aaa,_0x5b76e6,_0xc4a484));this[_0x259773(0x258)]!==undefined&&(this['y']=this['applyEasing'](this['y'],this[_0x259773(0x258)]??this['y'],_0x380aaa,_0x5b76e6,_0xc4a484));this[_0x259773(0x1a1)]--;if(this[_0x259773(0x1a1)]<=0x0){if(this['_moveTargetX']!==undefined)this['x']=this[_0x259773(0x1c6)]??this['x'];if(this[_0x259773(0x258)]!==undefined)this['y']=this[_0x259773(0x258)]??this['y'];}},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x175)]=function(){const _0x5ed619=_0x1d0c3d;if(this['_movePortraitDuration']===undefined)return;if(this[_0x5ed619(0x2e1)]<=0x0)return;if(!this[_0x5ed619(0x16e)])return;const _0x1d42d9=this['_movePortraitDuration'],_0x29f799=this[_0x5ed619(0x202)],_0x9b6da7=this[_0x5ed619(0x18e)];this[_0x5ed619(0x16e)]['x']=this[_0x5ed619(0x174)](this[_0x5ed619(0x16e)]['x'],this[_0x5ed619(0x2b6)],_0x1d42d9,_0x29f799,_0x9b6da7),this[_0x5ed619(0x16e)]['y']=this[_0x5ed619(0x174)](this[_0x5ed619(0x16e)]['y'],this[_0x5ed619(0x22b)],_0x1d42d9,_0x29f799,_0x9b6da7),this[_0x5ed619(0x2e1)]--,this[_0x5ed619(0x2e1)]<=0x0&&(this[_0x5ed619(0x16e)]['x']=this[_0x5ed619(0x2b6)],this['_portraitSprite']['y']=this['_portraitTargetY']);},Sprite_VisualCutin['prototype']['applyEasing']=function(_0x14d05c,_0x31638e,_0x1c0db0,_0x34471b,_0x494f11){const _0x1ffba2=_0x1d0c3d,_0x290fa5=VisuMZ[_0x1ffba2(0x169)]((_0x34471b-_0x1c0db0)/_0x34471b,_0x494f11||_0x1ffba2(0x1d5)),_0x3808fb=VisuMZ[_0x1ffba2(0x169)]((_0x34471b-_0x1c0db0+0x1)/_0x34471b,_0x494f11||_0x1ffba2(0x1d5)),_0x527394=(_0x14d05c-_0x31638e*_0x290fa5)/(0x1-_0x290fa5);return _0x527394+(_0x31638e-_0x527394)*_0x3808fb;},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x25b)]=function(){const _0x631b9b=_0x1d0c3d;if(this[_0x631b9b(0x28a)]<=0x0)return;const _0x22a406=this[_0x631b9b(0x28a)],_0x3b6a6f=this['_fadeTarget'];this[_0x631b9b(0x19a)]=(this[_0x631b9b(0x19a)]*(_0x22a406-0x1)+_0x3b6a6f)/_0x22a406,this[_0x631b9b(0x28a)]--,this[_0x631b9b(0x28a)]<=0x0&&(this[_0x631b9b(0x2d7)]()['enterDuration']=0x1,this[_0x631b9b(0x19a)]=_0x3b6a6f,this['_entering']=![],this[_0x631b9b(0x1c1)]=![],this[_0x631b9b(0x2e9)]&&SceneManager[_0x631b9b(0x196)]['removeVisualCutin'](this[_0x631b9b(0x2d7)]()[_0x631b9b(0x226)]));},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x186)]=function(){const _0x569766=_0x1d0c3d;if(!this[_0x569766(0x2d7)]())return![];if(this[_0x569766(0x2af)])return!![];if(Imported['VisuMZ_4_AnimatedPictures']&&this[_0x569766(0x16e)]){const _0x3ccc1e=this[_0x569766(0x2d7)]()['portraitFilename']||'';if(_0x3ccc1e[_0x569766(0x230)](/\[ANI\]\[(\d+)x(\d+)\]/i))return this['_isAnimatedPicture']=!![],this[_0x569766(0x25f)]=Math[_0x569766(0x1b1)](0x1,parseInt(RegExp['$1'])),this[_0x569766(0x276)]=Math[_0x569766(0x1b1)](0x1,parseInt(RegExp['$2'])),this[_0x569766(0x23c)]=this['_animationHorzCells']*this[_0x569766(0x276)],!![];}return![];},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x2d2)]=function(){const _0x418906=_0x1d0c3d;if(!this[_0x418906(0x186)]())return;this[_0x418906(0x180)]();},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x180)]=function(){const _0x13f562=_0x1d0c3d;this[_0x13f562(0x162)]+=0x1,this[_0x13f562(0x162)]>=this['animationWaitFrames']()&&(this[_0x13f562(0x162)]=0x0,this[_0x13f562(0x24f)]+=0x1,this['_animationIndex']>=this['_animationMaxCells']&&(this['isAnimationLooping']()?this[_0x13f562(0x24f)]=0x0:this[_0x13f562(0x24f)]=this[_0x13f562(0x23c)]-0x1),this[_0x13f562(0x26a)]());},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x26a)]=function(){const _0x29318c=_0x1d0c3d,_0x1b0067=this[_0x29318c(0x16e)][_0x29318c(0x2d5)],_0x1db27c=_0x1b0067[_0x29318c(0x275)]/this[_0x29318c(0x25f)],_0x1530a2=_0x1b0067[_0x29318c(0x1fb)]/this[_0x29318c(0x276)],_0x575f7d=this[_0x29318c(0x24f)]%this[_0x29318c(0x25f)]*_0x1db27c,_0x3f01be=Math[_0x29318c(0x2c8)](this['_animationIndex']/this['_animationHorzCells'])*_0x1530a2;this[_0x29318c(0x16e)][_0x29318c(0x236)](_0x575f7d,_0x3f01be,_0x1db27c,_0x1530a2);},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x222)]=function(){const _0x291dda=_0x1d0c3d;return this['settings']()[_0x291dda(0x1b7)]??VisuMZ[_0x291dda(0x1e9)]['Settings'][_0x291dda(0x255)];},Sprite_VisualCutin[_0x1d0c3d(0x21c)][_0x1d0c3d(0x29d)]=function(){const _0x5e57f4=_0x1d0c3d;return this[_0x5e57f4(0x2d7)]()['animatedPortraitWaitFrames']??VisuMZ[_0x5e57f4(0x1e9)][_0x5e57f4(0x280)][_0x5e57f4(0x2cf)];},Sprite_VisualCutin['prototype'][_0x1d0c3d(0x244)]=function(){const _0x448291=_0x1d0c3d,_0x527939=this[_0x448291(0x2d7)]()['portraitFilename'];if(_0x527939==='')this[_0x448291(0x16e)]['bitmap']=new Bitmap(0x1,0x1);else{const _0x478598=this[_0x448291(0x1e4)]();_0x478598['addLoadListener'](this['applyPortraitBitmap'][_0x448291(0x190)](this,_0x478598));}},Sprite_VisualCutin[_0x1d0c3d(0x21c)]['prepareNewParallax']=function(){const _0x1c8869=_0x1d0c3d,_0x889035=this[_0x1c8869(0x2d7)]()[_0x1c8869(0x18b)];if(_0x889035==='')this[_0x1c8869(0x1d6)][_0x1c8869(0x2d5)]=new Bitmap(0x1,0x1);else{const _0x5cc166=ImageManager['loadParallax'](_0x889035);_0x5cc166[_0x1c8869(0x2c9)](this[_0x1c8869(0x2eb)]['bind'](this,_0x5cc166));}};function _0xcc1f(){const _0x393527=['startVisualCutin','changeVisualCutinParallax','twelvepack11','changeVisualCutinPortrait','Settings','createBgColorSprite','portraitEnterY','VisuMZ_1_BattleCore','createOutlineSprite','#cccccc','create_VisualCutinEffect_Bitmap_Diamond','whole','16FrfABs','CutinStart_VisualCutinEffectJS','_fadeDuration','eightpack3','_moveWholeDuration','EnemyCutinFlipVert','_cached_VisualCutinEffect_Outline','battlerHue','righthorzspan','create_VisualCutinEffect_Bitmap_Whole','col2ndthird','clearAllVisualCutins','_parallaxColorFilter','CutinStart_VisualCutinEffect','portraitFlipVert','visualCutinPortraitIndex','portraitIndex','parallaxOffsetX','cached_VisualCutinEffect_Outline','flipVisualCutinHorz','setHue','animationWaitFrames','859565DSTiRk','lefthorzslash','createParallaxSprite','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','styles','portraitForcedScale','Game_Screen_initialize','row5thfifth','bottomrightcorner','col2ndfourth','_customVisualCutinPortraitFlipVert','createPortraitSprite','showcase','faceWidth','parallaxOpacity','VisualCutinEffect','anchor','_isAnimatedPicture','create_VisualCutinEffect_Bitmap_Rows','trim','row2ndthird','_moveEasingType','_waitMode','outlineOffsetY','_portraitTargetX','_visualCutinEffect','_type','some','EnemyCutinFlipHorz','JSON','eightpack6','maskFilename','_foregroundContainer','_backgroundContainer','toUpperCase','portraitOffsetX','lefthorzspan','portraitAnchorX','restore','col3rdfifth','VisuMZ_0_CoreEngine','outlineShow','floor','addLoadListener','createMaskContainers','isSideView','return\x200','name','EVAL','WaitFrames','Scene_Map_createSpriteset','portraitOffsetY','updateAnimatedPortrait','_loadingState','status','bitmap','#000000','settings','twelvepack7','getVisualCutinStyleData','bgColor','map','hasCustomVisualCutinPortrait','battlerName','_customModified','testMask','faceHeight','_movePortraitDuration','row2ndfifth','potraitOpacity','updateVisualCutinLayer','create_VisualCutinEffect_Bitmap_VertSlash','cutinExit','eightpack8','typeJS','_fadeRemove','VISUAL_CUTIN_EFFECT','applyParallaxBitmap','isAnyCutinExiting','lineWidth','topleftquad','col4thfifth','sixpack6','portraitType','enemy','below','leftdiamond','righthorzslash','move','col4thfourth','portraitFilenameJS','row4thfifth','row4thfourth','isAnyCutinEntering','getCustomVisualCutinPortraitFilename','rightdiamond','col3rdthird','initVisualCutinEffect','filters','toLowerCase','_animationCount','eightpack2','initialize','371275VmXyfZ','centerdiamond','getColor','lineTo','ApplyEasing','row3rdthird','bottom','row2ndfourth','toprightcorner','_portraitSprite','hasCustomCutinMaskAndOutline','row3rdfifth','toprightquad','twelvepack10','createVisualCutins','applyEasing','updatePortraitMovement','parallaxScrollY','constructor','blendMode','createExistingVisualCutinSprites','sixpack5','parallaxHue','log','setWaitMode','face','outlineFilename','updateAnimatedPictureCount','changeVisualCutinEffectPortrait','cutinOffsetY','10pNKvdQ','twelvepack3','SpriteMaskFilter','isAnimatedPortrait','checkAllBitmapsLoaded','parallaxBlendMode','indexOf','col3rdfourth','parallaxFilename','sixpack2','round','_movePortraitEasingType','filter','bind','OutlineThickness','row1stfifth','Styles','portraitScaleMax','cutinOffsetX','_scene','portraitHue','leftvertslash','create_VisualCutinEffect_Bitmap_Cols','opacity','parallaxOffsetY','topleftcorner','updateCutinMovement','parallaxX','parse','textColor','_moveDuration','twelvepack2','stringify','portraitEnterEasingType','create_VisualCutinEffect_Bitmap','portraitAnchorY','7714641FfKuQH','outerOutlineColor','col1stfourth','_foregroundMaskFilter','A\x20Visual\x20Cutin\x20Effect\x20for\x20this\x20type\x20already\x20exists.\x0a','_entering','bottomleftquad','children','getVisualCutinEffectSpriteOrder','changeVisualCutinEffectParallax','max','8YlQNRx','RegExp','create_VisualCutinEffect_Bitmap_HorzSpan','create_VisualCutinEffect_Bitmap_HorzSlash','calcWindowHeight','animatedPortraitLooping','sixpack1','format','fillStyle','animatedPortraitWaitFrames','destroy','loadAllBitmaps','scale','eightpack4','faceIndex','_exiting','enterEasingType','_maskSprite','FUNC','svActorVertCells','_moveTargetX','twelvepack12','exitEasingType','middleOutlineColor','innerOutlineWeight','addVisualCutinEffect','_statusWindow','_visualCutins','enterDuration','_backgroundMaskFilter','portraitScaleToFit','enterX','svEnemy','row1stthird','cutinEnter','Linear','_parallaxSprite','drawOutlinePolygon','applyPortraitBitmap','ExtraSettings','enterY','loadPicture','parallaxY','rightmajor','create_VisualCutinEffect_Bitmap_Minor','farright','hasSvBattler','isSceneBattle','battle','248595AaVCLv','loadPortraitBitmap','eightpack5','length','_bgSprite','visualCutinPortraitHue','AnimatedPictures','statusWindowHeight','create_VisualCutinEffect_Bitmap_Quad','prepareNewParallax','addChild','portraitFilename','leftgemstone','rgba(0,0,0,0)','order','col5thfifth','ARRAYNUM','updateWaitMode','_cached_VisualCutinEffect_Mask','Only\x20one\x20cutin\x20of\x20each\x20type\x20can\x20be\x20visible\x20at\x20a\x20time.','Space','eightpack1','_customVisualCutinPortraitFilename','innerOutlineColor','height','removeVisualCutinEffect','update','loadSvEnemy','beginPath','stroke','note','_movePortraitWholeDuration','push','NUM','visualCutinPortraitType','6921693pHukcs','CreateCutinSettings','getBattlePortraitFilename','loadEnemy','white','portraitEnterX','leftmajor','30CbLWCw','sixpack4','middleOutlineWeight','getVisualCutinEffectSettings','parallaxScrollX','top','ARRAYJSON','save','create_VisualCutinEffect_Bitmap_Pack','twelvepack4','CutinChange_PortraitSwap','STRUCT','_visualCutinContainer','outlineOffsetX','centergemstone','prototype','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','row1stfourth','exit','ARRAYEVAL','updateParallaxSprite','isAnimationLooping','135558pXGtcH','STR','rightminor','type','col1stfifth','initPosition','create','twelvepack8','_portraitTargetY','bottomleftcorner','visualCutinPortraitFilename','exitY','moveTo','match','createVisualCutinContainer','rightgemstone','CutinChange_ParallaxSwap','createSpriteset','getLastPluginCommandInterpreter','setFrame','loading','twelvepack6','min','24mjMKtt','CutinLayer','_animationMaxCells','row3rdfourth','create_VisualCutinEffect_Bitmap_Gemstone','twelvepack5','centerhorzspan','version','Outline','2976456mTSJJp','prepareNewPortrait','bottomrightquad','createAllSprites','col1stthird','startExit','portraitExitEasingType','call','outerOutlineWeight','leftminor','origin','exitX','_animationIndex','rightvertslash','Game_Interpreter_updateWaitMode','portraitFlipHorz','_customVisualCutinPortraitFlipHorz','ConvertParams','Loop','create_VisualCutinEffect_Bitmap_Corner','flipVisualCutinVert','_moveTargetY','twelvepack1','_outlineSprite','updateOpacity','portraitExitY','styleData','svActorHorzCells','_animationHorzCells','sixpack3','create_VisualCutinEffect_Bitmap_Showcase','cached_VisualCutinEffect_Mask','_loadingBitmaps','endVisualCutin','WaitForExit','twelvepack9','ceil','VisuMZ_3_SideviewBattleUI','fill_VisualCutinEffect_Bitmap','updateAnimatedPictureFrame','addChildAt','ARRAYSTR','startEntrance','registerCommand','applyPortraitFrame','>>>attention<<<','centerminor','ExtraDefaults','initMembers','col2ndfifth','width','_animationVertCells','svActor','portraitExitX','faceName','isPlaytest','eightpack7'];_0xcc1f=function(){return _0x393527;};return _0xcc1f();}