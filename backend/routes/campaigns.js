const express = require('express')
const router = express.Router()

// GET /api/campaigns — all campaigns
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const campaigns = await db.collection('campaigns').find({}, { projection: { _id: 0 } }).toArray()
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/campaigns/analytics
router.get('/analytics', async (req, res) => {
  try {
    const db = req.app.locals.db
    const analytics = await db.collection('analytics_campaign').find({}, { projection: { _id: 0 } }).toArray()
    res.json(analytics)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db
    const campaign = await db.collection('campaigns').findOne({ id: req.params.id }, { projection: { _id: 0 } })
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    res.json(campaign)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/campaigns/create
router.post('/create', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { name, type, channels, targetSegments, budget, startDate, endDate, goal, description } = req.body

    // Validate required fields
    if (!name || !type || !channels || !budget || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: name, type, channels, budget, startDate, endDate' })
    }

    // Generate campaign ID
    const count = await db.collection('campaigns').countDocuments()
    const id = `CAM${String(count + 1).padStart(3, '0')}`

    const campaign = {
      id,
      name,
      type,
      status: 'draft',
      channels: Array.isArray(channels) ? channels : [channels],
      targetSegments: Array.isArray(targetSegments) ? targetSegments : [targetSegments],
      budget: Number(budget),
      spentSoFar: 0,
      goal: goal || 'increase_sales',
      description: description || '',
      targetReach: 0,
      actualReach: 0,
      createdBy: 'platform_user',
      startDate,
      endDate,
      sourceSystem: 'marketing-platform',
      createdAt: new Date().toISOString()
    }

    await db.collection('campaigns').insertOne(campaign)

    // Remove MongoDB _id from response
    delete campaign._id
    res.status(201).json({ success: true, campaign })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/campaigns/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { status } = req.body
    const validStatuses = ['draft', 'active', 'paused', 'completed']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
    }

    const result = await db.collection('campaigns').updateOne(
      { id: req.params.id },
      { $set: { status, updatedAt: new Date().toISOString() } }
    )

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Campaign not found' })
    res.json({ success: true, id: req.params.id, status })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/campaigns/:id — update campaign fields
router.patch('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db
    const updates = { ...req.body, updatedAt: new Date().toISOString() }
    delete updates.id // prevent ID change

    const result = await db.collection('campaigns').updateOne(
      { id: req.params.id },
      { $set: updates }
    )

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Campaign not found' })
    res.json({ success: true, id: req.params.id, updates })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db
    const result = await db.collection('campaigns').deleteOne({ id: req.params.id })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Campaign not found' })
    res.json({ success: true, id: req.params.id, message: 'Campaign deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router