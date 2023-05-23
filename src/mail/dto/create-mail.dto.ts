export class CreateMailDto {
  name: string;
  subject?: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  templateId: number;
  params: object;
}
