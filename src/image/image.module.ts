import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, Post, User])
  ], 
  controllers: [ImageController],
  providers: [ImageService, PostService, UserService]
})
export class ImageModule {}
