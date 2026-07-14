require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const campaignsRouter = require('./routes/campaigns')
const customersRouter = require('./routes/customers')
const analyticsRouter = require('./routes/analytics')
const insightsRouter = require('./routes/insights')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB then start server
const startServer = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()

    // Make db accessible to all routes via app.locals
    app.locals.db = client.db('marketing_platform')
    console.log('✅ Connected to MongoDB Atlas')

    // Routes
    app.use('/api/campaigns', campaignsRouter)
    app.use('/api/customers', customersRouter)
    app.use('/api/analytics', analyticsRouter)
    app.use('/api/insights', insightsRouter)

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Marketing Platform API running' })
    })

    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`)
      console.log(``)
      console.log(`Available endpoints:`)
      console.log(`  GET http://localhost:${PORT}/api/campaigns`)
      console.log(`  GET http://localhost:${PORT}/api/campaigns/analytics`)
      console.log(`  GET http://localhost:${PORT}/api/customers`)
      console.log(`  GET http://localhost:${PORT}/api/customers/targeting`)
      console.log(`  GET http://localhost:${PORT}/api/analytics/channel`)
      console.log(`  GET http://localhost:${PORT}/api/analytics/segment`)
      console.log(`  GET http://localhost:${PORT}/api/analytics/channel-segment`)
      console.log(`  GET http://localhost:${PORT}/api/insights/targeting`)
      console.log(`  GET http://localhost:${PORT}/api/insights/narrative`)
      console.log(`  GET http://localhost:${PORT}/api/insights/segments`)
    })

  } catch (err) {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  }
}

startServer()
