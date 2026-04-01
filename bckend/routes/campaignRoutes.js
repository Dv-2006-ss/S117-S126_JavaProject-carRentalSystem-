const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const campaignController = require("../controllers/campaignController");

// Defensive check to ensure we have functions
const createCampaign = campaignController.createCampaign || ((req, res) => res.status(501).send("Not implemented"));
const getCampaigns = campaignController.getCampaigns || ((req, res) => res.status(501).send("Not implemented"));
const deleteCampaign = campaignController.deleteCampaign || ((req, res) => res.status(501).send("Not implemented"));
const sendCampaign = campaignController.sendCampaign || ((req, res) => res.status(501).send("Not implemented"));

router.post("/", protect, createCampaign);
router.get("/", protect, getCampaigns);
router.delete("/:id", protect, deleteCampaign);
router.post("/send/:id", protect, sendCampaign);
router.post("/email", protect, campaignController.createEmailCampaign);

// ================= HISTORY =================
router.get("/history", protect, campaignController.getCampaignHistory);
router.post("/history", protect, campaignController.saveCampaignHistory);
router.delete("/history/:id", protect, campaignController.deleteCampaignHistory);


module.exports = router;