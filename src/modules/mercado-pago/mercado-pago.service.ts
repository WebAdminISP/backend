import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mercadoPagoClient from './mercado-pago.config';
import { Payment, Preference } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';

@Injectable()
export class MercadoPagoService {
  private readonly preference: Preference;
  private readonly payment: Payment;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Factura) private facturaRepository: Repository<Factura>,
  ) {
    this.preference = new Preference(mercadoPagoClient);
    this.payment = new Payment(mercadoPagoClient);
  }

  async createPreference(invoiceId: string, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const [nombre, apellido] = user.nombre.split(' ');

    const factura = await this.facturaRepository.findOne({
      where: { id: invoiceId },
    });

    if (!factura) {
      throw new NotFoundException('Factura no encontrada');
    }
    if (factura.pagado === true) {
      throw new BadRequestException(
        `La factura con id: ${factura.id}, ya está cancelada`,
      );
    }

    const body = {
      items: [
        {
          id: factura.id,
          title: 'Servicio de Internet',
          description: `Mes: ${factura.observaciones}`,
          picture_url: 'http://www.myapp.com/myimage.jpg',
          category_id: 'Servicio de Internet',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: factura.importe,
        },
      ],
      marketplace_fee: 0,
      payer: {
        name: nombre,
        surname: apellido,
        email: user.email,
        phone: {
          area_code: '11',
          number: user.telefono,
        },
        identification: {
          type: 'DNI',
          number: user.documento.toString(),
        },
        address: {
          zip_code: user.codigoPostal,
          street_name: user.direccion,
          street_number: user.direccion,
        },
      },
      back_urls: {
        success: 'https://e80f-45-167-120-30.ngrok-free.app/',
        failure: 'https://e80f-45-167-120-30.ngrok-free.app/api',
        pending:
          'https://e80f-45-167-120-30.ngrok-free.app/mercado-pago/notification',
      },
      differential_pricing: {
        id: 1,
      },
      expires: false,
      additional_info: 'Discount: 12.00',
      auto_return: 'all',
      binary_mode: true,
      external_reference: '1643827245',
      marketplace: 'marketplace',
      notification_url:
        'https://e80f-45-167-120-30.ngrok-free.app/mercado-pago/notification',
      operation_type: 'regular_payment',
      payment_methods: {
        default_payment_method_id: 'master',
        excluded_payment_types: [
          {
            id: 'ticket',
          },
        ],
        excluded_payment_methods: [
          {
            id: '',
          },
        ],
        installments: 5,
        default_installments: 1,
      },
      shipments: {
        mode: 'custom',
        local_pickup: false,
        default_shipping_method: null,
        free_methods: [
          {
            id: 1,
          },
        ],
        cost: 10,
        free_shipping: false,
        dimensions: '10x10x20,500',
        receiver_address: {
          zip_code: '06000000',
          street_number: 123,
          street_name: 'Street',
          floor: '12',
          apartment: '120A',
        },
      },
      statement_descriptor: 'Test Store', //? Descripción con la que aparecerá el pago en el resumen de tarjeta (ej. MERCADOPAGO)
    };

    // const amount = factura.importe;
    try {
      const response = await this.preference.create({ body });
      // return { preference: response, amount: amount };
      return response;
    } catch (error) {
      console.error('Error creating preference:', error);
      throw error;
    }
  }

  async createPayment(paymentData: any): Promise<any> {
    console.log('Lo llega desde el front para hacer el pago:', paymentData);

    const body = {
      transaction_amount: paymentData.transaction_amount,
      description: paymentData.description || 'No description provided',
      payment_method_id: paymentData.payment_method_id,
      payer: {
        email: paymentData.payer.email,
        identification: paymentData.payer.identification,
      },
      token: paymentData.token,
      installments: paymentData.installments || 1,
      issuer_id: paymentData.issuer_id || null, //? Agregar este campo si es necesario
    };

    console.log('Lo que envia el back para hacer el pago:', body);
    try {
      const response = await this.payment.create({ body });
      return response;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async processPaymentNotification(notificationData: any) {
    const { data, action } = notificationData;

    if (action === 'payment.created') {
      const { id } = data;

      try {
        const paymentDetails = await this.payment.get({ id });

        // console.log(paymentDetails);

        if (paymentDetails.status === 'approved') {
          console.log(
            'Si entro acá es porque esta aprobado:',
            paymentDetails.status,
          );
          // await this.updateFacturaStatus(id, true); // Marcar la factura como pagada
        } else {
          console.log(`Payment status is ${paymentDetails.status_detail}`);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        throw new BadRequestException('Error processing payment notification');
      }
    } else {
      throw new BadRequestException('Invalid notification action');
    }
  }

  // private async updateFacturaStatus(paymentId: string, status: boolean) {
  //   // Implementa la lógica para actualizar el estado de la factura en la base de datos
  //   const factura = await this.facturaRepository.findOne({ where: { paymentId } });
  //   if (factura) {
  //     factura.pagado = status;
  //     await this.facturaRepository.save(factura);
  //   } else {
  //     throw new NotFoundException('Factura no encontrada');
  //   }
  // }
}
