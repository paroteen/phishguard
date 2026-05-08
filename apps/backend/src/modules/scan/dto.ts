import { IsOptional, IsString, MinLength } from "class-validator";

export class ScanMessageDto {
  @IsString()
  @MinLength(5)
  text!: string;
}

export class ScanUrlDto {
  @IsString()
  url!: string;
}

export class HistoryQueryDto {
  @IsOptional()
  @IsString()
  q?: string;
}
