///api_version=2
(script = registerScript({
    name: "ConfigUtils",
    version: "3.07",
    authors: ["FaaatPotato"]
})).import("Core.lib");

//Thanks @CzechHek for correcting my incomplete autocomplete and the "filter for duplicates"! <3

var dir = LiquidBounce.fileManager.settingsDir, filteredSettings = [];
var ChatComponentText = Java.type("net.minecraft.util.ChatComponentText"), HoverEvent = Java.type("net.minecraft.event.HoverEvent");
Core.updateURL = "https://raw.githubusercontent.com/FaaatPotato/Scripts/main/ConfigUtils.js";

function isValidModule(name) {
    for each (var module in moduleManager.modules) if (module.name == name) return true;
}

function isRenderModule(name) {
    for each (var module in moduleManager.modules) if (module.name == name && module.category.toString().toLowerCase() == "render") return true;
}

function parseLines() {
    commandManager.executeCommands(".localconfig save fileToFilter");
    clearChat()
    var fileToFilter = new File(dir, "fileToFilter");
    var lineList = FileUtils.readLines(fileToFilter)
    fileToFilter.delete();

    return lineList;
}

function printMessage(message, array, textColor) {
    if (array === undefined) array = null;
    if (textColor === undefined) textColor = "§7§l";
    clearChat()

    if (array) {
        var comp = new ChatComponentText(message); comp.getChatStyle().setChatHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ChatComponentText(textColor+array.map(function (entry) entry).join(textColor+", "))));
        print("")
        mc.thePlayer.addChatMessage(comp)
        print("")
    } else {
        print("")
        print(message)
        print("")
    }
}

ConfigUtils = {
    name: "ConfigUtils",
    aliases: ["configutils", "cutils", "cu"],
    version: script.version,
    handler: {
        save: function(moduleName) {
            var modules = moduleName.split(",").filter(function (entry, i, ar) entry != "" && ar.indexOf(entry) == i), settingsFile = modules.length < 4 ? new File(dir, modules+".CU") : new File(dir, modules.slice(0, 3)+"...CU");

            if (settingsFile.exists()) {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 File already exists! '§c§l"+settingsFile.getName()+"§7'", modules, "§c§l");
                return
            }
            for each (var module in modules) {
                if (!isValidModule(module)) {
                    printMessage("§8§l[§c§lConfigUtils§8§l]§7 Couldn't find module named '§c§l"+module+"§7'")
                    return
                }   
                if (isRenderModule(module)) {
                    printMessage("§8§l[§c§lConfigUtils§8§l]§7 Render-Modules can't be saved! '§c§l"+module+"§7'");
                    return
                }
            }
            try {
                for each (var module in modules) {
                    for each (var line in parseLines()) {
                        if (line.split(" ")[0] == module) filteredSettings.push(line);
                    }
                }
                if (filteredSettings.length) {
                    FileUtils.writeLines(new File(dir, settingsFile.getName()), filteredSettings);
                    printMessage("§8§l[§c§lConfigUtils§8§l]§7 Saved config as: '§a§l"+settingsFile.getName()+"§7'", modules, "§a§l");
                } else {
                    printMessage("§8§l[§c§lConfigUtils§8§l]§7 Modules have no settings to save!", modules, "§c§l");
                }
            } catch (e) {
                print(e)
            }
            filteredSettings = [];
        },
        saveactive: function() {
            var activeModules = [];
            for each (var module in moduleManager.modules) {
                if (module.getState() && module.category.displayName != "Render") activeModules.push(module.name)
            }
            for each (var line in parseLines()) {
                for each (var moduleName in activeModules) {
                    if (line.split(" ")[0] == moduleName) filteredSettings.push(line)
                }
            }
            if (filteredSettings.length) {
                FileUtils.writeLines(new File(dir, "ActiveModules.CU"), filteredSettings);
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Saved config as: '§a§lActiveModules.CU§7'", activeModules, "§a§l");
            } else {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 No active modules found! (Non-render)", ["NONE"], "§c§l");
            }
            filteredSettings = [];
        },
        toggleconfig: function(configName) {
            try {
                var lineList = FileUtils.readLines(new File(dir, configName)), toggeledModules = [];
                for each (var line in lineList) {
                    var target = moduleManager.getModule(line.split(" ")[0])
                    if (!target.getState()) target.setState(true), toggeledModules.push(target.getName());
                } 
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Toggeled modules from config! '§a§l"+configName+"§7'", toggeledModules, "§a§l");
            } catch (e) {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 '§c§l"+configName+"§7' does not exist!");
                Java.from(dir.listFiles()).forEach(function (file) print("§8§l[§c§lConfigUtils§8§l]§7 "+file.getName()))
                print("")
            }
        },
        del: function(fileName) {
            var fileToDelete = new File(dir, fileName);
            if (fileToDelete.exists()) {
                fileToDelete.delete()
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Deleted file '§c§l"+fileName+"§7'");
            } else {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 File does not exist! '§c§l"+fileName+"§7'");
                Java.from(dir.listFiles()).forEach(function (file) print("§8§l[§c§lConfigUtils§8§l]§7 "+file.getName()))
                print("")
            }
        },
        delall: function() {
            var createdFiles = Java.from(dir.listFiles()).filter(function (file) file.getName().endsWith(".CU"))
	        clearChat()
            if (createdFiles.length) {
                print("")
                for each (var file in createdFiles) {
                    file.delete()
                    print("§8§l[§c§lConfigUtils§8§l]§7 Deleted file '§c§l"+file.getName()+"§7'")
                }
                print("")
            } else {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 There are no files to delete!");
            }
        }, 
        folder: function() {
            printMessage("§8§l[§c§lConfigUtils§8§l]§7 Opening folder...");
            openFolder(dir)
        }
    },
    onTabComplete: function(args) {
        if (args[0] == "save") {
            if (args.length == 2) {
                var modules = args[1].split(","),
                    lastModule = modules.pop();
                    return Java.from(moduleManager.modules).filter(function (module) module.getValues().length && module.category.displayName != "Render" && module.name.toLowerCase().startsWith(lastModule.toLowerCase())).map(function (module) (modules.length ? modules + "," : "") + module.name + ",");
            } return
        }
        if (args[0] == "del" || args[0] == "toggleconfig") return Java.from(dir.listFiles()).map(function (file) file.getName());
    }
}

command = ConfigUtils;
