const express = require('express')
const router = express.Router()

// GET /api/insights/targeting — AI targeting recommendations per customer
router.get('/targeting', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('ai_insights')
      .find({ type: 'targeting' }, { projection: { _id: 0 } })
      .toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/insights/narrative — campaign performance narrative
router.get('/narrative', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('ai_insights')
      .findOne({ type: 'performance_narrative' }, { projection: { _id: 0 } })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/insights/segments — segment insights
router.get('/segments', async (req, res) => {
  try {
    const db = req.app.locals.db
    const data = await db
      .collection('ai_insights')
      .findOne({ type: 'segment_insights' }, { projection: { _id: 0 } })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
