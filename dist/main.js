"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const common_1 = require("@nestjs/common");
const express_openid_connect_1 = require("express-openid-connect");
const auth0_1 = require("./config/auth0");
const cors_1 = __importDefault(require("cors"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
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
        .setTitle('WebAdminISP')
        .setDescription(`<hr <font color=#2E86C1>
      <h4><font color=#2E86C1>Bienvenido a la documentación oficial del Proyecto Final, de la carrera FullStack Developer de SoyHenry<b>: <a target='blank' href="https://github.com/WebAdminISP">PF4-WebAdminISP</a></b>.</h4>
      <p><font color=#2E86C1>Esta API está construida con <b>NestJS</b> y utiliza <b>Swagger</b> para fines de documentación.</p>
      <p><font color=#2E86C1>La API se desarrolla como parte del Módulo <b>Proyecto Final</b> de la especialidad: <b>Backend</b> en la carrera Fullstack Developer de <a target='blank' href="https://www.soyhenry.com/"><b>Soy Henry</b></a>.</p>
      <p><font color=#2E86C1>Aquí encontrará toda la información necesaria para interactuar con nuestros endpoints.</p>
      <hr <font color=#2E86C1>
      <p align="right"><font color=#2E86C1><i><b>Version 1.0.0</b></i></p>
      <p align="left"><font color=#2E86C1>Para cualquier consulta o soporte, por favor contacte a nuestro equipo de desarrollo.</p>
      <p align="left"><font color=#2E86C1><a target='blank' href="mailto:ekinast@gmail.com"><b>Edmundo Kinast</b></a></p>
      <p align="left"><font color=#2E86C1><a target='blank' href="mailto:rod.foxtrot.13@gmail.com"><b>Rodrigo Nahuel Fernandez</b></a></p>
      <p align="left"><font color=#2E86C1><a target='blank' href="mailto:rafael.vh@gmail.com"><b>Rafael Velazquez Hernandez</b></a></p>
      `)
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map