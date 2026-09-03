const express = require('express')
const router = express.Router()
const axios = require('axios')

const RAG_URL = process.env.RAG_URL || 'http://localhost:8000'

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body
    if (!message) return res.status(400).json({ error: 'message is required' })

    const response = await axios.post(`${RAG_URL}/chat`, {
      message,
      session_id: sessionId
    })

    res.json({
      reply: response.data.reply,
      sessionId: response.data.session_id,
      sources: response.data.sources
    })

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'RAG service unavailable. Make sure chat.py is running.' })
    }
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/chat/session/:sessionId — clear conversation memory
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const response = await axios.delete(`${RAG_URL}/session/${req.params.sessionId}`)
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router