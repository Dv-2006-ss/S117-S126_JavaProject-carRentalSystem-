try {
  const controller = require("./bckend/controllers/campaignController");
  console.log("createCampaign:", typeof controller.createCampaign);
  console.log("getCampaigns:", typeof controller.getCampaigns);
  console.log("deleteCampaign:", typeof controller.deleteCampaign);
  console.log("createEmailCampaign:", typeof controller.createEmailCampaign);
  console.log("getCampaignHistory:", typeof controller.getCampaignHistory);
  console.log("saveCampaignHistory:", typeof controller.saveCampaignHistory);
  console.log("deleteCampaignHistory:", typeof controller.deleteCampaignHistory);
} catch (err) {
  console.error("Require failed:", err.message);
  console.error(err.stack);
}

