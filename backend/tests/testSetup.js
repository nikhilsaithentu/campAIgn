/**
 * testSetup.js
 * ─────────────
 * Shared setup for all test files.
 * Creates a real connection to MongoDB Atlas test database
 * and initialises the Express app with it.
 */

require('dotenv').config()
const { MongoClient } = require('mongodb')
const express = require('express')

const campaignsRouter    = require('../routes/campaigns')
const customersRouter    = require('../routes/customers')
const analyticsRouter    = require('../routes/analytics')
const insightsRouter     = require('../routes/insights')
const audienceRouter     = require('../routes/audience')
const executeRouter      = require('../routes/execute')
const contentRouter      = require('../routes/content')
const intelligenceRouter = require('../routes/intelligence')
const chatRouter         = require('../routes/chat')

let client
let db
let app

const setupTestApp = async () => {
  client = new MongoClient(process.env.MONGO_URI)
  await client.connect()
  db = client.db('marketing_platform')

  app = express()
  app.use(express.json())
  app.locals.db = db

  app.use('/api/campaigns',    campaignsRouter)
  app.use('/api/customers',    customersRouter)
  app.use('/api/analytics',    analyticsRouter)
  app.use('/api/insights',     insightsRouter)
  app.use('/api/audience',     audienceRouter)
  app.use('/api/execute',      executeRouter)
  app.use('/api/content',      contentRouter)
  app.use('/api/intelligence', intelligenceRouter)
  app.use('/api/chat',         chatRouter)

  return { app, db }
}

const teardownTestApp = async () => {
  if (client) await client.close()
}

module.exports = { setupTestApp, teardownTestApp }
