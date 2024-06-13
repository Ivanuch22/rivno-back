const Router = require("express");
const router = new Router();

const AddonController = require("../controlers/addonContorller");
const authMiddleWare = require("../middleware/authMiddleware");




router.get("/all", authMiddleWare, AddonController.getAllAddons);
router.get("/by-plan/:plan_id", authMiddleWare, AddonController.getAddonsByPlanId);
router.post("/create", authMiddleWare, AddonController.createAddon);
router.put("/update", authMiddleWare, AddonController.updateAddon);
router.delete("/delete", authMiddleWare, AddonController.deleteAddon);


module.exports = router;


