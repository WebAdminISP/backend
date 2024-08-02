import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReverseGeocodeDto {
  @ApiProperty({
    description: 'Latitud',
    example: -34.603722,
    type: Number,
  })
  @IsNotEmpty({
    message: 'La latitud es obligatoria',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitud',
    example: -58.381592,
    type: Number,
  })
  @IsNotEmpty({
    message: 'La longitud es obligatoria',
  })
  @IsNumber()
  lng: number;
}
