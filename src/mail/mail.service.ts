import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MailService {
  constructor(private readonly httpService: HttpService) {}

  async create(createMailDto: CreateMailDto) {
    const url = 'https://api.brevo.com/v3/smtp/email';
    const apiKey = process.env.BREVO_API_KEY;

    const headers = {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    };

    const data = JSON.stringify({
      to: [
        {
          email: createMailDto.receiverEmail,
          name: createMailDto.receiverName,
        },
      ],
      subject: createMailDto.subject,
      templateId: createMailDto.templateId,
      params: {
        ...createMailDto.params,
      },
      headers: {
        'X-Mailin-custom':
          'custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3',
        charset: 'iso-8859-1',
      },
    });

    try {
      const res = await this.httpService.axiosRef.post(url, data, {
        headers,
      });
      return res;
    } catch (error) {
      // Handle any errors
      throw new Error('Failed to send email.');
    }
  }
}
