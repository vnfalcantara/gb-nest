import { Controller, Get, Post, Body, Query, Put, Param, Delete, UsePipes, ValidationPipe, UseFilters, InternalServerErrorException, UseGuards, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RequestQuery } from '../common/dto/request-query.dto';
import { HttpExceptionFilter } from '../http-exception.filters';
import { PurchaseBody, PurchaseUpdate } from './dto/purchase.dto';
import { PurchaseDocument } from './entities/purchase.entity';
import { PurchaseService } from './purchase.service';
import { UserService } from '../user/user.service'
import { UserDocument } from '../user/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@UseFilters(new HttpExceptionFilter())
@Controller('purchase')
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly userService: UserService,
        @InjectQueue('PURCHASE') private readonly purchaseQueue: Queue,
    ) { }

    @Post()
    async create(@Request() req: any, @Body() body: PurchaseBody) {
        let user: UserDocument

        try {
            user = await this.userService.findOne({ _id: req.user.id })
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user)
            throw new UnauthorizedException();

        this.purchaseQueue.add('PURCHASE_VALIDATION', {
            ...body,
            user: user.cpf,
            added_to_queue: new Date()
        })

        return {message: 'Adicionado a fila de validação'}
    }

    @Get()
    async findAll(@Query() query: RequestQuery) {
        const { match, fields, options } = query
        let data: Array<PurchaseDocument>

        for (let key in fields) fields[key] = 1

        try {
            data = await this.purchaseService.findAll(match, fields, options);
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
            count = await this.purchaseService.count(match)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }

        return count
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query() query: RequestQuery) {
        const { fields } = query
        let data: PurchaseDocument

        for (let key in fields) fields[key] = 1

        try {
            data = await this.purchaseService.findById(id, fields);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }

        return data
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: PurchaseUpdate) {
        let updateStatus

        try {
            updateStatus = await this.purchaseService.updateById(id, body);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!updateStatus.nModified)
            throw new BadRequestException();

        return updateStatus
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        let removeStatus

        try {
            removeStatus = await this.purchaseService.updateById(id, { deleted: true });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!removeStatus.nModified)
            throw new BadRequestException();

        return removeStatus
    }
}
