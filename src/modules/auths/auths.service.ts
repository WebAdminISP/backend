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
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    private readonly jwtService: JwtService,
    private readonly impuestosService: ImpuestosService,
    private readonly equiposService:EquiposService,
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
    //* verifica si es 'user' con impuesto
    if(!createUserDto.isAdmin && !createUserDto.impuestoId) 
      throw new BadRequestException(`Indicar un impuesto para este usuario. Los impuestos son opcionales solo para admins.`)


    //* verifica si ya existe usuario
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

     //* verifica que el impuesto exista
     const impuestos = (await this.impuestosService.findAll()).impuestos;

     if(!impuestos.some(impuesto => impuesto.id === createUserDto.impuestoId))
       throw new BadRequestException(`Este impuesto no existe, verificar id`);

     //* verifica que exista el equipo
     const equipos = await this.equipoRepository.find()

     if(!equipos.some(equipo => equipo.id === createUserDto.equipoId))
      throw new BadRequestException(`Este impuesto no existe, verificar id`);


    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password hashing failed');
    }

    createUserDto.password = hashedPassword;

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

    const equipo = await this.equipoRepository.findOne({
      where: { id: createUserDto.equipoId },
    });
    if (!equipo) {
      throw new NotFoundException(
        `Equipo with ID ${createUserDto.equipoId} not found`,
      );
    }

    const servicio = await this.servicioRepository.findOne({
      where: { id: createUserDto.servicioId },
    });
    if (!servicio) {
      throw new NotFoundException(
        `Servicio with ID ${createUserDto.servicioId} not found`,
      );
    }

     //* llena campos opcionales vacios
     if(!createUserDto.domicilioInstal)
      createUserDto.domicilioInstal = createUserDto.direccion

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
      equipos: [equipo],
      servicios: [servicio],
    });

    if (!createUserDto.createdAt) {
      user.createdAt = new Date();
    } else {
      user.createdAt = new Date(createUserDto.createdAt);
    }

    return await this.usersRepository.save(user);
  }
}
