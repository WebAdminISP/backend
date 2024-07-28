import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ImpuestosService } from './impuestos.service';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { RolesGuard } from '../auths/roles.guard';

@ApiTags('Impuestos')
@Controller('impuestos')
export class ImpuestosController {
  constructor(private readonly impuestosService: ImpuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo impuesto' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async create(@Body() createImpuestoDto: CreateImpuestoDto) {
    return await this.impuestosService.create(createImpuestoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos los impuestos' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async findAll() {
    return await this.impuestosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna un impuesto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return await this.impuestosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica un impuesto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateImpuestoDto: CreateImpuestoDto) {
    return await this.impuestosService.update(id, updateImpuestoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Modifica un impuesto por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
 async remove(@Param('id') id: string) {
    return await this.impuestosService.remove(id);
  }
}
