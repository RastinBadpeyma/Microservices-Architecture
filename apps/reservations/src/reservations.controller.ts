import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common'

@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto , 
  @CurrentUser() user:UserDto  
) {
    return this.reservationsService.create(createReservationDto , user);
    
   
  }

   @Get()
  async findAll() {
    return this.reservationsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto)
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id)
  }
}
