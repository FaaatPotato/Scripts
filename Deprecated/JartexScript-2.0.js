///api_version=2
(script = registerScript({
	name: "JartexScript-2.0",
	version: "1.3.07",
	authors: ["FaaatPotato", "CzechHek"]
})).import("Core.lib");

//A few words to clarify...
//This script isn't completely made by me. The script is made to get the best experience possible cheating on Jartex.
//Everything external is credited properly.
//Thanks to @CzechHek for your help <3!

/*------------------*/
/* NON-CORE IMPORTS */
/*------------------*/

Potion = Java.type("net.minecraft.potion.Potion");
Color = Java.type("java.awt.Color");
Fonts = Java.type("net.ccbluex.liquidbounce.ui.font.Fonts");
ChatComponentText = Java.type("net.minecraft.util.ChatComponentText");
ClickEvent = Java.type("net.minecraft.event.ClickEvent");
HoverEvent = Java.type("net.minecraft.event.HoverEvent");
Item = Java.type("net.minecraft.item.Item");
GL11 = Java.type("org.lwjgl.opengl.GL11");
ParticleTypes = Java.type("net.minecraft.util.EnumParticleTypes");

/*---------------*/
/* MODULE VALUES */
/*---------------*/

managerValues = [
    value.createHeader("§cAutomation§f"),
    autoReg = value.createBoolean("ManageLogin", true, [
        password = new (Java.extend(TextValue)) ("Password", "sx72ujak8") {
            onChanged: function (o, n) {
                if (n.toLowerCase() == "reset") password.set("sx72ujak8");
			}
		},
	]),
    value.createSpacer(),
    value.createHeader("§cEssentials§f"),
	noFireBalls = value.createBoolean("FireballAura", true),
	detectParty = value.createBoolean("DisablePartyChat", true),
	removeAds = value.createBoolean("RemoveAds", true),
	value.createSpacer(),
    value.createHeader("§cAmbient§f"),
    spawnParticles = value.createBoolean("SpawnParticles", false, [
        particleMode = value.createList("ParticleMode", ["Below", "Above"], "Below"),
        particleType = value.createList("ParticleType", [
            "BARRIER", "BLOCK_CRACK", "BLOCK_DUST", "CLOUD", "CRIT", "CRIT_MAGIC", "DRIP_LAVA", "DRIP_WATER", "ENCHANTMENT_TABLE",
            "EXPLOSION_HUGE", "EXPLOSION_LARGE", "EXPLOSION_NORMAL", "FIREWORKS_SPARK", "FLAME","FOOTSTEP", "HEART", "ITEM_CRACK",
            "ITEM_TAKE", "LAVA", "MOB_APPEARANCE", "NOTE", "PORTAL", "REDSTONE", "SLIME", "SMOKE_LARGE", "SMOKE_NORMAL", "SNOW_SHOVEL",
            "SNOWBALL", "SPELL", "SPELL_INSTANT", "SPELL_MOB", "SPELL_MOB_AMBIENT", "SPELL_WITCH", "SUSPENDED", "SUSPENDED_DEPTH",
            "TOWN_AURA", "VILLAGER_ANGRY", "VILLAGER_HAPPY", "WATER_BUBBLE", "WATER_DROP", "WATER_SPLASH", "WATER_WAKE"
        ], "FLAME"),
        particleMotionX = value.createFloat("ParticleMotionX", 0, 0, 1),
        particleMotionY = value.createFloat("ParticleMotionY", 0, 0, 1),
        particleMotionZ = value.createFloat("ParticleMotionZ", 0, 0, 1),
    ]),
    customTime = value.createBoolean("CustomWorldTime", false, [
        worldTime = value.createInteger("Time", 13000, 0, 24000)
    ]),
    customXPBar = value.createBoolean("CustomXPBar", true, [
        barType = value.createList("BarType", ["Year", "TotalKills"], "Year")
    ]),
    value.createSpacer(),
    watermark = value.createBoolean("Watermark", true),
	credits = new (Java.extend(BoolValue)) ("Credits", false) {
		onChanged: function (o, n) {
			if (n) {
                clearChat()

                print(prefix+"Where i stole code from ^^")
				print(" ")
                addCustomChat("§c§l@§7§lCzechHek§7 (forum)", "https://forums.ccbluex.net/user/czechhek", "§a§lClick me!")
                addCustomChat("§c§l@§7§lFDP-Client§7 (homepage)", "https://fdpinfo.github.io/", "§a§lClick me!")
                addCustomChat("§c§l@§7§lyorik100§7 (forum)", "https://forums.ccbluex.net/user/yorik100", "§a§lClick me!")
                addCustomChat("§c§l@§7§lIgnoreIt§7 (source)", "https://paste.ccbluex.net/03c54dd0d", "§a§lClick me!")
				print(" ")

				playSound("mob.cat.meow");
				credits.set(false);
			}
		}
	},
    resetManager = new (Java.extend(BoolValue)) ("§c§lReset", true) {
		onChanged: function (o, n) {
            o &&
            print(prefix+"Values have been reset for JartexManager");
			password.set("sx72ujak8"), noFireBalls.set(true), autoReg.set(true), detectParty.set(true), removeAds.set(true);
            playSound("random.anvil_use")
			resetManager.set(true);
		}
	},
    resetAll = new (Java.extend(BoolValue)) ("§c§lResetAll", true) {
        onChanged: function(o, n) {
            if (o) {
                resetManager.set(false), resetInsult.set(false), resetFucker.set(false), resetTeleport.set(false), resetFly.set(false), resetUtility.set(false), resetLongJump.set(false);
                resetAll.set(true);
            }
        }
    }
];

insultValues = [
    insultMode = value.createList("InsultMode", ["BasicInsult", "SpamLink", "SigmaLike"], "BasicInsult", {
    	"SpamLink": [
			linkMode = value.createList("HandleChatFilter", ["SurroundDot", "ReplaceDot"], "SurroundDot"),
			link = new (Java.extend(TextValue)) ("URL", "https://jartexnetwork.com/forums/trialapps/") {
				onChanged: function (o, n) {
					if (n.toLowerCase() == "reset") link.set("https://jartexnetwork.com/forums/trialapps/");
				}
			}
		]
	}),
    resetInsult = new (Java.extend(BoolValue)) ("§c§lReset", true) {
		onChanged: function (o, n) {
            o &&
            print(prefix+"Values have been reset for AutoInsult!");
            link.set("https://jartexnetwork.com/forums/trialapps/"), insultMode.set("BasicInsult"), linkMode.set("SurroundDot");
            playSound("random.anvil_use")
            resetInsult.set(true)
		}
	}
];

fuckerValues = [
	fuckerRange = value.createFloat("FuckerRange", 6, 4, 8),
    renderProgress = value.createBoolean("RenderBreakProgress", true, [
        progressMode = value.createList("ProgressMode", ["CzechHek", "Mix"], "CzechHek"),
    ]),
    renderBreaking = value.createBoolean("RenderBlockBreaking", true),
	avoidOwn = value.createBoolean("AvoidOwnBed", true),
	autoTool = value.createBoolean("AutoTool", true),
    resetFucker = new (Java.extend(BoolValue)) ("§c§lReset", true) {
        onChanged: function(o, n) {
            o &&
            print(prefix+"Values have been reset for MatrixFucker!");
            fuckerRange.set(6.0), avoidOwn.set(true), autoTool.set(true), progressMode.set("CzechHek"), renderBreaking.set(true), renderProgress.set(true);
            playSound("random.anvil_use")
            resetFucker.set(true)
        }
    }
];

longJumpValues = [
	jumpBoostXZ = value.createFloat("BoostForward", 3.75, 1.5, 4.7),
	jumpBoostY = value.createFloat("BoostUpward", 1.5, 0.6, 3),
	jumpTimerSpeed = value.createFloat("Timer", 0.2, 0.1, 0.8),
    resetLongJump = new (Java.extend(BoolValue)) ("§c§lReset", true) {
        onChanged: function(o, n) {
            o &&
            print(prefix+"Values have been reset for LongJump!");
            jumpBoostXZ.set(3.75), jumpBoostY.set(1.5), jumpTimerSpeed.set(0.2);
            playSound("random.anvil_use")
            resetLongJump.set(true)
        }
    }
];

utilityValues = [
    showMovement = value.createBoolean("§l§cMovement§f", true, [
	   strafe = value.createBoolean("CombatStrafe", true, [
	       betterDetection = value.createBoolean("BetterHandling", true, [
		      activationToleration = value.createFloat("AirPillowSize", 0.1, 0.1, 0.5)
		   ]),
           activationMode = value.createList("ActivationMode", ["Combat", "PlayerInRange"], "Combat", {
               "PlayerInRange": activationRange = value.createFloat("ActivationRange", 4, 3, 6)
           }),
		   strafeSpeed = value.createFloat("StrafeSpeed", 0.22, 0.01, 0.22),
        ]),
        value.createSpacer()
    ]),
    showMisc = value.createBoolean("§l§cMisc§f", true, [
        returnToLast = value.createBoolean("SpawnAtLastOnGround", true, [
            renderBlock = value.createBoolean("RenderTargetBlock", true),
            spawnMode = value.createList("Activation", ["Always", "ButtonPressed"], "Always", {
                "ButtonPressed": [
                    spawnKey = new (Java.extend(TextValue)) ("Key", "LSHIFT") {
                        onChanged: function(o, n) {
                            if (Keyboard.getKeyIndex(n.toUpperCase()) == 0) {
                                spawnKey.set("LSHIFT");
                                print("")
                                addCustomChat(prefix+"Key '§c§l"+n+"§7' is invalid! Keys can be found here.", "https://legacy.lwjgl.org/javadoc/org/lwjgl/input/Keyboard.html", "§a§lClick me!")
                                print("")
                            } else spawnKey.set(spawnKey.get().toUpperCase());
                        }
                    }
                ]
            })
        ]),
        value.createSpacer()
    ]),
    showPlayer = value.createBoolean("§l§cPlayer§f", true, [
        antiBot = value.createBoolean("AntiBot", true),
	    noSwitch = value.createBoolean("NoSlotSwitch", true),
        targetHUD = value.createBoolean("TargetHUD", true, [
            hudX = value.createFloat("PosX", 300, 0, 1920),
            hudY = value.createFloat("PosY", 350, 0, 1080),
            cutName = value.createBoolean("FitName", true, [
                shortenAt = value.createInteger("CutAt", 11, 1, 15)
            ])
        ]),
        value.createSpacer()
    ]),
    resetUtility = new (Java.extend(BoolValue)) ("§c§lReset", true) {
        onChanged: function(o, n) {
            o &&
            print(prefix+"Values have been reset for MatrixUtility!");
            showMovement.set(true), strafe.set(true), betterDetection.set(true), activationToleration.set(0.1), activationMode.set("Combat"), activationRange.set(4.0), strafeSpeed.set(0.22);
            showMisc.set(true), returnToLast.set(true), renderBlock.set(true), spawnMode.set("Always"), spawnKey.set("LSHIFT");
            showPlayer.set(true), noSwitch.set(true);
            targetHUD.set(true), hudX.set(300.0), hudY.set(300.0), cutName.set(true), shortenAt.set(11);
            playSound("random.anvil_use")
            resetUtility.set(true)
        }
    }
];

flyValues = [
    flyMode = value.createList("Mode", ["PacketReplace", "Test"], "PacketReplace", {
        "PacketReplace": [
            boostXZ = value.createFloat("BoostXZ", 2.5, 1, 10),
            boostY = value.createFloat("BoostY", 0.8, 0.5, 2)
        ]
    }),
    resetFly = new (Java.extend(BoolValue)) ("§c§lReset", true) {
        onChanged: function(o, n) {
            o &&
            print(prefix+"Values have been reset for MatrixFly!");
            flyMode.set("PacketReplace"), boostXZ.set(2.5), boostY.set(0.8);
            playSound("random.anvil_use")
            resetFly.set(true)
        }
    }
];

teleportValues = [
	selectButton = value.createList("Button", ["Middle", "Left", "Right"], "Middle"),
    teleportMode = value.createList("TeleportMode", ["Spectator", "ServerBased"], "Spectator", {
        "ServerBased": [
            detectionMode = value.createList("DetectionMode", ["Spectator", "PacketTitle"], "Spectator"),
            sendPeriod = value.createFloat("ActivateTeleportAt", 2.2, 1.0, 5.0),
            limitPackets = value.createBoolean("LimitPackets", true, [
                maxPackets = value.createInteger("PacketLimit", 100, 80, 200),
            ])
        ]
    }),
	blockInfo = value.createBoolean("BlockInformation", true),
	cancelTitle = value.createBoolean("NoRespawnCountdown", true),
    resetTeleport = new (Java.extend(BoolValue)) ("§c§lReset", true) {
        onChanged: function(o, n) {
            o &&
            print(prefix+"Values have been reset for DeathTeleport!");
            selectButton.set("Middle"), teleportMode.set("Spectator"), detectionMode.set("Spectator"), sendPeriod.set(2.2), limitPackets.set(true), maxPackets.set(100), blockInfo.set(true), cancelTitle.set(true);
            playSound("random.anvil_use")
            resetTeleport.set(true)
        }
    }
];

/*------------------*/
/* GLOBAL FUNCTIONS */
/*------------------*/

function getBlockName(blockPos) BlockUtils.getBlock(blockPos).getLocalizedName()

function getFont(i) Fonts.getFonts()[i];

function randomETSColor() "§"+["5", "d", "9", "1", "3", "b", "a", "2", "e", "6", "c", "4"].random()

function downloadExternal() {
	var downloadedScripts = [];

	for each (var url in scriptsToDownload) {
		var fileName = url.contains("-") ? url.slice(url.lastIndexOf("-") + 1, url.length) : url.slice(url.lastIndexOf("/") + 1, url.length), file = new File(scriptManager.scriptsFolder, fileName);

		if (!file.exists()) {
			try {
				HttpUtils.download(new URL(url), file);
				scriptManager.loadScript(file);
				downloadedScripts.push(file.getName())
			} catch (e) {
				print(e)
			}
		}
	}
	if (downloadedScripts.length) {
		print("")
        addCustomChat(prefix+"§a§lDownloaded necessary script(s)", null, "§a§l"+downloadedScripts.map(function (entry) entry).join("§a§l, "));
		print("")
        timeout(10, function () Core.hookClickGui()); //prevents double call (onClickGuiLoaded); prevents "java.util.ConcurrentModificationException" if in onClickGuiLoaded
	}
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

/*------------------*/
/* GLOBAL VARIABLES */
/*------------------*/

var prefix = "§8§l[§"+["5", "d", "9", "1", "3", "b", "a", "2", "e", "6", "c", "4"].random()+"§lJS§8§l]§7 ", welcomeMessage = "THANKS FOR USING JARTEXSCRIPT-2.0! \u2764",
    ballTimer = new MSTimer(), airTimer = new MSTimer(), selectTimer = new MSTimer(), renderTimer = new MSTimer(), teleportTimer = new MSTimer(),
    mcFont = getFont(0), packet, firstElement, chatContent, width = mc.displayWidth * 0.5, height = mc.displayHeight * 0.5, killsToAdd = 0, killedPlayer = false,
    renderKill = false, oldKillCount, statsDir = new File(scriptManager.scriptsFolder, "JartexScript"), statsFile = new File(scriptManager.scriptsFolder+"/JartexScript", "currentStats"),
    killMessage = "+1 Kill";


arrayArchive = [ //feel free to edit, add or admire! ^^
    basicInsults = [
        "your performance was miserable :)",
        "idk bro not your best day huh",
        "I, personally, would just surrender.",
        "ur dad left you lol",
        "normally I would say absolute exquisite beginner",
        "that game isn't made for you...",
        "apply here for Jartex-slavery: https://jartexnetwork(.)com/forums/trialapps/",
        "listen, go to bed. I already sent you to sleep.",
        "buddy, try harder next time ig.",
        "seems like you lost. Must have happened before. Maybe quit?",
        "seen on a sexual perspective your mom is hot."
    ],
    linkInsults = [
        "missing report moment lmao:",
        "no report system xD:",
        "here, waste your time:",
        "i would not waste my time:",
        "waste your time here instead:",
        "you'll be happy:",
        "use chrome to report me:",
        "redirecting to report site:",
        "call staff bro, report broken:"
    ],
    fakeInsults = [ //idk ask @AlienGurke why...
        "Sigma does your mom better than your dad.",
        "S I G M A. I am Sigma.",
        "Sigma just fucked you.",
        "don't even try against Sigma.",
        "was a pleasure watching you commit suicide against Sigma-Aura...",
        "the anticheat here is called Matrix. They should've named it Memetrix!",
        "u play legit and get kicked? That's because of this beautiful anticheat. Allows Sigma users but no legits!",
        "is this Vanilla or Matrix anticheat? Can't feel the difference tbh...",
        "you got wrecked by Sigma!",
        "an IP-Ban isn't stopping me. It's just a waste of time!",
        "imagine playing legit on a server where u can buy an unban.",
        "imagine not using Sigma...",
        "imagine not using Sigma on Jartex or Pika-Shitwork...",
        "put in no effort killing you ngl",
        "the anticheat here costs 150$. Feels like smth you could get at the dollar-store.",
        "give me an „S“, give me an „I“, give me a „G“, give me an „M“, give me an „A“!",
        "the 5 in Sigma5 stands for your IQ!",
        "server is only looking for staff members because they know that their anti-cheat sucks.",
        "Matrix-Enterprise costs 150$, NCP is free. Which anticheat would you choose? Decide!"
    ],
    bypassChars = [
        "*", "~", "#", ":", "`", "^", ";", "_", "&", "<", ">", "|", "!", "?", "=", "+"
    ],
    blackList = [
        "IRON CURRENCY", "FREE ingame", "Currently playing with", "more JartexNetwork!",
        "SITE", "TWITTER", "Purchase your", ".jartexnetwork.", "jartexnetwork.", "RESET",
        "NEW!", "/goldshop", "/vote", "email has not been", "Instagram", "instagram",
        "giftcards", "Level Rewards", "Reward!", "manage your", "/email", "Discord",
        "JN", "Welcome,", "has donated", "voting", "Voting", "extras!", "Crystals",
        "rewards", "rank", "booster", "CLICK"
    ],
    intervalMessageA = [],
    intervalMessageB = []
];

var startY, tryBoost, startPos, startYaw, startPitch, lastHit, createdParty = false, isLoaded, breakDamage = 0, blockHitDelay = 0, breakingBlock, ownBed,
    FuckerModuleReflector = new Reflector(FuckerModule), FuckerRangeValue = FuckerModule.getValue("Range"), currentMode, sentInsult, message, lastOnGround,
    shouldReturn, isBlock, tpPos, lookPos, renderSelected, tryTeleport, packets = 0, barWidth = 0.0, armorBarWidth = 0.0;

/*------------*/
/* SETTING UP */
/*------------*/

Core.onLoad = function() {
    Core.categories.add("JartexScript-External");
    scriptsToDownload = [
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/InventoryManager.js",
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/MatrixAntiBot.js",
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/NoBooks.js",
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/SprintPatch.js",
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/KillAuraPatch.js",
        "https://raw.githubusercontent.com/CzechHek/Core/master/Scripts/Incognito.js"
    ], externalCategory = Core.categories.values().find(function (category) category.displayName == "JartexScript-External");
    downloadExternal();

    for each (var module in scriptsToDownload.map(function (url) moduleManager.getModule(url.slice(url.lastIndexOf("/") + 1, -3)))) {
        module.category = externalCategory;
    }

    if (!statsFile.exists()) {
        new File(statsDir)
        FileUtils.writeStringToFile(statsFile, "totalKills: 0")
    }
}

Core.onScriptUpdate = function(oldVer, newVer) {
    print(prefix+"§7Successfully updated from §c§lversion-"+oldVer+"§7 to §c§lversion-"+newVer+"§7!")
}

/*----------------*/
/* HOOKING EVENTS */
/*----------------*/

hookEvent(PacketEvent, function (e) {
    packet = e.getPacket()
    if (packet instanceof S02PacketChat) {
        chatContent = packet.getChatComponent().getUnformattedText();
        firstElement = chatContent.split(" ")[0];

        if (chatContent.contains("by "+mc.thePlayer.getName())) {
            killedPlayer = true
            renderKill = true
            killsToAdd += 1;
            return;
        }
    }
});

hookEvent(Render2DEvent, function () { //why diddnt i use visibleChars for both? lol
    if (isLoaded && mc.thePlayer) {
        if (!timings) {
            interval(50, function () intervalMessageA.push(welcomeMessage[intervalMessageA.length]));
            timeout(6000, function () isLoaded = false);
            timings = true
        }
        GL11.glPushMatrix()
        GL11.glTranslated(68, 100, 1)
        GL11.glScaled(2.5, 2.5, 2.5)
        mcFont.drawStringWithShadow(intervalMessageA.toString().replaceAll(",", ""), 68, 100, new Color(255, 0, 76).brighter().getRGB());
        GL11.glPopMatrix()
    }
    if (killedPlayer) {
        if (renderKill) {
            playSound("random.levelup")
            interval(80, function() intervalMessageB.push(killMessage[intervalMessageB.length]));
            timeout(2000, function() killedPlayer = false);
            renderKill = false;
        }
        GL11.glPushMatrix()
        GL11.glTranslated(68, 100, 1)
        GL11.glScaled(2.5, 2.5, 2.5)
        mcFont.drawStringWithShadow(intervalMessageB.toString().replaceAll(",", ""), width/6.5, 80, new Color(255, 0, 76).brighter().getRGB());
        GL11.glPopMatrix()
    }
});

hookEvent(Render3DEvent, function () {
    if (spawnParticles.get()) {
        switch (particleMode.get()) {
            case "Below": mc.theWorld.spawnParticle(ParticleTypes[particleType.get()], mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, particleMotionX.get(), particleMotionY.get(), particleMotionZ.get()); break;
            case "Above": mc.theWorld.spawnParticle(ParticleTypes[particleType.get()], mc.thePlayer.posX, mc.thePlayer.posY+2.1, mc.thePlayer.posZ, particleMotionX.get(), particleMotionY.get(), particleMotionZ.get());
        }
    }
});

hookEvent(UpdateEvent, function() {
    if (statsFile.exists()) {
        oldKillCount = parseInt(FileUtils.readLines(statsFile)[0].split(" ")[1])
    } else oldKillCount = 0;

    if (mc.thePlayer && customXPBar.get() && barType.get() == "Year") mc.thePlayer.experienceLevel = 2022; else mc.thePlayer.experienceLevel = parseInt(oldKillCount+killsToAdd);
    if (customTime.get()) {
        mc.theWorld.setWorldTime(worldTime.get())
    }
});

/*-------------*/
/* MODULE-CODE */
/*-------------*/

JartexManager = {
	name: "JartexManager",
	category: "JartexScript-2.0",
	description: "Manages all the commited crimes of you.",
	tag: "JS-2.0",
	values: managerValues,

	onEnable: function () {
		createdParty = false;
		lastHit = null;
		count = 0
	},
	onDisable: function () {
	    mc.timer.timerSpeed = 1;
	},
	onUpdate: function() {
		if (noFireBalls.get()) {
			var target = getNearestTarget(EntityFireball)
        	if (target && PlayerExtensionKt.getDistanceToEntityBox(target, mc.thePlayer) < 5.5 && target.ticksExisted > 8 && (ballTimer.hasTimePassed(100) || lastHit != target)) {
            	lastHit = target;
            	ballTimer.reset();
				sendPacket(new C02PacketUseEntity(target, C02PacketUseEntity.Action.ATTACK))
                return;
			}
		}
	},
	onPacket: function (e) {
		if (packet instanceof S02PacketChat) {
			if (removeAds.get()) {
				if (firstElement == "") e.cancelEvent()
				for each (var entry in blackList) {
					if (chatContent.contains(entry)) e.cancelEvent();
				}
			}
			if (autoReg.get()) {
				if (chatContent.contains("/register")) {
					mc.thePlayer.sendChatMessage("/register " + password.get() + " " + password.get());
					e.cancelEvent();
					return;
				} else if (chatContent.contains("/login")) {
					mc.thePlayer.sendChatMessage("/login " + password.get());
					e.cancelEvent();
					return;
				} else if (
					chatContent.contains("already logged in") ||
					chatContent.contains("Successfully registered!") ||
					chatContent.contains("due to Session Reconnection") ||
					chatContent.contains("Authentication required")
				) return e.cancelEvent();
			}
			if (detectParty.get() && firstElement == "Party") {
				if (chatContent.contains(mc.thePlayer.getName() + " joined the party!"))
					mc.thePlayer.sendChatMessage("/p chat");
				else if (!createdParty && chatContent.contains(mc.thePlayer.getName() + " invited")) {
					mc.thePlayer.sendChatMessage("/p chat");
					createdParty = true;
				} else if (
					chatContent.contains(mc.thePlayer.getName() + " disbanded the party!") ||
					chatContent.contains(mc.thePlayer.getName() + " has left the party.") ||
					chatContent.contains("The party has been disbanded!")
				) createdParty = false;
			}
		} else if (packet instanceof C00PacketLoginStart && detectParty.get()) {
			createdParty = false;
	    }
	},
    onClickGuiLoaded: function() {
        if (watermark.get()) {
            isLoaded = true;
            timings = false;
        }
    },
    onShutdown: function () {
        statsFile.delete()
        new File(statsDir)
        FileUtils.writeStringToFile(statsFile, "totalKills: "+parseInt(oldKillCount+killsToAdd));
    }
}

function getArray() {
    switch (insultMode.get()) {
        case "BasicInsult": return basicInsults ; break
        case "SigmaLike": return fakeInsults; break
        case "SpamLink": return linkInsults;
    }
}

AutoInsult = {
    name: "AutoInsult",
    category: "JartexScript-2.0",
    description: "Analyses the family relationship of your opponents to provoke group suicide.",
    tag: "JS-2.0",
    values: insultValues,

    onPacket: function(e) {
        if (packet instanceof C01PacketChatMessage) message = packet.getMessage()
	    if (packet instanceof S02PacketChat) {
            if (message && chatContent.contains(message) && sentInsult) {
                e.cancelEvent()
                addCustomChat(packet.getChatComponent().getFormattedText()+" §a§l[OPEN]", link.get(), "§a§lClick me!")
                sentInsult = false;
            }
            if (chatContent.contains("killed by "+mc.thePlayer.getName()) && currentMode == "normal") {
                if (insultMode.get() == "SpamLink") {
                    sentInsult = true
                    switch (linkMode.get()) {
                        case "SurroundDot": mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random()+" "+link.get().replace(/[.]/g, "(.)")); break;
                        case "ReplaceDot": mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random()+" "+link.get().replace(/[.]/g, bypassChars.random()));
                    }
                } else {
                    mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random())
                }
            } else if (chatContent.contains("eliminated by " + mc.thePlayer.getName())) {
                if (insultMode.get() == "SpamLink") {
                    sendInsult = true
                    switch (linkMode.get()) {
                        case "SurroundDot": mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random()+" "+link.get().replaceAll(".", "(.)")); break;
                        case "ReplaceDot": mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random()+" "+link.get().replaceAll(".", bypassChars.random()));
                    }
                } else {
                    mc.thePlayer.sendChatMessage("! "+firstElement+" "+getArray().random())
                }
            }
            return;
		}
        if (mc.thePlayer && mc.theWorld.getScoreboard().getScores()[0].getObjective().getDisplayName().contains("BedWars")) {
            currentMode = "bedwars"
        } else {
            currentMode = "normal"
        }
    }
}

function getFacing(state) state.getProperties().get(BlockDirectional.FACING);

function getBlockToBreak(bedPos) {
	var state = BlockUtils.getState(bedPos),
		facing = getFacing(state);

	var bedFootPos = state.getProperties().get(BlockBed.PART) == "head" ? bedPos[facing](-1) : bedPos;

	if (avoidOwn.get()) {
		if (!ownBed) {
			ownBed = bedFootPos;
			return
		} else if (!ownBed.compareTo(bedFootPos)) return
	}

	var outerBlocks = [bedFootPos[facing](-1), bedFootPos[facing](2)];

	for each (var direction in ["north", "south", "east", "west", "up"]) {
		if (direction == facing || direction == facing.getOpposite()) continue;
		outerBlocks.push(bedFootPos[direction](1), bedFootPos[direction](1)[facing](1));
	}

	if (outerBlocks.some(function (block) mc.theWorld.isAirBlock(block))) return bedPos;

	return outerBlocks
		.filter(function (block) BlockUtils.getCenterDistance(block) <= fuckerRange.get())
		.sort(function (a, b) BlockUtils.getCenterDistance(a) - BlockUtils.getCenterDistance(b))
		.sort(function (a, b) BlockUtils.getBlock(b).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, b) - BlockUtils.getBlock(a).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, a))[0];
}

function breakBlock(blockPos) {
	if (!blockPos || BlockUtils.getCenterDistance(blockPos) > fuckerRange.get()) {
		if (breakingBlock) {
			blockHitDelay = 4;
			breakDamage = 0;
			breakingBlock = null;
		}
		return
	}
	//you could check for best block even when mining a block and compare its hardness and if it is faster to stop mining this block and start mining the other block

	if (autoTool.get()) AutoToolModule.switchSlot(blockPos);
	if (!breakingBlock) breakingBlock = blockPos;
	if (!breakDamage)
		sendPacket(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.START_DESTROY_BLOCK, blockPos, EnumFacing.DOWN));

	breakDamage += BlockUtils.getBlock(blockPos).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, blockPos);
	sendPacket(new C0APacketAnimation());

	if (breakDamage >= 1) {
		sendPacket(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK, blockPos, EnumFacing.DOWN));
		mc.playerController.onPlayerDestroyBlock(blockPos, EnumFacing.DOWN);
		blockHitDelay = 4;
		breakDamage = 0;
		breakingBlock = null;
	}
}

MatrixFucker = {
	name: "MatrixFucker",
	category: "JartexScript-2.0",
	description: "Gender-benders your dick through walls so you can lick target's bed!",
	tag: "JS-2.0",
	values: fuckerValues,

	onUpdate: function() {
		if (blockHitDelay > 0) return blockHitDelay--;

		if (breakingBlock) return breakBlock(breakingBlock);

		FuckerRangeValue.set(fuckerRange.get());
		var bedPos = FuckerModuleReflector.find(26);

		if (!bedPos) return;

        breakBlock(getBlockToBreak(bedPos));
	},
	onRender3D: function() {
		if (renderBreaking.get() && breakingBlock)
			RenderUtils.drawBlockBox(breakingBlock, Color.RED, true);
	},
	onRender2D: function () {
		if (!breakDamage || !renderProgress.get()) return

		var breakPercentage = breakDamage * 100

        if (progressMode.get() == "CzechHek") {
			Gui.drawRect(width * 0.25 - 3, height * 0.75 - 3, width * 0.75 + 3, height * 0.75 + 13, new Color(20, 20, 20).getRGB())
			Gui.drawRect(width * 0.25, height * 0.75, width * 0.75, height * 0.75 + 10, new Color(50, 50, 50).getRGB())
	    	Gui.drawRect(width * 0.25, height * 0.75, width * 0.25 + width * 0.5 * breakDamage, height * 0.75 + 10, Color.HSBtoRGB(breakDamage / 5.0, 1.0, 1.0) | 0xFF0000)
		}
		if (progressMode.get() == "Mix") {
	        Gui.drawRect(470, 280, 340, 343, new Color(20,20,20).getRGB());
	    	Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
	    	mcFont.drawString("MatrixFucker: (ID: "+Block.getIdFromBlock(BlockUtils.getBlock(breakingBlock))+")", 346, 286, 0xFFFFFF);

        	Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
	        mcFont.drawString("Breaking: "+breakPercentage.toFixed(2)+"%", 345, 304, 0xFFFFFF);
	        mcFont.drawString(getBlockName(breakingBlock).toUpperCase(), 345, 320, 0xFFFFFF);

	        Gui.drawRect(467, 335, 343, 340, new Color(50, 50, 50).getRGB());
		    Gui.drawRect(343, 335, 467 + 124 * breakDamage - 124, 340, Color.HSBtoRGB(breakDamage / 5.0, 1.0, 1.0) | 0xFF0000);
		}
	},
	onWorld: function () {
		ownBed = null;
	}
}

MatrixLongJump = {
	name: "MatrixLongJump",
	category: "JartexScript-2.0",
	description: "Idea from FDP? Not sure tho, anyways improved and converted into a LongJump! ::DDD",
	tag: "JS-2.0",
	values: longJumpValues,

	onEnable: function () {
        startPos = mc.thePlayer.posY
        startYaw = mc.thePlayer.rotationYaw
        startPitch = mc.thePlayer.rotationPitch
        airTimer.reset()
	},
	onDisable: function () {
		mc.timer.timerSpeed = 1
	},
	onUpdate: function () {
	    mc.thePlayer.rotationYaw = startYaw;
	    mc.thePlayer.rotationPitch = startPitch;
		if (mc.thePlayer.onGround) {
			var yaw = MovementUtils.getDirection();
			sendPacket(new C06PacketPlayerPosLook(
				mc.thePlayer.posX - Math.sin(yaw) * 1.5,
				mc.thePlayer.posY + 3,
				mc.thePlayer.posZ + Math.cos(yaw) * 1.5,
				mc.thePlayer.rotationYaw, mc.thePlayer.rotationPitch, false
			));
		 	mc.thePlayer.motionY = jumpBoostY.get();
		  	MovementUtils.strafe(jumpBoostXZ.get());
			mc.timer.timerSpeed = mc.thePlayer.isPotionActive(Potion.moveSpeed) ? 0.2 : jumpTimerSpeed.get();
		}
		if (startPos < mc.thePlayer.posY && airTimer.hasTimePassed(500) || mc.thePlayer.hurtTime) this.module.setState(false), airTimer.reset()
	},
	onPacket: function (e) {
		if (packet instanceof S08PacketPlayerPosLook) {
			mc.thePlayer.setPosition(packet.getX(), packet.getY(), packet.getZ());
			sendPacket(new C06PacketPlayerPosLook(packet.getX(), packet.getY(), packet.getZ(), packet.getYaw(), packet.getPitch(), false));
			e.cancelEvent();
		}
	}
}

function shouldStrafe() {
	if (betterDetection.get()) {
		if (BlockUtils.getBlock(new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY-activationToleration.get(), mc.thePlayer.posZ)) == Blocks.air && (mc.gameSettings.keyBindLeft.pressed || mc.gameSettings.keyBindRight.pressed || mc.gameSettings.keyBindBack.pressed)) return true;
	} else {
		if (!mc.thePlayer.onGround && (mc.gameSettings.keyBindLeft.pressed || mc.gameSettings.keyBindRight.pressed || mc.gameSettings.keyBindBack.pressed)) return true;
	}
}

function animate(target, current, speed) {
    var larger = target > current

    if (speed < 0.0) speed = 0.0; else if (speed > 1.0) speed = 1.0;

    var difference = Math.max(target, current) - Math.min(target, current)
    var factor = difference * speed

    if (factor < 0.1) factor = 0.1
    if (larger) current += factor; else current -= factor;

    return current;
}

function drawPlayerHead(target, x, y, size) {
    mc.getTextureManager().bindTexture(target.getLocationSkin());
    GL11.glColor4f(1, 1, 1, 1);
    Gui.drawScaledCustomSizeModalRect(x, y, 8, 8, 8, 8, size, size, 64, 64);
}

MatrixUtility = {
	name: "MatrixUtility",
	category: "JartexScript-2.0",
	description: "Utilizes the power of JartexScript.",
	tag: "JS-2.0",
	values: utilityValues,

	onUpdate: function () {
		if (strafe.get() && activationMode.get() == "PlayerInRange" && getTargetsInRange(activationRange.get(), EntityPlayer).length && shouldStrafe() && showMovement.get()) {
			MovementUtils.strafe(strafeSpeed.get());
		}
        if (returnToLast.get() && showMisc.get()) {
            shouldReturn = mc.thePlayer.isSpectator() && !moduleManager.getModule("DeathTeleport").getState()
            if (mc.thePlayer.onGround) lastOnGround = new BlockPos(mc.thePlayer).down(1)
            if (shouldReturn) {
                if (spawnMode.get() == "Always") {
                    sendPacket(new C04PacketPlayerPosition(lastOnGround.getX(), lastOnGround.getY(), lastOnGround.getZ(), true));
                } else if (Keyboard.isKeyDown(Keyboard.getKeyIndex(spawnKey.get().toUpperCase()))) {
                    sendPacket(new C04PacketPlayerPosition(lastOnGround.getX(), lastOnGround.getY(), lastOnGround.getZ(), true));
                }
            }
        }
        if (antiBot.get()) {
            for each (var bot in getTargetsInRange(10, EntityZombie).filter(function (entity) entity.isInvisible())) {
                mc.theWorld.removeEntity(bot)
            }
        }
	},
	onAttack: function (e) {
		var target = e.getTargetEntity()
		if (strafe.get() && PlayerExtensionKt.getDistanceToEntityBox(target, mc.thePlayer) <= KillAuraModule.getValue("Range").get() && activationMode.get() == "Combat" && shouldStrafe() && showMovement.get()) {
			MovementUtils.strafe(strafeSpeed.get());
			if (betterDetection.get()) {
				importFromScript("SprintPatch", "module")[0].values[2].set(true);
				importFromScript("SprintPatch", "module")[0].onMotion(new MotionEvent(EventState.PRE));
			}
		}
	},
	onPacket: function (e) {
	  	if (mc.thePlayer && e.getPacket() instanceof S09PacketHeldItemChange && noSwitch.get() && showPlayer.get()) {
			e.cancelEvent();
			sendPacket(new C09PacketHeldItemChange(mc.thePlayer.inventory.currentItem));
	  	}
	},
    onRender2D: function() {
        if (targetHUD.get() && showPlayer.get()) { //stolen hud lol xd
            if (KillAuraModule.target != null && KillAuraModule.target instanceof EntityPlayer) {
                var currentTarget = KillAuraModule.target
                var formattedName = currentTarget.getName().length > shortenAt.get() && cutName.get() ? currentTarget.getName().slice(0,shortenAt.get())+"..." : currentTarget.getName()

                GL11.glEnable(GL11.GL_BLEND);
                GL11.glDisable(GL11.GL_TEXTURE_2D);
                GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
                GL11.glEnable(GL11.GL_LINE_SMOOTH);

                GL11.glPushMatrix();

                RenderUtils.drawRect(hudX.get(), hudY.get(), hudX.get() + 110, hudY.get() + 42, new Color(0, 0, 0, 100).getRGB());

                drawPlayerHead(currentTarget, hudX.get() + 3, hudY.get() + 3, 28);

                mcFont.drawString(formattedName, hudX.get() + 35, hudY.get() + 5, -1);

                mcFont.drawString("Health: "+currentTarget.getHealth().toFixed(1), hudX.get() + 35, hudY.get() + 5 + 8, -1);
                mcFont.drawString("Distance: "+mc.thePlayer.getDistanceToEntity(currentTarget).toFixed(1)+"m", hudX.get() + 35, hudY.get() + 5 + (8 * 2) + 1, -1);

                var coefficient = currentTarget.getHealth() / currentTarget.getMaxHealth();
                var hp = 103 * coefficient;
                barWidth = animate(hp, barWidth, 0.0129999);

                var armorCoefficient = parseFloat(currentTarget.getTotalArmorValue() / 20+"."+currentTarget.getTotalArmorValue() % 20);
                var armor = 103 * armorCoefficient;
                armorBarWidth = animate(armor, armorBarWidth, 0.0129999);

                RenderUtils.drawRect(hudX.get() + 3, hudY.get() + 33, hudX.get() + 3 + 103, hudY.get() + 33 + 2, new Color(0, 0, 0, 80).getRGB());
                RenderUtils.drawRect(hudX.get() + 3, hudY.get() + 33 + 4, hudX.get() + 3 + 103, hudY.get() + 33 + 4 + 2, new Color(0, 0, 0, 80).getRGB());

                RenderUtils.drawRect(hudX.get() + 3, hudY.get() + 33, hudX.get() + 3 + barWidth, hudY.get() + 33 + 2, Color.decode("#3ade3a").getRGB());
                RenderUtils.drawRect(hudX.get() + 3, hudY.get() + 33 + 4, hudX.get() + 3 + armorBarWidth, hudY.get() + 33 + 4 + 2, Color.decode("#2880b5").brighter().getRGB());

                GL11.glPopMatrix();

                GL11.glEnable(GL11.GL_TEXTURE_2D);
                GL11.glDisable(GL11.GL_BLEND);
                GL11.glDisable(GL11.GL_LINE_SMOOTH);
                GL11.glColor4f(1, 1, 1, 1);
            }
        }
    },
    onRender3D: function() {
        if (shouldReturn && renderBlock.get() && showMisc.get()) {
            RenderUtils.drawBlockBox(lastOnGround, Color.GREEN, true)
        }
    }
}

MatrixFly = {
	name: "MatrixFly",
	category: "JartexScript-2.0",
	description: "Converted MatrixBoost fly from FDP-Client to ScriptAPIv2 | Credits to FDP ofc!",
	tag: "JS-2.0",
	values: flyValues,

	onEnable: function () {
		startY = mc.thePlayer.posY;
		tryBoost = 0;
	},
	onDisable: function () {
		tryBoost = 0;
		mc.timer.timerSpeed = 1;
		MovementUtils.strafe(0.2);
	},
	onUpdate: function () {
		if (mc.thePlayer.isDead) return this.module.setState(false);
        var yaw = MovementUtils.getDirection();

        if (flyMode.get() == "Test") {
            if (mc.thePlayer.ticksExisted % 5 == 0) mc.thePlayer.motionY = 0.42
                sendPacket(new C04PacketPlayerPosition(
                    mc.thePlayer.posX - Math.sin(yaw) * 10,
                    mc.thePlayer.posY + 0.001-0.0001,
                    mc.thePlayer.posZ + Math.cos(yaw) * 10,
                    true
                ));
                sendPacket(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, false))
        }
        if (flyMode.get() == "PacketReplace") {
            if (!tryBoost) {
                sendPacket(new C04PacketPlayerPosition(
                    mc.thePlayer.posX - Math.sin(yaw) * 1.5,
                    mc.thePlayer.posY + 1,
                    mc.thePlayer.posZ + Math.cos(yaw) * 1.5,
                    false
                ));
                tryBoost = 1;
                mc.timer.timerSpeed = 0.3;
            } else if (tryBoost == 2) {
                MovementUtils.strafe(boostXZ.get());
                mc.thePlayer.motionY = boostY.get();
                tryBoost = 3;
            } else if (tryBoost < 5) {
                tryBoost++;
            } else if (tryBoost >= 5) {
                mc.timer.timerSpeed = 1;
                if (mc.thePlayer.posY < startY) tryBoost = 0;
            }
        }
	},
	onWorld: function () {
		this.module.setState(false);
	},
	onPacket: function (e) {
		if (packet instanceof S08PacketPlayerPosLook && flyMode.get() == "PacketReplace") {
			mc.thePlayer.setPosition(packet.getX(), packet.getY(), packet.getZ());
			sendPacket(new C06PacketPlayerPosLook(packet.getX(), packet.getY(), packet.getZ(), packet.getYaw(), packet.getPitch(), false));
			e.cancelEvent();
			if (tryBoost == 1) tryBoost = 2;
		}
	}
}

function checkButtonPressed() {
	switch (selectButton.get()) {
		case "Middle": return mc.gameSettings.keyBindPickBlock.pressed; break;
		case "Left": return mc.gameSettings.keyBindAttack.pressed; break;
		case "Right": return mc.gameSettings.keyBindUseItem.pressed;
	}
}

DeathTeleport = {
	name: "DeathTeleport",
	category: "JartexScript-2.0",
	description: "Splits atoms like ass cheecks to get you to enemys bed.",
	tag: "JS-2.0",
	values: teleportValues,

    onEnable: function() {
        selectTimer.reset()
    },
	onDisable: function() {
		tryTeleport = false
		renderSelected = false
		switchedMode = false
		packets = 0;
	},
	onUpdate: function() {
		if (!isBlock) return;
		if (checkButtonPressed() && selectTimer.hasTimePassed(400) && isBlock && lookPos) {
			tpX = lookPos.getX()
			tpY = lookPos.getY()-2 //tpY = "tpY-1" so +1 to counter that
			tpZ = lookPos.getZ()
			print(prefix+"Position was set to: "+tpX+" "+tpY+" "+tpZ)

			renderSelected = true
			switchedMode = false
			tpPos = lookPos;

			selectTimer.reset()
			renderTimer.reset()
		}
        if (mc.thePlayer.isSpectator() && teleportMode.get() == "Spectator") {
            tryTeleport = true;
            sendPacket(new C04PacketPlayerPosition(tpX, tpY, tpZ, true))
        }
		if (tryTeleport == true) {
			packets++;
            sendPacket(new C04PacketPlayerPosition(tpX, tpY, tpZ, true))
			if (!mc.thePlayer.isSpectator()) {
				if (mc.thePlayer.posX == tpX && mc.thePlayer.posZ == tpZ) {
					print(prefix+"Teleported sucessfully with "+packets+" packets!");
				} else {
					print(prefix+"Teleport failed! Sent packets: "+packets);
				}
				this.module.setState(false)
			}
			if (limitPackets.get() && packets >= maxPackets.get()) {
				print(prefix+"Sent too many packets! ("+packets+")");
				this.module.setState(false);
			}
		}
        if (detectionMode.get() == "Spectator" && tryTeleport == false && mc.thePlayer.isSpectator() && teleportMode.get() == "ServerBased") {
			if (switchedMode == false) teleportTimer.reset(), switchedMode = true;
			var waitTime = parseInt((5 - sendPeriod.get().toFixed(1)).toFixed(1).toString().replace(/[.]/g, "")+"00")
			if (teleportTimer.hasTimePassed(waitTime)) {
				tryTeleport = true;
				teleportTimer.reset()
				print(prefix+"§c§lTeleporting...")
			}
		}
	},
	onPacket: function(e) {
		if (packet instanceof S45PacketTitle && packet.getMessage().getUnformattedText().contains(sendPeriod.get().toFixed(1).toString()) && detectionMode.get() == "PacketTitle" && teleportMode.get() == "ServerBased" && tryTeleport == false) {
			tryTeleport = true
			print(prefix+"§c§lTeleporting...")
		}
		if (packet instanceof S45PacketTitle && cancelTitle.get()) e.cancelEvent();
	},
	onRender3D: function() {
		isBlock = mc.thePlayer.rayTrace(255, 1).typeOfHit != "MISS"

		if (isBlock) {
			lookPos = mc.thePlayer.rayTrace(255, 1).getBlockPos()
			if (renderSelected == false) {
				RenderUtils.drawBlockBox(lookPos, Color.GREEN, true)
			} else {
				RenderUtils.drawBlockBox(tpPos, Color.RED, true)
				if (renderTimer.hasTimePassed(400)) renderSelected = false;
			}
		}
	},
	onRender2D: function() {
		if (blockInfo.get()) {
			if (isBlock) {
				if (renderSelected == false && tryTeleport == false) {
					Gui.drawRect(470, 280, 340, 335, new Color(20,20,20).getRGB());
					Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
					mcFont.drawString("Looking at: (ID: "+Block.getIdFromBlock(BlockUtils.getBlock(lookPos))+")", 346, 286, 0xFFFFFF);

					Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
					mcFont.drawString(getBlockName(lookPos).toUpperCase(), 345, 305, 0xFFFFFF);
					mcFont.drawString(selectButton.get()+"-Click to select!", 345, 320, 0xFFFFFF);
				} else if (tryTeleport == false) {
					Gui.drawRect(470, 280, 340, 301, new Color(20,20,20).getRGB());
					Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
					mcFont.drawString("§a§lSelected! §a"+tpX+" "+tpY+" "+tpZ, 346, 286, 0xFFFFFF);
				}
			}
			if (tryTeleport == true) {
				Gui.drawRect(470, 280, 340, 301, new Color(20,20,20).getRGB());
				Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
				mcFont.drawString("§c§lTeleporting...", 346, 286, 0xFFFFFF);
			}
		}
	}
}

Console = {
    name: "JartexScript-Console",
    aliases: ["js", "jm", "jxscript"],
    version: script.version,
    handler: {
        state: function() {
            playSound("random.successful_hit")
            print(prefix+"JartexScript was meant to be private. Therefore it's mostly outdated! [v."+script.scriptVersion+"]")
        },
        log: function() {
            playSound("random.successful_hit")
            try {
                print(HttpUtils.get(new URL("https://raw.githubusercontent.com/FaaatPotato/JartexScript-2.0/main/log")))
            } catch (e) {
                print("Couldn't get log data! "+e)
            }
        },
        showcases: function() {
            clearChat()
            playSound("random.successful_hit")

            print("")
            addCustomChat(prefix+"Showcases can be found here!", "https://www.youtube.com/FaaatPotato", "§a§lClick me!")
            print("")
        },
        listexternal: function() {
            clearChat()
            playSound("random.successful_hit")
            print("")
            for each (var url in scriptsToDownload) addCustomChat(prefix+url.slice(url.lastIndexOf("/") + 1, -3), url, "§a§lClick me!");
            print("")
        },
        bypassfinders: function() {
            clearChat()
            playSound("mob.cat.meow");
            print(prefix+"Testing and trying:")
            print("")
            addCustomChat("§c§l@§7§lAlienGurke", "https://forums.ccbluex.net/user/alien-gurke", "§a§lClick me!")
            addCustomChat("§c§l@§7§lClientQUI", "https://forums.ccbluex.net/user/clientqui-0", "§a§lClick me!")
        },
        credits: function() {
            credits.set(true)
        },
        changenick: function() {
            IncognitoModule.getValue("Change Now").set(true)
        }
    }
}

command = [Console]
module = [JartexManager, MatrixFucker, MatrixLongJump, MatrixUtility, MatrixFly, AutoInsult, DeathTeleport];
