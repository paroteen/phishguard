import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [total, dangerous, safe, users] = await Promise.all([
      this.prisma.scan.count(),
      this.prisma.scan.count({ where: { classification: "Dangerous" } }),
      this.prisma.scan.count({ where: { classification: "Safe" } }),
      this.prisma.user.count()
    ]);
    return { totalScans: total, dangerousScans: dangerous, safeScans: safe, users };
  }

  users() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, isBanned: true }
    });
  }
}
