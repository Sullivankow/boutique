"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
const auth_1 = require("./auth");
const entities_1 = require("./entities");
class ItemDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ItemDto.prototype, "quantity", void 0);
class CreateOrderDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemDto),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
let OrdersController = class OrdersController {
    constructor(ds, orders) {
        this.ds = ds;
        this.orders = orders;
    }
    create(req, dto) {
        return this.ds.transaction(async (m) => {
            let total = 0;
            const items = [];
            for (const line of dto.items) {
                const p = await m.findOne(entities_1.Product, { where: { id: line.productId }, lock: { mode: 'pessimistic_write' } });
                if (!p)
                    throw new common_1.BadRequestException('Produit introuvable');
                if (p.stock < line.quantity)
                    throw new common_1.BadRequestException(`Stock insuffisant pour « ${p.name} »`);
                p.stock -= line.quantity;
                await m.save(p);
                total += p.price * line.quantity;
                items.push(m.create(entities_1.OrderItem, { productId: p.id, name: p.name, price: p.price, quantity: line.quantity }));
            }
            const order = m.create(entities_1.Order, { user: { id: req.user.sub }, total: Math.round(total * 100) / 100, items });
            const saved = await m.save(order);
            return { id: saved.id, total: saved.total, createdAt: saved.createdAt };
        });
    }
    mine(req) {
        return this.orders.find({ where: { user: { id: req.user.sub } }, relations: { items: true }, order: { createdAt: 'DESC' } });
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "mine", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(auth_1.AuthGuard),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.DataSource, typeorm_2.Repository])
], OrdersController);
//# sourceMappingURL=orders.js.map