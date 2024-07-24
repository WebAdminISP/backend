import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from './auth.guards';
import { Auth0Guard } from './auth0.guards';

@Injectable()
export class CompositeAuthGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly auth0Guard: Auth0Guard,
    private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // verifica si el usuario ya esta autenticado
    if (request.user) {
        this.logger.log('User already authenticated');
        return true;
      }
    try {
      // chequea autenticacion interna
      const internalAuth = await this.authGuard.canActivate(context);
      if (internalAuth) {

        this.logger.log('Autenticacion Interna con JWT - EXITOSA');
        return true;
      }
    } catch (err) {
      // si autenticacion interna falla, loguea e intenta con Auth0
      this.logger.warn('Autenticacion Interna con JWT - FALLIDA ', err.message);
      
      try {
        // chequea autenticacion con Auth0 > try/catch anidado
        const externalAuth = await this.auth0Guard.canActivate(context);
        if (externalAuth) {
          this.logger.log('Autenticacion Auth0 - EXITOSA');
         // retorna true > los roles ya fueron agregados desde el mismo Auth0Guard   
          return true;
        }
      } catch (auth0Err) {
        this.logger.warn('Autenticacion Auth0 - FALLIDA', auth0Err.message);
      }
    }

    // mensaje de error si fallan ambos metodos de autenticacion
    this.logger.error('All authentication methods failed');
    throw new UnauthorizedException('Access denied: Invalid authentication');
  }
}