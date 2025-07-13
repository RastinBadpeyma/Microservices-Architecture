import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
     private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
   ){
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, 
    {
      apiVersion: '2025-05-28.basil',
    });
    // console.log('Stripe Key:', this.configService.get('STRIPE_SECRET_KEY'));

  }

  async createCharge({amount, email}: PaymentsCreateChargeDto){

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
       automatic_payment_methods: {
         enabled: true,
         allow_redirects: 'never',
        },
    });

    this.notificationsService.emit('notify_email' , { email});

    return paymentIntent;
   }
}
