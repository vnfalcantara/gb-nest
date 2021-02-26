import { Controller, Get, Post, Body, Query, Put, Param, Delete, UsePipes, ValidationPipe, UseFilters, InternalServerErrorException, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestQuery } from '../common/dto/request-query.dto';
import { HttpExceptionFilter } from '../http-exception.filters';
import { UserBody, UserUpdate } from './dto/user.dto';
import { UserDocument } from './entities/user.entity';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@UseFilters(new HttpExceptionFilter())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() body: UserBody) {
    let data: UserDocument

    try {
      data = await this.userService.create(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return data
  }

  @Get()
  async findAll(@Query() query: RequestQuery) {
    const { match, fields, options } = query
    let data: Array<UserDocument>

    for (let key in fields) fields[key] = 1

    try {
      data = await this.userService.findAll(match, fields, options);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }

    return data
  }

  @Get('count')
  async count(@Query() query: RequestQuery) {
    const { match } = query
    let count: number

    try {
      count = await this.userService.count(match)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }

    return count
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: RequestQuery) {
    const { fields } = query
    let data: UserDocument

    for (let key in fields) fields[key] = 1

    try {
      data = await this.userService.findById(id, fields);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }

    return data
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UserUpdate) {
    let updateStatus: object

    try {
      updateStatus = await this.userService.updateById(id, body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return updateStatus
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let removeStatus: object

    try {
      removeStatus = await this.userService.updateById(id, {deleted: true});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return removeStatus
  }
}
