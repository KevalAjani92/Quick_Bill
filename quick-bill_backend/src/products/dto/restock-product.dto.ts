import { IsInt, Min } from 'class-validator';

export class RestockProductDto {
  @IsInt({ message: 'Quantity must be a whole number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
