import { HttpService, Injectable } from '@nestjs/common';
@Injectable()
export class CashbackService {
    
    constructor(
        private httpService: HttpService,
    ) {}

    find() {
        return this.httpService.get('/cashback?cpf=12312312323').toPromise()
    }

}
