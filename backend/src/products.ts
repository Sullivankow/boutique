import { Controller, Get, NotFoundException, OnModuleInit, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities';

const img = (s: string) => `https://picsum.photos/seed/${s}/640/640`;
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
] as const;

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectRepository(Product) readonly repo: Repository<Product>) {}

  async onModuleInit() {
    if ((await this.repo.count()) > 0) return;
    await this.repo.save(SEED.map(([name, description, price, category, s, stock]) =>
      this.repo.create({ name, description, price, category, stock, image: img(s) })));
  }

  list(search?: string, category?: string) {
    const where: any = {};
    if (search) where.name = ILike(`%${search}%`);
    if (category) where.category = category;
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async one(id: string) {
    const p = await this.repo.findOneBy({ id });
    if (!p) throw new NotFoundException('Produit introuvable');
    return p;
  }
}

@Controller('products')
export class ProductsController {
  constructor(private s: ProductsService) {}
  @Get() list(@Query('search') search?: string, @Query('category') category?: string) {
    return this.s.list(search, category);
  }
  @Get(':id') one(@Param('id', ParseUUIDPipe) id: string) { return this.s.one(id); }
}
