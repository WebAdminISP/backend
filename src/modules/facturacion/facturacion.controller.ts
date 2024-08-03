import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
  UnauthorizedException,
  Put,
  HttpCode,
  Req,
} from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { AuthGuard } from '../auths/auth.guards';
import { RolesGuard } from '../auths/roles.guard';
import { Factura } from './entities/facturacion.entity';

@ApiTags('Facturación')
@Controller('facturacion')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post()
  create(@Body() createFacturacionDto: CreateFacturacionDto) {
    return this.facturacionService.create(createFacturacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todas las facturas' })
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
    const allFacturas: Factura[] = await this.facturacionService.findAll(
      page,
      limit,
    );
    return allFacturas;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver una factura por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const factura = await this.facturacionService.findOne(id);
    if (!factura) {
      return {
        error: 'No se encontró la factura.',
      };
    }
    return factura;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una factura por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request & { oidc?: any; user?: any },
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createFacturaDto: CreateFacturacionDto,
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

    createFacturaDto.agente = agente;
    console.log('agente cargado automáticamente al dto');
    return this.facturacionService.update(id, createFacturaDto);
  }
}
