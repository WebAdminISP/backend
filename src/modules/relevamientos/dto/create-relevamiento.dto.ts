import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateRelevamientoDto {
  @ApiHideProperty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  fechaIngreso: Date = new Date();

//   @ApiProperty({ 
//     example: 'Juan Perez', 
//     description: 'Nombre del agente es cargado automaticamente' })
  @ApiHideProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  agente?: string;

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
  @IsNotEmpty()
  @IsString()
  @Length(1, 60)
  razon: string;

  @ApiProperty({ 
    example: 'Calle Falsa 123', 
    description: 'Domicilio del interesado' })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiProperty({ example: -34.6037, description: 'Latitud del domicilio' })
  @IsNotEmpty({ message: 'La latitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  latitud: number;

  @ApiProperty({ example: -58.3816, description: 'Longitud del domicilio' })
  @IsNotEmpty({ message: 'La longitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  longitud: number;

  @ApiProperty({ required: false, example: 'Lunes', description: 'Día preferido para visita' })
  @IsOptional()
  @IsString()
  diaCliente?: string;

  @ApiProperty({ required: false, example: '9:00 - 18:00', description: 'Franja horaria indicada para la visita' })
  @IsOptional()
  @IsString()
  horarios?: string;

  @ApiProperty({ required: false, example: 'Calle Falsa 456', description: 'Domicilio del Instalador' })
  @IsOptional()
  @IsString()
  domicilioInstal?: string;

  @ApiProperty({ required: false, example: 'Las Heras', description: 'Localidad de Instalador' })
  @IsOptional()
  @IsString()
  localidadInstal?: string;

  @ApiProperty({ required: false, example: 'jperez@example.com', description: 'Email de instalador' })
  @IsOptional()
  @IsEmail()
  emailInstal?: string;

  @ApiProperty({ required: false, example: 'Calle sin número, 1° timbre', description: 'Observaciones adicionales'})
  @IsOptional()
  @IsString()
  observaciones?: string;
}
