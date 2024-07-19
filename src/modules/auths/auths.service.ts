import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './roles.enum';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const newUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!newUser) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, newUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const userPayload = {
      sub: newUser.id,
      id: newUser.id,
      email: newUser.email,
      roles: [newUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);
    return { succes: 'User logged in successfully', token };
    //return { succes: 'User logged in successfully' };
  }

  async saveUser(createUserDto: Omit<CreateUserDto, 'isAdmin'>) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password hashing failed');
    }

    createUserDto.password = hashedPassword;

    const user = this.usersRepository.create(createUserDto);

    if (!createUserDto.createdAt) {
      user.createdAt = new Date();
    } else {
      user.createdAt = new Date(createUserDto.createdAt);
    }

    return await this.usersRepository.save(user);
  }
}
