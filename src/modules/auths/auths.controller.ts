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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from './auth.guards';
import { Request } from 'express';
import { RolesGuard } from './roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './roles.enum';
import { MailService } from '../mail/mail.service';

@ApiTags('Auth')
@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly usersDBService: UsersService,
    private readonly mailService: MailService,
  ) {
    {
      console.log('AuthController instantiated');
    }
  }

  @Post('signin')
  @ApiOperation({ summary: 'Ingresar al sistema con email y contraseña' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(@Body() signInDto: SignInDto) {
    return this.authsService.signIn(signInDto);
  }

  @Post('signup')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Dar de alta un usuario nuevo' })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(
    //* extiende la req de express que se espera tenga propiedades extra
    @Req() req: Request & { oidc?: any; user?: any },
    @Body() createUserDto: CreateUserDto,
  ) {
    let agente: string;

    //* propiedad user existe tanto en auth interna como externa
    //* solo difiere el acceso al nombre (name > Auth0, agente > Interna)
    if (req.user) {
      agente = req.user.name || req.user.agente;
    } else {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    //? creo que esta verificacion no corre nunca
    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    //* agrega al agente al dto y lo pasa al servicio
    createUserDto.agente = agente;
    const email = createUserDto.email;
    const username = createUserDto.nombre;
    const savedUser = await this.authsService.saveUser(createUserDto);
    await this.mailService.sendRegistrationConfirmation(email, username);
    return savedUser;
  }
}
