import { IsNotEmpty } from "class-validator";


export class LoginUserDto {
    phoneNo: string;

    username: string;

    @IsNotEmpty()
    password: string
}