import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import { UpdateRelevamientoDto } from './dto/update-relevamiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Repository } from 'typeorm';

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
    
    //* fetch provincia y localidad
    let provincia: Provincia;
    let localidad: Localidad;

    const fetchedProvincia = await this.provinciaRepository.findOne(
      {where: {nombre:createRelevamientoDto.provincia}}
    )
 
      if (!fetchedProvincia) {
        throw new BadRequestException('La provincia no existe');
      }

      provincia = fetchedProvincia;
    

    const fetchedLocalidad = await this.localidadRepository.findOne(
      {where: {nombre: createRelevamientoDto.localidad}}
    )

    if (!fetchedLocalidad) {
      throw new BadRequestException('La localidad no existe');
    }

    localidad = fetchedLocalidad;
    

    //* crea nuevo relevamiento con propiedades restantes
    const newRelevamiento = this.relevamientoRepository.create({
      ...createRelevamientoDto,
      agente,
      longitud,
      latitud,
      provincia,
      localidad
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
