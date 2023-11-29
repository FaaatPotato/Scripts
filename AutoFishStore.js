///api_version=2
(script = registerScript({
    name: "DepositFish",
    version: "1.0",
    authors: ["some fisherman"]
}));

var GuiChest = Java.type("net.minecraft.client.gui.inventory.GuiChest"),
    ItemFish = Java.type("net.minecraft.item.ItemFishFood")
    
script.registerModule({
    name: "DepositFish",
    category: "Misc",
    description: "Stores fish lol"
 }, function (module) {
    module.on("update", function() {
        if (mc.currentScreen instanceof GuiChest) {
            var inventoryContainer = Java.from(mc.thePlayer.inventoryContainer.getInventory())
            var openContainer = Java.from(mc.thePlayer.openContainer.getInventory())
            var fishSlots = inventoryContainer.filter(function (stack) stack && stack.getItem() instanceof ItemFish/*|| you can add more items here, you need to import them*/)

            fishSlots.length && fishSlots.forEach(function (stack) mc.playerController.windowClick(mc.thePlayer.openContainer.windowId, openContainer.indexOf(stack), 0, 1, mc.thePlayer));
        }
    });
});