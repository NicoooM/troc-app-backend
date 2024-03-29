import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRoomDto: CreateRoomDto, @User() user: UserEntity) {
    return this.roomsService.create(createRoomDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: UserEntity) {
    return this.roomsService.findAll(user);
  }

  @Get('one')
  @UseGuards(JwtAuthGuard)
  findOne(@User() user: UserEntity, @Query() queries: any) {
    return this.roomsService.findOne(user, queries);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomsService.update(+id, updateRoomDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
