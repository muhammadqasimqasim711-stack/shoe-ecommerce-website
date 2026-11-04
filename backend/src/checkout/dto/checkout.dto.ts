import { IsEmail, IsIn, IsOptional, IsString, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutAddressDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsString()
  @MinLength(1)
  state!: string;

  @IsString()
  @MinLength(1)
  zipCode!: string;

  @IsString()
  @MinLength(1)
  country!: string;
}

export class CheckoutPreviewDto {
  @IsString()
  cartId!: string;

  @IsIn(['standard', 'express'])
  shippingMethod!: 'standard' | 'express';

  @IsOptional()
  @ValidateNested()
  @Type(() => CheckoutAddressDto)
  address?: CheckoutAddressDto;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class PlaceOrderDto {
  @IsString()
  cartId!: string;

  @IsEmail()
  email!: string;

  @IsIn(['standard', 'express'])
  shippingMethod!: 'standard' | 'express';

  @ValidateIf((o: PlaceOrderDto) => !o.addressId)
  @ValidateNested()
  @Type(() => CheckoutAddressDto)
  address?: CheckoutAddressDto;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsIn(['mock'])
  paymentMethod!: 'mock';
}
