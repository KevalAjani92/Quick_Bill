import { IsOptional, IsString, IsIn } from 'class-validator';

export class OrderQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'completed', 'cancelled', 'today'], {
    message: 'Filter must be all, completed, cancelled, or today',
  })
  filter?: string;
}
