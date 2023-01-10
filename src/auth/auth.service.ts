import { SigninDTO } from './dto/signin.dto';
import { UserService } from './../user/user.service';
import { Body, Injectable, Post, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userSignin: SigninDTO): Promise<any> {
    const user = await this.userService.findOne(userSignin.email);
    if (user && user.password === userSignin.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(payload: any) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      expiresIn: '120m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY_REFRESH_TOKEN,
      expiresIn: '12d',
    });

    await this.cacheManager.set('access_token', access_token, 60 * 60);

    await this.cacheManager.set('refresh_token', refresh_token, 60 * 60 * 12);

    return { access_token, refresh_token };
  }
}
