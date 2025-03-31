import { FileService } from "../file/file.service";

export const fileServiceMock = {
  provide: FileService,
  useValue: {
    destinationPath: jest.fn(),
    upload: jest.fn().mockResolvedValue(""),
  },
};
