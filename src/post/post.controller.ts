import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Express, request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload-dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';

@Controller({
  version: '1'
})
export class PostController {
  constructor(
    private readonly postService: PostService,
    private jwtService: JwtService,
    ) {}
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'some description',
    type: FileUploadDto,
  })
  
  @Post('create-post')
  @UsePipes(ValidationPipe)
  async create(
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() body
  ) {
    try {
      const createPostDto: CreatePostDto = {
        userId: body.userId,
        text: body.text,
        file: file,
        image: body.image
      }
      //const token = request.headers.authorization.replace('Bearer ', '');
      //const decodedToken = await this.jwtService.verifyAsync(token, {
        //secret: process.env.JWT_SECRET,
      //});
      //const userId = decodedToken.user.id;
      console.log(file)
      return this.postService.create(createPostDto);
    } catch (err) {
      throw err.message
    }
    
  }

  @Get('posts')
  findAll() {
    try{
      return this.postService.findAll();
    } catch (err) {
      throw err.message
    }
    
  }

  @Get('post/:id')
  findOne(@Param('id') id: string) {
    try {
      return this.postService.findOne(+id)
    } catch (err) {
      throw err.message
    }
  }

  @Patch('post/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return this.postService.update(+id, updatePostDto)
    } catch (err) {
      throw err.message
    }
  }

  @Delete('post/:id')
  remove(@Param('id') id: string) {
    try {
      return this.postService.remove(+id)
    } catch (err) {
      throw err.message
    }
  }
}
