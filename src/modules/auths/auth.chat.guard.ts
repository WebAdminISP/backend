import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class AuthChatGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the context is an HTTP request or a WebSocket connection
    const client = context.switchToWs().getClient<Socket & { user: any }>(); // Get the WebSocket client
    const token = client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      client.user = payload; // Attach user data to the client object
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
