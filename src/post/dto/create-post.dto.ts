import { IsNotEmpty } from "class-validator";
import { CreateImageDto } from "src/image/dto/create-image.dto";

export class CreatePostDto {
    userId: number;
    @IsNotEmpty()
    text: string;

    file: Array<Express.Multer.File>;
    image: string
}
