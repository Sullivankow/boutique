import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

const money = { to: (v: number) => v, from: (v: string) => parseFloat(v) };

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('text') description: string;
  @Column('decimal', { precision: 10, scale: 2, transformer: money }) price: number;
  @Column() image: string;
  @Index() @Column() category: string;
  @Column('int') stock: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() name: string;
  @Column({ select: false }) passwordHash: string;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user: User;
  @Column('decimal', { precision: 10, scale: 2, transformer: money }) total: number;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true }) items: OrderItem[];
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' }) order: Order;
  @Column() productId: string;
  @Column() name: string;
  @Column('decimal', { precision: 10, scale: 2, transformer: money }) price: number;
  @Column('int') quantity: number;
}
