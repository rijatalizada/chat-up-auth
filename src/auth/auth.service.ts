import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto';
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
        surname: createUserDto.surname,
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: hash,
      });

      delete user.passwordHash;

      const token = await this.signToken({
        email: user.email,
        name: user.name,
        surname: user.surname,
      });

      return token;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }

  public async signToken(userPayload: UserPayload) {
    const jwtToken = await this.jwt.signAsync(userPayload, {
      expiresIn: '10d',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return jwtToken;
  }
}
