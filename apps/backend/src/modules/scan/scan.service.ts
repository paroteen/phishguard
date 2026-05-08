import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../prisma/prisma.service";

const URL_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

@Injectable()
export class ScanService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue("scan-queue") private readonly queue: Queue
  ) {}

  extractUrls(text: string) {
    return [...new Set(text.match(URL_REGEX) ?? [])];
  }

  async analyzeText(text: string) {
    const urls = this.extractUrls(text);
    const indicators: Array<{ type: string; description: string }> = [];
    let score = 0;

    const patterns = [
      { regex: /urgent|immediately|action required/i, inc: 20, type: "urgency" },
      { regex: /verify your account|login now|password/i, inc: 20, type: "credential_request" },
      { regex: /gift card|crypto|bitcoin|wallet/i, inc: 15, type: "scam_keywords" },
      { regex: /otp|one time password/i, inc: 15, type: "otp_theft" }
    ];

    for (const p of patterns) {
      if (p.regex.test(text)) {
        score += p.inc;
        indicators.push({ type: p.type, description: `Detected ${p.type.replace("_", " ")}` });
      }
    }

    for (const url of urls) {
      const isShort = /bit\.ly|tinyurl|t\.co|goo\.gl/i.test(url);
      const ipBased = /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i.test(url);
      const suspiciousTld = /\.(zip|top|xyz|click|work)(\/|$)/i.test(url);
      if (isShort) {
        score += 10;
        indicators.push({ type: "shortened_url", description: "Uses suspicious shortened URL" });
      }
      if (ipBased) {
        score += 15;
        indicators.push({ type: "ip_url", description: "Uses IP based URL" });
      }
      if (suspiciousTld) {
        score += 15;
        indicators.push({ type: "suspicious_tld", description: "Uses suspicious TLD" });
      }
      await this.prisma.urlCheck.create({
        data: {
          url,
          reputation: suspiciousTld || ipBased ? "bad" : "unknown",
          source: "heuristic",
          malicious: suspiciousTld || ipBased
        }
      });
    }

    score = Math.min(100, score);
    const classification = score >= 70 ? "Dangerous" : score >= 40 ? "Suspicious" : "Safe";
    const aiAnalysis =
      classification === "Dangerous"
        ? "High-risk phishing pattern detected. Message contains social engineering indicators."
        : classification === "Suspicious"
          ? "Some phishing indicators are present. Verify sender identity and URLs."
          : "No major phishing indicators found from heuristic and URL checks.";

    return { extractedUrls: urls, score, classification, indicators, aiAnalysis };
  }

  async scanMessage(userId: string, text: string) {
    const result = await this.analyzeText(text);
    const scan = await this.prisma.scan.create({
      data: {
        userId,
        originalText: text,
        extractedUrls: result.extractedUrls,
        score: result.score,
        classification: result.classification as "Safe" | "Suspicious" | "Dangerous",
        aiAnalysis: result.aiAnalysis,
        indicators: {
          create: result.indicators
        }
      },
      include: { indicators: true }
    });
    await this.queue.add("danger-alert", { userId, scanId: scan.id, classification: scan.classification });
    return scan;
  }

  async scanUrl(url: string) {
    const text = `URL scan request: ${url}`;
    return this.analyzeText(text);
  }

  getHistory(userId: string, query?: string) {
    return this.prisma.scan.findMany({
      where: {
        userId,
        originalText: query ? { contains: query, mode: "insensitive" } : undefined
      },
      include: { indicators: true },
      orderBy: { createdAt: "desc" }
    });
  }

  getById(userId: string, id: string) {
    return this.prisma.scan.findFirst({
      where: { id, userId },
      include: { indicators: true }
    });
  }
}
