import { Injectable, InternalServerErrorException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';

@Injectable()
export class PdfService {
  async generateInvoice(user: User, factura: Factura): Promise<string> {
    try {
      const doc = new PDFDocument();
      const baseDir = process.cwd();
      const directory = path.join(
        baseDir,
        'src',
        'modules',
        'facturacion',
        'invoices',
      );
      const filePath = path.join(directory, `factura_${factura.id}.pdf`);

      // Crear el directorio si no existe
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      return new Promise((resolve, reject) => {
        const stream = createWriteStream(filePath);
        doc.pipe(stream);

        // Título
        doc
          .fontSize(25)
          .font('Helvetica-Bold')
          .text('UltraNet', { align: 'center' });
        doc
          .fontSize(20)
          .font('Helvetica')
          .text(`Pre-factura: ${factura.observaciones}`, { align: 'center' });

        // Datos del Usuario
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`Nombre: ${user.nombre}`, 100, 150)
          .text(`Dirección: ${user.direccion}`, 100, 170)
          .text(`Teléfono: ${user.telefono}`, 100, 190)
          .text(`Servicio: ${factura.concepto}`, 100, 210);

        // Importe
        doc
          .fontSize(15)
          .fillColor('red')
          .text(`Importe: $ ${factura.importe}`, 100, 250);

        // Añadir una Imagen (opcional)
        // doc.image('path/to/image.png', {
        //   fit: [100, 100],
        //   align: 'right',
        //   valign: 'center'
        // });

        // Dibujar una Línea
        doc.moveTo(100, 300).lineTo(500, 300).stroke();

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stream.on('error', (err) => {
          reject(new InternalServerErrorException('Error generating PDF'));
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Error generating PDF');
    }
  }
}
