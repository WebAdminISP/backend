import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateServicioDto {
  @IsOptional()
  @IsString({ message: 'El agente es cargado automaticamente' })
  // @ApiProperty({})
  @ApiHideProperty()
  agente?: string;

  @IsNotEmpty({
    message: 'La velocidad de bajada es obligatoria.',
  })
  @IsString({ message: 'La velocidad de bajada debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La velocidad de bajada debe ser válida.',
    example: '192.169.1.21',
    type: String,
  })
  velocidadBajada: string;

  @IsNotEmpty({
    message: 'La IP es obligatoria y no puede estar vacía.',
  })
  @IsString({ message: 'La IP debe ser una cadena de texto.' })
  @Length(11, 15, { message: 'La IP debe tener entre 11 y 15 caracteres.' })
  @ApiProperty({
    description: 'La IP debe ser válida y contener entre 11 y 15 caracteres.',
    example: '192.169.1.21',
    type: String,
  })
  velocidadSubida: string;

  @IsNotEmpty({
    message: 'La máscara es obligatoria y no puede estar vacía.',
  })
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
  CostoConexion: string;

  @IsNotEmpty({
    message: 'La puerta de enlace es obligatoria y no puede estar vacía.',
  })
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
  abono: string;

  @IsUUID()
  @IsOptional({})
  @ApiProperty({
    description: 'El id del user, debe ser un id UUID valido',
    example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  })
  userId: string;
}
