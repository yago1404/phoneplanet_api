import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UsersService } from './users.service';
import { User } from '../infra/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../infra/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [UsersController],
  providers: [AuthMiddleware, UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('/users/check-auth');
  }
}
