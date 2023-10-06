import { ApiProperty } from "@nestjs/swagger";


export class ProfilePicUploadDto {
    @ApiProperty({type: 'string', format: 'binary'})
    file: any;
}