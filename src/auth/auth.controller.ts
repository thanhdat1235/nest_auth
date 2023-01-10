import { SigninDTO } from './dto/signin.dto';
import { UserService } from './../user/user.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Body() userSignin: SigninDTO) {
    const user = await this.userService.findUnique(userSignin);

    const payload = {
      email: user.email,
      sub: user.id,
    };

    const { access_token, refresh_token } = await this.authService.signin(
      payload,
    );

    user.password = undefined;

    return {
      user,
      access_token,
      refresh_token,
    };
  }
}
