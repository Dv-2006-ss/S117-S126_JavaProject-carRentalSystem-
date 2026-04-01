const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const campaignController = require("../controllers/campaignController");

// Guard every route handler so a missing export cannot crash server startup.
const safeHandler = (handlerName) => {
  const handler = campaignController[handlerName];
  if (typeof handler === "function") return handler;

  return (req, res) => {
    res.status(501).json({
      message: `Campaign handler '${handlerName}' is not implemented`,
    });
  };
};

router.post("/", protect, safeHandler("createCampaign"));
router.get("/", protect, safeHandler("getCampaigns"));
router.delete("/:id", protect, safeHandler("deleteCampaign"));
router.post("/send/:id", protect, safeHandler("sendCampaign"));
router.post("/email", protect, safeHandler("createEmailCampaign"));

// ================= HISTORY =================
router.get("/history", protect, safeHandler("getCampaignHistory"));
router.post("/history", protect, safeHandler("saveCampaignHistory"));
router.delete("/history/:id", protect, safeHandler("deleteCampaignHistory"));


module.exports = router;
