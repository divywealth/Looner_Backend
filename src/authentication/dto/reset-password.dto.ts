import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class VerifyPasswordCodeDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    verificationCode: string;
}

export class ResetPasswordDto {
    @IsEmail() 
    email: string;


    @MinLength(6)
    password: string;
}