import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { getFile } from "../test/file-get-file.mock";

let fileService: FileService;

describe("FileService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();
    fileService = module.get<FileService>(FileService);
  });
  test("Validates database instantiation", () => {
    expect(fileService).toBeDefined();
  });
  describe("Testing FileService", () => {
    test("upload method", async () => {
      const file = await getFile();
      const filename = "photo-test.jpg";
      fileService.upload(file, filename);
    });
  });
});
