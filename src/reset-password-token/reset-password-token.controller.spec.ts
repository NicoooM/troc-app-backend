import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordTokenController } from './reset-password-token.controller';
import { ResetPasswordTokenService } from './reset-password-token.service';

describe('ResetPasswordTokenController', () => {
  let controller: ResetPasswordTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordTokenController],
      providers: [ResetPasswordTokenService],
    }).compile();

    controller = module.get<ResetPasswordTokenController>(ResetPasswordTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
