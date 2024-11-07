import { Test, TestingModule } from '@nestjs/testing';
import { HttpCustomService } from './http.service';

describe('HttpService', () => {
  let service: HttpCustomService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [HttpCustomService],
      }).compile();

    service = module.get<HttpCustomService>(
      HttpCustomService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
