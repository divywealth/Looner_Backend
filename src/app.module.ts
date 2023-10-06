import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { VerificationModule } from './verification/verification.module';
import { ImageModule } from './image/image.module';
import { User } from './user/entities/user.entity';
import { Verification } from './verification/entities/verification.entity';
import { Image } from './image/entities/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [Post, User, Verification, Image],
      synchronize: JSON.parse(process.env.SYNCHRONIZE),
    }),
    UserModule,
    AuthenticationModule,
    PostModule,
    VerificationModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
