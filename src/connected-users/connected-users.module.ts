import { Module } from '@nestjs/common';
import { ConnectedUsersService } from './connected-users.service';
import { ConnectedUsersController } from './connected-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUserEntity])],
  controllers: [ConnectedUsersController],
  providers: [ConnectedUsersService],
  exports: [ConnectedUsersService],
})
export class ConnectedUsersModule {}
