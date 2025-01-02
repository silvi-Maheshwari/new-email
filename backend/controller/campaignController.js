const campagin = require('../models/campagin');
// const Campaign = require('../models/Campaign');
const nodemailer = require('nodemailer');
// const { format } = require('date-fns');

// Get all campaigns
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await campagin.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific campaign by ID
const getCampaignById = async (req, res) => {
    try {
        const campaign = await campagin.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new campaign
const createCampaign = async (req, res) => {
    const { name, description, recipients, subject, content, scheduled_time } = req.body;

    try {
        const campaign = new campagin({
            name,
            description,
            recipients,
            subject,
            content,
            scheduled_time,
        });
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing campaign
const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { name, description, recipients, subject, content, scheduled_time } = req.body;

    try {
        const campaign = await campagin.findByIdAndUpdate(
            id,
            { name, description, recipients, subject, content, scheduled_time },
            { new: true }
        );
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await campagin.findByIdAndDelete(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send campaign emails
const sendCampaignEmails = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the campaign by ID
        const campaign = await campagin.findById(id); 
        
        // Check if the campaign exists
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Log the campaign to check if recipients are populated
        console.log('Campaign Data:', campaign);

        // Check if recipients are defined and not empty
        if (!campaign.recipients || campaign.recipients.length === 0) {
            return res.status(400).json({ message: 'No recipients defined' });
        }

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',                 // Gmail service
            auth: {
                user: process.env.GMAIL_USER,  // Gmail address
                pass: process.env.GMAIL_PASSWORD,  // Gmail app-specific password
            },
        });

        // Sending emails to all recipients
        const sendEmailPromises = campaign.recipients.map(email => {
            return transporter.sendMail({
                from: process.env.EMAIL_FROM,  // Your email address
                to: email,
                subject: campaign.subject,
                text: campaign.content,
                html: `<p>${campaign.content}</p>`,
            });
        });

        // Wait for all emails to be sent
        await Promise.all(sendEmailPromises);
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ message: error.message });
    }
};




// Get performance metrics for a campaign
const getCampaignMetrics = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await campagin.findById(id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Placeholder metrics for now
        const metrics = {
            totalSent: campaign.recipients.length,
            success: Math.floor(Math.random() * campaign.recipients.length),
            failed: campaign.recipients.length - Math.floor(Math.random() * campaign.recipients.length),
            openRate: Math.random() * 100,
            clickRate: Math.random() * 100,
        };

        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaignEmails,
    getCampaignMetrics,
};
