import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  createTransporter() {
    return nodemailer.createTransport({
      service: 'localhost',
      port: process.env.MAILDEV_SMTP_PORT,
      secure: false,
      // host: process.env.SMTP_HOST,
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASSWORD,
      // },
    });
  }

  create(createMailDto: CreateMailDto) {
    const transporter = this.createTransporter();
    const mailOptions = {
      from: 'example@example.com',
      to: createMailDto.to,
      subject: createMailDto.subject,
      html: createMailDto.html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return `Email sent: ${mailOptions}`;
  }
}
