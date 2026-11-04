import { IsOptional, IsString } from 'class-validator';

export class ShippingRatesDto {
  @IsString()
  cartId!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}
