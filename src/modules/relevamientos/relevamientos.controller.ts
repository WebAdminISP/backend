import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { UpdateRelevamientoDto } from './dto/update-relevamiento.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { RolesGuard } from '../auths/roles.guard';
import { Relevamiento } from './entities/relevamiento.entity';

@ApiTags('Relevamientos')
@Controller('relevamientos')
export class RelevamientosController {
  constructor(private readonly relevamientosService: RelevamientosService) {
    {
      console.log('RelevamientosController instantiated');
    }
  }

  @Post()
 async create(@Body() createRelevamientoDto: CreateRelevamientoDto) {
    
    return this.relevamientosService.create(createRelevamientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los relevamientos' })
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
    return this.relevamientosService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna 1 relevamiento por id' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
 async findOne(@Param('id', new ParseUUIDPipe()) id: string) {  
    return await this.relevamientosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica relevamiento por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async updateRelevamiento( 
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRelevamiento:CreateRelevamientoDto)
    {
      return await this.relevamientosService.update(id, updateRelevamiento);
    }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRelevamientoDto: UpdateRelevamientoDto,
  // ) {
  //   return this.relevamientosService.update(+id, updateRelevamientoDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina 1 relevamiento por ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('Auth0')
  @Roles(Role.Admin)
  @UseGuards(CompositeAuthGuard, RolesGuard)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.relevamientosService.remove(id);
  }
}
