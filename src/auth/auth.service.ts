import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject('bcrypt') private bcrypt,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ email }).select('+password')
        let validPassword

        if (!user) return null
        
        validPassword = await this.validatePassword(password, user.password)

        if (validPassword) {
            const { _id, name, email } = user;
            return { id: _id, name, email };
        }

        return null;
    }

    async validatePassword(password: string, userPassword: string) {
        return this.bcrypt.compare(password, userPassword)
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

}
