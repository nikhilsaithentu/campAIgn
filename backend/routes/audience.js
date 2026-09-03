const express = require('express')
const router = express.Router()

// POST /api/audience/filter — manual filter
router.post('/filter', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { segment, preferredChannel, minLifetimeValue, maxLifetimeValue, minPurchases, tags } = req.body

    // Build filter query from whatever was provided
    const query = {}
    if (segment) query.segment = segment
    if (preferredChannel) query.preferredChannel = preferredChannel
    if (minLifetimeValue || maxLifetimeValue) {
      query.lifetimeValue = {}
      if (minLifetimeValue) query.lifetimeValue.$gte = Number(minLifetimeValue)
      if (maxLifetimeValue) query.lifetimeValue.$lte = Number(maxLifetimeValue)
    }
    if (minPurchases) query.totalPurchases = { $gte: Number(minPurchases) }
    if (tags && tags.length > 0) query.tags = { $in: tags }

    const customers = await db.collection('customers')
      .find(query, { projection: { _id: 0 } })
      .toArray()

    res.json({
      count: customers.length,
      filters: req.body,
      customers
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/audience/auto-select — ML based auto selection
router.post('/auto-select', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignType, minConfidence = 0.5 } = req.body

    if (!campaignType) {
      return res.status(400).json({ error: 'campaignType is required' })
    }

    // Get targeting scores where this campaign type is recommended
    // and confidence is above the threshold
    const scores = await db.collection('targeting_scores')
      .find(
        { recommendedCampaignType: campaignType, confidence: { $gte: minConfidence } },
        { projection: { _id: 0 } }
      )
      .toArray()

    // Get full customer details for each matched customer
    const customerIds = scores.map(s => s.customerId)
    const customers = await db.collection('customers')
      .find({ id: { $in: customerIds } }, { projection: { _id: 0 } })
      .toArray()

    // Merge customer details with their targeting scores
    const audience = customers.map(c => {
      const score = scores.find(s => s.customerId === c.id)
      return {
        ...c,
        targetingScore: score?.scores?.[campaignType] || 0,
        confidence: score?.confidence || 0,
        recommendedCampaignType: score?.recommendedCampaignType
      }
    }).sort((a, b) => b.targetingScore - a.targetingScore)

    res.json({
      campaignType,
      minConfidence,
      count: audience.length,
      audience
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/audience/segments — available segments for filter dropdowns
router.get('/segments', async (req, res) => {
  try {
    const db = req.app.locals.db
    const segments = await db.collection('customers').distinct('segment')
    const channels = await db.collection('customers').distinct('preferredChannel')
    res.json({ segments, channels })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router