import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auths/auth.guards';
import { Request } from 'express';
import { Asistencia } from './entities/asistencia.entity';

@ApiTags('Asistencias')
@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Dar de alta un pedido o asistencia' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAsistenciaDto })
  async create(
    @Body() createAsistenciaDto: CreateAsistenciaDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    //console.log('Authenticated User:', user);
    return await this.asistenciasService.create(createAsistenciaDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todas las asistencias' })
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
    const allServicios: Asistencia[] = await this.asistenciasService.findAll(
      page,
      limit,
    );
    return allServicios;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asistenciasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    return this.asistenciasService.update(+id, updateAsistenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asistenciasService.remove(+id);
  }
}
