///api_version=2
(script = registerScript({
    name: "AutoInsultReloaded",
    version: "1.0.5",
    authors: ["FaaatPotato"]
})).import("Core.lib");

Core.updateURL = "https://raw.githubusercontent.com/FaaatPotato/Scripts/main/AutoInsultReloaded.js"

ChatComponentText = Java.type("net.minecraft.util.ChatComponentText");
ClickEvent = Java.type("net.minecraft.event.ClickEvent");
HoverEvent = Java.type("net.minecraft.event.HoverEvent");

insultDir = new File(LiquidBounce.fileManager.dir, "AutoInsultRL")
insultDir.mkdir()

var internalInsults = [
    "lmao",
    "your performance was miserable :)",
    "idk bro not your best day huh",
    "I, personally, would just surrender.",
    "I would say absolute exquisite beginner",
    "that game isn't made for you...",
    "people as bad as you shouldn't play this game.",
    "listen, go to bed. I already sent you to sleep.",
    "buddy, try harder next time ig.",
    "seems like you lost. Must have happened before. Maybe quit?",
    "let me give you a little.. live lesson. Live fucks you like I did.",
    "you should've prayed. Not to survive me but to die against someone else.",
    "still can't do nothing against cheats",
    "you got absolutely beat up my g. Must be fun playing legit :)",
    "no words for such miserable performance",
    "you couldn't look more foolish",
    "get clowned",
    ":skull:",
]
var sentLink = false, clientChat, prefix = "§8§l[§c§lAutoInsultRL§8§l]§7 ",
    formattedInsult, insult, externalFile, userContent, currentTarget,
    sendQueue = [], sentInsult = false, queueTimer = new MSTimer(), capturedContent = [],
    insultedPlayers = [];

insultValues = [
    sectionMode = value.createBoolean("§6§lGeneralConfiguration§f", true, [
        detectionMode = value.createList("DetectionMode", ["PacketChat", "Classic"], "PacketChat", {
            "PacketChat": [
                detectionPhrase = new (Java.extend(TextValue)) ("Scan", "killed by") {
                    onChanged: function(o, n) {
                        lookFor = !n.includes(",") ? [n] : n.split(",").unique().filter(function (entry) entry != "")
                        detectionPhrase.set(lookFor.toString())
                        clearChat();
                        if (n.toLowerCase() == "reset") detectionPhrase.set("killed by");
                        addCustomChat(prefix+"Module will search for '§a§l"+lookFor.join("§7' or '§a§l")+"§7' + §a§l"+mc.thePlayer.getName());
                    }
                },
            ]
        }),
        chatParameter = value.createText("Parameter", "!"),
        value.createSpacer(),
        customTargetPos = value.createBoolean("TargetNotFound?", false, [
            customPos = new (Java.extend(IntegerValue)) ("PositionInChat", 1, 1, 10) {
                onChanged: function(o, n) {
                    if (capturedContent.length) {
                        var updateLegnth = new Reflector(customPos)
                        updateLegnth.maximum = capturedContent.length
                    }
                    if (n > capturedContent.length) {
                        addCustomChat(prefix+"Last captured message with your seatch term doesn't contain so many elements!")
                        customPos.set(1)
                    }
                }
            }
        ]),
        value.createSpacer(),
        insultMode = value.createList("InsultMode", ["Internal", "Custom"], "Internal", {
            "Custom": [
                userFileName = new (Java.extend(ListValue)) ("File", current = Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]), current[0]) {
                    onChanged: function(o, n) {
                        var updateReflector = new Reflector(userFileName)
                        var overwrite = Java.from(insultDir.listFiles()).length ? Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]) : ["", "Refresh"]
                        updateReflector.values = Java.to(overwrite, "java.lang.String[]")

                        if (n == "Refresh" || !n) {
                            userFileName.set(current[0])
                        } else if (n && !Java.from(insultDir.listFiles()).length) {
                            addCustomChat(prefix+"Couln't find file to read! Create one with '§c§l.rlc§7'", null, null);
                        } else if (n) {
                            clearChat()
                            addCustomChat(prefix+"Checked file format? §a§l[CLICK]", "https://github.com/FaaatPotato/Scripts/blob/main/Tutorials/AutoInsultReloaded", "§a§lClick to view tutorial!")
                            playSound("random.successful_hit")
                        }
                    }
                }
            ]
        }),
        value.createSpacer(),
    ]),
    sectionLinks = value.createBoolean("§6§lFormatConfiguration§f", false, [
        formatMode = value.createList("LinkFormatMode", ["§c§lNoFormatting§f", "SurroundDots", "ReplaceDots", "NoDots"], "NoFormatting", {
            "SurroundDots": surroundWith = value.createList("SurroundWith", ["(.)", "{.}", "[.]", "|.|", "<.>", "*.*", "'.'", "!.!"], "(.)"),
            "ReplaceDots": replaceWith = value.createList("ReplaceWith", ["!", "+", "-", "^", "`", "'", "°", "?", "~", "#", "<", "=", ">", "$", "&", "%", "²", "³", "*", "|"], "'")
        }),
        clickableLink = value.createBoolean("ClickableLink", true),
        value.createSpacer()
    ]),
    sectionQueue = value.createBoolean("§6§lQueueConfiguration§f", false, [
        useQueue = value.createBoolean("UseInsultQueue", true, [
            queueDelay = value.createInteger("Delay(MS)", 3000, 1000, 10000),
            noPlayers = value.createBoolean("NoPlayersAllowed", false, [
                noPlayerRange = value.createInteger("NoPlayerRange", 20, 5, 30)
            ])
        ])
    ])
]

function isLink(message) {
    if (message.includes("http://") || message.includes("https://") || message.includes("www")) {
        return true;
    } else return false;
}

function checkSent() {
    var extractedMessage = chatContent.slice(chatContent.indexOf(clientChat.split(" ")[0]), chatContent.length)
    if (extractedMessage == clientChat) return true; else return false;
}

function extractLink(message) {
    var link = message.split(" ").filter(function (part) isLink(part))
    return link;
}

function addCustomChat(message, URL, hoverText) {
    if (hoverText === undefined) hoverText = null; if (URL === undefined || URL === null) URL = null;
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

function sendInsult(targetName) {
    userContent = Java.from(insultDir.listFiles()).length ? Java.from(FileUtils.readLines(new File(insultDir, userFileName.get()))) : null
    insult = insultMode.get() == "Internal" || !userContent ? internalInsults.random() : userContent.random()
    queueTarget = targetName

    sentInsult = true
    if (!isLink(insult)) { //&& (isLink(insult) && formatMode.get() == "NoFormatting")
        formattedInsult = insult
    } else {
        sentLink = true;
        switch(formatMode.get()) {
            case "NoFormatting": formattedInsult = insult; break;
            case "SurroundDots": formattedInsult = insult.replace(/[.]/g, surroundWith.get()); break;
            case "ReplaceDots": formattedInsult = insult.replace(/[.]/g, replaceWith.get()); break;
            case "NoDots": formattedInsult = insult.replace(/[.]/g, "")
        }
    }
    mc.thePlayer.sendChatMessage(chatParameter.get()+" "+targetName+" "+formattedInsult)
    return;
}

var lookFor = !detectionPhrase.get().includes(",") ? [detectionPhrase.get()] : detectionPhrase.split(",").unique().filter(function (entry) entry != "");
//need to define it here since it only gets defined and updated onChanged

RLInsult = {
    name: "AutoInsultReloaded",
    category: "Fun",
    description: "Automatically insults your (dead) opponents",
    values: insultValues,

    onPacket: function(e) {
        var packet = e.getPacket()
        if (packet instanceof C01PacketChatMessage) {
            clientChat = packet.getMessage()
        }
        if (packet instanceof S02PacketChat) {
            chatContent = packet.getChatComponent().getUnformattedText()
            targetPosChat = chatContent.split(" ")[customPos.get() - 1];
            target = targetPosChat <= chatContent.split(" ").length && customTargetPos.get() ? targetPosChat : chatContent.split(" ")[0]

            if (lookFor.some(function (phrase) chatContent.includes(phrase+" "+mc.thePlayer.getName())) && detectionMode.get() == "PacketChat") {
                sendInsult(target)
                capturedContent = chatContent.split(" ")
            } else if (detectionMode.get() == "PacketChat" && sentInsult) {
                if (checkSent() && clickableLink.get() && sentLink) {
                    e.cancelEvent()
                    addCustomChat(packet.getChatComponent().getFormattedText()+" §a§l[OPEN]", extractLink(insult), "§a§lClick me!")
                    sentLink = false;
                }
                if (!checkSent() && useQueue.get() && !insultedPlayers.includes(queueTarget)) {
                    sendQueue.push(queueTarget)
                    queueTimer.reset()
                } else insultedPlayers.remove(queueTarget);
                sentInsult = false;
            }
        }
    },
    onAttack: function(e) {
        if (e.getTargetEntity() instanceof EntityPlayer) currentTarget = e.getTargetEntity()
    },
    onUpdate: function() {
        if (currentTarget != null && detectionMode.get() == "Classic") {
            if (currentTarget.isDead || currentTarget.getHealth <= 0 && !mc.thePlayer.getHealth <= 0 && !mc.thePlayer.isDead) {
                sendInsult(currentTarget.getName())
                currentTarget = null
                return;
            }
        }
        if (useQueue.get() && queueTimer.hasTimePassed(queueDelay.get()) && sendQueue.length) {
            if (noPlayers.get() && getTargetsInRange(noPlayerRange.get(), EntityPlayer).length) return;
            sendInsult(sendQueue.last())
            insultedPlayers.push(sendQueue.last()), sendQueue.remove(sendQueue.last())
            queueTimer.reset()
            return;
        }
    },
    onWorld: function() {
        currentTarget = null, sendQueue = [], insultedPlayers = [];
    }
}

RLCreate = {
    name: "RLCreate",
    aliases: ["rlc", "rlcreate"],
    version: script.scriptVersion,

    handler: {
        downloadinsults: function(rawlink, fileName) {
            var fileToDownload = new File(insultDir, fileName)
            if (!fileToDownload.exists()) {
                HttpUtils.download(new URL(rawlink), fileToDownload)
                addCustomChat(prefix+"Downloaded file! '§a§l"+fileName+"§7'")
            } else addCustomChat(prefix+"File already exists! '§c§l"+fileName+"§7'")
        },
        addlineto: function(fileName, content) {
            var fileToAppend = new File(insultDir, fileName)
            if (fileToAppend.exists()) addCustomChat(prefix+"Added to file! '§a§l"+fileName+"§7'", null, null); else addCustomChat(prefix+"Created and added to file! '§a§l"+fileName+"§7'", null, null);
            FileUtils.writeStringToFile(fileToAppend, content+"\n", true)
        },
        del: function(fileName) {
            var fileToDelete = new File(insultDir, fileName)
            if (fileToDelete.exists()) {
                fileToDelete.delete()
                addCustomChat(prefix+"Deleted file! '§c§l"+fileName+"§7'")
            } else addCustomChat(prefix+"Couldn't find file! '§c§l"+fileName+"§7'", null, null)
        },
        delall: function() {
            var files = Java.from(insultDir.listFiles())
            if (files.length) {
                files.map(function (file) file.delete())
                addCustomChat(prefix+"Deleted all files! §a§l[Hover]", null, "§a§l"+files.map(function (file) file.getName()).join("§a§l, "))
            } else addCustomChat(prefix+"No files found! '§c§l"+insultDir+"§7'")
        },
        folder: function() {
            openFolder(insultDir)
        }
    },
    onTabComplete: function(args) {
        if (args[0] == "del" || args[0] == "addlineto" && args.length < 3) return Java.from(insultDir.listFiles()).map(function (file) file.getName());
    }
}

command = [RLCreate]
module = [RLInsult]
