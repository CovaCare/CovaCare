const SENDMAIL_TRANSPORT = {
  // This transport uses the local sendmail installation.
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
};

const SMTP_TRANSPORT = {
  // This is a Nodemailer transport. It can either be an SMTP server or a
  // well-known service such as Sengrid, Mailgun, Gmail, etc.
  // See https://nodemailer.com/transports/ and https://nodemailer.com/smtp/well-known/
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'dongyunkim016@gmail.com',
    pass: 'tpki ldml cckw oelo',
  },
  secureConnection: 'false',
  tls: {
    ciphers: 'SSLv3',
  },
};

module.exports = {
  transport: SMTP_TRANSPORT,
  mailOptions: {
    from: '"David Kim" <dongyunkim016@gmail.com>',
  },
  debugEnabled: false,
};