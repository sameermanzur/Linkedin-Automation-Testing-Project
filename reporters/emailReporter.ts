import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  TestError,
} from '@playwright/test';

type NodemailerModule = typeof import('nodemailer');

type ReporterStatus = TestResult['status'];

type FinalResult = {
  title: string;
  status: ReporterStatus;
  duration: number;
  error?: TestError;
  flaky?: boolean;
};

type Summary = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  flaky: number;
  startTime: Date;
  endTime: Date;
};

type EmailReporterOptions = {
  from?: string;
  to?: string;
  subjectPrefix?: string;
  transport?: 'smtp';
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPassword?: string;
  dryRun?: boolean;
};

type EmailContent = {
  subject: string;
  text: string;
};

function statusPriority(status: ReporterStatus): number {
  switch (status) {
    case 'failed':
      return 4;
    case 'timedOut':
      return 3;
    case 'skipped':
      return 2;
    case 'passed':
      return 1;
    case 'interrupted':
    default:
      return 0;
  }
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) return '0s';
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${seconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
  return parts.join(' ');
}

function defaultOptions(): EmailReporterOptions {
  return {
    from: process.env.EMAIL_REPORTER_FROM,
    to: process.env.EMAIL_REPORTER_TO,
    subjectPrefix: process.env.EMAIL_REPORTER_SUBJECT_PREFIX ?? 'Playwright',
    transport: 'smtp',
    smtpHost: process.env.EMAIL_REPORTER_SMTP_HOST,
    smtpPort: process.env.EMAIL_REPORTER_SMTP_PORT
      ? Number(process.env.EMAIL_REPORTER_SMTP_PORT)
      : undefined,
    smtpSecure: process.env.EMAIL_REPORTER_SMTP_SECURE
      ? process.env.EMAIL_REPORTER_SMTP_SECURE === 'true'
      : undefined,
    smtpUser: process.env.EMAIL_REPORTER_SMTP_USER,
    smtpPassword: process.env.EMAIL_REPORTER_SMTP_PASSWORD,
    dryRun: process.env.EMAIL_REPORTER_DRY_RUN === 'true',
  };
}

export function buildEmailContent(summary: Summary, results: FinalResult[], options: EmailReporterOptions = {}): EmailContent {
  const totalDuration = summary.endTime.getTime() - summary.startTime.getTime();
  const subject = `${options.subjectPrefix ?? 'Playwright'} Test Results: ${summary.passed}/${summary.total} passed`;
  const lines: string[] = [];
  lines.push(`Test run completed at ${summary.endTime.toISOString()}`);
  lines.push(`Duration: ${formatDuration(totalDuration)}`);
  lines.push('');
  lines.push('Summary:');
  lines.push(`  Total: ${summary.total}`);
  lines.push(`  Passed: ${summary.passed}`);
  lines.push(`  Failed: ${summary.failed}`);
  lines.push(`  Skipped: ${summary.skipped}`);
  lines.push(`  Timed out: ${summary.timedOut}`);
  lines.push(`  Flaky: ${summary.flaky}`);

  if (results.length > 0) {
    lines.push('');
    lines.push('Details:');
    for (const result of results) {
      const duration = formatDuration(result.duration);
      const statusLabel = result.flaky ? 'FLAKY' : result.status.toUpperCase();
      const header = `- [${statusLabel}] ${result.title} (${duration})`;
      lines.push(header);
      if (result.error && result.status !== 'passed') {
        const message = result.error.message?.trim() ?? 'Unknown error';
        lines.push(`    ${message.replace(/\s+/g, ' ')}`);
      }
    }
  }

  return {
    subject,
    text: lines.join('\n'),
  };
}

async function loadNodemailer(): Promise<NodemailerModule | null> {
  const nodemailerModule = await import('nodemailer').then(module => module).catch(() => null);
  return nodemailerModule;
}

class EmailReporter implements Reporter {
  private readonly results = new Map<string, FinalResult>();
  private readonly options: EmailReporterOptions;
  private startTime: Date = new Date();
  private endTime: Date = new Date();

  constructor(options?: EmailReporterOptions) {
    this.options = { ...defaultOptions(), ...options };
  }

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.startTime = new Date();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const title = test.titlePath().join(' › ');
    const existing = this.results.get(title);
    const current: FinalResult = {
      title,
      status: result.status,
      duration: result.duration,
      error: result.error,
      flaky: result.status === 'passed' && result.retry > 0,
    };

    if (!existing || statusPriority(result.status) >= statusPriority(existing.status)) {
      this.results.set(title, current);
    }
  }

  async onEnd(): Promise<void> {
    this.endTime = new Date();

    const results = Array.from(this.results.values());
    const summary: Summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      timedOut: results.filter(r => r.status === 'timedOut').length,
      flaky: results.filter(r => r.flaky).length,
      startTime: this.startTime,
      endTime: this.endTime,
    };

    const content = buildEmailContent(summary, results, this.options);

    if (this.options.dryRun || !this.options.to || !this.options.from) {
      console.info('[EmailReporter] Dry run or missing recipient; email not sent.');
      console.info(content.text);
      return;
    }

    if (this.options.transport === 'smtp') {
      await this.sendWithSmtp(content);
    }
  }

  private async sendWithSmtp(content: EmailContent): Promise<void> {
    if (!this.options.smtpHost || !this.options.smtpPort) {
      console.warn('[EmailReporter] SMTP host or port not configured. Email not sent.');
      console.info(content.text);
      return;
    }

    const nodemailer = await loadNodemailer();

    if (!nodemailer) {
      console.warn('[EmailReporter] nodemailer package is not available. Email not sent.');
      console.info(content.text);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: this.options.smtpHost,
      port: this.options.smtpPort,
      secure: this.options.smtpSecure ?? false,
      auth:
        this.options.smtpUser && this.options.smtpPassword
          ? {
              user: this.options.smtpUser,
              pass: this.options.smtpPassword,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: this.options.from,
      to: this.options.to,
      subject: content.subject,
      text: content.text,
    });
  }
}

export default EmailReporter;
export type { EmailReporterOptions, EmailContent, Summary, FinalResult };
