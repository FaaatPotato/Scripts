///api_version=2
(script = registerScript({
    name: "AutoInsultReloaded",
    version: "1.1.1",
    authors: ["FaaatPotato"]
}));

//core port (more or less)
Object.defineProperty(Array.prototype, "unique", {
    writable: true,
    value: function(overwrite) overwrite ? (this = this.filter(function (v, i, s) s.indexOf(v) === i)) : this.filter(function (v, i, s) s.indexOf(v) === i)
});

Object.defineProperty(Array.prototype, "random", {
    value: function (from, to) this.length > 0 ? this[Math.floor(rand(from || 0, (to + 1) || this.length))] : null
});

Object.defineProperty(Array.prototype, "includes", {
    value: function (element) this.indexOf(element) !== -1
});

function clearChat() {
    mc.ingameGUI.getChatGUI().clearChatMessages();
}

function rand(min /*[min, max]*/, max) (Array.isArray(min) && (min = min[0], max = min[1]), Math.random() * (max - min) + min);

//imports
ChatComponentText = Java.type("net.minecraft.util.ChatComponentText")
ClickEvent = Java.type("net.minecraft.event.ClickEvent")
HoverEvent = Java.type("net.minecraft.event.HoverEvent")
C01PacketChatMessage = Java.type("net.minecraft.network.play.client.C01PacketChatMessage")
S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
S45PacketTitle = Java.type("net.minecraft.network.play.server.S45PacketTitle")
EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
File = Java.type("java.io.File")
FileManager = Java.type("net.ccbluex.liquidbounce.file.FileManager");
FileUtils = org.apache.commons.io.FileUtils;
MSTimer = Java.type("net.ccbluex.liquidbounce.utils.timer.MSTimer");

//vars
var currentTarget = null, prefix = "§8§l[§c§lAutoInsultRL§8§l]§7 ",
    lastKillMessage = [], selectingPhrase = false,
    internalInsults = [
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
        ":skull:"
    ], sentInsult = false, lastTarget, queueTimer = new MSTimer(), sendQueue = [];

insultDir = new File(FileManager.INSTANCE.dir, "AutoInsultRL")
insultDir.mkdir()

list = { //i really miss core tbh, this is ugly af..
    headerValue1: header1 = Setting.boolean({
        name: "§c§lSettings:§7 Detection",
        default: true
    }),
    detectionModeValue: detectionMode = Setting.list({
        name: "DetectionMode",
        values: ["PacketChat", "Classic"],
        default: "PacketChat",
        isSupported: function() {
            return header1.get()
        }
    }),
    detectionPhraseValue: detectionPhrase = Setting.text({
        name: "ScanFor",
        default: "killed by",
        onChanged: function(o, n) {
            lookFor = n.split(",").unique().filter(Boolean)
            detectionPhrase.set(lookFor.toString())
            if (n.toLowerCase() == "reset") {
                detectionPhrase.set("killed by")
            } else addMessage(prefix+"Module will search for '§a§l"+lookFor.join("§7' or '§a§l")+"§7' + §a§l"+mc.thePlayer.getName())
        },
        isSupported: function() {
            return detectionMode.get() == "PacketChat" && header1.get()
        }
    }),
    spacerValue1: spacer1 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() {
            return detectionMode.get() == "PacketChat" && header1.get()
        }
    }),
    customIndexValue: customIndex = Setting.boolean({
        name: "CustomTargetNameIndex",
        default: false,
        isSupported: function() {
            return detectionMode.get() == "PacketChat" && header1.get()
        },
        onChanged: function(o, n) {
            if (n) {
                if (lastKillMessage.length) {
                    addMessage("")
                    addMessage(prefix+"Lastest message containing §7'§a§lkilled by "+mc.thePlayer.getName()+"§7'")
                    addMessage("")
                    for each (var part in lastKillMessage) {
                        var comp = new ChatComponentText(prefix+part)
                        comp.getChatStyle().setChatClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, part))
                        comp.getChatStyle().setChatHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ChatComponentText("§aClick to select as target name index.")))
                        mc.thePlayer.addChatMessage(comp)
                    }
                    addMessage("")
                    selectingPhrase = true
                } else {
                    customIndex.set(false)
                    addMessage(prefix+"No message to select index from.")
                    addMessage(prefix+"Default index §7'§a§l0§7' will be used.")
                }
            } else if (lastKillMessage.length) {
                addMessage(prefix+"Default index '§a§l0§7' will be used.")
            }
        }
    }),
    spacerValue2: spacer2 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() {
            return header1.get()
        }
    }),
    headerValue2: header2 = Setting.boolean({
        name: "§c§lSettings:§7§l General",
        default: true
    }),
    insultModeValue: insultMode = Setting.list({
        name: "InsultSource",
        values: ["Internal", "Custom"],
        default: "Internal",
        isSupported: function() {
            return header2.get()
        }
    }),
    customModeValue: customMode = Setting.list({
        name: "File",
        values: current = Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]),
        default: current[0],
        isSupported: function() {
            return header2.get() && insultMode.get() == "Custom"
        },
        onChanged: function(o, n) {
            var content = Java.from(insultDir.listFiles()).length ? Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]) : ["", "Refresh"]
            customMode.values = Java.to(content, "java.lang.String[]") //doesnt update in realtime, requires reflector --> make one

            if (n.toLowerCase() == "refresh" || !n) {
                customMode.set(current[0])
            } else if (n && !Java.from(insultDir.listFiles()).length) {
                addMessage(prefix+"Couln't find file to read!");
            }
        }
    }),
    chatParameterValue: chatParameter = Setting.text({
        name: "Parameter",
        default: "!",
        isSupported: function() {
            return header2.get()
        }
    }),
    spacerValue3: spacer3 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() {
            return header2.get()
        }
    }),
    headerValue3: header3 = Setting.boolean({
        name: "§c§lSettings:§7 Format",
        default: true
    }),
    hyperLinkValue: hyperLink = Setting.boolean({
        name: "Hyperlink",
        default: true,
        isSupported: function() {
            return header3.get()
        }
    }),
    linkFormatValue: linkFormat = Setting.list({
        name: "LinkFormat",
        values: ["NoFormatting", "SurroundDots", "ReplaceDots", "NoDots"],
        default: "NoFormatting",
        isSupported: function() {
            return header3.get() && hyperLink.get()
        }
    }),
    surroundWithValue: surroundWith = Setting.text({
        name: "SurroundWith",
        default: "(.)",
        isSupported: function() {
            return linkFormat.get() == "SurroundDots" && header3.get() && hyperLink.get()
        }
    }),
    replaceWithValue: replaceWith = Setting.text({
        name: "ReplaceWith",
        default: "'",
        isSupported: function() {
            return linkFormat.get() == "ReplaceDots" && header3.get() && hyperLink.get()
        }
    }),
    spacerValue6: spacer6 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() {
            return header3.get() && hyperLink.get()
        }
    }),
    useCustomLettersValue: useCustomLetters = Setting.boolean({
        name: "CustomAlphabet",
        default: false,
        isSupported: function() {
            return header3.get()
        }
    }),
    customLettersValue: customLetters = Setting.list({
        name: "File",
        values: current = Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]),
        default: current[0],
        isSupported: function() {
            return header3.get() && useCustomLetters.get()
        },
        onChanged: function(o, n) {
            var content = Java.from(insultDir.listFiles()).length ? Java.from(insultDir.listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]) : ["", "Refresh"]
            customLetters.values = Java.to(content, "java.lang.String[]") //doesnt update in realtime, requires reflector --> make one

            if (n.toLowerCase() == "refresh" || !n) {
                customLetters.set(current[0])
            } else if (n && !Java.from(insultDir.listFiles()).length) {
                addMessage(prefix+"Couln't find file to read!");
            }
        }
    }),
    spacerValue5: spacer5 = Setting.boolean({
        name: "",
        default: false,
        isSupported: function() {
            return header3.get()
        }
    }),
    headerValue4: header4 = Setting.boolean({
        name: "§c§lSettings:§7 Queue",
        default: true
    }),
    useQueueValue: useQueue = Setting.boolean({
        name: "UseSendQueue",
        default: true,
        isSupported: function() {
            return header4.get()
        }
    }),
    sendDelayValue: sendDelay = Setting.integer({
        name: "SendDelay (Seconds)",
        min: 1,
        max: 10,
        default: 3,
        isSupported: function() {
            return header4.get() && useQueue.get()
        }
    })
};

//more vars
var lookFor = detectionPhrase.get().split().unique().filter(Boolean)

//functions
function containsLink(message) {
    if (message.contains("http://") || message.contains("https://") || message.contains("www.")) {
        return true;
    }
}

function extractLink(message) {
    var link = message.split(" ").filter(function (part) containsLink(part))
    return link;
}

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

function sendInsult(targetName) {
    userContent = Java.from(insultDir.listFiles()).length ? Java.from(FileUtils.readLines(new File(insultDir, customMode.get()))) : null
    insult = insultMode.get() == "Internal" || !userContent ? internalInsults.random() : userContent.random()
    lastTarget = targetName

    sentInsult = true
    if (!containsLink(insult)) { //&& (containsLink(insult) && formatMode.get() == "NoFormatting")
        formattedInsult = insult
    } else {
        switch(linkFormat.get()) {
            case "NoFormatting": formattedInsult = insult; break;
            case "SurroundDots": formattedInsult = insult.replace(/[.]/g, surroundWith.get()); break;
            case "ReplaceDots": formattedInsult = insult.replace(/[.]/g, replaceWith.get()); break;
            case "NoDots": formattedInsult = insult.replace(/[.]/g, "")
        }
        sentLink = true;
    }
    if (useCustomLetters.get() && Java.from(insultDir.listFiles()).length) {
        var alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
        var customAlphabet = FileUtils.readFileToString(new File(insultDir, customLetters.get())).split("")
        var insult = formattedInsult.split("")
        for (i = 0; i < insult.length; i++) {
            insult[i] = customAlphabet[alphabet.indexOf(insult[i])]
        }
        formattedInsult = insult.toString()
    }
    mc.thePlayer.sendChatMessage(chatParameter.get()+" "+targetName+" "+formattedInsult)
}

script.registerModule({
    name: "AutoInsultReloaded",
    category: "Misc",
    description: "Insults players in an unique way.",
    settings: list,
 }, function (module) {
    module.on("enable", function() {
    });
    module.on("packet", function(e) {
        var packet = e.getPacket()
        var cIndex = null

        if (detectionMode.get() == "PacketChat") {
            var clientChatContent = ""
            if (packet instanceof C01PacketChatMessage) {
                clientChatContent = packet.getMessage()
                if (selectingPhrase && lastKillMessage.indexOf(clientChatContent) != -1) {
                    cIndex = lastKillMessage.indexOf(clientChatContent)
                    e.cancelEvent()
                    selectingPhrase = false;
                    clearChat()
                    addMessage(prefix+"AutoInsultReloaded will search at index §7'§a§l"+cIndex+"§7' for a target name.")
                }
            }
            if (packet instanceof S02PacketChat) {
                var serverChatContent = packet.getChatComponent().getUnformattedText()
                var contentArray = serverChatContent.split(" ")
                var target = customIndex.get() ? contentArray[cIndex] : contentArray[0]
            
                if (lookFor.some(function (phrase) serverChatContent.contains(phrase+" "+mc.thePlayer.getName()))) {
                    sendInsult(target)
                    lastKillMessage = contentArray
                } else if (sentInsult) {
                    var recievedPacket = serverChatContent.slice(serverChatContent.indexOf(clientChatContent.split(" ")[0]), serverChatContent.length) == clientChatContent
                    if (recievedPacket && hyperLink.get() && sentLink) {
                        e.cancelEvent()
                        addMessage(packet.getChatComponent().getFormattedText()+" §a§l[OPEN]", extractLink(insult), "§a§lClick me!")
                        sentLink = false;
                    }
                    if (!recievedPacket && useQueue.get()) {
                        if (!sendQueue.length || (sendQueue.length && !sendQueue.includes(lastTarget))) {
                            sendQueue.push(lastTarget)
                            queueTimer.reset()
                        }
                    }
                    sentInsult = false;
                }
            }
        }
    });
    module.on("attack", function(e) {
        if (e.getTargetEntity() instanceof EntityPlayer) currentTarget = e.getTargetEntity();
    });
    module.on("update", function () {
        if (currentTarget && detectionMode.get() == "Classic") {
            if (currentTarget.isDead || currentTarget.getHealth <= 0 && !mc.thePlayer.getHealth <= 0 && !mc.thePlayer.isDead) {
                sendInsult(currentTarget.getName())
                currentTarget = null
                return;
            }
        }
        if (sendQueue.length) {
            var last = null
            if (queueTimer.hasTimePassed(sendDelay.get()*1000)) {
                last = sendQueue.pop()
                sendInsult(last)
            }
            if (last && sendQueue.includes(last)) sendQueue.splice(sendQueue.indexOf(last), 1) //only try once
        }
    });
});