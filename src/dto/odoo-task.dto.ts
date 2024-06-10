import { IsOptional, IsString } from 'class-validator';

export class OdooTaskDto {
  @IsString()
  readonly func: string;

  @IsString()
  readonly model: string;

  @IsString()
  @IsOptional()
  readonly args: string;

  @IsString()
  @IsOptional()
  readonly kwargs: string;
}
