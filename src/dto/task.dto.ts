import { IsNotEmpty, IsString } from 'class-validator';

export class OdooCreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly func: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @IsString()
  @IsNotEmpty()
  readonly args: string;

  @IsString()
  @IsNotEmpty()
  readonly kwargs: string;

  @IsString()
  @IsNotEmpty()
  readonly records: string;

  @IsString()
  @IsNotEmpty()
  readonly executeUrl: string;
}
