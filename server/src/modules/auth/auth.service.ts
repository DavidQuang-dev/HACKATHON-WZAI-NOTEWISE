import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtPayload, Tokens } from './interfaces/JwtPayload.interface';
import { AccountService } from '../account/account.service';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly accountService: AccountService,
    ) { }

    /**
     * Generate access and refresh tokens for the user
     * @param payload JWT payload containing user information
     * @returns Tokens object containing access and refresh tokens
     */
    private async getTokens(payload: JwtPayload): Promise<Tokens> {
        const accessToken = await this.jwtService.generateAccessToken(payload);
        return {
            accessToken,
        };
    }

    /**
     * Handle Google login and return JWT tokens
     * @param user Data from Google OAuth
     * @returns Tokens object containing access and refresh tokens  
     */
    async googleLogin(user: any): Promise<Tokens> {
        const existingUser = await this.accountService.findOneByOptions({
            where: { email: user.email },
        });
        let userId = existingUser ? existingUser.id : null;

        // If the user does not exist, create a new user
        if (!existingUser) {
            const newUser = await this.accountService.create(
                {
                    email: user.email,
                    fullName: user.firstName + ' ' + user.lastName,
                    profilePicture: user.picture,
                },
                []
            )
            userId = newUser.id;
        }

        if (userId === null || userId === undefined) {
            throw new BadRequestException('User ID is required');
        }
        
        const payload = {
            sub: userId,
            email: user.email,
        };
        const tokens = await this.getTokens(payload);

        return tokens;
    }
}