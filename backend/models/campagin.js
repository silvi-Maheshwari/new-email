const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    recipients: { type: [String], required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    scheduledTime: { type: Date  },
    createdAt:{type:Date,default:Date.now}
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
