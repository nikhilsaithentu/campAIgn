/**
 * services.test.js
 * ─────────────────
 * Unit tests for email service and scheduler service.
 * External APIs are mocked — no real emails sent.
 */

const { sendEmail, sendBulkEmails } = require('../services/emailService')
const { scheduleExecution, cancelJob, getActiveJobs } = require('../services/schedulerService')

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-message-id', accepted: ['test@example.com'], rejected: [] })
  })
}))

jest.mock('node-cron', () => ({
  schedule: jest.fn().mockReturnValue({ stop: jest.fn() })
}))

describe('emailService', () => {

  beforeEach(() => {
    process.env.GMAIL_USER = 'test@gmail.com'
    process.env.GMAIL_APP_PASSWORD = 'testpassword'
  })

  describe('sendEmail', () => {

    test('sends email and returns success', async () => {
      const result = await sendEmail({ to: 'test@example.com', subject: 'Test', html: '<p>Body</p>', campaignId: 'CAM001' })
      expect(result.success).toBe(true)
      expect(result).toHaveProperty('messageId')
      expect(result).toHaveProperty('sentAt')
      expect(result.to).toBe('test@example.com')
    })

    test('returns campaignId in result', async () => {
      const result = await sendEmail({ to: 'test@example.com', subject: 'Test', html: '<p>Body</p>', campaignId: 'CAM002' })
      expect(result.campaignId).toBe('CAM002')
    })

  })

  describe('sendBulkEmails', () => {

    test('sends to all recipients', async () => {
      const recipients = [
        { customerId: 'C001', name: 'Aarav', email: 'aarav@example.com' },
        { customerId: 'C002', name: 'Priya', email: 'priya@example.com' }
      ]
      const result = await sendBulkEmails({ recipients, subject: 'Bulk Test', html: '<p>Hello {{name}}</p>', campaignId: 'CAM001' })
      expect(result.total).toBe(2)
      expect(result.sent).toBe(2)
      expect(result.failed).toBe(0)
    })

    test('personalises email with customer name', async () => {
      const nodemailer = require('nodemailer')
      const mockSendMail = nodemailer.createTransport().sendMail
      const recipients = [{ customerId: 'C001', name: 'Aarav', email: 'aarav@example.com' }]

      await sendBulkEmails({ recipients, subject: 'Test', html: '<p>Hello {{name}}</p>', campaignId: 'CAM001' })

      const callArgs = mockSendMail.mock.calls[0][0]
      expect(callArgs.html).toContain('Aarav')
      expect(callArgs.html).not.toContain('{{name}}')
    })

    test('handles partial failures gracefully', async () => {
      const nodemailer = require('nodemailer')
      const mockSendMail = nodemailer.createTransport().sendMail
      mockSendMail
        .mockResolvedValueOnce({ messageId: 'mock-id' })
        .mockRejectedValueOnce(new Error('SMTP error'))

      const recipients = [
        { customerId: 'C001', name: 'Aarav', email: 'aarav@example.com' },
        { customerId: 'C002', name: 'Priya', email: 'priya@example.com' }
      ]

      const result = await sendBulkEmails({ recipients, subject: 'Test', html: '<p>Hello {{name}}</p>', campaignId: 'CAM001' })
      expect(result.total).toBe(2)
      expect(result.sent + result.failed).toBe(2)
    })

    test('uses fallback name when customer name missing', async () => {
      const nodemailer = require('nodemailer')
      const mockSendMail = nodemailer.createTransport().sendMail
      const recipients = [{ customerId: 'C001', email: 'test@example.com' }]

      await sendBulkEmails({ recipients, subject: 'Test', html: '<p>Hello {{name}}</p>', campaignId: 'CAM001' })

      const callArgs = mockSendMail.mock.calls[0][0]
      expect(callArgs.html).toContain('Valued Customer')
    })

  })

})

describe('schedulerService', () => {

  describe('scheduleExecution', () => {

    test('schedules a job and returns job details', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString()
      const result = scheduleExecution({
        jobId: 'test-job-1', channel: 'email', scheduledAt: futureDate,
        recipients: [{ customerId: 'C001', email: 'test@example.com' }],
        subject: 'Test', content: '<p>Content</p>', campaignId: 'CAM001', db: {}
      })

      expect(result).toHaveProperty('jobId')
      expect(result.channel).toBe('email')
      expect(result.campaignId).toBe('CAM001')
    })

  })

  describe('cancelJob', () => {

    test('cancels an existing job', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString()
      scheduleExecution({
        jobId: 'test-job-cancel', channel: 'email', scheduledAt: futureDate,
        recipients: [], content: '', campaignId: 'CAM001', db: {}
      })

      const result = cancelJob('test-job-cancel')
      expect(result).toBe(true)
    })

    test('returns false for non-existent job', () => {
      const result = cancelJob('non-existent-job')
      expect(result).toBe(false)
    })

  })

  describe('getActiveJobs', () => {

    test('returns array of active jobs', () => {
      const jobs = getActiveJobs()
      expect(Array.isArray(jobs)).toBe(true)
    })

  })

})