import { IsNotEmpty } from "class-validator";

export class CreateVerificationDto {
    @IsNotEmpty()
    verificationcode: string
}
