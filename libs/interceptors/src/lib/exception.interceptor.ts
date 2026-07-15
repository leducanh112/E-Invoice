import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { MetadataKeys } from '@common/constants/common.constant';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      ctx.getRequest();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];
    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        const durationMs = Date.now() - startTime;
        data.processId = processId;
        data.duration = `${durationMs} ms`;

        return data;
      }),
      catchError((error) => {
        const errorMessage = error?.response?.message ?? error?.message ?? HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        this.logger.error(typeof errorMessage === 'string' ? errorMessage : String(errorMessage));
        const durationMs = Date.now() - startTime;
        const message = errorMessage;
        const code = error?.code || error.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException(
          new ResponseDto({ data: null, message, statusCode: code, duration: `${durationMs} ms`, processId }),
          code,
        );
      }),
    );
  }
}
