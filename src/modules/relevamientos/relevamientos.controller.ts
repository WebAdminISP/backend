import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RelevamientosService } from './relevamientos.service';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import { UpdateRelevamientoDto } from './dto/update-relevamiento.dto';

@Controller('relevamientos')
export class RelevamientosController {
  constructor(private readonly relevamientosService: RelevamientosService) {
    {
      console.log('RelevamientosController instantiated');
    }
  }

  @Post()
  create(@Body() createRelevamientoDto: CreateRelevamientoDto) {
    return this.relevamientosService.create(createRelevamientoDto);
  }

  @Get()
  findAll() {
    return this.relevamientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relevamientosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRelevamientoDto: UpdateRelevamientoDto,
  ) {
    return this.relevamientosService.update(+id, updateRelevamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relevamientosService.remove(+id);
  }
}
