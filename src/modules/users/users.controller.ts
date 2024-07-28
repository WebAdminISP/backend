import { RolesGuard } from './../auths/roles.guard';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
//import { UsersService } from './users.service';
import { AuthGuard } from '../auths/auth.guards';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {
    console.log('UsersController instantiated');
  }
  @Get()
  @ApiOperation({ summary: 'Ver todos los usuarios' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 5,
  })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const allUsers: User[] = await this.UsersService.getUsers(page, limit);
    return allUsers;
  }

  //*AUTH0 ENDPOINTS
  //* endpoint generico para verificar auth de usuario y su info
  @Get('auth0/protected')
  @ApiOperation({ summary: 'Comprobacion de logueo con Auth0' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  getAuth0Protected(@Req() req: Request) {
    try {
      if (req.oidc) {
        console.log('Autenticado con Auth0');
        return JSON.stringify(req.oidc.user);
      } else if (req.user) {
        // Assuming internal auth sets req.user
        console.log('Autenticado con JWT interno');
        return JSON.stringify(req.user);
      } else {
        throw new UnauthorizedException(
          'No se encontró información de autenticación',
        );
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }


  @Get('profile')
  @ApiOperation({ summary: 'Retorna el perfil de usuario (User) - not admin' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.User)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserProfile(@Req() req: Request) {
    const userId = req.user.id; // Assuming req.user.id contains the authenticated user's ID
    console.log(userId);
  const user = await this.UsersService.getUserById(userId);
  return user;
  }


  //* verifica estado de autenticacion de usuario sin mostrar token
  @Get('auth0/user-info')
  @ApiOperation({ summary: 'Retorna informacion de usuario Auth0' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  getUserInfo(@Req() req: Request) {
    const isAuthenticated = req.oidc.isAuthenticated();
    return {
      isAuthenticated,
      status: isAuthenticated ? 'Logged in' : 'Logged out',
      user: isAuthenticated
        ? {
            name: req.oidc.user.name,
            email: req.oidc.user.email,
          }
        : null,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un usuario por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.UsersService.getUserById(id);
    if (!user) {
      return {
        error: 'No se encontró el usuario.',
      };
    }
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.UsersService.updateUser(id, createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @HttpCode(200)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.UsersService.deleteUser(id);
  }
}
