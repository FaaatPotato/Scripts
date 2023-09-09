///api_version=2
(script = registerScript({
    name: "NCPSpeed",
    version: "1.3.3.7",
    authors: ["Kellohylly"] //ported by FaaatPotato
}));

script.registerModule({
    name: "NCPSpeed",
    category: "Fun",
    description: "NCP-Speed",
    settings: {
        nomovestop: Setting.boolean({
            name: "NoMoveStop",
            default: false
        }),
        onlyonmove: Setting.boolean({
            name: "OnlyOnMove",
            default: false
        }),
    },
}, function (module) {
    module.on("disable", function() {
        mc.timer.timerSpeed = 1;
    });
    module.on("motion", function() {
        if (mc.thePlayer.onGround) {
            if ((module.settings.onlyonmove.get() && !isMoving()) || (module.settings.nomovestop.get() && !isMoving())) return;
            
            mc.thePlayer.jump();
            //represents MovementUtils.strafe()
            var yaw = mc.thePlayer.rotationYaw * Math.PI / 180 //represents Math.rad(deg)
            mc.thePlayer.motionX = -Math.sin(yaw) * 0.485
            mc.thePlayer.motionZ = Math.cos(yaw) * 0.485
        }
    });
    module.on("move", function(e) {
        if (module.settings.nomovestop.get() && !isMoving()) e.zeroXZ()
    });
});

//represents MovementUtils.isMoving() -> true/false
function isMoving() {
    if (mc.thePlayer.movementInput.moveForward != 0 || mc.thePlayer.movementInput.moveStrafe != 0) return true;
}