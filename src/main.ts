import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
const { auth } = require('express-openid-connect');
import { config as auth0Config } from './config/auth0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   //* implementa auth0 middleware > login > logout endpoints
   app.use(auth(auth0Config));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const flattenValidationErrors = (validationErrors, parentPath = '') => {
          const result = [];
          validationErrors.forEach((error) => {
            const propertyPath = parentPath
              ? `${parentPath}.${error.property}`
              : error.property;
            if (error.constraints) {
              result.push({
                property: propertyPath,
                constraints: Object.values(error.constraints),
              });
            }
            if (error.children && error.children.length) {
              result.push(
                ...flattenValidationErrors(error.children, propertyPath),
              );
            }
          });
          return result;
        };

        const flattenedErrors = flattenValidationErrors(errors);

        const formattedErrors = flattenedErrors
          .map((e) => {
            const propertyPath = e.property.replace(
              /\.\d+/g,
              (match) => `[${match.slice(1)}]`,
            );
            return `${propertyPath}: ${e.constraints.join(', ')}`;
          })
          .join('; ');

        return new BadRequestException({
          alert:
            'Se ha detectado un error en la petición, por favor revise los datos enviados.',
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
        });
      },
    }),
  );

  app.use(LoggerGlobal);
  //app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo NestJS API')
    .setDescription(
      'Esta es una API creada con NestJS para el Proyecto Final FullStack de HENRY',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth') // ojo:este nombre tiene que estar para referenciar en decorador @ApiBearerAuth() en controller methods
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: process.env.AUTH0_ISSUER_BASE_URL,
            scopes: {
              openid: 'OpenID',
              profile: 'Profile',
              email: 'Email',
            },
          },
        },
      },
      'Auth0' // ojo:este nombre tiene que estar para referenciar en decorador @ApiSecurity() en controller methods
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  //! este redireccionamiento aun no funciona
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/api/oauth2-redirect.html',
      oauth: {
        clientId: process.env.AUTH0_CLIENT_ID,
        appName: 'WebAdminISP',
        scopeSeparator: ' ',
        additionalQueryStringParams: {}
      }
    }
  });

  await app.listen(3000);
}
bootstrap();
