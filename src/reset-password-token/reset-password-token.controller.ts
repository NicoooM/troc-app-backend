import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset-password-token.service';
import { CreateResetPasswordTokenDto } from './dto/create-reset-password-token.dto';

@Controller('reset-password-token')
export class ResetPasswordTokenController {
  constructor(
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  @Post()
  create(@Body() createResetPasswordTokenDto: CreateResetPasswordTokenDto) {
    return this.resetPasswordTokenService.create(createResetPasswordTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resetPasswordTokenService.remove(+id);
  }
}
