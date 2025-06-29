import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncLocalStorage } from 'async_hooks';

// Global storage để lưu user context
declare global {
    var __userContextStorage__: AsyncLocalStorage<any>;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly asyncLocalStorage: AsyncLocalStorage<any>;

    constructor() {
        // Khởi tạo hoặc sử dụng global storage
        if (!global.__userContextStorage__) {
            global.__userContextStorage__ = new AsyncLocalStorage();
        }
        this.asyncLocalStorage = global.__userContextStorage__;
    }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // Lấy user info từ request (đã được set bởi GlobalAuthGuard)
        const user = request.user;
        // Nếu có user context, lưu vào AsyncLocalStorage
        if (user && user.id) {
            return new Observable((observer) => {
                this.asyncLocalStorage.run(user, () => {
                    next.handle().subscribe({
                        next: (value) => observer.next(value),
                        error: (error) => observer.error(error),
                        complete: () => observer.complete(),
                    });
                });
            });
        }

        // Nếu không có user context (public routes), continue bình thường
        return next.handle();
    }
}