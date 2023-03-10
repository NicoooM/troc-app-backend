import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ResetPasswordTokenService } from 'src/reset-password-token/reset-password-token.service';
import { ResetPasswordTokenEntity } from 'src/reset-password-token/entities/reset-password-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([UserEntity, ResetPasswordTokenEntity]),
  ],
  providers: [AuthService, JwtStrategy, ResetPasswordTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
