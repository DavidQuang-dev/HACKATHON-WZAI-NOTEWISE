import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';

interface RequestWithUser extends Request {
  user?: any;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Public(true)
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth login',
    description: 'Initiate Google OAuth authentication flow',
  })
  @ApiOkResponse({
    description: 'Redirects to Google OAuth consent screen',
  })
  async googleAuth() {
    // Passport will handle the redirect
  }

  @Public(true)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handle Google OAuth callback and complete authentication',
  })
  @ApiOkResponse({
    description: 'Google authentication successful, redirects to frontend with tokens',
  })
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const response = await this.authService.googleLogin(req.user);
    if (!response) {
      return res.redirect(`${this.configService.get<string>('frontend.url')}/auth/error`);
    }

    // Redirect to frontend with access token
    res.redirect(`${this.configService.get<string>('frontend.url')}/auth/callback?accessToken=${response.accessToken}`);
  }
}