const cron = require('node-cron')
const { sendBulkEmails } = require('./emailService')
const { sendBulkSMS } = require('./smsService')

// In-memory store of scheduled jobs
// Key: jobId, Value: { cronJob, details }
const scheduledJobs = new Map()

/**
 * scheduleExecution
 *
 * Schedules an email or SMS send for a future date/time.
 * Converts the scheduled datetime to a cron expression,
 * runs once at that time, then removes itself.
 *
 * @param {Object} options
 * @param {string} options.jobId        - unique ID for this job
 * @param {string} options.channel      - "email" | "sms"
 * @param {string} options.scheduledAt  - ISO datetime string
 * @param {Array}  options.recipients   - list of recipients
 * @param {string} options.subject      - email subject (email only)
 * @param {string} options.content      - email HTML or SMS text
 * @param {string} options.campaignId   - campaign this belongs to
 * @param {Object} options.db           - MongoDB db instance
 */
const scheduleExecution = ({ jobId, channel, scheduledAt, recipients, subject, content, campaignId, db }) => {

  const date = new Date(scheduledAt)

  // Build cron expression: "minute hour day month *"
  const cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`

  const job = cron.schedule(cronExpression, async () => {
    console.log(`🕐 Running scheduled job ${jobId} for campaign ${campaignId}`)

    try {
      let result
      if (channel === 'email') {
        result = await sendBulkEmails({ recipients, subject, html: content, campaignId })
      } else if (channel === 'sms') {
        result = await sendBulkSMS({ recipients, message: content, campaignId })
      }

      // Log to MongoDB
      await db.collection('scheduled_jobs').updateOne(
        { jobId },
        { $set: { status: 'completed', result, completedAt: new Date().toISOString() } }
      )

      // Log individual sends
      const logCollection = channel === 'email' ? 'email_logs' : 'sms_logs'
      await db.collection(logCollection).insertMany(
        result.results.map(r => ({ ...r, campaignId, jobId, channel }))
      )

      console.log(`✅ Job ${jobId} completed — ${result.sent} sent, ${result.failed} failed`)

    } catch (err) {
      console.error(`❌ Job ${jobId} failed:`, err.message)
      await db.collection('scheduled_jobs').updateOne(
        { jobId },
        { $set: { status: 'failed', error: err.message, failedAt: new Date().toISOString() } }
      )
    }

    // Remove job after it runs once
    job.stop()
    scheduledJobs.delete(jobId)

  }, { scheduled: true, timezone: 'Asia/Kolkata' })

  scheduledJobs.set(jobId, { job, jobId, channel, scheduledAt, campaignId })
  console.log(`📅 Job ${jobId} scheduled for ${scheduledAt}`)

  return { jobId, scheduledAt, channel, campaignId }
}

const cancelJob = (jobId) => {
  const entry = scheduledJobs.get(jobId)
  if (!entry) return false
  entry.job.stop()
  scheduledJobs.delete(jobId)
  return true
}

const getActiveJobs = () => {
  return Array.from(scheduledJobs.values()).map(({ jobId, channel, scheduledAt, campaignId }) => ({
    jobId, channel, scheduledAt, campaignId
  }))
}

module.exports = { scheduleExecution, cancelJob, getActiveJobs }