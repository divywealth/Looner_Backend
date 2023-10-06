import { Verification } from 'src/verification/entities/verification.entity';
import { randomNumber } from './../Services/randomNumber';
import { VerificationService } from './../verification/verification.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import { BadRequest } from 'src/Services/BadRequestResponse';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

import {
  ResetPasswordDto,
  VerifyPasswordCodeDto,
} from './dto/reset-password.dto';

@Injectable()
export class AuthenticationService {
  private readonly S3_bucket;
  private s3;
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly verificationService: VerificationService,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
  ) {
    this.S3_bucket = configService.get<string>('AWS_S3_BUCKET');
    this.s3 = new AWS.S3({
      accessKeyId: configService.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: configService.get<string>('AWS_S3_SECRET_KEY'),
    });
  }

  async create(createAuthenticationDto: CreateAuthenticationDto) {
    try {
      const existingUser = await this.UserRepository.findOne({
        where: {
          username: createAuthenticationDto.username,
          phoneNo: createAuthenticationDto.phoneNo,
        },
      });
      if (existingUser) {
        return BadRequest(
          'username or phoneNo already have an account try choosing a unique username or phoneNo',
        );
      }
      const bucket = this.S3_bucket;
      const body = createAuthenticationDto.file.buffer;
      const contentType = createAuthenticationDto.file.mimetype;
      const split = createAuthenticationDto.file.originalname.split('.');
      const extention = split.pop();
      const s3Key = format(new Date(), 'yyy-MM-dd-hh-mm-ss');
      const fileName = `file${s3Key}.${extention}`;
      const params = {
        Bucket: bucket,
        Key: fileName,
        Body: body,
        ACL: 'public-read',
        ContentType: contentType,
        ContentDisposition: 'inline',
      };
      console.log(params);
      const s3Response = await this.s3.upload(params).promise();
      console.log(s3Response);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createAuthenticationDto.password,
        saltRounds,
      );
      const information2Save = {
        firstname: createAuthenticationDto.firstname,
        lastname: createAuthenticationDto.lastname,
        email: createAuthenticationDto.email,
        phoneNo: createAuthenticationDto.phoneNo,
        username: createAuthenticationDto.username,
        profilepic: s3Response.Location,
        dob: createAuthenticationDto.dob,
        password: hashedPassword,
      };
      const createdUser = await this.UserRepository.save(information2Save);
      return {
        user: createdUser,
        access_token: await this.jwtService.signAsync({ user: createdUser }),
      };
    } catch (err) {
      throw err;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      if (!loginUserDto.phoneNo || !loginUserDto.password) {
        throw BadRequest('phoneNo and password required');
      }
      const existingUser = await this.UserRepository.findOne({
        where: {
          phoneNo: loginUserDto.phoneNo,
        },
      });
      if (!existingUser) {
        throw BadRequest(
          'sorry user with this phoneNo not found try creating an account instead',
        );
      } else if (
        !(await bcrypt.compare(loginUserDto.password, existingUser.password))
      ) {
        throw BadRequest('Incorrect Password');
      } else {
        return {
          user: existingUser,
          access_token: await this.jwtService.signAsync({ user: existingUser }),
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async sendResetPasswordCode(email: string) {}

  async verifyResetPasswordCode(verificationCode: VerifyPasswordCodeDto) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto) {}

  async update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    try {
      console.log(updateAuthenticationDto.file);
      const existinUser = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });
      if (existinUser) {
        if (updateAuthenticationDto.file) {
          const bucket = this.S3_bucket;
          const body = updateAuthenticationDto.file.buffer;
          const contentType = updateAuthenticationDto.file.mimetype;
          const split = updateAuthenticationDto.file.originalname.split('.');
          const extention = split.pop();
          const s3Key = format(new Date(), 'yyy-MM-dd-hh-mm-ss');
          const fileName = `file${s3Key}.${extention}`;
          const params = {
            Bucket: bucket,
            Key: fileName,
            Body: body,
            ACL: 'public-read',
            ContentType: contentType,
            ContentDisposition: 'inline',
          };
          const s3Response = await this.s3.upload(params).promise();
          console.log(s3Response)
          const savefile = {
            profilepic: s3Response.Location
          }
          return this.UserRepository.update({ id }, { ...savefile });
        }
        return this.UserRepository.update({ id }, { ...updateAuthenticationDto });
      }
      return BadRequest('User with this id not found');
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const existinUser = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });
      if (existinUser) {
        return this.UserRepository.delete({ id });
      }
      return BadRequest('User with this id not found');
    } catch (err) {
      throw err;
    }
  }
}
