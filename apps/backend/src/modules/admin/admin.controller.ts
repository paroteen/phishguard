import { Controller, Get, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private assertAdmin(role: string) {
    if (role !== "admin") {
      throw new ForbiddenException("Admin only");
    }
  }

  @Get("stats")
  stats(@Req() req: { user: { role: string } }) {
    this.assertAdmin(req.user.role);
    return this.adminService.stats();
  }

  @Get("users")
  users(@Req() req: { user: { role: string } }) {
    this.assertAdmin(req.user.role);
    return this.adminService.users();
  }
}
