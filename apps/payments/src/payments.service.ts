import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
     private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, 
    {
      apiVersion: '2025-05-28.basil',
    });
    // console.log('Stripe Key:', this.configService.get('STRIPE_SECRET_KEY'));

  }

  async createCharge({amount}: CreateChargeDto){

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

    return paymentIntent;
   }
}
