import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ScanController } from "./scan.controller";
import { ScanService } from "./scan.service";
import { ScanProcessor } from "./scan.processor";

@Module({
  imports: [BullModule.registerQueue({ name: "scan-queue" })],
  controllers: [ScanController],
  providers: [ScanService, ScanProcessor],
  exports: [ScanService]
})
export class ScanModule {}
