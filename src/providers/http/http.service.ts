import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import config from 'src/config/config';
import { ErrorManager } from 'src/utils';

@Injectable()
export class HttpCustomService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<
      typeof config
    >,
  ) {}

  public async apiFindAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          this.configService.apiRickAndMorty,
        ),
      );
      return response.data;
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error.message,
      );
    }
  }
}
