///api_version=2
(script = registerScript({
   name: "Skeleton",
   version: "1.0.0",
   authors: ["FaaatPotato"]
}));

GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager")
RenderPlayer = Java.type("net.minecraft.client.renderer.entity.RenderPlayer")
GL11 = Java.type("org.lwjgl.opengl.GL11")
Frustum = Java.type("net.minecraft.client.renderer.culling.Frustum")
Vec3 = Java.type("net.minecraft.util.Vec3")
renderManager = mc.getRenderManager()
HashMap = Java.type("java.util.HashMap")
ModelRenderer = Java.type("net.minecraft.client.model.ModelRenderer")
EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
entityList = new HashMap()

list = {
   lineWidth: Setting.integer({
      name: "LineWidth",
      default: 1,
      min: 1,
      max: 10
   }),
   r: Setting.integer({
      name: "Red",
      default: 1,
      min: 1,
      max: 10
   }),
   g: Setting.integer({
      name: "Green",
      default: 1,
      min: 1,
      max: 10
   }),
   b: Setting.integer({
      name: "Blue",
      default: 1,
      min: 1,
      max: 10
   }),
   alpha: Setting.integer({
      name: "Alpha",
      default: 1,
      min: 1,
      max: 10
   }),
}

script.registerModule({
   name: "Skeleton",
   category: "Render",
   description: "Renders player-skeleton",
   settings: list,
}, function (module) {
   module.on("update", function() {
   });
   module.on("render3D", function() {
      updateList()
      for (var player in entityList) {
         var playerData = entityList.get(player)
         
         var headRotation = playerData.headRotation,
             rightArmRotation = playerData.rightArmRotation,
             leftLegRotation = playerData.leftLegRotation,
             rightLegRotation = playerData.rightLegRotation,
             leftArmRotation = playerData.leftArmRotation

         //DEBUG - rotations get overwritten, something aint right here
         /*Chat.print(player.getName()+" "+
            headRotation+" "+
            rightArmRotation+" "+
            leftLegRotation+" "+
            rightLegRotation+" "+
            leftArmRotation
         );*/
         
         //setting up camera
         var posX = mc.thePlayer.lastTickPosX + (mc.thePlayer.posX - mc.thePlayer.lastTickPosX) * mc.timer.renderPartialTicks
         var posY = mc.thePlayer.lastTickPosY + (mc.thePlayer.posY - mc.thePlayer.lastTickPosY) * mc.timer.renderPartialTicks
         var posZ = mc.thePlayer.lastTickPosZ + (mc.thePlayer.posZ - mc.thePlayer.lastTickPosZ) * mc.timer.renderPartialTicks
         var camFrustum = new Frustum()
         camFrustum.setPosition(posX, posY, posZ)

         if (player && !player.isDead && player.isEntityAlive() && camFrustum.isBoundingBoxInFrustum(player.getEntityBoundingBox())) {
            //used variables
            GL11.glPushMatrix();
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);

            var xOffset = player.prevRenderYawOffset + (player.renderYawOffset - player.prevRenderYawOffset) * mc.timer.renderPartialTicks;
            var yOffset = player.isSneaking() ? 0.6 : 0.75

            //translating to traget pos
            var x = player.lastTickPosX + (player.posX - player.lastTickPosX) * mc.timer.renderPartialTicks - renderManager.renderPosX;
            var y = player.lastTickPosY + (player.posY - player.lastTickPosY) * mc.timer.renderPartialTicks - renderManager.renderPosY;
            var z = player.lastTickPosZ + (player.posZ - player.lastTickPosZ) * mc.timer.renderPartialTicks - renderManager.renderPosZ;
            GL11.glTranslated(x, y, z)

            //setting up
            GL11.glLineWidth(module.settings.lineWidth.get());
            glColor(200.0, 0.0, 0.0, 255.0)

            GL11.glRotatef(-xOffset, 0, 1, 0)

            GL11.glTranslated(0.0, 0.0, player.isSneaking() ? -0.235 : 0.0);

            GL11.glPushMatrix() //right leg
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(100.0, 100.0, 0.0, 255.0)
            GL11.glTranslated(-0.125, yOffset, 0)

            if (rightLegRotation[0] != 0) {
               GL11.glRotatef(rightLegRotation[0] * 57.295776, 1.0, 0.0, 0.0);
            }
            if (rightLegRotation[1] != 0.0) {
               GL11.glRotatef(rightLegRotation[1] * 57.295776, 0.0, 1.0, 0.0);
            }
            if (rightLegRotation[2] != 0.0) {
               GL11.glRotatef(rightLegRotation[2] * 57.295776, 0.0, 0.0, 1.0);
            }

            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, -yOffset, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glPushMatrix(); //left leg
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);

            glColor(200.0, 50.0, 0.0, 255.0)
            GL11.glTranslated(0.125, yOffset, 0.0);

            if (leftLegRotation[0] != 0.0) {
               GL11.glRotatef(leftLegRotation[0] * 57.295776, 1.0, 0.0, 0.0);
            }
            if (leftLegRotation[1] != 0.0) {
               GL11.glRotatef(leftLegRotation[1] * 57.295776, 0.0, 1.0, 0.0);
            }
            if (leftLegRotation[2] != 0.0) {
               GL11.glRotatef(leftLegRotation[2] * 57.295776, 0.0, 0.0, 1.0);
            }

            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, -yOffset, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glTranslated(0.0, 0.0, player.isSneaking() ? 0.25 : 0.0);

            GL11.glPushMatrix();
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(10.0, 200.0, 40.0, 255.0)
            GL11.glTranslated(0.0, player.isSneaking() ? -0.05 : 0.0, player.isSneaking() ? -0.01725 : 0.0);
            
            GL11.glPushMatrix(); //right arm
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);

            glColor(50.0, 10.0, 40.0, 255.0)
            GL11.glTranslated(-0.375, yOffset + 0.55, 0.0);

            if (rightArmRotation[0] != 0.0) {
               GL11.glRotatef(rightArmRotation[0] * 57.295776, 1.0, 0.0, 0.0);
            }
            if (rightArmRotation[1] != 0.0) {
               GL11.glRotatef(rightArmRotation[1]* 57.295776, 0.0, 1.0, 0.0);
            }
            if (rightArmRotation[2] != 0.0) {
               GL11.glRotatef(-rightArmRotation[2] * 57.295776, 0.0, 0.0, 1.0);
            }

            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, -0.5, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glPushMatrix(); //left arm
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(50.0, 10.0, 255.0, 255.0)
            GL11.glTranslated(0.375, yOffset + 0.55, 0.0);

            if (leftArmRotation[0] != 0.0) {
               GL11.glRotatef(leftArmRotation[0] * 57.295776, 1.0, 0.0, 0.0);
            }
            if (leftArmRotation[1] != 0.0) {
               GL11.glRotatef(leftArmRotation[1] * 57.295776, 0.0, 1.0, 0.0);
            }
            if (leftArmRotation[2] != 0.0) {
               GL11.glRotatef(-leftArmRotation[2] * 57.295776, 0.0, 0.0, 1.0);
            }

            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, -0.5, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glRotatef(xOffset - player.rotationYawHead, 0.0, 1.0, 0.0);

            GL11.glPushMatrix(); //head
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(0.0, 255.0, 0.0, 255.0)
            GL11.glTranslated(0.0, yOffset + 0.55, 0.0);

            if (headRotation[0] != 0.0) {
               GL11.glRotatef(headRotation[0] * 57.295776, 1.0, 0.0, 0.0);
            }

            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, 0.3, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();
            
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH);
            
            GL11.glPopMatrix();
            
            //if player sneaking
            GL11.glRotatef(player.isSneaking() ? 25.0 : 0.0, 1.0, 0.0, 0.0);
            GL11.glTranslated(0.0, player.isSneaking() ? -0.16175 : 0.0, player.isSneaking() ? -0.48025 : 0.0);

            GL11.glPushMatrix(); //hip bone
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(50.0, 200.0, 200.0, 255.0)
            
            GL11.glTranslated(0.0, yOffset, 0.0);
            GL11.glBegin(3);
            GL11.glVertex3d(-0.125, 0.0, 0.0);
            GL11.glVertex3d(0.125, 0.0, 0.0);
            
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glPushMatrix(); //rib vertical
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(110.0, 30.0, 80.0, 255.0)
            GL11.glTranslated(0.0, yOffset, 0.0);
            GL11.glBegin(3);
            GL11.glVertex3d(0.0, 0.0, 0.0);
            GL11.glVertex3d(0.0, 0.55, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH)
            
            GL11.glPopMatrix();

            GL11.glPushMatrix(); //shoulder bone
            GL11.glEnable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_LINE_SMOOTH);
            GL11.glDisable(GL11.GL_TEXTURE_2D);
            GL11.glDisable(GL11.GL_DEPTH_TEST);
            GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
            
            glColor(110.0, 0.0, 100.0, 255.0)
            
            GL11.glTranslated(0.0, yOffset + 0.55, 0.0);
            GL11.glBegin(3);
            GL11.glVertex3d(-0.375, 0.0, 0.0);
            GL11.glVertex3d(0.375, 0.0, 0.0);
            GL11.glEnd();
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH);

            GL11.glPopMatrix();
            
            GL11.glDisable(GL11.GL_BLEND);
            GL11.glEnable(GL11.GL_TEXTURE_2D);
            GL11.glEnable(GL11.GL_DEPTH_TEST);
            GL11.glDisable(GL11.GL_LINE_SMOOTH);
            
            GL11.glPopMatrix()
         }
      }
   });
});

function updateList() {
   entityList.clear();
   for each (var player in mc.theWorld.playerEntities) {
      var model = getPlayerModel(player);
      entityList.put(player, {
         headRotation: [model.bipedHead.rotateAngleX, model.bipedHead.rotateAngleY, model.bipedHead.rotateAngleZ],
         rightArmRotation: [model.bipedRightArm.rotateAngleX, model.bipedRightArm.rotateAngleY, model.bipedRightArm.rotateAngleZ],
         leftLegRotation: [model.bipedLeftLeg.rotateAngleX, model.bipedLeftLeg.rotateAngleY, model.bipedLeftLeg.rotateAngleZ],
         rightLegRotation: [model.bipedRightLeg.rotateAngleX, model.bipedRightLeg.rotateAngleY, model.bipedRightLeg.rotateAngleZ],
         leftArmRotation: [model.bipedLeftArm.rotateAngleX, model.bipedLeftArm.rotateAngleY, model.bipedLeftArm.rotateAngleZ]
      });
   }
}

function glColor(r, g, b, a) {
   return GlStateManager.color(r/255, g/255, b/255, a/255)
}

function getPlayerModel(playerEntity) {
   return renderManager.getEntityRenderObject(playerEntity).getMainModel()
}
