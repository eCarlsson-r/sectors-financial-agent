import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should serve dashboard html', () => {
      const res = {
        send: vi.fn(),
      } as any;
      appController.getDashboard(res);
      expect(res.send).toHaveBeenCalled();
      expect(res.send.mock.calls[0][0]).toContain('Sectors AI Financial Agent');
    });
  });
});
