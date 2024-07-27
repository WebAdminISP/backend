import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProvinciaDto {
  @ApiProperty({
    example: 'Ontario', 
    description: 'Localidad del interesado'}
  )
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;
}
