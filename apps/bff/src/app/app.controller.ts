import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { map } from 'rxjs';
import { UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ProcessId } from '@common/decorators/processId.decorator';

@Controller('app')
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<string, unknown>('get_invoice', { processId, data: { invoidId: 1, invoideName: 'Invoice 1' } })
      .pipe(map((data) => new ResponseDto<string>(data)));
  }
}
