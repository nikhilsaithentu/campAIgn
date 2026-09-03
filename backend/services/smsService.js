const axios = require('axios')

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2'

/**
 * sendSMS
 *
 * Sends a single SMS via Fast2SMS API.
 *
 * @param {Object} options
 * @param {string} options.to         - recipient phone number (10 digits, no +91)
 * @param {string} options.message    - SMS text (max 160 chars)
 * @param {string} options.campaignId - for logging
 */
const sendSMS = async ({ to, message, campaignId }) => {

  // Fast2SMS expects 10-digit number without country code
  const phone = to.replace(/^\+91/, '').replace(/\D/g, '')

  const response = await axios.post(
    FAST2SMS_URL,
    {
      route: 'q',
      message,
      language: 'english',
      numbers: phone
    },
    {
      headers: {
        authorization: FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.data.return) {
    throw new Error(`Fast2SMS error: ${JSON.stringify(response.data)}`)
  }

  return {
    success: true,
    requestId: response.data.request_id,
    to: phone,
    campaignId,
    sentAt: new Date().toISOString()
  }
}

/**
 * sendBulkSMS
 *
 * Sends SMS to a list of recipients one by one.
 * Logs each result — success or failure — without stopping the batch.
 *
 * @param {Array}  recipients  - list of { phone, name, customerId }
 * @param {string} message     - SMS text with {{name}} placeholder
 * @param {string} campaignId  - for logging
 */
const sendBulkSMS = async ({ recipients, message, campaignId }) => {
  const results = []

  for (const recipient of recipients) {
    try {
      // Personalise message
      const personalizedMessage = message.replace(/{{name}}/g, recipient.name || 'Valued Customer')

      const result = await sendSMS({
        to: recipient.phone,
        message: personalizedMessage,
        campaignId
      })

      results.push({
        customerId: recipient.customerId,
        phone: recipient.phone,
        status: 'sent',
        requestId: result.requestId,
        sentAt: result.sentAt
      })

    } catch (err) {
      results.push({
        customerId: recipient.customerId,
        phone: recipient.phone,
        status: 'failed',
        error: err.message,
        sentAt: new Date().toISOString()
      })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const failed = results.filter(r => r.status === 'failed').length

  return { total: recipients.length, sent, failed, results }
}

module.exports = { sendSMS, sendBulkSMS }