import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly usersDBService: UsersService,
  ) {
    {
      console.log('AuthController instantiated');
    }
  }

  @Post('signin')
  @ApiOperation({ summary: 'Ingresar al sistema con email y contraseña' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  signIn(@Body() signInDto: SignInDto) {
    return this.authsService.signIn(signInDto);
    //return this.authsService.signIn(signInDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Dar de alta un usuario nuevo' })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authsService.saveUser(createUserDto);
  }
}
