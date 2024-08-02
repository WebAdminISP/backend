import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UsePipes,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Equipo } from './entities/equipo.entity';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from './../auths/roles.guard';
import { AuthGuard } from '../auths/auth.guards';

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {
    console.log('EquiposController instantiated');
  }

  @Post()
  @ApiOperation({ summary: 'Agregar un equipo nuevo' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Req() req: Request & { oidc?: any; user?: any },
    @Body() createEquipoDto: CreateEquipoDto,
  ) {
    let agente: string;

    if (req.user) {
      agente = req.user.name || req.user.agente;
    } else {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createEquipoDto.agente = agente;
    console.log('agente cargado automáticamente al dto');
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los equipos' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request & { oidc?: any; user?: any },
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createEquipoDto: CreateEquipoDto,
  ) {
    let agente: string;

    if (req.user) {
      agente = req.user.name || req.user.agente;
    } else {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createEquipoDto.agente = agente;
    console.log('agente cargado automáticamente al dto');
    return this.equiposService.update(id, createEquipoDto);
  }
}
