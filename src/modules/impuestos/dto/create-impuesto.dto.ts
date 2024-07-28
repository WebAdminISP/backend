import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateImpuestoDto {
  @ApiProperty({
    example: 'Responsable Inscripto', 
    description: 'Impuesto del servicio'}
  )
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;
}

