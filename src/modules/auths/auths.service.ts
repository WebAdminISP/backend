import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './roles.enum';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { ImpuestosService } from '../impuestos/impuestos.service';
import { EquiposService } from '../equipos/equipos.service';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
    @InjectRepository(Localidad)
    private localidadRepository: Repository<Localidad>,
    private readonly impuestosService: ImpuestosService,
    private readonly jwtService: JwtService,

  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const newUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!newUser) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, newUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const userPayload = {
      sub: newUser.id,
      id: newUser.id,
      email: newUser.email,
      agente: newUser.nombre,
      roles: [newUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);

    const decodedToken = this.jwtService.decode(token);

    // console.log(decodedToken);

    const iat = new Date(decodedToken.iat * 1000).toLocaleString();
    const exp = new Date(decodedToken.exp * 1000).toLocaleString();

    const agente = decodedToken.agente;

    return {
      succes: 'User logged in successfully',
      token,
      issuedAt: iat,
      expiresAt: exp,
      agente,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        roles: [newUser.isAdmin ? Role.Admin : Role.User],
      }
    };
  }

  async saveUser(createUserDto: CreateUserDto) {
       //* verifica existencia de usuario
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password hashing failed');
    }

    createUserDto.password = hashedPassword;


    //* verificacion de existencia de Provincia y Localidad
    const provincia = await this.provinciaRepository.findOne({
      where: { id: createUserDto.provinciaId },
    });

    if (!provincia) {
      throw new NotFoundException(
        `Provincia with ID ${createUserDto.provinciaId} not found`,
      );
    }

    const localidad = await this.localidadRepository.findOne({
      where: { id: createUserDto.localidadId },
    });
    if (!localidad) {
      throw new NotFoundException(
        `Localidad with ID ${createUserDto.localidadId} not found`,
      );
    }

    //* asigna impuesto por defecto : 'Consumidor Final'
    const impuestoDefault = await 


     //* llena campos opcionales vacios
     if(!createUserDto.domicilioInstal){
       createUserDto.domicilioInstal = createUserDto.direccion
     }

    if(!createUserDto.localidadInstal)
      createUserDto.localidadInstal = localidad.nombre

    if(!createUserDto.telefonoInstal)
      createUserDto.telefonoInstal = createUserDto.telefono;

    if(!createUserDto.emailInstal)
      createUserDto.emailInstal = createUserDto.email

    const user = this.usersRepository.create({
      ...createUserDto,
      provincia,
      localidad,
      // equipos: [equipo],
      // servicios: [servicio],
    });

    if (!createUserDto.createdAt) {
      user.createdAt = new Date();
    } else {
      user.createdAt = new Date(createUserDto.createdAt);
    }

    return await this.usersRepository.save(user);
  }
}
