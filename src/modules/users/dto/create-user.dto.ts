import { ApiProperty } from '@nestjs/swagger';
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
import { Transform } from 'class-transformer';
import { addMinutes } from 'date-fns';

export class CreateUserDto {
  @ApiProperty({
    description: 'Define si el usuario es administrador boolean.',
    example: 'false',
    type: Boolean,
  })
  isAdmin: boolean;

  @IsOptional()
  @IsDate({ message: 'createdAt debe ser una instancia de Date' })
  @Transform(
    ({ value }) => {
      if (value) {
        return new Date(value);
      }
      return new Date();
    },
    { toClassOnly: true },
  )
  @ApiProperty({
    description: 'La fecha de creación del usuario se genera automáticamente.',
    type: Date,
  })
  createdAt: Date;

  @IsOptional()
  @IsString({ message: 'El agente debe ser una cadena de texto.' })
  @ApiProperty({})
  agente?: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres.' })
  @ApiProperty({
    description:
      'El nombre del usuario debe ser válido y contener al menos 3 caracteres.',
    example: 'Juan Pérez',
    type: String,
  })
  nombre: string;

  @IsNotEmpty({
    message: 'El número de teléfono es obligatorio.',
  })
  @IsNumber({}, { message: 'El teléfono debe ser un número entero' })
  @Min(1000000, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @Max(999999999999999, {
    message: 'El teléfono debe tener como máximo 15 dígitos',
  })
  @ApiProperty({
    description: 'El número de teléfono debe ser un número entero.',
    example: 1234567,
    type: Number,
  })
  telefono: number;

  @IsNotEmpty({
    message: 'La dirección es obligatoria y no puede estar vacía.',
  })
  @Length(10, 80, {
    message: 'La dirección debe tener entre 10 y 80 caracteres.',
  })
  @ApiProperty({
    description: 'La dirección del usuario debe ser válida.',
    example: 'Calle Falsa 123',
    type: String,
  })
  direccion: string;

  @IsNotEmpty({
    message: 'La latitud es obligatoria y no puede estar vacía.',
  })
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @ApiProperty({
    description: 'La latitud debe ser válida.',
    example: '-28.978690147764837',
    type: Number,
  })
  latitud: number;

  @IsNotEmpty({
    message: 'La longitud es obligatoria y no puede estar vacía.',
  })
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @ApiProperty({
    description: 'La longitud debe ser válida.',
    example: '-61.48905321096909',
    type: Number,
  })
  longitud: number;

  @IsNotEmpty({
    message: 'El documento es obligatorio y no puede estar vacío.',
  })
  @IsNumber({}, { message: 'El documento debe ser un número.' })
  @ApiProperty({
    description: 'El documento debe ser válido.',
    example: '45123456',
    type: Number,
  })
  documento: number;

  @IsNotEmpty({ message: 'El email es obligatorio y no puede estar vacío.' })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no es válido.',
    },
  )
  @ApiProperty({
    description: 'El email del usuario debe ser un email válido.',
    example: 'jperez@mail.com',
    type: String,
  })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
    },
  )
  @ApiProperty({
    description:
      'La contraseña del usuario debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
    example: 'P@ssw0rd',
    type: String,
  })
  password: string;

  @Length(8, 40, {
    message: 'El nombre de la razón social debe tener entre 8 y 40 caracteres.',
  })
  @ApiProperty({
    description: 'La razón social debe ser válida.',
    example: 'Café los Angelitos',
    type: String,
  })
  razonSocial: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @ApiProperty()
  impuesto: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @ApiProperty()
  provincia: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @ApiProperty()
  localidad: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @Length(4, 8, { message: 'El CP debe tener 4 u 8 caracteres.' })
  @ApiProperty({
    description: 'El CP debe ser válido.',
    example: 'X5180FKA',
    type: String,
  })
  codigoPostal: string;

  @IsNotEmpty({})
  @IsString({ message: 'El domicilio debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El domicilio de instalación debe ser válido.',
    example: 'Urquiza 3560 1°A',
    type: String,
  })
  domicilioInstal: string;

  @IsNotEmpty({})
  @IsString({ message: 'La localidad debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La localidad de instalación debe ser válida.',
    example: 'Potrerillos',
    type: String,
  })
  localidadInstal: string;

  @IsNotEmpty({
    message: 'El número de teléfono es obligatorio.',
  })
  @IsNumber({}, { message: 'El teléfono debe ser un número entero' })
  @Min(1000000, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @Max(999999999999999, {
    message: 'El teléfono debe tener como máximo 15 dígitos',
  })
  @ApiProperty({
    description: 'El número de teléfono debe ser un número entero.',
    example: 1234567,
    type: Number,
  })
  telefonoInstal: number;

  @IsNotEmpty({ message: 'El email es obligatorio y no puede estar vacío.' })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no es válido.',
    },
  )
  @ApiProperty({
    description: 'El email de la instalación debe ser un email válido.',
    example: 'jperez@mail.com',
    type: String,
  })
  emailInstal: string;

  @IsNotEmpty({})
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  @ApiProperty({
    description: 'Las observaciones deben ser válidas.',
    example: 'La antena tiene acceso difícil, coordinar con el propietario',
    type: String,
  })
  observaciones: string;

  @IsNotEmpty({})
  @IsString({
    message: 'La señal de la conexión debe ser una cadena de texto.',
  })
  @ApiProperty({
    description: 'El texto de la señal de la conexión debe ser válido.',
    example: '¿xxx?',
    type: String,
  })
  senalConexion: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @ApiProperty()
  equiposId: string;

  @IsNotEmpty({})
  @IsString({ message: 'Futura ForeingKey' })
  @ApiProperty()
  serviciosId: string;

  constructor(createdAt?: number) {
    this.createdAt = createdAt ? new Date(createdAt) : this.getLocalDate();
  }

  private getLocalDate(): Date {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const fecha = addMinutes(now, -offsetInMinutes);
    return fecha;
  }
}