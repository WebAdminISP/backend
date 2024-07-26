import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import { UpdateRelevamientoDto } from './dto/update-relevamiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';
import { Repository } from 'typeorm';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';

@Injectable()
export class RelevamientosService {
  constructor(
    @InjectRepository(Relevamiento)
    private relevamientoRepository: Repository<Relevamiento>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
    @InjectRepository(Localidad)
    private localidadRepository: Repository<Localidad>,
  ){}

  async create(createRelevamientoDto: CreateRelevamientoDto) {
    //w localizar agente cercano y asignar(mock)
    const agente = 'Admin';
    //w localiza coordenadas domicilio(mock)
    const longitud = -58.3816;
    const latitud = -58.3816;
    //w propiedades opcionales (modificar entidad > nullable:true)
    const diaCliente = 'no especificado';
    const horarios = 'no especificado';
    const domicilioInstal = 'no especificado';
    const localidadInstal = 'no especificado';
    const emailInstal = 'no especificado';
    const observaciones = 'no especificado';
    
    //* fetch provincia y localidad
    let provincia: Provincia[] = [];
    let localidad: Localidad[]= [];

    const fetchedProvincia = await this.provinciaRepository.findOne(
      {where: {nombre:createRelevamientoDto.provincia}}
    )
 
      if (!fetchedProvincia) {
        throw new BadRequestException('La provincia no existe');
      }

      provincia.push(fetchedProvincia);
    

    const fetchedLocalidad = await this.localidadRepository.findOne(
      {where: {nombre: createRelevamientoDto.localidad}}
    )

    if (!fetchedLocalidad) {
      throw new BadRequestException('La localidad no existe');
    }

    localidad.push(fetchedLocalidad);
    

    //* crea nuevo relevamiento con propiedades restantes
    const newRelevamiento = this.relevamientoRepository.create({
      ...createRelevamientoDto,
      agente,
      longitud,
      latitud,
      provincia,
      localidad,
      diaCliente,
      horarios,
      domicilioInstal,
      localidadInstal,
      emailInstal,
      observaciones
    })

    const savedRelevamiento = await this.relevamientoRepository.save(newRelevamiento);
    

    return {
      message: 'Nuevo relevamiento guardado exitosamente',
      savedRelevamiento
    };
  }

  async findAll(page:number, limit:number) {
    const skippedItems = (page - 1) * limit;
    return this.relevamientoRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} relevamiento`;
  }

  update(id: number, updateRelevamientoDto: UpdateRelevamientoDto) {
    return `This action updates a #${id} relevamiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} relevamiento`;
  }
}
