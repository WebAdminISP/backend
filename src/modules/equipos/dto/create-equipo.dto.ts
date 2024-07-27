import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateEquipoDto {
  @IsNotEmpty({
    message: 'El agente es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El agente es cargado automaticamente' })
  @ApiProperty({
    description: 'El nombre debe ser válido.',
    example: 'Huawei',
    type: String,
  })
  //@ApiHideProperty()
  nombre: string;

  @IsNotEmpty({
    message: 'El agente es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El agente es cargado automaticamente' })
  @ApiProperty({
    description: 'El nombre debe ser válido.',
    example: 'Juan Pérez',
    type: String,
  })
  //@ApiHideProperty()
  agente: string;

  @IsOptional()
  @IsString({ message: 'La IP debe ser una cadena de texto.' })
  @Length(11, 15, { message: 'La IP debe tener entre 11 y 15 caracteres.' })
  @ApiProperty({
    description: 'La IP debe ser válida y contener entre 11 y 15 caracteres.',
    example: '192.169.1.21',
    type: String,
  })
  ipPc: string;

  @IsOptional()
  @IsString({ message: 'La IP debe ser una cadena de texto.' })
  @Length(11, 15, { message: 'La IP debe tener entre 11 y 15 caracteres.' })
  @ApiProperty({
    description: 'La IP debe ser válida y contener entre 11 y 15 caracteres.',
    example: '192.169.1.21',
    type: String,
  })
  ipAp: string;

  @IsOptional()
  @IsString({ message: 'La máscara debe ser una cadena de texto.' })
  @Length(9, 15, {
    message: 'La máscara debe tener entre 9 y 15 caracteres.',
  })
  @ApiProperty({
    description:
      'La máscara debe ser válida y contener entre 9 y 15 caracteres.',
    example: '255.255.0.0',
    type: String,
  })
  mascaraSubRed: string;

  @IsOptional()
  @IsString({ message: 'La puerta de enlace debe ser una cadena de texto.' })
  @Length(7, 15, {
    message: 'La puerta de enlace debe tener entre 7 y 15 caracteres.',
  })
  @ApiProperty({
    description:
      'La puerta de enlace debe ser válida y contener entre 7 y 15 caracteres.',
    example: '192.168.1.1',
    type: String,
  })
  puertaEnlace: string;

  @IsOptional()
  @IsString({ message: 'El DNS debe ser una cadena de texto.' })
  @Length(7, 15, {
    message: 'El DNS debe tener entre 7 y 15 caracteres.',
  })
  @ApiProperty({
    description: 'El DNS debe ser válido y contener entre 7 y 15 caracteres.',
    example: '192.168.1.1',
    type: String,
  })
  dns1: string;

  @IsOptional()
  @IsString({ message: 'El DNS debe ser una cadena de texto.' })
  @Length(7, 15, {
    message: 'El DNS debe tener entre 7 y 15 caracteres.',
  })
  @ApiProperty({
    description: 'El DNS debe ser válido y contener entre 7 y 15 caracteres.',
    example: '192.168.1.1',
    type: String,
  })
  dns2: string;

  @IsOptional()
  @IsString({ message: 'El DNS debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El Nodo debe ser válido.',
    example: 'ZS2-001',
    type: String,
  })
  nodo: string;

  @IsNotEmpty({
    message: 'El Equipo es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El Equipo debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El Equipo debe ser válido.',
    example: 'V2802GW',
    type: String,
  })
  equipo: string;

  @IsOptional()
  @IsString({ message: 'Los metros de cable deben ingresarse.' })
  @ApiProperty({
    description: 'La longitud debe ser válida.',
    example: '50 mts',
    type: String,
  })
  cableMts: string;

  @IsNotEmpty({
    message: 'La MAC es obligatoria.',
  })
  @IsString({ message: 'La MAC debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La MAC debe ser válida.',
    example: '00:11:22:33:44:55',
    type: String,
  })
  macEquipo: string;

  @IsOptional()
  @IsString({ message: 'La antena debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El Equipo debe ser válido.',
    example: 'Fibra',
    type: String,
  })
  antena: string;

  @IsUUID()
  @IsNotEmpty({})
  @ApiProperty({
    description: 'El id del user, debe ser un id UUID valido',
    example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  })
  userId: string;
}
