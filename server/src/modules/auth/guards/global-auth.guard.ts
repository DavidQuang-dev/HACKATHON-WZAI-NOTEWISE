import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            if (isPublic) {
                return true;
            }
            throw new UnauthorizedException('Không tìm thấy token xác thực');
        }

        try {
            // Xác thực token bằng JwtService tùy chỉnh
            const payload = await this.jwtService.verifyToken(token);

            // Gán thông tin người dùng vào request
            request['user'] = {
                id: payload.sub,
                email: payload.email,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException(
                error instanceof Error ? error.message : 'Unauthorized'
            );
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}