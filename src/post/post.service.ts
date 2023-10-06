import { ImageService } from './../image/image.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { BadRequest } from 'src/Services/BadRequestResponse';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

@Injectable()
export class PostService {
  private readonly S3_bucket;
  private S3;
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {
    this.S3_bucket = configService.get<string>('AWS_S3_BUCKET');
    this.S3 = new AWS.S3({
      accessKeyId: configService.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: configService.get<string>('AWS_S3_SECRET_KEY'),
    });
  }
  async create(createPostDto: CreatePostDto) {
    try {
      let files = [];
      console.log(createPostDto.file, createPostDto.file.length)
      for (let i = 0; i < createPostDto.file.length; i++) {
        const bucket = this.S3_bucket;
        const body = createPostDto.file[i].buffer;
        const contentType = createPostDto.file[i].mimetype;
        const split = createPostDto.file[i].originalname.split('.');
        const extention = split.pop();
        const s3Key = format(new Date(), 'yyy-MM-dd-hh-mm-ss');
        const fileName = `file${s3Key}.${extention}`;
        const params = {
          Bucket: bucket!,
          Key: fileName,
          Body: body,
          ACL: 'public-read',
          ContentType: contentType,
          ContentDisposition: 'inline',
        };
        const s3Response = await this.S3.upload(params).promise();
        files.push(s3Response);
      }
      console.log(files)
      //const user = await this.userService.findOne(createPostDto.userId);
      //const post = await this.postRepository.save({
        //user: user,
        //text: createPostDto.text,
      //});
      //const image = await this.imageService.create(createPostDto.image, post);
      //console.log(image);
      //return {
        //post: post,
        //image: image,
      //};
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    try {
      return this.postRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const existingPost = await this.postRepository.findOne({
        where: {
          id: id,
        },
      });
      if (existingPost) {
        return existingPost;
      }
      return BadRequest('post with this id not found');
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const existingPost = await this.postRepository.findOne({
        where: {
          id: id,
        },
      });
      if (existingPost) {
      }
      return BadRequest('post with this id not found');
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const existingPost = await this.postRepository.findOne({
        where: {
          id: id,
        },
      });
      if (existingPost) {
        return this.postRepository.delete({ id });
      }
      return BadRequest('post with this id not found');
    } catch (err) {
      throw err;
    }
  }
}
