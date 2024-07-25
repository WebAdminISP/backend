import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
IsDate,
  IsBoolean,
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
import { addMinutes } from 'date-fns';

export class CreateUserDto {
  @ApiHideProperty()
  @IsOptional()
  @IsBoolean({ message: 'isAdmin debe ser un valor booleano.' })
  // @ApiProperty({
    //   description: 'Indica si el usuario tiene privilegios de administrador.',
    //   example: true,
    // })
  isAdmin: boolean;

  @ApiHideProperty()
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
  @IsOptional()
  // @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
  // @ApiProperty({
  //   description: 'La fecha de creación del usuario.',
  //   example: '2023-12-31T23:59:59.999Z',
  // })
  createdAt: Date;

 @IsOptional({message:'El agente es cargado automaticamente'})
  @IsString({ message: 'El agente debe ser una cadena de texto.' })
  @Length(3, 50, { message: 'El agente debe tener entre 3 y 80 caracteres.' })
  // @ApiProperty({
  //   description: 'El nombre del agente debe ser válido y contener al menos 3 caracteres.',
  //   example: 'Agente Pérez',
  // })
  @ApiHideProperty()
  agente?: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 80 caracteres.' })
  @ApiProperty({
    description: 'El nombre del usuario debe ser válido y contener al menos 3 caracteres.',
    example: 'Juan Pérez',
  })
  nombre: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
  @IsNumber({}, { message: 'El teléfono debe ser un número entero.' })
  @Min(1000000, { message: 'El teléfono debe tener al menos 7 dígitos.' })
  @Max(999999999999999, { message: 'El teléfono debe tener como máximo 15 dígitos.' })
  @ApiProperty({
    description: 'El número de teléfono debe ser un número entero.',
    example: 1234567,
type:Number,
  })
  telefono: number;

  @IsNotEmpty({ message: 'La dirección es obligatoria y no puede estar vacía.' })
  @Length(10, 80, { message: 'La dirección debe tener entre 10 y 80 caracteres.' })
  @ApiProperty({
    description: 'La dirección del usuario debe ser válida.',
    example: 'Calle Falsa 123',
type:String,
  })
  direccion: string;

  @IsNotEmpty({ message: 'La latitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @ApiProperty({
    description: 'La latitud debe ser válida.',
    example: '-28.978690147764837',
type: Number,
  })
  latitud: number;

  @IsNotEmpty({ message: 'La longitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @ApiProperty({
    description: 'La longitud debe ser válida.',
    example: '-61.48905321096909',
type: Number,
  })
  longitud: number;

  @IsNotEmpty({ message: 'El documento es obligatorio y no puede estar vacío.' })
  @IsNumber({}, { message: 'El documento debe ser un número.' })
  @ApiProperty({
    description: 'El documento debe ser válido.',
    example: '45123456',
type: Number,
  })
  documento: number;

  @IsNotEmpty({ message: 'El email es obligatorio y no puede estar vacío.' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @ApiProperty({
    description: 'El email del usuario debe ser un email válido.',
    example: 'jperez@mail.com',
 type: String,
  })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
  })
  @ApiProperty({
    description:
      'La contraseña del usuario debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
    example: 'P@ssw0rd',
    type: String,
  })
  password: string;


  @IsString({ message: 'La razón social debe ser una cadena de texto.' })
  @Length(8, 40, { message: 'La razón social debe tener entre 8 y 40 caracteres.' })
  @ApiProperty({
    description: 'La razón social debe ser válida.',
    example: 'Café los Angelitos',
 type: String,
  })
  razonSocial: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El id del impuesto es obligatorio y debe ser un id UUID válido.' })
  @ApiProperty({
    description: 'El id del impuesto debe ser un id UUID válido.',
    example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  })
  impuestoId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El id de la provincia es obligatorio y debe ser un id UUID válido.' })
  @ApiProperty({
    description: 'El id de la provincia debe ser un id UUID válido.',
    example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  })
  provinciaId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'El id de la localidad es obligatorio y debe ser un id UUID válido.' })
  @ApiProperty({
    description: 'El id de la localidad debe ser un id UUID válido.',
    example: '911aec2b-1ee8-4e86-a223-abf0eb0d138b',
  })
  localidadId: string;

  @IsNotEmpty({ message: 'El código postal es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  @Length(4, 8, { message: 'El código postal debe tener entre 4 y 8 caracteres.' })
  @ApiProperty({
    description: 'El código postal debe ser válido.',
    example: 'X5180FKA',
  type: String,
  })
  codigoPostal: string;

  @IsNotEmpty({ message: 'El domicilio de instalación es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El domicilio de instalación debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El domicilio de instalación debe ser válido.',
    example: 'Urquiza 3560 1°A',
 type: String,
  })
  domicilioInstal: string;

  @IsNotEmpty({ message: 'La localidad de instalación es obligatoria y no puede estar vacía.' })
  @IsString({ message: 'La localidad de instalación debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La localidad de instalación debe ser válida.',
    example: 'Potrerillos',
  type: String,
  })
  localidadInstal: string;

  @IsNotEmpty({ message: 'El número de teléfono de instalación es obligatorio.' })
  @IsNumber({}, { message: 'El teléfono de instalación debe ser un número entero.' })
  @Min(1000000, { message: 'El teléfono de instalación debe tener al menos 7 dígitos.' })
  @Max(999999999999999, { message: 'El teléfono de instalación debe tener como máximo 15 dígitos.' })
  @ApiProperty({
    description: 'El número de teléfono de instalación debe ser un número entero.',
    example: 1234567,
 type: Number,
  })
  telefonoInstal: number;

  @IsNotEmpty({ message: 'El email de instalación es obligatorio y no puede estar vacío.' })
  @IsEmail({}, { message: 'El correo electrónico de instalación no es válido.' })
  @ApiProperty({
    description: 'El email de instalación debe ser un email válido.',
    example: 'jperez@mail.com',
 type: String,
  })
  emailInstal: string;

  @IsNotEmpty({ message: 'Las observaciones son obligatorias y no pueden estar vacías.' })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  @ApiProperty({
    description: 'Las observaciones deben ser válidas.',
    example: 'La antena tiene acceso difícil, coordinar con el propietario',
  })
  observaciones: string;

  @IsOptional()
  @IsString({ message: 'La señal de conexión debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El texto de la señal de conexión debe ser válido.',
    example: '-65dBm',
 type: String,
  })
  senalConexion: string;

@IsUUID()
@IsOptional({})
 @IsString()
  @ApiProperty({
    description: 'El id del equipo debe ser un id UUID válido.',
    example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  })
  equipoId: string;

  @IsUUID()
@IsOptional()
  @IsString()
  @ApiProperty({
    description: 'El id del servicio debe ser un id UUID válido.',
    example: 'd4e2df8e-8474-4b69-b974-34bf6f3cb69a',
  })
  servicioId: string;

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