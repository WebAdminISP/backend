import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { RelevamientosService } from './relevamientos.service';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from '../auths/roles.guard';
import { RangoFecha } from './dto/rango-fecha.dto';
import { AuthGuard } from '../auths/auth.guards';

@ApiTags('Relevamientos')
@Controller('relevamientos')
export class RelevamientosController {
  constructor(private readonly relevamientosService: RelevamientosService) {
    {
      console.log('RelevamientosController instantiated');
    }
  }

  //* Público: usado por guests
  @Post()
  async create(@Body() createRelevamientoDto: CreateRelevamientoDto) {
    return this.relevamientosService.create(createRelevamientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los relevamientos' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 5,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.relevamientosService.findAll(page, limit);
  }

  //* ##############################
  //* ######## 'Busquedas' #########
  //* ##############################

  @Get('by-date-range')
  @ApiOperation({ summary: 'Busca relevamientos en un rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', required: true, type: String })
  @ApiQuery({ name: 'fechaFin', required: true, type: String })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getByDateRange(@Query() rangoFecha: RangoFecha) {
    console.log('Query params:', rangoFecha);
    return this.relevamientosService.getByDateRange(rangoFecha);
  }

  @Get('by-agente/:agente')
  @ApiOperation({ summary: 'Busca relevamientos por agente' })
  @ApiQuery({ name: 'agente', required: true, type: String })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getByAgente(@Query('agente') agente: string) {
    return await this.relevamientosService.getByAgente(agente);
  }

  @Get('by-provincia/:provincia')
  @ApiOperation({ summary: 'Busca relevamientos por provincia' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getByProvincia(@Query('provincia') provincia: string) {
    return await this.relevamientosService.getByProvincia(provincia);
  }

  @Get('by-localidad/:localidad')
  @ApiOperation({ summary: 'Busca relevamientos por provincia' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getByLocalidad(@Query('localidad') localidad: string) {
    return await this.relevamientosService.getByLocalidad(localidad);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna 1 relevamiento por id' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.relevamientosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica relevamiento por ID' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateRelevamiento(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRelevamiento: CreateRelevamientoDto,
  ) {
    return await this.relevamientosService.update(id, updateRelevamiento);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina 1 relevamiento por ID' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.relevamientosService.remove(id);
  }
}
