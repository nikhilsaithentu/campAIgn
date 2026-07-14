const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb')

// GET /api/campaigns — all campaigns
router.get('/', async (req, res) => {
  try {
    const client = req.app.locals.db
    const campaigns = await client
      .collection('campaigns')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/campaigns/analytics — campaign KPIs from Databricks
router.get('/analytics', async (req, res) => {
  try {
    const client = req.app.locals.db
    const analytics = await client
      .collection('analytics_campaign')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(analytics)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
