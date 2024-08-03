import {
  Controller,
  Get,
  Param,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { UsersService } from '../users/users.service';
import { FacturacionService } from '../facturacion/facturacion.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly usersService: UsersService,
    private readonly facturacionService: FacturacionService,
  ) {}

  @Get(':id')
  async getFactura(@Param('id') id: string, @Res() res: Response) {
    try {
      const factura = await this.facturacionService.findOne(id);
      if (!factura) {
        return res.status(404).send('Factura not found');
      }
      const user = await this.usersService.getUserById(factura.user.id);

      const filePath = await this.pdfService.generateInvoice(user, factura);

      return res.download(filePath, `factura_${factura.id}.pdf`);
    } catch (error) {
      console.error('Error handling request:', error);
      throw new InternalServerErrorException('Error handling request');
    }
  }
}