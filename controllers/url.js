const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res)
{
    const body = req.body;
    if(!body.url) return res.status(400).json({error:'URL is required'});

    const shortId = shortid();

    await URL.create({
        shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    //new after ejs
    return res.render("home", {
			id: shortId,
		});
    return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res)
{
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };