import { IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  readonly func: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly args: string;

  @IsString()
  readonly kwargs: string;
}
