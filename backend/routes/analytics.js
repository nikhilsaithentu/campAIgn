// // Helper function — reuse across all analytics routes
// const getLatestWeekData = async (db, collectionName) => {
//   const latest = await db.collection(collectionName)
//     .findOne({}, { sort: { week: -1 }, projection: { week: 1, _id: 0 } })

//   if (!latest) return []

//   return db.collection(collectionName)
//     .find({ week: latest.week }, { projection: { _id: 0 } })
//     .toArray()
// }


const express = require('express')
const router = express.Router()

const getLatestWeekData = async (db, collectionName) => {
  const latest = await db.collection(collectionName)
    .findOne({}, { sort: { week: -1 }, projection: { week: 1, _id: 0 } })
  if (!latest) return []
  return db.collection(collectionName)
    .find({ week: latest.week }, { projection: { _id: 0 } })
    .toArray()
}

router.get('/channel', async (req, res) => {
  try {
    const data = await getLatestWeekData(req.app.locals.db, 'analytics_channel')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/segment', async (req, res) => {
  try {
    const data = await getLatestWeekData(req.app.locals.db, 'analytics_segment')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/channel-segment', async (req, res) => {
  try {
    const data = await getLatestWeekData(req.app.locals.db, 'analytics_channel_segment')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router