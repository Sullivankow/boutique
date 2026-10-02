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
exports.ProductsController = exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const img = (s) => `https://picsum.photos/seed/${s}/640/640`;
const SEED = [
    ['Lampe Brume', 'Lampe de table en verre dépoli, lumière douce.', 79, 'Maison', 'lampe', 14],
    ['Plaid Laine Nord', 'Plaid en laine mérinos tissé en Europe.', 129, 'Maison', 'plaid', 8],
    ['Vase Galet', 'Vase en grès émaillé, fait main.', 54, 'Maison', 'vase', 20],
    ['Bougie Cèdre', 'Cire végétale, 45 h de combustion.', 28, 'Maison', 'bougie', 40],
    ['Casque Studio', 'Casque fermé, 30 h d\'autonomie.', 189, 'Tech', 'casque', 12],
    ['Enceinte Ovale', 'Enceinte Bluetooth étanche IP67.', 99, 'Tech', 'enceinte', 25],
    ['Clavier Mécanique', 'Switchs linéaires, rétroéclairé.', 119, 'Tech', 'clavier', 17],
    ['Chargeur Dock 3-en-1', 'Charge téléphone, montre et écouteurs.', 69, 'Tech', 'dock', 30],
    ['Sac Bandoulière', 'Toile cirée, doublure recyclée.', 89, 'Mode', 'sac', 15],
    ['Pull Maille Épaisse', 'Coton bio, coupe ample.', 95, 'Mode', 'pull', 22],
    ['Baskets Cuir Blanc', 'Semelle cousue, cuir pleine fleur.', 140, 'Mode', 'baskets', 10],
    ['Montre Acier 38 mm', 'Mouvement quartz, verre saphir.', 175, 'Mode', 'montre', 6],
];
let ProductsService = class ProductsService {
    constructor(repo) {
        this.repo = repo;
    }
    async onModuleInit() {
        if ((await this.repo.count()) > 0)
            return;
        await this.repo.save(SEED.map(([name, description, price, category, s, stock]) => this.repo.create({ name, description, price, category, stock, image: img(s) })));
    }
    list(search, category) {
        const where = {};
        if (search)
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        if (category)
            where.category = category;
        return this.repo.find({ where, order: { name: 'ASC' } });
    }
    async one(id) {
        const p = await this.repo.findOneBy({ id });
        if (!p)
            throw new common_1.NotFoundException('Produit introuvable');
        return p;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
let ProductsController = class ProductsController {
    constructor(s) {
        this.s = s;
    }
    list(search, category) {
        return this.s.list(search, category);
    }
    one(id) { return this.s.one(id); }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "one", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [ProductsService])
], ProductsController);
//# sourceMappingURL=products.js.map