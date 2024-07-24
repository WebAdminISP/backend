import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Equipo } from './entities/equipo.entity';

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {
    console.log('EquiposController instantiated');
  }

  @Post()
  @ApiOperation({ summary: 'Agregar un equipo' })
  //@ApiBearerAuth()
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Agregar un equipo nuevo' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los equipos' })
  //@ApiBearerAuth()
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
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
    const allEquipos: Equipo[] = await this.equiposService.findAll(page, limit);
    return allEquipos;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equiposService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipoDto: UpdateEquipoDto) {
    return this.equiposService.update(+id, updateEquipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }
}
