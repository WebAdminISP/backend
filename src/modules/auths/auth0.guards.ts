import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { Role } from './roles.enum';

@Injectable()
export class Auth0Guard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Auth0Guard: Iniciando');
    const request = context.switchToHttp().getRequest<Request & { user?: any }>();

    if (!request.oidc || !request.oidc.isAuthenticated()) {
      console.log('Usuario no autenticado');
      throw new UnauthorizedException('Autenticacion Auth0 - Fallida');
    }

    console.log('Usuario autenticado');
    console.log('ID Token:', request.oidc.idToken);
    console.log('Access Token:', request.oidc.accessToken);
    console.log('Usuario Auth0:', JSON.stringify(request.oidc.user, null, 2));

    try {
      const user = request.oidc.user;
      const dbUser = await this.usersService.getUserByEmail(user.email);
      console.log('Auth0 user:', user);
      console.log('DB user:', dbUser);

      if (!dbUser) {
        throw new UnauthorizedException('Usuario no encontrado en la base de datos');
      }

      request.user = {
        ...user,
        roles: [dbUser.isAdmin ? Role.Admin : Role.User],
      };
      console.log('############## REQUEST-USER ##########',request.user)

      return true;
    } catch (error) {
      throw new UnauthorizedException('Error al obtener roles de la base de datos');
    }
  }
}
