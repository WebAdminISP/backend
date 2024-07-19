"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const role_interceptor_1 = require("./interceptors/role.interceptor");
const core_1 = require("@nestjs/core");
const authErrorsInterceptor_1 = require("./interceptors/authErrorsInterceptor");
const global_http_filter_1 = require("./filter/global-http-filter");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("./config/typeorm");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("./modules/users/users.module");
const auths_module_1 = require("./modules/auths/auths.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => configService.get('typeorm'),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [typeorm_2.default],
            }),
            users_module_1.UsersModule,
            auths_module_1.AuthsModule,
            jwt_1.JwtModule.register({
                global: true,
                signOptions: { expiresIn: '1h' },
                secret: process.env.JWT_SECRET,
            }),
            auths_module_1.AuthsModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: authErrorsInterceptor_1.AuthErrorsInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: global_http_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: role_interceptor_1.RoleInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map