///api_version=2
(script = registerScript({
    name: "ConfigUtils",
    version: "2.4",
    authors: ["FaaatPotato"]
})).import("Core.lib");

dir = LiquidBounce.fileManager.settingsDir, filteredSettings = [], fileList = Java.from(dir.listFiles());

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

function printMessage(message) {
    clearChat()
    print("")
    print(message)
    print("")
}

ConfigUtils = {
    name: "ConfigUtils",
    aliases: ["configutils", "cutils", "cu"],
    version: script.version,
    handler: {
        save: function(moduleName) {
            try {
                var settingsFile = new File(dir, moduleName+"SettingsCS")

                if (isValidModule(moduleName)) {
                    if (!settingsFile.exists()) {
                        if (!isRenderModule(moduleName)) {
				            for each (var line in parseLines()) {
					            if (line.split(" ")[0] == moduleName) filteredSettings.push(line);
				            }
                            if (filteredSettings.length) {
                                FileUtils.writeLines(new File(dir, moduleName+"SettingsCS"), filteredSettings);
                                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Saved config as: §a§l"+moduleName+"SettingsCS§7§l!");
                            } else {
                                printMessage("§8§l[§c§lConfigUtils§8§l]§7 '§c§l"+moduleName+"§7' has no settings to save!");
                            }
                        } else {
                            printMessage("§8§l[§c§lConfigUtils§8§l]§7 Render-Modules can't be saved!");
                        }
                    } else {
                        printMessage("§8§l[§c§lConfigUtils§8§l]§7 File already exists! '§c§l"+moduleName+"SettingsCS§7'");
                    }
                } else {
                    printMessage("§8§l[§c§lConfigUtils§8§l]§7 Couldn't find module named '§c§l"+moduleName+"§7'");
                }
            } catch (e) {
                print(e)
            }
            filteredSettings = [];
        },
        saveactive: function() {
            var activeModules = [];
            for each (var module in moduleManager.modules) {
                if (module.getState()) activeModules.push(module.name)
            }
            for each (var line in parseLines()) {
                for each (var moduleName in activeModules) {
                    if (line.split(" ")[0] == moduleName) filteredSettings.push(line)
                }
            }

            clearChat()
            if (filteredSettings.length) {
                FileUtils.writeLines(new File(dir, "ActiveModuleSettingsCS"), filteredSettings);
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Saved config as: §a§lActiveModuleSettingsCS§7§l!");
            } else {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 No active modules found!");
            }
            filteredSettings = [];
        },
        toggleconfig: function(configName) {
            clearChat()
            try {
                var configFile = Java.from(dir.listFiles()).find(function (file) file.getName() == configName);
                var lineList = FileUtils.readLines(new File(dir, configName));

                for each (var line in lineList) {
                    for each (var module in moduleManager.modules) {
                        if (!module.getState()) moduleManager.getModule(line.split(" ")[0]).setState(true)
                    }
                }
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Toggeled modules! (Non-Render)");
            } catch (e) {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 '§c§l"+configName+"§7' does not exist!");
                fileList.forEach(function (file) print("§8§l[§c§lConfigUtils§8§l]§7 "+file.getName()))
                print("")
            }
        },
        del: function(fileName) {
            clearChat()
            var fileToDelete = new File(dir, fileName);

            if (fileToDelete.exists()) {
                fileToDelete.delete()
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 Deleted file '§c§l"+fileName+"§7'");
            } else {
                printMessage("§8§l[§c§lConfigUtils§8§l]§7 File does not exist! '§c§l"+fileName+"§7'");
            }
        },
        delall: function() {
            var createdFiles = Java.from(dir.listFiles()).filter(function (file) file.getName().endsWith("SettingsCS"))
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
    }
}

command = ConfigUtils;
