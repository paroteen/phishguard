import { ScanService } from "./scan.service";

describe("ScanService", () => {
  it("extracts urls", () => {
    const service = new ScanService({} as never, {} as never);
    const urls = service.extractUrls("Visit https://example.com and http://test.io now");
    expect(urls).toHaveLength(2);
  });
});
