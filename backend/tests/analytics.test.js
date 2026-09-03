/**
 * analytics.test.js
 * ──────────────────
 * Tests analytics and AI insights endpoints.
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app

beforeAll(async () => {
  ({ app } = await setupTestApp())
}, 15000)

afterAll(async () => {
  await teardownTestApp()
}, 15000)

// ─────────────────────────────────────────────
// GET /api/analytics/channel
// ─────────────────────────────────────────────

describe('GET /api/analytics/channel', () => {

  test('returns 200 with channel analytics', async () => {
    const res = await request(app).get('/api/analytics/channel')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each record has required fields', async () => {
    const res = await request(app).get('/api/analytics/channel')
    if (res.body.length > 0) {
      res.body.forEach(record => {
        expect(record).toHaveProperty('channel')
        expect(record).toHaveProperty('total_revenue')
        expect(record).toHaveProperty('avg_conversion_rate')
      })
    }
  })

  test('revenue values are positive numbers', async () => {
    const res = await request(app).get('/api/analytics/channel')
    res.body.forEach(record => {
      expect(record.total_revenue).toBeGreaterThan(0)
    })
  })

  test('conversion rates are valid percentages', async () => {
    const res = await request(app).get('/api/analytics/channel')
    res.body.forEach(record => {
      expect(record.avg_conversion_rate).toBeGreaterThanOrEqual(0)
      expect(record.avg_conversion_rate).toBeLessThanOrEqual(100)
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/analytics/segment
// ─────────────────────────────────────────────

describe('GET /api/analytics/segment', () => {

  test('returns 200 with segment analytics', async () => {
    const res = await request(app).get('/api/analytics/segment')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each record has segment and LTV fields', async () => {
    const res = await request(app).get('/api/analytics/segment')
    if (res.body.length > 0) {
      res.body.forEach(record => {
        expect(record).toHaveProperty('segment')
        expect(record).toHaveProperty('avg_lifetime_value')
        expect(record).toHaveProperty('customer_count')
      })
    }
  })

  test('customer counts are positive integers', async () => {
    const res = await request(app).get('/api/analytics/segment')
    res.body.forEach(record => {
      expect(record.customer_count).toBeGreaterThan(0)
      expect(Number.isInteger(record.customer_count)).toBe(true)
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/analytics/channel-segment
// ─────────────────────────────────────────────

describe('GET /api/analytics/channel-segment', () => {

  test('returns 200 with cross analysis data', async () => {
    const res = await request(app).get('/api/analytics/channel-segment')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each record has segment and preferredChannel', async () => {
    const res = await request(app).get('/api/analytics/channel-segment')
    if (res.body.length > 0) {
      res.body.forEach(record => {
        expect(record).toHaveProperty('segment')
        expect(record).toHaveProperty('preferredChannel')
      })
    }
  })

})

// ─────────────────────────────────────────────
// GET /api/insights/narrative
// ─────────────────────────────────────────────

describe('GET /api/insights/narrative', () => {

  test('returns 200 with narrative', async () => {
    const res = await request(app).get('/api/insights/narrative')
    expect(res.status).toBe(200)
  })

  test('narrative has required fields', async () => {
    const res = await request(app).get('/api/insights/narrative')
    if (res.body) {
      expect(res.body).toHaveProperty('narrative')
      expect(res.body).toHaveProperty('generatedAt')
      expect(typeof res.body.narrative).toBe('string')
      expect(res.body.narrative.length).toBeGreaterThan(50)
    }
  })

  test('no PII in narrative response', async () => {
    const res = await request(app).get('/api/insights/narrative')
    if (res.body && res.body.narrative) {
      // Narrative should not contain email addresses
      expect(res.body.narrative).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    }
  })

})

// ─────────────────────────────────────────────
// GET /api/insights/targeting
// ─────────────────────────────────────────────

describe('GET /api/insights/targeting', () => {

  test('returns 200 with targeting recommendations', async () => {
    const res = await request(app).get('/api/insights/targeting')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each recommendation has required fields', async () => {
    const res = await request(app).get('/api/insights/targeting')
    if (res.body.length > 0) {
      res.body.forEach(rec => {
        expect(rec).toHaveProperty('customerId')
        expect(rec).toHaveProperty('recommendation')
        expect(rec).toHaveProperty('recommendedCampaignType')
        expect(rec).toHaveProperty('confidence')
      })
    }
  })

  test('confidence values are between 0 and 1', async () => {
    const res = await request(app).get('/api/insights/targeting')
    res.body.forEach(rec => {
      expect(rec.confidence).toBeGreaterThanOrEqual(0)
      expect(rec.confidence).toBeLessThanOrEqual(1)
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/insights/segments
// ─────────────────────────────────────────────

describe('GET /api/insights/segments', () => {

  test('returns 200 with segment insights', async () => {
    const res = await request(app).get('/api/insights/segments')
    expect(res.status).toBe(200)
  })

  test('segment insights has insights field', async () => {
    const res = await request(app).get('/api/insights/segments')
    if (res.body) {
      expect(res.body).toHaveProperty('insights')
      expect(typeof res.body.insights).toBe('string')
    }
  })

})