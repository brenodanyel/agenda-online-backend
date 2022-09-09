import mailer from 'nodemailer';

const { MAILER_SERVICE: service, MAILER_USER: user, MAILER_PASSWORD: pass } = process.env;

export class Mailer {
  constructor(
    private transporter = mailer.createTransport({
      service,
      auth: { user, pass },
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      ignoreTLS: true,
    })
  ) { }

  public sendMail(to: string, subject: string, text: string) {
    return this.transporter.sendMail({ to, subject, text });
  }
}
