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
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { Equipo } from './entities/equipo.entity';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { RolesGuard } from './../auths/roles.guard';

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {
    console.log('EquiposController instantiated');
  }

  @Post()
  @ApiOperation({ summary: 'Agregar un equipo nuevo' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los equipos' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
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
  @ApiOperation({ summary: 'Ver un equipo por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const equipo = await this.equiposService.findOne(id);
    if (!equipo) {
      return {
        error: 'No se encontró el equipo.',
      };
    }
    return equipo;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un equipo por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createEquipoDto: CreateEquipoDto,
  ) {
    return this.equiposService.update(id, createEquipoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un equipoo por :id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @HttpCode(200)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.equiposService.remove(id);
  }
}
