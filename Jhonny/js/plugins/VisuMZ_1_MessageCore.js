//=============================================================================
// VisuStella MZ - Message Core
// VisuMZ_1_MessageCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_MessageCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MessageCore = VisuMZ.MessageCore || {};
VisuMZ.MessageCore.version = 1.51;

//=============================================================================
/*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.51] [MessageCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Message_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Message Core plugin extends and builds upon the message functionality of
 * RPG Maker MZ and allows you, the game dev, to customize the workflow for
 * your game's message system.
 *
 * Features include all (but not limited to) the following:
 *
 * * Control over general message settings.
 * * Auto-Color key words and/or database entries.
 * * Increases the text codes available to perform newer functions/effects.
 * * Ability for you to implement custom Text Code actions.
 * * Ability for you to implement custom Text code string replacements.
 * * Invoke a macro system to speed up the dev process.
 * * Add a Text Speed option to the Options menu.
 * * Add the ever so useful Word Wrap to your message system.
 * * Extend the choice selection process to your liking.
 * * The ability to enable/disable as well as show/hide certain choices.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 1 ------
 *
 * This plugin is a Tier 1 plugin. Place it under other plugins of lower tier
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
 * Dim Background Extension
 *
 * Before, when using the Dim Background as a part of a Show Text event, its
 * size is only the same as the message window's width itself. This looked
 * really ugly because it had hard edges cutting off while gradients are seen
 * elsewhere. To make it look better, we extended the dimmed background to span
 * the width of the screen instead.
 *
 * ---
 *
 * Extended Messages
 *
 * If you decide to expand the size of the message window to allow for more
 * rows to be displayed, you can type in the data for them by chaining together
 * Show Message events. They will take data from each other and display them in
 * the same message window as long as there are enough rows.
 *
 * ---
 *
 * Extended Choice Lists
 *
 * Choice lists can be extended by just chaining one Choice List event after
 * the other in succession along the same indentation. They do not extend if
 * there is any event other than a Choice List option between them on the same
 * indentation level.
 *
 * ---
 *
 * ============================================================================
 * Text Language Information
 * ============================================================================
 *
 * As of Message Core version 1.46, Text Language has been added.
 *
 * The "Text Language" feature allows your players to switch between different
 * languages for your game to allow people from around the globe to enjoy what
 * story you have to tell.
 *
 * Disclaimers: This is not an automatic translation tool. Translations made
 * through the "Text Language" feature of the VisuStella MZ Message Core
 * will require manual input by the game developer.
 *
 * ---
 *
 * === How to Enable Switching ===
 *
 * Text Language is NOT enabled by default. Here's what you have to do:
 *
 * #1. Open up the Message Core's Plugin Parameters
 * #2. Plugin Parameters > Text Language Settings > Enable Switching?
 * #3. Change the "Enable Switching?" parameter setting to "true".
 * #4. Adjust any other settings as needed.
 * #5. Save the Plugin Parameter changes.
 * #6. Save your game.
 *
 * Now, it's time to get the CSV file that will contain all of the text used to
 * translate your game's script.
 *
 * #1. Play test your game. Make sure Play test mode is NOT disabled.
 * #2. A popup will appear asking to create a language CSV file.
 * #3. Click "OK" and let the plugin do its thing.
 * #4. The project's /data/ folder will appear with Language.csv made.
 * #5. The plugin will then ask you to restart your game.
 *
 * '''IMPORTANT!''' The separator used for the CSV file must be a semicolon (;)
 * and not a comma (,) as to reduce the amount of punctuation conflicts. Keep
 * this in mind as most CSV editors will default to comma (,) instead of the
 * semicolon (;) for their separator.
 *
 * ---
 *
 * === How to Edit the Language CSV ===
 *
 * The Language CSV is structured as a normal CSV file would be, which also
 * means it can be modified in programs like Microsoft Excel or Google Sheets.
 * We recommend using either of those programs to modify the text.
 *
 * We do not recommend modifying the CSV file in programs like notepad directly
 * due to the way certain things like commas (,) are handled and how easy it is
 * to be error-prone.
 *
 * The table will appear something like this at first:
 *
 *     Key        English    Chinese    Japanese     Korean
 *     Greeting   Hello      你好       こんにちは    안녕하세요
 *     Farewell   Good-bye   再见       さようなら    안녕히
 *     Wow        Wow        哇         ワオ          와우
 *
 * The "Key" column refers to the reference key used to determine which lines
 * will be inserted into the text. The columns with the languages will utilize
 * the respective phrases for that language.
 *
 * You can remove columns containing languages that you aren't planning to
 * translate for your game.
 *
 * ---
 *
 * === Things to Keep in Mind ===
 *
 * When adding text to the CSV file via the spreadsheet editor (Excel or Google
 * Sheets), there's a few things to keep in mind.
 *
 * ---
 *
 * ==== Line Breaks ====
 *
 * When you want to insert line breaks into the translated phrases, use the
 * <br> text code. This is best used for text that is to be transferred into
 * the message window or help window.
 *
 * ==== Text Codes ====
 *
 * Text codes like \C[2] can be inserted normally. However, they only work in
 * windows that support text codes, such as the message window or help window.
 * Otherwise, the text codes will not transfer over properly.
 *
 * ==== Semicolons ====
 *
 * Due to the nature of the CSV file, we used the semicolon (;) as the
 * separator. As such, semicolons should not be used in the text entries.
 * Though some sentences will work with the semicolon, not all of them will. If
 * you do want to use a semicolon, use the text code <semicolon> instead.
 *
 *   Example:
 *
 *   "The pancakes were delicious<semicolon> they were fluffy and sweet."
 *
 * Other variations of the semicolon text code are <semi> and <semi-colon>.
 * The <semicolon> text code and variants only work with the Language CSV and
 * are ignored otherwise when typed in a regular message box entry.
 *
 * ---
 *
 * ==== Macros and Language Switches ====
 *
 * For those using both text macros and text language switches, macros will be
 * converted to text before language switches as it allows for better text
 * transitions that way.
 *
 * ---
 *
 * === How to Use the Reference Keys ===
 *
 * Remember the "Key" column and the reference keys? Those are used to
 * determine which lines will be inserted into the text for the message window
 * and just about any other window. However, there's a specific way these keys
 * must be used in order for them to work.
 *
 * The "text code" format works like this. Use any of the following:
 *
 *   \tl{keyName}
 *   \translate{keyName}
 *   \loc{keyName}
 *   \locale{keyName}
 *   \localize{keyName}
 *
 * or for those coming from different translation plugins but want to switch
 * over to the VisuStella MZ Message Core's translation system:
 *
 *   ${keyName}
 *
 * For example, to use one of the default keys made with the Language CSV:
 *
 *   \tl{Greeting}
 *
 * This will yield "Hello" in English, "你好" in Chinese, "こんにちは" in
 * Japanese, and "안녕하세요" in Korean.
 *
 * Key names are not case sensitive and any trailing spaces will be removed
 * from them in order to make sure the CSV table is stable to reference any
 * translated text from.
 *
 * You can insert these language "text codes" into item names, skill names,
 * etc. as well as system entries like for Attack, Defense, etc.
 *
 * ---
 *
 * === Naming Weapon Types, Armor Types, Equip Types, Item Categories ===
 *
 * You might have noticed that if you've decided to use \tl{keyName} for weapon
 * or other database types, other parts of the game will error out. Don't
 * worry, for these, you don't have to change the currently used database name.
 * Go straight to the CSV and insert in a new key for that particular database
 * name. For example, the equip type "Accessory" will use "Accessory" as the
 * automatic key to look for a translated phrase. If there isn't any in the CSV
 * file, then the default database text entry will be used.
 *
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. Some of
 * these are original text codes provided by RPG Maker MZ, while others are
 * new text codes added through this plugin. You may even add your own text
 * codes through the plugin parameters.
 *
 * === RPG Maker MZ Text Codes ===
 *
 * The following are text codes that come with RPG Maker MZ. These text codes
 * cannot be edited through the Plugin Parameters.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * \V[x]                Replaced by the value of variable 'x'.
 * \N[x]                Replaced by the name of actor 'x'.
 * \P[x]                Replaced by the name of party member 'x'.
 * \C[x]                Draw the subsequent text with window skin color 'x'.
 * \I[x]                Draw icon 'x'.
 *
 * \PX[x]               Moves text x position to 'x'.
 * \PY[x]               Moves text y position to 'y'.
 *
 * \G                   Replaced by the currency unit.
 *
 * \{                   Increase the text font size by one step.
 * \}                   Decrease the text font size by one step.
 * \FS[x]               Changes the text font size to 'x'.
 *
 * \\                   Replaced by the backslash character.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \$                   Opens the gold window.
 * \.                   Waits a 1/4 second.
 * \|                   Waits a full second.
 * \!                   Waits for button input.
 * \>                   Display remaining text on same line all at once.
 * \<                   Cancel the effect that displays text all at once.
 * \^                   Do not wait for input after displaying text to move on.
 *
 * ---
 *
 * === Message Core Hard-Coded Text Codes ===
 *
 * The following text codes are hard-coded into VisuStella MZ Message Core's
 * code. These text codes cannot be edited through the Plugin Parameters.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * <b>                  Makes subsequent text bold.
 * </b>                 Removes bold from subsequent text.
 * <i>                  Makes subsequent text italic.
 * </i>                 Removes italic from subsequent text.
 *
 * <left>               Makes subsequent text left-aligned. *Note1*
 * </left>              Removes left-alignment for subsequent text.
 * <center>             Makes subsequent text center-aligned. *Note1*
 * </center>            Removes center-alignment for subsequent text.
 * <right>              Makes subsequent text right-aligned. *Note1*
 * </right>             Removes right-alignment for subsequent text.
 *
 * Note1: Use at line-start. Does not work with Word Wrap.
 *
 * <ColorLock>          Text codes can't change text color for subsequent text.
 * </ColorLock>         Removes Color Lock property.
 *
 * <WordWrap>           Enables Word Wrap for this window. *Note2*
 * </WordWrap>          Disables Word Wrap for this window. *Note2*
 * <br>                 Adds a line break. Requires Word Wrap enabled.
 * <line break>         Adds a line break. Requires Word Wrap enabled.
 *
 * Note2: Some windows cannot use Word Wrap such as the Choice Window.
 * Word Wrap also cannot be used together with <left>, <center>, or <right> and
 * will disable itself if text alignment text codes are detected.
 *
 * \picture<x>          Draws picture x (filename) at current text position.
 * \CenterPicture<x>    Draws picture x (filename) centered at the window.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * <Caps>               Makes all text after this capitalized.
 *                      Turns off other auto-text case modes.
 *                      ie: "hello world" becomes "HELLO WORLD"
 * </Caps>              Turns off auto text-casing effects.
 *
 * <Upper>              Makes the first letter of any word after a space to be
 *                      capitalized. Other letters are left alone.
 *                      Turns off other auto-text case modes.
 *                      ie. "old mcDonald" becomes "Old McDonald"
 * </Upper>             Turns off auto text-casing effects.
 *
 * <Lower>              Makes all text after this lowercase.
 *                      Turns off other auto-text case modes.
 *                      ie: "THE QUICK BROWN FOX" becomes "the quick brown fox"
 * </Lower>             Turns off auto text-casing effects.
 *
 * <Alt>                Makes all text after this alternate between uppercase
 *                      and lowercase. Turns off other auto-text case modes.
 *                      ie: "Hello" becomes "HeLlO"
 * </Alt>               Turns off auto text-casing effects.
 *
 * <Chaos>              Makes all text after this randomize between uppercase
 *                      and lowercase. Turns off other auto-text case modes.
 *                      ie: "Wassup" becomes "waSsUP" or "WasSuP"
 * </Chaos>             Turns off auto text-casing effects.
 *
 * **Clarity:** In case you're wondering, the text codes </Caps>, </Upper>,
 * </Lower>, </Alt>, and </Chaos> all do the same thing and can be used
 * interchangeably with each other. For example, you can do this:
 * <Caps>hello world</Lower> and it would still accomplish the same effect, but
 * you won't do that because you're not a monster of a developer.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \CommonEvent[x]      Runs common event x when text code is reached.
 * \Wait[x]             Makes the message wait x frames before continuing.
 *
 * <Next Page>          Ends the current message page at this line. This is
 *                      used for messages when rows are at 5 or above and the
 *                      message lines don't match the amount. This is used to
 *                      prevent grabbing message windows from following message
 *                      events. Any lines following <Next Page> in the same
 *                      message event will be ignored.
 *
 * <Auto>               Resizes message window dimensions to fit text. *Note3*
 * <Auto Width>         Resizes message window width to fit text. *Note3*
 * <Auto Height>        Resizes message window height to fit text. *Note3*
 *
 * <Auto Actor: x>      Resizes message window and positions it over actor x
 *                      sprite's head. *Note3*
 * <Auto Party: x>      Resizes message window and positions it over party
 *                      member x sprite's head. *Note3*
 * <Auto Player>        Map-Only. Resizes message window and positions it over
 *                      the player sprite's head. *Note3*
 * <Auto Event: x>      Map-Only. Resizes message window and positions it over
 *                      event x sprite's head. *Note3*
 * <Auto Enemy: x>      Battle-Only. Resizes message window and positions it
 *                      over enemy x sprite's head. *Note3*
 *
 * Note3: Upon using these text codes, the message window's settings will be
 * reset for the upcoming message. These effects do not work with Word Wrap.
 *
 * ---
 *
 * ----------------------------   ---------------------------------------------
 * Text Code                      Effect (Battle Only)
 * ----------------------------   ---------------------------------------------
 * <Current Battle Target>        Replaces text code with the current target of
 *                                an action in battle.
 * <Current Battle User>          Replaces text code with the currently active
 *                                user in battle.
 * <Current Battle Action>        Replaces text code with the current battle
 *                                action's name with an icon in front.
 * <Current Battle Action Name>   Replaces text code with the current battle
 *                                action's name without an icon.
 *
 * If there is no battle, no target, no user, or no action, then the text code
 * will just be replaced with no text.
 *
 * These text codes are NOT recommended to be used inside of Help Descriptions.
 * They are best used with "Show Text" event commands.
 *
 * ---
 *
 * -----------------------------  ---------------------------------------------
 * Text Code                      Effect (Choice Window Only)
 * -----------------------------  ---------------------------------------------
 * <Show>                         Choice is always shown.
 * <Show Switch: x>               Choice shown if switch x is ON.
 * <Show Switches: x,x,x>         Choice shown if the x switches are all ON.
 * <Show All Switches: x,x,x>     Choice shown if the x switches are all ON.
 * <Show Any Switches: x,x,x>     Choice shown if any of x switches are ON.
 *
 * <Hide>                         Choice is always hidden.
 * <Hide Switch: x>               Choice hidden if switch x is ON.
 * <Hide Switches: x,x,x>         Choice hidden if the x switches are all ON.
 * <Hide All Switches: x,x,x>     Choice hidden if the x switches are all ON.
 * <Hide Any Switches: x,x,x>     Choice hidden if any of x switches are ON.
 *
 * <Enable>                       Choice is always enabled.
 * <Enable Switch: x>             Choice enabled if switch x is ON.
 * <Enable Switches: x,x,x>       Choice enabled if the x switches are all ON.
 * <Enable All Switches: x,x,x>   Choice enabled if the x switches are all ON.
 * <Enable Any Switches: x,x,x>   Choice enabled if any of x switches are ON.
 *
 * <Disable>                      Choice is always disabled.
 * <Disable Switch: x>            Choice disabled if switch x is ON.
 * <Disable Switches: x,x,x>      Choice disabled if the x switches are all ON.
 * <Disable All Switches: x,x,x>  Choice disabled if the x switches are all ON.
 * <Disable Any Switches: x,x,x>  Choice disabled if any of x switches are ON.
 *
 * <Choice Width: x>              Sets the minimum text area width to x.
 *                                Applies to whole choice window.
 * <Choice Indent: x>             Sets the indent to x value. Applies to
 *                                current choice selection only.
 *
 * <BgColor: x>                   Requires VisuMZ_0_CoreEngine! Sets background
 *                                color of this choice to 'x' text color. This
 *                                will be combined with a fading
 * <BgColor: x,y>                 Requires VisuMZ_0_CoreEngine! Sets background
 *                                color of this choice to 'x' to 'y' gradient
 *                                text color.
 * <BgColor: #rrggbb>             Requires VisuMZ_0_CoreEngine! Sets background
 *                                color of this choice to '#rrggbb' color using
 *                                hex color values.
 * <BgColor: #rrggbb, #rrggbb>    Requires VisuMZ_0_CoreEngine! Sets background
 *                                color of this choice to '#rrggbb' gradient
 *                                using hex color values.
 *
 * <Help> text </Help>            Makes a help window appear and have it show
 *                                'text' in its contents. The help window will
 *                                disappear if no text is displayed.
 *
 * <Shuffle>                      Shuffles the order of all choices. Any cancel
 *                                shortcuts other than "Branch" will be undone.
 * <Shuffle: x>                   Shuffles the order of all choices and only
 *                                x number of them will appear. Any cancel
 *                                shortcuts other than "Branch" will be undone.
 *                                Hidden choices do not count towards x number.
 *
 * ---
 *
 * -----------------------------  ---------------------------------------------
 * Text Code                      Background Effects (Choice Window Only)
 * -----------------------------  ---------------------------------------------
 *
 * <BgImg: filename>              Creates a background image from img/pictures/
 *                                stretched across the choice rectangle.
 * <BgImg LowerLeft: filename>    Creates a background image from img/pictures/
 *                                scaled to the lower left of choice rect.
 * <BgImg LowerCenter: filename>  Creates a background image from img/pictures/
 *                                scaled to the lower center of choice rect.
 * <BgImg LowerRight: filename>   Creates a background image from img/pictures/
 *                                scaled to the lower right of choice rect.
 * <BgImg MidLeft: filename>      Creates a background image from img/pictures/
 *                                scaled to the middle left of choice rect.
 * <BgImg Center: filename>       Creates a background image from img/pictures/
 *                                scaled to the center of choice rect.
 * <BgImg MidRight: filename>     Creates a background image from img/pictures/
 *                                scaled to the middle right of choice rect.
 * <BgImg UpperLeft: filename>    Creates a background image from img/pictures/
 *                                scaled to the upper left of choice rect.
 * <BgImg UpperCenter: filename>  Creates a background image from img/pictures/
 *                                scaled to the upper center of choice rect.
 * <BgImg UpperRight: filename>   Creates a background image from img/pictures/
 *                                scaled to the upper right of choice rect.
 *
 * *Note:* For the <BgImg: filename> text code variants, even if the background
 * image is smaller than the choice contents, it will overscale to match its
 * choice rectangle dimensions.
 *
 * *Note:* Using a background image will clear the dimmed background rectangle
 * that is normally behind each selectable choice.
 *
 * *Note:* Each choice can only have one background image but can use a
 * combination of one background and one foreground image.
 *
 * *Note:* Images in the background will appear behind the select cursor.
 *
 * ---
 *
 * -----------------------------  ---------------------------------------------
 * Text Code                      Foreground Effects (Choice Window Only)
 * -----------------------------  ---------------------------------------------
 *
 * <FgImg: filename>              Creates a foreground image from img/pictures/
 *                                stretched across the choice rectangle.
 * <FgImg LowerLeft: filename>    Creates a foreground image from img/pictures/
 *                                scaled to the lower left of choice rect.
 * <FgImg LowerCenter: filename>  Creates a foreground image from img/pictures/
 *                                scaled to the lower center of choice rect.
 * <FgImg LowerRight: filename>   Creates a foreground image from img/pictures/
 *                                scaled to the lower right of choice rect.
 * <FgImg MidLeft: filename>      Creates a foreground image from img/pictures/
 *                                scaled to the middle left of choice rect.
 * <FgImg Center: filename>       Creates a foreground image from img/pictures/
 *                                scaled to the center of choice rect.
 * <FgImg MidRight: filename>     Creates a foreground image from img/pictures/
 *                                scaled to the middle right of choice rect.
 * <FgImg UpperLeft: filename>    Creates a foreground image from img/pictures/
 *                                scaled to the upper left of choice rect.
 * <FgImg UpperCenter: filename>  Creates a foreground image from img/pictures/
 *                                scaled to the upper center of choice rect.
 * <FgImg UpperRight: filename>   Creates a foreground image from img/pictures/
 *                                scaled to the upper right of choice rect.
 *
 * *Note:* For the <FgImg: filename> text code variants, unlike the background
 * variant, the foreground image will not overscale past its original size.
 * Instead, it will maintain its original size or be smaller, so long as it can
 * be scaled to exist within the choice rectangle unless it is intended to be
 * stretched by using the <FgImg: filename> variant.
 *
 * *Note:* Text is then written on top of the foreground image.
 *
 * *Note:* Each choice can only have one foreground image but can use a
 * combination of one background and one foreground image.
 *
 * *Note:* Images in the foreground will appear behind the select cursor.
 *
 * ---
 *
 * -----------------  ---------------------------------------------------------
 * Text Code          Effect (Name Window Only)
 * -----------------  ---------------------------------------------------------
 * <Left>             Positions the name box window to the left.
 * <Center>           Positions the name box window to the center.
 * <Right>            Positions the name box window to the right.
 * <Position: x>      Replace 'x' with a number from 0 to 10. This positions
 *                    the name box window on the screen relative to the
 *                    position of the value 'x' represents.
 * \NormalBG          Changes background type of window to normal type.
 * \DimBG             Changes background type of window to dim type.
 * \TransparentBG     Changes background type of window to transparent type.
 *
 * ---
 *
 * -------------------------------   ------------------------------------------
 * Text Code                         Effect (Message Window Only)
 * -------------------------------   ------------------------------------------
 *
 * <Position: x, y, width, height>   Forces the message window to exact listed
 *                                   coordinates and dimensions. Replace each
 *                                   of the arguments with numbers. *Note*
 *
 * <Coordinates: x, y>               Forces the message window to the exact
 *                                   listed coordinates. Replace each of the
 *                                   arguments with numbers. *Note*
 *
 * <Dimensions: width, height>       Forces the message window size to the
 *                                   exact listed dimensions. Replace each of
 *                                   the arguments with numbers. *Note*
 *
 * <Offset: +x, +y>                  Quickly adjust the message window offset
 * <Offset: -x, -y>                  values to the x and y amounts. The values
 * <Offset: +x, -y>                  will replace the previous offset settings
 * <Offset: -x, +y>                  if there were any.
 *
 * *NOTE* These text codes do not work with Word Wrap.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Requires VisuMZ_0_CoreEngine)
 * ------------------   -------------------------------------------------------
 * <Up Button>          Display's VisuMZ_0_CoreEngine's button assist text.
 * <Left Button>        Display's VisuMZ_0_CoreEngine's button assist text.
 * <Right Button>       Display's VisuMZ_0_CoreEngine's button assist text.
 * <Down Button>        Display's VisuMZ_0_CoreEngine's button assist text.
 *
 * <Ok Button>          Display's VisuMZ_0_CoreEngine's button assist text.
 * <Cancel Button>      Display's VisuMZ_0_CoreEngine's button assist text.
 * <Shift Button>       Display's VisuMZ_0_CoreEngine's button assist text.
 * <Menu Button>        Display's VisuMZ_0_CoreEngine's button assist text.
 * <Page Up Button>     Display's VisuMZ_0_CoreEngine's button assist text.
 * <Page Down Button>   Display's VisuMZ_0_CoreEngine's button assist text.
 *
 * ---
 *
 * === Random Text Pool ===
 *
 * <RNG> text1 | text2 | text3 </RNG>
 *
 * Using the above text code format in a Show Message entry, you can get a
 * random result out of the various inserted texts. Use "|" (without quotes) as
 * a separator between text entries. You can have unlimited entries. The result
 * will have any excess white space trimmed.
 *
 * This text code cannot be inserted into a macro and parsed properly.
 *
 * ---
 *
 * === Message Core Customizable Text Codes ===
 *
 * The following text codes can be altered through the Message Core's various
 * Plugin Parameters to adjust replacements and actions.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * \Class[x]            Draws class x's icon (if have) and name.
 * \ClassName[x]        Draws class x's name only.
 *
 * \Skill[x]            Draws skill x's icon (if have) and name.
 * \SkillName[x]        Draws skill x's name only.
 *
 * \Item[x]             Draws item x's icon (if have) and name.
 * \ItemName[x]         Draws item x's name only.
 * \ItemQuantity[x]     Inserts the number of item x's owned by the party.
 *
 * \Weapon[x]           Draws weapon x's icon (if have) and name.
 * \WeaponName[x]       Draws weapon x's name only.
 * \WeaponQuantity[x]   Inserts the number of weapon x's owned by the party.
 *
 * \Armor[x]            Draws armor x's icon (if have) and name.
 * \ArmorName[x]        Draws armor x's name only.
 * \ArmorQuantity[x]    Inserts the number of armor x's owned by the party.
 *
 * \LastGainObj         Draws the icon + name of the last party-gained object.
 * \LastGainObjName     Draws the name of the last party-gained object.
 * \LastGainObjQuantity Inserts the quantity of the last party-gained object.
 *
 * \State[x]            Draws state x's icon (if have) and name.
 * \StateName[x]        Draws state x's name only.
 *
 * \Enemy[x]            Draws enemy x's icon (if have) and name.
 * \EnemyName[x]        Draws enemy x's name only.
 *
 * \Troop[x]            Draws troop x's icon (if have) and name.
 * \TroopName[x]        Draws troop x's name only.
 *
 * \TroopMember[x]      Draws troop member x's icon (if have) and name. *Note1*
 * \TroopNameMember[x]  Draws troop member x's name only. *Note1*
 *
 * Note1: Only works in battle.
 *
 * \NormalBG            Changes background type of window to normal type.
 * \DimBG               Changes background type of window to dim type.
 * \TransparentBG       Changes background type of window to transparent type.
 *
 * \FontChange<x>       Changes font face to x font name.
 * \ResetFont           Resets font settings.
 *
 * \ResetColor          Resets color settings.
 * \HexColor<x>         Changes text color to x hex color (ie. #123abc).
 * \OutlineColor[x]     Changes outline color to text color x.
 * \OutlineHexColor<x>  Changes outline color to x hex color (ie. #123abc).
 * \OutlineWidth[x]     Changes outline width to x thickness.
 *
 * \WindowMoveTo<?>     Moves window to exact coordinates. *Note2*
 * \WindowMoveBy<?>     Moves window by relative values. *Note2*
 * \WindowReset         Resets window position to original position.
 *
 * Note2: Replace '?' with the following format:
 *   targetX, targetY, targetWidth, targetHeight, duration, easingType
 *   Only targetX and targetY are required arguments. These will only alter the
 *   window dimensions when the text has arrived at that point. They will not
 *   alter the window preemptively. This is not used as a window positioner.
 *   Use the <Position: x, y, width, height> text code for that.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \ActorFace[x]        Inserts actor x's face into the Message Window.
 * \PartyFace[x]        Inserts party member x's face into the Message Window.
 * \ChangeFace<x,y>     Changes message face to x filename, y index.
 * \FaceIndex[x]        Changes message face index to x.
 *
 * \TextDelay[x]        Sets delay in frames between characters to x frames.
 *
 * Note: These text codes only work with the Message Window. Keep in mind that
 *   even if some windows might look like the Message Window, it may not
 *   necessarily be one.
 *
 * ---
 *
 * As these text codes can be added, removed, and/or altered, their functions
 * may or may not be the same depending on how you've altered them. VisuStella
 * is not responsible for any errors caused by changes made to pre-made text
 * codes nor any new text codes they did not make.
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
 * === Message Plugin Commands ===
 *
 * ---
 *
 * Message: Properties
 *   Change the various properties of the Message Window.
 *
 *   Rows:
 *   - Change the number of Message Window rows.
 *   - Leave at 0 to keep it unchanged.
 *
 *   Width:
 *   - Change the Message Window width in pixels.
 *   - Leave at 0 to keep it unchanged.
 *
 *   Word Wrap:
 *   - Enable or disable Word Wrap for the Message Window?
 *
 * ---
 *
 * Message: X/Y Offsets
 * - Change the X and Y Offsets of the Message Window.
 * - The offset value(s) will be saved and stored.
 *
 *   Offset X:
 *   - Offset Message Window horizontally.
 *   - Negative: Left; Positive: Right
 *   - Message Window coordinates are still restricted via clamping.
 *
 *   Offset Y:
 *   - Offset Message Window vertically.
 *   - Negative: Up; Positive: Down
 *   - Message Window coordinates are still restricted via clamping.
 *
 * ---
 *
 * === Choice Plugin Commands ===
 *
 * ---
 *
 * Choices: Distance
 * - Change the distance from choice window to the message window.
 *
 *   Distance:
 *   - Change distance between the choice and message windows.
 *   - Default distance is 0.
 *   - Use negative to center align with remaining space.
 *
 * ---
 *
 * Choices: Properties
 * - Change the properties found in the Show Choices event command.
 *
 *   Line Height:
 *   - Change the line height for the show choices.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Minimum Choice Width:
 *   - What is the minimum width size for each choice?
 *   - 96 is the default width.
 *
 *   Max Rows:
 *   - Maximum number of choice rows to be displayed.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Max Columns:
 *   - Maximum number of choice columns to be displayed.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Text Alignment:
 *   - Text alignment for Show Choice window.
 *
 * ---
 *
 * === Select Plugin Commands ===
 *
 * ---
 *
 * Select: Weapon
 * - Opens the Event Select Item Window to let the player pick a weapon to
 *   choose from.
 * - Can be opened while the Message Window is open.
 *
 *   Variable ID:
 *   - This variable will be used to record the ID of the selected weapon.
 *   - It will result in 0 otherwise.
 *
 *   Weapon Type ID:
 *   - Reduce all the weapons to a specific weapon type.
 *   - Leave at 0 to not use filters.
 *
 * ---
 *
 * Select: Armor
 * - Opens the Event Select Item Window to let the player pick an armor to
 *   choose from.
 * - Can be opened while the Message Window is open.
 *
 *   Variable ID:
 *   - This variable will be used to record the ID of the selected armor.
 *   - It will result in 0 otherwise.
 *
 *   Armor Type ID:
 *   - Reduce all the armors to a specific armor type.
 *   - Leave at 0 to not use filters.
 *
 *   Equip Type ID:
 *   - Reduce all the armors to a specific equip type.
 *   - Leave at 0 to not use filters.
 *
 * ---
 *
 * Select: Skill
 * - Opens the Event Select Item Window to let the player pick a skill to
 *   choose from.
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - Can be opened while the Message Window is open.
 * - Skills will not be listed if they are hidden by the actor.
 * - Skills will not be listed if the actor lacks access to their Skill Type.
 *
 *   Variable ID:
 *   - This variable will be used to record the ID of the selected skill.
 *   - It will result in 0 otherwise.
 *
 *   Actor ID:
 *   - Select an actor to get the skill list from.
 *   - Use 0 to select from the party leader.
 *
 *   Skill Type ID:
 *   - Reduce all the skills to a specific skill type.
 *   - Leave at 0 to not use filters.
 *
 * ---
 *
 * === Picture Plugin Commands ===
 *
 * ---
 *
 * Picture: Change Text
 * - Change text for target picture(s) to show.
 * - You may use text codes.
 * - Text will adapt to picture's properties.
 * - Settings will be erased if picture is erased.
 *
 *   Picture ID(s):
 *   - The ID(s) of the picture(s) to set text to.
 *
 *   Padding:
 *   - How much padding from the sides should there be?
 *
 *   Text:
 *
 *     Upper Left:
 *     Upper Center:
 *     Upper Right:
 *     Middle Left:
 *     Middle Center:
 *     Middle Right:
 *     Lower Left:
 *     Lower Center:
 *     Lower Right:
 *     - The text that's aligned to this picture's side.
 *     - You may use text codes.
 *
 * ---
 *
 * Picture: Erase Text
 * - Erase all text for target picture(s).
 *
 *   Picture ID(s):
 *   - The ID(s) of the picture(s) to erase text for.
 *
 * ---
 *
 * Picture: Refresh Text
 * - Refreshes the text used for all on-screen pictures.
 * - To be used if any dynamic text codes are updated like \n[x].
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * General settings involving the message system. These settings range from
 * adjust how the Message Window looks to more intricate settings like how
 * some of the default text codes work.
 *
 * ---
 *
 * Message Window
 *
 *   Default Rows:
 *   - Default number of rows to display for the Message Window.
 *
 *   Default Width:
 *   - Default Message Window width in pixels.
 *
 *   Fast Forward Key:
 *   - This is the key used for fast forwarding messages.
 *   - WARNING: If this key is the same as the dash button, this will clear out
 *     any held down inputs upon triggering an event  to prevent players from
 *     skipping potentially useful information stored in messages. If you do
 *     not want the input to be cleared, use a different key.
 *
 *   Text Delay:
 *   - How many frames to wait between characters drawn?
 *   - Use 0 for instant.
 *
 *   Offset X:
 *   Offset Y:
 *   - Offset Message Window horizontally or vertically.
 *   - Horizontal: Left; Positive: Right
 *   - Veritcal: Negative: Up; Positive: Down
 *
 *   Stretch Dimmed BG:
 *   - Stretch dimmed window background to fit the whole screen.
 *
 *   Default Outline Width:
 *   - Changes the default outline width to this many pixels thick.
 *
 *   Each Message Start:
 *   Each Message End:
 *   - This is text that is added at the start/end of each message.
 *   - You may use text codes.
 *   - Keep in mind that if a message extends to a different page (due to word
 *     wrap, excess lines, etc), that does not mean the starting text will
 *     be added to where the next page begins or the ending text will be added
 *     where the previous page ends.
 *   - Can be used for things like adding "<center>" to the start of each
 *     message without having to type it every time.
 *
 * ---
 *
 * Name Box Window
 *
 *   Default Color:
 *   - Default color for the Name Box Window's text.
 *
 *   Offset X:
 *   - How much to offset the name box window X by
 *     (as long as it doesn't go offscreen).
 *
 *   Offset Y:
 *   - How much to offset the name box window Y by
 *     (as long as it doesn't go offscreen).
 *
 * ---
 *
 * Choice List Window
 *
 *   Line Height:
 *   - What is the default line height for Show Choices?
 *
 *   Minimum Choice Width:
 *   - What is the minimum choice width for each choice?
 *   - 96 is the default width.
 *
 *   Max Rows:
 *   - Maximum number of rows to visibly display?
 *
 *   Max Columns:
 *   - Maximum number of columns to visibly display?
 *
 *   Text Alignment:
 *   - Default alignment for Show Choice window.
 *
 * ---
 *
 * Default Text Codes
 *
 *   Relative \PX \PY:
 *   - Make \PX[x] and \PY[x] adjust relative starting position than
 *     exact coordinates.
 *
 *   \{ Maximum:
 *   - Determine the maximum size that \{ can reach.
 *
 *   \} Minimum:
 *   - Determine the minimum size that \} can reach.
 *
 *   \{ Change \}
 *   - How much does \{ and \} change font size by?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Auto-Color Settings
 * ============================================================================
 *
 * For certain windows such as the Message Window, Help Window, and Choice
 * Window, Auto-Color is enabled to automatically highlight and color certain
 * database entries, keywords, and just about anything you, the game dev, wants
 * to be automatically colored. This is done to avoid typing out \C[6]Jack\C[0]
 * every time Jack's name is written out as it will be automatically colored in
 * those specific windows.
 *
 * The Plugin Parameters will give you full reign over which database entries
 * and keywords you want to be automatically colored as long as they follow a
 * few rules:
 *
 * -----------------
 * Auto-Color Rules:
 * -----------------
 *
 * 1. Database names and keywords are case sensitive.
 *    This means if "Potion" is a marked keyword, typing out "potion" will not
 *    prompt the auto-color to highlight "potion". You must add the lowercase
 *    version of the word into the keyword list if you want it to count.
 *
 * 2. Database names and keywords are exact size (for Roman languages)
 *    This means if "Potion" is a marked keyword, typing out "potions" will not
 *    prompt the auto-color to highlight "potions". You must type out all of
 *    the variations of the words you want affected into the keyword list to
 *    prompt the auto-color highlight.
 *
 *    This does not apply to Japanese, Korean, or Chinese languages.
 *
 * 3. Possessive cases and other language symbols aren't counted.
 *    Symbols such as periods, commas, quotes, parentheses, and similar symbols
 *    do no count towards Rule 2. This means if "Potion" is a marked keyword,
 *    the typing out "(Potion)" will still highlight the "Potion" part of the
 *    word according to the auto-color.
 *
 * 4. Names with special characters like !, ?, [, ], etc. will be ignored.
 *    These cause conflicts with how auto-colors are detected.
 *
 * ---
 *
 * Database Highlighting
 *
 *   Actors:
 *   Classes:
 *   Skills:
 *   Items:
 *   Weapons:
 *   Armors:
 *   Enemies:
 *   States:
 *   - Any usage of a the selected database entry's name is auto-colored with
 *     the text code number.
 *   - Use 0 to not auto-color.
 *
 * ---
 *
 * Word Highlighting
 *
 *   \C[x]: Color
 *   - These are lists of all the words that will be automatically colored with
 *     the x text color.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Custom Font Manager
 * ============================================================================
 *
 * Custom fonts that aren't the message or number fonts cannot be used without
 * registration. If you try to use custom fonts in RPG Maker MZ without
 * registering their font family first, you will find out that they will not
 * work. These plugin parameters allow you to register your game's custom fonts
 * here.
 *
 * ---
 *
 * Settings:
 *
 *   Font Family:
 *   - This will be what's used by RPG Maker MZ and plugins to reference this
 *     specific font.
 *   - NO filename extensions!
 *
 *   Filename:
 *   - What is the filename of the custom font you would like to use?
 *   - Located inside the project's "fonts" folder.
 *
 * ---
 *
 * Examples:
 *
 *   Font Family: WildWords
 *   Filename: WildWords-Regular.ttf
 *
 * How you would use this in other plugins as a preface to the font face or
 * font family would be to use "WildWords" as the font face/family name. Then
 * RPG Maker MZ will use its own innate FontManager to refer that to the
 * "WildWords-Regular.ttf" file found in the game's "fonts" folder.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Code Actions
 * ============================================================================
 *
 * Text codes are used for one of two things: performing actions or replacing
 * themselves with text data. This Plugin Parameter will focus on the aspect of
 * performing actions. These actions can be done through each JavaScript or by
 * a common event (if it is used in the Message Window). Adequate knowledge of
 * both is recommended before attempting to modify and/or add new Text Code
 * Actions to the Plugin Parameters.
 *
 * Each of the Text Code Actions are formatted in such a way:
 *
 * ---
 *
 * Text Code Action
 *
 *   Match:
 *   - This is what needs to be matched in order for this text code to work.
 *   - This is the primary text marker after the \ in a text code.
 *   - In \N[x], this would be the 'N'.
 *
 *   Type:
 *   - The type of parameter to obtain (none, number, or string).
 *   - This is the way the text code determines the condition type.
 *   - In \N[x], this would be the '[x]'.
 *
 *   Common Event:
 *   - Select a common event to run when this text code is used in a message.
 *
 *   JS: Action:
 *   - JavaScript code used to perform an action when this text code appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Code Replacements
 * ============================================================================
 *
 * Text codes are used for one of two things: performing actions or replacing
 * themselves with text data. This Plugin Parameter will focus on the aspect of
 * replacing the text codes with text data. Text data can be replaced with
 * an exact exchange of text or dynamically through JavaScript. Adding a new
 * Text Code Replacement is done through the Plugin Parameters.
 *
 * Each of the Text Code Replacements are formatted in such a way:
 *
 * ---
 *
 * Text Code Replacement
 *
 *   Match:
 *   - This is what needs to be matched in order for this text code to work.
 *   - This is the primary text marker after the \ in a text code.
 *   - In \N[x], this would be the 'N'.
 *
 *   Type:
 *   - The type of parameter to obtain (none, number, or string).
 *   - This is the way the text code determines the condition type.
 *   - In \N[x], this would be the '[x]'.
 *
 *   STR: Text:
 *   - The text that will appear if this match appears.
 *     If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine the text that will appear if this
 *     match appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Macros
 * ============================================================================
 *
 * Text macros are used in similar fashion to text codes replacements to
 * replace themselves with text data. The primary difference is that macros are
 * made in a different format with no conditional argument modifiers (ie the
 * [x] that follows a text code).
 *
 * To use a text macro, type in the matching keyword between two [brackets] and
 * it will be replaced by the string data or run the JavaScript code found in
 * the Plugin Parameter settings.
 *
 * For example, if you have the text macro "Leader", made to return the party
 * leader's name, you can type in [Leader] in the Message Window and it will be
 * replaced with the party leader's name. The output can also output text codes
 * into the resulting text.
 *
 * This does NOT work with \MacroName as it did with Yanfly Engine Plugins.
 * Use the method stated before with the brackets to [MacroName] instead.
 *
 * Each of the Text Macros are formatted in such a way:
 *
 * ---
 *
 * Text Macro
 *
 *   Match:
 *   - This is what needs to be matched in order for this macro to work.
 *   - In [Leader], this would be the 'Leader' text.
 *
 *   STR: Text:
 *   - The replacement text that will appear from the macro.
 *   - If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine the text that will appear if this
 *     macro appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Language Settings
 * ============================================================================
 *
 * The "Text Language" feature allows your players to switch between different
 * languages for your game to allow people from around the globe to enjoy what
 * story you have to tell.
 *
 * Disclaimers: This is not an automatic translation tool. Translations made
 * through the "Text Language" feature of the VisuStella MZ Message Core
 * will require manual input by the game developer.
 *
 * See the "Text Language Information" for more information.
 *
 * ---
 *
 * Main Settings:
 *
 *   Enable Switching?:
 *   - Enable language switching settings for this plugin?
 *
 *   CSV Filename:
 *   - What is the filename of the CSV file to read from?
 *   - Located within the project's /data/ folder.
 *
 * ---
 *
 * Options:
 *
 *   Add Option?:
 *   - Add the 'Text Language' option to the Options menu?
 *
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 *
 *   Option Name:
 *   - Command name of the option.
 *
 * ---
 *
 * Languages:
 *
 *   Default Language:
 *   - What is the default language used for this game?
 *
 *   Supported Languages:
 *   - What are all the supported languages supported by this game's
 *     script?
 *   - Remove any that aren't translated.
 *
 * ---
 *
 * Language Names:
 *
 *   Bengali:
 *   Chinese (Simplified):
 *   Chinese (Traditional):
 *   Czech:
 *   Danish:
 *   Dutch:
 *   English:
 *   Finnish:
 *   French:
 *   German:
 *   Greek:
 *   Hindi:
 *   Hungarian:
 *   Indonesian:
 *   Italian:
 *   Japanese:
 *   Korean:
 *   Norwegian:
 *   Polish:
 *   Portuguese:
 *   Romanian:
 *   Russian:
 *   Slovak:
 *   Spanish:
 *   Swedish:
 *   Tamil:
 *   Thai:
 *   Turkish:
 *   - How does this language appear in the in-game options?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Language Fonts
 * ============================================================================
 *
 * Different default fonts used for different languages. This allows different
 * stylistic choices to be made for different languages in case the current
 * font you're using doesn't have support for other language types.
 *
 * Keep in mind that players can override this with Options Core if they select
 * a text option other than 'Default' for the 'Text Font' option.
 *
 * Make sure any new custom fonts used for different languages are registered
 * with the 'Custom Font Manager' found in this plugin's Plugin Parameters.
 *
 * ---
 *
 * Languages:
 *
 *   Bengali:
 *   Chinese (Simplified):
 *   Chinese (Traditional):
 *   Czech:
 *   Danish:
 *   Dutch:
 *   English:
 *   Finnish:
 *   French:
 *   German:
 *   Greek:
 *   Hindi:
 *   Hungarian:
 *   Indonesian:
 *   Italian:
 *   Japanese:
 *   Korean:
 *   Norwegian:
 *   Polish:
 *   Portuguese:
 *   Romanian:
 *   Russian:
 *   Slovak:
 *   Spanish:
 *   Swedish:
 *   Tamil:
 *   Thai:
 *   Turkish:
 *   - What font face is used for this language?
 *   - Make sure it is registered under Custom Font Manager.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Language Images
 * ============================================================================
 *
 * Allows different images to be used when different languages are used. This
 * is for images that have text on it that you want to appear in different
 * languages based on the text language selected by the player.
 *
 * There are two ways this works:
 *
 *   #1: Folder Name
 *   - The name of the folder containing those images will be named something
 *     like "Scrolls[XX]"
 *   - When a different language is picked, like English, it can reference
 *     the 'Scrolls[EN]' folder instead. If Japanese is used, it can refer to
 *     the 'Scrolls[JP]' folder as well.
 *   - The text used to replace the [XX] in the folder name can be determined
 *     in the Plugin Parameters.
 *     - Make sure you change the settings for each language you wish to use to
 *       have translated images for.
 *
 *   #2: Filename
 *   - The filename of the image to be translated can be named something like
 *     ReidProfile[XX].png
 *   - When a different language is picked, like English, it will reference the
 *     'ReidProfile[EN].png' image instead. For Japanese, it will reference the
 *     'ReidProfile[JP].png' as well.
 *   - The text used to replace the [XX] in the filename can be determined in
 *     the Plugin Parameters.
 *     - Make sure you change the settings for each language you wish to use to
 *       have translated images for.
 *
 * ---
 *
 * Settings
 *
 *   Convert Default?
 *   - ON: Default language uses converted marker.
 *   - OFF: Default languages uses [XX] as marker.
 *
 * Here's an explanation of what this does:
 *
 *   - The default language picked is English and the player has English picked
 *     as their desired language.
 *   - If the "Convert Default?" Plugin Parameter is ON, then 'ReidProfile[XX]'
 *     will reference and look for the 'ReidProfile[EN]' image.
 *   - If the "Convert Default?" Plugin Parameter is OFF, 'ReidProfile[XX]' is
 *     then used for the English language instead of 'ReidProfile[EN]'.
 *     - This is to avoid duplicate images and save on file space.
 *   - The reasoning behind the [XX] is that there needs to be an anchor image
 *     used for the RPG Maker MZ client in order to have something to reference
 *     before branching out to different languages.
 *
 * ---
 *
 * Languages
 *
 *   Bengali:
 *   Chinese (Simplified):
 *   Chinese (Traditional):
 *   Czech:
 *   Danish:
 *   Dutch:
 *   English:
 *   Finnish:
 *   French:
 *   German:
 *   Greek:
 *   Hindi:
 *   Hungarian:
 *   Indonesian:
 *   Italian:
 *   Japanese:
 *   Korean:
 *   Norwegian:
 *   Polish:
 *   Portuguese:
 *   Romanian:
 *   Russian:
 *   Slovak:
 *   Spanish:
 *   Swedish:
 *   Tamil:
 *   Thai:
 *   Turkish:
 *   - This text will replace [XX] with in image folder names and filenames
 *     when this language is selected.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Speed Option Settings
 * ============================================================================
 *
 * Modern RPG's on the market have the option to adjust the message speed rate
 * for players. These Plugin Parameters allow you to add that option to the
 * Options Menu as well.
 *
 * ---
 *
 * Text Speed Option Settings
 *
 *   Add Option?:
 *   - Add the 'Text Speed' option to the Options menu?
 *
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 *
 *   Option Name:
 *   - Command name of the option.
 *
 *   Default Value:
 *   - 1 - 10, slowest to fastest.
 *   - 11 is instant value.
 *
 *   Instant Speed:
 *   - Text to show "instant" text.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Word Wrap Settings
 * ============================================================================
 *
 * Word wrap is a property that will cause any overflowing text to wrap around
 * and move into the next line. This property can only be enabled inside text
 * that accept text codes, such as the Message Window and Help Window. However,
 * word wrap is disabled for the Choice Window due to the nature of the Choice
 * Window's base properties.
 *
 * Word wrap can be enabled or disabled in three ways. One is by using the text
 * code <WordWrap> to enable it or </WordWrap> to disable it. The second method
 * is by enabling it with the Plugin Command: 'Message: Properties'. The third
 * method is by enabling it by default with the Plugin Parameters.
 *
 * Word wrap only supports left-to-right alphabetical languages that utilize
 * spaces.
 *
 * Word Wrap also cannot be used together with <left>, <center>, or <right> and
 * will disable itself if text alignment text codes are detected.
 *
 * As of the v1.44 update, some Asian languages such as Chinese and Japanese
 * are now supported for word wrap. Korean language is only supported if spaces
 * are used.
 *
 * ---
 *
 * Enable Word Wrap
 *
 *   Message Window:
 *   - Automatically enable Word Wrap for this window?
 *
 *   Help Window:
 *   - Automatically enable Word Wrap for this window?
 *
 * ---
 *
 * Rules
 *
 *   Link Break -> Space:
 *   - Convert manually placed (non tagged) line breaks with spaces?
 *   - Line breaks must be inserted using the <br> text code.
 *
 *   Tight Wrap:
 *   - If a face graphic is present in a message, word wrap will be tighter.
 *
 *   End Padding:
 *   - Add extra padding to your window to make text wrap further away from the
 *     end of the window.
 *   - This will default to 0.
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
 * Version 1.51: October 17, 2024
 * * Bug Fixes!
 * ** Fixed a bug where \LastGainObj text code did not work with text language
 *    key codes. Fix made by Irina.
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added note to Text Language Information > How to Enable Switching
 * *** IMPORTANT! The separator used for the CSV file must be a semicolon (;)
 *     and not a comma (,) as to reduce the amount of punctuation conflicts.
 *     Keep this in mind as most CSV editors will default to comma (,) instead
 *     of the semicolon (;) for their separator.
 * ** Added note to Text Language Information > Naming Weapon Types, etc:
 * *** You might have noticed that if you've decided to use \tl{keyName} for
 *     weapon or other database types, other parts of the game will error out.
 *     Don't worry, for these, you don't have to change the currently used
 *     database name. Go straight to the CSV and insert in a new key for that
 *     particular database name. For example, the equip type "Accessory" will
 *     use "Accessory" as the automatic key to look for a translated phrase. If
 *     there isn't any in the CSV file, then the default database text entry
 *     will be used.
 * * New Features!
 * ** New Plugin Parameters added by Irina:
 * *** Parameters > Text Language Settings > Language Fonts
 * **** Different default fonts used for different languages. This allows
 *      different stylistic choices to be made for different languages in case
 *      the current font you're using doesn't have support for other language
 *      types.
 * **** Keep in mind that players can override this with Options Core if they
 *      select a text option other than 'Default' for the 'Text Font' option.
 * **** Make sure any new custom fonts used for different languages are
 *      registered with the 'Custom Font Manager' found in this plugin's Plugin
 *      Parameters.
 * *** Parameters > Text Language Settings > Language Images
 * **** Allows different images to be used when different languages are used.
 *      This is for images that have text on it that you want to appear in
 *      different languages based on the text language selected by the player.
 *
 * Version 1.50: July 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New text codes added by Irina:
 * *** <Caps> </Caps>
 * *** <Upper> </Upper>
 * *** <Lower> </Lower>
 * **** Auto-text case textcodes will automatically adjust text inserted
 *      between them to respectively be completely capitalized, first-letter
 *      capitalized, or completely lowercase.
 * **** More information in the help file.
 * *** <Alt> </Alt>
 * **** Alternates between uppercase and lowercase for letters.
 * *** <Chaos> </Chaos>
 * **** Randomly uses uppercase and lowercase for letters.
 *
 *
 * Version 1.49: May 16, 2024
 * * Bug Fixes!
 * ** Fixed a problem where using text codes to get database object names did
 *    not apply translated text.
 * * Documentation Update!
 * ** Added note for Message Window Only text code effects:
 * *** These text codes only work with the Message Window. Keep in mind that
 *     even if some windows might look like the Message Window, it may not
 *     necessarily be one.
 * * Feature Update!
 * ** Added a failsafe for when Choice List Window doesn't have any viable
 *    options (due to being hidden or disabled). Update made by Irina.
 * ** Added a failsafe for Language CSV when empty rows are added.
 * ** Updated some default Text Code actions in order to make sure they're only
 *    used by the Message Window and not anything else. Update made by Irina.
 *
 * Version 1.48: April 18, 2024
 * * Bug Fixes!
 * ** Added fail safe for help description checks parsing from objects without
 *    help descriptions normally. Fix made by Irina.
 *
 * Version 1.47: February 15, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina:
 * *** Plugin Parameters > Custom Font Manager
 * **** Register custom fonts here.
 * **** Custom fonts that aren't the message or number fonts cannot be used
 *      without registration.
 * **** See help file for more information.
 *
 * Version 1.46: January 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where script calls used to create message choices would not
 *    work properly. Fix made by Irina.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** Text Language Switching added by Irina:
 * *** Plugin Parameters > Text Language Settings
 * **** The "Text Language" feature allows your players to switch between
 *      different languages for your game to allow people from around the globe
 *      to enjoy what story you have to tell.
 * **** Disclaimers: This is not an automatic translation tool. Translations
 *      made through the "Text Language" feature of the VisuStella MZ Message
 *      Core will require manual input by the game developer.
 * **** Read more about it in detail within the "Text Language Information"
 *      section in the help file.
 * ** New Plugin Parameter added by Irina:
 * *** Choices: Distance
 * **** Change the distance from choice window to the message window.
 * ** New parameter added to Plugin Command "Choices: Properties" by Irina:
 * *** Minimum Choice Width
 * **** What is the minimum width size for each choice?
 * ** New Plugin Parameter for "Message Window" added by Irina:
 * *** Parameters > Message Window: Choice List Window> Minimum Choice Width
 * **** What is the minimum width size for each choice?
 * ** New Text Codes for Choice Window added by Irina:
 * *** <BgImg: filename> and variants
 * *** <FgImg: filename> and variants
 * **** These text codes allow adding a background or foreground image to a
 *      choice rectangle in stretched/scaled size.
 *
 * Version 1.45: December 14, 2023
 * * Bug Fixes!
 * ** Punctuation was, for some reason, excluded when using Wordwrap with
 *    Japanese and Chinese languages. This should be fixed now. Fixed by Irina.
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added clarity to the <left>, <center>, and <right> being unable to be
 *    used together with word wrap.
 * *** Word Wrap also cannot be used together with <left>, <center>, or <right>
 *     and will disable itself if text alignment text codes are detected.
 * * Feature Update!
 * ** Wordwrap <br> now works properly with Japanese and Chinese languages.
 * * New Features!
 * ** New Plugin Parameters added by Irina:
 * *** Plugin Parameters > General Settings > Each Message Start
 * *** Plugin Parameters > General Settings > Each Message End
 * **** This is text that is added at the start/end of each message.
 * **** Keep in mind that if a message extends to a different page (due to word
 *      wrap, excess lines, etc), that does not mean the starting text will
 *      be added to where the next page begins or the ending text will be added
 *      where the previous page ends.
 * **** Can be used for things like adding "<center>" to the start of each
 *      message without having to type it every time.
 *
 * Version 1.44: October 12, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Updated "Plugin Parameters: Word Wrap Settings" section:
 * *** As of the v1.44 update, some Asian languages such as Chinese and
 *     Japanese are now supported for word wrap. Korean language is only
 *     supported if spaces are used.
 * * Feature Update!
 * ** Word Wrap is now supported for Japanese and Chinese languages.
 * ** Feature updated by Irina and sponsored by AndyL.
 * * New Features!
 * ** New text codes added by Irina for "Show Choices" event command.
 * *** <Shuffle>
 * **** Shuffles the order of all choices. Any cancel shortcuts other than
 *      "Branch" will be undone.
 * *** <Shuffle: x>
 * **** Shuffles the order of all choices and only x number of them appear. Any
 *      cancel shortcuts other than "Branch" will be undone. Hidden choices do
 *      not count towards x number.
 *
 * Version 1.43: April 13, 2023
 * * Compatibility Update!
 * ** Fixed incompatibilities with auto message positioning with the Map Zoom
 *    plugin. Update made by Irina.
 *
 * Version 1.42: March 16, 2023
 * * Bug Fixes!
 * ** Fixed some text codes that would capture way too much data than intended.
 *    Fix made by Irina.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New text code added by Irina for Show Choice Window only:
 * *** <Help> text </Help>
 * **** Makes a help window appear and have it show 'text' in its contents.
 * **** The help window will disappear if no text is displayed.
 * ** New Plugin Commands added by Arisu:
 * *** Select: Weapon
 * *** Select: Armor
 * *** Select: Skill
 * **** Opens the Event Select Item Window to let the player pick a weapon,
 *      armor, or skill to choose from. The selected object will have its ID
 *      recorded in a variable. These can be opened while the Message Window is
 *      opened just like the event "Select Item".
 *
 * Version 1.41: December 15, 2022
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New text codes added by Irina!
 * *** For the Choice Window Only text codes:
 * **** <BgColor: x>
 * **** <BgColor: x, y>
 * **** <BgColor: #rrggbb>
 * **** <BgColor: #rrggbb, #rrggbb>
 * ***** Requires VisuMZ_0_CoreEngine! Sets the background color of this choice
 *       to 'x' text color, 'x' to 'y' gradient text color, or using '#rrggbb'
 *       hex color values.
 *
 * Version 1.40: November 3, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New text code added by Irina:
 * *** <RNG> text1 | text2 | text3 </RNG>
 * **** Using the above text code format in a Show Message entry, you can get a
 *      random result out of the various inserted texts. Use "|" (without
 *      quotes) as a separator between text entries. You can have unlimited
 *      entries. The result will have any excess white space trimmed.
 * **** This text code cannot be inserted into a macro and parsed properly.
 *
 * Version 1.39: September 22, 2022
 * * Bug Fixes!
 * ** Macros now support quotes (' and ") in the STR: Text. Fix made by Irina.
 *
 * Version 1.38: July 21, 2022
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.37: June 9, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Picture texts with \v[x] text codes are now updated automatically.
 * ** This is the only dynamic text code that updates this way for optimization
 *    purposes and to prevent overabundant CPU usage.
 * ** Everything else will require the new Plugin Command.
 * * New Features!
 * ** New Plugin Command added by Irina:
 * *** Picture: Refresh Text
 * **** Refreshes the text used for all on-screen pictures.
 * **** To be used if any dynamic text codes are updated like \n[x].
 * * New Features!
 * ** New text codes added by Arisu and sponsored by
 *    ImGonnaPutMyGameOnXboxAndYouCantStopMe:
 * *** <Up Button>, <Left Button>, <Right Button>, <Down Button>
 * *** <Ok Button>, <Cancel Button>, <Shift Button>, <Menu Button>
 * *** <Page Up Button>, <Page Down Button>
 * **** Display's VisuMZ_0_CoreEngine's button assist text.
 *
 * Version 1.36: April 7, 2022
 * * Feature Update!
 * ** Auto size related text codes should now automatically disable word wrap
 *    effects as they should have before. Update made by Irina.
 *
 * Version 1.35: March 31, 2022
 * * Bug Fixes!
 * ** Bug fixed where if autosizing is used and it goes from a message that is
 *    shorter to longer, an extra key press is needed. This should no longer be
 *    the case. Fix made by Irina.
 *
 * Version 1.34: February 24, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Choice Window Text Codes made by Irina and sponsored by AndyL:
 * *** <Choice Width: x>
 * **** Sets the minimum text area width to x. Applies to whole choice window.
 * *** <Choice Indent: x>
 * **** Sets the indent to x value. Applies to current choice selection only.
 *
 * Version 1.33: February 10, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Irina:
 * *** Picture: Change Text
 * **** This new plugin command allows you to place text on top of pictures
 *      (usually in the form of empty pages or cards) to function as stationary
 *      or other uses. Text codes are allowed.
 * **** Text codes are supported.
 * *** Picture: Erase Text
 * **** Removes text from target picture(s).
 *
 * Version 1.32: January 20, 2022
 * * Bug Fixes!
 * ** Extra Show Choice notetags will now be properly hidden. Fix by Irina.
 * * Compatibility Update!
 * ** Self Switches are now made compatible with work with Show Choices. Update
 *    made by Irina.
 *
 * Version 1.31: December 9, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New hard-coded message-only text code added by Irina:
 * *** <Next Page>
 * **** Ends the current message page at this line. This is used for messages
 *      when rows are at 5 or above and the message lines don't match the
 *      amount. This is used to prevent grabbing message windows from following
 *      message events. Any lines following <Next Page> in the same message
 *      event will be ignored.
 *
 * Version 1.30: November 11, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Help file updated for removed "Center Window X" bit.
 * * Feature Update!
 * ** Message: Properties now has "Center Window X?" removed
 * *** Changes will now be automatically centered.
 * *** This change is made for the new Plugin Command added for offsets which
 *     more or less replaces them.
 * * New Features!
 * ** New Plugin Command added by Irina and sponsored by Puddor:
 * *** Message: X/Y Offsets
 * **** Change the X and Y Offsets of the Message Window.
 * **** The offset value(s) will be saved and stored.
 * ** New Plugin Parameters added by Irina and sponsored by Puddor:
 * *** Plugin Parameters > General Settings > Message Window > Offset X
 * *** Plugin Parameters > General Settings > Message Window > Offset Y
 * **** Allows you to offset the horizontal and/or vertical positions of the
 *      message window accordingly.
 * ** New Text Codes added by Irina and sponsored by Puddor:
 * *** <Offset: +x, +y>
 * *** <Offset: -x, -y>
 * *** <Offset: +x, -y>
 * *** <Offset: -x, +y>
 * **** Quickly adjust the message window offset values to the x and y amounts.
 *      The values will replace the previous offset settings if there were any.
 *
 * Version 1.29: October 21, 2021
 * * Feature Update
 * ** Word Wrap flags are now properly adjusted when converting macros and
 *    adding bypasses towards regular messages. Update by Irina.
 *
 * Version 1.28: October 14, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 *
 * Version 1.27: October 7, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.26: September 3, 2021
 * * Bug Fixes!
 * ** Macros should now work properly with any \x<n> based text codes.
 *    Fix made by Irina.
 *
 * Version 1.25: August 27, 2021
 * * Feature Update!
 * ** Macros should now work with the <WordWrap> text code. Update by Irina.
 *
 * Version 1.24: August 20, 2021
 * * Feature Update!
 * ** Macros should now work with window placement and resize options.
 *    Update made by Irina.
 * ** Macros should now work with choice-related enable and visibility options.
 *    Update made by Irina.
 *
 * Version 1.23: July 16, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Word Wrap Settings > End Padding
 * **** Add extra padding to your window to make text wrap further away from
 *      the end of the window. This will default to 0.
 *
 * Version 1.22: July 2, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Text Codes added by Irina and sponsored by AndyL:
 * *** <Current Battle Target>
 * *** <Current Battle User>
 * **** Replaces the text code with the current target or current user's name
 *      in-battle. Otherwise, returns nothing.
 * **** Not recommended to be used inside of Help Descriptions. They are best
 *      used with "Show Text" event commands.
 * *** <Current Battle Action>
 * *** <Current Battle Action Name>
 * **** Replaces the text code with the current battle action's name with the
 *      icon or without it respectively. Otherwise, returns nothing.
 * **** Not recommended to be used inside of Help Descriptions. They are best
 *      used with "Show Text" event commands.
 *
 * Version 1.21: June 4, 2021
 * * Documentation Update!
 * ** Added extra note to the new <Position: x, y, width, height> text codes
 *    that they do not work with Word Wrap.
 * * Feature Update!
 * ** Added fail safe for preventing Common Events that don't exist from being
 *    ran at all by the Message Window. Added by Arisu.
 *
 * Version 1.20: May 28, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added additional clarity for \WindowMoveTo<?> and \WindowMoveBy<?> and
 *    \WindowReset text codes with "Note 2".
 * *** Replace '?' with the following format: targetX, targetY, targetWidth,
 *     targetHeight, duration, easingType. Only targetX and targetY are
 *     required arguments. These will only alter the window dimensions when the
 *     text has arrived at that point. They will not alter the window
 *     preemptively. This is not used as a window positioner. Use the
 *     <Position: x, y, width, height> text code for that.
 * * New Features!
 * ** New hard-coded text codes added for Message Window Only. Added by Irina.
 * *** <Position: x, y, width, height>
 * *** <Coordinates: x, y>
 * *** <Dimensions: width, height>
 *
 * Version 1.19: May 14, 2021
 * * Feature Updates!
 * ** <br> line breaks can now be used by Show Choices. Make sure that there is
 *    enough room to contain the text through Plugin Commands. Update by Irina.
 *
 * Version 1.18: April 30, 2021
 * * Bug Fixes!
 * ** Moving windows with 0 duration via text code should now instantly move
 *    the windows to the desired location with no delay. Fix made by Olivia.
 *
 * Version 1.17: April 9, 2021
 * * Feature Update!
 * ** <Auto> text codes for message windows will round up calculations for the
 *    message width to the nearest even number for better calculations.
 *
 * Version 1.16: April 2, 2021
 * * Bug Fixes!
 * ** \CommonEvent[x] text code will no longer run upon message window size
 *    calculation. Fix made by Arisu.
 * * Documentation Update!
 * ** Added further clarification for "Text Macros" section.
 * *** This does NOT work with \MacroName as it did with Yanfly Engine Plugins.
 *     Use the method stated before with the brackets to [MacroName] instead.
 *
 * Version 1.15: March 5, 2021
 * * Bug Fixes!
 * ** Hidden choices by switches will no longer count towards the maximum line
 *    count for Show Choice options. Fix made by Irina.
 *
 * Version 1.14: February 12, 2021
 * * Bug Fixes!
 * ** Auto positioned messages in battle will no longer cover the battler in
 *    question. Fix made by Irina.
 *
 * Version 1.13: February 5, 2021
 * * Bug Fixes!
 * ** Choice List Window with a dimmed background should now have a more
 *    consistent sized dim sprite. Fix made by Irina.
 *
 * Version 1.12: January 22, 2021
 * * Feature Update!
 * ** Name Box Window Default Color is now disabled by default to 0 because
 *    users do not understand why their names are showing up yellow and did not
 *    bother reading the documentation. If users want this feature turned on,
 *    they will have to do it manually from now on. Update made by Irina.
 *
 * Version 1.11: January 15, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.10: January 8, 2021
 * * Bug Fixes!
 * ** <Auto Actor: x> and <Auto Party: x> text codes should now work properly.
 *    Fix made by Irina.
 * * Feature Update!
 * ** Auto Color Plugin Parameters now have their default settings set to 0.
 *    This is due to an influx of "bug reports" from users who do not
 *    understand how this feature works, and the VisuStella team has decided it
 *    is better for the feature to default to an inactive state until users
 *    decide to search and utilize it themselves. Update made by Irina.
 *
 * Version 1.09: January 1, 2021
 * * Feature Update!
 * ** Auto-color no longer applies to database names that are only numbers.
 *    Auto-color entries that are only numbers will also be ignored. This is to
 *    prevent breaking the text code parsing. Update made by Yanfly.
 *
 * Version 1.08: November 15, 2020
 * * Documentation Update!
 * ** Some text codes left for the Name Box Window have been accidentally left
 *    out. These text codes allow for the positioning of the Name Box Window.
 *    Also, added to this section are the \NormalBG, \DimBG, and \TransparentBG
 *    text codes since people have been asking for how to change the name box
 *    window's background, but have skimmed over those text codes in different
 *    sections of the help file.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 *
 * Version 1.07: November 8, 2020
 * * Bug Fixes!
 * ** When using auto size functions, the message pause symbol will no longer
 *    appear semi-transparent the whole time. Fix made by Irina.
 *
 * Version 1.06: October 25, 2020
 * * Documentation Update!
 * ** Added a warning message to the Fast Forward Key plugin parameter:
 * *** WARNING: If this key is the same as the dash button, this will clear out
 *     any held down inputs upon triggering an event  to prevent players from
 *     skipping potentially useful information stored in messages. If you do
 *     not want the input to be cleared, use a different key.
 * ** Updated help file for new features.
 * * Feature Update!
 * ** The default Fast Forward Key setting has now been changed from "Shift" to
 *    "Page Down". Change made by Yanfly
 * * New Feature!
 * ** New Plugin Parameter added by Irina.
 * *** Plugin Parameters > General > Default Outline Width
 * **** Changes the default outline width to this many pixels thick.
 *
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Setting an actor's autocolor will now disable it from \N[x] and \P[x]
 *    text codes. Fix made by Irina.
 *
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** Auto Position text codes not place positions properly if the screen width
 *    and height differ from the box width and box height. Fix made by Irina.
 *
 * Version 1.04: September 13, 2020
 * * Bug Fixes!
 * ** Word wrap no longer affects specific battle messages. Fix made by Irina.
 * ** Word wrap now updates properly after using the 'Message: Properties'
 *    Plugin Command. Fix made by Arisu.
 *
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Autoplacement of the name box window now takes its offset Y setting into
 *    account before sending it to the bottom of the message window. Fix made
 *    by Yanfly.
 * ** Added automatic feature setting to turn off word wrap when using the
 *    auto-size and auto-position text codes. This is because the auto-size and
 *    auto-position effects don't work properly with Word Wrap based on how
 *    they both clash when adjusting the window settings. Fix made by Irina.
 * ** New message pages after auto-sizing no longer put out empty messages.
 *    Fix made by Irina and Shiro.
 * * Documentation Update!
 * ** Extended the note for auto-size and auto-position text codes to include
 *    that they do not work with Word Wrap. Added by Irina.
 *
 * Version 1.02: August 30, 2020
 * * New Features!
 * ** Added new hard-coded text codes for auto-sizing and auto-positioning:
 * *** <Auto>, <Auto Width>, <Auto Height>
 * *** <Auto Actor: x>, <Auto Party: x>, <Auto Enemy: x>
 * *** <Auto Player>, <Auto Actor: x>, <Auto Party: x>, <Auto Event: x>
 * **** New features added by Irina.
 *
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** </Wordwrap> now works.
 * ** \ActorFace[x] text code now fixed.
 * *** Users updating from version 1.00 will need to fix this problem by either
 *     removing the plugin from the Plugin Manager list and reinstalling it, or
 *     going to Plugin Parameters > Text Code Replacements > ActorFace >
 *     JS: Text > and changing "$gameActors.actor(1)" to
 *     "$gameActors.actor(actorId)"
 * ** Actors with empty names would cause auto hightlight problems. Fixed!
 * ** Auto-colors now ignore names with special characters like !, ?, [, ], and
 *    so on.
 * ** Line break spacing fixed.
 * * New Features!
 * ** Wordwrap now works with <left>, <center> and <right> alignment tags.
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
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MessageWindowProperties
 * @text Message: Properties
 * @desc Change the various properties of the Message Window.
 *
 * @arg Rows:num
 * @text Rows
 * @type number
 * @min 0
 * @desc Change the number of Message Window rows.
 * Leave at 0 to keep it unchanged.
 * @default 4
 *
 * @arg Width:num
 * @text Width
 * @type number
 * @min 0
 * @desc Change the Message Window width in pixels.
 * Leave at 0 to keep it unchanged.
 * @default 816
 *
 * @arg WordWrap:str
 * @text Word Wrap
 * @type select
 * @option No Change
 * @value No Change
 * @option Enable
 * @value true
 * @option Disable
 * @value false
 * @desc Enable or disable Word Wrap for the Message Window?
 * @default No Change
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MessageWindowXyOffsets
 * @text Message: X/Y Offsets
 * @desc Change the X and Y Offsets of the Message Window.
 * The offset value(s) will be saved and stored.
 *
 * @arg OffsetX:eval
 * @text Offset X
 * @desc Offset Message Window horizontally.
 * Negative: Left; Positive: Right
 * @default +0
 *
 * @arg OffsetY:eval
 * @text Offset Y
 * @desc Offset Message Window vertically.
 * Negative: Up; Positive: Down
 * @default +0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Choice
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ChoiceWindowDistance
 * @text Choices: Distance
 * @desc Change the distance from choice window to the message window.
 *
 * @arg Distance:eval
 * @text Distance
 * @desc Change distance between the choice and message windows.
 * Default distance is 0. Use negative to center align.
 * @default +0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ChoiceWindowProperties
 * @text Choices: Properties
 * @desc Change the properties found in the Show Choices event command.
 *
 * @arg LineHeight:num
 * @text Choice Line Height
 * @type number
 * @min 0
 * @desc Change the line height for the show choices.
 * Leave at 0 to keep this unchanged.
 * @default 36
 *
 * @arg MinWidth:num
 * @text Minimum Choice Width
 * @type number
 * @min 0
 * @desc What is the minimum width size for each choice?
 * 96 is the default width.
 * @default 96
 *
 * @arg MaxRows:num
 * @text Max Rows
 * @type number
 * @min 0
 * @desc Maximum number of choice rows to be displayed.
 * Leave at 0 to keep this unchanged.
 * @default 8
 *
 * @arg MaxCols:num
 * @text Max Columns
 * @type number
 * @min 0
 * @desc Maximum number of choice columns to be displayed.
 * Leave at 0 to keep this unchanged.
 * @default 1
 *
 * @arg TextAlign:str
 * @text Text Alignment
 * @type select
 * @option Default
 * @value default
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @desc Text alignment for Show Choice window.
 * @default rmmz-mainfont
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Select
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SelectWeapon
 * @text Select: Weapon
 * @desc Opens the Event Select Item Window to let the player
 * pick a weapon to choose from.
 *
 * @arg VariableID:num
 * @text Variable ID
 * @type number
 * @min 0
 * @desc This variable will be used to record the ID of the
 * selected weapon. It will result in 0 otherwise.
 * @default 1
 *
 * @arg WeaponTypeID:num
 * @text Weapon Type ID
 * @type number
 * @min 0
 * @max 100
 * @desc Reduce all the weapons to a specific weapon type.
 * Leave at 0 to not use filters.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SelectArmor
 * @text Select: Armor
 * @desc Opens the Event Select Item Window to let the player
 * pick an armor to choose from.
 *
 * @arg VariableID:num
 * @text Variable ID
 * @type number
 * @min 0
 * @desc This variable will be used to record the ID of the
 * selected armor. It will result in 0 otherwise.
 * @default 1
 *
 * @arg ArmorTypeID:num
 * @text Armor Type ID
 * @type number
 * @min 0
 * @max 100
 * @desc Reduce all the armors to a specific armor type.
 * Leave at 0 to not use filters.
 * @default 0
 *
 * @arg EquipTypeID:num
 * @text Equip Type ID
 * @type number
 * @min 0
 * @max 100
 * @desc Reduce all the armors to a specific equip type.
 * Leave at 0 to not use filters.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SelectSkill
 * @text Select: Skill
 * @desc Opens the Event Select Item Window to let the player
 * pick a skill to choose from. Requires VisuMZ_1_SkillsStatesCore!
 *
 * @arg VariableID:num
 * @text Variable ID
 * @type number
 * @min 0
 * @desc This variable will be used to record the ID of the
 * selected skill. It will result in 0 otherwise.
 * @default 1
 *
 * @arg ActorID:num
 * @text Actor ID
 * @type actor
 * @desc Select an actor to get the skill list from.
 * Use 0 to select from the party leader.
 * @default 0
 *
 * @arg SkillTypeID:num
 * @text Skill Type ID
 * @type number
 * @min 0
 * @max 100
 * @desc Reduce all the skills to a specific skill type.
 * Leave at 0 to not use filters.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Picture
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureTextChange
 * @text Picture: Change Text
 * @desc Change text for target picture(s) to show.
 * You may use text codes.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc The ID(s) of the picture(s) to set text to.
 * @default ["1"]
 *
 * @arg Padding:eval
 * @text Padding
 * @parent PictureIDs:arraynum
 * @desc How much padding from the sides should there be?
 * @default $gameSystem.windowPadding()
 *
 * @arg Text
 *
 * @arg upperleft:json
 * @text Upper Left
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg up:json
 * @text Upper Center
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg upperright:json
 * @text Upper Right
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg left:json
 * @text Middle Left
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg center:json
 * @text Middle Center
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg right:json
 * @text Middle Right
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg lowerleft:json
 * @text Lower Left
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg down:json
 * @text Lower Center
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @arg lowerright:json
 * @text Lower Right
 * @parent Text
 * @type note
 * @desc The text that's aligned to this picture's side.
 * You may use text codes.
 * @default ""
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureTextErase
 * @text Picture: Erase Text
 * @desc Erase all text for target picture(s).
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc The ID(s) of the picture(s) to erase text for.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureTextRefresh
 * @text Picture: Refresh Text
 * @desc Refreshes the text used for all on-screen pictures.
 * To be used if any dynamic text codes are updated like \n[x].
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
 * @param MessageCore
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
 * @desc General settings involving the message system.
 * @default {"MessageWindow":"","MessageRows:num":"4","MessageWidth:num":"816","FastForwardKey:str":"pagedown","MessageTextDelay:num":"1","StretchDimmedBg:eval":"true","DefaultOutlineWidth:num":"3","NameBoxWindow":"","NameBoxWindowDefaultColor:num":"0","NameBoxWindowOffsetX:num":"0","NameBoxWindowOffsetY:num":"0","ChoiceListWindow":"","ChoiceWindowLineHeight:num":"36","ChoiceWindowMaxRows:num":"8","ChoiceWindowMaxCols:num":"1","ChoiceWindowTextAlign:str":"default","DefaultTextCodes":"","RelativePXPY:eval":"true","FontBiggerCap:eval":"108","FontSmallerCap:eval":"12","FontChangeValue:eval":"12"}
 *
 * @param AutoColor:struct
 * @text Auto-Color Settings
 * @type struct<AutoColor>
 * @desc Automatically color certain keywords a specific way.
 * @default {"DatabaseHighlighting":"","Actors:str":"0","Classes:str":"0","Skills:str":"0","Items:str":"0","Weapons:str":"0","Armors:str":"0","Enemies:str":"0","States:str":"0","WordHighlighting":"","TextColor1:arraystr":"[]","TextColor2:arraystr":"[]","TextColor3:arraystr":"[]","TextColor4:arraystr":"[]","TextColor5:arraystr":"[]","TextColor6:arraystr":"[]","TextColor7:arraystr":"[]","TextColor8:arraystr":"[]","TextColor9:arraystr":"[]","TextColor10:arraystr":"[]","TextColor11:arraystr":"[]","TextColor12:arraystr":"[]","TextColor13:arraystr":"[]","TextColor14:arraystr":"[]","TextColor15:arraystr":"[]","TextColor16:arraystr":"[]","TextColor17:arraystr":"[]","TextColor18:arraystr":"[]","TextColor19:arraystr":"[]","TextColor20:arraystr":"[]","TextColor21:arraystr":"[]","TextColor22:arraystr":"[]","TextColor23:arraystr":"[]","TextColor24:arraystr":"[]","TextColor25:arraystr":"[]","TextColor26:arraystr":"[]","TextColor27:arraystr":"[]","TextColor28:arraystr":"[]","TextColor29:arraystr":"[]","TextColor30:arraystr":"[]","TextColor31:arraystr":"[]"}
 *
 * @param CustomFonts:arraystruct
 * @text Custom Font Manager
 * @type struct<CustomFont>[]
 * @desc Register custom fonts here. Custom fonts that aren't the
 * message or number fonts cannot be used without this.
 * @default []
 *
 * @param TextCodeActions:arraystruct
 * @text Text Code Actions
 * @type struct<TextCodeAction>[]
 * @desc Text codes that perform actions.
 * @default ["{\"Match:str\":\"ChangeFace\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (this instanceof Window_Message) {\\\\n    if (textState.drawing) {\\\\n        const filename = data[0].trim();\\\\n        const index = parseInt(data[1] || '0');\\\\n        $gameMessage.setFaceImage(filename, index);\\\\n        this.loadMessageFace();\\\\n        const rtl = $gameMessage.isRTL();\\\\n        const width = ImageManager.faceWidth;\\\\n        const height = this.innerHeight;\\\\n        const x = rtl ? this.innerWidth - width - 4 : 4;\\\\n        this.contents.clearRect(x, 0, width, height);\\\\n        this._faceBitmap.addLoadListener(this.drawMessageFace.bind(this));\\\\n    }\\\\n}\\\"\"}","{\"Match:str\":\"FaceIndex\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst index = this.obtainEscapeParam(textState);\\\\nif (this instanceof Window_Message) {\\\\n    if (textState.drawing) {\\\\n        const filename = $gameMessage.faceName();\\\\n        $gameMessage.setFaceImage(filename, index);\\\\n        this.loadMessageFace();\\\\n        const rtl = $gameMessage.isRTL();\\\\n        const width = ImageManager.faceWidth;\\\\n        const height = this.innerHeight;\\\\n        const x = rtl ? this.innerWidth - width - 4 : 4;\\\\n        this.contents.clearRect(x, 0, width, height);\\\\n        this._faceBitmap.addLoadListener(this.drawMessageFace.bind(this));\\\\n    }\\\\n}\\\"\"}","{\"Match:str\":\"TextDelay\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst delay = this.obtainEscapeParam(textState);\\\\nif (this instanceof Window_Message) {\\\\n    if (textState.drawing && this.constructor === Window_Message) {\\\\n        this.setTextDelay(delay);\\\\n    }\\\\n}\\\"\"}","{\"Match:str\":\"NormalBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(0);\\\\n}\\\"\"}","{\"Match:str\":\"DimBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(1);\\\\n}\\\"\"}","{\"Match:str\":\"TransparentBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(2);\\\\n}\\\"\"}","{\"Match:str\":\"FontChange\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst fontName = this.obtainEscapeString(textState);\\\\nthis.contents.fontFace = fontName;\\\"\"}","{\"Match:str\":\"ResetFont\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"this.resetFontSettings();\\\"\"}","{\"Match:str\":\"ResetColor\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"this.resetTextColor();\\\"\"}","{\"Match:str\":\"HexColor\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst hexColor = this.obtainEscapeString(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeTextColor(hexColor);\\\\n}\\\"\"}","{\"Match:str\":\"OutlineColor\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst colorIndex = this.obtainEscapeParam(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeOutlineColor(ColorManager.textColor(colorIndex));\\\\n}\\\"\"}","{\"Match:str\":\"OutlineHexColor\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst hexColor = this.obtainEscapeString(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeOutlineColor(hexColor);\\\\n}\\\"\"}","{\"Match:str\":\"OutlineWidth\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst width = this.obtainEscapeParam(textState);\\\\nif (textState.drawing) {\\\\n    this.contents.outlineWidth = width;\\\\n}\\\"\"}","{\"Match:str\":\"WindowMoveTo\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (textState.drawing) {\\\\n    const x = !!data[0] ? Number(data[0].trim()) : this.x;\\\\n    const y = !!data[1] ? Number(data[1].trim()) : this.y;\\\\n    const width = !!data[2] ? Number(data[2].trim()) : this.width;\\\\n    const height = !!data[3] ? Number(data[3].trim()) : this.height;\\\\n    const duration = !!data[4] ? Number(data[4].trim()) : 20;\\\\n    const easingType = !!data[5] ? data[5].trim() : 0;\\\\n    this.moveTo(x, y, width, height, duration, easingType);\\\\n}\\\"\"}","{\"Match:str\":\"WindowMoveBy\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (textState.drawing) {\\\\n    const x = !!data[0] ? Number(data[0].trim()) : 0;\\\\n    const y = !!data[1] ? Number(data[1].trim()) : 0;\\\\n    const width = !!data[2] ? Number(data[2].trim()) : 0;\\\\n    const height = !!data[3] ? Number(data[3].trim()) : 0;\\\\n    const duration = !!data[4] ? Number(data[4].trim()) : 20;\\\\n    const easingType = !!data[5] ? data[5].trim() : 0;\\\\n    this.moveBy(x, y, width, height, duration, easingType);\\\\n}\\\"\"}","{\"Match:str\":\"WindowReset\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    const frames = 20;\\\\n    const easingType = 0;\\\\n    this.resetRect(frames, easingType);\\\\n}\\\"\"}","{\"Match:str\":\"heart\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"3\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst index = this.obtainEscapeParam(textState);\\\"\"}"]
 *
 * @param TextCodeReplace:arraystruct
 * @text Text Code Replacements
 * @type struct<TextCodeReplace>[]
 * @desc Text codes that replace themselves with text.
 * @default ["{\"Match:str\":\"ActorFace\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const actorId = parseInt(arguments[1]);\\\\nconst actor = $gameActors.actor(actorId);\\\\nif (this.constructor === Window_Message && actor) {\\\\n    $gameMessage.setFaceImage(\\\\n        actor.faceName(),\\\\n        actor.faceIndex()\\\\n    );\\\\n}\\\\nreturn '';\\\"\"}","{\"Match:str\":\"PartyFace\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const index = parseInt(arguments[1]) - 1;\\\\nconst actor = $gameParty.members()[index];\\\\nif (this.constructor === Window_Message && actor) {\\\\n    $gameMessage.setFaceImage(\\\\n        actor.faceName(),\\\\n        actor.faceIndex()\\\\n    );\\\\n}\\\\nreturn '';\\\"\"}","{\"Match:str\":\"Class\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataClasses;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ClassIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataClasses;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"ClassName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataClasses;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Skill\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataSkills;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"SkillIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataSkills;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"SkillName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataSkills;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Item\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ItemIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"ItemName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ItemQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"Weapon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"WeaponIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"WeaponName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"WeaponQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"Armor\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ArmorIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"ArmorName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ArmorQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"State\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataStates;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"StateIcon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataStates;\\\\nconst id = parseInt(arguments[1]);\\\\nconst obj = database[id];\\\\nconst icon = obj ? (obj.iconIndex || 0) : 0;\\\\nreturn icon ? '\\\\\\\\x1bI[%1]'.format(icon) : '';\\\"\"}","{\"Match:str\":\"StateName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataStates;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"LastGainObj\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const icon = true;\\\\nreturn this.lastGainedObjectName(icon);\\\"\"}","{\"Match:str\":\"LastGainObjIcon\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"return this.lastGainedObjectIcon();\\\"\"}","{\"Match:str\":\"LastGainObjName\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const icon = false;\\\\nreturn this.lastGainedObjectName(icon);\\\"\"}","{\"Match:str\":\"LastGainObjQuantity\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"return this.lastGainedObjectQuantity();\\\"\"}","{\"Match:str\":\"Enemy\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataEnemies;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"EnemyName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataEnemies;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Troop\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataTroops;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataTroops;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopMember\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"if (!$gameParty.inBattle()) return \\\\\\\"\\\\\\\";\\\\nconst index = (parseInt(arguments[1]) - 1) || 0;\\\\nconst member = $gameTroop.members()[index];\\\\nconst database = $dataEnemies;\\\\nconst id = member ? member.enemyId() : 0;\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopMemberName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"if (!$gameParty.inBattle()) return \\\\\\\"\\\\\\\";\\\\nconst index = (parseInt(arguments[1]) - 1) || 0;\\\\nconst member = $gameTroop.members()[index];\\\\nconst database = $dataEnemies;\\\\nconst id = member ? member.enemyId() : 0;\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}"]
 *
 * @param TextMacros:arraystruct
 * @text Text Code Macros
 * @type struct<TextMacro>[]
 * @desc Macros that are used to quickly write batches of text.
 * Format style: [MacroName]
 * @default ["{\"Match:str\":\"Example Macro\",\"TextStr:str\":\"This is the text that will be displayed when you type [Example Macro].\",\"TextJS:func\":\"\\\"return 'Text';\\\"\"}","{\"Match:str\":\"Leader\",\"TextStr:str\":\"\\\\P[1]\",\"TextJS:func\":\"\\\"return 'Text';\\\"\"}"]
 *
 * @param Localization:struct
 * @text Text Language Settings
 * @type struct<Localization>
 * @desc Text Language settings for this plugin.
 * @default {"Main":"","Enable:eval":"false","CsvFilename:str":"Languages.csv","Options":"","AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Text Language","Localized":"","DefaultLocale:str":"English","Languages:arraystr":"[\"Bengali\",\"Chinese(Simplified)\",\"Chinese(Traditional)\",\"Czech\",\"Danish\",\"Dutch\",\"English\",\"Finnish\",\"French\",\"German\",\"Greek\",\"Hindi\",\"Hungarian\",\"Indonesian\",\"Italian\",\"Japanese\",\"Korean\",\"Norwegian\",\"Polish\",\"Portuguese\",\"Romanian\",\"Russian\",\"Slovak\",\"Spanish\",\"Swedish\",\"Tamil\",\"Thai\",\"Turkish\"]","LangNames":"","Bengali:str":"বাংলা","Chinese(Simplified):str":"简体中文","Chinese(Traditional):str":"繁體中文","Czech:str":"Čeština","Danish:str":"Dansk","Dutch:str":"Nederlands","English:str":"English","Finnish:str":"Suomi","French:str":"Français","German:str":"Deutsch","Greek:str":"Ελληνικά","Hindi:str":"हिन्दी","Hungarian:str":"Magyar","Indonesian:str":"Bahasa Indo","Italian:str":"Italiano","Japanese:str":"日本語","Korean:str":"한국어","Norwegian:str":"Norsk","Polish:str":"Polski","Portuguese:str":"Português","Romanian:str":"Română","Russian:str":"Русский","Slovak:str":"Slovenčina","Spanish:str":"Español","Swedish:str":"Svenska","Tamil:str":"தமிழ்","Thai:str":"ไทย","Turkish:str":"Türkçe"}
 *
 * @param LanguageFonts:struct
 * @text Language Fonts
 * @parent Localization:struct
 * @type struct<LanguageFonts>
 * @desc Different default fonts used for different languages.
 * Players can override this with Options Core.
 * @default {"Bengali:str":"rmmz-mainfont","Chinese(Simplified):str":"rmmz-mainfont","Chinese(Traditional):str":"rmmz-mainfont","Czech:str":"rmmz-mainfont","Danish:str":"rmmz-mainfont","Dutch:str":"rmmz-mainfont","English:str":"rmmz-mainfont","Finnish:str":"rmmz-mainfont","French:str":"rmmz-mainfont","German:str":"rmmz-mainfont","Greek:str":"rmmz-mainfont","Hindi:str":"rmmz-mainfont","Hungarian:str":"rmmz-mainfont","Indonesian:str":"rmmz-mainfont","Italian:str":"rmmz-mainfont","Japanese:str":"rmmz-mainfont","Korean:str":"rmmz-mainfont","Norwegian:str":"rmmz-mainfont","Polish:str":"rmmz-mainfont","Portuguese:str":"rmmz-mainfont","Romanian:str":"rmmz-mainfont","Russian:str":"rmmz-mainfont","Slovak:str":"rmmz-mainfont","Spanish:str":"rmmz-mainfont","Swedish:str":"rmmz-mainfont","Tamil:str":"rmmz-mainfont","Thai:str":"rmmz-mainfont","Turkish:str":"rmmz-mainfont"}
 *
 * @param LanguageImages:struct
 * @text Language Images
 * @parent Localization:struct
 * @type struct<LanguageImages>
 * @desc Allows different images to be used when different
 * languages are used. See help for more information.
 * @default {"ConvertDefault:eval":"false","Languages":"","Bengali:str":"[XX]","Chinese(Simplified):str":"[XX]","Chinese(Traditional):str":"[XX]","Czech:str":"[XX]","Danish:str":"[XX]","Dutch:str":"[XX]","English:str":"[XX]","Finnish:str":"[XX]","French:str":"[XX]","German:str":"[XX]","Greek:str":"[XX]","Hindi:str":"[XX]","Hungarian:str":"[XX]","Indonesian:str":"[XX]","Italian:str":"[XX]","Japanese:str":"[XX]","Korean:str":"[XX]","Norwegian:str":"[XX]","Polish:str":"[XX]","Portuguese:str":"[XX]","Romanian:str":"[XX]","Russian:str":"[XX]","Slovak:str":"[XX]","Spanish:str":"[XX]","Swedish:str":"[XX]","Tamil:str":"[XX]","Thai:str":"[XX]","Turkish:str":"[XX]"}
 *
 * @param TextSpeed:struct
 * @text Text Speed Option Settings
 * @type struct<TextSpeed>
 * @desc Text Speed Options Menu settings.
 * @default {"AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Text Speed","Default:num":"10","Instant:str":"Instant"}
 *
 * @param WordWrap:struct
 * @text Word Wrap Settings
 * @type struct<WordWrap>
 * @desc Settings involving Word Wrap.
 * @default {"EnableWordWrap":"","MessageWindow:eval":"false","HelpWindow:eval":"false","Rules":"","LineBreakSpace:eval":"true","TightWrap:eval":"false","EndPadding:num":"0"}
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
 * @param MessageWindow
 * @text Message Window
 *
 * @param MessageRows:num
 * @text Default Rows
 * @parent MessageWindow
 * @type num
 * @min 1
 * @desc Default number of rows to display for the Message Window.
 * @default 4
 *
 * @param MessageWidth:num
 * @text Default Width
 * @parent MessageWindow
 * @type num
 * @min 1
 * @desc Default Message Window width in pixels.
 * @default 816
 *
 * @param FastForwardKey:str
 * @text Fast Forward Key
 * @parent MessageWindow
 * @type combo
 * @option none
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for fast forwarding messages.
 * @default pagedown
 *
 * @param MessageTextDelay:num
 * @text Text Delay
 * @parent MessageWindow
 * @type number
 * @min 0
 * @desc How many frames to wait between characters drawn?
 * Use 0 for instant.
 * @default 1
 *
 * @param MsgWindowOffsetX:num
 * @text Offset X
 * @parent MessageWindow
 * @desc Offset Message Window horizontally.
 * Negative: Left; Positive: Right
 * @default +0
 *
 * @param MsgWindowOffsetY:num
 * @text Offset Y
 * @parent MessageWindow
 * @desc Offset Message Window vertically.
 * Negative: Up; Positive: Down
 * @default +0
 *
 * @param StretchDimmedBg:eval
 * @text Stretch Dimmed BG
 * @parent MessageWindow
 * @type boolean
 * @on Stretch
 * @off Don't
 * @desc Stretch dimmed window background to fit the whole screen.
 * @default true
 *
 * @param DefaultOutlineWidth:num
 * @text Default Outline Width
 * @parent MessageWindow
 * @type number
 * @min 0
 * @desc Changes the default outline width to this many pixels thick.
 * @default 3
 *
 * @param EachMessageStart:json
 * @text Each Message Start
 * @parent MessageWindow
 * @type note
 * @desc This is text that is added at the start of each message.
 * You may use text codes.
 * @default ""
 *
 * @param EachMessageEnd:json
 * @text Each Message End
 * @parent MessageWindow
 * @type note
 * @desc This is text that is added at the end of each message.
 * You may use text codes.
 * @default ""
 *
 * @param NameBoxWindow
 * @text Name Box Window
 *
 * @param NameBoxWindowDefaultColor:num
 * @text Default Color
 * @parent NameBoxWindow
 * @min 0
 * @max 31
 * @desc Default color for the Name Box Window's text.
 * @default 0
 *
 * @param NameBoxWindowOffsetX:num
 * @text Offset X
 * @parent NameBoxWindow
 * @desc How much to offset the name box window X by (as long as it doesn't go offscreen).
 * @default +0
 *
 * @param NameBoxWindowOffsetY:num
 * @text Offset Y
 * @parent NameBoxWindow
 * @desc How much to offset the name box window Y by (as long as it doesn't go offscreen).
 * @default +0
 *
 * @param ChoiceListWindow
 * @text Choice List Window
 *
 * @param ChoiceWindowLineHeight:num
 * @text Line Height
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc What is the default line height for Show Choices?
 * @default 36
 *
 * @param ChoiceWindowMinWidth:num
 * @text Minimum Choice Width
 * @parent ChoiceListWindow
 * @type number
 * @min 0
 * @desc What is the minimum choice width for each choice?
 * 96 is the default width.
 * @default 96
 *
 * @param ChoiceWindowMaxRows:num
 * @text Max Rows
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc Maximum number of rows to visibly display?
 * @default 8
 *
 * @param ChoiceWindowMaxCols:num
 * @text Max Columns
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc Maximum number of columns to visibly display?
 * @default 1
 *
 * @param ChoiceWindowTextAlign:str
 * @text Text Alignment
 * @parent ChoiceListWindow
 * @type select
 * @option Default
 * @value default
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @desc Default alignment for Show Choice window.
 * @default rmmz-mainfont
 *
 * @param DefaultTextCodes
 * @text Default Text Codes
 *
 * @param RelativePXPY:eval
 * @text Relative \PX \PY
 * @parent DefaultTextCodes
 * @type boolean
 * @on Better
 * @off Normal
 * @desc Make \PX[x] and \PY[x] adjust relative starting position than exact coordinates.
 * @default true
 *
 * @param FontBiggerCap:eval
 * @text \{ Maximum
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc Determine the maximum size that \{ can reach.
 * @default 108
 *
 * @param FontSmallerCap:eval
 * @text \} Minimum
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc Determine the minimum size that \} can reach.
 * @default 12
 *
 * @param FontChangeValue:eval
 * @text \{ Change \}
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc How much does \{ and \} change font size by?
 * @default 12
 *
 */
/* ----------------------------------------------------------------------------
 * Auto Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AutoColor:
 *
 * @param DatabaseHighlighting
 * @text Database Highlighting
 *
 * @param Actors:str
 * @text Actors
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Actor's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Classes:str
 * @text Classes
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Class's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Skills:str
 * @text Skills
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Skill's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Items:str
 * @text Items
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Item's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Weapons:str
 * @text Weapons
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Weapon's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Armors:str
 * @text Armors
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Armor's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Enemies:str
 * @text Enemies
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Enemy's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param States:str
 * @text States
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a State's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param WordHighlighting
 * @text Word Highlighting
 *
 * @param TextColor1:arraystr
 * @text \C[1]: Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor2:arraystr
 * @text \C[2]: Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor3:arraystr
 * @text \C[3]: Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor4:arraystr
 * @text \C[4]: Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor5:arraystr
 * @text \C[5]: Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor6:arraystr
 * @text \C[6]: Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor7:arraystr
 * @text \C[7]: Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor8:arraystr
 * @text \C[8]: Light Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor9:arraystr
 * @text \C[9]: Dark Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor10:arraystr
 * @text \C[10]: Dark Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor11:arraystr
 * @text \C[11]: Dark Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor12:arraystr
 * @text \C[12]: Dark Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor13:arraystr
 * @text \C[13]: Dark Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor14:arraystr
 * @text \C[14]: Solid Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor15:arraystr
 * @text \C[15]: Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor16:arraystr
 * @text \C[16]: System Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor17:arraystr
 * @text \C[17]: Crisis Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor18:arraystr
 * @text \C[18]: Dead Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor19:arraystr
 * @text \C[19]: Outline Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor20:arraystr
 * @text \C[20]: HP Orange 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor21:arraystr
 * @text \C[21]: HP Orange 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor22:arraystr
 * @text \C[22]: MP Blue 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor23:arraystr
 * @text \C[23]: MP Blue 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor24:arraystr
 * @text \C[24]: Param Up Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor25:arraystr
 * @text \C[25]: Param Down Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor26:arraystr
 * @text \C[26]: System Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor27:arraystr
 * @text \C[27]: System Pink
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor28:arraystr
 * @text \C[28]: TP Green 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor29:arraystr
 * @text \C[29]: TP Green 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor30:arraystr
 * @text \C[30]: EXP Purple 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor31:arraystr
 * @text \C[31]: EXP Purple 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Custom Font Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~CustomFont:
 *
 * @param FontFamily:str
 * @text Font Family
 * @desc This will be what's used by RPG Maker MZ and plugins to
 * reference this specific font. NO filename extensions!
 * @default Unnamed
 *
 * @param Filename:str
 * @text Filename
 * @desc What is the filename of the font you would like to use?
 * Located inside the project's "fonts" folder.
 * @default Unnamed.ttf
 *
 */
/* ----------------------------------------------------------------------------
 * Text Code Actions
 * ----------------------------------------------------------------------------
 */
/*~struct~TextCodeAction:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this text code to work.
 * @default Key
 *
 * @param Type:str
 * @text Type
 * @type select
 * @option none
 * @value
 * @option [x] (number)
 * @value \[(\d+)\]
 * @option <x> (string)
 * @value \<(.*?)\>
 * @desc The type of parameter to obtain (none, number, or string).
 * @default
 *
 * @param CommonEvent:num
 * @text Common Event
 * @type common_event
 * @desc Select a common event to run when this text code is used in a message.
 * @default 0
 *
 * @param ActionJS:func
 * @text JS: Action
 * @type note
 * @desc JavaScript code used to perform an action when this text code appears.
 * @default "const textState = arguments[0];"
 *
 */
/* ----------------------------------------------------------------------------
 * Text Code Replacements
 * ----------------------------------------------------------------------------
 */
/*~struct~TextCodeReplace:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this text code to work.
 * @default Key
 *
 * @param Type:str
 * @text Type
 * @type select
 * @option none
 * @value
 * @option [x] (number)
 * @value \[(\d+)\]
 * @option <x> (string)
 * @value \<(.*?)\>
 * @desc The type of parameter to obtain (none, number, or string).
 * @default
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc The text that will appear if this match appears.
 * If this has a value, ignore the JS: Text version.
 * @default Undefined
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine the text that will appear if this match appears.
 * @default "return 'Text';"
 *
 */
/* ----------------------------------------------------------------------------
 * Text Macro
 * ----------------------------------------------------------------------------
 */
/*~struct~TextMacro:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this macro to work.
 * @default Key
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc The replacement text that will appear from the macro.
 * If this has a value, ignore the JS: Text version.
 * @default Undefined
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine the text that will appear if this macro appears.
 * @default "return 'Text';"
 *
 */
/* ----------------------------------------------------------------------------
 * Localization Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Localization:
 *
 * @param Main
 * @text Main Settings
 *
 * @param Enable:eval
 * @text Enable Switching?
 * @parent Main
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc Enable language switching settings for this plugin?
 * @default false
 *
 * @param CsvFilename:str
 * @text CSV Filename
 * @parent Main
 * @desc What is the filename of the CSV file to read from?
 * Located within the project's /data/ folder.
 * @default Languages.csv
 *
 * @param Options
 * @text Options
 *
 * @param AddOption:eval
 * @text Add Option?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Language' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @parent Options
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @parent Options
 * @desc Command name of the option.
 * @default Text Language
 *
 * @param Localized
 * @text Languages
 *
 * @param DefaultLocale:str
 * @text Default Language
 * @parent Localized
 * @type select
 * @option Bengali
 * @option Chinese(Simplified)
 * @option Chinese(Traditional)
 * @option Czech
 * @option Danish
 * @option Dutch
 * @option English
 * @option Finnish
 * @option French
 * @option German
 * @option Greek
 * @option Hindi
 * @option Hungarian
 * @option Indonesian
 * @option Italian
 * @option Japanese
 * @option Korean
 * @option Norwegian
 * @option Polish
 * @option Portuguese
 * @option Romanian
 * @option Russian
 * @option Slovak
 * @option Spanish
 * @option Swedish
 * @option Tamil
 * @option Thai
 * @option Turkish
 * @desc What is the default language used for this game?
 * @default English
 *
 * @param Languages:arraystr
 * @text Supported Languages
 * @parent Localized
 * @type select[]
 * @option Bengali
 * @option Chinese(Simplified)
 * @option Chinese(Traditional)
 * @option Czech
 * @option Danish
 * @option Dutch
 * @option English
 * @option Finnish
 * @option French
 * @option German
 * @option Greek
 * @option Hindi
 * @option Hungarian
 * @option Indonesian
 * @option Italian
 * @option Japanese
 * @option Korean
 * @option Norwegian
 * @option Polish
 * @option Portuguese
 * @option Romanian
 * @option Russian
 * @option Slovak
 * @option Spanish
 * @option Swedish
 * @option Tamil
 * @option Thai
 * @option Turkish
 * @desc What are all the supported languages supported by this
 * game's script? Remove any that aren't translated.
 * @default ["Bengali","Chinese(Simplified)","Chinese(Traditional)","Czech","Danish","Dutch","English","Finnish","French","German","Greek","Hindi","Hungarian","Indonesian","Italian","Japanese","Korean","Norwegian","Polish","Portuguese","Romanian","Russian","Slovak","Spanish","Swedish","Tamil","Thai","Turkish"]
 *
 * @param LangNames
 * @text Language Names
 *
 * @param Bengali:str
 * @text Bengali
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default বাংলা
 *
 * @param Chinese(Simplified):str
 * @text Chinese (Simplified)
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default 简体中文
 *
 * @param Chinese(Traditional):str
 * @text Chinese (Traditional)
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default 繁體中文
 *
 * @param Czech:str
 * @text Czech
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Čeština
 *
 * @param Danish:str
 * @text Danish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Dansk
 *
 * @param Dutch:str
 * @text Dutch
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Nederlands
 *
 * @param English:str
 * @text English
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default English
 *
 * @param Finnish:str
 * @text Finnish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Suomi
 *
 * @param French:str
 * @text French
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Français
 *
 * @param German:str
 * @text German
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Deutsch
 *
 * @param Greek:str
 * @text Greek
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Ελληνικά
 *
 * @param Hindi:str
 * @text Hindi
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default हिन्दी
 *
 * @param Hungarian:str
 * @text Hungarian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Magyar
 *
 * @param Indonesian:str
 * @text Indonesian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Bahasa Indo
 *
 * @param Italian:str
 * @text Italian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Italiano
 *
 * @param Japanese:str
 * @text Japanese
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default 日本語
 *
 * @param Korean:str
 * @text Korean
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default 한국어
 *
 * @param Norwegian:str
 * @text Norwegian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Norsk
 *
 * @param Polish:str
 * @text Polish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Polski
 *
 * @param Portuguese:str
 * @text Portuguese
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Português
 *
 * @param Romanian:str
 * @text Romanian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Română
 *
 * @param Russian:str
 * @text Russian
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Русский
 *
 * @param Slovak:str
 * @text Slovak
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Slovenčina
 *
 * @param Spanish:str
 * @text Spanish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Español
 *
 * @param Swedish:str
 * @text Swedish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Svenska
 *
 * @param Tamil:str
 * @text Tamil
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default தமிழ்
 *
 * @param Thai:str
 * @text Thai
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default ไทย
 *
 * @param Turkish:str
 * @text Turkish
 * @parent LangNames
 * @desc How does this language appear in the in-game options?
 * @default Türkçe
 *
 */
/* ----------------------------------------------------------------------------
 * Language Fonts Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~LanguageFonts:
 *
 * @param Bengali:str
 * @text Bengali
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Chinese(Simplified):str
 * @text Chinese (Simplified)
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Chinese(Traditional):str
 * @text Chinese (Traditional)
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Czech:str
 * @text Czech
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Danish:str
 * @text Danish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Dutch:str
 * @text Dutch
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param English:str
 * @text English
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Finnish:str
 * @text Finnish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param French:str
 * @text French
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param German:str
 * @text German
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Greek:str
 * @text Greek
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Hindi:str
 * @text Hindi
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Hungarian:str
 * @text Hungarian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Indonesian:str
 * @text Indonesian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Italian:str
 * @text Italian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Japanese:str
 * @text Japanese
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Korean:str
 * @text Korean
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Norwegian:str
 * @text Norwegian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Polish:str
 * @text Polish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Portuguese:str
 * @text Portuguese
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Romanian:str
 * @text Romanian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Russian:str
 * @text Russian
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Slovak:str
 * @text Slovak
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Spanish:str
 * @text Spanish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Swedish:str
 * @text Swedish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Tamil:str
 * @text Tamil
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Thai:str
 * @text Thai
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 * @param Turkish:str
 * @text Turkish
 * @desc What font face is used for this language?
 * Make sure it is registered under Custom Font Manager.
 * @default rmmz-mainfont
 *
 */
/* ----------------------------------------------------------------------------
 * Language Images Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~LanguageImages:
 *
 * @param ConvertDefault:eval
 * @text Convert Default?
 * @type boolean
 * @on Convert
 * @off Don't
 * @desc ON: Default language uses converted marker.
 * OFF: Default languages uses [XX] as marker.
 * @default false
 *
 * @param Languages
 * @text Languages
 *
 * @param Bengali:str
 * @text Bengali
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Chinese(Simplified):str
 * @text Chinese (Simplified)
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Chinese(Traditional):str
 * @text Chinese (Traditional)
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Czech:str
 * @text Czech
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Danish:str
 * @text Danish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Dutch:str
 * @text Dutch
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param English:str
 * @text English
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Finnish:str
 * @text Finnish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param French:str
 * @text French
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param German:str
 * @text German
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Greek:str
 * @text Greek
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Hindi:str
 * @text Hindi
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Hungarian:str
 * @text Hungarian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Indonesian:str
 * @text Indonesian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Italian:str
 * @text Italian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Japanese:str
 * @text Japanese
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Korean:str
 * @text Korean
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Norwegian:str
 * @text Norwegian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Polish:str
 * @text Polish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Portuguese:str
 * @text Portuguese
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Romanian:str
 * @text Romanian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Russian:str
 * @text Russian
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Slovak:str
 * @text Slovak
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Spanish:str
 * @text Spanish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Swedish:str
 * @text Swedish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Tamil:str
 * @text Tamil
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Thai:str
 * @text Thai
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 * @param Turkish:str
 * @text Turkish
 * @parent Languages
 * @desc This text will replace [XX] with in image folder names
 * and filenames when this language is selected.
 * @default [XX]
 *
 */
/* ----------------------------------------------------------------------------
 * Text Speed Options Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~TextSpeed:
 *
 * @param AddOption:eval
 * @text Add Option?
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Text Speed' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @desc Command name of the option.
 * @default Text Speed
 *
 * @param Default:num
 * @text Default Value
 * @type number
 * @min 1
 * @max 11
 * @desc 1 - 10, slowest to fastest.
 * 11 is instant value.
 * @default 10
 *
 * @param Instant:str
 * @text Instant Speed
 * @desc Text to show "instant" text.
 * @default Instant
 *
 */
/* ----------------------------------------------------------------------------
 * Word Wrap Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~WordWrap:
 *
 * @param EnableWordWrap
 * @text Enable Word Wrap
 *
 * @param MessageWindow:eval
 * @text Message Window
 * @parent EnableWordWrap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Automatically enable Word Wrap for this window?
 * @default false
 *
 * @param HelpWindow:eval
 * @text Help Window
 * @parent EnableWordWrap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Automatically enable Word Wrap for this window?
 * @default false
 *
 * @param Rules
 * @text Rules
 *
 * @param LineBreakSpace:eval
 * @text Link Break -> Space
 * @parent Rules
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Convert manually placed (non tagged) line breaks with spaces?
 * @default true
 *
 * @param TightWrap:eval
 * @text Tight Wrap
 * @parent Rules
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc If a face graphic is present in a message, word wrap will be tighter.
 * @default false
 *
 * @param EndPadding:num
 * @text End Padding
 * @parent Rules
 * @type number
 * @desc Add extra padding to your window to make text wrap further away from the end of the window.
 * @default 0
 *
 */
//=============================================================================

const _0x205d14 = _0x5b07;
(function (_0x3eec4e, _0x14defc) {
  const _0x4930b5 = _0x5b07,
    _0x5c59b8 = _0x3eec4e();
  while (!![]) {
    try {
      const _0x6363b7 =
        (parseInt(_0x4930b5(0x329)) / 0x1) * (-parseInt(_0x4930b5(0x146)) / 0x2) +
        -parseInt(_0x4930b5(0x218)) / 0x3 +
        (parseInt(_0x4930b5(0x340)) / 0x4) * (-parseInt(_0x4930b5(0x3be)) / 0x5) +
        (-parseInt(_0x4930b5(0x202)) / 0x6) * (-parseInt(_0x4930b5(0x393)) / 0x7) +
        (-parseInt(_0x4930b5(0x20f)) / 0x8) * (-parseInt(_0x4930b5(0x49f)) / 0x9) +
        (-parseInt(_0x4930b5(0x306)) / 0xa) * (-parseInt(_0x4930b5(0x2ec)) / 0xb) +
        (-parseInt(_0x4930b5(0x15b)) / 0xc) * (-parseInt(_0x4930b5(0x2a7)) / 0xd);
      if (_0x6363b7 === _0x14defc) break;
      else _0x5c59b8['push'](_0x5c59b8['shift']());
    } catch (_0x7f7c09) {
      _0x5c59b8['push'](_0x5c59b8['shift']());
    }
  }
})(_0x8c00, 0x9ccc9);
function _0x5b07(_0x4cbd89, _0x3159a7) {
  const _0x8c008e = _0x8c00();
  return (
    (_0x5b07 = function (_0x5b0739, _0x3e8f42) {
      _0x5b0739 = _0x5b0739 - 0x10f;
      let _0x323ec3 = _0x8c008e[_0x5b0739];
      return _0x323ec3;
    }),
    _0x5b07(_0x4cbd89, _0x3159a7)
  );
}
var label = 'MessageCore',
  tier = tier || 0x0,
  dependencies = [],
  pluginData = $plugins[_0x205d14(0x43b)](function (_0x41aa03) {
    const _0xce256b = _0x205d14;
    return _0x41aa03['status'] && _0x41aa03[_0xce256b(0x426)][_0xce256b(0x38f)]('[' + label + ']');
  })[0x0];
(VisuMZ[label][_0x205d14(0x26d)] = VisuMZ[label]['Settings'] || {}),
  (VisuMZ[_0x205d14(0x377)] = function (_0x5524ec, _0x41b4b0) {
    const _0x32738b = _0x205d14;
    for (const _0xdd976a in _0x41b4b0) {
      if (_0xdd976a['match'](/(.*):(.*)/i)) {
        const _0x4ecc16 = String(RegExp['$1']),
          _0x55734b = String(RegExp['$2'])[_0x32738b(0x3a1)]()[_0x32738b(0x28e)]();
        let _0x31c9c9, _0x5d3ea9, _0x35b33c;
        switch (_0x55734b) {
          case _0x32738b(0x4c0):
            _0x31c9c9 = _0x41b4b0[_0xdd976a] !== '' ? Number(_0x41b4b0[_0xdd976a]) : 0x0;
            break;
          case _0x32738b(0x256):
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : []), (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x1a98ce => Number(_0x1a98ce)));
            break;
          case _0x32738b(0x23b):
            _0x31c9c9 = _0x41b4b0[_0xdd976a] !== '' ? eval(_0x41b4b0[_0xdd976a]) : null;
            break;
          case _0x32738b(0x183):
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON['parse'](_0x41b4b0[_0xdd976a]) : []), (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x2d7d46 => eval(_0x2d7d46)));
            break;
          case _0x32738b(0x444):
            _0x31c9c9 = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : '';
            break;
          case 'ARRAYJSON':
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : []), (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x1373e6 => JSON['parse'](_0x1373e6)));
            break;
          case 'FUNC':
            _0x31c9c9 = _0x41b4b0[_0xdd976a] !== '' ? new Function(JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a])) : new Function(_0x32738b(0x297));
            break;
          case _0x32738b(0x243):
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON['parse'](_0x41b4b0[_0xdd976a]) : []),
              (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x50ee05 => new Function(JSON[_0x32738b(0x4d0)](_0x50ee05))));
            break;
          case _0x32738b(0x2d2):
            _0x31c9c9 = _0x41b4b0[_0xdd976a] !== '' ? String(_0x41b4b0[_0xdd976a]) : '';
            break;
          case _0x32738b(0x194):
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : []), (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x2eab36 => String(_0x2eab36)));
            break;
          case 'STRUCT':
            (_0x35b33c = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : {}), (_0x5524ec[_0x4ecc16] = {}), VisuMZ[_0x32738b(0x377)](_0x5524ec[_0x4ecc16], _0x35b33c);
            continue;
          case _0x32738b(0x1b5):
            (_0x5d3ea9 = _0x41b4b0[_0xdd976a] !== '' ? JSON[_0x32738b(0x4d0)](_0x41b4b0[_0xdd976a]) : []),
              (_0x31c9c9 = _0x5d3ea9[_0x32738b(0x203)](_0x1f42df => VisuMZ[_0x32738b(0x377)]({}, JSON['parse'](_0x1f42df))));
            break;
          default:
            continue;
        }
        _0x5524ec[_0x4ecc16] = _0x31c9c9;
      }
    }
    return _0x5524ec;
  }),
  (_0x2e5a74 => {
    const _0x1f5c4c = _0x205d14,
      _0x3957aa = _0x2e5a74[_0x1f5c4c(0x201)];
    for (const _0x1aa473 of dependencies) {
      if (!Imported[_0x1aa473]) {
        alert(_0x1f5c4c(0x484)[_0x1f5c4c(0x3e5)](_0x3957aa, _0x1aa473)), SceneManager['exit']();
        break;
      }
    }
    const _0x30f789 = _0x2e5a74[_0x1f5c4c(0x426)];
    if (_0x30f789[_0x1f5c4c(0x127)](/\[Version[ ](.*?)\]/i)) {
      const _0x51c263 = Number(RegExp['$1']);
      _0x51c263 !== VisuMZ[label][_0x1f5c4c(0x265)] && (alert(_0x1f5c4c(0x364)[_0x1f5c4c(0x3e5)](_0x3957aa, _0x51c263)), SceneManager[_0x1f5c4c(0x475)]());
    }
    if (_0x30f789[_0x1f5c4c(0x127)](/\[Tier[ ](\d+)\]/i)) {
      const _0x1a4a58 = Number(RegExp['$1']);
      _0x1a4a58 < tier ? (alert(_0x1f5c4c(0x3ed)['format'](_0x3957aa, _0x1a4a58, tier)), SceneManager[_0x1f5c4c(0x475)]()) : (tier = Math[_0x1f5c4c(0x436)](_0x1a4a58, tier));
    }
    VisuMZ[_0x1f5c4c(0x377)](VisuMZ[label][_0x1f5c4c(0x26d)], _0x2e5a74['parameters']);
  })(pluginData),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], _0x205d14(0x16b), _0x5256b1 => {
    const _0x409926 = _0x205d14;
    VisuMZ[_0x409926(0x377)](_0x5256b1, _0x5256b1);
    const _0x2ce9a0 = Number(_0x5256b1[_0x409926(0x4b2)]) || 0x0;
    $gameSystem[_0x409926(0x1de)](_0x2ce9a0);
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], _0x205d14(0x27c), _0x53d3e7 => {
    const _0x1ccd1c = _0x205d14;
    VisuMZ[_0x1ccd1c(0x377)](_0x53d3e7, _0x53d3e7);
    const _0x1c9c91 = _0x53d3e7[_0x1ccd1c(0x3ba)] || $gameSystem[_0x1ccd1c(0x4a1)]() || 0x1,
      _0x71213b = _0x53d3e7[_0x1ccd1c(0x2f6)] ?? 0x60,
      _0x1be4fd = _0x53d3e7[_0x1ccd1c(0x1b0)] || $gameSystem[_0x1ccd1c(0x412)]() || 0x1,
      _0x370594 = _0x53d3e7[_0x1ccd1c(0x2bb)] || $gameSystem[_0x1ccd1c(0x1e8)]() || 0x1,
      _0x27534c = _0x53d3e7[_0x1ccd1c(0x1a9)][_0x1ccd1c(0x4a8)]() || _0x1ccd1c(0x119);
    $gameSystem['setChoiceListLineHeight'](_0x1c9c91),
      $gameSystem['setChoiceListMinChoiceWidth'](_0x71213b),
      $gameSystem[_0x1ccd1c(0x491)](_0x1be4fd),
      $gameSystem[_0x1ccd1c(0x3a9)](_0x370594),
      $gameSystem[_0x1ccd1c(0x27e)](_0x27534c);
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], _0x205d14(0x382), _0x393534 => {
    const _0x44015a = _0x205d14;
    VisuMZ['ConvertParams'](_0x393534, _0x393534);
    const _0x56c260 = _0x393534[_0x44015a(0x350)] || $gameSystem[_0x44015a(0x40d)]() || 0x1,
      _0x264c1e = _0x393534[_0x44015a(0x4f0)] || $gameSystem[_0x44015a(0x163)]() || 0x1;
    $gameTemp['_centerMessageWindow'] = !![];
    const _0x1a0364 = _0x393534[_0x44015a(0x117)][_0x44015a(0x4a8)]();
    $gameSystem['setMessageWindowRows'](_0x56c260), $gameSystem['setMessageWindowWidth'](_0x264c1e);
    [_0x44015a(0x4d8), _0x44015a(0x1c6)][_0x44015a(0x38f)](_0x1a0364) && $gameSystem[_0x44015a(0x140)](eval(_0x1a0364));
    const _0x2f602b = SceneManager[_0x44015a(0x2a2)]['_messageWindow'];
    _0x2f602b && (_0x2f602b[_0x44015a(0x4a7)](), _0x2f602b[_0x44015a(0x3de)](), _0x2f602b['createContents']());
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], 'MessageWindowXyOffsets', _0x2242fd => {
    const _0x1883c3 = _0x205d14;
    VisuMZ[_0x1883c3(0x377)](_0x2242fd, _0x2242fd), $gameSystem[_0x1883c3(0x4d2)](_0x2242fd[_0x1883c3(0x48f)], _0x2242fd[_0x1883c3(0x349)]);
    const _0x1a695f = SceneManager[_0x1883c3(0x2a2)][_0x1883c3(0x2af)];
    _0x1a695f && (_0x1a695f[_0x1883c3(0x4a7)](), _0x1a695f[_0x1883c3(0x3de)](), _0x1a695f[_0x1883c3(0x3d1)]());
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], 'SelectWeapon', _0x431bd4 => {
    const _0x25a9b5 = _0x205d14;
    VisuMZ[_0x25a9b5(0x377)](_0x431bd4, _0x431bd4), $gameMessage[_0x25a9b5(0x1a8)](_0x431bd4[_0x25a9b5(0x2cb)] || 0x0, _0x431bd4['WeaponTypeID'] || 0x0);
    const _0x9133c0 = $gameTemp[_0x25a9b5(0x454)]();
    if (_0x9133c0) _0x9133c0[_0x25a9b5(0x1f7)](_0x25a9b5(0x320));
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData['name'], 'SelectArmor', _0x2c8071 => {
    const _0x30fdb5 = _0x205d14;
    VisuMZ[_0x30fdb5(0x377)](_0x2c8071, _0x2c8071), $gameMessage[_0x30fdb5(0x31f)](_0x2c8071[_0x30fdb5(0x2cb)] || 0x0, _0x2c8071[_0x30fdb5(0x3f9)] || 0x0, _0x2c8071[_0x30fdb5(0x441)] || 0x0);
    const _0x4e863e = $gameTemp[_0x30fdb5(0x454)]();
    if (_0x4e863e) _0x4e863e['setWaitMode']('message');
  }),
  PluginManager['registerCommand'](pluginData[_0x205d14(0x201)], _0x205d14(0x416), _0x10ed29 => {
    const _0x5a7e74 = _0x205d14;
    VisuMZ['ConvertParams'](_0x10ed29, _0x10ed29), $gameMessage[_0x5a7e74(0x308)](_0x10ed29[_0x5a7e74(0x2cb)] || 0x0, _0x10ed29[_0x5a7e74(0x23e)] || 0x0, _0x10ed29['SkillTypeID'] || 0x0);
    const _0x178517 = $gameTemp['getLastPluginCommandInterpreter']();
    if (_0x178517) _0x178517[_0x5a7e74(0x1f7)](_0x5a7e74(0x320));
  }),
  PluginManager['registerCommand'](pluginData[_0x205d14(0x201)], 'PictureTextChange', _0x2c1bdf => {
    const _0x38ae47 = _0x205d14;
    VisuMZ[_0x38ae47(0x377)](_0x2c1bdf, _0x2c1bdf);
    const _0x196d32 = _0x2c1bdf[_0x38ae47(0x1e3)] || [],
      _0x5b1ff5 = _0x2c1bdf[_0x38ae47(0x365)] || 0x0,
      _0x5b16fa = [_0x38ae47(0x1e9), 'up', _0x38ae47(0x12b), _0x38ae47(0x22e), _0x38ae47(0x113), _0x38ae47(0x270), _0x38ae47(0x2f4), _0x38ae47(0x4a5), _0x38ae47(0x13b)];
    for (const _0x4c7d11 of _0x196d32) {
      $gameScreen[_0x38ae47(0x176)](_0x4c7d11, _0x5b1ff5);
      for (const _0x12709f of _0x5b16fa) {
        if (_0x2c1bdf[_0x12709f] === undefined) continue;
        $gameScreen['setPictureText'](_0x4c7d11, _0x2c1bdf[_0x12709f], _0x12709f);
      }
    }
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], _0x205d14(0x1e4), _0x475d99 => {
    const _0x362a97 = _0x205d14;
    VisuMZ[_0x362a97(0x377)](_0x475d99, _0x475d99);
    const _0x44c6c3 = _0x475d99[_0x362a97(0x1e3)] || [];
    for (const _0x348716 of _0x44c6c3) {
      $gameScreen['eraseAllPictureTexts'](_0x348716), $gameScreen[_0x362a97(0x2b1)](_0x348716);
    }
  }),
  PluginManager[_0x205d14(0x3bd)](pluginData[_0x205d14(0x201)], _0x205d14(0x392), _0x4841f6 => {
    const _0x531e21 = _0x205d14;
    $gameScreen[_0x531e21(0x387)]();
  }),
  (VisuMZ[_0x205d14(0x16f)]['Scene_Boot_onDatabaseLoaded'] = Scene_Boot[_0x205d14(0x39c)]['onDatabaseLoaded']),
  (Scene_Boot['prototype']['onDatabaseLoaded'] = function () {
    const _0x516974 = _0x205d14;
    VisuMZ['MessageCore'][_0x516974(0x166)]['call'](this),
      VisuMZ[_0x516974(0x16f)][_0x516974(0x309)](),
      this[_0x516974(0x23c)](),
      this['process_VisuMZ_MessageCore_TextCodes_Replace'](),
      this['process_VisuMZ_MessageCore_TextMacros'](),
      this[_0x516974(0x283)]();
  }),
  (VisuMZ[_0x205d14(0x16f)]['CheckCompatibility'] = function () {
    const _0x459211 = _0x205d14;
    if (Imported[_0x459211(0x24a)] && VisuMZ[_0x459211(0x226)][_0x459211(0x265)] < 1.09) {
      let _0x544915 = '';
      (_0x544915 += _0x459211(0x11e)), (_0x544915 += _0x459211(0x453)), alert(_0x544915), SceneManager[_0x459211(0x475)]();
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x48e)] = function (_0x34aef5) {
    const _0x5c3e96 = _0x205d14,
      _0x575211 = VisuMZ[_0x5c3e96(0x16f)]['Settings'][_0x34aef5];
    _0x575211[_0x5c3e96(0x31c)]((_0x513842, _0x3f2368) => {
      const _0x2d01a7 = _0x5c3e96;
      if (!_0x513842 || !_0x3f2368) return -0x1;
      return _0x3f2368[_0x2d01a7(0x137)][_0x2d01a7(0x3d7)] - _0x513842[_0x2d01a7(0x137)][_0x2d01a7(0x3d7)];
    });
  }),
  (Scene_Boot[_0x205d14(0x39c)][_0x205d14(0x23c)] = function () {
    const _0x43902a = _0x205d14;
    VisuMZ[_0x43902a(0x16f)]['SortObjectByKeyLength'](_0x43902a(0x317));
    for (const _0x1867dc of VisuMZ[_0x43902a(0x16f)][_0x43902a(0x26d)][_0x43902a(0x317)]) {
      (_0x1867dc['Match'] = _0x1867dc['Match'][_0x43902a(0x3a1)]()),
        (_0x1867dc[_0x43902a(0x1d5)] = new RegExp('\x1b' + _0x1867dc[_0x43902a(0x137)], 'gi')),
        (_0x1867dc['textCodeResult'] = '\x1b' + _0x1867dc['Match']);
      if (_0x1867dc[_0x43902a(0x402)] === '') _0x1867dc['textCodeResult'] += _0x43902a(0x46c);
    }
  }),
  (Scene_Boot['prototype']['process_VisuMZ_MessageCore_TextCodes_Replace'] = function () {
    const _0x10b784 = _0x205d14;
    VisuMZ[_0x10b784(0x16f)]['SortObjectByKeyLength']('TextCodeReplace');
    for (const _0x4f6a67 of VisuMZ[_0x10b784(0x16f)][_0x10b784(0x26d)]['TextCodeReplace']) {
      (_0x4f6a67[_0x10b784(0x1d5)] = new RegExp('\x1b' + _0x4f6a67[_0x10b784(0x137)] + _0x4f6a67[_0x10b784(0x402)], 'gi')),
        _0x4f6a67[_0x10b784(0x366)] !== '' && _0x4f6a67['TextStr'] !== _0x10b784(0x301)
          ? (_0x4f6a67[_0x10b784(0x28f)] = new Function('return\x20\x27' + _0x4f6a67['TextStr'][_0x10b784(0x351)](/\\/g, '\x1b') + '\x27'))
          : (_0x4f6a67[_0x10b784(0x28f)] = _0x4f6a67[_0x10b784(0x2e8)]);
    }
  }),
  (Scene_Boot['prototype'][_0x205d14(0x456)] = function () {
    const _0x3328c8 = _0x205d14;
    for (const _0x48f728 of VisuMZ['MessageCore'][_0x3328c8(0x26d)]['TextMacros']) {
      _0x48f728[_0x3328c8(0x1d5)] = new RegExp('\x5c[' + _0x48f728[_0x3328c8(0x137)] + '\x5c]', 'gi');
      if (_0x48f728[_0x3328c8(0x366)] !== '' && _0x48f728[_0x3328c8(0x366)] !== _0x3328c8(0x301)) {
        let _0xad8a74 = _0x48f728[_0x3328c8(0x366)];
        (_0xad8a74 = _0xad8a74[_0x3328c8(0x351)](/\\/g, '\x1b')),
          (_0xad8a74 = _0xad8a74[_0x3328c8(0x351)]('\x27', '\x5c\x27')),
          (_0xad8a74 = _0xad8a74[_0x3328c8(0x351)]('\x22', '\x5c\x22')),
          (_0x48f728[_0x3328c8(0x28f)] = new Function(_0x3328c8(0x38e) + _0xad8a74 + '\x27'));
      } else _0x48f728[_0x3328c8(0x28f)] = _0x48f728[_0x3328c8(0x2e8)];
    }
  }),
  (Scene_Boot[_0x205d14(0x39c)][_0x205d14(0x283)] = function () {
    const _0x6f9dd3 = _0x205d14,
      _0x18a6b1 = VisuMZ['MessageCore'][_0x6f9dd3(0x26d)]['AutoColor'];
    !VisuMZ[_0x6f9dd3(0x342)] &&
      (VisuMZ['MessageCore'][_0x6f9dd3(0x36b)]($dataClasses, _0x18a6b1[_0x6f9dd3(0x49b)]),
      VisuMZ[_0x6f9dd3(0x16f)][_0x6f9dd3(0x36b)]($dataSkills, _0x18a6b1[_0x6f9dd3(0x3e2)]),
      VisuMZ['MessageCore'][_0x6f9dd3(0x36b)]($dataItems, _0x18a6b1[_0x6f9dd3(0x3af)]),
      VisuMZ['MessageCore']['AddAutoColor']($dataWeapons, _0x18a6b1['Weapons']),
      VisuMZ[_0x6f9dd3(0x16f)][_0x6f9dd3(0x36b)]($dataArmors, _0x18a6b1[_0x6f9dd3(0x399)]),
      VisuMZ[_0x6f9dd3(0x16f)]['AddAutoColor']($dataEnemies, _0x18a6b1[_0x6f9dd3(0x110)]),
      VisuMZ['MessageCore']['AddAutoColor']($dataStates, _0x18a6b1['States'])),
      VisuMZ['MessageCore'][_0x6f9dd3(0x19d)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x168)] = [
    'V',
    'N',
    'P',
    'C',
    'I',
    'PX',
    'PY',
    'G',
    '{',
    '}',
    '<',
    '>',
    'FS',
    '\x5c',
    '$',
    '.',
    '|',
    '!',
    '<',
    '>',
    '^',
    '<B>',
    _0x205d14(0x38c),
    _0x205d14(0x1aa),
    '</I>',
    _0x205d14(0x35e),
    _0x205d14(0x3ea),
    _0x205d14(0x2ca),
    '</CENTER>',
    '<RIGHT>',
    _0x205d14(0x3b4),
    _0x205d14(0x4d6),
    '</COLORLOCK>',
    _0x205d14(0x2f3),
    _0x205d14(0x25a),
    '<WORDWRAP>',
    _0x205d14(0x48b),
    _0x205d14(0x4ba),
    _0x205d14(0x3c1),
    _0x205d14(0x177),
    _0x205d14(0x279),
    'COMMONEVENT',
    _0x205d14(0x3a7),
    _0x205d14(0x273),
    _0x205d14(0x3d8),
    _0x205d14(0x385),
    _0x205d14(0x300),
    'SWITCH',
    _0x205d14(0x2bf),
    _0x205d14(0x45f),
    'ANY',
  ]),
  (VisuMZ[_0x205d14(0x16f)]['AddAutoColor'] = function (_0x2df8bc, _0x3c5ee1) {
    const _0x4eca93 = _0x205d14;
    if (_0x3c5ee1 <= 0x0) return;
    const _0x1ca0d0 = _0x2df8bc;
    for (const _0x2374f4 of _0x1ca0d0) {
      if (!_0x2374f4) continue;
      VisuMZ[_0x4eca93(0x16f)][_0x4eca93(0x193)](_0x2374f4, _0x3c5ee1);
    }
  }),
  (VisuMZ['MessageCore']['CreateAutoColorRegExpLists'] = function () {
    const _0x4754cc = _0x205d14;
    VisuMZ[_0x4754cc(0x16f)][_0x4754cc(0x116)] = [];
    for (let _0xcc1ffa = 0x1; _0xcc1ffa <= 0x1f; _0xcc1ffa++) {
      const _0x4de72c = _0x4754cc(0x36f)['format'](_0xcc1ffa),
        _0x170d41 = VisuMZ['MessageCore'][_0x4754cc(0x26d)][_0x4754cc(0x326)][_0x4de72c];
      _0x170d41['sort']((_0x18d815, _0x1977a4) => {
        if (!_0x18d815 || !_0x1977a4) return -0x1;
        return _0x1977a4['length'] - _0x18d815['length'];
      }),
        this[_0x4754cc(0x12f)](_0x170d41, _0xcc1ffa);
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x12f)] = function (_0x3e4a6f, _0x555d8c) {
    const _0x4b321c = _0x205d14;
    for (const _0x1fb49e of _0x3e4a6f) {
      if (_0x1fb49e[_0x4b321c(0x3d7)] <= 0x0) continue;
      if (/^\d+$/[_0x4b321c(0x4ce)](_0x1fb49e)) continue;
      let _0x31b15a = VisuMZ[_0x4b321c(0x16f)][_0x4b321c(0x4e7)](_0x1fb49e);
      if (_0x1fb49e['match'](/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g)) var _0x4c641d = new RegExp(_0x31b15a, 'i');
      else var _0x4c641d = new RegExp('\x5cb' + _0x31b15a + '\x5cb', 'g');
      VisuMZ['MessageCore'][_0x4b321c(0x116)]['push']([_0x4c641d, '\x1bC[%1]%2\x1bPREVCOLOR[0]'[_0x4b321c(0x3e5)](_0x555d8c, _0x1fb49e)]);
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x4e7)] = function (_0x6cfd8f) {
    const _0x346633 = _0x205d14;
    return (_0x6cfd8f = _0x6cfd8f[_0x346633(0x351)](/(\W)/gi, (_0x33d084, _0x57b2cf) => _0x346633(0x42b)['format'](_0x57b2cf))), _0x6cfd8f;
  }),
  (VisuMZ[_0x205d14(0x16f)]['ParseClassNotetags'] = VisuMZ[_0x205d14(0x263)]),
  (VisuMZ[_0x205d14(0x263)] = function (_0x38a321) {
    const _0x878ccb = _0x205d14;
    VisuMZ['MessageCore'][_0x878ccb(0x263)]['call'](this, _0x38a321);
    const _0xacf5fb = VisuMZ[_0x878ccb(0x16f)][_0x878ccb(0x26d)][_0x878ccb(0x326)];
    VisuMZ['MessageCore']['CreateAutoColorFor'](_0x38a321, _0xacf5fb['Classes']);
  }),
  (VisuMZ[_0x205d14(0x16f)]['ParseSkillNotetags'] = VisuMZ[_0x205d14(0x298)]),
  (VisuMZ[_0x205d14(0x298)] = function (_0x1b263b) {
    const _0x224c5f = _0x205d14;
    VisuMZ[_0x224c5f(0x16f)][_0x224c5f(0x298)][_0x224c5f(0x34e)](this, _0x1b263b);
    const _0x12d972 = VisuMZ['MessageCore'][_0x224c5f(0x26d)][_0x224c5f(0x326)];
    VisuMZ[_0x224c5f(0x16f)][_0x224c5f(0x193)](_0x1b263b, _0x12d972[_0x224c5f(0x3e2)]);
  }),
  0x7,
  (VisuMZ['MessageCore'][_0x205d14(0x229)] = VisuMZ[_0x205d14(0x229)]),
  (VisuMZ[_0x205d14(0x229)] = function (_0x38cae3) {
    const _0x5da3c2 = _0x205d14;
    VisuMZ[_0x5da3c2(0x16f)]['ParseItemNotetags'][_0x5da3c2(0x34e)](this, _0x38cae3);
    const _0x5dc26d = VisuMZ[_0x5da3c2(0x16f)][_0x5da3c2(0x26d)]['AutoColor'];
    VisuMZ[_0x5da3c2(0x16f)][_0x5da3c2(0x193)](_0x38cae3, _0x5dc26d[_0x5da3c2(0x3af)]);
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x3eb)] = VisuMZ[_0x205d14(0x3eb)]),
  (VisuMZ[_0x205d14(0x3eb)] = function (_0x550dca) {
    const _0x33e4ed = _0x205d14;
    VisuMZ[_0x33e4ed(0x16f)][_0x33e4ed(0x3eb)]['call'](this, _0x550dca);
    const _0xa357bb = VisuMZ['MessageCore'][_0x33e4ed(0x26d)][_0x33e4ed(0x326)];
    VisuMZ['MessageCore'][_0x33e4ed(0x193)](_0x550dca, _0xa357bb[_0x33e4ed(0x296)]);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x3a5)] = VisuMZ[_0x205d14(0x3a5)]),
  (VisuMZ[_0x205d14(0x3a5)] = function (_0x42aafd) {
    const _0x3ba5e3 = _0x205d14;
    VisuMZ['MessageCore']['ParseArmorNotetags'][_0x3ba5e3(0x34e)](this, _0x42aafd);
    const _0x33b12f = VisuMZ[_0x3ba5e3(0x16f)][_0x3ba5e3(0x26d)][_0x3ba5e3(0x326)];
    VisuMZ[_0x3ba5e3(0x16f)]['CreateAutoColorFor'](_0x42aafd, _0x33b12f['Armors']);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2d7)] = VisuMZ[_0x205d14(0x2d7)]),
  (VisuMZ[_0x205d14(0x2d7)] = function (_0x27a5da) {
    const _0x322678 = _0x205d14;
    VisuMZ[_0x322678(0x16f)][_0x322678(0x2d7)][_0x322678(0x34e)](this, _0x27a5da);
    const _0x6d7f56 = VisuMZ[_0x322678(0x16f)][_0x322678(0x26d)][_0x322678(0x326)];
    VisuMZ['MessageCore'][_0x322678(0x193)](_0x27a5da, _0x6d7f56[_0x322678(0x110)]);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x133)] = VisuMZ[_0x205d14(0x133)]),
  (VisuMZ[_0x205d14(0x133)] = function (_0x3c4423) {
    const _0x7c4255 = _0x205d14;
    VisuMZ[_0x7c4255(0x16f)]['ParseStateNotetags'][_0x7c4255(0x34e)](this, _0x3c4423);
    const _0x176006 = VisuMZ[_0x7c4255(0x16f)]['Settings'][_0x7c4255(0x326)];
    VisuMZ[_0x7c4255(0x16f)]['CreateAutoColorFor'](_0x3c4423, _0x176006['States']);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x193)] = function (_0x265dd9, _0x2ddf84) {
    const _0x237084 = _0x205d14;
    if (_0x2ddf84 <= 0x0) return;
    const _0x4714cc = VisuMZ['MessageCore'][_0x237084(0x26d)]['AutoColor'][_0x237084(0x3f4) + _0x2ddf84];
    let _0x1eaae1 = _0x265dd9['name'][_0x237084(0x28e)]();
    if (/^\d+$/[_0x237084(0x4ce)](_0x1eaae1)) return;
    if (VisuMZ[_0x237084(0x16f)]['AutoColorBypassList']['includes'](_0x1eaae1[_0x237084(0x3a1)]())) return;
    (_0x1eaae1 = _0x1eaae1[_0x237084(0x351)](/\\I\[(\d+)\]/gi, '')), (_0x1eaae1 = _0x1eaae1[_0x237084(0x351)](/\x1bI\[(\d+)\]/gi, ''));
    if (_0x1eaae1['length'] <= 0x0) return;
    if (_0x1eaae1[_0x237084(0x127)](/-----/i)) return;
    _0x4714cc[_0x237084(0x1dc)](_0x1eaae1);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x1f6)] = Scene_Boot[_0x205d14(0x39c)][_0x205d14(0x481)]),
  (Scene_Boot[_0x205d14(0x39c)]['loadGameFonts'] = function () {
    const _0x2f5a37 = _0x205d14;
    VisuMZ[_0x2f5a37(0x16f)]['Scene_Boot_loadGameFonts'][_0x2f5a37(0x34e)](this), this[_0x2f5a37(0x1fb)]();
  }),
  (Scene_Boot[_0x205d14(0x39c)][_0x205d14(0x1fb)] = function () {
    const _0xa75bd3 = _0x205d14,
      _0x11db73 = VisuMZ[_0xa75bd3(0x16f)]['Settings'][_0xa75bd3(0x44a)] || [];
    for (const _0x89fd3 of _0x11db73) {
      if (!_0x89fd3) continue;
      const _0x591471 = _0x89fd3['FontFamily'];
      if (_0x591471[_0xa75bd3(0x28e)]() === '') continue;
      if (_0x591471[_0xa75bd3(0x4a8)]()[_0xa75bd3(0x28e)]() === 'unnamed') continue;
      const _0x5a5ba1 = _0x89fd3[_0xa75bd3(0x3d4)];
      if (_0x5a5ba1 === _0xa75bd3(0x134)) continue;
      FontManager['load'](_0x591471, _0x5a5ba1);
    }
  }),
  (VisuMZ['MessageCore']['DataManager_loadDatabase'] = DataManager[_0x205d14(0x3d3)]),
  (DataManager[_0x205d14(0x3d3)] = function () {
    const _0x1180b7 = _0x205d14;
    VisuMZ[_0x1180b7(0x16f)][_0x1180b7(0x375)][_0x1180b7(0x34e)](this), this[_0x1180b7(0x4a2)]();
  }),
  (DataManager[_0x205d14(0x4a2)] = function () {
    const _0xeb190c = _0x205d14;
    if (!TextManager[_0xeb190c(0x17e)]()) return;
    const _0x42dd3b = VisuMZ[_0xeb190c(0x16f)][_0xeb190c(0x26d)][_0xeb190c(0x1bf)],
      _0x237f69 = _0x42dd3b[_0xeb190c(0x215)] || '';
    if (!_0x237f69) return;
    const _0x5c2b3b = _0xeb190c(0x41b),
      _0x107a9e = new XMLHttpRequest(),
      _0x54a69c = _0xeb190c(0x1fe) + _0x237f69;
    (window[_0x5c2b3b] = null),
      _0x107a9e[_0xeb190c(0x249)](_0xeb190c(0x258), _0x54a69c),
      _0x107a9e[_0xeb190c(0x35c)](_0xeb190c(0x227)),
      (_0x107a9e[_0xeb190c(0x4f4)] = () => this['onLocalizationXhrLoad'](_0x107a9e, _0x5c2b3b)),
      (_0x107a9e[_0xeb190c(0x22f)] = () => this[_0xeb190c(0x22d)]()),
      _0x107a9e[_0xeb190c(0x33a)]();
  }),
  (DataManager[_0x205d14(0x19b)] = function (_0x191899, _0x7c720) {
    const _0x409b76 = _0x205d14;
    if (_0x191899[_0x409b76(0x45c)] >= 0x190) return;
    const _0x25cb11 = _0x191899[_0x409b76(0x46e)];
    window[_0x7c720] = VisuMZ[_0x409b76(0x16f)]['ParseLocalizationCsv'](_0x25cb11);
  }),
  (VisuMZ[_0x205d14(0x16f)]['ParseLocalizationCsv'] = function (_0x4e4d13) {
    const _0xc5affc = _0x205d14,
      _0x579366 = _0x4e4d13['split']('\x0a'),
      _0x257b69 = _0x579366[0x0][_0xc5affc(0x41c)](';'),
      _0x300ec6 = {};
    return (
      _0x579366[_0xc5affc(0x251)](0x1)[_0xc5affc(0x418)](_0x27e9fd => {
        const _0x2148bf = _0xc5affc;
        let _0x282009 = [],
          _0xdc6989 = '',
          _0x125574 = ![];
        for (let _0xf85826 = 0x0; _0xf85826 < _0x27e9fd[_0x2148bf(0x3d7)]; _0xf85826++) {
          let _0x4803e0 = _0x27e9fd[_0xf85826];
          if (_0x4803e0 === '\x22') _0x125574 && _0x27e9fd[_0xf85826 + 0x1] === '\x22' ? ((_0xdc6989 += _0x4803e0), _0xf85826++) : (_0x125574 = !_0x125574);
          else _0x4803e0 === ';' && !_0x125574 ? (_0x282009[_0x2148bf(0x1dc)](_0xdc6989), (_0xdc6989 = '')) : (_0xdc6989 += _0x4803e0);
        }
        if (_0xdc6989) _0x282009[_0x2148bf(0x1dc)](_0xdc6989);
        if (!_0x282009[0x0]) _0x282009[0x0] = '';
        const _0x46eaa1 = _0x282009[0x0]['replace'](/^"|"$/g, '')[_0x2148bf(0x4a8)]()[_0x2148bf(0x28e)]();
        _0x300ec6[_0x46eaa1] = _0x257b69[_0x2148bf(0x251)](0x1)['reduce']((_0x2c86ff, _0x237b95, _0x533b33) => {
          return (_0x2c86ff[_0x237b95] = (_0x282009[_0x533b33 + 0x1] || '')['replace'](/^"|"$/g, '')), _0x2c86ff;
        }, {});
      }),
      _0x300ec6
    );
  }),
  (DataManager[_0x205d14(0x22d)] = function () {
    const _0x1b06ca = _0x205d14;
    let _0x1df31a = '';
    (_0x1df31a += _0x1b06ca(0x1b9)),
      (_0x1df31a += 'Would\x20you\x20like\x20the\x20plugin\x20to\x20create\x20the\x20base\x20CSV\x20file?\x0a\x0a'),
      confirm(_0x1df31a)
        ? Utils[_0x1b06ca(0x3bf)](_0x1b06ca(0x4ce))
          ? ((_0x1df31a = _0x1b06ca(0x459)), alert(_0x1df31a), this[_0x1b06ca(0x1c8)](), this[_0x1b06ca(0x225)](), (_0x1df31a = ''))
          : (_0x1df31a = _0x1b06ca(0x260))
        : (_0x1df31a = _0x1b06ca(0x460)),
      (_0x1df31a += _0x1b06ca(0x336)),
      alert(_0x1df31a),
      SceneManager[_0x1b06ca(0x475)]();
  }),
  (DataManager['createLocalizationCsvFile'] = function () {
    const _0x3d0749 = _0x205d14,
      _0x28279a = [
        _0x3d0749(0x207),
        _0x3d0749(0x2c3),
        _0x3d0749(0x2bd),
        'Chinese(Simplified)',
        _0x3d0749(0x373),
        _0x3d0749(0x322),
        'Danish',
        _0x3d0749(0x49e),
        _0x3d0749(0x18d),
        'French',
        _0x3d0749(0x390),
        _0x3d0749(0x13f),
        _0x3d0749(0x36a),
        _0x3d0749(0x20d),
        'Indonesian',
        _0x3d0749(0x29e),
        _0x3d0749(0x1b1),
        _0x3d0749(0x21a),
        _0x3d0749(0x3d9),
        _0x3d0749(0x3d0),
        _0x3d0749(0x129),
        'Romanian',
        _0x3d0749(0x312),
        _0x3d0749(0x184),
        _0x3d0749(0x209),
        'Swedish',
        _0x3d0749(0x28a),
        _0x3d0749(0x3f6),
        _0x3d0749(0x3ad),
      ],
      _0x395c68 = [
        'Greeting',
        _0x3d0749(0x3b0),
        _0x3d0749(0x2cd),
        '你好',
        '你好',
        _0x3d0749(0x1af),
        _0x3d0749(0x3cd),
        _0x3d0749(0x35f),
        _0x3d0749(0x14e),
        _0x3d0749(0x1f8),
        _0x3d0749(0x35f),
        'Γειά\x20σου',
        _0x3d0749(0x378),
        _0x3d0749(0x26a),
        _0x3d0749(0x1eb),
        _0x3d0749(0x235),
        _0x3d0749(0x2d9),
        _0x3d0749(0x15f),
        _0x3d0749(0x14e),
        _0x3d0749(0x3f3),
        _0x3d0749(0x381),
        _0x3d0749(0x33b),
        _0x3d0749(0x321),
        _0x3d0749(0x1af),
        'Hola',
        'Hej',
        _0x3d0749(0x241),
        _0x3d0749(0x25b),
        'Merhaba',
      ],
      _0x27beb4 = [
        _0x3d0749(0x255),
        _0x3d0749(0x1ef),
        _0x3d0749(0x264),
        '再见',
        '再見',
        _0x3d0749(0x4e9),
        _0x3d0749(0x29a),
        _0x3d0749(0x223),
        _0x3d0749(0x483),
        _0x3d0749(0x331),
        _0x3d0749(0x4b6),
        _0x3d0749(0x3ac),
        _0x3d0749(0x371),
        _0x3d0749(0x214),
        _0x3d0749(0x123),
        'Arrivederci',
        _0x3d0749(0x463),
        _0x3d0749(0x427),
        _0x3d0749(0x19c),
        'Do\x20widzenia',
        _0x3d0749(0x310),
        'La\x20revedere',
        'До\x20свидания',
        'Zbohom',
        _0x3d0749(0x286),
        _0x3d0749(0x379),
        'பிரியாவிடை',
        _0x3d0749(0x216),
        'Hoşça\x20kal',
      ],
      _0x47a513 = [
        _0x3d0749(0x3c2),
        _0x3d0749(0x3c2),
        _0x3d0749(0x3b6),
        '哇',
        '哇',
        'Ó',
        'Wow',
        _0x3d0749(0x268),
        _0x3d0749(0x4be),
        _0x3d0749(0x2fd),
        _0x3d0749(0x3c2),
        _0x3d0749(0x34f),
        _0x3d0749(0x415),
        _0x3d0749(0x395),
        _0x3d0749(0x23a),
        'Wow',
        'ワオ',
        '와우',
        'Oi',
        'O',
        _0x3d0749(0x295),
        'Uau',
        'Вау',
        'Ó',
        _0x3d0749(0x2d1),
        'Oj',
        _0x3d0749(0x182),
        'ว้าว',
        _0x3d0749(0x41d),
      ],
      _0x55bda6 = [_0x28279a, _0x395c68, _0x27beb4, _0x47a513],
      _0x297a46 = _0x55bda6[_0x3d0749(0x203)](_0x368dd2 => _0x368dd2['join'](';'))[_0x3d0749(0x1b8)]('\x0a'),
      _0x1409e8 = VisuMZ[_0x3d0749(0x16f)][_0x3d0749(0x26d)][_0x3d0749(0x1bf)],
      _0x61cc96 = _0x1409e8[_0x3d0749(0x215)] || _0x3d0749(0x2c5),
      _0x46b7c7 = require('path'),
      _0x4cbb87 = _0x46b7c7[_0x3d0749(0x11c)](process[_0x3d0749(0x307)]['filename']),
      _0x598a43 = _0x46b7c7[_0x3d0749(0x1b8)](_0x4cbb87, _0x3d0749(0x1fe)),
      _0x4bcebf = _0x598a43 + _0x61cc96,
      _0x55d91f = require('fs');
    return _0x55d91f[_0x3d0749(0x2d5)](_0x4bcebf, _0x297a46), _0x4bcebf;
  }),
  (DataManager[_0x205d14(0x225)] = function () {
    const _0x5e4686 = _0x205d14,
      { exec: _0x26d1d4 } = require(_0x5e4686(0x468));
    _0x26d1d4(_0x5e4686(0x39f)), _0x26d1d4(_0x5e4686(0x333));
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x44f)] = ImageManager[_0x205d14(0x1d9)]),
  (ImageManager['loadBitmap'] = function (_0x1fe21e, _0x11f53a) {
    const _0x4c6774 = _0x205d14;
    if (ConfigManager[_0x4c6774(0x369)] !== undefined) {
      const _0x305714 = VisuMZ['MessageCore'][_0x4c6774(0x26d)]['Localization'] || {},
        _0x4d837a = _0x305714[_0x4c6774(0x154)] || _0x4c6774(0x2c3),
        _0x4afcb2 = VisuMZ[_0x4c6774(0x16f)][_0x4c6774(0x26d)][_0x4c6774(0x2fe)] || {},
        _0x392430 = ConfigManager[_0x4c6774(0x369)] || _0x4d837a;
      if (_0x392430 === _0x4d837a && !_0x4afcb2['ConvertDefault']) {
      } else {
        const _0x27fa12 = _0x4afcb2[_0x392430] || '[XX]';
        _0x1fe21e && _0x1fe21e['match'](/\[XX\]/g) && console[_0x4c6774(0x3ef)](_0x1fe21e, _0x11f53a),
          _0x11f53a && _0x11f53a[_0x4c6774(0x127)](/\[XX\]/g) && (_0x11f53a = _0x11f53a[_0x4c6774(0x351)](/\[XX\]/g, _0x27fa12));
      }
    }
    return VisuMZ[_0x4c6774(0x16f)][_0x4c6774(0x44f)][_0x4c6774(0x34e)](this, _0x1fe21e, _0x11f53a);
  }),
  (SceneManager[_0x205d14(0x1b4)] = function () {
    const _0x1c97e7 = _0x205d14;
    return this[_0x1c97e7(0x2a2)] && this[_0x1c97e7(0x2a2)][_0x1c97e7(0x157)] === Scene_Battle;
  }),
  (SceneManager[_0x205d14(0x368)] = function () {
    const _0xa5cfc7 = _0x205d14;
    return this[_0xa5cfc7(0x2a2)] && this['_scene'][_0xa5cfc7(0x157)] === Scene_Map;
  }),
  (ConfigManager[_0x205d14(0x369)] = VisuMZ['MessageCore'][_0x205d14(0x26d)][_0x205d14(0x1bf)][_0x205d14(0x154)] || _0x205d14(0x2c3)),
  (ConfigManager['textSpeed'] = VisuMZ[_0x205d14(0x16f)][_0x205d14(0x26d)][_0x205d14(0x20a)]['Default']),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x4f3)] = ConfigManager[_0x205d14(0x1fa)]),
  (ConfigManager[_0x205d14(0x1fa)] = function () {
    const _0x3f65ee = _0x205d14,
      _0x5692e3 = VisuMZ[_0x3f65ee(0x16f)][_0x3f65ee(0x4f3)][_0x3f65ee(0x34e)](this);
    return TextManager[_0x3f65ee(0x17e)]() && (_0x5692e3['textLocale'] = this[_0x3f65ee(0x369)]), (_0x5692e3[_0x3f65ee(0x30e)] = this[_0x3f65ee(0x30e)]), _0x5692e3;
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x346)] = ConfigManager[_0x205d14(0x25f)]),
  (ConfigManager[_0x205d14(0x25f)] = function (_0x24bfb1) {
    const _0x140166 = _0x205d14;
    VisuMZ[_0x140166(0x16f)][_0x140166(0x346)][_0x140166(0x34e)](this, _0x24bfb1),
      TextManager[_0x140166(0x17e)]() &&
        (_0x140166(0x369) in _0x24bfb1
          ? (this[_0x140166(0x369)] = String(_0x24bfb1[_0x140166(0x369)]))
          : (this['textLocale'] = VisuMZ[_0x140166(0x16f)][_0x140166(0x26d)][_0x140166(0x1bf)][_0x140166(0x154)] || _0x140166(0x2c3))),
      'textSpeed' in _0x24bfb1
        ? (this[_0x140166(0x30e)] = Number(_0x24bfb1[_0x140166(0x30e)])[_0x140166(0x41e)](0x1, 0xb))
        : (this[_0x140166(0x30e)] = VisuMZ[_0x140166(0x16f)][_0x140166(0x26d)][_0x140166(0x20a)][_0x140166(0x3e7)]);
  }),
  (TextManager[_0x205d14(0x269)] = VisuMZ[_0x205d14(0x16f)][_0x205d14(0x26d)][_0x205d14(0x1bf)]['Name']),
  (TextManager['messageCoreTextSpeed'] = VisuMZ[_0x205d14(0x16f)][_0x205d14(0x26d)][_0x205d14(0x20a)][_0x205d14(0x4c6)]),
  (TextManager['instantTextSpeed'] = VisuMZ[_0x205d14(0x16f)][_0x205d14(0x26d)][_0x205d14(0x20a)][_0x205d14(0x122)]),
  (VisuMZ[_0x205d14(0x16f)]['TextManager_message'] = TextManager[_0x205d14(0x320)]),
  (TextManager[_0x205d14(0x320)] = function (_0x197e73) {
    const _0x548726 = _0x205d14,
      _0x58f15f = ['levelUp', _0x548726(0x14a), _0x548726(0x2e5), _0x548726(0x1b7), _0x548726(0x11f), _0x548726(0x4f6), _0x548726(0x1f4), _0x548726(0x4ed), _0x548726(0x3dd), 'obtainItem'];
    let _0x24d79f = VisuMZ[_0x548726(0x16f)][_0x548726(0x17c)][_0x548726(0x34e)](this, _0x197e73);
    return _0x58f15f['includes'](_0x197e73) && (_0x24d79f = '</WORDWRAP>' + _0x24d79f), _0x24d79f;
  }),
  (TextManager[_0x205d14(0x17e)] = function () {
    const _0x58fc7f = _0x205d14;
    return VisuMZ[_0x58fc7f(0x16f)][_0x58fc7f(0x26d)][_0x58fc7f(0x1bf)][_0x58fc7f(0x111)];
  }),
  (TextManager[_0x205d14(0x30f)] = function (_0x4cfda5) {
    const _0x2c3286 = _0x205d14;
    if (!this[_0x2c3286(0x17e)]()) return _0x4cfda5;
    return (
      (_0x4cfda5 = String(_0x4cfda5)[_0x2c3286(0x351)](/\$(?:\[|\<|\{)(.*?)(?:\]|\>|\})/gi, (_0x58de99, _0x572244) => this[_0x2c3286(0x3ab)](String(_0x572244)))),
      (_0x4cfda5 = String(_0x4cfda5)['replace'](/\\(?:KEY|TL|TRANSLATE|LOC|LOCALIZE|LOCALE)(?:\[|\<|\{)(.*?)(?:\]|\>|\})/gi, (_0x333cd0, _0xe13913) => this['getLocalizedText'](String(_0xe13913)))),
      (_0x4cfda5 = String(_0x4cfda5)[_0x2c3286(0x351)](/\x1b(?:KEY|TL|TRANSLATE|LOC|LOCALIZE|LOCALE)(?:\[|\<|\{)(.*?)(?:\]|\>|\})/gi, (_0x532dd8, _0x352cfc) =>
        this[_0x2c3286(0x3ab)](String(_0x352cfc)),
      )),
      _0x4cfda5
    );
  }),
  (TextManager['getLocalizedText'] = function (_0x2944f5) {
    const _0x4e9656 = _0x205d14;
    if (!$dataLocalization) return '';
    const _0x140405 = $dataLocalization[_0x2944f5[_0x4e9656(0x4a8)]()[_0x4e9656(0x28e)]()];
    if (!_0x140405) return;
    const _0x536608 = ConfigManager['textLocale'] || 'English';
    let _0x1f6b85 = _0x140405[_0x536608] || _0x4e9656(0x37c);
    return (_0x1f6b85 = _0x1f6b85[_0x4e9656(0x351)](/\\/g, '\x1b')), (_0x1f6b85 = _0x1f6b85[_0x4e9656(0x351)](/<SEMI(?:|-COLON|COLON)>/gi, ';')), _0x1f6b85;
  }),
  (TextManager[_0x205d14(0x4b8)] = function (_0x155898) {
    const _0x2995a0 = _0x205d14;
    return VisuMZ[_0x2995a0(0x16f)]['Settings'][_0x2995a0(0x1bf)][_0x155898] || '';
  }),
  (TextManager[_0x205d14(0x23f)] = function () {
    const _0x4fc5be = _0x205d14,
      _0xe65983 = ConfigManager['textLocale'] || _0x4fc5be(0x2c3);
    return this[_0x4fc5be(0x4b8)](_0xe65983);
  }),
  (TextManager[_0x205d14(0x1f9)] = function (_0x4b751f) {
    const _0xdbfb5a = _0x205d14,
      _0x3dc048 = VisuMZ[_0xdbfb5a(0x16f)][_0xdbfb5a(0x26d)][_0xdbfb5a(0x1bf)]['Languages'] || [];
    let _0x25b2cd = _0x3dc048[_0xdbfb5a(0x2fc)](ConfigManager[_0xdbfb5a(0x369)] || _0xdbfb5a(0x2c3));
    _0x25b2cd += _0x4b751f;
    const _0x3c403b = _0x3dc048[_0x25b2cd] || '';
    return this[_0xdbfb5a(0x4b8)](_0x3c403b);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_System_mainFontFace'] = Game_System[_0x205d14(0x39c)][_0x205d14(0x31a)]),
  (Game_System['prototype']['mainFontFace'] = function () {
    const _0x24cb4d = _0x205d14;
    let _0x49a0e6 = VisuMZ[_0x24cb4d(0x16f)]['Game_System_mainFontFace'][_0x24cb4d(0x34e)](this);
    if (ConfigManager && ConfigManager['textFont'] !== undefined && ConfigManager[_0x24cb4d(0x40b)] > 0x0) return _0x49a0e6;
    else {
      const _0x459c97 = ConfigManager[_0x24cb4d(0x369)] || _0x24cb4d(0x2c3),
        _0x4ccb31 = VisuMZ[_0x24cb4d(0x16f)][_0x24cb4d(0x26d)]['LanguageFonts'];
      return _0x4ccb31[_0x459c97] !== undefined && (_0x49a0e6 = _0x4ccb31[_0x459c97] + ',\x20' + $dataSystem['advanced'][_0x24cb4d(0x42c)]), _0x49a0e6;
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x495)] = Window_Command['prototype']['addCommand']),
  (Window_Command[_0x205d14(0x39c)]['addCommand'] = function (_0x10cbae, _0x2d52fa, _0x24bea4, _0x37cd19) {
    const _0x2fd180 = _0x205d14;
    if (TextManager[_0x2fd180(0x30f)] && TextManager['isVisuMzLocalizationEnabled']()) {
      const _0x135f24 = _0x10cbae[_0x2fd180(0x4a8)]()[_0x2fd180(0x28e)]();
      if ($dataLocalization[_0x135f24] && _0x135f24[_0x2fd180(0x3d7)] > 0x0) {
        const _0x22f476 = ConfigManager['textLocale'] || _0x2fd180(0x2c3);
        _0x10cbae = $dataLocalization[_0x135f24][_0x22f476] || 'UNDEFINED!';
      }
    }
    VisuMZ[_0x2fd180(0x16f)][_0x2fd180(0x495)][_0x2fd180(0x34e)](this, _0x10cbae, _0x2d52fa, _0x24bea4, _0x37cd19);
  }),
  (Window_StatusBase[_0x205d14(0x39c)][_0x205d14(0x1ba)] = function (_0x22baf6, _0x254be8) {
    const _0x4b194f = _0x205d14,
      _0x1d9007 = _0x22baf6[_0x4b194f(0x3f5)]();
    let _0x126f9f = $dataSystem[_0x4b194f(0x4dd)][_0x1d9007[_0x254be8]];
    if (TextManager[_0x4b194f(0x30f)]) {
      const _0x13672f = _0x126f9f[_0x4b194f(0x4a8)]()['trim']();
      if (TextManager['isVisuMzLocalizationEnabled']() && $dataLocalization[_0x13672f]) {
        const _0x298334 = ConfigManager[_0x4b194f(0x369)] || _0x4b194f(0x2c3);
        _0x126f9f = $dataLocalization[_0x13672f][_0x298334] || _0x4b194f(0x37c);
      }
    }
    return _0x126f9f;
  }),
  (Game_Temp[_0x205d14(0x39c)][_0x205d14(0x172)] = function (_0x5e7846) {
    const _0x3ea267 = _0x205d14;
    this[_0x3ea267(0x1c2)] = _0x5e7846;
  }),
  (Game_Temp[_0x205d14(0x39c)][_0x205d14(0x454)] = function () {
    const _0x5bdcdd = _0x205d14;
    return this[_0x5bdcdd(0x1c2)];
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_Interpreter_PluginCommand'] = Game_Interpreter['prototype'][_0x205d14(0x219)]),
  (Game_Interpreter[_0x205d14(0x39c)]['command357'] = function (_0x23d758) {
    const _0x462c7b = _0x205d14;
    return $gameTemp[_0x462c7b(0x172)](this), VisuMZ['MessageCore'][_0x462c7b(0x2db)][_0x462c7b(0x34e)](this, _0x23d758);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_System_initialize'] = Game_System[_0x205d14(0x39c)][_0x205d14(0x304)]),
  (Game_System['prototype'][_0x205d14(0x304)] = function () {
    const _0x44f6d2 = _0x205d14;
    VisuMZ[_0x44f6d2(0x16f)][_0x44f6d2(0x2b4)][_0x44f6d2(0x34e)](this), this[_0x44f6d2(0x474)]();
  }),
  (Game_System[_0x205d14(0x39c)]['initMessageCore'] = function () {
    const _0x548338 = _0x205d14,
      _0xe96c7c = VisuMZ[_0x548338(0x16f)]['Settings'][_0x548338(0x413)],
      _0x4e850f = VisuMZ[_0x548338(0x16f)][_0x548338(0x26d)][_0x548338(0x117)];
    (this[_0x548338(0x27d)] = {
      messageRows: _0xe96c7c[_0x548338(0x14d)],
      messageWidth: _0xe96c7c[_0x548338(0x446)],
      messageWordWrap: _0x4e850f[_0x548338(0x266)],
      helpWordWrap: _0x4e850f[_0x548338(0x4f7)],
      choiceLineHeight: _0xe96c7c[_0x548338(0x20c)],
      choiceMinWidth: _0xe96c7c[_0x548338(0x3d2)] ?? 0x60,
      choiceRows: _0xe96c7c[_0x548338(0x44c)],
      choiceCols: _0xe96c7c['ChoiceWindowMaxCols'],
      choiceTextAlign: _0xe96c7c['ChoiceWindowTextAlign'],
      choiceDistance: 0x0,
    }),
      this[_0x548338(0x2dc)] === undefined && ((this['_messageOffsetX'] = _0xe96c7c['MsgWindowOffsetX']), (this[_0x548338(0x11a)] = _0xe96c7c[_0x548338(0x3ce)]));
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x40d)] = function () {
    const _0x2e577e = _0x205d14;
    if (this[_0x2e577e(0x27d)] === undefined) this[_0x2e577e(0x474)]();
    if (this[_0x2e577e(0x27d)][_0x2e577e(0x22c)] === undefined) this[_0x2e577e(0x474)]();
    return this['_MessageCoreSettings'][_0x2e577e(0x22c)];
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x233)] = function (_0xc4ca45) {
    const _0x3b9b85 = _0x205d14;
    if (this[_0x3b9b85(0x27d)] === undefined) this[_0x3b9b85(0x474)]();
    if (this['_MessageCoreSettings'][_0x3b9b85(0x22c)] === undefined) this[_0x3b9b85(0x474)]();
    this[_0x3b9b85(0x27d)][_0x3b9b85(0x22c)] = _0xc4ca45 || 0x1;
  }),
  (Game_System['prototype'][_0x205d14(0x163)] = function () {
    const _0x3c80c2 = _0x205d14;
    if (this[_0x3c80c2(0x27d)] === undefined) this[_0x3c80c2(0x474)]();
    if (this['_MessageCoreSettings'][_0x3c80c2(0x2e2)] === undefined) this[_0x3c80c2(0x474)]();
    return this[_0x3c80c2(0x27d)]['messageWidth'];
  }),
  (Game_System[_0x205d14(0x39c)]['setMessageWindowWidth'] = function (_0xa74b9c) {
    const _0x53f8b9 = _0x205d14;
    if (this[_0x53f8b9(0x27d)] === undefined) this[_0x53f8b9(0x474)]();
    if (this['_MessageCoreSettings'][_0x53f8b9(0x2e2)] === undefined) this[_0x53f8b9(0x474)]();
    _0xa74b9c = Math[_0x53f8b9(0x429)](_0xa74b9c);
    if (_0xa74b9c % 0x2 !== 0x0) _0xa74b9c += 0x1;
    this[_0x53f8b9(0x27d)][_0x53f8b9(0x2e2)] = _0xa74b9c || 0x2;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x25e)] = function () {
    const _0x5e9bbf = _0x205d14;
    if (this[_0x5e9bbf(0x27d)] === undefined) this['initMessageCore']();
    if (this[_0x5e9bbf(0x27d)][_0x5e9bbf(0x458)] === undefined) this[_0x5e9bbf(0x474)]();
    return this[_0x5e9bbf(0x27d)][_0x5e9bbf(0x458)];
  }),
  (Game_System['prototype'][_0x205d14(0x140)] = function (_0xc28bea) {
    const _0x287db1 = _0x205d14;
    if (this[_0x287db1(0x27d)] === undefined) this[_0x287db1(0x474)]();
    if (this['_MessageCoreSettings']['messageWordWrap'] === undefined) this['initMessageCore']();
    this[_0x287db1(0x27d)][_0x287db1(0x458)] = _0xc28bea;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x144)] = function () {
    const _0x49c2ac = _0x205d14;
    if (this[_0x49c2ac(0x2dc)] === undefined) {
      const _0x41c318 = VisuMZ[_0x49c2ac(0x16f)][_0x49c2ac(0x26d)][_0x49c2ac(0x413)];
      (this['_messageOffsetX'] = _0x41c318['MsgWindowOffsetX']), (this['_messageOffsetY'] = _0x41c318[_0x49c2ac(0x3ce)]);
    }
    return { x: this[_0x49c2ac(0x2dc)] || 0x0, y: this[_0x49c2ac(0x11a)] || 0x0 };
  }),
  (Game_System['prototype'][_0x205d14(0x4d2)] = function (_0x512028, _0x2fdac2) {
    const _0x2ec443 = _0x205d14;
    if (this[_0x2ec443(0x27d)] === undefined) this[_0x2ec443(0x474)]();
    (this['_messageOffsetX'] = _0x512028), (this[_0x2ec443(0x11a)] = _0x2fdac2);
  }),
  (Game_System[_0x205d14(0x39c)]['isHelpWindowWordWrap'] = function () {
    const _0x259448 = _0x205d14;
    if (this['_MessageCoreSettings'] === undefined) this[_0x259448(0x474)]();
    if (this['_MessageCoreSettings'][_0x259448(0x185)] === undefined) this['initMessageCore']();
    return this[_0x259448(0x27d)][_0x259448(0x185)];
  }),
  (Game_System[_0x205d14(0x39c)]['setHelpWindowWordWrap'] = function (_0x57d1e2) {
    const _0x781bc0 = _0x205d14;
    if (this[_0x781bc0(0x27d)] === undefined) this[_0x781bc0(0x474)]();
    if (this[_0x781bc0(0x27d)][_0x781bc0(0x185)] === undefined) this[_0x781bc0(0x474)]();
    this[_0x781bc0(0x27d)][_0x781bc0(0x185)] = _0x57d1e2;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x4a1)] = function () {
    const _0x427e1c = _0x205d14;
    if (this[_0x427e1c(0x27d)] === undefined) this[_0x427e1c(0x474)]();
    if (this[_0x427e1c(0x27d)][_0x427e1c(0x3e9)] === undefined) this[_0x427e1c(0x474)]();
    return this[_0x427e1c(0x27d)]['choiceLineHeight'];
  }),
  (Game_System['prototype']['setChoiceListLineHeight'] = function (_0x32bb44) {
    const _0xec6032 = _0x205d14;
    if (this['_MessageCoreSettings'] === undefined) this[_0xec6032(0x474)]();
    if (this[_0xec6032(0x27d)][_0xec6032(0x3e9)] === undefined) this[_0xec6032(0x474)]();
    this['_MessageCoreSettings'][_0xec6032(0x3e9)] = _0x32bb44 || 0x1;
  }),
  (Game_System[_0x205d14(0x39c)]['getChoiceListMinChoiceWidth'] = function () {
    const _0x4804fd = _0x205d14;
    if (this[_0x4804fd(0x27d)] === undefined) this[_0x4804fd(0x474)]();
    return this[_0x4804fd(0x27d)][_0x4804fd(0x3f7)] ?? 0x60;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x204)] = function (_0x12f7b8) {
    const _0x4393cf = _0x205d14;
    if (this[_0x4393cf(0x27d)] === undefined) this[_0x4393cf(0x474)]();
    this[_0x4393cf(0x27d)][_0x4393cf(0x3f7)] = _0x12f7b8 || 0x0;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x412)] = function () {
    const _0x2e2a6c = _0x205d14;
    if (this['_MessageCoreSettings'] === undefined) this[_0x2e2a6c(0x474)]();
    if (this[_0x2e2a6c(0x27d)]['choiceRows'] === undefined) this['initMessageCore']();
    return this['_MessageCoreSettings'][_0x2e2a6c(0x3a8)];
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x491)] = function (_0x483978) {
    const _0x24d8f0 = _0x205d14;
    if (this[_0x24d8f0(0x27d)] === undefined) this[_0x24d8f0(0x474)]();
    if (this[_0x24d8f0(0x27d)][_0x24d8f0(0x3a8)] === undefined) this[_0x24d8f0(0x474)]();
    this[_0x24d8f0(0x27d)][_0x24d8f0(0x3a8)] = _0x483978 || 0x1;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x1e8)] = function () {
    const _0x2339e6 = _0x205d14;
    if (this[_0x2339e6(0x27d)] === undefined) this[_0x2339e6(0x474)]();
    if (this[_0x2339e6(0x27d)][_0x2339e6(0x24c)] === undefined) this[_0x2339e6(0x474)]();
    return this[_0x2339e6(0x27d)][_0x2339e6(0x24c)];
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x3a9)] = function (_0x4b71c5) {
    const _0x2e2e17 = _0x205d14;
    if (this[_0x2e2e17(0x27d)] === undefined) this[_0x2e2e17(0x474)]();
    if (this[_0x2e2e17(0x27d)][_0x2e2e17(0x24c)] === undefined) this[_0x2e2e17(0x474)]();
    this[_0x2e2e17(0x27d)][_0x2e2e17(0x24c)] = _0x4b71c5 || 0x1;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x4eb)] = function () {
    const _0x52dcb8 = _0x205d14;
    if (this['_MessageCoreSettings'] === undefined) this[_0x52dcb8(0x474)]();
    if (this[_0x52dcb8(0x27d)][_0x52dcb8(0x3c8)] === undefined) this[_0x52dcb8(0x474)]();
    return this[_0x52dcb8(0x27d)][_0x52dcb8(0x3c8)];
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x27e)] = function (_0x12e28c) {
    const _0x2d7746 = _0x205d14;
    if (this[_0x2d7746(0x27d)] === undefined) this[_0x2d7746(0x474)]();
    if (this[_0x2d7746(0x27d)][_0x2d7746(0x3c8)] === undefined) this[_0x2d7746(0x474)]();
    this[_0x2d7746(0x27d)][_0x2d7746(0x3c8)] = _0x12e28c[_0x2d7746(0x4a8)]();
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x338)] = function () {
    const _0x1ff5b8 = _0x205d14;
    if (this[_0x1ff5b8(0x27d)] === undefined) this[_0x1ff5b8(0x474)]();
    return this[_0x1ff5b8(0x27d)][_0x1ff5b8(0x27f)] || 0x0;
  }),
  (Game_System[_0x205d14(0x39c)][_0x205d14(0x1de)] = function (_0x563927) {
    const _0x4ed9a5 = _0x205d14;
    if (this['_MessageCoreSettings'] === undefined) this['initMessageCore']();
    this[_0x4ed9a5(0x27d)][_0x4ed9a5(0x27f)] = _0x563927 || 0x0;
  }),
  (Game_Message[_0x205d14(0x39c)]['setWeaponChoice'] = function (_0xaa0e5d, _0x420d50) {
    const _0x4ac041 = _0x205d14;
    (this[_0x4ac041(0x2d0)] = _0xaa0e5d), (this[_0x4ac041(0x3fe)] = _0x4ac041(0x1ca)), (this[_0x4ac041(0x345)] = _0x420d50), (this[_0x4ac041(0x410)] = 0x0);
  }),
  (Game_Message[_0x205d14(0x39c)][_0x205d14(0x343)] = function () {
    const _0xf1ba45 = _0x205d14;
    return this[_0xf1ba45(0x345)] || 0x0;
  }),
  (Game_Message[_0x205d14(0x39c)]['setArmorChoice'] = function (_0x13cd0d, _0x37a288, _0x484fed) {
    const _0x4a8174 = _0x205d14;
    (this[_0x4a8174(0x2d0)] = _0x13cd0d), (this[_0x4a8174(0x3fe)] = _0x4a8174(0x30b)), (this[_0x4a8174(0x1d7)] = _0x37a288), (this[_0x4a8174(0x410)] = _0x484fed);
  }),
  (Game_Message['prototype'][_0x205d14(0x37a)] = function () {
    const _0x2c0b78 = _0x205d14;
    return this[_0x2c0b78(0x1d7)] || 0x0;
  }),
  (Game_Message[_0x205d14(0x39c)][_0x205d14(0x1e6)] = function () {
    return this['_itemChoiceEtypeId'] || 0x0;
  }),
  (Game_Message[_0x205d14(0x39c)][_0x205d14(0x308)] = function (_0x116534, _0x46d6a3, _0x55372d) {
    const _0x6fc564 = _0x205d14;
    (this[_0x6fc564(0x2d0)] = _0x116534), (this['_itemChoiceItypeId'] = _0x6fc564(0x1a7)), (this[_0x6fc564(0x290)] = _0x46d6a3), (this['_itemChoiceStypeId'] = _0x55372d);
  }),
  (Game_Message[_0x205d14(0x39c)][_0x205d14(0x262)] = function () {
    const _0x2c434f = _0x205d14;
    return this[_0x2c434f(0x290)] || 0x0;
  }),
  (Game_Message[_0x205d14(0x39c)][_0x205d14(0x4f2)] = function () {
    const _0x29864 = _0x205d14;
    return $gameActors['actor'](this['itemChoiceActorId']()) || $gameParty[_0x29864(0x354)]() || null;
  }),
  (Game_Message[_0x205d14(0x39c)]['itemChoiceStypeId'] = function () {
    return this['_itemChoiceStypeId'] || 0x0;
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x4ee)] = Game_Message[_0x205d14(0x39c)]['setChoices']),
  (Game_Message['prototype'][_0x205d14(0x153)] = function (_0x269150, _0x2d2aaf, _0x5f0109) {
    const _0x1dd4ae = _0x205d14;
    (this[_0x1dd4ae(0x2f7)] = !![]), VisuMZ[_0x1dd4ae(0x16f)][_0x1dd4ae(0x4ee)]['call'](this, _0x269150, _0x2d2aaf, _0x5f0109);
  }),
  (Game_Message[_0x205d14(0x39c)]['setupShuffleChoices'] = function () {
    const _0x268c47 = _0x205d14;
    (this[_0x268c47(0x2f7)] = ![]), (this['_choiceIndexArray'] = []);
    const _0x30db36 = this[_0x268c47(0x3b7)][_0x268c47(0x3d7)];
    this['_maxShuffleChoices'] = _0x30db36;
    let _0x1411bc = ![];
    for (let _0x246bc7 = 0x0; _0x246bc7 < _0x30db36; _0x246bc7++) {
      let _0x237f21 = this[_0x268c47(0x3b7)][_0x246bc7];
      _0x237f21[_0x268c47(0x127)](/<SHUFFLE>/gi) && ((_0x1411bc = !![]), (_0x237f21 = _0x237f21[_0x268c47(0x351)](/<SHUFFLE>/gi, ''))),
        _0x237f21[_0x268c47(0x127)](/<SHUFFLE:[ ](\d+)>/gi) &&
          ((_0x1411bc = !![]), (this[_0x268c47(0x472)] = Math['min'](Number(RegExp['$1']), this[_0x268c47(0x472)])), (_0x237f21 = _0x237f21[_0x268c47(0x351)](/<SHUFFLE:[ ](\d+)>/gi, ''))),
        _0x237f21[_0x268c47(0x127)](/<SHUFFLE: VAR[ ](\d+)>/gi) &&
          ((_0x1411bc = !![]),
          (this[_0x268c47(0x472)] = Math[_0x268c47(0x1d6)]($gameVariables[_0x268c47(0x396)](Number(RegExp['$1'])) || 0x1, this[_0x268c47(0x472)])),
          (_0x237f21 = _0x237f21[_0x268c47(0x351)](/<SHUFFLE:[ ]VAR (\d+)>/gi, ''))),
        this[_0x268c47(0x4d5)]['push'](_0x246bc7),
        (this[_0x268c47(0x3b7)][_0x246bc7] = _0x237f21);
    }
    if (_0x1411bc) {
      this[_0x268c47(0x4d5)] = VisuMZ['MessageCore'][_0x268c47(0x4b4)](this['_choiceIndexArray']);
      if (this[_0x268c47(0x457)]() !== -0x2) this[_0x268c47(0x3e6)] = -0x1;
    }
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x4b4)] = function (_0x43fc05) {
    const _0x79ee81 = _0x205d14;
    var _0x14345f, _0x110600, _0x4701d5;
    for (_0x4701d5 = _0x43fc05[_0x79ee81(0x3d7)] - 0x1; _0x4701d5 > 0x0; _0x4701d5--) {
      (_0x14345f = Math[_0x79ee81(0x4ef)](Math['random']() * (_0x4701d5 + 0x1))), (_0x110600 = _0x43fc05[_0x4701d5]), (_0x43fc05[_0x4701d5] = _0x43fc05[_0x14345f]), (_0x43fc05[_0x14345f] = _0x110600);
    }
    return _0x43fc05;
  }),
  (Game_Message[_0x205d14(0x39c)]['choiceIndexArray'] = function () {
    const _0x5751bc = _0x205d14;
    if (!this[_0x5751bc(0x4d5)]) this[_0x5751bc(0x174)]();
    return this['_choiceIndexArray'];
  }),
  (Game_Message['prototype'][_0x205d14(0x13e)] = function () {
    const _0x14f177 = _0x205d14;
    if (this[_0x14f177(0x472)] === undefined) this[_0x14f177(0x174)]();
    return this[_0x14f177(0x472)];
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2a3)] = Game_Screen['prototype']['clearPictures']),
  (Game_Screen['prototype'][_0x205d14(0x282)] = function () {
    const _0x2b02c5 = _0x205d14;
    VisuMZ[_0x2b02c5(0x16f)]['Game_Screen_clearPictures'][_0x2b02c5(0x34e)](this), this[_0x2b02c5(0x3ca)]();
  }),
  (Game_Screen['prototype'][_0x205d14(0x3ca)] = function () {
    const _0x34001c = _0x205d14;
    (this[_0x34001c(0x325)] = []), (this[_0x34001c(0x4c8)] = []), (this['_pictureTextRefresh'] = []);
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x391)] = function (_0x376c44) {
    const _0x2866b7 = _0x205d14;
    if (this[_0x2866b7(0x325)] === undefined) this[_0x2866b7(0x3ca)]();
    const _0x598de5 = this['realPictureId'](_0x376c44);
    return (this['_pictureText'][_0x598de5] = this[_0x2866b7(0x325)][_0x598de5] || {}), this[_0x2866b7(0x325)][_0x598de5];
  }),
  (Game_Screen[_0x205d14(0x39c)]['getPictureText'] = function (_0x388f16, _0xfed337) {
    const _0xc109be = _0x205d14;
    return (_0xfed337 = _0xfed337[_0xc109be(0x4a8)]()[_0xc109be(0x28e)]()), this[_0xc109be(0x391)](_0x388f16)[_0xfed337] || '';
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x1cd)] = function (_0x357827, _0x54ca8a, _0x32f250) {
    const _0x4ab632 = _0x205d14;
    (_0x32f250 = _0x32f250['toLowerCase']()[_0x4ab632(0x28e)]()), (this['getPictureTextData'](_0x357827)[_0x32f250] = _0x54ca8a || ''), this[_0x4ab632(0x3b1)](_0x357827, !![]);
  }),
  (Game_Screen['prototype']['eraseAllPictureTexts'] = function (_0x51f0dd) {
    const _0x5480f3 = _0x205d14;
    if (this[_0x5480f3(0x325)] === undefined) this[_0x5480f3(0x3ca)]();
    const _0x44a9aa = this['realPictureId'](_0x51f0dd);
    (this[_0x5480f3(0x325)][_0x44a9aa] = null), this[_0x5480f3(0x3b1)](_0x51f0dd, !![]);
  }),
  (Game_Screen[_0x205d14(0x39c)]['getPictureTextBuffer'] = function (_0x14cbcd) {
    const _0x2d0afe = _0x205d14;
    if (this[_0x2d0afe(0x325)] === undefined) this[_0x2d0afe(0x3ca)]();
    const _0x25e017 = this[_0x2d0afe(0x230)](_0x14cbcd);
    return this[_0x2d0afe(0x4c8)][_0x25e017] || 0x0;
  }),
  (Game_Screen[_0x205d14(0x39c)]['setPictureTextBuffer'] = function (_0x56efb9, _0x1234bf) {
    const _0x144b08 = _0x205d14;
    if (this[_0x144b08(0x325)] === undefined) this[_0x144b08(0x3ca)]();
    const _0x3e1a39 = this[_0x144b08(0x230)](_0x56efb9);
    this[_0x144b08(0x4c8)][_0x3e1a39] = Math[_0x144b08(0x436)](0x0, _0x1234bf);
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x2b1)] = function (_0x23b111) {
    const _0x560aff = _0x205d14;
    if (this[_0x560aff(0x325)] === undefined) this['clearAllPictureTexts']();
    const _0x28a486 = this[_0x560aff(0x230)](_0x23b111);
    this[_0x560aff(0x4c8)][_0x28a486] = undefined;
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x3c0)] = Game_Screen[_0x205d14(0x39c)][_0x205d14(0x48c)]),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x48c)] = function (_0x2ccb7d) {
    const _0xe0dc26 = _0x205d14;
    VisuMZ['MessageCore'][_0xe0dc26(0x3c0)][_0xe0dc26(0x34e)](this, _0x2ccb7d), this[_0xe0dc26(0x198)](_0x2ccb7d), this[_0xe0dc26(0x2b1)](_0x2ccb7d), this[_0xe0dc26(0x3b1)](_0x2ccb7d, !![]);
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x387)] = function () {
    const _0x3bbe9d = _0x205d14;
    for (const _0x5bed39 of this[_0x3bbe9d(0x302)]) {
      if (_0x5bed39) {
        let _0x3d8944 = this[_0x3bbe9d(0x302)][_0x3bbe9d(0x2fc)](_0x5bed39);
        this['requestPictureTextRefresh'](_0x3d8944);
      }
    }
  }),
  (Game_Screen['prototype'][_0x205d14(0x3b1)] = function (_0x5ca402, _0x5bbe32) {
    const _0x13d126 = _0x205d14;
    (this['_pictureTextRefresh'] = this['_pictureTextRefresh'] || []), (this[_0x13d126(0x49c)](_0x5ca402) || _0x5bbe32) && this[_0x13d126(0x3ec)][_0x13d126(0x1dc)](_0x5ca402);
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x3ee)] = function (_0x1d7939) {
    const _0x100fc4 = _0x205d14;
    return (this[_0x100fc4(0x3ec)] = this[_0x100fc4(0x3ec)] || []), this[_0x100fc4(0x3ec)][_0x100fc4(0x38f)](_0x1d7939);
  }),
  (Game_Screen[_0x205d14(0x39c)][_0x205d14(0x45e)] = function (_0x332d1d) {
    const _0x21b027 = _0x205d14;
    (this['_pictureTextRefresh'] = this[_0x21b027(0x3ec)] || []), this[_0x21b027(0x3ec)]['remove'](_0x332d1d);
  }),
  (Game_Screen['prototype'][_0x205d14(0x49c)] = function (_0x3869ca) {
    const _0x5186e9 = _0x205d14,
      _0x2a7b45 = [_0x5186e9(0x1e9), 'up', _0x5186e9(0x12b), 'left', _0x5186e9(0x113), 'right', _0x5186e9(0x2f4), _0x5186e9(0x4a5), _0x5186e9(0x13b)];
    return _0x2a7b45[_0x5186e9(0x404)](_0x2edf20 => this[_0x5186e9(0x1f0)](_0x3869ca, _0x2edf20) !== '');
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x4a6)] = Game_Party['prototype']['initialize']),
  (Game_Party[_0x205d14(0x39c)][_0x205d14(0x304)] = function () {
    const _0x23439e = _0x205d14;
    VisuMZ[_0x23439e(0x16f)]['Game_Party_initialize']['call'](this), this[_0x23439e(0x474)]();
  }),
  (Game_Party[_0x205d14(0x39c)][_0x205d14(0x474)] = function () {
    this['_lastGainedItemData'] = { type: 0x0, id: 0x0, quantity: 0x0 };
  }),
  (Game_Party[_0x205d14(0x39c)][_0x205d14(0x149)] = function () {
    const _0x5d11d9 = _0x205d14;
    if (this['_lastGainedItemData'] === undefined) this[_0x5d11d9(0x474)]();
    return this[_0x5d11d9(0x289)];
  }),
  (Game_Party[_0x205d14(0x39c)][_0x205d14(0x3cc)] = function (_0x4c47c8, _0x1dfb6b) {
    const _0x1c390d = _0x205d14;
    if (this['_lastGainedItemData'] === undefined) this['initMessageCore']();
    if (!_0x4c47c8) return;
    if (DataManager[_0x1c390d(0x155)](_0x4c47c8)) this[_0x1c390d(0x289)][_0x1c390d(0x45b)] = 0x0;
    else {
      if (DataManager[_0x1c390d(0x403)](_0x4c47c8)) this['_lastGainedItemData']['type'] = 0x1;
      else DataManager[_0x1c390d(0x158)](_0x4c47c8) && (this['_lastGainedItemData']['type'] = 0x2);
    }
    (this[_0x1c390d(0x289)]['id'] = _0x4c47c8['id']), (this[_0x1c390d(0x289)][_0x1c390d(0x4de)] = _0x1dfb6b);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_Party_gainItem'] = Game_Party[_0x205d14(0x39c)][_0x205d14(0x420)]),
  (Game_Party[_0x205d14(0x39c)][_0x205d14(0x420)] = function (_0x23f20c, _0x281f20, _0x1d8036) {
    const _0x341ad5 = _0x205d14;
    VisuMZ[_0x341ad5(0x16f)][_0x341ad5(0x43d)][_0x341ad5(0x34e)](this, _0x23f20c, _0x281f20, _0x1d8036), _0x281f20 > 0x0 && this[_0x341ad5(0x3cc)](_0x23f20c, _0x281f20);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_Map_initialize'] = Game_Map[_0x205d14(0x39c)]['initialize']),
  (Game_Map[_0x205d14(0x39c)][_0x205d14(0x304)] = function () {
    const _0x155792 = _0x205d14;
    VisuMZ[_0x155792(0x16f)]['Game_Map_initialize'][_0x155792(0x34e)](this), (this[_0x155792(0x316)] = []);
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x186)] = Game_Map[_0x205d14(0x39c)][_0x205d14(0x125)]),
  (Game_Map['prototype'][_0x205d14(0x125)] = function () {
    const _0x4bf1b7 = _0x205d14;
    VisuMZ[_0x4bf1b7(0x16f)]['Game_Map_setupEvents']['call'](this), (this[_0x4bf1b7(0x316)] = []);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Game_Map_updateEvents'] = Game_Map['prototype']['updateEvents']),
  (Game_Map[_0x205d14(0x39c)][_0x205d14(0x2b5)] = function () {
    const _0x267f7a = _0x205d14;
    VisuMZ[_0x267f7a(0x16f)][_0x267f7a(0x2f9)]['call'](this), this[_0x267f7a(0x19f)]();
  }),
  (Game_Map[_0x205d14(0x39c)]['addMessageCommonEvent'] = function (_0x3b2647) {
    const _0x24ec31 = _0x205d14;
    if (!$dataCommonEvents[_0x3b2647]) return;
    this[_0x24ec31(0x316)] = this['_messageCommonEvents'] || [];
    const _0x9bd7b4 = this['_interpreter']['_eventId'],
      _0x1b43f2 = new Game_MessageCommonEvent(_0x3b2647, _0x9bd7b4);
    this[_0x24ec31(0x316)][_0x24ec31(0x1dc)](_0x1b43f2);
  }),
  (Game_Map[_0x205d14(0x39c)]['updateMessageCommonEvents'] = function () {
    const _0x1ea09b = _0x205d14;
    this[_0x1ea09b(0x316)] = this['_messageCommonEvents'] || [];
    for (const _0x36d407 of this[_0x1ea09b(0x316)]) {
      !_0x36d407[_0x1ea09b(0x33e)] ? this['_messageCommonEvents'][_0x1ea09b(0x1e0)](_0x36d407) : _0x36d407[_0x1ea09b(0x2ed)]();
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2fa)] = Game_Map['prototype']['refresh']),
  (Game_Map['prototype'][_0x205d14(0x428)] = function () {
    const _0x2c129e = _0x205d14;
    VisuMZ['MessageCore'][_0x2c129e(0x2fa)][_0x2c129e(0x34e)](this), $gameScreen['requestPictureTextRefreshAll']();
  }),
  (Game_Interpreter[_0x205d14(0x1ac)] = pluginData[_0x205d14(0x201)]),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x461)] = function (_0x5d178b) {
    const _0x108621 = _0x205d14;
    if ($gameMessage[_0x108621(0x22b)]()) return ![];
    return this[_0x108621(0x4cb)](_0x5d178b), this[_0x108621(0x220)](_0x5d178b), this[_0x108621(0x384)](_0x5d178b), this[_0x108621(0x1f7)](_0x108621(0x320)), !![];
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x4cb)] = function (_0x50e1c2) {
    const _0x363fe4 = _0x205d14;
    $gameMessage[_0x363fe4(0x1c3)](_0x50e1c2[0x0], _0x50e1c2[0x1]),
      $gameMessage[_0x363fe4(0x467)](_0x50e1c2[0x2]),
      $gameMessage['setPositionType'](_0x50e1c2[0x3]),
      $gameMessage[_0x363fe4(0x46f)](_0x50e1c2[0x4]);
  }),
  (Game_Interpreter['prototype'][_0x205d14(0x220)] = function (_0x589370) {
    const _0x2a21b6 = _0x205d14;
    while (this[_0x2a21b6(0x240)]()) {
      this[_0x2a21b6(0x164)]++;
      if (this[_0x2a21b6(0x4b0)]()['code'] === 0x191) {
        let _0x9eb743 = this[_0x2a21b6(0x4b0)]()[_0x2a21b6(0x287)][0x0];
        (_0x9eb743 = VisuMZ[_0x2a21b6(0x16f)][_0x2a21b6(0x254)](_0x9eb743)), $gameMessage[_0x2a21b6(0x30a)](_0x9eb743);
      }
      if (this[_0x2a21b6(0x339)]()) break;
    }
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x240)] = function () {
    const _0x45111b = _0x205d14;
    return this[_0x45111b(0x3b3)]() === 0x65 && $gameSystem[_0x45111b(0x40d)]() > 0x4 ? !![] : this['nextEventCode']() === 0x191;
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x254)] = function (_0x3285d2) {
    const _0x204ede = _0x205d14,
      _0x510d09 = VisuMZ[_0x204ede(0x16f)][_0x204ede(0x26d)][_0x204ede(0x413)];
    return (
      (_0x3285d2 = (_0x510d09[_0x204ede(0x3d5)] || '') + _0x3285d2 + (_0x510d09[_0x204ede(0x1fd)] || '')),
      (_0x3285d2 = _0x3285d2[_0x204ede(0x351)](/<(?:NEXT PAGE|NEXTPAGE)>/gi, '')),
      (_0x3285d2 = _0x3285d2[_0x204ede(0x351)](/<(?:RNG|RAND|RANDOM)>(.*?)<\/(?:RNG|RAND|RANDOM)>/gi, (_0x333414, _0x28464a) => this[_0x204ede(0x12a)](_0x28464a))),
      _0x3285d2
    );
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x12a)] = function (_0x194e30) {
    const _0x51cd55 = _0x205d14,
      _0x20778b = _0x194e30[_0x51cd55(0x41c)]('|')
        [_0x51cd55(0x203)](_0xca5096 => _0xca5096[_0x51cd55(0x28e)]())
        [_0x51cd55(0x1e0)]('')
        [_0x51cd55(0x1e0)](null);
    return _0x20778b[Math[_0x51cd55(0x34a)](_0x20778b[_0x51cd55(0x3d7)])];
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x339)] = function () {
    const _0x1ec19c = _0x205d14;
    if (this[_0x1ec19c(0x4b0)]() && this[_0x1ec19c(0x4b0)]()[_0x1ec19c(0x287)][0x0][_0x1ec19c(0x127)](/<(?:NEXT PAGE|NEXTPAGE)>/gi)) return !![];
    return $gameMessage['_texts'][_0x1ec19c(0x3d7)] >= $gameSystem[_0x1ec19c(0x40d)]() && this[_0x1ec19c(0x3b3)]() !== 0x191;
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x384)] = function (_0x460899) {
    const _0x9cd6ae = _0x205d14;
    switch (this[_0x9cd6ae(0x3b3)]()) {
      case 0x66:
        this['_index']++, this['setupChoices'](this[_0x9cd6ae(0x4b0)]()[_0x9cd6ae(0x287)]);
        break;
      case 0x67:
        this[_0x9cd6ae(0x164)]++, this[_0x9cd6ae(0x4ac)](this['currentCommand']()[_0x9cd6ae(0x287)]);
        break;
      case 0x68:
        this[_0x9cd6ae(0x164)]++, this[_0x9cd6ae(0x4bd)](this['currentCommand']()[_0x9cd6ae(0x287)]);
        break;
      case 0x165:
        const _0x3f628a = this[_0x9cd6ae(0x38a)][this[_0x9cd6ae(0x164)] + 0x1],
          _0x466d64 = _0x3f628a[_0x9cd6ae(0x287)];
        _0x466d64[0x0] === Game_Interpreter[_0x9cd6ae(0x1ac)] && this[_0x9cd6ae(0x4d1)](_0x466d64);
        break;
    }
  }),
  (VisuMZ['MessageCore']['Game_Interpreter_setupChoices'] = Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x40a)]),
  (Game_Interpreter['prototype'][_0x205d14(0x40a)] = function (_0xfb7214) {
    const _0x90f272 = _0x205d14;
    (_0xfb7214 = this[_0x90f272(0x112)]()), VisuMZ[_0x90f272(0x16f)][_0x90f272(0x424)][_0x90f272(0x34e)](this, _0xfb7214), $gameMessage['setupShuffleChoices']();
  }),
  (Game_Interpreter['prototype']['addContinuousShowChoices'] = function () {
    const _0x20035b = _0x205d14,
      _0x2403f1 = this['_index'],
      _0x43fca2 = [];
    let _0x387fa0 = 0x0;
    this[_0x20035b(0x164)]++;
    while (this[_0x20035b(0x164)] < this[_0x20035b(0x38a)][_0x20035b(0x3d7)]) {
      if (this[_0x20035b(0x4b0)]()[_0x20035b(0x4e5)] === this['_indent']) {
        if (this[_0x20035b(0x4b0)]()['code'] === 0x194 && this[_0x20035b(0x3b3)]() !== 0x66) break;
        else {
          if (this['currentCommand']()['code'] === 0x66) this[_0x20035b(0x398)](_0x387fa0, this[_0x20035b(0x4b0)](), _0x2403f1), (this['_index'] -= 0x2);
          else this['currentCommand']()[_0x20035b(0x36d)] === 0x192 && ((this[_0x20035b(0x4b0)]()[_0x20035b(0x287)][0x0] = _0x387fa0), _0x387fa0++);
        }
      }
      this['_index']++;
    }
    return (this['_index'] = _0x2403f1), this[_0x20035b(0x4b0)]()[_0x20035b(0x287)];
  }),
  (Game_Interpreter['prototype'][_0x205d14(0x398)] = function (_0x405661, _0x1dd4b6, _0x2a7ef9) {
    const _0x6b8e8e = _0x205d14;
    this[_0x6b8e8e(0x4b7)](_0x405661, _0x1dd4b6, _0x2a7ef9), this[_0x6b8e8e(0x442)](_0x405661, _0x1dd4b6, _0x2a7ef9), this[_0x6b8e8e(0x128)](_0x1dd4b6, _0x2a7ef9);
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x4b7)] = function (_0x4245b0, _0x2a8ed0, _0x2861af) {
    const _0x538f3e = _0x205d14;
    if (_0x2a8ed0[_0x538f3e(0x287)][0x2] < 0x0) return;
    const _0x49a06f = _0x2a8ed0[_0x538f3e(0x287)][0x2] + _0x4245b0;
    this[_0x538f3e(0x38a)][_0x2861af][_0x538f3e(0x287)][0x2] = _0x49a06f;
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x442)] = function (_0xf5d02f, _0x2af50d, _0x213e82) {
    const _0x98764b = _0x205d14;
    if (_0x2af50d[_0x98764b(0x287)][0x1] >= 0x0) {
      var _0x1879f8 = _0x2af50d[_0x98764b(0x287)][0x1] + _0xf5d02f;
      this['_list'][_0x213e82][_0x98764b(0x287)][0x1] = _0x1879f8;
    } else _0x2af50d[_0x98764b(0x287)][0x1] === -0x2 && (this[_0x98764b(0x38a)][_0x213e82][_0x98764b(0x287)][0x1] = _0x2af50d[_0x98764b(0x287)][0x1]);
  }),
  (Game_Interpreter['prototype'][_0x205d14(0x128)] = function (_0x1eff6d, _0x5be4ef) {
    const _0x3ac44a = _0x205d14;
    for (const _0x2806b5 of _0x1eff6d[_0x3ac44a(0x287)][0x0]) {
      this['_list'][_0x5be4ef]['parameters'][0x0][_0x3ac44a(0x1dc)](_0x2806b5);
    }
    this[_0x3ac44a(0x38a)][_0x3ac44a(0x39d)](this[_0x3ac44a(0x164)] - 0x1, 0x2);
  }),
  (Game_Interpreter['prototype'][_0x205d14(0x4d1)] = function (_0x36d215) {
    const _0x48efce = _0x205d14,
      _0x332e18 = _0x36d215[0x1];
    if (_0x332e18 === _0x48efce(0x3e4)) this['_index']++, this['setWeaponChoice'](_0x36d215);
    else {
      if (_0x332e18 === _0x48efce(0x156)) this['_index']++, this[_0x48efce(0x31f)](_0x36d215);
      else _0x332e18 === _0x48efce(0x416) && Imported[_0x48efce(0x3a6)] && (this[_0x48efce(0x164)]++, this[_0x48efce(0x308)](_0x36d215));
    }
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x1a8)] = function (_0xa9b600) {
    const _0x511e16 = _0x205d14,
      _0xb2a02b = JSON[_0x511e16(0x4d0)](JSON[_0x511e16(0x31e)](_0xa9b600[0x3]));
    VisuMZ['ConvertParams'](_0xb2a02b, _0xb2a02b), $gameMessage[_0x511e16(0x1a8)](_0xb2a02b[_0x511e16(0x2cb)] || 0x0, _0xb2a02b['WeaponTypeID'] || 0x0);
  }),
  (Game_Interpreter['prototype']['setArmorChoice'] = function (_0x20ad9d) {
    const _0x2d343f = _0x205d14,
      _0x3018cd = JSON[_0x2d343f(0x4d0)](JSON[_0x2d343f(0x31e)](_0x20ad9d[0x3]));
    VisuMZ[_0x2d343f(0x377)](_0x3018cd, _0x3018cd), $gameMessage['setArmorChoice'](_0x3018cd[_0x2d343f(0x2cb)] || 0x0, _0x3018cd[_0x2d343f(0x3f9)] || 0x0, _0x3018cd[_0x2d343f(0x441)] || 0x0);
  }),
  (Game_Interpreter[_0x205d14(0x39c)][_0x205d14(0x308)] = function (_0x433780) {
    const _0x333072 = _0x205d14,
      _0x51ff88 = JSON[_0x333072(0x4d0)](JSON['stringify'](_0x433780[0x3]));
    VisuMZ[_0x333072(0x377)](_0x51ff88, _0x51ff88), $gameMessage[_0x333072(0x308)](_0x51ff88['VariableID'] || 0x0, _0x51ff88[_0x333072(0x23e)] || 0x0, _0x51ff88['SkillTypeID'] || 0x0);
  });
function Game_MessageCommonEvent() {
  const _0x3d4102 = _0x205d14;
  this[_0x3d4102(0x304)](...arguments);
}
(Game_MessageCommonEvent[_0x205d14(0x39c)][_0x205d14(0x304)] = function (_0x814749, _0xd26085) {
  const _0xf6a409 = _0x205d14;
  (this[_0xf6a409(0x2ef)] = _0x814749), (this[_0xf6a409(0x1a3)] = _0xd26085 || 0x0), this[_0xf6a409(0x428)]();
}),
  (Game_MessageCommonEvent['prototype'][_0x205d14(0x3a3)] = function () {
    const _0x34ec5f = _0x205d14;
    return $dataCommonEvents[this[_0x34ec5f(0x2ef)]];
  }),
  (Game_MessageCommonEvent[_0x205d14(0x39c)]['list'] = function () {
    const _0xaf5446 = _0x205d14;
    return this[_0xaf5446(0x3a3)]()[_0xaf5446(0x150)];
  }),
  (Game_MessageCommonEvent[_0x205d14(0x39c)][_0x205d14(0x428)] = function () {
    const _0x125630 = _0x205d14;
    (this[_0x125630(0x33e)] = new Game_Interpreter()), this[_0x125630(0x33e)][_0x125630(0x143)](this[_0x125630(0x150)](), this[_0x125630(0x1a3)]);
  }),
  (Game_MessageCommonEvent[_0x205d14(0x39c)]['update'] = function () {
    const _0x218d06 = _0x205d14;
    this[_0x218d06(0x33e)] && (this[_0x218d06(0x33e)][_0x218d06(0x44d)]() ? this[_0x218d06(0x33e)][_0x218d06(0x2ed)]() : this[_0x218d06(0x2a4)]());
  }),
  (Game_MessageCommonEvent[_0x205d14(0x39c)]['clear'] = function () {
    const _0x69cad3 = _0x205d14;
    this[_0x69cad3(0x33e)] = null;
  }),
  (Scene_Message[_0x205d14(0x39c)][_0x205d14(0x4ec)] = function () {
    const _0x55500b = _0x205d14,
      _0x401455 = Math[_0x55500b(0x1d6)](Graphics['width'], $gameSystem['getMessageWindowWidth']()),
      _0x1b6fb6 = $gameSystem[_0x55500b(0x40d)](),
      _0x1266ba = this['calcWindowHeight'](_0x1b6fb6, ![]),
      _0x13c308 = (Graphics[_0x55500b(0x246)] - _0x401455) / 0x2,
      _0x4804fa = 0x0;
    return new Rectangle(_0x13c308, _0x4804fa, _0x401455, _0x1266ba);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Scene_Message_createChoiceListWindow'] = Scene_Message[_0x205d14(0x39c)][_0x205d14(0x386)]),
  (Scene_Message[_0x205d14(0x39c)]['createChoiceListWindow'] = function () {
    const _0x34a630 = _0x205d14;
    VisuMZ['MessageCore'][_0x34a630(0x1f2)]['call'](this), this['createChoiceListHelpWindow']();
  }),
  (Scene_Message[_0x205d14(0x39c)]['createChoiceListHelpWindow'] = function () {
    const _0x10f897 = _0x205d14,
      _0x626425 = this[_0x10f897(0x1ae)](),
      _0x20904f = new Window_Help(_0x626425);
    _0x20904f[_0x10f897(0x192)](),
      this[_0x10f897(0x247)][_0x10f897(0x41f)](_0x20904f),
      this[_0x10f897(0x2af)][_0x10f897(0x1cc)](_0x20904f),
      this[_0x10f897(0x1ab)](_0x20904f),
      (this[_0x10f897(0x33f)] = _0x20904f);
  }),
  (Scene_Message[_0x205d14(0x39c)]['choiceListHelpWindowRect'] = function () {
    const _0x15b7d3 = _0x205d14,
      _0x3329d2 = 0x0,
      _0xd5912 = 0x0,
      _0x5722f7 = Graphics[_0x15b7d3(0x246)],
      _0xcd7d87 = this[_0x15b7d3(0x4c9)](0x2, ![]);
    return new Rectangle(_0x3329d2, _0xd5912, _0x5722f7, _0xcd7d87);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x1cc)] = function (_0x5699bb) {
    const _0x5730a5 = _0x205d14;
    this[_0x5730a5(0x33f)] = _0x5699bb;
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x2b0)] = function () {
    const _0x5a459f = _0x205d14;
    if (!this[_0x5a459f(0x33f)]) return;
    const _0x77ba95 = this[_0x5a459f(0x33f)];
    _0x77ba95 && (_0x77ba95['y'] = this['y'] > 0x0 ? 0x0 : Graphics['boxHeight'] - _0x77ba95[_0x5a459f(0x1da)]);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x228)] = Scene_Options[_0x205d14(0x39c)][_0x205d14(0x151)]),
  (Scene_Options[_0x205d14(0x39c)]['maxCommands'] = function () {
    const _0x27113e = _0x205d14;
    let _0x4a0916 = VisuMZ[_0x27113e(0x16f)]['Scene_Options_maxCommands'][_0x27113e(0x34e)](this);
    const _0xa671ae = VisuMZ[_0x27113e(0x16f)][_0x27113e(0x26d)];
    if (_0xa671ae['TextSpeed'][_0x27113e(0x1e5)]) {
      _0xa671ae['Localization'][_0x27113e(0x447)] && TextManager[_0x27113e(0x17e)]() && _0x4a0916++;
      if (_0xa671ae['TextSpeed'][_0x27113e(0x447)]) _0x4a0916++;
    }
    return _0x4a0916;
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x3db)] = Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x494)]),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x494)] = function () {
    const _0x47cd3c = _0x205d14;
    VisuMZ['MessageCore'][_0x47cd3c(0x3db)][_0x47cd3c(0x34e)](this), this[_0x47cd3c(0x394)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x417)] = Sprite_Picture[_0x205d14(0x39c)]['update']),
  (Sprite_Picture[_0x205d14(0x39c)]['update'] = function () {
    const _0x39365c = _0x205d14;
    VisuMZ['MessageCore'][_0x39365c(0x417)][_0x39365c(0x34e)](this), this[_0x39365c(0x32b)]();
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x32b)] = function () {
    const _0x408704 = _0x205d14;
    if (!this[_0x408704(0x40f)]) return;
    this['resizePictureText'](), this[_0x408704(0x414)](), this[_0x408704(0x222)](), this[_0x408704(0x1d1)]();
  }),
  (Sprite_Picture['prototype'][_0x205d14(0x394)] = function () {
    const _0x2e4846 = _0x205d14;
    if (this[_0x2e4846(0x4af)]) return;
    if (this[_0x2e4846(0x45d)]) return;
    const _0x9b7f90 = new Rectangle(0x0, 0x0, 0x0, 0x0);
    (this[_0x2e4846(0x4af)] = new Window_Base(_0x9b7f90)),
      (this[_0x2e4846(0x4af)][_0x2e4846(0x344)] = 0x0),
      (this[_0x2e4846(0x45d)] = new Sprite()),
      this[_0x2e4846(0x14f)](this[_0x2e4846(0x45d)], 0x0),
      (this[_0x2e4846(0x32f)] = 0x0),
      (this[_0x2e4846(0x341)] = 0x0),
      (this['_pictureTextCache'] = {});
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x4e1)] = function () {
    const _0x18c709 = _0x205d14;
    if (!this['_pictureTextWindow']) return;
    if (this[_0x18c709(0x32f)] === this[_0x18c709(0x17d)] && this['_pictureTextHeight'] === this[_0x18c709(0x1da)]) return;
    (this[_0x18c709(0x32f)] = this[_0x18c709(0x17d)]),
      (this['_pictureTextHeight'] = this[_0x18c709(0x1da)]),
      (this[_0x18c709(0x23d)] = {}),
      this[_0x18c709(0x4af)][_0x18c709(0x36e)](0x0, 0x0, this[_0x18c709(0x17d)], this['height']);
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x414)] = function () {
    const _0x43218c = _0x205d14;
    if (!this[_0x43218c(0x45d)]) return;
    (this[_0x43218c(0x45d)][_0x43218c(0x30d)]['x'] = this['anchor']['x']), (this[_0x43218c(0x45d)]['anchor']['y'] = this[_0x43218c(0x30d)]['y']);
  }),
  (Sprite_Picture[_0x205d14(0x39c)]['drawPictureText'] = function () {
    const _0x5486f1 = _0x205d14;
    if (!this[_0x5486f1(0x4af)]) return;
    if (!this[_0x5486f1(0x38b)]()) return;
    const _0x4adc63 = ['upperleft', 'up', 'upperright', _0x5486f1(0x22e), _0x5486f1(0x113), 'right', _0x5486f1(0x2f4), _0x5486f1(0x4a5), _0x5486f1(0x13b)];
    this['_pictureTextWindow'][_0x5486f1(0x3d1)]();
    for (const _0x6ef507 of _0x4adc63) {
      this[_0x5486f1(0x380)](_0x6ef507);
    }
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x38b)] = function () {
    const _0x4d303a = _0x205d14;
    if ($gameScreen[_0x4d303a(0x3ee)](this[_0x4d303a(0x26c)])) return !![];
    const _0x1f326a = ['upperleft', 'up', _0x4d303a(0x12b), _0x4d303a(0x22e), _0x4d303a(0x113), 'right', _0x4d303a(0x2f4), _0x4d303a(0x4a5), _0x4d303a(0x13b)];
    for (const _0x13beda of _0x1f326a) {
      const _0x40c0fb = $gameScreen[_0x4d303a(0x1f0)](this[_0x4d303a(0x26c)], _0x13beda);
      if (this[_0x4d303a(0x23d)][_0x13beda] === _0x40c0fb) continue;
      return !![];
    }
    return ![];
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x380)] = function (_0x1b6383) {
    const _0x5d47be = _0x205d14;
    $gameScreen[_0x5d47be(0x45e)](this['_pictureId']);
    const _0x4f9c02 = $gameScreen['getPictureText'](this[_0x5d47be(0x26c)], _0x1b6383);
    this['_pictureTextCache'][_0x1b6383] = _0x4f9c02;
    const _0xa4889 = this[_0x5d47be(0x4af)][_0x5d47be(0x3b2)](_0x4f9c02);
    let _0x8ede3c = $gameScreen[_0x5d47be(0x40c)](this[_0x5d47be(0x26c)]),
      _0x1410e0 = _0x8ede3c,
      _0x1fe4e0 = _0x8ede3c;
    if (['up', _0x5d47be(0x113), _0x5d47be(0x4a5)]['includes'](_0x1b6383)) _0x1410e0 = Math['floor']((this[_0x5d47be(0x17d)] - _0xa4889['width']) / 0x2);
    else [_0x5d47be(0x12b), 'right', 'lowerright'][_0x5d47be(0x38f)](_0x1b6383) && (_0x1410e0 = Math['floor'](this[_0x5d47be(0x17d)] - _0xa4889[_0x5d47be(0x17d)] - _0x8ede3c));
    if (['left', _0x5d47be(0x113), _0x5d47be(0x270)][_0x5d47be(0x38f)](_0x1b6383)) _0x1fe4e0 = Math[_0x5d47be(0x4ef)]((this[_0x5d47be(0x1da)] - _0xa4889[_0x5d47be(0x1da)]) / 0x2);
    else [_0x5d47be(0x2f4), _0x5d47be(0x4a5), _0x5d47be(0x13b)]['includes'](_0x1b6383) && (_0x1fe4e0 = Math[_0x5d47be(0x4ef)](this[_0x5d47be(0x1da)] - _0xa4889[_0x5d47be(0x1da)] - _0x8ede3c));
    this[_0x5d47be(0x4af)][_0x5d47be(0x334)](_0x4f9c02, _0x1410e0, _0x1fe4e0);
  }),
  (Sprite_Picture[_0x205d14(0x39c)][_0x205d14(0x1d1)] = function () {
    const _0x36c120 = _0x205d14;
    if (!this[_0x36c120(0x4af)]) return;
    if (!this[_0x36c120(0x45d)]) return;
    this[_0x36c120(0x45d)][_0x36c120(0x24e)] = this[_0x36c120(0x4af)]['contents'];
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x210)] = Window_Base[_0x205d14(0x39c)][_0x205d14(0x304)]),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x304)] = function (_0xc47bdb) {
    const _0x3ed0fe = _0x205d14;
    this['initMessageCore'](_0xc47bdb), VisuMZ[_0x3ed0fe(0x16f)][_0x3ed0fe(0x210)]['call'](this, _0xc47bdb);
  }),
  (Window_Base['prototype']['initMessageCore'] = function (_0x1441ef) {
    const _0xdccda6 = _0x205d14;
    this[_0xdccda6(0x1c9)](), this['resetWordWrap'](), this[_0xdccda6(0x160)](_0x1441ef);
  }),
  (Window_Base['prototype'][_0x205d14(0x1c9)] = function () {
    const _0x2a0e75 = _0x205d14;
    this[_0x2a0e75(0x32d)](_0x2a0e75(0x119));
  }),
  (Window_Base[_0x205d14(0x39c)]['setTextAlignment'] = function (_0x5740a1) {
    const _0x2b6307 = _0x205d14;
    this[_0x2b6307(0x16e)] = _0x5740a1;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x471)] = function () {
    const _0x4064e4 = _0x205d14;
    return this[_0x4064e4(0x16e)];
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x4d9)] = Window_Base['prototype'][_0x205d14(0x3b2)]),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x3b2)] = function (_0x5b439a) {
    const _0x126010 = _0x205d14;
    return this[_0x126010(0x4a7)](), VisuMZ[_0x126010(0x16f)][_0x126010(0x4d9)][_0x126010(0x34e)](this, _0x5b439a);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x45a)] = function (_0x1a5ebd) {
    const _0x131bed = _0x205d14;
    return VisuMZ[_0x131bed(0x16f)]['Window_Base_textSizeEx'][_0x131bed(0x34e)](this, _0x1a5ebd);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x37f)] = Window_Base[_0x205d14(0x39c)][_0x205d14(0x400)]),
  (Window_Base[_0x205d14(0x39c)]['processAllText'] = function (_0x309449) {
    const _0x4d0513 = _0x205d14;
    VisuMZ[_0x4d0513(0x16f)]['Window_Base_processAllText'][_0x4d0513(0x34e)](this, _0x309449);
    if (_0x309449['drawing']) this[_0x4d0513(0x32d)]('default');
  }),
  (Window_Base['prototype']['resetWordWrap'] = function () {
    const _0x3f43d6 = _0x205d14;
    this[_0x3f43d6(0x497)](![]);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x142)] = function () {
    const _0x28a856 = _0x205d14;
    return this[_0x28a856(0x335)];
  }),
  (Window_Base[_0x205d14(0x39c)]['setWordWrap'] = function (_0x5f3c88) {
    return (this['_wordWrap'] = _0x5f3c88), '';
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x160)] = function (_0x4d3fcc) {
    this['_resetRect'] = JsonEx['makeDeepCopy'](_0x4d3fcc);
  }),
  (Window_Base[_0x205d14(0x39c)]['resetFontSettings'] = function () {
    const _0x57bf51 = _0x205d14;
    (this[_0x57bf51(0x3a0)][_0x57bf51(0x2a9)] = $gameSystem[_0x57bf51(0x31a)]()),
      (this[_0x57bf51(0x3a0)]['fontSize'] = $gameSystem[_0x57bf51(0x2aa)]()),
      (this['contents'][_0x57bf51(0x2eb)] = ![]),
      (this[_0x57bf51(0x3a0)][_0x57bf51(0x3dc)] = ![]),
      (this[_0x57bf51(0x25d)] = 0x0),
      (this[_0x57bf51(0x478)] = !![]),
      this['resetTextColor']();
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x15e)] = function () {
    const _0x1d15b4 = _0x205d14;
    this[_0x1d15b4(0x1db)](ColorManager[_0x1d15b4(0x2c2)]()), this[_0x1d15b4(0x496)](ColorManager[_0x1d15b4(0x237)]());
    const _0x592de9 = VisuMZ['MessageCore'][_0x1d15b4(0x26d)][_0x1d15b4(0x413)];
    _0x592de9['DefaultOutlineWidth'] === undefined && (_0x592de9[_0x1d15b4(0x4cf)] = 0x3), (this['contents'][_0x1d15b4(0x2a5)] = _0x592de9[_0x1d15b4(0x4cf)]), this[_0x1d15b4(0x2e7)](![]);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2e7)] = function (_0x3cf15c) {
    this['_colorLock'] = _0x3cf15c;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x195)] = function () {
    const _0x55a0c6 = _0x205d14;
    return this[_0x55a0c6(0x3bb)];
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x161)] = function () {
    return ![];
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x372)] = function () {
    const _0xc20512 = _0x205d14,
      _0x5284e3 = [_0xc20512(0x2a9), _0xc20512(0x327), 'fontBold', 'fontItalic', _0xc20512(0x2e9), _0xc20512(0x1cb), _0xc20512(0x2a5), 'paintOpacity'];
    let _0x4ec71a = {};
    for (const _0x7d354b of _0x5284e3) {
      _0x4ec71a[_0x7d354b] = this[_0xc20512(0x3a0)][_0x7d354b];
    }
    return _0x4ec71a;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4d4)] = function (_0x3997ac) {
    for (const _0x4b2ba2 in _0x3997ac) {
      this['contents'][_0x4b2ba2] = _0x3997ac[_0x4b2ba2];
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x311)] = Window_Base['prototype'][_0x205d14(0x2ed)]),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2ed)] = function () {
    const _0x2d432e = _0x205d14;
    VisuMZ['MessageCore'][_0x2d432e(0x311)][_0x2d432e(0x34e)](this), this[_0x2d432e(0x4e0)]();
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4ab)] = function () {
    return ![];
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4e0)] = function () {
    const _0x49d23d = _0x205d14;
    this[_0x49d23d(0x1a1)] > 0x0 &&
      (this[_0x49d23d(0x4ab)]() &&
        ((this['x'] = this[_0x49d23d(0x35d)](this['x'], this[_0x49d23d(0x2a6)])),
        (this['y'] = this[_0x49d23d(0x35d)](this['y'], this[_0x49d23d(0x152)])),
        (this['width'] = this[_0x49d23d(0x35d)](this[_0x49d23d(0x17d)], this['_moveTargetWidth'])),
        (this[_0x49d23d(0x1da)] = this[_0x49d23d(0x35d)](this['height'], this[_0x49d23d(0x476)])),
        this['clampPlacementPosition']()),
      this[_0x49d23d(0x1a1)]--);
  }),
  (Window_Base[_0x205d14(0x39c)]['clampPlacementPosition'] = function (_0x3fb382, _0xf0d7bc) {
    const _0x17f2ab = _0x205d14;
    !_0x3fb382 && ((this['width'] = Math[_0x17f2ab(0x1d6)](this[_0x17f2ab(0x17d)], Graphics['width'])), (this[_0x17f2ab(0x1da)] = Math['min'](this[_0x17f2ab(0x1da)], Graphics[_0x17f2ab(0x1da)])));
    if (!_0xf0d7bc) {
      const _0x506d10 = -(Math[_0x17f2ab(0x4ef)](Graphics[_0x17f2ab(0x17d)] - Graphics['boxWidth']) / 0x2),
        _0x4ab635 = _0x506d10 + Graphics[_0x17f2ab(0x17d)] - this[_0x17f2ab(0x17d)],
        _0x16a330 = -(Math['floor'](Graphics['height'] - Graphics[_0x17f2ab(0x3c3)]) / 0x2),
        _0x2df1c0 = _0x16a330 + Graphics[_0x17f2ab(0x1da)] - this[_0x17f2ab(0x1da)];
      (this['x'] = this['x']['clamp'](_0x506d10, _0x4ab635)), (this['y'] = this['y'][_0x17f2ab(0x41e)](_0x16a330, _0x2df1c0));
    }
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x35d)] = function (_0x46916e, _0x37de60) {
    const _0x404186 = _0x205d14,
      _0x3be1d7 = this[_0x404186(0x1a1)],
      _0x3a6e82 = this[_0x404186(0x388)],
      _0x715d1d = this['calcMoveEasing']((_0x3a6e82 - _0x3be1d7) / _0x3a6e82),
      _0x210000 = this['calcMoveEasing']((_0x3a6e82 - _0x3be1d7 + 0x1) / _0x3a6e82),
      _0x4ae06d = (_0x46916e - _0x37de60 * _0x715d1d) / (0x1 - _0x715d1d);
    return _0x4ae06d + (_0x37de60 - _0x4ae06d) * _0x210000;
  }),
  (Window_Base['prototype'][_0x205d14(0x361)] = function (_0x15061e) {
    const _0x162c7f = _0x205d14,
      _0x327dc7 = 0x2;
    switch (this['_moveEasingType']) {
      case 0x0:
        return _0x15061e;
      case 0x1:
        return this[_0x162c7f(0x3c6)](_0x15061e, _0x327dc7);
      case 0x2:
        return this[_0x162c7f(0x49d)](_0x15061e, _0x327dc7);
      case 0x3:
        return this[_0x162c7f(0x299)](_0x15061e, _0x327dc7);
      default:
        return Imported[_0x162c7f(0x4e6)] ? VisuMZ['applyMoveEasing'](_0x15061e, this[_0x162c7f(0x4b9)]) : _0x15061e;
    }
  }),
  (Window_Base['prototype'][_0x205d14(0x3b5)] = function (_0x1bfda7, _0x385d4c, _0x4a8806, _0x3c5787, _0xa4ab11, _0x3cebd7) {
    const _0x273db1 = _0x205d14;
    (this[_0x273db1(0x2a6)] = _0x1bfda7),
      (this[_0x273db1(0x152)] = _0x385d4c),
      (this[_0x273db1(0x39e)] = _0x4a8806 || this[_0x273db1(0x17d)]),
      (this[_0x273db1(0x476)] = _0x3c5787 || this[_0x273db1(0x1da)]),
      (this[_0x273db1(0x1a1)] = _0xa4ab11 || 0x1);
    if (this['_moveDuration'] <= 0x0) this['_moveDuration'] = 0x1;
    (this['_wholeMoveDuration'] = this[_0x273db1(0x1a1)]), (this[_0x273db1(0x4b9)] = _0x3cebd7 || 0x0);
    if (_0xa4ab11 <= 0x0) this[_0x273db1(0x4e0)]();
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2c1)] = function (_0x4f504a, _0x2e9099, _0x2c1561, _0x30e977, _0x2443d5, _0x267964) {
    const _0x3ffdd3 = _0x205d14;
    (this[_0x3ffdd3(0x2a6)] = this['x'] + _0x4f504a),
      (this[_0x3ffdd3(0x152)] = this['y'] + _0x2e9099),
      (this['_moveTargetWidth'] = this[_0x3ffdd3(0x17d)] + (_0x2c1561 || 0x0)),
      (this[_0x3ffdd3(0x476)] = this[_0x3ffdd3(0x1da)] + (_0x30e977 || 0x0)),
      (this['_moveDuration'] = _0x2443d5 || 0x1);
    if (this[_0x3ffdd3(0x1a1)] <= 0x0) this[_0x3ffdd3(0x1a1)] = 0x1;
    (this[_0x3ffdd3(0x388)] = this['_moveDuration']), (this[_0x3ffdd3(0x4b9)] = _0x267964 || 0x0);
    if (_0x2443d5 <= 0x0) this[_0x3ffdd3(0x4e0)]();
  }),
  (Window_Base['prototype'][_0x205d14(0x208)] = function (_0x413584, _0x2fe535) {
    const _0x310880 = _0x205d14;
    this[_0x310880(0x3b5)](this[_0x310880(0x4e8)]['x'], this[_0x310880(0x4e8)]['y'], this[_0x310880(0x4e8)]['width'], this[_0x310880(0x4e8)][_0x310880(0x1da)], _0x413584, _0x2fe535);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x4f1)] = Window_Base[_0x205d14(0x39c)][_0x205d14(0x1db)]),
  (Window_Base['prototype'][_0x205d14(0x1db)] = function (_0x291bf5) {
    const _0x5a46b1 = _0x205d14;
    if (this[_0x5a46b1(0x195)]()) return;
    (_0x291bf5 = _0x291bf5[_0x5a46b1(0x351)](/\,/g, '')),
      (this[_0x5a46b1(0x433)] = this[_0x5a46b1(0x433)] || []),
      this[_0x5a46b1(0x433)][_0x5a46b1(0x39b)](this[_0x5a46b1(0x3a0)][_0x5a46b1(0x2e9)]),
      VisuMZ[_0x5a46b1(0x16f)][_0x5a46b1(0x4f1)]['call'](this, _0x291bf5);
  }),
  (Window_Base['prototype'][_0x205d14(0x21c)] = function (_0x26bf2c) {
    const _0x285d29 = _0x205d14;
    this[_0x285d29(0x24d)](_0x26bf2c);
    if (this[_0x285d29(0x195)]()) return;
    _0x26bf2c[_0x285d29(0x1d0)] &&
      ((this[_0x285d29(0x433)] = this[_0x285d29(0x433)] || []), (this[_0x285d29(0x3a0)]['textColor'] = this[_0x285d29(0x433)]['shift']() || ColorManager[_0x285d29(0x2c2)]()));
  }),
  (Window_Base[_0x205d14(0x39c)]['convertEscapeCharacters'] = function (_0x30a734) {
    const _0x1a983a = _0x205d14;
    return (
      (_0x30a734 = this[_0x1a983a(0x383)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x1a0)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x115)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x3ff)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x1dd)](_0x30a734)),
      (_0x30a734 = this['convertShowChoiceEscapeCodes'](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x1ea)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x425)](_0x30a734)),
      (_0x30a734 = this['convertLockColorsEscapeCharacters'](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x190)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x2f2)](_0x30a734)),
      (_0x30a734 = this['convertHardcodedEscapeReplacements'](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x3c7)](_0x30a734)),
      (_0x30a734 = this['convertMessageCoreEscapeReplacements'](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x21d)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x115)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x17a)](_0x30a734)),
      (_0x30a734 = this[_0x1a983a(0x24f)](_0x30a734)),
      _0x30a734
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x383)] = function (_0x2244b3) {
    const _0x48a07d = _0x205d14;
    this[_0x48a07d(0x405)] = ![];
    for (const _0x19a5ec of VisuMZ['MessageCore']['Settings'][_0x48a07d(0x4ae)]) {
      _0x2244b3 &&
        _0x2244b3[_0x48a07d(0x127)](_0x19a5ec[_0x48a07d(0x1d5)]) &&
        ((this[_0x48a07d(0x405)] = !![]), (_0x2244b3 = _0x2244b3[_0x48a07d(0x351)](_0x19a5ec[_0x48a07d(0x1d5)], _0x19a5ec['textCodeResult'][_0x48a07d(0x3cf)](this))));
    }
    return _0x2244b3 || '';
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1a0)] = function (_0x277c74) {
    const _0x557491 = _0x205d14;
    return (_0x277c74 = _0x277c74[_0x557491(0x351)](/\\/g, '\x1b')), (_0x277c74 = _0x277c74['replace'](/\x1b\x1b/g, '\x5c')), _0x277c74;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x115)] = function (_0x1e4938) {
    const _0x7e78fa = _0x205d14;
    for (;;) {
      if (_0x1e4938[_0x7e78fa(0x127)](/\\V\[(\d+)\]/gi))
        _0x1e4938 = _0x1e4938[_0x7e78fa(0x351)](/\\V\[(\d+)\]/gi, (_0x152363, _0x46a23f) => this['convertBackslashCharacters'](String($gameVariables['value'](parseInt(_0x46a23f)))));
      else {
        if (_0x1e4938['match'](/\x1bV\[(\d+)\]/gi))
          _0x1e4938 = _0x1e4938[_0x7e78fa(0x351)](/\x1bV\[(\d+)\]/gi, (_0xf19361, _0x277f59) => this['convertBackslashCharacters'](String($gameVariables[_0x7e78fa(0x396)](parseInt(_0x277f59)))));
        else break;
      }
    }
    return _0x1e4938;
  }),
  (Window_Base['prototype'][_0x205d14(0x3ff)] = function (_0x1c7d68) {
    const _0x486be9 = _0x205d14;
    return (
      Imported['VisuMZ_0_CoreEngine'] &&
        ((_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Up (?:KEY|BUTTON)>/gi, this['convertButtonAssistText']('up'))),
        (_0x1c7d68 = _0x1c7d68['replace'](/<Left (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x22e)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Right (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x270)))),
        (_0x1c7d68 = _0x1c7d68['replace'](/<Down (?:KEY|BUTTON)>/gi, this['convertButtonAssistText'](_0x486be9(0x4a5)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Ok (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)]('ok'))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Cancel (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x28c)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Menu (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x1b6)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<Shift (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x470)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<(?:PAGEUP|PAGE UP) (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x2f8)))),
        (_0x1c7d68 = _0x1c7d68[_0x486be9(0x351)](/<(?:PAGEDOWN|PAGEDN|PAGE DOWN) (?:KEY|BUTTON)>/gi, this[_0x486be9(0x3a2)](_0x486be9(0x293))))),
      _0x1c7d68
    );
  }),
  (Window_Base[_0x205d14(0x39c)]['convertButtonAssistText'] = function (_0x4f3b90) {
    const _0x40dcb9 = _0x205d14;
    let _0x4eeef9 = TextManager[_0x40dcb9(0x39a)](_0x4f3b90) || '';
    return (_0x4eeef9 = this[_0x40dcb9(0x1a0)](_0x4eeef9)), (_0x4eeef9 = this[_0x40dcb9(0x115)](_0x4eeef9)), _0x4eeef9[_0x40dcb9(0x28e)]();
  }),
  (Window_Base['prototype'][_0x205d14(0x1dd)] = function (_0xdac3d6) {
    const _0x8782a5 = _0x205d14;
    return (_0xdac3d6 = this['switchOutTextForLocalization'](_0xdac3d6)), this[_0x8782a5(0x173)](), _0xdac3d6;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1d3)] = function (_0x8bdfc3) {
    const _0x3348a3 = _0x205d14;
    return (_0x8bdfc3 = TextManager[_0x3348a3(0x30f)](_0x8bdfc3)), _0x8bdfc3;
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x40e)] = String['prototype']['format']),
  (String['prototype'][_0x205d14(0x3e5)] = function () {
    const _0x432a14 = _0x205d14;
    let _0x36722c = this;
    return (_0x36722c = TextManager[_0x432a14(0x30f)](_0x36722c)), VisuMZ[_0x432a14(0x16f)][_0x432a14(0x40e)][_0x432a14(0x248)](_0x36722c, arguments);
  }),
  (VisuMZ[_0x205d14(0x16f)]['Bitmap_drawText'] = Bitmap[_0x205d14(0x39c)][_0x205d14(0x2da)]),
  (Bitmap[_0x205d14(0x39c)]['drawText'] = function (_0x3d39cd, _0x35a4da, _0xd1293d, _0x545a52, _0x317c95, _0x3c1f9d) {
    const _0x18b0db = _0x205d14;
    (_0x3d39cd = TextManager[_0x18b0db(0x30f)](_0x3d39cd)), VisuMZ['MessageCore'][_0x18b0db(0x13c)]['call'](this, _0x3d39cd, _0x35a4da, _0xd1293d, _0x545a52, _0x317c95, _0x3c1f9d);
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x276)] = Bitmap[_0x205d14(0x39c)]['drawTextTopAligned']),
  (Bitmap[_0x205d14(0x39c)][_0x205d14(0x15d)] = function (_0x2ae63a, _0x2c7241, _0x789357, _0x548f56, _0x420c34, _0x452966) {
    const _0x546ad8 = _0x205d14;
    (_0x2ae63a = TextManager[_0x546ad8(0x30f)](_0x2ae63a)), VisuMZ[_0x546ad8(0x16f)][_0x546ad8(0x276)][_0x546ad8(0x34e)](this, _0x2ae63a, _0x2c7241, _0x789357, _0x548f56, _0x420c34, _0x452966);
  }),
  (Window_Base['prototype'][_0x205d14(0x21d)] = function (_0x42d592) {
    return _0x42d592;
  }),
  (Window_Base[_0x205d14(0x39c)]['convertShowChoiceEscapeCodes'] = function (_0x34b4c9) {
    const _0x429807 = _0x205d14;
    return (
      this[_0x429807(0x437)]() &&
        ((_0x34b4c9 = _0x34b4c9[_0x429807(0x351)](/<(?:SHOW|HIDE|DISABLE|ENABLE)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9[_0x429807(0x351)](/<(?:SHOW|HIDE|DISABLE|ENABLE)[ ](?:SWITCH|SWITCHES):[ ](.*?)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9['replace'](/<(?:SHOW|HIDE|DISABLE|ENABLE)[ ](?:ALL|ANY)[ ](?:SWITCH|SWITCHES):[ ](.*?)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9[_0x429807(0x351)](/<CHOICE WIDTH:[ ](\d+)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9['replace'](/<CHOICE INDENT:[ ](\d+)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9['replace'](/<(?:BGCOLOR|BG COLOR):[ ](.*?)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9[_0x429807(0x351)](/<(?:FG|BG)(?:| )(?:IMG|IMAGE|PIC|PICTURE):[ ](.*?)>/gi, '')),
        (_0x34b4c9 = _0x34b4c9[_0x429807(0x351)](/<(?:FG|BG)(?:IMG|IMAGE|PIC|PICTURE)[ ]*(.*?):[ ](.*?)>/gi, ''))),
      _0x34b4c9
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x437)] = function () {
    const _0x578213 = _0x205d14,
      _0x34f6a5 = [_0x578213(0x175), _0x578213(0x15c)];
    return _0x34f6a5[_0x578213(0x38f)](this[_0x578213(0x157)][_0x578213(0x201)]);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1ea)] = function (_0xb28ac6) {
    const _0x559304 = _0x205d14;
    return (
      (_0xb28ac6 = _0xb28ac6[_0x559304(0x351)](/<B>/gi, '\x1bBOLD[1]')),
      (_0xb28ac6 = _0xb28ac6[_0x559304(0x351)](/<\/B>/gi, _0x559304(0x19a))),
      (_0xb28ac6 = _0xb28ac6['replace'](/<I>/gi, _0x559304(0x232))),
      (_0xb28ac6 = _0xb28ac6[_0x559304(0x351)](/<\/I>/gi, _0x559304(0x36c))),
      _0xb28ac6
    );
  }),
  (Window_Base[_0x205d14(0x39c)]['convertTextAlignmentEscapeCharacters'] = function (_0x9866fe) {
    const _0x2f7d51 = _0x205d14;
    return (
      (_0x9866fe = _0x9866fe['replace'](/<LEFT>/gi, _0x2f7d51(0x31d))),
      (_0x9866fe = _0x9866fe[_0x2f7d51(0x351)](/<\/LEFT>/gi, _0x2f7d51(0x2e0))),
      (_0x9866fe = _0x9866fe['replace'](/<CENTER>/gi, _0x2f7d51(0x4c3))),
      (_0x9866fe = _0x9866fe[_0x2f7d51(0x351)](/<\/CENTER>/gi, _0x2f7d51(0x2e0))),
      (_0x9866fe = _0x9866fe['replace'](/<RIGHT>/gi, _0x2f7d51(0x1c7))),
      (_0x9866fe = _0x9866fe['replace'](/<\/RIGHT>/gi, '\x1bTEXTALIGNMENT[0]')),
      _0x9866fe
    );
  }),
  (Window_Base[_0x205d14(0x39c)]['convertLockColorsEscapeCharacters'] = function (_0x200d76) {
    const _0x577dc9 = _0x205d14;
    return (
      (_0x200d76 = _0x200d76[_0x577dc9(0x351)](/<COLORLOCK>/gi, _0x577dc9(0x451))),
      (_0x200d76 = _0x200d76[_0x577dc9(0x351)](/<\/COLORLOCK>/gi, '\x1bCOLORLOCK[0]')),
      (_0x200d76 = _0x200d76[_0x577dc9(0x351)](/\(\(\(/gi, _0x577dc9(0x451))),
      (_0x200d76 = _0x200d76['replace'](/\)\)\)/gi, _0x577dc9(0x37d))),
      _0x200d76
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x190)] = function (_0x5b3b78) {
    const _0x58dd39 = _0x205d14;
    return (
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<(?:LC|LOWERCASE|LOWER CASE|LOWER)>/gi, _0x58dd39(0x4a4))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<\/(?:LC|LOWERCASE|LOWER CASE|LOWER)>/gi, _0x58dd39(0x1f3))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<(?:UC|UPPERCASE|UPPER CASE|UPPER)>/gi, _0x58dd39(0x132))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<\/(?:UC|UPPERCASE|UPPER CASE|UPPER)>/gi, _0x58dd39(0x1f3))),
      (_0x5b3b78 = _0x5b3b78['replace'](/<(?:CAPS|CAPSLOCK|CAPS LOCK|CAP)>/gi, _0x58dd39(0x1ee))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<\/(?:CAPS|CAPSLOCK|CAPS LOCK|CAP)>/gi, '\x1bCASING[0]')),
      (_0x5b3b78 = _0x5b3b78['replace'](/<(?:ALT|ALTERNATE|ALT CASE)>/gi, '\x1bCASING[4]')),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<\/(?:ALT|ALTERNATE|ALT CASE)>/gi, _0x58dd39(0x1f3))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<(?:CHAOS|CHAOSCASE|CHAOS CASE)>/gi, _0x58dd39(0x32c))),
      (_0x5b3b78 = _0x5b3b78[_0x58dd39(0x351)](/<\/(?:CHAOS|CHAOSCASE|CHAOS CASE)>/gi, _0x58dd39(0x1f3))),
      _0x5b3b78
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2f2)] = function (_0x368015) {
    const _0x96f005 = _0x205d14;
    return (
      (_0x368015 = _0x368015[_0x96f005(0x351)](/\x1bN\[(\d+)\]/gi, (_0x4c4d11, _0x2a0a51) => this[_0x96f005(0x430)](parseInt(_0x2a0a51)))),
      (_0x368015 = _0x368015[_0x96f005(0x351)](/\x1bP\[(\d+)\]/gi, (_0x4e3588, _0x498239) => this['partyMemberName'](parseInt(_0x498239)))),
      (_0x368015 = _0x368015['replace'](/\x1bG/gi, TextManager[_0x96f005(0x324)])),
      _0x368015
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1b3)] = function (_0x33f771) {
    const _0x32466a = _0x205d14;
    return (
      (_0x33f771 = _0x33f771[_0x32466a(0x351)](/\<(?:BATTLE|CURRENT BATTLE) TARGET\>/gi, this[_0x32466a(0x4e4)]())),
      (_0x33f771 = _0x33f771[_0x32466a(0x351)](/\<(?:BATTLE|CURRENT BATTLE) (?:USER|SUBJECT)\>/gi, this['battleUserName']())),
      (_0x33f771 = _0x33f771[_0x32466a(0x351)](/\<(?:BATTLE|CURRENT BATTLE) (?:ITEM|SKILL|ACTION)\>/gi, this[_0x32466a(0x1bb)](!![]))),
      (_0x33f771 = _0x33f771[_0x32466a(0x351)](/\<(?:BATTLE|CURRENT BATTLE) (?:ITEM|SKILL|ACTION) NAME\>/gi, this['battleActionName'](![]))),
      _0x33f771
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4e4)] = function () {
    const _0x1aff98 = _0x205d14;
    if (!SceneManager[_0x1aff98(0x1b4)]()) return '';
    if (BattleManager[_0x1aff98(0x355)]) return BattleManager[_0x1aff98(0x355)]['name']();
    if (BattleManager['_targets'][0x0]) return BattleManager[_0x1aff98(0x455)][0x0][_0x1aff98(0x201)]();
    return '';
  }),
  (Window_Base['prototype'][_0x205d14(0x4d7)] = function () {
    const _0x5c329d = _0x205d14;
    if (!SceneManager[_0x5c329d(0x1b4)]()) return '';
    let _0x5248ca = null;
    return (
      (_0x5248ca = BattleManager[_0x5c329d(0x162)]), !_0x5248ca && BattleManager[_0x5c329d(0x466)]() && (_0x5248ca = BattleManager[_0x5c329d(0x145)]()), _0x5248ca ? _0x5248ca[_0x5c329d(0x201)]() : ''
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1bb)] = function (_0x151154) {
    const _0x303343 = _0x205d14;
    if (!SceneManager[_0x303343(0x1b4)]()) return '';
    let _0x4a99ce = BattleManager[_0x303343(0x352)] || null;
    !_0x4a99ce && BattleManager['isInputting']() && (_0x4a99ce = BattleManager[_0x303343(0x139)]());
    if (_0x4a99ce && _0x4a99ce['item']()) {
      let _0x13b973 = '';
      if (_0x151154) _0x13b973 += '\x1bI[%1]'[_0x303343(0x3e5)](_0x4a99ce[_0x303343(0x337)]()['iconIndex']);
      return (_0x13b973 += _0x4a99ce[_0x303343(0x337)]()['name']), _0x13b973;
    }
    return '';
  }),
  (Window_Base['prototype'][_0x205d14(0x3c7)] = function (_0x4ec714) {
    const _0x323706 = _0x205d14;
    for (const _0x5ef397 of VisuMZ['MessageCore']['Settings']['TextCodeActions']) {
      _0x4ec714[_0x323706(0x127)](_0x5ef397[_0x323706(0x1d5)]) &&
        ((_0x4ec714 = _0x4ec714[_0x323706(0x351)](_0x5ef397[_0x323706(0x1d5)], _0x5ef397[_0x323706(0x28f)])), (_0x4ec714 = this[_0x323706(0x115)](_0x4ec714)));
    }
    return _0x4ec714;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x450)] = function (_0x7c1416) {
    const _0x2c7741 = _0x205d14;
    for (const _0x641f of VisuMZ['MessageCore'][_0x2c7741(0x26d)][_0x2c7741(0x169)]) {
      _0x7c1416['match'](_0x641f['textCodeCheck']) &&
        ((_0x7c1416 = _0x7c1416['replace'](_0x641f[_0x2c7741(0x1d5)], _0x641f[_0x2c7741(0x28f)][_0x2c7741(0x3cf)](this))), (_0x7c1416 = this[_0x2c7741(0x115)](_0x7c1416)));
    }
    return _0x7c1416;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x430)] = function (_0x307890) {
    const _0x5c03d9 = _0x205d14,
      _0x10da3c = _0x307890 >= 0x1 ? $gameActors[_0x5c03d9(0x145)](_0x307890) : null,
      _0x1a73bc = _0x10da3c ? _0x10da3c[_0x5c03d9(0x201)]() : '',
      _0xf9cc9a = Number(VisuMZ['MessageCore']['Settings'][_0x5c03d9(0x326)][_0x5c03d9(0x493)]);
    return this[_0x5c03d9(0x161)]() && _0xf9cc9a !== 0x0 ? _0x5c03d9(0x411)[_0x5c03d9(0x3e5)](_0xf9cc9a, _0x1a73bc) : _0x1a73bc;
  }),
  (Window_Base['prototype']['partyMemberName'] = function (_0x118c76) {
    const _0x18f359 = _0x205d14,
      _0x30e079 = _0x118c76 >= 0x1 ? $gameParty[_0x18f359(0x4c5)]()[_0x118c76 - 0x1] : null,
      _0x25d4d6 = _0x30e079 ? _0x30e079[_0x18f359(0x201)]() : '',
      _0x131ef7 = Number(VisuMZ[_0x18f359(0x16f)][_0x18f359(0x26d)][_0x18f359(0x326)][_0x18f359(0x493)]);
    return this[_0x18f359(0x161)]() && _0x131ef7 !== 0x0 ? _0x18f359(0x411)['format'](_0x131ef7, _0x25d4d6) : _0x25d4d6;
  }),
  (Window_Base['prototype']['processAutoColorWords'] = function (_0x46064b) {
    const _0x3c2b22 = _0x205d14;
    return this[_0x3c2b22(0x161)]() && ((_0x46064b = this[_0x3c2b22(0x242)](_0x46064b)), (_0x46064b = this[_0x3c2b22(0x4b3)](_0x46064b))), _0x46064b;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x242)] = function (_0xf47745) {
    const _0xbfec48 = _0x205d14;
    for (autoColor of VisuMZ[_0xbfec48(0x16f)][_0xbfec48(0x116)]) {
      _0xf47745 = _0xf47745[_0xbfec48(0x351)](autoColor[0x0], autoColor[0x1]);
    }
    return _0xf47745;
  }),
  (Window_Base[_0x205d14(0x39c)]['clearActorNameAutoColor'] = function () {
    const _0xd48418 = _0x205d14;
    this[_0xd48418(0x406)] = [];
  }),
  (Window_Base['prototype'][_0x205d14(0x173)] = function () {
    const _0x238220 = _0x205d14;
    this[_0x238220(0x419)]();
    const _0x45e770 = VisuMZ[_0x238220(0x16f)][_0x238220(0x26d)][_0x238220(0x326)],
      _0x208723 = _0x45e770[_0x238220(0x493)];
    if (_0x208723 <= 0x0) return;
    for (const _0xe047 of $gameActors[_0x238220(0x353)]) {
      if (!_0xe047) continue;
      const _0x1f331e = _0xe047[_0x238220(0x201)]();
      if (_0x1f331e[_0x238220(0x28e)]()[_0x238220(0x3d7)] <= 0x0) continue;
      if (/^\d+$/[_0x238220(0x4ce)](_0x1f331e)) continue;
      if (_0x1f331e['match'](/-----/i)) continue;
      let _0x342d5a = VisuMZ[_0x238220(0x16f)][_0x238220(0x4e7)](_0x1f331e);
      const _0x2eae2f = new RegExp('\x5cb' + _0x342d5a + '\x5cb', 'g'),
        _0x130e21 = '\x1bC[%1]%2\x1bPREVCOLOR[0]'[_0x238220(0x3e5)](_0x208723, _0x1f331e);
      this[_0x238220(0x406)][_0x238220(0x1dc)]([_0x2eae2f, _0x130e21]);
    }
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4b3)] = function (_0x1f9dc4) {
    const _0x5a7833 = _0x205d14;
    this[_0x5a7833(0x406)] === undefined && this[_0x5a7833(0x173)]();
    for (autoColor of this['_autoColorActorNames']) {
      _0x1f9dc4 = _0x1f9dc4['replace'](autoColor[0x0], autoColor[0x1]);
    }
    return _0x1f9dc4;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2e3)] = function (_0xf0c166, _0x6ae7be, _0x342df8) {
    const _0x8a8d86 = _0x205d14;
    if (!_0xf0c166) return '';
    const _0x3a8563 = _0xf0c166[_0x6ae7be];
    let _0x445542 = '';
    if (_0x3a8563 && _0x342df8 && _0x3a8563[_0x8a8d86(0x2b9)]) {
      const _0x215ae5 = '\x1bi[%1]%2';
      _0x445542 = _0x215ae5['format'](_0x3a8563[_0x8a8d86(0x2b9)], _0x3a8563[_0x8a8d86(0x201)]);
    } else _0x3a8563 ? (_0x445542 = _0x3a8563[_0x8a8d86(0x201)]) : (_0x445542 = '');
    return (_0x445542 = TextManager[_0x8a8d86(0x30f)](_0x445542)), this[_0x8a8d86(0x161)]() && (_0x445542 = this['applyDatabaseAutoColor'](_0x445542, _0xf0c166)), _0x445542;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2c8)] = function () {
    const _0x2068c8 = _0x205d14,
      _0xc104a5 = $gameParty[_0x2068c8(0x149)]();
    if (_0xc104a5['id'] < 0x0) return '';
    let _0x516e23 = null;
    if (_0xc104a5[_0x2068c8(0x45b)] === 0x0) _0x516e23 = $dataItems[_0xc104a5['id']];
    if (_0xc104a5[_0x2068c8(0x45b)] === 0x1) _0x516e23 = $dataWeapons[_0xc104a5['id']];
    if (_0xc104a5[_0x2068c8(0x45b)] === 0x2) _0x516e23 = $dataArmors[_0xc104a5['id']];
    if (!_0x516e23) return '';
    return _0x2068c8(0x30c)[_0x2068c8(0x3e5)](_0x516e23[_0x2068c8(0x2b9)]);
  }),
  (Window_Base[_0x205d14(0x39c)]['lastGainedObjectName'] = function (_0x423f36) {
    const _0x57625b = _0x205d14,
      _0x9c1106 = $gameParty['getLastGainedItemData']();
    if (_0x9c1106['id'] < 0x0) return '';
    let _0x14f81e = null;
    if (_0x9c1106['type'] === 0x0) _0x14f81e = $dataItems[_0x9c1106['id']];
    if (_0x9c1106[_0x57625b(0x45b)] === 0x1) _0x14f81e = $dataWeapons[_0x9c1106['id']];
    if (_0x9c1106[_0x57625b(0x45b)] === 0x2) _0x14f81e = $dataArmors[_0x9c1106['id']];
    if (!_0x14f81e) return '';
    let _0x49aaa1 = _0x14f81e['name'] || '';
    return (
      TextManager['isVisuMzLocalizationEnabled']() && (_0x49aaa1 = TextManager[_0x57625b(0x30f)](_0x49aaa1)),
      _0x423f36 ? _0x57625b(0x452)[_0x57625b(0x3e5)](_0x14f81e['iconIndex'], _0x49aaa1) : _0x49aaa1
    );
  }),
  (Window_Base['prototype']['lastGainedObjectQuantity'] = function () {
    const _0xbec535 = _0x205d14,
      _0x1db707 = $gameParty[_0xbec535(0x149)]();
    if (_0x1db707['id'] <= 0x0) return '';
    return _0x1db707[_0xbec535(0x4de)];
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x4e2)] = function (_0x40e647, _0x5f3971) {
    const _0x381120 = _0x205d14,
      _0xca5983 = VisuMZ[_0x381120(0x16f)][_0x381120(0x26d)][_0x381120(0x326)];
    let _0x103794 = 0x0;
    if (_0x5f3971 === $dataActors) _0x103794 = _0xca5983[_0x381120(0x493)];
    if (_0x5f3971 === $dataClasses) _0x103794 = _0xca5983[_0x381120(0x49b)];
    if (_0x5f3971 === $dataSkills) _0x103794 = _0xca5983[_0x381120(0x3e2)];
    if (_0x5f3971 === $dataItems) _0x103794 = _0xca5983[_0x381120(0x3af)];
    if (_0x5f3971 === $dataWeapons) _0x103794 = _0xca5983[_0x381120(0x296)];
    if (_0x5f3971 === $dataArmors) _0x103794 = _0xca5983['Armors'];
    if (_0x5f3971 === $dataEnemies) _0x103794 = _0xca5983['Enemies'];
    if (_0x5f3971 === $dataStates) _0x103794 = _0xca5983['States'];
    return _0x103794 > 0x0 && (_0x40e647 = '\x1bC[%1]%2\x1bPREVCOLOR[0]'[_0x381120(0x3e5)](_0x103794, _0x40e647)), _0x40e647;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x24f)] = function (_0x42a450) {
    const _0x46c8c7 = _0x205d14;
    if (_0x42a450[_0x46c8c7(0x38f)](_0x46c8c7(0x367)))
      return (
        this[_0x46c8c7(0x497)](![]),
        (_0x42a450 = _0x42a450['replace'](/<(?:BR|LINEBREAK)>/gi, '\x20\x0a')),
        (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:WORDWRAP|WORD WRAP)>/gi, '')),
        (_0x42a450 = _0x42a450['replace'](/<(?:NOWORDWRAP|NO WORD WRAP)>/gi, '')),
        (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<\/(?:NOWORDWRAP|NO WORD WRAP)>/gi, '')),
        _0x42a450
      );
    (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:WORDWRAP|WORD WRAP)>/gi, (_0x4b8053, _0x1d7952) => this[_0x46c8c7(0x497)](!![]))),
      (_0x42a450 = _0x42a450['replace'](/<(?:NOWORDWRAP|NO WORD WRAP)>/gi, (_0x407a36, _0x41a1ec) => this[_0x46c8c7(0x497)](![]))),
      (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<\/(?:WORDWRAP|WORD WRAP)>/gi, (_0x252f56, _0x353ac6) => this[_0x46c8c7(0x497)](![])));
    if (_0x42a450[_0x46c8c7(0x127)](Window_Message[_0x46c8c7(0x32a)])) this[_0x46c8c7(0x497)](![]);
    else _0x42a450['match'](Window_Message[_0x46c8c7(0x130)]) && this[_0x46c8c7(0x497)](![]);
    if (!this['isWordWrapEnabled']()) return (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:BR|LINEBREAK)>/gi, '\x20\x0a')), _0x42a450;
    if (_0x42a450[_0x46c8c7(0x3d7)] <= 0x0) return _0x42a450;
    return (
      _0x42a450[_0x46c8c7(0x127)](/[\u3040-\u30FF\u4E00-\u9FFF]/g) && (_0x42a450 = VisuMZ['MessageCore'][_0x46c8c7(0x42d)](_0x42a450)[_0x46c8c7(0x1b8)]('')),
      VisuMZ[_0x46c8c7(0x16f)][_0x46c8c7(0x26d)][_0x46c8c7(0x117)][_0x46c8c7(0x13a)]
        ? ((_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/[\n\r]+/g, '\x20')), (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:BR|LINEBREAK)>/gi, '\x20\x0a')))
        : ((_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/[\n\r]+/g, '')), (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:BR|LINEBREAK)>/gi, '\x0a'))),
      (_0x42a450 = this['addWrapBreakAfterPunctuation'](_0x42a450)),
      (_0x42a450 = _0x42a450['split']('\x20')[_0x46c8c7(0x1b8)](_0x46c8c7(0x35b))),
      (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<(?:BR|LINEBREAK)>/gi, '\x0a')),
      (_0x42a450 = _0x42a450[_0x46c8c7(0x351)](/<LINE\x1bWrapBreak[0]BREAK>/gi, '\x0a')),
      _0x42a450
    );
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x42d)] = function (_0x1a4d80) {
    const _0x34ec56 = _0x205d14;
    let _0x31f721 = [],
      _0x398d89 = '';
    while (_0x1a4d80[_0x34ec56(0x3d7)] > 0x0) {
      const _0x1d503e = _0x1a4d80[_0x34ec56(0x272)](0x0);
      (_0x1a4d80 = _0x1a4d80[_0x34ec56(0x251)](0x1)),
        _0x1d503e[_0x34ec56(0x127)](/[\u3040-\u30FF\u4E00-\u9FFF]/g)
          ? (_0x398d89[_0x34ec56(0x3d7)] > 0x0 && (_0x31f721[_0x34ec56(0x1dc)](_0x398d89), (_0x398d89 = '')), _0x31f721[_0x34ec56(0x1dc)](_0x1d503e + '\x1bWrapJpBreak[0]'))
          : (_0x398d89 += _0x1d503e);
    }
    return _0x398d89['length'] > 0x0 && (_0x31f721[_0x34ec56(0x1dc)](_0x398d89), (_0x398d89 = '')), _0x31f721;
  }),
  (Window_Base['prototype'][_0x205d14(0x18f)] = function (_0x39af58) {
    return _0x39af58;
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x3c9)] = Window_Base[_0x205d14(0x39c)][_0x205d14(0x25c)]),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x25c)] = function (_0x5ac476) {
    const _0x480a08 = _0x205d14;
    VisuMZ[_0x480a08(0x16f)][_0x480a08(0x3c9)][_0x480a08(0x34e)](this, _0x5ac476), this[_0x480a08(0x4db)](_0x5ac476);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x499)] = function (_0xc9df90) {
    const _0x365092 = _0x205d14;
    let _0x85a96a = _0xc9df90[_0x365092(0x135)][_0xc9df90[_0x365092(0x2f1)]++];
    if (_0x85a96a[_0x365092(0x2bc)](0x0) < 0x20) this['flushTextState'](_0xc9df90), this['processControlCharacter'](_0xc9df90, _0x85a96a);
    else {
      if (this[_0x365092(0x25d)] === 0x1) _0x85a96a = _0x85a96a[_0x365092(0x4a8)]();
      if (this['_textCasing'] === 0x2) {
        if (this['_textCasingUpperState']) _0x85a96a = _0x85a96a['toUpperCase']();
        this['_textCasingUpperState'] = /\s/[_0x365092(0x4ce)](_0x85a96a);
      }
      if (this[_0x365092(0x25d)] === 0x3) _0x85a96a = _0x85a96a[_0x365092(0x3a1)]();
      this[_0x365092(0x25d)] === 0x4 && ((_0x85a96a = this[_0x365092(0x187)] ? _0x85a96a[_0x365092(0x3a1)]() : _0x85a96a['toLowerCase']()), (this[_0x365092(0x187)] = !this[_0x365092(0x187)])),
        this[_0x365092(0x25d)] === 0x5 && (_0x85a96a = Math[_0x365092(0x2fb)]() < 0.5 ? _0x85a96a[_0x365092(0x3a1)]() : _0x85a96a[_0x365092(0x4a8)]()),
        (_0xc9df90[_0x365092(0x2d3)] += _0x85a96a);
    }
  }),
  (VisuMZ[_0x205d14(0x16f)]['Window_Base_processControlCharacter'] = Window_Base[_0x205d14(0x39c)]['processControlCharacter']),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x318)] = function (_0x5b72ae, _0x47d5ca) {
    const _0x56da93 = _0x205d14;
    VisuMZ[_0x56da93(0x16f)][_0x56da93(0x42f)]['call'](this, _0x5b72ae, _0x47d5ca);
    if (_0x47d5ca === _0x56da93(0x35b)) this['processWrapBreak'](_0x5b72ae);
    else _0x47d5ca === _0x56da93(0x46d) && this[_0x56da93(0x1c5)](_0x5b72ae, !![]);
  }),
  (Window_Base['prototype'][_0x205d14(0x26f)] = function (_0x519fd4) {
    const _0x3414cd = _0x205d14;
    var _0x4eaf1b = /^\<(.*?)\>/[_0x3414cd(0x21e)](_0x519fd4['text']['slice'](_0x519fd4[_0x3414cd(0x2f1)]));
    return _0x4eaf1b ? ((_0x519fd4[_0x3414cd(0x2f1)] += _0x4eaf1b[0x0][_0x3414cd(0x3d7)]), String(_0x4eaf1b[0x0][_0x3414cd(0x251)](0x1, _0x4eaf1b[0x0][_0x3414cd(0x3d7)] - 0x1))) : '';
  }),
  (VisuMZ[_0x205d14(0x16f)]['Window_Base_processEscapeCharacter'] = Window_Base[_0x205d14(0x39c)][_0x205d14(0x1e1)]),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1e1)] = function (_0x38cee6, _0x602538) {
    const _0x32570a = _0x205d14;
    switch (_0x38cee6) {
      case 'C':
        _0x602538[_0x32570a(0x1d0)] ? VisuMZ['MessageCore']['Window_Base_processEscapeCharacter']['call'](this, _0x38cee6, _0x602538) : this[_0x32570a(0x24d)](_0x602538);
        break;
      case 'I':
      case '{':
      case '}':
        VisuMZ['MessageCore'][_0x32570a(0x1bc)][_0x32570a(0x34e)](this, _0x38cee6, _0x602538);
        break;
      case 'FS':
        this['processFsTextCode'](_0x602538);
        break;
      case 'PX':
        this['processPxTextCode'](_0x602538);
        break;
      case 'PY':
        this[_0x32570a(0x421)](_0x602538);
        break;
      case _0x32570a(0x2a0):
        this[_0x32570a(0x3da)](this[_0x32570a(0x24d)](_0x602538));
        break;
      case _0x32570a(0x4d3):
        this[_0x32570a(0x1f1)](_0x602538);
        break;
      case 'CENTERPICTURE':
        this[_0x32570a(0x3e1)](_0x602538);
        break;
      case _0x32570a(0x44e):
        this[_0x32570a(0x205)](_0x602538);
        break;
      case 'COMMONEVENT':
        this['processCommonEvent'](_0x602538);
        break;
      case _0x32570a(0x147):
        this[_0x32570a(0x358)](this[_0x32570a(0x24d)](_0x602538));
        break;
      case _0x32570a(0x177):
        this[_0x32570a(0x257)](_0x602538);
        break;
      case _0x32570a(0x1c4):
        this['processPreviousColor'](_0x602538);
        break;
      case 'TEXTALIGNMENT':
        this[_0x32570a(0x2cf)](_0x602538);
        break;
      case _0x32570a(0x3a7):
        this[_0x32570a(0x27a)](_0x602538);
        break;
      case 'WRAPBREAK':
        this[_0x32570a(0x1c5)](_0x602538);
        break;
      case _0x32570a(0x4c1):
        this['processWrapBreak'](_0x602538, !![]);
        break;
      default:
        this[_0x32570a(0x11b)](_0x38cee6, _0x602538);
    }
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x11b)] = function (_0x5250fb, _0x45d126) {
    const _0x28e10c = _0x205d14;
    for (const _0x2857fc of VisuMZ[_0x28e10c(0x16f)][_0x28e10c(0x26d)][_0x28e10c(0x317)]) {
      if (_0x2857fc[_0x28e10c(0x137)] === _0x5250fb) {
        if (_0x2857fc[_0x28e10c(0x402)] === '') this[_0x28e10c(0x24d)](_0x45d126);
        _0x2857fc[_0x28e10c(0x1cf)][_0x28e10c(0x34e)](this, _0x45d126);
        if (this[_0x28e10c(0x157)] === Window_Message) {
          const _0x57053b = _0x2857fc[_0x28e10c(0x274)] || 0x0;
          if (_0x57053b > 0x0) this[_0x28e10c(0x217)](_0x57053b);
        }
      }
    }
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x18a)] = function () {
    const _0xc3cabf = _0x205d14;
    (this['contents'][_0xc3cabf(0x327)] += VisuMZ[_0xc3cabf(0x16f)]['Settings'][_0xc3cabf(0x413)][_0xc3cabf(0x2a1)]),
      (this[_0xc3cabf(0x3a0)][_0xc3cabf(0x327)] = Math[_0xc3cabf(0x1d6)](this['contents'][_0xc3cabf(0x327)], VisuMZ[_0xc3cabf(0x16f)]['Settings'][_0xc3cabf(0x413)][_0xc3cabf(0x245)]));
  }),
  (Window_Base[_0x205d14(0x39c)]['makeFontSmaller'] = function () {
    const _0x5ae82a = _0x205d14;
    (this[_0x5ae82a(0x3a0)][_0x5ae82a(0x327)] -= VisuMZ[_0x5ae82a(0x16f)][_0x5ae82a(0x26d)][_0x5ae82a(0x413)][_0x5ae82a(0x2a1)]),
      (this[_0x5ae82a(0x3a0)][_0x5ae82a(0x327)] = Math['max'](this['contents'][_0x5ae82a(0x327)], VisuMZ[_0x5ae82a(0x16f)][_0x5ae82a(0x26d)][_0x5ae82a(0x413)][_0x5ae82a(0x2a8)]));
  }),
  (Window_Base[_0x205d14(0x39c)]['processFsTextCode'] = function (_0x493206) {
    const _0x53baf6 = _0x205d14,
      _0x1324f7 = this[_0x53baf6(0x24d)](_0x493206);
    this[_0x53baf6(0x3a0)]['fontSize'] = _0x1324f7[_0x53baf6(0x41e)](
      VisuMZ[_0x53baf6(0x16f)][_0x53baf6(0x26d)]['General'][_0x53baf6(0x2a8)],
      VisuMZ[_0x53baf6(0x16f)][_0x53baf6(0x26d)][_0x53baf6(0x413)]['FontBiggerCap'],
    );
  }),
  (Window_Base[_0x205d14(0x39c)]['maxFontSizeInLine'] = function (_0x364d02) {
    const _0x3cfea3 = _0x205d14;
    let _0x3d1430 = this[_0x3cfea3(0x3a0)][_0x3cfea3(0x327)];
    const _0x33095c = /\x1b({|}|FS)(\[(\d+)])?/gi;
    for (;;) {
      const _0x31a189 = _0x33095c[_0x3cfea3(0x21e)](_0x364d02);
      if (!_0x31a189) break;
      const _0x458be2 = String(_0x31a189[0x1])[_0x3cfea3(0x3a1)]();
      if (_0x458be2 === '{') this[_0x3cfea3(0x18a)]();
      else {
        if (_0x458be2 === '}') this[_0x3cfea3(0x4bf)]();
        else
          _0x458be2 === 'FS' &&
            (this[_0x3cfea3(0x3a0)]['fontSize'] = parseInt(_0x31a189[0x3])[_0x3cfea3(0x41e)](
              VisuMZ[_0x3cfea3(0x16f)][_0x3cfea3(0x26d)][_0x3cfea3(0x413)][_0x3cfea3(0x2a8)],
              VisuMZ[_0x3cfea3(0x16f)][_0x3cfea3(0x26d)]['General'][_0x3cfea3(0x245)],
            ));
      }
      this[_0x3cfea3(0x3a0)][_0x3cfea3(0x327)] > _0x3d1430 && (_0x3d1430 = this[_0x3cfea3(0x3a0)][_0x3cfea3(0x327)]);
    }
    return _0x3d1430;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x376)] = function (_0x324ad4) {
    const _0x47f8c1 = _0x205d14;
    (_0x324ad4['x'] = this[_0x47f8c1(0x24d)](_0x324ad4)), VisuMZ[_0x47f8c1(0x16f)][_0x47f8c1(0x26d)][_0x47f8c1(0x413)][_0x47f8c1(0x2f0)] && (_0x324ad4['x'] += _0x324ad4[_0x47f8c1(0x121)]);
  }),
  (Window_Base['prototype'][_0x205d14(0x421)] = function (_0xb356ed) {
    const _0x28e909 = _0x205d14;
    (_0xb356ed['y'] = this[_0x28e909(0x24d)](_0xb356ed)), VisuMZ[_0x28e909(0x16f)][_0x28e909(0x26d)]['General'][_0x28e909(0x2f0)] && (_0xb356ed['y'] += _0xb356ed[_0x28e909(0x118)]);
  }),
  (Window_Base['prototype']['processFontChangeBold'] = function (_0x3edb98) {
    const _0x6c9544 = _0x205d14;
    this[_0x6c9544(0x3a0)][_0x6c9544(0x2eb)] = !!_0x3edb98;
  }),
  (Window_Base['prototype'][_0x205d14(0x358)] = function (_0x15aac9) {
    const _0x5b809d = _0x205d14;
    this[_0x5b809d(0x3a0)]['fontItalic'] = !!_0x15aac9;
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2cf)] = function (_0xfc0f21) {
    const _0xefb62b = _0x205d14,
      _0x5cc0db = this[_0xefb62b(0x24d)](_0xfc0f21);
    if (!_0xfc0f21[_0xefb62b(0x1d0)]) return;
    switch (_0x5cc0db) {
      case 0x0:
        this[_0xefb62b(0x32d)](_0xefb62b(0x119));
        return;
      case 0x1:
        this[_0xefb62b(0x32d)](_0xefb62b(0x22e));
        break;
      case 0x2:
        this[_0xefb62b(0x32d)](_0xefb62b(0x113));
        break;
      case 0x3:
        this[_0xefb62b(0x32d)](_0xefb62b(0x270));
        break;
    }
    this['processTextAlignmentX'](_0xfc0f21);
  }),
  (Window_Base['prototype'][_0x205d14(0x4db)] = function (_0x3c3b5b) {
    const _0x3d5e0d = _0x205d14;
    if (!_0x3c3b5b[_0x3d5e0d(0x1d0)]) return;
    if (_0x3c3b5b['rtl']) return;
    if (this[_0x3d5e0d(0x471)]() === _0x3d5e0d(0x119)) return;
    let _0x5e9bce = _0x3c3b5b['text'][_0x3d5e0d(0x2fc)]('\x1bTEXTALIGNMENT', _0x3c3b5b[_0x3d5e0d(0x2f1)] + 0x1),
      _0x55d7a0 = _0x3c3b5b[_0x3d5e0d(0x135)][_0x3d5e0d(0x2fc)]('\x0a', _0x3c3b5b[_0x3d5e0d(0x2f1)] + 0x1);
    if (_0x5e9bce < 0x0) _0x5e9bce = _0x3c3b5b['text']['length'] + 0x1;
    if (_0x55d7a0 > 0x0) _0x5e9bce = Math[_0x3d5e0d(0x1d6)](_0x5e9bce, _0x55d7a0);
    const _0x20f88b = _0x3c3b5b['text']['substring'](_0x3c3b5b['index'], _0x5e9bce),
      _0x351ff5 = this[_0x3d5e0d(0x236)](_0x20f88b)[_0x3d5e0d(0x17d)],
      _0x18e127 = _0x3c3b5b[_0x3d5e0d(0x17d)] || this[_0x3d5e0d(0x3f0)] - 0x8,
      _0x4543c0 = this[_0x3d5e0d(0x157)] === Window_Message && $gameMessage['faceName']() !== '';
    switch (this[_0x3d5e0d(0x471)]()) {
      case 'left':
        _0x3c3b5b['x'] = _0x3c3b5b[_0x3d5e0d(0x121)];
        break;
      case _0x3d5e0d(0x113):
        (_0x3c3b5b['x'] = _0x3c3b5b[_0x3d5e0d(0x121)]), (_0x3c3b5b['x'] += Math[_0x3d5e0d(0x4ef)]((_0x18e127 - _0x351ff5) / 0x2));
        _0x4543c0 && (_0x3c3b5b['x'] -= _0x3c3b5b[_0x3d5e0d(0x121)] / 0x2);
        break;
      case _0x3d5e0d(0x270):
        _0x3c3b5b['x'] = _0x18e127 - _0x351ff5 + _0x3c3b5b['startX'];
        _0x4543c0 && (_0x3c3b5b['x'] -= _0x3c3b5b[_0x3d5e0d(0x121)]);
        break;
    }
  }),
  (Window_Base[_0x205d14(0x39c)]['textSizeExTextAlignment'] = function (_0x2d40e0) {
    const _0x470fc9 = _0x205d14;
    (_0x2d40e0 = _0x2d40e0[_0x470fc9(0x351)](/\x1b!/g, '')), (_0x2d40e0 = _0x2d40e0['replace'](/\x1b\|/g, '')), (_0x2d40e0 = _0x2d40e0[_0x470fc9(0x351)](/\x1b\./g, ''));
    const _0x4970fe = this[_0x470fc9(0x29d)](_0x2d40e0, 0x0, 0x0, 0x0),
      _0x5251e7 = this[_0x470fc9(0x372)]();
    return (_0x4970fe[_0x470fc9(0x1d0)] = ![]), this[_0x470fc9(0x400)](_0x4970fe), this[_0x470fc9(0x4d4)](_0x5251e7), { width: _0x4970fe['outputWidth'], height: _0x4970fe['outputHeight'] };
  }),
  (Window_Base[_0x205d14(0x3f2)] = VisuMZ[_0x205d14(0x16f)][_0x205d14(0x26d)][_0x205d14(0x117)][_0x205d14(0x477)] || 0x0),
  (Window_Base['prototype']['processWrapBreak'] = function (_0x409f13, _0x451fdb) {
    const _0x31a9ed = _0x205d14,
      _0x27c11b = (_0x409f13[_0x31a9ed(0x319)] ? -0x1 : 0x1) * this['textWidth']('\x20');
    if (!_0x451fdb) _0x409f13['x'] += _0x27c11b;
    if (this[_0x31a9ed(0x24d)](_0x409f13) > 0x0 && !_0x451fdb) _0x409f13['x'] += _0x27c11b;
    if (_0x409f13[_0x31a9ed(0x319)]) return;
    let _0x5a1026;
    _0x451fdb
      ? (_0x5a1026 = _0x409f13['text'][_0x31a9ed(0x2fc)]('\x1bWrapJpBreak[0]', _0x409f13['index'] + 0x1))
      : (_0x5a1026 = _0x409f13[_0x31a9ed(0x135)][_0x31a9ed(0x2fc)](_0x31a9ed(0x35b), _0x409f13[_0x31a9ed(0x2f1)] + 0x1));
    let _0x1a2e9f = _0x409f13[_0x31a9ed(0x135)][_0x31a9ed(0x2fc)]('\x0a', _0x409f13[_0x31a9ed(0x2f1)] + 0x1);
    if (_0x5a1026 < 0x0) _0x5a1026 = _0x409f13[_0x31a9ed(0x135)][_0x31a9ed(0x3d7)] + 0x1;
    if (_0x1a2e9f > 0x0) _0x5a1026 = Math[_0x31a9ed(0x1d6)](_0x5a1026, _0x1a2e9f);
    const _0x3bc435 = _0x409f13[_0x31a9ed(0x135)][_0x31a9ed(0x206)](_0x409f13['index'], _0x5a1026),
      _0x1087dd = this[_0x31a9ed(0x1ec)](_0x3bc435)[_0x31a9ed(0x17d)];
    let _0x10e9f4 = _0x409f13[_0x31a9ed(0x17d)] || this[_0x31a9ed(0x3f0)];
    _0x10e9f4 -= Window_Base['WORD_WRAP_PADDING'];
    if (this[_0x31a9ed(0x157)] === Window_Message) {
      const _0x44ffc3 = $gameMessage[_0x31a9ed(0x120)]() === '' ? 0x0 : ImageManager[_0x31a9ed(0x47f)] + 0x14;
      (_0x10e9f4 -= _0x44ffc3), VisuMZ[_0x31a9ed(0x16f)]['Settings'][_0x31a9ed(0x117)][_0x31a9ed(0x34c)] && (_0x10e9f4 -= _0x44ffc3);
    }
    let _0x1e065a = ![];
    _0x409f13['x'] + _0x1087dd > _0x409f13[_0x31a9ed(0x121)] + _0x10e9f4 && (_0x1e065a = !![]),
      _0x1087dd === 0x0 && (_0x1e065a = ![]),
      _0x1e065a && (_0x409f13['text'] = _0x409f13['text'][_0x31a9ed(0x251)](0x0, _0x409f13[_0x31a9ed(0x2f1)]) + '\x0a' + _0x409f13['text']['substr'](_0x409f13[_0x31a9ed(0x2f1)]));
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1ec)] = function (_0x5d900b) {
    const _0x54939c = _0x205d14,
      _0x32491b = this[_0x54939c(0x29d)](_0x5d900b, 0x0, 0x0, 0x0),
      _0x409fd0 = this[_0x54939c(0x372)]();
    return (
      (_0x32491b[_0x54939c(0x1d0)] = ![]),
      this[_0x54939c(0x497)](![]),
      this[_0x54939c(0x400)](_0x32491b),
      this[_0x54939c(0x497)](!![]),
      this[_0x54939c(0x4d4)](_0x409fd0),
      { width: _0x32491b[_0x54939c(0x469)], height: _0x32491b[_0x54939c(0x464)] }
    );
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x389)] = function (_0x25f41e) {
    return this['obtainEscapeParam'](_0x25f41e);
  }),
  (Window_Base['prototype'][_0x205d14(0x257)] = function (_0x550cf4) {
    const _0x37f89a = _0x205d14,
      _0x4aae2c = this[_0x37f89a(0x26f)](_0x550cf4)[_0x37f89a(0x41c)](',');
    if (!_0x550cf4[_0x37f89a(0x1d0)]) return;
    const _0x47447b = _0x4aae2c[0x0][_0x37f89a(0x28e)](),
      _0x163a0c = _0x4aae2c[0x1] || 0x0,
      _0x436e1d = _0x4aae2c[0x2] || 0x0,
      _0x7b0c93 = ImageManager[_0x37f89a(0x47e)](_0x47447b),
      _0xc5e343 = this[_0x37f89a(0x3a0)][_0x37f89a(0x284)];
    _0x7b0c93[_0x37f89a(0x488)](this[_0x37f89a(0x38d)][_0x37f89a(0x3cf)](this, _0x7b0c93, _0x550cf4['x'], _0x550cf4['y'], _0x163a0c, _0x436e1d, _0xc5e343));
  }),
  (Window_Base['prototype'][_0x205d14(0x38d)] = function (_0xb40231, _0x11056d, _0x3bae2c, _0x3e25fd, _0x36fbd0, _0x1834ac) {
    const _0x112b08 = _0x205d14;
    (_0x3e25fd = _0x3e25fd || _0xb40231[_0x112b08(0x17d)]),
      (_0x36fbd0 = _0x36fbd0 || _0xb40231[_0x112b08(0x1da)]),
      (this[_0x112b08(0x2de)][_0x112b08(0x284)] = _0x1834ac),
      this[_0x112b08(0x2de)][_0x112b08(0x224)](_0xb40231, 0x0, 0x0, _0xb40231['width'], _0xb40231['height'], _0x11056d, _0x3bae2c, _0x3e25fd, _0x36fbd0),
      (this[_0x112b08(0x2de)][_0x112b08(0x284)] = 0xff);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x3e1)] = function (_0x4602a8) {
    const _0x57f563 = _0x205d14,
      _0x4b47d1 = this[_0x57f563(0x26f)](_0x4602a8)['split'](',');
    if (!_0x4602a8['drawing']) return;
    const _0x844fe5 = _0x4b47d1[0x0][_0x57f563(0x28e)](),
      _0x2e5bae = ImageManager['loadPicture'](_0x844fe5),
      _0x18e1ed = JsonEx[_0x57f563(0x3fc)](_0x4602a8),
      _0x3f1228 = this[_0x57f563(0x3a0)][_0x57f563(0x284)];
    _0x2e5bae[_0x57f563(0x488)](this[_0x57f563(0x14c)][_0x57f563(0x3cf)](this, _0x2e5bae, _0x18e1ed, _0x3f1228));
  }),
  (Window_Base['prototype'][_0x205d14(0x14c)] = function (_0x4aa39d, _0x83aa9b, _0x449d30) {
    const _0x59cdf7 = _0x205d14,
      _0x4a1274 = _0x83aa9b[_0x59cdf7(0x17d)] || this[_0x59cdf7(0x3f0)],
      _0x5adfe2 = this['_index'] !== undefined ? this['itemHeight']() : this[_0x59cdf7(0x37e)],
      _0x3f1209 = _0x4a1274 / _0x4aa39d[_0x59cdf7(0x17d)],
      _0x5150e5 = _0x5adfe2 / _0x4aa39d[_0x59cdf7(0x1da)],
      _0x20de96 = Math[_0x59cdf7(0x1d6)](_0x3f1209, _0x5150e5, 0x1),
      _0xa9316d = this[_0x59cdf7(0x164)] !== undefined ? (this[_0x59cdf7(0x4ad)](0x0)[_0x59cdf7(0x1da)] - this[_0x59cdf7(0x21b)]()) / 0x2 : 0x0,
      _0xbbf8c0 = _0x4aa39d[_0x59cdf7(0x17d)] * _0x20de96,
      _0x30f304 = _0x4aa39d[_0x59cdf7(0x1da)] * _0x20de96,
      _0x4bbb99 = Math['floor']((_0x4a1274 - _0xbbf8c0) / 0x2) + _0x83aa9b['startX'],
      _0x1af5c4 = Math[_0x59cdf7(0x4ef)]((_0x5adfe2 - _0x30f304) / 0x2) + _0x83aa9b[_0x59cdf7(0x118)] - _0xa9316d * 0x2;
    (this[_0x59cdf7(0x2de)]['paintOpacity'] = _0x449d30),
      this[_0x59cdf7(0x2de)]['blt'](_0x4aa39d, 0x0, 0x0, _0x4aa39d[_0x59cdf7(0x17d)], _0x4aa39d['height'], _0x4bbb99, _0x1af5c4, _0xbbf8c0, _0x30f304),
      (this[_0x59cdf7(0x2de)][_0x59cdf7(0x284)] = 0xff);
  }),
  (Window_Base[_0x205d14(0x39c)]['processColorLock'] = function (_0x1035fc) {
    const _0x5f3a51 = _0x205d14,
      _0xb582bc = this['obtainEscapeParam'](_0x1035fc);
    if (_0x1035fc['drawing']) this[_0x5f3a51(0x2e7)](_0xb582bc > 0x0);
  }),
  (Window_Base['prototype'][_0x205d14(0x27a)] = function (_0x352f00) {
    const _0x530fa1 = _0x205d14,
      _0x5c13a4 = this[_0x530fa1(0x24d)](_0x352f00);
    this[_0x530fa1(0x157)] === Window_Message && _0x352f00[_0x530fa1(0x1d0)] && this[_0x530fa1(0x449)](_0x5c13a4);
  }),
  (Window_Base['prototype'][_0x205d14(0x1f1)] = function (_0x47ea2a) {
    const _0x1c9675 = _0x205d14;
    (this[_0x1c9675(0x25d)] = this['obtainEscapeParam'](_0x47ea2a)), (this[_0x1c9675(0x478)] = !![]), (this[_0x1c9675(0x187)] = !![]);
  }),
  (VisuMZ[_0x205d14(0x16f)]['NonSupportedTextCodes'] = function (_0xcdfd27) {
    const _0x435b11 = _0x205d14;
    if ($gameTemp['isPlaytest']()) {
      let _0x5a4c30 = '%1,\x20does\x20not\x20support\x20attempted\x20text\x20code\x20usage.'['format'](_0xcdfd27[_0x435b11(0x157)][_0x435b11(0x201)]);
      alert(_0x5a4c30), SceneManager[_0x435b11(0x475)]();
    }
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x271)] = function () {
    const _0x5ba928 = _0x205d14;
    VisuMZ[_0x5ba928(0x16f)]['NonSupportedTextCodes'](this);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x1a6)] = function () {
    const _0x42ce8f = _0x205d14;
    VisuMZ['MessageCore'][_0x42ce8f(0x2d8)](this);
  }),
  (Window_Base[_0x205d14(0x39c)][_0x205d14(0x2b2)] = function () {
    const _0x384feb = _0x205d14;
    VisuMZ[_0x384feb(0x16f)][_0x384feb(0x2d8)](this);
  }),
  (Window_Help[_0x205d14(0x39c)][_0x205d14(0x4a7)] = function () {
    const _0x59a59c = _0x205d14;
    this[_0x59a59c(0x497)]($gameSystem[_0x59a59c(0x3f1)]());
  }),
  (Window_Help[_0x205d14(0x39c)][_0x205d14(0x161)] = function () {
    return !![];
  }),
  (VisuMZ['MessageCore']['Window_Help_refresh'] = Window_Help['prototype']['refresh']),
  (Window_Help[_0x205d14(0x39c)]['refresh'] = function () {
    const _0x4b02b1 = _0x205d14;
    this['clearActorNameAutoColor'](), VisuMZ[_0x4b02b1(0x16f)]['Window_Help_refresh'][_0x4b02b1(0x34e)](this), this[_0x4b02b1(0x4a7)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x285)] = Window_Options[_0x205d14(0x39c)][_0x205d14(0x221)]),
  (Window_Options[_0x205d14(0x39c)]['addGeneralOptions'] = function () {
    const _0x31f142 = _0x205d14;
    VisuMZ[_0x31f142(0x16f)][_0x31f142(0x285)]['call'](this), this[_0x31f142(0x2ee)]();
  }),
  (Window_Options['prototype'][_0x205d14(0x2ee)] = function () {
    const _0x47cb90 = _0x205d14;
    VisuMZ['MessageCore']['Settings'][_0x47cb90(0x1bf)][_0x47cb90(0x447)] && TextManager['isVisuMzLocalizationEnabled']() && this[_0x47cb90(0x43e)](),
      VisuMZ['MessageCore'][_0x47cb90(0x26d)][_0x47cb90(0x20a)]['AddOption'] && this[_0x47cb90(0x4cc)]();
  }),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x43e)] = function () {
    const _0xf9e218 = _0x205d14,
      _0x187790 = TextManager['messageCoreLocalization'],
      _0x10daa9 = _0xf9e218(0x369);
    this[_0xf9e218(0x435)](_0x187790, _0x10daa9);
  }),
  (Window_Options[_0x205d14(0x39c)]['addMessageCoreTextSpeedCommand'] = function () {
    const _0x16131d = _0x205d14,
      _0x1f10f4 = TextManager['messageCoreTextSpeed'],
      _0x2a379d = _0x16131d(0x30e);
    this[_0x16131d(0x435)](_0x1f10f4, _0x2a379d);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x3aa)] = Window_Options[_0x205d14(0x39c)][_0x205d14(0x148)]),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x148)] = function (_0x4c20ac) {
    const _0x4bed70 = _0x205d14,
      _0x38b471 = this[_0x4bed70(0x4e3)](_0x4c20ac);
    if (_0x38b471 === 'textLocale') return this[_0x4bed70(0x253)]();
    if (_0x38b471 === _0x4bed70(0x30e)) return this[_0x4bed70(0x3fb)]();
    return VisuMZ[_0x4bed70(0x16f)][_0x4bed70(0x3aa)][_0x4bed70(0x34e)](this, _0x4c20ac);
  }),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x253)] = function () {
    const _0xe0efcb = _0x205d14,
      _0x5c5492 = ConfigManager['textLocale'];
    return TextManager[_0xe0efcb(0x4b8)](_0x5c5492);
  }),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x3fb)] = function () {
    const _0x347112 = _0x205d14,
      _0x5c2883 = this['getConfigValue']('textSpeed');
    return _0x5c2883 > 0xa ? TextManager[_0x347112(0x37b)] : _0x5c2883;
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x3f8)] = Window_Options[_0x205d14(0x39c)]['isVolumeSymbol']),
  (Window_Options[_0x205d14(0x39c)]['isVolumeSymbol'] = function (_0xb9f8f6) {
    const _0x2b0bdf = _0x205d14;
    if (_0xb9f8f6 === _0x2b0bdf(0x369)) return !![];
    if (_0xb9f8f6 === _0x2b0bdf(0x30e)) return !![];
    return VisuMZ[_0x2b0bdf(0x16f)][_0x2b0bdf(0x3f8)]['call'](this, _0xb9f8f6);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2c9)] = Window_Options['prototype'][_0x205d14(0x4df)]),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x4df)] = function (_0x5d1af4, _0x474145, _0x1cc8f1) {
    const _0x36b8a8 = _0x205d14;
    if (_0x5d1af4 === 'textLocale') return this['changeVisuMzTextLocale'](_0x474145, _0x1cc8f1);
    if (_0x5d1af4 === _0x36b8a8(0x30e)) return this['changeTextSpeed'](_0x5d1af4, _0x474145, _0x1cc8f1);
    VisuMZ[_0x36b8a8(0x16f)][_0x36b8a8(0x2c9)][_0x36b8a8(0x34e)](this, _0x5d1af4, _0x474145, _0x1cc8f1);
  }),
  (Window_Options[_0x205d14(0x39c)][_0x205d14(0x189)] = function (_0x1d7395, _0x598b5b) {
    const _0x19dcf7 = _0x205d14,
      _0x1f9843 = VisuMZ['MessageCore'][_0x19dcf7(0x26d)][_0x19dcf7(0x1bf)][_0x19dcf7(0x305)] || [],
      _0x37a22a = ConfigManager['textLocale'];
    let _0x40ad7d = _0x1f9843[_0x19dcf7(0x2fc)](_0x37a22a);
    _0x40ad7d += _0x1d7395 ? 0x1 : -0x1;
    if (_0x40ad7d >= _0x1f9843[_0x19dcf7(0x3d7)]) _0x40ad7d = _0x598b5b ? 0x0 : _0x1f9843[_0x19dcf7(0x3d7)] - 0x1;
    if (_0x40ad7d < 0x0) _0x40ad7d = _0x598b5b ? _0x1f9843[_0x19dcf7(0x3d7)] - 0x1 : 0x0;
    this[_0x19dcf7(0x2c6)](_0x19dcf7(0x369), _0x1f9843[_0x40ad7d]);
  }),
  (Window_Options['prototype']['changeTextSpeed'] = function (_0x22eb37, _0x4f6fe5, _0x176a98) {
    const _0x2f9d32 = _0x205d14,
      _0x108a74 = this['getConfigValue'](_0x22eb37),
      _0x17d18b = 0x1,
      _0x30ab8a = _0x108a74 + (_0x4f6fe5 ? _0x17d18b : -_0x17d18b);
    _0x30ab8a > 0xb && _0x176a98 ? this[_0x2f9d32(0x2c6)](_0x22eb37, 0x1) : this[_0x2f9d32(0x2c6)](_0x22eb37, _0x30ab8a[_0x2f9d32(0x41e)](0x1, 0xb));
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x465)] = function () {
    const _0x233276 = _0x205d14;
    let _0x55b609 = Window_Base[_0x233276(0x39c)]['contentsHeight']['call'](this);
    return (_0x55b609 -= this[_0x233276(0x315)]()), _0x55b609;
  }),
  (Window_Message[_0x205d14(0x39c)]['refreshDimmerBitmap'] = function () {
    const _0x1541cd = _0x205d14;
    Window_Base[_0x1541cd(0x39c)][_0x1541cd(0x1d8)][_0x1541cd(0x34e)](this), VisuMZ[_0x1541cd(0x16f)][_0x1541cd(0x26d)]['General'][_0x1541cd(0x292)] && this['stretchDimmerSprite']();
  }),
  (Window_Message['prototype']['stretchDimmerSprite'] = function () {
    const _0xfc34e5 = _0x205d14;
    (this[_0xfc34e5(0x434)]['x'] = Math[_0xfc34e5(0x12c)](this[_0xfc34e5(0x17d)] / 0x2)),
      (this[_0xfc34e5(0x434)][_0xfc34e5(0x30d)]['x'] = 0.5),
      (this[_0xfc34e5(0x434)][_0xfc34e5(0x1d2)]['x'] = Graphics[_0xfc34e5(0x17d)]);
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x2c4)] = Window_Message[_0x205d14(0x39c)]['clearFlags']),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x359)] = function () {
    const _0x1c0d3 = _0x205d14;
    VisuMZ['MessageCore'][_0x1c0d3(0x2c4)][_0x1c0d3(0x34e)](this),
      this['clearActorNameAutoColor'](),
      this[_0x1c0d3(0x4a7)](),
      this[_0x1c0d3(0x2e7)](![]),
      this[_0x1c0d3(0x32d)]('default'),
      this[_0x1c0d3(0x2b2)](VisuMZ[_0x1c0d3(0x16f)]['Settings'][_0x1c0d3(0x413)][_0x1c0d3(0x29c)]);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x4a7)] = function () {
    const _0x25f85f = _0x205d14;
    this[_0x25f85f(0x497)]($gameSystem['isMessageWindowWordWrap']());
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x161)] = function () {
    return !![];
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x2b2)] = function (_0x2dfb8f) {
    const _0x25e2d0 = _0x205d14,
      _0xa5c71a = 0xb - ConfigManager[_0x25e2d0(0x30e)];
    (_0x2dfb8f = Math[_0x25e2d0(0x12c)](_0x2dfb8f * _0xa5c71a)), (this[_0x25e2d0(0x22a)] = _0x2dfb8f), (this[_0x25e2d0(0x28b)] = _0x2dfb8f);
  }),
  (VisuMZ['MessageCore'][_0x205d14(0x42a)] = Window_Message['prototype'][_0x205d14(0x4c4)]),
  (Window_Message['prototype'][_0x205d14(0x4c4)] = function () {
    const _0x2f315c = _0x205d14;
    return VisuMZ[_0x2f315c(0x16f)][_0x2f315c(0x42a)][_0x2f315c(0x34e)](this) || Input[_0x2f315c(0x1a4)](VisuMZ[_0x2f315c(0x16f)]['Settings'][_0x2f315c(0x413)][_0x2f315c(0x3e8)]);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x487)] = Window_Message['prototype'][_0x205d14(0x32e)]),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x32e)] = function () {
    const _0xda72ad = _0x205d14;
    let _0x374194 = this['y'];
    (this['x'] = Math['round']((Graphics[_0xda72ad(0x246)] - this['width']) / 0x2)), VisuMZ[_0xda72ad(0x16f)][_0xda72ad(0x487)]['call'](this);
    if (this[_0xda72ad(0x2e6)]) this['y'] = _0x374194;
    this['updateXyOffsets'](), this[_0xda72ad(0x48a)](), this[_0xda72ad(0x2ea)](), this[_0xda72ad(0x2b0)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x4dc)] = Window_Message['prototype'][_0x205d14(0x136)]),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x136)] = function (_0x7de3d3) {
    const _0x46cca7 = _0x205d14;
    this[_0x46cca7(0x443)](_0x7de3d3), this[_0x46cca7(0x363)](_0x7de3d3), VisuMZ['MessageCore'][_0x46cca7(0x4dc)][_0x46cca7(0x34e)](this, _0x7de3d3), this['createContents']();
  }),
  (Window_Message['prototype']['convertNewPageTextStateMacros'] = function (_0x4b6f47) {
    const _0x209a04 = _0x205d14;
    if (!_0x4b6f47) return;
    (this['_macroBypassWordWrap'] = ![]),
      (_0x4b6f47[_0x209a04(0x135)] = this[_0x209a04(0x383)](_0x4b6f47[_0x209a04(0x135)])),
      this[_0x209a04(0x405)] && ((_0x4b6f47[_0x209a04(0x135)] = this[_0x209a04(0x24f)](_0x4b6f47[_0x209a04(0x135)])), (this['_macroBypassWordWrap'] = !![]));
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x24f)] = function (_0x341685) {
    const _0x17b0f6 = _0x205d14;
    if (this[_0x17b0f6(0x15a)]) return _0x341685;
    return Window_Base[_0x17b0f6(0x39c)][_0x17b0f6(0x24f)][_0x17b0f6(0x34e)](this, _0x341685);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x363)] = function (_0x13400a) {
    const _0x4d7cc5 = _0x205d14;
    this[_0x4d7cc5(0x330)](_0x13400a), this[_0x4d7cc5(0x2b3)](_0x13400a), this[_0x4d7cc5(0x3de)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x180)] = Window_Message['prototype'][_0x205d14(0x1a2)]),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x1a2)] = function () {
    const _0x5d68ba = _0x205d14;
    VisuMZ[_0x5d68ba(0x16f)][_0x5d68ba(0x180)][_0x5d68ba(0x34e)](this), this['clearFlags']();
    if (this['_messagePositionReset']) this['messagePositionReset']();
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x3de)] = function () {
    const _0x4ea8ea = _0x205d14;
    this['width'] = $gameSystem[_0x4ea8ea(0x163)]() + this[_0x4ea8ea(0x18b)]();
    this[_0x4ea8ea(0x17d)] = Math[_0x4ea8ea(0x1d6)](Graphics[_0x4ea8ea(0x17d)], this[_0x4ea8ea(0x17d)]);
    const _0x3bf9d2 = $gameSystem['getMessageWindowRows']();
    (this[_0x4ea8ea(0x1da)] = SceneManager[_0x4ea8ea(0x2a2)]['calcWindowHeight'](_0x3bf9d2, ![]) + this[_0x4ea8ea(0x315)]()),
      (this[_0x4ea8ea(0x1da)] = Math[_0x4ea8ea(0x1d6)](Graphics[_0x4ea8ea(0x1da)], this[_0x4ea8ea(0x1da)]));
    if ($gameTemp[_0x4ea8ea(0x24b)]) this[_0x4ea8ea(0x47d)]();
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x18b)] = function () {
    return 0x0;
  }),
  (Window_Message[_0x205d14(0x39c)]['addedHeight'] = function () {
    return 0x0;
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x47d)] = function () {
    const _0x6941a3 = _0x205d14;
    (this['x'] = (Graphics['boxWidth'] - this[_0x6941a3(0x17d)]) / 0x2), ($gameTemp[_0x6941a3(0x24b)] = undefined), this[_0x6941a3(0x2ea)]();
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x4e0)] = function () {
    const _0xf264f4 = _0x205d14,
      _0x24398a = { x: this['x'], y: this['y'] };
    Window_Base[_0xf264f4(0x39c)][_0xf264f4(0x4e0)][_0xf264f4(0x34e)](this), this['updateNameBoxMove'](_0x24398a);
  }),
  (Window_Message[_0x205d14(0x39c)]['canMove'] = function () {
    return !![];
  }),
  (Window_Message['prototype'][_0x205d14(0x12d)] = function (_0x111ab2) {
    const _0x255cb7 = _0x205d14;
    this[_0x255cb7(0x114)] && ((this[_0x255cb7(0x114)]['x'] += this['x'] - _0x111ab2['x']), (this[_0x255cb7(0x114)]['y'] += this['y'] - _0x111ab2['y']));
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x208)] = function (_0x1b114a, _0x594583) {
    const _0x2f7ca2 = _0x205d14;
    this[_0x2f7ca2(0x3b5)](
      this[_0x2f7ca2(0x4e8)]['x'],
      (this[_0x2f7ca2(0x234)] * (Graphics[_0x2f7ca2(0x3c3)] - this['height'])) / 0x2,
      this['_resetRect']['width'],
      this[_0x2f7ca2(0x4e8)][_0x2f7ca2(0x1da)],
      _0x1b114a,
      _0x594583,
    );
  }),
  (Window_Message[_0x205d14(0x39c)]['processCommonEvent'] = function (_0x5d08e8) {
    const _0x17b161 = _0x205d14,
      _0x1fab7f = Window_Base['prototype']['processCommonEvent'][_0x17b161(0x34e)](this, _0x5d08e8);
    _0x5d08e8['drawing'] && this[_0x17b161(0x217)](_0x1fab7f);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x217)] = function (_0x337767) {
    const _0x2c9c7f = _0x205d14;
    if ($gameParty[_0x2c9c7f(0x480)]()) {
    } else $gameMap['addMessageCommonEvent'](_0x337767);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x499)] = function (_0x11029c) {
    const _0x5d5ed0 = _0x205d14;
    this['_textDelayCount']--, this[_0x5d5ed0(0x22a)] <= 0x0 && (this['onProcessCharacter'](_0x11029c), Window_Base[_0x5d5ed0(0x39c)][_0x5d5ed0(0x499)][_0x5d5ed0(0x34e)](this, _0x11029c));
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x492)] = function (_0x569d9e) {
    const _0x5a8835 = _0x205d14;
    this[_0x5a8835(0x22a)] = this['_textDelay'];
    if (this[_0x5a8835(0x28b)] <= 0x0) this[_0x5a8835(0x17f)] = !![];
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x141)] = Window_Message[_0x205d14(0x39c)][_0x205d14(0x1e1)]),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x1e1)] = function (_0x475353, _0x274ac9) {
    const _0x3c100d = _0x205d14;
    !_0x274ac9[_0x3c100d(0x1d0)]
      ? Window_Base[_0x3c100d(0x39c)]['processEscapeCharacter'][_0x3c100d(0x34e)](this, _0x475353, _0x274ac9)
      : VisuMZ[_0x3c100d(0x16f)][_0x3c100d(0x141)][_0x3c100d(0x34e)](this, _0x475353, _0x274ac9);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x4b1)] = Window_Message[_0x205d14(0x39c)][_0x205d14(0x360)]),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x360)] = function (_0x34747e) {
    const _0x363b02 = _0x205d14;
    if (this[_0x363b02(0x47c)]) return ![];
    return VisuMZ[_0x363b02(0x16f)][_0x363b02(0x4b1)][_0x363b02(0x34e)](this, _0x34747e);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x330)] = function (_0x1b7286) {
    const _0x1e2113 = _0x205d14;
    let _0x3fedfe = _0x1b7286['text'];
    this[_0x1e2113(0x126)] = {};
    if (this[_0x1e2113(0x142)]()) return _0x3fedfe;
    (_0x3fedfe = _0x3fedfe['replace'](/<POSITION:[ ]*(.*?)>/gi, (_0x2909d9, _0x27a388) => {
      const _0x223ff6 = _0x1e2113,
        _0x432d58 = _0x27a388[_0x223ff6(0x41c)](',')[_0x223ff6(0x203)](_0x3d36ee => Number(_0x3d36ee) || 0x0);
      if (_0x432d58[0x0] !== undefined) this[_0x223ff6(0x126)]['x'] = Number(_0x432d58[0x0]);
      if (_0x432d58[0x1] !== undefined) this[_0x223ff6(0x126)]['y'] = Number(_0x432d58[0x1]);
      if (_0x432d58[0x2] !== undefined) this[_0x223ff6(0x126)][_0x223ff6(0x17d)] = Number(_0x432d58[0x2]);
      if (_0x432d58[0x3] !== undefined) this[_0x223ff6(0x126)][_0x223ff6(0x1da)] = Number(_0x432d58[0x3]);
      return '';
    })),
      (_0x3fedfe = _0x3fedfe[_0x1e2113(0x351)](/<COORDINATES:[ ]*(.*?)>/gi, (_0x4a87b0, _0x100227) => {
        const _0x4d6e21 = _0x1e2113,
          _0x3830eb = _0x100227['split'](',')['map'](_0x28c48f => Number(_0x28c48f) || 0x0);
        if (_0x3830eb[0x0] !== undefined) this['_forcedPosition']['x'] = Number(_0x3830eb[0x0]);
        if (_0x3830eb[0x1] !== undefined) this[_0x4d6e21(0x126)]['y'] = Number(_0x3830eb[0x1]);
        return '';
      })),
      (_0x3fedfe = _0x3fedfe['replace'](/<DIMENSIONS:[ ]*(.*?)>/gi, (_0x6ce09d, _0x237803) => {
        const _0x12d4f4 = _0x1e2113,
          _0x621c6d = _0x237803[_0x12d4f4(0x41c)](',')['map'](_0x532c74 => Number(_0x532c74) || 0x0);
        if (_0x621c6d[0x0] !== undefined) this[_0x12d4f4(0x126)][_0x12d4f4(0x17d)] = Number(_0x621c6d[0x2]);
        if (_0x621c6d[0x1] !== undefined) this[_0x12d4f4(0x126)]['height'] = Number(_0x621c6d[0x3]);
        return '';
      })),
      (_0x3fedfe = _0x3fedfe[_0x1e2113(0x351)](/<OFFSET:[ ]*(.*?)>/gi, (_0x551058, _0x538707) => {
        const _0x4143bd = _0x1e2113,
          _0x4c1377 = _0x538707[_0x4143bd(0x41c)](',')['map'](_0x20c68a => Number(_0x20c68a) || 0x0);
        let _0x2a2d75 = _0x4c1377[0x0] || 0x0,
          _0x379b51 = _0x4c1377[0x1] || 0x0;
        return $gameSystem[_0x4143bd(0x4d2)](_0x2a2d75, _0x379b51), '';
      })),
      (_0x1b7286[_0x1e2113(0x135)] = _0x3fedfe);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x1ff)] = function () {
    const _0x5d5db3 = $gameSystem['getMessageWindowXyOffsets']();
    (this['x'] += _0x5d5db3['x']), (this['y'] += _0x5d5db3['y']);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x48a)] = function () {
    const _0x46b835 = _0x205d14;
    this[_0x46b835(0x126)] = this[_0x46b835(0x126)] || {};
    const _0x4ab0e5 = ['x', 'y', _0x46b835(0x17d), _0x46b835(0x1da)];
    for (const _0x41e420 of _0x4ab0e5) {
      this['_forcedPosition'][_0x41e420] !== undefined && (this[_0x41e420] = Number(this[_0x46b835(0x126)][_0x41e420]));
    }
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x2b3)] = function (_0x5c85fd) {
    const _0x35f049 = _0x205d14;
    this[_0x35f049(0x47c)] = ![];
    let _0x5553ae = _0x5c85fd['text'];
    (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTO|AUTOSIZE|AUTO SIZE)>/gi, () => {
      const _0x30fc0d = _0x35f049;
      return this[_0x30fc0d(0x199)](_0x5553ae, !![], !![]), this[_0x30fc0d(0x278)](_0x30fc0d(0x3cb)), '';
    })),
      (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOWIDTH|AUTO WIDTH)>/gi, () => {
        const _0x329f45 = _0x35f049;
        return this[_0x329f45(0x199)](_0x5553ae, !![], ![]), this[_0x329f45(0x278)](_0x329f45(0x3cb)), '';
      })),
      (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOHEIGHT|AUTO HEIGHT)>/gi, () => {
        const _0x37d6ca = _0x35f049;
        return this[_0x37d6ca(0x199)](_0x5553ae, ![], !![]), this['processAutoPosition'](_0x37d6ca(0x3cb)), '';
      }));
    if (SceneManager[_0x35f049(0x1b4)]())
      (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi, (_0x106de4, _0x493749) => {
        const _0x5797ab = _0x35f049;
        return this[_0x5797ab(0x199)](_0x5553ae, !![], !![]), this['processAutoPosition'](_0x5797ab(0x374), Number(_0x493749) || 0x1), '';
      })),
        (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOPARTY|AUTO PARTY):[ ](.*?)>/gi, (_0x10ab8f, _0xaa3317) => {
          const _0x18b73f = _0x35f049;
          return this[_0x18b73f(0x199)](_0x5553ae, !![], !![]), this[_0x18b73f(0x278)](_0x18b73f(0x2f5), Number(_0xaa3317) || 0x0), '';
        })),
        (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOENEMY|AUTO ENEMY):[ ](.*?)>/gi, (_0x3a7c48, _0x589017) => {
          const _0x2f5cd2 = _0x35f049;
          return this['processAutoSize'](_0x5553ae, !![], !![]), this['processAutoPosition'](_0x2f5cd2(0x3bc), Number(_0x589017) || 0x0), '';
        }));
    else
      SceneManager[_0x35f049(0x368)]() &&
        ((_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOPLAYER|AUTO PLAYER)>/gi, (_0x10283c, _0x2f5b53) => {
          const _0x144b3e = _0x35f049;
          return this[_0x144b3e(0x199)](_0x5553ae, !![], !![]), this['processAutoPosition'](_0x144b3e(0x1fc), 0x0), '';
        })),
        (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi, (_0x2f63ed, _0x15e1eb) => {
          const _0x6ef040 = _0x35f049;
          return this[_0x6ef040(0x199)](_0x5553ae, !![], !![]), this[_0x6ef040(0x278)]('map\x20actor', Number(_0x15e1eb) || 0x1), '';
        })),
        (_0x5553ae = _0x5553ae['replace'](/<(?:AUTOPARTY|AUTO PARTY):[ ](.*?)>/gi, (_0xba2c91, _0x29bc8b) => {
          const _0x48279f = _0x35f049;
          return this[_0x48279f(0x199)](_0x5553ae, !![], !![]), this[_0x48279f(0x278)](_0x48279f(0x1c0), Number(_0x29bc8b) || 0x0), '';
        })),
        (_0x5553ae = _0x5553ae[_0x35f049(0x351)](/<(?:AUTOEVENT|AUTO EVENT):[ ](.*?)>/gi, (_0x29d6c9, _0x329d55) => {
          const _0x5b06b4 = _0x35f049;
          return this[_0x5b06b4(0x199)](_0x5553ae, !![], !![]), this[_0x5b06b4(0x278)](_0x5b06b4(0x328), Number(_0x329d55) || 0x0), '';
        })));
    _0x5c85fd['text'] = _0x5553ae;
  }),
  (Window_Message['_autoSizeRegexp'] = /<(?:AUTO|AUTOSIZE|AUTO SIZE|AUTOWIDTH|AUTO WIDTH|AUTOHEIGHT|AUTO HEIGHT|AUTOPLAYER|AUTO PLAYER)>/gi),
  (Window_Message['_autoPosRegExp'] = /<(?:AUTOPARTY|AUTO PARTY|AUTOPLAYER|AUTO PLAYER|AUTOEVENT|AUTO EVENT|AUTOENEMY|AUTO ENEMY|AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x199)] = function (_0x5deca9, _0x2c70bb, _0x3eb18d) {
    const _0x3b5f4e = _0x205d14;
    (_0x5deca9 = _0x5deca9['replace'](Window_Message[_0x3b5f4e(0x32a)], '')),
      (_0x5deca9 = _0x5deca9[_0x3b5f4e(0x351)](Window_Message['_autoPosRegExp'], '')),
      (this[_0x3b5f4e(0x439)] = !![]),
      (this[_0x3b5f4e(0x47c)] = !![]),
      this[_0x3b5f4e(0x497)](![]);
    const _0x1ce66d = this[_0x3b5f4e(0x45a)](_0x5deca9);
    if (_0x2c70bb) {
      let _0x370b70 = _0x1ce66d['width'] + $gameSystem['windowPadding']() * 0x2 + 0x6;
      const _0x4d6971 = $gameMessage[_0x3b5f4e(0x120)]() !== '',
        _0x8897f5 = ImageManager['faceWidth'],
        _0x3509c5 = 0x14;
      _0x370b70 += _0x4d6971 ? _0x8897f5 + _0x3509c5 : 0x4;
      if (_0x370b70 % 0x2 !== 0x0) _0x370b70 += 0x1;
      $gameSystem[_0x3b5f4e(0x26e)](_0x370b70);
    }
    if (_0x3eb18d) {
      let _0x27cdcf = Math[_0x3b5f4e(0x429)](_0x1ce66d[_0x3b5f4e(0x1da)] / this[_0x3b5f4e(0x21b)]());
      $gameSystem[_0x3b5f4e(0x233)](_0x27cdcf);
    }
    this[_0x3b5f4e(0x212)](), this[_0x3b5f4e(0x3fd)](), (this[_0x3b5f4e(0x439)] = ![]), (this[_0x3b5f4e(0x3e3)] = !![]);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x212)] = function () {
    const _0x3cafad = _0x205d14;
    this[_0x3cafad(0x3de)](), this[_0x3cafad(0x32e)](), this[_0x3cafad(0x47d)](), this[_0x3cafad(0x43a)](), this[_0x3cafad(0x3a0)]['clear'](), this[_0x3cafad(0x3d1)]();
  }),
  (Window_Message[_0x205d14(0x39c)]['processAutoPosition'] = function (_0x252a30, _0x51835d) {
    const _0x224276 = _0x205d14;
    switch (_0x252a30[_0x224276(0x4a8)]()[_0x224276(0x28e)]()) {
      case _0x224276(0x374):
        this[_0x224276(0x2e6)] = $gameActors[_0x224276(0x145)](_0x51835d);
        break;
      case _0x224276(0x2f5):
        this[_0x224276(0x2e6)] = $gameParty[_0x224276(0x4c5)]()[_0x51835d - 0x1];
        break;
      case 'battle\x20enemy':
        this[_0x224276(0x2e6)] = $gameTroop['members']()[_0x51835d - 0x1];
        break;
      case _0x224276(0x1fc):
        this[_0x224276(0x2e6)] = $gamePlayer;
        break;
      case _0x224276(0x250):
        const _0x455d56 = $gameActors[_0x224276(0x145)](_0x51835d)[_0x224276(0x2f1)]();
        _0x455d56 === 0x0 ? (this[_0x224276(0x2e6)] = $gamePlayer) : (this['_autoPositionTarget'] = $gamePlayer[_0x224276(0x3c5)]()['follower'](_0x455d56 - 0x1));
        break;
      case _0x224276(0x1c0):
        _0x51835d === 0x1 ? (this[_0x224276(0x2e6)] = $gamePlayer) : (this[_0x224276(0x2e6)] = $gamePlayer[_0x224276(0x3c5)]()[_0x224276(0x2ff)](_0x51835d - 0x2));
        break;
      case 'map\x20event':
        this[_0x224276(0x2e6)] = $gameMap[_0x224276(0x3a3)](_0x51835d);
        break;
    }
    this['_autoPositionTarget'] && this[_0x224276(0x473)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x486)] = Window_Message[_0x205d14(0x39c)][_0x205d14(0x3b8)]),
  (Window_Message['prototype'][_0x205d14(0x3b8)] = function () {
    const _0x39bd05 = _0x205d14;
    this[_0x39bd05(0x473)](), VisuMZ[_0x39bd05(0x16f)][_0x39bd05(0x486)][_0x39bd05(0x34e)](this);
  }),
  (Window_Message['prototype'][_0x205d14(0x473)] = function () {
    const _0xae6131 = _0x205d14;
    if (!this[_0xae6131(0x2e6)]) return;
    const _0x434171 = SceneManager[_0xae6131(0x2a2)];
    if (!_0x434171) return;
    const _0x28f584 = _0x434171['_spriteset'];
    if (!_0x28f584) return;
    const _0x18ab4d = _0x28f584[_0xae6131(0x407)](this[_0xae6131(0x2e6)]);
    if (!_0x18ab4d) return;
    let _0x6e5db1 = _0x18ab4d['x'];
    if (SceneManager[_0xae6131(0x368)]()) _0x6e5db1 *= $gameScreen[_0xae6131(0x362)]();
    else {
      if (SceneManager['isSceneBattle']() && Imported[_0xae6131(0x4cd)]) {
        let _0x27c371 = _0x18ab4d['x'] - Graphics[_0xae6131(0x246)] * _0x28f584['anchor']['x'];
        _0x6e5db1 += _0x27c371 * (_0x28f584['scale']['x'] - 0x1);
      }
    }
    (_0x6e5db1 -= this[_0xae6131(0x17d)] / 0x2), (_0x6e5db1 -= (Graphics[_0xae6131(0x17d)] - Graphics[_0xae6131(0x246)]) / 0x2), (_0x6e5db1 += this[_0xae6131(0x28d)]());
    let _0x386cbd = _0x18ab4d['y'];
    if (SceneManager[_0xae6131(0x368)]())
      (_0x386cbd -= _0x18ab4d[_0xae6131(0x1da)] + 0x8), (_0x386cbd *= $gameScreen[_0xae6131(0x362)]()), (_0x386cbd -= this[_0xae6131(0x1da)] * $gameScreen[_0xae6131(0x362)]());
    else {
      if (SceneManager['isSceneBattle']() && Imported[_0xae6131(0x4cd)]) {
        let _0x592318 = _0x18ab4d[_0xae6131(0x1da)] * _0x28f584['scale']['y'];
        _0x386cbd -= this['height'] * _0x28f584['scale']['y'] + _0x592318 + 0x8;
        let _0x27a049 = _0x18ab4d['y'] - Graphics[_0xae6131(0x3c3)] * _0x28f584['anchor']['y'];
        _0x386cbd += _0x27a049 * (_0x28f584[_0xae6131(0x1d2)]['y'] - 0x1);
      } else (_0x386cbd -= _0x18ab4d[_0xae6131(0x1da)] + 0x8), (_0x386cbd -= this[_0xae6131(0x1da)]);
    }
    (_0x386cbd -= (Graphics[_0xae6131(0x1da)] - Graphics[_0xae6131(0x3c3)]) / 0x2), (_0x386cbd += this[_0xae6131(0x356)]());
    const _0x5efb9d = $gameSystem[_0xae6131(0x144)]();
    (_0x6e5db1 += _0x5efb9d['x']),
      (_0x386cbd += _0x5efb9d['y']),
      (this['x'] = Math[_0xae6131(0x12c)](_0x6e5db1)),
      (this['y'] = Math[_0xae6131(0x12c)](_0x386cbd)),
      this[_0xae6131(0x2ea)](!![], ![]),
      (this[_0xae6131(0x126)] = this[_0xae6131(0x126)] || {}),
      (this[_0xae6131(0x126)]['x'] = this['x']),
      (this[_0xae6131(0x126)]['y'] = this['y']),
      (this['_forcedPosition'][_0xae6131(0x17d)] = this[_0xae6131(0x17d)]),
      (this[_0xae6131(0x126)][_0xae6131(0x1da)] = this['height']),
      this[_0xae6131(0x114)][_0xae6131(0x32e)]();
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x28d)] = function () {
    return 0x0;
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x356)] = function () {
    return 0x0;
  }),
  (Window_Message[_0x205d14(0x39c)]['messagePositionReset'] = function () {
    const _0x3ba762 = _0x205d14;
    (this[_0x3ba762(0x3e3)] = ![]), (this['_autoPositionTarget'] = undefined), $gameSystem[_0x3ba762(0x474)](), this[_0x3ba762(0x212)](), (this[_0x3ba762(0x4bb)] = 0x0);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x1dd)] = function (_0xa35d12) {
    const _0x5f5db4 = _0x205d14;
    return Window_Base[_0x5f5db4(0x39c)][_0x5f5db4(0x1dd)][_0x5f5db4(0x34e)](this, _0xa35d12);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x21d)] = function (_0x17f07a) {
    const _0x14fe10 = _0x205d14;
    return Window_Base['prototype']['postConvertEscapeCharacters'][_0x14fe10(0x34e)](this, _0x17f07a);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x2ce)] = function (_0x2d8ca4) {
    const _0x70d31c = _0x205d14;
    this[_0x70d31c(0x3b9)](_0x2d8ca4), Window_Base['prototype'][_0x70d31c(0x2ce)]['call'](this, _0x2d8ca4), this[_0x70d31c(0x462)](_0x2d8ca4);
  }),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x3b9)] = function (_0x2f9b33) {}),
  (Window_Message[_0x205d14(0x39c)][_0x205d14(0x462)] = function (_0x1bf520) {}),
  (Window_NameBox['prototype'][_0x205d14(0x161)] = function () {
    return ![];
  }),
  (Window_NameBox['prototype'][_0x205d14(0x15e)] = function () {
    const _0x3df430 = _0x205d14;
    Window_Base[_0x3df430(0x39c)][_0x3df430(0x15e)][_0x3df430(0x34e)](this), this[_0x3df430(0x1db)](this[_0x3df430(0x2b8)]());
  }),
  (Window_NameBox[_0x205d14(0x39c)]['defaultColor'] = function () {
    const _0x51a64f = _0x205d14,
      _0x305d38 = VisuMZ[_0x51a64f(0x16f)][_0x51a64f(0x26d)][_0x51a64f(0x413)][_0x51a64f(0x1ed)];
    return ColorManager['textColor'](_0x305d38);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x47b)] = Window_NameBox[_0x205d14(0x39c)]['updatePlacement']),
  (Window_NameBox[_0x205d14(0x39c)][_0x205d14(0x32e)] = function () {
    const _0x11ba17 = _0x205d14;
    VisuMZ[_0x11ba17(0x16f)][_0x11ba17(0x47b)][_0x11ba17(0x34e)](this), this[_0x11ba17(0x408)](), this[_0x11ba17(0x211)](), this['clampPlacementPosition'](), this[_0x11ba17(0x19e)]();
  }),
  (Window_NameBox[_0x205d14(0x39c)]['preConvertEscapeCharacters'] = function (_0x5a8d5e) {
    const _0x2abe39 = _0x205d14;
    return (
      (_0x5a8d5e = _0x5a8d5e['replace'](/<LEFT>/gi, this[_0x2abe39(0x259)][_0x2abe39(0x3cf)](this, 0x0))),
      (_0x5a8d5e = _0x5a8d5e['replace'](/<CENTER>/gi, this['setRelativePosition'][_0x2abe39(0x3cf)](this, 0x5))),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x351)](/<RIGHT>/gi, this['setRelativePosition'][_0x2abe39(0x3cf)](this, 0xa))),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x351)](/<POSITION:[ ](\d+)>/gi, (_0x13e630, _0x14d425) => this[_0x2abe39(0x259)](parseInt(_0x14d425)))),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x351)](/<\/LEFT>/gi, '')),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x351)](/<\/CENTER>/gi, '')),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x351)](/<\/RIGHT>/gi, '')),
      (_0x5a8d5e = _0x5a8d5e[_0x2abe39(0x28e)]()),
      Window_Base['prototype'][_0x2abe39(0x1dd)][_0x2abe39(0x34e)](this, _0x5a8d5e)
    );
  }),
  (Window_NameBox['prototype'][_0x205d14(0x259)] = function (_0x280c7a) {
    return (this['_relativePosition'] = _0x280c7a), '';
  }),
  (Window_NameBox[_0x205d14(0x39c)][_0x205d14(0x408)] = function () {
    const _0x2c6d00 = _0x205d14;
    if ($gameMessage[_0x2c6d00(0x47a)]()) return;
    this[_0x2c6d00(0x12e)] = this[_0x2c6d00(0x12e)] || 0x0;
    const _0x2cb2cd = this[_0x2c6d00(0x2af)],
      _0x31a1ad = Math[_0x2c6d00(0x4ef)]((_0x2cb2cd[_0x2c6d00(0x17d)] * this['_relativePosition']) / 0xa);
    (this['x'] = _0x2cb2cd['x'] + _0x31a1ad - Math[_0x2c6d00(0x4ef)](this[_0x2c6d00(0x17d)] / 0x2)),
      (this['x'] = this['x'][_0x2c6d00(0x41e)](_0x2cb2cd['x'], _0x2cb2cd['x'] + _0x2cb2cd[_0x2c6d00(0x17d)] - this[_0x2c6d00(0x17d)]));
  }),
  (Window_NameBox['prototype'][_0x205d14(0x211)] = function () {
    const _0x19fcfa = _0x205d14;
    if ($gameMessage[_0x19fcfa(0x47a)]()) return;
    this[_0x19fcfa(0x12e)] = this[_0x19fcfa(0x12e)] || 0x0;
    const _0x29d2fe = VisuMZ[_0x19fcfa(0x16f)][_0x19fcfa(0x26d)][_0x19fcfa(0x413)]['NameBoxWindowOffsetX'],
      _0x78a893 = VisuMZ[_0x19fcfa(0x16f)][_0x19fcfa(0x26d)][_0x19fcfa(0x413)][_0x19fcfa(0x347)],
      _0x2c2367 = (0x5 - this[_0x19fcfa(0x12e)]) / 0x5;
    (this['x'] += Math[_0x19fcfa(0x4ef)](_0x29d2fe * _0x2c2367)), (this['y'] += _0x78a893);
  }),
  (Window_NameBox[_0x205d14(0x39c)][_0x205d14(0x19e)] = function () {
    const _0x992d2c = _0x205d14,
      _0x9e7de4 = this[_0x992d2c(0x2af)],
      _0x1de24d = _0x9e7de4['y'],
      _0x14f0bc = VisuMZ[_0x992d2c(0x16f)]['Settings'][_0x992d2c(0x413)]['NameBoxWindowOffsetY'];
    _0x1de24d > this['y'] && _0x1de24d < this['y'] + this['height'] - _0x14f0bc && (this['y'] = _0x9e7de4['y'] + _0x9e7de4[_0x992d2c(0x1da)]);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2c0)] = Window_NameBox[_0x205d14(0x39c)][_0x205d14(0x428)]),
  (Window_NameBox[_0x205d14(0x39c)][_0x205d14(0x428)] = function () {
    const _0x13133c = _0x205d14;
    (this[_0x13133c(0x12e)] = 0x0), VisuMZ[_0x13133c(0x16f)][_0x13133c(0x2c0)][_0x13133c(0x34e)](this);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x142)] = function () {
    return ![];
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x161)] = function () {
    return !![];
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x3df)] = function () {
    const _0x2198d1 = _0x205d14;
    return $gameSystem[_0x2198d1(0x4a1)]() + 0x8;
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x41a)] = function () {
    return $gameSystem['getChoiceListMaxColumns']();
  }),
  (Window_ChoiceList[_0x205d14(0x39c)]['start'] = function () {
    const _0x1fbb0e = _0x205d14;
    this[_0x1fbb0e(0x428)](), this[_0x1fbb0e(0x20e)](), this[_0x1fbb0e(0x249)](), this[_0x1fbb0e(0x1b2)](), this[_0x1fbb0e(0x252)]();
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x2ac)] = function () {
    const _0x38607a = _0x205d14;
    $gameMessage['onChoice'](this[_0x38607a(0x4ea)]()),
      this[_0x38607a(0x2af)][_0x38607a(0x1a2)](),
      this['close'](),
      this[_0x38607a(0x4b5)] && (this['_helpWindow'][_0x38607a(0x2a4)](), this[_0x38607a(0x4b5)][_0x38607a(0x192)]());
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x33d)] = Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x332)]),
  (Window_ChoiceList[_0x205d14(0x39c)]['callCancelHandler'] = function () {
    const _0x43dc94 = _0x205d14;
    VisuMZ[_0x43dc94(0x16f)][_0x43dc94(0x33d)][_0x43dc94(0x34e)](this), this[_0x43dc94(0x4b5)] && (this[_0x43dc94(0x4b5)][_0x43dc94(0x2a4)](), this['_helpWindow'][_0x43dc94(0x192)]());
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x428)] = function () {
    const _0x1e8e81 = _0x205d14;
    this['clearCommandList'](),
      this['makeCommandList'](),
      this[_0x1e8e81(0x2af)] && (this[_0x1e8e81(0x32e)](), this[_0x1e8e81(0x401)]()),
      this[_0x1e8e81(0x3d1)](),
      this[_0x1e8e81(0x4c7)](),
      this['refreshDimmerBitmap'](),
      Window_Selectable[_0x1e8e81(0x39c)]['refresh'][_0x1e8e81(0x34e)](this);
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x196)] = function () {
    const _0x2e2d0c = _0x205d14;
    $gameMessage['_scriptCall'] ? this['makeCommandListScriptCall']() : this[_0x2e2d0c(0x489)](), this[_0x2e2d0c(0x2dd)](), this[_0x2e2d0c(0x275)]();
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x3fa)] = function () {
    const _0x37d42e = _0x205d14,
      _0x17ab5 = $gameMessage[_0x37d42e(0x171)]();
    let _0x403994 = 0x0;
    for (let _0x41e275 of _0x17ab5) {
      _0x41e275 = this[_0x37d42e(0x357)](_0x41e275);
      if (this[_0x37d42e(0x423)](_0x41e275)) {
        const _0x410229 = this[_0x37d42e(0x18e)](_0x41e275),
          _0x223442 = this[_0x37d42e(0x29b)](_0x41e275);
        this[_0x37d42e(0x435)](_0x410229, 'choice', _0x223442, _0x403994);
      }
      _0x403994++;
    }
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x489)] = function () {
    const _0x1c6416 = _0x205d14,
      _0x4c3a90 = $gameMessage[_0x1c6416(0x171)](),
      _0x5d3c62 = $gameMessage[_0x1c6416(0x490)](),
      _0x44dbbe = $gameMessage[_0x1c6416(0x13e)](),
      _0x2b1612 = _0x4c3a90['length'];
    let _0x36e812 = 0x0;
    for (let _0x49bd5a = 0x0; _0x49bd5a < _0x2b1612; _0x49bd5a++) {
      if (this[_0x1c6416(0x38a)]['length'] >= _0x44dbbe) break;
      const _0x1822c0 = _0x5d3c62[_0x49bd5a];
      let _0x3c28cf = _0x4c3a90[_0x1822c0];
      if (_0x3c28cf === undefined) continue;
      _0x3c28cf = this[_0x1c6416(0x357)](_0x3c28cf);
      if (this[_0x1c6416(0x423)](_0x3c28cf)) {
        const _0x24a043 = this[_0x1c6416(0x18e)](_0x3c28cf),
          _0x1e9ce6 = this[_0x1c6416(0x29b)](_0x3c28cf);
        this[_0x1c6416(0x435)](_0x24a043, _0x1c6416(0x370), _0x1e9ce6, _0x1822c0);
      }
      _0x36e812++;
    }
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x357)] = function (_0x1b9cec) {
    const _0x3cc3c5 = _0x205d14;
    return Window_Base[_0x3cc3c5(0x39c)][_0x3cc3c5(0x383)]['call'](this, _0x1b9cec);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x423)] = function (_0x54c772) {
    const _0xda394e = _0x205d14;
    if (Imported['VisuMZ_1_EventsMoveCore']) $gameMessage[_0xda394e(0x1ad)]();
    if (_0x54c772['match'](/<HIDE>/i)) return ![];
    if (_0x54c772[_0xda394e(0x127)](/<SHOW>/i)) return !![];
    if (_0x54c772[_0xda394e(0x127)](/<SHOW[ ](?:|ALL )(?:SW|SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x5bcadc = RegExp['$1'][_0xda394e(0x41c)](',')[_0xda394e(0x203)](_0x544cb6 => Number(_0x544cb6) || 0x0);
      if (_0x5bcadc['some'](_0x2cfece => !$gameSwitches[_0xda394e(0x396)](_0x2cfece))) return ![];
    }
    if (_0x54c772[_0xda394e(0x127)](/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x4473d1 = RegExp['$1'][_0xda394e(0x41c)](',')[_0xda394e(0x203)](_0x5176f0 => Number(_0x5176f0) || 0x0);
      if (_0x4473d1['every'](_0x57452a => !$gameSwitches[_0xda394e(0x396)](_0x57452a))) return ![];
    }
    if (_0x54c772[_0xda394e(0x127)](/<HIDE[ ](?:|ALL )(?:SW|SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x1e6bbb = RegExp['$1'][_0xda394e(0x41c)](',')[_0xda394e(0x203)](_0x1bc913 => Number(_0x1bc913) || 0x0);
      if (_0x1e6bbb['every'](_0x5b69c7 => $gameSwitches['value'](_0x5b69c7))) return ![];
    }
    if (_0x54c772['match'](/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x472172 = RegExp['$1']['split'](',')[_0xda394e(0x203)](_0x1b0730 => Number(_0x1b0730) || 0x0);
      if (_0x472172[_0xda394e(0x404)](_0x262404 => $gameSwitches['value'](_0x262404))) return ![];
    }
    return !![];
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x18e)] = function (_0x504fbf) {
    const _0x34f639 = _0x205d14;
    let _0x16da1f = _0x504fbf;
    return (_0x16da1f = _0x16da1f['replace'](/<(?:BR|LINEBREAK)>/gi, '\x0a')), (_0x16da1f = _0x16da1f[_0x34f639(0x351)](/<LINE\x1bWrapBreak[0]BREAK>/gi, '\x0a')), _0x16da1f;
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x29b)] = function (_0x28dfa1) {
    const _0x5a9207 = _0x205d14;
    if (Imported[_0x5a9207(0x288)]) $gameMessage[_0x5a9207(0x1ad)]();
    if (_0x28dfa1[_0x5a9207(0x127)](/<DISABLE>/i)) return ![];
    if (_0x28dfa1[_0x5a9207(0x127)](/<ENABLE>/i)) return !![];
    if (_0x28dfa1[_0x5a9207(0x127)](/<ENABLE[ ](?:|ALL )(?:SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x513ecd = RegExp['$1'][_0x5a9207(0x41c)](',')[_0x5a9207(0x203)](_0xee4cc0 => Number(_0xee4cc0) || 0x0);
      if (_0x513ecd[_0x5a9207(0x404)](_0x1a483d => !$gameSwitches[_0x5a9207(0x396)](_0x1a483d))) return ![];
    }
    if (_0x28dfa1[_0x5a9207(0x127)](/<ENABLE ANY[ ](?:SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x5bd382 = RegExp['$1'][_0x5a9207(0x41c)](',')[_0x5a9207(0x203)](_0x38555e => Number(_0x38555e) || 0x0);
      if (_0x5bd382[_0x5a9207(0x348)](_0x1b4be6 => !$gameSwitches['value'](_0x1b4be6))) return ![];
    }
    if (_0x28dfa1[_0x5a9207(0x127)](/<DISABLE[ ](?:|ALL )(?:SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x100714 = RegExp['$1'][_0x5a9207(0x41c)](',')['map'](_0x3f6008 => Number(_0x3f6008) || 0x0);
      if (_0x100714['every'](_0x1cc409 => $gameSwitches[_0x5a9207(0x396)](_0x1cc409))) return ![];
    }
    if (_0x28dfa1[_0x5a9207(0x127)](/<DISABLE ANY[ ](?:SWITCH|SWITCHES):[ ](.*?)>/i)) {
      const _0x5230e0 = RegExp['$1']['split'](',')[_0x5a9207(0x203)](_0x3b3191 => Number(_0x3b3191) || 0x0);
      if (_0x5230e0[_0x5a9207(0x404)](_0x1fe636 => $gameSwitches[_0x5a9207(0x396)](_0x1fe636))) return ![];
    }
    return !![];
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x2dd)] = function () {
    const _0x11aed4 = _0x205d14;
    (this['_choiceHelpDescriptions'] = {}), this['_helpWindow'] && (this[_0x11aed4(0x4b5)][_0x11aed4(0x2a4)](), this['_helpWindow']['hide']());
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x275)] = function () {
    const _0x96e2e0 = _0x205d14,
      _0x1ddd46 = /<(?:HELP|HELP DESCRIPTION|DESCRIPTION)>\s*([\s\S]*)\s*<\/(?:HELP|HELP DESCRIPTION|DESCRIPTION)>/i;
    for (const _0x2806de of this[_0x96e2e0(0x38a)]) {
      if (!_0x2806de) continue;
      const _0x7da50f = this[_0x96e2e0(0x38a)]['indexOf'](_0x2806de);
      if (_0x2806de[_0x96e2e0(0x201)]['match'](_0x1ddd46)) {
        const _0xd04abd = String(RegExp['$1']);
        (this[_0x96e2e0(0x48d)][_0x7da50f] = _0xd04abd[_0x96e2e0(0x28e)]()), (_0x2806de[_0x96e2e0(0x201)] = _0x2806de[_0x96e2e0(0x201)]['replace'](_0x1ddd46, '')[_0x96e2e0(0x28e)]());
      } else this['_choiceHelpDescriptions'][_0x7da50f] = '';
    }
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x252)] = function () {
    const _0x3af662 = _0x205d14;
    if (this[_0x3af662(0x38a)][_0x3af662(0x404)](_0x173217 => _0x173217[_0x3af662(0x4f5)])) return;
    this['deactivate'](), this[_0x3af662(0x170)](), ($gameMessage[_0x3af662(0x3b7)] = []), this[_0x3af662(0x2af)][_0x3af662(0x267)]() && this[_0x3af662(0x2af)][_0x3af662(0x409)]();
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x43c)] = Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x32e)]),
  (Window_ChoiceList['prototype'][_0x205d14(0x32e)] = function () {
    const _0x3bda7e = _0x205d14;
    VisuMZ[_0x3bda7e(0x16f)]['Window_ChoiceList_updatePlacement'][_0x3bda7e(0x34e)](this), this[_0x3bda7e(0x46b)](), this['clampPlacementPosition']();
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x401)] = function () {
    const _0x1df26f = _0x205d14;
    if (!this[_0x1df26f(0x2ae)]) return;
    const _0x3e1345 = 0x8,
      _0x43e8ee = this['_cancelButton'],
      _0x2f645a = this['x'] + this[_0x1df26f(0x17d)],
      _0x42ac36 = Math[_0x1df26f(0x4ef)]((Graphics[_0x1df26f(0x17d)] - Graphics[_0x1df26f(0x246)]) / 0x2);
    _0x2f645a >= Graphics[_0x1df26f(0x246)] + _0x42ac36 - _0x43e8ee[_0x1df26f(0x17d)] + _0x3e1345 ? (_0x43e8ee['x'] = -_0x43e8ee['width'] - _0x3e1345) : (_0x43e8ee['x'] = this['width'] + _0x3e1345),
      (_0x43e8ee['y'] = this[_0x1df26f(0x1da)] / 0x2 - _0x43e8ee[_0x1df26f(0x1da)] / 0x2);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x200)] = Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x1df)]),
  (Window_ChoiceList['prototype']['windowX'] = function () {
    const _0x27f9cb = _0x205d14;
    return this[_0x27f9cb(0x2af)] ? this[_0x27f9cb(0x445)]() : VisuMZ['MessageCore'][_0x27f9cb(0x200)][_0x27f9cb(0x34e)](this);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x445)] = function () {
    const _0x3b2e3d = _0x205d14,
      _0x5833f1 = $gameMessage[_0x3b2e3d(0x18c)]();
    if (_0x5833f1 === 0x1) return (Graphics[_0x3b2e3d(0x246)] - this[_0x3b2e3d(0x238)]()) / 0x2;
    else return _0x5833f1 === 0x2 ? this[_0x3b2e3d(0x2af)]['x'] + this[_0x3b2e3d(0x2af)]['width'] - this['windowWidth']() : this[_0x3b2e3d(0x2af)]['x'];
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x238)] = function () {
    const _0x46aabf = _0x205d14,
      _0x56adfa = (this[_0x46aabf(0x10f)]() + this[_0x46aabf(0x277)]()) * this[_0x46aabf(0x41a)]() + this['padding'] * 0x2;
    return Math[_0x46aabf(0x1d6)](_0x56adfa, Graphics[_0x46aabf(0x17d)]);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x197)] = function () {
    const _0x2fbec1 = _0x205d14,
      _0x43c407 = $gameMessage[_0x2fbec1(0x171)]()
        [_0x2fbec1(0x203)](_0x1610be => this[_0x2fbec1(0x357)](_0x1610be))
        [_0x2fbec1(0x43b)](_0x19340b => this[_0x2fbec1(0x423)](_0x19340b));
    let _0x8a928d = Math[_0x2fbec1(0x429)](_0x43c407[_0x2fbec1(0x3d7)] / this[_0x2fbec1(0x41a)]());
    if (!$gameMessage['_scriptCall']) {
      const _0x4213df = $gameMessage['maxShuffleChoices']();
      _0x8a928d = Math[_0x2fbec1(0x429)](Math[_0x2fbec1(0x1d6)](_0x4213df, _0x43c407[_0x2fbec1(0x3d7)]) / this[_0x2fbec1(0x41a)]());
    }
    return Math[_0x2fbec1(0x436)](0x1, Math[_0x2fbec1(0x1d6)](_0x8a928d, this[_0x2fbec1(0x313)]()));
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x313)] = function () {
    const _0x77b38b = _0x205d14,
      _0x41a4fe = this[_0x77b38b(0x2af)],
      _0x18d620 = _0x41a4fe ? _0x41a4fe['y'] : 0x0,
      _0x134a04 = _0x41a4fe ? _0x41a4fe['height'] : 0x0,
      _0x5ede59 = Graphics[_0x77b38b(0x3c3)] / 0x2;
    return _0x18d620 < _0x5ede59 && _0x18d620 + _0x134a04 > _0x5ede59 ? 0x4 : $gameSystem[_0x77b38b(0x412)]();
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x10f)] = function () {
    const _0x55ee08 = _0x205d14;
    let _0x376d79 = this[_0x55ee08(0x31b)]();
    for (const _0x160300 of this[_0x55ee08(0x38a)]) {
      const _0xf2c2b4 = _0x160300[_0x55ee08(0x201)],
        _0x653d07 = this[_0x55ee08(0x1ce)](_0xf2c2b4),
        _0x58dc6d = this['textSizeEx'](_0xf2c2b4)[_0x55ee08(0x17d)] + _0x653d07,
        _0x39cba6 = Math[_0x55ee08(0x429)](_0x58dc6d) + this['itemPadding']() * 0x2;
      _0x376d79 = Math[_0x55ee08(0x436)](_0x376d79, _0x39cba6);
    }
    return _0x376d79;
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x31b)] = function () {
    const _0x1f3aaa = _0x205d14;
    let _0x432937 = $gameSystem[_0x1f3aaa(0x4aa)]();
    const _0x1e0d81 = $gameMessage[_0x1f3aaa(0x171)]();
    for (const _0xba7b7c of _0x1e0d81) {
      _0xba7b7c['match'](/<CHOICE WIDTH:[ ](\d+)>/gi) && (_0x432937 = Math['max'](_0x432937, Number(RegExp['$1'])));
    }
    return Math['max'](_0x432937, 0x1);
  }),
  (Window_ChoiceList['prototype']['addChoiceDistance'] = function () {
    const _0x5388b0 = _0x205d14,
      _0x3aa014 = $gameSystem[_0x5388b0(0x338)]() || 0x0,
      _0x1e0402 = this[_0x5388b0(0x2af)]['y'],
      _0x5c3dba = this[_0x5388b0(0x2af)]['height'],
      _0x349f12 = this['_messageWindow']['_nameBoxWindow'],
      _0x199c74 = _0x349f12[_0x5388b0(0x4bb)] > 0x0 && _0x349f12['width'] > 0x0,
      _0x30dadb = _0x199c74 ? _0x349f12['height'] : 0x0;
    if (_0x3aa014 < 0x0 && (this[_0x5388b0(0x2af)]['isClosed']() || this['_messageWindow'][_0x5388b0(0x191)]()))
      this['y'] = Math[_0x5388b0(0x12c)]((Graphics[_0x5388b0(0x3c3)] - this[_0x5388b0(0x1da)]) / 0x2);
    else {
      if (_0x1e0402 >= Graphics[_0x5388b0(0x3c3)] / 0x2) _0x3aa014 >= 0x0 ? (this['y'] -= _0x3aa014) : (this['y'] = Math['floor']((_0x1e0402 - this[_0x5388b0(0x1da)] - _0x30dadb) / 0x2));
      else {
        if (_0x3aa014 >= 0x0) this['y'] += _0x3aa014;
        else {
          const _0x4e7adc = Graphics['boxHeight'] - (_0x1e0402 + _0x5c3dba + _0x30dadb);
          this['y'] += Math[_0x5388b0(0x4ef)]((_0x4e7adc - this[_0x5388b0(0x1da)]) / 0x2) + _0x30dadb;
        }
      }
    }
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x29f)] = function (_0x402c8e) {
    const _0x15fe9b = _0x205d14,
      _0x1fc3d5 = this['requestChoiceForegroundImage'](_0x402c8e);
    if (_0x1fc3d5) {
      const _0x169158 = ImageManager[_0x15fe9b(0x47e)](_0x1fc3d5),
        _0x1c5743 = this[_0x15fe9b(0x1a5)](),
        _0x4b0399 = _0x1c5743 + this[_0x15fe9b(0x482)](_0x402c8e),
        _0xa93653 = this[_0x15fe9b(0x4ad)](_0x402c8e);
      _0x169158['addLoadListener'](this[_0x15fe9b(0x3c4)][_0x15fe9b(0x3cf)](this, _0x402c8e, !![], _0x4b0399, _0xa93653, _0x169158));
      return;
    }
    this[_0x15fe9b(0x440)](_0x402c8e);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x440)] = function (_0x299b95) {
    const _0x942dd = _0x205d14,
      _0x3751a2 = this[_0x942dd(0x4ad)](_0x299b95),
      _0x427e7b = this[_0x942dd(0x1a5)](),
      _0x30e1a0 = _0x427e7b + this[_0x942dd(0x482)](_0x299b95);
    this['changePaintOpacity'](this[_0x942dd(0x4bc)](_0x299b95));
    const _0xd3243c = this['textSizeEx'](_0x30e1a0)[_0x942dd(0x1da)],
      _0x288877 = _0x3751a2['x'] + this[_0x942dd(0x1ce)](_0x30e1a0),
      _0x13f395 = Math[_0x942dd(0x436)](_0x3751a2['y'], _0x3751a2['y'] + Math[_0x942dd(0x12c)]((_0x3751a2[_0x942dd(0x1da)] - _0xd3243c) / 0x2));
    this[_0x942dd(0x334)](_0x30e1a0, _0x288877, _0x13f395, _0x3751a2[_0x942dd(0x17d)]), this['changeChoiceBackgroundColor'](_0x299b95), this[_0x942dd(0x34d)](_0x299b95, _0x30e1a0, _0x3751a2);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x1a5)] = function () {
    const _0x5508f8 = _0x205d14;
    return $gameSystem[_0x5508f8(0x4eb)]() !== _0x5508f8(0x119) ? _0x5508f8(0x239)['format']($gameSystem['getChoiceListTextAlign']()) : '';
  }),
  (Window_ChoiceList[_0x205d14(0x39c)]['getChoiceIndent'] = function (_0x1e2d94) {
    const _0x5ba40b = _0x205d14;
    let _0x439387 = 0x0;
    return _0x1e2d94[_0x5ba40b(0x127)](/<(?:CHOICE|CHOICE |)INDENT:[ ](\d+)>/gi) && (_0x439387 = Number(RegExp['$1'])), _0x439387;
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x3d6)] = function (_0x7209d0) {
    const _0x42fddf = _0x205d14;
    if (!Imported[_0x42fddf(0x4e6)]) return;
    const _0x31ef21 = this['commandName'](_0x7209d0);
    let _0x4f2a9d = ![],
      _0xf65915 = ![],
      _0x3491e0 = ColorManager['itemBackColor1'](),
      _0x35319 = ColorManager[_0x42fddf(0x431)]();
    if (_0x31ef21['match'](/<(?:BGCOLOR|BG COLOR):[ ](.*?),(.*?)>/gi))
      (_0x3491e0 = ColorManager['getColor'](RegExp['$1'])[_0x42fddf(0x28e)]()), (_0x35319 = ColorManager[_0x42fddf(0x4f8)](RegExp['$2'])[_0x42fddf(0x28e)]()), (_0x4f2a9d = !![]);
    else {
      if (_0x31ef21['match'](/<(?:BGCOLOR|BG COLOR):[ ](.*?)>/gi)) {
        let _0x122d3b = String(RegExp['$1'])[_0x42fddf(0x4a8)]()[_0x42fddf(0x28e)]();
        switch (_0x122d3b) {
          case 'red':
            (_0x3491e0 = _0x35319 = _0x42fddf(0x27b)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x323):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x4da)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x448):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x2d4)), (_0xf65915 = !![]);
            break;
          case 'green':
            (_0x3491e0 = _0x35319 = _0x42fddf(0x2be)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x26b):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x1c1)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x2e1):
          case _0x42fddf(0x165):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x21f)), (_0xf65915 = !![]);
            break;
          case 'brown':
            (_0x3491e0 = _0x35319 = _0x42fddf(0x244)), (_0xf65915 = !![]);
            break;
          case 'pink':
            (_0x3491e0 = _0x35319 = _0x42fddf(0x179)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x16c):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x188)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x498):
          case _0x42fddf(0x34b):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x2e4)), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x14b):
            (_0x3491e0 = _0x35319 = _0x42fddf(0x213)), (_0xf65915 = !![]);
            break;
          case 'yes':
            (_0x3491e0 = _0x35319 = ColorManager[_0x42fddf(0x2b6)]()), (_0xf65915 = !![]);
            break;
          case 'no':
            (_0x3491e0 = _0x35319 = ColorManager['powerDownColor']()), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x314):
            (_0x3491e0 = _0x35319 = ColorManager['systemColor']()), (_0xf65915 = !![]);
            break;
          case _0x42fddf(0x2ab):
            (_0x3491e0 = _0x35319 = ColorManager[_0x42fddf(0x3a4)]()), (_0xf65915 = !![]);
            break;
          default:
            (_0x3491e0 = _0x35319 = ColorManager[_0x42fddf(0x4f8)](_0x122d3b)), (_0xf65915 = !![]);
            break;
        }
        _0x4f2a9d = !![];
      }
    }
    if (!_0x4f2a9d) return;
    const _0x34da8e = this['itemRect'](_0x7209d0);
    this[_0x42fddf(0x2de)]['clearRect'](_0x34da8e['x'], _0x34da8e['y'], _0x34da8e[_0x42fddf(0x17d)], _0x34da8e[_0x42fddf(0x1da)]),
      this['drawCustomBackgroundColor'](_0x34da8e, _0x3491e0, _0x35319, _0xf65915);
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x46a)] = function (_0x4cae24, _0x258fae, _0x2df44c, _0xed9f37) {
    const _0x4fdb27 = _0x205d14,
      _0x35a6d3 = ColorManager[_0x4fdb27(0x4c2)](),
      _0x697c25 = ColorManager[_0x4fdb27(0x3e0)](),
      _0x2fbbe7 = _0x258fae ?? ColorManager[_0x4fdb27(0x4c2)](),
      _0x576792 = _0x2df44c ?? _0x258fae,
      _0x3d190e = _0x4cae24['x'],
      _0x2ad242 = _0x4cae24['y'],
      _0xcfc23f = _0x4cae24[_0x4fdb27(0x17d)],
      _0x7005de = _0x4cae24['height'];
    this['contentsBack']['gradientFillRect'](_0x3d190e, _0x2ad242, _0xcfc23f, _0x7005de, _0x2fbbe7, _0x576792, !![]),
      _0xed9f37 && this[_0x4fdb27(0x2de)][_0x4fdb27(0x1e7)](_0x3d190e, _0x2ad242, _0xcfc23f, _0x7005de, _0x35a6d3, _0x576792, !![]),
      this[_0x4fdb27(0x2de)][_0x4fdb27(0x4a3)](_0x3d190e, _0x2ad242, _0xcfc23f, _0x7005de, _0x35a6d3);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x2ba)] = function (_0x4759e6) {
    const _0x30cbc5 = _0x205d14,
      _0x3c893c = this['choiceAlignText'](),
      _0x599caf = _0x3c893c + this['commandName'](_0x4759e6);
    let _0x1f1669 = '';
    if (_0x599caf[_0x30cbc5(0x127)](/<FG(?:| )(?:IMG|IMAGE|PIC|PICTURE):[ ](.*?)>/i)) _0x1f1669 = String(RegExp['$1'])[_0x30cbc5(0x28e)]();
    else _0x599caf[_0x30cbc5(0x127)](/<FG(?:| )(?:IMG|IMAGE|PIC|PICTURE)[ ]*(.*?):[ ](.*?)>/i) && (_0x1f1669 = String(RegExp['$2'])[_0x30cbc5(0x28e)]());
    return _0x1f1669;
  }),
  (Window_ChoiceList[_0x205d14(0x39c)]['requestChoiceBackgroundImage'] = function (_0xaecef9, _0x45a5ed, _0x24a69f) {
    const _0x3dd9c4 = _0x205d14;
    let _0x33ebb1 = '';
    if (_0x45a5ed['match'](/<BG(?:| )(?:IMG|IMAGE|PIC|PICTURE):[ ](.*?)>/i)) _0x33ebb1 = String(RegExp['$1'])[_0x3dd9c4(0x28e)]();
    else _0x45a5ed[_0x3dd9c4(0x127)](/<BG(?:| )(?:IMG|IMAGE|PIC|PICTURE)[ ]*(.*?):[ ](.*?)>/i) && (_0x33ebb1 = String(RegExp['$2'])[_0x3dd9c4(0x28e)]());
    if (_0x33ebb1) {
      const _0x4db41c = ImageManager['loadPicture'](_0x33ebb1);
      _0x4db41c[_0x3dd9c4(0x488)](this[_0x3dd9c4(0x3c4)]['bind'](this, _0xaecef9, ![], _0x45a5ed, _0x24a69f, _0x4db41c));
    }
  }),
  (Window_ChoiceList['prototype'][_0x205d14(0x3c4)] = function (_0x23c91c, _0x30898b, _0x5d5032, _0x5aaf2b, _0xd31bc9) {
    const _0x582f62 = _0x205d14,
      _0x34eeab = this[_0x582f62(0x1a5)](),
      _0x41a846 = _0x34eeab + this[_0x582f62(0x482)](_0x23c91c);
    if (_0x5d5032 !== _0x41a846) return;
    const _0x31394b = this[_0x582f62(0x4ad)](_0x23c91c);
    if (['x', 'y', 'width', 'height']['some'](_0x5ac5ed => _0x31394b[_0x5ac5ed] !== _0x5aaf2b[_0x5ac5ed])) return;
    let _0xee5453 = 0x0,
      _0x4c4502 = '';
    if (_0x30898b && _0x41a846['match'](/<BG(?:| )(?:IMG|IMAGE|PIC|PICTURE):[ ](.*?)>/i)) {
    } else {
      if (_0x30898b && _0x41a846['match'](/<FG(?:| )(?:IMG|IMAGE|PIC|PICTURE)[ ]*(.*?):[ ](.*?)>/i)) _0x4c4502 = String(RegExp['$1'])[_0x582f62(0x4a8)]()[_0x582f62(0x28e)]();
      else !_0x30898b && _0x41a846[_0x582f62(0x127)](/<BG(?:| )(?:IMG|IMAGE|PIC|PICTURE)[ ]*(.*?):[ ](.*?)>/i) && (_0x4c4502 = String(RegExp['$1'])['toLowerCase']()[_0x582f62(0x28e)]());
    }
    switch (_0x4c4502) {
      case 'lowerleft':
      case 'lower-left':
      case _0x582f62(0x178):
      case _0x582f62(0x1e2):
      case _0x582f62(0x479):
      case _0x582f62(0x20b):
      case '1':
        _0xee5453 = 0x1;
        break;
      case 'lowercenter':
      case 'lower-center':
      case _0x582f62(0x2c7):
      case _0x582f62(0x16a):
      case _0x582f62(0x167):
      case _0x582f62(0x4ca):
      case 'down':
      case '2':
        _0xee5453 = 0x2;
        break;
      case _0x582f62(0x13b):
      case _0x582f62(0x11d):
      case _0x582f62(0x49a):
      case 'downright':
      case _0x582f62(0x13d):
      case _0x582f62(0x43f):
      case '3':
        _0xee5453 = 0x3;
        break;
      case _0x582f62(0x2d6):
      case _0x582f62(0x3ae):
      case _0x582f62(0x22e):
      case '4':
        _0xee5453 = 0x4;
        break;
      case _0x582f62(0x35a):
      case 'middlecenter':
      case _0x582f62(0x113):
      case 'centered':
      case '5':
        _0xee5453 = 0x5;
        break;
      case _0x582f62(0x294):
      case _0x582f62(0x181):
      case _0x582f62(0x270):
      case '6':
        _0xee5453 = 0x6;
        break;
      case _0x582f62(0x1e9):
      case 'upper-left':
      case _0x582f62(0x432):
      case _0x582f62(0x2ad):
      case 'up-left':
      case _0x582f62(0x1bd):
      case '7':
        _0xee5453 = 0x7;
        break;
      case _0x582f62(0x124):
      case _0x582f62(0x422):
      case 'upper\x20center':
      case _0x582f62(0x261):
      case _0x582f62(0x17b):
      case _0x582f62(0x397):
      case 'up':
      case '8':
        _0xee5453 = 0x8;
        break;
      case _0x582f62(0x12b):
      case _0x582f62(0x4a9):
      case _0x582f62(0x138):
      case _0x582f62(0x1f5):
      case _0x582f62(0x2b7):
      case _0x582f62(0x303):
      case '9':
        _0xee5453 = 0x9;
        break;
    }
    const _0x27f27b = _0x30898b ? this['contents'] : this[_0x582f62(0x2de)],
      _0x15085d = this[_0x582f62(0x42e)](_0x23c91c);
    !_0x30898b && _0x27f27b['clearRect'](_0x15085d['x'] - 0x1, _0x15085d['y'] - 0x1, _0x15085d[_0x582f62(0x17d)] + 0x2, _0x15085d['height'] + 0x2);
    const _0x28f550 = _0x15085d['x'] + 0x2,
      _0x28196b = _0x15085d['y'] + 0x2,
      _0x441a03 = _0x15085d[_0x582f62(0x17d)] - 0x4,
      _0x483821 = _0x15085d[_0x582f62(0x1da)] - 0x4,
      _0x19e4b0 = _0xd31bc9[_0x582f62(0x17d)],
      _0x4bd217 = _0xd31bc9[_0x582f62(0x1da)];
    let _0x2bf020 = _0x28f550,
      _0x34e84f = _0x28196b,
      _0x4cea82 = _0x441a03,
      _0x36a5a1 = _0x483821;
    const _0x436d18 = _0x441a03 / _0x19e4b0,
      _0x216bad = _0x483821 / _0x4bd217;
    let _0x540f77 = Math['min'](_0x436d18, _0x216bad);
    if (_0x30898b) _0x540f77 = Math[_0x582f62(0x1d6)](_0x540f77, 0x1);
    _0xee5453 !== 0x0 && ((_0x4cea82 = Math[_0x582f62(0x12c)](_0x19e4b0 * _0x540f77)), (_0x36a5a1 = Math[_0x582f62(0x12c)](_0x4bd217 * _0x540f77)));
    switch (_0xee5453) {
      case 0x1:
      case 0x4:
      case 0x7:
        _0x2bf020 = _0x28f550;
        break;
      case 0x2:
      case 0x5:
      case 0x8:
        _0x2bf020 += Math[_0x582f62(0x12c)]((_0x441a03 - _0x4cea82) / 0x2);
        break;
      case 0x3:
      case 0x6:
      case 0x9:
        _0x2bf020 += _0x441a03 - _0x4cea82;
        break;
    }
    switch (_0xee5453) {
      case 0x7:
      case 0x8:
      case 0x9:
        _0x34e84f = _0x28196b;
        break;
      case 0x4:
      case 0x5:
      case 0x6:
        _0x34e84f += Math[_0x582f62(0x12c)]((_0x483821 - _0x36a5a1) / 0x2);
        break;
      case 0x1:
      case 0x2:
      case 0x3:
        _0x34e84f += _0x483821 - _0x36a5a1;
        break;
    }
    _0x27f27b[_0x582f62(0x224)](_0xd31bc9, 0x0, 0x0, _0x19e4b0, _0x4bd217, _0x2bf020, _0x34e84f, _0x4cea82, _0x36a5a1), _0x30898b && this[_0x582f62(0x440)](_0x23c91c);
  }),
  (Window_ChoiceList[_0x205d14(0x39c)][_0x205d14(0x4a0)] = function () {
    const _0x558f75 = _0x205d14;
    this[_0x558f75(0x4b5)][_0x558f75(0x2a4)]();
    if (!this['_choiceHelpDescriptions']) return;
    const _0x139ec9 = this[_0x558f75(0x2f1)]();
    this[_0x558f75(0x48d)][_0x139ec9]
      ? (this[_0x558f75(0x4b5)][_0x558f75(0x1d4)](this[_0x558f75(0x48d)][_0x139ec9]), this[_0x558f75(0x4b5)][_0x558f75(0x44b)]())
      : (this[_0x558f75(0x4b5)][_0x558f75(0x2a4)](), this[_0x558f75(0x4b5)]['hide']());
  }),
  (Window_EventItem[_0x205d14(0x39c)][_0x205d14(0x280)] = function () {
    const _0xf95f = _0x205d14,
      _0x2df059 = $gameMessage['itemChoiceItypeId']();
    _0x2df059 === _0xf95f(0x1a7) && Imported['VisuMZ_1_SkillsStatesCore'] ? this[_0xf95f(0x33c)]() : Window_ItemList['prototype'][_0xf95f(0x280)]['call'](this);
  }),
  (Window_EventItem[_0x205d14(0x39c)][_0x205d14(0x33c)] = function () {
    const _0x429ab4 = _0x205d14,
      _0x4f0722 = $gameMessage[_0x429ab4(0x4f2)]();
    (this[_0x429ab4(0x353)] = _0x4f0722 ? _0x4f0722[_0x429ab4(0x485)]()['filter'](_0x26a954 => this['includes'](_0x26a954)) : []), this['includes'](null) && this[_0x429ab4(0x353)]['push'](null);
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x131)] = Window_EventItem[_0x205d14(0x39c)][_0x205d14(0x38f)]),
  (Window_EventItem[_0x205d14(0x39c)][_0x205d14(0x38f)] = function (_0x35a44d) {
    const _0x18e2f5 = _0x205d14,
      _0x54969c = $gameMessage[_0x18e2f5(0x291)]();
    if (_0x54969c === _0x18e2f5(0x1ca)) {
      if (!DataManager[_0x18e2f5(0x403)](_0x35a44d)) return ![];
      const _0x1fdebe = $gameMessage[_0x18e2f5(0x343)]();
      if (_0x1fdebe > 0x0) {
        if (_0x35a44d[_0x18e2f5(0x438)] !== _0x1fdebe) return ![];
      }
      return !![];
    } else {
      if (_0x54969c === _0x18e2f5(0x30b)) {
        if (!DataManager[_0x18e2f5(0x158)](_0x35a44d)) return ![];
        const _0x559a91 = $gameMessage['itemChoiceAtypeId']();
        if (_0x559a91 > 0x0) {
          if (_0x35a44d[_0x18e2f5(0x1be)] !== _0x559a91) return ![];
        }
        const _0x35eb69 = $gameMessage['itemChoiceEtypeId']();
        if (_0x35eb69 > 0x0) {
          if (_0x35a44d[_0x18e2f5(0x2df)] !== _0x35eb69) return ![];
        }
        return !![];
      } else {
        if (_0x54969c === _0x18e2f5(0x1a7)) {
          if (!DataManager['isSkill'](_0x35a44d)) return ![];
          const _0x335904 = $gameMessage['itemChoiceActor']();
          if (_0x335904[_0x18e2f5(0x159)](_0x35a44d)) return ![];
          if (!_0x335904[_0x18e2f5(0x16d)](_0x35a44d)) return ![];
          const _0x22c3dd = $gameMessage[_0x18e2f5(0x281)]();
          if (_0x22c3dd > 0x0) {
            const _0x25f3bf = DataManager['getSkillTypes'](_0x35a44d);
            if (!_0x25f3bf[_0x18e2f5(0x38f)](_0x22c3dd)) return ![];
          }
          return !![];
        } else return VisuMZ[_0x18e2f5(0x16f)][_0x18e2f5(0x131)][_0x18e2f5(0x34e)](this, _0x35a44d);
      }
    }
  }),
  (VisuMZ[_0x205d14(0x16f)][_0x205d14(0x2cc)] = Window_ItemList[_0x205d14(0x39c)][_0x205d14(0x231)]),
  (Window_ItemList[_0x205d14(0x39c)][_0x205d14(0x231)] = function (_0x39eed3, _0x254a03, _0x1bd138, _0x2c6cf3) {
    const _0x424a94 = _0x205d14,
      _0x22cf11 = $gameMessage[_0x424a94(0x291)]();
    if (_0x22cf11 === _0x424a94(0x1a7)) {
      const _0x419bd9 = $gameMessage['itemChoiceActor']();
      this['drawSkillCost'](_0x419bd9, _0x39eed3, _0x254a03, _0x1bd138, _0x2c6cf3);
    } else VisuMZ['MessageCore'][_0x424a94(0x2cc)][_0x424a94(0x34e)](this, _0x39eed3, _0x254a03, _0x1bd138, _0x2c6cf3);
  });
function _0x8c00() {
  const _0x140938 = [
    'drawChoiceLocationImage',
    'followers',
    'easeIn',
    'convertMessageCoreEscapeActions',
    'choiceTextAlign',
    'Window_Base_processNewLine',
    'clearAllPictureTexts',
    'none',
    'setLastGainedItemData',
    'Hej',
    'MsgWindowOffsetY',
    'bind',
    'Polish',
    'createContents',
    'ChoiceWindowMinWidth',
    'loadDatabase',
    'Filename',
    'EachMessageStart',
    'changeChoiceBackgroundColor',
    'length',
    'HIDE',
    'Norwegian',
    'processFontChangeBold',
    'Sprite_Picture_updateBitmap',
    'fontItalic',
    'obtainGold',
    'updateDimensions',
    'itemHeight',
    'dimColor2',
    'processDrawCenteredPicture',
    'Skills',
    '_messagePositionReset',
    'SelectWeapon',
    'format',
    '_choiceCancelType',
    'Default',
    'FastForwardKey',
    'choiceLineHeight',
    '</LEFT>',
    'ParseWeaponNotetags',
    '_pictureTextRefresh',
    '%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.',
    'needsPictureTextRefresh',
    'log',
    'innerWidth',
    'isHelpWindowWordWrap',
    'WORD_WRAP_PADDING',
    'Cześć',
    'TextColor',
    'equipSlots',
    'Thai',
    'choiceMinWidth',
    'Window_Options_isVolumeSymbol',
    'ArmorTypeID',
    'makeCommandListScriptCall',
    'textSpeedStatusText',
    'makeDeepCopy',
    '_refreshPauseSign',
    '_itemChoiceItypeId',
    'convertButtonAssistEscapeCharacters',
    'processAllText',
    'placeCancelButton',
    'Type',
    'isWeapon',
    'some',
    '_textMacroFound',
    '_autoColorActorNames',
    'findTargetSprite',
    'updateRelativePosition',
    'startPause',
    'setupChoices',
    'textFont',
    'getPictureTextBuffer',
    'getMessageWindowRows',
    'String_format',
    'visible',
    '_itemChoiceEtypeId',
    '\x1bC[%1]%2\x1bPREVCOLOR[0]',
    'getChoiceListMaxRows',
    'General',
    'anchorPictureText',
    'वाह',
    'SelectSkill',
    'Sprite_Picture_update',
    'forEach',
    'clearActorNameAutoColor',
    'maxCols',
    '$dataLocalization',
    'split',
    'Vay',
    'clamp',
    'setHelpWindow',
    'gainItem',
    'processPyTextCode',
    'upper-center',
    'isChoiceVisible',
    'Game_Interpreter_setupChoices',
    'convertTextAlignmentEscapeCharacters',
    'description',
    '안녕히\x20가세요',
    'refresh',
    'ceil',
    'Window_Message_isTriggered',
    '\x5c%1',
    'fallbackFonts',
    'SplitJpCnCharacters',
    'itemRect',
    'Window_Base_processControlCharacter',
    'actorName',
    'itemBackColor2',
    'upper\x20left',
    '_textColorStack',
    '_dimmerSprite',
    'addCommand',
    'max',
    'isChoiceWindow',
    'wtypeId',
    '_autoSizeCheck',
    'updateTransform',
    'filter',
    'Window_ChoiceList_updatePlacement',
    'Game_Party_gainItem',
    'addMessageCoreLocalizationCommand',
    'down\x20right',
    'drawItemContents',
    'EquipTypeID',
    'adjustShowChoiceCancel',
    'convertNewPageTextStateMacros',
    'JSON',
    'messageCoreWindowX',
    'MessageWidth',
    'AddOption',
    'yellow',
    'startWait',
    'CustomFonts',
    'show',
    'ChoiceWindowMaxRows',
    'isRunning',
    'COLORLOCK',
    'ImageManager_loadBitmap',
    'convertMessageCoreEscapeReplacements',
    '\x1bCOLORLOCK[1]',
    '\x1bi[%1]%2',
    'in\x20order\x20for\x20VisuMZ_1_MessageCore\x20to\x20work.',
    'getLastPluginCommandInterpreter',
    '_targets',
    'process_VisuMZ_MessageCore_TextMacros',
    'choiceCancelType',
    'messageWordWrap',
    'CSV\x20file\x20is\x20now\x20created\x20and\x20stored\x20in\x20data\x20folder.\x0a',
    'textSizeExRaw',
    'type',
    'status',
    '_pictureTextSprite',
    'clearPictureTextRefresh',
    'ALL',
    'CSV\x20file\x20has\x20not\x20been\x20made.\x0a',
    'command101',
    'postFlushTextState',
    'さようなら',
    'outputHeight',
    'contentsHeight',
    'isInputting',
    'setBackground',
    'child_process',
    'outputWidth',
    'drawCustomBackgroundColor',
    'addChoiceDistance',
    '[0]',
    '\x1bWrapJpBreak[0]',
    'responseText',
    'setSpeakerName',
    'shift',
    'getTextAlignment',
    '_maxShuffleChoices',
    'updateAutoPosition',
    'initMessageCore',
    'exit',
    '_moveTargetHeight',
    'EndPadding',
    '_textCasingUpperState',
    'down-left',
    'isRTL',
    'Window_NameBox_updatePlacement',
    '_currentAutoSize',
    'resetPositionX',
    'loadPicture',
    'faceWidth',
    'inBattle',
    'loadGameFonts',
    'commandName',
    'Näkemiin',
    '%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.',
    'skills',
    'Window_Message_synchronizeNameBox',
    'Window_Message_updatePlacement',
    'addLoadListener',
    'makeCommandListShuffle',
    'updateForcedPlacement',
    '</WORDWRAP>',
    'erasePicture',
    '_choiceHelpDescriptions',
    'SortObjectByKeyLength',
    'OffsetX',
    'choiceIndexArray',
    'setChoiceListMaxRows',
    'onProcessCharacter',
    'Actors',
    'updateBitmap',
    'Window_Command_addCommand',
    'changeOutlineColor',
    'setWordWrap',
    'gray',
    'processCharacter',
    'lower\x20right',
    'Classes',
    'hasPictureText',
    'easeOut',
    'Dutch',
    '27837kYXmjj',
    'updateHelp',
    'getChoiceListLineHeight',
    'loadLocalization',
    'strokeRect',
    '\x1bCASING[1]',
    'down',
    'Game_Party_initialize',
    'resetWordWrap',
    'toLowerCase',
    'upper-right',
    'getChoiceListMinChoiceWidth',
    'canMove',
    'setupNumInput',
    'itemRectWithPadding',
    'TextMacros',
    '_pictureTextWindow',
    'currentCommand',
    'Window_Message_needsNewPage',
    'Distance',
    'processActorNameAutoColorChanges',
    'ShuffleArray',
    '_helpWindow',
    'Auf\x20Wiedersehen',
    'adjustShowChoiceDefault',
    'getLanguageName',
    '_moveEasingType',
    '<BR>',
    'openness',
    'isCommandEnabled',
    'setupItemChoice',
    'Vau',
    'makeFontSmaller',
    'NUM',
    'WRAPJPBREAK',
    'itemBackColor1',
    '\x1bTEXTALIGNMENT[2]',
    'isTriggered',
    'members',
    'Name',
    'updateBackground',
    '_pictureTextBuffer',
    'calcWindowHeight',
    'down\x20center',
    'prepareShowTextCommand',
    'addMessageCoreTextSpeedCommand',
    'VisuMZ_3_ActSeqCamera',
    'test',
    'DefaultOutlineWidth',
    'parse',
    'prepareShowTextPluginCommandFollowups',
    'setMessageWindowXyOffsets',
    'CASING',
    'returnPreservedFontSettings',
    '_choiceIndexArray',
    '<COLORLOCK>',
    'battleUserName',
    'true',
    'Window_Base_textSizeEx',
    '#fbaf5d',
    'processTextAlignmentX',
    'Window_Message_newPage',
    'equipTypes',
    'quantity',
    'changeVolume',
    'updateMove',
    'resizePictureText',
    'applyDatabaseAutoColor',
    'commandSymbol',
    'battleTargetName',
    'indent',
    'VisuMZ_0_CoreEngine',
    'ConvertTextAutoColorRegExpFriendly',
    '_resetRect',
    'Sbohem',
    'currentExt',
    'getChoiceListTextAlign',
    'messageWindowRect',
    'obtainExp',
    'Game_Message_setChoices',
    'floor',
    'Width',
    'Window_Base_changeTextColor',
    'itemChoiceActor',
    'ConfigManager_makeData',
    'onload',
    'enabled',
    'defeat',
    'HelpWindow',
    'getColor',
    'maxChoiceWidth',
    'Enemies',
    'Enable',
    'addContinuousShowChoices',
    'center',
    '_nameBoxWindow',
    'convertVariableEscapeCharacters',
    'AutoColorRegExp',
    'WordWrap',
    'startY',
    'default',
    '_messageOffsetY',
    'processMessageCoreEscapeActions',
    'dirname',
    'lower-right',
    'VisuMZ_4_ExtraEnemyDrops\x20needs\x20to\x20be\x20updated\x20',
    'victory',
    'faceName',
    'startX',
    'Instant',
    'Selamat\x20tinggal',
    'uppercenter',
    'setupEvents',
    '_forcedPosition',
    'match',
    'addExtraShowChoices',
    'Portuguese',
    'getRandomTextFromPool',
    'upperright',
    'round',
    'updateNameBoxMove',
    '_relativePosition',
    'CreateAutoColorRegExpListEntries',
    '_autoPosRegExp',
    'Window_EventItem_includes',
    '\x1bCASING[2]',
    'ParseStateNotetags',
    'Unnamed.ttf',
    'text',
    'newPage',
    'Match',
    'upper\x20right',
    'inputtingAction',
    'LineBreakSpace',
    'lowerright',
    'Bitmap_drawText',
    'down-right',
    'maxShuffleChoices',
    'Greek',
    'setMessageWindowWordWrap',
    'Window_Message_processEscapeCharacter',
    'isWordWrapEnabled',
    'setup',
    'getMessageWindowXyOffsets',
    'actor',
    '70tgrkMn',
    'ITALIC',
    'statusText',
    'getLastGainedItemData',
    'emerge',
    'black',
    'drawBackCenteredPicture',
    'MessageRows',
    'Hei',
    'addChildAt',
    'list',
    'maxCommands',
    '_moveTargetY',
    'setChoices',
    'DefaultLocale',
    'isItem',
    'SelectArmor',
    'constructor',
    'isArmor',
    'isSkillHidden',
    '_macroBypassWordWrap',
    '3749640uZuZWD',
    'Window_MessageLog',
    'drawTextTopAligned',
    'resetTextColor',
    '안녕하세요',
    'registerResetRect',
    'isAutoColorAffected',
    '_subject',
    'getMessageWindowWidth',
    '_index',
    'violet',
    'Scene_Boot_onDatabaseLoaded',
    'down-center',
    'AutoColorBypassList',
    'TextCodeReplace',
    'downcenter',
    'ChoiceWindowDistance',
    'white',
    'isSkillTypeMatchForUse',
    '_textAlignment',
    'MessageCore',
    'close',
    'choices',
    'setLastPluginCommandInterpreter',
    'registerActorNameAutoColorChanges',
    'setupShuffleChoices',
    'Window_ChoiceList',
    'setPictureTextBuffer',
    'PICTURE',
    'lower\x20left',
    '#ffc8e0',
    'processAutoColorWords',
    'up-center',
    'TextManager_message',
    'width',
    'isVisuMzLocalizationEnabled',
    '_showFast',
    'Window_Message_terminateMessage',
    'middleright',
    'ஆஹா',
    'ARRAYEVAL',
    'Slovak',
    'helpWordWrap',
    'Game_Map_setupEvents',
    '_lastAltCase',
    '#ffffff',
    'changeVisuMzTextLocale',
    'makeFontBigger',
    'addedWidth',
    'choicePositionType',
    'Finnish',
    'parseChoiceText',
    'addWrapBreakAfterPunctuation',
    'convertCasingEscapeCharacters',
    'isClosing',
    'hide',
    'CreateAutoColorFor',
    'ARRAYSTR',
    'isColorLocked',
    'makeCommandList',
    'numVisibleRows',
    'eraseAllPictureTexts',
    'processAutoSize',
    '\x1bBOLD[0]',
    'onLocalizationXhrLoad',
    'Ha\x20det',
    'CreateAutoColorRegExpLists',
    'updateOverlappingY',
    'updateMessageCommonEvents',
    'convertBackslashCharacters',
    '_moveDuration',
    'terminateMessage',
    '_eventId',
    'isPressed',
    'choiceAlignText',
    'drawMessageFace',
    'skill',
    'setWeaponChoice',
    'TextAlign',
    '<I>',
    'addWindow',
    'MESSAGE_CORE_PLUGIN_NAME',
    'registerSelfEvent',
    'choiceListHelpWindowRect',
    'Ahoj',
    'MaxRows',
    'Japanese',
    'activate',
    'convertHardcodedEscapeReplacements',
    'isSceneBattle',
    'ARRAYSTRUCT',
    'menu',
    'surprise',
    'join',
    'You\x20do\x20not\x20have\x20a\x20language\x20CSV\x20set\x20up.\x0a',
    'actorSlotName',
    'battleActionName',
    'Window_Base_processEscapeCharacter',
    'up\x20left',
    'atypeId',
    'Localization',
    'map\x20party',
    '#6dcff6',
    '_lastPluginCommandInterpreter',
    'setFaceImage',
    'PREVCOLOR',
    'processWrapBreak',
    'false',
    '\x1bTEXTALIGNMENT[3]',
    'createLocalizationCsvFile',
    'initTextAlignement',
    'weapon',
    'outLineColor',
    'setChoiceListHelpWindow',
    'setPictureText',
    'getChoiceIndent',
    'ActionJS',
    'drawing',
    'attachPictureText',
    'scale',
    'switchOutTextForLocalization',
    'setText',
    'textCodeCheck',
    'min',
    '_itemChoiceAtypeId',
    'refreshDimmerBitmap',
    'loadBitmap',
    'height',
    'changeTextColor',
    'push',
    'preConvertEscapeCharacters',
    'setChoiceMessageDistance',
    'windowX',
    'remove',
    'processEscapeCharacter',
    'downleft',
    'PictureIDs',
    'PictureTextErase',
    'AdjustRect',
    'itemChoiceEtypeId',
    'gradientFillRect',
    'getChoiceListMaxColumns',
    'upperleft',
    'convertFontSettingsEscapeCharacters',
    'Halo',
    'textSizeExWordWrap',
    'NameBoxWindowDefaultColor',
    '\x1bCASING[3]',
    'Good-bye',
    'getPictureText',
    'processTextCasing',
    'Scene_Message_createChoiceListWindow',
    '\x1bCASING[0]',
    'escapeStart',
    'upright',
    'Scene_Boot_loadGameFonts',
    'setWaitMode',
    'Bonjour',
    'getLanguageAt',
    'makeData',
    'loadCustomFontsMessageCore',
    'map\x20player',
    'EachMessageEnd',
    'data/',
    'updateXyOffsets',
    'Window_ChoiceList_windowX',
    'name',
    '290802CXWWeH',
    'map',
    'setChoiceListMinChoiceWidth',
    'processColorLock',
    'substring',
    'Key',
    'resetRect',
    'Spanish',
    'TextSpeed',
    'down\x20left',
    'ChoiceWindowLineHeight',
    'Hungarian',
    'selectDefault',
    '1384JqiMMy',
    'Window_Base_initialize',
    'updateOffsetPosition',
    'updateAutoSizePosition',
    '#707070',
    'Viszontlátásra',
    'CsvFilename',
    'ลาก่อน',
    'launchMessageCommonEvent',
    '1612290PhCdyC',
    'command357',
    'Korean',
    'lineHeight',
    'processPreviousColor',
    'postConvertEscapeCharacters',
    'exec',
    '#a186be',
    'addContinuousShowTextCommands',
    'addGeneralOptions',
    'drawPictureText',
    'Tot\x20ziens',
    'blt',
    'openLocalizationFolder',
    'ExtraEnemyDrops',
    'application/csv',
    'Scene_Options_maxCommands',
    'ParseItemNotetags',
    '_textDelayCount',
    'isBusy',
    'messageRows',
    'onLocalizationXhrError',
    'left',
    'onerror',
    'realPictureId',
    'drawItemNumber',
    '\x1bITALIC[1]',
    'setMessageWindowRows',
    '_positionType',
    'Ciao',
    'textSizeExTextAlignment',
    'outlineColor',
    'windowWidth',
    '<%1>',
    'Wah',
    'EVAL',
    'process_VisuMZ_MessageCore_TextCodes_Action',
    '_pictureTextCache',
    'ActorID',
    'getCurrentLanguage',
    'isContinuePrepareShowTextCommands',
    'வணக்கம்',
    'processStoredAutoColorChanges',
    'ARRAYFUNC',
    '#c69c6d',
    'FontBiggerCap',
    'boxWidth',
    '_choiceListWindow',
    'apply',
    'open',
    'VisuMZ_4_ExtraEnemyDrops',
    '_centerMessageWindow',
    'choiceCols',
    'obtainEscapeParam',
    'bitmap',
    'prepareWordWrapEscapeCharacters',
    'map\x20actor',
    'slice',
    'processFailsafeChoice',
    'visuMzTextLocaleStatusText',
    'ParseAddedText',
    'Farewell',
    'ARRAYNUM',
    'processDrawPicture',
    'GET',
    'setRelativePosition',
    ')))',
    'สวัสดี',
    'processNewLine',
    '_textCasing',
    'isMessageWindowWordWrap',
    'applyData',
    'CSV\x20file\x20cannot\x20be\x20created.\x0aPlease\x20enter\x20Playtest\x20mode.\x0a',
    'upcenter',
    'itemChoiceActorId',
    'ParseClassNotetags',
    'বিদায়',
    'version',
    'MessageWindow',
    'isOpen',
    'Wauw',
    'messageCoreLocalization',
    'Szia',
    'blue',
    '_pictureId',
    'Settings',
    'setMessageWindowWidth',
    'obtainEscapeString',
    'right',
    'loadMessageFace',
    'charAt',
    'SHOW',
    'CommonEvent',
    'applyChoiceHelpDescriptions',
    'Bitmap_drawTextTopAligned',
    'colSpacing',
    'processAutoPosition',
    'CENTERPICTURE',
    'processCustomWait',
    '#f26c4f',
    'ChoiceWindowProperties',
    '_MessageCoreSettings',
    'setChoiceListTextAlign',
    'choiceDistance',
    'makeItemList',
    'itemChoiceStypeId',
    'clearPictures',
    'process_VisuMZ_MessageCore_AutoColor',
    'paintOpacity',
    'Window_Options_addGeneralOptions',
    'Adiós',
    'parameters',
    'VisuMZ_1_EventsMoveCore',
    '_lastGainedItemData',
    'Tamil',
    '_textDelay',
    'cancel',
    'autoPositionOffsetX',
    'trim',
    'textCodeResult',
    '_itemChoiceActorId',
    'itemChoiceItypeId',
    'StretchDimmedBg',
    'pagedown',
    'midright',
    'Uau',
    'Weapons',
    'return\x200',
    'ParseSkillNotetags',
    'easeInOut',
    'Farvel',
    'isChoiceEnabled',
    'MessageTextDelay',
    'createTextState',
    'Italian',
    'drawItem',
    'BOLD',
    'FontChangeValue',
    '_scene',
    'Game_Screen_clearPictures',
    'clear',
    'outlineWidth',
    '_moveTargetX',
    '13usJyyS',
    'FontSmallerCap',
    'fontFace',
    'mainFontSize',
    'crisis',
    'callOkHandler',
    'upleft',
    '_cancelButton',
    '_messageWindow',
    'updateChoiceListHelpWindowPlacement',
    'erasePictureTextBuffer',
    'setTextDelay',
    'prepareAutoSizeEscapeCharacters',
    'Game_System_initialize',
    'updateEvents',
    'powerUpColor',
    'up-right',
    'defaultColor',
    'iconIndex',
    'requestChoiceForegroundImage',
    'MaxCols',
    'charCodeAt',
    'Bengali',
    '#7cc576',
    'SWITCHES',
    'Window_NameBox_refresh',
    'moveBy',
    'normalColor',
    'English',
    'Window_Message_clearFlags',
    'Languages.csv',
    'changeValue',
    'lower\x20center',
    'lastGainedObjectIcon',
    'Window_Options_changeVolume',
    '<CENTER>',
    'VariableID',
    'Window_ItemList_drawItemNumber',
    'হ্যালো',
    'flushTextState',
    'processTextAlignmentChange',
    '_itemChoiceVariableId',
    'Guau',
    'STR',
    'buffer',
    '#fff799',
    'writeFileSync',
    'midleft',
    'ParseEnemyNotetags',
    'NonSupportedTextCodes',
    'こんにちは',
    'drawText',
    'Game_Interpreter_PluginCommand',
    '_messageOffsetX',
    'clearChoiceHelpDescriptions',
    'contentsBack',
    'etypeId',
    '\x1bTEXTALIGNMENT[0]',
    'purple',
    'messageWidth',
    'databaseObjectName',
    '#acacac',
    'preemptive',
    '_autoPositionTarget',
    'setColorLock',
    'TextJS',
    'textColor',
    'clampPlacementPosition',
    'fontBold',
    '3380113WogiQd',
    'update',
    'addMessageCoreCommands',
    '_commonEventId',
    'RelativePXPY',
    'index',
    'convertBaseEscapeCharacters',
    '(((',
    'lowerleft',
    'battle\x20party',
    'MinWidth',
    '_scriptCall',
    'pageup',
    'Game_Map_updateEvents',
    'Game_Map_refresh',
    'random',
    'indexOf',
    'Waouh',
    'LanguageImages',
    'follower',
    'DISABLE',
    'Undefined',
    '_pictures',
    'up\x20right',
    'initialize',
    'Languages',
    '30dKzXua',
    'mainModule',
    'setSkillChoice',
    'CheckCompatibility',
    'add',
    'armor',
    '\x1bi[%1]',
    'anchor',
    'textSpeed',
    'parseLocalizedText',
    'Adeus',
    'Window_Base_update',
    'Russian',
    'maxLines',
    'system',
    'addedHeight',
    '_messageCommonEvents',
    'TextCodeActions',
    'processControlCharacter',
    'rtl',
    'mainFontFace',
    'getStartingChoiceWidth',
    'sort',
    '\x1bTEXTALIGNMENT[1]',
    'stringify',
    'setArmorChoice',
    'message',
    'Привет',
    'Czech',
    'orange',
    'currencyUnit',
    '_pictureText',
    'AutoColor',
    'fontSize',
    'map\x20event',
    '31281majbOw',
    '_autoSizeRegexp',
    'updatePictureText',
    '\x1bCASING[5]',
    'setTextAlignment',
    'updatePlacement',
    '_pictureTextWidth',
    'prepareForcedPositionEscapeCharacters',
    'Au\x20revoir',
    'callCancelHandler',
    'open\x20.\x5cdata',
    'drawTextEx',
    '_wordWrap',
    'Please\x20restart\x20the\x20game.',
    'item',
    'getChoiceMessageDistance',
    'isBreakShowTextCommands',
    'send',
    'Salut',
    'makeSkillList',
    'Window_ChoiceList_callCancelHandler',
    '_interpreter',
    '_choiceListHelpWindow',
    '1275332fAhxnr',
    '_pictureTextHeight',
    'ParseAllNotetags',
    'itemChoiceWtypeId',
    'padding',
    '_itemChoiceWtypeId',
    'ConfigManager_applyData',
    'NameBoxWindowOffsetY',
    'every',
    'OffsetY',
    'randomInt',
    'grey',
    'TightWrap',
    'requestChoiceBackgroundImage',
    'call',
    'Ουάου',
    'Rows',
    'replace',
    '_action',
    '_data',
    'leader',
    '_target',
    'autoPositionOffsetY',
    'convertChoiceMacros',
    'processFontChangeItalic',
    'clearFlags',
    'midcenter',
    '\x1bWrapBreak[0]',
    'overrideMimeType',
    'applyMoveEasing',
    '<LEFT>',
    'Hallo',
    'needsNewPage',
    'calcMoveEasing',
    'zoomScale',
    'onNewPageMessageCore',
    '%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.',
    'Padding',
    'TextStr',
    '\x1bTEXTALIGNMENT',
    'isSceneMap',
    'textLocale',
    'Hindi',
    'AddAutoColor',
    '\x1bITALIC[0]',
    'code',
    'move',
    'TextColor%1',
    'choice',
    'अलविदा',
    'getPreservedFontSettings',
    'Chinese(Traditional)',
    'battle\x20actor',
    'DataManager_loadDatabase',
    'processPxTextCode',
    'ConvertParams',
    'नमस्ते',
    'Hejdå',
    'itemChoiceAtypeId',
    'instantTextSpeed',
    'UNDEFINED!',
    '\x1bCOLORLOCK[0]',
    'innerHeight',
    'Window_Base_processAllText',
    'drawPictureTextZone',
    'Olá',
    'MessageWindowProperties',
    'convertTextMacros',
    'prepareShowTextFollowups',
    'ENABLE',
    'createChoiceListWindow',
    'requestPictureTextRefreshAll',
    '_wholeMoveDuration',
    'processCommonEvent',
    '_list',
    'anyPictureTextChanges',
    '</B>',
    'drawBackPicture',
    'return\x20\x27',
    'includes',
    'German',
    'getPictureTextData',
    'PictureTextRefresh',
    '119UWLYqX',
    'createPictureText',
    'Hűha',
    'value',
    'up\x20center',
    'adjustShowChoiceExtension',
    'Armors',
    'getInputButtonString',
    'unshift',
    'prototype',
    'splice',
    '_moveTargetWidth',
    'start\x20.\x5cdata',
    'contents',
    'toUpperCase',
    'convertButtonAssistText',
    'event',
    'crisisColor',
    'ParseArmorNotetags',
    'VisuMZ_1_SkillsStatesCore',
    'WAIT',
    'choiceRows',
    'setChoiceListMaxColumns',
    'Window_Options_statusText',
    'getLocalizedText',
    'Αντίο',
    'Turkish',
    'middleleft',
    'Items',
    'Hello',
    'requestPictureTextRefresh',
    'textSizeEx',
    'nextEventCode',
    '</RIGHT>',
    'moveTo',
    'ওহে',
    '_choices',
    'synchronizeNameBox',
    'preFlushTextState',
    'LineHeight',
    '_colorLock',
    'battle\x20enemy',
    'registerCommand',
    '5vxiGaQ',
    'isOptionValid',
    'Game_Screen_erasePicture',
    '<LINE\x20BREAK>',
    'Wow',
    'boxHeight',
  ];
  _0x8c00 = function () {
    return _0x140938;
  };
  return _0x8c00();
}
