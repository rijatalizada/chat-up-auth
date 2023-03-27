import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { User } from '../../database/entities/user.entity';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectEntityManager() private userManager: EntityManager,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const salt = await bcyrpt.genSalt(10);
      const hash = await bcyrpt.hash(createUserDto.password, salt);
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }
}
