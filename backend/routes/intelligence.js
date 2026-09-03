const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Helper — calculate days between two dates
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
}

// Helper — build campaign context metadata (no PII)
const buildCampaignContext = (campaign, campaignAnalytics, channelMeta, segmentMeta) => {
  const today = new Date()
  const totalDays = daysBetween(campaign.startDate, campaign.endDate)
  const daysElapsed = daysBetween(campaign.startDate, today)
  const daysRemaining = daysBetween(today, campaign.endDate)
  const timePercent = Math.min(((daysElapsed / totalDays) * 100), 100).toFixed(1)

  const budgetUtilisation = campaignAnalytics?.budgetUtilisation ||
    ((campaign.spentSoFar / campaign.budget) * 100).toFixed(2)

  const reachEfficiency = campaignAnalytics?.reachEfficiency ||
    ((campaign.actualReach / campaign.targetReach) * 100).toFixed(2)

  const budgetRemaining = campaign.budget - campaign.spentSoFar

  // Projected reach at current pace
  const dailyReachRate = campaign.actualReach / Math.max(daysElapsed, 1)
  const projectedReach = Math.round(campaign.actualReach + (dailyReachRate * daysRemaining))

  // Projected budget exhaustion
  const dailySpendRate = campaign.spentSoFar / Math.max(daysElapsed, 1)
  const daysUntilBudgetExhausted = Math.round(budgetRemaining / Math.max(dailySpendRate, 1))

  return {
    // Campaign identity
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    goal: campaign.goal,
    description: campaign.description,
    channels: campaign.channels,
    targetSegments: campaign.targetSegments,
    status: campaign.status,

    // Timeline
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    totalDays,
    daysElapsed,
    daysRemaining,
    percentTimeElapsed: Number(timePercent),

    // Budget
    totalBudget: campaign.budget,
    spent: campaign.spentSoFar,
    budgetRemaining,
    budgetUtilisation: Number(budgetUtilisation),

    // Reach
    targetReach: campaign.targetReach,
    actualReach: campaign.actualReach,
    reachEfficiency: Number(reachEfficiency),

    // Projections
    projectedReach,
    willHitTarget: projectedReach >= campaign.targetReach,
    daysUntilBudgetExhausted,

    // Analytics metadata (no PII — aggregated KPIs only)
    channelPerformance: channelMeta || null,
    segmentPerformance: segmentMeta || null
  }
}

// Helper — determine campaign health score (0-100)
const calculateHealthScore = (context) => {
  let score = 100

  // Budget efficiency — penalise if spending too fast vs reach
  const budgetVsTime = context.budgetUtilisation - context.percentTimeElapsed
  if (budgetVsTime > 20) score -= 25      // spending way ahead of time
  else if (budgetVsTime > 10) score -= 10 // spending slightly fast

  // Reach efficiency
  if (context.reachEfficiency < 50) score -= 30
  else if (context.reachEfficiency < 75) score -= 15
  else if (context.reachEfficiency >= 100) score += 10

  // Will hit target?
  if (!context.willHitTarget) score -= 20

  // Budget exhausting before campaign ends?
  if (context.daysUntilBudgetExhausted < context.daysRemaining) score -= 15

  return Math.max(0, Math.min(100, score))
}

// Helper — health label
const getHealthLabel = (score) => {
  if (score >= 80) return 'on_track'
  if (score >= 60) return 'needs_attention'
  if (score >= 40) return 'at_risk'
  return 'critical'
}

// GET /api/intelligence/:campaignId — generate intelligence report for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const db = req.app.locals.db
    const { campaignId } = req.params
    const { refresh = false } = req.query

    // Check if we have a recent report (generated today) — avoid unnecessary Groq calls
    if (!refresh) {
      const today = new Date().toISOString().split('T')[0]
      const existing = await db.collection('campaign_intelligence').findOne(
        { campaignId, generatedAt: { $gte: today } },
        { projection: { _id: 0 } }
      )
      if (existing) {
        return res.json({ ...existing, fromCache: true })
      }
    }

    // Fetch campaign
    const campaign = await db.collection('campaigns').findOne(
      { id: campaignId },
      { projection: { _id: 0 } }
    )
    if (!campaign) return res.status(404).json({ error: `Campaign ${campaignId} not found` })

    // Fetch campaign analytics
    const campaignAnalytics = await db.collection('analytics_campaign').findOne(
      { id: campaignId },
      { projection: { _id: 0 } }
    )

    // Fetch analytics metadata (GDPR safe — no PII)
    const metadata = await db.collection('analytics_metadata').find({}, { projection: { _id: 0 } }).toArray()
    const channelMeta = metadata.find(m => m.domain === 'channel_performance') || null
    const segmentMeta = metadata.find(m => m.domain === 'customer_segments') || null

    // Build context
    const context = buildCampaignContext(campaign, campaignAnalytics, channelMeta, segmentMeta)
    const healthScore = calculateHealthScore(context)
    const health = getHealthLabel(healthScore)

    // Build Groq prompt — metadata only, no PII
    const prompt = `
You are a marketing campaign intelligence engine.
Analyse this campaign and provide actionable recommendations.

CAMPAIGN CONTEXT:
Name: ${context.name}
Type: ${context.type}
Goal: ${context.goal}
Description: ${context.description}
Channels: ${context.channels.join(', ')}
Target Segments: ${context.targetSegments.join(', ')}
Status: ${context.status}

TIMELINE:
Start: ${context.startDate} | End: ${context.endDate}
Days elapsed: ${context.daysElapsed} of ${context.totalDays} (${context.percentTimeElapsed}% complete)
Days remaining: ${context.daysRemaining}

BUDGET:
Total: ₹${context.totalBudget.toLocaleString()}
Spent: ₹${context.spent.toLocaleString()} (${context.budgetUtilisation}% utilised)
Remaining: ₹${context.budgetRemaining.toLocaleString()}

REACH:
Target: ${context.targetReach.toLocaleString()}
Actual: ${context.actualReach.toLocaleString()} (${context.reachEfficiency}% efficiency)
Projected final reach at current pace: ${context.projectedReach.toLocaleString()}
Will hit target: ${context.willHitTarget ? 'YES' : 'NO'}

PLATFORM ANALYTICS CONTEXT:
${channelMeta ? `Best performing channel overall: ${channelMeta.bestChannel?.name} (${channelMeta.bestChannel?.avgConversionRate}% conversion)` : ''}
${segmentMeta ? `Highest value segment: ${segmentMeta.highestValueSegment?.name} (avg LTV ₹${segmentMeta.highestValueSegment?.totalLTV?.toLocaleString()})` : ''}

Respond in this exact format:

AM_I_DOING_IT_RIGHT:
[2-3 sentences — honest assessment of current campaign performance]

WHAT_IS_WORKING:
[2 specific things that are going well]

WHAT_IS_NOT_WORKING:
[2 specific things that need attention]

BEST_I_CAN_DO:
[3 specific, actionable recommendations to maximise results with remaining budget and time]

GOAL_FORECAST:
[1-2 sentences — will they hit their goal? what's the realistic outcome?]

Keep responses concise and specific. Use ₹ for currency. No markdown formatting.
    `

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.6
    })

    const rawAnalysis = response.choices[0].message.content.trim()

    // Parse sections from Groq response
    const parseSection = (text, key) => {
      const regex = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`)
      const match = text.match(regex)
      return match ? match[1].trim() : ''
    }

    const parsedAnalysis = {
      amIDoingItRight:   parseSection(rawAnalysis, 'AM_I_DOING_IT_RIGHT'),
      whatIsWorking:     parseSection(rawAnalysis, 'WHAT_IS_WORKING'),
      whatIsNotWorking:  parseSection(rawAnalysis, 'WHAT_IS_NOT_WORKING'),
      bestICanDo:        parseSection(rawAnalysis, 'BEST_I_CAN_DO'),
      goalForecast:      parseSection(rawAnalysis, 'GOAL_FORECAST'),
    }

    // Build final intelligence report
    const report = {
      campaignId,
      campaignName: campaign.name,
      generatedAt: new Date().toISOString(),

      // Health
      healthScore,
      health,
      onTrack: context.willHitTarget,

      // Key metrics snapshot
      metrics: {
        budgetUtilisation: context.budgetUtilisation,
        budgetRemaining: context.budgetRemaining,
        reachEfficiency: context.reachEfficiency,
        daysRemaining: context.daysRemaining,
        percentTimeElapsed: context.percentTimeElapsed,
        projectedReach: context.projectedReach,
        targetReach: context.targetReach,
        willHitTarget: context.willHitTarget
      },

      // AI analysis
      analysis: parsedAnalysis,
      fullAnalysis: rawAnalysis
    }

    // Save to MongoDB — upsert so re-running updates the report
    await db.collection('campaign_intelligence').replaceOne(
      { campaignId },
      report,
      { upsert: true }
    )

    res.json({ ...report, fromCache: false })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/intelligence — get latest intelligence for ALL campaigns
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db
    const reports = await db.collection('campaign_intelligence')
      .find({}, { projection: { _id: 0, fullAnalysis: 0 } })
      .toArray()
    res.json({ count: reports.length, reports })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router