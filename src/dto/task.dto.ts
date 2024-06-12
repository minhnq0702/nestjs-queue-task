import { IsArray, IsObject, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  readonly func: string;

  @IsString()
  readonly model: string;

  @IsArray()
  readonly args: Array<string | number | Array<any>>;

  @IsObject()
  readonly kwargs: Record<string | number, string | number | Array<any>>;
}
