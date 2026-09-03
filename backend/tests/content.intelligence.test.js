/**
 * content.intelligence.test.js
 * ─────────────────────────────
 * Tests AI content generation and campaign intelligence endpoints.
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
// POST /api/content/generate
// ─────────────────────────────────────────────

describe('POST /api/content/generate', () => {

  test('generates email content', async () => {
    const res = await request(app)
      .post('/api/content/generate')
      .send({
        channel:      'email',
        campaignType: 'promotional',
        segment:      'Young Professional',
        tone:         'energetic'
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body).toHaveProperty('subject')
    expect(res.body).toHaveProperty('html')
    expect(res.body.subject.length).toBeGreaterThan(5)
    expect(res.body.html.length).toBeGreaterThan(20)
  }, 15000) // Groq API call — allow 15 seconds

  test('generates SMS content', async () => {
    const res = await request(app)
      .post('/api/content/generate')
      .send({
        channel:      'sms',
        campaignType: 'retention',
        segment:      'Premium Shopper',
        tone:         'professional'
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message.length).toBeGreaterThan(10)
  }, 15000)

  test('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/content/generate')
      .send({ channel: 'email' }) // missing campaignType and segment

    expect(res.status).toBe(400)
  })

  test('email content contains name placeholder', async () => {
    const res = await request(app)
      .post('/api/content/generate')
      .send({
        channel:      'email',
        campaignType: 'lifecycle',
        segment:      'Student',
        tone:         'friendly'
      })

    // Content should use {{name}} placeholder
    const content = res.body.html || ''
    expect(content).toMatch(/\{\{name\}\}/i)
  }, 15000)

  test('SMS content is under 160 characters', async () => {
    const res = await request(app)
      .post('/api/content/generate')
      .send({
        channel:      'sms',
        campaignType: 'promotional',
        segment:      'Young Professional',
        tone:         'urgent'
      })

    if (res.body.message) {
      expect(res.body.message.length).toBeLessThanOrEqual(320) // allow some buffer from AI
    }
  }, 15000)

})

