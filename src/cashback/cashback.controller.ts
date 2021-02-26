import { Controller, Get, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filters';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CashbackService } from './cashback.service';

@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
@Controller('cashback')
export class CashbackController {

    constructor(
        private cashbackService: CashbackService,
    ) {}

    @Get()
    async getCashback() {
        let response

        try {
            response = await this.cashbackService.find()
        } catch (error) {
            console.log(error)
        }

        return response.data
    }
}
