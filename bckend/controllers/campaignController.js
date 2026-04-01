const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const Template = require("../models/Template");
const bulkService = require("../services/bulkService");
const render = require("../utils/templateRenderer");
const User = require("../models/User");

/* =====================================================
   NEW: CREATE EMAIL CAMPAIGN WITH TEMPLATE
===================================================== */
exports.createEmailCampaign = async (req, res) => {
  try {
    const { name, subject, product, offer, blocks } = req.body;
    let campaign = await Campaign.findOne({ owner: req.user.id, name });
    const html = render(blocks);

    if (campaign) {
      if (campaign.template) {
        await Template.findByIdAndUpdate(campaign.template, { blocks, name: name + " Template" });
      } else {
        const template = await Template.create({ owner: req.user.id, name: name + " Template", blocks });
        campaign.template = template._id;
      }
      campaign.htmlContent = html;
      campaign.subject = subject;
      await campaign.save();
    } else {
      const template = await Template.create({ owner: req.user.id, name: name + " Template", blocks });
      campaign = await Campaign.create({
        owner: req.user.id, name, subject, product, offer, 
        campaignType: "email", template: template._id, htmlContent: html
      });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: "Email creation failed", error: err.message });
  }
};

/* =====================================================
   SEND/SAVE CAMPAIGN (MODERNIZED WITH REAL-TIME WSS)
===================================================== */
exports.saveCampaignHistory = async (req, res) => {
  try {
    const { name, subject, message, type, status, total, audience, scheduledDate } = req.body;
    const io = req.app.get("io");

    let campaign = await Campaign.findOne({ owner: req.user.id, name });
    let newStatus = status === "Complete" ? "sent" : (status === "Scheduled" ? "scheduled" : "draft");

    if (campaign) {
      const updateData = { status: newStatus, htmlContent: message, subject: subject };
      if (scheduledDate) updateData.scheduledAt = new Date(scheduledDate);
      if (audience) updateData.targetAudience = audience;
      campaign = await Campaign.findByIdAndUpdate(campaign._id, { $set: updateData }, { new: true });
    } else {
      campaign = await Campaign.create({
        owner: req.user.id, name, subject: subject || name, campaignType: type,
        status: newStatus, scheduledAt: scheduledDate ? new Date(scheduledDate) : undefined,
        targetAudience: audience || [], sentCount: total, htmlContent: message || ""
      });
    }

    // 🔥 REACTIVE BACKGROUND JOB (Emits to WebSocket)
    if (status === "Complete" && !scheduledDate && audience && audience.length > 0) {
      const userObj = await User.findById(req.user.id);
      const companyName = userObj ? userObj.companyName : "Velox";
      const companyEmail = userObj ? userObj.email : "no-reply@velox.io";

      let totalProcessed = 0;
      
      const onProgress = async (batchResults) => {
        const newLogs = batchResults.map(r => ({ target: r.email || r.phone, status: r.status, error: r.error }));
        const incValue = newLogs.filter(r => r.status === "sent").length;
        totalProcessed += batchResults.length;
        
        await Campaign.findByIdAndUpdate(campaign._id, {
          $push: { deliveryLogs: { $each: newLogs } },
          $inc: { sentCount: incValue }
        });

        // 📡 BROADCAST LIVE PROGRESS TO ALL CONNECTED CLIENTS
        if (io) {
          io.to("stats_room").emit("campaign:progress", {
            campaignId: campaign._id,
            processed: totalProcessed,
            total: audience.length,
            percentage: Math.round((totalProcessed / audience.length) * 100)
          });
        }
      };

      if (type === "sms") {
        bulkService.sendBulkSMS(audience, message, companyName, onProgress).catch(console.error);
      } else {
        bulkService.sendBulkEmails(audience, subject || name, u => (message || "").replace(/{{name}}/gi, u.name || ''), companyName, companyEmail, onProgress).catch(console.error);
      }
    }

    res.json({ success: true, history: campaign });
  } catch (err) {
    res.status(500).json({ message: "Modernized save failed", error: err.message });
  }
};

/* --- Remaining standard methods (history, delete) --- */
exports.getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ owner: req.user.id }).populate('template').sort({ createdAt: -1 });
    res.json(campaigns.map(c => ({
      _id: c._id, name: c.name, type: c.campaignType, status: c.status, 
      total: c.sentCount, date: c.createdAt, deliveryLogs: c.deliveryLogs || []
    })));
  } catch (err) { res.status(500).json({ message: "Fetch failed" }); }
};

exports.deleteCampaignHistory = async (req, res) => {
  try { await Campaign.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ message: "Delete failed" }); }
};

// --- Missing Exports to prevent Router Crash ---
exports.getCampaigns = exports.getCampaignHistory;
exports.createCampaign = exports.saveCampaignHistory;
exports.deleteCampaign = exports.deleteCampaignHistory;
exports.sendCampaign = async (req, res) => {
  res.status(200).json({ success: true, message: "Use saveCampaignHistory with status 'Complete' to trigger sending" });
};