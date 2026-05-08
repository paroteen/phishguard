import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { HistoryQueryDto, ScanMessageDto, ScanUrlDto } from "./dto";
import { ScanService } from "./scan.service";

@ApiTags("Scanner")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("scan")
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post("message")
  scanMessage(
    @Req() req: { user: { userId: string } },
    @Body() dto: ScanMessageDto
  ) {
    return this.scanService.scanMessage(req.user.userId, dto.text);
  }

  @Post("url")
  scanUrl(@Body() dto: ScanUrlDto) {
    return this.scanService.scanUrl(dto.url);
  }

  @Get("history")
  getHistory(
    @Req() req: { user: { userId: string } },
    @Query() query: HistoryQueryDto
  ) {
    return this.scanService.getHistory(req.user.userId, query.q);
  }

  @Get(":id")
  getById(@Req() req: { user: { userId: string } }, @Param("id") id: string) {
    return this.scanService.getById(req.user.userId, id);
  }
}
