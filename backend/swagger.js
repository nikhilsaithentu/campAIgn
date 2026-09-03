const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unified Marketing Automation Platform API',
      version: '1.0.0',
      description: 'API documentation for S4-I-08 Marketing Platform',
    },
    servers: [{ url: 'http://localhost:5000' }],
    tags: [
      { name: 'Campaigns', description: 'Campaign management' },
      { name: 'Audience', description: 'Audience selection' },
      { name: 'Execute', description: 'Email and SMS execution' },
      { name: 'Content', description: 'AI content generation' },
      { name: 'Analytics', description: 'Performance analytics' },
      { name: 'Insights', description: 'AI insights' },
      { name: 'Customers', description: 'Customer data' },
      { name: 'Intelligence', description: 'AI-powered campaign intelligence and recommendations' },
    ],
    paths: {
      // ── Campaigns ──────────────────────────────────────────
      '/api/campaigns': {
        get: {
          tags: ['Campaigns'],
          summary: 'Get all campaigns',
          responses: { 200: { description: 'List of campaigns' } }
        }
      },
      '/api/campaigns/analytics': {
        get: {
          tags: ['Campaigns'],
          summary: 'Get campaign KPIs from Databricks',
          responses: { 200: { description: 'Campaign analytics' } }
        }
      },
      '/api/campaigns/create': {
        post: {
          tags: ['Campaigns'],
          summary: 'Create a new campaign',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  name: 'Summer Sale 2026',
                  type: 'promotional',
                  channels: ['email', 'sms'],
                  targetSegments: ['Young Professional'],
                  budget: 50000,
                  startDate: '2026-07-01',
                  endDate: '2026-07-31',
                  goal: 'increase_sales',
                  description: 'Summer promotional campaign'
                }
              }
            }
          },
          responses: { 201: { description: 'Campaign created' } }
        }
      },
      '/api/campaigns/{id}': {
        get: {
          tags: ['Campaigns'],
          summary: 'Get campaign by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'CAM001' } }],
          responses: { 200: { description: 'Campaign details' } }
        },
        patch: {
          tags: ['Campaigns'],
          summary: 'Update campaign fields',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'CAM001' } }],
          requestBody: {
            content: {
              'application/json': {
                example: { name: 'Updated Campaign Name', budget: 60000 }
              }
            }
          },
          responses: { 200: { description: 'Campaign updated' } }
        },
        delete: {
          tags: ['Campaigns'],
          summary: 'Delete a campaign',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'CAM001' } }],
          responses: { 200: { description: 'Campaign deleted' } }
        }
      },
      '/api/campaigns/{id}/status': {
        patch: {
          tags: ['Campaigns'],
          summary: 'Update campaign status',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'CAM001' } }],
          requestBody: {
            content: {
              'application/json': {
                example: { status: 'active' }
              }
            }
          },
          responses: { 200: { description: 'Status updated' } }
        }
      },

      // ── Audience ───────────────────────────────────────────
      '/api/audience/filter': {
        post: {
          tags: ['Audience'],
          summary: 'Manual audience filter',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  segment: 'Young Professional',
                  preferredChannel: 'email',
                  minLifetimeValue: 5000,
                  minPurchases: 3
                }
              }
            }
          },
          responses: { 200: { description: 'Filtered customers' } }
        }
      },
      '/api/audience/auto-select': {
        post: {
          tags: ['Audience'],
          summary: 'ML-based auto audience selection',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignType: 'promotional',
                  minConfidence: 0.5
                }
              }
            }
          },
          responses: { 200: { description: 'Auto-selected audience' } }
        }
      },
      '/api/audience/segments': {
        get: {
          tags: ['Audience'],
          summary: 'Get available segments and channels',
          responses: { 200: { description: 'Segments and channels list' } }
        }
      },

      // ── Execute ────────────────────────────────────────────
      '/api/execute/email/send': {
        post: {
          tags: ['Execute'],
          summary: 'Send emails immediately',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignId: 'CAM001',
                  customerIds: ['C001', 'C006'],
                  subject: 'Special offer just for you!',
                  html: '<h1>Hi {{name}}</h1><p>Check out our latest deals!</p>'
                }
              }
            }
          },
          responses: { 200: { description: 'Emails sent' } }
        }
      },
      '/api/execute/email/schedule': {
        post: {
          tags: ['Execute'],
          summary: 'Schedule email for later',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignId: 'CAM001',
                  customerIds: ['C001', 'C006'],
                  subject: 'Special offer just for you!',
                  html: '<h1>Hi {{name}}</h1><p>Check out our latest deals!</p>',
                  scheduledAt: '2026-07-20T09:00:00.000Z'
                }
              }
            }
          },
          responses: { 200: { description: 'Email scheduled' } }
        }
      },
      '/api/execute/sms/send': {
        post: {
          tags: ['Execute'],
          summary: 'Send SMS immediately',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignId: 'CAM001',
                  customerIds: ['C001', 'C006'],
                  message: 'Hi {{name}}, special offer just for you! Visit our store today.'
                }
              }
            }
          },
          responses: { 200: { description: 'SMS sent' } }
        }
      },
      '/api/execute/sms/schedule': {
        post: {
          tags: ['Execute'],
          summary: 'Schedule SMS for later',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignId: 'CAM001',
                  customerIds: ['C001', 'C006'],
                  message: 'Hi {{name}}, special offer just for you!',
                  scheduledAt: '2026-07-20T09:00:00.000Z'
                }
              }
            }
          },
          responses: { 200: { description: 'SMS scheduled' } }
        }
      },
      '/api/execute/scheduled': {
        get: {
          tags: ['Execute'],
          summary: 'View all pending scheduled jobs',
          responses: { 200: { description: 'Scheduled jobs list' } }
        }
      },
      '/api/execute/scheduled/{jobId}': {
        delete: {
          tags: ['Execute'],
          summary: 'Cancel a scheduled job',
          parameters: [{ name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Job cancelled' } }
        }
      },
      '/api/execute/logs/email': {
        get: {
          tags: ['Execute'],
          summary: 'Email send history',
          parameters: [{ name: 'campaignId', in: 'query', schema: { type: 'string', example: 'CAM001' } }],
          responses: { 200: { description: 'Email logs' } }
        }
      },
      '/api/execute/logs/sms': {
        get: {
          tags: ['Execute'],
          summary: 'SMS send history',
          parameters: [{ name: 'campaignId', in: 'query', schema: { type: 'string', example: 'CAM001' } }],
          responses: { 200: { description: 'SMS logs' } }
        }
      },

      // ── Content ────────────────────────────────────────────
      '/api/content/generate': {
        post: {
          tags: ['Content'],
          summary: 'Generate AI email or SMS content using Groq',
          requestBody: {
            content: {
              'application/json': {
                example: {
                  campaignId: 'CAM001',
                  channel: 'email',
                  campaignType: 'promotional',
                  segment: 'Young Professional',
                  tone: 'friendly'
                }
              }
            }
          },
          responses: { 200: { description: 'Generated content' } }
        }
      },
      '/api/content/{campaignId}': {
        get: {
          tags: ['Content'],
          summary: 'Get previously generated content for a campaign',
          parameters: [{ name: 'campaignId', in: 'path', required: true, schema: { type: 'string', example: 'CAM001' } }],
          responses: { 200: { description: 'Campaign content history' } }
        }
      },

      // ── Intelligence ──────────────────────────────────────────
     
      '/api/intelligence/{campaignId}': {
        get: {
          tags: ['Intelligence'],
          summary: 'Get AI campaign intelligence report',
          description:
            'Generates an AI-powered intelligence report for a campaign using campaign performance, budget, reach, timeline, channel, and segment analytics. Reports generated today are returned from cache unless refresh=true is specified.',
          parameters: [
            {
              name: 'campaignId',
              in: 'path',
              required: true,
              description: 'Unique campaign identifier',
              schema: {
                type: 'string',
                example: 'CAM001'
              }
            },
            {
              name: 'refresh',
              in: 'query',
              required: false,
              description:
                'Force regeneration of the intelligence report instead of using the cached report.',
              schema: {
                type: 'boolean',
                default: false,
                example: false
              }
            }
          ],
          responses: {
            200: {
              description: 'Campaign intelligence report',
              content: {
                'application/json': {
                  example: {
                    campaignId: 'CAM001',
                    campaignName: 'Summer Sale 2026',
                    generatedAt: '2026-08-11T06:00:00.000Z',
                    fromCache: false,

                    healthScore: 82,
                    health: 'on_track',
                    onTrack: true,

                    metrics: {
                      budgetUtilisation: 62.5,
                      budgetRemaining: 18750,
                      reachEfficiency: 91.4,
                      daysRemaining: 12,
                      percentTimeElapsed: 70.0,
                      projectedReach: 105000,
                      targetReach: 100000,
                      willHitTarget: true
                    },

                    analysis: {
                      amIDoingItRight:
                        'The campaign is performing well overall and is currently on track to reach its target.',
                      whatIsWorking:
                        'Email is generating strong engagement. Reach is increasing at a healthy pace.',
                      whatIsNotWorking:
                        'Budget utilisation is slightly ahead of the campaign timeline. SMS performance is below average.',
                      bestICanDo:
                        'Shift more budget toward the best-performing channel. Reduce spend on underperforming channels. Maintain the current audience strategy.',
                      goalForecast:
                        'The campaign is likely to reach its target if the current performance continues.'
                    },

                    fullAnalysis:
                      'AM_I_DOING_IT_RIGHT:\\nThe campaign is performing well overall...'
                  }
                }
              }
            },
            404: {
              description: 'Campaign not found',
              content: {
                'application/json': {
                  example: {
                    error: 'Campaign CAM001 not found'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  example: {
                    error: 'Failed to generate campaign intelligence'
                  }
                }
              }
            }
          }
        }
      },

      '/api/intelligence': {
        get: {
          tags: ['Intelligence'],
          summary: 'Get latest AI intelligence reports for all campaigns',
          description:
            'Returns the latest stored campaign intelligence reports for all campaigns. Full AI analysis text is excluded from this endpoint.',
          responses: {
            200: {
              description: 'List of campaign intelligence reports',
              content: {
                'application/json': {
                  example: {
                    count: 2,
                    reports: [
                      {
                        campaignId: 'CAM001',
                        campaignName: 'Summer Sale 2026',
                        generatedAt: '2026-08-11T06:00:00.000Z',
                        healthScore: 82,
                        health: 'on_track',
                        onTrack: true,
                        metrics: {
                          budgetUtilisation: 62.5,
                          budgetRemaining: 18750,
                          reachEfficiency: 91.4,
                          daysRemaining: 12,
                          percentTimeElapsed: 70,
                          projectedReach: 105000,
                          targetReach: 100000,
                          willHitTarget: true
                        },
                        analysis: {
                          amIDoingItRight:
                            'The campaign is performing well overall.',
                          whatIsWorking:
                            'Email is generating strong engagement.',
                          whatIsNotWorking:
                            'SMS performance needs improvement.',
                          bestICanDo:
                            'Shift more budget toward the best-performing channel.',
                          goalForecast:
                            'The campaign is likely to hit its target.'
                        }
                      }
                    ]
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  example: {
                    error: 'Database error'
                  }
                }
              }
            }
          }
        }
      },

      // ── Analytics ──────────────────────────────────────────
      '/api/analytics/channel': {
        get: { tags: ['Analytics'], summary: 'Channel performance KPIs', responses: { 200: { description: 'Channel analytics' } } }
      },
      '/api/analytics/segment': {
        get: { tags: ['Analytics'], summary: 'Customer segment analytics', responses: { 200: { description: 'Segment analytics' } } }
      },
      '/api/analytics/channel-segment': {
        get: { tags: ['Analytics'], summary: 'Channel preference by segment', responses: { 200: { description: 'Cross analytics' } } }
      },

      // ── Insights ───────────────────────────────────────────
      '/api/insights/targeting': {
        get: { tags: ['Insights'], summary: 'AI targeting recommendations per customer', responses: { 200: { description: 'Targeting insights' } } }
      },
      '/api/insights/narrative': {
        get: { tags: ['Insights'], summary: 'AI-generated performance narrative', responses: { 200: { description: 'Performance narrative' } } }
      },
      '/api/insights/segments': {
        get: { tags: ['Insights'], summary: 'AI-generated segment strategy insights', responses: { 200: { description: 'Segment insights' } } }
      },

      // ── Customers ──────────────────────────────────────────
      '/api/customers': {
        get: { tags: ['Customers'], summary: 'Get all customers', responses: { 200: { description: 'Customer list' } } }
      },
      '/api/customers/targeting': {
        get: { tags: ['Customers'], summary: 'Get ML targeting scores per customer', responses: { 200: { description: 'Targeting scores' } } }
      }
    }
  },
  apis: []
}

module.exports = swaggerJsdoc(options)