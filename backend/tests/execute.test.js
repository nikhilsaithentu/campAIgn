/**
 * execute.test.js
 * ────────────────
 * Tests email execution endpoints.
 * Email service is mocked — no real emails sent during testing.
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app
let db

jest.mock('../services/emailService', () => ({
  sendBulkEmails: jest.fn().mockResolvedValue({
    total: 2, sent: 2, failed: 0,
    results: [
      { customerId: 'C001', email: 'aarav@example.com', status: 'sent', messageId: 'mock-id-1', sentAt: new Date().toISOString() },
      { customerId: 'C002', email: 'priya@example.com', status: 'sent', messageId: 'mock-id-2', sentAt: new Date().toISOString() }
    ]
  }),
  sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'mock-id', sentAt: new Date().toISOString() })
}))

jest.mock('../services/schedulerService', () => ({
  scheduleExecution: jest.fn().mockReturnValue({ jobId: 'mock-job-id', scheduledAt: new Date(Date.now() + 3600000).toISOString(), channel: 'email', campaignId: 'CAM001' }),
  cancelJob: jest.fn().mockReturnValue(true),
  getActiveJobs: jest.fn().mockReturnValue([])
}))

beforeAll(async () => {
  ({ app, db } = await setupTestApp())
  await db.collection('campaign_audience').replaceOne(
    { campaignId: 'CAM001', customerId: 'C001' },
    { campaignId: 'CAM001', customerId: 'C001', selectionMethod: 'manual_filter', status: 'selected', selectedAt: new Date().toISOString() },
    { upsert: true }
  )
}, 15000)

afterAll(async () => {
  await db.collection('email_logs').deleteMany({ campaignId: 'CAM001' })
  await db.collection('scheduled_jobs').deleteMany({ campaignId: 'CAM001' })
  await teardownTestApp()
}, 15000)

describe('POST /api/execute/email/send', () => {

  test('sends emails successfully', async () => {
    const res = await request(app)
      .post('/api/execute/email/send')
      .send({ campaignId: 'CAM001', customerIds: ['C001', 'C002'], subject: 'Test', html: '<p>Hello {{name}}</p>' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.sent).toBe(2)
    expect(res.body.failed).toBe(0)
  })

  test('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/execute/email/send')
      .send({ campaignId: 'CAM001' })

    expect(res.status).toBe(400)
  })

  test('logs sent emails to MongoDB', async () => {
    await request(app)
      .post('/api/execute/email/send')
      .send({ campaignId: 'CAM001', customerIds: ['C001'], subject: 'Log Test', html: '<p>Test</p>' })

    const logs = await db.collection('email_logs').find({ campaignId: 'CAM001' }).toArray()
    expect(logs.length).toBeGreaterThan(0)
  })

  test('updates campaign spentSoFar', async () => {
    const before = await db.collection('campaigns').findOne({ id: 'CAM001' })
    const spentBefore = before.spentSoFar || 0

    await request(app)
      .post('/api/execute/email/send')
      .send({ campaignId: 'CAM001', customerIds: ['C001', 'C002'], subject: 'Spend Test', html: '<p>Test</p>' })

    const after = await db.collection('campaigns').findOne({ id: 'CAM001' })
    expect(after.spentSoFar).toBeGreaterThan(spentBefore)
  })

})

describe('POST /api/execute/email/schedule', () => {

  test('schedules email for future time', async () => {
    const futureDate = new Date(Date.now() + 3600000).toISOString()
    const res = await request(app)
      .post('/api/execute/email/schedule')
      .send({ campaignId: 'CAM001', customerIds: ['C001'], subject: 'Scheduled', html: '<p>Content</p>', scheduledAt: futureDate })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body).toHaveProperty('jobId')
  })

  test('returns 400 for past scheduledAt', async () => {
    const pastDate = new Date(Date.now() - 3600000).toISOString()
    const res = await request(app)
      .post('/api/execute/email/schedule')
      .send({ campaignId: 'CAM001', customerIds: ['C001'], subject: 'Past', html: '<p>Past</p>', scheduledAt: pastDate })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/future/i)
  })

  test('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/execute/email/schedule')
      .send({ campaignId: 'CAM001' })

    expect(res.status).toBe(400)
  })

  test('saves job to MongoDB', async () => {
    const futureDate = new Date(Date.now() + 7200000).toISOString()
    await request(app)
      .post('/api/execute/email/schedule')
      .send({ campaignId: 'CAM001', customerIds: ['C001'], subject: 'DB Test', html: '<p>Content</p>', scheduledAt: futureDate })

    const jobs = await db.collection('scheduled_jobs').find({ campaignId: 'CAM001', status: 'pending' }).toArray()
    expect(jobs.length).toBeGreaterThan(0)
  })

})

describe('GET /api/execute/scheduled', () => {

  test('returns pending scheduled jobs', async () => {
    const res = await request(app).get('/api/execute/scheduled')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('jobs')
    expect(res.body).toHaveProperty('count')
    expect(Array.isArray(res.body.jobs)).toBe(true)
  })

  test('only returns pending jobs', async () => {
    const res = await request(app).get('/api/execute/scheduled')
    res.body.jobs.forEach(job => expect(job.status).toBe('pending'))
  })

})

describe('GET /api/execute/logs/email', () => {

  test('returns email logs', async () => {
    const res = await request(app).get('/api/execute/logs/email')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('logs')
    expect(Array.isArray(res.body.logs)).toBe(true)
  })

  test('filters by campaignId', async () => {
    const res = await request(app).get('/api/execute/logs/email').query({ campaignId: 'CAM001' })
    expect(res.status).toBe(200)
    res.body.logs.forEach(log => expect(log.campaignId).toBe('CAM001'))
  })

  test('returns max 100 logs', async () => {
    const res = await request(app).get('/api/execute/logs/email')
    expect(res.body.logs.length).toBeLessThanOrEqual(100)
  })

})

describe('DELETE /api/execute/scheduled/:jobId', () => {

  test('cancels a scheduled job', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString()
    const scheduleRes = await request(app)
      .post('/api/execute/email/schedule')
      .send({ campaignId: 'CAM001', customerIds: ['C001'], subject: 'Cancel Test', html: '<p>Content</p>', scheduledAt: futureDate })

    const jobId = scheduleRes.body.jobId
    const cancelRes = await request(app).delete(`/api/execute/scheduled/${jobId}`)
    expect(cancelRes.status).toBe(200)
    expect(cancelRes.body.success).toBe(true)
  })

})
