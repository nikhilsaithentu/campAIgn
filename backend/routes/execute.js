const express = require('express')
const router = express.Router()
const { sendBulkEmails } = require('../services/emailService')
const { sendBulkSMS } = require('../services/smsService')
const { scheduleExecution, cancelJob, getActiveJobs } = require('../services/schedulerService')
const { randomUUID: uuidv4 } = require('crypto')

// POST /api/execute/email/send — send emails immediately
router.post('/email/send', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId, customerIds, subject, html } = req.body

    if (!campaignId || !customerIds || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, customerIds, subject, html' })
    }

    // Fetch customer details for the selected IDs
    const customers = await db.collection('customers')
      .find({ id: { $in: customerIds } }, { projection: { _id: 0 } })
      .toArray()

    const recipients = customers.map(c => ({
      customerId: c.id,
      name: c.name,
      email: c.email
    }))

    // Send emails
    const result = await sendBulkEmails({ recipients, subject, html, campaignId })

    // Log to MongoDB
    const logEntries = result.results.map(r => ({
      ...r,
      campaignId,
      subject,
      channel: 'email',
      type: 'immediate'
    }))

    if (logEntries.length > 0) {
      await db.collection('email_logs').insertMany(logEntries)
    }

    // Update campaign spend
    const costPerEmail = 2 // ₹2 per email
    await db.collection('campaigns').updateOne(
      { id: campaignId },
      { $inc: { spentSoFar: result.sent * costPerEmail } }
    )

    res.json({
      success: true,
      campaignId,
      ...result
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/execute/email/schedule — schedule email for later
router.post('/email/schedule', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId, customerIds, subject, html, scheduledAt } = req.body

    if (!campaignId || !customerIds || !subject || !html || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, customerIds, subject, html, scheduledAt' })
    }

    // Validate scheduled time is in the future
    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({ error: 'scheduledAt must be a future date/time' })
    }

    // Fetch recipients
    const customers = await db.collection('customers')
      .find({ id: { $in: customerIds } }, { projection: { _id: 0 } })
      .toArray()

    const recipients = customers.map(c => ({
      customerId: c.id,
      name: c.name,
      email: c.email
    }))

    const jobId = uuidv4()

    // Save job to MongoDB
    await db.collection('scheduled_jobs').insertOne({
      jobId,
      campaignId,
      channel: 'email',
      subject,
      recipientCount: recipients.length,
      scheduledAt,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Schedule the execution
    scheduleExecution({ jobId, channel: 'email', scheduledAt, recipients, subject, content: html, campaignId, db })

    res.json({
      success: true,
      jobId,
      campaignId,
      scheduledAt,
      recipientCount: recipients.length,
      message: `Email scheduled for ${scheduledAt}`
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/execute/sms/send — send SMS immediately
router.post('/sms/send', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId, customerIds, message } = req.body

    if (!campaignId || !customerIds || !message) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, customerIds, message' })
    }

    const customers = await db.collection('customers')
      .find({ id: { $in: customerIds } }, { projection: { _id: 0 } })
      .toArray()

    const recipients = customers.map(c => ({
      customerId: c.id,
      name: c.name,
      phone: c.phone || null
    })).filter(r => r.phone) // only customers with phone numbers

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No customers with phone numbers found' })
    }

    const result = await sendBulkSMS({ recipients, message, campaignId })

    const logEntries = result.results.map(r => ({
      ...r,
      campaignId,
      message,
      channel: 'sms',
      type: 'immediate'
    }))

    if (logEntries.length > 0) {
      await db.collection('sms_logs').insertMany(logEntries)
    }

    res.json({ success: true, campaignId, ...result })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/execute/sms/schedule — schedule SMS for later
router.post('/sms/schedule', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId, customerIds, message, scheduledAt } = req.body

    if (!campaignId || !customerIds || !message || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields: campaignId, customerIds, message, scheduledAt' })
    }

    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({ error: 'scheduledAt must be a future date/time' })
    }

    const customers = await db.collection('customers')
      .find({ id: { $in: customerIds } }, { projection: { _id: 0 } })
      .toArray()

    const recipients = customers.map(c => ({
      customerId: c.id,
      name: c.name,
      phone: c.phone || null
    })).filter(r => r.phone)

    const jobId = uuidv4()

    await db.collection('scheduled_jobs').insertOne({
      jobId,
      campaignId,
      channel: 'sms',
      recipientCount: recipients.length,
      scheduledAt,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    scheduleExecution({ jobId, channel: 'sms', scheduledAt, recipients, content: message, campaignId, db })

    res.json({
      success: true,
      jobId,
      campaignId,
      scheduledAt,
      recipientCount: recipients.length,
      message: `SMS scheduled for ${scheduledAt}`
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/execute/scheduled — view all scheduled jobs
router.get('/scheduled', async (req, res) => {
  try {
    const db = req.app.locals.db
    const jobs = await db.collection('scheduled_jobs')
      .find({ status: 'pending' }, { projection: { _id: 0 } })
      .toArray()
    res.json({ count: jobs.length, jobs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/execute/scheduled/:jobId — cancel a scheduled job
router.delete('/scheduled/:jobId', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { jobId } = req.params
    const cancelled = cancelJob(jobId)

    await db.collection('scheduled_jobs').updateOne(
      { jobId },
      { $set: { status: 'cancelled', cancelledAt: new Date().toISOString() } }
    )

    res.json({ success: true, jobId, cancelled })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/execute/logs/email — email send history
router.get('/logs/email', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId } = req.query
    const query = campaignId ? { campaignId } : {}
    const logs = await db.collection('email_logs')
      .find(query, { projection: { _id: 0 } })
      .sort({ sentAt: -1 })
      .limit(100)
      .toArray()
    res.json({ count: logs.length, logs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/execute/logs/sms — SMS send history
router.get('/logs/sms', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId } = req.query
    const query = campaignId ? { campaignId } : {}
    const logs = await db.collection('sms_logs')
      .find(query, { projection: { _id: 0 } })
      .sort({ sentAt: -1 })
      .limit(100)
      .toArray()
    res.json({ count: logs.length, logs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router