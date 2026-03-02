import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // We'll create this soon
import { UsersModule } from './users/users.module'; // We'll create this soon
import { UniversityModule } from './university/university.module';
import { EventModule } from './event/event.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'NGLtree11@',
  database: 'riri',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,

  // Add these two lines:
  dropSchema: false,           // don't drop existing schema
  migrationsRun: true,  
  logging: true,      // not using migrations yet
  // Important: this prevents failure on "table already exists"
}),
    AuthModule,
    UsersModule,
    UniversityModule,
    EventModule,
    AdminModule,

  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}