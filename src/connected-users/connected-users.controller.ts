import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConnectedUsersService } from './connected-users.service';
import { CreateConnectedUserDto } from './dto/create-connected-user.dto';
import { UpdateConnectedUserDto } from './dto/update-connected-user.dto';

@Controller('connected-users')
export class ConnectedUsersController {
  constructor(private readonly connectedUsersService: ConnectedUsersService) {}

  @Post()
  create(@Body() createConnectedUserDto: CreateConnectedUserDto) {
    return this.connectedUsersService.create(createConnectedUserDto);
  }

  @Get()
  findAll() {
    return this.connectedUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectedUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConnectedUserDto: UpdateConnectedUserDto,
  ) {
    return this.connectedUsersService.update(+id, updateConnectedUserDto);
  }

  @Delete(':socketId')
  remove(@Param('socketId') socketId: string) {
    return this.connectedUsersService.remove(socketId);
  }
}
