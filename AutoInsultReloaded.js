///api_version=2
(script = registerScript({
    name: "AutoInsultReloaded",
    version: "1.0.2",
    authors: ["FaaatPotato"]
})).import("Core.lib");

Core.updateURL = "https://raw.githubusercontent.com/FaaatPotato/Scripts/main/AutoInsultReloaded.js"

ChatComponentText = Java.type("net.minecraft.util.ChatComponentText");
ClickEvent = Java.type("net.minecraft.event.ClickEvent");
HoverEvent = Java.type("net.minecraft.event.HoverEvent");

insultDir = new File(LiquidBounce.fileManager.dir, "AutoInsultRL")
insultDir.mkdir()
internalInsults = [
    "lmao",
    "your performance was miserable :)",
    "idk bro not your best day huh",
    "I, personally, would just surrender.",
    "normally I would say absolute exquisite beginner",
    "that game isn't made for you...",
    "people like you shouldn't play this game.",
    "listen, go to bed. I already sent you to sleep.",
    "buddy, try harder next time ig.",
    "seems like you lost. Must have happened before. Maybe quit?",
    "seen on a sexual perspective your mom is hot.",
    "let me give you a little.. live lesson. Live fucks you like I did."
]
var sentInsult = false, clientChat, prefix = "§8§l[§c§lAutoInsultRL§8§l]§7 ",
    formattedInsult, insult, externalFile, userContent, currentTarget;

insultValues = [
    sectionMode = value.createBoolean("§6§lGeneralConfiguration§f", true, [
        detectionMode = value.createList("DetectionMode", ["PacketChat", "Classic"], "PacketChat", {
            "PacketChat": [
                detectionPhrase = new (Java.extend(TextValue)) ("Scan", "killed by") {
                    onChanged: function(o, n) {
                        addCustomChat(prefix+"Remember that the module will search for '§a§l"+detectionPhrase.get()+" "+mc.thePlayer.getName()+"§7'")
                        if (n.toLowerCase() == "reset") detectionPhrase.set("killed by");
                    }
                },
            ]
        }),
        chatParameter = value.createText("Parameter", "!"),
        value.createSpacer(),
        insultMode = value.createList("InsultMode", ["Internal", "Custom"], "Internal", {
            "Custom": [
                userFileName = new (Java.extend(ListValue)) ("File", current = Java.from(new File(LiquidBounce.fileManager.dir, "AutoInsultRL").listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]), "") {
                    onChanged: function(o, n) {
                        updateReflector = new Reflector(userFileName)
                        updateReflector.values = Java.to(Java.from(new File(LiquidBounce.fileManager.dir, "AutoInsultRL").listFiles()).map(function (file) file.getName()).concat(["", "Refresh"]), "java.lang.String[]")
                        if (n == "Refresh" || n == "") {
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
        clickableLink = value.createBoolean("ClickableLink", true)
    ])
]

function isLink(message) {
    if (message.contains("http://") || message.contains("https://") || message.contains("www")) {
        return true;
    } else return false;
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
    userContent = Java.from(FileUtils.readLines(new File(insultDir, userFileName.get())))
    insult = insultMode.get() == "Internal" || !userContent.length ? internalInsults.random() : userContent.random()
    sentInsult = true;

    if (!isLink(insult)) { //&& (isLink(insult) && formatMode.get() == "NoFormatting")
        formattedInsult = insult
    } else {
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

RLInsult = {
    name: "AutoInsultReloaded",
    category: "Fun",
    description: "Automatically insults your (dead) opponents",
    tag: detectionMode.get(),
    values: insultValues,

    onPacket: function(e) {
        var packet = e.getPacket()
        if (packet instanceof C01PacketChatMessage && mc.thePlayer) {
            clientChat = packet.getMessage()
        }
        if (packet instanceof S02PacketChat) {
            chatContent = packet.getChatComponent().getUnformattedText()
            firstElement = chatContent.split(" ")[0];

            if (chatContent.contains(detectionPhrase.get()+" "+mc.thePlayer.getName()) && detectionMode.get() == "PacketChat") {
                sendInsult(firstElement)
            }
            if (chatContent.contains(clientChat) && clickableLink.get() && sentInsult && isLink(insult)) { //cancel clientside, resend message with events
                e.cancelEvent()
                addCustomChat(packet.getChatComponent().getFormattedText()+" §a§l[OPEN]", extractLink(insult), "§a§lClick me!")
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
    }
}

RLCreate = {
    name: "RLCreate",
    aliases: ["rlc", "rlcreate"],
    version: script.version,

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
