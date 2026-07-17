import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { InvoiceService } from '../services/invoice.service';
@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

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
