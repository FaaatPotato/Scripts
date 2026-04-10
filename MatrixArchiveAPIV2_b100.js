///api_version=2
(script = registerScript({
    name: "MatrixArchive",
    version: "1.0.6",
    authors: ["FaaatPotato", "CzechHek", "Du_Couscous", "AlienGurke", "ClientQUI"]
}));

/*
A few words to clarify...
  - Firstly, this script is an archive for old modules as there will be no development of new bypasses
  - Utility modules e.g. AutoInsultReloaded have recieved small updates in this script as they are still functional
  - Other modules will likely not work but may have educational purpose
  - I tried to credit everyone in authors properly, if you feel missed out, please contact me
  - Lastly, small changes have been made to make this script compatible with the b100 legacy build
  - Enjoy!
*/

//To do: add FlyModes: flag longjump by shurpe, blink longjump (+max packets value), a lot of janitor work
//make every message in chat clickable for investigation so that you can build detection phrase from there on.
//makes potKillMessages redundant

/*------------------*/
/*      IMPORTS     */
/*------------------*/

ChatComponentText = Java.type("net.minecraft.util.ChatComponentText")
ClickEvent = Java.type("net.minecraft.event.ClickEvent")
HoverEvent = Java.type("net.minecraft.event.HoverEvent")
C01PacketChatMessage = Java.type("net.minecraft.network.play.client.C01PacketChatMessage")
S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
S45PacketTitle = Java.type("net.minecraft.network.play.server.S45PacketTitle")
C07PacketPlayerDigging = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging")
C0APacketAnimation = Java.type("net.minecraft.network.play.client.C0APacketAnimation")
C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition")
C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")
C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C06PacketPlayerPosLook")
S38PacketPlayerListItem = Java.type("net.minecraft.network.play.server.S38PacketPlayerListItem")
C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C05PacketPlayerLook")
C0BPacketEntityAction = Java.type("net.minecraft.network.play.client.C0BPacketEntityAction")
S13PacketDestroyEntities = Java.type("net.minecraft.network.play.server.S13PacketDestroyEntities")
S27PacketExplosion = Java.type("net.minecraft.network.play.server.S27PacketExplosion")
C02PacketUseEntity = Java.type("net.minecraft.network.play.client.C02PacketUseEntity")
C0CPacketInput = Java.type("net.minecraft.network.play.client.C0CPacketInput")
S41PacketServerDifficulty = Java.type("net.minecraft.network.play.server.S41PacketServerDifficulty")
S38PacketPlayerListItem = Java.type("net.minecraft.network.play.server.S38PacketPlayerListItem")
S3CPacketUpdateScore = Java.type("net.minecraft.network.play.server.S3CPacketUpdateScore")
S40PacketDisconnect = Java.type("net.minecraft.network.play.server.S40PacketDisconnect")
S00PacketServerInfo = Java.type("net.minecraft.network.status.server.S00PacketServerInfo")
EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
EntityTNTPrimed = Java.type("net.minecraft.entity.item.EntityTNTPrimed")
Entity = Java.type("net.minecraft.entity.Entity")
File = Java.type("java.io.File")
FileManager = Java.type("net.ccbluex.liquidbounce.file.FileManager").INSTANCE;
FileUtils = org.apache.commons.io.FileUtils;
MSTimer = Java.type("net.ccbluex.liquidbounce.utils.timing.MSTimer");
Timer = java.util.Timer;
StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
BlockPos = Java.type("net.minecraft.util.BlockPos")
Block = Java.type("net.minecraft.block.Block")
Blocks = Java.type("net.minecraft.init.Blocks")
BlockBed = Java.type("net.minecraft.block.BlockBed")
Color = Java.type("java.awt.Color")
BlockDirectional = Java.type("net.minecraft.block.BlockDirectional")
EnumFacing = Java.type("net.minecraft.util.EnumFacing")
Gui = Java.type("net.minecraft.client.gui.Gui")
GL11 = Java.type("org.lwjgl.opengl.GL11")
ItemStack = Java.type("net.minecraft.item.ItemStack")
RenderHelper = Java.type("net.minecraft.client.renderer.RenderHelper")
Fonts = Java.type("net.ccbluex.liquidbounce.ui.font.Fonts").INSTANCE
BlockUtils = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils")
ModuleManager = Java.type("net.ccbluex.liquidbounce.features.module.ModuleManager").INSTANCE
MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.movement.MovementUtils").INSTANCE
BlockUtils = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils").INSTANCE
RenderUtils = Java.type("net.ccbluex.liquidbounce.utils.render.RenderUtils").INSTANCE
PacketUtils = Java.type("net.ccbluex.liquidbounce.utils.client.PacketUtils")
BlinkUtils = Java.type("net.ccbluex.liquidbounce.utils.client.BlinkUtils").INSTANCE
RotationUtils = Java.type("net.ccbluex.liquidbounce.utils.rotation.RotationUtils").INSTANCE
RotationSettings = Java.type("net.ccbluex.liquidbounce.utils.rotation.RotationSettings")
PlayerExtensionKt = Java.type("net.ccbluex.liquidbounce.utils.extensions.PlayerExtensionKt")
EntityUtils = Java.type("net.ccbluex.liquidbounce.utils.attack.EntityUtils").INSTANCE
Potion = Java.type("net.minecraft.potion.Potion")
DamageSource = Java.type("net.minecraft.util.DamageSource")
Vec3 = Java.type("net.minecraft.util.Vec3")
BlockSnow = Java.type("net.minecraft.block.BlockSnow")
BlockLiquid = Java.type("net.minecraft.block.BlockLiquid")
GuiInventory = Java.type("net.minecraft.client.gui.inventory.GuiInventory")
ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution")
GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager")
OpenGlHelper = Java.type("net.minecraft.client.renderer.OpenGlHelper")
EntityFallingBlock = Java.type("net.minecraft.entity.item.EntityFallingBlock")
System = Java.type("java.lang.System")
TextureMap = Java.type("net.minecraft.client.renderer.texture.TextureMap")
ItemCameraTransforms = Java.type("net.minecraft.client.renderer.block.model.ItemCameraTransforms")
TileEntityItemStackRenderer = Java.type("net.minecraft.client.renderer.tileentity.TileEntityItemStackRenderer")
BlockBanner = Java.type("net.minecraft.block.BlockBanner")
BlockSkull = Java.type("net.minecraft.block.BlockSkull")
BlockChest = Java.type("net.minecraft.block.BlockChest")
BlockEnderChest = Java.type("net.minecraft.block.BlockEnderChest")
BlockSign = Java.type("net.minecraft.block.BlockSign")
TileEntityRendererDispatcher = Java.type("net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher")
BlockFlowerPot = Java.type("net.minecraft.block.BlockFlowerPot")
ClosedDoubleRange = Java.type("kotlin.ranges.ClosedFloatingPointRange")
Keyboard = org.lwjgl.input.Keyboard
EntityZombie = Java.type("net.minecraft.entity.monster.EntityZombie")
Remapper = Java.type("net.ccbluex.liquidbounce.script.remapper.Remapper");
Class = java.lang.Class
Desktop = java.awt.Desktop
EntityFireball = Java.type("net.minecraft.entity.projectile.EntityFireball")
URI = java.net.URI

/*------------------*/
/* GLOBAL FUNCTIONS */
/*------------------*/

//time to mention Core.lib (the goat); I bow before this piece of code and want to highlight @CzechHek who made this library
//extremely clean, efficient and beginner friendly

Object.defineProperty(Array.prototype, "unique", {
    writable: true,
    value: function (overwrite) overwrite?(this = this.filter(function (v, i, s) s.indexOf(v) === i)) : this.filter(function (v, i, s) s.indexOf(v) === i)
});

Object.defineProperty(Array.prototype, "random", {
    value: function (from, to) this.length > 0 ? this[Math.floor(rand(from || 0, (to + 1) || this.length))] : null
});

Object.defineProperty(Array.prototype, "includes", {
    value: function (element) this.indexOf(element) !== -1
});

Object.defineProperty(Array.prototype, "find", {
    value: function (func, returnIndex) {
        for (var i in this) if (func(this[i], i, this)) return returnIndex ? +i : this[i];
        return returnIndex ? -1 : null;
    }
});

Object.defineProperty(Array.prototype, "pushArray", {
    writable: true,
    value: function (arr) Array.prototype.push.apply(this, arr)
});

function getFields(clazz) {
    var _fields = Java.from((clazz = clazz instanceof Class ? clazz : clazz.class).getDeclaredFields());
    while (clazz = clazz.superclass) _fields.pushArray(Java.from(clazz.getDeclaredFields()));
    return _fields;
}

function getField(clazz, name, _field) ((_field = getFields(clazz).find(function (f) f.getName() == name)) && _field.setAccessible(true), _field);

function getSRGName(clazz, name, map) {
    if (!(clazz instanceof Class)) clazz = clazz.class;
    if (map.containsKey(clazz.name)) {
        for each(var entry in map.get(clazz.name).entrySet()) {
            if (entry.getValue() == name) return entry.getKey().split("(")[0];
        }
    }
    return name;
}

function getMethods(clazz) {
    var _methods = Java.from((clazz = clazz instanceof Class ? clazz : clazz.class).getDeclaredMethods());
    while (clazz = clazz.superclass) _methods.pushArray(Java.from(clazz.getDeclaredMethods()));
    return _methods;
}


function getMethod(clazz, name, argumentArr, _method)
((_method = getMethods(clazz).find(function (m)
        m.getName() == name && (!argumentArr || (m.getParameterCount() == argumentArr.length && !Java.from(m.getParameterTypes()).some(function (clazz, i) {
    if (clazz.isPrimitive() && argumentArr[i] instanceof java.lang.Number) return
    return !clazz.isAssignableFrom(argumentArr[i].class)
})))
)) && _method.setAccessible(true), _method);

function getArguments(argumentsObj, from, to) Array.prototype.slice.call(argumentsObj, from, to);

var RemapperMethods = getField(Remapper, "methods").get(Remapper), RemapperFields = getField(Remapper, "fields").get(Remapper);

function Reflector(object) object && object instanceof java.lang.Object ?
    new JSAdapter() {
    __get__: function (name) {
        var field = getField(object, getSRGName(object, name, RemapperFields));
        if (field) return new Reflector(field.get(object));

        var method = getMethod(object, getSRGName(object, name, RemapperMethods));
        if (method) return method;

        return object[name];
    },
    __put__: function (name, value) {
        var field = getField(object, getSRGName(object, name, RemapperFields));
        field ? field.set(object, value) : object[name] = value;
    },
    __call__: function (name) {
        switch (name) {
            case "toString": return object + ""//.toString() doesn't work for java beans
            case "valueOf": return object;
            default:
                args = getArguments(arguments, 1);
                return getMethod(object, getSRGName(object, name, RemapperMethods), args).invoke(object, Java.to(args, "java.lang.Object[]"));
        }
    }
} : object;

function timeout(ms, func, _timer) (_timer = new Timer("setTimeout", true), _timer.schedule(func, ms), _timer);

function isMovingHorizontally(entity) entity && entity != mc.thePlayer ? entity.lastTickPosX != entity.posX || entity.lastTickPosZ != entity.posZ : !!(mc.thePlayer.movementInput.moveForward || mc.thePlayer.movementInput.moveStrafe);

function isMovingVertically(entity) entity && entity != mc.thePlayer ? entity.lastTickPosY != entity.posY : mc.thePlayer.movementInput.jump || mc.thePlayer.movementInput.sneak;

function entityIsMoving(entity) {
    return isMovingHorizontally(entity) || isMovingVertically(entity);
}

function canStep(stepHeight, predictDistance) {
    if (mc.thePlayer.isCollidedHorizontally || predictDistance) {
        var yaw = MovementUtils.getDirection(), bb = mc.thePlayer.getEntityBoundingBox(), possiblePlaces = [], otherBB, predictDistance = predictDistance || 0.01;
        for (var i = 0; (i += 0.125) <= stepHeight;) {
            if (!mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, bb.offset(0, i, 0)).isEmpty()) break
            if (mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, otherBB = bb.offset(-Math.sin(yaw) * predictDistance, i, Math.cos(yaw) * predictDistance)).isEmpty() && !mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, otherBB.offset(0, -0.125, 0)).isEmpty()) possiblePlaces.push(i);
        }
        return possiblePlaces.length && Math.max.apply(null, possiblePlaces);
    }
}

function clearChat() mc.ingameGUI.getChatGUI().clearChatMessages();

function rand(min /*[min, max]*/, max) (Array.isArray(min) && (min = min[0], max = min[1]), Math.random() * (max - min) + min);

function addMessage(message) {
    var events = [].slice.call(arguments).slice(1) //Array.from

    var comp = new ChatComponentText(message)
    var style = comp.getChatStyle()

    if (events.length) {
        for (var i = 0; i < events.length; i++) {
            var event = events[i][0], text = events[i][1], action = events[i][2];
            switch (event) {
                case "clickEvent":
                    action = action || "OPEN_URL"
                    style.setChatClickEvent(new ClickEvent(ClickEvent.Action[action], text))
                    break;
                case "hoverEvent":
                    action = action || "SHOW_TEXT"
                    style.setChatHoverEvent(new HoverEvent(HoverEvent.Action[action], new ChatComponentText(text)))
                    break;
            }
        }
    }
    mc.thePlayer.addChatMessage(comp)
}

function getBlock(blockPos) mc.theWorld.getBlockState(blockPos).getBlock();

function getBlockName(blockPos) getBlock(blockPos).getLocalizedName();

function getBlockState(blockOrPos) blockOrPos instanceof BlockPos ? mc.theWorld.getBlockState(blockOrPos) : blockOrPos.getBlockState();

function getTargetsInRange(range, entityType) Java.from(mc.theWorld.loadedEntityList).filter(function (e) e != mc.thePlayer && ((entityType ? e instanceof entityType : EntityUtils.isSelected(e, true)) && (!range || PlayerExtensionKt.getDistanceToEntityBox(e, mc.thePlayer) <= range)));

function animate(target, current, speed) {
    var larger = target > current

    var difference = Math.max(target, current) - Math.min(target, current)
    var factor = difference * speed

    if (factor < 0.1) factor = 0.1
    if (larger) current += factor; else current = target

    return current;
}

function getDist(blockPosA, blockPosB) {
    var a = new Vec3(blockPosA.getX() + 0.5, blockPosA.getY() + 0.5, blockPosA.getZ() + 0.5)
    var b = new Vec3(blockPosB.getX() + 0.5, blockPosB.getY() + 0.5, blockPosB.getZ() + 0.5)
    return a.distanceTo(b)
}

function setValue(val, nval) {
    if (val.get() === nval) return;
    try {
        //kotlin value.set takes newValue instanceof some sealed class and boolean save to config
        return getMethod(val.getClass(), "set").invoke(val, nval, true)
    } catch (e) {
        addMessage(e)
    }
}

/*------------------*/
/* GLOBAL VARIABLES */
/*------------------*/

var currentTarget = null, prefix = "§8§l[§" + ["5", "d", "9", "1", "3", "b", "a", "2", "e", "6", "c", "4"].random() + "§lMatrixArchive§8§l]§7 ",
    lastKillMessage = [], selectingPhrase = false,
    internalInsults = [
        "lmao",
        "your performance was miserable :)",
        "idk bro not your best day huh",
        "I personally would just surrender.",
        "absolute beginner ffs",
        "this game is not made for you...",
        "people as bad as you shouldn't play this game.",
        "listen, go to bed. I already sent you to sleep.",
        "buddy, try harder next time I guess.",
        "seems like you lost. Must have happened before. Maybe quit?",
        "let me give you a little.. life lesson. Life fucks you like I did.",
        "you should've prayed to fight someone else.",
        "still can't do shit against cheats",
        "you got absolutely beat up. Must be fun playing legit :)",
        "no words for such miserable performance",
        "you couldn't look more foolish",
        "get clowned",
        ":skull:"
    ], sentInsult = false, sentLink = false, lastTarget, queueTimer = new MSTimer(), sendQueue = [],
    breakDamage = 0, blockHitDelay = 0, breakingBlock, lastPlaced = null, totalFallDist = 0, cancelC04 = false,
    boosted = false, tryBoost = 0, simulateStartY, mcFont = Fonts.getFonts()[0], wasRiding = false,
    lastQueueTarget = null, clientChatContent = "", cIndex = null, glideMotionTicks = 0, glideTicks = 0, isBlock = false,
    selectTimer = new MSTimer(), renderSelectedTimer = new MSTimer(), renderSelected = false, lookPos = null,
    destinationPos = null, sentPackets = 0, lookingAt = null, isMoving = false,
    formattedInsult = "", tntFly = false, tntStartBoost = false, returnToLastOnGroundPos = null,
    mts = 0, ds = 0, tntBlinkPackets = [], finalPackets = 0, wasAdded = !!mc.thePlayer, tpWaitTimer = new MSTimer(),
    tpWait = false, alphabet = "abcdefghijklmnopqrstuvwxyz", isStepping = false, path = [],
    packetPositions = [], targetEntity = null, tpHitTimer = new MSTimer(), ds = 0, oldTarget = null, potKillMessages = [],
    invPotKillMessage = false, killMessage = [], buildingDetectionPhrase = false, builtDetectionPhrase = [], wasDamaged = false,
    packetsListened = 0, sinceLastPacket = new MSTimer(), strafeGlideTicks = 0;


/*------------------*/
/*    SETTING-UP    */
/*------------------*/

insultDir = new File(FileManager.dir, "AutoInsultRL")
insultDir.mkdir()
customLettersFile = new File(insultDir, "customLetters.txt")
customLettersFile.createNewFile()

/*------------------*/
/*    MODULE-CODE   */
/*------------------*/

AutoInsultValues = {
    headerValue1: header1 = Setting.boolean({
        name: "§c§lSettings:§7 Detection",
        default: true
    }),
    detectionModeValue: detectionMode = Setting.list({
        name: "DetectionMode",
        values: ["PacketChat", "Classic"],
        default: "PacketChat",
        isSupported: function () header1.get()
    }),
    detectionPhraseValue: detectionPhrase = Setting.text({
        name: "ScanFor",
        default: "killed by",
        onChange: function (o, n) {
            if (n) {
                var temp = n.split(",").unique().filter(Boolean)
                timeout(1, (function () setValue(detectionPhrase, temp.join(","))))
                clearChat()
                addMessage(prefix + "Module will search for '§a§l" + temp.join("§7' or '§a§l") + "§7' + §a§l" + mc.thePlayer.getName())
            }
        },
        isSupported: function () detectionMode.get() == "PacketChat" && header1.get()
    }),
    smartTargetIndexValue: smartTargetIndex = Setting.boolean({
        name: "SmartTargetIndex",
        default: true,
        isSupported: function () header1.get() && detectionMode.get() == "PacketChat" && !customIndex.get()
    }),
    customIndexValue: customIndex = Setting.boolean({
        name: "CustomTargetNameIndex",
        default: false,
        onChange: function (o, n) {
            if (n) {
                if (lastKillMessage.length) {
                    addMessage("")
                    addMessage(prefix+"Lastest message containing §7'§a§lkilled by "+mc.thePlayer.getName()+"§7'")
                    addMessage("")
                    for each(var part in lastKillMessage) {
                        addMessage(prefix + part, ["clickEvent", part, "RUN_COMMAND"], ["hoverEvent", "§aClick to select as target name position."])
                    }
                    addMessage("")
                    selectingPhrase = true
                } else {
                    selectingPhrase = false;
                    addMessage(prefix+"No message to select target from.")
                    addMessage(prefix+"Default position will be used.")
                    timeout(1, (function() setValue(customIndex, false)))
                }
            } else if (lastKillMessage.length) {
                clearChat()
                addMessage(prefix+"Default position will be used.")
                selectingPhrase = false
            }
        },
        isSupported: function () detectionMode.get() == "PacketChat" && header1.get() && !smartTargetIndex.get()
    }),
    displayPotKillMessagesValue: displayPotKillMessages = Setting.boolean({
        name: "DisplayPotentialKillMessages",
        default: false,
        onChange: function (o, n) {
            if (n) {
                if (potKillMessages.length) {
                    for each(var arr in potKillMessages) {
                        var potKillMessage = arr.join(" ")
                        addMessage(prefix + potKillMessage, ["clickEvent", potKillMessage, "RUN_COMMAND"], ["hoverEvent", "§aClick to inspect kill message."])
                    }
                    invPotKillMessage = true;
                } else {
                    addMessage(prefix + "No potential messages detected!")
                    timeout(1, (function() setValue(displayPotKillMessages, false)))
                }
            } else if (potKillMessages.length) {
                clearChat()
                invPotKillMessage = false, killMessage = [], buildingDetectionPhrase = false, builtDetectionPhrase = []
            }
        },
        isSupported: function() header1.get() && detectionMode.get() == "PacketChat"
    }),
    spacerValue2: spacer2 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() header1.get()
    }),
    headerValue2: header2 = Setting.boolean({
        name: "§c§lSettings:§7§l General",
        default: true
    }),
    insultModeValue: insultMode = Setting.list({
        name: "InsultSource",
        values: ["Internal", "Custom"],
        default: "Internal",
        isSupported: function () header2.get()
    }), 
    customFileValue: customFile = Setting.list({
        name: "File",
        values: customF = Java.from(insultDir.listFiles()).map(function (file) file.getName()).filter(function (name) name != "customLetters.txt").concat("", "REFRESH"),
        default: customF[0],
        onChange: function (o, n) {
            if (n && n == "REFRESH") {
                var content = Java.from(insultDir.listFiles()).map(function (file) file.getName()).filter(function (name) name != "customLetters.txt").concat("", "REFRESH")
                valueCustomFileReflector.values = Java.to(content, "java.lang.String[]")
                timeout(1, (function() setValue(customFile, customF[0])))
            }
        },
        isSupported: function () header2.get() && insultMode.get() == "Custom"
    }),
    openCustomFileValue: openCustomFile = Setting.boolean({
        name: "OpenFile",
        default: false,
        onChange: function (o, n) {
            if (n) {
                var cfile = new File(insultDir, customFile.get())
                cfile && Desktop.getDesktop().open(cfile)
            }
            timeout(1, (function () setValue(openCustomFile, false)));
        },
        isSupported: function () header2.get() && insultMode.get() == "Custom"
    }),
    chatPrefixValue: chatPrefix = Setting.text({
        name: "GlobalChatPrefix",
        default: "!",
        isSupported: function () header2.get()
    }),
    spacerValue3: spacer3 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function () header2.get()
    }),
    headerValue3: header3 = Setting.boolean({
        name: "§c§lSettings:§7 Format",
        default: true
    }),
    linkFormatValue: linkFormat = Setting.list({
        name: "LinkFormat",
        values: ["NoFormatting", "SurroundDots", "ReplaceDots", "NoDots"],
        default: "NoFormatting",
        isSupported: function () header3.get()
    }),
    surroundWithValue: surroundWith = Setting.text({
        name: "SurroundWith",
        default: "(.)",
        isSupported: function () linkFormat.get() == "SurroundDots" && header3.get()
    }),
    replaceWithValue: replaceWith = Setting.text({
        name: "ReplaceWith",
        default: "'",
        isSupported: function () linkFormat.get() == "ReplaceDots" && header3.get()
    }),
    hyperLinkValue: hyperLink = Setting.boolean({
        name: "Hyperlink",
        default: true,
        isSupported: function () header3.get()
    }),
    spacerValue27831a: spacerValue27831a = Setting.boolean({
        name: "",
        default: false,
        isSupported: function () header3.get()
    }),
    useCustomLettersValue: useCustomLetters = Setting.boolean({
        name: "CustomAlphabet",
        default: false,
        isSupported: function () header3.get()
    }),
    customLettersValue: customLetters = Setting.list({
        name: "SelectSet",
        default: "",
        values: customA = Java.from(FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8)).filter(function (e) e.length == 26).concat("", "REFRESH"),
        default: customA[0],
        onChange: function (o, n) {
            if (n && n == "REFRESH") {
                var content = Java.from(FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8)).filter(function (e) e.length == 26).concat("", "REFRESH")
                valueCustomLettersReflector.values = Java.to(content, "java.lang.String[]")
                timeout(1, (function() setValue(customLetters, customA[0])))
            }
        },
        isSupported: function() header3.get() && useCustomLetters.get()
    }),
    openCustomLettersValue: openCustomLetters = Setting.boolean({
        name: "OpenFile",
        default: false,
        onChange: function (o, n) {
            if (n) {
                customLettersFile && Desktop.getDesktop().open(customLettersFile)
            }
            timeout(1, (function () setValue(openCustomLetters, false)));
        },
        isSupported: function () header3.get() && useCustomLetters.get()
    }),
    ignoreLinkValue: ignoreLink = Setting.boolean({
        name: "IgnoreLink",
        default: false,
        isSupported: function () header3.get() && useCustomLetters.get()
    }),
    spacerValue4: spacer4 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function () header3.get()
    }),
    headerValue4: header4 = Setting.boolean({
        name: "§c§lSettings:§7 Queue",
        default: true
    }),
    useQueueValue: useQueue = Setting.boolean({
        name: "UseSendQueue",
        default: true,
        isSupported: function () header4.get()
    }),
    sendDelayValue: sendDelay = Setting.integer({
        name: "SendDelay[s]",
        min: 1,
        max: 10,
        default: 3,
        isSupported: function () header4.get() && useQueue.get()
    }),
    sendPriorityValue: sendPriority = Setting.list({
        name: "SendPriority",
        values: ["QUEUE", "STACK"],
        default: "QUEUE",
        isSupported: function () header4.get() && useQueue.get()
    })
};

var valueCustomFileReflector = new Reflector(customFile), valueCustomLettersReflector = new Reflector(customLetters);

function containsLink(message) message.contains("http://") || message.contains("www.") || message.contains("https://") || (function () { try { return !!URI.create(message).toURL() } catch (e) { return false } })();

function extractLinks(message) message.split(" ").filter(function (part) containsLink(part));

function shouldReplaceLetter(atI, message) {
    if (!ignoreLink.get()) return true;

    var splitMessage = message.split(" ")

    for (var i = 0; i < splitMessage.length; i++) {
        if (containsLink(splitMessage[i])) {
            var minIndex = message.indexOf(splitMessage[i])
            var maxIndex = minIndex + splitMessage[i].length - 1

            if (atI >= minIndex && atI <= maxIndex) return false
        } else continue;
    }
    return true
}

function sendInsult(targetName) {
    userContent = Java.from(insultDir.listFiles()).length && customFile.get() ? Java.from(FileUtils.readLines(new File(insultDir, customFile.get()), StandardCharsets.UTF_8)) : null
    insult = insultMode.get() == "Internal" || !userContent ? internalInsults.random() : userContent.random()
    lastTarget = targetName

    formattedInsult = ""
    packetsListened = 0

    if (!containsLink(insult)) {
        formattedInsult = insult
    } else {
        var splitInsult = insult.split(" "), format;
        switch (linkFormat.get()) {
            case "SurroundDots": format = surroundWith.get(); break;
            case "ReplaceDots": format = replaceWith.get(); break;
            case "NoDots": format = ""; break;
            default: format = null;
        }
        for (var i = 0; i < splitInsult.length; i++) {
            if (!containsLink(splitInsult[i]) || format == null) continue;
            var formattedLink = splitInsult[i].replace(/[.]/g, format)
            splitInsult.splice(i, 1, formattedLink)
        }
        formattedInsult = splitInsult.join(" ")
        sentLink = true;
    }
    if (useCustomLetters.get()) {
        var customAlphabet = FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8)[FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8).indexOf(customLetters.get())], replacedInsult = "";
        for (i = 0; i < formattedInsult.length; i++) {
            var letterIndex = alphabet.indexOf(formattedInsult[i].toLowerCase())
            if (letterIndex !== -1 && shouldReplaceLetter(i, formattedInsult)) {
                replacedInsult += customAlphabet[letterIndex]
            } else replacedInsult += formattedInsult[i];
        }
        formattedInsult = replacedInsult
    }
    mc.thePlayer.sendChatMessage(chatPrefix.get() + " " + targetName + " " + formattedInsult)
    sentInsult = true
}

//implementation of https://www.youtube.com/watch?v=Dd_NgYVOdLk
//amazing video on this algorithm

function getEditingDistance(inputStr, convertTo) {
    var matrix = [], cols = inputStr.length + 1, rows = convertTo.length + 1;

    for (var i = 0; i < cols; i++) { //no Array.from(bounds) yet
        matrix[i] = []
        for (var j = 0; j < rows; j++) {
            matrix[i][j] = 0
        }
    }

    for (var i = 0; i < cols; i++) matrix[i][0] = i;
    for (var j = 0; j < rows; j++) matrix[0][j] = j;

    for (var col = 1; col < cols; col++) {
        for (var row = 1; row < rows; row++) {
            if (inputStr[col - 1] === convertTo[row - 1]) matrix[col][row] = matrix[col - 1][row - 1]; else {
                matrix[col][row] = Math.min(matrix[col - 1][row], matrix[col][row - 1], matrix[col - 1][row - 1]) + 1
            }
        }
    }
    return matrix[cols - 1][rows - 1]
}

function similarToInsult(serverContent) {
    for (var i = 0; i < serverContent.length - formattedInsult.length; i++) {
        var sub = serverContent.substring(i, i + formattedInsult.length + 5)
        if (getEditingDistance(sub, formattedInsult) / Math.max(sub.length, formattedInsult.length) <= 0.3) return true;
    }
    return false;
}

script.registerModule({
    name: "AutoInsultReloaded",
    category: "Fun",
    description: "Highly customizable AutoInsult with alternative kill detection",
    settings: AutoInsultValues,
}, function (module) {
    module.on("packet", function (e) {
        var packet = e.getPacket()
        if (packet instanceof C01PacketChatMessage) {
            clientChatContent = packet.getMessage()

            if (selectingPhrase && lastKillMessage.includes(clientChatContent)) {
                cIndex = lastKillMessage.indexOf(clientChatContent)
                e.cancelEvent()

                clearChat()

                addMessage(prefix + "AutoInsultReloaded will search at the selected position for a target name.")
                selectingPhrase = false;
            }
            if (invPotKillMessage && potKillMessages.some(function (km) {
                if (clientChatContent.contains(km.join(" "))) {
                    killMessage = km
                    return true;
                }
            })) {
                e.cancelEvent()
                clearChat()

                addMessage(prefix + killMessage.join(" "), ["clickEvent", killMessage.join(" "), "RUN_COMMAND"], ["hoverEvent", "§aClick build detection phrase."])
                invPotKillMessage = false;

                buildingDetectionPhrase = true
                builtDetectionPhrase = [];
            }
            if (buildingDetectionPhrase) {
                if (clientChatContent.contains(killMessage.join(" "))) {
                    e.cancelEvent()
                    clearChat()

                    for (var i = 0; i < killMessage.length; i++) {
                        var part = killMessage[i]
                        addMessage(prefix + part, ["clickEvent", part, "RUN_COMMAND"], ["hoverEvent", "§aClick select as part of detection phrase."])
                    }
                    addMessage(prefix)
                    addMessage(prefix + "§c§l[delete last element]", ["clickEvent", "-d delete last element", "RUN_COMMAND"], ["hoverEvent", "§cClick to delete the last added element."])
                    addMessage(prefix)
                    addMessage(prefix + "§a§l[finish selection]", ["clickEvent", "-f building detection phrase", "RUN_COMMAND"], ["hoverEvent", "§aClick to finish building detection phrase."])
                    addMessage(prefix + "§c§l[cancel selection]", ["clickEvent", "-c building detection phrase", "RUN_COMMAND"], ["hoverEvent", "§cClick to cancel building detection phrase."])
                    addMessage(prefix)
                }
                if (killMessage.includes(clientChatContent)) {
                    e.cancelEvent()

                    builtDetectionPhrase.push(clientChatContent)
                    addMessage(prefix + "§a§lDetection phrase is now: §7" + builtDetectionPhrase.join(" "))
                }
                if (clientChatContent.contains("-d delete last element")) {
                    e.cancelEvent()
                    builtDetectionPhrase.pop()

                    addMessage(prefix + "§a§lDetection phrase is now: §7" + builtDetectionPhrase.join(" "))
                }
                if (clientChatContent.contains("-c building detection phrase")) {
                    e.cancelEvent()
                    clearChat()

                    buildingDetectionPhrase = false;

                    setValue(displayPotKillMessages, false)
                    addMessage(prefix + "§c§lCanceled!")
                }
                if (clientChatContent.contains("-f building detection phrase")) {
                    e.cancelEvent()
                    clearChat()

                    addMessage(prefix + "§a§l[add to existing phrases]", ["clickEvent", "-fo1 add to existing phrases", "RUN_COMMAND"], ["hoverEvent", "§aClick to finalize building."])
                    addMessage(prefix + "§a§l[set and replace old phrases]", ["clickEvent", "-fo2 set and replace old phrases", "RUN_COMMAND"], ["hoverEvent", "§aClick to finalize building."])
                }
                if (clientChatContent.contains("-fo1 add to existing phrases")) {
                    e.cancelEvent()
                    clearChat()

                    var temp = detectionPhrase.get() + "," + builtDetectionPhrase.join(" ")

                    setValue(detectionPhrase, temp)
                    setValue(displayPotKillMessages, false)

                    addMessage(prefix + "Detection phrase set to §a§l" + temp)

                    buildingDetectionPhrase = false;
                }
                if (clientChatContent.contains("-fo2 set and replace old phrases")) {
                    e.cancelEvent()
                    clearChat()

                    var temp = builtDetectionPhrase.join(" ")

                    setValue(detectionPhrase, temp)
                    setValue(displayPotKillMessages, false)

                    addMessage(prefix + "Detection phrase set to §a§l" + temp)

                    buildingDetectionPhrase = false;
                }
            }
        }

        if (packet instanceof S00PacketServerInfo) potKillMessages = [];

        if (packet instanceof S02PacketChat) {
            if (detectionMode.get() == "PacketChat" && mc.theWorld) {
                var serverChatContent = packet.getChatComponent().getUnformattedText()
                var serverContentArray = serverChatContent.split(" ")
                var otherNames = Java.from(mc.getNetHandler().getPlayerInfoMap()).map(function (info) info = info.getGameProfile().getName()).filter(function (name) name != mc.thePlayer.getName())

                var target = customIndex.get() ? serverContentArray[cIndex] : (smartTargetIndex.get() ? (serverContentArray.find(function (part) otherNames.includes(part)) || serverContentArray[0]) : serverContentArray[0])
                var scanPhrases = detectionPhrase.get().split(",").unique().filter(Boolean)

                if (serverChatContent.contains(mc.thePlayer.getName()) && otherNames.some(function (n) serverChatContent.contains(n))) potKillMessages.push(serverContentArray.filter(Boolean));

                if (selectingPhrase || buildingDetectionPhrase || invPotKillMessage) return e.cancelEvent();

                if (scanPhrases.some(function (phrase) serverChatContent.contains(phrase + " " + mc.thePlayer.getName()))) {
                    sendInsult(target)
                    lastKillMessage = serverContentArray
                } else if (sentInsult) {
                    if (serverChatContent.contains(formattedInsult) || similarToInsult(serverChatContent)) {
                        if (sentLink) {
                            if (hyperLink.get() && !packet.getChatComponent().getChatStyle().getChatClickEvent()) {
                                e.cancelEvent()
                                addMessage(packet.getChatComponent().getFormattedText() + " §a§l[OPEN]", ["clickEvent", extractLinks(insult)[0]], ["hoverEvent", "§a§lClick me!"])
                            }
                            sentLink = false
                        }
                        sentInsult = false
                    }
                    packetsListened += 1;
                }
            }
        }
        if (sentInsult && (sinceLastPacket.hasTimePassed(100) && packetsListened > 0 || packetsListened >= 10)) {
            if (useQueue.get() && !sendQueue.includes(lastTarget) && lastQueueTarget != lastTarget) {
                sendQueue.push(lastTarget)
                queueTimer.reset()
            } sentInsult = false, sentLink = false;
        }
    });
    module.on("attack", function(e) {
        if (e.getTargetEntity() instanceof EntityPlayer) {
            currentTarget = e.getTargetEntity();
        }
    });
    module.on("world", function () {
        sendQueue = []
        currentTarget = null;
        selectingPhrase = false;
        sentInsult = false
        sentLink = false
        setValue(displayPotKillMessages, false)
    })
    module.on("update", function () {
        module.tag = detectionMode.get()

        if (sendQueue.length && queueTimer.hasTimePassed(sendDelay.get() * 1000)) {
            lastQueueTarget = sendPriority.get() == "QUEUE" ? sendQueue.shift() : sendQueue.pop();
            sendInsult(lastQueueTarget)
        }
        if (currentTarget && detectionMode.get() == "Classic") {
            if (currentTarget.isDead || currentTarget.getHealth <= 0 && !mc.thePlayer.getHealth <= 0 && !mc.thePlayer.isDead && currentTarget.getLastAttacker() == mc.thePlayer && mc.thePlayer) { //Issue: sends Insult if target is out of renderdist
                sendInsult(currentTarget.getName())
                return currentTarget = null;
            }
        }
    });
});

MatrixFuckerValues = {
    range: Setting.float({
        name: "Range",
        default: 6.0,
        min: 1.0,
        max: 7.0
    }),
    swingItem: Setting.boolean({
        name: "Swing",
        default: true
    }),
    fuckerRotation: Setting.boolean({
        name: "Rotation",
        default: true
    }),
    renderProgress: Setting.boolean({
        name: "RenderProgress",
        default: true
    })
}

function getClosestBedPos(radius) {
    var nearestBlockDist = Number.MAX_VALUE
    var nearestBedPos

    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            for (var z = -radius; z <= radius; z++) {
                var currentPos = new BlockPos(mc.thePlayer.posX + x, mc.thePlayer.posY + y, mc.thePlayer.posZ + z)
                var dist = BlockUtils.getCenterDistance(currentPos)

                if (getBlock(currentPos) != Blocks.bed) continue;
                if (dist > radius) continue;
                if (nearestBlockDist < dist) continue;
                nearestBlockDist = dist
                nearestBedPos = currentPos;
            }
        }
    }
    return nearestBedPos
}

function getFacing(state) state.getProperties().get(BlockDirectional.FACING);

function getBlockToBreak(bedPos, range) {
    var state = getBlockState(bedPos), facing = getFacing(state);

    var bedFootPos = state.getProperties().get(BlockBed.PART) == "head" ? bedPos[facing](-1) : bedPos;

    var outerBlocks = [bedFootPos[facing](-1), bedFootPos[facing](2)];

    for each (var direction in ["north", "south", "east", "west", "up"]) {
        if (direction == facing || direction == facing.getOpposite()) continue;
        outerBlocks.push(bedFootPos[direction](1), bedFootPos[direction](1)[facing](1));
    }

    if (outerBlocks.some(function (block) mc.theWorld.isAirBlock(block) || !BlockUtils.isBlockBBValid(block, getBlockState(block), false, false))) return bedPos;

    return outerBlocks
        .filter(function (block) BlockUtils.getCenterDistance(block) <= range)
        .sort(function (a, b) BlockUtils.getCenterDistance(a) - BlockUtils.getCenterDistance(b))
        .sort(function (a, b) getBlock(b).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, b) - getBlock(a).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, a))[0];
}

function breakBlock(blockPos, range, swing, rotation) {
    if (!blockPos || BlockUtils.getCenterDistance(blockPos) > range) {
        if (breakingBlock) {
            blockHitDelay = 4;
            breakDamage = 0;
            breakingBlock = null;
        }
        return
    }

    if (!breakingBlock) breakingBlock = blockPos;

    if (!breakDamage)
        
        PacketUtils.sendPacket(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.START_DESTROY_BLOCK, blockPos, EnumFacing.DOWN), true);

    breakDamage += getBlock(blockPos).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, blockPos);
    if (swing == true) {
        mc.thePlayer.swingItem()
    } else PacketUtils.sendPacket(new C0APacketAnimation(), true);

    if (rotation == true) { //atp its easier to not use utils lmao
        var rotVec = RotationUtils.faceBlock(breakingBlock, true, false, new ClosedDoubleRange({
                getStart: function () { return 0.0 },
                getEndInclusive: function () { return 1.0 },
                contains: function (value) { return value >= 0.0 && value <= 1.0 },
                lessThanOrEqual: function (a, b) { return a <= b },
                isEmpty: function () { return false }
            })
        );

        rotVec && RotationUtils.setTargetRotation(rotVec.rotation, new RotationSettings(ModuleManager.getModule("Fucker"), function () true), 1)
    }

    if (breakDamage >= 1) {
        PacketUtils.sendPacket(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK, blockPos, EnumFacing.DOWN), true);
        mc.playerController.onPlayerDestroyBlock(blockPos, EnumFacing.DOWN);
        blockHitDelay = 4;
        breakDamage = 0;
        breakingBlock = null;
    }
}

script.registerModule({
    name: "MatrixFucker",
    category: "Fun",
    description: "Fucker module exploiting that Matrix only checked if player was breaking bed if the most inner layer around the bed was intact",
    settings: MatrixFuckerValues
}, function (module) {
    module.on("update", function () {
        module.tag = module.settings.range.get().toFixed(2)
        if (blockHitDelay > 0) return blockHitDelay--;
        if (breakingBlock) return breakBlock(breakingBlock, module.settings.range.get(), module.settings.swingItem.get(), module.settings.fuckerRotation.get());
        var bedPos = getClosestBedPos(module.settings.range.get())
        if (!bedPos) return;

        breakBlock(getBlockToBreak(bedPos, module.settings.range.get()), module.settings.range.get(), module.settings.swingItem.get(), module.settings.fuckerRotation.get());
    });
    module.on("render2D", function () {
        if (!breakDamage || !module.settings.renderProgress.get()) return
        var breakPercentage = breakDamage * 100

        Gui.drawRect(470, 280, 340, 343, new Color(20, 20, 20).getRGB());
        Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
        mcFont.drawString("LayerFucker: (ID: " + Block.getIdFromBlock(getBlock(breakingBlock)) + ")", 346, 286, 0xFFFFFF);

        Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
        mcFont.drawString("Breaking: " + breakPercentage.toFixed(2) + "%", 345, 304, 0xFFFFFF);
        mcFont.drawString(getBlockName(breakingBlock).toUpperCase(), 345, 320, 0xFFFFFF);

        Gui.drawRect(467, 335, 343, 340, new Color(50, 50, 50).getRGB());
        Gui.drawRect(343, 335, 467 + 124 * breakDamage - 124, 340, Color.HSBtoRGB(breakDamage / 5.0, 1.0, 1.0) | 0xFF0000);

        var stack = new ItemStack(getBlock(breakingBlock).getItem(mc.theWorld, breakingBlock))

        RenderHelper.enableGUIStandardItemLighting()

        mc.getRenderItem().renderItemIntoGUI(stack, 448, 304);
        mc.getRenderItem().renderItemOverlays(mc.fontRendererObj, stack, 440, 311);

        RenderHelper.disableStandardItemLighting();
    });
    module.on("render3D", function () {
        if (!breakDamage || !module.settings.renderProgress.get()) return;
        RenderUtils.drawBlockBox(breakingBlock, Color.RED, true)
    });
});

MatrixFlyValues = {
    flyModeValue: flyMode = Setting.list({
        name: "FlyMode",
        values: ["FakeBlock", "BoatFly", "CancelC04", "S08SimulateSetback", "Glide", "Glide2", "TNTMotion", "TNTBlink", "ExternalDamageGlide", "DamageGlide", "BlinkDamageGlide"],
        default: "FakeBlock"
    }),
    cancelModeValue: cancelMode = Setting.list({
        name: "JumpMode",
        values: ["Normal", "NoFallDMG"],
        default: "Normal",
        isSupported: function () flyMode.get() == "CancelC04"
    }),
    idleUpMotionValue: idleUpMotion = Setting.float({
        name: "IdleYMotion",
        min: 0.409,
        max: 0.42,
        default: 0.409,
        isSupported: function () flyMode.get() == "CancelC04" && cancelMode.get() == "Normal"
    }),
    upMotionValue: upMotion = Setting.float({
        name: "JumpYMotion",
        min: 0.6,
        max: 1,
        default: 0.6,
        isSupported: function () flyMode.get() == "CancelC04" && cancelMode.get() == "Normal"
    }),
    renderAirTimeValue: renderAirTime = Setting.boolean({
        name: "RenderMaxAirTime",
        default: true,
        isSupported: function () flyMode.get() == "CancelC04" && cancelMode.get() == "Normal"
    }),
    disableOnValue: disableOn = Setting.boolean({
        name: "DisableOn",
        default: true,
        isSupported: function () flyMode.get() == "CancelC04" && cancelMode.get() == "Normal"
    }),
    disableOnPercentageValue: disableOnPercentage = Setting.integer({
        name: "RemainingHealth[%]",
        min: 1,
        max: 100,
        default: 95,
        isSupported: function () flyMode.get() == "CancelC04" && cancelMode.get() == "Normal" && disableOn.get()
    }),
    boatFlyXZValue: boatFlyXZ = Setting.float({
        name: "BoostXZ",
        min: 1,
        max: 10,
        default: 2,
        isSupported: function () flyMode.get() == "BoatFly"
    }),
    boatFlyYValue: boatFlyY = Setting.float({
        name: "BoostY",
        min: 0.5,
        max: 10,
        default: 1,
        isSupported: function () flyMode.get() == "BoatFly"
    }),
    boatTimerValue: boatTimer = Setting.float({
        name: "TimerSpeed",
        min: 0.1,
        max: 1,
        default: 0.5,
        isSupported: function () flyMode.get() == "BoatFly"
    }),
    simulateSetbackXZValue: simulateSetbackXZ = Setting.float({
        name: "BoostXZ",
        min: 1,
        max: 10,
        default: 2.5,
        isSupported: function () flyMode.get() == "S08SimulateSetback"
    }),
    simulateSetbackYValue: simulateSetbackY = Setting.float({
        name: "BoostY",
        min: 0.5,
        max: 2,
        default: 0.8,
        isSupported: function () flyMode.get() == "S08SimulateSetback"
    }),
    tntMotionXZValue: tntMotionXZ = Setting.float({
        name: "BoostXZ",
        min: 0.5,
        max: 5,
        default: 1,
        isSupported: function () flyMode.get() == "TNTMotion"
    }),
    tntMotionYValue: tntMotionY = Setting.float({
        name: "BoostY",
        min: 0.5,
        max: 5,
        default: 1.5,
        isSupported: function () flyMode.get() == "TNTMotion"
    }),
    tntBlinkBoostValue: tntBlinkBoost = Setting.float({
        name: "BoostXZ",
        min: 0.5,
        max: 5,
        default: 1,
        isSupported: function() flyMode.get() == "TNTBlink"
    }),
    stopOnMaxPacketsValue: stopOnMaxPackets = Setting.boolean({
        name: "StopOnMaxPackets",
        default: true,
        isSupported: function() flyMode.get() == "TNTBlink"
    }),
    tntBlinkMaxPacketsValue: tntBlinkMaxPackets = Setting.integer({
        name: "MaxBlinkPackets",
        min: 10,
        max: 100,
        default: 50,
        isSupported: function() flyMode.get() == "TNTBlink" && stopOnMaxPackets.get()
    }),
    allowFireBallValue: allowFireBall = Setting.boolean({
        name: "AllowFireBallExplosion",
        default: true,
        isSupported: function () flyMode.get() == "TNTMotion" || flyMode.get() == "TNTBlink"
    })
}

function approximateFallDamage() {
    var ResistanceEffect = mc.thePlayer.getActivePotionEffect(Potion.resistance), JumpBoostEffect = mc.thePlayer.getActivePotionEffect(Potion.jump),
        baseDamage = totalFallDist - 1.5 - (JumpBoostEffect ? JumpBoostEffect.getAmplifier() + 1 : 0), finalDamage = 0; //account for onDisable mc.thePlayer.fallDistance ~ += 1.5

    if (baseDamage <= 0) return 0

    var tEPF = 0

    for (var i = 0; i < 4; i++) { //for each armor piece with protection or feather falling increase dmg reduction
        var slotStack = mc.thePlayer.getCurrentArmor(i)
        if (!slotStack || (slotStack && !slotStack.isItemEnchanted())) continue;

        var enchanmentTagList = slotStack.getEnchantmentTagList()

        for (var j = 0; j < enchanmentTagList.tagCount(); j++) {
            var tag = enchanmentTagList.getCompoundTagAt(j)
            var tagId = tag.getShort("id")
            var tagLevel = tag.getShort("lvl")

            tEPF += (function(id, lvl) {
                if (id != 0 && id != 2) return 0;
                var modifier = id == 0 ? 0.75 : 2.5
                return Math.floor((6 + Math.pow(lvl, 2)) * modifier / 3)
            })(tagId, tagLevel)
        }
    }

    tEPF = Math.ceil(tEPF * 0.75) //according to forum sources: random value (0.5, 1) is used, however this is crap to work with; avg 0.75
    if (tEPF > 20) tEPF = 20

    finalDamage = baseDamage * (1 - tEPF * 0.04)

    if (ResistanceEffect) {
        if (ResistanceEffect.getAmplifier() <= 3) {
            var resLevel = ResistanceEffect.getAmplifier() + 1
            var resRed = 1 - (0.2 * resLevel)
            finalDamage = finalDamage * resRed;
        } else return 0;
    }

    return Math.ceil(finalDamage)
}

function canRecieveFallDMG() {
    var ResistanceEffect = mc.thePlayer.getActivePotionEffect(Potion.resistance), NoFallModule = ModuleManager.getModule("NoFall");
    if (ResistanceEffect && ResistanceEffect.getAmplifier() >= 4 || NoFallModule.getState() || mc.thePlayer.isSpectator() || mc.thePlayer.isEntityInvulnerable(DamageSource.fall) || mc.thePlayer.capabilities.isCreativeMode || mc.thePlayer.capabilities.disableDamage) return false;
    return true
}

function getRelativeFallDMG() approximateFallDamage() / mc.thePlayer.getHealth();

script.registerModule({
    name: "MatrixFly",
    category: "Fun",
    description: "Module with Matrix Fly bypasses",
    settings: MatrixFlyValues,
}, function (module) {
    module.on("enable", function () {
        testx = new BlockPos(mc.thePlayer)
        simulateStartY = mc.thePlayer.posY
        glideMotionTicks = 6
        glideTicks = 0
        totalFallDist = 0;
    })
    module.on("update", function () {
        module.tag = flyMode.get()
        var MatrixFlyModule = ModuleManager.getModule("MatrixFly")

        switch (flyMode.get()) {
            case "FakeBlock":
                if (mc.thePlayer.onGround) mc.thePlayer.jump();
                var pos = new BlockPos(mc.thePlayer).down(1)
                if (mc.theWorld.isAirBlock(pos) && mc.thePlayer.fallDistance >= 1) {
                    mc.theWorld.setBlockState(pos, Blocks.barrier.getDefaultState())
                    lastPlaced = pos
                    mc.thePlayer.fallDistance = 0
                } else if (lastPlaced) mc.theWorld.setBlockToAir(lastPlaced);
                break;
            case "BoatFly":
                if (mc.thePlayer.isRiding()) {
                    PacketUtils.sendPacket(new C0BPacketEntityAction(mc.thePlayer, C0BPacketEntityAction.Action.START_SNEAKING), false)
                    wasRiding = true
                } else if (wasRiding) {
                    mc.timer.timerSpeed = boatTimer.get()
                    MovementUtils.strafe(boatFlyXZ.get())
                    mc.thePlayer.motionY = boatFlyY.get()
                    wasRiding = false
                    boosted = true
                }
                if (mc.thePlayer.ticksExisted % 5 == 0 && boosted) {
                    mc.timer.timerSpeed = 1
                }
                if (boosted && !mc.thePlayer.onGround && mc.gameSettings.keyBindSneak.pressed) {
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                if (boosted && (mc.thePlayer.onGround || mc.gameSettings.keyBindSneak.pressed)) boosted = false, mc.timer.timerSpeed = 1;
                break;
            case "CancelC04":
                if (cancelMode.get() == "Normal") {
                    if (canRecieveFallDMG() && disableOn.get() && getRelativeFallDMG() >= 1 - disableOnPercentage.get() / 100) {
                        MatrixFlyModule.setState(false)
                    }
                    if (mc.thePlayer.fallDistance >= 1) {
                        cancelC04 = true
                        if (!mc.gameSettings.keyBindJump.pressed && !mc.gameSettings.keyBindSneak.pressed) {
                            mc.thePlayer.motionY = idleUpMotion.get()
                        } else if (mc.gameSettings.keyBindJump.pressed) {
                            mc.thePlayer.motionY = upMotion.get()
                        }
                        totalFallDist += mc.thePlayer.fallDistance
                        mc.thePlayer.fallDistance = 0;
                    } else cancelC04 = false;
                } else {
                    if (mc.thePlayer.ticksExisted % 2 == 0) {
                        mc.thePlayer.motionY = 0.039
                        cancelC04 = true
                    } else cancelC04 = false;
                }
                break;
            case "S08SimulateSetback":
                var yaw = (mc.thePlayer.rotationYaw / 180) * Math.PI
                if (!tryBoost) {
                    PacketUtils.sendPacket(new C04PacketPlayerPosition(mc.thePlayer.posX - Math.sin(yaw) * 1.5, mc.thePlayer.posY + 1, mc.thePlayer.posZ + Math.cos(yaw) * 1.5, false), false)
                    tryBoost = 1
                    mc.timer.timerSpeed = 0.3
                } else if (tryBoost == 2) {
                    MovementUtils.strafe(simulateSetbackXZ.get())
                    mc.thePlayer.motionY = simulateSetbackY.get()
                    tryBoost = 3
                } else if (tryBoost < 5) {
                    tryBoost++;
                } else if (tryBoost >= 5) {
                    mc.timer.timerSpeed = 1
                    if (simulateStartY > mc.thePlayer.posY) tryBoost = 0;
                }
                break;
            case "Glide":
                if (mc.thePlayer.fallDistance >= 1) {
                    mc.timer.timerSpeed = 0.5
                    if (glideMotionTicks > 0) {
                        if (mc.thePlayer.ticksExisted % 3 == 0) {
                            mc.thePlayer.motionY = -0.005
                            glideMotionTicks--;
                        }
                        glideTicks = 0;
                    } else {
                        mc.timer.timerSpeed = 0.015
                        if (glideTicks > 6) {
                            glideMotionTicks = 7
                        }
                        glideTicks++;
                    }
                }
                break;
            case "Glide2":
                if (mc.thePlayer.fallDistance >= 1) {
                    if (glideMotionTicks > 0) {
                        mc.timer.timerSpeed = 0.5
                        if (mc.thePlayer.ticksExisted % 8 == 0) {
                            mc.thePlayer.motionY = -0.005
                            glideMotionTicks--
                        }
                    } else {
                        MatrixFlyModule.setState(false)
                    }
                }
                break;
            case "TNTMotion":
                if (tntFly && !tntStartBoost) {
                    mc.thePlayer.motionY = tntMotionY.get()
                    MovementUtils.strafe(tntMotionXZ.get())
                    if (!mc.thePlayer.onGround) tntStartBoost = true
                }
                if (mc.thePlayer.fallDistance >= 1 && tntFly && mc.thePlayer.ticksExisted % 5 == 0) {
                    mc.thePlayer.motionY = 0.15
                    MovementUtils.strafe(1)
                }
                if ((mc.thePlayer.onGround && tntFly && tntStartBoost) || (mc.gameSettings.keyBindSneak.pressed && tntFly)) tntFly = false, tntStartBoost = false;
                break;
            case "TNTBlink":
                if (tntFly) {
                    mc.thePlayer.motionY = 0
                    MovementUtils.strafe(tntBlinkBoost.get())

                    if (BlinkUtils.packets.size() >= tntBlinkMaxPackets.get() && stopOnMaxPackets.get() || mc.gameSettings.keyBindSneak.pressed) {
                        BlinkUtils.unblink()
                        mc.thePlayer.motionX = 0;
                        mc.thePlayer.motionZ = 0;
                        tntFly = false;
                    }
                }
                break;
            case "ExternalDamageGlide":
                var PoisonEffect = mc.thePlayer.getActivePotionEffect(Potion.poison), WitherEffect = mc.thePlayer.getActivePotionEffect(Potion.wither);
                if (mc.thePlayer.isBurning() || PoisonEffect || WitherEffect) {
                    if (isMovingHorizontally(mc.thePlayer)) {
                        mc.thePlayer.motionY = -0.005
                    } else mc.thePlayer.motionY = -0.01;
                }
                break;
            case "DamageGlide":
                if (mc.thePlayer.hurtTime > 0) wasDamaged = true;
                if (mc.thePlayer.ticksExisted % 20 == 0) {
                    for (var i = 0; i <= 65; i++) {
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY + 0.049, mc.thePlayer.posZ, false), false)
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, false), false)
                    }
                    PacketUtils.sendPacket(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, true), false)
                }
                if (wasDamaged) {
                    if (isMovingHorizontally(mc.thePlayer)) {
                        mc.thePlayer.motionY = -0.005
                    } else mc.thePlayer.motionY = -0.01
                }
                break;
            case "BlinkDamageGlide":
                if (mc.thePlayer.hurtTime > 0) wasDamaged = true
                if (wasDamaged) {
                    mc.thePlayer.motionY = -0.01
                }
        }
    });
    module.on("move", function (e) {
        !wasDamaged && (flyMode.get() == "DamageGlide" || flyMode.get() == "BlinkDamageGlide") && e.zeroXZ();
    })
    module.on("packet", function (e) {
        var packet = e.getPacket()

        if (flyMode.get() == "CancelC04") {
            if (packet instanceof C04PacketPlayerPosition && cancelC04) e.cancelEvent();
        }
        if (flyMode.get() == "S08SimulateSetback") {
            if (packet instanceof S08PacketPlayerPosLook) {
                mc.thePlayer.setPosition(packet.getX(), packet.getY(), packet.getZ())
                PacketUtils.sendPacket(new C06PacketPlayerPosLook(packet.getX(), packet.getY(), packet.getZ(), packet.getYaw(), packet.getPitch(), false), false)
                e.cancelEvent()
            }
        }
        if ((flyMode.get() == "TNTMotion" || flyMode.get() == "TNTBlink") && packet instanceof S27PacketExplosion && (getTargetsInRange(8, EntityTNTPrimed).length || (allowFireBall.get() ? getTargetsInRange(8, EntityFireball).length : false))) {
            tntFly = true
            if (mc.thePlayer.onGround && flyMode.get() == "TNTMotion") mc.thePlayer.jump();
        }
        if (flyMode.get() == "TNTBlink" && tntFly) {
            BlinkUtils.blink(packet, e, true, true)
        }
        if (flyMode.get() == "BlinkDamageGlide" && wasDamaged) BlinkUtils.blink(packet, e, true, true);
    });
    module.on("render2D", function () {
        if (!renderAirTime.get() || flyMode.get() != "CancelC04" || cancelMode.get() != "Normal" || !canRecieveFallDMG() || mc.thePlayer.onGround) return;

        var percentage = getRelativeFallDMG() * 100,
            renderDMG = getRelativeFallDMG() < 1 ? getRelativeFallDMG() : 1,
            screenWidth = new ScaledResolution(mc).getScaledWidth(),
            screenHeight = new ScaledResolution(mc).getScaledHeight();

        Gui.drawRect(screenWidth / 2 - 10, screenHeight / 2 + 10, screenWidth / 2 - 140, screenHeight / 2 + 73, new Color(20, 20, 20).getRGB());
        Gui.drawRect(screenWidth / 2 - 13, screenHeight / 2 + 13, screenWidth / 2 - 137, screenHeight / 2 + 28, new Color(50, 50, 50).getRGB());
        if (percentage < 100) {
            mcFont.drawString("LANDING SURVIVABLE", screenWidth / 2 - 134, screenHeight / 2 + 17, 0x11ff00)
        } else mcFont.drawString("YOU WILL DIE", screenWidth / 2 - 134, screenHeight / 2 + 17, 0xff0000)

        Gui.drawRect(screenWidth / 2 - 13, screenHeight / 2 + 31, screenWidth / 2 - 137, screenHeight / 2 + 62, new Color(50, 50, 50).getRGB());
        mcFont.drawString("Spent ~" + percentage.toFixed(2) + "%", screenWidth / 2 - 135, screenHeight / 2 + 34, 0xFFFFFF);
        mcFont.drawString("OF MAX AIR TIME", screenWidth / 2 - 135, screenHeight / 2 + 50, 0xFFFFFF);

        Gui.drawRect(screenWidth / 2 - 13, screenHeight / 2 + 65, screenWidth / 2 - 137, screenHeight / 2 + 70, new Color(50, 50, 50).getRGB());
        Gui.drawRect(screenWidth / 2 - 137, screenHeight / 2 + 65, screenWidth / 2 - 13 + 124 * renderDMG - 124, screenHeight / 2 + 70, Color.HSBtoRGB(renderDMG / 5, 1.0, 1.0) | 0xFF0000);
    })
    module.on("world", function () {
        if (flyMode.get() == "S08SimulateSetback") ModuleManager.getModule("MatrixFly").setState(false)
    })
    module.on("disable", function () {
        lastPlaced && mc.theWorld.setBlockToAir(lastPlaced);
        ModuleManager.getModule("NoFall").getState() && (mc.thePlayer.fallDistance = totalFallDist) //allow NoFall MLG to catch fall
        mc.timer.timerSpeed = 1;
        tryBoost = 0;
        wasRiding = false
        boosted = false
        tntFly = false
        tntStartBoost = false
        wasDamaged = false
        BlinkUtils.unblink()
    })
});

MatrixClickTPValues = {
    mouseButtonValue: mouseButton = Setting.list({
        name: "MouseButton",
        values: ["left", "middle", "right"],
        default: "middle"
    }),
    clickTpModeValue: clickTpMode = Setting.list({
        name: "Mode",
        values: ["PacketSpam", "CyclePackets"],
        default: "CyclePackets"
    }),
    maxPacketsValue: maxPackets = Setting.integer({
        name: "MaxPackets",
        min: 20,
        max: 1000,
        default: 20
    }),
    flagInitiationPacketsValue: flagInitiationPackets = Setting.integer({
        name: "FlagInitiationPackets",
        min: 1,
        max: 10,
        default: 1,
        isSupported: function() clickTpMode.get() != "PacketSpam"
    }),
    tpWaitSecondsValue: tpWaitSeconds = Setting.integer({
        name: "TPWaitSeconds[s]",
        min: 1,
        max: 5,
        default: 2,
        isSupported: function() clickTpMode.get() == "CyclePackets"
    }),
    tpTimerValue: tpTimer = Setting.float({
        name: "TimerSpeed",
        min: 0.1,
        max: 2,
        default: 0.3
    }),
    freeCamSelectOnControlValue: freeCamSelectOnControl = Setting.boolean({
        name: "FreeCamSelectOnControl",
        default: true
    })
}

function isButtonPressed() {
    switch (mouseButton.get()) {
        case "left": return mc.gameSettings.keyBindAttack.pressed; break;
        case "middle": return mc.gameSettings.keyBindPickBlock.pressed; break;
        case "right": return mc.gameSettings.keyBindUseItem.pressed; break;
        default: false;
    }
}

function hasArrived() {
    return (mc.thePlayer.posX == destinationPos.getX() && mc.thePlayer.posZ == destinationPos.getZ() || getDist(destinationPos, new BlockPos(mc.thePlayer)) <= 2) && !ModuleManager.getModule("FreeCam").getState();
}

function drawDestinationBlockOnScreen(blockPos, x, y, scale, yaw, pitch) { //GuiInventory.drawEntityOnScreen() only takes instanceof EntityLiving; this is a bit cheap ngl, but easy
    var state = mc.theWorld.getBlockState(blockPos);
    var block = state.getBlock()

    var entity = new EntityFallingBlock(mc.theWorld, 0.0, 0.0, 0.0, state);

    var tileEntity = mc.theWorld.getTileEntity(blockPos)
    var tileEntityRender = tileEntity && [BlockBanner, BlockChest, BlockEnderChest, BlockSign, BlockSkull, BlockFlowerPot].some(function (c) block instanceof c)
    //some TileEntities dont have models that can be rendered with RenderManager, instead use TileEntityRendererDispatcher
    //however this function has a different rotation axis which is why if tileEntityRender a correction is necessary
    //regardless, some blocks may not be rendered e.g. FlowerPot; fix ts

    GlStateManager.pushMatrix();

    GlStateManager.enableDepth();
    GlStateManager.depthMask(true);
    GlStateManager.clear(256);

    GlStateManager.translate(x, y, 150.0);

    tileEntityRender && GlStateManager.translate(0.5, 0.5, 0.5);

    GlStateManager.scale(-scale, scale, scale);

    GlStateManager.rotate(180.0, 0.0, 0.0, 1.0);
    GlStateManager.rotate(pitch, 1.0, 0.0, 0.0);
    GlStateManager.rotate(yaw, 0.0, 1.0, 0.0);

    tileEntityRender && GlStateManager.translate(-0.5, -0.5, -0.5);

    RenderHelper.enableStandardItemLighting();
    GlStateManager.enableRescaleNormal();
    GlStateManager.color(1.0, 1.0, 1.0, 1.0);

    var renderManager = mc.getRenderManager();
    renderManager.setRenderShadow(false);

    tileEntityRender ? TileEntityRendererDispatcher.instance.renderTileEntityAt(tileEntity, 0.0, 0.0, 0.0, 1.0) : renderManager.doRenderEntity(entity, 0.0, 0.0, 0.0, 0.0, 1.0, false);

    renderManager.setRenderShadow(true);

    RenderHelper.disableStandardItemLighting();

    GlStateManager.popMatrix();

    mc.getTextureManager().bindTexture(TextureMap.locationBlocksTexture);
}

function handleAction(action, e) {
    action || null;  e || null; e ? packet = e.getPacket() : null;
    switch (action) {
        case "initiateFlag":
            for (var i = 0; i <= flagInitiationPackets.get(); i++) {
                PacketUtils.sendPacket(new C04PacketPlayerPosition(destinationPos.getX(), destinationPos.getY() + 1, destinationPos.getZ(), true), true)
                sentPackets += 1
            }
            break;
        case "desync":
            mc.thePlayer.setPosition(packet.getX(), packet.getY(), packet.getZ())
            PacketUtils.sendPacket(new C06PacketPlayerPosLook(destinationPos.getX(), destinationPos.getY() + 1, destinationPos.getZ(), packet.getYaw(), packet.getPitch(), true), false)
            PacketUtils.sendPacket(new C06PacketPlayerPosLook(destinationPos.getX(), destinationPos.getY() + 100, destinationPos.getZ(), packet.getYaw(), packet.getPitch(), false), false)
            e.cancelEvent()
            sentPackets += 2
            break;
        default:
            PacketUtils.sendPacket(new C04PacketPlayerPosition(destinationPos.getX(), destinationPos.getY(), destinationPos.getZ(), true), true)
            sentPackets += 1
            break;
    }
}

script.registerModule({
    name: "MatrixClickTP",
    category: "Fun",
    description: "Module with Matrix Teleport bypass",
    settings: MatrixClickTPValues,
}, function (module) {
    module.on("update", function () {
        module.tag = mouseButton.get()

        if (!destinationPos && freeCamSelectOnControl.get() && Keyboard.isKeyDown(Keyboard.KEY_LCONTROL)) {
            if (clickTpMode.get() != "PacketSpam" ) {
                mc.thePlayer.isRiding() && ModuleManager.getModule("FreeCam").setState(true)
            } else ModuleManager.getModule("FreeCam").setState(true);
        }

        if (!destinationPos) return;

        mc.timer.timerSpeed = tpTimer.get()

        if (clickTpMode.get() == "PacketSpam") handleAction()
    })
    module.on("render3D", function () {
        lookingAt = mc.thePlayer.rayTrace(255, 1)

        if (lookingAt.typeOfHit == "MISS" && !destinationPos) return lookPos = null;

        lookPos = lookingAt.getBlockPos()

        if (isButtonPressed() && selectTimer.hasTimePassed(400) && !destinationPos) {
            destinationPos = lookPos

            renderSelected = true

            mts = 0;

            if (clickTpMode.get() != "PacketSpam") {
                if (mc.thePlayer.isRiding()) {
                    handleAction("initiateFlag")
                } else {
                    ModuleManager.getModule("MatrixClickTP").setState(false)
                    addMessage("")
                    addMessage(prefix + "Please §c§lride an entity§7 while §c§lselecting!")
                    addMessage("");
                }
            }

            selectTimer.reset()
            renderSelectedTimer.reset()
        }

        if (renderSelectedTimer.hasTimePassed(400)) renderSelected = false;

        if (!renderSelected && !destinationPos) {
            RenderUtils.drawBlockBox(lookPos, Color.GREEN, true)
        } else if (renderSelected && destinationPos) {
            RenderUtils.drawBlockBox(destinationPos, Color.RED, true)
        } else if (destinationPos && !renderSelected) {
            RenderUtils.drawBlockBox(destinationPos, Color.ORANGE, true)
        }
    });
    module.on("render2D", function () {
        var screenWidth = new ScaledResolution(mc).getScaledWidth(), screenHeight = new ScaledResolution(mc).getScaledHeight();

        if (!renderSelected && !destinationPos && lookPos) {
            Gui.drawRect(screenWidth / 2 - 10, screenHeight / 2 + 10, screenWidth / 2 - 140, screenHeight / 2 + 65, new Color(20, 20, 20).getRGB());
            Gui.drawRect(screenWidth / 2 - 13, screenHeight / 2 + 13, screenWidth / 2 - 137, screenHeight / 2 + 28, new Color(50, 50, 50).getRGB());
            mcFont.drawString("Looking at: (ID: " + Block.getIdFromBlock(getBlock(lookPos)) + ")", screenWidth / 2 - 134, screenHeight / 2 + 16, 0xFFFFFF);

            Gui.drawRect(screenWidth / 2 - 13, screenHeight / 2 + 31, screenWidth / 2 - 137, screenHeight / 2 + 62, new Color(50, 50, 50).getRGB());
            mcFont.drawString(getBlockName(lookPos).toUpperCase(), screenWidth / 2 - 134, screenHeight / 2 + 35, 0xFFFFFF);
            mcFont.drawString(mouseButton.get() + "-Click to select!", screenWidth / 2 - 134, screenHeight / 2 + 50, 0xFFFFFF);
        }

        if (!destinationPos) return;

        var MatrixTeleportModule = ModuleManager.getModule("MatrixClickTP")

        if (hasArrived()) {
            addMessage(prefix + "Teleported successfully with §c§l" + (clickTpMode.get() == "PacketSpam" ? sentPackets : finalPackets) + " §7packets!")
            MatrixTeleportModule.setState(false)
        } else if (sentPackets >= maxPackets.get()) {
            if (clickTpMode.get() == "PacketSpam") {
                addMessage(prefix + "Teleport failed!")
                addMessage(prefix + "Sent §c§l" + sentPackets + " §7packets")
                MatrixTeleportModule.setState(false)
            } else if (clickTpMode.get() == "CyclePackets") {
                tpWait = true
                finalPackets += sentPackets
                sentPackets = 0;
                tpWaitTimer.reset()
            }
        } else if (!hasArrived() && clickTpMode.get() == "CyclePackets" && !mc.thePlayer.isRiding()) MatrixTeleportModule.setState(false), addMessage(""), addMessage(prefix + "§c§lCanceled Teleport!"), addMessage(prefix + "Dismounted too early!"), addMessage("");

        ModuleManager.getModule("FreeCam").setState(false)

        if (tpWaitTimer.hasTimePassed(tpWaitSeconds.get() * 1000) && tpWait) handleAction("initiateFlag"), tpWait = false;

        mts = animate(15, mts, 0.25)
        drawDestinationBlockOnScreen(destinationPos, screenWidth / 2, screenHeight / 2 + 40, mts, (System.currentTimeMillis() / 10) % 360, 0);
        mcFont.drawString("§6attempting...", screenWidth / 2 - 25, screenHeight / 2 + 10, 0xFFFFFF);
    })
    module.on("packet", function (e) {
        var packet = e.getPacket()

        if (mc.thePlayer.isRiding() && destinationPos && clickTpMode.get() != "PacketSpam") {
            if (packet instanceof S08PacketPlayerPosLook) {
                if (clickTpMode.get() == "CyclePackets") !tpWait && handleAction("desync", e);
            }
        }
    })
    module.on("disable", function () {
        destinationPos = null
        sentPackets = 0
        lookingAt = null
        lookPos = null
        mc.timer.timerSpeed = 1
        finalPackets = 0;
        tpWait = false;

        ModuleManager.getModule("FreeCam").setState(false)
    })
    module.on("world", function () {
        ModuleManager.getModule("MatrixClickTP").setState(false)
    })
});

MatrixSpeedValues = {
    speedModeValue: speedMode = Setting.list({
        name: "SpeedMode",
        values: ["OnGround", "BHop", "TimerHop"],
        default: "OnGround"
    }),
    onGroundBoostValue: onGroundBoost = Setting.float({
        name: "Boost",
        min: 0.4,
        max: 1,
        default: 0.5,
        isSupported: function () speedMode.get() == "OnGround"
    }),
    bHopBoostValue: bHopBoost = Setting.float({
        name: "Boost",
        min: 0.4,
        max: 1,
        default: 0.5,
        isSupported: function () speedMode.get() == "BHop"
    })
}

script.registerModule({
    name: "MatrixSpeed",
    category: "Fun",
    description: "Module with Matrix Speed bypasses",
    settings: MatrixSpeedValues,
}, function (module) {
    module.on("update", function () {
        module.tag = speedMode.get()
        switch (speedMode.get()) {
            case "OnGround":
                if (!mc.gameSettings.keyBindJump.pressed && MovementUtils.isOnGround(0.001) && !mc.thePlayer.isCollidedHorizontally) {
                    mc.thePlayer.motionY = 0;
                    if (mc.thePlayer.ticksExisted % 2 == 0 && entityIsMoving(mc.thePlayer)) {
                        MovementUtils.strafe(onGroundBoost.get())
                    }
                }
                break;
            case "BHop":
                if (!mc.thePlayer.isInWater()) {
                    if (!mc.thePlayer.isCollidedHorizontally) {
                        if (entityIsMoving(mc.thePlayer) && mc.thePlayer.ticksExisted % 2 == 0 && !mc.thePlayer.onGround) {
                            MovementUtils.strafe(bHopBoost.get())
                        }
                    }
                    if (entityIsMoving(mc.thePlayer) && mc.thePlayer.onGround) mc.thePlayer.jump()
                }
                break;
            case "TimerHop":
                if (entityIsMoving(mc.thePlayer)) {
                    if (mc.thePlayer.onGround) {
                        mc.thePlayer.jump();
                    } else if (mc.thePlayer.fallDistance > 0.5 && mc.thePlayer.fallDistance < 1) {
                        mc.timer.timerSpeed = 1.55
                    }
                } else {
                    mc.timer.timerSpeed = 1
                } if (mc.thePlayer.fallDistance > 1) mc.timer.timerSpeed = 1;
        }
    })
    module.on("disable", function () {
        mc.timer.timerSpeed = 1
    })
});

MatrixUtilityValues = {
    combatStrafeValue: combatStrafe = Setting.boolean({
        name: "CombatStrafe",
        default: true
    }),
    autoJumpValue: autoJump = Setting.boolean({
        name: "AutoJump",
        default: false,
        isSupported: function() combatStrafe.get()
    }),
    combatStrafeSpeedValue: combatStrafeSpeed = Setting.float({
        name: "StrafeSpeed",
        min: 0.01,
        max: 0.22,
        default: 0.22,
        isSupported: function() combatStrafe.get()
    }),
    glideWhenHurtValue: glideWhenHurt = Setting.boolean({
        name: "GlideWhenHurt",
        default: false,
        isSupported: function () combatStrafe.get()
    }),
    spacerid83297Value: spacerid83297 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function () combatStrafe.get()
    }),
    returnLastPosValue: returnLastPos = Setting.boolean({
        name: "ReturnToLastDeathPos",
        default: false
    }),
    spacerValu7ehf6328: spacer7ehf6328 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() returnLastPos.get()
    }),
    antiBotValue: antiBot = Setting.boolean({
        name: "AntiBot",
        default: true
    }),
    antiBotModeValue: antiBotMode = Setting.list({
        name: "Mode",
        values: ["OldZombie", "CzechHek", "DuplicateProfile"],
        default: "DuplicateProfile",
        isSupported: function() antiBot.get()
    }),
    debugRemovalValue: debugRemoval = Setting.boolean({
        name: "Debug",
        default: false,
        isSupported: function() antiBot.get()
    }),
    spacerValue738437h: spacer738437h = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() antiBot.get()
    }),
    stepValue: step = Setting.boolean({
        name: "Step",
        default: true
    }),
    stepPredictValue: stepPredict = Setting.float({
        name: "PredictSize",
        min: 0.0,
        max: 1.0,
        default: 0.45,
        isSupported: function() step.get()
    }),
    stepTimerValue: stepTimer = Setting.float({
        name: "Timer",
        min: 0.1,
        max: 3.0,
        default: 1.0,
        isSupported: function() step.get()
    })
}

function isPlayerBot(entity) {
    var playerInfoMap = Java.from(mc.getNetHandler().getPlayerInfoMap())
    var entityGameProfile = entity.getGameProfile()

    return playerInfoMap.some(function (info) {
        var gameProfile = info.getGameProfile()

        return gameProfile.getName() == entityGameProfile.getName() && !gameProfile.id.equals(entityGameProfile.id)
    });
}

function shouldStrafe(e) {
    var StrafeModule = ModuleManager.getModule("Strafe"), KillAuraModule = ModuleManager.getModule("KillAura"),
        strafeStrengthValue = StrafeModule.getValue("Strength").get(), killAuraRangeValue = KillAuraModule.getValue("Range").get(),
        target = e.getTargetEntity();

    if (StrafeModule.getState() && strafeStrengthValue >= combatStrafeSpeed.get()) return false;
    return PlayerExtensionKt.getDistanceToEntityBox(target, mc.thePlayer) <= killAuraRangeValue && entityIsMoving(mc.thePlayer)
}
 
script.registerModule({
    name: "MatrixUtility",
    category: "Fun",
    description: "Module with utility modules",
    settings: MatrixUtilityValues,
}, function (module) {
    module.on("update", function () {
        if (returnLastPos.get()) {
            if (mc.thePlayer.onGround) returnToLastOnGroundPos = new BlockPos(mc.thePlayer).down(1)
            if (mc.thePlayer.isSpectator() && returnToLastOnGroundPos) {
                PacketUtils.sendPacket(new C04PacketPlayerPosition(returnToLastOnGroundPos.getX(), returnToLastOnGroundPos.getY(), returnToLastOnGroundPos.getZ(), true), false)
            }
        }

        if (step.get() && !destinationPos) {
            if (canStep(1, stepPredict.get()) && isMovingHorizontally(mc.thePlayer) && !(mc.thePlayer.fallDistance || mc.thePlayer.isInWater() || mc.thePlayer.isOnLadder())) {
                isStepping = mc.timer.timerSpeed = stepTimer.get();
            } else {
                mc.timer.timerSpeed = 1;
                isStepping = false;
            }
            if (isStepping) {
                mc.thePlayer.onGround = true;
                mc.thePlayer.motionY = 0;
                mc.thePlayer.jump();
                isStepping = false
            }
        }
    })
    module.on("packet", function (e) {
        var packet = e.getPacket()

        if (step.get() && packet instanceof C03PacketPlayer && isStepping) {
            packet.onGround = true
        }

        if (antiBot.get()) {
            if (!mc.theWorld) return;
            switch (antiBotMode.get()) { //not everything in onPacket
                case "OldZombie":
                    getTargetsInRange(10, EntityZombie).filter(function (z) z.isInvisible()).map(function (bot) {
                        mc.theWorld.removeEntity(bot)
                        debugRemoval.get() && addMessage(prefix + "Removed: " + bot.getName());
                    });
                    break;
                case "CzechHek":
                    if (packet instanceof S41PacketServerDifficulty) wasAdded = false;
                    if (mc.thePlayer && packet instanceof S38PacketPlayerListItem && packet.getAction() == "ADD_PLAYER") {
                        var info = packet.getEntries().get(0), name = info.getProfile().getName();
                        if (!wasAdded) wasAdded = name == mc.thePlayer.getName();
                        else if (!mc.thePlayer.isSpectator() && !mc.thePlayer.capabilities.allowFlying && info.getPing() && info.getGameMode() != "NOT_SET") {
                            e.cancelEvent();
                            debugRemoval.get() && addMessage(prefix + "Removed: §c§l" + name);
                        }
                    }
                    break;
                case "DuplicateProfile":
                    var entityList = mc.theWorld.loadedEntityList
                    for (var i = 0; i < entityList.length; i++) {
                        var entity = entityList[i]
                        if (!(entity instanceof EntityPlayer) || entity == mc.thePlayer) continue;

                        if (isPlayerBot(entity)) {
                            mc.theWorld.removeEntity(entity)
                            debugRemoval.get() && addMessage(prefix + "Removed: §c§l" + entity.getName());
                        }
                    }
                    break;
            }
        }
    })
    module.on("attack", function (e) {
        if (shouldStrafe(e) && combatStrafe.get()) {
            if (mc.thePlayer.onGround && autoJump.get()) mc.thePlayer.jump();
            MovementUtils.strafe(combatStrafeSpeed.get());
            if (glideWhenHurt.get()) {
                if (mc.thePlayer.hurtTime > 0) strafeGlideTicks += 5;
                if (strafeGlideTicks > 0 && !mc.thePlayer.onGround && mc.thePlayer.fallDistance >= 0.1) {
                    strafeGlideTicks--
                    mc.thePlayer.motionY = -0.01
                }
            }
        }
    })
    module.on("render3D", function () {
        if (!mc.thePlayer.isSpectator() || !returnLastPos.get() || !returnToLastOnGroundPos) return
        RenderUtils.drawBlockBox(returnToLastOnGroundPos, Color.ORANGE, true)
    })
});

MatrixTeleportHitValues = {
    loopsValue: loops = Setting.integer({
        name: "Computations/Path",
        min: 1000,
        max: 20000,
        default: 5000
    }),
    diagonalSearchValue: diagonalSearch = Setting.boolean({
        name: "DiagonalPathSearch",
        default: true
    }),
    heuristicValue: heuristic = Setting.list({
        name: "Heuristic",
        values: ["Manhatten", "Euclidean"],
        default: "Manhatten"
    }),
    rangeValue: range = Setting.integer({
        name: "Range",
        min: 10,
        max: 300,
        default: 300
    }),
    packetIntervallValue: packetIntervall = Setting.integer({
        name: "PacketIntervall",
        min: 1,
        max: 5,
        default: 3
    }),
    retreatValue: retreat = Setting.boolean({
        name: "Retreat",
        default: true
    }),
    onGroundValue: onGround = Setting.boolean({
        name: "OnGround",
        default: false
    }),
    startJumpValue: startJump = Setting.boolean({
        name: "Jump",
        default: false
    }),
    startJumpMotionValue: startJumpMotion = Setting.float({
        name: "Motion",
        min: 0.01,
        max: 1,
        default: 0.42,
        isSupported: function() startJump.get()
    }),
    packetEventValue: packetEvent = Setting.boolean({
        name: "PacketEvent",
        default: false
    }),
    rotationValue: rotation = Setting.boolean({
        name: "Rotation",
        default: true
    }),
    renderTargetHUDValue: renderTargetHUD = Setting.boolean({
        name: "TargetHUD",
        default: true
    }),
    renderPacketPositionsValue: renderPacketPositions = Setting.boolean({
        name: "RenderPacketPositions",
        default: true
    }),
    visibleTimeValue: visibleTime = Setting.integer({
        name: "RenderTime",
        min: 100,
        max: 1000,
        default: 200,
        isSupported: function() renderPacketPositions.get()
    }),
    colorRValue: colorR = Setting.integer({
        name: "R",
        min: 0,
        max: 255,
        default: 0,
        isSupported: function() renderPacketPositions.get() 
    }),
    colorGValue: colorG = Setting.integer({
        name: "G",
        min: 0,
        max: 255,
        default: 0,
        isSupported: function() renderPacketPositions.get()
    }),
    colorBValue: colorB = Setting.integer({
        name: "B",
        min: 0,
        max: 255,
        default: 255,
        isSupported: function() renderPacketPositions.get()
    })
}

//implementation of https://en.wikipedia.org/wiki/Slab_method; https://tavianator.com/2022/ray_box_boundary.html#:~:text=Geometry%20The%20slab%20method%20tests%20for%20an,any.%20t=%20x%20d%20x%E2%88%92%20x%200.

function rayTrace(range) {
    var dirVec = mc.thePlayer.getLookVec(), originVec = mc.thePlayer.getPositionEyes(1), intersected = []

    var entityList = mc.theWorld.loadedEntityList

    for (var i = 0; i < entityList.length; i++) {
        var entity = entityList[i]
        if (!EntityUtils.isSelected(entity, true)) continue;

        var bb = entity.getEntityBoundingBox().expand(0.1, 0.1, 0.1) //make it hittable

        var tx1 = (bb.minX - originVec.xCoord) / dirVec.xCoord
        var tx2 = (bb.maxX - originVec.xCoord) / dirVec.xCoord
        var tmin_x = Math.min(tx1, tx2)
        var tmax_x = Math.max(tx1, tx2)

        var ty1 = (bb.minY - originVec.yCoord) / dirVec.yCoord
        var ty2 = (bb.maxY - originVec.yCoord) / dirVec.yCoord
        var tmin_y = Math.min(ty1, ty2)
        var tmax_y = Math.max(ty1, ty2)

        var tz1 = (bb.minZ - originVec.zCoord) / dirVec.zCoord
        var tz2 = (bb.maxZ - originVec.zCoord) / dirVec.zCoord
        var tmin_z = Math.min(tz1, tz2)
        var tmax_z = Math.max(tz1, tz2)

        var tEntry = Math.max(tmin_x, tmin_y, tmin_z)
        var tExit = Math.min(tmax_x, tmax_y, tmax_z)

        if (tExit > 0 && tEntry <= tExit && tEntry <= range) intersected.push(entity);
    }
    return intersected.sort(function (a, b) PlayerExtensionKt.getDistanceToEntityBox(a, mc.thePlayer) - PlayerExtensionKt.getDistanceToEntityBox(b, mc.thePlayer))[0]
}

//an implementation of https://de.wikipedia.org/wiki/A*-Algorithmus
//this version of A* is inefficient considering the circumstances
//similar to https://github.com/CCBlueX/LiquidBounce/blob/nextgen/src/main/kotlin/net/ccbluex/liquidbounce/utils/block/AStarPathBuilder.kt one may check if a whole chunk is empty
//if so, dont expand every node, instead skip the chunk by expanding only a few nodes
//additionally, using arrays instead of a proper data structure is also inefficient

function isPassable(blockPos) {
    var state = mc.theWorld.getBlockState(blockPos)
    var block = state.getBlock()
    if (!block.getCollisionBoundingBox(mc.theWorld, blockPos, state) || mc.theWorld.isAirBlock(blockPos) ||
        block.isLadder(mc.theWorld, blockPos, mc.thePlayer) || block.isPassable(mc.theWorld, blockPos) ||
        block.isFlowerPot() || block == Blocks.snow_layer || block instanceof BlockLiquid) return true;
    return false
}

function isSurrounded(blockPos) {
    var offsets = [[0, -1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [0, 2, 0]]
    for (var i = 0; i < offsets.length; i++) {
        var pos = new BlockPos(blockPos.getX() + offsets[i][0], blockPos.getY() + offsets[i][1], blockPos.getZ() + offsets[i][2])
        if (isPassable(pos)) return false
    }
    return true;
}

function getAnySurroungingPos(blockPos) {
    if (isSurrounded(blockPos)) return null;
    var offsets = [[0, -1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [0, 2, 0]]
    for (var i = 0; i < offsets.length; i++) {
        var pos = new BlockPos(blockPos.getX() + offsets[i][0], blockPos.getY() + offsets[i][1], blockPos.getZ() + offsets[i][2])
        if (isPassable(pos)) return pos
    }
    return null;
}

Node = function(pos, parent, gCost, hCost, tCost) {
    this.pos = pos
    this.parent = parent || null
    this.gCost = gCost || 0
    this.hCost = hCost || 0
    this.tCost = tCost || (gCost + hCost)
}

PathAlgorithm = function() {
    this.startPos = null
    this.endPos = null
    this.startNode = null
    this.endNode = null
    this.openList = []
    this.closeList = []
    this.path = []
    this.sqrt2 = Math.sqrt(2)
    this.sqrt3 = Math.sqrt(3)

    this.set = function(endPos) {
        this.startPos = new BlockPos(mc.thePlayer)
        this.endPos = endPos

        this.startNode = new Node(this.startPos)
        this.endNode = new Node(this.endPos)
        this.openList = [this.startNode]
        this.closeList = []
        this.path = []
    }

    this.expandNode = function (node, heuristic, diagonal) {
        var n = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], d = [[-1, -1, 0], [-1, 1, 0], [1, -1, 0], [1, 1, 0], [-1, 0, -1], [-1, 0, 1], [1, 0, -1], [1, 0, 1], [0, -1, -1], [0, -1, 1], [0, 1, -1], [0, 1, 1]], rd = [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]]
        var offsets = diagonal ? n.concat(d, rd) : n

        for (var i = 0; i < offsets.length; i++) {
            var off = offsets[i]
            var blockPos = new BlockPos(node.pos.getX() + off[0], node.pos.getY() + off[1], node.pos.getZ() + off[2])

            if (!isPassable(blockPos)) continue;

            var expandedNode = new Node(blockPos, node)
            if (this.closeList.find(function (n) n.pos.equals(expandedNode.pos))) continue;

            var aSum = Math.abs(off[0]) + Math.abs(off[1]) + Math.abs(off[2])
            var tentG = !diagonal ? node.gCost + 1 : node.gCost + (aSum == 1 ? 1 : (aSum == 2 ? this.sqrt2 : this.sqrt3))

            var equalNode = this.openList.find(function (n) n.pos.equals(expandedNode.pos));
            var equalIndex = this.openList.indexOf(equalNode)

            if (equalNode && tentG >= equalNode.gCost) continue;

            expandedNode.parent = node
            expandedNode.gCost = tentG
            expandedNode.hCost = heuristic == "Euclidean" ? getDist(blockPos, this.endPos) : (function(a, b) {
                return Math.abs(a.getX() - b.getX()) + Math.abs(a.getY() - b.getY()) + Math.abs(a.getZ() - b.getZ())
            })(blockPos, this.endPos)
            expandedNode.tCost = expandedNode.gCost + expandedNode.hCost

            if (equalIndex !== -1) {
                this.openList.splice(equalIndex, 1, expandedNode)
            } else this.openList.push(expandedNode);
        }
    }

    this.getCheapestNode = function() {
        var lCost = Number.MAX_VALUE
        var minIndex = 0
        for (var i = 0; i < this.openList.length; i++) {
            var cNode = this.openList[i]
            if (cNode.tCost < lCost) {
                lCost = cNode.tCost
                minIndex = i
            }
        }
        return this.openList.splice(minIndex, 1)[0]
    }

    this.compute = function (loops, heuristic, diagonal) {
        if (isSurrounded(this.startPos) || isSurrounded(this.endPos)) return this.path

        if (!isPassable(this.endPos)) {
            var alternativePos = getAnySurroungingPos(this.endPos)
            if (!alternativePos) return this.path
            this.set(alternativePos);
        }

        while (loops-- > 0 && this.openList.length) {
            var currentNode = this.getCheapestNode()

            if (currentNode.pos.equals(this.endNode.pos)) {
                var temp = currentNode
                while (temp) {
                    this.path.push(temp.pos)
                    temp = temp.parent
                }
                return this.path.reverse();
            }

            this.closeList.push(currentNode)

            this.expandNode(currentNode, heuristic, diagonal)
        }
        return this.path
    }
}

var pathAlgorithm = new PathAlgorithm();

script.registerModule({
    name: "MatrixTeleportHit",
    category: "Fun",
    description: "Rudimentary TeleportHitModule",
    settings: MatrixTeleportHitValues,
}, function (module) {
    module.on("update", function () {
        module.tag = range.get()
        targetEntity = rayTrace(range.get())

        if (targetEntity && PlayerExtensionKt.getDistanceToEntityBox(targetEntity, mc.thePlayer) < 10) return;

        if (mc.gameSettings.keyBindAttack.pressed && tpHitTimer.hasTimePassed(200)) {
            packetPositions = []

            if (targetEntity) {
                pathAlgorithm.set(new BlockPos(targetEntity))
                path = pathAlgorithm.compute(loops.get(), heuristic.get(), diagonalSearch.get())

                if (path.length) {
                    if (startJump.get() && mc.thePlayer.onGround) mc.thePlayer.motionY = startJumpMotion.get();

                    for (var i = 0; i <= path.length - packetIntervall.get(); i += packetIntervall.get()) {
                        var pos = path[i]
                        packetPositions.push(pos)
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(pos.getX(), pos.getY(), pos.getZ(), onGround.get()), packetEvent.get())
                    }

                    if (path.length % packetIntervall.get() != 0) { //this might prevent range flags if packet intervall is > 3 && {packetPositions}\this.endPos
                        packetPositions.push(pathAlgorithm.endPos)
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(pathAlgorithm.endPos.getX(), pathAlgorithm.endPos.getY(), pathAlgorithm.endPos.getZ(), onGround.get()), packetEvent.get());
                    }

                    if (rotation.get()) {
                        var rot = RotationUtils.faceTrajectory(targetEntity, false, 0.0, 0.0, 0.0);
                        rot && RotationUtils.setTargetRotation(rot, new RotationSettings(ModuleManager.getModule("KillAura"), function () true), 1)
                    }
                    mc.playerController.attackEntity(mc.thePlayer, targetEntity)

                    if (retreat.get()) PacketUtils.sendPacket(new C04PacketPlayerPosition(pathAlgorithm.startPos.getX(), pathAlgorithm.startPos.getY(), pathAlgorithm.startPos.getZ(), onGround.get()), packetEvent.get())
                }
            }
            tpHitTimer.reset()
        }
        if (tpHitTimer.hasTimePassed(visibleTime.get())) packetPositions = [];
    })
    module.on("render3D", function () {
        if (renderPacketPositions.get() && packetPositions.length) {
            for (var i = 0; i < packetPositions.length; i++) {
                RenderUtils.drawBlockBox(packetPositions[i], new Color(colorR.get(), colorG.get(), colorB.get()), false)
            }
        }
    })
    module.on("render2D", function () {
        if (oldTarget != targetEntity) {
            ds = 0;
            oldTarget = targetEntity
        }

        var screenWidth = new ScaledResolution(mc).getScaledWidth(), screenHeight = new ScaledResolution(mc).getScaledHeight();

        if (renderTargetHUD.get() && targetEntity) {
            ds = animate(40, ds, 0.25)
            GuiInventory.drawEntityOnScreen(screenWidth / 2 - 30, screenHeight / 2 + 45, ds, 0, 0, targetEntity)

            var dist = PlayerExtensionKt.getDistanceToEntityBox(targetEntity, mc.thePlayer)
            mcFont.drawString(dist.toFixed(2) + " m", screenWidth / 2 - 47, screenHeight / 2 + 50, dist < 10 ? 0xFF0000 : 0xFFFFFF)
        }
    })
    module.on("disable", function () {
        path = []
        packetPositions = []
    })
});