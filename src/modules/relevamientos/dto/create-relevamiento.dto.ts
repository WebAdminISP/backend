import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateRelevamientoDto {



  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del interesado' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  nombre: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del interesado' })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @ApiProperty({ example: 1234567890, description: 'Telefono del interesado' })
  @IsNotEmpty({ message: 'El número de teléfono de instalación es obligatorio.' })
  @IsNumber({}, { message: 'El teléfono de instalación debe ser un número entero.' })
  @Min(1000000, { message: 'El teléfono de instalación debe tener al menos 7 dígitos.' })
  @Max(999999999999999, { message: 'El teléfono de instalación debe tener como máximo 15 dígitos.' })
  @Transform(({ value }) => parseInt(value, 10))
  telefono: number;

  @ApiProperty({
     example: 'Solicitud de instalación de servico',
     description: 'Motivo del contacto' })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  razon: string;

  @ApiProperty({ 
    example: 'Calle Falsa 123', 
    description: 'Domicilio del interesado' })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiProperty({ 
    example: 'Mendoza', 
    description: 'Provincia del interesado' })
  @IsNotEmpty()
  @IsString()
  provincia: string;

  @ApiProperty({ 
    example: 'Las Heras', 
    description: 'Localidad del interesado' })
  @IsNotEmpty()
  @IsString()
  localidad: string;

}
