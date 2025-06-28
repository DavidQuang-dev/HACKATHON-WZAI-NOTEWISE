import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    private sanitizeBody(body: any): any {
        const sanitized = { ...body };

        if (sanitized.password) {
            sanitized.password = '***';
        }

        return sanitized;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { ip, method, path, body } = request;
        const userAgent = request.get('user-agent') || '';
        const timestamp = new Date().toISOString();

        // Log the request
        this.logger.log(`[REQUEST] ${method} ${path} - ${ip} - ${timestamp}`);

        // Log user agent if available
        if (userAgent) {
            this.logger.log(`User-Agent: ${userAgent}`);
        }

        // Log the request body if it exists and is not empty
        if (body && Object.keys(body).length) {
            const sanitizedBody = this.sanitizeBody(body);
            this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
        }

        const now = Date.now();

        return next.handle().pipe(
            tap((response) => {
                const responseTime = Date.now() - now;

                // Log the response
                this.logger.log(
                    `[RESPONSE] ${method} ${path} - ${ip} - ${timestamp} - ${responseTime}ms`,
                );

                if (process.env.NODE_ENV === 'development') {
                    this.logger.debug(
                        `Response Body: ${JSON.stringify(this.sanitizeBody(response))}`,
                    );
                }
            }),
        );
    }
}