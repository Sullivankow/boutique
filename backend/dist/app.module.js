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
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_1 = require("./auth");
const entities_1 = require("./entities");
const orders_1 = require("./orders");
const products_1 = require("./products");
const entities = [entities_1.Product, entities_1.User, entities_1.Order, entities_1.OrderItem];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: +(process.env.DB_PORT || 5432),
                username: process.env.DB_USER || 'shop',
                password: process.env.DB_PASS || 'shop',
                database: process.env.DB_NAME || 'shop',
                entities,
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature(entities),
            jwt_1.JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret', signOptions: { expiresIn: '7d' } }),
        ],
        controllers: [products_1.ProductsController, auth_1.AuthController, orders_1.OrdersController],
        providers: [products_1.ProductsService, auth_1.AuthGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map