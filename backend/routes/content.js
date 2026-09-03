const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// POST /api/content/generate — generate campaign content with Groq
router.post('/generate', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId, channel, campaignType, segment, tone = 'professional' } = req.body

    if (!channel || !campaignType || !segment) {
      return res.status(400).json({ error: 'Missing required fields: channel, campaignType, segment' })
    }

    // Fetch campaign details if campaignId provided
    let campaignDetails = ''
    if (campaignId) {
      const campaign = await db.collection('campaigns').findOne({ id: campaignId }, { projection: { _id: 0 } })
      if (campaign) {
        campaignDetails = `Campaign: "${campaign.name}", Goal: ${campaign.goal}, Budget: ₹${campaign.budget}`
      }
    }

    // Fetch segment analytics for context
    const segmentData = await db.collection('analytics_segment').findOne({ segment }, { projection: { _id: 0 } })
    const segmentContext = segmentData
      ? `Segment has ${segmentData.customer_count} customers with avg LTV of ₹${segmentData.avg_lifetime_value}`
      : ''

    let prompt = ''

    if (channel === 'email') {
      prompt = `
You are a marketing copywriter. Write a marketing email for the following:

Campaign Type: ${campaignType}
Target Segment: ${segment}
Tone: ${tone}
${campaignDetails}
${segmentContext}

Write the email in this exact format:
SUBJECT: [subject line here]
BODY:
[email body here with {{name}} as placeholder for customer name]

Keep the body concise (max 150 words), compelling, and end with a clear call to action.
Do not use markdown formatting.
      `
    } else if (channel === 'sms') {
      prompt = `
You are a marketing copywriter. Write an SMS message for the following:

Campaign Type: ${campaignType}
Target Segment: ${segment}
Tone: ${tone}
${campaignDetails}

Write a single SMS message (max 160 characters).
Use {{name}} as placeholder for customer name.
Include a clear call to action.
Do not include any labels or formatting — just the message text.
      `
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.8
    })

    const generated = response.choices[0].message.content.trim()

    // Parse subject and body for email
    let content = {}
    if (channel === 'email') {
      const subjectMatch = generated.match(/SUBJECT:\s*(.+)/i)
      const bodyMatch = generated.match(/BODY:\s*([\s\S]+)/i)
      content = {
        subject: subjectMatch ? subjectMatch[1].trim() : 'Special offer for you',
        html: bodyMatch ? bodyMatch[1].trim().replace(/\n/g, '<br>') : generated
      }
    } else {
      content = { message: generated }
    }

    // Save to MongoDB for reuse
    const contentDoc = {
      campaignId: campaignId || null,
      channel,
      campaignType,
      segment,
      tone,
      content,
      generatedAt: new Date().toISOString()
    }

    const result = await db.collection('campaign_content').insertOne(contentDoc)
    delete contentDoc._id

    res.json({
      success: true,
      channel,
      ...content,
      contentId: result.insertedId
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/content/:campaignId — get previously generated content for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const db = req.app.locals.db
    const content = await db.collection('campaign_content')
      .find({ campaignId: req.params.campaignId }, { projection: { _id: 0 } })
      .sort({ generatedAt: -1 })
      .toArray()
    res.json({ count: content.length, content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router