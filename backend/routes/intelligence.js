const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ============================================================
// Helper — calculate days between two dates
// ============================================================

const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return Math.ceil(
    (d2 - d1) / (1000 * 60 * 60 * 24)
  );
};

// ============================================================
// Helper — build campaign context
// ============================================================

const buildCampaignContext = (
  campaign,
  campaignAnalytics,
  channelMeta,
  segmentMeta
) => {
  const today = new Date();

  const totalDays = Math.max(
    daysBetween(
      campaign.startDate,
      campaign.endDate
    ),
    1
  );

  const daysElapsed = Math.max(
    daysBetween(
      campaign.startDate,
      today
    ),
    0
  );

  const daysRemaining = Math.max(
    daysBetween(
      today,
      campaign.endDate
    ),
    0
  );

  const timePercent = Math.min(
    (daysElapsed / totalDays) * 100,
    100
  ).toFixed(1);

  const budget =
    Number(campaign.budget) || 0;

  const spent =
    Number(campaign.spentSoFar) || 0;

  const actualReach =
    Number(campaign.actualReach) || 0;

  const targetReach =
    Number(campaign.targetReach) || 0;

  const budgetUtilisation =
    campaignAnalytics?.budgetUtilisation ??
    (budget > 0
      ? (spent / budget) * 100
      : 0);

  const reachEfficiency =
    campaignAnalytics?.reachEfficiency ??
    (targetReach > 0
      ? (actualReach / targetReach) * 100
      : 0);

  const budgetRemaining =
    Math.max(budget - spent, 0);

  // Projected reach
  const dailyReachRate =
    actualReach /
    Math.max(daysElapsed, 1);

  const projectedReach = Math.round(
    actualReach +
      dailyReachRate *
        daysRemaining
  );

  // Projected budget exhaustion
  const dailySpendRate =
    spent /
    Math.max(daysElapsed, 1);

  const daysUntilBudgetExhausted =
    dailySpendRate > 0
      ? Math.round(
          budgetRemaining /
            dailySpendRate
        )
      : Infinity;

  return {
    // Campaign identity
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    goal: campaign.goal,
    description:
      campaign.description || "",

    channels:
      campaign.channels || [],

    targetSegments:
      campaign.targetSegments || [],

    status: campaign.status,

    // Timeline
    startDate: campaign.startDate,
    endDate: campaign.endDate,

    totalDays,

    daysElapsed,

    daysRemaining,

    percentTimeElapsed:
      Number(timePercent),

    // Budget
    totalBudget: budget,

    spent,

    budgetRemaining,

    budgetUtilisation:
      Number(budgetUtilisation),

    // Reach
    targetReach,

    actualReach,

    reachEfficiency:
      Number(reachEfficiency),

    // Projections
    projectedReach,

    willHitTarget:
      projectedReach >= targetReach,

    daysUntilBudgetExhausted,

    // Analytics metadata
    channelPerformance:
      channelMeta || null,

    segmentPerformance:
      segmentMeta || null,
  };
};

// ============================================================
// Helper — determine campaign health score
// ============================================================

const calculateHealthScore = (
  context
) => {
  let score = 100;

  // No activity yet
  if (
    context.actualReach === 0 &&
    context.spent === 0
  ) {
    return 70;
  }

  // Budget efficiency
  const budgetVsTime =
    context.budgetUtilisation -
    context.percentTimeElapsed;

  if (budgetVsTime > 20) {
    score -= 25;
  } else if (budgetVsTime > 10) {
    score -= 10;
  }

  // Reach efficiency
  if (
    context.reachEfficiency < 50
  ) {
    score -= 30;
  } else if (
    context.reachEfficiency < 75
  ) {
    score -= 15;
  } else if (
    context.reachEfficiency >= 100
  ) {
    score += 10;
  }

  // Will hit target?
  if (!context.willHitTarget) {
    score -= 20;
  }

  // Budget exhaustion
  if (
    Number.isFinite(
      context.daysUntilBudgetExhausted
    ) &&
    context.daysUntilBudgetExhausted <
      context.daysRemaining
  ) {
    score -= 15;
  }

  return Math.max(
    0,
    Math.min(100, score)
  );
};

// ============================================================
// Helper — health label
// ============================================================

const getHealthLabel = (
  score
) => {
  if (score >= 80)
    return "on_track";

  if (score >= 60)
    return "needs_attention";

  if (score >= 40)
    return "at_risk";

  return "critical";
};

// ============================================================
// GET /api/intelligence/:campaignId
// ============================================================

router.get(
  "/:campaignId",
  async (req, res) => {
    try {
      const db =
        req.app.locals.db;

      const {
        campaignId,
      } = req.params;

      const {
        refresh = false,
      } = req.query;

      // ======================================================
      // Check cache
      // ======================================================

      if (refresh !== "true") {
        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const existing =
          await db
            .collection(
              "campaign_intelligence"
            )
            .findOne(
              {
                campaignId,

                generatedAt: {
                  $gte: today,
                },
              },
              {
                projection: {
                  _id: 0,
                },
              }
            );

        if (existing) {
          return res.json({
            ...existing,
            fromCache: true,
          });
        }
      }

      // ======================================================
      // Fetch campaign
      // ======================================================

      const campaign =
        await db
          .collection("campaigns")
          .findOne(
            {
              id: campaignId,
            },
            {
              projection: {
                _id: 0,
              },
            }
          );

      if (!campaign) {
        return res
          .status(404)
          .json({
            error: `Campaign ${campaignId} not found`,
          });
      }

      // ======================================================
      // Fetch campaign analytics
      // ======================================================

      const campaignAnalytics =
        await db
          .collection(
            "analytics_campaign"
          )
          .findOne(
            {
              id: campaignId,
            },
            {
              projection: {
                _id: 0,
              },
            }
          );

      // ======================================================
      // Fetch metadata
      // ======================================================

      const metadata =
        await db
          .collection(
            "analytics_metadata"
          )
          .find(
            {},
            {
              projection: {
                _id: 0,
              },
            }
          )
          .toArray();

      const channelMeta =
        metadata.find(
          (m) =>
            m.domain ===
            "channel_performance"
        ) || null;

      const segmentMeta =
        metadata.find(
          (m) =>
            m.domain ===
            "customer_segments"
        ) || null;

      // ======================================================
      // Build context
      // ======================================================

      const context =
        buildCampaignContext(
          campaign,
          campaignAnalytics,
          channelMeta,
          segmentMeta
        );

      const healthScore =
        calculateHealthScore(
          context
        );

      const health =
        getHealthLabel(
          healthScore
        );

      // ======================================================
      // Build prompt
      // ======================================================

      const prompt = `
You are a marketing campaign intelligence engine.

Analyse this campaign and provide concise, actionable recommendations.

CAMPAIGN:
Name: ${context.name}
Type: ${context.type}
Goal: ${context.goal}
Description: ${context.description}
Channels: ${
        context.channels.join(", ") ||
        "None"
      }
Target Segments: ${
        context.targetSegments.join(
          ", "
        ) || "None"
      }
Status: ${context.status}

TIMELINE:
Start: ${context.startDate}
End: ${context.endDate}
Days elapsed: ${context.daysElapsed}
Days remaining: ${context.daysRemaining}
Time completed: ${context.percentTimeElapsed}%

BUDGET:
Total: ₹${context.totalBudget.toLocaleString()}
Spent: ₹${context.spent.toLocaleString()}
Remaining: ₹${context.budgetRemaining.toLocaleString()}
Utilisation: ${context.budgetUtilisation.toFixed(2)}%

REACH:
Target: ${context.targetReach.toLocaleString()}
Actual: ${context.actualReach.toLocaleString()}
Efficiency: ${context.reachEfficiency.toFixed(2)}%
Projected final reach: ${context.projectedReach.toLocaleString()}
Will hit target: ${
        context.willHitTarget
          ? "YES"
          : "NO"
      }

PLATFORM ANALYTICS:

Best performing channel:
${
  channelMeta?.bestChannel
    ?.name || "Unknown"
}

Best channel conversion:
${
  channelMeta?.bestChannel
    ?.avgConversionRate || 0
}%

Highest value segment:
${
  segmentMeta
    ?.highestValueSegment
    ?.name || "Unknown"
}

Highest segment LTV:
₹${
  segmentMeta
    ?.highestValueSegment
    ?.totalLTV
    ?.toLocaleString() || "0"
}

Return ONLY valid JSON.

Use exactly this structure:

{
  "amIDoingItRight": "Short honest assessment.",
  "whatIsWorking": [
    "Specific positive point.",
    "Specific positive point."
  ],
  "whatIsNotWorking": [
    "Specific issue.",
    "Specific issue."
  ],
  "bestICanDo": [
    "Actionable recommendation.",
    "Actionable recommendation.",
    "Actionable recommendation."
  ],
  "goalForecast": "Short realistic forecast."
}

Rules:
- Valid JSON only.
- No markdown.
- No code fences.
- No text outside JSON.
- Exactly 2 working points.
- Exactly 2 issues.
- Exactly 3 recommendations.
- Keep responses concise.
- Do not invent PII.
- Use campaign data provided above.
- If the campaign has no activity yet, explicitly mention that performance data is not available yet.
`;

      // ======================================================
      // Groq
      // ======================================================

      const response =
        await groq.chat.completions.create(
          {
            model:
              "openai/gpt-oss-20b",

            messages: [
              {
                role: "system",
                content:
                  "You are a marketing campaign intelligence engine. Return only valid JSON.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],

            response_format: {
              type: "json_object",
            },

            max_tokens: 1500,

            temperature: 0.2,
          }
        );

      // ======================================================
      // Get Groq response
      // ======================================================

      const rawAnalysis =
        response?.choices?.[0]
          ?.message?.content
          ?.trim();

      if (!rawAnalysis) {
        throw new Error(
          "Groq returned an empty response"
        );
      }

      console.log(
        `AI intelligence generated for ${campaignId}`
      );

      // ======================================================
      // Parse JSON
      // ======================================================

      let parsedAnalysis;

      try {
        parsedAnalysis =
          JSON.parse(
            rawAnalysis
          );
      } catch (parseError) {
        console.error(
          "Invalid JSON from Groq:",
          rawAnalysis
        );

        throw new Error(
          "Groq returned invalid JSON"
        );
      }

      // ======================================================
      // Validate response
      // ======================================================

      const analysis = {
        amIDoingItRight:
          parsedAnalysis
            .amIDoingItRight ||
          "There is currently insufficient information to evaluate campaign performance.",

        whatIsWorking:
          Array.isArray(
            parsedAnalysis
              .whatIsWorking
          )
            ? parsedAnalysis
                .whatIsWorking
            : [],

        whatIsNotWorking:
          Array.isArray(
            parsedAnalysis
              .whatIsNotWorking
          )
            ? parsedAnalysis
                .whatIsNotWorking
            : [],

        bestICanDo:
          Array.isArray(
            parsedAnalysis
              .bestICanDo
          )
            ? parsedAnalysis
                .bestICanDo
            : [],

        goalForecast:
          parsedAnalysis
            .goalForecast ||
          "There is currently insufficient information to forecast the campaign outcome.",
      };

      // ======================================================
      // Build final report
      // ======================================================

      const report = {
        campaignId,

        campaignName:
          campaign.name,

        generatedAt:
          new Date().toISOString(),

        // Health
        healthScore,

        health,

        onTrack:
          context.willHitTarget,

        // Metrics
        metrics: {
          budgetUtilisation:
            context.budgetUtilisation,

          budgetRemaining:
            context.budgetRemaining,

          reachEfficiency:
            context.reachEfficiency,

          daysRemaining:
            context.daysRemaining,

          percentTimeElapsed:
            context.percentTimeElapsed,

          projectedReach:
            context.projectedReach,

          targetReach:
            context.targetReach,

          willHitTarget:
            context.willHitTarget,
        },

        // AI analysis
        analysis,

        // Keep this for debugging
        fullAnalysis:
          rawAnalysis,
      };

      // ======================================================
      // Save to MongoDB
      // ======================================================

      await db
        .collection(
          "campaign_intelligence"
        )
        .replaceOne(
          {
            campaignId,
          },
          report,
          {
            upsert: true,
          }
        );

      // ======================================================
      // Response
      // ======================================================

      res.json({
        ...report,
        fromCache: false,
      });

    } catch (err) {
      console.error(
        "INTELLIGENCE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ============================================================
// GET /api/intelligence
// Get latest intelligence for ALL campaigns
// ============================================================

router.get(
  "/",
  async (req, res) => {
    try {
      const db =
        req.app.locals.db;

      const reports =
        await db
          .collection(
            "campaign_intelligence"
          )
          .find(
            {},
            {
              projection: {
                _id: 0,
                fullAnalysis: 0,
              },
            }
          )
          .toArray();

      res.json({
        count: reports.length,
        reports,
      });

    } catch (err) {
      console.error(
        "GET ALL INTELLIGENCE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

module.exports = router;