import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, AuthGuard } from './auth';
import { Order, OrderItem, Product, User } from './entities';
import { OrdersController } from './orders';
import { ProductsController, ProductsService } from './products';

const entities = [Product, User, Order, OrderItem];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'shop',
      password: process.env.DB_PASS || 'shop',
      database: process.env.DB_NAME || 'shop',
      entities,
      synchronize: true, // dev uniquement
    }),
    TypeOrmModule.forFeature(entities),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret', signOptions: { expiresIn: '7d' } }),
  ],
  controllers: [ProductsController, AuthController, OrdersController],
  providers: [ProductsService, AuthGuard],
})
export class AppModule {}
