import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";

@Injectable()
@Processor("scan-queue")
export class ScanProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanProcessor.name);

  async process(job: Job<{ userId: string; scanId: string; classification: string }>) {
    if (job.name !== "danger-alert") {
      return;
    }
    if (job.data.classification === "Dangerous") {
      this.logger.warn(`Dangerous scan detected for user ${job.data.userId}, scan ${job.data.scanId}`);
      // Hook point for email alerts and SOC integrations.
    }
  }
}
