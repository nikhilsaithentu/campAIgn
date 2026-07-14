const express = require('express')
const router = express.Router()

// GET /api/customers — all customers
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const customers = await db
      .collection('customers')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(customers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/customers/targeting — ML targeting scores
router.get('/targeting', async (req, res) => {
  try {
    const db = req.app.locals.db
    const scores = await db
      .collection('targeting_scores')
      .find({}, { projection: { _id: 0 } })
      .toArray()
    res.json(scores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
