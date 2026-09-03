const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})


// ============================================================
// POST /api/content/generate
// Generate campaign content with Groq
// ============================================================

router.post('/generate', async (req, res) => {
  try {
    const db = req.app.locals.db

    const {
      campaignId,
      channel,
      campaignType,
      segment,
      tone = 'professional'
    } = req.body

    // --------------------------------------------------------
    // Validate request
    // --------------------------------------------------------

    if (!channel || !campaignType || !segment) {
      return res.status(400).json({
        error:
          'Missing required fields: channel, campaignType, segment'
      })
    }

    if (!['email', 'sms'].includes(channel)) {
      return res.status(400).json({
        error: 'channel must be either email or sms'
      })
    }


    // --------------------------------------------------------
    // Fetch campaign details
    // --------------------------------------------------------

    let campaignDetails = ''

    if (campaignId) {
      const campaign = await db.collection('campaigns').findOne(
        { id: campaignId },
        { projection: { _id: 0 } }
      )

      if (campaign) {
        campaignDetails = `
Campaign Name: "${campaign.name}"
Campaign Goal: ${campaign.goal || 'Not specified'}
Campaign Budget: ₹${campaign.budget || 0}
`
      }
    }


    // --------------------------------------------------------
    // Fetch segment analytics
    // --------------------------------------------------------

    const segmentData =
      await db.collection('analytics_segment').findOne(
        { segment },
        { projection: { _id: 0 } }
      )

    const segmentContext = segmentData
      ? `
Segment Size: ${segmentData.customer_count || 0} customers
Average LTV: ₹${segmentData.avg_lifetime_value || 0}
`
      : ''


    // --------------------------------------------------------
    // Build prompt
    // --------------------------------------------------------

    let prompt = ''

    if (channel === 'email') {
      prompt = `
You are an expert marketing copywriter.

Create a marketing email using the information below.

Campaign Type: ${campaignType}
Target Segment: ${segment}
Tone: ${tone}

${campaignDetails}

${segmentContext}

IMPORTANT:
Return ONLY the following two sections:

SUBJECT: <one subject line>

BODY:
<complete email body>

Rules:
- The BODY must never be empty.
- Use {{name}} as the customer name placeholder.
- Keep the email under 150 words.
- Make it compelling and relevant to the campaign type.
- Include a clear call to action.
- Do not use markdown.
- Do not add explanations before or after the email.
- Do not use code blocks.
`

    } else {
      prompt = `
You are an expert marketing copywriter.

Create an SMS message using the information below.

Campaign Type: ${campaignType}
Target Segment: ${segment}
Tone: ${tone}

${campaignDetails}

Rules:
- Return ONLY the SMS message.
- Never return an empty message.
- Maximum 160 characters.
- Use {{name}} as the customer name placeholder.
- Include a clear call to action.
- Do not use markdown.
- Do not add explanations.
`
    }


    // --------------------------------------------------------
    // Call Groq
    // --------------------------------------------------------

const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 1500,
  temperature: 0.8
})

console.log("========== GROQ RAW RESPONSE ==========")
console.dir(response, { depth: null })
console.log("========================================")

const generated = response?.choices?.[0]?.message?.content

if (!generated || !generated.trim()) {
  console.error("❌ Groq returned an empty response")
  return res.status(502).json({
    error: "AI returned an empty response",
    finishReason: response?.choices?.[0]?.finish_reason || null
  })
}


    // --------------------------------------------------------
    // Validate AI response
    // --------------------------------------------------------

    if (!generated) {
      return res.status(502).json({
        error: 'AI returned an empty response'
      })
    }

    console.log('🤖 Generated content:')
    console.log(generated)


    // ========================================================
    // EMAIL PARSING
    // ========================================================

    let content = {}

    if (channel === 'email') {

      let subject = ''
      let body = ''

      // ------------------------------------------------------
      // Extract SUBJECT
      // ------------------------------------------------------

      const subjectMatch =
        generated.match(
          /(?:^|\n)\s*SUBJECT\s*:\s*(.+?)(?=\n|$)/i
        )

      if (subjectMatch) {
        subject = subjectMatch[1].trim()
      }


      // ------------------------------------------------------
      // Extract BODY
      // ------------------------------------------------------

      const bodyMatch =
        generated.match(
          /(?:^|\n)\s*BODY\s*:\s*([\s\S]*)/i
        )

      if (bodyMatch) {
        body = bodyMatch[1].trim()
      }


      // ------------------------------------------------------
      // Fallback if model didn't follow format
      // ------------------------------------------------------

      if (!subject) {
        subject = 'Special offer for you'
      }


      // If BODY is empty, try another extraction strategy.
      if (!body) {

        console.warn(
          '⚠️ Groq returned an empty BODY. Attempting fallback parsing.'
        )

        // Remove SUBJECT line and use remaining text as body.
        body = generated
          .replace(
            /(?:^|\n)\s*SUBJECT\s*:\s*.+?(?=\n|$)/i,
            ''
          )
          .replace(
            /(?:^|\n)\s*BODY\s*:\s*/i,
            ''
          )
          .trim()
      }


      // ------------------------------------------------------
      // Final validation
      // ------------------------------------------------------

      if (!body) {

        console.error(
          '❌ AI generated an empty email body.'
        )

        return res.status(502).json({
          error:
            'AI generated an empty email body. Please try generating again.'
        })
      }


      // ------------------------------------------------------
      // Convert plain text into simple HTML
      // ------------------------------------------------------

      const html = body
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, '<br><br>')
        .replace(/\n/g, '<br>')


      content = {
        subject,
        html
      }

    } else {

      // ======================================================
      // SMS
      // ======================================================

      const message = generated.trim()

      if (!message) {
        return res.status(502).json({
          error: 'AI generated an empty SMS'
        })
      }

      content = {
        message
      }
    }


    // --------------------------------------------------------
    // Save to MongoDB
    // --------------------------------------------------------

    const contentDoc = {
      campaignId: campaignId || null,
      channel,
      campaignType,
      segment,
      tone,
      content,
      generatedAt: new Date().toISOString()
    }

    const result =
      await db.collection('campaign_content').insertOne(
        contentDoc
      )


    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      success: true,
      channel,
      ...content,
      contentId: result.insertedId
    })

  } catch (err) {

    console.error(
      '❌ Content generation error:',
      err
    )

    res.status(500).json({
      error: err.message
    })
  }
})


// ============================================================
// GET /api/content/:campaignId
// Get previously generated content
// ============================================================

router.get('/:campaignId', async (req, res) => {

  try {

    const db = req.app.locals.db

    const content =
      await db.collection('campaign_content')
        .find(
          { campaignId: req.params.campaignId },
          { projection: { _id: 0 } }
        )
        .sort({ generatedAt: -1 })
        .toArray()

    res.json({
      count: content.length,
      content
    })

  } catch (err) {

    console.error(
      '❌ Failed to fetch campaign content:',
      err
    )

    res.status(500).json({
      error: err.message
    })
  }
})


module.exports = router