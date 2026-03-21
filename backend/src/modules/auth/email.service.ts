import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly resend: Resend | null;
    private readonly fromAddress: string;
    private readonly emailEnabled: boolean;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        this.fromAddress = process.env.EMAIL_FROM ?? 'noreply@gym.app';

        if (!apiKey) {
            const isProd = process.env.NODE_ENV === 'production';
            if (isProd) {
                throw new Error('Missing required env var RESEND_API_KEY');
            }

            this.resend = null;
            this.emailEnabled = false;
            this.logger.warn(
                'RESEND_API_KEY is not set. Email sending is disabled in non-production mode.',
            );
            return;
        }

        this.resend = new Resend(apiKey);
        this.emailEnabled = true;
    }

    async sendPasswordResetCode(to: string, code: string): Promise<void> {
        if (!this.emailEnabled || !this.resend) {
            this.logger.warn(
                `Password reset email skipped for ${to}. Generated code: ${code}`,
            );
            return;
        }

        try {
            await this.resend.emails.send({
                from: this.fromAddress,
                to,
                subject: 'Your password reset code',
                html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1e293b;">Password Reset</h2>
            <p style="color: #475569;">Use the code below to reset your password. It expires in 10 minutes.</p>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
            });
        } catch (error) {
            this.logger.error('Failed to send password reset email', error);
            throw new InternalServerErrorException(
                'Unable to send password reset email',
            );
        }
    }
}
