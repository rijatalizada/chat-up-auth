import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto, SignInUserDto } from './dto';
import { User } from './user.entity';
import * as bcyrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

interface UserPayload {
  name: string;
  surname: string;
  email: string;
}

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  constructor(private jwt: JwtService, private config: ConfigService) {}

  public async signUp(createUserDto: CreateUserDto) {
    try {
      const salt = await bcyrpt.genSalt(10);
      const hash = await bcyrpt.hash(createUserDto.password, salt);

      const user = await this.repository.save({
        name: createUserDto.name,
        surname: createUserDto.surname,
        email: createUserDto.email,
        passwordHash: hash,
      });

      delete user.passwordHash;

      const token = await this.signToken({
        email: user.email,
        name: user.name,
        surname: user.surname,
      });

      return {
        access_token: token,
      };
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }

  public async signIn(signInUserDto: SignInUserDto) {
    const user = await this.repository.findOne({
      where: {
        email: signInUserDto.email,
      },
    });

    const isMatch = await bcyrpt.compare(
      signInUserDto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await this.signToken({
      name: user.name,
      surname: user.surname,
      email: user.email,
    });

    return {
      access_token: token,
    };
  }

  public async signToken(userPayload: UserPayload) {
    const jwtToken = await this.jwt.signAsync(userPayload, {
      expiresIn: '10d',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return jwtToken;
  }
}
