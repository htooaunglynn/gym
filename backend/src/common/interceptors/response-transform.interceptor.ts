import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

/**
 * Wraps every successful response in a standard envelope:
 * { statusCode, message, data, timestamp }
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const statusCode = context
            .switchToHttp()
            .getResponse<Response>().statusCode;

        return next.handle().pipe(
            map((data: T) => ({
                statusCode,
                message: 'success',
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
