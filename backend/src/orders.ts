import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { AuthGuard } from './auth';
import { Order, OrderItem, Product } from './entities';

class ItemDto {
  @IsUUID() productId: string;
  @IsInt() @Min(1) quantity: number;
}
class CreateOrderDto {
  @ValidateNested({ each: true }) @Type(() => ItemDto) @ArrayMinSize(1) items: ItemDto[];
}

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(@InjectDataSource() private ds: DataSource, @InjectRepository(Order) private orders: Repository<Order>) {}

  @Post() create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ds.transaction(async (m) => {
      let total = 0;
      const items: OrderItem[] = [];
      for (const line of dto.items) {
        const p = await m.findOne(Product, { where: { id: line.productId }, lock: { mode: 'pessimistic_write' } });
        if (!p) throw new BadRequestException('Produit introuvable');
        if (p.stock < line.quantity) throw new BadRequestException(`Stock insuffisant pour « ${p.name} »`);
        p.stock -= line.quantity;
        await m.save(p);
        total += p.price * line.quantity;
        items.push(m.create(OrderItem, { productId: p.id, name: p.name, price: p.price, quantity: line.quantity }));
      }
      const order = m.create(Order, { user: { id: req.user.sub } as any, total: Math.round(total * 100) / 100, items });
      const saved = await m.save(order);
      return { id: saved.id, total: saved.total, createdAt: saved.createdAt };
    });
  }

  @Get() mine(@Req() req: any) {
    return this.orders.find({ where: { user: { id: req.user.sub } }, relations: { items: true }, order: { createdAt: 'DESC' } });
  }
}
