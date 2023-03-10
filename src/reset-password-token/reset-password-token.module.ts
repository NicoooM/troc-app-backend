import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset-password-token.service';
import { ResetPasswordTokenController } from './reset-password-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordTokenEntity, UserEntity])],
  controllers: [ResetPasswordTokenController],
  providers: [ResetPasswordTokenService, UsersService],
})
export class ResetPasswordTokenModule {}
