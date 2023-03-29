import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() userCreateDto: CreateUserDto) {
    return this.authService.signUp(userCreateDto);
  }

  @Post('/signin')
  signin(@Body() userSignDto: SignInUserDto) {
    return this.authService.signIn(userSignDto);
  }
}
