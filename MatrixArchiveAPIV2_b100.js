///api_version=2
(script = registerScript({
    name: "MatrixArchive",
    version: "1.0.0",
    authors: ["FaaatPotato", "CzechHek", "Du_Couscous", "AlienGurke", "ClientQUI"]
}));

/*
A few words to clarify...
  - Firstly, this script is an archive for old modules as there will be no development of new bypasses
  - Utility modules e.g. AutoInsultReloaded have recieved small updates in this script as they are still functional
  - Other modules will not work but may have educational purpose
  - I tried to credit everyone in authors properly
  - Lastly, small changes have been made to make this script compatible with the b100 legacy build
  - Enjoy!
*/

//To do: add FlyModes: TNTBlinkDamageFly (+max packets value), flag longjump by shurpe, blink longjump (+max packets value), janitor work

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
EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
EntityTNTPrimed = Java.type("net.minecraft.entity.item.EntityTNTPrimed")
Entity = Java.type("net.minecraft.entity.Entity")
File = Java.type("java.io.File")
FileManager = Java.type("net.ccbluex.liquidbounce.file.FileManager").INSTANCE;
FileUtils = org.apache.commons.io.FileUtils;
MSTimer = Java.type("net.ccbluex.liquidbounce.utils.timing.MSTimer");
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
RotationUtils = Java.type("net.ccbluex.liquidbounce.utils.rotation.RotationUtils").INSTANCE
PlayerExtensionKt = Java.type("net.ccbluex.liquidbounce.utils.extensions.PlayerExtensionKt")
EntityUtils = Java.type("net.ccbluex.liquidbounce.utils.attack.EntityUtils").INSTANCE
Potion = Java.type("net.minecraft.potion.Potion")
DamageSource = Java.type("net.minecraft.util.DamageSource")
Vec3 = Java.type("net.minecraft.util.Vec3")
BlockSnow = Java.type("net.minecraft.block.BlockSnow")
BlockLiquid = Java.type("net.minecraft.block.BlockLiquid")

/*------------------*/
/*  PROPERTY FUNCS  */
/*------------------*/

//Core.lib (the goat) port

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
        "people as bad as you should not play this game.",
        "listen, go to bed. I already sent you to sleep.",
        "buddy, try harder next time ig.",
        "seems like you lost. Must have happened before. Maybe quit?",
        "let me give you a little.. life lesson. Life fucks you like I did.",
        "you should've prayed. Not to survive me but to die against someone else.",
        "still can't do nothing against cheats",
        "you got absolutely beat up my g. Must be fun playing legit :)",
        "no words for such miserable performance",
        "you couldn't look more foolish",
        "get clowned",
        ":skull:"
    ], sentInsult = false, sentLink = false, lastTarget, queueTimer = new MSTimer(), sendQueue = [],
    breakDamage = 0, blockHitDelay = 0, breakingBlock, lastPlaced = null, totalFallDist = 0, cancelC04 = false,
    boosted = false, tryBoost = 0, simulateStartY, mcFont = Fonts.getFonts()[0], wasRiding = false,
    last = null, clientChatContent = "", cIndex = null, glideMotionTicks = 0, glideTicks = 0, isBlock = false,
    selectTimer = new MSTimer(), renderSelectedTimer = new MSTimer(), renderSelected = false, lookPos = null,
    destinationPos = null, sentPackets = 0, attemptingTeleport = false, lookingAt = null, isMoving = false,
    formattedInsult = "", replacedInsult = "", StrafeModule = ModuleManager.getModule("Strafe"), strafeStrengthValue,
    KillAuraModule = ModuleManager.getModule("KillAura"), tntFly = false, tntStartBoost = false, returnToLastOnGroundPos = null,
    SprintModule = ModuleManager.getModule("Sprint"), NoFallModule = ModuleManager.getModule("NoFall");

/*------------------*/
/* GLOBAL FUNCTIONS */
/*------------------*/

function isMovingHorizontally(entity) entity && entity != mc.thePlayer ? entity.lastTickPosX != entity.posX || entity.lastTickPosZ != entity.posZ : !!(mc.thePlayer.movementInput.moveForward || mc.thePlayer.movementInput.moveStrafe);

function isMovingVertically(entity) entity && entity != mc.thePlayer ? entity.lastTickPosY != entity.posY : mc.thePlayer.movementInput.jump || mc.thePlayer.movementInput.sneak;

function entityIsMoving(entity) {
    return isMovingHorizontally(entity) || isMovingVertically(entity);
}

function clearChat() mc.ingameGUI.getChatGUI().clearChatMessages();

function rand(min /*[min, max]*/, max) (Array.isArray(min) && (min = min[0], max = min[1]), Math.random() * (max - min) + min);

function addMessage(message, URL, hoverText) {
    URL || null; hoverText || null;
    var comp = new ChatComponentText(message)
    if (URL) {
        comp.getChatStyle().setChatClickEvent(new ClickEvent(ClickEvent.Action.OPEN_URL, URL))
        if (hoverText) {
            comp.getChatStyle().setChatHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ChatComponentText(hoverText)))
        }
    } else if (!URL && hoverText) {
        comp.getChatStyle().setChatHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ChatComponentText(hoverText)))
    }
    mc.thePlayer.addChatMessage(comp)
}

function getBlock(blockPos) mc.theWorld.getBlockState(blockPos).getBlock();

function getBlockName(blockPos) getBlock(blockPos).getLocalizedName();

function getFacing(state) state.getProperties().get(BlockDirectional.FACING);

function getBlockState(blockOrPos) blockOrPos instanceof BlockPos ? mc.theWorld.getBlockState(blockOrPos) : blockOrPos.getBlockState();

function getTargetsInRange(range, entityType) Java.from(mc.theWorld.loadedEntityList).filter(function (e) e != mc.thePlayer && ((entityType ? e instanceof entityType : EntityUtils.isSelected(e, true)) && (!range || PlayerExtensionKt.getDistanceToEntityBox(e, mc.thePlayer) <= range)));

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
                addMessage(prefix + "Module will search for '§a§l" + temp.join("§7' or '§a§l") + "§7' + §a§l" + mc.thePlayer.getName())
            }
        },
        isSupported: function () detectionMode.get() == "PacketChat" && header1.get()
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
                    for each (var part in lastKillMessage) {
                        var comp = new ChatComponentText(prefix+part)
                        comp.getChatStyle().setChatClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, part))
                        comp.getChatStyle().setChatHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ChatComponentText("§aClick to select as target name position.")))
                        mc.thePlayer.addChatMessage(comp)
                    }
                    addMessage("")
                    selectingPhrase = true
                } else {
                    selectingPhrase = false;
                    addMessage(prefix+"No message to select target from.")
                    addMessage(prefix+"Default position will be used.")
                    customIndex.set(false)
                }
            } else if (lastKillMessage.length) {
                addMessage(prefix+"Default position will be used.")
                selectingPhrase = false
            }
        },
        isSupported: function () detectionMode.get() == "PacketChat" && header1.get()
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
        values: customF = Java.from(insultDir.listFiles()).map(function (file) file.getName()).filter(function (name) name != "customLetters.txt"),
        default: customF[0],
        onChange: function (o, n) {
            if (n && !Java.from(insultDir.listFiles()).length) {
                addMessage(prefix+"Couldn't find file to read!");
            }
        },
        isSupported: function () header2.get() && insultMode.get() == "Custom"
    }),
    printFileValue: printFile = Setting.boolean({
        name: "PrintFile",
        default: false,
        onChange: function (o, n) {
            if (n && customF.length) {
                var fileContent = Java.from(FileUtils.readLines(new File(insultDir, customFile.get()), StandardCharsets.UTF_8))
                addMessage("")
                for (var i = 0; i < fileContent.length; i++) {
                    addMessage(prefix + fileContent[i])
                }
                addMessage("")
                printFile.set(false)
            }
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
        values: customA = Java.from(FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8)).filter(function (e) e.length == 26),
        default: customA[0],
        isSupported: function() header3.get() && useCustomLetters.get()
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
        name: "SendDelay [s]",
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

function containsLink(message) message.contains("http://") || message.contains("www.") || message.contains("https://");

function extractLink(message) message.split(" ").filter(function (part) containsLink(part));

function shouldReplaceLetter(lIndex, message) {
    if (!ignoreLink.get()) return true;

    var splitMessage = message.split(" ")

    for (var i = 0; i < splitMessage.length; i++) {
        if (containsLink(splitMessage[i])) {
            var minIndex = message.indexOf(splitMessage[i])
            var maxIndex = message.indexOf(splitMessage[i]) + splitMessage[i].length - 1

            if (lIndex >= minIndex && lIndex <= maxIndex) return false
        }
    }
    return true
}

function sendInsult(targetName) {
    userContent = Java.from(insultDir.listFiles()).length && customFile.get() ? Java.from(FileUtils.readLines(new File(insultDir, customFile.get()), StandardCharsets.UTF_8)) : null
    insult = insultMode.get() == "Internal" || !userContent ? internalInsults.random() : userContent.random()
    lastTarget = targetName

    sentInsult = true
    if (!containsLink(insult) || linkFormat.get() == "NoFormatting") {
        formattedInsult = insult
    } else {
        var splitInsult = insult.split(" ")
        var format = null;
        for (var i = 0; i < splitInsult.length; i++) { //could generally implement replacing x pattern with x2 str instead of just "."
            if (containsLink(splitInsult[i])) {
                switch (linkFormat.get()) {
                    case "SurroundDots": format = surroundWith.get(); break;
                    case "ReplaceDots": format = replaceWith.get(); break;
                    case "NoDots": format = "";
                    default: format = null;
                }
            }
            if (format != null) { //check for format.length instead of == null?? always typeof String if set to "" initially lol
                var formattedLink = splitInsult[i].replace(/[.]/g, format) //allow linkcount > 1 / insult and formatting exclusive to str
                splitInsult.splice(i, 1, formattedLink)
            }
        }
        formattedInsult = splitInsult.join(" ")
        sentLink = true;
    }
    if (useCustomLetters.get()) {
        var customAlphabet = FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8)[FileUtils.readLines(customLettersFile, StandardCharsets.UTF_8).indexOf(customLetters.get())]
        for (i = 0; i < formattedInsult.length; i++) {
            var letterIndex = "abcdefghijklmnopqrstuvwxyz".indexOf(formattedInsult[i].toLowerCase())
            if (letterIndex != -1 && shouldReplaceLetter(i, formattedInsult)) {
                replacedInsult += customAlphabet[letterIndex]
            } else replacedInsult += formattedInsult[i];
        }
    }
    mc.thePlayer.sendChatMessage(chatPrefix.get() + " " + targetName + " " + (useCustomLetters.get() ? replacedInsult : formattedInsult))
    formattedInsult = "", replacedInsult = ""
}

script.registerModule({
    name: "AutoInsultReloaded",
    category: "Fun",
    description: "Highly customizable AutoInsult with alternative kill detection",
    settings: AutoInsultValues,
 }, function (module) {
    module.on("packet", function(e) {
        var packet = e.getPacket()

        if (packet instanceof C01PacketChatMessage) {
            clientChatContent = packet.getMessage()
            if (selectingPhrase && lastKillMessage.indexOf(clientChatContent) != -1) {
                cIndex = lastKillMessage.indexOf(clientChatContent)
                e.cancelEvent()
                clearChat()
                addMessage(prefix + "AutoInsultReloaded will search at the selected position for a target name.")
                selectingPhrase = false;
            }
        }
        if (packet instanceof S02PacketChat && detectionMode.get() == "PacketChat") {
            var serverChatContent = packet.getChatComponent().getUnformattedText()
            var serverContentArray = serverChatContent.split(" ")
            var target = customIndex.get() ? serverContentArray[cIndex] : serverContentArray[0]

            var scanPhrases = detectionPhrase.get().split(",").unique().filter(Boolean)

            if (scanPhrases.some(function (phrase) serverChatContent.contains(phrase + " " + mc.thePlayer.getName()))) {
                sendInsult(target)
                lastKillMessage = serverContentArray
            } else if (sentInsult) {
                if ([formattedInsult, replacedInsult].some(function (ins) serverChatContent.contains(ins))) {
                    if (hyperLink.get() && sentLink) { //only supports 1 link/message <-> anything else doesnt make sense anyways
                        e.cancelEvent()
                        addMessage(packet.getChatComponent().getFormattedText() + " §a§l[OPEN]", extractLink(insult)[0], "§a§lClick me!")
                        sentLink = false;
                    }
                } else {
                    if (!sendQueue.includes(lastTarget) && useQueue.get()) {
                        sendQueue.push(lastTarget)
                        queueTimer.reset()
                    }
                }
                sentInsult = false;
            }
        }
        if (queueTimer.hasTimePassed(sendDelay.get() * 1000) && sendQueue.length) {
            last = sendPriority.get() == "QUEUE" ? sendQueue.shift() : sendQueue.pop();
            sendInsult(last)
        } if (sendQueue.includes(last)) sendQueue.splice(sendQueue.indexOf(last), 1); //only try once, cheap way -> shouldnt get pushed in queue
    });
    module.on("attack", function(e) {
        if (e.getTargetEntity() instanceof EntityPlayer) {
            currentTarget = e.getTargetEntity();
        }
    });
    module.on("update", function () {
        module.tag = detectionMode.get()
        if (currentTarget && detectionMode.get() == "Classic") {
            if (currentTarget.isDead || currentTarget.getHealth <= 0 && !mc.thePlayer.getHealth <= 0 && !mc.thePlayer.isDead && currentTarget.getLastAttacker() == mc.thePlayer && mc.thePlayer) { //Issue: sends Insult if target is out of renderdist
                sendInsult(currentTarget.getName())
                currentTarget = null
                return;
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

function breakBlock(blockPos, range, swing) {
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
    description: "Fucker module exploiting insufficient Matrix fucker checks",
    settings: MatrixFuckerValues
}, function (module) {
    module.on("update", function () {
        module.tag = module.settings.range.get().toFixed(2)
        if (blockHitDelay > 0) return blockHitDelay--;
        if (breakingBlock) return breakBlock(breakingBlock, module.settings.range.get(), module.settings.swingItem.get());
        var bedPos = getClosestBedPos(module.settings.range.get())
        if (!bedPos) return;

        breakBlock(getBlockToBreak(bedPos, module.settings.range.get()), module.settings.range.get(), module.settings.swingItem.get());
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
        values: ["FakeBlock", "BoatFly", "CancelC04", "S08SimulateSetback", "Glide", "Glide2", "TNTMotion"],
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
    disableOnPercentageValue: disableOnPercentage = Setting.float({
        name: "RemainingHealth [%]",
        min: 0.05,
        max: 0.95,
        default: 0.05,
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
    })
}

function predictFallDamage() {
    var ResistanceEffect = mc.thePlayer.getActivePotionEffect(Potion.resistance),
        baseDamage = totalFallDist - 2, finalDamage = 0, ffLevel = null, protLevel = null,
        JumpBoostEffect = mc.thePlayer.getActivePotionEffect(Potion.jump);

    if (totalFallDist <= 2 || baseDamage < 0 || finalDamage < 0) return 0; //safe fall dist for EntityPlayer = 3, however account for fallDist ~+= 1 onDisable

    var footSlot = mc.thePlayer.getCurrentArmor(0)

    if (footSlot && footSlot.isItemEnchanted()) {
        var enchantmentList = [], eTagList = footSlot.getEnchantmentTagList();

        for (var i = 0; i < eTagList.tagCount(); i++) {
            var tag = eTagList.getCompoundTagAt(i)
            var tagId = tag.getTag("id").toString()
            var tagLevel = tag.getTag("lvl").toString()
            enchantmentList.push([parseInt(tagId.substring(0, tagId.length - 1)), parseInt(tagLevel.substring(0, tagLevel.length - 1))])
        }
        for (var j = 0; j < enchantmentList.length; j++) {
            if (enchantmentList[j][0] == 2) ffLevel = enchantmentList[j][1];
            else if (enchantmentList[j][0] == 0) protLevel = enchantmentList[j][1];
            else continue;
        }
    }

    if (ffLevel && !protLevel) {
        finalDamage = baseDamage * (1 - ((12 * ffLevel) / 100))
    } else if (protLevel && !ffLevel) {
        finalDamage = baseDamage * (1 - ((4 * protLevel) / 100))
    } else if (protLevel && ffLevel) {
        var ffRed = (12 * ffLevel) / 100;
        var protRed = (4 * protLevel) / 100
        finalDamage = baseDamage * (1 - ffRed) * (1 - protRed)
    } else if (!protLevel && !ffLevel || !footSlot) finalDamage = baseDamage;

    if (JumpBoostEffect) finalDamage -= JumpBoostEffect.getAmplifier() + 1;

    if (ResistanceEffect && ResistanceEffect.getAmplifier() <= 3) {
        var resLevel = ResistanceEffect.getAmplifier() + 1
        var resRed = 1 - (0.2 * resLevel)
        finalDamage = finalDamage * resRed;
    }

    return Math.ceil(finalDamage);
}

function canRecieveFallDMG() {
    var ResistanceEffect = mc.thePlayer.getActivePotionEffect(Potion.resistance)
    if ((ResistanceEffect && ResistanceEffect.getAmplifier() >= 4) || NoFallModule.getState() || mc.thePlayer.isSpectator() || mc.thePlayer.isEntityInvulnerable(DamageSource.fall) || mc.thePlayer.capabilities.isCreativeMode || mc.thePlayer.capabilities.disableDamage) return false;
    return true
}

function getRelativeFallDMG() predictFallDamage() / mc.thePlayer.getHealth();

script.registerModule({
    name: "MatrixFly",
    category: "Fun",
    description: "Module with Matrix Fly bypasses",
    settings: MatrixFlyValues,
}, function (module) {
    module.on("enable", function () {
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
                    if (canRecieveFallDMG() && disableOn.get() && (1 - getRelativeFallDMG()) <= disableOnPercentage.get()) {
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
        }
    });
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
        if (flyMode.get() == "TNTMotion" && packet instanceof S27PacketExplosion && getTargetsInRange(8, EntityTNTPrimed).length) {
            tntFly = true
            if (mc.thePlayer.onGround) mc.thePlayer.jump();
        }
    });
    module.on("render2D", function () {
        if (!renderAirTime.get() || flyMode.get() != "CancelC04" || cancelMode.get() != "Normal" || !canRecieveFallDMG() || mc.thePlayer.onGround) return;

        var percentage = getRelativeFallDMG() * 100,
            renderDMG = getRelativeFallDMG() < 1 ? getRelativeFallDMG() : 1

        Gui.drawRect(470, 280, 340, 343, new Color(20, 20, 20).getRGB());
        Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
        if (percentage < 100) {
            mcFont.drawString("LANDING SURVIVABLE", 346, 286, 0x11ff00)
        } else mcFont.drawString("YOU WILL DIE", 346, 286, 0xff0000)

        Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
        mcFont.drawString("Spent ~" + percentage.toFixed(2) + "%", 345, 304, 0xFFFFFF);
        mcFont.drawString("OF MAX AIR TIME", 345, 320, 0xFFFFFF);

        Gui.drawRect(467, 335, 343, 340, new Color(50, 50, 50).getRGB());
        Gui.drawRect(343, 335, 467 + 124 * renderDMG - 124, 340, Color.HSBtoRGB(renderDMG / 5, 1.0, 1.0) | 0xFF0000);
    })
    module.on("world", function () {
        if (flyMode.get() == "S08SimulateSetback") ModuleManager.getModule("MatrixFly").setState(false) //prevent infinite loading screen
    })
    module.on("disable", function () {
        if (lastPlaced) mc.theWorld.setBlockToAir(lastPlaced);
        mc.thePlayer.fallDistance = totalFallDist //allow NoFall MLG to catch fall
        mc.timer.timerSpeed = 1;
        tryBoost = 0;
        wasRiding = false
        boosted = false
        tntFly = false
        tntStartBoost = false
    })
});

MatrixClickTPValues = {
    mouseButtonValue: mouseButton = Setting.list({
        name: "MouseButton",
        values: ["left", "middle", "right"],
        default: "middle"
    }),
    maxPacketsValue: maxPackets = Setting.integer({
        name: "MaxPackets",
        min: 80,
        max: 200,
        default: 100
    })
}

function buttonPressed() {
    switch (mouseButton.get()) {
        case "left": return mc.gameSettings.keyBindAttack.pressed; break;
        case "middle": return mc.gameSettings.keyBindPickBlock.pressed; break;
        case "right": return mc.gameSettings.keyBindUseItem.pressed; break;
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
        var MatrixTeleportModule = ModuleManager.getModule("MatrixClickTP")
        if (!destinationPos) return
        if (mc.thePlayer.isSpectator()) MatrixTeleportModule.setState(false)

        attemptingTeleport = true
        sentPackets++;
        PacketUtils.sendPacket(new C04PacketPlayerPosition(destinationPos.getX(), destinationPos.getY(), destinationPos.getZ(), true), false)

        if (sentPackets >= maxPackets.get()) {
            addMessage(prefix + "Teleport failed!")
            addMessage(prefix + "Sent §c§l" + sentPackets + " §7packets")
            MatrixTeleportModule.setState(false)
        } else if (mc.thePlayer.posX == destinationPos.getX() && mc.thePlayer.posZ == destinationPos.getZ()) {
            addMessage(prefix + "Teleported successfully with §c§l" + sentPackets + " §7packets!")
            MatrixTeleportModule.setState(false)
        }
    })
    module.on("render3D", function () {
        lookingAt = mc.thePlayer.rayTrace(255, 1)
        if (lookingAt.typeOfHit == "MISS") return;

        lookPos = lookingAt.getBlockPos()

        if (buttonPressed() && selectTimer.hasTimePassed(400) && !attemptingTeleport) {
            destinationPos = lookPos

            renderSelected = true
            attemptingTeleport = true

            selectTimer.reset()
            renderSelectedTimer.reset()
        } if (renderSelectedTimer.hasTimePassed(400)) renderSelected = false;

        if (!renderSelected && !attemptingTeleport) {
            RenderUtils.drawBlockBox(lookPos, Color.GREEN, true)
        } else if (renderSelected) {
            RenderUtils.drawBlockBox(destinationPos, Color.RED, true)
        } else if (attemptingTeleport) {
            RenderUtils.drawBlockBox(destinationPos, Color.ORANGE, true)
        }
    })
    module.on("render2D", function () {
        if (!lookPos) return;

        if (!renderSelected && !attemptingTeleport) {
            Gui.drawRect(470, 280, 340, 335, new Color(20, 20, 20).getRGB());
            Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
            mcFont.drawString("Looking at: (ID: " + Block.getIdFromBlock(getBlock(lookPos)) + ")", 346, 286, 0xFFFFFF);

            Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
            mcFont.drawString(getBlockName(lookPos).toUpperCase(), 345, 305, 0xFFFFFF);
            mcFont.drawString(mouseButton.get() + "-Click to select!", 345, 320, 0xFFFFFF);
        } else if (attemptingTeleport) {
            Gui.drawRect(470, 280, 340, 301, new Color(20, 20, 20).getRGB());
            Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
            mcFont.drawString("§a§lSelected! §a" + destinationPos.getX() + " " + destinationPos.getY() + " " + destinationPos.getZ(), 346, 286, 0xFFFFFF);
        }
    })
    module.on("disable", function () {
        destinationPos = null
        sentPackets = 0
        attemptingTeleport = false
        lookingAt = null
        lookPos = null
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
                if (!mc.gameSettings.keyBindJump.pressed && MovementUtils.isOnGround(0.001)) {
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
    activationModeValue: activationMode = Setting.list({
        name: "ActivationMode",
        values: ["KillAuraRange", "Combat"],
        default: "KillAuraRange",
        isSupported: function () combatStrafe.get()
    }),
    combatStrafeSpeedValue: combatStrafeSpeed = Setting.float({
        name: "StrafeSpeed",
        min: 0.01,
        max: 0.22,
        default: 0.22,
        isSupported: function() combatStrafe.get()
    }),
    spacerid83297Value: spacerid83297 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function () combatStrafe.get()
    }),
    returnLastPosValue: returnLastPos = Setting.boolean({
        name: "ReturnToLastDeathPos",
        default: false
    })
}

script.registerModule({
    name: "MatrixUtility",
    category: "Fun",
    description: "Module with utility modules",
    settings: MatrixUtilityValues,
}, function (module) {
    module.on("update", function () {
        strafeStrengthValue = StrafeModule.getValue("Strength").get()
        killAuraRangeValue = KillAuraModule.getValue("Range").get()
        if (combatStrafe.get()) SprintModule.setState(true);
        if (activationMode.get() == "KillAuraRange" && combatStrafe.get() && (StrafeModule.getState() ? strafeStrengthValue <= combatStrafeSpeed.get() : true) && getTargetsInRange(killAuraRangeValue, EntityPlayer).length && entityIsMoving(mc.thePlayer)) MovementUtils.strafe(combatStrafeSpeed.get());

        if (returnLastPos.get()) {
            if (mc.thePlayer.onGround) returnToLastOnGroundPos = new BlockPos(mc.thePlayer).down(1)
            if (mc.thePlayer.isSpectator() && returnToLastOnGroundPos) {
                PacketUtils.sendPacket(new C04PacketPlayerPosition(returnToLastOnGroundPos.getX(), returnToLastOnGroundPos.getY(), returnToLastOnGroundPos.getZ(), true), false)
            }
        }
    })
    module.on("attack", function (e) {
        var target = e.getTargetEntity()
        if (target && activationMode.get() == "Combat" && combatStrafe.get() && (StrafeModule.getState() ? strafeStrengthValue <= combatStrafeSpeed.get() : true) && PlayerExtensionKt.getDistanceToEntityBox(target, mc.thePlayer) <= killAuraRangeValue && entityIsMoving(mc.thePlayer)) MovementUtils.strafe(combatStrafeSpeed.get());
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
        default: false
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
    var dirVec = mc.thePlayer.getLookVec()
    var originVec = mc.thePlayer.getPositionEyes(1)
    var intersected = []

    var entityList = mc.theWorld.loadedEntityList

    for (var i = 0; i < entityList.length; i++) {
        var entity = entityList[i]
        if (!EntityUtils.isSelected(entity, true)) continue;

        var bb = entity.getEntityBoundingBox().expand(0.1, 0.1, 0.1)

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

function getDist(blockPosA, blockPosB) {
    var a = new Vec3(blockPosA.getX() + 0.5, blockPosA.getY() + 0.5, blockPosA.getZ() + 0.5)
    var b = new Vec3(blockPosB.getX() + 0.5, blockPosB.getY() + 0.5, blockPosB.getZ() + 0.5)
    return a.distanceTo(b)
}

function isPassable(blockPos) {
    var state = mc.theWorld.getBlockState(blockPos)
    var block = state.getBlock()
    if (!block.getCollisionBoundingBox(mc.theWorld, blockPos, state) || mc.theWorld.isAirBlock(blockPos) ||
        block.isLadder(mc.theWorld, blockPos, mc.thePlayer) || block.isPassable(mc.theWorld, blockPos) ||
        block.isFlowerPot() || block == Blocks.snow_layer || block instanceof BlockLiquid) return true; else return false
}

function isReachable(blockPos) {
    var offsets = [[0, -1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [0, 2, 0]]
    for (var i = 0; i < offsets.length; i++) {
        var pos = new BlockPos(blockPos.getX() + offsets[i][0], blockPos.getY() + offsets[i][1], blockPos.getZ() + offsets[i][2])
        if (isPassable(pos)) return true
    }
    return false;
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

    this.set = function(startPos, endPos) {
        this.startPos = startPos
        this.endPos = endPos

        this.startNode = null
        this.endNode = null
        this.openList = []
        this.closeList = []
        this.path = []

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
            expandedNode.hCost = heuristic == "Euclidean" ? getDist(blockPos, this.endPos) : (function(a, b) { //euclidean is really not suited for this. Approximation is enough
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
        if (!isPassable(this.endPos) || !isReachable(this.endPos)) return null
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
        return null;
    }
}

var pathAlgorithm = new PathAlgorithm(), path = [], packetPositions = [], selectedTarget = false, targetPlayer, tpHitTimer = new MSTimer();

script.registerModule({
    name: "MatrixTeleportHit",
    category: "Fun",
    description: "Rudimentary TeleportHitModule",
    settings: MatrixTeleportHitValues,
}, function (module) {
    module.on("update", function () {
        module.tag = range.get()
        if (mc.gameSettings.keyBindAttack.pressed && tpHitTimer.hasTimePassed(200)) {
            targetPlayer = rayTrace(range.get())
            if (PlayerExtensionKt.getDistanceToEntityBox(targetPlayer, mc.thePlayer) <= 10) return;
            selectedTarget = true
            packetPositions = []

            if (targetPlayer) {
                if (startJump.get() && mc.thePlayer.onGround) mc.thePlayer.motionY = startJumpMotion.get();
                pathAlgorithm.set(new BlockPos(mc.thePlayer), new BlockPos(targetPlayer))
                path = pathAlgorithm.compute(loops.get(), heuristic.get(), diagonalSearch.get())

                if (path) {
                    for (var i = 0; i < path.length - packetIntervall.get(); i += packetIntervall.get()) {
                        var pos = path[i]
                        packetPositions.push(pos)
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(pos.getX(), pos.getY(), pos.getZ(), onGround.get()), packetEvent.get())
                    }

                    if (path.length % packetIntervall.get() != 0) {
                        packetPositions.push(pathAlgorithm.endPos)
                        PacketUtils.sendPacket(new C04PacketPlayerPosition(pathAlgorithm.endPos.getX(), pathAlgorithm.endPos.getY(), pathAlgorithm.endPos.getZ(), onGround.get()), packetEvent.get());
                    }
                    mc.playerController.attackEntity(mc.thePlayer, targetPlayer)
                }
            }
            tpHitTimer.reset(), targetPlayer = null;
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
    module.on("disable", function () {
        path = []
        packetPositions = []
    })
});