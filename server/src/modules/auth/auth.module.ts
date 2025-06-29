import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from 'src/shared/jwt/jwt.module';
import { AccountModule } from '../account/account.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [JwtModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule { }
