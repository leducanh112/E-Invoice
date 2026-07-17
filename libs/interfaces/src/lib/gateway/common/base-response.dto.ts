import { ApiProperty } from '@nestjs/swagger';
import { Date } from 'mongoose';

export class BaseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
