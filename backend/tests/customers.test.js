/**
 * customers.test.js
 * ──────────────────
 * Tests customer and targeting score endpoints.
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
// GET /api/customers
// ─────────────────────────────────────────────

describe('GET /api/customers', () => {

  test('returns 200 with array of customers', async () => {
    const res = await request(app).get('/api/customers')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('returns at least 8 customers', async () => {
    const res = await request(app).get('/api/customers')
    expect(res.body.length).toBeGreaterThanOrEqual(8)
  })

  test('each customer has required fields', async () => {
    const res = await request(app).get('/api/customers')
    const requiredFields = ['id', 'name', 'email', 'segment', 'preferredChannel', 'lifetimeValue']
    res.body.forEach(customer => {
      requiredFields.forEach(field => {
        expect(customer).toHaveProperty(field)
      })
    })
  })

  test('no MongoDB _id exposed', async () => {
    const res = await request(app).get('/api/customers')
    res.body.forEach(customer => {
      expect(customer).not.toHaveProperty('_id')
    })
  })

  test('all lifetime values are positive', async () => {
    const res = await request(app).get('/api/customers')
    res.body.forEach(customer => {
      expect(customer.lifetimeValue).toBeGreaterThan(0)
    })
  })

  test('preferred channels are valid values', async () => {
    const res = await request(app).get('/api/customers')
    const validChannels = ['email', 'social', 'web', 'direct']
    res.body.forEach(customer => {
      expect(validChannels).toContain(customer.preferredChannel)
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/customers/targeting
// ─────────────────────────────────────────────

describe('GET /api/customers/targeting', () => {

  test('returns 200 with targeting scores', async () => {
    const res = await request(app).get('/api/customers/targeting')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('returns scores for all customers', async () => {
    const customers = await request(app).get('/api/customers')
    const scores = await request(app).get('/api/customers/targeting')
    expect(scores.body.length).toBe(customers.body.length)
  })

  test('each score has required fields', async () => {
    const res = await request(app).get('/api/customers/targeting')
    res.body.forEach(score => {
      expect(score).toHaveProperty('customerId')
      expect(score).toHaveProperty('recommendedCampaignType')
      expect(score).toHaveProperty('confidence')
      expect(score).toHaveProperty('scores')
    })
  })

  test('confidence values are between 0 and 1', async () => {
    const res = await request(app).get('/api/customers/targeting')
    res.body.forEach(score => {
      expect(score.confidence).toBeGreaterThanOrEqual(0)
      expect(score.confidence).toBeLessThanOrEqual(1)
    })
  })

  test('recommended campaign type is a valid type', async () => {
    const res = await request(app).get('/api/customers/targeting')
    const validTypes = ['promotional', 'retention', 'lifecycle']
    res.body.forEach(score => {
      expect(validTypes).toContain(score.recommendedCampaignType)
    })
  })

  test('scores object has all campaign types', async () => {
    const res = await request(app).get('/api/customers/targeting')
    const expectedTypes = ['promotional', 'retention', 'lifecycle']
    res.body.forEach(score => {
      expectedTypes.forEach(type => {
        expect(score.scores).toHaveProperty(type)
      })
    })
  })

  test('all score values sum to approximately 1', async () => {
    const res = await request(app).get('/api/customers/targeting')
    res.body.forEach(score => {
      const sum = Object.values(score.scores).reduce((a, b) => a + b, 0)
      expect(sum).toBeGreaterThan(0.9)
      expect(sum).toBeLessThanOrEqual(1.1)
    })
  })

})