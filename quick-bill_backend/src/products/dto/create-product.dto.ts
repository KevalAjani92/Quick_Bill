import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MaxLength(150)
  productName: string;

  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @MaxLength(50)
  sku: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barcode?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Selling price must be a valid number' })
  @Min(0.01, { message: 'Selling price must be greater than 0' })
  sellingPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  costPrice?: number;

  @IsInt({ message: 'Stock quantity must be a whole number' })
  @Min(0, { message: 'Stock quantity cannot be negative' })
  stockQuantity: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  lowStockThreshold?: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  unit?: string;
}
