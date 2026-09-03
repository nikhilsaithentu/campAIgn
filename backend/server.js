require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const campaignsRouter    = require('./routes/campaigns')
const customersRouter    = require('./routes/customers')
const analyticsRouter    = require('./routes/analytics')
const insightsRouter     = require('./routes/insights')
const audienceRouter     = require('./routes/audience')
const executeRouter      = require('./routes/execute')
const contentRouter      = require('./routes/content')
const intelligenceRouter = require('./routes/intelligence')
const chatRouter         = require('./routes/chat')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const startServer = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
    app.locals.db = client.db('marketing_platform')
    console.log('✅ Connected to MongoDB Atlas')

    app.use('/api/campaigns',    campaignsRouter)
    app.use('/api/customers',    customersRouter)
    app.use('/api/analytics',    analyticsRouter)
    app.use('/api/insights',     insightsRouter)
    app.use('/api/audience',     audienceRouter)
    app.use('/api/execute',      executeRouter)
    app.use('/api/content',      contentRouter)
    app.use('/api/intelligence', intelligenceRouter)
    app.use('/api/chat',         chatRouter)

    app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        message: 'Marketing Platform API running',
        endpoints: {
          campaigns:    ['GET /', 'GET /analytics', 'GET /:id', 'POST /create', 'PATCH /:id', 'PATCH /:id/status', 'DELETE /:id'],
          customers:    ['GET /', 'GET /targeting'],
          analytics:    ['GET /channel', 'GET /segment', 'GET /channel-segment'],
          insights:     ['GET /targeting', 'GET /narrative', 'GET /segments'],
          audience:     ['POST /filter', 'POST /auto-select', 'POST /confirm', 'POST /move', 'GET /:campaignId', 'DELETE /:campaignId/:customerId'],
          execute:      ['POST /email/send', 'POST /email/schedule', 'POST /sms/send', 'POST /sms/schedule', 'GET /scheduled', 'DELETE /scheduled/:jobId', 'GET /logs/email', 'GET /logs/sms'],
          content:      ['POST /generate', 'GET /:campaignId'],
          intelligence: ['GET /', 'GET /:campaignId'],
          chat:         ['POST /', 'DELETE /session/:sessionId']
        }
      })
    })

    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`)
      console.log(`📋 API docs: http://localhost:${PORT}/api/health`)
    })

  } catch (err) {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  }
}

startServer()