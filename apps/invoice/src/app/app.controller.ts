import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(
    @ProcessId() processId: string,
    @RequestParams() params: unknown,
    @RequestParams('invoidId') invoiceId: number,
  ): Response<string> {
    Logger.debug(
      `Received get_invoice request with processId: ${processId}, params: ${JSON.stringify(params)}, invoiceId: ${invoiceId}`,
    );
    return Response.success<string>(`Invoice: ${invoiceId}`);
  }
}
