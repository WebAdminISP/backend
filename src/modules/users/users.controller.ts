import { RolesGuard } from './../auths/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  // Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  // ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../auths/auth.guards';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {
    console.log('UsersController instantiated');
  }
  @Get()
  @ApiOperation({ summary: 'Ver todos los usuarios' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Get(':id')
  @ApiOperation({ summary: 'Ver un usuario por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.UsersService.deleteUser(id);
  }

  //? Ejemplo de uso Auth0.
  @ApiExcludeEndpoint()
  @Get('auth0/callback')
  // async getAuth0Protected(@Req() req: Request, @Res() res: Response) {
  async getAuth0Protected(@Req() req: Request) {
    const auth0Data = req.oidc.user;
    console.log('Respuesta de auth0:', auth0Data);

    // return this.usersService.auth0Signin(auth0Data);
    const tokenResponse = await this.UsersService.auth0Signin(auth0Data);

    // res.redirect(`http://localhost:3000/products`);
    // return {
    //   token: tokenResponse.token,
    //   usuario: tokenResponse.user,
    // };
    return tokenResponse;
  }
}
