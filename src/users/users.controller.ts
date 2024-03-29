import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@User() user) {
    return this.usersService.getMe(user);
  }

  @Get(':emailOrUsername')
  findOne(@Param('emailOrUsername') emailOrUsername: string) {
    return this.usersService.findOne(emailOrUsername);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateUserDto: UpdateUserDto, @User() user) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
