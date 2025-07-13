import { Inject, Injectable } from '@nestjs/common'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'
import { ReservationsRepository } from './reservations.repository'
import { ClientProxy } from '@nestjs/microservices'
import { PAYMENT_SERVICE, UserDto } from '@app/common'
import { map } from 'rxjs'

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: ClientProxy,
  ) {}

 async create(createReservationDto: CreateReservationDto , {email , _id:userId}: UserDto) {
    return this.paymentService
    .send('create_charge' , {
      ...createReservationDto.charge, 
     email,
    })
    .pipe(
      map((res) => {
        return this.reservationsRepository.create({
      ...createReservationDto,
      invoiceId: res.id,
      timestamp: new Date(),
      userId,
        });
      }),
    );
  }
  findAll() {
    return this.reservationsRepository.find({})
  }
  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id })
  }
  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    )
  }
  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id })
  }
}
