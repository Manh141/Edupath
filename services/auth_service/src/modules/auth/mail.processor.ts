import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import nodemailer, { type Transporter } from 'nodemailer';
import { AuthChallengePurpose } from '../../common/prisma/prisma-client';

type MailJobData = {
  email?: string;
  code?: string;
  purpose?: AuthChallengePurpose;
};

@Injectable()
@Processor('mail_queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    super();

    const smtpUser = this.configService.get<string>('SMTP_USER')?.trim();
    const smtpPass = this.configService.get<string>('SMTP_PASS') ?? '';

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: smtpUser
        ? {
            user: smtpUser,
            pass: smtpPass,
          }
        : undefined,
    });
  }

  private getFromAddress(): string {
    const fromEmail = this.configService.getOrThrow<string>('MAIL_FROM');
    const fromName = this.configService.get<string>('MAIL_FROM_NAME')?.trim();

    return fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
  }

  private getOtpExpiryMinutes(): number {
    return this.configService.get<number>(
      'AUTH_CHALLENGE_EXPIRES_IN_MINUTES',
      10,
    );
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.getFromAddress(),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  async process(job: Job<MailJobData>): Promise<void> {
    if (job.name === 'send-auth-code-email') {
      if (!job.data.email || !job.data.code || !job.data.purpose) {
        throw new Error(
          'Auth code email job is missing email, code, or purpose.',
        );
      }

      const purpose =
        job.data.purpose === AuthChallengePurpose.register_email
          ? 'sign-up'
          : 'sign-in';

      const expiryMinutes = this.getOtpExpiryMinutes();

      await this.sendMail({
        to: job.data.email,
        subject:
          job.data.purpose === AuthChallengePurpose.register_email
            ? 'Your EduPath sign-up code'
            : 'Your EduPath sign-in code',
        text: `Your EduPath ${purpose} code is ${job.data.code}. It expires in ${expiryMinutes} minutes.`,
        html: `<p>Your EduPath ${purpose} code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${job.data.code}</p><p>This code expires in ${expiryMinutes} minutes.</p>`,
      });

      this.logger.log(`${purpose} code email sent to ${job.data.email}`);
      return;
    }

    this.logger.warn(`Unknown mail job received: ${job.name}`);
  }
}
