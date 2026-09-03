/**
 * chat.test.js
 * ─────────────
 * Tests the RAG chatbot endpoint.
 * Python FastAPI RAG service is mocked — no actual RAG calls during testing.
 */

const request = require('supertest')
const { setupTestApp, teardownTestApp } = require('./testSetup')

let app

// Mock axios so we don't need Python RAG service running during tests
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      reply:      'Based on your platform data, the VIP Loyalty Rewards campaign has the best reach efficiency at 84%.',
      session_id: 'test-session',
      sources:    ['analytics_campaign', 'campaigns']
    }
  }),
  delete: jest.fn().mockResolvedValue({
    data: { cleared: true, session_id: 'test-session' }
  })
}))

beforeAll(async () => {
  ({ app } = await setupTestApp())
}, 15000)

afterAll(async () => {
  await teardownTestApp()
}, 15000)

// ─────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────

describe('POST /api/chat', () => {

  test('returns 200 with reply', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Which campaign performed best?', sessionId: 'test-1' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reply')
    expect(res.body.reply.length).toBeGreaterThan(10)
  })

  test('returns sessionId in response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What is my best channel?', sessionId: 'test-2' })

    expect(res.body).toHaveProperty('sessionId')
  })

  test('returns sources in response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What are my campaign analytics?', sessionId: 'test-3' })

    expect(res.body).toHaveProperty('sources')
    expect(Array.isArray(res.body.sources)).toBe(true)
  })

  test('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ sessionId: 'test-4' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('uses default session when sessionId not provided', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reply')
  })

  test('handles RAG service unavailable gracefully', async () => {
    const axios = require('axios')
    const connError = new Error('Connection refused')
    connError.code = 'ECONNREFUSED'
    axios.post.mockRejectedValueOnce(connError)

    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Test message', sessionId: 'test-5' })

    expect(res.status).toBe(503)
    expect(res.body.error).toMatch(/unavailable/i)
  })

})

// ─────────────────────────────────────────────
// DELETE /api/chat/session/:sessionId
// ─────────────────────────────────────────────

describe('DELETE /api/chat/session/:sessionId', () => {

  test('clears session memory', async () => {
    const res = await request(app)
      .delete('/api/chat/session/test-session')

    expect(res.status).toBe(200)
    expect(res.body.cleared).toBe(true)
  })

})