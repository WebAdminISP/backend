import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { RolesGuard } from '../auths/roles.guard';

@ApiTags('Provincias')
@Controller('provincias')
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una provincia' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async create(@Body() createProvinciaDto: CreateProvinciaDto) {
    return await this.provinciasService.create(createProvinciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas las provincias' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async findAll() {
    return this.provinciasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna 1 provincia  por id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: string) {
    return this.provinciasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica 1 provincia  por id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
 async update(
    @Param('id') id: string,
    @Body() updateProvinciaDto: CreateProvinciaDto,
  ) {
    return this.provinciasService.update(id, updateProvinciaDto);
  }

  @ApiOperation({ summary: 'Elimina 1 provincia  por id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.provinciasService.remove(id);
  }
}
