/**
 * campaigns.test.js
 * ──────────────────
 * Tests all campaign CRUD endpoints.
 * Covers: GET, POST, PATCH status, PATCH update, DELETE
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app
let db
let createdCampaignId  // track created campaign for cleanup

beforeAll(async () => {
  ({ app, db } = await setupTestApp())
}, 15000)

afterAll(async () => {
  // Clean up any test campaigns created during tests
  if (createdCampaignId) {
    await db.collection('campaigns').deleteOne({ id: createdCampaignId })
  }
  await teardownTestApp()
}, 15000)

// ─────────────────────────────────────────────
// GET /api/campaigns
// ─────────────────────────────────────────────

describe('GET /api/campaigns', () => {

  test('returns 200 with array of campaigns', async () => {
    const res = await request(app).get('/api/campaigns')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each campaign has required fields', async () => {
    const res = await request(app).get('/api/campaigns')
    const requiredFields = ['id', 'name', 'type', 'status', 'channels', 'budget']
    res.body.forEach(campaign => {
      requiredFields.forEach(field => {
        expect(campaign).toHaveProperty(field)
      })
    })
  })

  test('returns at least 1 campaign', async () => {
    const res = await request(app).get('/api/campaigns')
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('no MongoDB _id field exposed', async () => {
    const res = await request(app).get('/api/campaigns')
    res.body.forEach(campaign => {
      expect(campaign).not.toHaveProperty('_id')
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/campaigns/analytics
// ─────────────────────────────────────────────

describe('GET /api/campaigns/analytics', () => {

  test('returns 200 with analytics array', async () => {
    const res = await request(app).get('/api/campaigns/analytics')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('each analytics record has budgetUtilisation and reachEfficiency', async () => {
    const res = await request(app).get('/api/campaigns/analytics')
    if (res.body.length > 0) {
      res.body.forEach(record => {
        expect(record).toHaveProperty('budgetUtilisation')
        expect(record).toHaveProperty('reachEfficiency')
      })
    }
  })

  test('budgetUtilisation is a valid percentage (0-200)', async () => {
    const res = await request(app).get('/api/campaigns/analytics')
    res.body.forEach(record => {
      expect(record.budgetUtilisation).toBeGreaterThanOrEqual(0)
      expect(record.budgetUtilisation).toBeLessThanOrEqual(200)
    })
  })

})

// ─────────────────────────────────────────────
// GET /api/campaigns/:id
// ─────────────────────────────────────────────

describe('GET /api/campaigns/:id', () => {

  test('returns 200 for existing campaign', async () => {
    const res = await request(app).get('/api/campaigns/CAM001')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('CAM001')
  })

  test('returns 404 for non-existent campaign', async () => {
    const res = await request(app).get('/api/campaigns/CAM999')
    expect(res.status).toBe(404)
  })

})

// ─────────────────────────────────────────────
// POST /api/campaigns/create
// ─────────────────────────────────────────────

describe('POST /api/campaigns/create', () => {

  test('creates a campaign with valid data', async () => {
    const newCampaign = {
      name:           'Test Campaign QA',
      type:           'promotional',
      channels:       ['email'],
      targetSegments: ['Young Professional'],
      budget:         10000,
      startDate:      '2026-08-01',
      endDate:        '2026-08-31',
      goal:           'increase_sales',
      description:    'QA test campaign'
    }

    const res = await request(app)
      .post('/api/campaigns/create')
      .send(newCampaign)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.campaign.name).toBe('Test Campaign QA')
    expect(res.body.campaign.status).toBe('draft')
    expect(res.body.campaign.spentSoFar).toBe(0)

    // Save ID for cleanup
    createdCampaignId = res.body.campaign.id
  })

  test('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/campaigns/create')
      .send({ name: 'Incomplete Campaign' })  // missing budget, dates, etc.

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('new campaign starts with draft status', async () => {
    const res = await request(app).get(`/api/campaigns/${createdCampaignId}`)
    expect(res.body.status).toBe('draft')
  })

})

// ─────────────────────────────────────────────
// PATCH /api/campaigns/:id/status
// ─────────────────────────────────────────────

describe('PATCH /api/campaigns/:id/status', () => {

  test('updates status to active', async () => {
    const res = await request(app)
      .patch(`/api/campaigns/${createdCampaignId}/status`)
      .send({ status: 'active' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.status).toBe('active')
  })

  test('returns 400 for invalid status', async () => {
    const res = await request(app)
      .patch(`/api/campaigns/${createdCampaignId}/status`)
      .send({ status: 'invalid_status' })

    expect(res.status).toBe(400)
  })

  test('returns 404 for non-existent campaign', async () => {
    const res = await request(app)
      .patch('/api/campaigns/CAM999/status')
      .send({ status: 'active' })

    expect(res.status).toBe(404)
  })

})

// ─────────────────────────────────────────────
// PATCH /api/campaigns/:id
// ─────────────────────────────────────────────

describe('PATCH /api/campaigns/:id', () => {

  test('updates campaign fields', async () => {
    const res = await request(app)
      .patch(`/api/campaigns/${createdCampaignId}`)
      .send({ description: 'Updated by QA test' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('cannot change campaign id', async () => {
    const res = await request(app)
      .patch(`/api/campaigns/${createdCampaignId}`)
      .send({ id: 'CAM999' })

    // Should succeed but id stays the same
    const verify = await request(app).get(`/api/campaigns/${createdCampaignId}`)
    expect(verify.body.id).toBe(createdCampaignId)
  })

})

// ─────────────────────────────────────────────
// DELETE /api/campaigns/:id
// ─────────────────────────────────────────────

describe('DELETE /api/campaigns/:id', () => {

  test('deletes the test campaign', async () => {
    const res = await request(app)
      .delete(`/api/campaigns/${createdCampaignId}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    createdCampaignId = null // already cleaned up
  })

  test('returns 404 for already deleted campaign', async () => {
    const res = await request(app).delete('/api/campaigns/CAM999')
    expect(res.status).toBe(404)
  })

})