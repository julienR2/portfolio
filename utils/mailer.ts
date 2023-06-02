import nodemailer from 'nodemailer'

export const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  pool: true,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})
