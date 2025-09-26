declare module 'nodemailer' {
  interface TransportAuth {
    user: string;
    pass: string;
  }

  interface TransportOptions {
    host: string;
    port: number;
    secure?: boolean;
    auth?: TransportAuth;
  }

  interface SendMailOptions {
    from?: string;
    to?: string;
    subject: string;
    text: string;
  }

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<void>;
  }

  export function createTransport(options: TransportOptions): Transporter;
}
