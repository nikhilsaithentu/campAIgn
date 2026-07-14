const express = require('express')
const router = express.Router()

// GET /api/analytics/channel
router.get('/channel', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('analytics_channel')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/analytics/segment
router.get('/segment', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('analytics_segment')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/analytics/channel-segment
router.get('/channel-segment', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('analytics_channel_segment')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
