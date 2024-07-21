import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from './auth.guards';
import { Request } from 'express';

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Dar de alta un usuario nuevo' })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const agente = req.user.agente;
    createUserDto.agente = agente;

    return this.authsService.saveUser(createUserDto);
  }
}
