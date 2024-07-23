import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocalidadesService } from './localidades.service';
import { CreateLocalidadeDto } from './dto/create-localidade.dto';
import { UpdateLocalidadeDto } from './dto/update-localidade.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Localidades')
@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Post()
  create(@Body() createLocalidadeDto: CreateLocalidadeDto) {
    return this.localidadesService.create(createLocalidadeDto);
  }

  @Get()
  findAll() {
    return this.localidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localidadesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocalidadeDto: UpdateLocalidadeDto,
  ) {
    return this.localidadesService.update(+id, updateLocalidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localidadesService.remove(+id);
  }
}
