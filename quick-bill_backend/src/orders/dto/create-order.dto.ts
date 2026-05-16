import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsInt({ message: 'Quantity must be a whole number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  customerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  customerPhone?: string;

  @IsString()
  @IsIn(['cash', 'card', 'upi'], { message: 'Payment method must be cash, card, or upi' })
  paymentMethod: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must have at least one item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
