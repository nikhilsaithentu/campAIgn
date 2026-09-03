const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

const sendEmail = async ({ to, subject, html, campaignId }) => {
  const mailOptions = {
    from: `"campAIgn" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  }
  const result = await transporter.sendMail(mailOptions)
  return {
    success: true,
    messageId: result.messageId,
    to,
    campaignId,
    sentAt: new Date().toISOString()
  }
}

const sendBulkEmails = async ({ recipients, subject, html, campaignId }) => {
  const results = []
  for (const recipient of recipients) {
    try {
      const personalizedHtml = html.replace(/{{name}}/g, recipient.name || 'Valued Customer')
      const result = await sendEmail({ to: recipient.email, subject, html: personalizedHtml, campaignId })
      results.push({ customerId: recipient.customerId, email: recipient.email, status: 'sent', messageId: result.messageId, sentAt: result.sentAt })
    } catch (err) {
      results.push({ customerId: recipient.customerId, email: recipient.email, status: 'failed', error: err.message, sentAt: new Date().toISOString() })
    }
  }
  const sent = results.filter(r => r.status === 'sent').length
  const failed = results.filter(r => r.status === 'failed').length
  return { total: recipients.length, sent, failed, results }
}

module.exports = { sendEmail, sendBulkEmails }