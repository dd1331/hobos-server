import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('deleted')
  findAllWithDeleted() {
    return this.usersService.findAllWithDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserOrFail(+id);
  }
  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Delete('delete/:id')
  hardRemove(@Param('id') id: string) {
    return this.usersService.hardRemove(+id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile/:id')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
