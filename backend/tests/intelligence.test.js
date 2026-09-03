/**
 * intelligence.test.js
 * ─────────────────────
 * Tests the campaign intelligence engine.
 * Groq API is mocked — no real API calls during testing.
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app
let db

// Mock Groq SDK before requiring routes
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
  AM_I_DOING_IT_RIGHT:
    "You are on track with budget utilisation aligning well with time elapsed. Reach efficiency at 76% shows good progress toward your target.",

  WHAT_IS_WORKING:
    "Email channel is performing above platform average with strong open rates. Premium Shopper segment is responding well to the campaign messaging.",

  WHAT_IS_NOT_WORKING:
    "Social channel conversion rate is below benchmark at 0.28%. Re-engagement sub-segment showing high unsubscribe rate of 0.5%.",

  BEST_I_CAN_DO:
    "1. Reallocate 20% of social budget to email for higher ROI. 2. Pause reengagement targeting for Student segment. 3. Add urgency messaging in final week with countdown timer.",

  GOAL_FORECAST:
    "At current pace you will achieve approximately 91% of target reach by campaign end. With recommendations implemented, you can expect to hit 98% of target."
})}
          }]
        })
      }
    }
  }))
})

beforeAll(async () => {
  ({ app, db } = await setupTestApp())

  await db.collection('campaign_intelligence').deleteMany({
    campaignId: { $in: ['CAM001', 'CAM002', 'CAM003'] }
  })
}, 15000)

afterAll(async () => {
  await teardownTestApp()
}, 15000)



// ─────────────────────────────────────────────
// GET /api/intelligence/:campaignId
// ─────────────────────────────────────────────

describe('GET /api/intelligence/:campaignId', () => {

  test('returns intelligence report for CAM001', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('campaignId')
    expect(res.body).toHaveProperty('healthScore')
    expect(res.body).toHaveProperty('health')
    expect(res.body).toHaveProperty('metrics')
    expect(res.body).toHaveProperty('analysis')
  }, 15000)

  test('health score is between 0 and 100', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    expect(res.body.healthScore).toBeGreaterThanOrEqual(0)
    expect(res.body.healthScore).toBeLessThanOrEqual(100)
  }, 15000)

  test('health label is one of valid values', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    const validLabels = ['on_track', 'needs_attention', 'at_risk', 'critical']
    expect(validLabels).toContain(res.body.health)
  }, 15000)

  test('metrics has all required fields', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    const m = res.body.metrics
    expect(m).toHaveProperty('budgetUtilisation')
    expect(m).toHaveProperty('reachEfficiency')
    expect(m).toHaveProperty('daysRemaining')
    expect(m).toHaveProperty('projectedReach')
    expect(m).toHaveProperty('willHitTarget')
    expect(m).toHaveProperty('budgetRemaining')
  }, 15000)

  test('analysis has all 5 sections', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    const a = res.body.analysis
    expect(a).toHaveProperty('amIDoingItRight')
    expect(a).toHaveProperty('whatIsWorking')
    expect(a).toHaveProperty('whatIsNotWorking')
    expect(a).toHaveProperty('bestICanDo')
    expect(a).toHaveProperty('goalForecast')
  }, 15000)

  test('analysis sections have meaningful content', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    const a = res.body.analysis
    expect(a.amIDoingItRight.length).toBeGreaterThan(10)
    expect(a.whatIsWorking.length).toBeGreaterThan(10)
    expect(a.bestICanDo.length).toBeGreaterThan(10)
  }, 15000)

  test('report saved to MongoDB after generation', async () => {
    await request(app).get('/api/intelligence/CAM001')
    const saved = await db.collection('campaign_intelligence').findOne({ campaignId: 'CAM001' })
    expect(saved).not.toBeNull()
    expect(saved.campaignId).toBe('CAM001')
  }, 15000)

  test('returns cached report on second call', async () => {
    // First call — generates and caches
    await request(app).get('/api/intelligence/CAM001')

    // Second call — should return cache
    const res = await request(app).get('/api/intelligence/CAM001')
    expect(res.body.fromCache).toBe(true)
  }, 15000)

  test('refresh=true forces new Groq call', async () => {
    const res = await request(app).get('/api/intelligence/CAM001?refresh=true')
    expect(res.status).toBe(200)
    expect(res.body.fromCache).toBe(false)
    console.log('STATUS:', res.status)
    console.log('BODY:', res.body)

  }, 15000)

  test('returns 404 for non-existent campaign', async () => {
    const res = await request(app).get('/api/intelligence/CAM999')
    expect(res.status).toBe(404)
  })

  test('no PII in intelligence report', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    const str = JSON.stringify(res.body)
    expect(str).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  }, 15000)

  test('budgetUtilisation is a valid percentage', async () => {
    const res = await request(app).get('/api/intelligence/CAM001')
    expect(res.body.metrics.budgetUtilisation).toBeGreaterThanOrEqual(0)
    expect(res.body.metrics.budgetUtilisation).toBeLessThanOrEqual(200)
  }, 15000)



})

// ─────────────────────────────────────────────
// GET /api/intelligence (all campaigns)
// ─────────────────────────────────────────────

describe('GET /api/intelligence', () => {

  test('returns all intelligence reports', async () => {
    const res = await request(app).get('/api/intelligence')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('count')
    expect(res.body).toHaveProperty('reports')
    expect(Array.isArray(res.body.reports)).toBe(true)
  })

  test('fullAnalysis excluded from list view', async () => {
    const res = await request(app).get('/api/intelligence')
    res.body.reports.forEach(report => {
      expect(report).not.toHaveProperty('fullAnalysis')
    })
  })

  test('count matches reports array length', async () => {
    const res = await request(app).get('/api/intelligence')
    expect(res.body.count).toBe(res.body.reports.length)
  })

})