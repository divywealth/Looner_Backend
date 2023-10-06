import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProfilePicUploadDto } from './dto/profile-pic-upload.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto, VerifyPasswordCodeDto } from './dto/reset-password.dto';

@Controller({
  version: '1'
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'some description',
    type: ProfilePicUploadDto,
  })

  @UseInterceptors(FileInterceptor('file'))
  @Post('create-user')
  @UsePipes(ValidationPipe)
  create(@Body() body, @UploadedFile() file: Express.Multer.File) {
    try {
      const createAuthenticationDto: CreateAuthenticationDto = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phoneNo: body.phoneNo,
        username: body.username,
        file: file,
        profilepic: body.profilepic,
        dob: body.dob,
        password: body.password
      }
      return this.authenticationService.create(createAuthenticationDto);
    } catch (err) {
      throw err.message;
    }
  }

  @Post('login-user')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
     return this.authenticationService.loginUser(loginUserDto);
    } catch (err) {
      throw err.message;
    }
  }

  @Post('user/forgetpassword')
  sendResetPasswordCode(@Body() verifyPasswordCodeDto: VerifyPasswordCodeDto) {
    try {
      return this.authenticationService.sendResetPasswordCode(verifyPasswordCodeDto.email)
    } catch (err) {
      throw err.message
    }
  }

  @Post('user/verifycode')
  verifyResetPasswordCode(@Body() verifyPasswordCodeDto: VerifyPasswordCodeDto) {
    try {

    } catch (err) {
      throw err.message
    }
  }

  @Post('user/resetpassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {

    } catch (err) {
      throw err.message
    }
  }

  @Patch('update/user/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string, 
    @Body() updateAuthenticationDto: UpdateAuthenticationDto, 
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      updateAuthenticationDto.file = file;
      return this.authenticationService.update(+id, updateAuthenticationDto); 
    } catch (err) {
      throw err.message
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.authenticationService.remove(+id); 
    } catch (err) {
      throw err.message
    }
  }
}
