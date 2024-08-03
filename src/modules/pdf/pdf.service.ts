import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';

@Injectable()
export class PdfService {
  async generateInvoice(user: User, factura: Factura): Promise<string> {
    try {
      const doc = new PDFDocument();
      const baseDir = process.cwd(); // Con esto obtengo el directorio base de la aplicación
      const directory = path.join(
        baseDir,
        'src',
        'modules',
        'facturacion',
        'invoices',
      );
      // Extraer mes y año de las observaciones
      const [mes, año] = factura.observaciones.split(' ');

      // Construir el nombre del archivo
      const filePath = path.join(
        directory,
        `factura_${user.email}_${mes}_${año}.pdf`,
      );

      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      // Crear un archivo PDF con los datos de la factura pero como promesa
      // para asegurarnos de que el archivo PDF se haya escrito completamente antes de resolver la promesa.
      return new Promise((resolve, reject) => {
        const stream = createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(25).text('Factura', {
          align: 'center',
        });

        doc.fontSize(12).text(`Nombre: ${user.nombre}`);
        doc.text(`Dirección: ${user.direccion}`);
        doc.text(`Teléfono: ${user.telefono}`);
        doc.text(`Importe: ${factura.importe}`);

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', (err) => {
          reject(new InternalServerErrorException('Error al generar el PDF'));
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Error generating PDF');
    }
  }
}
