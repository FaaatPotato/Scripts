///api_version=2
(script = registerScript({
    name: "LayerFucker",
    version: "1.0.1",
    authors: ["FaaatPotato", "CzechHek"]
}));

var BlockPos = Java.type("net.minecraft.util.BlockPos"), Block = Java.type("net.minecraft.block.Block"),
    Blocks = Java.type("net.minecraft.init.Blocks"), BlockBed = Java.type("net.minecraft.block.BlockBed"),
    Color = Java.type("java.awt.Color"), BlockDirectional = Java.type("net.minecraft.block.BlockDirectional"),
    C07PacketPlayerDigging = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging"),
    C0APacketAnimation = Java.type("net.minecraft.network.play.client.C0APacketAnimation"),
    EnumFacing = Java.type("net.minecraft.util.EnumFacing"), breakDamage = 0, blockHitDelay = 0, breakingBlock,
    Gui = Java.type("net.minecraft.client.gui.Gui"), GL11 = Java.type("org.lwjgl.opengl.GL11"),
    Tessellator = Java.type("net.minecraft.client.renderer.Tessellator"),
    DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats"),
    ItemStack = Java.type("net.minecraft.item.ItemStack"), RenderHelper = Java.type("net.minecraft.client.renderer.RenderHelper"),
    tessellator = Tessellator.getInstance(), worldRenderer = tessellator.getWorldRenderer(),
    Fonts = Java.type("net.ccbluex.liquidbounce.ui.font.Fonts");

//S

list = {
    range: Setting.integer({
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

script.registerModule({
    name: "LayerFucker",
    category: "World",
    description: "Breaks first layer around bed/bed itself",
    settings: list,
}, function (module) {
    module.on("update", function() {
        if (blockHitDelay > 0) return blockHitDelay--;
        if (breakingBlock) return breakBlock(breakingBlock, module.settings.range.get(), module.settings.swingItem.get());
        var bedPos = getClosestBedPos(module.settings.range.get())
        if (!bedPos) return;

        breakBlock(getBlockToBreak(bedPos, module.settings.range.get()), module.settings.range.get(), module.settings.swingItem.get());
    });
    module.on("render2D", function () {
        if (!breakDamage || !module.settings.renderProgress.get()) return
        var breakPercentage = breakDamage * 100,
            mcFont = Fonts.INSTANCE.getFonts()[0]

        Gui.drawRect(470, 280, 340, 343, new Color(20,20,20).getRGB());
        Gui.drawRect(467, 283, 343, 298, new Color(50, 50, 50).getRGB());
        mcFont.drawString("LayerFucker: (ID: "+Block.getIdFromBlock(getBlock(breakingBlock))+")", 346, 286, 0xFFFFFF);

        Gui.drawRect(467, 301, 343, 332, new Color(50, 50, 50).getRGB());
        mcFont.drawString("Breaking: "+breakPercentage.toFixed(2)+"%", 345, 304, 0xFFFFFF);
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
        
        GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA)
        GL11.glEnable(GL11.GL_BLEND);
        GL11.glDisable(GL11.GL_TEXTURE_2D);
        GL11.glDisable(GL11.GL_DEPTH_TEST);
        GL11.glDepthMask(false)
        GL11.glColor4f(255/255, 0, 0, 50/255)
        
        GL11.glPushMatrix();
            drawBlockBox(getBlockBoundingBox(getBlock(breakingBlock)), true)
        GL11.glPopMatrix();

        GL11.glEnable(GL11.GL_DEPTH_TEST);
        GL11.glEnable(GL11.GL_TEXTURE_2D);
        GL11.glDisable(GL11.GL_BLEND);
        GL11.glDisable(GL11.GL_LINE_SMOOTH)
        GL11.glDepthMask(true)
    });
});

//ported lb-code since core broken with latest lb-builds and no utils
function getBlock(blockPos) {
    return mc.theWorld.getBlockState(blockPos).getBlock();
}

function getBlockBoundingBox(block) {
    var renderManager = mc.getRenderManager()

    var posX = mc.thePlayer.lastTickPosX + (mc.thePlayer.posX - mc.thePlayer.lastTickPosX) * mc.timer.renderPartialTicks// - mc.getRenderManager().renderPosX
    var posY = mc.thePlayer.lastTickPosY + (mc.thePlayer.posY - mc.thePlayer.lastTickPosY) * mc.timer.renderPartialTicks// - mc.getRenderManager().renderPosY
    var posZ = mc.thePlayer.lastTickPosZ + (mc.thePlayer.posZ - mc.thePlayer.lastTickPosZ) * mc.timer.renderPartialTicks// - mc.getRenderManager().renderPosZ
    
    block.setBlockBoundsBasedOnState(mc.theWorld, breakingBlock)
    return block.getSelectedBoundingBox(mc.theWorld, breakingBlock)
        .expand(0.0020000000949949026, 0.0020000000949949026, 0.0020000000949949026)
        .offset(-posX, -posY, -posZ)
}
function drawBlockBox(axisAlignedBB, border) {
    worldRenderer.begin(7, DefaultVertexFormats.POSITION)
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.minX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.minZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.maxY, axisAlignedBB.maxZ).endVertex()
    worldRenderer.pos(axisAlignedBB.maxX, axisAlignedBB.minY, axisAlignedBB.maxZ).endVertex()
    tessellator.draw()
    if (border) drawBoxOutline(axisAlignedBB);
}

function drawBoxOutline(boundingBox) {
    worldRenderer.begin(GL11.GL_LINE_STRIP, DefaultVertexFormats.POSITION)
    GL11.glColor4f(255/255, 0, 0, 255/255)

    worldRenderer.pos(boundingBox.minX, boundingBox.minY, boundingBox.minZ).endVertex()
    worldRenderer.pos(boundingBox.minX, boundingBox.minY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.minY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.minY, boundingBox.minZ).endVertex()
    worldRenderer.pos(boundingBox.minX, boundingBox.minY, boundingBox.minZ).endVertex()

    worldRenderer.pos(boundingBox.minX, boundingBox.maxY, boundingBox.minZ).endVertex()
    worldRenderer.pos(boundingBox.minX, boundingBox.maxY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.maxY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.maxY, boundingBox.minZ).endVertex()
    worldRenderer.pos(boundingBox.minX, boundingBox.maxY, boundingBox.minZ).endVertex()

    worldRenderer.pos(boundingBox.minX, boundingBox.maxY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.minX, boundingBox.minY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.minY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.maxY, boundingBox.maxZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.maxY, boundingBox.minZ).endVertex()
    worldRenderer.pos(boundingBox.maxX, boundingBox.minY, boundingBox.minZ).endVertex()
    tessellator.draw()
}

function getCenterDistance(blockPos) {
    return mc.thePlayer.getDistance(blockPos.getX() + 0.5, blockPos.getY() + 0.5, blockPos.getZ() + 0.5)
} 

//lb-code port lol, pretty smart to refresh closest dist to filter tbh
function getClosestBedPos(radius) {
    var nearestBlockDist = Number.MAX_VALUE
    var nearestBedPos
    
    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            for (var z = -radius; z <= radius; z++) {
                var currentPos = new BlockPos(mc.thePlayer.posX + x, mc.thePlayer.posY + y, mc.thePlayer.posZ + z)
                var dist = getCenterDistance(currentPos)
                
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

//por from JartexScript-2.0, made by me
function getBlockName(blockPos) getBlock(blockPos).getLocalizedName()

//port from JartexScript-2.0, made by CzechHek
function getFacing(state) state.getProperties().get(BlockDirectional.FACING);

function getBlockToBreak(bedPos, range) {
    var state = mc.theWorld.getBlockState(bedPos), facing = getFacing(state);
    
    var bedFootPos = state.getProperties().get(BlockBed.PART) == "head" ? bedPos[facing](-1) : bedPos;
    
    var outerBlocks = [bedFootPos[facing](-1), bedFootPos[facing](2)];

    for each (var direction in ["north", "south", "east", "west", "up"]) {
        if (direction == facing || direction == facing.getOpposite()) continue;
        outerBlocks.push(bedFootPos[direction](1), bedFootPos[direction](1)[facing](1));
    }
    
    if (outerBlocks.some(function (block) mc.theWorld.isAirBlock(block))) return bedPos;
    
    return outerBlocks
		.filter(function (block) getCenterDistance(block) <= range)
        .sort(function (a, b) getCenterDistance(a) - getCenterDistance(b))
        .sort(function (a, b) getBlock(b).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, b) - getBlock(a).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, a))[0];
}

function breakBlock(blockPos, range, swing) {
    if (!blockPos || getCenterDistance(blockPos) > range) {
        if (breakingBlock) {
            blockHitDelay = 4;
            breakDamage = 0;
            breakingBlock = null;
        }
        return
    }
    //you could check for best block even when mining a block and compare its hardness and if it is faster to stop mining this block and start mining the other block

    if (!breakingBlock) breakingBlock = blockPos;
    if (!breakDamage)
        mc.thePlayer.sendQueue.addToSendQueue(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.START_DESTROY_BLOCK, blockPos, EnumFacing.DOWN));
    
    breakDamage += getBlock(blockPos).getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, blockPos);
    if (swing == true) {
        mc.thePlayer.swingItem()
    } else mc.thePlayer.sendQueue.addToSendQueue(new C0APacketAnimation());
    
    if (breakDamage >= 1) {
        mc.thePlayer.sendQueue.addToSendQueue(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK, blockPos, EnumFacing.DOWN));
        mc.playerController.onPlayerDestroyBlock(blockPos, EnumFacing.DOWN);
        blockHitDelay = 4;
        breakDamage = 0;
        breakingBlock = null;
    }
}
