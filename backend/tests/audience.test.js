/**
 * audience.test.js
 * ─────────────────
 * Tests audience filter, auto-select, confirm, and move endpoints.
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app
let db

beforeAll(async () => {
  ({ app, db } = await setupTestApp())
}, 15000)

afterAll(async () => {
  // Clean up test audience records
  await db.collection('campaign_audience').deleteMany({
    campaignId: { $in: ['CAM001', 'CAM002'] },
    selectionMethod: { $in: ['ml_auto_select', 'manual_filter', 'moved'] },
    selectedAt: { $gte: new Date(Date.now() - 60000).toISOString() } // last 60 seconds
  })
  await teardownTestApp()
}, 15000)

// ─────────────────────────────────────────────
// GET /api/audience/segments
// ─────────────────────────────────────────────

describe('GET /api/audience/segments', () => {

  test('returns segments and channels', async () => {
    const res = await request(app).get('/api/audience/segments')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('segments')
    expect(res.body).toHaveProperty('channels')
    expect(Array.isArray(res.body.segments)).toBe(true)
    expect(Array.isArray(res.body.channels)).toBe(true)
  })

  test('segments include known values', async () => {
    const res = await request(app).get('/api/audience/segments')
    expect(res.body.segments).toContain('Young Professional')
  })

  test('channels include known values', async () => {
    const res = await request(app).get('/api/audience/segments')
    expect(res.body.channels).toContain('email')
  })

})

// ─────────────────────────────────────────────
// POST /api/audience/filter
// ─────────────────────────────────────────────

describe('POST /api/audience/filter', () => {

  test('filters by segment', async () => {
    const res = await request(app)
      .post('/api/audience/filter')
      .send({ segment: 'Young Professional' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('count')
    expect(res.body).toHaveProperty('customers')
    res.body.customers.forEach(c => {
      expect(c.segment).toBe('Young Professional')
    })
  })

  test('filters by preferred channel', async () => {
    const res = await request(app)
      .post('/api/audience/filter')
      .send({ preferredChannel: 'email' })

    expect(res.status).toBe(200)
    res.body.customers.forEach(c => {
      expect(c.preferredChannel).toBe('email')
    })
  })

  test('filters by minimum lifetime value', async () => {
    const res = await request(app)
      .post('/api/audience/filter')
      .send({ minLifetimeValue: 30000 })

    expect(res.status).toBe(200)
    res.body.customers.forEach(c => {
      expect(c.lifetimeValue).toBeGreaterThanOrEqual(30000)
    })
  })

  test('returns empty array for impossible filter', async () => {
    const res = await request(app)
      .post('/api/audience/filter')
      .send({ minLifetimeValue: 9999999 })

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(0)
    expect(res.body.customers).toHaveLength(0)
  })

  test('no MongoDB _id exposed in results', async () => {
    const res = await request(app)
      .post('/api/audience/filter')
      .send({ segment: 'Premium Shopper' })

    res.body.customers.forEach(c => {
      expect(c).not.toHaveProperty('_id')
    })
  })

})

// ─────────────────────────────────────────────
// POST /api/audience/auto-select
// ─────────────────────────────────────────────

describe('POST /api/audience/auto-select', () => {

  test('auto-selects customers for retention campaign', async () => {
    const res = await request(app)
      .post('/api/audience/auto-select')
      .send({ campaignType: 'retention', minConfidence: 0.5 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('audience')
    expect(res.body).toHaveProperty('count')
    expect(res.body.campaignType).toBe('retention')
  })

  test('returns 400 when campaignType is missing', async () => {
    const res = await request(app)
      .post('/api/audience/auto-select')
      .send({ minConfidence: 0.5 })

    expect(res.status).toBe(400)
  })

  test('audience sorted by targeting score descending', async () => {
    const res = await request(app)
      .post('/api/audience/auto-select')
      .send({ campaignType: 'promotional', minConfidence: 0.3 })

    const scores = res.body.audience.map(a => a.targetingScore)
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1])
    }
  })

  test('all returned customers meet minimum confidence', async () => {
    const minConf = 0.6
    const res = await request(app)
      .post('/api/audience/auto-select')
      .send({ campaignType: 'retention', minConfidence: minConf })

    res.body.audience.forEach(a => {
      expect(a.confidence).toBeGreaterThanOrEqual(minConf)
    })
  })

})

