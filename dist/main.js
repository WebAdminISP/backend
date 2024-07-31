"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const common_1 = require("@nestjs/common");
const express_openid_connect_1 = require("express-openid-connect");
const auth0_1 = require("./config/auth0");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use((0, express_openid_connect_1.auth)(auth0_1.config));
    app.useGlobalPipes(new common_1.ValidationPipe({
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
                        result.push(...flattenValidationErrors(error.children, propertyPath));
                    }
                });
                return result;
            };
            const flattenedErrors = flattenValidationErrors(errors);
            const formattedErrors = flattenedErrors
                .map((e) => {
                const propertyPath = e.property.replace(/\.\d+/g, (match) => `[${match.slice(1)}]`);
                return `${propertyPath}: ${e.constraints.join(', ')}`;
            })
                .join('; ');
            return new common_1.BadRequestException({
                alert: 'Se ha detectado un error en la petición, por favor revise los datos enviados.',
                statusCode: 400,
                error: 'Bad Request',
                message: formattedErrors,
            });
        },
    }));
    app.use(logger_middleware_1.LoggerGlobal);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Demo NestJS API')
        .setDescription('Esta es una API creada con NestJS para el Proyecto Final FullStack de HENRY')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addOAuth2({
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
    }, 'Auth0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            oauth2RedirectUrl: 'http://localhost:3000/api/oauth2-redirect.html',
            oauth: {
                clientId: process.env.AUTH0_CLIENT_ID,
                appName: 'WebAdminISP',
                scopeSeparator: ' ',
                additionalQueryStringParams: {},
            },
        },
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map