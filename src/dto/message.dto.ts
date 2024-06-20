import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  content: string;

  @IsString()
  receiver: string;

  @IsString()
  @IsOptional()
  sender: string | null;

  @IsDateString()
  @IsOptional()
  scheduleAt: Date;
}
