import { IsIn, IsOptional, IsString } from 'class-validator';

export class PayOrderDto {
  @IsIn(['mock'])
  provider!: 'mock';

  @IsOptional()
  @IsString()
  cardLast4?: string;
}
